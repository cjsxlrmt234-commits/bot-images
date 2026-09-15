// server.js — 카카오톡 챗봇 스킬 서버
const path = require('path');
const express = require('express');
const { startGame, processTurn } = require('./game');
const { buildResponse, parseSkillRequest } = require('./kakao');
const { getSession, saveSession } = require('./db');

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getImageUrl(req, category, customImageUrl) {
  if (!customImageUrl || typeof customImageUrl !== 'string') return null;
  if (/^https?:\/\//i.test(customImageUrl)) return customImageUrl;
  return `${req.protocol}://${req.get('host')}/${customImageUrl.replace(/^\/+/, '')}`;
}

function safeErrorDetails(err) {
  let details = String(err && err.stack ? err.stack : err && err.message ? err.message : err);
  const uri = process.env.MONGODB_URI;
  if (uri) details = details.split(uri).join('[DB 접속 주소 숨김]');
  details = details.replace(/mongodb(?:\+srv)?:\/\/[^\s'"<>]+/gi, '[DB 접속 주소 숨김]');
  details = details.replace(/((?:password|passwd|pwd)\s*[:=]\s*)[^\s,;]+/gi, '$1[숨김]');
  return details.slice(0, 3000);
}

const RESTART_WORDS = ['다시하기', '재시작', '시작', '게임시작', '시작하기'];

app.post('/skill', async (req, res) => {
  let stage = '카카오 요청 해석';
  try {
    const parsed = parseSkillRequest(req.body);
    const userId = parsed && parsed.userId;
    const utterance = parsed && typeof parsed.utterance === 'string' ? parsed.utterance.trim() : '';
    if (typeof userId !== 'string' || !userId.trim()) {
      return res.json(buildResponse('사용자 식별 정보를 확인할 수 없습니다. 카카오톡 채널에서 다시 입력해 주세요.', []));
    }

    stage = 'MongoDB 조회';
    let state = await getSession(userId);
    if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
    state.userId = userId;
    state.profile = { ...(state.profile || {}), userId };

    stage = '게임 명령 처리';
    let result;
    if (!utterance || RESTART_WORDS.includes(utterance)) {
      // startGame은 전체 state가 아닌 profile을 받는다.
      // 진행 중 파밍이 있다면 최신 battle도 함께 보존한다.
      if (state.battle && state.battle.mode === '파밍' && state.battle.alive && !state.battle.finished) {
        const backup = state.profile.activeFarmBattle;
        const currentVersion = Number(state.battle.progressVersion ?? state.battle.turn ?? 0);
        const backupVersion = backup ? Number(backup.progressVersion ?? backup.turn ?? 0) : -1;
        if (!backup || currentVersion >= backupVersion) state.profile.activeFarmBattle = state.battle;
      }
      result = startGame(state.profile);
    } else {
      // 신규 사용자도 /id, /출석 등 최초 입력한 명령을 바로 처리한다.
      result = processTurn(state, utterance, { userId });
    }

    if (!result || !result.state || !result.state.profile) {
      throw new Error('게임 처리 결과에 저장할 상태가 없습니다.');
    }
    const nextState = result.state;
    nextState.userId = userId;
    nextState.profile.userId = userId;
    stage = 'MongoDB 저장';
    await saveSession(userId, nextState);
    stage = '카카오 응답 생성';
    return res.json(buildResponse(result.text, result.choices, getImageUrl(req, result.category, result.imageUrl)));
  } catch (err) {
    console.error('[스킬 처리 실패] 단계=' + stage + '\n' + safeErrorDetails(err));
    // 응답 생성 함수 자체가 실패해도 최소 오류 응답은 반환한다.
    return res.json({ version: '2.0', template: { outputs: [
      { simpleText: { text: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' } }
    ] } });
  }
});

app.get('/', (req, res) => {
  res.send('battlegrounds-kakao-bot skill server is running');
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  if (!process.env.MONGODB_URI) console.error('[설정 확인] MONGODB_URI가 없습니다. 서버 환경변수에 MongoDB 접속 주소를 등록해야 게임 데이터를 조회·저장할 수 있습니다.');
  app.listen(PORT, () => console.log(`Skill server listening on port ${PORT}`));
}
module.exports = app;

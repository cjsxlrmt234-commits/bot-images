// server.js — 카카오톡 챗봇 스킬 서버
const path = require('path');
const express = require('express');
const { startGame, processTurn, isGameAdmin, requiresGameAdmin, parseAdminGrant, getRaidAttackPower, buildRaidText, formatRanking, formatRaidReward, RAID_IMAGE } = require('./game');
const { buildResponse, parseSkillRequest } = require('./kakao');
const { getSession, saveSession, grantAdminResource, getPowerRanking, getSharedRaid, attackSharedRaid } = require('./db');

const app = express();
app.set('trust proxy', true);
// 본문이나 UID는 로그에 남기지 않는다. /skill 이외 경로도 수신 여부 확인.
let requestSequence = 0;
app.use((req, res, next) => {
  req.traceId = ++requestSequence;
  const started = Date.now();
  console.log('[요청 도착] #' + req.traceId + ' ' + req.method + ' ' + req.path);
  res.on('finish', () => console.log('[응답 완료] #' + req.traceId + ' status=' + res.statusCode + ' elapsed=' + (Date.now()-started) + 'ms'));
  res.on('close', () => { if (!res.writableFinished) console.warn('[응답 전 연결 종료] #' + req.traceId); });
  next();
});
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
  const delayed = setTimeout(() => console.warn('[처리 지연] #' + req.traceId + ' 단계=' + stage + ' (3초 경과, 완료 여부를 확인하세요)'), 3000);
  const clearDelayed = () => clearTimeout(delayed);
  res.once('finish', clearDelayed);
  res.once('close', clearDelayed);
  try {
    const parsed = parseSkillRequest(req.body);
    const userId = parsed && parsed.userId;
    const utterance = parsed && typeof parsed.utterance === 'string' ? parsed.utterance.trim() : '';
    if (typeof userId !== 'string' || !userId.trim()) {
      return res.json(buildResponse('사용자 식별 정보를 확인할 수 없습니다. 카카오톡 채널에서 다시 입력해 주세요.', []));
    }

    // 요청 발신 UID를 기준으로 검사하며 명령에 적힌 대상 UID로 권한을 판정하지 않는다.
    if (requiresGameAdmin(utterance) && !isGameAdmin(userId)) return res.json(buildResponse('관리자만 사용할 수 있는 명령어입니다.', []));
    if (/^\/관리자(?:\s|$)/.test(utterance)) {
      const grant = parseAdminGrant(utterance);
      if (!grant) return res.json(buildResponse('사용법: /관리자 대상UID 재화 수량\n재화: 현금·금괴·보석·비밀열쇠·보급\n수량: 1 이상의 정수', []));
      stage = '관리자 재화 지급';
      const paid = await grantAdminResource(userId, grant.targetId, grant.field, grant.amount);
      return res.json(buildResponse(paid.found ? '✅ 지급 완료\n대상: ' + grant.targetId + '\n' + grant.label + ' +' + grant.amount.toLocaleString() + (grant.field === 'cash' ? '원' : '개') : '해당 UID의 게임 계정이 없습니다. UID를 확인해 주세요.', []));
    }
    if (utterance === '/랭킹') {
      stage = '공격력 랭킹 조회';
      return res.json(buildResponse(formatRanking(await getPowerRanking()), []));
    }

    stage = 'MongoDB 조회';
    let state = await getSession(userId);
    if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
    state.userId = userId;
    state.profile = { ...(state.profile || {}), userId };
    console.log('[사용자 조회 완료] #' + req.traceId);

    if (/^\/레이드(?:\s|$)/.test(utterance)) {
      const sub = utterance.replace(/^\/레이드/, '').trim();
      if (!['', '공격', '현황'].includes(sub)) return res.json(buildResponse('사용법: /레이드 · /레이드 공격 · /레이드 현황', []));
      stage = '공유 레이드';
      console.log('[레이드 처리 시작] #' + req.traceId + ' mode=' + (sub || '공격'));
      const result = sub === '현황' ? { raid: await getSharedRaid(), attacked: false } : await attackSharedRaid(userId);
      console.log('[레이드 DB 완료] #' + req.traceId);
      const rewardText = formatRaidReward(result.raid, userId);
      const raidResponse = buildResponse([buildRaidText(state.profile, result), result.cashEarned ? '💵 공격 보상 현금 +'+result.cashEarned.toLocaleString()+'원' : '', rewardText].filter(Boolean).join('\n\n'), result.raid.hp > 0 ? [
        { label: '레이드 공격', action: '/레이드 공격' }, { label: '레이드 현황', action: '/레이드 현황' }
      ] : [], null);
      console.log('[레이드 응답 구성] #' + req.traceId + ' outputs=' + raidResponse.template.outputs.map(x => Object.keys(x)[0]).join(',') + ' textLength=' + raidResponse.template.outputs[0].simpleText.text.length);
      return res.json(raidResponse);
    }

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
      console.log('[게임 명령 진입] #' + req.traceId);
      result = processTurn(state, utterance, { userId });
    }

    if (!result || !result.state || !result.state.profile) {
      throw new Error('게임 처리 결과에 저장할 상태가 없습니다.');
    }
    const nextState = result.state;
    nextState.userId = userId;
    nextState.profile.userId = userId;
    stage = 'MongoDB 저장';
    const displayedNickname = nextState.profile.nickname;
    await saveSession(userId, nextState, { revision: state._dbRevision, exists: state._dbExists });
    if (displayedNickname && nextState.profile.nickname !== displayedNickname && typeof result.text === 'string') result.text = result.text.split(displayedNickname).join(nextState.profile.nickname);
    stage = '카카오 응답 생성';
    return res.json(buildResponse(result.text, result.choices, getImageUrl(req, result.category, result.imageUrl)));
  } catch (err) {
    if (err && err.code === 'STATE_CONFLICT') return res.json(buildResponse('다른 명령이 먼저 반영되었습니다. 이번 명령을 다시 입력해 주세요.', []));
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
  console.log('[서버 시작] 요청 진단 로그 활성화 /skill');
  app.listen(PORT, () => console.log(`Skill server listening on port ${PORT}`));
}
module.exports = app;

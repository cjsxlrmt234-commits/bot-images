// server.js
// 카카오톡 챗봇(오픈빌더) 스킬 서버

const path = require('path');
const express = require('express');
const { startGame, processTurn } = require('./game2');
const { buildResponse, parseSkillRequest } = require('./kakao');
const { getSession, saveSession } = require('./db');

const app = express();
app.set('trust proxy', true);
app.use(express.json());

// public 폴더를 정적 파일로 서빙하여 이미지가 외부(ngrok 등)로 공유되도록 설정
app.use(express.static(path.join(__dirname, 'public')));

// 이미지 URL 생성 함수 (상대 경로인 경우 ngrok 등 현재 호스트 주소와 결합)
function getImageUrl(req, category, customImageUrl) {
  if (customImageUrl) {
    if (customImageUrl.startsWith('http')) {
      return customImageUrl;
    }
    return `${req.protocol}://${req.get('host')}${customImageUrl}`;
  }
  return null;
}

const RESTART_WORDS = ['다시하기', '재시작', '시작', '게임시작', '시작하기'];

app.post('/skill', async (req, res) => {
  try {
    const { userId, utterance } = parseSkillRequest(req.body);

    let state = await getSession(userId);

    // 1. 세션이 없거나 첫 접속인 경우
    if (!state) {
      const initial = startGame();
      state = initial.state;
      await saveSession(userId, state);
      return res.json(buildResponse(initial.text, initial.choices, getImageUrl(req, initial.category, initial.imageUrl)));
    }

    // 2. 게임이 끝난 상태에서 재시작하려는 경우
    if (state.finished && RESTART_WORDS.includes(utterance)) {
      const restarted = startGame(state);
      state = restarted.state;
      await saveSession(userId, state);
      return res.json(buildResponse(restarted.text, restarted.choices, getImageUrl(req, restarted.category, restarted.imageUrl)));
    }

    // 3. 일반적인 턴 및 사냥 명령어 처리
    const result = processTurn(state, utterance);
    
    // 진행된 상태를 DB에 저장
    await saveSession(userId, state);

    // 이미지 주소 변환 후 응답 전송
    const finalImageUrl = getImageUrl(req, result.category, result.imageUrl || result.image);
    return res.json(buildResponse(result.text, result.choices, finalImageUrl));

  } catch (err) {
    console.error(err);
    return res.json(
      buildResponse('오류가 발생했습니다. 잠시 후 다시 시도해주세요.', [
        { label: '다시하기', value: '다시하기' },
      ])
    );
  }
});

app.get('/', (req, res) => {
  res.send('battlegrounds-kakao-bot skill server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Skill server listening on port ${PORT}`);
});

// server.js

// 카카오톡 챗봇(오픈빌더) 스킬 서버



const path = require('path');

const express = require('express');

const { startGame, processTurn } = require('./game');

const { buildResponse, parseSkillRequest, handleHuntCommand } = require('./kakao');

const { getSession, saveSession } = require('./db');



const app = express();

app.set('trust proxy', true);

app.use(express.json());



// 💡 1. 절대 경로 대신 'public' 폴더를 정적 파일로 서빙하도록 수정했습니다.

// 이렇게 하면 public 폴더 안에 있는 이미지가 외부 인터넷(ngrok 주소)으로 자동 공유됩니다.

app.use(express.static(path.join(__dirname, 'public')));



// 이미지 URL 생성 함수 (ngrok 주소나 외부 접속 주소를 자동으로 반영)

function getImageUrl(req, category, customImageUrl) {

  if (customImageUrl) {

    // 만약 이미 커스텀 URL이 전체 주소(http로 시작)라면 그대로 반환

    if (customImageUrl.startsWith('http')) {

      return customImageUrl;

    }

    // 상대 경로라면 현재 서버의 호스트 주소(ngrok 주소 등)와 결합

    return `${req.protocol}://${req.get('host')}${customImageUrl}`;

  }

  return null;

}



const RESTART_WORDS = ['다시하기', '재시작', '시작', '게임시작', '시작하기'];



app.post('/skill', async (req, res) => {

  try {

    const { userId, utterance } = parseSkillRequest(req.body);



    // 💡 1. 사냥 명령어 우선 처리 (게임 세션 유무와 상관없이 작동)

    const huntResponse = handleHuntCommand(utterance);

    if (huntResponse) {

      return res.json(huntResponse);

    }



    let state = await getSession(userId);



    // 2. 아예 데이터가 없거나, 첫 접속인 경우

    if (!state) {

      const { state: newState, text, choices, category, imageUrl } = startGame();

      await saveSession(userId, newState);

      return res.json(buildResponse(text, choices, getImageUrl(req, category, imageUrl)));

    }



    // 3. 게임이 끝난 상태에서 유저가 "다시하기"를 누른 경우

    if (state.finished && RESTART_WORDS.includes(utterance)) {

      const { state: newState, text, choices, category, imageUrl } = startGame(state);

      await saveSession(userId, newState);

      return res.json(buildResponse(text, choices, getImageUrl(req, category, imageUrl)));

    }



    // 4. 일반적인 진행 중 턴 처리

    const { text, choices, category, imageUrl } = processTurn(state, utterance);

    

    // 진행된 상태를 DB에 저장

    await saveSession(userId, state);



    return res.json(buildResponse(text, choices, getImageUrl(req, category, imageUrl)));

  } catch (err) {

    console.error(err);

    return res.json(

      buildResponse('오류가 발생했습니다. 잠시 후 다시 시도해주세요.', [

        { label: '다시하기' },

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

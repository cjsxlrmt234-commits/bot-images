const express = require('express');
const mongoose = require('mongoose');
const Session = require('./models/Session');
const { startGame, processTurn } = require('./game');
const { buildResponse, parseSkillRequest } = require('./kakao');

const app = express();
app.use(express.json());

const MONGO_URI = 'mongodb+srv://cjsxlrmt234_db_user:cjswls33@cluster0.lysc1oi.mongodb.net/?appName=Cluster0';
const RESTART_WORDS = ['시작', '게임시작', '시작하기', '다시하기', '재시작'];

app.post('/skill', async (req, res) => {
  try {
    const { userId, utterance } = parseSkillRequest(req.body);

    let session = await Session.findOne({ userId });

    if (!session || RESTART_WORDS.includes(utterance)) {
      const { state: newState, text, choices } = startGame();

      await Session.findOneAndUpdate(
        { userId },
        { state: newState, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      return res.json(buildResponse(text, choices));
    }

    const { text, choices, state: nextState } = processTurn(session.state, utterance);

    await Session.findOneAndUpdate(
      { userId },
      { state: nextState, updatedAt: new Date() }
    );

    return res.json(buildResponse(text, choices));
  } catch (err) {
    console.error(err);
    return res.json(
      buildResponse('오류가 발생했습니다. "다시하기"라고 입력해 새 게임을 시작해주세요.', [
        { label: '다시하기' },
      ])
    );
  }
});

app.get('/', (req, res) => {
  res.send('battlegrounds-kakao-bot skill server is running');
});

const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB 연결 성공!');
    app.listen(PORT, () => {
      console.log(`Skill server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
  });
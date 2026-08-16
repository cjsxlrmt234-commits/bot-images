// db.js
// MongoDB에 게임 진행 상태를 저장/조회한다.
// 몽고디비 연결 주소가 직접 설정되어 있어 별도의 환경변수 없이도 바로 작동합니다.

const { MongoClient } = require('mongodb');

let clientPromise = null;
let collectionPromise = null;

function getCollection() {
  if (collectionPromise) return collectionPromise;

  // 몽고디비 접속 주소 직접 지정
  const uri = "mongodb+srv://cjsxlrmt234_db_user:cjswls33@cluster0.lysc1oi.mongodb.net/?appName=Cluster0";
  
  if (!uri) {
    throw new Error(
      'MONGODB_URI가 설정되지 않았습니다.'
    );
  }

  const dbName = process.env.MONGODB_DB || 'battlegrounds_bot';

  // 연결이 안 될 때 카카오의 응답 제한 시간보다 먼저 실패하도록 타임아웃을 짧게 둔다.
  clientPromise =
    clientPromise ||
    new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    }).connect();

  collectionPromise = clientPromise
    .then((client) => {
      console.log('MongoDB 연결 성공');
      return client.db(dbName).collection('sessions');
    })
    .catch((err) => {
      // 연결 실패 시 캐시를 비워서, 다음 요청이 오면 재연결을 다시 시도하게 한다
      clientPromise = null;
      collectionPromise = null;
      throw err;
    });

  return collectionPromise;
}

// 유저의 저장된 게임 상태를 가져온다. 없으면 null.
async function getSession(userId) {
  const col = await getCollection();
  const doc = await col.findOne({ _id: userId });
  return doc ? doc.state : null;
}

// 유저의 게임 상태를 저장(있으면 갱신, 없으면 새로 생성)한다.
async function saveSession(userId, state) {
  const col = await getCollection();
  await col.updateOne(
    { _id: userId },
    { $set: { state, updatedAt: new Date() } },
    { upsert: true }
  );
}

module.exports = { getSession, saveSession };
// db.js — MongoDB 게임 상태 저장/조회
// 서버 환경변수 MONGODB_URI에 MongoDB 접속 주소를 설정하세요.
const { MongoClient } = require('mongodb');

let clientPromise = null;
let collectionPromise = null;

function getCollection() {
  if (collectionPromise) return collectionPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI가 설정되지 않았습니다. 서버 환경변수에 MongoDB 접속 주소를 등록해 주세요.');
  const dbName = process.env.MONGODB_DB || 'battlegrounds_bot';
  clientPromise = clientPromise || new MongoClient(uri, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  }).connect();

  collectionPromise = clientPromise.then(client => {
    return client.db(dbName).collection('sessions');
  }).catch(err => {
    clientPromise = null;
    collectionPromise = null;
    throw err;
  });
  return collectionPromise;
}

function validateUserId(userId) {
  // UID는 서버가 확인한 카카오 사용자 식별자를 전달해야 합니다.
  // 조회 키가 바뀌지 않도록 임의 변환하거나 새 ID를 만들지 않습니다.
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error('유효한 문자열 사용자 ID가 필요합니다.');
  }
  return userId;
}

function withUserId(state, userId) {
  const saved = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  const profile = saved.profile && typeof saved.profile === 'object' && !Array.isArray(saved.profile)
    ? saved.profile : {};
  return { ...saved, userId, profile: { ...profile, userId } };
}

async function getSession(userId) {
  validateUserId(userId);
  const col = await getCollection();
  const doc = await col.findOne({ _id: userId });
  // 신규 사용자도 ID를 전달합니다. 레벨·재화 등 기본값은 game.js가 생성합니다.
  // 반환값은 기존의 null 대신 ID가 포함된 상태 객체입니다.
  return withUserId(doc ? doc.state : null, userId);
}

async function saveSession(userId, state) {
  validateUserId(userId);
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new Error('저장할 게임 상태가 올바르지 않습니다.');
  }
  const col = await getCollection();
  await col.updateOne(
    { _id: userId },
    { $set: { state: withUserId(state, userId), updatedAt: new Date() } },
    { upsert: true }
  );
}

module.exports = { getSession, saveSession };

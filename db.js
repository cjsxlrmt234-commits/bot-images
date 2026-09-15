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
  await ensureNicknames();
  validateUserId(userId);
  const col = await getCollection();
  const doc = await col.findOne({ _id: userId });
  // 신규 사용자도 ID를 전달합니다. 레벨·재화 등 기본값은 game.js가 생성합니다.
  // 반환값은 기존의 null 대신 ID가 포함된 상태 객체입니다.
  return { ...withUserId(doc ? doc.state : null, userId), _dbRevision: doc && Number.isSafeInteger(doc.revision) ? doc.revision : 0, _dbExists: !!doc };
}

async function saveSession(userId, state, expected = { revision: state && state._dbRevision, exists: state && state._dbExists }) {
  validateUserId(userId);
  if (!state || !state.profile || !Number.isSafeInteger(expected.revision) || typeof expected.exists !== 'boolean') throw new Error('게임 저장 버전이 없습니다. 서버 파일을 함께 교체해 주세요.');
  const col = await getCollection();
  await ensureNicknames();
  const stored = withUserId(state, userId);
  stored.profile.nickname = await reserveNickname(userId, stored.profile.nickname || createProfile({}).nickname);
  delete stored._dbRevision; delete stored._dbExists;
  const conflict = () => { const err = new Error('다른 요청이 먼저 저장되었습니다. 다시 시도해 주세요.'); err.code = 'STATE_CONFLICT'; return err; };
  if (!expected.exists) {
    try { await col.insertOne({ _id: userId, state: stored, revision: 1, updatedAt: new Date() }); }
    catch (err) { if (err.code === 11000) throw conflict(); throw err; }
  } else {
    const filter = expected.revision === 0 ? { _id: userId, $or: [{ revision: 0 }, { revision: { $exists: false } }] } : { _id: userId, revision: expected.revision };
    const result = await col.updateOne(filter, { $set: { state: stored, revision: expected.revision + 1, updatedAt: new Date() } });
    if (result.matchedCount !== 1) throw conflict();
  }
  state.profile.nickname = stored.profile.nickname;
}

// 공격·처치·참여자 보상은 한 트랜잭션으로 확정한다 (MongoDB Atlas).
const { createProfile, getRaidAttackPower, isGameAdmin, ADMIN_RESOURCES } = require('./game');
const RAID_ID = 'world-boss-rewards-v1';
const RAID_HP = 100000000;
const RAID_REWARDS = Object.freeze({ cash: 10000000, gold: 1000, gem: 1000, keys: 100 });

async function database() {
  await getCollection();
  return (await clientPromise).db(process.env.MONGODB_DB || 'battlegrounds_bot');
}
async function transaction(callback) {
  const db = await database();
  const session = (await clientPromise).startSession();
  try {
    return await session.withTransaction(() => callback(db, session), {
      readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }, readPreference: 'primary'
    });
  } finally { await session.endSession(); }
}
function resourceBalance(value) {
  const n = Number(value == null ? 0 : value);
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('재화 저장값이 올바르지 않습니다.');
  return n;
}
function addResources(profile, amounts) {
  for (const [field, amount] of Object.entries(amounts)) {
    const next = resourceBalance(profile[field]) + amount;
    if (!Number.isSafeInteger(next) || next < 0) throw new Error('재화 최대 저장 범위를 초과합니다.');
    profile[field] = next;
  }
}
async function grantAdminResource(actorId, targetId, field, amount) {
  if (!isGameAdmin(actorId)) throw new Error('관리자만 사용할 수 있습니다.');
  validateUserId(targetId);
  if (!Object.values(ADMIN_RESOURCES).includes(field) || !Number.isSafeInteger(amount) || amount <= 0) throw new Error('지급 형식이 올바르지 않습니다.');
  return transaction(async (db, session) => {
    const users = db.collection('sessions');
    const doc = await users.findOne({ _id: targetId }, { session });
    if (!doc) return { found: false };
    const state = withUserId(doc.state, targetId);
    addResources(state.profile, { [field]: amount });
    await users.updateOne({ _id: targetId }, { $set: { state, updatedAt: new Date() }, $inc: { revision: 1 } }, { session });
    await db.collection('admin_grants').insertOne({ actorId, targetId, field, amount, createdAt: new Date() }, { session });
    return { found: true, balance: state.profile[field] };
  });
}
async function getPowerRanking() {
  await ensureNicknames();
  const users = await getCollection();
  const top = [];
  for await (const doc of users.find({}, { projection: { _id: 1, 'state.profile': 1 } })) {
    if (!doc.state || !doc.state.profile || typeof doc._id !== 'string') continue;
    const profile = createProfile({ ...doc.state.profile, nickname: doc.state.profile.nickname || '이름 없는 유저' });
    const power = getRaidAttackPower(profile);
    top.push({ id: doc._id, nickname: profile.nickname, power });
    top.sort((a, b) => b.power - a.power || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    if (top.length > 5) top.pop();
  }
  return top;
}
async function ensureRaid(db) {
  try {
    await db.collection('raids').updateOne({ _id: RAID_ID }, { $setOnInsert: {
      hp: RAID_HP, maxHp: RAID_HP, attackCount: 0, participants: [], rewards: [], createdAt: new Date()
    } }, { upsert: true });
  } catch (err) { if (!err || err.code !== 11000) throw err; }
}
async function getSharedRaid() {
  const db = await database(); await ensureRaid(db);
  return db.collection('raids').findOne({ _id: RAID_ID });
}
function distributeRaidRewards(participants) {
  const rows = participants.filter(p => Number.isSafeInteger(p.damage) && p.damage > 0)
    .map(p => ({ userId: p.userId, damage: p.damage, cash: 0, gold: 0, gem: 0, keys: 0 }));
  const total = rows.reduce((n, r) => n + BigInt(r.damage), 0n);
  if (!total) return rows;
  for (const [field, amount] of Object.entries(RAID_REWARDS)) {
    const remainders = rows.map(row => {
      const product = BigInt(amount) * BigInt(row.damage);
      row[field] = Number(product / total);
      return { row, remainder: product % total };
    });
    remainders.sort((a,b) => a.remainder === b.remainder ? (a.row.userId < b.row.userId ? -1 : 1) : a.remainder > b.remainder ? -1 : 1);
    const extra = amount - rows.reduce((n,r) => n + r[field], 0);
    for (let i=0;i<extra;i++) remainders[i].row[field]++;
  }
  return rows;
}
async function attackSharedRaid(userId) {
  validateUserId(userId);
  await ensureNicknames();
  const existingUser = await (await getCollection()).findOne({_id:userId});
  const fallbackNickname = existingUser && existingUser.state && existingUser.state.profile && existingUser.state.profile.nickname || await reserveNickname(userId, createProfile({}).nickname);
  const db = await database(); await ensureRaid(db);
  return transaction(async (db, session) => {
    const raids = db.collection('raids'), users = db.collection('sessions');
    const raid = await raids.findOne({ _id: RAID_ID }, { session });
    if (raid.hp <= 0) return { raid, attacked: false, damage: 0 };
    const doc = await users.findOne({ _id: userId }, { session });
    const profile = createProfile(doc && doc.state ? doc.state.profile : { userId, nickname: fallbackNickname });
    const attackPower = getRaidAttackPower(profile);
    if (attackPower <= 0) return { raid, attacked: false, damage: 0, attackPower };
    if (!doc) await users.insertOne({ _id: userId, state: withUserId({ profile }, userId), revision: 0, updatedAt: new Date() }, { session });
    const attackerState = withUserId(doc ? doc.state : {profile}, userId);
    addResources(attackerState.profile, {cash: attackPower});
    await users.updateOne({_id:userId}, {$set:{state:attackerState,updatedAt:new Date()},$inc:{revision:1}}, {session});
    const damage = Math.min(raid.hp, attackPower);
    const participant = raid.participants.find(p => p.userId === userId);
    if (participant) participant.damage += damage;
    else raid.participants.push({ userId, damage });
    raid.hp -= damage; raid.attackCount++; raid.updatedAt = new Date();
    if (raid.hp === 0) {
      raid.rewards = distributeRaidRewards(raid.participants);
      for (const reward of raid.rewards) {
        const player = await users.findOne({ _id: reward.userId }, { session });
        if (!player) throw new Error('레이드 참여자의 저장 데이터가 없습니다.');
        const state = withUserId(player.state, reward.userId);
        addResources(state.profile, { cash: reward.cash, gold: reward.gold, gem: reward.gem, keys: reward.keys });
        await users.updateOne({ _id: reward.userId }, { $set: { state, updatedAt: new Date() }, $inc: { revision: 1 } }, { session });
      }
      raid.defeatedAt = new Date(); raid.rewardPaid = true;
    }
    await raids.replaceOne({ _id: RAID_ID }, raid, { session });
    return { raid, attacked: true, damage, attackPower, cashEarned: attackPower, defeated: raid.hp === 0 };
  });
}

module.exports = { getSession, saveSession, grantAdminResource, getPowerRanking, getSharedRaid, attackSharedRaid };

// Names are claimed in MongoDB by a unique _id. Claims are never released, so a
// concurrent reset/save cannot let a second account take the same nickname.
let nicknameMigrationPromise = null;
function nicknameBase(value) { return String(value || '모험가').normalize('NFKC').trim().slice(0,60) || '모험가'; }
async function claimNickname(db, session, userId, preferred) {
  const claims=db.collection('nickname_claims');
  const base=nicknameBase(preferred);
  for(let n=0;n<10000;n++) {
    const name=n===0 ? base : base+'_'+userId.slice(0,8)+'_'+n;
    const key=name.toLocaleLowerCase('en-US');
    const claim=await claims.findOne({_id:key},{session});
    if(claim && claim.userId===userId) return claim.nickname;
    if(claim) continue;
    await claims.insertOne({_id:key,userId,nickname:name},{session}); return name;
  }
  throw new Error('사용 가능한 닉네임을 생성하지 못했습니다.');
}
async function nicknameTransaction(callback) {
  for(let n=0;n<10;n++) {
    try{return await transaction(callback);}catch(err){if(err.code!==11000 || n===9)throw err;}
  }
}
async function reserveNickname(userId, preferred) {
  return nicknameTransaction((db,session)=>claimNickname(db,session,userId,preferred));
}
async function ensureNicknames() {
  if(!nicknameMigrationPromise) nicknameMigrationPromise=(async()=>{
    const users=await getCollection();
    for await(const item of users.find({}, {projection:{_id:1}})) {
      if(typeof item._id!=='string')continue;
      await nicknameTransaction(async(db,session)=>{
        const col=db.collection('sessions');const doc=await col.findOne({_id:item._id},{session});
        if(!doc || !doc.state || !doc.state.profile)return;
        const name=await claimNickname(db,session,doc._id,doc.state.profile.nickname || createProfile({}).nickname);
        if(doc.state.profile.nickname!==name) {
          const state=withUserId(doc.state,doc._id);state.profile.nickname=name;
          await col.updateOne({_id:doc._id},{$set:{state,updatedAt:new Date()},$inc:{revision:1}},{session});
        }
      });
    }
  })().catch(err=>{nicknameMigrationPromise=null;throw err;});
  return nicknameMigrationPromise;
}

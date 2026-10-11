const DB_RELEASE_CONTRACT='20261007-ops-v2';
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
  const normalized={ ...profile, userId };
  normalizeEquippedCosmetics(normalized);
  normalizeBoxInventory(normalized);
  guardResources(normalized);
  return { ...saved, userId, profile: normalized };
}

async function getSession(userId) {
  validateUserId(userId);
  await ensureUserNickname(userId);
  const col = await getCollection();
  const doc = await col.findOne({ _id: userId });
  // 신규 사용자도 ID를 전달합니다. 레벨·재화 등 기본값은 game.js가 생성합니다.
  // 반환값은 기존의 null 대신 ID가 포함된 상태 객체입니다.
  return { ...withUserId(doc ? doc.state : null, userId), _dbRevision: doc && Number.isSafeInteger(doc.revision) ? doc.revision : 0, _dbExists: !!doc, _combatReadyAt: doc && doc.combatReadyAt || 0 };
}

async function saveSession(userId, state, expected = { revision: state && state._dbRevision, exists: state && state._dbExists }) {
  validateUserId(userId);
  if (!state || !state.profile || !Number.isSafeInteger(expected.revision) || typeof expected.exists !== 'boolean') throw new Error('게임 저장 버전이 없습니다. 서버 파일을 함께 교체해 주세요.');
  const stored = withUserId(state, userId);
  stored.profile.nickname = await reserveNickname(userId, stored.profile.nickname || createProfile({}).nickname);
  delete stored._dbRevision; delete stored._dbExists; delete stored._combatReadyAt;
  const conflict = () => { const err = new Error('다른 요청이 먼저 저장되었습니다. 다시 시도해 주세요.'); err.code = 'STATE_CONFLICT'; return err; };
  return businessTransaction(async(db,session)=>{
  const col=db.collection('sessions');
  await assertNoBulkJob(db,session,userId);
  if (!expected.exists) {
    try { await col.insertOne({ _id: userId, state: stored, ...playerIndex(userId,stored), revision: 1, updatedAt: new Date() }, {session}); }
    catch (err) { if (err.code === 11000) throw conflict(); throw err; }
  } else {
    const filter = expected.revision === 0 ? { _id: userId, $or: [{ revision: 0 }, { revision: { $exists: false } }] } : { _id: userId, revision: expected.revision };
    const result = await col.updateOne(filter, { $set: { state: stored, ...playerIndex(userId,stored), revision: expected.revision + 1, updatedAt: new Date() } }, {session});
    if (result.matchedCount !== 1) throw conflict();
  }
  state.profile.nickname = stored.profile.nickname;
  });
}

// 공격·처치·지급 계획을 원자적으로 확정하고 참여자 보상은 별도 작업으로 지급한다.
const { RELEASE_CONTRACT, validateResources, guardResources, changeResources, normalizeBoxInventory, countBoxes, processBoxBatch, normalizeEquippedCosmetics, raidEncounterChance, consumeSkillUse, getSecondJobCode, checkAndResetSeasonPass, createProfile, getRaidAttackPower, getCurrentEnhanceLevel, getWeaponInfo, resolveRaidAttack, addRaidBox, isGameAdmin, ADMIN_RESOURCES } = require('./game');
if(RELEASE_CONTRACT!==DB_RELEASE_CONTRACT)throw Error('game.js와 db.js 버전이 다릅니다. 함께 교체하세요.');
const RANK_FORMULA_VERSION=require('crypto').createHash('sha256').update(require('fs').readFileSync(require('path').join(__dirname,'game.js'))).digest('hex');
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
    return await session.withTransaction(async() => {const lease=workerContext.getStore();if(lease){const row=await db.collection('worker_locks').findOne({_id:lease.id,owner:lease.owner},{session});if(!row||row.until<new Date())throw Object.assign(Error('작업 점유 만료'),{code:'LEASE_LOST'});await db.collection('worker_locks').updateOne({_id:lease.id,owner:lease.owner},{$set:{until:new Date(Date.now()+60000)}},{session});}return callback(db,session);}, {
      readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }, readPreference: 'primary'
    });
  } finally { await session.endSession(); }
}
function resourceBalance(value) {
  const n = Number(value == null ? 0 : value);
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('재화 저장값이 올바르지 않습니다.');
  return n;
}
function addResources(profile, amounts) {changeResources(profile,amounts);}
async function grantAdminResource(actorId, targetId, field, amount) {
  if (!isGameAdmin(actorId)) throw new Error('관리자만 사용할 수 있습니다.');
  validateUserId(targetId);
  if (!Object.values(ADMIN_RESOURCES).includes(field) || !Number.isSafeInteger(amount) || amount <= 0) throw new Error('지급 형식이 올바르지 않습니다.');
  return businessTransaction(async (db, session) => {
    const users = db.collection('sessions');
    const doc = await users.findOne({ _id: targetId }, { session });
    if (!doc) return { found: false };
    const state = withUserId(doc.state, targetId);
    addResources(state.profile, { [field]: amount });
    await users.updateOne({ _id: targetId }, { $set: { state, ...playerIndex(targetId,state), updatedAt: new Date() }, $inc: { revision: 1 } }, { session });
    await db.collection('admin_grants').insertOne({ actorId, targetId, field, amount, createdAt: new Date() }, { session });
    return { found: true, balance: state.profile[field] };
  });
}
async function activatePremiumPass(actorId, targetId) {
  if (!isGameAdmin(actorId)) throw new Error('관리자만 사용할 수 있습니다.');
  validateUserId(targetId);
  return businessTransaction(async (db, session) => {
    const users = db.collection('sessions');
    const doc = await users.findOne({ _id: targetId }, { session });
    if (!doc || !doc.state || !doc.state.profile) return { found: false };
    const state = withUserId(doc.state, targetId);
    checkAndResetSeasonPass(state.profile);
    const pass = state.profile.seasonPass;
    const alreadyActive = pass.premiumMonth === pass.month;
    if (!alreadyActive) {
      pass.premiumMonth = pass.month;
      await users.updateOne({ _id: targetId }, { $set: { state, ...playerIndex(targetId,state), updatedAt: new Date() }, $inc: { revision: 1 } }, { session });
      await db.collection('admin_grants').insertOne({ actorId, targetId, action: 'premium_pass', month: pass.month, createdAt: new Date() }, { session });
    }
    return { found: true, alreadyActive, month: pass.month };
  });
}
async function getPowerRanking(){
 startPlayerIndexMaintenance();
 await ensurePlayerIndexes();const users=await getCollection();
 const docs=await users.find({indexedPlayer:true},{projection:{_id:1,rankSnapshot:1}}).sort({rankPower:-1,_id:1}).limit(5).toArray();
 const rows=docs.map(doc=>({id:doc._id,...doc.rankSnapshot}));
 rows.indexUpdating=!playerBackfillComplete;
 return rows;
}
async function ensureRaid(db) {
  try {
    await db.collection('raids').updateOne({ _id: RAID_ID }, { $setOnInsert: {
      hp: RAID_HP, maxHp: RAID_HP, attackCount: 0, participants: [], rewards: [], createdAt: new Date()
    } }, { upsert: true });
  } catch (err) { if (!err || err.code !== 11000) throw err; }
}

async function getSharedRaid(userId='') {
 const db=await database();await ensureRaid(db);const raid=await db.collection('raids').findOne({_id:RAID_ID});
 const planId=RAID_ID+':'+(raid.generation||1);
 const leaders=raid.rowsVersion===1?await db.collection('raid_contributions').find({planId}).sort({damage:-1,userId:1}).limit(3).toArray():(raid.participants||[]).slice().sort((a,b)=>b.damage-a.damage).slice(0,3);
 raid.topContributors=await Promise.all(leaders.map(async p=>{const doc=await db.collection('sessions').findOne({_id:p.userId},{projection:{'state.profile.nickname':1}});return {...p,nickname:doc?.state?.profile?.nickname||p.nickname||'이름 없는 유저'};}));
 if(raid.discoveredBy){const doc=await db.collection('sessions').findOne({_id:raid.discoveredBy},{projection:{'state.profile.nickname':1}});raid.discoveredNickname=doc?.state?.profile?.nickname||raid.discoveredNickname;}
 if(userId&&raid.hp===0){const reward=await db.collection('raid_reward_rows').findOne({planId,userId});if(reward)raid.rewards=[reward];const receipt=await db.collection('raid_reward_receipts').findOne({_id:planId+':'+userId});raid.myRewardStatus=receipt?.status||'';}
 return raid;
}
async function migrateRaidContributions(db,session,raid){
 if(raid.rowsVersion===1)return;
 const planId=RAID_ID+':'+(raid.generation||1);
 for(const row of raid.participants||[])await db.collection('raid_contributions').updateOne({_id:planId+':'+row.userId},{$setOnInsert:{...row,planId}},{upsert:true,session});
 delete raid.participants;raid.rowsVersion=1;
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
// Compare-and-save game state, cooldown and shared raid rewards together.
// Random samples are captured outside the retrying transaction and replayed inside it.
async function commitGameTurn(userId, nextState, expected, options = {}) {
  validateUserId(userId);
  if (!nextState || !nextState.profile || !expected || !Number.isSafeInteger(expected.revision) || typeof expected.exists !== 'boolean') throw new Error('게임 저장 정보가 없습니다.');
  const prepared=withUserId(nextState,userId);
  delete prepared._dbRevision;delete prepared._dbExists;delete prepared._combatReadyAt;
  prepared.profile.nickname=await reserveNickname(userId,prepared.profile.nickname || createProfile({}).nickname);
  const combat=options.combatPerformed === true && ['farm','hunt'].includes(options.source);
  const adminRaid=options.adminRaid === true, adminJob=options.adminJob === true;
  if((adminRaid || adminJob) && !isGameAdmin(userId))throw new Error('관리자만 사용할 수 있습니다.');
  const skillRaid=options.skillRaid===true;
  if(skillRaid && getSecondJobCode(prepared.profile)!=='dualblade')throw Error('듀얼블레이드 전용 스킬입니다.');
  const raidAction=combat || adminRaid || skillRaid;
  const rolls=Array.from({length:8},()=>Math.random());
  if(raidAction) await ensureRaid(await database());
  return businessTransaction(async(db,session)=>{
    const users=db.collection('sessions');
    await assertNoBulkJob(db,session,userId);
    const current=await users.findOne({_id:userId},{session});
    const now=Date.now();
    if(combat && !isGameAdmin(userId) && current && current.combatReadyAt > now) {
      const err=new Error('잠시 후 다시 시도하세요.');err.code='COOLDOWN';err.remainingMs=current.combatReadyAt-now;throw err;
    }
    if(!!current!==expected.exists || (current && (current.revision || 0)!==expected.revision)) {
      const err=new Error('다른 명령이 먼저 저장되었습니다.');err.code='STATE_CONFLICT';throw err;
    }
    const stored=JSON.parse(JSON.stringify(prepared));
    const update={state:stored,...playerIndex(userId,stored),revision:expected.revision+1,updatedAt:new Date()};
    if(combat)update.combatReadyAt=isGameAdmin(userId)?0:now+2000;
    if(current)await users.updateOne({_id:userId},{$set:update},{session});
    else await users.insertOne({_id:userId,...update},{session});
    let raidResult=null;
    if(raidAction) {
      const raids=db.collection('raids');
      let raid=await raids.findOne({_id:RAID_ID},{session});
      await migrateRaidContributions(db,session,raid);
      let discovered=false;
      const pristine=!raid.discoveredBy && !(raid.attackCount>0) && !(raid.participants||[]).length;
      if(!skillRaid && (raid.hp===0 || pristine) && (adminRaid || rolls[0]<raidEncounterChance(stored.profile))) {
        const oldGeneration=raid.generation || 1;
        if(raid.hp===0) {
          const historyId=RAID_ID+':'+oldGeneration;
          await db.collection('raid_history').updateOne({_id:historyId},{$setOnInsert:{...raid,_id:historyId}},{upsert:true,session});
        }
        raid={_id:RAID_ID,generation:raid.hp===0 ? oldGeneration+1 : oldGeneration,hp:RAID_HP,maxHp:RAID_HP,attackCount:0,rowsVersion:1,rewards:[],createdAt:new Date(),discoveredBy:userId,discoveredNickname:stored.profile.nickname,discoveredAt:new Date()};
        addRaidBox(stored.profile);
        await users.updateOne({_id:userId},{$set:{state:stored,...playerIndex(userId,stored)}},{session});
        await raids.replaceOne({_id:RAID_ID},raid,{session});
        discovered=true;
        raidResult={raid,discovered:true,attacked:false,raidBoxAwarded:'discover'};
      }
      const canSkillRaid=skillRaid && raid.hp>0 && !!raid.discoveredBy;
      if(canSkillRaid && !consumeSkillUse(stored.profile,'dualblade'))throw Error('오늘 레이드 스킬 횟수를 모두 사용했습니다.');
      let index=0;
      const hit=skillRaid && !canSkillRaid ? {attacked:false} : resolveRaidAttack(stored.profile,raid,{skillEncounter:canSkillRaid,source:options.source || 'farm',random:()=>{if(discovered && !adminRaid && index===0){index=1;return 0;}return rolls[index++];},forceEncounter:adminRaid,actorId:userId});
      if(hit.attacked) {
        addResources(stored.profile,{cash:hit.cashEarned,gold:hit.goldEarned,gem:hit.gemEarned});
        await users.updateOne({_id:userId},{$set:{state:stored,...playerIndex(userId,stored)}},{session});

        const currentPlanId=RAID_ID+':'+(raid.generation||1);
        await db.collection('raid_contributions').updateOne({_id:currentPlanId+':'+userId},{$set:{planId:currentPlanId,userId,nickname:stored.profile.nickname},$inc:{damage:hit.damage}},{upsert:true,session});
        raid.hp-=hit.damage;raid.attackCount++;raid.updatedAt=new Date();
        if(raid.hp===0) {
          raid.generation=raid.generation||1;
          const contributions=await db.collection('raid_contributions').find({planId:currentPlanId},{session}).toArray();
          const rewards=distributeRaidRewards(contributions);
          for(const row of rewards)await db.collection('raid_reward_rows').insertOne({_id:currentPlanId+':'+row.userId,planId:currentPlanId,...row},{session});
          raid.rewards=[];
          addRaidBox(stored.profile);
          await users.updateOne({_id:userId},{$set:{state:stored,...playerIndex(userId,stored)}},{session});
          const planId=RAID_ID+':'+(raid.generation||1);
          await db.collection('raid_payouts').insertOne({_id:planId,generation:raid.generation||1,rowsVersion:1,rewardCount:rewards.length,offset:0,status:'pending',createdAt:new Date()},{session});
          raid.rewardPaid=false;raid.defeatedAt=new Date();raid.killedBy=userId;raid.killerNickname=stored.profile.nickname;
        }
        await raids.replaceOne({_id:RAID_ID},raid,{session});
        if(raid.hp===0) {
          const historyId=RAID_ID+':'+(raid.generation || 1);
          await db.collection('raid_history').updateOne({_id:historyId},{$setOnInsert:{...raid,_id:historyId}},{upsert:true,session});
        }
        raidResult={...hit,raid,discovered,raidBoxAwarded:hit.defeated ? 'kill' : discovered ? 'discover' : null};
      }
    }
    if(adminRaid || adminJob)await db.collection('admin_grants').insertOne({actorId:userId,targetId:userId,action:adminRaid?'forceRaid':'forceJob',job:stored.profile.job,createdAt:new Date()},{session});
    const final=await users.findOne({_id:userId},{session});
    if(raidResult){const planId=RAID_ID+':'+(raidResult.raid.generation||1);raidResult.raid.topContributors=await db.collection('raid_contributions').find({planId},{session}).sort({damage:-1,userId:1}).limit(3).toArray();if(raidResult.raid.hp===0){const mine=await db.collection('raid_reward_rows').findOne({planId,userId},{session});raidResult.raid.rewards=mine?[mine]:[];const receipt=await db.collection('raid_reward_receipts').findOne({_id:planId+':'+userId},{session});raidResult.raid.myRewardStatus=receipt?.status||'';}}
    return {state:final.state,raidResult};
  });
}
async function renameUser(actorId,targetId,requestedName) {
  if(!isGameAdmin(actorId))throw new Error('관리자만 사용할 수 있습니다.');
  validateUserId(targetId);await ensureUserNickname(targetId);
  const nickname=String(requestedName || '').normalize('NFKC').trim();
  if(!nickname || Array.from(nickname).length>60 || /[\x00-\x1f\x7f]/.test(nickname))throw new Error('닉네임은 제어문자 없이 1~60자로 입력하세요.');
  return businessTransaction(async(db,session)=>{
    const users=db.collection('sessions'),claims=db.collection('nickname_claims');
    const doc=await users.findOne({_id:targetId},{session});if(!doc)return {found:false};
    const key=nickname.toLocaleLowerCase('en-US');
    if(await legacyNicknameOwner(db,session,nickname,targetId))return {found:true,duplicate:true};
    const claim=await claims.findOne({_id:key},{session});
    if(claim && claim.userId!==targetId) {
      const owner=await users.findOne({_id:claim.userId},{session});
      if(owner && nicknameBase(owner.state?.profile?.nickname).toLocaleLowerCase('en-US')===key)return {found:true,duplicate:true};
    }
    const replacement={_id:key,userId:targetId,nickname};
    if(claim)await claims.replaceOne({_id:key},replacement,{session});
    else await claims.insertOne(replacement,{session});
    const previous=doc.state?.profile?.nickname || '';
    const state=withUserId(doc.state,targetId);state.profile.nickname=nickname;
    await users.updateOne({_id:targetId},{$set:{state,...playerIndex(targetId,state),updatedAt:new Date()},$inc:{revision:1}},{session});
    const oldKey=nicknameBase(previous).toLocaleLowerCase('en-US');
    if(previous && oldKey!==key)await claims.deleteOne({_id:oldKey,userId:targetId},{session});
    await db.collection('admin_grants').insertOne({actorId,targetId,action:'rename',previous,nickname,createdAt:new Date()},{session});
    return {found:true,duplicate:false,nickname};
  });
}
// 대결은 상대의 저장된 능력치를 읽기만 한다. 보상과 횟수는 요청자에게만 저장한다.
async function findPvpOpponent(userId, requestedNickname = '') {
  validateUserId(userId);
  const db = await database(), users = db.collection('sessions');
  const nickname = String(requestedNickname).normalize('NFKC').trim();
  const valid = doc => doc && typeof doc._id === 'string' && doc.state && doc.state.profile;
  if (nickname) {
    if (Array.from(nickname).length > 60 || /[\x00-\x1f\x7f]/.test(nickname)) return {version:1,reason:'invalid_name'};
    const key = nickname.toLocaleLowerCase('en-US');
    const claim = await db.collection('nickname_claims').findOne({_id:key});
    const doc = claim ? await users.findOne({_id:claim.userId}) : await legacyNicknameOwner(db,null,nickname,null);
    // 변경 전 닉네임의 예약 기록을 실제 현재 닉네임으로 오인하지 않는다.
    if (!valid(doc) || nicknameBase(doc.state.profile.nickname).toLocaleLowerCase('en-US') !== key) return {version:1,reason:'not_found'};
    if (doc._id === userId) return {version:1,reason:'own_name'};
    return {version:1,opponent:createProfile(doc.state.profile)};
  }
  await ensurePlayerIndexes();
  const pivot=Math.random();
  let selected=await users.find({indexedPlayer:true,_id:{$ne:userId},matchKey:{$gte:pivot}}).sort({matchKey:1,_id:1}).limit(1).next();
  if(!selected)selected=await users.find({indexedPlayer:true,_id:{$ne:userId},matchKey:{$lt:pivot}}).sort({matchKey:1,_id:1}).limit(1).next();
  return selected?{version:1,opponent:createProfile(selected.state.profile)}:{version:1,reason:'no_players'};
}
module.exports = { RELEASE_CONTRACT:DB_RELEASE_CONTRACT, requestFailureReply, flushRequestIdentity, adminFailureList, adminRetryReward, adminResumeBulk, getBulkProgress, recordRequestIdentity, requestIdentityReport, controlBulkOpening, runRequestOnce, startBackgroundWorkers, getBulkOpening, startBulkOpening, bulkOpeningText, startPlayerIndexMaintenance, activatePremiumPass, getSession, saveSession, grantAdminResource, renameUser, getPowerRanking, getSharedRaid, commitGameTurn, findPvpOpponent };

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
    if(await legacyNicknameOwner(db,session,name,userId))continue;
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
    for await(const item of users.find({nicknameSchema:{$ne:1}}, {projection:{_id:1}})) {
      if(typeof item._id!=='string')continue;
      await nicknameTransaction(async(db,session)=>{
        const col=db.collection('sessions');const doc=await col.findOne({_id:item._id},{session});
        if(!doc || !doc.state || !doc.state.profile)return;
        const name=await claimNickname(db,session,doc._id,doc.state.profile.nickname || createProfile({}).nickname);
        if(doc.state.profile.nickname!==name || doc.nicknameSchema!==1) {
          const state=withUserId(doc.state,doc._id);state.profile.nickname=name;
          await col.updateOne({_id:doc._id},{$set:{state,...playerIndex(doc._id,state),updatedAt:new Date()},$inc:{revision:1}},{session});
        }
      });
    }
  })().catch(err=>{nicknameMigrationPromise=null;throw err;});
  return nicknameMigrationPromise;
}


function playerIndex(userId,state){
 const profile=createProfile(state.profile);const power=getRaidAttackPower(profile),enhance=getCurrentEnhanceLevel(profile);
 let h=2166136261;for(const c of userId){h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;}
 return {indexVersion:RANK_FORMULA_VERSION,nicknameSchema:1,indexedPlayer:true,rankPower:power,matchKey:h/4294967296,
 rankSnapshot:{nickname:profile.nickname,power,level:profile.level,enhance,weaponName:getWeaponInfo(enhance,profile.job)[0]}};
}
let playerIndexPromise=null;
async function ensurePlayerIndexes(){
 if(!playerIndexPromise)playerIndexPromise=(async()=>{
   const users=await getCollection();
   await Promise.all([
     users.createIndex({indexedPlayer:1,rankPower:-1,_id:1},{name:'power_top5_v1'}),
     users.createIndex({indexedPlayer:1,matchKey:1,_id:1},{name:'pvp_seek_v1'}),
     users.createIndex({'state.profile.nickname':1},{name:'nickname_lookup_v1',collation:{locale:'en',strength:2}})
   ]);

 })().catch(err=>{playerIndexPromise=null;throw err;});
 return playerIndexPromise;
}

// Full refresh runs independently of ranking requests. Concurrent saves win via revision checks.
let playerBackfillPromise=null,playerBackfillComplete=false;
function startPlayerIndexMaintenance(){
 if(playerBackfillPromise)return playerBackfillPromise;
 playerBackfillPromise=(async()=>{
   await ensurePlayerIndexes();
   await ensureNicknames();
   const users=await getCollection();
   // One-time legacy backfill; revision condition prevents overwriting newer profile metadata.
   for await(const doc of users.find({indexVersion:{$ne:RANK_FORMULA_VERSION},'state.profile':{$exists:true}})){
     if(typeof doc._id!=='string'||!doc.state?.profile)continue;
     const rev=doc.revision||0,filter=rev?{_id:doc._id,revision:rev}:{_id:doc._id,$or:[{revision:0},{revision:{$exists:false}}]};
     await users.updateOne(filter,{$set:playerIndex(doc._id,doc.state)});
   }
   // Retry revision conflicts on the next request rather than silently reporting completion.
   playerBackfillComplete=!(await users.findOne({indexVersion:{$ne:RANK_FORMULA_VERSION},'state.profile':{$exists:true}},{projection:{_id:1}}));
   if(!playerBackfillComplete)playerBackfillPromise=null;
 })().catch(()=>{playerBackfillPromise=null;playerBackfillComplete=false;console.error('[랭킹 갱신] 백그라운드 갱신을 완료하지 못했습니다. 다음 조회에서 다시 시도합니다.');});
 return playerBackfillPromise;
}

// Durable request receipts: same request ID never commits a mutation twice.
const {AsyncLocalStorage}=require('async_hooks');
const {createHash,randomUUID}=require('crypto');
const requestContext=new AsyncLocalStorage();
const workerContext=new AsyncLocalStorage();
function smallReply(text){return {version:'2.0',template:{outputs:[{simpleText:{text}}]}};}
async function runRequestOnce(userId,token,utterance,callback){
  // Missing upstream identity still gets a durable internal receipt for outcome tracking.
  // This does not identify a later upstream retry as the same request.
  if(!token)token='v1:'+Date.now()+':'+randomUUID();
  const receipts=(await database()).collection('request_receipts');
  const dated=/^v1:(\d{13}):[A-Za-z0-9_-]{16,128}$/.exec(token);
  if(dated&&(Number(dated[1])<Date.now()-7*86400000||Number(dated[1])>Date.now()+300000))return smallReply('유효 기간이 지난 요청입니다. 새로운 명령으로 입력해 주세요.');
  const id=createHash('sha256').update(userId+'\0'+token).digest('hex');
  const fingerprint=createHash('sha256').update(utterance).digest('hex'),owner=randomUUID();
  try{await receipts.insertOne({_id:id,fingerprint,owner,status:'running',leaseUntil:new Date(Date.now()+120000),createdAt:new Date(),...(dated?{expiresAt:new Date(Number(dated[1])+8*86400000)}:{})});}
  catch(err){
    if(err.code!==11000)throw err;
    const old=await receipts.findOne({_id:id});
    if(old.fingerprint!==fingerprint)return smallReply('동일 요청 식별자로 다른 명령이 전달되었습니다. 다시 입력해 주세요.');
    if(old.status==='done')return old.response||smallReply('이미 처리된 요청입니다. 보관 기간이 지난 상세 응답은 /프로필에서 확인해 주세요.');
    if(old.status==='applied')return smallReply('이미 처리된 요청입니다. 재화와 횟수는 다시 소모하지 않았습니다. /프로필에서 확인해 주세요.');
    const acquired=await receipts.updateOne({_id:id,status:'running',leaseUntil:{$lt:new Date()}},{$set:{owner,leaseUntil:new Date(Date.now()+120000)}});
    if(acquired.matchedCount!==1)return smallReply('⏳ 같은 요청을 처리 중입니다. 중복 실행하지 않았습니다.');
  }
  return requestContext.run({id,owner},async()=>{
    try{
      const response=await callback();
      await receipts.updateOne({_id:id,owner},{$set:{status:'done',response,completedAt:new Date()}});
      return response;
    }catch(err){
      try{const row=await receipts.findOne({_id:id});err.requestApplied=['applied','done'].includes(row?.status);err.requestUnapplied=row?.status==='running';}catch(_){}
      // A committed receipt must survive errors while constructing the response.
      await receipts.updateOne({_id:id,owner,status:'running'},{$set:{leaseUntil:new Date(0)}});
      throw err;
    }
  });
}
async function requestFailureReply(userId,err){
 const ctx=requestContext.getStore();if(ctx){const row=await (await database()).collection('request_receipts').findOne({_id:ctx.id});if(row?.status==='applied'||row?.status==='done')return smallReply('처리는 저장되었습니다. 재화·횟수는 다시 소모하지 않습니다. /프로필에서 확인해 주세요.');}
 return smallReply('이번 요청은 저장되지 않았습니다. 재화·횟수는 차감되지 않았습니다. 다시 입력해 주세요.');
}
async function businessTransaction(callback){
 return transaction(async(db,session)=>{
   const ctx=requestContext.getStore(),receipts=db.collection('request_receipts');
   if(ctx){const receipt=await receipts.findOne({_id:ctx.id},{session});if(!receipt||receipt.owner!==ctx.owner||receipt.status!=='running')throw Object.assign(new Error('이미 처리되었거나 만료된 요청입니다.'),{code:'DUPLICATE_REQUEST'});}
   const value=await callback(db,session);
   if(ctx)await receipts.updateOne({_id:ctx.id,owner:ctx.owner,status:'running'},{$set:{status:'applied',appliedAt:new Date()}},{session});
   return value;
 });
}

// Migrate only the requested account. Bulk migration stays in background maintenance.
async function ensureUserNickname(userId){
 validateUserId(userId);
 const current=await (await getCollection()).findOne({_id:userId},{projection:{nicknameSchema:1}});
 if(!current || current.nicknameSchema===1)return;
 return nicknameTransaction(async(db,session)=>{
   const users=db.collection('sessions'),doc=await users.findOne({_id:userId},{session});
   if(!doc||!doc.state?.profile||doc.nicknameSchema===1)return;
   const state=withUserId(doc.state,userId);
   state.profile.nickname=await claimNickname(db,session,userId,state.profile.nickname||createProfile({}).nickname);
   await users.updateOne({_id:userId},{$set:{state,...playerIndex(userId,state)},$inc:{revision:1}},{session});
 });
}

// Bulk jobs commit one bounded batch at a time, together with their result summary.
async function getBulkOpening(userId){return (await database()).collection('bulk_open_jobs').findOne({_id:userId});}
function bulkOpeningText(job){
 if(!job)return '';
 if(job.status==='running')return '📦 상자 일괄개봉 진행 중\n'+Number(job.total||0).toLocaleString()+'개 개봉 완료\n/상자 일괄개봉으로 진행 상황을 확인하세요.';
 if(job.status==='done' && !job.total)return '개봉할 수 있는 상자가 없습니다.';
 if(job.status==='error')return '⚠️ 상자 개봉을 일시 중단했습니다. 완료된 보상은 보존됩니다.\n/상자 재개 또는 /상자 중단을 입력하세요.';
 return [job.status==='cancelled'?'📦 [상자 일괄개봉 중단]':'📦 [상자 일괄개봉]',...(job.results||[]).flatMap(x=>['',x.name+' : '+x.count.toLocaleString()+'개',...(x.cash?['💵 현금 +'+x.cash.toLocaleString()+'원']:[]),...(x.gold?['🧈 금괴 +'+x.gold.toLocaleString()+'개']:[]),...(x.gem?['💎 보석 +'+x.gem.toLocaleString()+'개']:[]),...(x.titles?.length?['🏆 칭호 : '+x.titles.join(', ')]:[]),...(x.avatars?.length?['🎭 아바타 : '+x.avatars.join(', ')]:[])]),'','총 '+job.total.toLocaleString()+'개 개봉 완료.'+(job.status==='cancelled'?' 남은 상자는 보관했습니다.':''),...(job.unregistered?['미등록 상자는 보관했습니다.']:[])].join('\n');
}
async function startBulkOpening(userId){
 await ensureUserNickname(userId);
 return businessTransaction(async(db,session)=>{
  const jobs=db.collection('bulk_open_jobs'),existing=await jobs.findOne({_id:userId},{session});
  if(existing?.status==='running')return existing;
  if(existing?.status==='done' && !existing.delivered){await jobs.updateOne({_id:userId},{$set:{delivered:true}},{session});return existing;}
  const doc=await db.collection('sessions').findOne({_id:userId},{session});
  if(!doc?.state?.profile)return {status:'done',total:0,results:[]};
  if(existing?.status==='error')return existing;
  // Writing the user revision also serializes job creation with in-flight turns.
  await db.collection('sessions').updateOne({_id:userId},{$inc:{revision:1}},{session});
  const job={_id:userId,status:'running',total:0,results:[],failures:0,createdAt:new Date(),nextAttemptAt:new Date(0)};
  await jobs.replaceOne({_id:userId},job,{upsert:true,session});return job;
 });
}
async function processBulkOpeningBatch(userId){
 return transaction(async(db,session)=>{
  const jobs=db.collection('bulk_open_jobs'),job=await jobs.findOne({_id:userId,status:'running'},{session});if(!job)return;
  const users=db.collection('sessions'),doc=await users.findOne({_id:userId},{session});if(!doc?.state?.profile)throw Error('계정을 찾을 수 없습니다.');
  const state=withUserId(doc.state,userId);state.profile=createProfile(state.profile);
  const batch=processBoxBatch(state.profile,100);
  if(!batch){job.status='done';job.unregistered=state.profile.inventory.some(x=>x.category==='box');}
  else{
    job.total+=batch.count;
    const row=job.results.find(x=>x.name===batch.name);
    if(row){for(const k of ['count','cash','gold','gem'])row[k]+=batch[k];row.titles.push(...batch.titles);row.avatars.push(...batch.avatars);}else job.results.push(batch);
    await users.updateOne({_id:userId},{$set:{state,...playerIndex(userId,state),updatedAt:new Date()},$inc:{revision:1}},{session});
  }
  job.failures=0;job.nextAttemptAt=new Date(0);job.updatedAt=new Date();job.lastBatchAt=new Date();
  await jobs.replaceOne({_id:userId},job,{session});return job;
 });
}

// Raid payout plans are immutable, one receipt per generation/user prevents double credit.
async function payOneRaidReward(planId,reward){
 return transaction(async(db,session)=>{
  const plan=await db.collection('raid_payouts').findOne({_id:planId},{session});
  if(!plan || plan.status!=='pending')return;
  const actual=plan.rowsVersion===1?await db.collection('raid_reward_rows').findOne({planId,userId:reward.userId},{session}):plan.rewards.find(x=>x.userId===reward.userId);
  if(!actual)throw Error('지급 계획에 없는 참여자입니다.');
  reward=actual;
  const receipts=db.collection('raid_reward_receipts'),id=planId+':'+reward.userId;
  const receipt=await receipts.findOne({_id:id},{session});
  if(receipt && receipt.status!=='failed')return;
  const users=db.collection('sessions'),doc=await users.findOne({_id:reward.userId},{session});
  if(!doc?.state?.profile)throw Object.assign(Error('레이드 보상 계정이 없습니다.'),{code:'MISSING_PLAYER'});
  const state=withUserId(doc.state,reward.userId);
  addResources(state.profile,{cash:reward.cash,gold:reward.gold,gem:reward.gem,keys:reward.keys});
  await users.updateOne({_id:reward.userId},{$set:{state,...playerIndex(reward.userId,state),updatedAt:new Date()},$inc:{revision:1}},{session});
  await receipts.replaceOne({_id:id},{_id:id,planId,userId:reward.userId,status:'paid',createdAt:new Date()},{upsert:true,session});
 });
}
async function controlBulkOpening(userId,action){
 return businessTransaction(async(db,session)=>{
  const jobs=db.collection('bulk_open_jobs'),job=await jobs.findOne({_id:userId},{session});
  if(!job)return null;
  if(action==='재개' && job.status==='error'){
   job.status='running';job.failures=0;job.nextAttemptAt=new Date(0);
   await db.collection('sessions').updateOne({_id:userId},{$inc:{revision:1}},{session});
  }else if(action==='중단' && ['running','error'].includes(job.status))job.status='cancelled';
  job.updatedAt=new Date();await jobs.replaceOne({_id:userId},job,{session});return job;
 });
}
async function recordBulkFailure(userId,err){
 return transaction(async(db,session)=>{
  const jobs=db.collection('bulk_open_jobs'),job=await jobs.findOne({_id:userId,status:'running'},{session});if(!job)return;
  job.failures=(job.failures||0)+1;job.lastError=String(err.code||'PROCESSING_ERROR');
  job.nextAttemptAt=new Date(Date.now()+1000*2**Math.min(job.failures,6));
  if(job.failures>=3)job.status='error';
  await jobs.replaceOne({_id:userId},job,{session});
 });
}
async function recordRaidFailure(planId,userId,err){
 return transaction(async(db,session)=>{
  const col=db.collection('raid_reward_receipts'),id=planId+':'+userId,old=await col.findOne({_id:id},{session});
  if(old && old.status!=='failed')return;
  await col.replaceOne({_id:id},{_id:id,planId,userId,status:err.code==='MISSING_PLAYER'||(old?.attempts||0)+1>=5?'held':'failed',attempts:(old?.attempts||0)+1,lastError:String(err.code||'PAYMENT_ERROR'),updatedAt:new Date()},{upsert:true,session});
 });
}
async function processRaidPayout(plan){
 const total=plan.rowsVersion===1?plan.rewardCount:plan.rewards.length,from=plan.offset||0,end=Math.min(total,from+10);
 const batch=plan.rowsVersion===1?await (await database()).collection('raid_reward_rows').find({planId:plan._id}).sort({userId:1}).skip(from).limit(10).toArray():plan.rewards.slice(from,end);
 for(const reward of batch){
  try{await payOneRaidReward(plan._id,reward);}catch(err){await recordRaidFailure(plan._id,reward.userId,err);}
 }
 await transaction(async(db,session)=>{
  const plans=db.collection('raid_payouts'),current=await plans.findOne({_id:plan._id,status:'pending'},{session});
  if(!current || (current.offset||0)!==from)return;
  if(end<total){await plans.updateOne({_id:plan._id},{$set:{offset:end,nextAttemptAt:new Date(0)}},{session});return;}
  const failed=await db.collection('raid_reward_receipts').findOne({planId:plan._id,status:'failed'},{session});
  if(failed){await plans.updateOne({_id:plan._id},{$set:{offset:0,nextAttemptAt:new Date(Date.now()+30000)}},{session});return;}
  const held=await db.collection('raid_reward_receipts').findOne({planId:plan._id,status:'held'},{session});
  if(held){await plans.updateOne({_id:plan._id},{$set:{status:'held',offset:0}},{session});return;}
  // Final plan state and both visible completion flags commit together.
  await plans.updateOne({_id:plan._id},{$set:{offset:end,status:'done',finalizedAt:new Date()}},{session});
  await db.collection('raids').updateOne({_id:RAID_ID,generation:plan.generation},{$set:{rewardPaid:true}},{session});
  await db.collection('raid_history').updateOne({_id:plan._id},{$set:{rewardPaid:true}},{session});
 });
}
let maintenanceTimer=null,maintenanceBusy=false,backgroundIndexes=null,lastArchiveAt=0;
async function ensureBackgroundIndexes(db){
 if(!backgroundIndexes)backgroundIndexes=Promise.all([
  db.collection('request_receipts').createIndex({expiresAt:1},{expireAfterSeconds:0,name:'dated_request_expiry_v1'}),
  db.collection('raid_contributions').createIndex({planId:1,damage:-1,userId:1},{name:'raid_top_v1'}),
  db.collection('raid_reward_rows').createIndex({planId:1,userId:1},{unique:true,name:'raid_reward_user_v1'}),
  db.collection('bulk_open_jobs').createIndex({status:1,lastBatchAt:1,createdAt:1},{name:'bulk_fair_v3'}),
  db.collection('raid_payouts').createIndex({status:1,nextAttemptAt:1},{name:'payout_due_v2'}),
  db.collection('raid_reward_receipts').createIndex({planId:1,status:1},{name:'payout_receipt_v2'}),
  db.collection('request_receipts').createIndex({status:1,completedAt:1},{name:'request_retention_v1'})
 ]).catch(err=>{backgroundIndexes=null;throw err;});
 return backgroundIndexes;
}
async function archiveCompletedRecords(db){
 if(Date.now()-lastArchiveAt<3600000)return;
 const cutoff30=new Date(Date.now()-30*86400000),cutoff90=new Date(Date.now()-90*86400000);
 // Keep request tombstones indefinitely: arbitrary old IDs must never execute again.
 await db.collection('request_receipts').updateMany({status:'done',completedAt:{$lt:cutoff30},response:{$exists:true}},{$unset:{response:'',owner:'',leaseUntil:''},$set:{archived:true}});
 for(const plan of await db.collection('raid_payouts').find({status:'done',finalizedAt:{$lt:cutoff90},cleanupComplete:{$ne:true}}).limit(20).toArray()){
  await db.collection('raid_payouts').updateOne({_id:plan._id,status:'done'},{$unset:{rewards:''},$set:{archived:true}});
  // A completed plan itself rejects payment, even after per-user receipts are removed.
  await db.collection('raid_reward_receipts').deleteMany({planId:plan._id});
  await db.collection('raid_reward_rows').deleteMany({planId:plan._id});
  await db.collection('raid_contributions').deleteMany({planId:plan._id});
  await db.collection('raid_history').updateOne({_id:plan._id},{$unset:{participants:'',rewards:''},$set:{archived:true}});
  await db.collection('raid_payouts').updateOne({_id:plan._id,status:'done'},{$set:{cleanupComplete:true}});
 }
 lastArchiveAt=Date.now();
}
async function reconcileOldPayouts(db){
 for(const item of await db.collection('raid_payouts').find({status:'done',finalizedAt:{$exists:false}}).limit(10).toArray()){
  await transaction(async(db,session)=>{
   const plan=await db.collection('raid_payouts').findOne({_id:item._id,status:'done',finalizedAt:{$exists:false}},{session});if(!plan)return;
   await db.collection('raids').updateOne({_id:RAID_ID,generation:plan.generation},{$set:{rewardPaid:true}},{session});
   await db.collection('raid_history').updateOne({_id:plan._id},{$set:{rewardPaid:true}},{session});
   await db.collection('raid_payouts').updateOne({_id:plan._id},{$set:{finalizedAt:new Date()}},{session});
  });
 }
}

async function withWorkerLease(id,callback){
 const db=await database(),owner=randomUUID();
 const won=await transaction(async(db,session)=>{const col=db.collection('worker_locks'),row=await col.findOne({_id:id},{session});if(row&&row.until>new Date())return false;await col.replaceOne({_id:id},{_id:id,owner,until:new Date(Date.now()+60000)},{upsert:true,session});return true;}).catch(e=>{if(e.code===11000)return false;throw e});
 if(!won)return;
 try{return await workerContext.run({id,owner},callback);}finally{await db.collection('worker_locks').deleteOne({_id:id,owner});}
}
async function runBulkWorker(){
 const db=await database();await ensureBackgroundIndexes(db);const due={$or:[{nextAttemptAt:{$exists:false}},{nextAttemptAt:{$lte:new Date()}}]};
 for(const job of await db.collection('bulk_open_jobs').find({status:'running',...due}).sort({lastBatchAt:1,createdAt:1}).limit(5).toArray())await withWorkerLease('bulk:'+job._id,async()=>{try{await processBulkOpeningBatch(job._id);}catch(err){if(err.code!=='LEASE_LOST')await recordBulkFailure(job._id,err);}});
}
async function runRaidWorker(){
 const db=await database();await ensureBackgroundIndexes(db);const due={$or:[{nextAttemptAt:{$exists:false}},{nextAttemptAt:{$lte:new Date()}}]};
 for(const plan of await db.collection('raid_payouts').find({status:'pending',...due}).sort({nextAttemptAt:1}).limit(5).toArray())await withWorkerLease('payout:'+plan._id,()=>processRaidPayout(plan)).catch(()=>console.error('[레이드 지급] 작업 실패, 다른 지급 계속'));
}
async function runCleanupWorker(){const db=await database();await reconcileOldPayouts(db);await archiveCompletedRecords(db);await flushRequestIdentity();}
async function runBackgroundBatch(){await runBulkWorker();await runRaidWorker();await runCleanupWorker();}
function startBackgroundWorkers(){
 if(maintenanceTimer)return;
 const launch=(fn,ms)=>{let busy=false;const run=async()=>{if(busy)return;busy=true;try{await fn();}catch(_){console.error('[백그라운드 작업] 다음 주기에 재시도');}finally{busy=false}};void run();const timer=setInterval(run,ms);timer.unref?.();return timer;};
 maintenanceTimer=[launch(runBulkWorker,500),launch(runRaidWorker,500),launch(runCleanupWorker,60000)];
}

async function assertNoBulkJob(db,session,userId){
 if(await db.collection('bulk_open_jobs').findOne({_id:userId,status:'running'},{session})){const err=Error('상자 일괄개봉 진행 중입니다.');err.code='BULK_RUNNING';throw err;}
}
async function legacyNicknameOwner(db,session,name,excludeId){
 return db.collection('sessions').findOne({_id:{$ne:excludeId},'state.profile.nickname':name},{...(session?{session}:{}),collation:{locale:'en',strength:2}});
}

// Operations are authorized in the DB as well as the HTTP handler.
function requireOperator(actor){if(!isGameAdmin(actor))throw Error('관리자만 사용할 수 있습니다.');}
async function adminFailureList(actor,kind,page=1){
 requireOperator(actor);if(!Number.isSafeInteger(page)||page<1||page>10000)throw Error('페이지는 1~10,000입니다.');
 const db=await database(),raid=kind==='보상';
 const rows=await db.collection(raid?'raid_reward_receipts':'bulk_open_jobs').find(raid?{$or:[{status:'failed'},{status:'held'}]}:{status:'error'}).sort({_id:1}).skip((page-1)*5).limit(6).toArray();
 const lines=['🛠️ '+kind+' 실패 목록 · '+page+'페이지'];
 for(const row of rows.slice(0,5)){
  if(raid){const generation=String(row.planId).split(':').pop();lines.push('','레이드 번호 : '+generation,'대상 UID : '+row.userId,'실패 코드 : '+row.lastError,'시도 : '+row.attempts,'/관리자 보상 재시도 '+generation+' '+row.userId);}
  else lines.push('','대상 UID : '+row._id,'완료 : '+Number(row.total||0).toLocaleString()+'개','실패 코드 : '+row.lastError,'/관리자 작업 재개 '+row._id);
 }
 if(!rows.length)lines.push('실패 기록이 없습니다.');
 if(rows.length>5)lines.push('','다음 : /관리자 '+kind+' 실패 '+(page+1));
 return lines.join('\n');
}
async function adminRetryReward(actor,generation,userId){
 requireOperator(actor);validateUserId(userId);if(!Number.isSafeInteger(generation)||generation<1)throw Error('올바른 레이드 번호를 입력하세요.');
 return businessTransaction(async(db,session)=>{
  const id=RAID_ID+':'+generation,plan=await db.collection('raid_payouts').findOne({_id:id},{session});
  const receipt=await db.collection('raid_reward_receipts').findOne({_id:id+':'+userId},{session});
  if(!plan||!['pending','held'].includes(plan.status)||!['failed','held'].includes(receipt?.status))return '재시도할 미지급 실패 기록이 없습니다. 완료 보상은 다시 지급하지 않습니다.';
  await db.collection('raid_reward_receipts').updateOne({_id:id+':'+userId},{$set:{status:'failed',attempts:0}},{session});
  await db.collection('raid_payouts').updateOne({_id:id},{$set:{status:'pending',offset:0,nextAttemptAt:new Date(0)}},{session});
  await db.collection('admin_grants').insertOne({actorId:actor,targetId:userId,action:'retryRaidReward',generation,createdAt:new Date()},{session});
  return '레이드 보상 재시도를 예약했습니다. 이미 지급된 보상은 다시 지급하지 않습니다.';
 });
}
async function adminResumeBulk(actor,userId){
 requireOperator(actor);validateUserId(userId);
 return businessTransaction(async(db,session)=>{
  const jobs=db.collection('bulk_open_jobs'),job=await jobs.findOne({_id:userId,status:'error'},{session});
  if(!job)return '오류로 중단된 상자 작업이 없습니다.';
  if(!await db.collection('sessions').findOne({_id:userId},{session}))return '계정이 없습니다. 계정을 복구한 뒤 재개하세요.';
  await jobs.updateOne({_id:userId,status:'error'},{$set:{status:'running',failures:0,nextAttemptAt:new Date(0)}},{session});
  await db.collection('sessions').updateOne({_id:userId},{$inc:{revision:1}},{session});
  await db.collection('admin_grants').insertOne({actorId:actor,targetId:userId,action:'resumeBulk',createdAt:new Date()},{session});
  return '상자 일괄개봉을 재개했습니다. 완료된 배치는 다시 처리하지 않습니다.';
 });
}
async function getBulkProgress(userId){
 const job=await getBulkOpening(userId);if(!job||job.status!=='running')return bulkOpeningText(job);
 const doc=await (await getCollection()).findOne({_id:userId},{projection:{'state.profile.inventory':1}});
 const remaining=countBoxes(doc?.state?.profile||{});
 const waiting=await (await database()).collection('bulk_open_jobs').countDocuments({status:'running'});
 return bulkOpeningText(job)+'\n남은 보유 상자 : '+remaining.toLocaleString()+'개\n진행·대기 작업 : '+waiting.toLocaleString()+'건\n※ 추가 상자가 생기면 남은 수량이 늘 수 있습니다. 순서대로 번갈아 처리합니다.';
}

const pendingIdentity=new Map();let identityFlushing=false,identityTimer=null;
function recordRequestIdentity(present){
 const day=new Date(Date.now()+9*3600000).toISOString().slice(0,10),counts=pendingIdentity.get(day)||{withId:0,withoutId:0};counts[present?'withId':'withoutId']++;pendingIdentity.set(day,counts);
 while(pendingIdentity.size>8)pendingIdentity.delete(pendingIdentity.keys().next().value);
 if(!identityTimer){identityTimer=setTimeout(()=>{identityTimer=null;void flushRequestIdentity();},5000);identityTimer.unref?.();}
 return Promise.resolve();
}
async function flushRequestIdentity(){
 if(identityFlushing)return;identityFlushing=true;
 try{const db=await database();for(const [day,c]of pendingIdentity){const snapshot={...c};await db.collection('request_identity_stats').updateOne({_id:day},{$inc:snapshot,$set:{updatedAt:new Date()}},{upsert:true});c.withId-=snapshot.withId;c.withoutId-=snapshot.withoutId;if(!c.withId&&!c.withoutId)pendingIdentity.delete(day);}}
 catch(_){console.warn('[진단 집계] 기록 지연; 다음 처리에서 재시도');}finally{identityFlushing=false;}
}
async function requestIdentityReport(actor){
 requireOperator(actor);await flushRequestIdentity();const db=await database();
 const rows=await db.collection('request_identity_stats').find({}).sort({_id:-1}).limit(7).toArray();
 return ['🛠️ 요청 식별자 점검',...rows.map(x=>x._id+' : 있음 '+(x.withId||0).toLocaleString()+'회 / 없음 '+(x.withoutId||0).toLocaleString()+'회'),'식별자가 있어도 재전송마다 바뀌면 재전송을 구분할 수 없습니다.','서버 인증 : 미사용 · '+(process.env.SKILL_REQUIRE_REQUEST_ID==='true'?'식별자 필수':'식별자 없는 요청 허용')].join('\n');
}

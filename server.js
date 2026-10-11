// server.js — 카카오톡 챗봇 스킬 서버
const path = require('path');
const express = require('express');
const { validateCommandInput, normalizeImageFilename, parsePvpCommand, startGame, processTurn, createProfile, getSecondJobCode, isGameAdmin, requiresGameAdmin, parseAdminGrant, getRaidAttackPower, buildRaidText, formatRanking, formatRaidReward, parseAdminRename, resourceText, RAID_IMAGE } = require('./game');
const { buildResponse, parseSkillRequest } = require('./kakao');
const { adminFailureList, adminRetryReward, adminResumeBulk, getBulkProgress, recordRequestIdentity, requestIdentityReport, controlBulkOpening, runRequestOnce, startBackgroundWorkers, getBulkOpening, startBulkOpening, bulkOpeningText, startPlayerIndexMaintenance, activatePremiumPass, getSession, saveSession, grantAdminResource, getPowerRanking, getSharedRaid, renameUser, commitGameTurn, findPvpOpponent } = require('./db');

const SERVER_RELEASE_CONTRACT='20261007-ops-v2';
if(require('./game').RELEASE_CONTRACT!==SERVER_RELEASE_CONTRACT||require('./db').RELEASE_CONTRACT!==SERVER_RELEASE_CONTRACT)throw Error('파일 버전이 일치하지 않습니다. game.js, db.js, server.js를 함께 교체하세요.');
const app = express();
app.set('trust proxy', true);
// 본문이나 UID는 로그에 남기지 않는다. /skill 이외 경로도 수신 여부 확인.
let requestSequence = 0;
app.use((req, res, next) => {
  req.traceId = ++requestSequence;
  const started = Date.now();
  console.log('[요청 도착] #' + req.traceId + ' ' + req.method + ' ' + (req.path.startsWith('/skill')?'/skill/[인증 경로 숨김]':req.path));
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

// 등록된 이미지 URL은 사전 네트워크 검사 없이 카카오 응답에 포함한다.
async function buildSafeResponse(text,choices=[],imageUrl=null) {
 const normalized=normalizeImageFilename(imageUrl);
 const image=typeof normalized==='string' && /^https?:\/\/\S+$/i.test(normalized)?normalized:null;
 return buildResponse(text,choices,image);
}

const RESTART_WORDS = ['다시하기', '재시작', '시작', '게임시작', '시작하기'];

async function handleSkill(req, res) {
  let stage = '카카오 요청 해석';
  let saved=false;
  const delayed = setTimeout(() => console.warn('[처리 지연] #' + req.traceId + ' 단계=' + stage + ' (3초 경과, 완료 여부를 확인하세요)'), 3000);
  const clearDelayed = () => clearTimeout(delayed);
  res.once('finish', clearDelayed);
  res.once('close', clearDelayed);
  try {
    const parsed = parseSkillRequest(req.body);
    const userId = parsed && parsed.userId;
    const utterance = parsed && typeof parsed.utterance === 'string' ? parsed.utterance.trim().replace(/\s+/g,' ') : '';
    if (typeof userId !== 'string' || !userId.trim()) {
      return res.json(await buildSafeResponse('사용자 식별 정보를 확인할 수 없습니다. 카카오톡 채널에서 다시 입력해 주세요.', []));
    }

    // 요청 발신 UID를 기준으로 검사하며 명령에 적힌 대상 UID로 권한을 판정하지 않는다.
    if (requiresGameAdmin(utterance) && !isGameAdmin(userId)) return res.json(await buildSafeResponse('관리자만 사용할 수 있는 명령어입니다.', []));
    const invalidInput=validateCommandInput(utterance);
    if(invalidInput)return res.json(await buildSafeResponse(invalidInput,[]));
    if(utterance==='/관리자 점검')return res.json(await buildSafeResponse(await requestIdentityReport(userId),[]));
    const failed=utterance.match(/^\/관리자 (보상|작업) 실패(?: (\d+))?$/);
    if(failed)return res.json(await buildSafeResponse(await adminFailureList(userId,failed[1],Number(failed[2]||1)),[]));
    const retry=utterance.match(/^\/관리자 보상 재시도 (\d+) (\S+)$/);
    if(retry)return res.json(await buildSafeResponse(await adminRetryReward(userId,Number(retry[1]),retry[2]),[]));
    const resume=utterance.match(/^\/관리자 작업 재개 (\S+)$/);
    if(resume)return res.json(await buildSafeResponse(await adminResumeBulk(userId,resume[1]),[]));
    if(['/상자 일괄개봉','/상자 재개','/상자 중단'].includes(utterance)){
      const job=utterance==='/상자 일괄개봉'?await startBulkOpening(userId):await controlBulkOpening(userId,utterance.split(' ')[1]);
      if(!job)return res.json(await buildSafeResponse('진행 중인 일괄개봉 작업이 없습니다.',[]));
      const balances=job.status==='done' && job.total? '\n\n'+resourceText((await getSession(userId)).profile):'';
      return res.json(await buildSafeResponse((job.status==='running'?await getBulkProgress(userId):bulkOpeningText(job))+balances,[]));
    }
    const activeBulk=await getBulkOpening(userId);
    const readOnly=new Set(['/프로필','/스탯','/보조','/누적','/전리품','/인벤토리','/가이드','/도움말','/오늘']);
    if(activeBulk?.status==='running'&&readOnly.has(utterance)){const snapshot=await getSession(userId);const view=processTurn(JSON.parse(JSON.stringify(snapshot)),utterance,{userId,sharedRaidPassives:true});return res.json(await buildSafeResponse(view.text+'\n\n📦 일괄개봉 중 조회 화면입니다. 정산·변경 사항은 저장하지 않습니다.',view.choices,getImageUrl(req,view.category,view.imageUrl)));}
    if(activeBulk?.status==='running'&&!['/랭킹','/레이드'].includes(utterance))return res.json(await buildSafeResponse(await getBulkProgress(userId),[]));
    const adminRaidCommand=utterance === '/관리자 레이드';
    const adminJobCommand=/^\/관리자\s+전직\s+\S+$/.test(utterance);
    const adminSpeedCommand=/^\/관리자\s+배속\s+\d+$/.test(utterance);
    const adminAttackCommand=/^\/관리자\s+공격력(?:\s|$)/.test(utterance);
    // game.js 내부에서 처리하는 관리자 전용 명령은 재화 지급 파서가 가로채지 않도록 통과시킨다.
    if (/^\/관리자(?:\s|$)/.test(utterance) && !adminRaidCommand && !adminJobCommand && !adminSpeedCommand && !adminAttackCommand && !/^\/관리자\s+횟수$/.test(utterance)) {
      const premium = utterance.match(/^\/관리자\s+(\S+)\s+패스\s+활성화$/);
      if (premium) {
        stage = '관리자 유료 패스 활성화';
        const result = await activatePremiumPass(userId, premium[1]);
        return res.json(await buildSafeResponse(!result.found ? '해당 UID의 게임 계정이 없습니다.' :
          '✅ ' + result.month + ' 유료 패스 ' + (result.alreadyActive ? '이미 활성화되어 있습니다.' : '활성화 완료!') + '\n한국 시간 다음 달 1일 00:00에 종료됩니다.\n/패스 보상으로 보상을 수령하세요.', []));
      }
      const rename=parseAdminRename(utterance);
      if(rename) {
        stage='관리자 닉네임 변경';
        const result=await renameUser(userId,rename.targetId,rename.nickname);
        return res.json(await buildSafeResponse(!result.found ? '해당 UID의 계정이 없습니다.' : result.duplicate ? '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하세요.' : '✅ 닉네임 변경 완료\n'+result.nickname,[]));
      }
      const grant = parseAdminGrant(utterance);
      if (!grant) return res.json(await buildSafeResponse('사용법: /관리자 대상UID 재화 수량\n재화: 현금·금괴·보석·비밀열쇠·보급\n수량: 1 이상의 정수\n유료 패스: /관리자 대상UID 패스 활성화\n닉네임 변경: /관리자 대상UID 닉네임 새닉네임\n관리자 전용: /관리자 레이드 · /관리자 전직 직업명 · /관리자 배속 1~1000 · /관리자 공격력 수치', []));
      stage = '관리자 재화 지급';
      const paid = await grantAdminResource(userId, grant.targetId, grant.field, grant.amount);
      return res.json(await buildSafeResponse(paid.found ? '✅ 지급 완료\n대상: ' + grant.targetId + '\n' + grant.label + ' +' + grant.amount.toLocaleString() + (grant.field === 'cash' ? '원' : '개') : '해당 UID의 게임 계정이 없습니다. UID를 확인해 주세요.', []));
    }
    if (utterance === '/랭킹') {
      stage = '공격력 랭킹 조회';
      const rows=await getPowerRanking();
      return res.json(await buildSafeResponse(formatRanking(rows)+(rows.indexUpdating?'\n\n⏳ 기존 유저 정보를 갱신 중입니다. 현재 저장된 순위이며 완료 후 반영됩니다.':''), []));
    }

    stage = 'MongoDB 조회';
    let state = await getSession(userId);
    if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
    state.userId = userId;
    state.profile = { ...(state.profile || {}), userId };
    console.log('[사용자 조회 완료] #' + req.traceId);

    if(adminRaidCommand) {
      const nextState={...state,profile:createProfile(state.profile)};
      const committed=await commitGameTurn(userId,nextState,{revision:state._dbRevision,exists:state._dbExists},{adminRaid:true});
      const raidResult=committed.raidResult || {raid:await getSharedRaid(userId),attacked:false};
      return res.json(await buildSafeResponse(['🛠️ 관리자 레이드 강제 조우',buildRaidText(committed.state.profile,raidResult),formatRaidReward(raidResult.raid,userId)].filter(Boolean).join('\n\n'),[],RAID_IMAGE));
    }
    if (/^\/레이드(?:\s|$)/.test(utterance)) {
      if (utterance !== '/레이드') return res.json(await buildSafeResponse('레이드는 /레이드로 조회하세요. 공격은 /파밍·/사냥 중 조우했을 때 자동으로 진행됩니다.',[]));
      stage='레이드 조회';
      const raid=await getSharedRaid(userId);
      return res.json(await buildSafeResponse([buildRaidText(state.profile,{raid,attacked:false}),formatRaidReward(raid,userId)].filter(Boolean).join('\n\n'),[],RAID_IMAGE));
    }
    const combatCommand=/^\/(파밍|사냥)$/.test(utterance);
    if(combatCommand && !isGameAdmin(userId) && state._combatReadyAt > Date.now()) return res.json(await buildSafeResponse('⏳ 파밍·사냥은 2초마다 가능합니다. '+((state._combatReadyAt-Date.now())/1000).toFixed(1)+'초 후 다시 입력하세요.',[]));

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
      let pvpMatch;
      if (/^\/대결(?:\s|$)/.test(utterance)) {
        stage = '대결 상대 조회';
        const command=parsePvpCommand(utterance);
        if(command.invalid||!Number.isSafeInteger(command.count)||command.count<1||command.count>10)return res.json(await buildSafeResponse('대결 횟수는 1~10 정수입니다. 숫자로 끝나는 닉네임은 /대결 "닉네임"으로 지정하세요.',[]));
        if(command.explicit && getSecondJobCode(state.profile)!=='archmage')return res.json(await buildSafeResponse('횟수 지정은 아크메이지 전용입니다. /대결 또는 /대결 "닉네임"으로 1회씩 진행하세요.',[]));
        pvpMatch = {...await findPvpOpponent(userId, command.nickname),requestedCount:command.count,explicitCount:command.explicit};
      }
      result = processTurn(state, utterance, { userId, sharedRaidPassives:true, pvpMatch });
    }

    if (!result || !result.state || !result.state.profile) {
      throw new Error('게임 처리 결과에 저장할 상태가 없습니다.');
    }
    let nextState = result.state;
    nextState.userId = userId;
    nextState.profile.userId = userId;
    stage = 'MongoDB 저장';
    const displayedNickname = nextState.profile.nickname;
    const expected={revision:state._dbRevision,exists:state._dbExists};
    if(adminJobCommand && result.adminAction === 'job') {
      const committed=await commitGameTurn(userId,nextState,expected,{adminJob:true});
      nextState=committed.state;
    } else if(result.skillRaid === true) {
      const committed=await commitGameTurn(userId,nextState,expected,{skillRaid:true,source:'farm'});
      nextState=committed.state;
      result.text=committed.raidResult ? buildRaidText(nextState.profile,committed.raidResult) : '발견된 살아 있는 레이드가 없습니다. 사용권은 차감되지 않았습니다.';
      if(committed.raidResult)result.text+='\n\n'+formatRaidReward(committed.raidResult.raid,userId);
      result.imageUrl=committed.raidResult?RAID_IMAGE:null;
    } else if(combatCommand && result.combatPerformed === true) {
      const beforeResources=resourceText(nextState.profile);
      const committed=await commitGameTurn(userId,nextState,expected,{combatPerformed:true,source:result.category});
      nextState=committed.state;
      result.text=result.text.split(beforeResources).join(resourceText(nextState.profile));
      if(committed.raidResult) {
        result.text += '\n\n'+buildRaidText(nextState.profile,committed.raidResult);
        const reward=formatRaidReward(committed.raidResult.raid,userId);
        if(reward)result.text+='\n\n'+reward;
        result.imageUrl=RAID_IMAGE;
      }
    } else {
      await saveSession(userId,nextState,expected);
    }
    if (displayedNickname && nextState.profile.nickname !== displayedNickname && typeof result.text === 'string') result.text = result.text.split(displayedNickname).join(nextState.profile.nickname);
    saved=true;
    stage = '카카오 응답 생성';
    return res.json(await buildSafeResponse(result.text, result.choices, getImageUrl(req, result.category, result.imageUrl)));
  } catch (err) {
    if(err?.code==='BULK_RUNNING')return res.json(await buildSafeResponse('📦 상자 일괄개봉 진행 중입니다. /상자 일괄개봉으로 확인하세요.',[]));
    if(err?.code==='DUPLICATE_REQUEST')return res.json(await buildSafeResponse('이미 처리 중이거나 완료된 요청입니다. 다시 소모하지 않았습니다.',[]));
    if (err && err.code === 'COOLDOWN') return res.json(await buildSafeResponse('⏳ 파밍·사냥은 2초마다 가능합니다. '+(Math.max(0,err.remainingMs)/1000).toFixed(1)+'초 후 다시 입력하세요.',[]));
    if (err && err.code === 'STATE_CONFLICT') throw err;
    err.saved=saved;err.failureStage=stage;throw err;
  } finally {clearDelayed();}
}

const inFlightUsers=new Set();
let missingRequestIdLogged=false;
app.post('/skill',async(req,res)=>{
 let lockedUser=null;
 try{
  const parsed=parseSkillRequest(req.body);
  const suppliedToken=req.get?.('X-Request-Id') || req.get?.('Idempotency-Key') || req.body?.userRequest?.callbackUrl;
  const token=typeof suppliedToken==='string' && suppliedToken.trim().length>0 && suppliedToken.length<=4096?suppliedToken.trim():null;
  if(!token && !missingRequestIdLogged){missingRequestIdLogged=true;console.warn('[중복 방지] 요청 식별자가 없는 요청은 정상 연속 명령과 구분할 수 없어 재전송 중복 방지를 적용하지 않습니다.');}
  void recordRequestIdentity(!!token).catch(()=>console.warn('[요청 식별자] 진단 집계 실패'));
  if(!token && process.env.SKILL_REQUIRE_REQUEST_ID==='true'){res.status(503);return res.json({version:'2.0',template:{outputs:[{simpleText:{text:'요청 식별 정보를 확인할 수 없습니다. 운영자에게 문의해 주세요.'}}]}});}
  if(parsed?.userId){
   if(inFlightUsers.has(parsed.userId))return res.json({version:'2.0',template:{outputs:[{simpleText:{text:'이전 명령을 처리 중입니다. 완료 후 다시 입력해 주세요.'}}]}});
   lockedUser=parsed.userId;inFlightUsers.add(lockedUser);
  }
  const capture={once:()=>{},json:value=>value};
  const response=typeof parsed?.userId==='string' && parsed.userId.trim()?
    await runRequestOnce(parsed.userId,typeof token==='string'?token:null,String(parsed.utterance||''),()=>handleSkill(req,capture)):
    await handleSkill(req,capture);
  return res.json(response);
 }catch(err){console.error('[요청 처리 실패] '+safeErrorDetails(err));const text=err.saved||err.requestApplied?'처리는 저장되었습니다. 재화·횟수는 다시 소모하지 않습니다. /프로필에서 확인해 주세요.':err.requestUnapplied||['INVALID_RESOURCE','STATE_CONFLICT'].includes(err.code)?'이번 요청은 저장되지 않았습니다. 재화·횟수는 차감되지 않았습니다. 다시 입력해 주세요.':'처리 결과를 확인하지 못했습니다. /프로필에서 먼저 확인해 주세요. 같은 명령을 반복하면 추가로 실행될 수 있습니다.';return res.json({version:'2.0',template:{outputs:[{simpleText:{text}}]}});}
 finally{if(lockedUser)inFlightUsers.delete(lockedUser);}
});

app.get('/', (req, res) => {
  res.send('battlegrounds-kakao-bot skill server is running');
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  if (!process.env.MONGODB_URI) console.error('[설정 확인] MONGODB_URI가 없습니다. 서버 환경변수에 MongoDB 접속 주소를 등록해야 게임 데이터를 조회·저장할 수 있습니다.');
  console.log('[서버 시작] 요청 진단 로그 활성화 /skill');
  app.listen(PORT, () => {
    console.log(`Skill server listening on port ${PORT}`);
    startPlayerIndexMaintenance();
    startBackgroundWorkers();
  });
}
module.exports = app;

// server.js — 카카오톡 챗봇 스킬 서버
const path = require('path');
const express = require('express');
const { startGame, processTurn, createProfile, isGameAdmin, requiresGameAdmin, parseAdminGrant, getRaidAttackPower, buildRaidText, formatRanking, formatRaidReward, parseAdminRename, resourceText, RAID_IMAGE } = require('./game');
const { buildResponse, parseSkillRequest } = require('./kakao');
const { activatePremiumPass, getSession, saveSession, grantAdminResource, getPowerRanking, getSharedRaid, renameUser, commitGameTurn, findPvpOpponent } = require('./db');

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

// Missing/slow image servers must not suppress a completed command's text.
const imageChecks=new Map();
async function buildSafeResponse(text,choices=[],imageUrl=null) {
  let image=null;
  if(typeof imageUrl==='string' && /^https?:\/\//i.test(imageUrl) && typeof fetch==='function') {
    const cached=imageChecks.get(imageUrl);
    if(cached && cached.until>Date.now())image=cached.ok?imageUrl:null;
    else {
      const controller=new AbortController();let timer;
      try {
        const response=await Promise.race([
          fetch(imageUrl,{method:'HEAD',signal:controller.signal,redirect:'error'}),
          new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve(null);},500);})
        ]);
        const ok=!!(response && response.ok && /^image\//i.test(response.headers.get('content-type') || ''));
        if(ok)image=imageUrl;
        if(imageChecks.size>=256)imageChecks.delete(imageChecks.keys().next().value);
        imageChecks.set(imageUrl,{ok,until:Date.now()+60000});
      } catch (_) { imageChecks.set(imageUrl,{ok:false,until:Date.now()+15000}); }
      finally {clearTimeout(timer);}
    }
  }
  return buildResponse(text,choices,image);
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
    const utterance = parsed && typeof parsed.utterance === 'string' ? parsed.utterance.trim().replace(/\s+/g,' ') : '';
    if (typeof userId !== 'string' || !userId.trim()) {
      return res.json(await buildSafeResponse('사용자 식별 정보를 확인할 수 없습니다. 카카오톡 채널에서 다시 입력해 주세요.', []));
    }

    // 요청 발신 UID를 기준으로 검사하며 명령에 적힌 대상 UID로 권한을 판정하지 않는다.
    if (requiresGameAdmin(utterance) && !isGameAdmin(userId)) return res.json(await buildSafeResponse('관리자만 사용할 수 있는 명령어입니다.', []));
    const adminRaidCommand=utterance === '/관리자 레이드';
    const adminJobCommand=/^\/관리자\s+전직\s+\S+$/.test(utterance);
    const adminSpeedCommand=/^\/관리자\s+배속\s+\d+$/.test(utterance);
    const adminAttackCommand=/^\/관리자\s+공격력\s+\d+$/.test(utterance);
    // game.js 내부에서 처리하는 관리자 전용 명령은 재화 지급 파서가 가로채지 않도록 통과시킨다.
    if (/^\/관리자(?:\s|$)/.test(utterance) && !adminRaidCommand && !adminJobCommand && !adminSpeedCommand && !adminAttackCommand) {
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
      return res.json(await buildSafeResponse(formatRanking(await getPowerRanking()), []));
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
      const raidResult=committed.raidResult || {raid:await getSharedRaid(),attacked:false};
      return res.json(await buildSafeResponse(['🛠️ 관리자 레이드 강제 조우',buildRaidText(committed.state.profile,raidResult),formatRaidReward(raidResult.raid,userId)].filter(Boolean).join('\n\n'),[],RAID_IMAGE));
    }
    if (/^\/레이드(?:\s|$)/.test(utterance)) {
      if (utterance !== '/레이드') return res.json(await buildSafeResponse('레이드는 /레이드로 조회하세요. 공격은 /파밍·/사냥 중 조우했을 때 자동으로 진행됩니다.',[]));
      stage='레이드 조회';
      const raid=await getSharedRaid();
      return res.json(await buildSafeResponse([buildRaidText(state.profile,{raid,attacked:false}),formatRaidReward(raid,userId)].filter(Boolean).join('\n\n'),[],RAID_IMAGE));
    }
    const combatCommand=/^\/(파밍|사냥)(?:\s|$)/.test(utterance);
    if(combatCommand && state._combatReadyAt > Date.now()) return res.json(await buildSafeResponse('⏳ 파밍·사냥은 2초마다 가능합니다. '+((state._combatReadyAt-Date.now())/1000).toFixed(1)+'초 후 다시 입력하세요.',[]));

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
        pvpMatch = await findPvpOpponent(userId, utterance.replace(/^\/대결\s*/, ''));
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
    stage = '카카오 응답 생성';
    return res.json(await buildSafeResponse(result.text, result.choices, getImageUrl(req, result.category, result.imageUrl)));
  } catch (err) {
    if (err && err.code === 'COOLDOWN') return res.json(await buildSafeResponse('⏳ 파밍·사냥은 2초마다 가능합니다. '+(Math.max(0,err.remainingMs)/1000).toFixed(1)+'초 후 다시 입력하세요.',[]));
    if (err && err.code === 'STATE_CONFLICT') return res.json(await buildSafeResponse('다른 명령이 먼저 반영되었습니다. 이번 명령을 다시 입력해 주세요.', []));
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

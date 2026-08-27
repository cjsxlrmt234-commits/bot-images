// game.js

const MAX_TURN = 15; // 최대 턴 수 15턴
const BASE_URL = 'https://raw.githubusercontent.com/cjsxlrmt234-commits/bot-images/main'; 

// +0 ~ +20 강화 단계별 무기 테이블 [이름, 설명]
const WEAPON_TIERS = [
  ['맨손', '맨손'],
  ['나무젓가락 총', '고무줄 수제 장난감 총'],
  ['대나무 총', '장인의 손길로 만든 대나무총'],
  ['비비탄 총', '생각보다 위력이 쎈 총'],
  ['M1911', '반자동 권총'],
  ['M19 매그넘', '대형 구경 리볼버'],
  ['콜트 파이튼 실버', '은빛 명품 리볼버'],
  ['콜트 파이튼 골드', '금장 세공 리볼버'],
  ['실바나스', '정령력이 깃든 무기'],
  ['트라이던트', '심해 해양 테마 총'],
  ['라이주', '번개 신수의 전격 총'],
  ['프로메테우스', '불의 권능 아티팩트'],
  ['프시케 랩터', '태초의 힘이 깃든 권총'],
  ['베르단트 오블리비언', '숲의 덩굴 초록빛 총'],
  ['글레이셜 둠', '빙하와 오로라 파멸의 총'],
  ['오니즈카 섀도우', '어둠과 보랏빛 뇌전'],
  ['이터널 바운드', '백사의 힘이 깃든 총'],
  ['헤븐즈 저스티스', '찬란한 천상의 심판'],
  ['이그니스 로어', '흑룡과 불꽃의 포효'],
  ['크로노스 파라독스', '시공간 왜곡 태엽'],
  ['싱귤래리티', '블랙홀 특이점의 정점']
];

const ENHANCE_TABLE = [
  { cost: 1000, success: 1.00, keep: 0.00, fail: 0.00 },
  { cost: 1500, success: 1.00, keep: 0.00, fail: 0.00 },
  { cost: 2000, success: 0.90, keep: 0.10, fail: 0.00 },
  { cost: 3000, success: 0.75, keep: 0.15, fail: 0.10 },
  { cost: 5000, success: 0.70, keep: 0.20, fail: 0.10 },
  { cost: 7000, success: 0.65, keep: 0.25, fail: 0.10 },
  { cost: 10000, success: 0.60, keep: 0.30, fail: 0.10 },
  { cost: 14000, success: 0.50, keep: 0.40, fail: 0.10 },
  { cost: 19000, success: 0.40, keep: 0.50, fail: 0.10 },
  { cost: 25000, success: 0.35, keep: 0.55, fail: 0.10 },
  { cost: 32000, success: 0.30, keep: 0.60, fail: 0.10 },
  { cost: 40000, success: 0.25, keep: 0.65, fail: 0.10 },
  { cost: 49000, success: 0.22, keep: 0.68, fail: 0.10 },
  { cost: 59000, success: 0.20, keep: 0.70, fail: 0.10 },
  { cost: 70000, success: 0.18, keep: 0.72, fail: 0.10 },
  { cost: 82000, success: 0.15, keep: 0.75, fail: 0.10 },
  { cost: 95000, success: 0.13, keep: 0.77, fail: 0.10 },
  { cost: 109000, success: 0.09, keep: 0.81, fail: 0.10 },
  { cost: 124000, success: 0.07, keep: 0.83, fail: 0.10 },
  { cost: 140000, success: 0.05, keep: 0.85, fail: 0.10 },
];

const FARM_TABLE = [
  ['supply', 0.5],
  ['gold', 1.5],
  ['key', 2.0],
  ['jackpot', 6.0],
  ['damage', 45.0],
  ['kill_single', 30.0],
  ['kill_multi', 15.0]
];

const ESCAPE_TABLE = [
  ['instant_heal', 50.0],
  ['drink', 30.0],
  ['painkiller', 20.0]
];

const BATTLE_CHOICES = [
  { label: '파밍', action: 'farmfight' },
  { label: '도망', action: 'escape' },
];

const LOBBY_CHOICES = [
  { label: '전투', action: 'startbattle' },
  { label: '강화', action: 'enhance' },
  { label: '열쇠', action: 'usekey' },
];

const ENHANCE_CHOICES = [
  { label: '전투', action: 'startbattle' },
  { label: '강화', action: 'enhance' },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(table) {
  const total = table.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [item, w] of table) {
    if (r < w) return item;
    r -= w;
  }
  return table[table.length - 1][0];
}

function won(amount) {
  return `${Math.floor(amount).toLocaleString()}원`;
}

function getRandomSurvivorName() {
  return `Survivor ${String(rand(1, 9999)).padStart(4, '0')}`;
}

function generateRandomNickname() {
  const adjectives = ['조용한', '별속의', '용감한', '빛나는', '차가운', '뜨거운', '화려한', '어두운', '신비로운', '재빠른'];
  const nouns = ['사업자', '미인', '모험가', '사냥꾼', '지배자', '방랑자', '지장보살', '지킴이', '전사', '마법사'];
  return `${adjectives[rand(0, adjectives.length - 1)]}${nouns[rand(0, nouns.length - 1)]}${rand(1000, 9999)}`;
}

function getEnhanceImage(statusType, enhanceLevel) {
  if (statusType === 'fail' && enhanceLevel > 0) return `${BASE_URL}/fail.png`;
  let level = Math.max(0, Math.min(20, Number(enhanceLevel) || 0));
  return `${BASE_URL}/enhance_${level}.png`;
}

function makeHpBar(hp) {
  const currentHp = Math.max(0, hp);
  const filled = Math.round((currentHp / 100) * 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` (${currentHp}%)`;
}

function getRequiredExp(level) {
  return (level || 1) * 200;
}

function getGoldMultiplier(enhanceLevel) {
  return Number((1 + ((enhanceLevel || 0) * 0.05)).toFixed(2));
}

function getExpMultiplier(profile) {
  return 1 + (((profile && profile.enhance) || 0) * 0.05);
}

function getEnhanceStats(enhanceLevel) {
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));
  return {
    mult: `x${(1 + (lvl * 0.05)).toFixed(2)}`,
    head: `${(lvl * 1.00).toFixed(2)}%`,
    body: `${(50.00 - (lvl * 0.50)).toFixed(2)}%`,
    leg: `${(50.00 - (lvl * 0.50)).toFixed(2)}%`,
    numHead: lvl * 1.00,
    numBody: 50.00 - (lvl * 0.50),
    numLeg: 50.00 - (lvl * 0.50)
  };
}

function formatEnhanceStatDiff(oldStats, newStats) {
  return [
    `  배율 | ${oldStats.mult} -> ${newStats.mult}`,
    `머리 확률 | ${oldStats.head} -> ${newStats.head}`,
    ` 몸 확률 | ${oldStats.body} -> ${newStats.body}`,
    `다리 확률 | ${oldStats.leg} -> ${newStats.leg}`
  ].join('\n');
}

function getCombatPower(profile) {
  if (!profile) return 0;
  return ((profile.level || 1) * 100) + ((profile.combatLevel || 0) * 500) + ((profile.enhance || 0) * 300);
}

function calculatePartDamage(profile) {
  const enhanceLevel = profile?.enhance || 0;
  const stats = getEnhanceStats(enhanceLevel);
  const roll = Math.random() * 100;

  if (roll < stats.numHead) {
    const damageVal = Math.max(100, Math.floor(getCombatPower(profile) * 0.1)) + (enhanceLevel * 15);
    return { hitPartName: '머리', damageVal };
  } else if (roll < stats.numHead + stats.numBody) {
    return { hitPartName: '몸', damageVal: rand(31, 99) };
  } else {
    return { hitPartName: '다리', damageVal: rand(1, 30) };
  }
}

function getWeaponInfo(enhanceLevel) {
  return WEAPON_TIERS[Math.max(0, Math.min(20, enhanceLevel || 0))] || WEAPON_TIERS[0];
}

function addExp(profile, baseAmount) {
  if (!profile) return { leveledUp: false, msg: '', gained: 0 };
  profile.level = profile.level || 1;
  profile.exp = profile.exp || 0;

  const finalAmount = Math.round(baseAmount * getExpMultiplier(profile));
  profile.exp += finalAmount;
  let levelUpMsgs = [];

  while (profile.exp >= getRequiredExp(profile.level)) {
    profile.exp -= getRequiredExp(profile.level);
    profile.level += 1;
    levelUpMsgs.push(`🎉 [LEVEL UP!] Lv.${profile.level} 달성!`);
  }

  return { leveledUp: levelUpMsgs.length > 0, msg: levelUpMsgs.join('\n'), gained: finalAmount };
}

function createProfile(existing = {}) {
  return {
    cash: existing.cash ?? 0,
    gold: existing.gold ?? 0,
    keys: existing.keys ?? 0,
    enhance: existing.enhance ?? 0,
    level: existing.level ?? 1,
    exp: existing.exp ?? 0,
    combatLevel: existing.combatLevel ?? 0,
    nickname: existing.nickname || generateRandomNickname(),
    title: existing.title ?? '',
    refine: existing.refine ?? '',
    monthItems: existing.monthItems ?? 0,
    gamesPlayed: existing.gamesPlayed ?? 0,
  };
}

function profileText(profile) {
  const p = createProfile(profile);
  const [wName] = getWeaponInfo(p.enhance);
  return [
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    ` 칭호 : ${p.title}`,
    `🎮 플레이 판수 : ${p.gamesPlayed}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${p.refine}`,
    `⭐ Lv.${p.level} (${p.exp}/${getRequiredExp(p.level)})`,
    `💪 전투력 : ${getCombatPower(p).toLocaleString()} (증폭 Lv.${p.combatLevel || 0})`,
    ``,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${p.gold}개`,
    `🔑 비밀열쇠 : ${p.keys}개`,
    `📦 보급 : ${p.monthItems || 0}개`
  ].join('\n');
}

function createBattle(profile) {
  const matchRoll = Math.random() * 100;
  let mode = matchRoll >= 95 ? '스쿼드' : (matchRoll >= 85 ? '듀오' : '솔로');
  if (profile) profile.gamesPlayed = (profile.gamesPlayed || 0) + 1;

  return {
    turn: 1,
    maxTurn: MAX_TURN,
    survivors: rand(100, 130),
    hp: 100,
    alive: true,
    finished: false,
    buffs: [],
    mode: mode,
    helmetLevel: 0,
    helmetDurability: 0,
    vestLevel: 0,
    vestDurability: 0,
    accumulatedCash: 0,
    startSnapshot: { cash: profile?.cash || 0 },
  };
}

function processBuffs(battle) {
  if (!battle?.buffs?.length) return [];
  let msgs = [];
  for (let i = battle.buffs.length - 1; i >= 0; i--) {
    let buff = battle.buffs[i];
    if (buff.turnsLeft > 0) {
      const heal = Math.min(buff.healAmount, 100 - battle.hp);
      battle.hp = Math.min(100, battle.hp + buff.healAmount);
      buff.turnsLeft -= 1;
      msgs.push(`✨ ${buff.name}! HP +${heal} (남은 ${buff.turnsLeft}턴)`);
    }
    if (buff.turnsLeft <= 0) {
      msgs.push(`✨ ${buff.name} 효과 종료.`);
      battle.buffs.splice(i, 1);
    }
  }
  return msgs;
}

function battleStatusBoard(profile, battle) {
  const p = createProfile(profile);
  const b = battle || { turn: 1, maxTurn: MAX_TURN, survivors: 100, hp: 100, mode: '솔로' };
  const [wName] = getWeaponInfo(p.enhance);
  
  let lines = [
    `[배틀로얄] ${b.mode} | 턴 ${b.turn}/${b.maxTurn} | 생존 ${b.survivors}명`,
    `HP:${makeHpBar(b.hp)}`,
    `🛡️ 헬멧: Lv.${b.helmetLevel || 0} (${b.helmetDurability || 0}%)`,
    `🦺 조끼: Lv.${b.vestLevel || 0} (${b.vestDurability || 0}%)`,
  ];

  if (b.buffs?.length > 0) {
    lines.push(`✨ 버프: ${b.buffs.map(bf => `${bf.name}(${bf.turnsLeft})`).join(', ')}`);
  }

  lines.push(
    ``,
    `🎯 강화: +${p.enhance} ${wName} | ⭐ Lv.${p.level}`,
    `💵 현금: ${won(p.cash)} | 🧈 금괴: ${p.gold}개 | 🔑 열쇠: ${p.keys}개`
  );
  return lines.join('\n');
}

function checkDeath(battle) {
  if (battle && battle.hp <= 0) {
    battle.hp = 0;
    battle.alive = false;
    battle.finished = true;
    battle.buffs = [];
  }
}

function calculateCombatDamage(battle, rawDamage) {
  let reduce = ((battle.helmetLevel > 0 && battle.helmetDurability > 0) ? battle.helmetLevel * 3 : 0) +
               ((battle.vestLevel > 0 && battle.vestDurability > 0) ? battle.vestLevel * 3 : 0);
  
  if (battle.helmetLevel > 0 && battle.helmetDurability > 0) {
    battle.helmetDurability = Math.max(0, battle.helmetDurability - rand(15, 25));
    if (battle.helmetDurability === 0) battle.helmetLevel = 0;
  }
  if (battle.vestLevel > 0 && battle.vestDurability > 0) {
    battle.vestDurability = Math.max(0, battle.vestDurability - rand(15, 25));
    if (battle.vestDurability === 0) battle.vestLevel = 0;
  }

  return { finalDamage: Math.max(1, rawDamage - reduce), totalReduce: reduce };
}

function resolveFarmFight(profile, battle) {
  const mult = getGoldMultiplier(profile.enhance);
  const outcome = pickWeighted(FARM_TABLE);
  let mainText = '';
  let isDamageEvent = false;
  const target = getRandomSurvivorName();

  switch (outcome) {
    case 'supply': {
      const earned = rand(50000, 100000) * mult;
      profile.cash += earned;
      profile.gold += 1 + (profile.combatLevel || 0);
      profile.keys += 1;
      battle.helmetLevel = 3; battle.helmetDurability = 100;
      battle.vestLevel = 3; battle.vestDurability = 100;
      mainText = `[황금 보급품!] 최고급 방어구 장착 완료!\n(현금 ${won(earned)}, 금괴/열쇠 획득)`;
      break;
    }
    case 'gold':
      profile.gold += 1 + (profile.combatLevel || 0);
      mainText = `금괴 획득!`;
      break;
    case 'key':
      profile.keys += 1;
      mainText = `비밀열쇠 1개 획득!`;
      break;
    case 'jackpot': {
      const amt = rand(1000, 30000) * mult;
      profile.cash += amt;
      mainText = `[잭팟!] 현금 ${won(amt)} 획득!`;
      break;
    }
    case 'damage': {
      isDamageEvent = true;
      const { finalDamage } = calculateCombatDamage(battle, rand(12, 25));
      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);
      mainText = `${target}의 기습 공격! HP -${finalDamage}`;
      break;
    }
    case 'kill_single': {
      isDamageEvent = true;
      const { hitPartName, damageVal } = calculatePartDamage(profile);
      const { finalDamage } = calculateCombatDamage(battle, rand(8, 20));
      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const reward = Math.round((500 + (damageVal * 100)) * mult);
      profile.cash += reward;
      mainText = `[1 Kill] ${hitPartName} 적중! (+${won(reward)})\nHP -${finalDamage}`;
      break;
    }
    case 'kill_multi': {
      isDamageEvent = true;
      const kills = rand(2, 3);
      let totalDmgVal = 0;
      for (let i = 0; i < kills; i++) {
        totalDmgVal += calculatePartDamage(profile).damageVal;
      }
      const { finalDamage } = calculateCombatDamage(battle, rand(15, 30));
      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const reward = Math.round(((kills * 500) + (totalDmgVal * 100)) * mult);
      profile.cash += reward;
      mainText = `[${kills} Kill 멀티킬!] (+${won(reward)})\nHP -${finalDamage}`;
      break;
    }
  }
  return { text: mainText, isDamageEvent, category: outcome };
}

function resolveEscapeEvent(profile, battle) {
  if (!battle.buffs) battle.buffs = [];
  const outcome = pickWeighted(ESCAPE_TABLE);
  let text = '';

  if (outcome === 'instant_heal') {
    const heal = rand(20, 30);
    battle.hp = Math.min(100, battle.hp + heal);
    text = `💚 HP +${heal} 즉시 회복!`;
  } else if (outcome === 'drink' && !battle.buffs.length) {
    battle.buffs.push({ name: '에너지 드링크', turnsLeft: 2, healAmount: 5 });
    text = `🧪 [에너지 드링크] 효과 발동 (2턴간 HP +5)`;
  } else if (outcome === 'painkiller' && !battle.buffs.length) {
    battle.buffs.push({ name: '진통제', turnsLeft: 3, healAmount: 5 });
    text = `💊 [진통제] 효과 발동 (3턴간 HP +5)`;
  }
  return { text, category: outcome };
}

function processEnhance(profile) {
  if (profile.enhance >= ENHANCE_TABLE.length) {
    return { text: `최고 강화 단계 도달!`, status: 'max', imageUrl: getEnhanceImage('success', 20) };
  }
  const table = ENHANCE_TABLE[profile.enhance];
  if (profile.cash < table.cost) {
    return { text: `현금이 부족합니다! (필요: ${won(table.cost)})`, status: 'nomoney', imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  profile.cash -= table.cost;
  const oldEnhance = profile.enhance;
  const roll = Math.random();
  let status = 'fail';

  if (roll < table.success) {
    profile.enhance += 1;
    status = 'success';
  } else if (roll < table.success + table.keep) {
    status = 'keep';
  } else {
    profile.enhance = 0;
  }

  const [wName] = getWeaponInfo(profile.enhance);
  const msg = status === 'success' ? `[강화 성공] +${oldEnhance} ➔ +${profile.enhance}\n+${profile.enhance} ${wName}` :
              status === 'keep' ? `[강화 유지] +${oldEnhance}` : `[강화 실패] +0 초기화`;

  return { text: `${msg}\n(비용: ${won(table.cost)})`, status, imageUrl: getEnhanceImage(status, profile.enhance) };
}

function processUseKey(profile) {
  if (profile.keys <= 0) return { text: `비밀열쇠가 없습니다!`, imageUrl: getEnhanceImage('success', profile.enhance) };
  profile.keys -= 1;
  const expRes = addExp(profile, 350);
  let rewardMsg = '';

  if (Math.random() * 100 < 50) {
    const cashAmt = rand(100, 5000);
    profile.cash += cashAmt;
    rewardMsg = `현금 ${won(cashAmt)} 획득!`;
  } else {
    const goldAmt = rand(1, 10);
    profile.gold += goldAmt;
    rewardMsg = `금괴 ${goldAmt}개 획득!`;
  }
  return { text: `🔑 열쇠 사용:\n${rewardMsg}\n(EXP +${expRes.gained})\n\n${profileText(profile)}`, imageUrl: getEnhanceImage('success', profile.enhance) };
}

function processTurn(state, utterance) {
  state = state || {};
  let profile = createProfile(state.profile);
  let battle = state.battle;
  state.profile = profile;

  const isPlayingBattle = battle && battle.alive && !battle.finished;

  if (utterance === '/프로필' || utterance === '프로필') {
    return {
      text: isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile),
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
      imageUrl: getEnhanceImage('success', profile.enhance)
    };
  }

  if (utterance === '/4655') {
    profile.cash += 10000000;
    return { text: `🎁 [시크릿 코드] 현금 1,000만 원 지급!`, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  if (utterance.startsWith('/강화') || utterance.startsWith('강화')) {
    if (isPlayingBattle) return { text: `⚠️ 전투 중에는 강화할 수 없습니다!`, choices: BATTLE_CHOICES, imageUrl: null };
    const res = processEnhance(profile);
    return { text: res.text, choices: ENHANCE_CHOICES, imageUrl: res.imageUrl };
  }

  if (utterance === '열쇠' || utterance === 'usekey' || utterance === '/열쇠') {
    const res = processUseKey(profile);
    return { text: res.text, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, imageUrl: res.imageUrl };
  }

  if (utterance === '전투' || utterance === 'startbattle' || utterance === '/전투') {
    if (isPlayingBattle) return { text: `⚠️ 이미 전투가 진행 중입니다!`, choices: BATTLE_CHOICES, imageUrl: null };
    state.battle = createBattle(profile);
    return { text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, state.battle)}`, choices: BATTLE_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  if (!isPlayingBattle) {
    state.battle = createBattle(profile);
    return { text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, state.battle)}`, choices: BATTLE_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  let buffMsgs = processBuffs(battle);
  checkDeath(battle);
  if (!battle.alive) {
    return { text: `${buffMsgs.join('\n')}\n\n== [사망 탈락] ==\n\n${profileText(profile)}`, choices: LOBBY_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  if (utterance === '파밍' || utterance === 'farmfight' || utterance === '/파밍') {
    const outcome = resolveFarmFight(profile, battle);
    const expRes = addExp(profile, outcome.isDamageEvent ? 40 : 200);

    checkDeath(battle);
    if (!battle.alive) {
      return { text: `${outcome.text}\n\n== [사망 탈락] ==\n\n${profileText(profile)}`, choices: LOBBY_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
    }

    if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
      battle.finished = true;
      const winCash = rand(500, 3000);
      profile.cash += winCash;
      return { text: `${outcome.text}\n\n== 🏆 [우승] 치킨 획득! ==\n💵 상금: ${won(winCash)}\n\n${profileText(profile)}`, choices: LOBBY_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
    }

    battle.survivors = Math.max(1, battle.survivors - rand(3, 7));
    battle.turn += 1;

    let parts = [...buffMsgs, outcome.text, `(EXP +${expRes.gained})`, `\n${battleStatusBoard(profile, battle)}`].filter(Boolean);
    return { text: parts.join('\n'), choices: BATTLE_CHOICES, imageUrl: null };
  }

  if (utterance === '도망' || utterance === 'escape') {
    const outcome = resolveEscapeEvent(profile, battle);
    if (battle.turn >= battle.maxTurn) {
      battle.finished = true;
      return { text: `== 🏆 [우승] 최종 생존! ==\n\n${profileText(profile)}`, choices: LOBBY_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
    }

    battle.survivors = Math.max(1, battle.survivors - rand(3, 7));
    battle.turn += 1;

    let parts = [...buffMsgs, outcome.text, `\n${battleStatusBoard(profile, battle)}`].filter(Boolean);
    return { text: parts.join('\n'), choices: BATTLE_CHOICES, imageUrl: null };
  }

  return { text: `올바른 메뉴를 선택해주세요.`, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, imageUrl: getEnhanceImage('success', profile.enhance) };
}

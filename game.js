// ==========================================
// game.js
// ==========================================

const MAX_TURN = 15;

const BASE_URL = 'https://raw.githubusercontent.com/cjsxlrmt234-commits/bot-images/main'; 

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
  { cost: 10000, success: 1.00, keep: 0.00, fail: 0.00 },
  { cost: 15000, success: 0.95, keep: 0.05, fail: 0.00 },
  { cost: 20000, success: 0.90, keep: 0.10, fail: 0.00 },
  { cost: 30000, success: 0.85, keep: 0.14, fail: 0.01 },
  { cost: 50000, success: 0.80, keep: 0.17, fail: 0.03 },
  { cost: 70000, success: 0.70, keep: 0.25, fail: 0.05 },
  { cost: 100000, success: 0.60, keep: 0.30, fail: 0.10 },
  { cost: 140000, success: 0.50, keep: 0.40, fail: 0.10 },
  { cost: 190000, success: 0.40, keep: 0.50, fail: 0.10 },
  { cost: 250000, success: 0.35, keep: 0.55, fail: 0.10 },
  { cost: 320000, success: 0.30, keep: 0.60, fail: 0.10 },
  { cost: 400000, success: 0.25, keep: 0.65, fail: 0.10 },
  { cost: 490000, success: 0.22, keep: 0.68, fail: 0.10 },
  { cost: 590000, success: 0.20, keep: 0.70, fail: 0.10 },
  { cost: 700000, success: 0.18, keep: 0.72, fail: 0.10 },
  { cost: 820000, success: 0.15, keep: 0.75, fail: 0.10 },
  { cost: 950000, success: 0.13, keep: 0.77, fail: 0.10 },
  { cost: 1090000, success: 0.09, keep: 0.81, fail: 0.10 },
  { cost: 1240000, success: 0.07, keep: 0.83, fail: 0.10 },
  { cost: 1400000, success: 0.05, keep: 0.85, fail: 0.10 },
];

const REFINE_STARS = [
  '0성',        // 0성
  '☆',        // 1성
  '★',        // 2성
  '★☆',      // 3성
  '★★',      // 4성
  '★★☆',    // 5성
  '★★★',    // 6성
  '★★★☆',  // 7성
  '★★★★',  // 8성
  '★★★★☆',// 9성
  '★★★★★' // 10성
];

const REFINE_TABLE = [
  { cashCost: 10000000, goldCost: 10, success: 1.00, keep: 0.00, fail: 0.000, drop: 0.00 },
  { cashCost: 15000000, goldCost: 15, success: 0.90, keep: 0.10, fail: 0.000, drop: 0.00 },
  { cashCost: 20000000, goldCost: 20, success: 0.80, keep: 0.20, fail: 0.000, drop: 0.00 },
  { cashCost: 25000000, goldCost: 25, success: 0.70, keep: 0.25, fail: 0.000, drop: 0.05 },
  { cashCost: 25000000, goldCost: 25, success: 0.50, keep: 0.40, fail: 0.000, drop: 0.10 },
  { cashCost: 35000000, goldCost: 30, success: 0.40, keep: 0.575, fail: 0.025, drop: 0.00 },
  { cashCost: 40000000, goldCost: 35, success: 0.30, keep: 0.65, fail: 0.050, drop: 0.00 },
  { cashCost: 45000000, goldCost: 40, success: 0.20, keep: 0.725, fail: 0.075, drop: 0.00 },
  { cashCost: 50000000, goldCost: 45, success: 0.10, keep: 0.80, fail: 0.100, drop: 0.00 },
  { cashCost: 60000000, goldCost: 50, success: 0.05, keep: 0.80, fail: 0.150, drop: 0.00 },
];

const AMPLIFY_TABLE = [
  { level: 0, costNext: 1000, minGold: 1, maxGold: 1, multBonus: 0.00, headWeight: 0.00 },
  { level: 1, costNext: 2000, minGold: 1, maxGold: 2, multBonus: 0.20, headWeight: 0.05 },
  { level: 2, costNext: 3000, minGold: 1, maxGold: 3, multBonus: 0.40, headWeight: 0.10 },
  { level: 3, costNext: 4000, minGold: 1, maxGold: 4, multBonus: 0.60, headWeight: 0.15 },
  { level: 4, costNext: 5000, minGold: 1, maxGold: 5, multBonus: 0.80, headWeight: 0.20 },
  { level: 5, costNext: 6000, minGold: 2, maxGold: 6, multBonus: 1.00, headWeight: 0.30 },
  { level: 6, costNext: 7000, minGold: 2, maxGold: 7, multBonus: 1.20, headWeight: 0.40 },
  { level: 7, costNext: 8000, minGold: 2, maxGold: 8, multBonus: 1.50, headWeight: 0.50 },
  { level: 8, costNext: 9000, minGold: 2, maxGold: 9, multBonus: 1.60, headWeight: 0.65 },
  { level: 9, costNext: 10000, minGold: 2, maxGold: 10, multBonus: 1.80, headWeight: 0.80 },
  { level: 10, costNext: 0, minGold: 3, maxGold: 11, multBonus: 2.00, headWeight: 1.00 }
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
  { label: '파밍', action: '/파밍' },
  { label: '도망', action: '/도망' }
];

const LOBBY_CHOICES = [
  { label: '전투', action: '/전투' },
  { label: '강화', action: '/강화' },
  { label: '열쇠', action: '/열쇠' }
];

const ENHANCE_CHOICES = [
  { label: '강화', action: '/강화' },
  { label: '전투', action: '/전투' },
  { label: '열쇠', action: '/열쇠' }
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
  
  const adj = adjectives[rand(0, adjectives.length - 1)];
  const noun = nouns[rand(0, nouns.length - 1)];
  const num = String(rand(1000, 9999));

  return `${adj}${noun}${num}`;
}

function getEnhanceImage(statusType, enhanceLevel) {
  if (statusType === 'fail' && enhanceLevel > 0) {
    return `${BASE_URL}/fail.png`; 
  }
  let level = 0;
  if (enhanceLevel !== undefined && enhanceLevel !== null && !isNaN(enhanceLevel)) {
    level = Number(enhanceLevel);
  }
  level = Math.max(0, Math.min(20, level));
  return `${BASE_URL}/enhance_${level}.png`; 
}

function makeHpBar(hp) {
  const currentHp = Math.max(0, hp);
  const totalBlocks = 10;
  const filledBlocks = Math.round((currentHp / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + ` (${currentHp}%)`;
}

function getRequiredExp(level) {
  return (level || 1) * 200;
}

function getAmplifyInfo(combatLevel) {
  const lvl = Math.max(0, Math.min(10, combatLevel || 0));
  return AMPLIFY_TABLE[lvl];
}

function getGoldMultiplier(enhanceLevel) {
  return Number((1 + ((enhanceLevel || 0) * 0.05)).toFixed(2));
}

function getProfileGoldMultiplier(profile) {
  const baseMult = getGoldMultiplier(profile && profile.enhance);
  const ampInfo = getAmplifyInfo(profile ? profile.combatLevel : 0);
  const refineBonus = ((profile && profile.refine) || 0) * 0.10;
  return Number((baseMult + ampInfo.multBonus + refineBonus).toFixed(2));
}

function getExpMultiplier(profile) {
  return 1 + (((profile && profile.enhance) || 0) * 0.05);
}

function getEnhanceStats(enhanceLevel, combatLevel = 0) {
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));
  const baseMult = (1 + (lvl * 0.05)).toFixed(2);

  const baseHead = lvl * 1.00;
  const baseBody = 50.00 - (lvl * 0.50);
  const baseLeg = 50.00 - (lvl * 0.50);

  const ampInfo = getAmplifyInfo(combatLevel);
  const numHead = baseHead * (1 + ampInfo.headWeight);
  const numBody = Math.max(0, baseBody);
  const numLeg = Math.max(0, baseLeg);

  return {
    mult: `x${baseMult}`,
    head: `${baseHead.toFixed(2)}%`,
    body: `${baseBody.toFixed(2)}%`,
    leg: `${baseLeg.toFixed(2)}%`,
    numHead: numHead,
    numBody: numBody,
    numLeg: numLeg
  };
}

function formatEnhanceStatDiff(oldStats, newStats) {
  return [
    `    배율 | ${oldStats.mult} ➔ ${newStats.mult}`,
    `헤드 확률 | ${oldStats.head} ➔ ${newStats.head}`,
    ` 몸 확률 | ${oldStats.body} ➔ ${newStats.body}`,
    `다리 확률 | ${oldStats.leg} ➔ ${newStats.leg}`
  ].join('\n');
}

function getCombatPower(profile) {
  if (!profile) return 0;
  const combatLv = profile.combatLevel || 0;
  const enhance = profile.enhance || 0;
  const lvl = profile.level || 1;
  const refineLvl = profile.refine || 0;

  const basePower = (lvl * 100) + (combatLv * 500) + (enhance * 300);
  const refineBonusMult = 1 + (refineLvl * 0.02);

  return Math.floor(basePower * refineBonusMult);
}

function calculatePartDamage(profile) {
  const enhanceLevel = profile ? (profile.enhance || 0) : 0;
  const combatLevel = profile ? (profile.combatLevel || 0) : 0;
  const refineLevel = profile ? (profile.refine || 0) : 0;
  const job = profile ? profile.job : '';
  
  const stats = getEnhanceStats(enhanceLevel, combatLevel);
  
  let headProbability = stats.numHead;
  if (job === '센티넬') {
    headProbability += 10.0;
  }

  const roll = Math.random() * 100;

  let hitPartName = '다리';
  let damageVal = 0;

  if (roll < headProbability) {
    hitPartName = '헤드';
    const combatPower = getCombatPower(profile);
    const powerDamage = Math.floor(combatPower * 0.1);
    const baseDamage = Math.max(100, powerDamage) + (enhanceLevel * 15);
    
    const refineHeadMultiplier = 1 + (refineLevel * 0.01);
    damageVal = Math.floor(baseDamage * refineHeadMultiplier);
  } else if (roll < headProbability + stats.numBody) {
    hitPartName = '몸';
    damageVal = rand(31, 99);
  } else {
    hitPartName = '다리';
    damageVal = rand(1, 30);
  }

  return { hitPartName, damageVal };
}

function getWeaponInfo(enhanceLevel) {
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));
  return WEAPON_TIERS[lvl] || WEAPON_TIERS[0];
}

function addExp(profile, baseAmount) {
  if (!profile) return { leveledUp: false, msg: '', gained: 0 };
  if (!profile.level) profile.level = 1;
  if (!profile.exp) profile.exp = 0;

  const finalAmount = Math.round(baseAmount * getExpMultiplier(profile));
  profile.exp += finalAmount;
  let levelUpMessages = [];

  while (profile.exp >= getRequiredExp(profile.level)) {
    profile.exp -= getRequiredExp(profile.level);
    profile.level += 1;
    levelUpMessages.push(`🎉 [LEVEL UP!] Lv.${profile.level} 달성!`);
  }

  return { leveledUp: levelUpMessages.length > 0, msg: levelUpMessages.join('\n'), gained: finalAmount };
}

function createProfile(existing = {}) {
  const safeObj = existing || {};
  
  const nickname = (safeObj.nickname && safeObj.nickname.trim() !== '') 
    ? safeObj.nickname 
    : generateRandomNickname();

  return {
    cash: safeObj.cash ?? 0,
    gold: safeObj.gold ?? 0,
    keys: safeObj.keys ?? 0,
    enhance: safeObj.enhance ?? 0,
    refine: safeObj.refine ?? 0,
    level: safeObj.level ?? 1,
    exp: safeObj.exp ?? 0,
    combatLevel: safeObj.combatLevel ?? 0,
    job: safeObj.job ?? '없음',
    nickname: nickname,
    title: safeObj.title ?? '',
    monthItems: safeObj.monthItems ?? 0,
    gamesPlayed: safeObj.gamesPlayed ?? 0,
  };
}

function formatEarnedRewardsText(earnedStats) {
  if (!earnedStats) return '';
  let lines = [];
  if (earnedStats.cash && earnedStats.cash > 0) {
    lines.push(`💵 현금 +${won(earnedStats.cash)}`);
  }
  if (earnedStats.exp && earnedStats.exp > 0) {
    lines.push(`⭐ EXP +${earnedStats.exp.toLocaleString()}`);
  }
  if (earnedStats.gold && earnedStats.gold > 0) {
    lines.push(`🧈 금괴 +${earnedStats.gold.toLocaleString()}개`);
  }
  if (earnedStats.keys && earnedStats.keys > 0) {
    lines.push(`🔑 비밀열쇠 +${earnedStats.keys.toLocaleString()}개`);
  }
  return lines.join('\n');
}

function profileText(profile) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const [wName] = getWeaponInfo(p.enhance);
  const refineStar = REFINE_STARS[p.refine] || '0성';
  
  const totalMult = getProfileGoldMultiplier(p).toFixed(2);

  return [
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    `칭호 : ${p.title}`,
    `🎭 전직 : ${p.job}`,
    `🎮 플레이 판수 : ${(p.gamesPlayed || 0).toLocaleString()}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${refineStar}`,
    `⭐ Lv.${p.level} (${(p.exp || 0).toLocaleString()}/${reqExp.toLocaleString()})`,
    `💪 전투력 : ${combatPower.toLocaleString()} (증폭 Lv.${p.combatLevel || 0})`,
    `🔘 배율 : x${totalMult}`,
    ``,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${(p.gold || 0).toLocaleString()}개`,
    `🔑 비밀열쇠 : ${(p.keys || 0).toLocaleString()}개`,
    `📦 보급 : ${(p.monthItems || 0).toLocaleString()}개`
  ].join('\n');
}

function createBattle(profile) {
  const matchRoll = Math.random() * 100;
  let mode = '솔로';
  if (matchRoll >= 85 && matchRoll < 95) mode = '듀오';
  else if (matchRoll >= 95) mode = '스쿼드';

  const initialSurvivors = rand(100, 130);

  if (profile) {
    profile.gamesPlayed = (profile.gamesPlayed || 0) + 1;
  }

  return {
    turn: 1,
    maxTurn: MAX_TURN,
    survivors: initialSurvivors,
    hp: 100,
    alive: true,
    finished: false,
    result: null,
    buffs: [], 
    mode: mode,
    helmetLevel: 0, 
    helmetDurability: 0, 
    vestLevel: 0,    
    vestDurability: 0,    
    accumulatedCash: 0,
    accumulatedGold: 0,  
    accumulatedKeys: 0,  
    accumulatedExp: 0,   
    startSnapshot: { cash: profile?.cash || 0, gold: profile?.gold || 0, keys: profile?.keys || 0, monthItems: profile?.monthItems || 0 },
  };
}

function processBuffs(battle) {
  if (!battle || !battle.buffs || battle.buffs.length === 0) return [];
  let buffMessages = [];
  
  for (let i = battle.buffs.length - 1; i >= 0; i--) {
    let buff = battle.buffs[i];
    if (buff.turnsLeft > 0) {
      const heal = Math.min(buff.healAmount, 100 - battle.hp);
      battle.hp = Math.min(100, battle.hp + buff.healAmount);
      buff.turnsLeft -= 1;
      
      const icon = buff.name === '진통제' ? '💊' : (buff.name === '에너지 드링크' ? '🧪' : '✨');
      
      if (buff.turnsLeft > 0) {
        buffMessages.push(`${icon} ${buff.name} HP +${heal} 회복`);
      } else {
        battle.buffs.splice(i, 1);
      }
    } else {
      battle.buffs.splice(i, 1);
    }
  }
  return buffMessages;
}

function battleStatusBoard(profile, battle) {
  const p = createProfile(profile);
  const b = battle || { turn: 1, maxTurn: MAX_TURN, survivors: 100, hp: 100, mode: '솔로', helmetLevel: 0, helmetDurability: 0, vestLevel: 0, vestDurability: 0, buffs: [] };
  if (!b.buffs) b.buffs = [];

  const [wName] = getWeaponInfo(p.enhance);
  const reqExp = getRequiredExp(p.level);
  const refineStar = REFINE_STARS[p.refine] || '0성';
  
  const totalMult = getProfileGoldMultiplier(p).toFixed(2);

  const survivorsText = b.survivors <= 10 ? '?명' : `${b.survivors.toLocaleString()}명`;
  
  let boardLines = [
    `[배틀로얄 중] 매칭: ${b.mode}`,
    `| 턴 ${b.turn}/${b.maxTurn} | 생존: ${survivorsText}`,
    `HP:${makeHpBar(b.hp)}`,
    `🛡️ 헬멧: Lv.${b.helmetLevel || 0} (${b.helmetDurability ?? 0}%)`,
    `🦺 조끼: Lv.${b.vestLevel || 0} (${b.vestDurability ?? 0}%)`,
    `배율 (x${totalMult})`
  ];

  if (b.buffs.length > 0) {
    const buffDesc = b.buffs.map(buff => `${buff.name}(${buff.turnsLeft}턴 남음)`).join(', ');
    boardLines.push(`✨ 버프: ${buffDesc}`);
  }

  boardLines.push(
    ``,
    `🎭 전직 : ${p.job}`,
    `🎮 플레이 판수 : ${(p.gamesPlayed || 0).toLocaleString()}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${refineStar}`,
    `⭐ Lv.${p.level} (${(p.exp || 0).toLocaleString()}/${reqExp.toLocaleString()})`,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${(p.gold || 0).toLocaleString()}개`,
    `🔑 비밀열쇠 : ${(p.keys || 0).toLocaleString()}개`,
    `📦 보급 : ${(p.monthItems || 0).toLocaleString()}개`
  );

  return boardLines.join('\n');
}

function checkDeath(battle) {
  if (!battle) return;
  if (battle.hp <= 0) {
    battle.hp = 0;
    battle.alive = false;
    battle.finished = true;
    battle.result = 'dead';
    battle.buffs = []; 
  }
}

function calculateCombatDamage(battle, rawDamage) {
  let helmetReduce = (battle.helmetLevel > 0 && battle.helmetDurability > 0) ? (battle.helmetLevel * 3) : 0;
  let vestReduce = (battle.vestLevel > 0 && battle.vestDurability > 0) ? (battle.vestLevel * 3) : 0;
  
  const totalReduce = helmetReduce + vestReduce;
  const finalDamage = Math.max(1, rawDamage - totalReduce);

  let armorNotes = [];

  if (battle.helmetLevel > 0 && battle.helmetDurability > 0) {
    battle.helmetDurability = Math.max(0, battle.helmetDurability - rand(15, 25));
    if (battle.helmetDurability === 0) {
      battle.helmetLevel = 0;
      armorNotes.push(`💥 헬멧 내구도가 0이 되어 파괴되었습니다!`);
    }
  }

  if (battle.vestLevel > 0 && battle.vestDurability > 0) {
    battle.vestDurability = Math.max(0, battle.vestDurability - rand(15, 25));
    if (battle.vestDurability === 0) {
      battle.vestLevel = 0;
      armorNotes.push(`💥 조끼 내구도가 0이 되어 파괴되었습니다!`);
    }
  }

  return { finalDamage, totalReduce, armorNotes };
}

function resolveFarmFight(profile, battle) {
  let resultMessages = [];
  let earnedCash = 0;
  const targetName = getRandomSurvivorName(); 
  const combatLv = profile.combatLevel || 0;
  const mult = getProfileGoldMultiplier(profile);
  const ampInfo = getAmplifyInfo(combatLv);

  if (profile.job === '섀도우' && Math.random() < 0.01) {
    const boxRoll = Math.random() * 100;
    let lootMsg = '';
    if (boxRoll < 50) {
      const combatPower = getCombatPower(profile);
      const lootCash = combatPower * 100;
      profile.cash += lootCash;
      battle.accumulatedCash += lootCash;
      lootMsg = `현금 ${won(lootCash)}`;
    } else if (boxRoll < 90) {
      const goldBar = rand(ampInfo.minGold, ampInfo.maxGold);
      profile.gold += goldBar;
      battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBar;
      lootMsg = `금괴 ${goldBar.toLocaleString()}개`;
    } else {
      const keyCnt = rand(1, 3);
      profile.keys += keyCnt;
      battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keyCnt;
      lootMsg = `비밀열쇠 ${keyCnt}개`;
    }
    resultMessages.push(`🎁 [섀도우 전리품] 특별 전리품 상자를 발견하여 ${lootMsg}를 획득했습니다!`);
  }

  let outcome = pickWeighted(FARM_TABLE);

  if (outcome === 'supply') {
    const combatPower = getCombatPower(profile);
    earnedCash = combatPower * 10;
    profile.cash += earnedCash;
    
    const goldBonus = rand(ampInfo.minGold, ampInfo.maxGold);
    profile.gold += goldBonus;
    profile.keys += 1;
    
    battle.accumulatedCash += earnedCash;
    battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBonus;
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + 1;

    battle.helmetLevel = 3;
    battle.helmetDurability = 100;
    battle.vestLevel = 3;
    battle.vestDurability = 100;
    resultMessages.push(`[황금 보급품 획득!]🎁 최고급 Lv.3 헬멧 & Lv.3 조끼 장착 완료! (내구도 100%)\n(현금 ${won(earnedCash)}, 금괴 ${goldBonus.toLocaleString()}개, 열쇠 1개)`);
  } else {
    if (battle.turn >= 2 && Math.random() < 0.20) {
      if (battle.helmetLevel === 0) {
        battle.helmetLevel = 1;
        battle.helmetDurability = 100;
        resultMessages.push(`🛡️ Lv.1 헬멧 획득! (내구도 100%)`);
      } else if (battle.helmetLevel < 3 && Math.random() < 0.4) {
        battle.helmetLevel += 1;
        battle.helmetDurability = 100;
        resultMessages.push(`🛡️ Lv.${battle.helmetLevel} 헬멧으로 업그레이드! (내구도 100%)`);
      }
    }

    if (battle.turn >= 2 && Math.random() < 0.20) {
      if (battle.vestLevel === 0) {
        battle.vestLevel = 1;
        battle.vestDurability = 100;
        resultMessages.push(`🦺 Lv.1 조끼 획득! (내구도 100%)`);
      } else if (battle.vestLevel < 3 && Math.random() < 0.4) {
        battle.vestLevel += 1;
        battle.vestDurability = 100;
        resultMessages.push(`🦺 Lv.${battle.vestLevel} 조끼로 업그레이드! (내구도 100%)`);
      }
    }
  }

  let mainText = '';

  switch (outcome) {
    case 'supply':
      break;
    case 'gold': {
      const goldBonus = rand(ampInfo.minGold, ampInfo.maxGold);
      profile.gold += goldBonus;
      battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBonus;
      mainText = `금괴 ${goldBonus.toLocaleString()}개 획득!`;
      break;
    }
    case 'key': {
      profile.keys += 1;
      battle.accumulatedKeys = (battle.accumulatedKeys || 0) + 1;
      mainText = `비밀열쇠 1개 획득!`;
      break;
    }
    case 'jackpot': {
      const jackpotAmt = rand(1000, 30000) * mult;
      profile.cash += jackpotAmt;
      earnedCash = jackpotAmt;
      battle.accumulatedCash += earnedCash;
      mainText = `[소소한 잭팟!] 현금 ${won(jackpotAmt)} 획득!`;
      break;
    }
    case 'damage': {
      const rawDmg = rand(12, 25);
      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(battle, rawDmg);

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);
      
      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      mainText = `${targetName}의 사격을 받아 기습당했습니다!\nHP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    case 'kill_single': {
      const { hitPartName, damageVal } = calculatePartDamage(profile);
      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(battle, rand(8, 20));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const killCount = 1;
      const assistCount = 0;
      
      const killAssistReward = Math.round(((killCount * 500) + (assistCount * 250)) * mult);
      const damageReward = Math.round((damageVal * 100) * mult);
      const finalReward = damageReward + killAssistReward;
      
      profile.cash += finalReward;
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      let killDetailText = `당신이 적 부위(${hitPartName})에 명중시켜 서바이버가 사망했습니다.`;

      mainText = `[${killCount} KILL] (+${won(killAssistReward)})\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${damageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    case 'kill_multi': {
      let killCount = rand(2, 3);
      let isStingerTriggered = false;
      if (profile.job === '스팅거' && Math.random() < 0.01) {
        killCount = rand(4, 5);
        isStingerTriggered = true;
      }

      const assistCount = rand(0, 2);

      let totalDamageVal = 0;
      let hitPartsList = [];

      for (let i = 0; i < killCount; i++) {
        const { hitPartName, damageVal } = calculatePartDamage(profile);
        totalDamageVal += damageVal;
        hitPartsList.push(hitPartName);
      }

      const partsText = hitPartsList.join(', ');

      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(battle, rand(15, 30));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const killAssistReward = Math.round(((killCount * 500) + (assistCount * 250)) * mult);
      const damageReward = Math.round((totalDamageVal * 100) * mult);
      const finalReward = damageReward + killAssistReward;
      
      profile.cash += finalReward;
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';

      let killHeaderPrefix = isStingerTriggered ? `⚡ [스팅거 특성 발동!] ` : ``;
      let killTextHeader = assistCount > 0 
        ? `${killHeaderPrefix}[${killCount} KILL / ${assistCount} ASSIST] (+${won(killAssistReward)})`
        : `${killHeaderPrefix}[${killCount} KILL] (+${won(killAssistReward)})`;

      let killDetailText = `당신이 적 부위(${partsText})에 명중시켜 서바이버가 사망했습니다.`;

      mainText = `${killTextHeader}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    default: {
      const lootCash = rand(100, 500) * mult;
      profile.cash += lootCash;
      earnedCash = lootCash;
      battle.accumulatedCash += earnedCash;
      mainText = `현금 ${won(lootCash)} 획득!`;
      break;
    }
  }

  if (mainText) resultMessages.push(mainText);

  return { text: resultMessages.join('\n'), category: outcome, earnedCash };
}

function resolveEscapeEvent(profile, battle) {
  if (!battle.buffs) battle.buffs = [];
  const outcome = pickWeighted(ESCAPE_TABLE);
  let textResult = '';

  switch (outcome) {
    case 'instant_heal': {
      const healAmt = rand(20, 30);
      const actualHeal = Math.min(healAmt, 100 - battle.hp);
      battle.hp = Math.min(100, battle.hp + healAmt);
      textResult = `💚 HP +${actualHeal} 회복!`;
      break;
    }
    case 'drink': {
      const existingBuff = battle.buffs.find(b => b.name === '에너지 드링크');
      if (existingBuff) {
        existingBuff.turnsLeft += 2;
        textResult = `🧪 [에너지 드링크] 효과 추가 발동! (남은 지속 시간 +2턴 연장 ➔ 총 ${existingBuff.turnsLeft}턴)`;
      } else {
        battle.buffs.push({ name: '에너지 드링크', turnsLeft: 2, healAmount: 5 });
        textResult = `🧪 [에너지 드링크] 효과 발동 (2턴 동안 매턴 HP +5 회복)`;
      }
      break;
    }
    case 'painkiller': {
      const existingBuff = battle.buffs.find(b => b.name === '진통제');
      if (existingBuff) {
        existingBuff.turnsLeft += 3;
        textResult = `💊 [진통제] 효과 추가 발동! (남은 지속 시간 +3턴 연장 ➔ 총 ${existingBuff.turnsLeft}턴)`;
      } else {
        battle.buffs.push({ name: '진통제', turnsLeft: 3, healAmount: 5 });
        textResult = `💊 [진통제] 효과 발동 (3턴 동안 매턴 HP +5 회복)`;
      }
      break;
    }
  }

  return { text: textResult, category: outcome };
}

function applyZoneAttrition(battle) {
  if (!battle) return;
  if (battle.turn >= battle.maxTurn) {
    battle.survivors = 1;
    return;
  }
  const remainingTurns = battle.maxTurn - battle.turn;
  const dec = Math.max(4, Math.floor(battle.survivors / Math.max(1, remainingTurns)) + rand(2, 5));
  battle.survivors = Math.max(1, battle.survivors - dec);
}

function processEnhance(profile) {
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  if (profile.enhance >= ENHANCE_TABLE.length) {
    const [wName] = getWeaponInfo(profile.enhance);
    const stats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
    const detailMsg = formatEnhanceStatDiff(stats, stats);
    const refineStar = REFINE_STARS[profile.refine] || '0성';

    const maxText = [
      `최고 강화 단계 도달! (+20 ${wName})`,
      `+20 ${wName}`,
      detailMsg,
      ``,
      `🎯 강화 : +${profile.enhance} ${wName}`,
      `🔨 제련 : ${refineStar}`,
      `💪 전투력 : ${getCombatPower(profile).toLocaleString()} (증폭 Lv.${profile.combatLevel || 0})`,
      `🔘 배율 : x${getProfileGoldMultiplier(profile).toFixed(2)}`,
      ``,
      `💵 현금 : ${won(profile.cash)}`,
      `🧈 금괴 : ${(profile.gold || 0).toLocaleString()}개`,
      `🔑 비밀열쇠 : ${(profile.keys || 0).toLocaleString()}개`,
      `📦 보급 : ${(profile.monthItems || 0).toLocaleString()}개`
    ].join('\n');

    return { text: maxText, imageUrl: getEnhanceImage('success', 20), status: 'max' };
  }

  const tableData = ENHANCE_TABLE[profile.enhance];
  const cost = tableData.cost;

  if (profile.cash < cost) {
    return { text: `현금이 부족합니다! (필요: ${won(cost)})`, imageUrl: null, status: 'nomoney' };
  }

  profile.cash -= cost;
  const initialEnhance = profile.enhance;
  const oldStats = getEnhanceStats(initialEnhance, profile.combatLevel || 0);

  const roll = Math.random(); 
  let resultMsg = '';
  let resultStatus = '';

  if (roll < tableData.success) {
    profile.enhance += 1;
    resultStatus = 'success';
    const [currName] = getWeaponInfo(profile.enhance);
    const newStats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);

    resultMsg = `[강화성공] +${initialEnhance} ➔ +${profile.enhance}\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${detailMsg}`;
  } else if (roll < tableData.success + tableData.keep) {
    resultStatus = 'keep';
    const [currName] = getWeaponInfo(profile.enhance);
    const newStats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);

    resultMsg = `[강화 유지] +${initialEnhance} (변동 없음)\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${detailMsg}`;
  } else {
    resultStatus = 'fail';
    profile.enhance = 0;
    const [currName] = getWeaponInfo(profile.enhance);
    const newStats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);

    resultMsg = `[강화 실패] +${initialEnhance} ➔ +0 (초기화)\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${detailMsg}`;
  }

  return { 
    text: resultMsg, 
    imageUrl: getEnhanceImage(resultStatus, profile.enhance), 
    status: resultStatus 
  };
}

function processMultiEnhance(profile, count) {
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;

  const targetCount = Math.max(1, count);
  const initialLevel = profile.enhance;
  const initialStats = getEnhanceStats(initialLevel, profile.combatLevel || 0);

  let totalCost = 0;
  let successCount = 0;
  let keepCount = 0;
  let failCount = 0;
  let attempted = 0;
  let lastStatus = 'success';

  for (let i = 0; i < targetCount; i++) {
    if (profile.enhance >= ENHANCE_TABLE.length) break; 

    const tableData = ENHANCE_TABLE[profile.enhance];
    if (profile.cash < tableData.cost) break; 

    profile.cash -= tableData.cost;
    totalCost += tableData.cost;
    attempted++;

    const roll = Math.random();
    if (roll < tableData.success) {
      profile.enhance += 1;
      successCount++;
      lastStatus = 'success';
    } else if (roll < tableData.success + tableData.keep) {
      keepCount++;
      lastStatus = 'keep';
    } else {
      profile.enhance = 0;
      failCount++;
      lastStatus = 'fail';
    }
  }

  if (attempted === 0) {
    if (profile.enhance >= ENHANCE_TABLE.length) {
      const [wName] = getWeaponInfo(profile.enhance);
      const stats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
      const detailMsg = formatEnhanceStatDiff(stats, stats);
      const refineStar = REFINE_STARS[profile.refine] || '0성';

      const maxText = [
        `최고 강화 단계 도달! (+20 ${wName})`,
        `+20 ${wName}`,
        detailMsg,
        ``,
        `🎯 강화 : +${profile.enhance} ${wName}`,
        `🔨 제련 : ${refineStar}`,
        `💪 전투력 : ${getCombatPower(profile).toLocaleString()} (증폭 Lv.${profile.combatLevel || 0})`,
        `🔘 배율 : x${getProfileGoldMultiplier(profile).toFixed(2)}`,
        ``,
        `💵 현금 : ${won(profile.cash)}`,
        `🧈 금괴 : ${(profile.gold || 0).toLocaleString()}개`,
        `🔑 비밀열쇠 : ${(profile.keys || 0).toLocaleString()}개`,
        `📦 보급 : ${(profile.monthItems || 0).toLocaleString()}개`
      ].join('\n');

      return { 
        text: maxText, 
        imageUrl: getEnhanceImage('success', 20), 
        status: 'max' 
      };
    }
    const costNeeded = ENHANCE_TABLE[profile.enhance].cost;
    return { 
      text: `현금이 부족합니다! (필요: ${won(costNeeded)})`, 
      imageUrl: null, 
      status: 'nomoney' 
    };
  }

  const [currName] = getWeaponInfo(profile.enhance);
  const finalStats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
  const detailMsg = formatEnhanceStatDiff(initialStats, finalStats);

  let resultMsg = [
    `⚡ [연속 강화 ${attempted.toLocaleString()}회 완료]`,
    `결과 : +${initialLevel} ➔ +${profile.enhance}`,
    `📊 성공: ${successCount.toLocaleString()}회 | 유지: ${keepCount.toLocaleString()}회 | 실패: ${failCount.toLocaleString()}회`,
    `(총 소모 비용: ${won(totalCost)})`,
    ``,
    `+${profile.enhance} ${currName}`,
    detailMsg
  ].join('\n');

  return {
    text: resultMsg,
    imageUrl: getEnhanceImage(lastStatus, profile.enhance),
    status: lastStatus
  };
}

function processRefine(profile) {
  if (profile.refine === undefined || profile.refine < 0) profile.refine = 0;

  if (profile.refine >= 10) {
    return { text: `🔨 이미 최고 제련 단계(10성 ★★★★★)에 도달했습니다!`, imageUrl: null, status: 'max' };
  }

  const tableData = REFINE_TABLE[profile.refine];
  if (!tableData) {
    return { text: `⚠️ 제련 정보 불러오기에 실패했습니다.`, imageUrl: null, status: 'error' };
  }

  const cashCost = tableData.cashCost;
  const goldCost = tableData.goldCost;

  if (profile.cash < cashCost || (profile.gold || 0) < goldCost) {
    return { 
      text: `제련 재화가 부족합니다!\n(필요: ${won(cashCost)}, 금괴 ${goldCost}개)\n(보유: ${won(profile.cash)}, 금괴 ${(profile.gold || 0).toLocaleString()}개)`, 
      imageUrl: null, 
      status: 'noresource' 
    };
  }

  profile.cash -= cashCost;
  profile.gold -= goldCost;

  const currentRefine = profile.refine;
  const roll = Math.random();
  let resultMsg = '';
  let resultStatus = '';

  const pSuccess = tableData.success;
  const pKeep = pSuccess + tableData.keep;
  const pFail = pKeep + tableData.fail;

  if (roll < pSuccess) {
    profile.refine += 1;
    resultStatus = 'success';
    const oldStar = REFINE_STARS[currentRefine] || '0성';
    const newStar = REFINE_STARS[profile.refine] || '';
    resultMsg = `🔨 [제련 성공!] ${currentRefine}성(${oldStar}) ➔ ${profile.refine}성(${newStar})\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)`;
  } else if (roll < pKeep) {
    resultStatus = 'keep';
    const currStar = REFINE_STARS[currentRefine] || '0성';
    resultMsg = `🔨 [제련 유지] ${currentRefine}성(${currStar}) (변동 없음)\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)`;
  } else if (roll < pFail) {
    profile.refine = 0;
    resultStatus = 'fail';
    resultMsg = `💥 [제련 실패!] 무기 제련이 실패하여 0성으로 초기화되었습니다!\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)`;
  } else {
    profile.refine = Math.max(0, profile.refine - 1);
    resultStatus = 'drop';
    const newStar = REFINE_STARS[profile.refine] || '0성';
    resultMsg = `📉 [제련 하락] 제련 단계가 하락하여 ${profile.refine}성(${newStar})이 되었습니다.\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)`;
  }

  return {
    text: resultMsg,
    imageUrl: null,
    status: resultStatus
  };
}

function processGoldEnhance(profile) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  
  if (profile.combatLevel >= 10) {
    return { text: `✨ 증폭 레벨이 최고 단계(Lv.10)에 도달했습니다!`, imageUrl: null };
  }

  const costNext = AMPLIFY_TABLE[profile.combatLevel].costNext;
  if ((profile.gold || 0) < costNext) {
    return { text: `금괴가 부족합니다! (다음 증폭 필요량: 금괴 ${costNext.toLocaleString()}개)`, imageUrl: null };
  }

  const startLevel = profile.combatLevel;
  profile.gold -= costNext;
  profile.combatLevel += 1;

  const prevAmp = AMPLIFY_TABLE[startLevel];
  const nextAmp = AMPLIFY_TABLE[profile.combatLevel];

  const goldRangePrev = prevAmp.minGold === prevAmp.maxGold ? `${prevAmp.minGold.toLocaleString()}개` : `${prevAmp.minGold.toLocaleString()}~${prevAmp.maxGold.toLocaleString()}개`;
  const goldRangeNext = nextAmp.minGold === nextAmp.maxGold ? `${nextAmp.minGold.toLocaleString()}개` : `${nextAmp.minGold.toLocaleString()}~${nextAmp.maxGold.toLocaleString()}개`;

  const resultMsg = [
    `⚡ 증폭 강화 성공!`,
    `[증폭 Lv.${startLevel} ➔ Lv.${profile.combatLevel}]`,
    `• 소모 금괴: ${costNext.toLocaleString()}개`,
    `• 배율 가산: x${prevAmp.multBonus.toFixed(2)} ➔ x${nextAmp.multBonus.toFixed(2)}`,
    `• 헤드샷 가중치: ${Math.round(prevAmp.headWeight * 100)}% ➔ ${Math.round(nextAmp.headWeight * 100)}%`,
    `• 금괴 획득 수량: ${goldRangePrev} ➔ ${goldRangeNext}`
  ].join('\n');

  return { 
    text: resultMsg, 
    imageUrl: null 
  };
}

function processJobChange(profile, jobName) {
  if (!jobName) {
    const jobInfo = [
      `🎭 [전직 시스템 안내]`,
      `원하는 직업의 명령어를 입력해 전직할 수 있습니다. (예: /전직 스팅거)`,
      ``,
      `1. 스팅거 (Stinger)`,
      `   • 능력: 다중 처치 확률 증가 (1% 확률로 4~5 KILL 대량 학살 발동)`,
      ``,
      `2. 센티넬 (Sentinel)`,
      `   • 능력: 헤드샷 명중 확률 증가 (+10% 보정)`,
      ``,
      `3. 섀도우 (Shadow)`,
      `   • 능력: 전리품 상자 획득 (파밍 시 1% 확률로 전리품 상자 획득)`,
      `     - 현금 50% (전투력 × 100)`,
      `     - 금괴 40% (증폭 레벨 비례)`,
      `     - 비밀열쇠 10% (1~3개)`,
      ``,
      `현재 직업: ${profile.job || '없음'}`
    ].join('\n');

    return { text: jobInfo, imageUrl: null };
  }

  const validJobs = ['스팅거', '센티넬', '섀도우'];
  if (!validJobs.includes(jobName)) {
    return { text: `⚠️ 올바른 직업명이 아닙니다! (선택 가능: 스팅거, 센티넬, 섀도우)`, imageUrl: null };
  }

  profile.job = jobName;
  return { 
    text: `✨ [전직 성공!] 직업이 '${jobName}'(으)로 변경되었습니다!\n\n${profileText(profile)}`, 
    imageUrl: null 
  };
}

function processUseKey(profile) {
  if ((profile.keys || 0) <= 0) return { text: `비밀열쇠가 없습니다!\n\n${profileText(profile)}`, imageUrl: null };

  profile.keys -= 1;
  const randRoll = Math.random() * 100;
  let rewardMsg = '';

  if (randRoll < 50) { 
    const combatPower = getCombatPower(profile);
    const cashAmt = combatPower * 10;
    profile.cash += cashAmt;
    rewardMsg = `현금 ${won(cashAmt)} 획득!`;
  } else if (randRoll < 99) { 
    const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
    const goldBar = rand(ampInfo.minGold, ampInfo.maxGold);
    profile.gold = (profile.gold || 0) + goldBar;
    rewardMsg = `금괴 ${goldBar.toLocaleString()}개 획득!`;
  } else { 
    if (!profile.monthItems) profile.monthItems = 0;
    profile.monthItems += 1;
    rewardMsg = `✨ [1% 대박] 이달의 아이템 뽑기권 획득!`;
  }

  return { text: `🔑 열쇠 사용:\n${rewardMsg}`, imageUrl: null };
}

function startGame(existingProfile) {
  let profile = createProfile(existingProfile);
  let battle = createBattle(profile);

  return {
    text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`,
    imageUrl: null, 
    choices: BATTLE_CHOICES,
    category: 'start',
    state: { profile, battle }
  };
}

function processTurn(state, utterance) {
  if (!state || typeof state !== 'object') state = {};
  
  let profile = createProfile(state.profile);
  let battle = state.battle;

  state.profile = profile;

  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  const isPlayingBattle = battle && battle.alive && !battle.finished;

  let input = typeof utterance === 'string' ? utterance.trim() : '';

  if (!input.startsWith('/')) {
    const rawClean = input.replace(/^\//, '').trim();
    const validCommands = ['전투', '파밍', '도망', '강화', '제련', '증폭', '전직', '열쇠', '프로필', '연속강화'];
    
    if (validCommands.some(cmd => rawClean.startsWith(cmd))) {
      input = '/' + rawClean;
    } else {
      const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
      return {
        text: `⚠️ 모든 명령어는 명령어 앞에 '/'를 붙여야 동작합니다. (예: /전투, /프로필, /강화, /제련, /증폭, /전직)\n\n${currentBoard}`,
        imageUrl: null,
        choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES
      };
    }
  }

  if (input === '/') {
    const helpText = [
      `📜 [사용 가능한 명령어 안내]`,
      `• /전투 - 배틀로얄 시작`,
      `• /파밍 - 전투 중 파밍 진행`,
      `• /도망 - 전투 중 도망 및 HP 회복`,
      `• /강화 - 현금으로 무기 강화`,
      `• /제련 - 현금 및 금괴로 무기 제련`,
      `• /증폭 - 금괴로 전투력 증폭 강화`,
      `• /전직 [직업명] - 스팅거 / 센티넬 / 섀도우 전직`,
      `• /연속강화 [횟수] - 지정 횟수만큼 자동 강화`,
      `• /열쇠 - 비밀열쇠 사용`,
      `• /프로필 - 현재 정보 확인`
    ].join('\n');

    return {
      text: helpText,
      imageUrl: null,
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
      category: 'help'
    };
  }

  if (input === '/프로필') {
    const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
    return {
      text: currentBoard,
      imageUrl: null,
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
      category: 'profile'
    };
  }

  if (input === '/4655') {
    profile.cash += 1000000;
    const board = isPlayingBattle ? `\n\n${battleStatusBoard(profile, battle)}` : `\n\n${profileText(profile)}`;
    return { 
      text: `🎁 [시크릿 코드]\n현금 1,000,000원 지급!${board}`, 
      imageUrl: null, 
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, 
      category: 'secret' 
    };
  }

  if (input === '/5292') {
    profile.gold = (profile.gold || 0) + 1000;
    const board = isPlayingBattle ? `\n\n${battleStatusBoard(profile, battle)}` : `\n\n${profileText(profile)}`;
    return { 
      text: `🎁 [시크릿 코드]\n금괴 1,000개 지급!${board}`, 
      imageUrl: null, 
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, 
      category: 'secret' 
    };
  }

  if (isPlayingBattle && (input.startsWith('/강화') || input.startsWith('/제련') || input.startsWith('/증폭') || input.startsWith('/전직') || input.startsWith('/연속강화'))) {
    return { 
      text: `⚠️ 전투 중에는 강화, 제련, 증폭, 전직을 진행할 수 없습니다!\n\n${battleStatusBoard(profile, battle)}`, 
      imageUrl: null, 
      choices: BATTLE_CHOICES, 
      category: 'battle_block' 
    };
  }

  if (input.startsWith('/제련')) {
    const refineResult = processRefine(profile);
    return {
      text: refineResult.text + `\n\n` + profileText(profile),
      imageUrl: refineResult.imageUrl,
      choices: ENHANCE_CHOICES,
      category: 'refine'
    };
  }

  if (input.startsWith('/증폭')) {
    const goldResult = processGoldEnhance(profile);
    return { 
      text: goldResult.text, 
      imageUrl: goldResult.imageUrl, 
      choices: ENHANCE_CHOICES, 
      category: 'gold_enhance' 
    };
  }

  if (input.startsWith('/전직')) {
    const targetJob = input.replace('/전직', '').trim();
    const jobResult = processJobChange(profile, targetJob);
    return {
      text: jobResult.text,
      imageUrl: jobResult.imageUrl,
      choices: LOBBY_CHOICES,
      category: 'job'
    };
  }

  if (input.startsWith('/연속강화')) {
    const parts = input.replace('/연속강화', '').trim();
    let count = parseInt(parts, 10);
    if (isNaN(count) || count <= 1) count = 1;
    const multiResult = processMultiEnhance(profile, count);

    const isMax = multiResult.status === 'max';
    const finalText = isMax ? multiResult.text : multiResult.text + `\n\n` + profileText(profile);

    return { 
      text: finalText, 
      imageUrl: multiResult.imageUrl, 
      choices: ENHANCE_CHOICES, 
      category: 'enhance' 
    };
  }

  if (input === '/강화') {
    const enhanceResult = processEnhance(profile);

    const isMax = enhanceResult.status === 'max';
    const finalText = isMax ? enhanceResult.text : enhanceResult.text + `\n\n` + profileText(profile);

    return { 
      text: finalText, 
      imageUrl: enhanceResult.imageUrl, 
      choices: ENHANCE_CHOICES, 
      category: 'enhance' 
    };
  }

  if (input === '/열쇠') {
    const keyResult = processUseKey(profile);
    return { 
      text: keyResult.text, 
      imageUrl: keyResult.imageUrl, 
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, 
      category: 'usekey' 
    };
  }

  if (input === '/전투') {
    if (isPlayingBattle) {
      return { 
        text: `⚠️ 이미 배틀로얄이 진행 중입니다!\n현재 턴을 진행(/파밍 또는 /도망)해주세요.\n\n${battleStatusBoard(profile, battle)}`, 
        imageUrl: null, 
        choices: BATTLE_CHOICES, 
        category: 'battle_block' 
      };
    }

    battle = createBattle(profile);
    state.battle = battle;
    return { 
      text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`, 
      imageUrl: null, 
      choices: BATTLE_CHOICES, 
      category: 'start' 
    };
  }

  if (isPlayingBattle) {
    let buffMsgs = processBuffs(battle);
    checkDeath(battle);

    if (!battle.alive) {
      const earnedStats = {
        cash: battle.accumulatedCash || 0,
        gold: battle.accumulatedGold || 0,
        keys: battle.accumulatedKeys || 0,
        exp: battle.accumulatedExp || 0,
      };

      const rewardsText = formatEarnedRewardsText(earnedStats);
      const rewardsBlock = rewardsText ? `\n${rewardsText}` : '';

      return {
        text: `${buffMsgs.join('\n')}\n\n== [사망] 탈락 (${battle.turn}턴) ==${rewardsBlock}\n\n${profileText(profile)}`,
        imageUrl: null,
        choices: LOBBY_CHOICES,
        category: 'dead'
      };
    }

    if (input === '/파밍') {
      const outcome = resolveFarmFight(profile, battle);

      let baseExp = Math.round((outcome.earnedCash || 0) * 0.0005);
      let expRes = { gained: 0, leveledUp: false, msg: '' };
      let expMsg = '';
      let levelUpMsg = '';

      if (baseExp > 0) {
        expRes = addExp(profile, baseExp);
        battle.accumulatedExp = (battle.accumulatedExp || 0) + expRes.gained; 
        levelUpMsg = expRes.leveledUp ? `\n${expRes.msg}` : '';
        expMsg = ` (EXP +${expRes.gained.toLocaleString()})`;
      }

      checkDeath(battle);

      let combinedTextParts = [];
      if (buffMsgs.length > 0) combinedTextParts.push(buffMsgs.join('\n'));
      combinedTextParts.push(`${outcome.text}${expMsg}${levelUpMsg}`);

      if (!battle.alive) {
        const snap = battle.startSnapshot || { cash: profile.cash };
        const deltaCash = profile.cash - snap.cash;
        if (deltaCash > 0) {
          profile.cash = snap.cash + Math.round(deltaCash * 0.7);
          battle.accumulatedCash = Math.round(deltaCash * 0.7); 
        }

        const earnedStats = {
          cash: battle.accumulatedCash || 0,
          gold: battle.accumulatedGold || 0,
          keys: battle.accumulatedKeys || 0,
          exp: battle.accumulatedExp || 0,
        };

        const rewardsText = formatEarnedRewardsText(earnedStats);
        const rewardsBlock = rewardsText ? `\n${rewardsText}` : '';

        return {
          text: `${combinedTextParts.join('\n')}\n\n== [사망] 탈락 (${battle.turn}턴) ==${rewardsBlock}\n\n${profileText(profile)}`,
          imageUrl: null,
          choices: LOBBY_CHOICES,
          category: 'dead'
        };
      }

      if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
        battle.finished = true;
        battle.result = 'win';
        battle.buffs = []; 
        const winCash = rand(500, 3000);
        const winExp = rand(100, 500);
        profile.cash += winCash;
        const finalWinExp = addExp(profile, winExp);

        battle.accumulatedCash += winCash;
        battle.accumulatedExp = (battle.accumulatedExp || 0) + finalWinExp.gained;

        const earnedStats = {
          cash: battle.accumulatedCash || 0,
          gold: battle.accumulatedGold || 0,
          keys: battle.accumulatedKeys || 0,
          exp: battle.accumulatedExp || 0,
        };

        const rewardsText = formatEarnedRewardsText(earnedStats);
        const rewardsBlock = rewardsText ? `\n${rewardsText}` : '';

        return {
          text: `${combinedTextParts.join('\n')}\n\n== 🏆 [우승] 치킨 획득! (${battle.turn}턴) ==\n💵 추가 현금: ${won(winCash)} | EXP +${finalWinExp.gained.toLocaleString()}${rewardsBlock}\n\n${profileText(profile)}`,
          imageUrl: null,
          choices: LOBBY_CHOICES,
          category: 'win'
        };
      }

      applyZoneAttrition(battle);
      battle.turn += 1;

      return { 
        text: `${combinedTextParts.join('\n')}\n\n${battleStatusBoard(profile, battle)}`, 
        imageUrl: null, 
        choices: BATTLE_CHOICES,
        category: outcome.category
      };
    }

    if (input === '/도망') {
      const outcome = resolveEscapeEvent(profile, battle);

      checkDeath(battle);

      let combinedTextParts = [];
      if (buffMsgs.length > 0) combinedTextParts.push(buffMsgs.join('\n'));
      if (outcome.text) combinedTextParts.push(outcome.text);

      if (!battle.alive) {
        const earnedStats = {
          cash: battle.accumulatedCash || 0,
          gold: battle.accumulatedGold || 0,
          keys: battle.accumulatedKeys || 0,
          exp: battle.accumulatedExp || 0,
        };

        const rewardsText = formatEarnedRewardsText(earnedStats);
        const rewardsBlock = rewardsText ? `\n${rewardsText}` : '';

        return {
          text: `${combinedTextParts.join('\n')}\n\n== [사망] 탈락 (${battle.turn}턴) ==${rewardsBlock}\n\n${profileText(profile)}`,
          imageUrl: null,
          choices: LOBBY_CHOICES,
          category: 'dead'
        };
      }

      if (battle.turn >= battle.maxTurn) {
        battle.finished = true;
        battle.result = 'win';
        battle.buffs = []; 
        const winCash = rand(500, 3000);
        const winExp = rand(100, 500);
        profile.cash += winCash;
        const finalWinExp = addExp(profile, winExp);

        battle.accumulatedCash += winCash;
        battle.accumulatedExp = (battle.accumulatedExp || 0) + finalWinExp.gained;

        const earnedStats = {
          cash: battle.accumulatedCash || 0,
          gold: battle.accumulatedGold || 0,
          keys: battle.accumulatedKeys || 0,
          exp: battle.accumulatedExp || 0,
        };

        const rewardsText = formatEarnedRewardsText(earnedStats);
        const rewardsBlock = rewardsText ? `\n${rewardsText}` : '';

        return {
          text: `${combinedTextParts.length > 0 ? combinedTextParts.join('\n') + '\n\n' : ''}== 🏆 [우승] 최종 생존! (${battle.turn}턴) ==\n💵 추가 현금: ${won(winCash)} | EXP +${finalWinExp.gained.toLocaleString()}${rewardsBlock}\n\n${profileText(profile)}`,
          imageUrl: null,
          choices: LOBBY_CHOICES,
          category: 'win'
        };
      }

      applyZoneAttrition(battle);
      battle.turn += 1;

      const bodyText = combinedTextParts.length > 0 ? combinedTextParts.join('\n') + '\n\n' : '';

      return { 
        text: `${bodyText}${battleStatusBoard(profile, battle)}`, 
        imageUrl: null, 
        choices: BATTLE_CHOICES,
        category: outcome.category
      };
    }
  }

  const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
  return {
    text: `올바른 명령어(/)를 사용해주세요.\n\n${currentBoard}`,
    imageUrl: null,
    choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES
  };
}

module.exports = {
  createProfile,
  startGame,
  processTurn,
};

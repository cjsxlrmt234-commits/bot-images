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
  { cost: 1000, success: 1.00, keep: 0.00, fail: 0.00 }, // +0 -> +1
  { cost: 1500, success: 1.00, keep: 0.00, fail: 0.00 }, // +1 -> +2
  { cost: 2000, success: 0.90, keep: 0.10, fail: 0.00 }, // +2 -> +3
  { cost: 3000, success: 0.75, keep: 0.15, fail: 0.10 }, // +3 -> +4
  { cost: 5000, success: 0.70, keep: 0.20, fail: 0.10 }, // +4 -> +5
  { cost: 7000, success: 0.65, keep: 0.25, fail: 0.10 }, // +5 -> +6
  { cost: 10000, success: 0.60, keep: 0.30, fail: 0.10 }, // +6 -> +7
  { cost: 14000, success: 0.50, keep: 0.40, fail: 0.10 }, // +7 -> +8
  { cost: 19000, success: 0.40, keep: 0.50, fail: 0.10 }, // +8 -> +9
  { cost: 25000, success: 0.35, keep: 0.55, fail: 0.10 }, // +9 -> +10
  { cost: 32000, success: 0.30, keep: 0.60, fail: 0.10 }, // +10 -> +11
  { cost: 40000, success: 0.25, keep: 0.65, fail: 0.10 }, // +11 -> +12
  { cost: 49000, success: 0.22, keep: 0.68, fail: 0.10 }, // +12 -> +13
  { cost: 59000, success: 0.20, keep: 0.70, fail: 0.10 }, // +13 -> +14
  { cost: 70000, success: 0.18, keep: 0.72, fail: 0.10 }, // +14 -> +15
  { cost: 82000, success: 0.15, keep: 0.75, fail: 0.10 }, // +15 -> +16
  { cost: 95000, success: 0.13, keep: 0.77, fail: 0.10 }, // +16 -> +17
  { cost: 109000, success: 0.09, keep: 0.81, fail: 0.10 }, // +17 -> +18
  { cost: 124000, success: 0.07, keep: 0.83, fail: 0.10 }, // +18 -> +19
  { cost: 140000, success: 0.05, keep: 0.85, fail: 0.10 }, // +19 -> +20
];

const FARM_TABLE = [
  ['supply', 1.0],     
  ['gold', 10.0],      
  ['key', 5.0],        
  ['jackpot', 1.5],    
  ['damage', 32.0],    
  ['kill_single', 22.0], 
  ['kill_multi', 22.0],  
  ['normal_loot', 6.5]
];

const ESCAPE_TABLE = [
  ['supply', 1.0],     
  ['gold', 10.0],      
  ['key', 5.0],        
  ['jackpot', 1.5],    
  ['attack', 65.0],    
  ['heal', 17.5]
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
  { label: '연속강화', action: '연속강화' }
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

// 강화 상태별 이미지 처리 함수 (성공, 유지, 실패 시 각각 올바른 파일 매핑)
function getEnhanceImage(statusType, enhanceLevel) {
  if (statusType === 'fail') {
    return `${BASE_URL}/fail.png`; // 실패 시 고정된 fail.png 출력
  }
  const level = Math.max(0, Math.min(20, enhanceLevel ?? 0));
  return `${BASE_URL}/enhance_${level}.png`; // 성공/유지 시 enhance_{단계}.png 출력
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

function getGoldMultiplier(enhanceLevel) {
  return Number((1 + ((enhanceLevel || 0) * 0.05)).toFixed(2));
}

function getProfileGoldMultiplier(profile) {
  return getGoldMultiplier(profile && profile.enhance);
}

function getExpMultiplier(profile) {
  return 1 + (((profile && profile.enhance) || 0) * 0.05);
}

function getHealBonus(profile) {
  return ((profile && profile.enhance) || 0) * 1;
}

function getCombatPower(profile) {
  if (!profile) return 0;
  const combatLv = profile.combatLevel || 0;
  const enhance = profile.enhance || 0;
  const lvl = profile.level || 1;
  return (lvl * 100) + (combatLv * 500) + (enhance * 300);
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
  return {
    cash: safeObj.cash ?? 0,
    gold: safeObj.gold ?? 0,
    keys: safeObj.keys ?? 0,
    enhance: safeObj.enhance ?? 0,
    level: safeObj.level ?? 1,
    exp: safeObj.exp ?? 0,
    combatLevel: safeObj.combatLevel ?? 0,
    nickname: safeObj.nickname ?? '당신',
    monthItems: safeObj.monthItems ?? 0,
  };
}

function profileText(profile) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const [wName] = getWeaponInfo(p.enhance);
  const mult = getProfileGoldMultiplier(p);
  return [
    `[프로필 대시보드]`,
    `💵 현금: ${won(p.cash)} | 🧈 금괴:${p.gold}개`,
    `Lv.${p.level} (${p.exp}/${reqExp})`,
    `⚔️ 전투력: ${combatPower.toLocaleString()} (전투력Lv.${p.combatLevel || 0})`,
    `강화: +${p.enhance} ${wName}`,
    `배율 : (x${mult.toFixed(2)})`,
    `🔑 열쇠:${p.keys} | 🎁 뽑기권:${p.monthItems || 0}`,
  ].join('\n');
}

function createBattle(profile) {
  const matchRoll = Math.random() * 100;
  let mode = '솔로';
  if (matchRoll >= 85 && matchRoll < 95) mode = '듀오';
  else if (matchRoll >= 95) mode = '스쿼드';

  const initialSurvivors = rand(100, 130);

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
    helmetDamage: 0, 
    vestLevel: 0,   
    vestDamage: 0,  
    accumulatedCash: 0,
    accumulatedExp: 0,
    startSnapshot: { cash: profile?.cash || 0, gold: profile?.gold || 0, keys: profile?.keys || 0, monthItems: profile?.monthItems || 0 },
  };
}

function battleStatusBoard(profile, battle) {
  const p = createProfile(profile);
  const b = battle || { turn: 1, maxTurn: MAX_TURN, survivors: 100, hp: 100, mode: '솔로', helmetLevel: 0, helmetDamage: 0, vestLevel: 0, vestDamage: 0, buffs: [] };
  if (!b.buffs) b.buffs = [];

  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const [wName] = getWeaponInfo(p.enhance);
  const mult = getProfileGoldMultiplier(p);
  
  let boardLines = [
    `매칭모드: ${b.mode}`,
    `배율 : (x${mult.toFixed(2)})`,
    ``,
    `[턴 ${b.turn}/${b.maxTurn}] 생존: ${b.survivors}명`,
    `HP:${makeHpBar(b.hp)}`,
    `🛡️ 헬멧: Lv.${b.helmetLevel || 0} (${b.helmetDamage || 0}%)`,
    `🦺 조끼: Lv.${b.vestLevel || 0} (${b.vestDamage || 0}%)`,
  ];

  if (b.buffs.length > 0) {
    const buffDesc = b.buffs.map(buff => `${buff.name}(${buff.turnsLeft}턴 남음)`).join(', ');
    boardLines.push(`✨ 버프효과: ${buffDesc}`);
  }

  boardLines.push(
    `[프로필 대시보드]`,
    `💵 현금: ${won(p.cash)} | 🧈 ${p.gold}개`,
    `Lv.${p.level} (${p.exp}/${reqExp})`,
    `⚔️ 전투력: ${combatPower.toLocaleString()} (전투력Lv.${p.combatLevel || 0})`,
    `강화: +${p.enhance} ${wName}`,
    `🔑 ${p.keys}개 | 🎁 ${p.monthItems || 0}개`
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

function resolveFarmFight(profile, battle) {
  let resultMessages = [];
  let earnedCash = 0;
  const targetName = getRandomSurvivorName(); 

  let outcome = pickWeighted(FARM_TABLE);

  if (outcome === 'supply') {
    earnedCash = 500000 * getProfileGoldMultiplier(profile);
    profile.cash += earnedCash;
    profile.gold += 30;
    profile.keys += 3;
    battle.accumulatedCash += earnedCash;

    battle.helmetLevel = 3;
    battle.helmetDamage = 0;
    battle.vestLevel = 3;
    battle.vestDamage = 0;
    resultMessages.push(`[초대박 보급] 황금 보급품 획득!\n🎁 최고급 Lv.3 헬멧 & Lv.3 조끼 장착 완료!\n(현금 50만 원, 금괴 30개, 열쇠 3개)`);
  } else {
    if (battle.turn >= 2 && Math.random() < 0.15) {
      if (battle.helmetLevel === 0) {
        battle.helmetLevel = 1;
        battle.helmetDamage = 0;
        resultMessages.push(`헬멧 Lv.1 획득`);
      } else if (battle.helmetLevel < 3) {
        if (Math.random() < 0.5 && battle.helmetLevel < 2) {
          battle.helmetLevel += 1;
          battle.helmetDamage = 0;
          resultMessages.push(`헬멧 Lv.${battle.helmetLevel} 획득`);
        }
      }
    }

    if (battle.turn >= 2 && Math.random() < 0.15) {
      if (battle.vestLevel === 0) {
        battle.vestLevel = 1;
        battle.vestDamage = 0;
        resultMessages.push(`조끼 Lv.1 획득`);
      } else if (battle.vestLevel < 3) {
        if (Math.random() < 0.5 && battle.vestLevel < 2) {
          battle.vestLevel += 1;
          battle.vestDamage = 0;
          resultMessages.push(`조끼 Lv.${battle.vestLevel} 획득`);
        }
      }
    }
  }

  let mainText = '';
  switch (outcome) {
    case 'supply':
      break;
    case 'gold': {
      profile.gold += 1;
      const lootCash = rand(100, 400) * getProfileGoldMultiplier(profile);
      profile.cash += lootCash;
      earnedCash = lootCash;
      battle.accumulatedCash += earnedCash;
      mainText = `현금 ${won(lootCash)} 및\n금괴 1개 획득!`;
      break;
    }
    case 'key': {
      profile.keys += 1;
      const lootCash = rand(100, 300) * getProfileGoldMultiplier(profile);
      profile.cash += lootCash;
      earnedCash = lootCash;
      battle.accumulatedCash += earnedCash;
      mainText = `현금 ${won(lootCash)} 및\n비밀열쇠 1개 획득!`;
      break;
    }
    case 'jackpot': {
      const jackpotAmt = rand(500, 2000) * getProfileGoldMultiplier(profile);
      profile.cash += jackpotAmt;
      earnedCash = jackpotAmt;
      battle.accumulatedCash += earnedCash;
      mainText = `[소소한 잭팟!]\n현금 ${won(jackpotAmt)} 획득!`;
      break;
    }
    case 'damage': {
      let dmg = rand(10, 25);
      let helmetReduction = (battle.helmetLevel > 0 && battle.helmetDamage < 100) ? (battle.helmetLevel * 2) : 0;
      let vestReduction = (battle.vestLevel > 0 && battle.vestDamage < 100) ? (battle.vestLevel * 2) : 0;

      const totalReduction = helmetReduction + vestReduction;
      let finalReceiveDmg = Math.max(1, dmg - totalReduction);

      battle.hp = Math.max(0, battle.hp - finalReceiveDmg);
      
      if (battle.helmetLevel > 0) battle.helmetDamage = Math.min(100, (battle.helmetDamage || 0) + rand(40, 70));
      if (battle.vestLevel > 0) battle.vestDamage = Math.min(100, (battle.vestDamage || 0) + rand(40, 70));

      checkDeath(battle);
      
      let reductionMsg = totalReduction > 0 ? ` (방어 -${totalReduction})` : '';
      mainText = `${targetName}의 공격을 받아 부상을 입었습니다!\nHP -${finalReceiveDmg}${reductionMsg}`;
      break;
    }
    case 'kill_single': {
      const singleDmg = rand(10, 25);
      const rawReward = (singleDmg * 200) + (1 * 1000);
      const killReward = rawReward * getProfileGoldMultiplier(profile);
      profile.cash += killReward;
      earnedCash = killReward;
      battle.accumulatedCash += earnedCash;
      mainText = `${targetName}과의 교전 성공!\n현금 ${won(killReward)} 획득!`;
      break;
    }
    case 'kill_multi': {
      const enemyCount = rand(2, 4);
      let enemyLines = [];
      let totalDmgTaken = 0;

      for (let i = 0; i < enemyCount; i++) {
        const eName = getRandomSurvivorName();
        const eDmg = rand(10, 25);
        totalDmgTaken += eDmg;
        enemyLines.push(`${eName} 교전 중 피해 -${eDmg}`);
      }

      let helmetReduction = (battle.helmetLevel > 0 && battle.helmetDamage < 100) ? (battle.helmetLevel * 2) : 0;
      let vestReduction = (battle.vestLevel > 0 && battle.vestDamage < 100) ? (battle.vestLevel * 2) : 0;
      const totalReduction = helmetReduction + vestReduction;
      let finalDmg = Math.max(2, totalDmgTaken - totalReduction);

      battle.hp = Math.max(0, battle.hp - finalDmg);
      checkDeath(battle);

      const rawReward = (totalDmgTaken * 200) + (enemyCount * 1000);
      const killReward = rawReward * getProfileGoldMultiplier(profile);
      profile.cash += killReward;
      earnedCash = killReward;
      battle.accumulatedCash += earnedCash;

      mainText = `${enemyLines.join('\n')}\n총 HP -${finalDmg} | 현금 ${won(killReward)} 획득!`;
      break;
    }
    case 'normal_loot':
    default: {
      const lootCash = rand(100, 500) * getProfileGoldMultiplier(profile);
      profile.cash += lootCash;
      earnedCash = lootCash;
      battle.accumulatedCash += earnedCash;
      mainText = `현금 ${won(lootCash)} 획득!`;
      break;
    }
  }

  if (mainText) resultMessages.push(mainText);

  return { text: resultMessages.join('\n'), category: outcome };
}

function resolveEscapeEvent(profile, battle) {
  if (!battle.buffs) battle.buffs = [];
  const outcome = pickWeighted(ESCAPE_TABLE);
  let textResult = '';
  let category = outcome;
  let earnedCash = 0;
  const targetName = getRandomSurvivorName();

  if (outcome === 'supply') {
    earnedCash = 500000 * getProfileGoldMultiplier(profile);
    profile.cash += earnedCash;
    profile.gold += 30;
    profile.keys += 3;
    battle.accumulatedCash += earnedCash;
    battle.helmetLevel = 3;
    battle.helmetDamage = 0;
    battle.vestLevel = 3;
    battle.vestDamage = 0;
    textResult = `🏃‍♂️ 도망 중 우연히 발견한 [초대박 보급] 획득!\n🎁 최고급 Lv.3 헬멧 & Lv.3 조끼 장착 완료!`;
  } else {
    switch (outcome) {
      case 'gold': {
        profile.gold += 1;
        textResult = `🏃‍♂️ 도망 성공 및 금괴 1개 획득!`;
        break;
      }
      case 'key': {
        profile.keys += 1;
        textResult = `🏃‍♂️ 도망 성공 및 비밀열쇠 1개 획득!`;
        break;
      }
      case 'jackpot': {
        const jackpotAmt = rand(500, 2000) * getProfileGoldMultiplier(profile);
        profile.cash += jackpotAmt;
        earnedCash = jackpotAmt;
        battle.accumulatedCash += earnedCash;
        textResult = `🏃‍♂️ 도망 성공!\n[소소한 잭팟!] 현금 ${won(jackpotAmt)} 획득!`;
        break;
      }
      case 'heal': {
        const healAmt = (rand(8, 15) + getHealBonus(profile));
        battle.hp = Math.min(100, battle.hp + healAmt);
        textResult = `🏃‍♂️ 안전하게 은폐하여 숨 고르기 성공!\n체력 +${healAmt} 회복`;
        break;
      }
      case 'attack':
      default: {
        let dmg = rand(10, 25);
        let helmetReduction = (battle.helmetLevel > 0 && battle.helmetDamage < 100) ? (battle.helmetLevel * 2) : 0;
        let vestReduction = (battle.vestLevel > 0 && battle.vestDamage < 100) ? (battle.vestLevel * 2) : 0;

        const totalReduction = helmetReduction + vestReduction;
        let finalReceiveDmg = Math.max(1, dmg - totalReduction);

        battle.hp = Math.max(0, battle.hp - finalReceiveDmg);
        
        if (battle.helmetLevel > 0) battle.helmetDamage = Math.min(100, (battle.helmetDamage || 0) + rand(40, 70));
        if (battle.vestLevel > 0) battle.vestDamage = Math.min(100, (battle.vestDamage || 0) + rand(40, 70));

        checkDeath(battle);
        
        let reductionMsg = totalReduction > 0 ? ` (방어 -${totalReduction})` : '';
        textResult = `🏃‍♂️ 도망치던 중 ${targetName}의 사격을 받아 기습당했습니다!\nHP -${finalReceiveDmg}${reductionMsg}`;
        category = 'attack';
        break;
      }
    }
  }

  return { text: textResult, category };
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

// 강화 로직 (성공, 유지, 실패 시 이미지 URL 확실히 반환)
function processEnhance(profile) {
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  if (profile.enhance >= ENHANCE_TABLE.length) {
    const [wName] = getWeaponInfo(profile.enhance);
    const mult = getProfileGoldMultiplier(profile);
    return { text: `최고 강화 단계 도달! (+20 싱귤래리티)\n배율 (x${mult.toFixed(2)})\n+${profile.enhance} ${wName}\n\n${profileText(profile)}`, imageUrl: getEnhanceImage('success', 20), status: 'max' };
  }

  const tableData = ENHANCE_TABLE[profile.enhance];
  const cost = tableData.cost;

  if (profile.cash < cost) {
    return { text: `현금이 부족합니다! (필요: ${won(cost)})\n\n${profileText(profile)}`, imageUrl: null, status: 'nomoney' };
  }

  profile.cash -= cost;
  const initialEnhance = profile.enhance;
  const oldMult = getGoldMultiplier(initialEnhance);

  const roll = Math.random(); 
  let resultMsg = '';
  let resultStatus = '';

  if (roll < tableData.success) {
    profile.enhance += 1;
    resultStatus = 'success';
    const [currName] = getWeaponInfo(profile.enhance);
    const newMult = getProfileGoldMultiplier(profile);
    resultMsg = `[강화성공] +${initialEnhance} ➔ +${profile.enhance}\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n배율 (x${oldMult.toFixed(2)} ➔ x${newMult.toFixed(2)})`;
  } else if (roll < tableData.success + tableData.keep) {
    resultStatus = 'keep';
    const [currName] = getWeaponInfo(profile.enhance);
    const newMult = getProfileGoldMultiplier(profile);
    resultMsg = `[강화 유지] +${initialEnhance} (변동 없음)\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n배율 (x${newMult.toFixed(2)})`;
  } else {
    resultStatus = 'fail';
    profile.enhance = 0;
    const [currName] = getWeaponInfo(profile.enhance);
    const newMult = getProfileGoldMultiplier(profile);
    resultMsg = `[강화 실패] +${initialEnhance} ➔ +0 (초기화)\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n배율 (x${oldMult.toFixed(2)} ➔ x${newMult.toFixed(2)})`;
  }

  return { 
    text: `${resultMsg}\n\n${profileText(profile)}`, 
    imageUrl: getEnhanceImage(resultStatus, profile.enhance), 
    status: resultStatus 
  };
}

// 연속 강화 로직
function processAutoEnhance(profile) {
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  let initialEnhance = profile.enhance;
  let totalSpentCost = 0;
  let attempts = 0;
  let lastStatus = 'success';

  while (profile.enhance < ENHANCE_TABLE.length && attempts < 20) {
    const tableData = ENHANCE_TABLE[profile.enhance];
    const cost = tableData.cost;

    if (profile.cash < cost) {
      lastStatus = 'nomoney';
      break;
    }
    
    profile.cash -= cost;
    totalSpentCost += cost;
    attempts++;

    const roll = Math.random();

    if (roll < tableData.success) {
      profile.enhance += 1;
      lastStatus = 'success';
    } else if (roll < tableData.success + tableData.keep) {
      lastStatus = 'keep';
    } else {
      profile.enhance = 0;
      lastStatus = 'fail';
      break;
    }
  }

  const [currName] = getWeaponInfo(profile.enhance);
  const finalMult = getProfileGoldMultiplier(profile);
  let statusMsg = '';
  if (lastStatus === 'nomoney') statusMsg = `\n\n⚠️ 현금이 부족하여 연속 강화가 중단되었습니다.`;
  else if (lastStatus === 'fail') statusMsg = `\n\n⚠️ 강화 실패로 인해 0단계로 초기화되며 연속 강화가 중단되었습니다.`;
  else if (lastStatus === 'keep') statusMsg = `\n\n⚠️ 강화 유지가 발생하여 연속 강화가 종료되었습니다.`;

  return { 
    text: `연속 강화 결과: +${initialEnhance} ➔ +${profile.enhance} (총 소모 비용: ${won(totalSpentCost)})\n+${profile.enhance} ${currName}\n배율 (x${finalMult.toFixed(2)})${statusMsg}\n\n${profileText(profile)}`, 
    imageUrl: getEnhanceImage(lastStatus, profile.enhance) 
  };
}

function processGoldEnhance(profile, count = 1) {
  if (!profile.combatLevel) profile.combatLevel = 0;
  const costPerLevel = 1000;
  const totalCost = costPerLevel * count;

  if (profile.gold < totalCost) {
    return { text: `금괴가 부족합니다! (필요: ${totalCost}개)\n\n${profileText(profile)}`, imageUrl: null };
  }

  profile.gold -= totalCost;
  profile.combatLevel += count;
  return { text: `⚡ 전투력 레벨 +${count} 업그레이드 완료!\n\n${profileText(profile)}`, imageUrl: null };
}

function processUseKey(profile) {
  if (profile.keys <= 0) return { text: `비밀열쇠가 없습니다!\n\n${profileText(profile)}`, imageUrl: null };

  profile.keys -= 1;
  const earnedExp = Math.round(50000 * 0.007);
  const expRes = addExp(profile, earnedExp);
  const randRoll = Math.random() * 100;
  let rewardMsg = '';

  if (randRoll < 50) {
    const goldAmt = rand(100, 5000);
    profile.cash += goldAmt;
    rewardMsg = `현금 ${won(goldAmt)} 획득!`;
  } else if (randRoll < 99) {
    const goldBar = rand(1, 20);
    profile.gold += goldBar;
    rewardMsg = `금괴 ${goldBar}개 획득!`;
  } else {
    if (!profile.monthItems) profile.monthItems = 0;
    profile.monthItems += 1;
    rewardMsg = `✨ [1% 대박] 이달의 아이템 뽑기권 획득!`;
  }

  return { text: `🔑 열쇠 사용:\n${rewardMsg}\n(EXP +${expRes.gained})\n\n${profileText(profile)}`, imageUrl: null };
}

function startGame(existingProfile) {
  let profile = createProfile(existingProfile);
  const battle = createBattle(profile);

  return {
    state: { profile, battle },
    text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`,
    choices: BATTLE_CHOICES,
    category: 'start',
    imageUrl: null 
  };
}

function processTurn(state, utterance) {
  if (!state || typeof state !== 'object') state = {};
  
  let profile = createProfile(state.profile);
  let battle = state.battle;

  state.profile = profile;

  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  const isPlayingBattle = battle && battle.alive && !battle.finished;

  if (utterance === '/4655') {
    profile.cash += 10000000;
    const board = isPlayingBattle ? `\n\n${battleStatusBoard(profile, battle)}` : `\n\n${profileText(profile)}`;
    return { text: `🎁 [시크릿 코드]\n현금 10,000,000원 지급!${board}`, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, category: 'secret', imageUrl: null };
  }

  if (isPlayingBattle && (utterance.includes('강화') || utterance.includes('/강화') || utterance === '연속강화' || utterance.startsWith('금괴강화'))) {
    return { text: `⚠️ 전투 중에는 강화를 진행할 수 없습니다!\n\n${battleStatusBoard(profile, battle)}`, choices: BATTLE_CHOICES, category: 'battle_block', imageUrl: null };
  }

  if (utterance === '/연속강화' || utterance === '연속강화') {
    const autoResult = processAutoEnhance(profile);
    return { text: autoResult.text, choices: ENHANCE_CHOICES, category: 'enhance', imageUrl: autoResult.imageUrl };
  }

  if (utterance.startsWith('/금괴강화') || utterance.startsWith('금괴강화')) {
    const parts = utterance.replace('/금괴강화', '').replace('금괴강화', '').trim();
    let count = parseInt(parts, 10);
    if (isNaN(count) || count <= 1) count = 1;
    const goldResult = processGoldEnhance(profile, count);
    return { text: goldResult.text, choices: ENHANCE_CHOICES, category: 'gold_enhance', imageUrl: goldResult.imageUrl };
  }

  if (utterance.startsWith('/강화') || utterance.startsWith('강화')) {
    const enhanceResult = processEnhance(profile);
    return { text: enhanceResult.text, choices: ENHANCE_CHOICES, category: 'enhance', imageUrl: enhanceResult.imageUrl };
  }

  if (utterance === '열쇠' || utterance === 'usekey' || utterance === '/열쇠') {
    const keyResult = processUseKey(profile);
    return { text: keyResult.text, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, category: 'usekey', imageUrl: null };
  }

  // ✅ [수정됨] 전투 명령(전투 시작/재시작)이 들어왔을 때 이미 전투 중이라면 새로 시작하지 않고 경고문구 출력
  if (utterance === '전투' || utterance === 'startbattle' || utterance === '/전투') {
    if (isPlayingBattle) {
      return { 
        text: `⚠️ 이미 배틀로얄이 진행 중입니다!\n현재 턴을 진행(파밍 또는 도망)해주세요.\n\n${battleStatusBoard(profile, battle)}`, 
        choices: BATTLE_CHOICES, 
        category: 'battle_block', 
        imageUrl: null 
      };
    }

    battle = createBattle(profile);
    state.battle = battle;
    return { text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`, choices: BATTLE_CHOICES, category: 'start', imageUrl: null };
  }

  if (!battle || battle.finished || !battle.alive) {
    battle = createBattle(profile);
    state.battle = battle;
    return { text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`, choices: BATTLE_CHOICES, category: 'start', imageUrl: null };
  }

  if (utterance === '파밍' || utterance === 'farmfight' || utterance === '/파밍') {
    const outcome = resolveFarmFight(profile, battle);

    const earnedExp = Math.round((battle.accumulatedCash || 20000) * 0.007);
    const expRes = addExp(profile, earnedExp);
    let levelUpMsg = expRes.leveledUp ? `\n${expRes.msg}` : '';

    checkDeath(battle);

    if (!battle.alive) {
      const snap = battle.startSnapshot || { cash: profile.cash };
      const deltaCash = profile.cash - snap.cash;
      if (deltaCash > 0) profile.cash = snap.cash + Math.round(deltaCash * 0.7);

      return {
        text: `${outcome.text}\n(EXP +${expRes.gained})${levelUpMsg}\n\n== [사망] 탈락 (${battle.turn}턴) ==\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'dead',
        imageUrl: null
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

      return {
        text: `${outcome.text}\n\n== 🏆 [우승] 치킨 획득! (${battle.turn}턴) ==\n💵 추가 현금: ${won(winCash)} | EXP +${finalWinExp.gained}\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'win',
        imageUrl: null
      };
    }

    applyZoneAttrition(battle);
    battle.turn += 1;

    return { 
      text: `${outcome.text}\n(EXP +${expRes.gained})${levelUpMsg}\n\n${battleStatusBoard(profile, battle)}`, 
      choices: BATTLE_CHOICES,
      category: outcome.category,
      imageUrl: null 
    };
  }

  if (utterance === '도망' || utterance === 'escape') {
    const outcome = resolveEscapeEvent(profile, battle);

    const earnedExp = Math.round(15000 * 0.007);
    const expRes = addExp(profile, earnedExp);
    let levelUpMsg = expRes.leveledUp ? `\n${expRes.msg}` : '';

    checkDeath(battle);

    if (!battle.alive) {
      const snap = battle.startSnapshot || { cash: profile.cash };
      const deltaCash = profile.cash - snap.cash;
      if (deltaCash > 0) profile.cash = snap.cash + Math.round(deltaCash * 0.7);

      return {
        text: `${outcome.text}\n(EXP +${expRes.gained})${levelUpMsg}\n\n== [사망] 탈락 (${battle.turn}턴) ==\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'dead',
        imageUrl: null 
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

      return {
        text: `${outcome.text}\n\n== 🏆 [우승] 최종 생존! (${battle.turn}턴) ==\n💵 추가 현금: ${won(winCash)} | EXP +${finalWinExp.gained}\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'win',
        imageUrl: null 
      };
    }

    applyZoneAttrition(battle);
    battle.turn += 1;

    return {
      text: `${outcome.text}\n(EXP +${expRes.gained})${levelUpMsg}\n\n${battleStatusBoard(profile, battle)}`,
      choices: BATTLE_CHOICES,
      category: outcome.category,
      imageUrl: null 
    };
  }

  const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
  return {
    text: `올바른 메뉴를 선택해주세요.\n\n${currentBoard}`,
    choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
    imageUrl: null
  };
}

module.exports = {
  createProfile,
  startGame,
  processTurn,
};
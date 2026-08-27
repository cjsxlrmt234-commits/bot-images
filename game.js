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

function getGoldMultiplier(enhanceLevel) {
  return Number((1 + ((enhanceLevel || 0) * 0.05)).toFixed(2));
}

function getProfileGoldMultiplier(profile) {
  return getGoldMultiplier(profile && profile.enhance);
}

function getExpMultiplier(profile) {
  return 1 + (((profile && profile.enhance) || 0) * 0.05);
}

function getEnhanceStats(enhanceLevel) {
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));
  const mult = (1 + (lvl * 0.05)).toFixed(2);
  const head = (lvl * 1.00).toFixed(2);
  const body = (50.00 - (lvl * 0.50)).toFixed(2);
  const leg = (50.00 - (lvl * 0.50)).toFixed(2);
  
  return {
    mult: `x${mult}`,
    head: `${head}%`,
    body: `${body}%`,
    leg: `${leg}%`,
    numHead: lvl * 1.00,
    numBody: 50.00 - (lvl * 0.50),
    numLeg: 50.00 - (lvl * 0.50)
  };
}

function formatEnhanceStatDiff(oldStats, newStats) {
  return [
    `　　 배율 | ${oldStats.mult} -> ${newStats.mult}`,
    `헤드 확률 | ${oldStats.head} -> ${newStats.head}`,
    `　몸 확률 | ${oldStats.body} -> ${newStats.body}`,
    `다리 확률 | ${oldStats.leg} -> ${newStats.leg}`
  ].join('\n');
}

function getCombatPower(profile) {
  if (!profile) return 0;
  const combatLv = profile.combatLevel || 0;
  const enhance = profile.enhance || 0;
  const lvl = profile.level || 1;
  return (lvl * 100) + (combatLv * 500) + (enhance * 300);
}

function calculatePartDamage(profile) {
  const enhanceLevel = profile ? (profile.enhance || 0) : 0;
  const stats = getEnhanceStats(enhanceLevel);
  const roll = Math.random() * 100;

  let hitPart = 'leg';
  let hitPartName = '다리';
  let damageVal = 0;

  if (roll < stats.numHead) {
    hitPart = 'head';
    hitPartName = '헤드';
    
    const combatPower = getCombatPower(profile);
    const powerDamage = Math.floor(combatPower * 0.1);
    
    damageVal = Math.max(100, powerDamage) + (enhanceLevel * 15);
  } else if (roll < stats.numHead + stats.numBody) {
    hitPart = 'body';
    hitPartName = '몸';
    damageVal = rand(31, 99);
  } else {
    hitPart = 'leg';
    hitPartName = '다리';
    damageVal = rand(1, 30);
  }

  return { hitPart, hitPartName, damageVal };
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
    nickname: safeObj.nickname || generateRandomNickname(),
    title: safeObj.title ?? '',
    refine: safeObj.refine ?? '',
    monthItems: safeObj.monthItems ?? 0,
    gamesPlayed: safeObj.gamesPlayed ?? 0,
  };
}

function profileText(profile) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const [wName] = getWeaponInfo(p.enhance);
  
  return [
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    ` 칭호 : ${p.title}`,
    `🎮 플레이 판수 : ${p.gamesPlayed}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${p.refine}`,
    `⭐ Lv.${p.level} (${p.exp}/${reqExp})`,
    `💪 전투력 : ${combatPower.toLocaleString()} (증폭 Lv.${p.combatLevel || 0})`,
    ``,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${p.gold}개`,
    `🔑 비밀열쇠 : ${p.keys}개`,
    `📦 보급 : ${p.monthItems || 0}개`
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
      buffMessages.push(`✨ ${buff.name} 효과! HP +${heal} 회복 (남은 효과: ${buff.turnsLeft}턴)`);
    }
    if (buff.turnsLeft <= 0) {
      buffMessages.push(`✨ ${buff.name} 지속 시간이 종료되었습니다.`);
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
  const expMultiplier = getExpMultiplier(p);
  
  let boardLines = [
    `[배틀로얄 중] 매칭: ${b.mode}`,
    `| 턴 ${b.turn}/${b.maxTurn} | 생존: ${b.survivors}명`,
    `HP:${makeHpBar(b.hp)}`,
    `🛡️ 헬멧: Lv.${b.helmetLevel || 0} (${b.helmetDurability ?? 0}%)`,
    `🦺 조끼: Lv.${b.vestLevel || 0} (${b.vestDurability ?? 0}%)`,
    `배율 (x${expMultiplier.toFixed(2)})`
  ];

  if (b.buffs.length > 0) {
    const buffDesc = b.buffs.map(buff => `${buff.name}(${buff.turnsLeft}턴 남음)`).join(', ');
    boardLines.push(`✨ 버프: ${buffDesc}`);
  }

  boardLines.push(
    ``,
    `🎮 플레이 판수 : ${p.gamesPlayed}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${p.refine}`,
    `⭐ Lv.${p.level} (${p.exp}/${reqExp})`,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${p.gold}개`,
    `🔑 비밀열쇠 : ${p.keys}개`,
    `📦 보급 : ${p.monthItems || 0}개`
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

  let outcome = pickWeighted(FARM_TABLE);

  if (outcome === 'supply') {
    earnedCash = rand(50000, 100000) * mult;
    profile.cash += earnedCash;
    const goldBonus = 1 + combatLv;
    profile.gold += goldBonus;
    profile.keys += 1;
    battle.accumulatedCash += earnedCash;

    battle.helmetLevel = 3;
    battle.helmetDurability = 100;
    battle.vestLevel = 3;
    battle.vestDurability = 100;
    resultMessages.push(`[황금 보급품 획득!]🎁 최고급 Lv.3 헬멧 & Lv.3 조끼 장착 완료! (내구도 100%)\n(현금 ${won(earnedCash)}, 금괴 ${goldBonus}개, 열쇠 1개)`);
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
  let isDamageEvent = false;

  switch (outcome) {
    case 'supply':
      break;
    case 'gold': {
      const goldBonus = 1 + combatLv;
      profile.gold += goldBonus;
      mainText = `금괴 ${goldBonus}개 획득!`;
      break;
    }
    case 'key': {
      profile.keys += 1;
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
      isDamageEvent = true;
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
      isDamageEvent = true;
      
      const { hitPart, hitPartName, damageVal } = calculatePartDamage(profile);
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

      mainText = `[${killCount} Kill](+${won(killAssistReward)})\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${damageVal}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    case 'kill_multi': {
      isDamageEvent = true;
      const killCount = rand(2, 3);
      const assistCount = rand(0, 2);

      let totalDamageVal = 0;
      let hitPartsList = [];

      for (let i = 0; i < killCount; i++) {
        const { hitPartName, damageVal } = calculatePartDamage(profile);
        totalDamageVal += damageVal;
        hitPartsList.push(hitPartName);
      }

      // 중복 부위 제거 (예: ['다리', '다리'] -> ['다리'])
      const uniqueParts = [...new Set(hitPartsList)];
      const partsText = uniqueParts.join(', ');

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

      let killTextHeader = assistCount > 0 
        ? `[${killCount} Kill / ${assistCount} Assist](+${won(killAssistReward)})`
        : `[${killCount} Kill](+${won(killAssistReward)})`;

      let killDetailText = `당신이 적 부위(${partsText})에 명중시켜 서바이버가 사망했습니다.`;

      mainText = `${killTextHeader}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal}] (+${won(damageReward)})\n` +
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

  return { text: resultMessages.join('\n'), category: outcome, isDamageEvent };
}

function resolveEscapeEvent(profile, battle) {
  if (!battle.buffs) battle.buffs = [];
  const outcome = pickWeighted(ESCAPE_TABLE);
  let textResult = '';
  let category = outcome;
  const activeBuffCount = battle.buffs.length;

  switch (outcome) {
    case 'instant_heal': {
      const healAmt = rand(20, 30);
      const actualHeal = Math.min(healAmt, 100 - battle.hp);
      battle.hp = Math.min(100, battle.hp + healAmt);
      textResult = `💚 HP +${actualHeal} 회복!`;
      break;
    }
    case 'drink': {
      if (activeBuffCount > 0) {
        textResult = ``;
      } else {
        battle.buffs.push({ name: '에너지 드링크', turnsLeft: 2, healAmount: 5 });
        textResult = `🧪 [에너지 드링크] 효과 발동 (2턴 동안 매턴 HP +5 회복)`;
      }
      break;
    }
    case 'painkiller': {
      if (activeBuffCount > 0) {
        textResult = ``;
      } else {
        battle.buffs.push({ name: '진통제', turnsLeft: 3, healAmount: 5 });
        textResult = `💊 [진통제] 효과 발동 (3턴 동안 매턴 HP +5 회복)`;
      }
      break;
    }
    default: {
      textResult = ``;
      break;
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

function processEnhance(profile) {
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  if (profile.enhance >= ENHANCE_TABLE.length) {
    const [wName] = getWeaponInfo(profile.enhance);
    const stats = getEnhanceStats(profile.enhance);
    const detailMsg = formatEnhanceStatDiff(stats, stats);
    return { text: `최고 강화 단계 도달! (+20 싱귤래리티)\n+${profile.enhance} ${wName}\n${detailMsg}`, imageUrl: getEnhanceImage('success', 20), status: 'max' };
  }

  const tableData = ENHANCE_TABLE[profile.enhance];
  const cost = tableData.cost;

  if (profile.cash < cost) {
    return { text: `현금이 부족합니다! (필요: ${won(cost)})`, imageUrl: getEnhanceImage('success', profile.enhance), status: 'nomoney' };
  }

  profile.cash -= cost;
  const initialEnhance = profile.enhance;
  const oldStats = getEnhanceStats(initialEnhance);

  const roll = Math.random(); 
  let resultMsg = '';
  let resultStatus = '';

  if (roll < tableData.success) {
    profile.enhance += 1;
    resultStatus = 'success';
    const [currName] = getWeaponInfo(profile.enhance);
    const newStats = getEnhanceStats(profile.enhance);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);

    resultMsg = `[강화성공] +${initialEnhance} ➔ +${profile.enhance}\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${detailMsg}`;
  } else if (roll < tableData.success + tableData.keep) {
    resultStatus = 'keep';
    const [currName] = getWeaponInfo(profile.enhance);
    const newStats = getEnhanceStats(profile.enhance);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);

    resultMsg = `[강화 유지] +${initialEnhance} (변동 없음)\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${detailMsg}`;
  } else {
    resultStatus = 'fail';
    profile.enhance = 0;
    const [currName] = getWeaponInfo(profile.enhance);
    const newStats = getEnhanceStats(profile.enhance);
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
  const initialStats = getEnhanceStats(initialLevel);

  let totalCost = 0;
  let successCount = 0;
  let keepCount = 0;
  let failCount = 0;
  let attempted = 0;
  let lastStatus = 'success';

  for (let i = 0; i < targetCount; i++) {
    if (profile.enhance >= ENHANCE_TABLE.length) {
      break; 
    }

    const tableData = ENHANCE_TABLE[profile.enhance];
    if (profile.cash < tableData.cost) {
      break; 
    }

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
      const stats = getEnhanceStats(profile.enhance);
      const detailMsg = formatEnhanceStatDiff(stats, stats);
      return { 
        text: `최고 강화 단계 도달! (+20 싱귤래리티)\n+${profile.enhance} ${wName}\n${detailMsg}`, 
        imageUrl: getEnhanceImage('success', 20), 
        status: 'max' 
      };
    }
    const costNeeded = ENHANCE_TABLE[profile.enhance].cost;
    return { 
      text: `현금이 부족합니다! (필요: ${won(costNeeded)})`, 
      imageUrl: getEnhanceImage('success', profile.enhance), 
      status: 'nomoney' 
    };
  }

  const [currName] = getWeaponInfo(profile.enhance);
  const finalStats = getEnhanceStats(profile.enhance);
  const detailMsg = formatEnhanceStatDiff(initialStats, finalStats);

  let resultMsg = [
    `⚡ [연속 강화 ${attempted}회 완료]`,
    `결과 : +${initialLevel} ➔ +${profile.enhance}`,
    `📊 성공: ${successCount}회 | 유지: ${keepCount}회 | 실패: ${failCount}회`,
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

function processGoldEnhance(profile, count = 1) {
  if (!profile.combatLevel) profile.combatLevel = 0;
  const costPerLevel = 1000;
  const totalCost = costPerLevel * count;

  if (profile.gold < totalCost) {
    return { text: `금괴가 부족합니다! (필요: ${totalCost}개)`, imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  profile.gold -= totalCost;
  profile.combatLevel += count;
  return { text: `⚡ 전투력 레벨 +${count} 업그레이드 완료!`, imageUrl: getEnhanceImage('success', profile.enhance) };
}

function processUseKey(profile) {
  if (profile.keys <= 0) return { text: `비밀열쇠가 없습니다!\n\n${profileText(profile)}`, imageUrl: getEnhanceImage('success', profile.enhance) };

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

  return { text: `🔑 열쇠 사용:\n${rewardMsg}\n(EXP +${expRes.gained})\n\n${profileText(profile)}`, imageUrl: getEnhanceImage('success', profile.enhance) };
}

function startGame(existingProfile) {
  let profile = createProfile(existingProfile);
  let battle = createBattle(profile);

  return {
    state: { profile, battle },
    text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`,
    choices: BATTLE_CHOICES,
    category: 'start',
    imageUrl: getEnhanceImage('success', profile.enhance) 
  };
}

function processTurn(state, utterance) {
  if (!state || typeof state !== 'object') state = {};
  
  let profile = createProfile(state.profile);
  let battle = state.battle;

  state.profile = profile;

  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  const isPlayingBattle = battle && battle.alive && !battle.finished;

  if (utterance === '/프로필' || utterance === '프로필') {
    const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
    return {
      text: currentBoard,
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
      category: 'profile',
      imageUrl: getEnhanceImage('success', profile.enhance)
    };
  }

  if (utterance === '/4655') {
    profile.cash += 10000000;
    const board = isPlayingBattle ? `\n\n${battleStatusBoard(profile, battle)}` : `\n\n${profileText(profile)}`;
    return { text: `🎁 [시크릿 코드]\n현금 10,000,000원 지급!${board}`, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, category: 'secret', imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  if (isPlayingBattle && (utterance.includes('강화') || utterance.includes('/강화') || utterance.startsWith('금괴강화') || utterance.includes('연속강화') || utterance.includes('/연속강화'))) {
    return { text: `⚠️ 전투 중에는 강화를 진행할 수 없습니다!\n\n${battleStatusBoard(profile, battle)}`, choices: BATTLE_CHOICES, category: 'battle_block', imageUrl: null };
  }

  if (utterance.startsWith('/금괴강화') || utterance.startsWith('금괴강화')) {
    const parts = utterance.replace('/금괴강화', '').replace('금괴강화', '').trim();
    let count = parseInt(parts, 10);
    if (isNaN(count) || count <= 1) count = 1;
    const goldResult = processGoldEnhance(profile, count);
    return { text: goldResult.text, choices: ENHANCE_CHOICES, category: 'gold_enhance', imageUrl: goldResult.imageUrl };
  }

  if (utterance.startsWith('/연속강화') || utterance.startsWith('연속강화')) {
    const parts = utterance.replace('/연속강화', '').replace('연속강화', '').trim();
    let count = parseInt(parts, 10);
    if (isNaN(count) || count <= 1) count = 1;
    const multiResult = processMultiEnhance(profile, count);
    return { text: multiResult.text, choices: ENHANCE_CHOICES, category: 'enhance', imageUrl: multiResult.imageUrl };
  }

  if (utterance.startsWith('/강화') || utterance.startsWith('강화')) {
    const enhanceResult = processEnhance(profile);
    return { text: enhanceResult.text, choices: ENHANCE_CHOICES, category: 'enhance', imageUrl: enhanceResult.imageUrl };
  }

  if (utterance === '열쇠' || utterance === 'usekey' || utterance === '/열쇠') {
    const keyResult = processUseKey(profile);
    return { text: keyResult.text, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, category: 'usekey', imageUrl: keyResult.imageUrl };
  }

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
    return { text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`, choices: BATTLE_CHOICES, category: 'start', imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  if (!battle || battle.finished || !battle.alive) {
    battle = createBattle(profile);
    state.battle = battle;
    return { text: `배틀로얄 시작!\n\n${battleStatusBoard(profile, battle)}`, choices: BATTLE_CHOICES, category: 'start', imageUrl: getEnhanceImage('success', profile.enhance) };
  }

  let buffMsgs = processBuffs(battle);
  checkDeath(battle);
  if (!battle.alive) {
    return {
      text: `${buffMsgs.join('\n')}\n\n== [사망] 탈락 (${battle.turn}턴) ==\n\n${profileText(profile)}`,
      choices: LOBBY_CHOICES,
      category: 'dead',
      imageUrl: getEnhanceImage('success', profile.enhance)
    };
  }

  if (utterance === '파밍' || utterance === 'farmfight' || utterance === '/파밍') {
    const outcome = resolveFarmFight(profile, battle);

    let baseExp = Math.max(100, Math.round((battle.accumulatedCash || 0) * 0.007));
    
    if (outcome.isDamageEvent) {
      baseExp = Math.max(20, Math.round(baseExp / 5));
    }

    const expRes = addExp(profile, baseExp);
    let levelUpMsg = expRes.leveledUp ? `\n${expRes.msg}` : '';
    let expMsg = `(EXP +${expRes.gained})`;

    checkDeath(battle);

    let combinedTextParts = [];
    if (buffMsgs.length > 0) combinedTextParts.push(buffMsgs.join('\n'));
    combinedTextParts.push(outcome.text);
    combinedTextParts.push(`${expMsg}${levelUpMsg}`);

    if (!battle.alive) {
      const snap = battle.startSnapshot || { cash: profile.cash };
      const deltaCash = profile.cash - snap.cash;
      if (deltaCash > 0) profile.cash = snap.cash + Math.round(deltaCash * 0.7);

      return {
        text: `${combinedTextParts.join('\n')}\n\n== [사망] 탈락 (${battle.turn}턴) ==\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'dead',
        imageUrl: getEnhanceImage('success', profile.enhance)
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
        text: `${combinedTextParts.join('\n')}\n\n== 🏆 [우승] 치킨 획득! (${battle.turn}턴) ==\n💵 추가 현금: ${won(winCash)} | EXP +${finalWinExp.gained}\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'win',
        imageUrl: getEnhanceImage('success', profile.enhance)
      };
    }

    applyZoneAttrition(battle);
    battle.turn += 1;

    return { 
      text: `${combinedTextParts.join('\n')}\n\n${battleStatusBoard(profile, battle)}`, 
      choices: BATTLE_CHOICES,
      category: outcome.category,
      imageUrl: null 
    };
  }

  if (utterance === '도망' || utterance === 'escape') {
    const outcome = resolveEscapeEvent(profile, battle);

    checkDeath(battle);

    let combinedTextParts = [];
    if (buffMsgs.length > 0) combinedTextParts.push(buffMsgs.join('\n'));
    if (outcome.text) combinedTextParts.push(outcome.text);

    if (battle.turn >= battle.maxTurn) {
      battle.finished = true;
      battle.result = 'win';
      battle.buffs = []; 
      const winCash = rand(500, 3000);
      const winExp = rand(100, 500);
      profile.cash += winCash;
      const finalWinExp = addExp(profile, winExp);

      return {
        text: `${combinedTextParts.length > 0 ? combinedTextParts.join('\n') + '\n\n' : ''}== 🏆 [우승] 최종 생존! (${battle.turn}턴) ==\n💵 추가 현금: ${won(winCash)} | EXP +${finalWinExp.gained}\n\n${profileText(profile)}`,
        choices: LOBBY_CHOICES,
        category: 'win',
        imageUrl: getEnhanceImage('success', profile.enhance) 
      };
    }

    applyZoneAttrition(battle);
    battle.turn += 1;

    const bodyText = combinedTextParts.length > 0 ? combinedTextParts.join('\n') + '\n\n' : '';

    return { 
      text: `${bodyText}${battleStatusBoard(profile, battle)}`, 
      choices: BATTLE_CHOICES,
      category: outcome.category,
      imageUrl: null 
    };
  }

  const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
  return {
    text: `올바른 메뉴를 선택해주세요.\n\n${currentBoard}`,
    choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
    imageUrl: getEnhanceImage('success', profile.enhance)
  };
}

module.exports = {
  createProfile,
  startGame,
  processTurn,
};

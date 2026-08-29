// ==========================================
// game.js (사냥 및 배틀로얄 시스템 통합 수정본)
// ==========================================

const MAX_TURN = 15;

const BASE_URL = 'https://raw.githubusercontent.com/cjsxlrmt234-commits/bot-images/main'; 

// --- 사냥 관련 데이터 및 함수 ---
const prefixes = {
  "D등급": ["초보", "약한", "지저분한", "배고픈", "겁먹은"],
  "C등급": ["단단한", "날쌘", "거친", "사나운", "독이 묻은"],
  "B등급": ["거대한", "흉포한", "타락한", "어둠의", "철갑"],
  "A등급": ["광폭한", "고대의", "지옥의", "군주", "수호자"],
  "S등급": ["파멸의", "절망의", "신들의", "혼돈의", "태초의"]
};

const monsters = [
  // D등급 (하급 몬스터)
  { name: "먼지 정령", grade: "D등급", description: "버려진 공간에서 자생하는 약한 마력의 작은 먼지 덩어리." },
  { name: "이슬 슬라임", grade: "D등급", description: "숲속의 맑은 물웅덩이에서 발견되는 투명하고 해가 없는 물컹한 생명체." },
  { name: "들쥐 포식자", grade: "D등급", description: "곡식 창고나 들판을 배회하며 농작물을 훔쳐 먹는 덩치 큰 일반 쥐." },
  { name: "삐쭉이 묘목", grade: "D등급", description: "마력에 의해 이동 능력을 얻었으나 공격력은 거의 없는 새싹 괴물." },
  { name: "청동 부스러기 곤충", grade: "D등급", description: "금속 파편을 갉아먹고 사는 장난감 크기의 기계성 곤충." },
  { name: "좀비 거머리", grade: "D등급", description: "축축한 동굴 바닥에 서식하며 다가오는 생물의 피부에 붙는 흡혈 괴물." },
  { name: "약초 도둑 토끼", grade: "D등급", description: "마력초의 냄새를 쫓아 모여드는 성가신 이빨의 야생 토끼." },
  { name: "푸른 파편 박쥐", grade: "D등급", description: "지하 초입에서 서식하며 초음파로 길을 찾는 소형 박쥐." },
  { name: "이끼 거북이", grade: "D등급", description: "등딱지에 두꺼운 이끼가 자라나 풀숲과 구분이 안 되는 소형 파충류." },
  { name: "썩은 짚인형", grade: "D등급", description: "폐가나 마법사의 공방 버려진 구석에서 움직이기 시작한 인형." },

  // C등급 (일반/위협 몬스터)
  { name: "들쇠 토끼", grade: "C등급", description: "튼튼한 뒷발로 강력한 돌려차기를 구사하는 전투용 거대 토끼." },
  { name: "돌멩이 골렘 (파편형)", grade: "C등급", description: "하급 마석의 힘으로 움직이는 거친 바위 조각들의 집합체." },
  { name: "독니 독사", grade: "C등급", description: "늪지대에 서식하며 물리면 마비 효과를 일으키는 초급 독사." },
  { name: "그림자 늑대", grade: "C등급", description: "어두운 숲에서 무리를 지어 사냥하며 야간에 은신 능력이 뛰어난 맹수." },
  { name: "고블린 투창병", grade: "C등급", description: "날카로운 뼈 창을 원거리에서 던져 사냥감을 괴롭히는 소형 휴머노이드." },
  { name: "가시멧돼지", grade: "C등급", description: "온몸이 단단한 강철 가시로 덮여 있어 돌진 공격이 특기인 야수." },
  { name: "부서진 해골 병사", grade: "C등급", description: "고대 전장의 잔해에서 마력에 의해 되살아난 하급 언데드 전사." },
  { name: "하급 샐러맨더", grade: "C등급", description: "불길이 약하게 감싸고 있는 도마뱀 형태로, 뜨거운 열기를 뿜어냄." },
  { name: "맹독 벌레떼", grade: "C등급", description: "떼 지어 날아다니며 상대의 시야를 가리고 피부를 갉아먹는 곤충형 몬스터." },
  { name: "늪지 요괴", grade: "C등급", description: "이끼와 진흙으로 위장하여 지나가는 나그네를 물속으로 끌어들이는 괴물." },

  // B등급 (상급/정예 몬스터)
  { name: "철갑 오크 장교", grade: "B등급", description: "두꺼운 철판 갑옷을 두르고 거대한 철퇴를 휘두르는 오크 지휘관." },
  { name: "서리 하피", grade: "B등급", description: "매서운 얼음 바람을 일으키며 높은 고도에서 급강하해 발톱으로 공격하는 괴물." },
  { name: "그림자 암살자", grade: "B등급", description: "빛을 흡수하는 은신 스킬을 사용해 단숨에 급소를 노리는 인간형 유령." },
  { name: "화염 사냥개", grade: "B등급", description: "지옥의 불길을 입은 채 맹렬하게 달리는 머리 두 개 달린 마수." },
  { name: "바위 거인", grade: "B등급", description: "산비탈의 돌무더기가 뭉쳐서 만들어진 거대한 체구의 골렘." },
  { name: "사이렌", grade: "B등급", description: "매혹적인 노랫소리로 항해사나 모험가의 정신을 빼놓고 물속으로 유인하는 정령." },
  { name: "맹독 아라크네(중급)", grade: "B등급", description: "온몸에서 강한 산성 독을 뿜어내며 벽과 천장을 자유롭게 기어 다니는 거미 괴물." },
  { name: "유령 기사", grade: "B등급", description: "찢어진 깃발을 들고 밤마다 옛 전장을 순찰하는 저주받은 기사 망령." },
  { name: "라이트닝 드레이크(미성체)", grade: "B등급", description: "번개를 뿜어내기 시작하는 어린 단계의 용족 괴물." },
  { name: "피의 구울", grade: "B등급", description: "시체를 탐닉하며 인간의 이성을 잃고 육식 본능만 남은 흉포한 언데드." },

  // A등급 (최상급/보스 몬스터)
  { name: "심연의 리치", grade: "A등급", description: "금지된 흑마술을 극도로 연마해 영혼의 힘으로 언데드 군단을 지휘하는 마법사." },
  { name: "서리 거룡 (프리에드)", grade: "A등급", description: "입김만으로 주변 반경 수 킬로미터를 순식간에 얼어붙게 만드는 성숙한 용족." },
  { name: "지옥불 미노타우로스", grade: "A등급", description: "몸 전체가 용암처럼 이글거리는 도끼를 휘두르는 미궁의 지배자." },
  { name: "고대 뱀파이어 백작", grade: "A등급", description: "수백 년 동안 인간의 피를 흡수해 절대적인 속도와 최면 능력을 지닌 흡혈귀." },
  { name: "폭풍의 정령왕 (하급 분신)", grade: "A등급", description: "하늘에서 거대한 번개와 폭풍을 자유자재로 불러일으키는 재앙급 정령." },
  { name: "철혈의 와이번 킹", grade: "A등급", description: "수많은 와이번 무리를 이끄는 우두머리로, 강철 같은 비늘을 지님." },
  { name: "타락한 성기사 멜키르", grade: "A등급", description: "신성력을 잃고 어둠의 계약에 물들어 거대한 대검을 휘두르는 타락한 영웅." },
  { name: "거대 심해 크라켄", grade: "A등급", description: "바다 한가운데서 배를 통째로 집어삼키는 다리의 촉수를 가진 거대 수중 괴물." },
  { name: "혼돈의 나무 (트리트 오브 카오스)", grade: "A등급", description: "숲 전체를 독성 안개로 물들이고 뿌리로 적을 포박하는 거대한 고대 식물." },
  { name: "공허의 마녀", grade: "A등급", description: "차원의 틈새를 열어 시공간을 왜곡하는 저주 마법을 구사하는 최상급 마법사." },

  // S등급 (재앙급/초월적 존재)
  { name: "공허의 군주 (보이드 제네시스)", grade: "S등급", description: "차원과 현실의 경계를 완전히 무너뜨리고 세계를 흡수하려는 외신(外神)적 존재" }
];

function getMonstersByGrade(grade) {
  return monsters.filter(m => m.grade === grade);
}

function getRandomMonsterByProbability() {
  const randVal = Math.random() * 100;
  let selectedGrade = "D등급";

  if (randVal < 0.01) {
    selectedGrade = "S등급";
  } else if (randVal < 0.01 + 0.49) {
    selectedGrade = "A등급";
  } else if (randVal < 0.5 + 4.5) {
    selectedGrade = "B등급";
  } else if (randVal < 5.0 + 25) {
    selectedGrade = "C등급";
  } else {
    selectedGrade = "D등급";
  }

  const targetMonsters = getMonstersByGrade(selectedGrade);
  if (targetMonsters.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * targetMonsters.length);
  return targetMonsters[randomIndex];
}

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

const AMPLIFY_TABLE = [
  { level: 0, costNext: 1000, minGold: 1, maxGold: 1, multBonus: 0.00, headWeight: 0.00 },
  { level: 1, costNext: 2000, minGold: 1, maxGold: 2, multBonus: 0.20, headWeight: 0.05 },
  { level: 2, costNext: 3000, minGold: 1, maxGold: 3, multBonus: 0.40, headWeight: 0.10 },
  { level: 3, costNext: 4000, minGold: 1, maxGold: 4, multBonus: 0.60, headWeight: 0.15 },
  { level: 4, costNext: 5000, minGold: 1, maxGold: 5, multBonus: 0.80, headWeight: 0.20 },
  { level: 5, costNext: 6000, minGold: 2, maxGold: 6, multBonus: 1.00, headWeight: 0.30 },
  { level: 6, costNext: 7000, minGold: 2, maxGold: 7, multBonus: 1.20, headWeight: 0.40 },
  { level: 7, costNext: 8000, minGold: 2, maxGold: 8, multBonus: 1.40, headWeight: 0.50 },
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
  { label: '사냥', action: '/사냥' },
  { label: '강화', action: '/강화' },
  { label: '열쇠', action: '/열쇠' }
];

const ENHANCE_CHOICES = [
  { label: '강화', action: '/강화' },
  { label: '전투', action: '/전투' },
  { label: '사냥', action: '/사냥' },
  { label: '열쇠', action: '/열쇠' }
];

const HUNT_CHOICES = [
  { label: '⚔️ 공격하기', action: '공격하기' },
  { label: '🏃 도망치기', action: '도망치기' }
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

function getExpMultiplier(profile) {
  const enhanceBonus = ((profile && profile.enhance) || 0) * 0.05;
  const ampInfo = getAmplifyInfo(profile && profile.combatLevel);
  return 1 + enhanceBonus + ampInfo.multBonus;
}

function getEnhanceStats(enhanceLevel, combatLevel = 0) {
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));
  const baseMult = (1 + (lvl * 0.05));
  const ampInfo = getAmplifyInfo(combatLevel);
  const totalMult = (baseMult + ampInfo.multBonus).toFixed(2);

  const baseHead = lvl * 1.00;
  const baseBody = 50.00 - (lvl * 0.50);
  const baseLeg = 50.00 - (lvl * 0.50);

  const numHead = baseHead * (1 + ampInfo.headWeight);
  const numBody = Math.max(0, baseBody);
  const numLeg = Math.max(0, baseLeg);

  return {
    mult: `x${totalMult}`,
    head: `${numHead.toFixed(2)}%`,
    body: `${numBody.toFixed(2)}%`,
    leg: `${numLeg.toFixed(2)}%`,
    numHead: numHead,
    numBody: numBody,
    numLeg: numLeg
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
    level: safeObj.level ?? 1,
    exp: safeObj.exp ?? 0,
    combatLevel: safeObj.combatLevel ?? 0,
    nickname: nickname,
    title: safeObj.title ?? '',
    refine: safeObj.refine ?? '',
    monthItems: safeObj.monthItems ?? 0,
    gamesPlayed: safeObj.gamesPlayed ?? 0,
  };
}

function profileText(profile, earnedStats = null) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const [wName] = getWeaponInfo(p.enhance);
  const stats = getEnhanceStats(p.enhance, p.combatLevel);

  const getGainStr = (val, isMoney = false) => {
    if (!val || val <= 0) return '';
    return isMoney ? ` (+${won(val)})` : ` (+${val}개)`;
  };

  const expGainStr = (earnedStats && earnedStats.exp > 0) ? `(EXP +${earnedStats.exp.toLocaleString()})` : '';
  const cashGainStr = getGainStr(earnedStats?.cash, true);
  const goldGainStr = getGainStr(earnedStats?.gold);
  const keyGainStr = getGainStr(earnedStats?.keys);

  return [
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    `칭호 : ${p.title}`,
    `🎮 플레이 판수 : ${p.gamesPlayed}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${p.refine}`,
    `⭐ Lv.${p.level} (${p.exp}/${reqExp})${expGainStr}`,
    `💪 전투력 : ${combatPower.toLocaleString()} (증폭 Lv.${p.combatLevel || 0})`,
    `🔘 배율 : ${stats.mult}`,
    ``,
    `💵 현금 : ${won(p.cash)}${cashGainStr}`,
    `🧈 금괴 : ${p.gold}개${goldGainStr}`,
    `🔑 비밀열쇠 : ${p.keys}개${keyGainStr}`,
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
  const stats = getEnhanceStats(p.enhance, p.combatLevel);
  const survivorsText = b.survivors <= 10 ? '?명' : `${b.survivors}명`;
  
  let boardLines = [
    `[배틀로얄 중] 매칭: ${b.mode}`,
    `| 턴 ${b.turn}/${b.maxTurn} | 생존: ${survivorsText}`,
    `HP:${makeHpBar(b.hp)}`,
    `🛡️ 헬멧: Lv.${b.helmetLevel || 0} (${b.helmetDurability ?? 0}%)`,
    `🦺 조끼: Lv.${b.vestLevel || 0} (${b.vestDurability ?? 0}%)`,
    `배율 (${stats.mult})`,
    ``,
    `🎮 플레이 판수 : ${p.gamesPlayed}판`,
    `🎯 강화 : +${p.enhance} ${wName}`,
    `🔨 제련 : ${p.refine}`,
    `⭐ Lv.${p.level} (${p.exp}/${reqExp})`,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${p.gold}개`,
    `🔑 비밀열쇠 : ${p.keys}개`,
    `📦 보급 : ${p.monthItems || 0}개`
  ];

  if (b.buffs.length > 0) {
    const buffDesc = b.buffs.map(buff => `${buff.name}(${buff.turnsLeft}턴 남음)`).join(', ');
    boardLines.push(`✨ 버프: ${buffDesc}`);
  }

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
  const targetName = `Survivor ${String(rand(1, 9999)).padStart(4, '0')}`; 
  const combatLv = profile.combatLevel || 0;
  const mult = 1 + ((profile.enhance || 0) * 0.05) + getAmplifyInfo(combatLv).multBonus;
  const ampInfo = getAmplifyInfo(combatLv);

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
    resultMessages.push(`[황금 보급품 획득!]🎁 최고급 Lv.3 헬멧 & Lv.3 조끼 장착 완료! (내구도 100%)\n(현금 ${won(earnedCash)}, 금괴 ${goldBonus}개, 열쇠 1개)`);
  }

  let mainText = '';

  switch (outcome) {
    case 'supply':
      break;
    case 'gold': {
      const goldBonus = rand(ampInfo.minGold, ampInfo.maxGold);
      profile.gold += goldBonus;
      battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBonus;
      mainText = `금괴 ${goldBonus}개 획득!`;
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
      const damageVal = rand(31, 99);
      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(battle, rand(8, 20));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const finalReward = Math.round((500 + (damageVal * 100)) * mult);
      profile.cash += finalReward;
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      mainText = `[1 KILL]\n적을 명중시켜 서바이버가 사망했습니다.\n[데미지 ${damageVal}] (+${won(finalReward)})\nHP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    case 'kill_multi': {
      const killCount = rand(2, 3);
      const totalDamageVal = rand(60, 150);
      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(battle, rand(15, 30));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const finalReward = Math.round(((killCount * 500) + (totalDamageVal * 100)) * mult);
      profile.cash += finalReward;
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      mainText = `[${killCount} KILL]\n적들을 제압했습니다!\n[데미지 ${totalDamageVal}] (+${won(finalReward)})\nHP -${finalDamage}${reduceMsg}${notes}`;
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
      battle.buffs.push({ name: '에너지 드링크', turnsLeft: 2, healAmount: 5 });
      textResult = `🧪 [에너지 드링크] 효과 발동 (2턴 동안 매턴 HP +5 회복)`;
      break;
    }
    case 'painkiller': {
      battle.buffs.push({ name: '진통제', turnsLeft: 3, healAmount: 5 });
      textResult = `💊 [진통제] 효과 발동 (3턴 동안 매턴 HP +5 회복)`;
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
  
  const [wName] = getWeaponInfo(profile.enhance);
  
  if (profile.enhance >= ENHANCE_TABLE.length) {
    const stats = getEnhanceStats(profile.enhance, profile.combatLevel || 0);
    return { text: `최고 강화 단계 도달! (+${profile.enhance} ${wName})\n+${profile.enhance} ${wName}\n${formatEnhanceStatDiff(stats, stats)}`, imageUrl: getEnhanceImage('success', 20), status: 'max' };
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
  let resultMsg = '', resultStatus = '';

  if (roll < tableData.success) {
    profile.enhance += 1;
    resultStatus = 'success';
    const [currName] = getWeaponInfo(profile.enhance);
    resultMsg = `[강화성공] +${initialEnhance} ➔ +${profile.enhance}\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${formatEnhanceStatDiff(oldStats, getEnhanceStats(profile.enhance, profile.combatLevel))}`;
  } else if (roll < tableData.success + tableData.keep) {
    resultStatus = 'keep';
    const [currName] = getWeaponInfo(profile.enhance);
    resultMsg = `[강화 유지] +${initialEnhance}\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${formatEnhanceStatDiff(oldStats, oldStats)}`;
  } else {
    resultStatus = 'fail';
    profile.enhance = 0;
    const [currName] = getWeaponInfo(profile.enhance);
    resultMsg = `[강화 실패] +${initialEnhance} ➔ +0 (초기화)\n(소모 비용: ${won(cost)})\n+${profile.enhance} ${currName}\n${formatEnhanceStatDiff(oldStats, getEnhanceStats(0, profile.combatLevel))}`;
  }

  return { text: resultMsg, imageUrl: getEnhanceImage(resultStatus, profile.enhance), status: resultStatus };
}

function processMultiEnhance(profile, count) {
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  let targetCount = Math.max(1, count);
  let initialLevel = profile.enhance;
  let totalCost = 0, successCount = 0, keepCount = 0, failCount = 0, attempted = 0, lastStatus = 'success';

  for (let i = 0; i < targetCount; i++) {
    if (profile.enhance >= ENHANCE_TABLE.length) break; 
    const tableData = ENHANCE_TABLE[profile.enhance];
    if (profile.cash < tableData.cost) break; 

    profile.cash -= tableData.cost;
    totalCost += tableData.cost;
    attempted++;

    const roll = Math.random();
    if (roll < tableData.success) { profile.enhance += 1; successCount++; lastStatus = 'success'; }
    else if (roll < tableData.success + tableData.keep) { keepCount++; lastStatus = 'keep'; }
    else { profile.enhance = 0; failCount++; lastStatus = 'fail'; }
  }

  if (attempted === 0) {
    return { text: `현금이 부족하거나 최고 단계입니다!`, imageUrl: null, status: 'nomoney' };
  }

  const [currName] = getWeaponInfo(profile.enhance);
  let resultMsg = [
    `⚡ [연속 강화 ${attempted}회 완료]`,
    `결과 : +${initialLevel} ➔ +${profile.enhance}`,
    `📊 성공: ${successCount}회 | 유지: ${keepCount}회 | 실패: ${failCount}회`,
    `(총 소모 비용: ${won(totalCost)})`,
    ``,
    `+${profile.enhance} ${currName}`
  ].join('\n');

  return { text: resultMsg, imageUrl: getEnhanceImage(lastStatus, profile.enhance), status: lastStatus };
}

function processGoldEnhance(profile, targetLevels = 1) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  if (profile.combatLevel >= 10) return { text: `✨ 증폭 레벨이 최고 단계(Lv.10)입니다!`, imageUrl: null };

  let levelsUpgraded = 0, totalGoldSpent = 0, startLevel = profile.combatLevel;

  for (let i = 0; i < targetLevels; i++) {
    if (profile.combatLevel >= 10) break;
    const costNext = AMPLIFY_TABLE[profile.combatLevel].costNext;
    if (profile.gold < costNext) break;

    profile.gold -= costNext;
    totalGoldSpent += costNext;
    profile.combatLevel += 1;
    levelsUpgraded += 1;
  }

  if (levelsUpgraded === 0) return { text: `금괴가 부족합니다!`, imageUrl: null };

  return { text: `⚡ 증폭 강화 성공! [증폭 Lv.${startLevel} ➔ Lv.${profile.combatLevel}] (소모 금괴: ${totalGoldSpent}개)`, imageUrl: null };
}

function processUseKey(profile) {
  if (profile.keys <= 0) return { text: `비밀열쇠가 없습니다!\n\n${profileText(profile)}`, imageUrl: null };

  profile.keys -= 1;
  const randRoll = Math.random() * 100;
  let rewardMsg = '';

  if (randRoll < 50) { 
    const cashAmt = getCombatPower(profile) * 10;
    profile.cash += cashAmt;
    rewardMsg = `현금 ${won(cashAmt)} 획득!`;
  } else if (randRoll < 99) { 
    const goldBar = rand(1, 3);
    profile.gold += goldBar;
    rewardMsg = `금괴 ${goldBar}개 획득!`;
  } else { 
    if (!profile.monthItems) profile.monthItems = 0;
    profile.monthItems += 1;
    rewardMsg = `✨ [1% 대박] 이달의 아이템 뽑기권 획득!`;
  }

  return { text: `🔑 열쇠 사용:\n${rewardMsg}\n\n${profileText(profile)}`, imageUrl: null };
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

  let input = typeof utterance === 'string' ? utterance.trim() : '';

  // --- 1. [우선 처리] 사냥 모드 이벤트 수신 처리 ---
  if (state.mode === 'hunting' && state.huntTarget) {
    const monster = state.huntTarget;
    if (input === '공격하기' || input === '공격' || input === '/공격하기' || input === '/공격') {
      state.mode = null;
      state.huntTarget = null;
      
      const pwr = getCombatPower(profile);
      const winChance = Math.min(95, Math.max(10, pwr / 50)); 
      const isSuccess = Math.random() * 100 < winChance;

      if (isSuccess) {
        const rewardCash = rand(500, 5000) * (monster.grade === 'S등급' ? 10 : monster.grade === 'A등급' ? 5 : 1);
        profile.cash += rewardCash;
        const expRes = addExp(profile, 100);
        return {
          text: `⚔️ [사냥 성공!] ${monster.name}을(를) 처치했습니다!\n보상: 현금 ${won(rewardCash)} | EXP +${expRes.gained}\n\n${profileText(profile)}`,
          imageUrl: null,
          choices: LOBBY_CHOICES,
          category: 'hunt_win'
        };
      } else {
        const penaltyCash = rand(200, 1000);
        profile.cash = Math.max(0, profile.cash - penaltyCash);
        return {
          text: `💥 [사냥 실패] ${monster.name}에게 반격당해 도망쳤습니다...\n손실: 현금 -${won(penaltyCash)}\n\n${profileText(profile)}`,
          imageUrl: null,
          choices: LOBBY_CHOICES,
          category: 'hunt_fail'
        };
      }
    } else if (input === '도망치기' || input === '도망' || input === '/도망치기' || input === '/도망') {
      state.mode = null;
      state.huntTarget = null;
      return {
        text: `🏃 야생의 ${monster.name}에게서 무사히 도망쳤습니다.\n\n${profileText(profile)}`,
        imageUrl: null,
        choices: LOBBY_CHOICES,
        category: 'hunt_escape'
      };
    }
  }

  // --- 2. 일반 슬래시(/) 보정 ---
  const isPlayingBattle = battle && battle.alive && !battle.finished;

  if (!input.startsWith('/')) {
    const rawClean = input.replace(/^\//, '').trim();
    const validCommands = ['전투', '사냥', '파밍', '도망', '강화', '열쇠', '프로필'];
    
    if (validCommands.includes(rawClean)) {
      input = '/' + rawClean;
    } else {
      const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
      return {
        text: `⚠️ 모든 명령어는 앞에 '/'를 붙여야 합니다. (예: /전투, /사냥, /프로필)\n\n${currentBoard}`,
        imageUrl: null,
        choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES
      };
    }
  }

  if (input === '/프로필') {
    return {
      text: isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile),
      imageUrl: null,
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
      category: 'profile'
    };
  }

  if (input === '/사냥') {
    if (isPlayingBattle) {
      return { text: `⚠️ 전투 중에는 사냥을 할 수 없습니다!`, imageUrl: null, choices: BATTLE_CHOICES };
    }

    const monster = getRandomMonsterByProbability();
    state.mode = 'hunting';
    state.huntTarget = monster;

    const text = `[사냥 발견!] 등급: ${monster.grade}\n\n야생의 ${monster.name}을(를) 만났다!\n${monster.description}`;
    
    return {
      text,
      imageUrl: null,
      choices: HUNT_CHOICES,
      category: 'hunt_encounter',
      state
    };
  }

  if (input === '/전투') {
    if (isPlayingBattle) {
      return { text: `⚠️ 이미 배틀로얄이 진행 중입니다!`, imageUrl: null, choices: BATTLE_CHOICES };
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

  if (input === '/강화') {
    const enhanceResult = processEnhance(profile);
    return { text: enhanceResult.text + `\n\n` + profileText(profile), imageUrl: enhanceResult.imageUrl, choices: ENHANCE_CHOICES, category: 'enhance' };
  }

  if (input === '/열쇠') {
    const keyResult = processUseKey(profile);
    return { text: keyResult.text, imageUrl: keyResult.imageUrl, choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES, category: 'usekey' };
  }

  // --- 3. 배틀로얄 턴 진행 ---
  if (isPlayingBattle) {
    let buffMsgs = processBuffs(battle);
    checkDeath(battle);

    if (!battle.alive) {
      return {
        text: `${buffMsgs.join('\n')}\n\n== [사망] 탈락 ==\n\n${profileText(profile)}`,
        imageUrl: null,
        choices: LOBBY_CHOICES,
        category: 'dead'
      };
    }

    if (input === '/파밍') {
      const outcome = resolveFarmFight(profile, battle);
      let baseExp = Math.round((outcome.earnedCash || 0) * 0.0005);
      if (baseExp > 0) addExp(profile, baseExp);
      checkDeath(battle);

      if (!battle.alive) {
        return { text: `${outcome.text}\n\n== [사망] 탈락 ==\n\n${profileText(profile)}`, imageUrl: null, choices: LOBBY_CHOICES, category: 'dead' };
      }

      if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
        battle.finished = true;
        const winCash = rand(500, 3000);
        profile.cash += winCash;
        addExp(profile, 300);
        return { text: `${outcome.text}\n\n== 🏆 [우승] 치킨 획득! ==\n\n${profileText(profile)}`, imageUrl: null, choices: LOBBY_CHOICES, category: 'win' };
      }

      applyZoneAttrition(battle);
      battle.turn += 1;
      return { text: `${outcome.text}\n\n${battleStatusBoard(profile, battle)}`, imageUrl: null, choices: BATTLE_CHOICES, category: outcome.category };
    }

    if (input === '/도망') {
      const outcome = resolveEscapeEvent(profile, battle);
      
      // 턴 만료 혹은 생존자 판정 검사 추가
      if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
        battle.finished = true;
        const winCash = rand(500, 3000);
        profile.cash += winCash;
        addExp(profile, 300);
        return { text: `${outcome.text}\n\n== 🏆 [우승] 치킨 획득! ==\n\n${profileText(profile)}`, imageUrl: null, choices: LOBBY_CHOICES, category: 'win' };
      }

      applyZoneAttrition(battle);
      battle.turn += 1;
      return { text: `${outcome.text}\n\n${battleStatusBoard(profile, battle)}`, imageUrl: null, choices: BATTLE_CHOICES, category: outcome.category };
    }
  }

  return {
    text: `올바른 명령어를 사용해주세요.`,
    imageUrl: null,
    choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES
  };
}

module.exports = {
  createProfile,
  startGame,
  processTurn,
};

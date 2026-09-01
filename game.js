// 
// game.js
//

const MAX_TURN = 15;
const EXP_PER_LEVEL_BASE = 500;
const JOB_UNLOCK_CASH = 50000000;
const JOB_UNLOCK_GOLD = 500;
const JOB_CHANGE_GOLD = 1000;
const REFINE_BASE_CASH = 10000000;

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

const SHADOW_WEAPON_TIERS = [
  ['흑단 일륜도', '어둠을 머금은 첫 번째 일륜도'],
  ['혈월의 검', '붉은 달의 기운이 서린 검'],
  ['음영참마도', '그림자를 베어내는 거대한 도'],
  ['야행의 칼날', '밤을 걷는 자의 예리한 칼날'],
  ['무영의 태도', '그림자조차 남지 않는 태도'],
  ['귀면 일륜도', '도깨비의 형상이 새겨진 일륜도'],
  ['은빛 섬광', '눈부시게 빛나는 은빛 검신'],
  ['자죽엽 도신', '푸른 대나무 잎사귀처럼 유연한 도신'],
  ['암야의 백귀', '밤의 유령들을 불러모으는 칼날'],
  ['수라의 낙인', '아수라의 분노가 새겨진 낙인'],
  ['절명 일륜도', '적의 숨통을 단번에 끊는 일륜도'],
  ['명부의 인도', '저승의 문으로 이끄는 안내자'],
  ['파멸의 이자나기', '모든 것을 파멸시키는 신들의 도구'],
  ['칠흑의 야마토', '빛을 삼키는 칠흑의 명도'],
  ['진은 월하광', '달빛을 받아 찬란하게 빛나는 진은'],
  ['아수라 혈풍참', '피바람을 일으키는 아수라의 참격'],
  ['공허의 절단자', '공허마저 베어버리는 절단자'],
  ['아마테라스의 업화', '모든 것을 태우는 태양의 검화'],
  ['창백한 나락', '끝없는 나락으로 떨어뜨리는 검'],
  ['태허의 무진', '우주의 근원인 태허의 무한한 힘'],
  ['월식의 종언', '달이 완전히 가려질 때 찾아오는 종말']
];

const STINGER_WEAPON_TIERS = [
  ['대전차 파편총', '전차의 장갑을 찢기 위해 만든 파편총'],
  ['장갑 관통 리볼버', '단단한 장갑을 뚫는 특수 리볼버'],
  ['경량 플래싯 런처', '기동성을 높인 소형 플래싯 런처'],
  ['철갑탄 오토캐논', '연사력이 강화된 철갑탄 오토캐논'],
  ['대형 파쇄 블래스터', '구조물을 완전히 파쇄하는 대형 블래스터'],
  ['티타늄 파일벙커', '강인한 티타늄 재질의 근접 파일벙커'],
  ['골드 코팅 헤비건', '화려한 금장으로 코팅된 중기관총'],
  ['중장갑 바이스 암', '단단하게 조여매는 중장갑 암 웨폰'],
  ['플라즈마 슈터', '고열의 플라즈마 에너지를 발사하는 슈터'],
  ['마그네틱 레일캐논', '전자석의 힘으로 탄환을 사출하는 레일캐논'],
  ['중성자 파괴포', '주변 물질을 붕괴시키는 중성자 포격기'],
  ['붕괴 유탄발사기', '지형을 뒤흔드는 강력한 붕괴 유탄발사기'],
  ['바이브레이트 소닉건', '음파 진동으로 내부를 파괴하는 소닉건'],
  ['앱솔루트 프리저', '주위의 모든 것을 얼려버리는 냉동 총'],
  ['버스트 썬더 캐논', '벼락의 폭발력을 연속으로 뿜어내는 캐논'],
  ['디멘션 브레이커', '공간의 균열을 내는 차원 파괴 무기'],
  ['아포칼립스 포격기', '종말의 전조를 알리는 거대 포격기'],
  ['인페르노 볼케이노', '화산의 용암을 발사하는 인페르노 무기'],
  ['타임 슬립 캐논', '시간의 흐름을 일시적으로 왜곡하는 총'],
  ['오메가 싱귤래리티', '궁극의 중력장을 형성하는 오메가 무기'],
  ['울티메이트 판처 코어', '모든 화력을 집약한 궁극의 장갑 코어']
];

const SENTINEL_WEAPON_TIERS = [
  ['센티넬 스카우트', '정찰용으로 개조된 기본형 센티넬 총기'],
  ['가드너 마크 I', '경계 태세를 강화하기 위한 첫 번째 제식 무기'],
  ['디펜더 카빈', '방어전에 특화된 안정적인 카빈 소총'],
  ['실드 브레이커', '적의 방어선을 무너뜨리기 위해 조율된 총기'],
  ['불워크 리플', '든든한 방벽 같은 묵직한 타격감의 소총'],
  ['오비탈 바스천', '정밀한 조준 장치가 결합된 바스천 모델'],
  ['펄스 가디언', '에너지 펄스를 방출하는 경계용 가디언 건'],
  ['제니스 오브젝트', '정점에 도달하기 시작한 센티넬의 무기'],
  ['A.I. 코어 라이플', '인공지능 보조 조준 시스템이 탑재된 라이플'],
  ['퀀텀 불워크', '양자역학적 방벽을 두른 중장갑형 라이플'],
  ['에테르 센티넬', '에테르 에너지를 두른 궁극의 경계 무기'],
  ['네오 가드너', '차세대 기술로 재설계된 가드너 아티팩트'],
  ['바이오닉 디펜더', '생체신호와 동기화되는 방어형 총기'],
  ['태로스 바스천', '고대 거인의 힘이 깃든 강력한 바스천'],
  ['아크 펄스건', '전기 아크를 연속 방사하는 펄스 총기'],
  ['헤븐리 불워크', '천상의 가호를 받는 난공불락의 방벽 무기'],
  ['제네시스 오비탈', '새로운 질서를 창조하는 오비탈 총기'],
  ['디바인 가디언', '신성한 수호의 권능이 서린 가디언 건'],
  ['이터널 센티넬', '시공을 초월하여 영원히 빛나는 센티넬 총기'],
  ['옴니포턴트 코어', '모든 것을 감시하고 심판하는 전능의 코어'],
  ['앱솔루트 오비탈', '센티넬 기술력의 궁극적인 정점']
];

const JOB_WEAPONS = {
  stinger: '스팅거 블래스터',
  sentinel: '센티넬 라이플',
  shadow: '섀도우 대거'
};

const ENHANCE_TABLE = [
  { cost: 10000, success: 1.00, keep: 0.00, fail: 0.00 },
  { cost: 20000, success: 0.95, keep: 0.05, fail: 0.00 },
  { cost: 35000, success: 0.90, keep: 0.10, fail: 0.00 },
  { cost: 55000, success: 0.85, keep: 0.14, fail: 0.01 },
  { cost: 80000, success: 0.80, keep: 0.17, fail: 0.03 },
  { cost: 110000, success: 0.70, keep: 0.25, fail: 0.05 },
  { cost: 145000, success: 0.60, keep: 0.30, fail: 0.10 },
  { cost: 185000, success: 0.50, keep: 0.40, fail: 0.10 },
  { cost: 230000, success: 0.40, keep: 0.50, fail: 0.10 },
  { cost: 280000, success: 0.35, keep: 0.55, fail: 0.10 },
  { cost: 400000, success: 0.30, keep: 0.60, fail: 0.10 },
  { cost: 500000, success: 0.25, keep: 0.65, fail: 0.10 },
  { cost: 700000, success: 0.22, keep: 0.68, fail: 0.10 },
  { cost: 1000000, success: 0.20, keep: 0.70, fail: 0.10 },
  { cost: 1400000, success: 0.18, keep: 0.72, fail: 0.10 },
  { cost: 1900000, success: 0.15, keep: 0.75, fail: 0.10 },
  { cost: 2500000, success: 0.13, keep: 0.77, fail: 0.10 },
  { cost: 3200000, success: 0.09, keep: 0.81, fail: 0.10 },
  { cost: 4000000, success: 0.07, keep: 0.83, fail: 0.10 },
  { cost: 5000000, success: 0.05, keep: 0.85, fail: 0.10 },
];

const REFINE_STARS = [
  ' ',        
  '☆',        
  '★',        
  '★☆',      
  '★★',      
  '★★☆',    
  '★★★',    
  '★★★☆',  
  '★★★★',  
  '★★★★☆',
  '★★★★★' 
];

const REFINE_TABLE = [
  { cashCost: REFINE_BASE_CASH, goldCost: 10, success: 1.00, keep: 0.00, destroy: 0.000, drop: 0.00 },
  { cashCost: 15000000, goldCost: 15, success: 0.90, keep: 0.10, destroy: 0.000, drop: 0.00 },
  { cashCost: 20000000, goldCost: 20, success: 0.80, keep: 0.20, destroy: 0.000, drop: 0.00 },
  { cashCost: 25000000, goldCost: 25, success: 0.70, keep: 0.25, destroy: 0.000, drop: 0.05 },
  { cashCost: 25000000, goldCost: 25, success: 0.50, keep: 0.40, destroy: 0.000, drop: 0.10 },
  { cashCost: 35000000, goldCost: 30, success: 0.40, keep: 0.575, destroy: 0.025, drop: 0.00 },
  { cashCost: 40000000, goldCost: 35, success: 0.30, keep: 0.65, destroy: 0.050, drop: 0.00 },
  { cashCost: 45000000, goldCost: 40, success: 0.20, keep: 0.725, destroy: 0.075, drop: 0.00 },
  { cashCost: 50000000, goldCost: 45, success: 0.10, keep: 0.80, destroy: 0.100, drop: 0.00 },
  { cashCost: 60000000, goldCost: 50, success: 0.05, keep: 0.80, destroy: 0.150, drop: 0.00 },
];

const AMPLIFY_TABLE = [
  { level: 0, costNext: 1000, minGold: 1, maxGold: 1, multBonus: 0.00, headWeight: 0.00, successBonus: 0.0 },
  { level: 1, costNext: 2000, minGold: 1, maxGold: 2, multBonus: 0.20, headWeight: 0.05, successBonus: 0.5 },
  { level: 2, costNext: 3000, minGold: 1, maxGold: 3, multBonus: 0.40, headWeight: 0.10, successBonus: 1.0 },
  { level: 3, costNext: 4000, minGold: 1, maxGold: 4, multBonus: 0.60, headWeight: 0.15, successBonus: 1.5 },
  { level: 4, costNext: 5000, minGold: 1, maxGold: 5, multBonus: 0.80, headWeight: 0.20, successBonus: 2.0 },
  { level: 5, costNext: 6000, minGold: 2, maxGold: 6, multBonus: 1.00, headWeight: 0.30, successBonus: 2.5 },
  { level: 6, costNext: 7000, minGold: 2, maxGold: 7, multBonus: 1.20, headWeight: 0.40, successBonus: 3.0 },
  { level: 7, costNext: 8000, minGold: 2, maxGold: 8, multBonus: 1.50, headWeight: 0.50, successBonus: 3.5 },
  { level: 8, costNext: 9000, minGold: 2, maxGold: 9, multBonus: 1.60, headWeight: 0.65, successBonus: 4.0 },
  { level: 9, costNext: 10000, minGold: 2, maxGold: 10, multBonus: 1.80, headWeight: 0.80, successBonus: 4.5 },
  { level: 10, costNext: 0, minGold: 3, maxGold: 11, multBonus: 2.00, headWeight: 1.00, successBonus: 5.0 }
];

const FARM_TABLE = {
  solo: [
    ['supply', 0.5],
    ['gold', 1.5],
    ['key', 2.0],
    ['jackpot', 6.0],
    ['damage', 45.0],
    ['kill_single', 40.0],
    ['kill_multi', 5.0]
  ],
  duo: [
    ['supply', 0.75],
    ['gold', 2],
    ['key', 2.25],
    ['jackpot', 6.0],
    ['damage', 45.0],
    ['kill_single', 22.0],
    ['kill_multi', 22.0]
  ],
  squad: [
    ['supply', 1.0],
    ['gold', 3],
    ['key', 5.0],
    ['jackpot', 6.0],
    ['damage', 45.0],
    ['kill_single', 10.0],
    ['kill_multi', 30.0]
  ]
};

const ESCAPE_TABLE = [
  ['instant_heal', 60.0],
  ['drink', 25.0],
  ['painkiller', 15.0]
];

const BATTLE_CHOICES = [
  { label: '파밍', action: '/파밍' },
  { label: '도망', action: '/도망' }
];

const LOBBY_CHOICES = [
  { label: '전투', action: '/전투' },
  { label: '강화', action: '/강화' }
];

const ENHANCE_CHOICES = [
  { label: '강화', action: '/강화' },
  { label: '전투', action: '/전투' }
];

const IMPRINT_OPTION_POOL = [
  { name: '헤드샷 데미지 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'headDmg' },
  { name: '현금 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'cashBoost' },
  { name: '헤드샷 확률 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'headRate' },
  { name: '헤드샷 확률 가중치 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'headWeight' },
  { name: '강화 성공 확률 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceSuccess' },
  { name: '강화 비용 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceCostDown' },
  { name: '금괴 획득 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'goldChance' },
  { name: '듀오, 스쿼드 매칭 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'multiMeet' },
  { name: '경험치 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'expBoost' },
  { name: '비밀열쇠 획득 확률 증가', values: [0.002, 0.004, 0.006, 0.008, 0.01], weights: [30, 30, 20, 10, 10], unit: '%', key: 'keyChance' },
  { name: '피해량 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'damageReduce' },
  { name: '전투력 증가', values: [1, 1.5, 2, 2.5, 3], weights: [30, 30, 20, 10, 10], unit: '%', key: 'combatBoost' }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function pickWeightedValue(values, weights) {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < values.length; i++) {
    if (r < weights[i]) return values[i];
    r -= weights[i];
  }
  return values[values.length - 1];
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

function getRandomSurvivorName() {
  const num = String(rand(1000, 9999));
  return `Survivor_${num}`;
}

function getEnhanceImage(statusType, enhanceLevel, job = null) {
  if (statusType === 'fail' && enhanceLevel > 0) {
    return `${BASE_URL}/fail.png`; 
  }
  let level = 0;
  if (enhanceLevel !== undefined && enhanceLevel !== null && !isNaN(enhanceLevel)) {
    level = Number(enhanceLevel);
  }
  level = Math.max(0, Math.min(20, level));

  if (job === 'shadow') {
    return `${BASE_URL}/SDW_${level}.png`;
  } else if (job === 'stinger') {
    return `${BASE_URL}/STG_${level}.png`;
  } else if (job === 'sentinel') {
    return `${BASE_URL}/SEN_${level}.png`;
  }
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
  return (level || 1) * EXP_PER_LEVEL_BASE;
}

function getAmplifyInfo(combatLevel) {
  const lvl = Math.max(0, Math.min(10, combatLevel || 0));
  return AMPLIFY_TABLE[lvl];
}

function getImprintTotalBonus(profile, keyName) {
  if (!profile || !profile.imprints) return 0;
  let total = 0;
  for (let levelKey in profile.imprints) {
    const imprintData = profile.imprints[levelKey];
    if (imprintData && imprintData.options) {
      imprintData.options.forEach(opt => {
        if (opt.key === keyName) {
          total += opt.value;
        }
      });
    }
  }
  return total;
}

function getGoldMultiplier(profile) {
  const currentEnhance = getCurrentEnhanceLevel(profile);
  const baseMult = profile && profile.job ? Number((2.00 + (currentEnhance * 0.05)).toFixed(2)) : Number((1.00 + (currentEnhance * 0.05)).toFixed(2));
  const ampInfo = getAmplifyInfo(profile ? profile.combatLevel : 0);
  const refineBonus = ((profile && profile.refine) || 0) * 0.10; 
  const imprintCashBoost = getImprintTotalBonus(profile, 'cashBoost') / 100;
  return Number((baseMult + ampInfo.multBonus + refineBonus + imprintCashBoost).toFixed(2));
}

function getExpMultiplier(profile) {
  const currentEnhance = getCurrentEnhanceLevel(profile);
  const base = profile && profile.job ? (2.00 + (currentEnhance * 0.05)) : (1.00 + (currentEnhance * 0.05));
  const imprintExpBoost = getImprintTotalBonus(profile, 'expBoost') / 100;
  return base + imprintExpBoost;
}

function getCurrentEnhanceLevel(profile) {
  if (!profile) return 0;
  if (profile.job) {
    return profile.jobEnhance ?? profile.enhance ?? 0;
  }
  return profile.enhance ?? 0;
}

function getWeaponInfo(enhanceLevel, job = null) {
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));
  if (job === 'shadow') {
    return SHADOW_WEAPON_TIERS[lvl] || SHADOW_WEAPON_TIERS[0];
  } else if (job === 'stinger') {
    return STINGER_WEAPON_TIERS[lvl] || STINGER_WEAPON_TIERS[0];
  } else if (job === 'sentinel') {
    return SENTINEL_WEAPON_TIERS[lvl] || SENTINEL_WEAPON_TIERS[0];
  }
  return WEAPON_TIERS[lvl] || WEAPON_TIERS[0];
}

function getCurrentWeaponName(profile) {
  if (!profile) return '무기';
  const enhanceLvl = getCurrentEnhanceLevel(profile);
  const [wName] = getWeaponInfo(enhanceLvl, profile.job);
  return `🎯 무기 : +${enhanceLvl} ${wName}`;
}

function getEnhanceStats(enhanceLevel, combatLevel = 0, profile = null) {
  const isJob = profile && Boolean(profile.job);
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));

  let baseMult, baseHead, baseBody, baseLeg;

  if (isJob) {
    baseMult = (2.00 + (lvl * 0.05)).toFixed(2);
    baseHead = 20.00 + (lvl * 1.00);
    baseBody = Math.max(0, 40.00 - (lvl * 0.50));
    baseLeg = Math.max(0, 40.00 - (lvl * 0.50));
  } else {
    baseMult = (1.00 + (lvl * 0.05)).toFixed(2);
    baseHead = lvl * 1.00;
    baseBody = Math.max(0, 50.00 - (lvl * 0.50));
    baseLeg = Math.max(0, 50.00 - (lvl * 0.50));
  }

  const ampInfo = getAmplifyInfo(combatLevel);
  const imprintHeadRate = getImprintTotalBonus(profile, 'headRate');
  const imprintHeadWeight = getImprintTotalBonus(profile, 'headWeight');

  const numHead = (baseHead + imprintHeadRate) * (1 + ampInfo.headWeight + (imprintHeadWeight / 100));
  const numBody = Math.max(0, baseBody);
  const numLeg = Math.max(0, baseLeg);

  return {
    mult: `x${baseMult}`,
    head: `${(baseHead + imprintHeadRate).toFixed(2)}%`,
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

function formatRefineStatDiff(oldRefine, newRefine) {
  const oldMult = (oldRefine * 0.10).toFixed(2);
  const newMult = (newRefine * 0.10).toFixed(2);
  
  const oldHead = oldRefine * 1;
  const newHead = newRefine * 1;
  
  const oldCp = oldRefine * 2;
  const newCp = newRefine * 2;

  return [
    `배율 | x${oldMult} ➔ x${newMult}`,
    `헤드샷 데미지 증가 | ${oldHead}% ➔ ${newHead}%`,
    `전투력 증가 | ${oldCp}% ➔ ${newCp}%`
  ].join('\n');
}

function getCombatPower(profile) {
  if (!profile) return 0;
  const combatLv = profile.combatLevel || 0;
  const enhance = getCurrentEnhanceLevel(profile);
  const lvl = profile.level || 1;
  const refineLvl = profile.refine || 0;

  const basePower = (lvl * 100) + (combatLv * 500) + (enhance * 300);
  const refineBonusMult = 1 + (refineLvl * 0.02);
  const imprintCombatBoost = getImprintTotalBonus(profile, 'combatBoost') / 100;

  return Math.floor(basePower * refineBonusMult * (1 + imprintCombatBoost));
}

function calculatePartDamage(profile, forceHead = false) {
  const enhanceLevel = getCurrentEnhanceLevel(profile);
  const combatLevel = profile ? (profile.combatLevel || 0) : 0;
  const refineLevel = profile ? (profile.refine || 0) : 0;
  
  const stats = getEnhanceStats(enhanceLevel, combatLevel, profile);
  const roll = Math.random() * 100;

  let hitPartName = '다리';
  let damageVal = 0;

  if (forceHead || roll < stats.numHead) {
    hitPartName = '헤드';
    const combatPower = getCombatPower(profile);
    const powerDamage = Math.floor(combatPower * 0.1);
    const baseDamage = Math.max(100, powerDamage) + (enhanceLevel * 15);
    
    const refineHeadMultiplier = 1 + (refineLevel * 0.01);
    const imprintHeadDmgBonus = getImprintTotalBonus(profile, 'headDmg') / 100;
    damageVal = Math.floor(baseDamage * refineHeadMultiplier * (1 + imprintHeadDmgBonus));
  } else if (roll < stats.numHead + stats.numBody) {
    hitPartName = '몸';
    damageVal = rand(31, 99);
  } else {
    hitPartName = '다리';
    damageVal = rand(1, 30);
  }

  return { hitPartName, damageVal };
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
    jobEnhance: safeObj.jobEnhance ?? 0,
    refine: safeObj.refine ?? 0,
    level: safeObj.level ?? 1,
    exp: safeObj.exp ?? 0,
    combatLevel: safeObj.combatLevel ?? 0,
    job: safeObj.job ?? null,               
    jobSkillLevel: safeObj.jobSkillLevel ?? 1, 
    imprints: safeObj.imprints ?? {}, 
    imprintLocks: safeObj.imprintLocks ?? { I: false, II: false, III: false, IV: false, V: false }, 
    nickname: nickname,
    title: safeObj.title ?? '',
    monthItems: safeObj.monthItems ?? 0,
    gamesPlayed: safeObj.gamesPlayed ?? 0,
    maxEnhanceHistory: safeObj.maxEnhanceHistory ?? (safeObj.enhance ?? 0),
    maxJobEnhanceHistory: safeObj.maxJobEnhanceHistory ?? (safeObj.jobEnhance ?? 0),
  };
}

function profileText(profile) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const currentEnhance = getCurrentEnhanceLevel(p);
  const [wName] = getWeaponInfo(currentEnhance, p.job);
  const refineStar = REFINE_STARS[p.refine] || '';
  
  const totalMult = getGoldMultiplier(p).toFixed(2);

  const jobNames = { stinger: '스팅거', sentinel: '센티넬', shadow: '섀도우' };
  const jobDisplay = p.job ? `${jobNames[p.job] || p.job} (Lv.${p.jobSkillLevel || 1})` : '없음';

  return [
    ``,
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    `칭호 : ${p.title}`,
    `🎖️ 직업 : ${jobDisplay}`,
    `🎯 무기 : +${currentEnhance} ${wName}`,
    `🔥 제련 : ${refineStar}`,
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

function resourceText(profile) {
  const p = createProfile(profile);
  return [
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${(p.gold || 0).toLocaleString()}개`,
    `🔑 비밀열쇠 : ${(p.keys || 0).toLocaleString()}개`,
    `📦 보급 : ${(p.monthItems || 0).toLocaleString()}개`
  ].join('\n');
}

function createBattle(profile) {
  const multiMeetBonus = getImprintTotalBonus(profile, 'multiMeet');
  const matchRoll = Math.random() * 100;
  let mode = '솔로';
  
  if (matchRoll >= (85 - multiMeetBonus) && matchRoll < (95 - multiMeetBonus)) mode = '듀오';
  else if (matchRoll >= (95 - multiMeetBonus)) mode = '스쿼드';

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
    escapeUsed: false, 
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

  const currentEnhance = getCurrentEnhanceLevel(p);
  const wName = getWeaponInfo(currentEnhance, p.job)[0];
  const reqExp = getRequiredExp(p.level);
  const refineStar = REFINE_STARS[p.refine] || '';
  
  const totalMult = getGoldMultiplier(p).toFixed(2);

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
    `🎯 무기 : +${currentEnhance} ${wName}`,
    `🔥 제련 : ${refineStar}`,
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

function calculateCombatDamage(profile, battle, rawDamage) {
  let helmetReduce = (battle.helmetLevel > 0 && battle.helmetDurability > 0) ? (battle.helmetLevel * 3) : 0;
  let vestReduce = (battle.vestLevel > 0 && battle.vestDurability > 0) ? (battle.vestLevel * 3) : 0;
  
  const imprintDamageReduce = getImprintTotalBonus(profile, 'damageReduce');
  const totalReduce = helmetReduce + vestReduce + imprintDamageReduce;
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

function triggerShadowLoot(profile, battle) {
  const randVal = Math.random() * 100;
  const keyChanceBonus = getImprintTotalBonus(profile, 'keyChance');

  if (randVal < 50) {
    const combatPower = getCombatPower(profile);
    const lootCash = combatPower * 100;
    battle.accumulatedCash += lootCash;
    return `💵 현금 +${won(lootCash)}`;
  } else if (randVal < (80 - keyChanceBonus)) {
    const ampInfo = getAmplifyInfo(profile ? profile.combatLevel : 0);
    const goldAmt = rand(ampInfo.minGold, ampInfo.maxGold);
    profile.gold += goldAmt;
    battle.accumulatedGold = (battle.accumulatedGold || 0) + goldAmt;
    return `🧈 금괴 +${goldAmt}개`;
  } else {
    profile.keys += 1;
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + 1;
    return `🔑 비밀열쇠 +1개`;
  }
}

function resolveFarmFight(profile, battle) {
  let resultMessages = [];
  let earnedCash = 0;
  const targetName = getRandomSurvivorName(); 
  const combatLv = profile.combatLevel || 0;
  const mult = getGoldMultiplier(profile);
  const ampInfo = getAmplifyInfo(combatLv);

  let currentFarmTable = FARM_TABLE.solo;
  if (battle.mode === '듀오') currentFarmTable = FARM_TABLE.duo;
  else if (battle.mode === '스쿼드') currentFarmTable = FARM_TABLE.squad;

  let outcome = pickWeighted(currentFarmTable);

  if (outcome === 'supply') {
    const combatPower = getCombatPower(profile);
    earnedCash = combatPower * 10;
    
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
      let goldBonus = rand(ampInfo.minGold, ampInfo.maxGold);
      const goldChanceBonus = getImprintTotalBonus(profile, 'goldChance');
      if (Math.random() < goldChanceBonus) {
        goldBonus += 1;
      }
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
      earnedCash = jackpotAmt;
      battle.accumulatedCash += earnedCash;
      mainText = `[소소한 잭팟!] 현금 ${won(jackpotAmt)} 획득!`;
      break;
    }
    case 'damage': {
      const rawDmg = rand(12, 25);
      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rawDmg);

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);
      
      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      mainText = `${targetName}의 사격을 받아 기습당했습니다!\nHP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    case 'kill_single': {
      let killCount = 1;
      const assistCount = 0;
      const triggerChance = (profile.jobSkillLevel || 1) * 0.01;

      let sentinelTriggered = false;
      if (profile.job === 'sentinel') {
        if (Math.random() < triggerChance) {
          sentinelTriggered = true;
        }
      }

      let skillNote = "";
      if (profile.job === 'stinger' && Math.random() < triggerChance) {
        killCount = rand(4, 5);
        skillNote += `\n⚡ [스팅거 스킬 발동!] 전투 성과가 급증하여 ${killCount} KILL을 달성했습니다!`;
      }

      let totalDamageVal = 0;
      let hitPartsList = [];

      for (let i = 0; i < killCount; i++) {
        const { hitPartName, damageVal } = calculatePartDamage(profile, sentinelTriggered);
        totalDamageVal += damageVal;
        hitPartsList.push(sentinelTriggered ? '헤드' : hitPartName);
      }

      if (sentinelTriggered) {
        skillNote += `\n🛡️ [센티넬 스킬 발동!] 정밀 사격으로 적의 헤드를 정확히 타격했습니다!`;
      }

      const partsText = hitPartsList.join(', ');

      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rand(8, 20));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const killAssistReward = Math.round(((killCount * 500) + (assistCount * 250)) * mult);
      const damageReward = Math.round((totalDamageVal * 100) * mult);
      const finalReward = damageReward + killAssistReward;
      
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      if (profile.job === 'shadow' && Math.random() < triggerChance) {
        const shadowLoot = triggerShadowLoot(profile, battle);
        skillNote += `\n🗡️ [섀도우 스킬 발동!] 은밀하게 전리품을 획득했습니다: ${shadowLoot}`;
      }

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      let killDetailText = `당신이 적 부위(${partsText})에 명중시켜 서바이버가 사망했습니다.`;

      const expReward = 126;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + expReward;

      mainText = `[${killCount} KILL] (+${won(killAssistReward)})${skillNote}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg} (EXP +${expReward})${notes}`;
      break;
    }
    case 'kill_multi': {
      let killCount = rand(2, 3);
      const assistCount = rand(0, 2);
      const triggerChance = (profile.jobSkillLevel || 1) * 0.01;

      let sentinelTriggered = false;
      if (profile.job === 'sentinel') {
        if (Math.random() < triggerChance) {
          sentinelTriggered = true;
        }
      }

      let skillNote = "";
      if (profile.job === 'stinger' && Math.random() < triggerChance) {
        killCount = rand(4, 5);
        skillNote += `\n⚡ [스팅거 스킬 발동!] 전투 성과가 급증하여 ${killCount} KILL을 달성했습니다!`;
      }

      let totalDamageVal = 0;
      let hitPartsList = [];

      for (let i = 0; i < killCount; i++) {
        const { hitPartName, damageVal } = calculatePartDamage(profile, sentinelTriggered);
        totalDamageVal += damageVal;
        hitPartsList.push(sentinelTriggered ? '헤드' : hitPartName);
      }

      if (sentinelTriggered) {
        skillNote += `\n🛡️ [센티넬 스킬 발동!] 정밀 사격으로 적의 헤드를 정확히 타격했습니다!`;
      }

      const partsText = hitPartsList.join(', ');

      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rand(15, 30));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const killAssistReward = Math.round(((killCount * 500) + (assistCount * 250)) * mult);
      const damageReward = Math.round((totalDamageVal * 100) * mult);
      const finalReward = damageReward + killAssistReward;
      
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      if (profile.job === 'shadow' && Math.random() < triggerChance) {
        const shadowLoot = triggerShadowLoot(profile, battle);
        skillNote += `\n🗡️ [섀도우 스킬 발동!] 은밀하게 전리품을 획득했습니다: ${shadowLoot}`;
      }

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';

      let killTextHeader = assistCount > 0 
        ? `[${killCount} KILL / ${assistCount} ASSIST] (+${won(killAssistReward)})`
        : `[${killCount} KILL] (+${won(killAssistReward)})`;

      let killDetailText = `당신이 적 부위(${partsText})에 명중시켜 서바이버가 사망했습니다.`;

      const expReward = 150;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + expReward;

      mainText = `${killTextHeader}${skillNote}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg} (EXP +${expReward})${notes}`;
      break;
    }
    default: {
      const lootCash = rand(100, 500) * mult;
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
  if (battle.escapeUsed) {
    return { text: `⚠️ 도망은 한 게임당 1번만 사용할 수 있습니다!`, category: 'already_used' };
  }
  battle.escapeUsed = true;

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
  
  const remainingTurns = battle.maxTurn - battle.turn;
  if (remainingTurns > 0) {
    const dec = Math.max(1, Math.floor(battle.survivors / Math.max(1, remainingTurns + 1)) + rand(1, 3));
    battle.survivors = Math.max(2, battle.survivors - dec); 
  } else {
    battle.survivors = 1;
  }
}

function processBattleResult(profile, battle, isWin) {
  if (isWin) {
    const baseCash = battle.accumulatedCash;
    const extraCash = Math.floor(baseCash * 0.3);
    const totalCash = baseCash + extraCash;

    const baseExp = battle.accumulatedExp || 100;
    const extraExp = Math.floor(baseExp * 0.3);
    const totalExp = baseExp + extraExp;

    profile.cash += totalCash;
    addExp(profile, totalExp);

    return [
      `== 🏆 [우승] 치킨 획득! (${battle.turn}턴) ==`,
      `💵 추가 현금: ${won(extraCash)} | EXP +${extraExp}`,
      `💵 현금 +${won(totalCash)}`,
      `⭐ EXP +${totalExp}`,
      `🧈 금괴 +${(battle.accumulatedGold || 0)}개`,
      `🔑 비밀열쇠 +${(battle.accumulatedKeys || 0)}개`
    ].join('\n');
  } else {
    const totalCash = battle.accumulatedCash || 0;
    const totalExp = battle.accumulatedExp || 100;

    profile.cash += totalCash;
    addExp(profile, totalExp);

    return [
      `== 💀 [사망] 탈락 (${battle.turn}턴) ==`,
      `💵 현금 +${won(totalCash)}`,
      `⭐ EXP +${totalExp}`,
      `🧈 금괴 +${(battle.accumulatedGold || 0)}개`,
      `🔑 비밀열쇠 +${(battle.accumulatedKeys || 0)}개`
    ].join('\n');
  }
}

function startGame(profile) {
  const battle = createBattle(profile);
  const statusMsg = battleStatusBoard(profile, battle);
  return { battle, message: statusMsg };
}

function processTurn(profile, battle, actionType) {
  if (!battle || battle.finished) {
    return { text: "진행 중인 전투가 없거나 이미 종료되었습니다.", finished: true };
  }

  let actionResultText = "";

  if (actionType === '파밍' || actionType === 'farm') {
    const farmRes = resolveFarmFight(profile, battle);
    actionResultText = farmRes.text;
  } else if (actionType === '도망' || actionType === 'escape') {
    const escapeRes = resolveEscapeEvent(profile, battle);
    actionResultText = escapeRes.text;
  } else {
    actionResultText = "알 수 없는 행동입니다.";
  }

  const buffMsgs = processBuffs(battle);
  applyZoneAttrition(battle);

  let combinedMessage = [actionResultText];
  if (buffMsgs.length > 0) {
    combinedMessage.push(...buffMsgs);
  }

  if (!battle.alive) {
    battle.finished = true;
    const resultMsg = processBattleResult(profile, battle, false);
    return { text: `${combinedMessage.join('\n')}\n\n${resultMsg}`, finished: true };
  }

  battle.turn += 1;

  if (battle.turn > battle.maxTurn || battle.survivors <= 1) {
    battle.finished = true;
    const resultMsg = processBattleResult(profile, battle, true);
    return { text: `${combinedMessage.join('\n')}\n\n${resultMsg}`, finished: true };
  }

  const nextBoard = battleStatusBoard(profile, battle);
  return {
    text: `${combinedMessage.join('\n')}\n\n------------------\n${nextBoard}`,
    finished: false
  };
}

module.exports = {
  startGame,
  processTurn,
  createProfile
};

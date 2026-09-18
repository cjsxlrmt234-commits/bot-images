const JOB_CATALOG = {
  "warrior": [
    "전사",
    1,
    "warrior",
    "WARRIOR",
    "검"
  ],
  "archer": [
    "궁수",
    1,
    "archer",
    "ARCHER",
    "활"
  ],
  "wizard": [
    "마법사",
    1,
    "wizard",
    "WIZARD",
    "지팡이"
  ],
  "thief": [
    "도적",
    1,
    "thief",
    "THIEF",
    "단검"
  ],
  "berserker": [
    "버서커",
    2,
    "warrior"
  ],
  "swordmaster": [
    "소드마스터",
    2,
    "warrior"
  ],
  "battlemage": [
    "마검사",
    2,
    "warrior"
  ],
  "sniper": [
    "스나이퍼",
    2,
    "archer"
  ],
  "ranger": [
    "레인저",
    2,
    "archer"
  ],
  "hawkeye": [
    "호크아이",
    2,
    "archer"
  ],
  "archmage": [
    "아크메이지",
    2,
    "wizard"
  ],
  "elementalist": [
    "엘리멘탈리스트",
    2,
    "wizard"
  ],
  "necromancer": [
    "네크로맨서",
    2,
    "wizard"
  ],
  "shadow": [
    "섀도우",
    2,
    "thief"
  ],
  "assassin": [
    "어쌔신",
    2,
    "thief"
  ],
  "dualblade": [
    "듀얼블레이드",
    2,
    "thief"
  ]
};
const JOB_NAMES = Object.fromEntries(Object.entries(JOB_CATALOG).map(([k,v])=>[k,v[0]]));


// 전직 계승형 스킬 시스템: 1차 스킬은 2차 전직 후에도 유지된다.
const JOB_SKILLS = {
  warrior: { tier:1, passive:'전투 본능', active:'전력 베기', passiveDesc:'스킬 Lv당 공격력 +1%', activeDesc:'다음 파밍 공격의 처치 확률 증가 (스킬 Lv에 따라 성장)', daily:3 },
  archer: { tier:1, passive:'약점 조준', active:'집중 사격', passiveDesc:'스킬 Lv당 치명타 확률 +0.5%p', activeDesc:'다음 파밍 공격의 치명타 확률 증가 (스킬 Lv에 따라 성장)', daily:3 },
  wizard: { tier:1, passive:'마력 증폭', active:'마력 폭주', passiveDesc:'스킬 Lv당 치명타 피해 +2%', activeDesc:'다음 3회 파밍 조우의 처치 확률 증가 (스킬 Lv에 따라 성장)', daily:3 },
  thief: { tier:1, passive:'행운의 손', active:'그림자 습격', passiveDesc:'스킬 Lv당 파밍 희귀 재화 이벤트 가중치 +1%', activeDesc:'다음 파밍 처치의 현금 보상 증가 (스킬 Lv에 따라 성장)', daily:3 },
  berserker: { tier:2, passive:'광전사의 피', active:'피의 폭주', passiveDesc:'HP가 낮을수록 파밍 공격력과 처치 보정 증가', activeDesc:'HP 20 소모 후 다음 파밍 처치 확률 증가 (스킬 Lv에 따라 성장)', daily:2 },
  swordmaster: { tier:2, passive:'검의 경지', active:'일섬', passiveDesc:'스킬 Lv당 카운터 확률 +0.3%p', activeDesc:'다음 파밍 실패 시 카운터 판정을 1회 추가', daily:2 },
  battlemage: { tier:2, passive:'마력 검술', active:'차원 균열', passiveDesc:'C~EX 계열 출현 가중치가 스킬 Lv만큼 증가', activeDesc:'마검 전용 던전 입장', daily:0 },
  sniper: { tier:2, passive:'헤드샷', active:'필살 저격', passiveDesc:'치명타 공격의 최종 처치 확률 x1.2', activeDesc:'다음 파밍 처치 확률을 등급별 최소치까지 보정', daily:2 },
  ranger: { tier:2, passive:'연속 사격', active:'화살비', passiveDesc:'스킬 Lv% 확률로 실패 시 피해 없이 1회 재공격', activeDesc:'다음 파밍 공격을 다회 판정 (스킬 Lv에 따라 공격 횟수 성장)', daily:2 },
  hawkeye: { tier:2, passive:'매의 눈', active:'천공 추적', passiveDesc:'사냥 +등급 출현 확률 증가', activeDesc:'일정 횟수 사냥에서 등급 재추첨 (스킬 Lv에 따라 횟수 성장)', daily:2 },
  archmage: { tier:2, passive:'대마력', active:'메테오', passiveDesc:'스킬 Lv당 치명타 피해 +3%', activeDesc:'다음 파밍 공격의 처치 확률 증가 (스킬 Lv에 따라 성장)', daily:2 },
  elementalist: { tier:2, passive:'원소 순환', active:'원소 폭발', passiveDesc:'파밍 게임마다 화염/냉기/번개/대지 중 하나의 원소 효과', activeDesc:'현재 파밍의 원소 효과 강화 (스킬 Lv에 따라 성장)', daily:2 },
  necromancer: { tier:2, passive:'영혼 수확', active:'망자의 군세', passiveDesc:'파밍 처치 시 10%+스킬 Lv% 확률로 영혼 +1', activeDesc:'영혼을 소모해 다음 파밍 처치 확률 증가 (스킬 Lv에 따라 비용/효과 성장)', daily:2 },
  shadow: { tier:2, passive:'약탈', active:'그림자 약탈', passiveDesc:'스킬 Lv% 확률로 처치 현금/보석 보상을 1회 추가 획득', activeDesc:'다음 파밍 처치의 현금 보상 증가 (스킬 Lv에 따라 성장)', daily:2 },
  assassin: { tier:2, passive:'급소 공격', active:'절명', passiveDesc:'치명타 시 등급 보정된 즉사 판정 추가', activeDesc:'HP 10 소모 후 다음 파밍 치명타 확률 증가 (스킬 Lv에 따라 성장)', daily:2 },
  dualblade: { tier:2, passive:'쌍검 연격', active:'팬텀 러시', passiveDesc:'스킬 Lv% 확률로 실패 시 피해 없이 1회 재공격', activeDesc:'다음 파밍 공격을 다회 판정 (스킬 Lv에 따라 공격 횟수 성장)', daily:2 }
};

function getBaseJobCode(profile) {
  if (!profile) return null;
  if (profile.firstJob && JOB_CATALOG[profile.firstJob] && JOB_CATALOG[profile.firstJob][1] === 1) return profile.firstJob;
  const data = JOB_CATALOG[profile.job];
  if (!data) return null;
  return data[1] === 1 ? profile.job : data[2];
}
function getSecondJobCode(profile) {
  if (!profile) return null;
  if (profile.secondJob && JOB_CATALOG[profile.secondJob] && JOB_CATALOG[profile.secondJob][1] === 2) return profile.secondJob;
  const data = JOB_CATALOG[profile.job];
  return data && data[1] === 2 ? profile.job : null;
}
function getJobSkillLevelFor(profile, jobCode) {
  if (!jobCode) return 0;
  const map = profile && profile.jobSkillLevels && typeof profile.jobSkillLevels === 'object' ? profile.jobSkillLevels : {};
  const fallback = profile && profile.job === jobCode ? profile.jobSkillLevel : 1;
  return normalizeStoredInt(map[jobCode], normalizeStoredInt(fallback, 1, 1, 10), 1, 10);
}
function setJobSkillLevelFor(profile, jobCode, level) {
  if (!profile.jobSkillLevels || typeof profile.jobSkillLevels !== 'object') profile.jobSkillLevels = {};
  profile.jobSkillLevels[jobCode] = normalizeStoredInt(level, 1, 1, 10);
  if (profile.job === jobCode) profile.jobSkillLevel = profile.jobSkillLevels[jobCode];
}
function ensureSkillState(profile) {
  if (!profile.skillState || typeof profile.skillState !== 'object') profile.skillState = {};
  const st = profile.skillState;
  if (typeof st.date !== 'string') st.date = '';
  if (!st.dailyUses || typeof st.dailyUses !== 'object') st.dailyUses = {};
  if (!st.buffs || typeof st.buffs !== 'object') st.buffs = {};
  st.souls = normalizeStoredInt(st.souls, 0, 0);
  const today = getKSTDateString();
  if (st.date !== today) { st.date = today; st.dailyUses = {}; st.buffs = {}; }
  return st;
}
function getSkillDailyMax(profile, jobCode) {
  const def = JOB_SKILLS[jobCode];
  if (!def) return 0;
  if (jobCode === 'battlemage') return getJobSkillLevelFor(profile, jobCode);
  return def.daily || 0;
}
function getSkillUses(profile, jobCode) {
  const st = ensureSkillState(profile);
  return normalizeStoredInt(st.dailyUses[jobCode], 0, 0);
}
function consumeSkillUse(profile, jobCode) {
  const st = ensureSkillState(profile), max = getSkillDailyMax(profile, jobCode), used = getSkillUses(profile, jobCode);
  if (max > 0 && used >= max) return false;
  st.dailyUses[jobCode] = used + 1;
  return true;
}
function getInheritedJobCodes(profile) {
  return [getBaseJobCode(profile), getSecondJobCode(profile)].filter(Boolean);
}


// 업적 시스템: 완료한 업적 1개당 모든 보상성 현금 획득량 +1%.
const ACHIEVEMENT_DEFS = [
  { id:'lv10', name:'첫 성장', desc:'캐릭터 Lv.10 달성', type:'level', target:10 },
  { id:'lv30', name:'숙련된 모험가', desc:'캐릭터 Lv.30 달성', type:'level', target:30 },
  { id:'lv50', name:'강자의 길', desc:'캐릭터 Lv.50 달성', type:'level', target:50 },
  { id:'lv100', name:'정점의 모험가', desc:'캐릭터 Lv.100 달성', type:'level', target:100 },
  { id:'farm100', name:'파밍 입문자', desc:'파밍 게임 100회 완료', type:'games', target:100 },
  { id:'farm500', name:'파밍 숙련자', desc:'파밍 게임 500회 완료', type:'games', target:500 },
  { id:'farm1000', name:'파밍의 달인', desc:'파밍 게임 1,000회 완료', type:'games', target:1000 },
  { id:'enh10', name:'강화의 시작', desc:'모험가 무기 최고 +10 달성', type:'enhance', target:10 },
  { id:'enh20', name:'강화의 끝', desc:'모험가 무기 최고 +20 달성', type:'enhance', target:20 },
  { id:'jobenh10', name:'전직 무기 숙련', desc:'전직 무기 최고 +10 달성', type:'jobEnhance', target:10 },
  { id:'jobenh20', name:'전직 무기 초월', desc:'전직 무기 최고 +20 달성', type:'jobEnhance', target:20 },
  { id:'refine10', name:'완벽한 제련', desc:'제련 +10 달성', type:'refine', target:10 },
  { id:'collection10', name:'몬스터 연구가', desc:'몬스터 컬렉션 완성 10종 달성', type:'collection', target:10 },
  { id:'titles5', name:'칭호 수집가', desc:'칭호 5개 보유', type:'titles', target:5 },
  ...Object.keys(JOB_SKILLS).map(jobCode => ({
    id:'master_'+jobCode,
    name:(JOB_NAMES[jobCode] || jobCode)+' 마스터',
    desc:(JOB_NAMES[jobCode] || jobCode)+' 스킬 Lv.10 달성',
    type:'jobMaster', target:10, jobCode
  }))
];

function getAchievementCurrent(profile, def) {
  if (!profile || !def) return 0;
  switch (def.type) {
    case 'level': return normalizeStoredInt(profile.level, 1, 1);
    case 'games': return normalizeStoredInt(profile.gamesPlayed, 0, 0);
    case 'enhance': return normalizeStoredInt(profile.maxEnhanceHistory ?? profile.enhance, 0, 0);
    case 'jobEnhance': return normalizeStoredInt(profile.maxJobEnhanceHistory ?? profile.jobEnhance, 0, 0);
    case 'refine': return normalizeStoredInt(profile.refine, 0, 0);
    case 'collection': return getMonsterCollectionPoints(profile);
    case 'titles': return Array.isArray(profile.ownedTitles) ? profile.ownedTitles.length : 0;
    case 'jobMaster': {
      const map = profile.jobSkillLevels && typeof profile.jobSkillLevels === 'object' ? profile.jobSkillLevels : {};
      if (Object.hasOwn(map, def.jobCode)) return normalizeStoredInt(map[def.jobCode], 0, 0, 10);
      if (profile.job === def.jobCode) return normalizeStoredInt(profile.jobSkillLevel, 0, 0, 10);
      return 0;
    }
    default: return 0;
  }
}

function isAchievementCompleted(profile, def) {
  return getAchievementCurrent(profile, def) >= def.target;
}

function getCompletedAchievementCount(profile) {
  return ACHIEVEMENT_DEFS.reduce((n, def) => n + (isAchievementCompleted(profile, def) ? 1 : 0), 0);
}

function getAchievementCashBonusPct(profile) {
  return getCompletedAchievementCount(profile); // 업적 1개 = +1%
}

function applyAchievementCashBonus(amount, profile) {
  const value = Math.max(0, Number(amount) || 0);
  return Math.floor(value * (1 + getAchievementCashBonusPct(profile) / 100));
}

function getAchievementText(profile) {
  const completed = getCompletedAchievementCount(profile);
  const lines = [
    '🏆 [업적]',
    `완료 : ${completed}/${ACHIEVEMENT_DEFS.length}`,
    `💵 현금 획득량 보너스 : +${completed}%`,
    '※ 업적 1개 완료마다 현금 획득량이 영구적으로 +1% 증가합니다.',
    ''
  ];
  ACHIEVEMENT_DEFS.forEach((def, idx) => {
    const current = getAchievementCurrent(profile, def);
    const done = current >= def.target;
    lines.push(`${done ? '✅' : '⬜'} ${idx+1}. ${def.name}`);
    lines.push(`   ${def.desc} (${Math.min(current,def.target).toLocaleString()}/${def.target.toLocaleString()})`);
  });
  return lines.join('\n');
}

function getActiveSkillParams(profile, jobCode) {
  const lv = getJobSkillLevelFor(profile, jobCode);
  switch (jobCode) {
    case 'warrior': return { chanceMult: 1.30 + lv * 0.02 }; // Lv1 1.32 -> Lv10 1.50
    case 'archer': return { critBonus: 30 + lv * 2 + (lv >= 10 ? 5 : 0) }; // Lv10 마스터 +5%p
    case 'wizard': return { chanceMult: 1.05 + lv * 0.005, encounters: 3 + (lv >= 10 ? 1 : 0) }; // Lv10 마스터 지속 +1회
    case 'thief': return { cashMult: 1.50 + lv * 0.05 }; // 1.55 -> 2.00
    case 'berserker': return { chanceMult: 1.50 + lv * 0.05, hpCost: 20 }; // 1.55 -> 2.00
    case 'swordmaster': return { counterBonus: lv }; // 추가 판정 확률에 +1~10%p
    case 'sniper': return { normalMin: 30 + lv * 2, exMin: 5 + lv * 0.5, exPlusMin: 1 + lv * 0.2 };
    case 'ranger': return { attacks: (lv >= 6 ? 3 : 2) + (lv >= 10 ? 1 : 0) };
    case 'hawkeye': return { hunts: 3 + Math.floor((lv - 1) / 3) + (lv >= 10 ? 1 : 0) }; // Lv10 마스터 +1회
    case 'archmage': return { chanceMult: 1.25 + lv * 0.025 + (lv >= 10 ? 0.10 : 0) }; // Lv10 마스터 +0.10
    case 'elementalist': return { elementMult: 2 + lv * 0.1 + (lv >= 10 ? 0.25 : 0) }; // Lv10 마스터 +0.25
    case 'necromancer': return { chanceMult: 1.25 + lv * 0.05, soulCost: (lv >= 10 ? 7 : lv >= 7 ? 8 : lv >= 4 ? 9 : 10) - (lv >= 10 ? 1 : 0) };
    case 'shadow': return { cashMult: 1.50 + lv * 0.05 + (lv >= 10 ? 0.10 : 0) }; // Lv10 마스터 +0.10
    case 'assassin': return { critChance: Math.min(100, 55 + lv * 4.5), hpCost: 10 - (lv >= 10 ? 5 : 0) }; // Lv10 마스터 HP 소모 -5
    case 'dualblade': return { attacks: (lv >= 6 ? 3 : 2) + (lv >= 10 ? 1 : 0) };
    default: return {};
  }
}


function isJobSkillMaster(profile, jobCode) {
  return getJobSkillLevelFor(profile, jobCode) >= 10;
}

function getMasterEffectDescription(jobCode) {
  const map = {
    warrior: '전력 베기 사용 시 15% 확률로 일일 사용 횟수 미소모',
    archer: '집중 사격 치명타 보너스 +5%p 추가',
    wizard: '마력 폭주 지속 횟수 +1회',
    thief: '그림자 습격으로 처치 시 10% 확률로 비밀열쇠 +1',
    berserker: '피의 폭주 발동 시 20% 확률로 HP 소모 없음',
    swordmaster: '일섬 추가 카운터 판정 보정 +5%p',
    battlemage: '차원 균열 최종 현금·보석 보상 +10%',
    sniper: '필살 저격 사용 시 10% 확률로 일일 사용 횟수 미소모',
    ranger: '화살비 공격 판정 +1회',
    hawkeye: '천공 추적 지속 +1회',
    archmage: '메테오 처치 확률 배율 +0.10',
    elementalist: '원소 폭발 강화 배율 +0.25',
    necromancer: '망자의 군세 영혼 소모 -1',
    shadow: '그림자 약탈 현금 배율 +0.10',
    assassin: '절명 HP 소모 -5',
    dualblade: '팬텀 러시 공격 판정 +1회'
  };
  return map[jobCode] || '';
}

function getPendingSkillEffects(profile) {
  const st = ensureSkillState(profile);
  const b = st.buffs || {};
  const rows = [];
  const add = (label, count, suffix='회 대기') => { if ((Number(count)||0) > 0) rows.push(`${label} ${count}${suffix}`); };
  add('전력 베기', b.warriorSlash);
  add('집중 사격', b.archerFocus);
  add('마력 폭주', b.wizardSurge, '회 남음');
  add('그림자 습격', b.thiefAmbush);
  add('피의 폭주', b.berserkerRage);
  add('일섬', b.swordmasterIssen);
  add('필살 저격', b.sniperShot);
  add('화살비', b.rangerRain);
  add('천공 추적', b.hawkeyeTrack, '회 남음');
  add('메테오', b.archmageMeteor);
  add('원소 폭발', b.elementalistBurst);
  add('망자의 군세', b.necroArmy);
  add('그림자 약탈', b.shadowPlunder);
  add('절명', b.assassinExecute);
  add('팬텀 러시', b.dualRush);
  return rows;
}

function formatSkillNumber(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return n.toFixed(digits).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function getActiveSkillDescription(profile, jobCode) {
  const p = getActiveSkillParams(profile, jobCode);
  switch (jobCode) {
    case 'warrior': return `다음 파밍 공격의 처치 확률 x${formatSkillNumber(p.chanceMult)}`;
    case 'archer': return `다음 파밍 공격의 치명타 확률 +${formatSkillNumber(p.critBonus,1)}%p`;
    case 'wizard': return `다음 ${p.encounters}회 파밍 조우의 처치 확률 x${formatSkillNumber(p.chanceMult,3)}`;
    case 'thief': return `다음 파밍 처치의 현금 보상 x${formatSkillNumber(p.cashMult)}`;
    case 'berserker': return `다음 파밍 시 HP ${p.hpCost} 소모, 처치 확률 x${formatSkillNumber(p.chanceMult)}`;
    case 'swordmaster': return `다음 파밍 실패 시 카운터 판정 1회 추가 (추가 판정 +${p.counterBonus}%p)`;
    case 'battlemage': return `마검 전용 던전 입장 (Lv에 따라 일일 횟수·토벌 수 증가)`;
    case 'sniper': return `다음 파밍 최소 처치 확률 보정 (일반 ${formatSkillNumber(p.normalMin,1)}% / EX ${formatSkillNumber(p.exMin,1)}% / EX+ ${formatSkillNumber(p.exPlusMin,1)}%)`;
    case 'ranger': return `다음 파밍 공격을 총 ${p.attacks}회 판정해 1회라도 성공하면 처치`;
    case 'hawkeye': return `다음 ${p.hunts}회 사냥에서 등급을 한 번 더 뽑아 높은 등급 적용`;
    case 'archmage': return `다음 파밍 공격의 처치 확률 x${formatSkillNumber(p.chanceMult)}`;
    case 'elementalist': return `현재 파밍의 원소 효과를 다음 1회 x${formatSkillNumber(p.elementMult)} 강화`;
    case 'necromancer': return `영혼 ${p.soulCost}개 소모, 다음 파밍 처치 확률 x${formatSkillNumber(p.chanceMult)}`;
    case 'shadow': return `다음 파밍 처치의 현금 보상 x${formatSkillNumber(p.cashMult)}`;
    case 'assassin': return `다음 파밍 시 HP ${p.hpCost} 소모, 치명타 확률 ${formatSkillNumber(p.critChance,1)}%`;
    case 'dualblade': return `다음 파밍 공격을 총 ${p.attacks}회 판정`;
    default: return JOB_SKILLS[jobCode]?.activeDesc || '';
  }
}
//
// game.js - 카카오 챗봇 호환 전체 통합 스크립트
//

const VAULT_CAPACITY_PER_LEVEL = 2000000;
const EXP_PER_LEVEL_BASE = 200;
const FARM_DAILY_LIMIT = 1000;
const FARM_QUEST_MILESTONES = [100,250,500,1000,1500,2000];
const JOB_UNLOCK_CASH = 50000000;
const JOB_UNLOCK_GOLD = 500;
const JOB_CHANGE_CASH = 100000000;
const JOB_CHANGE_GOLD = 2000;
const JOB_CHANGE_GEM = 2000;
const REFINE_BASE_CASH = 10000000;

const BASE_URL = 'https://raw.githubusercontent.com/cjsxlrmt234-commits/bot-images/main'; 

const MONTHLY_TITLES = {
  1: "신년의 개척자",
  2: "얼어붙은 심장",
  3: "봄의 전령",
  4: "벚꽃의 잔상",
  5: "푸른 초원의 수호자",
  6: "뜨거운 태양의 기사",
  7: "폭풍을 부르는 자",
  8: "한여름의 정점",
  9: "결실의 수확자",
  10: "낙엽의 추적자",
  11: "서릿발의 척살자",
  12: "한해의 종말"
};

const SEASON_TITLES = {
  1: "각성하는 자",
  2: "시험을 넘은 자",
  3: "전장을 지배하는 자",
  4: "한계를 깬 자",
  5: "정점에 닿은 자",
  6: "초월적인 존재",
  7: "신역에 오른 자",
  8: "불멸의 영웅",
  9: "군림하는 제왕",
  10: "전설의 종결자",
  11: "차원을 넘은 자",
  12: "우주의 지배자"
};

const CREATURE_GRADES = {
  "D": { name: "D등급", cashPct: 0.03, bonusGold: 0, bonusGem: 0, rank: 1 },
  "C": { name: "C등급", cashPct: 0.05, bonusGold: 0, bonusGem: 0, rank: 2 },
  "B": { name: "B등급", cashPct: 0.07, bonusGold: 0, bonusGem: 0, rank: 3 },
  "A": { name: "A등급", cashPct: 0.10, bonusGold: 1, bonusGem: 0, rank: 4 },
  "S": { name: "S등급", cashPct: 0.20, bonusGold: 1, bonusGem: 1, rank: 5 },
  "EX": { name: "EX등급", cashPct: 0.30, bonusGold: 1, bonusGem: 1, rank: 6 }
};

// 크리처 등급별 이미지 번호 (creature_XXXX.png 형식)
const CREATURE_IMAGE_IDS = {
  "D": [1001, 1002, 1003, 1004],
  "C": [2001],
  "B": [3001],
  "A": [4001],
  "S": [5001, 5002, 5003],
  "EX": [6001]
};

function getCreatureImage(gradeCode) {
  const ids = CREATURE_IMAGE_IDS[gradeCode];
  if (!ids || ids.length === 0) return null;
  const chosenId = ids[Math.floor(Math.random() * ids.length)];
  return `${BASE_URL}/images/creature_${chosenId}.png`;
}

const prefixes = {
  "E+등급": [
    "날쌘",
    "겁없는",
    "성난",
    "튼튼한",
    "배고픈"
  ],
  "D+등급": [
    "초보",
    "약한",
    "지저분한",
    "배고픈",
    "겁먹은"
  ],
  "C+등급": [
    "단단한",
    "날쌘",
    "거친",
    "사나운",
    "독이 묻은"
  ],
  "B+등급": [
    "거대한",
    "흉포한",
    "타락한",
    "어둠의",
    "철갑"
  ],
  "A+등급": [
    "광폭한",
    "고대의",
    "지옥의",
    "군주",
    "수호자"
  ],
  "S+등급": [
    "파멸의",
    "절망의",
    "신들의",
    "혼돈의",
    "태초의"
  ],
  "EX+등급": [
    "빅뱅의",
    "태초근원",
    "우주창조",
    "신역초월",
    "절대신"
  ]
};

const monsters = [
  {name:"생쥐",grade:"E등급",description:"작고 재빠른 최하급 몬스터",image:`${BASE_URL}/images/E_1.png`},
  {name:"참새",grade:"E등급",description:"떼로 날아다니며 공격하는 작은 새",image:`${BASE_URL}/images/E_2.png`},
  {name:"두더지",grade:"E등급",description:"땅속에 숨어 있다 튀어나오는 몬스터",image:`${BASE_URL}/images/E_3.png`},
  {name:"청개구리",grade:"E등급",description:"통통 뛰어다니는 습지 몬스터",image:`${BASE_URL}/images/E_4.png`},
  {name:"다람쥐",grade:"E등급",description:"도토리를 던져 공격하는 숲 몬스터",image:`${BASE_URL}/images/E_5.png`},
  {name:"햄스터",grade:"E등급",description:"몸통 박치기를 하는 둥근 몬스터",image:`${BASE_URL}/images/E_6.png`},
  {name:"병아리",grade:"E등급",description:"떼로 몰려다니는 초원 몬스터",image:`${BASE_URL}/images/E_7.png`},
  {name:"토끼",grade:"E등급",description:"빠른 점프로 공격을 피하는 몬스터",image:`${BASE_URL}/images/E_8.png`},
  {name:"고슴도치",grade:"E등급",description:"작은 가시를 세워 방어하는 몬스터",image:`${BASE_URL}/images/E_9.png`},
  {name:"족제비",grade:"E등급",description:"빠르게 달려들어 물고 도망가는 몬스터",image:`${BASE_URL}/images/E_10.png`},
  {name:"오리",grade:"E등급",description:"물가에서 부리로 공격하는 몬스터",image:`${BASE_URL}/images/E_11.png`},
  {name:"펭귄",grade:"E등급",description:"얼음 위를 미끄러져 돌진하는 몬스터",image:`${BASE_URL}/images/E_12.png`},
  {name:"수달",grade:"E등급",description:"작은 돌멩이를 사용하는 물가 몬스터",image:`${BASE_URL}/images/E_13.png`},
  {name:"라쿤",grade:"E등급",description:"잡동사니를 주워 던지는 몬스터",image:`${BASE_URL}/images/E_14.png`},
  {name:"미어캣",grade:"E등급",description:"땅굴 주변을 지키는 경계형 몬스터",image:`${BASE_URL}/images/E_15.png`},
  {name:"기니피그",grade:"E등급",description:"둥글고 느린 초식 몬스터",image:`${BASE_URL}/images/E_16.png`},
  {name:"아기 염소",grade:"E등급",description:"작은 뿔로 들이받는 몬스터",image:`${BASE_URL}/images/E_17.png`},
  {name:"도마뱀",grade:"E등급",description:"바위 사이를 빠르게 움직이는 몬스터",image:`${BASE_URL}/images/E_18.png`},
  {name:"소라게",grade:"E등급",description:"작은 껍데기로 몸을 보호하는 몬스터",image:`${BASE_URL}/images/E_19.png`},
  {name:"아르마딜로",grade:"E등급",description:"몸을 말아 굴러오는 방어형 몬스터",image:`${BASE_URL}/images/E_20.png`},
  { name: "먼지 정령", grade: "D등급", description: "버려진 공간에서 자생하는 약한 마력의 작은 먼지 덩어리.", image: `${BASE_URL}/images/D_1.png` },
  { name: "이슬 슬라임", grade: "D등급", description: "숲속의 맑은 물웅덩이에서 발견되는 투명하고 해가 없는 물컹한 생명체.", image: `${BASE_URL}/images/D_2.png` },
  { name: "들쥐 포식자", grade: "D등급", description: "곡식 창고나 들판을 배회하며 농작물을 훔쳐 먹는 덩치 큰 일반 쥐.", image: `${BASE_URL}/images/D_3.png` },
  { name: "삐쭉이 묘목", grade: "D등급", description: "마력에 의해 이동 능력을 얻었으나 공격력은 거의 없는 새싹 괴물.", image: `${BASE_URL}/images/D_4.png` },
  { name: "청동 부스러기 곤충", grade: "D등급", description: "금속 파편을 갉아먹고 사는 장난감 크기의 기계성 곤충.", image: `${BASE_URL}/images/D_5.png` },
  { name: "좀비 거머리", grade: "D등급", description: "축축한 동굴 바닥에 서식하며 다가오는 생물의 피부에 붙는 흡혈 괴물.", image: `${BASE_URL}/images/D_6.png` },
  { name: "약초 도둑 토끼", grade: "D등급", description: "마력초의 냄새를 쫓아 모여드는 성가신 이빨의 야생 토끼.", image: `${BASE_URL}/images/D_7.png` },
  { name: "푸른 파편 박쥐", grade: "D등급", description: "지하 초입에서 서식하며 초음파로 길을 찾는 소형 박쥐.", image: `${BASE_URL}/images/D_8.png` },
  { name: "이끼 거북이", grade: "D등급", description: "등딱지에 두꺼운 이끼가 자라나 풀숲과 구분이 안 되는 소형 파충류.", image: `${BASE_URL}/images/D_9.png` },
  { name: "썩은 짚인형", grade: "D등급", description: "폐가나 마법사의 공방 버려진 구석에서 움직이기 시작한 인형.", image: `${BASE_URL}/images/D_10.png` },
  { name: "투명 꼬마 유령", grade: "D등급", description: "빛을 통과시키는 반투명한 체질로 사람의 물건을 훔쳐 도망치는 하급 영체.", image: `${BASE_URL}/images/D_11.png` },
  { name: "찰흙 요정", grade: "D등급", description: "진흙과 마력이 엉겨 붙어 사람 손 모양으로 기어 다니는 장난꾸러기 토우.", image: `${BASE_URL}/images/D_12.png` },
  { name: "날개 달린 쥐", grade: "D등급", description: "어두운 하수구를 누비며 작은 박쥐 날개로 푸드득 날아오르는 설치류.", image: `${BASE_URL}/images/D_13.png` },
  { name: "가시 버섯", grade: "D등급", description: "건드리면 터지면서 따가운 미세 포자를 공중으로 흩뿌리는 유독성 균류.", image: `${BASE_URL}/images/D_14.png` },
  { name: "녹슨 자석 괴물", grade: "D등급", description: "주변의 작은 쇳가루를 끌어모으며 바닥을 데굴데굴 굴러다니는 마력 광물.", image: `${BASE_URL}/images/D_15.png` },

  { name: "들쇠 토끼", grade: "C등급", description: "튼튼한 뒷발로 강력한 돌려차기를 구사하는 전투용 거대 토끼.", image: `${BASE_URL}/images/C_1.png` },
  { name: "바위산 뿔산양", grade: "C등급", description: "기이할 정도로 길고 단단한 나선형 뿔을 휘둘러 바위벽을 부수며 달리는 산악 짐승.", image: `${BASE_URL}/images/C_2.png` },
  { name: "독니 독사", grade: "C등급", description: "늪지대에 서식하며 물리면 마비 효과를 일으키는 초급 독사.", image: `${BASE_URL}/images/C_3.png` },
  { name: "그림자 늑대", grade: "C등급", description: "어두운 숲에서 무리를 지어 사냥하며 야간에 은신 능력이 뛰어난 맹수.", image: `${BASE_URL}/images/C_4.png` },
  { name: "고블린 투창병", grade: "C등급", description: "날카로운 뼈 창을 원거리에서 던져 사냥감을 괴롭히는 소형 휴머노이드.", image: `${BASE_URL}/images/C_5.png` },
  { name: "가시멧돼지", grade: "C등급", description: "온몸이 단단한 강철 가시로 덮여 있어 돌진 공격이 특기인 야수.", image: `${BASE_URL}/images/C_6.png` },
  { name: "부서진 해골 병사", grade: "C등급", description: "고대 전장의 잔해에서 마력에 의해 되살아난 하급 언데드 전사.", image: `${BASE_URL}/images/C_7.png` },
  { name: "하급 샐러맨더", grade: "C등급", description: "불길이 약하게 감싸고 있는 도마뱀 형태로, 뜨거운 열기를 뿜어냄.", image: `${BASE_URL}/images/C_8.png` },
  { name: "맹독 벌레떼", grade: "C등급", description: "떼 지어 날아다니며 상대의 시야를 가리고 피부를 갉아먹는 곤충형 몬스터.", image: `${BASE_URL}/images/C_9.png` },
  { name: "늪지 요괴", grade: "C등급", description: "이끼와 진흙으로 위장하여 지나가는 나그네를 물속으로 끌어들이는 괴물.", image: `${BASE_URL}/images/C_10.png` },
  { name: "구리빛 모래 여우", grade: "C등급", description: "사막의 열기를 견디며 날카로운 발톱으로 모래를 파헤쳐 기습하는 소형 야수.", image: `${BASE_URL}/images/C_11.png` },
  { name: "덩굴 채찍 식물", grade: "C등급", description: "긴 줄기를 채찍처럼 휘둘러 접근하는 생명체의 움직임을 묶어버리는 식인 식물.", image: `${BASE_URL}/images/C_12.png` },
  { name: "유령 불꽃 도깨비", grade: "C등급", description: "푸른 도깨비불을 몸에 두르고 공중을 낮게 떠다니며 시야를 교란하는 요괴.", image: `${BASE_URL}/images/C_13.png` },
  { name: "지하 수로 꼬마 악어", grade: "C등급", description: "어둡고 축축한 하수도 환경에 적응해 백색 피부와 예리한 이빨을 가진 소형 파충류.", image: `${BASE_URL}/images/C_14.png` },
  { name: "산호초 껍질 게", grade: "C등급", description: "화려한 산호가 등껍질에 자라나 독성 거품을 뿜어내는 해안가 갑각류.", image: `${BASE_URL}/images/C_15.png` },

  { name: "철갑 오크 장교", grade: "B등급", description: "두꺼운 철판 갑옷을 두르고 거대한 철퇴를 휘두르는 오크 지휘관.", image: `${BASE_URL}/images/B_1.png` },
  { name: "서리 하피", grade: "B등급", description: "매서운 얼음 바람을 일으키며 높은 고도에서 급강하해 발톱으로 공격하는 괴물.", image: `${BASE_URL}/images/B_2.png` },
  { name: "그림자 암살자", grade: "B등급", description: "빛을 흡수하는 은신 스킬을 사용해 단숨에 급소를 노리는 인간형 유령.", image: `${BASE_URL}/images/B_3.png` },
  { name: "화염 사냥개", grade: "B등급", description: "지옥의 불길을 입은 채 맹렬하게 달리는 머리 두 개 달린 마수.", image: `${BASE_URL}/images/B_4.png` },
  { name: "바위 거인", grade: "B등급", description: "산비탈의 돌무더기가 뭉쳐서 만들어진 거대한 체구의 골렘.", image: `${BASE_URL}/images/B_5.png` },
  { name: "세이렌", grade: "B등급", description: "매혹적인 노랫소리로 항해사나 모험가의 정신을 빼놓고 물속으로 유인하는 정령.", image: `${BASE_URL}/images/B_6.png` },
  { name: "맹독 아라크네", grade: "B등급", description: "온몸에서 강한 산성 독을 뿜어내며 벽과 천장을 자유롭게 기어 다니는 거미 괴물.", image: `${BASE_URL}/images/B_7.png` },
  { name: "유령 기사", grade: "B등급", description: "찢어진 깃발을 들고 밤마다 옛 전장을 순찰하는 저주받은 기사 망령.", image: `${BASE_URL}/images/B_8.png` },
  { name: "라이트닝 드레이크", grade: "B등급", description: "번개를 뿜어내기 시작하는 어린 단계의 용족 괴물.", image: `${BASE_URL}/images/B_9.png` },
  { name: "베로니카", grade: "B등급", description: "거대한 대검과 성스러운 빛의 방패를 동시에 다루며, 전방에서 적의 공격을 완벽하게 틀어막는 동시에 강력한 신성 일격으로 전장을 지배하는 최정예 철갑 전사.", image: `${BASE_URL}/images/B_10.png` },
  { name: "철갑 산양", grade: "B등급", description: "강철처럼 단단하고 거대한 뿔로 절벽을 박차며 돌진하는 고산지대 맹수.", image: `${BASE_URL}/images/B_11.png` },
  { name: "그림자 표범", grade: "B등급", description: "어두운 지형이나 그늘 속에 완벽하게 동화되어 소리 없이 사냥감을 채가는 야수.", image: `${BASE_URL}/images/B_12.png` },
  { name: "맹독 가시 고슴도치", grade: "B등급", description: "몸을 둥글게 말아 고속으로 회전하며 주변에 독성 가시를 난사하는 마수.", image: `${BASE_URL}/images/B_13.png` },
  { name: "얼음 조각사 요정", grade: "B등급", description: "주변의 수증기를 급속 냉각시켜 날카로운 얼음 칼날을 만들어 날리는 정령종.", image: `${BASE_URL}/images/B_14.png` },
  { name: "낡은 갑옷 투사", grade: "B등급", description: "주인이 사라진 채 마력으로 움직이며 거대한 대검을 무자비하게 휘두르는 언데드.", image: `${BASE_URL}/images/B_15.png` },

  { name: "심연의 리치", grade: "A등급", description: "금지된 흑마술을 극도로 연마해 영혼의 힘으로 언데드 군단을 지휘하는 마법사.", image: `${BASE_URL}/images/A_1.png` },
  { name: "서리 거룡", grade: "A등급", description: "입김만으로 주변 반경 수 킬로미터를 순식간에 얼어붙게 만드는 성숙한 용족.", image: `${BASE_URL}/images/A_2.png` },
  { name: "지옥불 미노타우로스", grade: "A등급", description: "몸 전체가 용암처럼 이글거리는 도끼를 휘두르는 미궁의 지배자.", image: `${BASE_URL}/images/A_3.png` },
  { name: "고대 뱀파이어 백작", grade: "A등급", description: "수백 년 동안 인간의 피를 흡수해 절대적인 속도와 최면 능력을 지닌 흡혈귀.", image: `${BASE_URL}/images/A_4.png` },
  { name: "폭풍의 정령왕", grade: "A등급", description: "하늘에서 거대한 번개와 폭풍을 자유자재로 불러일으키는 재앙급 정령.", image: `${BASE_URL}/images/A_5.png` },
  { name: "철혈의 와이번 킹", grade: "A등급", description: "수많은 와이번 무리를 이끄는 우두머리로, 강철 같은 비늘을 지님.", image: `${BASE_URL}/images/A_6.png` },
  { name: "성기사 멜키르", grade: "A등급", description: "신성력을 얻어 빛의 계약에 물들어 거대한 대검을 휘두르는 타락한 영웅.", image: `${BASE_URL}/images/A_7.png` },
  { name: "거대 심해 크라켄", grade: "A등급", description: "바다 한가운데서 배를 통째로 집어삼키는 다리의 촉수를 가진 거대 수중 괴물.", image: `${BASE_URL}/images/A_8.png` },
  { name: "혼돈의 나무", grade: "A등급", description: "숲 전체를 독성 안개로 물들이고 뿌리로 적을 포박하는 거대한 고대 식물.", image: `${BASE_URL}/images/A_9.png` },
  { name: "공허의 마녀", grade: "A등급", description: "차원의 틈새를 열어 시공간을 왜곡하는 저주 마법을 구사하는 최상급 마법사.", image: `${BASE_URL}/images/A_10.png` },
  { name: "혹한의 서리 표범", grade: "A등급", description: "숨을 내쉴 때마다 주변을 순식간에 영하로 떨어뜨려 행동을 봉쇄하는 설원의 포식자.", image: `${BASE_URL}/images/A_11.png` },
  { name: "암흑의 수호 기사", grade: "A등급", description: "칠흑 같은 갑옷을 두르고 영혼을 베어내는 저주받은 마법 검을 사용하는 타락한 기사.", image: `${BASE_URL}/images/A_12.png` },
  { name: "바다의 지배자 거대 가오리", grade: "A등급", description: "해저 수면을 유영하며 거대한 날갯짓으로 소용돌이를 일으켜 선박을 침몰시키는 마수.", image: `${BASE_URL}/images/A_13.png` },
  { name: "폭풍을 부르는 마녀", grade: "A등급", description: "먹구름을 몰고 다니며 벼락을 자유자재로 내리꽂아 대지를 황폐화하는 상급 마법사.", image: `${BASE_URL}/images/A_14.png` },
  { name: "공간을 삼키는 공허의 수호자", grade: "A등급", description: "뒤틀린 차원의 틈새에서 소환되어 지나가는 자의 마력과 신체 일부를 현실에서 지워버리는 거대한 영체 괴수.", image: `${BASE_URL}/images/A_15.png` },

  { name: "적하랑", grade: "S등급", description: "수천 년간 봉인되어 있던 아홉 개의 꼬리를 개방하여, 스치는 모든 것의 정신을 붕괴시키고 여우불로 도시 하나를 통째로 태워버리는 요마의 여왕.", image: `${BASE_URL}/images/S_1.png` },
  { name: "대지의 근원 베히모스", grade: "S등급", description: "발을 내딛는 곳마다 거대한 지진이 발생하며 산맥을 무너뜨리는 전설의 거대 야수.", image: `${BASE_URL}/images/S_2.png` },
  { name: "심연의 고대 크라켄", grade: "S등급", description: "빛이 닿지 않는 바다 밑바닥에서 거대한 촉수로 대륙의 해안선 전체를 옥죄는 심해의 재앙.", image: `${BASE_URL}/images/S_3.png` },
  { name: "황혼의 불멸신룡", grade: "S등급", description: "하늘을 뒤덮는 거대한 날개와 모든 마법을 무효화하는 숨결을 지닌 드래곤의 왕.", image: `${BASE_URL}/images/S_4.png` },
  { name: "시간을 멈추는 공허의 군주", grade: "S등급", description: "우주의 끝에서 날아와 주변 공간의 물리 법칙과 시간의 흐름을 완전히 정지시키는 절대자.", image: `${BASE_URL}/images/S_5.png` },
  { name: "혼돈의 마신왕", grade: "S등급", description: "차원의 장벽을 부수고 나타나 만물을 무로 되돌리며 세계를 종말로 인도하는 어둠의 정점.", image: `${BASE_URL}/images/S_6.png` },

  { name: "절대신 아포피스", grade: "EX등급", description: "모든 차원과 세계선을 초월하여 만물을 주관하는 궁극의 절대자.", image: `${BASE_URL}/images/EX_1.png` }
];

const gradeRewards = {
  "E등급": {
    "min": 10,
    "max": 100
  },
  "E+등급": {
    "min": 100,
    "max": 200
  },
  "D등급": {
    "min": 200,
    "max": 300
  },
  "D+등급": {
    "min": 300,
    "max": 400
  },
  "C등급": {
    "min": 400,
    "max": 1000
  },
  "C+등급": {
    "min": 1000,
    "max": 2000
  },
  "B등급": {
    "min": 2000,
    "max": 3000
  },
  "B+등급": {
    "min": 3000,
    "max": 4000
  },
  "A등급": {
    "min": 4000,
    "max": 10000,
    "gem": 1
  },
  "A+등급": {
    "min": 10000,
    "max": 20000,
    "gem": 5
  },
  "S등급": {
    "min": 20000,
    "max": 50000,
    "gem": 10
  },
  "S+등급": {
    "min": 50000,
    "max": 100000,
    "gem": 30
  },
  "EX등급": {
    "min": 100000,
    "max": 1000000,
    "gem": 50
  },
  "EX+등급": {
    "min": 500000,
    "max": 1000000,
    "gem": 100
  }
};

// 던전 전용 보상표: 사냥 보상표와 별도로 관리합니다.
const DUNGEON_GRADE_REWARDS = {
  "E등급": {
    "min": 10,
    "max": 100
  },
  "E+등급": {
    "min": 100,
    "max": 200
  },
  "D등급": {
    "min": 200,
    "max": 300
  },
  "D+등급": {
    "min": 300,
    "max": 400
  },
  "C등급": {
    "min": 400,
    "max": 1000
  },
  "C+등급": {
    "min": 1000,
    "max": 2000
  },
  "B등급": {
    "min": 2000,
    "max": 3000
  },
  "B+등급": {
    "min": 3000,
    "max": 4000
  },
  "A등급": {
    "min": 4000,
    "max": 10000,
    "gem": 1
  },
  "A+등급": {
    "min": 10000,
    "max": 20000,
    "gem": 5
  },
  "S등급": {
    "min": 20000,
    "max": 50000,
    "gem": 10
  },
  "S+등급": {
    "min": 50000,
    "max": 100000,
    "gem": 30
  },
  "EX등급": {
    "min": 100000,
    "max": 1000000,
    "gem": 50
  },
  "EX+등급": {
    "min": 500000,
    "max": 1000000,
    "gem": 100
  }
};

const FARM_BOX_INFO = {
  "E": {
    "name": "E등급 상자",
    "minCash": 100,
    "maxCash": 500,
    "minGold": 0,
    "maxGold": 0,
    "minGem": 0,
    "maxGem": 0
  },
  "D": {
    "name": "D등급 상자",
    "minCash": 500,
    "maxCash": 1000,
    "minGold": 1,
    "maxGold": 1,
    "minGem": 0,
    "maxGem": 0,
    "goldChance": 0.1
  },
  "C": {
    "name": "C등급 상자",
    "minCash": 1000,
    "maxCash": 2000,
    "minGold": 1,
    "maxGold": 1,
    "minGem": 1,
    "maxGem": 1,
    "goldChance": 0.1,
    "gemChance": 0.1
  },
  "B": {
    "name": "B등급 상자",
    "minCash": 2000,
    "maxCash": 3000,
    "minGold": 1,
    "maxGold": 1,
    "minGem": 1,
    "maxGem": 1,
    "bonusBox": "A",
    "bonusBoxChance": 0.1
  },
  "A": {
    "name": "A등급 상자",
    "minCash": 3000,
    "maxCash": 10000,
    "minGold": 1,
    "maxGold": 1,
    "minGem": 1,
    "maxGem": 1,
    "bonusBox": "S",
    "bonusBoxChance": 0.1,
    "monthlyTitleChance": 1
  },
  "S": {
    "name": "S등급 상자",
    "minCash": 10000,
    "maxCash": 50000,
    "minGold": 5,
    "maxGold": 5,
    "minGem": 5,
    "maxGem": 5,
    "bonusBox": "EX",
    "bonusBoxChance": 0.1,
    "monthlyTitleChance": 1
  },
  "EX": {
    "name": "EX등급 상자",
    "minCash": 50000,
    "maxCash": 100000,
    "minGold": 10,
    "maxGold": 10,
    "minGem": 10,
    "maxGem": 10,
    "bonusBox": "EX+",
    "bonusBoxChance": 0.1,
    "monthlyTitleChance": 1
  },
  "EX+": {
    "name": "EX+등급 상자",
    "minCash": 100000,
    "maxCash": 500000,
    "minGold": 10,
    "maxGold": 10,
    "minGem": 10,
    "maxGem": 10,
    "bonusBox": "SEASON",
    "bonusBoxChance": 1,
    "monthlyTitleChance": 1
  },
  "SEASON": {
    "name": "시즌 칭호 상자",
    "minCash": 0,
    "maxCash": 0,
    "minGold": 0,
    "maxGold": 0,
    "minGem": 0,
    "maxGem": 0,
    "seasonTitleChance": 1
  }
};

// /사냥 희귀 드롭 전용 상자. 기존 상자 보상과 이름을 그대로 유지한다.
const HUNT_BOX_INFO = {
  "E": {
    "name": "나무 상자",
    "minCash": 1000,
    "maxCash": 10000,
    "minGem": 1,
    "maxGem": 1
  },
  "D": {
    "name": "은 상자",
    "minCash": 10000,
    "maxCash": 20000,
    "minGem": 1,
    "maxGem": 3
  },
  "C": {
    "name": "금 상자",
    "minCash": 20000,
    "maxCash": 50000,
    "minGem": 1,
    "maxGem": 5
  },
  "B": {
    "name": "사파이어 상자",
    "minCash": 50000,
    "maxCash": 100000,
    "minGem": 1,
    "maxGem": 10
  },
  "A": {
    "name": "에메랄드 상자",
    "minCash": 100000,
    "maxCash": 200000,
    "minGem": 1,
    "maxGem": 15
  },
  "S": {
    "name": "제이다이트 상자",
    "minCash": 200000,
    "maxCash": 500000,
    "minGem": 5,
    "maxGem": 20
  },
  "EX": {
    "name": "루비 상자",
    "minCash": 500000,
    "maxCash": 1000000,
    "minGem": 5,
    "maxGem": 25
  },
  "EX+": {
    "name": "다이아몬드 상자",
    "minCash": 1000000,
    "maxCash": 5000000,
    "minGem": 5,
    "maxGem": 30
  }
};

const MONTHLY_AVATARS = {
  1: "신년의 개척자 아바타", 2: "서리 심장 아바타", 3: "봄의 전령 아바타",
  4: "벚꽃 잔상 아바타", 5: "초원의 수호자 아바타", 6: "태양 기사 아바타",
  7: "폭풍의 지배자 아바타", 8: "한여름 정점 아바타", 9: "결실의 수확자 아바타",
  10: "낙엽의 추적자 아바타", 11: "서릿발 척살자 아바타", 12: "종말의 인도자 아바타"
};

// 파밍에서 처치할수록 다음 등급으로 도전한다. E→E+→D→D+ 순으로 이어진다.
const FARM_GRADE_STEPS = ["E등급","E+등급","D등급","D+등급","C등급","C+등급","B등급","B+등급","A등급","A+등급","S등급","S+등급","EX등급","EX+등급"];

const EQUIPMENT_SLOTS = ['helmet','top','bottom','gloves','boots','cape'];
const EQUIPMENT_SLOT_NAMES = {
  helmet:'모자', top:'상의', bottom:'하의', gloves:'장갑', boots:'신발', cape:'망토'
};
const EQUIPMENT_SLOT_DESCS = {
  helmet:'머리와 감각을 보호하며 전투 집중력을 높여 줍니다.',
  top:'상체를 보호하면서 전투의 핵심 움직임을 안정적으로 받쳐 줍니다.',
  bottom:'하체의 균형과 이동을 보조해 긴 전투에서도 자세가 무너지지 않게 합니다.',
  gloves:'무기와 마력을 다루는 손의 감각을 끌어올리는 장비입니다.',
  boots:'발놀림과 기동성을 보조해 전투 중 안정적인 움직임을 돕습니다.',
  cape:'등 뒤에 흐르는 기운을 정돈해 세트의 힘을 완성하는 상징적인 장비입니다.'
};

// 직업 테마별 6부위 × T1~T6 전리품 세트. 실제 착용은 없으며, 보유한 서로 다른 부위 수로 세트 효과가 발동한다.
// 드롭은 현재 직업과 무관하게 warrior/archer/wizard/thief 세트 중 무작위로 결정된다.
const JOB_GEAR_SETS = {
  warrior: {
    T1:{setName:'수련병 철갑 세트',theme:'낡았지만 전장의 기본기를 익히기에 충분한 수련병용 철갑 장비입니다.',items:{helmet:'낡은 철투구',top:'수련병 철흉갑',bottom:'누빈 철각반',gloves:'거친 전투장갑',boots:'징박힌 군화',cape:'해진 붉은 망토'}},
    T2:{setName:'강철 용병 세트',theme:'실전을 거친 용병들이 애용하는 튼튼하고 실용적인 강철 장비입니다.',items:{helmet:'강철 용병투구',top:'강철 용병흉갑',bottom:'강철 전투각반',gloves:'용병대 건틀릿',boots:'강철 행군화',cape:'용병대 전투망토'}},
    T3:{setName:'백은 기사 세트',theme:'정제된 백은과 균형 잡힌 판금으로 제작된 정예 기사단의 장비입니다.',items:{helmet:'백은 기사투구',top:'백은 기사흉갑',bottom:'백은 기사각반',gloves:'백은 건틀릿',boots:'백은 기사군화',cape:'백은 서약망토'}},
    T4:{setName:'룬 수호자 세트',theme:'고대 방호 룬이 새겨져 검격과 마력을 함께 견디도록 설계된 수호 장비입니다.',items:{helmet:'룬 수호투구',top:'룬 수호흉갑',bottom:'룬 수호각반',gloves:'룬 각인 건틀릿',boots:'룬 수호군화',cape:'룬 장벽망토'}},
    T5:{setName:'천공 성기사 세트',theme:'하늘의 성광과 폭풍의 힘을 두른 최상위 성기사용 장비입니다.',items:{helmet:'천공 성기사투구',top:'천공 성광흉갑',bottom:'천공 심판각반',gloves:'천공 심판건틀릿',boots:'천공 질풍군화',cape:'천공의 성광망토'}},
    T6:{setName:'종말 신기사 세트',theme:'신역의 금속과 종말의 권능을 융합한 전사 테마 최종 장비입니다.',items:{helmet:'종말신의 투구',top:'아포칼립스 신갑',bottom:'종말신의 각반',gloves:'신벌의 건틀릿',boots:'신역 돌진군화',cape:'종말의 군림망토'}}
  },
  archer: {
    T1:{setName:'숲길 사냥꾼 세트',theme:'가볍고 조용해 초보 사냥꾼이 숲을 누비기 좋은 가죽 장비입니다.',items:{helmet:'낡은 사냥꾼 후드',top:'숲길 가죽조끼',bottom:'사냥꾼 가죽바지',gloves:'활시위 가죽장갑',boots:'숲길 장화',cape:'풀잎 위장망토'}},
    T2:{setName:'바람추적자 세트',theme:'바람의 흐름을 따라 몸을 가볍게 움직일 수 있도록 만든 기동 장비입니다.',items:{helmet:'바람추적자 후드',top:'바람결 사냥복',bottom:'질풍 가죽하의',gloves:'풍절 사격장갑',boots:'바람걸음 장화',cape:'추적자의 바람망토'}},
    T3:{setName:'은월 명사수 세트',theme:'은빛 달의 마력을 머금어 정밀한 조준과 야간 사냥에 특화된 장비입니다.',items:{helmet:'은월 명사수 두건',top:'은월 사격복',bottom:'월광 추적하의',gloves:'은깃 명사수장갑',boots:'은월 잠행화',cape:'월영 사냥망토'}},
    T4:{setName:'폭풍매 사수 세트',theme:'폭풍매의 깃과 번개 결정을 엮어 만든 고속 사격 전용 장비입니다.',items:{helmet:'폭풍매 전투후드',top:'뇌풍 사수갑',bottom:'폭풍매 기동하의',gloves:'뇌전 사격장갑',boots:'질풍매 장화',cape:'폭풍깃 날개망토'}},
    T5:{setName:'별사냥꾼 세트',theme:'별의 궤적을 읽어 먼 거리의 적까지 추적하도록 만든 전설급 사냥 장비입니다.',items:{helmet:'별사냥꾼 관측후드',top:'성운 추적갑',bottom:'별궤적 사냥하의',gloves:'성궁 조준장갑',boots:'유성 추적화',cape:'성운의 사냥망토'}},
    T6:{setName:'태양신 궁수 세트',theme:'태양신의 빛과 궤도를 품어 모든 표적을 꿰뚫는 궁수 테마 최종 장비입니다.',items:{helmet:'태양신의 월계후드',top:'아폴론 광휘갑',bottom:'태양궤도 전투하의',gloves:'신궁의 황금장갑',boots:'광속 추적화',cape:'태양신의 광휘망토'}}
  },
  wizard: {
    T1:{setName:'견습 마도사 세트',theme:'기초 주문을 안정적으로 유지하도록 만든 초급 마도사의 천 장비입니다.',items:{helmet:'견습 마도사 모자',top:'견습 주문로브',bottom:'마력수련 하의',gloves:'초급 촉매장갑',boots:'마도학원 구두',cape:'견습생 마력망토'}},
    T2:{setName:'룬 학자 세트',theme:'주문식과 룬 문자를 새겨 마력 흐름을 정교하게 다듬은 학자용 장비입니다.',items:{helmet:'룬 학자 모자',top:'룬문자 연구로브',bottom:'룬 회로하의',gloves:'룬 촉매장갑',boots:'마력회로 구두',cape:'룬 학술망토'}},
    T3:{setName:'원소 현자 세트',theme:'불·물·바람·대지의 원소 균형을 유지하도록 제작된 상급 마도 장비입니다.',items:{helmet:'원소 현자의 관',top:'사원소 현자로브',bottom:'원소순환 하의',gloves:'원소결정 장갑',boots:'원소보행 장화',cape:'사원소 조화망토'}},
    T4:{setName:'아르카나 마도사 세트',theme:'고대 비전식과 차원 마력을 제어하는 고위 마도사의 아르카나 장비입니다.',items:{helmet:'아르카나 마도관',top:'비전식 아르카나로브',bottom:'차원문양 하의',gloves:'비전 촉매장갑',boots:'차원보행 구두',cape:'아르카나 차원망토'}},
    T5:{setName:'성운 대마도사 세트',theme:'성운과 별빛의 마력을 직접 끌어와 주문을 증폭시키는 전설급 마도 장비입니다.',items:{helmet:'성운 대마도사의 관',top:'코스모스 대마도사로브',bottom:'성좌회로 하의',gloves:'성운집속 장갑',boots:'별빛 부유화',cape:'코스모스 성운망토'}},
    T6:{setName:'오메가 아르카눔 세트',theme:'모든 마법 계통과 세계의 근원식을 하나로 통합한 마법사 테마 최종 장비입니다.',items:{helmet:'오메가 지혜의 관',top:'아르카눔 근원로브',bottom:'세계식 마도하의',gloves:'신언의 마력장갑',boots:'시공초월 마도화',cape:'오메가 차원망토'}}
  },
  thief: {
    T1:{setName:'뒷골목 잠입자 세트',theme:'소리와 빛을 최소화한 초보 잠입자용 가죽 장비입니다.',items:{helmet:'낡은 잠입자 두건',top:'뒷골목 잠입복',bottom:'검은 가죽하의',gloves:'소매치기 장갑',boots:'무소음 가죽화',cape:'해진 그림자망토'}},
    T2:{setName:'밤그림자 도적 세트',theme:'어둠 속에서 실루엣을 흐리게 만들어 은밀한 접근을 돕는 장비입니다.',items:{helmet:'밤그림자 두건',top:'야행 잠입갑',bottom:'밤그림자 하의',gloves:'암행 손장갑',boots:'그림자 보행화',cape:'밤안개 망토'}},
    T3:{setName:'독안개 암살자 세트',theme:'맹독과 연막을 다루는 암살자의 기습 전투에 맞춰 설계된 장비입니다.',items:{helmet:'독안개 암살두건',top:'맹독 암살갑',bottom:'독영 기동하의',gloves:'독니 암살장갑',boots:'연무 잠행화',cape:'독안개 은신망토'}},
    T4:{setName:'월식 추적자 세트',theme:'달빛마저 삼키는 어둠의 직물을 사용해 흔적을 지우는 고급 잠행 장비입니다.',items:{helmet:'월식 추적두건',top:'월영 잠행갑',bottom:'월식 기동하의',gloves:'월식 절명장갑',boots:'무월 추적화',cape:'월식 은폐망토'}},
    T5:{setName:'공허 팬텀 세트',theme:'공허의 틈을 스치듯 이동하며 모습을 흐리는 전설급 도적 장비입니다.',items:{helmet:'공허 팬텀 후드',top:'팬텀 차원갑',bottom:'공허유영 하의',gloves:'팬텀 절단장갑',boots:'공허도약 장화',cape:'팬텀 잔상망토'}},
    T6:{setName:'무영 종결자 세트',theme:'존재의 흔적과 기척까지 지워 버리는 도적 테마 최종 장비입니다.',items:{helmet:'무영의 종결두건',top:'언씬 엔드 암살갑',bottom:'제로아워 잠행하의',gloves:'신살의 무영장갑',boots:'시간정지 잠행화',cape:'존재소거 망토'}}
  }
};

function getGearItem(gearJob, tier, slot) {
  const set = JOB_GEAR_SETS[gearJob] && JOB_GEAR_SETS[gearJob][tier];
  const name = set && set.items && set.items[slot];
  if (!set || !name || !EQUIPMENT_SLOT_NAMES[slot]) return null;
  return {
    category:'gear', gearJob, slot, categoryName:EQUIPMENT_SLOT_NAMES[slot], tier,
    setName:set.setName, name,
    desc:`${set.theme} ${EQUIPMENT_SLOT_DESCS[slot]}`
  };
}

function getOwnedGearItems(profile) {
  return (profile && Array.isArray(profile.inventory) ? profile.inventory : []).filter(x => x && x.category === 'gear');
}

function getEquipmentSetBonuses(profile) {
  // 같은 직업 테마 + 같은 티어 + 서로 다른 부위를 보유해야 2/4/6세트가 발동한다.
  // 착용 개념은 없으며 현재 플레이 직업과도 무관하다.
  const groups = {};
  for (const item of getOwnedGearItems(profile)) {
    if (!item || !JOB_GEAR_SETS[item.gearJob] || !/^T[1-6]$/.test(item.tier || '') || !EQUIPMENT_SLOTS.includes(item.slot)) continue;
    const key = `${item.gearJob}:${item.tier}`;
    if (!groups[key]) groups[key] = new Set();
    groups[key].add(item.slot);
  }
  const result = { cashPct:0, critRate:0, counterRate:0, critDmg:0, active:[], groups:{} };
  for (const [key, slots] of Object.entries(groups)) {
    const [gearJob,tier] = key.split(':');
    const n = Number(tier.replace('T','')) || 0;
    const count = slots.size;
    result.groups[key] = count;
    const setName = JOB_GEAR_SETS[gearJob][tier].setName;
    if (count >= 2) { result.cashPct += n/100; result.active.push(`[${tier}] ${setName} 2세트: 현금 +${n}%`); }
    if (count >= 4) { result.critRate += n; result.active.push(`[${tier}] ${setName} 4세트: 치명타 +${n}%p`); }
    if (count >= 6) {
      if (gearJob === 'warrior') { const v=n*0.5; result.counterRate += v; result.active.push(`[${tier}] ${setName} 6세트: 카운터 +${v}%p`); }
      else if (gearJob === 'archer') { const v=n*0.5; result.critRate += v; result.active.push(`[${tier}] ${setName} 6세트: 추가 치명타 +${v}%p`); }
      else if (gearJob === 'wizard') { const v=n*3; result.critDmg += v; result.active.push(`[${tier}] ${setName} 6세트: 치명타 피해 +${v}%`); }
      else if (gearJob === 'thief') { const v=n*2; result.cashPct += v/100; result.active.push(`[${tier}] ${setName} 6세트: 추가 현금 +${v}%`); }
    }
  }
  return result;
}

function getEquipmentSetProgressLines(profile) {
  const bonuses = getEquipmentSetBonuses(profile);
  const lines=[];
  for (const gearJob of ['warrior','archer','wizard','thief']) {
    for (let n=1;n<=6;n++) {
      const tier='T'+n;
      const count=bonuses.groups[`${gearJob}:${tier}`] || 0;
      if (count <= 0) continue;
      const setName=JOB_GEAR_SETS[gearJob][tier].setName;
      lines.push(`[${tier}] ${setName} : ${count}/6부위${count>=6?' ✅ 6세트':count>=4?' ✅ 4세트':count>=2?' ✅ 2세트':''}`);
    }
  }
  return lines;
}


const WEAPON_TIERS = [
  ['썩은 목검', '썩은 나무를 깎아 만든 낡은 목검'],
  ['썩은 나무 장궁', '금방 부러질 듯한 나무 장궁'],
  ['썩은 나무 지팡이', '마력을 겨우 붙잡는 낡은 지팡이'],
  ['썩은 나무 단검', '무딘 나무 조각을 깎아 만든 단검'],
  ['흑철 용병대장검', '흑철로 벼린 용병대장의 장검'],
  ['흑목 저격궁', '검은 목재로 만든 정밀 저격궁'],
  ['정령의 지팡이', '숲 정령의 힘이 깃든 지팡이'],
  ['독니 단검', '맹독을 머금은 송곳니 모양 단검'],
  ['백은 기사검', '백은으로 벼린 기사의 명검'],
  ['은빛 월궁', '달빛을 따라 화살을 보내는 은궁'],
  ['뇌신의 지팡이', '뇌신의 전격을 부르는 지팡이'],
  ['서리송곳니', '얼음 짐승의 송곳니를 닮은 검'],
  ['폭풍 군주검', '폭풍 군주의 권능을 품은 장검'],
  ['폭풍의 천궁', '하늘의 폭풍을 화살에 싣는 활'],
  ['폭풍현자의 봉', '거센 바람과 천둥을 다스리는 현자의 봉'],
  ['질풍 암살도', '질풍처럼 스쳐 지나가는 암살자의 검'],
  ['붉은 귀왕의 송곳니', '붉은 귀왕의 분노가 깃든 마검'],
  ['혈귀왕의 마궁', '혈귀왕의 피를 머금은 저주의 활'],
  ['혈월 귀신봉', '핏빛 달 아래 망령을 부르는 지팡이'],
  ['청염 귀살도', '푸른 귀화로 악귀를 베는 검'],
  ['신검 아포칼립스', '종말의 권능으로 세상을 가르는 신검']
];

// 직업별 +0~+20 무기 이름/설명. 설명은 세계관 문구이며 추가 능력치를 부여하지 않는다.
const JOB_WEAPON_TIERS = {
  "warrior": [
   [
      "나무젓가락 단검",
      "나무젓가락 두 짝을 묶은 장난감 칼"
    ],
    [
      "대나무 검",
      "마당에서 베어 온 대나무를 깎은 검"
    ],
    [
      "목검",
      "묵직한 나무토막으로 만든 훈련검"
    ],
    [
      "철제 단검",
      "대장간에서 막 벼려 낸 투박한 단검"
    ],
    [
      "제식 롱소드",
      "신병에게 지급되는 균형 잡힌 장검"
    ],
    [
      "실버 소드",
      "은빛 날을 곱게 연마한 기사 검"
    ],
    [
      "골드 세공검",
      "황금 문양을 입힌 왕실의 장식검"
    ],
    [
      "실바나스",
      "숲의 정령이 잎맥을 새긴 검"
    ],
    [
      "트라이던트",
      "심해의 푸른 파도를 두른 해양검"
    ],
    [
      "라이주",
      "번개 신수의 발톱을 본뜬 뇌전검"
    ],
    [
      "프로메테우스",
      "꺼지지 않는 불씨를 품은 화염검"
    ],
    [
      "프시케 블레이드",
      "태초의 생명력이 흐르는 고대검"
    ],
    [
      "베르단트 오블리비언",
      "세계수의 덩굴이 칼날을 감싼 마검"
    ],
    [
      "글레이셜 둠",
      "빙하의 심장과 오로라를 벼린 검"
    ],
    [
      "오니즈카 섀도우",
      "보랏빛 뇌전이 어둠을 가르는 요검"
    ],
    [
      "이터널 바운드",
      "고대 백사의 혼이 봉인된 장검"
    ],
    [
      "헤븐즈 저스티스",
      "천상의 빛으로 죄를 베는 성검"
    ],
    [
      "이그니스 로어",
      "흑룡의 포효가 불꽃으로 터지는 용검"
    ],
    [
      "크로노스 파라독스",
      "찰나의 시간을 접어 베는 시공검"
    ],
    [
      "아포테오시스",
      "신의 권능이 칼날에 현현한 신검"
    ],
    [
      "싱귤래리티",
      "별빛마저 삼키는 특이점의 최종검"
    ]
  ],
  "archer": [
    [
      "고무줄 활",
      "나뭇가지에 고무줄을 건 장난감 활"
    ],
    [
      "대나무 단궁",
      "얇은 대나무를 휘어 만든 첫 활"
    ],
    [
      "물푸레 연습궁",
      "물푸레나무 결을 살린 훈련용 활"
    ],
    [
      "철촉 사냥궁",
      "손으로 벼린 철촉을 쓰는 사냥 활"
    ],
    [
      "병사 장궁",
      "성벽 수비대의 표준형 장궁"
    ],
    [
      "은깃 복합궁",
      "은색 깃털을 단 화살과 짝을 이룬 활"
    ],
    [
      "왕실 금현궁",
      "금빛 활시위가 울리는 의장용 명궁"
    ],
    [
      "엘윈드",
      "숲바람이 화살의 꼬리를 밀어 주는 활"
    ],
    [
      "마리너스",
      "바닷바람을 따라 궤도를 바꾸는 해궁"
    ],
    [
      "볼트호크",
      "뇌조의 깃을 깎아 만든 번개 활"
    ],
    [
      "솔라 플레어",
      "태양의 불꽃을 화살촉에 싣는 궁"
    ],
    [
      "루나 세레나데",
      "달빛 아래 소리 없이 빛나는 은궁"
    ],
    [
      "가이아 스파이어",
      "대지의 가시를 화살로 뽑아내는 활"
    ],
    [
      "프로스트폴",
      "서릿발이 시위를 따라 피어나는 빙궁"
    ],
    [
      "템페스트 크라운",
      "폭풍의 왕관에서 벼린 천둥 활"
    ],
    [
      "오리온의 맹세",
      "별자리 사냥꾼이 남긴 전설의 장궁"
    ],
    [
      "에테르 베인",
      "허공을 꿰뚫는 에테르 화살의 궁"
    ],
    [
      "아스트라 페네트레이터",
      "성운 너머의 표적까지 관통하는 활"
    ],
    [
      "타임리스 애로우",
      "발사 전의 순간으로 되돌아오는 시공궁"
    ],
    [
      "아폴론의 궤도",
      "태양신의 궤적을 따라 날리는 신궁"
    ],
    [
      "이벤트 호라이즌",
      "빛이 닿지 않는 곳까지 겨누는 최후의 활"
    ]
  ],
  "wizard": [
    [
      "나뭇가지 지팡이",
      "주운 가지에 끈을 감은 임시 지팡이"
    ],
    [
      "대나무 마법봉",
      "끝을 매끈하게 다듬은 대나무 봉"
    ],
    [
      "참나무 수련봉",
      "작은 수정이 박힌 초급 수련봉"
    ],
    [
      "철제 촉매봉",
      "마력을 모으는 철 고리를 단 지팡이"
    ],
    [
      "학회 표준 스태프",
      "견습 마법사에게 지급하는 지팡이"
    ],
    [
      "은월 완드",
      "달빛에 반응하는 은 장식 마법봉"
    ],
    [
      "금박 주문봉",
      "금박 주문식이 감긴 고급 촉매봉"
    ],
    [
      "미스티카",
      "흐릿한 환영을 실체로 엮는 지팡이"
    ],
    [
      "네뷸라 스태프",
      "성운의 가루가 수정 안에 떠도는 봉"
    ],
    [
      "볼테라",
      "손잡이의 룬에서 전류가 흐르는 마법봉"
    ],
    [
      "파이로클라스트",
      "용암의 맥을 끌어올리는 화염봉"
    ],
    [
      "아쿠아 레퀴엠",
      "깊은 물의 기억을 불러내는 지팡이"
    ],
    [
      "실바 오라클",
      "고목의 속삭임을 주문으로 옮기는 봉"
    ],
    [
      "글라키에스",
      "빙정이 공중에 맴도는 서리 지팡이"
    ],
    [
      "아르카나 이클립스",
      "일식의 그림자로 마법진을 그리는 봉"
    ],
    [
      "헤르메스의 열쇠",
      "금지된 문장을 여는 전령의 촉매"
    ],
    [
      "코스모스 필러",
      "별의 좌표를 새긴 천체 마법 지팡이"
    ],
    [
      "아카식 오리진",
      "세계의 첫 주문을 기록한 근원봉"
    ],
    [
      "크로노 매트릭스",
      "시간의 틈에서 주문을 끌어오는 봉"
    ],
    [
      "데우스 스크립트",
      "신의 언어가 살아 움직이는 지팡이"
    ],
    [
      "오메가 아르카눔",
      "모든 마법 계통을 하나로 묶는 최종봉"
    ]
  ],
  "thief": [
    [
      "종이칼 비수",
      "종이를 접어 흉내 낸 조잡한 비수"
    ],
    [
      "대나무 꼬챙이",
      "주머니에 숨길 수 있는 가는 꼬챙이"
    ],
    [
      "목제 손칼",
      "작은 나무칼에 천을 감은 연습 무기"
    ],
    [
      "녹슨 철단검",
      "시장 뒷골목에서 건진 낡은 단검"
    ],
    [
      "길드 잠입도",
      "소매 안에 들어가는 길드 표준 비수"
    ],
    [
      "은빛 쐐기",
      "자물쇠 틈에도 들어가는 은제 날"
    ],
    [
      "황금 제비",
      "금빛 손잡이가 달린 고급 투척 비수"
    ],
    [
      "스위프트핀",
      "움직일 때 바람 소리조차 남기지 않는 칼"
    ],
    [
      "미라주 팽",
      "허상 뒤에서 솟아나는 환영 비수"
    ],
    [
      "나이트 코인",
      "달그림자처럼 납작한 암기"
    ],
    [
      "베놈 키스",
      "한 방울의 맹독을 품은 날카로운 단검"
    ],
    [
      "문리스 조커",
      "달 없는 밤에만 빛나는 속임수 칼"
    ],
    [
      "실크 팬텀",
      "비단처럼 가볍게 스치는 잠입도"
    ],
    [
      "블랙 캣츠아이",
      "어둠 속 표적의 빈틈을 보는 비수"
    ],
    [
      "애쉬 랩소디",
      "잿빛 연막 속에서 방향을 바꾸는 칼"
    ],
    [
      "녹턴 브리치",
      "침묵의 결계를 찢는 밤의 단검"
    ],
    [
      "트릭스터 그리모어",
      "한 번의 찌르기로 환영을 남기는 비수"
    ],
    [
      "패러독스 포켓",
      "공간의 주머니에서 튀어나오는 암기"
    ],
    [
      "제로 아워",
      "시간이 멎은 순간에 꽂히는 칼"
    ],
    [
      "로키의 유산",
      "장난의 신이 속임수를 새긴 신비수"
    ],
    [
      "언씬 엔드",
      "본 사람의 기억에서 사라지는 종결도"
    ]
  ],
  "berserker": [
    [
      "나무판 대검",
      "널빤지에 손잡이를 붙인 가짜 대검"
    ],
    [
      "대나무 몽둥이",
      "굵은 대나무로 만든 거친 타격 무기"
    ],
    [
      "통나무 검",
      "두 손으로 겨우 드는 무거운 목검"
    ],
    [
      "철판 절단검",
      "철판을 잘라 만든 투박한 대검"
    ],
    [
      "투사 대검",
      "투기장 전사들이 쓰는 넓은 칼날"
    ],
    [
      "은날 파쇄검",
      "은빛 날에 이빨 같은 홈을 판 대검"
    ],
    [
      "금각 전쟁검",
      "금속 뿔 장식이 달린 전장의 대검"
    ],
    [
      "크림슨 하울",
      "피비린내 나는 전장에서 울부짖는 검"
    ],
    [
      "브루탈 헤이븐",
      "철갑을 종잇장처럼 찢는 파쇄검"
    ],
    [
      "라이엇 송",
      "격노할수록 붉은 문양이 타오르는 검"
    ],
    [
      "인페르노 몰",
      "지옥불을 몰아쳐 내리꽂는 대검"
    ],
    [
      "그리즐리 로어",
      "거대한 맹수의 포효를 실은 칼"
    ],
    [
      "바실리스크 스파인",
      "석화룡의 척추를 벼린 무거운 검"
    ],
    [
      "블러드 타이드",
      "검날을 따라 붉은 파도가 밀려드는 무기"
    ],
    [
      "아비스 브레이커",
      "심연의 갑각을 깨는 검은 대검"
    ],
    [
      "펜리르의 송곳니",
      "늑대 신수의 턱힘을 품은 전설검"
    ],
    [
      "라그나로크",
      "종말의 불꽃이 휘두를 때마다 번지는 검"
    ],
    [
      "타이탄 폴",
      "거인의 발걸음처럼 땅을 울리는 대검"
    ],
    [
      "카오스 리프트",
      "공간을 찢어 광폭의 길을 여는 검"
    ],
    [
      "아레스의 심장",
      "전쟁신의 맥박으로 달아오르는 신검"
    ],
    [
      "월드엔드 크러셔",
      "세계의 경계를 부수는 마지막 대검"
    ]
  ],
  "swordmaster": [
    [
      "나무젓가락 검",
      "젓가락 한 짝으로 자세를 익히는 검"
    ],
    [
      "대나무 죽도",
      "마디를 살린 가벼운 연습용 죽도"
    ],
    [
      "단풍나무 목검",
      "손목 움직임을 익히는 균형 잡힌 목검"
    ],
    [
      "무쇠 수련검",
      "날을 세우지 않은 묵직한 철검"
    ],
    [
      "검객의 장검",
      "한 손 베기에 알맞게 벼린 실전검"
    ],
    [
      "은비늘 세검",
      "은비늘 무늬가 흐르는 가느다란 검"
    ],
    [
      "금선 명검",
      "칼등을 따라 금선이 박힌 명품 장검"
    ],
    [
      "청명",
      "새벽 공기처럼 맑은 울림의 검"
    ],
    [
      "월영",
      "달그림자를 따라 반원을 그리는 검"
    ],
    [
      "뇌광일섬",
      "한 호흡에 번개를 긋는 일격검"
    ],
    [
      "화련",
      "꽃잎 모양 불꽃이 날끝에서 피는 검"
    ],
    [
      "유수",
      "흐르는 물처럼 빈틈을 감싸는 유연한 검"
    ],
    [
      "취풍",
      "바람의 방향을 바꾸어 베는 검"
    ],
    [
      "설월화",
      "눈과 달빛 사이에 꽃무늬를 남기는 검"
    ],
    [
      "무명참",
      "이름 없는 검성이 남긴 절단의 비기"
    ],
    [
      "천검 유성",
      "유성의 꼬리를 따라 내려오는 장검"
    ],
    [
      "신월 파천",
      "초승달의 궤도로 하늘을 가르는 검"
    ],
    [
      "무극 검심",
      "검과 마음의 경계를 지운 전설검"
    ],
    [
      "찰나무영",
      "멈춘 시간 속에 칼그림자만 남기는 검"
    ],
    [
      "아마테라스의 검무",
      "태양신의 빛을 베기 동작에 싣는 신검"
    ],
    [
      "만상일도",
      "세상의 모든 검로가 한 칼에 모이는 검"
    ]
  ],
  "battlemage": [
    [
      "룬 낙서 목검",
      "목검에 분필로 룬을 그린 연습 무기"
    ],
    [
      "대나무 주문검",
      "대나무 날에 약한 주문을 새긴 검"
    ],
    [
      "참나무 룬검",
      "작은 촉매석을 박아 넣은 목제 검"
    ],
    [
      "철제 마력검",
      "마력을 전달하는 철선이 감긴 검"
    ],
    [
      "전투학파 검",
      "근접 주문에 맞춰 균형을 잡은 제식검"
    ],
    [
      "은룬 레이피어",
      "은빛 룬이 찌르기를 돕는 세검"
    ],
    [
      "금장 촉매검",
      "손잡이에 황금 촉매를 단 마검"
    ],
    [
      "스펠브레이커",
      "적의 주문식을 베어 흩트리는 검"
    ],
    [
      "아케인 플랜지",
      "푸른 마력날이 철날 위에 겹치는 검"
    ],
    [
      "볼트 임팩트",
      "찌르는 순간 번개가 터지는 마법검"
    ],
    [
      "마그마 시길",
      "붉은 인장이 칼자루에서 타오르는 검"
    ],
    [
      "타이달 문장",
      "물의 문장이 방패처럼 번지는 검"
    ],
    [
      "베르단트 엣지",
      "덩굴 룬이 칼끝의 궤도를 바꾸는 검"
    ],
    [
      "프로즌 코덱스",
      "얼음 주문서가 날에 새겨진 전투검"
    ],
    [
      "오블리비언 카운터",
      "공격 주문을 되돌려 베는 검"
    ],
    [
      "오딘의 인장",
      "전쟁과 지혜의 룬을 함께 품은 신검"
    ],
    [
      "아스트랄 콤보",
      "별빛 주문을 연속 베기로 잇는 검"
    ],
    [
      "엘리멘탈 노바",
      "네 원소를 한 번에 폭발시키는 마검"
    ],
    [
      "크로노 스펠소드",
      "베기와 주문의 시간을 어긋나게 하는 검"
    ],
    [
      "데미우르고스",
      "창조의 문장을 날마다 다시 쓰는 신검"
    ],
    [
      "인피니트 캐스트",
      "끝없는 주문의 고리를 품은 최종검"
    ]
  ],
  "sniper": [
    [
      "나무 빨래집게 석궁",
      "빨래집게로 만든 엉성한 발사기"
    ],
    [
      "대나무 장난감 석궁",
      "대나무 홈에 가는 화살을 얹은 석궁"
    ],
    [
      "목제 조준궁",
      "정지 표적을 맞히기 위한 연습 석궁"
    ],
    [
      "철제 손석궁",
      "짧은 거리에서 정확히 쏘는 철제 석궁"
    ],
    [
      "제식 중석궁",
      "보병 저격수의 표준형 중석궁"
    ],
    [
      "은촉 정밀궁",
      "은빛 화살촉에 맞춰 조율한 석궁"
    ],
    [
      "금안 관통궁",
      "황금 조준환을 단 특제 저격 석궁"
    ],
    [
      "핀포인트",
      "바늘구멍만 한 표적을 꿰뚫는 석궁"
    ],
    [
      "호라이즌 마크",
      "수평선 끝의 그림자를 겨누는 석궁"
    ],
    [
      "썬더 레일",
      "번개 궤도를 따라 볼트가 달리는 석궁"
    ],
    [
      "이그니스 버스트",
      "명중 지점에 불꽃이 폭발하는 저격궁"
    ],
    [
      "딥블루 피어서",
      "깊은 물속에서도 힘을 잃지 않는 석궁"
    ],
    [
      "베르단트 네일",
      "세계수의 목질 볼트를 쏘는 장궁"
    ],
    [
      "콜드제로",
      "숨결까지 얼리는 무음의 빙석궁"
    ],
    [
      "에클립스 사이트",
      "일식의 검은 중심을 표적에 겹치는 석궁"
    ],
    [
      "아르테미스의 눈",
      "사냥 여신의 조준 감각을 전하는 신궁"
    ],
    [
      "아스트라 페네트릭스",
      "별무리를 일직선으로 꿰는 저격궁"
    ],
    [
      "절대영점 볼트",
      "맞은 자리의 움직임을 얼리는 석궁"
    ],
    [
      "크로노 락온",
      "표적이 있었던 시간까지 추적하는 석궁"
    ],
    [
      "심판의 좌표",
      "신의 표식을 따라 한 발을 쏘는 저격궁"
    ],
    [
      "제로 디스턴스",
      "거리의 개념을 지우는 최후의 석궁"
    ]
  ],
  "ranger": [
    [
      "풀줄기 활",
      "풀줄기를 묶어 겨우 당기는 작은 활"
    ],
    [
      "대나무 숲활",
      "숲 가장자리 대나무로 만든 단궁"
    ],
    [
      "버드나무 단궁",
      "유연한 버드나무 가지를 휘어 만든 활"
    ],
    [
      "철촉 야영궁",
      "야영지에서 철촉을 손질하며 쓰는 활"
    ],
    [
      "개척자 장궁",
      "먼 길의 습기와 비를 견디는 활"
    ],
    [
      "은잎 사냥궁",
      "은빛 잎 문양이 새겨진 사냥 활"
    ],
    [
      "금뿔 길잡이궁",
      "금색 뿔 장식이 달린 명궁"
    ],
    [
      "그린패스",
      "덩굴 사이의 빈길로 화살을 보내는 활"
    ],
    [
      "모스위스퍼",
      "이끼 낀 나무 아래에서도 울림 없는 궁"
    ],
    [
      "스톰트레일",
      "비바람을 가르며 화살길을 여는 활"
    ],
    [
      "플레임폭스",
      "여우불이 화살을 따라 뛰는 숲활"
    ],
    [
      "리버메이든",
      "강물의 흐름을 읽어 궤도를 잡는 활"
    ],
    [
      "가이아의 맥",
      "땅속 뿌리의 힘을 끌어오는 장궁"
    ],
    [
      "윈터파인",
      "눈 덮인 솔숲의 냉기를 품은 활"
    ],
    [
      "와일드 헌트",
      "정령 사냥대가 남긴 추적의 활"
    ],
    [
      "세르누노스의 가지",
      "숲의 신이 뿔로 빚은 전설궁"
    ],
    [
      "베르단트 가디언",
      "세계수의 마지막 잎을 지키는 활"
    ],
    [
      "아스트랄 트래커",
      "별의 흔적을 따라 목표를 찾는 궁"
    ],
    [
      "에온 포리스트",
      "시간 밖 숲의 바람을 끌어오는 활"
    ],
    [
      "가이아의 심판",
      "대지 여신의 뜻을 화살에 싣는 신궁"
    ],
    [
      "월드루트",
      "세계를 잇는 뿌리에서 탄생한 최종궁"
    ]
  ],
  "hawkeye": [
    [
      "고무줄 매깃활",
      "매 깃털을 꽂아 꾸민 고무줄 활"
    ],
    [
      "대나무 매활",
      "새 깃 하나를 시위에 묶은 단궁"
    ],
    [
      "목제 추적궁",
      "날아가는 표적을 겨누는 훈련 활"
    ],
    [
      "철촉 비행궁",
      "빠른 화살을 위해 철촉을 가볍게 깎은 활"
    ],
    [
      "제식 감시궁",
      "높은 망루에서 쓰는 표준 장궁"
    ],
    [
      "은익 정찰궁",
      "은빛 날개 문양을 넣은 가벼운 활"
    ],
    [
      "금안 천리궁",
      "황금 조준판으로 먼 움직임을 보는 활"
    ],
    [
      "팔콘 다이브",
      "매가 급강하하듯 화살을 꽂는 활"
    ],
    [
      "스카이리퍼",
      "높은 구름을 갈라 궤도를 읽는 장궁"
    ],
    [
      "라이덴 윙",
      "뇌조의 날갯짓을 번개로 옮기는 활"
    ],
    [
      "솔라 아이리스",
      "태양빛 속에서도 표적을 잃지 않는 궁"
    ],
    [
      "루나 펠컨",
      "달밤의 비행을 따라 조준하는 은궁"
    ],
    [
      "제피르 탤런",
      "바람의 발톱으로 화살을 밀어 주는 활"
    ],
    [
      "폴라리스 깃",
      "북극성 아래 늘 같은 방향을 잡는 활"
    ],
    [
      "나이트폴 호크",
      "밤하늘에서 소리 없이 내려찍는 궁"
    ],
    [
      "호루스의 시선",
      "하늘 신의 눈이 표적을 비추는 신궁"
    ],
    [
      "천익 오라클",
      "하늘의 전조를 읽어 발사하는 전설궁"
    ],
    [
      "아스트라 옵저버",
      "성운의 움직임까지 포착하는 활"
    ],
    [
      "크로노 펠컨",
      "미래의 비행 경로를 먼저 겨누는 시공궁"
    ],
    [
      "라의 천안",
      "태양신의 눈으로 모든 그림자를 보는 활"
    ],
    [
      "올시잉 피나클",
      "세계의 끝까지 시야를 넓히는 최종궁"
    ]
  ],
  "archmage": [
    [
      "분필 비전봉",
      "분필 자국만 남는 조잡한 마법봉"
    ],
    [
      "대나무 수정봉",
      "대나무 끝에 유리구슬을 단 지팡이"
    ],
    [
      "자작나무 완드",
      "기초 주문에 반응하는 나무 마법봉"
    ],
    [
      "철테 주문봉",
      "촉매석을 철테로 고정한 완드"
    ],
    [
      "학술원 비전봉",
      "상급 수업에 쓰이는 표준 지팡이"
    ],
    [
      "은성의 완드",
      "은빛 별무늬가 주문을 정돈하는 봉"
    ],
    [
      "금환의 스태프",
      "금빛 고리가 마력의 흐름을 모으는 봉"
    ],
    [
      "아르카디아",
      "고대 주문이 수정 안에서 맴도는 지팡이"
    ],
    [
      "세레스티얼 렌즈",
      "하늘의 문장을 크게 비추는 촉매봉"
    ],
    [
      "볼트 아포크리파",
      "잊힌 번개 주문을 부활시키는 봉"
    ],
    [
      "솔 이그니션",
      "태양의 핵에서 불씨를 끌어오는 봉"
    ],
    [
      "네레이드 서",
      "바다의 오래된 언어를 펼치는 지팡이"
    ],
    [
      "드리아드 코어",
      "숲 정령의 심장을 품은 마력봉"
    ],
    [
      "빙륜 현자봉",
      "얼음 고리가 마법진을 완성하는 봉"
    ],
    [
      "에클립스 아카이브",
      "일식 뒤에 숨은 금서를 읽는 봉"
    ],
    [
      "헤카테의 삼중봉",
      "세 갈래 마법의 길을 여는 신봉"
    ],
    [
      "제네시스 세피라",
      "창세의 열 가지 문장을 새긴 봉"
    ],
    [
      "아카식 크라운",
      "세계의 기억을 주문으로 꺼내는 지팡이"
    ],
    [
      "타임 디스크",
      "과거와 미래의 술식을 겹치는 시공봉"
    ],
    [
      "오딘의 지혜",
      "신의 눈에 비친 진리를 불러내는 봉"
    ],
    [
      "퍼스트 워드",
      "태초의 첫 문장을 발음하는 최종봉"
    ]
  ],
  "elementalist": [
    [
      "흙묻은 나무봉",
      "정원에서 꺾은 가지에 흙이 묻은 봉"
    ],
    [
      "대나무 물봉",
      "물방울 무늬를 그린 대나무 지팡이"
    ],
    [
      "숯촉 연습봉",
      "끝에 숯을 붙여 불을 흉내 낸 봉"
    ],
    [
      "철고리 원소봉",
      "네 가지 작은 원소석을 건 철봉"
    ],
    [
      "제식 원소 스태프",
      "견습 원소술사의 표준 지팡이"
    ],
    [
      "은빛 사원소봉",
      "은 고리가 원소의 흐름을 나누는 봉"
    ],
    [
      "금화 촉매봉",
      "황금 장식마다 다른 원소가 깃든 봉"
    ],
    [
      "테라시드",
      "흙과 돌의 씨앗을 깨우는 지팡이"
    ],
    [
      "네레이스",
      "물결을 손끝으로 끌어올리는 마법봉"
    ],
    [
      "볼테라 프라임",
      "번개 원소를 날카롭게 응축하는 봉"
    ],
    [
      "파이어블룸",
      "꽃송이처럼 불꽃이 퍼지는 지팡이"
    ],
    [
      "제피르 송",
      "고요한 공기 속 바람을 일으키는 봉"
    ],
    [
      "베르단트 미스트",
      "숲안개와 생명의 기운을 섞는 봉"
    ],
    [
      "글라스피어",
      "차가운 빙정을 둥글게 띄우는 봉"
    ],
    [
      "스톰클라우드",
      "먹구름을 손바닥 위에 모으는 봉"
    ],
    [
      "포세이돈의 물결",
      "해신의 조류를 명령하는 전설봉"
    ],
    [
      "가이아 플레임",
      "대지의 심장과 용암을 잇는 지팡이"
    ],
    [
      "원소왕의 홀",
      "네 원소왕의 문장을 하나로 세운 봉"
    ],
    [
      "크로노 웨더",
      "계절의 시간을 거꾸로 움직이는 봉"
    ],
    [
      "프라이멀 데우스",
      "창조신의 원초적 원소를 다루는 신봉"
    ],
    [
      "제로 엘리먼트",
      "모든 원소가 태어난 공백의 최종봉"
    ]
  ],
  "necromancer": [
    [
      "닭뼈 지팡이",
      "주운 닭뼈를 끈으로 묶은 장난감 봉"
    ],
    [
      "대나무 해골봉",
      "대나무 끝에 나무 해골을 달았다"
    ],
    [
      "마른가지 부적봉",
      "말라 비틀어진 가지에 부적을 감은 봉"
    ],
    [
      "철제 묘지봉",
      "묘지 철책을 녹여 만든 거친 지팡이"
    ],
    [
      "의식용 뼈봉",
      "초급 사령 의식에 쓰는 표준 촉매"
    ],
    [
      "은회 유골봉",
      "은빛 재를 유리관에 담은 의식봉"
    ],
    [
      "금관 장송봉",
      "금빛 관 장식으로 혼을 달래는 봉"
    ],
    [
      "모르티스",
      "죽은 자의 낮은 속삭임을 모으는 지팡이"
    ],
    [
      "그레이브송",
      "무덤가의 진혼곡을 울리는 뼈봉"
    ],
    [
      "혼뢰",
      "떠도는 영혼을 뇌광으로 묶는 지팡이"
    ],
    [
      "애쉬 페닉스",
      "잿더미에서 되살아나는 불사조의 봉"
    ],
    [
      "스틱스의 물잔",
      "저승강의 물을 한 방울 담은 촉매"
    ],
    [
      "베일 오브 본즈",
      "뼈의 장막으로 주인을 감싸는 봉"
    ],
    [
      "프로스트 코핀",
      "차가운 영면의 관을 소환하는 지팡이"
    ],
    [
      "오블리비온 렐릭",
      "잊힌 이름을 봉인한 금단의 유물"
    ],
    [
      "하데스의 지팡이",
      "명계의 문을 두드리는 신의 촉매"
    ],
    [
      "네크로폴리스",
      "망자 도시의 종소리를 부르는 지팡이"
    ],
    [
      "소울 이클립스",
      "혼의 빛을 가리는 검은 사령봉"
    ],
    [
      "크로노 리치",
      "죽음의 순간을 되풀이하는 시공봉"
    ],
    [
      "타나토스의 권좌",
      "죽음의 신이 내려다보는 신봉"
    ],
    [
      "라스트 레퀴엠",
      "모든 혼에게 마지막 노래를 들려주는 봉"
    ]
  ],
  "shadow": [
    [
      "검은 종이칼",
      "검은 종이를 접어 만든 그림자 칼"
    ],
    [
      "대나무 암도",
      "먹물 칠한 대나무를 날처럼 깎았다"
    ],
    [
      "흑단 목단검",
      "어두운 목재로 만든 잠행 연습도"
    ],
    [
      "철제 음영검",
      "빛을 덜 반사하도록 그을린 철검"
    ],
    [
      "그림자 길드검",
      "망토 안에 감추는 표준형 암검"
    ],
    [
      "은흑 섀도블레이드",
      "은날 위에 검은 홈을 새긴 칼"
    ],
    [
      "금빛 야행도",
      "금빛 손잡이를 검은 천으로 감싼 검"
    ],
    [
      "엄브라",
      "등불 아래에도 모습을 숨기는 검"
    ],
    [
      "나이트 베일",
      "밤의 장막을 칼끝에서 펼치는 암도"
    ],
    [
      "라이덴 섀도",
      "검은 뇌전이 어둠 안에서 튀는 검"
    ],
    [
      "애쉬 섀도우",
      "잿빛 불티만 남기고 사라지는 칼"
    ],
    [
      "딥 에코",
      "심해처럼 짙은 침묵을 두른 검"
    ],
    [
      "베르단트 나이트",
      "숲그늘의 짙은 초록을 품은 암검"
    ],
    [
      "글라시스 셰이드",
      "서리 낀 그림자가 칼날을 따라간다"
    ],
    [
      "오니카게",
      "귀신의 그림자가 뒤늦게 베는 요검"
    ],
    [
      "닉스의 장막",
      "밤의 여신이 어둠으로 감싼 신검"
    ],
    [
      "페넘브라",
      "일식 가장자리의 희미한 빛을 베는 칼"
    ],
    [
      "녹턴 레퀴엠",
      "그림자마다 다른 장송곡을 남기는 검"
    ],
    [
      "크로노 엄브라",
      "시간의 그림자 속으로 몸을 숨기는 검"
    ],
    [
      "에레보스의 손",
      "원초적 어둠이 칼자루를 쥐는 신검"
    ],
    [
      "블랙 제니스",
      "빛 없는 하늘의 꼭대기에서 떨어지는 검"
    ]
  ],
  "assassin": [
    [
      "연필깎이 비수",
      "연필깎이 날을 손잡이에 묶은 비수"
    ],
    [
      "대나무 숨김침",
      "옷깃에 꽂아 두는 가는 대나무 침"
    ],
    [
      "나무 손톱칼",
      "훈련용으로 깎은 작은 목제 비수"
    ],
    [
      "철제 잠행침",
      "정확한 급소를 노리는 철제 침"
    ],
    [
      "암살단 제식비수",
      "소매 아래 숨길 수 있는 짧은 칼"
    ],
    [
      "은독 쐐기",
      "은빛 홈에 맹독을 담는 비수"
    ],
    [
      "금월 자객도",
      "반달 모양 금손잡이를 단 명품 칼"
    ],
    [
      "사일런트 팽",
      "심장에 닿을 때까지 소리가 없는 단검"
    ],
    [
      "미라주 니들",
      "허상 사이에서 진짜 날을 보내는 침"
    ],
    [
      "볼트 스팅",
      "한 점에 전격을 꽂는 암살침"
    ],
    [
      "스칼렛 키스",
      "붉은 흔적 하나만 남기는 암살도"
    ],
    [
      "문스네이크",
      "달빛 아래 뱀처럼 휘어지는 비수"
    ],
    [
      "베놈 오키드",
      "독 난초의 향을 칼끝에 머금은 검"
    ],
    [
      "프로스트 베인",
      "체온을 앗아 가는 차가운 단검"
    ],
    [
      "블랙 로터스",
      "검은 연꽃이 피는 곳에 날이 도착한다"
    ],
    [
      "아난시의 실",
      "거미 신의 실로 목표를 묶는 비수"
    ],
    [
      "오블리비언 팽",
      "상처와 함께 마지막 기억을 지우는 칼"
    ],
    [
      "녹턴 이그제큐터",
      "밤의 선고를 단 한 번에 집행하는 검"
    ],
    [
      "크로노 스틸레토",
      "표적의 마지막 순간을 앞당기는 침"
    ],
    [
      "네메시스의 판결",
      "복수의 여신이 이름을 새긴 신비수"
    ],
    [
      "데스 오브 사일런스",
      "소리보다 먼저 끝을 전하는 최종도"
    ]
  ],
  "dualblade": [
    [
      "나무젓가락 쌍검",
      "젓가락 두 짝을 따로 쥔 연습 무기"
    ],
    [
      "대나무 한쌍",
      "같은 마디에서 잘라 낸 두 대나무 검"
    ],
    [
      "목제 교차검",
      "교차 베기를 익히는 가벼운 목검 한쌍"
    ],
    [
      "철제 쌍단도",
      "대장간에서 함께 벼린 짧은 철검"
    ],
    [
      "제식 이도",
      "양손에 알맞게 무게를 맞춘 표준 쌍검"
    ],
    [
      "은익 쌍검",
      "두 검의 칼등에 은빛 날개를 새겼다"
    ],
    [
      "금화 쌍도",
      "황금 문양이 서로 이어지는 명품 쌍검"
    ],
    [
      "제미니 팽",
      "쌍둥이 송곳니처럼 맞물리는 검"
    ],
    [
      "월광과 흑야",
      "달빛과 밤그늘을 나눠 품은 두 칼"
    ],
    [
      "뇌화쌍연",
      "한 검엔 번개, 다른 검엔 불꽃이 흐른다"
    ],
    [
      "솔라 루나",
      "낮과 밤의 궤도가 교차하는 쌍검"
    ],
    [
      "타이드 브레이커",
      "한쪽은 파도, 한쪽은 암초를 벤다"
    ],
    [
      "베르단트 트윈",
      "두 세계수 가지에서 벼린 녹색 쌍검"
    ],
    [
      "프로스트 미러",
      "서로의 궤적을 얼음에 비추는 두 검"
    ],
    [
      "오니쌍월",
      "귀신의 두 초승달이 등을 스쳐 간다"
    ],
    [
      "카스토르와 폴룩스",
      "쌍둥이 별의 맹세가 깃든 전설검"
    ],
    [
      "헤븐 앤 헬",
      "천상의 빛과 지옥불이 손에서 교차한다"
    ],
    [
      "아스트라 제미니",
      "두 별의 궤도를 베기로 잇는 쌍검"
    ],
    [
      "크로노 크로스",
      "서로 다른 시간에 닿는 한쌍의 칼"
    ],
    [
      "이자나기의 양검",
      "창조신의 두 손에서 나온 신검"
    ],
    [
      "인피니트 제로",
      "무한과 공백이 맞부딪치는 최종 쌍검"
    ]
  ]
};
const JOB_WEAPON_IMAGE_PREFIX = {
  "warrior": "WARRIOR",
  "archer": "ARCHER",
  "wizard": "WIZARD",
  "thief": "THIEF",
  "berserker": "berserker",
  "swordmaster": "swordmaster",
  "battlemage": "battlemage",
  "sniper": "sniper",
  "ranger": "ranger",
  "hawkeye": "hwakeye",
  "archmage": "archmage",
  "elementalist": "elementalist",
  "necromancer": "necromancer",
  "shadow": "shadow",
  "assassin": "assassin",
  "dualblade": "dualblade"
};

const ENHANCE_TABLE = [
  { cost: 1000, success: 1.00, keep: 0.00, destroy: 0.00 },
  { cost: 2000, success: 0.95, keep: 0.05, destroy: 0.00 },
  { cost: 3500, success: 0.90, keep: 0.10, destroy: 0.00 },
  { cost: 5500, success: 0.85, keep: 0.14, destroy: 0.01 },
  { cost: 8000, success: 0.80, keep: 0.17, destroy: 0.03 },
  { cost: 11000, success: 0.70, keep: 0.25, destroy: 0.05 },
  { cost: 14500, success: 0.60, keep: 0.30, destroy: 0.10 },
  { cost: 18500, success: 0.50, keep: 0.40, destroy: 0.10 },
  { cost: 23000, success: 0.40, keep: 0.50, destroy: 0.10 },
  { cost: 28000, success: 0.35, keep: 0.55, destroy: 0.10 },
  { cost: 40000, success: 0.30, keep: 0.60, destroy: 0.10 },
  { cost: 50000, success: 0.25, keep: 0.65, destroy: 0.10 },
  { cost: 70000, success: 0.22, keep: 0.68, destroy: 0.10 },
  { cost: 100000, success: 0.20, keep: 0.70, destroy: 0.10 },
  { cost: 140000, success: 0.18, keep: 0.72, destroy: 0.10 },
  { cost: 190000, success: 0.15, keep: 0.75, destroy: 0.10 },
  { cost: 250000, success: 0.13, keep: 0.77, destroy: 0.10 },
  { cost: 320000, success: 0.09, keep: 0.81, destroy: 0.10 },
  { cost: 400000, success: 0.07, keep: 0.83, destroy: 0.10 },
  { cost: 500000, success: 0.05, keep: 0.85, destroy: 0.10 },
];

const JOB_ENHANCE_TABLE = [
  { cost: 50000, success: 1.00, keep: 0.00, drop: 0.00, destroy: 0.00 },
  { cost: 100000, success: 0.90, keep: 0.10, drop: 0.00, destroy: 0.00 },
  { cost: 150000, success: 0.80, keep: 0.20, drop: 0.00, destroy: 0.00 },
  { cost: 200000, success: 0.70, keep: 0.29, drop: 0.01, destroy: 0.00 },
  { cost: 250000, success: 0.60, keep: 0.38, drop: 0.02, destroy: 0.00 },
  { cost: 350000, success: 0.50, keep: 0.47, drop: 0.03, destroy: 0.00 },
  { cost: 450000, success: 0.45, keep: 0.51, drop: 0.04, destroy: 0.00 },
  { cost: 550000, success: 0.40, keep: 0.55, drop: 0.05, destroy: 0.00 },
  { cost: 650000, success: 0.35, keep: 0.60, drop: 0.05, destroy: 0.00 },
  { cost: 1000000, success: 0.30, keep: 0.60, drop: 0.10, destroy: 0.00, gemCost: 10 },
  { cost: 1250000, success: 0.27, keep: 0.67, drop: 0.05, destroy: 0.01, gemCost: 15 },
  { cost: 1500000, success: 0.24, keep: 0.69, drop: 0.05, destroy: 0.02, gemCost: 20 },
  { cost: 1750000, success: 0.21, keep: 0.71, drop: 0.05, destroy: 0.03, gemCost: 25 },
  { cost: 2000000, success: 0.18, keep: 0.73, drop: 0.05, destroy: 0.04, gemCost: 30 },
  { cost: 2250000, success: 0.15, keep: 0.75, drop: 0.05, destroy: 0.05, gemCost: 35 },
  { cost: 2500000, success: 0.12, keep: 0.77, drop: 0.05, destroy: 0.06, gemCost: 40 },
  { cost: 2750000, success: 0.10, keep: 0.77, drop: 0.05, destroy: 0.08, gemCost: 45 },
  { cost: 3000000, success: 0.08, keep: 0.77, drop: 0.05, destroy: 0.10, gemCost: 50 },
  { cost: 3500000, success: 0.06, keep: 0.77, drop: 0.05, destroy: 0.12, gemCost: 55 },
  { cost: 4000000, success: 0.05, keep: 0.75, drop: 0.05, destroy: 0.15, gemCost: 60 },
];


// 2차 전직 전용 강화표
// - 1차 전직 대비 현금 비용 5배
// - 성공률은 단계별 3%p 하향(최저 2%)
// - 낮아진 성공률만큼 유지 확률에 가산하여 하락/파괴 확률은 기존과 동일하게 유지
// - +0 → +1부터 보석 5개, 이후 단계마다 5개씩 증가
const SECOND_JOB_ENHANCE_TABLE = JOB_ENHANCE_TABLE.map((row, index) => {
  const success = Math.max(0.02, Number((row.success - 0.03).toFixed(2)));
  const shifted = row.success - success;
  return {
    ...row,
    cost: row.cost * 5,
    success,
    keep: Number((row.keep + shifted).toFixed(2)),
    gemCost: (index + 1) * 5
  };
});

function getActiveEnhanceTable(profile) {
  if (!profile || !profile.job) return ENHANCE_TABLE;
  return getJobTier(profile) === 2 ? SECOND_JOB_ENHANCE_TABLE : JOB_ENHANCE_TABLE;
}

const REFINE_STARS = [
  ' ',        // 0성
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
  { level: 0, costNext: 1000, minGold: 1, maxGold: 1, multBonus: 0.00, critWeight: 0.00, successBonus: 0.0 },
  { level: 1, costNext: 1000, minGold: 1, maxGold: 2, multBonus: 0.20, critWeight: 0.05, successBonus: 0.5 },
  { level: 2, costNext: 2000, minGold: 1, maxGold: 3, multBonus: 0.40, critWeight: 0.10, successBonus: 1.0 },
  { level: 3, costNext: 3000, minGold: 1, maxGold: 4, multBonus: 0.60, critWeight: 0.15, successBonus: 1.5 },
  { level: 4, costNext: 4000, minGold: 1, maxGold: 5, multBonus: 0.80, critWeight: 0.20, successBonus: 2.0 },
  { level: 5, costNext: 5000, minGold: 2, maxGold: 6, multBonus: 1.00, critWeight: 0.30, successBonus: 2.5 },
  { level: 6, costNext: 6000, minGold: 2, maxGold: 7, multBonus: 1.20, critWeight: 0.40, successBonus: 3.0 },
  { level: 7, costNext: 7000, minGold: 2, maxGold: 8, multBonus: 1.40, critWeight: 0.50, successBonus: 3.5 },
  { level: 8, costNext: 8000, minGold: 2, maxGold: 9, multBonus: 1.60, critWeight: 0.65, successBonus: 4.0 },
  { level: 9, costNext: 9000, minGold: 2, maxGold: 10, multBonus: 1.80, critWeight: 0.80, successBonus: 4.5 },
  { level: 10, costNext: 0, minGold: 3, maxGold: 11, multBonus: 2.00, critWeight: 1.00, successBonus: 5.0 }
];



// 수정사항 1: 전투 종료/메인 진입 후 선택 버튼에 /보급 제거, /파밍과 /사냥 추가
const END_BATTLE_CHOICES = [
  { label: '/파밍', action: '/파밍' },
  { label: '/사냥', action: '/사냥' }
];

const BATTLE_CHOICES = [
  { label: '/파밍', action: '/파밍' },
  { label: '/사냥', action: '/사냥' }
];


// 수정사항 2: /강화 후 단일 /강화 버튼만 제공
const ENHANCE_CHOICES = [
  { label: '/강화', action: '/강화' }
];

// 파밍/사냥 응답에는 반복 명령 선택 버튼을 표시하지 않는다.
const FARM_CHOICES = [];
const HUNT_CHOICES = [];

// 수정사항 6: /제련 메뉴 전용 선택 버튼 (/보급 제거)
const REFINE_CHOICES = [
  { label: '/제련 강화', action: '/제련 강화' }
];

// 수정사항 6: /증폭 메뉴 전용 선택 버튼 (/보급 제거)
const AMPLIFY_CHOICES = [
  { label: '/증폭 강화', action: '/증폭 강화' }
];

// 수정사항 6: /대결 메뉴 전용 선택 버튼 (/보급 제거)
const PVP_CHOICES = [
  { label: '/대결', action: '/대결' }
];

const CREATURE_CHOICES = [
  { label: '/크리처 뽑기', action: '/크리처 뽑기' }
];

const IMPRINT_CHOICES = [
  { label: '/각인 변경', action: '/각인 변경' }
];

const IMPRINT_OPTION_POOL = [
  { name: '치명타 데미지 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'critDmg' },
  { name: '현금 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'cashBoost' },
  { name: '치명타 확률 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'critRate' },
  { name: '치명타 확률 가중치 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'critWeight' },
  { name: '강화 성공 확률 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceSuccess' },
  { name: '강화 비용 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceCostDown' },
  { name: '추가 금괴 획득 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'goldChance' },
  { name: '경험치 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'expBoost' },
  { name: '추가 비밀열쇠 획득 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'keyChance' },
  { name: '피해량 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '', key: 'damageReduce' },
  { name: '공격력 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'combatBoost' }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeightedValue(values, weights) {
  if (!values || !weights || values.length === 0) return null;
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < Math.min(values.length, weights.length); i++) {
    if (r < weights[i]) return values[i];
    r -= weights[i];
  }
  return values[values.length - 1];
}

function won(amount) {
  return `${Math.floor(amount).toLocaleString()}원`;
}

// 서버의 로컬 시간대와 무관하게 한국 시간 기준으로 날짜를 계산한다.
function getKSTParts() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { year: values.year, month: Number(values.month), day: Number(values.day), weekday: weekdays[values.weekday] };
}

function getKSTDateString() {
  const kst = getKSTParts();
  return `${kst.year}-${String(kst.month).padStart(2, '0')}-${String(kst.day).padStart(2, '0')}`;
}

function getKSTMonthString() {
  const kst = getKSTParts();
  return `${kst.year}-${String(kst.month).padStart(2, '0')}`;
}

function generateRandomNickname() {
  const adjectives = ['조용한','용감한','빛나는','차가운','어두운','신비로운','재빠른','초보자','불굴의','고독한','새벽의','황혼의','잊혀진','깨어난','은빛','붉은','푸른','검은','백야의','달빛의','별빛의','심연의','폭풍의','서리의','화염의','천둥의','안개의','숲속의','사막의','방랑하는','맹세한','봉인된','눈부신','침묵의','전설의','그림자','무명의','굳건한','은밀한','날쌘'];
  const nouns = ['모험가','사냥꾼','지배자','방랑자','지킴이','전사','마법사','궁수','도적','수호자','검객','정찰자','추적자','기사','용병','방패병','저격수','정령사','현자','암살자','쌍검사','마검사','개척자','탐험가','순찰자','파수꾼','주술사','퇴마사','집행자','정복자'];
  
  const adj = adjectives[rand(0, adjectives.length - 1)];
  const noun = nouns[rand(0, nouns.length - 1)];
  const num = String(rand(1000, 9999));

  return `${adj}${noun}${num}`;
}

function normalizeWeaponLevel(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(20, Math.floor(n))) : 0;
}
function getEnhanceImage(statusType, enhanceLevel, job = null) {
  if (statusType === 'destroy' && enhanceLevel > 0) return BASE_URL + '/fail.png';
  const level = normalizeWeaponLevel(enhanceLevel);
  const prefix = Object.hasOwn(JOB_WEAPON_IMAGE_PREFIX, job) ? JOB_WEAPON_IMAGE_PREFIX[job] : 'enhance';
  return BASE_URL + '/' + prefix + '_' + level + '.png';
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
  if (!profile || !profile.imprints || typeof profile.imprints !== 'object') return 0;
  let total = 0;
  for (const imprintData of Object.values(profile.imprints)) {
    if (!imprintData || !Array.isArray(imprintData.options)) continue;
    for (const opt of imprintData.options) {
      if (!opt || opt.key !== keyName) continue;
      const value = Number(opt.value);
      if (Number.isFinite(value) && value >= 0) total += value;
    }
  }
  return Number(total.toFixed(4));
}

// 기존 저장 데이터에서 유효한 옵션은 보존하고 손상된 항목만 제거한다.
function normalizeImprints(imprints) {
  const result = {};
  if (!imprints || typeof imprints !== 'object' || Array.isArray(imprints)) return result;
  for (const [tier, data] of Object.entries(imprints)) {
    if (!data || !Array.isArray(data.options)) continue;
    const options = data.options.filter(opt => opt && typeof opt.key === 'string'
      && opt.value !== null && opt.value !== '' && Number.isFinite(Number(opt.value)) && Number(opt.value) >= 0)
      .map(opt => ({ ...opt, value: Number(opt.value) }));
    if (options.length) result[tier] = { ...data, options };
  }
  return result;
}

function getCreatureBonus(profile) {
  if (!profile || !profile.creature) {
    return { cashPct: 0, bonusGold: 0, bonusGem: 0, gradeName: "없음" };
  }
  const info = CREATURE_GRADES[profile.creature];
  if (!info) return { cashPct: 0, bonusGold: 0, bonusGem: 0, gradeName: "없음" };
  return {
    cashPct: info.cashPct,
    bonusGold: info.bonusGold,
    bonusGem: info.bonusGem,
    gradeName: info.name
  };
}

function getAvatarCashBonus(profile) {
  return profile && profile.equippedAvatar ? 0.10 : 0;
}

function getTitleGoldBonus(profile) {
  return profile && profile.equippedTitle ? 0.10 : 0;
}

function getCollectionCombatPower(profile) {
  if (!profile) return 0;
  const titleCount = Array.isArray(profile.ownedTitles) ? profile.ownedTitles.length : 0;
  const avatarCount = Array.isArray(profile.ownedAvatars) ? profile.ownedAvatars.length : 0;
  return (titleCount + avatarCount) * 1000;
}

function applyCreatureCashBonus(amount, profile) {
  const cBonus = getCreatureBonus(profile);
  const baseReward = Math.floor(amount * (1 + cBonus.cashPct + getAvatarCashBonus(profile) + getEquipmentSetBonuses(profile).cashPct));
  return applyAchievementCashBonus(baseReward, profile);
}

function applyCreatureGoldBonus(goldAmount, profile) {
  if (goldAmount <= 0) return 0;
  const cBonus = getCreatureBonus(profile);
  return Math.floor((goldAmount + cBonus.bonusGold) * (1 + getTitleGoldBonus(profile)));
}

function applyCreatureGemBonus(gemAmount, profile) {
  if (gemAmount <= 0) return 0;
  const cBonus = getCreatureBonus(profile);
  return gemAmount + cBonus.bonusGem;
}

function getLootMultiplier(profile) {
  // 장비는 개별 부위 배율 없이 같은 세트 2/4/6부위 보유 효과만 적용한다.
  return 1;
}

function getJobTier(profile) {
  const job = profile && profile.job;
  return Object.hasOwn(JOB_CATALOG, job) ? JOB_CATALOG[job][1] : (job ? 1 : 0);
}
function getWeaponBaseMultiplier(profile) {
  const tier = getJobTier(profile);
  const perLevel = tier === 2 ? 0.08 : 0.05;
  return Number(((1 + tier) + normalizeWeaponLevel(getCurrentEnhanceLevel(profile)) * perLevel).toFixed(2));
}
function getGoldMultiplier(profile) {
  const currentEnhance = getCurrentEnhanceLevel(profile);
  const baseMult = getWeaponBaseMultiplier(profile);
  const ampInfo = getAmplifyInfo(profile ? profile.combatLevel : 0);
  const refineBonus = ((profile && profile.refine) || 0) * 0.10; 
  const imprintCashBoost = getImprintTotalBonus(profile, 'cashBoost') / 100;
  const creatureCashPct = getCreatureBonus(profile).cashPct;
  return Number((baseMult + ampInfo.multBonus + refineBonus + imprintCashBoost + creatureCashPct).toFixed(2));
}

function getExpMultiplier(profile) {
  const currentEnhance = getCurrentEnhanceLevel(profile);
  const base = getWeaponBaseMultiplier(profile);
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
  const lvl = normalizeWeaponLevel(enhanceLevel);
  const tiers = Object.hasOwn(JOB_WEAPON_TIERS, job) ? JOB_WEAPON_TIERS[job] : WEAPON_TIERS;
  return tiers[lvl] || tiers[0];
}

// 접두사와 무관하게 원본 이름+기본 등급으로 동일 몬스터를 식별한다.
function getMonsterCollectionCatalog() {
  return monsters.map(m => ({ id: m.grade + ':' + m.name, name: m.name, base: m.grade.replace('등급', '') }));
}
function normalizeMonsterCollection(value) {
  const records={}, input=value && value.records || {};
  for(const entry of getMonsterCollectionCatalog()) {
    const mask=input[entry.id];
    if(Number.isInteger(mask) && mask>=1 && mask<=3)records[entry.id]=mask;
  }
  return {schemaVersion:2,records};
}
function getMonsterCollectionPoints(profile) {
  const data=normalizeMonsterCollection(profile && profile.monsterCollection);
  return Object.values(data.records).filter(mask=>mask===3).length;
}
function getMonsterCollectionBonus(profile) {
  const points = getMonsterCollectionPoints(profile);
  return { points, critRate: points >= 1 ? 1 : 0, critDmg: points >= 5 ? 1 : 0, counterRate: points >= 10 ? 1 : 0 };
}
function recordHuntCollection(profile, monster) {
  const match = /^(E|D|C|B|A|S|EX)(\+?)등급$/.exec(monster.grade || '');
  if (!match) return '';
  const entry = getMonsterCollectionCatalog().find(e => e.base === match[1] && e.name === monster.name);
  if (!entry) return '';
  profile.monsterCollection = normalizeMonsterCollection(profile.monsterCollection);
  const records = profile.monsterCollection.records;
  const before = records[entry.id] || 0;
  const after = before | (1 << match[2].length);
  records[entry.id] = after;
  if (before === after) return '';
  if (after !== 3) return '📖 컬렉션 등록: [' + monster.grade + '] ' + entry.name;
  const points = getMonsterCollectionPoints(profile);
  const reward = points === 1 ? '치명타 확률 +1%p' : points === 5 ? '치명타 데미지 +1%' : points === 10 ? '카운터 확률 +1%p' : '';
  return '🏆 컬렉션 완성: ' + entry.name + ' (' + entry.base + '/' + entry.base + '+)\n컬렉션 포인트 +1 · 총 ' + points + '포인트' + (reward ? '\n✨ 영구 효과 해금: ' + reward : '');
}
function processMonsterCollection(profile, arg = '') {
  const catalog = getMonsterCollectionCatalog();
  const data = normalizeMonsterCollection(profile.monsterCollection);
  const bonus = getMonsterCollectionBonus(profile);
  const size = 10, pages = Math.max(1, Math.ceil(catalog.length / size));
  const requested = /^\d+$/.test(arg.trim()) ? Number(arg.trim()) : 1;
  const page = Math.min(pages, Math.max(1, requested));
  const lines = ['📖 몬스터 컬렉션', '컬렉션 포인트 : ' + bonus.points + ' / ' + catalog.length,
    '영구 효과: 치명타 확률 +' + bonus.critRate + '%p | 치명타 데미지 +' + bonus.critDmg + '% | 카운터 확률 +' + bonus.counterRate + '%p',
    '', '1포인트: 치명타 확률 +1%p', '5포인트: 위 효과 + 치명타 데미지 1%', '10포인트: 위 효과 + 카운터 확률 1%p',
    '', '/사냥 처치만 등록됩니다. 같은 몬스터 기본/+ 완료 시 1포인트.', ''];
  for (const e of catalog.slice((page - 1) * size, page * size)) {
    const mask = data.records[e.id] || 0;
    lines.push((mask === 3 ? '🏆 ' : '▫️ ') + e.name, [0,1].map(i => ((mask & (1 << i)) ? '✅ ' : '⬜ ') + e.base + '+'.repeat(i)).join(' | '), '');
  }
  lines.push('페이지 ' + page + '/' + pages + ' · /컬렉션 [페이지]');
  return { text: lines.join('\n') };
}

function getEnhanceStats(enhanceLevel, combatLevel = 0, profile = null) {
  const isJob = profile && Boolean(profile.job);
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));

  let baseMult, baseCrit, baseCritDmg, baseCounter, baseFullCounter;

  if (getJobTier(profile) === 2) {
    // 2차 전직 무기는 강화 비용/난이도가 높은 대신 단계당 성장폭도 더 크다.
    baseMult = (3.00 + lvl * 0.08).toFixed(2);
    baseCrit = 30.00 + lvl * 0.80;
    baseCritDmg = 40.00 + lvl * 1.50;
    baseCounter = 3.00 + lvl * 0.15;
    baseFullCounter = 1.50 + lvl * 0.12;
  } else if (isJob) {
    baseMult = (2.00 + (lvl * 0.05)).toFixed(2);
    baseCrit = 10.00 + (lvl * 1.00);
    baseCritDmg = 20.00 + (lvl * 1.00);
    baseCounter = 1.00 + (lvl * 0.10);
    baseFullCounter = 0.50 + Math.max(0, lvl - 10) * 0.10;
  } else {
    baseMult = (1.00 + (lvl * 0.05)).toFixed(2);
    baseCrit = lvl * 0.50;
    baseCritDmg = lvl * 1.00;
    
    baseCounter = Math.max(0, lvl - 10) * 0.10;
    baseFullCounter = Math.max(0, lvl - 15) * 0.10;

  }

  const ampInfo = getAmplifyInfo(combatLevel);
  const imprintCritRate = getImprintTotalBonus(profile, 'critRate');
  const imprintCritWeight = getImprintTotalBonus(profile, 'critWeight');

  const collectionBonus = getMonsterCollectionBonus(profile);
  const baseJob = getBaseJobCode(profile);
  const secondJob = getSecondJobCode(profile);
  const archerCrit = baseJob === 'archer' ? getJobSkillLevelFor(profile, 'archer') * 0.5 : 0;
  const swordCounter = secondJob === 'swordmaster' ? getJobSkillLevelFor(profile, 'swordmaster') * 0.3 : 0;
  const gearSetBonus = getEquipmentSetBonuses(profile);
  const numCrit = Math.min(100, (baseCrit + imprintCritRate + archerCrit) * (1 + ampInfo.critWeight + (imprintCritWeight / 100)) + collectionBonus.critRate + gearSetBonus.critRate);
  const numCounter = baseCounter + collectionBonus.counterRate + swordCounter + gearSetBonus.counterRate;
  baseCritDmg += collectionBonus.critDmg + gearSetBonus.critDmg;
  const numFullCounter = baseFullCounter;
  // 공격은 평타/치명타만 판정한다. 카운터/풀카운터는 피격 직전 별도 판정한다.
  const numNormal = 100 - numCrit;

  return {
    mult: `x${baseMult}`,
    normal: `${(100 - Number(numCrit.toFixed(2))).toFixed(2)}%`,
    crit: `${numCrit.toFixed(2)}%`,
    critDmg: `${baseCritDmg.toFixed(2)}%`,
    counter: `${numCounter.toFixed(2)}%`,
    fullCounter: `${numFullCounter.toFixed(2)}%`,
    numNormal: numNormal,
    numCrit: numCrit,
    numCounter: numCounter,
    numFullCounter: numFullCounter
  };
}

function formatEnhanceStatDiff(oldStats, newStats) {
  return [
    `　　　　 배율 ${oldStats.mult} ➔ ${newStats.mult}`,
    `　　평타 확률 ${oldStats.normal} ➔ ${newStats.normal}`,
    `　치명타 확률 ${oldStats.crit} ➔ ${newStats.crit}`,
    `치명타 데미지 ${oldStats.critDmg} ➔ ${newStats.critDmg}`,
    `　카운터 확률 ${oldStats.counter} ➔ ${newStats.counter}`,
    `풀카운터 확률 ${oldStats.fullCounter} ➔ ${newStats.fullCounter}`
  ].join('\n');
}

function formatRefineStatDiff(oldRefine, newRefine) {
  const oldMult = (oldRefine * 0.10).toFixed(2);
  const newMult = (newRefine * 0.10).toFixed(2);
  
  const oldCrit = oldRefine * 1;
  const newCrit = newRefine * 1;

  return [
    `배율 | x${oldMult} ➔ x${newMult}`,
    `치명타 데미지 증가 | ${oldCrit}% ➔ ${newCrit}%`,
    `공격력 증가 | ${oldRefine * 2}% ➔ ${newRefine * 2}%`
  ].join('\n');
}

// 일반 +20=21,000 / 1차 +20=2차 +0=60,000 / 2차 +20=139,000.
function getWeaponAttackPower(profile) {
  const n = Math.max(0, Math.min(20, Math.floor(Number(getCurrentEnhanceLevel(profile)) || 0)));
  const effectiveLevel = n + (getJobTier(profile) === 2 ? 20 : 0);
  return profile && profile.job
    ? 21000 + 1000 * effectiveLevel + 50 * effectiveLevel * (effectiveLevel - 1)
    : 50 * n * (n + 1);
}

function getAttackPower(profile) {
  if (!profile) return 0;
  // 관리자 공격력 오버라이드가 설정되어 있으면 모든 공격력 표시/전투 계산에 그대로 사용한다.
  if (Number.isSafeInteger(profile.adminAttackPower) && profile.adminAttackPower >= 0) return profile.adminAttackPower;
  const combatLv = profile.combatLevel || 0;
  const enhance = getCurrentEnhanceLevel(profile);
  const lvl = profile.level || 1;
  const refineLvl = profile.refine || 0;

  const basePower = (lvl * 100) + (combatLv * 500) + getWeaponAttackPower(profile) + getCollectionCombatPower(profile);
  const refineBonusMult = 1 + (refineLvl * 0.02);
  const imprintCombatBoost = getImprintTotalBonus(profile, 'combatBoost') / 100;
  
  const warriorBonus = getBaseJobCode(profile) === 'warrior' ? getJobSkillLevelFor(profile, 'warrior') * 0.01 : 0;
  return Math.floor(basePower * refineBonusMult * (1 + imprintCombatBoost + warriorBonus));
}

// 파밍 표시와 기존 공격력 계산을 같은 값으로 유지한다.
function getCombatPower(profile) {
  return getAttackPower(profile);
}

// 치명타 데미지 증가율에는 상한을 두지 않는다. 최종 처치 확률만 별도로 100% 제한한다.
function getCriticalMultiplier(profile, stats = getEnhanceStats(getCurrentEnhanceLevel(profile), profile.combatLevel || 0, profile)) {
  const enhanceBonus = parseFloat(stats.critDmg) || 0;
  const refineBonus = Math.max(0, Number(profile.refine) || 0);
  const imprintBonus = getImprintTotalBonus(profile, 'critDmg');
  const wizardBonus = getBaseJobCode(profile) === 'wizard' ? getJobSkillLevelFor(profile, 'wizard') * 2 : 0;
  const archmageBonus = getSecondJobCode(profile) === 'archmage' ? getJobSkillLevelFor(profile, 'archmage') * 3 : 0;
  return 2 + (enhanceBonus + refineBonus + imprintBonus + wizardBonus + archmageBonus) / 100;
}

function addExp(profile, baseAmount, rewardMultiplier = getExpMultiplier(profile)) {
  if (!profile) return { leveledUp: false, msg: '', gained: 0 };
  if (!profile.level) profile.level = 1;
  if (!profile.exp) profile.exp = 0;

  const finalAmount = Math.round(baseAmount * rewardMultiplier);
  profile.exp += finalAmount;
  let levelUpMessages = [];

  while (profile.exp >= getRequiredExp(profile.level)) {
    profile.exp -= getRequiredExp(profile.level);
    profile.level += 1;
    levelUpMessages.push(`🎉 [LEVEL UP!] Lv.${profile.level} 달성!`);
  }

  return { leveledUp: levelUpMessages.length > 0, msg: levelUpMessages.join('\n'), gained: finalAmount };
}

function checkAndResetSeasonPass(profile) {
  const currentMonthStr = getKSTMonthString();
  const todayStr = getKSTDateString();

  if (!profile.seasonPass || profile.seasonPass.month !== currentMonthStr) {
    profile.seasonPass = {
      month: currentMonthStr,
      level: 1,
      exp: 0,
      claimedRewards: [],
      lastAttendanceDate: "", 
      lastDailyDate: "",
      dailyFarmExpClaimed: false, 
      dailyHuntExpClaimed: false
    };
  }

  const pass = profile.seasonPass;
  const safeWhole = (value, fallback) => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : fallback;
  pass.level = Math.max(1, safeWhole(pass.level, 1));
  pass.exp = safeWhole(pass.exp, 0);
  pass.level += Math.floor(pass.exp / 100);
  pass.exp %= 100;
  pass.claimedRewards = Array.isArray(pass.claimedRewards)
    ? [...new Set(pass.claimedRewards.map(Number).filter(n => Number.isInteger(n) && n >= 1))] : [];
  pass.lastAttendanceDate = typeof pass.lastAttendanceDate === 'string' ? pass.lastAttendanceDate : '';
  pass.dailyFarmExpClaimed = pass.dailyFarmExpClaimed === true;
  pass.dailyHuntExpClaimed = pass.dailyHuntExpClaimed === true;
  if (profile.seasonPass.lastDailyDate !== todayStr) {
    profile.seasonPass.lastDailyDate = todayStr;
    profile.seasonPass.dailyFarmExpClaimed = false;
    profile.seasonPass.dailyHuntExpClaimed = false;
  }
}

function grantPassExp(profile, amount) {
  checkAndResetSeasonPass(profile);
  const pass = profile.seasonPass;
  amount = Number.isFinite(Number(amount)) ? Math.max(0, Math.floor(Number(amount))) : 0;
  pass.exp += amount;

  let leveledUp = false;
  let oldLevel = pass.level;

  while (pass.exp >= 100) {
    pass.exp -= 100;
    pass.level += 1;
    leveledUp = true;
  }

  let msgs = [];
  if (amount > 0) {
    msgs.push(`🎫 [시즌 패스] 경험치 +${amount} 획득! (${pass.exp}/100)`);
  }
  if (leveledUp) {
    msgs.push(`🎉 [시즌 패스 레벨업!] Lv.${oldLevel} ➔ Lv.${pass.level}`);
  }

  return msgs.join('\n');
}

function claimDailyPassMissions(profile) {
  checkAndResetSeasonPass(profile);
  checkAndResetFarmLimit(profile);
  checkAndResetHuntLimit(profile);
  const lines = [];
  for (const mission of [
    { count: profile.farmData.count, threshold: 200, flag: 'dailyFarmExpClaimed', name: '파밍' },
    { count: profile.huntData.count, threshold: 2000, flag: 'dailyHuntExpClaimed', name: '사냥' }
  ]) {
    if (mission.count >= mission.threshold && !profile.seasonPass[mission.flag]) {
      const message = grantPassExp(profile, 50);
      profile.seasonPass[mission.flag] = true;
      lines.push('🎯 [시즌 패스 미션 달성] ' + mission.name + ' ' + mission.threshold + '회 달성!\n' + message);
    }
  }
  return lines;
}

function processPassCommand(profile) {
  const missionMessages = claimDailyPassMissions(profile);
  const pass = profile.seasonPass;
  const todayStr = getKSTDateString();

  let lines = [
    ...missionMessages,
    `🎫 [${pass.month} 시즌 패스 대시보드]`,
    `• 현재 패스 레벨 : Lv.${pass.level}`,
    `• 패스 경험치 : ${pass.exp} / 100`,
    ``,
    `📋 [일일 경험치 획득 미션]`,
    `• 출석 체크 : 20 EXP ${pass.lastAttendanceDate === todayStr ? '(완료)' : '(미완료)'}`,
    `• 일일 /파밍 200회 달성 : 50 EXP ${pass.dailyFarmExpClaimed ? '(완료)' : `(${profile.farmData?.count || 0}/200)`}`,
    `• 일일 /사냥 2000회 달성 : 50 EXP ${pass.dailyHuntExpClaimed ? '(완료)' : `(${profile.huntData?.count || 0}/2000)`}`,
    ``,
    `🎁 [시즌 패스 주요 보상 (레벨당 기본 보상: 10만 원, 금괴 10, 보석 5)]`,
    `• 1레벨 보상 : 100만 원, 금괴 100, 보석 10, 비밀열쇠 5 ${pass.claimedRewards.includes(1) ? '(수령완료)' : ''}`,
    `• 5레벨 보상 : 100만 원, 금괴 100, 보석 10, 비밀열쇠 5 ${pass.claimedRewards.includes(5) ? '(수령완료)' : ''}`,
    `• 10레벨 보상 : 100만 원, 금괴 100, 보석 10, 2026 시즌1 코스튬 ${pass.claimedRewards.includes(10) ? '(수령완료)' : ''}`,
    `• 15레벨 보상 : 100만 원, 금괴 100, 보석 10, 비밀열쇠 5 ${pass.claimedRewards.includes(15) ? '(수령완료)' : ''}`,
    `• 20레벨 보상 : 100만 원, 금괴 100, 보석 10, 2026 시즌1 패스 칭호 ${pass.claimedRewards.includes(20) ? '(수령완료)' : ''}`,
    `• 21레벨 이상 : 기본 보상 반복 획득`,
    ``,
    `💡 [/패스 보상] 명령어로 수령 가능한 시즌 패스 보상을 일괄 수령할 수 있습니다.`
  ];

  return { text: lines.join('\n') };
}

function processPassClaimRewards(profile) {
  checkAndResetSeasonPass(profile);
  const pass = profile.seasonPass;

  let totalCash = 0;
  let totalGold = 0;
  let totalGem = 0;
  let totalKeys = 0;
  let itemsGained = [];
  let claimedLevels = [];

  if (!profile.ownedTitles) profile.ownedTitles = [];
  if (!profile.inventory) profile.inventory = [];

  for (let lvl = 1; lvl <= pass.level; lvl++) {
    if (!pass.claimedRewards.includes(lvl)) {
      pass.claimedRewards.push(lvl);
      claimedLevels.push(lvl);

      // 모든 레벨 공통 기본 보상 (21레벨 이상 무한 구간 포함)
      totalCash += 100000;
      totalGold += 10;
      totalGem += 5;

      // 특정 단계별 특별 추가 보상
      if (lvl === 1 || lvl === 5 || lvl === 15) {
        totalCash += 1000000;
        totalGold += 100;
        totalGem += 10;
        totalKeys += 5;
      } else if (lvl === 10) {
        totalCash += 1000000;
        totalGold += 100;
        totalGem += 10;
        
        const costumeItem = "2026 시즌1 코스튬";
        itemsGained.push(costumeItem);
        profile.inventory.push({
          category: 'costume',
          name: costumeItem,
          desc: "2026 시즌1 특별 패스 코스튬 아이템입니다."
        });
      } else if (lvl === 20) {
        totalCash += 1000000;
        totalGold += 100;
        totalGem += 10;
        const passTitle = "2026 시즌1 패스";
        if (!profile.ownedTitles.includes(passTitle)) {
          profile.ownedTitles.push(passTitle);
        }
        itemsGained.push(`칭호: ${passTitle}`);
      }
    }
  }

  if (claimedLevels.length === 0) {
    return { text: `⚠️ 현재 수령할 수 있는 시즌 패스 보상이 없습니다.` };
  }

  totalCash = applyAchievementCashBonus(totalCash, profile);
  profile.cash += totalCash;
  profile.gold = (profile.gold || 0) + totalGold;
  profile.gem = (profile.gem || 0) + totalGem;
  profile.keys = (profile.keys || 0) + totalKeys;

  let rewardSummary = [
    `🎁 [시즌 패스 보상 수령 완료!]`,
    `• 수령한 레벨 구간 : Lv.${claimedLevels[0]} ~ Lv.${claimedLevels[claimedLevels.length - 1]} (${claimedLevels.length}개 단계)`,
    `• 획득 현금 : +${won(totalCash)}`,
    `• 획득 금괴 : +${totalGold.toLocaleString()}개`,
    `• 획득 보석 : +${totalGem.toLocaleString()}개`
  ];

  if (totalKeys > 0) rewardSummary.push(`• 획득 비밀열쇠 : +${totalKeys}개`);
  if (itemsGained.length > 0) rewardSummary.push(`• 특별 보상 : ${itemsGained.join(', ')}`);

  rewardSummary.push(``, resourceText(profile));

  return { text: rewardSummary.join('\n') };
}

const CURRENT_DATA_VERSION = 5;

// 저장소(DB/웹 state)에서 들어온 숫자형 데이터를 안전한 정수로 정규화한다.
function normalizeStoredInt(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const normalized = Math.trunc(parsed);
  return Math.min(max, Math.max(min, normalized));
}

function migrateProfileData(profile) {
  if (!profile || typeof profile !== 'object') profile = {};
  profile.version = Math.max(Number(profile.version) || 0, CURRENT_DATA_VERSION);
  if (typeof profile.lastSmSkillDate !== 'string') profile.lastSmSkillDate = '';
  if (!profile.mgsDungeonData || typeof profile.mgsDungeonData !== 'object') {
    profile.mgsDungeonData = { date: '', count: 0 };
  }
  profile.mgsDungeonData.date = typeof profile.mgsDungeonData.date === 'string' ? profile.mgsDungeonData.date : '';
  profile.mgsDungeonData.count = Math.max(0, Number(profile.mgsDungeonData.count) || 0);
  if (!Array.isArray(profile.ownedAvatars)) profile.ownedAvatars = [];
  if (typeof profile.equippedAvatar !== 'string') profile.equippedAvatar = '';
  const jobData = JOB_CATALOG[profile.job];
  if (jobData) {
    if (jobData[1] === 1) {
      profile.firstJob = profile.firstJob || profile.job;
      profile.secondJob = null;
    } else if (jobData[1] === 2) {
      profile.firstJob = profile.firstJob || jobData[2];
      profile.secondJob = profile.secondJob || profile.job;
    }
  }
  if (!profile.jobSkillLevels || typeof profile.jobSkillLevels !== 'object') profile.jobSkillLevels = {};
  if (profile.job && !profile.jobSkillLevels[profile.job]) profile.jobSkillLevels[profile.job] = normalizeStoredInt(profile.jobSkillLevel, 1, 1, 10);
  if (profile.firstJob && !profile.jobSkillLevels[profile.firstJob]) profile.jobSkillLevels[profile.firstJob] = 1;
  if (profile.secondJob && !profile.jobSkillLevels[profile.secondJob]) profile.jobSkillLevels[profile.secondJob] = profile.job === profile.secondJob ? normalizeStoredInt(profile.jobSkillLevel, 1, 1, 10) : 1;
  profile.jobSkillLevel = profile.job ? getJobSkillLevelFor(profile, profile.job) : 1;
  ensureSkillState(profile);
  if (!Number.isInteger(profile.equippedAvatarIndex) || profile.equippedAvatarIndex < 0 || profile.equippedAvatarIndex >= profile.ownedAvatars.length) {
    profile.equippedAvatarIndex = profile.equippedAvatar ? profile.ownedAvatars.indexOf(profile.equippedAvatar) : -1;
  }
  return profile;
}

function createProfile(existing = {}) {
  const safeObj = existing && typeof existing === 'object' ? existing : {};
  
  const nickname = (typeof safeObj.nickname === 'string' && safeObj.nickname.trim() !== '') 
    ? safeObj.nickname 
    : generateRandomNickname();

  let profile = {
    version: normalizeStoredInt(safeObj.version, CURRENT_DATA_VERSION, 0),
    gradeSchemaVersion: 2,
    // 서버가 MongoDB 조회에 사용하는 사용자 ID. 기존 저장 키와 별도로 보존한다.
    userId: typeof safeObj.userId === 'string' ? safeObj.userId.trim() : '',
    monsterCollection: normalizeMonsterCollection(safeObj.monsterCollection),
    cash: normalizeStoredInt(safeObj.cash, 0, 0),
    gold: normalizeStoredInt(safeObj.gold, 0, 0),
    gem: normalizeStoredInt(safeObj.gem, 0, 0),
    keys: normalizeStoredInt(safeObj.keys, 0, 0),
    enhance: normalizeStoredInt(safeObj.enhance, 0, 0),
    jobEnhance: normalizeStoredInt(safeObj.jobEnhance, 0, 0),
    totalEnhanceCost: normalizeStoredInt(safeObj.totalEnhanceCost, 0, 0),       // 모험가 시절 일반무기 누적 강화 비용
    totalJobEnhanceCost: normalizeStoredInt(safeObj.totalJobEnhanceCost, 0, 0), // 전직 이후 전직무기 누적 강화 비용
    refine: normalizeStoredInt(safeObj.refine, 0, 0),
    level: normalizeStoredInt(safeObj.level, 1, 1),
    exp: normalizeStoredInt(safeObj.exp, 0, 0),
    combatLevel: normalizeStoredInt(safeObj.combatLevel, 0, 0),
    job: safeObj.job ?? null,
    firstJob: typeof safeObj.firstJob === 'string' ? safeObj.firstJob : null,
    secondJob: typeof safeObj.secondJob === 'string' ? safeObj.secondJob : null,
    jobSkillLevel: normalizeStoredInt(safeObj.jobSkillLevel, 1, 1, 10),
    jobSkillLevels: safeObj.jobSkillLevels && typeof safeObj.jobSkillLevels === 'object' ? { ...safeObj.jobSkillLevels } : {},
    skillState: safeObj.skillState && typeof safeObj.skillState === 'object' ? JSON.parse(JSON.stringify(safeObj.skillState)) : { date:'', dailyUses:{}, buffs:{}, souls:0 },
    creature: safeObj.creature ?? null,
    imprints: normalizeImprints(safeObj.imprints), 
    imprintLocks: safeObj.imprintLocks && typeof safeObj.imprintLocks === 'object' ? { ...safeObj.imprintLocks } : { I: false, II: false, III: false, IV: false, V: false }, 
    inventory: Array.isArray(safeObj.inventory) ? safeObj.inventory.filter(item => item && typeof item === 'object').map(item => ({ ...item })) : [],
    equippedGear: safeObj.equippedGear && typeof safeObj.equippedGear === 'object' ? JSON.parse(JSON.stringify(safeObj.equippedGear)) : {},
    nickname: nickname,
    title: safeObj.title ?? '',
    ownedTitles: Array.isArray(safeObj.ownedTitles) ? [...safeObj.ownedTitles] : [],
    equippedTitle: safeObj.equippedTitle ?? '',
    ownedAvatars: Array.isArray(safeObj.ownedAvatars) ? [...new Set(safeObj.ownedAvatars.filter(x => typeof x === 'string' && x))] : [],
    equippedAvatar: typeof safeObj.equippedAvatar === 'string' ? safeObj.equippedAvatar : '',
    equippedAvatarIndex: -1, // 중복 제거 후 장착 이름으로 다시 계산
    supplyItem: normalizeStoredInt(safeObj.supplyItem ?? safeObj.monthItems, 0, 0),
    gamesPlayed: normalizeStoredInt(safeObj.gamesPlayed, 0, 0),
    maxEnhanceHistory: normalizeStoredInt(safeObj.maxEnhanceHistory ?? safeObj.enhance, 0, 0),
    maxJobEnhanceHistory: normalizeStoredInt(safeObj.maxJobEnhanceHistory ?? safeObj.jobEnhance, 0, 0),
    hasSeenJobGuide: safeObj.hasSeenJobGuide ?? false,
    farmData: safeObj.farmData && typeof safeObj.farmData === 'object' ? { ...safeObj.farmData } : { date: "", count: 0, lastClaimedFarmQuest: 0 },
    huntData: safeObj.huntData && typeof safeObj.huntData === 'object' ? { ...safeObj.huntData } : { date: "", count: 0, lastClaimedHuntQuest: 0 },
    pvpData: safeObj.pvpData && typeof safeObj.pvpData === 'object' ? { ...safeObj.pvpData } : { date: "", count: 0 },
    dungeonData: safeObj.dungeonData && typeof safeObj.dungeonData === 'object' ? { ...safeObj.dungeonData } : { date: "", count: 0 },
    speedMultiplier: normalizeStoredInt(safeObj.speedMultiplier, 1, 1, 1000),
    adminSpeedMode: safeObj.adminSpeedMode === true,
    // 관리자 전용 공격력 고정값. null이면 기존 성장식 공격력을 사용한다.
    adminAttackPower: Number.isSafeInteger(safeObj.adminAttackPower) && safeObj.adminAttackPower >= 0 ? safeObj.adminAttackPower : null,
    vault: safeObj.vault && typeof safeObj.vault === 'object'
      ? {
          ...safeObj.vault,
          level: normalizeStoredInt(safeObj.vault.level, 0, 0),
          amount: normalizeStoredInt(safeObj.vault.amount, 0, 0),
          lastTime: normalizeStoredInt(safeObj.vault.lastTime, 0, 0)
        }
      : { level: 0, amount: 0, lastTime: 0 },
    helpSeen: safeObj.helpSeen && typeof safeObj.helpSeen === 'object' ? { ...safeObj.helpSeen } : {},
    seasonPass: safeObj.seasonPass && typeof safeObj.seasonPass === 'object' ? { ...safeObj.seasonPass } : { month: "", level: 1, exp: 0, claimedRewards: [], lastAttendanceDate: "", lastDailyDate: "", dailyFarmExpClaimed: false, dailyHuntExpClaimed: false },
    raidData: safeObj.raidData && typeof safeObj.raidData === 'object' ? { ...safeObj.raidData } : { hp: 100000000 },
    lastSmSkillDate: typeof safeObj.lastSmSkillDate === 'string' ? safeObj.lastSmSkillDate : '',
    mgsDungeonData: safeObj.mgsDungeonData && typeof safeObj.mgsDungeonData === 'object' ? { ...safeObj.mgsDungeonData } : { date: '', count: 0 },
    // 웹/챗봇 연동에서 state.battle이 누락되어도 진행 중 파밍을 복구하기 위한 백업
    activeFarmBattle: safeObj.activeFarmBattle && typeof safeObj.activeFarmBattle === 'object'
      ? JSON.parse(JSON.stringify(safeObj.activeFarmBattle))
      : null
  };

  profile = migrateProfileData(profile);
  function renameLabels(value) {
    if (!value || typeof value !== 'object') return;
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string') value[key] = value[key].replace(/전\uD22C력/g, '공격력');
      else if (value[key] && typeof value[key] === 'object') renameLabels(value[key]);
    }
  }
  renameLabels(profile.imprints);
  return profile;
}

function getVaultCapacity(vault) {
  return Math.max(0, Math.floor(Number(vault && vault.level) || 0)) * VAULT_CAPACITY_PER_LEVEL;
}

function calculateVaultInterest(vault) {
  if (!vault || vault.level === 0 || vault.amount <= 0 || !vault.lastTime) {
    return { currentAmount: vault ? vault.amount : 0, interest: 0, elapsedHours: 0 };
  }
  const now = Date.now();
  const diffMs = now - vault.lastTime;
  let elapsedHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (elapsedHours > 12) elapsedHours = 12;

  if (elapsedHours <= 0) {
    return { currentAmount: vault.amount, interest: 0, elapsedHours: 0 };
  }

  const interest = Math.floor(vault.amount * 0.01 * elapsedHours);
  return {
    currentAmount: vault.amount + interest,
    interest: interest,
    elapsedHours: elapsedHours
  };
}

function processVaultCommand(profile, subCommand, arg) {
  if (!profile.vault) profile.vault = { level: 0, amount: 0, lastTime: 0 };

  const sub = subCommand ? subCommand.trim().toLowerCase() : '';

  if (sub === '구매' || sub === '레벨업' || sub === '해금') {
    const curLevel = profile.vault.level || 0;
    
    let requiredGold = 1000;
    if (curLevel >= 1) {
      requiredGold = 1000 + (curLevel - 1) * 500;
    }

    if ((profile.gold || 0) < requiredGold) {
      return {
        text: `⚠️ 금괴가 부족합니다!\n(금고 ${curLevel === 0 ? '해금' : '레벨업'} 필요 금괴: ${requiredGold.toLocaleString()}개 | 보유 금괴: ${(profile.gold || 0).toLocaleString()}개)`
      };
    }

    profile.gold -= requiredGold;
    profile.vault.level = curLevel + 1;
    const maxLimit = getVaultCapacity(profile.vault);

    return {
      text: [
        `🏦 [금고 ${curLevel === 0 ? '해금' : '레벨업'} 성공!]`,
        `금고 레벨: Lv.${curLevel} ➔ Lv.${profile.vault.level}`,
        `최대 보관 한도: ${won(maxLimit)}`,
        `(소모: 금괴 ${requiredGold.toLocaleString()}개)`,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  }

  if (profile.vault.level === 0) {
    return {
      text: [
        `🏦 [금고 시스템]`,
        `현재 금고를 보유하고 있지 않습니다.`,
        ``,
        `• 해금 비용 : 금괴 1,000개 (1레벨 해금)`,
        `• 1레벨 보관 한도 : 2,000,000원`,
        `• 이자 혜택 : 1시간당 1% (최대 12시간, 단리 적용)`,
        ``,
        `💡 [/금고 구매] 명령어로 금고를 해금할 수 있습니다.`
      ].join('\n')
    };
  }

  if (sub === '출금' || sub === '찾기') {
    if (profile.vault.amount <= 0) {
      return { text: `⚠️ 금고에 보관된 금액이 없습니다.` };
    }

    const vaultInfo = calculateVaultInterest(profile.vault);
    const totalPayout = vaultInfo.currentAmount;
    const interest = vaultInfo.interest;

    profile.cash += totalPayout;
    profile.vault.amount = 0;
    profile.vault.lastTime = 0;

    return {
      text: [
        `🏦 [금고 출금 완료]`,
        `• 출금 원금 : ${won(totalPayout - interest)}`,
        `• 누적 이자 : +${won(interest)} (${vaultInfo.elapsedHours}시간 적용)`,
        `• 최종 현금 수령액 : ${won(totalPayout)}`,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  }

  let inputAmount = parseInt(subCommand, 10);
  if (!isNaN(inputAmount) && inputAmount > 0) {
    const maxLimit = getVaultCapacity(profile.vault);
    
    let vaultInfo = calculateVaultInterest(profile.vault);
    let currentVaultBase = vaultInfo.currentAmount; 
    let availableDeposit = maxLimit - currentVaultBase;

    if (currentVaultBase >= maxLimit) {
      return { text: `⚠️ 금고가 가득 찼습니다! (현재 보관 한도: ${won(maxLimit)})` };
    }

    if (inputAmount > availableDeposit) {
      return { text: `⚠️ 보관 한도를 초과할 수 없습니다. (현재 보관 한도: ${won(maxLimit)} | 입금 가능액: ${won(availableDeposit)})` };
    }

    if (profile.cash < inputAmount) {
      return { text: `⚠️ 소지 현금이 부족합니다! (필요: ${won(inputAmount)} | 보유: ${won(profile.cash)})` };
    }

    profile.cash -= inputAmount;
    // 입금 시 기존 쌓인 이자를 원금에 자동 합산 처리 후 타이머 리셋
    profile.vault.amount = vaultInfo.currentAmount + inputAmount;
    profile.vault.lastTime = Date.now();

    return {
      text: [
        `🏦 [금고 입금 완료]`,
        `• 입금액 : ${won(inputAmount)}`,
        `• 금고 현재 금액 : ${won(profile.vault.amount)} / ${won(maxLimit)}`,
        `• 이자 타이머가 새로 시작되었습니다 (1시간당 1%, 최대 12시간).`,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  }

  const maxLimit = getVaultCapacity(profile.vault);
  const nextUpgradeCost = 1000 + (profile.vault.level - 1) * 500;
  const vaultInfo = calculateVaultInterest(profile.vault);

  return {
    text: [
      `🏦 [금고 상태 대시보드]`,
      `• 금고 레벨 : Lv.${profile.vault.level}`,
      `• 최대 보관 한도 : ${won(maxLimit)}`,
      `• 보관 원금 : ${won(profile.vault.amount)}`,
      `• 현재 이자 포함 예상액 : ${won(vaultInfo.currentAmount)} (+${won(vaultInfo.interest)}, ${vaultInfo.elapsedHours}시간 적용)`,
      `• 다음 레벨업 비용 : 금괴 ${nextUpgradeCost.toLocaleString()}개`,
      ``,
      `💡 명령어 사용법:`,
      `• [/금고 (금액)] : 금액 입금`,
      `• [/금고 출금] : 원금 및 이자 전액 출금`,
      `• [/금고 구매] : 금고 레벨업 (한도 +2,000,000원 증가)`
    ].join('\n')
  };
}

function checkAndMarkHelp(profile, commandName) {
  if (!profile.helpSeen) profile.helpSeen = {};
  if (profile.helpSeen[commandName]) {
    return false;
  }
  profile.helpSeen[commandName] = true;
  return true;
}

function checkAndResetFarmLimit(playerState) {
  const todayStr = getKSTDateString();
  const day = getKSTParts().weekday;
  const maxLimit = (day === 0 || day === 6) ? 2000 : FARM_DAILY_LIMIT;

  if (!playerState.farmData || playerState.farmData.date !== todayStr) {
    playerState.farmData = { date: todayStr, count: 0, max: maxLimit, lastClaimedFarmQuest: 0 };
  } else {
    playerState.farmData.max = maxLimit;
    if (playerState.farmData.lastClaimedFarmQuest === undefined) {
      playerState.farmData.lastClaimedFarmQuest = 0;
    }
  }
}

function activeAbilityText(profile) {
  const p = profile;
  const stats = getEnhanceStats(getCurrentEnhanceLevel(p), p.combatLevel || 0, p);
  const amp = getAmplifyInfo(p.combatLevel || 0);
  const imprint = key => getImprintTotalBonus(p, key);
  const fmt = n => Number(n.toFixed(2)).toLocaleString();
  const lines = ['✨ 적용 중인 능력치'];
  function add(label, value, unit = '%', prefix = '+') {
    if (Number.isFinite(value) && value > 0) lines.push(label + ' : ' + prefix + fmt(value) + unit);
  }
  add('🎯 치명타 확률', stats.numCrit, '%', '');
  add('🔥 치명타 데미지 증가', (getCriticalMultiplier(p, stats) - 2) * 100);
  add('🛡️ 카운터 확률', stats.numCounter, '%', '');
  add('⚔️ 풀카운터 확률', stats.numFullCounter, '%', '');
  add('치명타 확률 가중치 (위 확률에 반영)', amp.critWeight * 100 + imprint('critWeight'));
  add('강화 성공 확률 보정', amp.successBonus + imprint('enhanceSuccess'), '%p');
  add('강화 비용 감소', Math.min(100, imprint('enhanceCostDown')));
  const warriorBonus = getBaseJobCode(p) === 'warrior' ? getJobSkillLevelFor(p,'warrior') * 0.01 : 0;
  const attackIncrease = ((1 + (p.refine || 0) * 0.02) * (1 + imprint('combatBoost') / 100 + warriorBonus) - 1) * 100;
  add('공격력 증가 (현재 공격력에 반영)', attackIncrease);
  add('칭호·아바타 수집 공격력 (현재 공격력에 반영)', getCollectionCombatPower(p), '');
  add('받는 피해 감소 (최소 피해 1)', imprint('damageReduce'), '');
  const farmMult = getGoldMultiplier(p) * (1+getAvatarCashBonus(p));
  add('💵 파밍 현금 획득량 증가', (farmMult - 1) * 100);
  add('⭐ 파밍 경험치 증가 (획득 현금에 비례)', (farmMult - 1) * 100);
  const creature = getCreatureBonus(p);
  const huntMult = getLootMultiplier(p) * (1 + creature.cashPct + getAvatarCashBonus(p));
  add('💵 사냥 현금 획득량 증가', (huntMult - 1) * 100);
  add('현금 각인 배율 가산 (파밍 배율에 반영)', imprint('cashBoost') / 100, '', 'x');
  add('금괴 획득 시 추가 수량 (크리처)', creature.bonusGold, '개');
  add('보석 획득 시 추가 수량 (크리처)', creature.bonusGem, '개');
  add('금괴 획득량 증가 (장착 칭호)', getTitleGoldBonus(p) * 100);
  if (lines.length === 1) lines.push('적용 중인 추가 능력치가 없습니다.');
  else lines.push('※ 확률은 합산 결과이며, 획득량 증가는 배속·정수 처리 전 기준입니다.');
  return lines;
}

function profileText(profile, detailed = false) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getAttackPower(p);
  const currentEnhance = getCurrentEnhanceLevel(p);
  const [wName, wDescription] = getWeaponInfo(currentEnhance, p.job);
  const refineStar = REFINE_STARS[Math.min(p.refine, REFINE_STARS.length - 1)] || '';
  
  const totalMult = getGoldMultiplier(p).toFixed(2);

  const jobNames = JOB_NAMES;
  const firstJobCode = getBaseJobCode(p), secondJobCode = getSecondJobCode(p);
  const jobDisplay = p.job ? (secondJobCode
    ? `${jobNames[firstJobCode]} Lv.${getJobSkillLevelFor(p,firstJobCode)} → ${jobNames[secondJobCode]} Lv.${getJobSkillLevelFor(p,secondJobCode)}`
    : `${jobNames[firstJobCode] || p.job} (Lv.${getJobSkillLevelFor(p,firstJobCode)})`) : '모험가';
  const displayTitle = p.equippedTitle || p.title || '없음';
  const displayAvatar = p.equippedAvatar || '없음';
  const creatureDisplay = p.creature ? (CREATURE_GRADES[p.creature]?.name || p.creature) : '없음';

  let lines = [
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    `칭호 : ${displayTitle}`,
    `아바타 : ${displayAvatar}`,
    `🎖️ 직업 : ${jobDisplay}`,
    `🐾 크리처 : ${creatureDisplay}`,
    `🎯 무기 : +${currentEnhance} ${wName}`,
    `🔥 제련 : ${refineStar}`,
    `⭐ Lv.${p.level} (${(p.exp || 0).toLocaleString()}/${reqExp.toLocaleString()})`,
    `💪 공격력 : ${combatPower.toLocaleString()}`,
    `🌌 증폭 Lv.${p.combatLevel || 0}`,
    `🔘 배율 : x${totalMult}`,
    `⏩ 배속 : x${p.speedMultiplier || 1}`
  ];

  if (detailed) lines.push('', ...activeAbilityText(p));

  lines.push(
    ``,
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${(p.gold || 0).toLocaleString()}개`,
    `💎 보석 : ${(p.gem || 0).toLocaleString()}개`,
    `🔑 비밀열쇠 : ${(p.keys || 0).toLocaleString()}개`,
    `📦 보급 : ${(p.supplyItem || 0).toLocaleString()}개`
  );

  return lines.join('\n');
}

function enhanceResourceText(profile) {
  return `💵 현금 : ${won(profile.cash)}\n🧈 금괴 : ${(profile.gold || 0).toLocaleString()}개`;
}

function resourceText(profile) {
  const p = createProfile(profile);
  return [
    `💵 현금 : ${won(p.cash)}`,
    `🧈 금괴 : ${(p.gold || 0).toLocaleString()}개`,
    `💎 보석 : ${(p.gem || 0).toLocaleString()}개`,
    `🔑 비밀열쇠 : ${(p.keys || 0).toLocaleString()}개`,
    `📦 보급 : ${(p.supplyItem || 0).toLocaleString()}개`
  ].join('\n');
}

function processTitleInfo(profile) {
  if (!profile.ownedTitles) profile.ownedTitles = [];

  const currentMonth = getKSTParts().month;
  const currentMonthTitle = MONTHLY_TITLES[currentMonth];
  const currentSeasonTitle = SEASON_TITLES[1];

  let lines = [
    `🎖️ [칭호 정보 및 보유 목록]`,
    `현재 장착 칭호 : ${profile.equippedTitle || '없음'}`,
    `보유 효과 : 칭호 1개당 공격력 +1,000 (현재 +${(profile.ownedTitles.length * 1000).toLocaleString()})`,
    `장착 효과 : 금괴 획득량 +10%`,
    ``,
    `📅 현재 획득 가능한 칭호:`,
    `• 월별 칭호 (${currentMonth}월): ${currentMonthTitle}`,
    `• 시즌 칭호 (시즌 1): ${currentSeasonTitle}`,
    ``,
    `📜 보유 중인 칭호 목록:`
  ];

  if (profile.ownedTitles.length === 0) {
    lines.push(`보유한 칭호가 없습니다. /보급 커맨드로 칭호를 획득해보세요!`);
  } else {
    profile.ownedTitles.forEach((titleName, index) => {
      const isEquipped = titleName === profile.equippedTitle ? " (장착 중)" : "";
      lines.push(`${index + 1}. ${titleName}${isEquipped} — 보유: 공격력 +1,000 / 장착: 금괴 +10%`);
    });
  }

  lines.push(``, `💡 [/칭호 장착 (숫자)] 명령어로 칭호를 장착할 수 있습니다.`);

  return { text: lines.join('\n') };
}

function processTitleEquip(profile, arg) {
  if (!profile.ownedTitles) profile.ownedTitles = [];

  const index = parseInt(arg, 10) - 1;
  if (isNaN(index) || index < 0 || index >= profile.ownedTitles.length) {
    return { text: `⚠️ 올바른 칭호 번호를 입력해 주세요. 보유한 칭호 목록의 번호를 확인해 주세요.` };
  }

  const selectedTitle = profile.ownedTitles[index];
  profile.equippedTitle = selectedTitle;
  profile.title = selectedTitle;

  return { text: `🎖️ [칭호 장착 완료] '${selectedTitle}' 칭호를 장착했습니다!` };
}

function processAvatarInfo(profile) {
  if (!Array.isArray(profile.ownedAvatars)) profile.ownedAvatars = [];
  const avatarCount = profile.ownedAvatars.length;
  const lines = [
    `🧑 [아바타 정보]`,
    `현재 장착 아바타 : ${profile.equippedAvatar || '없음'}`,
    `보유 효과 : 아바타 1개당 공격력 +1,000 (현재 +${(avatarCount * 1000).toLocaleString()})`,
    `장착 효과 : 현금 획득량 +10%`,
    ``,
    `📜 보유 중인 아바타 목록:`
  ];

  if (avatarCount === 0) {
    lines.push(`보유한 아바타가 없습니다. /보급에서 월별 아바타를 획득할 수 있습니다.`);
  } else {
    profile.ownedAvatars.forEach((avatarName, index) => {
      const equipped = index === profile.equippedAvatarIndex ? ' (장착 중)' : '';
      lines.push(`${index + 1}. ${avatarName}${equipped} — 보유: 공격력 +1,000 / 장착: 현금 +10%`);
    });
  }
  lines.push(``, `💡 [/아바타 장착 (숫자)] 명령어로 아바타를 장착할 수 있습니다.`);
  return { text: lines.join('\n') };
}

function processAvatarEquip(profile, arg) {
  if (!Array.isArray(profile.ownedAvatars)) profile.ownedAvatars = [];
  const index = parseInt(arg, 10) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= profile.ownedAvatars.length) {
    return { text: `⚠️ 올바른 아바타 번호를 입력해 주세요. 보유 목록의 번호를 확인해 주세요.` };
  }
  profile.equippedAvatar = profile.ownedAvatars[index];
  profile.equippedAvatarIndex = index;
  return { text: `🧑 [아바타 장착 완료] '${profile.equippedAvatar}' 아바타를 장착했습니다!\n장착 효과: 현금 획득량 +10%` };
}

function processCreatureInfo(profile) {
  const currentCode = profile.creature;
  let currentText = "없음";
  let effectText = "효과 없음";

  if (currentCode && CREATURE_GRADES[currentCode]) {
    const info = CREATURE_GRADES[currentCode];
    currentText = info.name;
    let effs = [`돈 +${Math.round(info.cashPct * 100)}%`];
    if (info.bonusGold > 0) effs.push(`추가 금괴 +${info.bonusGold}개`);
    if (info.bonusGem > 0) effs.push(`추가 보석 +${info.bonusGem}개`);
    effectText = effs.join(', ');
  }

  let lines = [
    `🐾 [크리처 정보]`,
    `현재 장착 크리처 : ${currentText}`,
    `적용 효과 : ${effectText}`,
    ``,
    `📊 [크리처 뽑기 확률 및 효과 안내] (1회: 금괴 50개)`,
    `• D등급 (45%) : 돈 +3%`,
    `• C등급 (35%) : 돈 +5%`,
    `• B등급 (15%) : 돈 +7%`,
    `• A등급 (3.5%) : 돈 +10%, 추가 금괴 +1개`,
    `• S등급 (1.4%) : 돈 +20%, 추가 금괴 +1개, 추가 보석 +1개`,
    `• EX등급 (0.1%) : 돈 +30%, 추가 금괴 +1개, 추가 보석 +1개`,
    ``,
    `💡 [/크리처 뽑기] 명령어로 크리처를 뽑을 수 있습니다. (D~EX 중 가장 높은 등급 효과만 자동 유지)`
  ];

  return { text: lines.join('\n'), choices: CREATURE_CHOICES };
}

function processCreatureGacha(profile) {
  const GACHA_COST_GOLD = 50;

  if ((profile.gold || 0) < GACHA_COST_GOLD) {
    return { 
      text: `⚠️ 금괴가 부족합니다!\n(크리처 뽑기 필요 비용: 금괴 ${GACHA_COST_GOLD}개 | 보유 금괴: ${(profile.gold || 0).toLocaleString()}개)`,
      choices: CREATURE_CHOICES
    };
  }

  profile.gold -= GACHA_COST_GOLD;

  const roll = Math.random() * 100;
  let pulledCode = "D";

  if (roll < 0.1) {
    pulledCode = "EX";
  } else if (roll < 0.1 + 1.4) {
    pulledCode = "S";
  } else if (roll < 0.1 + 1.4 + 3.5) {
    pulledCode = "A";
  } else if (roll < 0.1 + 1.4 + 3.5 + 15.0) {
    pulledCode = "B";
  } else if (roll < 0.1 + 1.4 + 3.5 + 15.0 + 35.0) {
    pulledCode = "C";
  } else {
    pulledCode = "D";
  }

  const pulledInfo = CREATURE_GRADES[pulledCode];
  const pulledImageUrl = getCreatureImage(pulledCode);
  const currentCode = profile.creature;
  const currentInfo = currentCode ? CREATURE_GRADES[currentCode] : null;

  let updateMsg = "";

  if (!currentInfo || pulledInfo.rank > currentInfo.rank) {
    profile.creature = pulledCode;
    updateMsg = `🎉 [크리처 갱신!] 더 높은 등급의 크리처(${pulledInfo.name})로 교체되었습니다!`;
  } else {
    updateMsg = `🔒 현재 보유 중인 크리처(${currentInfo.name})가 동급 이상이므로 기존 크리처를 유지합니다.`;
  }

  let effs = [`돈 +${Math.round(pulledInfo.cashPct * 100)}%`];
  if (pulledInfo.bonusGold > 0) effs.push(`추가 금괴 +${pulledInfo.bonusGold}개`);
  if (pulledInfo.bonusGem > 0) effs.push(`추가 보석 +${pulledInfo.bonusGem}개`);

  let resultLines = [
    `🐾 [크리처 뽑기 결과]`,
    `획득 크리처 : ${pulledInfo.name} (${effs.join(', ')})`,
    `(소모: 금괴 ${GACHA_COST_GOLD}개)`,
    ``,
    updateMsg,
    ``,
    resourceText(profile)
  ];

  return { text: resultLines.join('\n'), imageUrl: pulledImageUrl, choices: CREATURE_CHOICES };
}

function processSupply(profile, countArg = "1") {
  let count = parseInt(countArg, 10);
  if (isNaN(count) || count < 1) count = 1;

  if (!profile.supplyItem || profile.supplyItem < 1) {
    return { text: `⚠️ 보급 재화가 부족합니다! (현재 보유 보급: ${(profile.supplyItem || 0).toLocaleString()}개)` };
  }

  const actualUse = Math.min(count, profile.supplyItem);
  profile.supplyItem -= actualUse;

  if (!Array.isArray(profile.ownedTitles)) profile.ownedTitles = [];
  if (!Array.isArray(profile.ownedAvatars)) profile.ownedAvatars = [];

  const currentMonth = getKSTParts().month;
  const currentMonthTitle = MONTHLY_TITLES[currentMonth];
  const currentSeasonTitle = SEASON_TITLES[1];
  const currentMonthAvatar = MONTHLY_AVATARS[currentMonth];

  let totalCash = 0;
  let totalGold = 0;
  let totalKeys = 0;
  let gainedTitles = [];
  let gainedAvatars = [];

  for (let i = 0; i < actualUse; i++) {
    let roll = Math.random() * 100;

    // 시즌 칭호 1%, 월별 칭호 5%, 월별 아바타 4%, 현금 50%, 금괴 25%, 열쇠 15%
    if (roll < 1) {
      const titleName = currentSeasonTitle;
      if (!profile.ownedTitles.includes(titleName)) {
        profile.ownedTitles.push(titleName);
        gainedTitles.push(`시즌 칭호: '${titleName}'`);
      } else {
        roll = 10 + Math.random() * 90;
      }
    } else if (roll < 6) {
      const titleName = currentMonthTitle;
      if (!profile.ownedTitles.includes(titleName)) {
        profile.ownedTitles.push(titleName);
        gainedTitles.push(`월별 칭호: '${titleName}'`);
      } else {
        roll = 10 + Math.random() * 90;
      }
    } else if (roll < 10) {
      if (profile.ownedAvatars.includes(currentMonthAvatar)) {
        totalCash += applyAchievementCashBonus(1000000, profile);
        gainedAvatars.push(`중복 아바타: '${currentMonthAvatar}' → 현금 1,000,000원 대체`);
      } else {
        profile.ownedAvatars.push(currentMonthAvatar);
        gainedAvatars.push(`월별 아바타: '${currentMonthAvatar}'`);
      }
    }

    if (roll >= 10) {
      if (roll < 60) {
        const combatPower = getAttackPower(profile);
        const dice = rand(1, 6);
        let gainedCash = combatPower * 100 * dice * 2;
        gainedCash = applyCreatureCashBonus(gainedCash, profile);
        totalCash += gainedCash;
      } else if (roll < 85) {
        const ampLevel = profile.combatLevel || 0;
        const dice = rand(1, 6);
        let gainedGold = Math.max(1, ampLevel) * dice * 2;
        gainedGold = applyCreatureGoldBonus(gainedGold, profile);
        totalGold += gainedGold;
      } else {
        const dice = rand(1, 6);
        totalKeys += 1 * dice * 2;
      }
    }
  }

  profile.cash += totalCash;
  profile.gold = (profile.gold || 0) + totalGold;
  profile.keys = (profile.keys || 0) + totalKeys;

  let rewardLines = [];
  if (totalCash > 0) rewardLines.push(`• 💵 현금 : +${won(totalCash)}`);
  if (totalGold > 0) rewardLines.push(`• 🧈 금괴 : +${totalGold.toLocaleString()}개`);
  if (totalKeys > 0) rewardLines.push(`• 🔑 비밀열쇠 : +${totalKeys.toLocaleString()}개`);
  if (gainedTitles.length > 0) rewardLines.push(`• 🏆 획득 칭호 : ${gainedTitles.join(', ')}`);
  if (gainedAvatars.length > 0) rewardLines.push(`• 🧑 획득 아바타 : ${gainedAvatars.join(', ')}`);

  const resultText = [
    `📦 [보급 뽑기 완료! (${actualUse}개 사용)]`,
    rewardLines.join('\n'),
    ``,
    resourceText(profile)
  ].join('\n');

  return { text: resultText, choices: END_BATTLE_CHOICES };
}

function createBattle(profile) {
  // 전투 횟수는 전투 생성 시점이 아니라 파밍이 실제 종료된 시점에 1회만 증가시킨다.
  return {
    gradeSchemaVersion: 2,
    progressVersion: 0, // 상태 백업의 최신 여부를 비교하는 내부 번호 (턴 제한 없음)
    hp: 100,
    alive: true,
    finished: false,
    result: null,
    mode: '파밍',
    currentGradeIndex: 0,
    highestGradeIndex: -1,
    helmetLevel: 0, 
    helmetDurability: 0, 
    vestLevel: 0,    
    vestDurability: 0,    
    accumulatedCash: 0,
    accumulatedGold: 0,  
    accumulatedGem: 0,
    accumulatedKeys: 0,  
    accumulatedSupplyItem: 0,
    accumulatedExp: 0,
    eliteNext: false,
    element: getSecondJobCode(profile) === 'elementalist' ? ['fire','frost','lightning','earth'][rand(0,3)] : null
  };
}

function battleStatusBoard(profile, battle, showMonster = true) {
  const b = battle || createBattle(profile);
  const lines = [];
  if (showMonster) {
    const grade = FARM_GRADE_STEPS[getFarmGradeIndex(b.currentGradeIndex)];
    lines.push('[' + grade + '] 몬스터 기본 처치 확률 : ' + formatFarmChance(getFarmSuccessChance(b.currentGradeIndex)) + '%');
  }
  lines.push('HP:' + makeHpBar(b.hp),
    '🛡️ 투구 : Lv.' + (b.helmetLevel || 0) + ' |🦺 갑옷 : Lv.' + (b.vestLevel || 0),
    '', farmResponseFooter(profile));
  return lines.join('\n');
}

function farmResponseFooter(profile) {
  const p = createProfile(profile);
  checkAndResetFarmLimit(p);
  const n = getCurrentEnhanceLevel(p), req = getRequiredExp(p.level);
  const count = p.farmData.count || 0;
  const target = FARM_QUEST_MILESTONES.find(x => x > count && x <= p.farmData.max);
  return [
    '🎯 무기 : +' + n + ' ' + getWeaponInfo(n,p.job)[0],
    '🔥 제련 : ' + (REFINE_STARS[Math.min(p.refine,REFINE_STARS.length-1)] || ''),
    '⭐ Lv.' + p.level + ' (' + (p.exp || 0).toLocaleString() + '/' + req.toLocaleString() + ')',
    '💪 공격력 : ' + getCombatPower(p),
    '🔘 배율 : x' + getGoldMultiplier(p).toFixed(2) + ' | ⏩ 배속 (x' + (p.speedMultiplier || 1) + ')',
    '⚔️ 전투 횟수 : (' + count + '/' + p.farmData.max + ')',
    target ? '📜 퀘스트 보상까지 ' + (target-count) + '회' : '📜 오늘의 파밍 퀘스트 완료'
  ].join('\n');
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
  let imprintDamageReduce = getImprintTotalBonus(profile, 'damageReduce');
  let totalReduce = helmetReduce + vestReduce + imprintDamageReduce;
  let finalDamage = Math.max(1, rawDamage - totalReduce);

  let armorNotes = [];

  if (battle.helmetLevel > 0 && battle.helmetDurability > 0) {
    battle.helmetDurability = Math.max(0, battle.helmetDurability - rand(15, 25));
    if (battle.helmetDurability === 0) {
      battle.helmetLevel = 0;
      armorNotes.push(`💥 투구 내구도가 0이 되어 파괴되었습니다!`);
    }
  }

  if (battle.vestLevel > 0 && battle.vestDurability > 0) {
    battle.vestDurability = Math.max(0, battle.vestDurability - rand(15, 25));
    if (battle.vestDurability === 0) {
      battle.vestLevel = 0;
      armorNotes.push(`💥 갑옷 내구도가 0이 되어 파괴되었습니다!`);
    }
  }

  return { finalDamage, totalReduce, armorNotes };
}

function getFarmBoxKey(grade) {
  if(grade==='EX+등급')return 'EX+';
  const base=String(grade||'').replace(/\+?등급$/, '');
  return ['E','D','C','B','A','S','EX'].includes(base) ? base : 'E';
}

function addBoxToInventory(profile, boxKey) {
  const boxData = FARM_BOX_INFO[boxKey];
  if (!boxData) return null;
  if (!Array.isArray(profile.inventory)) profile.inventory = [];
  profile.inventory.push({
    category: 'box',
    boxSource: 'farm',
    name: boxData.name,
    desc: `${boxData.name}입니다. (/상자 [상자번호] [수량] 명령어로 사용)`
  });
  return boxData.name;
}

function getHuntBoxKey(grade) {
  if(grade==='EX+등급')return 'EX+';
  const base=String(grade||'').replace(/\+?등급$/, '');
  return ['E','D','C','B','A','S','EX'].includes(base) ? base : 'E';
}

function getMonsterImage(image,grade) {
  if(typeof image!=='string')return null;
  return String(grade).includes('+') ? image.replace(/(\.(?:png|jpg|jpeg|webp))(?=[?#]|$)/i,'+$1') : image;
}
function createFarmMonster(grade) {
  const baseGrade = grade.replace(/[+등급]/g, '');
  const candidates = getMonstersByGrade(`${baseGrade}등급`);
  const baseMonster = candidates.length > 0 ? candidates[rand(0, candidates.length - 1)] : monsters[0];
  const prefixList = grade.includes('+') ? (prefixes[grade] || []) : [];
  const prefix = prefixList.length > 0 ? prefixList[rand(0, prefixList.length - 1)] : '';
  // 파밍 보상은 getFarmCashReward에서 상자 현금 범위로만 계산합니다.
  const rewardMoney = 0;
  const rewardGem = 0;
  return {
    ...(baseMonster || {}),
    image: getMonsterImage(baseMonster && baseMonster.image,grade),
    grade,
    fullName: prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name,
    rewardMoney,
    rewardGem
  };
}


// E부터 EX+까지 사용자 지정 처치 확률.
const FARM_SUCCESS_CAPS = [80,75,70,65,50,45,30,25,10,5,1,0.5,0.1,0.01];
function getFarmGradeIndex(index) {
  return Math.max(0, Math.min(Math.floor(Number(index) || 0), FARM_GRADE_STEPS.length - 1));
}
function getFarmSuccessChance(gradeIndex) {
  const i = getFarmGradeIndex(gradeIndex);
  // 등급별 고정 확률. 추후 확률 옵션은 이 지점에서 별도로 적용한다.
  return FARM_SUCCESS_CAPS[i];
}
function formatFarmChance(chance) {
  return chance.toFixed(2);
}


// 랜덤 파밍 이벤트 전체 발생률은 항상 1%.
// 이벤트를 추가/삭제해도 1% 관문을 먼저 통과한 뒤 등록된 이벤트 중 하나를 균등 추첨하므로
// 각 이벤트의 개별 확률만 자동 재분배되고 총 발생률은 변하지 않는다.
const FARM_RANDOM_EVENT_TOTAL_RATE = 0.01;
const FARM_RANDOM_EVENTS = [
  { id:'treasure_goblin', name:'보물 고블린' },
  { id:'healing_spring', name:'회복의 샘' },
  { id:'sealed_door', name:'봉인된 문' },
  { id:'wandering_merchant', name:'떠돌이 상인' },
  { id:'elite_invasion', name:'정예 몬스터 난입' }
];

function rollFarmRandomEvent(random = Math.random) {
  if (!Array.isArray(FARM_RANDOM_EVENTS) || FARM_RANDOM_EVENTS.length === 0) return null;
  if (random() >= FARM_RANDOM_EVENT_TOTAL_RATE) return null;
  const index = Math.min(FARM_RANDOM_EVENTS.length - 1, Math.floor(random() * FARM_RANDOM_EVENTS.length));
  return FARM_RANDOM_EVENTS[index];
}

// 해당 등급 파밍 상자의 현금 범위만 사용한다. 별도 금괴/보석 이벤트는 유지한다.
function getFarmCashReward(profile, battle, elementEffectMult = 1) {
  const grade = FARM_GRADE_STEPS[getFarmGradeIndex(battle ? battle.currentGradeIndex : 0)];
  const box = FARM_BOX_INFO[getFarmBoxKey(grade)];
  const cash = rand(Math.floor(box.minCash/10),Math.floor(box.maxCash/10));
  let elementalCash = 1;
  if (getSecondJobCode(profile) === 'elementalist' && battle && battle.element === 'earth') elementalCash += 0.10 * Math.max(1, Number(elementEffectMult) || 1);
  return applyAchievementCashBonus(Math.floor(cash * getGoldMultiplier(profile) * (1+getAvatarCashBonus(profile)+getEquipmentSetBonuses(profile).cashPct) * elementalCash) * (profile.speedMultiplier || 1), profile);
}

function resolveFarmRandomEvent(profile, battle, event) {
  if (!event || !battle) return null;
  const speed = Math.max(1, Math.floor(Number(profile && profile.speedMultiplier) || 1));
  switch (event.id) {
    case 'treasure_goblin': {
      const cash = getFarmCashReward(profile, battle) * 5;
      battle.accumulatedCash = (battle.accumulatedCash || 0) + cash;
      return { text:`💰 [랜덤 이벤트] 보물 고블린 등장!\n도망치기 전에 보물을 빼앗았습니다.\n💵 현금 +${won(cash)}`, imageUrl:null };
    }
    case 'healing_spring': {
      const before = Math.max(0, Number(battle.hp) || 0);
      battle.hp = Math.min(100, before + 30);
      const healed = battle.hp - before;
      return { text:`⛲ [랜덤 이벤트] 회복의 샘 발견!\nHP +${healed} (${before} → ${battle.hp})`, imageUrl:null };
    }
    case 'sealed_door': {
      const keys = speed;
      battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keys;
      return { text:`🚪 [랜덤 이벤트] 봉인된 문 발견!\n문틈에서 비밀열쇠를 발견했습니다.\n🔑 비밀열쇠 +${keys.toLocaleString()}개`, imageUrl:null };
    }
    case 'wandering_merchant': {
      const supply = speed;
      battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + supply;
      return { text:`🧙 [랜덤 이벤트] 떠돌이 상인 등장!\n모험을 응원하며 보급품을 건넸습니다.\n📦 보급 +${supply.toLocaleString()}개`, imageUrl:null };
    }
    case 'elite_invasion': {
      battle.eliteNext = true;
      return { text:`⚠️ [랜덤 이벤트] 정예 몬스터 난입!\n다음 실제 몬스터는 처치 확률 x0.8, 처치 현금 x2가 적용됩니다.`, imageUrl:null };
    }
    default:
      return null;
  }
}

function rollShadowLoot(profile, cash, gem, random = Math.random) {
  if (!profile || profile.job !== 'shadow' || random() >= getJobPassiveRate(profile)) return {cash:0,gem:0,text:''};
  const bonusCash = Number.isSafeInteger(cash) && cash > 0 ? cash : 0;
  const bonusGem = Number.isSafeInteger(gem) && gem > 0 ? gem : 0;
  const parts = [];
  if (bonusCash) parts.push('현금 +'+won(bonusCash));
  if (bonusGem) parts.push('보석 +'+bonusGem.toLocaleString()+'개');
  return {cash:bonusCash,gem:bonusGem,text:parts.length ? '🗡️ [섀도우 약탈] '+parts.join(' / ') : ''};
}
function resolveProgressionFarmTurn(profile, battle) {
  const speed = profile.speedMultiplier || 1;
  const skillState = ensureSkillState(profile);
  const buffs = skillState.buffs;
  const baseJob = getBaseJobCode(profile);
  const secondJob = getSecondJobCode(profile);
  const elementBurstActive = secondJob === 'elementalist' && (buffs.elementalistBurst || 0) > 0;
  const elementEffectMult = elementBurstActive ? getActiveSkillParams(profile, 'elementalist').elementMult : 1;

  // 랜덤 파밍 이벤트는 전체 1% 고정. 이벤트 수가 늘어나면 1% 안에서 자동 균등 분배된다.
  const randomFarmEvent = rollFarmRandomEvent();
  if (randomFarmEvent) {
    const eventResult = resolveFarmRandomEvent(profile, battle, randomFarmEvent);
    if (eventResult) return eventResult;
  }

  // 도적 1차 패시브는 기존 희귀 재화 이벤트의 상대 가중치를 소폭 높인다.
  const thiefEventMult = baseJob === 'thief' ? 1 + getJobSkillLevelFor(profile, 'thief') * 0.01 : 1;
  const eventRoll = Math.random() * 100;
  if (eventRoll < 0.01 * thiefEventMult) {
    battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + speed;
    return { text: `📦 [재화] 보급 +${speed}개`, imageUrl: `${BASE_URL}/SUPPLY_FARM.png` };
  }
  if (eventRoll < 1.01 * thiefEventMult) {
    const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
    const gold = applyCreatureGoldBonus(Math.max(1, rand(ampInfo.minGold, ampInfo.maxGold)), profile) * speed;
    battle.accumulatedGold = (battle.accumulatedGold || 0) + gold;
    return { text: `🧈 [재화] 금괴 +${gold.toLocaleString()}개`, imageUrl: `${BASE_URL}/GOLD_FARM.png` };
  }
  if (eventRoll < 3.01 * thiefEventMult) {
    const keys = Math.max(1, speed);
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keys;
    return { text: `🔑 [재화] 비밀열쇠 +${keys}개`, imageUrl: `${BASE_URL}/KEY_FARM.png` };
  }
  if (eventRoll < 10 * thiefEventMult) {
    const cash = getFarmCashReward(profile, battle) * 10;
    battle.accumulatedCash += cash;
    return { text: `🎰 [재화] 잭팟 현금 +${won(cash)}`, imageUrl: null };
  }

  const gradeIndex = getFarmGradeIndex(battle.currentGradeIndex);
  const grade = FARM_GRADE_STEPS[gradeIndex];
  if (!battle.farmMonster || battle.farmMonster.grade !== grade) battle.farmMonster = createFarmMonster(grade);
  const monster = battle.farmMonster;
  const originalMonster = monsters.find(m => m.name === monster.name);
  if (originalMonster) monster.image = getMonsterImage(originalMonster.image, grade);

  const stats = getEnhanceStats(getCurrentEnhanceLevel(profile), profile.combatLevel || 0, profile);
  const activationMessages = [];
  let critChance = Math.max(0, Math.min(100, stats.numCrit));
  if (buffs.archerFocus > 0) { const ap=getActiveSkillParams(profile,'archer'); critChance = Math.min(100, critChance + ap.critBonus); buffs.archerFocus--; activationMessages.push('🏹 [집중 사격 발동]\n치명타 확률 +'+formatSkillNumber(ap.critBonus,1)+'%p 적용'); }
  if (buffs.assassinExecute > 0) { const ap=getActiveSkillParams(profile,'assassin'); critChance = Math.max(critChance, ap.critChance); buffs.assassinExecute--; battle.hp = Math.max(1, battle.hp - ap.hpCost); activationMessages.push('🔪 [절명 발동]\nHP -'+ap.hpCost+' | 치명타 확률 최소 '+formatSkillNumber(ap.critChance,1)+'% 적용'); }
  if (secondJob === 'elementalist' && battle.element === 'lightning') critChance = Math.min(100, critChance + 10 * elementEffectMult);
  const critical = Math.random() * 100 < critChance;

  let damage = getCombatPower(profile);
  let berserkerHpBonus = 0;
  if (secondJob === 'berserker') {
    const hp = Math.max(0, Number(battle.hp) || 0);
    berserkerHpBonus = hp <= 25 ? 0.20 : hp <= 50 ? 0.10 : hp <= 75 ? 0.05 : 0;
    damage = Math.floor(damage * (1 + berserkerHpBonus));
  }
  if (secondJob === 'elementalist' && battle.element === 'fire') damage = Math.floor(damage * (1 + 0.10 * elementEffectMult));

  const normalSuccessChance = getFarmSuccessChance(gradeIndex);
  const eliteActive = battle.eliteNext === true;
  let successChance = normalSuccessChance * (critical ? getCriticalMultiplier(profile, stats) : 1);
  if (eliteActive) {
    successChance *= 0.8;
    activationMessages.push('⚠️ [정예 몬스터]\n처치 확률 x0.8 | 처치 성공 시 현금 x2');
  }
  if (berserkerHpBonus > 0) successChance *= (1 + berserkerHpBonus);
  if (secondJob === 'elementalist' && battle.element === 'fire') successChance *= (1 + 0.10 * elementEffectMult);
  if (baseJob === 'wizard' && buffs.wizardSurge > 0) { const ap=getActiveSkillParams(profile,'wizard'); successChance *= ap.chanceMult; buffs.wizardSurge--; activationMessages.push('🔮 [마력 폭주 발동]\n처치 확률 x'+formatSkillNumber(ap.chanceMult,3)+' 적용 · 남은 강화 '+buffs.wizardSurge+'회'); }
  if (buffs.warriorSlash > 0) { const ap=getActiveSkillParams(profile,'warrior'); successChance *= ap.chanceMult; buffs.warriorSlash--; activationMessages.push('🔥 [전력 베기 발동]\n처치 확률 x'+formatSkillNumber(ap.chanceMult)+' 적용'); if ((buffs.warriorMasterRefund||0)>0) { buffs.warriorMasterRefund--; activationMessages.push('👑 [마스터 효과 발동]\n이번 전력 베기는 일일 사용 횟수를 소모하지 않습니다.'); } }
  if (secondJob === 'berserker' && buffs.berserkerRage > 0) { const ap=getActiveSkillParams(profile,'berserker'); const noHpCost=isJobSkillMaster(profile,'berserker') && Math.random()<0.20; if (!noHpCost) battle.hp = Math.max(1, battle.hp - ap.hpCost); successChance *= ap.chanceMult; buffs.berserkerRage--; activationMessages.push('🩸 [피의 폭주 발동]\n'+(noHpCost?'HP 소모 없음':'HP -'+ap.hpCost)+' | 처치 확률 x'+formatSkillNumber(ap.chanceMult)+' 적용'); if(noHpCost) activationMessages.push('👑 [마스터 효과 발동]\n광전사의 피가 HP 소모를 무효화했습니다.'); }
  if (secondJob === 'sniper' && critical) successChance *= 1.2;
  if (secondJob === 'sniper' && buffs.sniperShot > 0) {
    const ap=getActiveSkillParams(profile,'sniper');
    const minByGrade = grade === 'EX+등급' ? ap.exPlusMin : grade === 'EX등급' ? ap.exMin : ap.normalMin;
    successChance = Math.max(successChance, minByGrade); buffs.sniperShot--; activationMessages.push('🎯 [필살 저격 발동]\n최소 처치 확률 '+formatSkillNumber(minByGrade,1)+'% 보정 적용');
    if ((buffs.sniperMasterRefund||0)>0) { buffs.sniperMasterRefund--; activationMessages.push('👑 [마스터 효과 발동]\n이번 필살 저격은 일일 사용 횟수를 소모하지 않습니다.'); }
  }
  if (secondJob === 'archmage' && buffs.archmageMeteor > 0) { const ap=getActiveSkillParams(profile,'archmage'); successChance *= ap.chanceMult; buffs.archmageMeteor--; activationMessages.push('☄️ [메테오 발동]\n처치 확률 x'+formatSkillNumber(ap.chanceMult)+' 적용'); }
  if (secondJob === 'necromancer' && buffs.necroArmy > 0) { const ap=getActiveSkillParams(profile,'necromancer'); successChance *= ap.chanceMult; buffs.necroArmy--; activationMessages.push('☠️ [망자의 군세 발동]\n처치 확률 x'+formatSkillNumber(ap.chanceMult)+' 적용'); }
  if (elementBurstActive) { buffs.elementalistBurst--; activationMessages.push('🌈 [원소 폭발 발동]\n현재 원소 효과 x'+formatSkillNumber(elementEffectMult)+' 강화'); }
  successChance = Math.min(100, successChance);

  function rollKill() { return Math.random() * 100 < successChance; }
  let killed = rollKill();
  let specialLabel = '';

  // 레인저/듀얼블레이드 액티브: 3연속 공격 판정, 보상은 1회만 지급.
  if (!killed && ((secondJob === 'ranger' && buffs.rangerRain > 0) || (secondJob === 'dualblade' && buffs.dualRush > 0))) {
    const activeJob = secondJob === 'ranger' ? 'ranger' : 'dualblade';
    const attacks = getActiveSkillParams(profile, activeJob).attacks;
    if (activeJob === 'ranger') { buffs.rangerRain--; activationMessages.push('🌧️ [화살비 발동]\n총 '+attacks+'회 공격 판정'); } else { buffs.dualRush--; activationMessages.push('⚔️ [팬텀 러시 발동]\n총 '+attacks+'회 공격 판정'); }
    for (let i=1; i<attacks && !killed; i++) killed = rollKill();
    if (killed) specialLabel = activeJob === 'ranger' ? '화살비' : '팬텀 러시';
  }
  // 패시브 재공격: 실패해도 추가 판정 자체로 HP 피해는 발생하지 않는다.
  if (!killed && secondJob === 'ranger' && Math.random() < getJobSkillLevelFor(profile,'ranger') / 100) {
    killed = rollKill(); if (killed) { specialLabel = '연속 사격'; activationMessages.push('🏹 [연속 사격 발동]\n추가 공격으로 처치 성공'); }
  }
  if (!killed && secondJob === 'dualblade' && Math.random() < getJobSkillLevelFor(profile,'dualblade') / 100) {
    killed = rollKill(); if (killed) { specialLabel = '쌍검 연격'; activationMessages.push('⚔️ [쌍검 연격 발동]\n추가 공격으로 처치 성공'); }
  }

  // 어쌔신 급소 공격: 고등급일수록 즉사 확률을 강하게 제한한다.
  if (!killed && critical && secondJob === 'assassin') {
    const baseRate = getJobSkillLevelFor(profile,'assassin') * 0.02;
    const gradeFactor = grade.startsWith('EX+') ? 0.1 : grade.startsWith('EX') ? 0.2 : grade.startsWith('S') ? 0.5 : 1;
    if (Math.random() < baseRate * gradeFactor) { killed = true; specialLabel = '급소 공격'; activationMessages.push('🗡️ [급소 공격 발동]\n즉사 판정 성공'); }
  }

  let counter = '';
  if (!killed) {
    const rollCounter = () => {
      const roll = Math.random() * 100;
      const issenBonus = secondJob === 'swordmaster' && (buffs.swordmasterIssen || 0) > 0 ? getActiveSkillParams(profile,'swordmaster').counterBonus + (isJobSkillMaster(profile,'swordmaster') ? 5 : 0) : 0;
      const fullRate = Math.max(0, Math.min(100, stats.numFullCounter + issenBonus * 0.25));
      const counterRate = Math.max(0, Math.min(100 - fullRate, stats.numCounter + issenBonus * 0.75));
      if (roll < fullRate) return '풀카운터';
      if (roll < fullRate + counterRate) return '카운터';
      return '';
    };
    counter = rollCounter();
    if (!counter && secondJob === 'swordmaster' && buffs.swordmasterIssen > 0) { buffs.swordmasterIssen--; const ib=getActiveSkillParams(profile,'swordmaster').counterBonus+(isJobSkillMaster(profile,'swordmaster')?5:0); activationMessages.push('⚡ [일섬 발동]\n카운터 판정 1회 추가 · 추가 판정 +'+ib+'%p'+(isJobSkillMaster(profile,'swordmaster')?' 👑':'')); counter = rollCounter(); }
    if (counter === '풀카운터') {
      // 풀카운터도 EX/EX+ 희소성을 완전히 우회하지 못하도록 등급별 상한을 둔다.
      const fullChance = grade === 'EX+등급' ? 5 : grade === 'EX등급' ? 10 : grade === 'S+등급' ? 25 : grade === 'S등급' ? 50 : grade.startsWith('A') ? 75 : 100;
      killed = Math.random() * 100 < fullChance;
    } else if (counter === '카운터') {
      killed = Math.random() < 0.5;
    }
  }

  let cash = getFarmCashReward(profile, battle, elementEffectMult);
  let thiefAmbushMasterTriggered = false;
  if (killed && (buffs.thiefAmbush > 0 || (secondJob === 'shadow' && buffs.shadowPlunder > 0))) {
    let cashMult = 1;
    if (buffs.thiefAmbush > 0) { const ap=getActiveSkillParams(profile,'thief'); cashMult *= ap.cashMult; buffs.thiefAmbush--; activationMessages.push('🌑 [그림자 습격 발동]\n처치 현금 보상 x'+formatSkillNumber(ap.cashMult)+' 적용'); if(isJobSkillMaster(profile,'thief') && Math.random()<0.10) thiefAmbushMasterTriggered=true; }
    if (buffs.shadowPlunder > 0) { const ap=getActiveSkillParams(profile,'shadow'); cashMult *= ap.cashMult; buffs.shadowPlunder--; activationMessages.push('🗡️ [그림자 약탈 발동]\n처치 현금 보상 x'+formatSkillNumber(ap.cashMult)+' 적용'); }
    cash = Math.floor(cash * cashMult);
  }
  if (killed && eliteActive) cash = Math.floor(cash * 2);
  // 정예 효과는 다음 실제 몬스터 1회에만 적용된다. 재화/랜덤 이벤트 턴에서는 소모되지 않는다.
  if (eliteActive) battle.eliteNext = false;

  const chanceChanged = Math.abs(successChance - normalSuccessChance) > 1e-9;
  const chanceText = chanceChanged
    ? formatFarmChance(normalSuccessChance) + '% → ' + formatFarmChance(successChance) + '%'
    : formatFarmChance(successChance) + '%';
  const lines = ['[' + grade + '] ' + monster.fullName,
    '처치 확률 : ' + chanceText];
  if (activationMessages.length) lines.push('', ...activationMessages);
  const attackLabel = specialLabel ? '['+specialLabel+']' : counter ? '[' + counter + ']' : (critical ? '[치명타]' : '[공격]');
  const encounter = { grade, fullName: monster.fullName, gradeIndex };
  if (killed) {
    battle.highestGradeIndex = Math.max(Number.isInteger(battle.highestGradeIndex) ? battle.highestGradeIndex : -1, gradeIndex);
    battle.currentGradeIndex = Math.min(gradeIndex + 1, FARM_GRADE_STEPS.length - 1);
    battle.farmMonster = null;
    battle.accumulatedCash = (battle.accumulatedCash || 0) + cash;
    lines.push(attackLabel + ' ' + damage);
    if (cash > 0) lines.push('', '💵 현금 +' + won(cash));
    if (thiefAmbushMasterTriggered) { battle.accumulatedKeys=(battle.accumulatedKeys||0)+1; lines.push('👑 [마스터 효과 발동] 그림자 습격으로 비밀열쇠 +1개'); }
    const stolen = rollShadowLoot(profile, cash, 0);
    battle.accumulatedCash += stolen.cash;
    if (stolen.text) lines.push('🗡️ [약탈 발동] '+stolen.text.replace(/^🗡️ \[섀도우 약탈\]\s*/,''));
    if (secondJob === 'necromancer' && Math.random() < (0.10 + getJobSkillLevelFor(profile,'necromancer')/100)) {
      skillState.souls = (skillState.souls || 0) + 1;
      lines.push('☠️ [영혼 수확] 영혼 +1 (보유 '+skillState.souls+'개)');
    }
    return { text: lines.join('\n'), imageUrl: monster.image || null, encounter };
  }

  battle.accumulatedCash = (battle.accumulatedCash || 0) + cash;
  let rawIncoming = rand(20,30);
  if (secondJob === 'elementalist' && battle.element === 'frost') rawIncoming = Math.max(1, Math.floor(rawIncoming * Math.max(0, 1 - 0.10 * elementEffectMult)));
  const hit = counter ? { finalDamage: 0, armorNotes: [] } : calculateCombatDamage(profile, battle, rawIncoming);
  const hpLoss = Math.min(battle.hp, hit.finalDamage);
  battle.hp = Math.max(0, battle.hp - hpLoss);
  checkDeath(battle);
  lines.push(attackLabel + ' MISS | HP -' + hpLoss, ...hit.armorNotes);
  if (cash > 0) lines.push('', '💵 현금 +' + won(cash));
  return { text: lines.join('\n'), imageUrl: monster.image || null, missed: true, encounter };
}

function claimFarmMilestones(profile) {
  const messages = [], dice = rand(1,6);
  const rewards = [[100,5000,0],[250,10000,0],[500,15000,1],[1000,20000,2],[1500,25000,3],[2000,25000,3]];
  for (const [count,cash,gold] of rewards) {
    if (profile.farmData.count < count || (profile.farmData.lastClaimedFarmQuest || 0) >= count) continue;
    const qCash = applyCreatureCashBonus(cash*dice,profile);
    const qGold = gold ? applyCreatureGoldBonus(gold*dice,profile) : 0;
    profile.cash += qCash; profile.gold = (profile.gold || 0)+qGold;
    profile.farmData.lastClaimedFarmQuest = count;
    messages.push('퀘스트 달성 보상 ('+count+'회) :\n현금 +'+won(qCash)+(qGold ? ' 및 금괴 +'+qGold+'개' : ''));
  }
  messages.push(...claimDailyPassMissions(profile));
  return messages;
}

function processEnhance(profile) {
  const isJob = Boolean(profile.job);
  const currentEnhanceKey = isJob ? 'jobEnhance' : 'enhance';
  const historyKey = isJob ? 'maxJobEnhanceHistory' : 'maxEnhanceHistory';
  
  if (profile[currentEnhanceKey] === undefined || profile[currentEnhanceKey] < 0) {
    profile[currentEnhanceKey] = 0;
  }
  if (profile[historyKey] === undefined) {
    profile[historyKey] = profile[currentEnhanceKey];
  }

  const currentLevel = profile[currentEnhanceKey];
  const [wName] = getWeaponInfo(currentLevel, profile.job);

  const activeTable = getActiveEnhanceTable(profile);

  if (currentLevel >= activeTable.length) {
    const stats = getEnhanceStats(currentLevel, profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(stats, stats);

    const maxTitle = `최고 강화 단계 도달! (+20 ${wName})`;
    const subWeaponLine = `🎯 무기 : +20 ${wName}`;

    const maxText = [
      maxTitle,
      subWeaponLine,
      `📖 ${getWeaponInfo(20, profile.job)[1]}`,
      detailMsg,
      ``,
      enhanceResourceText(profile)
    ].join('\n');

    return { text: maxText, imageUrl: getEnhanceImage('success', 20, profile.job), status: 'max' };
  }

  const tableData = activeTable[currentLevel];
  let cost = tableData.cost;
  let gemCost = isJob ? (tableData.gemCost || 0) : 0;
  
  const costDownPct = getImprintTotalBonus(profile, 'enhanceCostDown');
  cost = Math.floor(cost * (1 - costDownPct / 100));

  if (profile.cash < cost) {
    return { text: `현금이 부족합니다! (필요: ${won(cost)})`, imageUrl: null, status: 'nomoney' };
  }
  if (gemCost > 0 && (profile.gem || 0) < gemCost) {
    return { text: `보석이 부족합니다! (필요 보석: ${gemCost}개)`, imageUrl: null, status: 'nogem' };
  }

  profile.cash -= cost;
  if (gemCost > 0) {
    profile.gem -= gemCost;
  }

  if (isJob) {
    profile.totalJobEnhanceCost = (profile.totalJobEnhanceCost || 0) + cost;
  } else {
    profile.totalEnhanceCost = (profile.totalEnhanceCost || 0) + cost;
  }

  const initialEnhance = currentLevel;
  const oldStats = getEnhanceStats(initialEnhance, profile.combatLevel || 0, profile);

  const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
  const imprintSuccessBonus = getImprintTotalBonus(profile, 'enhanceSuccess');
  
  const successRate = Math.min(1.0, tableData.success + ((ampInfo.successBonus + imprintSuccessBonus) / 100));
  const keepRate = Math.max(0, tableData.keep - ((ampInfo.successBonus + imprintSuccessBonus) / 100));
  const dropRate = isJob ? (tableData.drop || 0) : 0;

  const roll = Math.random(); 
  let resultMsg = '';
  let resultStatus = '';

  if (roll < successRate) {
    profile[currentEnhanceKey] += 1;
    resultStatus = 'success';
    
    if (profile[currentEnhanceKey] > profile[historyKey]) {
      profile[historyKey] = profile[currentEnhanceKey];
    }

    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [newWName] = getWeaponInfo(profile[currentEnhanceKey], profile.job);

    resultMsg = `[강화성공] +${initialEnhance} ➔ +${profile[currentEnhanceKey]}\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +${profile[currentEnhanceKey]} ${newWName}` +
                `\n📖 ${getWeaponInfo(profile[currentEnhanceKey], profile.job)[1]}\n\n${detailMsg}`;
  } else if (roll < successRate + keepRate) {
    resultStatus = 'keep';
    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [currWName] = getWeaponInfo(profile[currentEnhanceKey], profile.job);

    resultMsg = `[강화 유지] +${initialEnhance} (변동 없음)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +${profile[currentEnhanceKey]} ${currWName}` +
                `\n📖 ${getWeaponInfo(profile[currentEnhanceKey], profile.job)[1]}\n\n${detailMsg}`;
  } else if (isJob && roll < successRate + keepRate + dropRate) {
    resultStatus = 'drop';
    profile[currentEnhanceKey] = Math.max(0, profile[currentEnhanceKey] - 1);
    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [dropWName] = getWeaponInfo(profile[currentEnhanceKey], profile.job);

    resultMsg = `[강화 하락] +${initialEnhance} ➔ +${profile[currentEnhanceKey]} (단계 하락)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +${profile[currentEnhanceKey]} ${dropWName}` +
                `\n📖 ${getWeaponInfo(profile[currentEnhanceKey], profile.job)[1]}\n\n${detailMsg}`;
  } else {
    resultStatus = 'destroy';
    profile[currentEnhanceKey] = 0;
    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [zeroWName] = getWeaponInfo(0, profile.job);

    resultMsg = `[무기 파괴] +${initialEnhance} ➔ +0 (파괴)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +0 ${zeroWName}` +
                `\n📖 ${getWeaponInfo(profile[currentEnhanceKey], profile.job)[1]}\n\n${detailMsg}`;
  }

  const finalResultText = [
    resultMsg,
    ``,
    enhanceResourceText(profile)
  ].join('\n');

  return { 
    text: finalResultText, 
    imageUrl: getEnhanceImage(resultStatus, profile[currentEnhanceKey], profile.job), 
    status: resultStatus 
  };
}

function calculateExpectedCost(targetLevel, isJob, profile) {
  const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
  const imprintSuccessBonus = getImprintTotalBonus(profile, 'enhanceSuccess');
  const costDownPct = getImprintTotalBonus(profile, 'enhanceCostDown');
  const activeTable = getActiveEnhanceTable(profile);

  let totalExpectedCost = 0;

  for (let lvl = 0; lvl < targetLevel; lvl++) {
    if (lvl >= activeTable.length) break;
    const tableData = activeTable[lvl];
    let cost = tableData.cost;
    cost = Math.floor(cost * (1 - costDownPct / 100));

    const rawSuccessRate = tableData.success + ((ampInfo.successBonus + imprintSuccessBonus) / 100);
    const successRate = Math.max(0.01, Math.min(1.0, isNaN(rawSuccessRate) ? 0.01 : rawSuccessRate));
    
    const keepRate = Math.max(0, tableData.keep - ((ampInfo.successBonus + imprintSuccessBonus) / 100));
    const destroyRate = tableData.destroy || 0;
    const dropRate = tableData.drop || 0;
    const failRateVal = Math.max(0, 1.0 - successRate - keepRate);

    let avgAttempts = 1.0;
    if (successRate > 0) {
      avgAttempts = Math.min(1000, 1 / successRate);
    } else {
      avgAttempts = 1000;
    }
    
    if (!isNaN(avgAttempts) && isFinite(avgAttempts)) {
      totalExpectedCost += cost * Math.max(1, avgAttempts);
    } else {
      totalExpectedCost += cost * 100;
    }
  }

  return Math.floor(totalExpectedCost * 2.5);
}

function processGuaranteedEnhance(profile, targetLevel) {
  const isJob = Boolean(profile.job);
  if (isJob) {
    return { text: `⚠️ 전직 이후의 무기는 확정 강화를 사용할 수 없습니다. (일반 무기 +0~+20까지만 가능)` };
  }

  const currentEnhanceKey = 'enhance';
  const historyKey = 'maxEnhanceHistory';

  if (profile[historyKey] === undefined) {
    profile[historyKey] = profile[currentEnhanceKey] || 0;
  }

  if (isNaN(targetLevel) || targetLevel < 1 || targetLevel > 20) {
    return { text: `⚠️ 올바른 확정 강화 목표 수치를 입력해 주세요. (예: /강화 10, 범위: 1~20)` };
  }

  let requiredHistory = targetLevel + 1;
  if (targetLevel === 19) {
    requiredHistory = 19;
  }

  if (profile[historyKey] < requiredHistory) {
    return { 
      text: `⚠️ 확정 강화 해금 조건 미달성!\n• +${targetLevel} 확정 강화를 해금하려면 최고 기록이 **+${requiredHistory} 이상**이어야 합니다.\n• (현재 나의 최고 기록: +${profile[historyKey]})` 
    };
  }

  const currentLevel = profile[currentEnhanceKey] || 0;
  if (currentLevel >= targetLevel) {
    return { text: `⚠️ 이미 무기 강화 수치가 +${currentLevel}이므로 해당 수치 이상으로 확정 강화할 수 없습니다.` };
  }

  const cost = calculateExpectedCost(targetLevel, false, profile);

  if (profile.cash < cost) {
    return { text: `⚠️ 현금이 부족합니다!\n(+${targetLevel} 확정 강화 필요 비용(기댓값 x2.5): ${won(cost)})\n(보유 현금: ${won(profile.cash)})` };
  }

  profile.cash -= cost;
  profile.totalEnhanceCost = (profile.totalEnhanceCost || 0) + cost;

  const initialEnhance = currentLevel;
  const oldStats = getEnhanceStats(initialEnhance, profile.combatLevel || 0, profile);

  profile[currentEnhanceKey] = targetLevel;
  if (profile[currentEnhanceKey] > profile[historyKey]) {
    profile[historyKey] = profile[currentEnhanceKey];
  }

  const newStats = getEnhanceStats(targetLevel, profile.combatLevel || 0, profile);
  const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
  const [newWName] = getWeaponInfo(targetLevel, profile.job);

  const resultMsg = [
    `✨ [확정 강화 성공!] +${initialEnhance} ➔ +${targetLevel}`,
    `(소모 비용 (기댓값 x2.5): ${won(cost)})`,
    `🎯 무기 : +${targetLevel} ${newWName}`,
    detailMsg,
    ``,
    enhanceResourceText(profile)
  ].join('\n');

  return {
    text: resultMsg,
    imageUrl: getEnhanceImage('success', targetLevel, profile.job),
    status: 'success'
  };
}

function processMultiEnhance(profile, count) {
  const isJob = Boolean(profile.job);
  const currentEnhanceKey = isJob ? 'jobEnhance' : 'enhance';
  const historyKey = isJob ? 'maxJobEnhanceHistory' : 'maxEnhanceHistory';

  if (profile[currentEnhanceKey] === undefined || profile[currentEnhanceKey] < 0) {
    profile[currentEnhanceKey] = 0;
  }
  if (profile[historyKey] === undefined) {
    profile[historyKey] = profile[currentEnhanceKey];
  }

  const targetCount = Math.max(1, count);
  const initialLevel = profile[currentEnhanceKey];
  const initialStats = getEnhanceStats(initialLevel, profile.combatLevel || 0, profile);

  let totalCost = 0;
  let totalGemCost = 0;
  let successCount = 0;
  let keepCount = 0;
  let dropCount = 0;
  let destroyCount = 0;
  let attempted = 0;
  let lastStatus = 'success';

  const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
  const imprintSuccessBonus = getImprintTotalBonus(profile, 'enhanceSuccess');
  const costDownPct = getImprintTotalBonus(profile, 'enhanceCostDown');
  const activeTable = getActiveEnhanceTable(profile);

  for (let i = 0; i < targetCount; i++) {
    if (profile[currentEnhanceKey] >= activeTable.length) break; 

    const tableData = activeTable[profile[currentEnhanceKey]];
    let cost = tableData.cost;
    let gemCost = isJob ? (tableData.gemCost || 0) : 0;
    cost = Math.floor(cost * (1 - costDownPct / 100));

    if (profile.cash < cost) break; 
    if (gemCost > 0 && (profile.gem || 0) < gemCost) break;

    profile.cash -= cost;
    if (gemCost > 0) {
      profile.gem -= gemCost;
      totalGemCost += gemCost;
    }
    totalCost += cost;
    attempted++;

    const successRate = Math.min(1.0, tableData.success + ((ampInfo.successBonus + imprintSuccessBonus) / 100));
    const keepRate = Math.max(0, tableData.keep - ((ampInfo.successBonus + imprintSuccessBonus) / 100));
    const dropRate = isJob ? (tableData.drop || 0) : 0;

    const roll = Math.random();
    if (roll < successRate) {
      profile[currentEnhanceKey] += 1;
      successCount++;
      lastStatus = 'success';
      if (profile[currentEnhanceKey] > profile[historyKey]) {
        profile[historyKey] = profile[currentEnhanceKey];
      }
    } else if (roll < successRate + keepRate) {
      keepCount++;
      lastStatus = 'keep';
    } else if (isJob && roll < successRate + keepRate + dropRate) {
      profile[currentEnhanceKey] = Math.max(0, profile[currentEnhanceKey] - 1);
      dropCount++;
      lastStatus = 'drop';
    } else {
      profile[currentEnhanceKey] = 0;
      destroyCount++;
      lastStatus = 'destroy';
    }
  }

  if (isJob) {
    profile.totalJobEnhanceCost = (profile.totalJobEnhanceCost || 0) + totalCost;
  } else {
    profile.totalEnhanceCost = (profile.totalEnhanceCost || 0) + totalCost;
  }

  const [wName] = getWeaponInfo(profile[currentEnhanceKey], profile.job);

  if (attempted === 0) {
    if (profile[currentEnhanceKey] >= activeTable.length) {
      const stats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
      const detailMsg = formatEnhanceStatDiff(stats, stats);

      const maxTitle = `최고 강화 단계 도달! (+20 ${wName})`;
      const subWeaponLine = `🎯 무기 : +20 ${wName}`;

      const maxText = [
        maxTitle,
        subWeaponLine,
        detailMsg,
        ``,
        enhanceResourceText(profile)
      ].join('\n');

      return { 
        text: maxText, 
        imageUrl: getEnhanceImage('success', 20, profile.job), 
        status: 'max' 
      };
    }
    let baseCostNeeded = activeTable[profile[currentEnhanceKey]].cost;
    let costNeeded = Math.floor(baseCostNeeded * (1 - costDownPct / 100));

    return { 
      text: `현금 또는 보석이 부족합니다! (필요 현금: ${won(costNeeded)})`, 
      imageUrl: null, 
      status: 'nomoney' 
    };
  }

  const finalStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
  const detailMsg = formatEnhanceStatDiff(initialStats, finalStats);

  const weaponLine = `🎯 무기 : +${profile[currentEnhanceKey]} ${wName}`;

  let statSummary = `성공: ${successCount.toLocaleString()}회 | 유지: ${keepCount.toLocaleString()}회`;
  if (isJob) {
    statSummary += ` | 하락: ${dropCount.toLocaleString()}회 | 파괴: ${destroyCount.toLocaleString()}회`;
  } else {
    statSummary += ` | 파괴: ${destroyCount.toLocaleString()}회`;
  }

  let resultMsg = [
    `⏩ [연속 강화 ${attempted.toLocaleString()}회 완료]`,
    `결과 : +${initialLevel} ➔ +${profile[currentEnhanceKey]}`,
    `📊 ${statSummary}`,
    `(총 소모 비용: ${won(totalCost)}${totalGemCost > 0 ? `, 보석 ${totalGemCost}개` : ''})`,
    ``,
    weaponLine,
    detailMsg,
    ``,
    enhanceResourceText(profile)
  ].join('\n');

  return {
    text: resultMsg,
    imageUrl: getEnhanceImage(lastStatus, profile[currentEnhanceKey], profile.job),
    status: lastStatus
  };
}

function showRefineInfo(profile) {
  const currentRefine = profile.refine || 0;
  const starStr = REFINE_STARS[currentRefine] || ' ';

  const currentMult = (currentRefine * 0.10).toFixed(2);
  const currentCrit = currentRefine * 1;
  const currentCp = currentRefine * 2;

  if (currentRefine >= 10) {
    return {
      text: [
        `🔥 [현재 제련 정보]`,
        `현재 제련 단계: ${currentRefine}성 (${starStr})`,
        `배율 | x${currentMult}`,
        `치명타 데미지 증가 | ${currentCrit}%`,
        `공격력 증가 | ${currentCp}%`,
        `✨ 최고 제련 단계(10성 ★★★★★)에 도달했습니다!`
      ].join('\n')
    };
  }

  const tableData = REFINE_TABLE[currentRefine];
  const cashCost = tableData.cashCost;
  const goldCost = tableData.goldCost;

  const succP = (tableData.success * 100).toFixed(1);
  const keepP = (tableData.keep * 100).toFixed(1);
  const destP = (tableData.destroy * 100).toFixed(1);
  const dropP = (tableData.drop * 100).toFixed(1);

  return {
    text: [
      `🔥 [현재 제련 정보]`,
      `현재 단계: ${currentRefine}성 (${starStr}) ➔ 다음: ${currentRefine + 1}성 (${REFINE_STARS[currentRefine + 1] || '★'})`,
      `💰 제련 필요 재화: ${won(cashCost)}, 금괴 ${goldCost}개`,
      `배율 x${currentMult} ➔ x${((currentRefine + 1) * 0.10).toFixed(2)}`,
      `치명타 데미지 증가 ${currentCrit}% ➔ ${currentCrit + 1}%`,
      `공격력 증가 ${currentCp}% ➔ ${currentCp + 2}%`,
      `📊 성공: ${succP}%`,
      `📊 유지: ${keepP}%`,
      `📊 하락: ${dropP}%`,
      `📊 파괴: ${destP}%`,
      ``,
      `제련 강화를 진행하시려면 [/제련 강화] 명령어를 입력해 주세요.`
    ].join('\n')
  };
}

function processRefine(profile) {
  if (profile.refine === undefined || profile.refine < 0) profile.refine = 0;

  if (profile.refine >= 10) {
    return { text: `🔥 이미 최고 제련 단계(10성 ★★★★★)에 도달했습니다!`, imageUrl: null, status: 'max' };
  }

  const tableData = REFINE_TABLE[profile.refine];
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
  const pDestroy = pKeep + tableData.destroy;
  const pDrop = pDestroy + tableData.drop;

  if (roll < pSuccess) {
    profile.refine += 1;
    resultStatus = 'success';
    const oldStar = REFINE_STARS[currentRefine] || ' ';
    const newStar = REFINE_STARS[profile.refine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, profile.refine);

    resultMsg = `🔥 [제련 성공!] ${currentRefine}성(${oldStar}) ➔ ${profile.refine}성(${newStar})\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)\n${statDiff}`;
  } else if (roll < pKeep) {
    resultStatus = 'keep';
    const currStar = REFINE_STARS[currentRefine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, currentRefine);

    resultMsg = `🔥 [제련 유지] ${currentRefine}성(${currStar}) (변동 없음)\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)\n${statDiff}`;
  } else if (roll < pDestroy) {
    profile.refine = 0;
    resultStatus = 'destroy';
    const statDiff = formatRefineStatDiff(currentRefine, 0);

    resultMsg = `💥 [제련 파괴!] 무기 제련이 파괴되어 0성으로 초기화되었습니다!\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)\n${statDiff}`;
  } else if (roll < pDrop) {
    profile.refine = Math.max(0, profile.refine - 1);
    resultStatus = 'drop';
    const newStar = REFINE_STARS[profile.refine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, profile.refine);

    resultMsg = `📉 [제련 하락] 제련 단계가 하락하여 ${profile.refine}성(${newStar})이 되었습니다.\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)\n${statDiff}`;
  } else {
    resultStatus = 'keep';
    const currStar = REFINE_STARS[currentRefine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, currentRefine);

    resultMsg = `🔥 [제련 유지] ${currentRefine}성(${currStar}) (변동 없음)\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)\n${statDiff}`;
  }

  return {
    text: resultMsg,
    imageUrl: null,
    status: resultStatus
  };
}

function showAmplifyInfo(profile) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  const currentLevel = Math.max(0, Math.min(10, profile.combatLevel));
  const currentAmp = AMPLIFY_TABLE[currentLevel];
  const currentGoldRange = currentAmp.minGold === currentAmp.maxGold ? `${currentAmp.minGold.toLocaleString()}개` : `${currentAmp.minGold.toLocaleString()}~${currentAmp.maxGold.toLocaleString()}개`;
  
  let lines = [
    `⏩ [현재 증폭 정보]`,
    `⏩ 증폭 단계 Lv.${currentLevel}`,
    `• 배율 가산 x${currentAmp.multBonus.toFixed(2)}`,
    `• 치명타 가중치 ${Math.round(currentAmp.critWeight * 100)}%`,
    `• 강화 성공 보정 +${currentAmp.successBonus.toFixed(1)}%`,
    `• 획득 가능 금괴 수량 ${currentGoldRange}`
  ];

  if (currentLevel < 10) {
    const nextAmp = AMPLIFY_TABLE[currentLevel + 1];
    const goldRange = nextAmp.minGold === nextAmp.maxGold ? `${nextAmp.minGold.toLocaleString()}개` : `${nextAmp.minGold.toLocaleString()}~${nextAmp.maxGold.toLocaleString()}개`;
    lines.push(
      ``,
      `⏩ 증폭(Lv.${currentLevel + 1})`,
      `• 필요 금괴 ${nextAmp.costNext.toLocaleString()}개`,
      `• 배율 가산 x${nextAmp.multBonus.toFixed(2)}`,
      `• 치명타 가중치 ${Math.round(nextAmp.critWeight * 100)}%`,
      `• 강화 성공 보정 +${nextAmp.successBonus.toFixed(1)}%`,
      `• 획득 가능 금괴 수량 ${goldRange}`,
      ``,
      `증폭 강화를 진행하시려면 [/증폭 강화] 명령어를 입력해 주세요.`
    );
  } else {
    lines.push(``, `✨ 증폭 레벨이 최고 단계에 도달했습니다!`);
  }

  return { text: lines.join('\n'), imageUrl: null };
}

function processAmplify(profile, targetLevels = 1) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  
  if (profile.combatLevel >= 10) {
    return { text: `✨ 증폭 레벨이 최고 단계(Lv.10)에 도달했습니다!`, imageUrl: null };
  }

  let levelsUpgraded = 0;
  let totalGoldSpent = 0;
  const startLevel = profile.combatLevel;

  for (let i = 0; i < targetLevels; i++) {
    if (profile.combatLevel >= 10) break;
    
    const costNext = AMPLIFY_TABLE[profile.combatLevel].costNext;
    if (profile.gold < costNext) break;

    profile.gold -= costNext;
    totalGoldSpent += costNext;
    profile.combatLevel += 1;
    levelsUpgraded += 1;
  }

  if (levelsUpgraded === 0) {
    const costNext = AMPLIFY_TABLE[profile.combatLevel].costNext;
    return { text: `금괴가 부족합니다! (다음 증폭 필요량: 금괴 ${costNext.toLocaleString()}개)`, imageUrl: null };
  }

  const prevAmp = AMPLIFY_TABLE[startLevel];
  const nextAmp = AMPLIFY_TABLE[profile.combatLevel];

  const goldRangePrev = prevAmp.minGold === prevAmp.maxGold ? `${prevAmp.minGold.toLocaleString()}개` : `${prevAmp.minGold.toLocaleString()}~${prevAmp.maxGold.toLocaleString()}개`;
  const goldRangeNext = nextAmp.minGold === nextAmp.maxGold ? `${nextAmp.minGold.toLocaleString()}개` : `${nextAmp.minGold.toLocaleString()}~${nextAmp.maxGold.toLocaleString()}개`;

  const resultMsg = [
    `⏩ 증폭 강화 성공!`,
    `[증폭 Lv.${startLevel} ➔ Lv.${profile.combatLevel}]`,
    `• 소모 금괴 ${totalGoldSpent.toLocaleString()}개`,
    `• 배율 가산 x${prevAmp.multBonus.toFixed(2)} ➔ x${nextAmp.multBonus.toFixed(2)}`,
    `• 치명타 가중치 ${Math.round(prevAmp.critWeight * 100)}% ➔ ${Math.round(nextAmp.critWeight * 100)}%`,
    `• 강화 성공 보정 +${prevAmp.successBonus.toFixed(1)}% ➔ +${nextAmp.successBonus.toFixed(1)}%`,
    `• 금괴 획득 수량 ${goldRangePrev} ➔ ${goldRangeNext}`
  ].join('\n');

  return { 
    text: resultMsg, 
    imageUrl: null 
  };
}

function processUseKey(profile, countArg) {
  if (!profile.keys || profile.keys <= 0) {
    return { text: `비밀열쇠가 없습니다!\n\n${profileText(profile)}`, imageUrl: null };
  }

  let count = parseInt(countArg, 10);
  if (isNaN(count) || count < 1) {
    count = 1;
  }

  count = Math.min(count, profile.keys);

  profile.keys -= count;

  let totalCash = 0;
  let totalGold = 0;
  let totalSupplyItem = 0;

  const combatPower = getAttackPower(profile);
  const ampInfo = getAmplifyInfo(profile.combatLevel || 0);

  for (let i = 0; i < count; i++) {
    const randRoll = Math.random() * 100;
    if (randRoll < 60) { 
      let cashAmt = combatPower * 10;
      cashAmt = applyCreatureCashBonus(cashAmt, profile);
      totalCash += cashAmt;
      profile.cash += cashAmt;
    } else if (randRoll < 99) { 
      let goldBar = rand(ampInfo.minGold, ampInfo.maxGold);
      goldBar = applyCreatureGoldBonus(goldBar, profile);
      totalGold += goldBar;
      profile.gold += goldBar;
    } else {
      totalSupplyItem += 1;
      profile.supplyItem = (profile.supplyItem || 0) + 1;
    }
  }

  let rewardLines = [`🔑 비밀열쇠 ${count}개 연속 사용 결과:`];
  if (totalCash > 0) {
    rewardLines.push(`💵 현금 +${won(totalCash)}`);
  }
  if (totalGold > 0) {
    rewardLines.push(`🧈 금괴 +${totalGold.toLocaleString()}개`);
  }
  if (totalSupplyItem > 0) {
    rewardLines.push(`📦 보급 +${totalSupplyItem.toLocaleString()}개`);
  }

  rewardLines.push(``, resourceText(profile));

  return { text: rewardLines.join('\n'), imageUrl: totalSupplyItem > 0 ? BASE_URL+'/SUPPLY_FARM.png' : null };
}

const RAID_BOX_NAME = '레이드 상자';
const RAID_TITLE = '거신을 쓰러뜨린 자';
const RAID_AVATAR = '심연의 레이드 군주';
function addRaidBox(profile) {
  if (!Array.isArray(profile.inventory)) profile.inventory=[];
  profile.inventory.push({category:'box',boxSource:'raid',name:RAID_BOX_NAME,desc:'레이드 전용 칭호와 아바타를 각각 50% 확률로 획득합니다.'});
}
function openRaidBoxes(profile,count) {
  if (!Array.isArray(profile.ownedTitles))profile.ownedTitles=[];
  if (!Array.isArray(profile.ownedAvatars))profile.ownedAvatars=[];
  let titleHits=0,avatarHits=0;
  for(let i=0;i<count;i++){if(Math.random()<0.5)titleHits++;if(Math.random()<0.5)avatarHits++;}
  const lines=['🎁 레이드 상자 '+count+'개 개봉'];
  for(const [hits,list,name,label] of [[titleHits,profile.ownedTitles,RAID_TITLE,'칭호'],[avatarHits,profile.ownedAvatars,RAID_AVATAR,'아바타']]) {
    if(!hits)continue;
    if(list.includes(name))lines.push(label+' : '+name+' (이미 보유, 중복 획득 '+hits+'회)');
    else {list.push(name);lines.push(label+' 획득 : '+name+(hits>1 ? ' (추가 중복 '+(hits-1)+'회)' : ''));}
  }
  if(!titleHits&&!avatarHits)lines.push('이번 상자에서는 칭호·아바타를 획득하지 못했습니다.');
  lines.push('칭호·아바타는 각각 독립 확률 50%입니다.');
  return {text:lines.join('\n')};
}
function getBoxCatalog() {
  const farmEntries = Object.entries(FARM_BOX_INFO).map(([key, data]) => ({ id: `FARM_${key}`, source: 'farm', key, ...data }));
  const huntEntries = Object.entries(HUNT_BOX_INFO).map(([key, data]) => ({ id: `HUNT_${key}`, source: 'hunt', key, ...data }));
  return [...farmEntries, ...huntEntries, {id:'RAID',source:'raid',name:RAID_BOX_NAME}];
}

function processUpdatedBoxesCommand(profile, arg) {
  if (!Array.isArray(profile.inventory)) profile.inventory = [];
  if (!Array.isArray(profile.ownedTitles)) profile.ownedTitles = [];

  let cleanArg = (arg || '').trim();
  if (cleanArg && !/^[1-9]\d*\s+[1-9]\d*$/.test(cleanArg)) return { text: '사용법: /상자 [상자번호] [수량] (예: /상자 1 2)' };
  if (cleanArg && !cleanArg.split(/\s+/).every(x => Number.isSafeInteger(Number(x)))) return { text: '상자번호와 수량은 올바른 정수로 입력해 주세요.' };
  const parts = cleanArg.split(/\s+/).filter(Boolean);
  const catalog = getBoxCatalog();

  if (parts.length === 0) {
    const lines = [`📦 [보유 상자 목록]`];
    catalog.forEach((box, index) => {
      const count = profile.inventory.filter(item => item.category === 'box' && item.name === box.name && (item.boxSource === box.source || (!item.boxSource && box.source === 'hunt'))).length;
      lines.push(`${index + 1}. [${box.source === 'farm' ? '파밍' : box.source === 'raid' ? '레이드' : '사냥'}] ${box.source === 'hunt' ? box.key+'등급 ' : ''}${box.name}: ${count}개`);
    });
    lines.push(``, `💡 사용법: /상자 [번호] [개수] (예: /상자 1 2)`);
    return { text: lines.join('\n') };
  }

  const requested = parts[0];
  const requestedCount = parts[1] || '1';
  let box = null;
  const number = parseInt(requested, 10);
  if (String(number) === requested && number >= 1 && number <= catalog.length) {
    box = catalog[number - 1];
  } else {
    box = catalog.find(entry => entry.id === requested.toUpperCase() || entry.name === cleanArg.replace(/\s+\d+$/, '')) || null;
  }
  if (!box) return { text: `⚠️ 올바른 상자 번호를 입력해 주세요. /상자로 보유 목록을 확인하세요.` };

  let openCount = parseInt(requestedCount, 10);
  if (!Number.isInteger(openCount) || openCount < 1) openCount = 1;
  const matchingBoxes = profile.inventory.filter(item => item.category === 'box' && item.name === box.name && (item.boxSource === box.source || (!item.boxSource && box.source === 'hunt')));
  if (matchingBoxes.length === 0) return { text: `⚠️ 보유 중인 [${box.name}]가 없습니다.` };
  openCount = Math.min(openCount, matchingBoxes.length);

  let removed = 0;
  profile.inventory = profile.inventory.filter(item => {
    if (item.category === 'box' && item.name === box.name && (item.boxSource === box.source || (!item.boxSource && box.source === 'hunt')) && removed < openCount) {
      removed++;
      return false;
    }
    return true;
  });

  if(box.source === 'raid') return openRaidBoxes(profile,openCount);

  let totalCash = 0;
  let totalGold = 0;
  let totalGem = 0;
  const specialRewards = [];
  for (let i = 0; i < openCount; i++) {
    totalCash += applyCreatureCashBonus(rand(box.minCash, box.maxCash), profile);
    // 상자마다 금괴와 보석을 독립 추첨한다. 확률이 없는 기존 상자는 종전 보상을 유지한다.
    if (box.goldChance == null || Math.random() < box.goldChance) {
      totalGold += applyCreatureGoldBonus(rand(box.minGold || 0, box.maxGold || 0), profile);
    }
    if (box.gemChance == null || Math.random() < box.gemChance) {
      totalGem += applyCreatureGemBonus(rand(box.minGem || 0, box.maxGem || 0), profile);
    }

    if (box.source === 'farm' && box.bonusBox && Math.random() < (box.bonusBoxChance || 0)) {
      specialRewards.push(`추가 상자: ${addBoxToInventory(profile, box.bonusBox)} 1개`);
    }
    if (box.source === 'farm' && box.monthlyTitleChance && Math.random() < box.monthlyTitleChance) {
      const title = MONTHLY_TITLES[getKSTParts().month];
      if (!profile.ownedTitles.includes(title)) {
        profile.ownedTitles.push(title);
        specialRewards.push(`월별 칭호: ${title}`);
      }
    }
    if (box.source === 'farm' && box.seasonTitleChance && Math.random() < box.seasonTitleChance) {
      const title = SEASON_TITLES[1];
      if (!profile.ownedTitles.includes(title)) {
        profile.ownedTitles.push(title);
        specialRewards.push(`시즌 칭호: ${title}`);
      }
    }
  }

  profile.cash += totalCash;
  profile.gold = (profile.gold || 0) + totalGold;
  profile.gem = (profile.gem || 0) + totalGem;
  const lines = [
    `🎁 [${box.source === 'farm' ? '파밍' : box.source === 'raid' ? '레이드' : '사냥'} · ${box.name} 개봉 완료! (${openCount}개)]`,
    `• 획득 현금 : +${won(totalCash)}`,
    `• 획득 금괴 : +${totalGold.toLocaleString()}개`,
    `• 획득 보석 : +${totalGem.toLocaleString()}개`
  ];
  if (specialRewards.length > 0) lines.push(`• 특별 보상 : ${specialRewards.join(', ')}`);
  lines.push(``, resourceText(profile));
  return { text: lines.join('\n') };
}

function getJobInfoText(jobCode, skillLevel = 1) {
  const def = JOB_SKILLS[jobCode];
  if (!def) return '';
  const fakeProfile={job:jobCode,firstJob:def.tier===1?jobCode:(JOB_CATALOG[jobCode]?.[2]||null),secondJob:def.tier===2?jobCode:null,jobSkillLevel:skillLevel,jobSkillLevels:{[jobCode]:skillLevel}};
  return `${def.tier}차 ${JOB_NAMES[jobCode]} Lv.${skillLevel}\n패시브 [${def.passive}] ${def.passiveDesc}\n액티브 [${def.active}] ${getActiveSkillDescription(fakeProfile,jobCode)}`;
}

function getJobSkillOverview(profile) {
  if (!profile.job) return '⚠️ 전직 후 스킬을 사용할 수 있습니다.';
  ensureSkillState(profile);
  const lines = ['✨ [전직 스킬]'];
  const first = getBaseJobCode(profile), second = getSecondJobCode(profile);
  if (first) {
    const lv=getJobSkillLevelFor(profile,first), max=getSkillDailyMax(profile,first), used=getSkillUses(profile,first);
    lines.push('', `① ${JOB_NAMES[first]} Lv.${lv}`, `패시브: ${JOB_SKILLS[first].passive} - ${JOB_SKILLS[first].passiveDesc}`, `액티브: ${JOB_SKILLS[first].active} - ${getActiveSkillDescription(profile,first)}`, `사용: ${used}/${max}회 · /스킬 1`);
  }
  if (second) {
    const lv=getJobSkillLevelFor(profile,second), max=getSkillDailyMax(profile,second), used=getSkillUses(profile,second);
    lines.push('', `② ${JOB_NAMES[second]} Lv.${lv}`, `패시브: ${JOB_SKILLS[second].passive} - ${JOB_SKILLS[second].passiveDesc}`, `액티브: ${JOB_SKILLS[second].active} - ${getActiveSkillDescription(profile,second)}`, second==='battlemage' ? `사용: 마검 던전 ${profile.mgsDungeonData?.count||0}/${lv}회 · /스킬 2` : `사용: ${used}/${max}회 · /스킬 2`);
  }
  if (second==='necromancer') lines.push('', `☠️ 영혼 : ${profile.skillState?.souls||0}개`);
  lines.push('', '강화: /전직 스킬 강화 1차 또는 /전직 스킬 강화 2차');
  return lines.join('\n');
}

function getSkillTreeText(profile) {
  checkAndResetMgsDungeonLimit(profile);
  if (!profile.job) return '🌳 [스킬트리]\n⚠️ 전직 후 스킬트리를 확인할 수 있습니다.';
  ensureSkillState(profile);
  const first = getBaseJobCode(profile);
  const second = getSecondJobCode(profile);
  const lines = ['🌳 [스킬트리]', '※ 2차 전직 후에도 1차 패시브·액티브는 계속 유지됩니다.'];
  const addJob = (jobCode, slot) => {
    if (!jobCode || !JOB_SKILLS[jobCode]) return;
    const lv = getJobSkillLevelFor(profile, jobCode);
    const def = JOB_SKILLS[jobCode];
    const max = getSkillDailyMax(profile, jobCode);
    const used = getSkillUses(profile, jobCode);
    lines.push('', `${slot} ${JOB_NAMES[jobCode]} · Skill Lv.${lv}${lv >= 10 ? ' 👑' : ''}`,
      `🟢 패시브 [${def.passive}]`, def.passiveDesc,
      `🔴 액티브 [${def.active}]`, getActiveSkillDescription(profile,jobCode),
      jobCode === 'battlemage' ? `⏱ 사용 : 마검 던전 ${profile.mgsDungeonData?.count||0}/${lv}회` : `⏱ 오늘 사용 : ${used}/${max}회`,
      `▶ 사용 : /스킬 ${slot === '① 1차' ? '1' : '2'}`);
    if (lv >= 10) lines.push(`👑 마스터 효과 : ${getMasterEffectDescription(jobCode)}`);
  };
  addJob(first, '① 1차');
  addJob(second, '② 2차');
  if (second === 'necromancer') lines.push('', `☠️ 보유 영혼 : ${profile.skillState?.souls||0}개`);
  const pendingEffects = getPendingSkillEffects(profile);
  lines.push('', `✨ 대기 중 효과 : ${pendingEffects.length ? pendingEffects.join(' · ') : '없음'}`);
  lines.push('', '⬆️ 강화 : /전직 스킬 강화 1차', second ? '⬆️ 강화 : /전직 스킬 강화 2차' : '');
  return lines.filter(Boolean).join('\n');
}

function processJobCommand(profile, targetJob) {
  const current = JOB_CATALOG[profile.job];
  const costFactor = current && current[1] === 1 ? 10 : 1;
  const requiredCash = JOB_UNLOCK_CASH * costFactor;
  const requiredGold = JOB_UNLOCK_GOLD * costFactor;
  const choices = Object.entries(JOB_CATALOG).filter(([key, data]) => !current ? data[1] === 1 : current[1] === 1 && data[1] === 2 && data[2] === getBaseJobCode(profile));
  if (!targetJob) return { text: [current ? current[1]+'차 직업 : '+current[0] : '1차 전직 안내',
    choices.length ? '조건: '+(current ? '1차 전직무기' : '일반무기')+' +20 / 현금 '+won(requiredCash)+' / 금괴 '+requiredGold+'개' : '2차 전직을 완료했습니다.',
    ...choices.map(([key,data]) => '/전직 '+data[0]), current ? getJobSkillOverview(profile) : ''].filter(Boolean).join('\n'),
    choices: choices.map(([key,data]) => ({label:'/전직 '+data[0],action:'/전직 '+data[0]})) };
  const selected = choices.find(([key,data])=>data[0]===targetJob);
  if (!selected) return {text:'현재 직업에서 선택할 수 없는 전직입니다. /전직으로 가능한 직업을 확인하세요.'};
  if ((current ? profile.jobEnhance : profile.enhance) < 20) return {text:'전직하려면 현재 무기를 +20까지 강화해야 합니다.'};
  if (profile.cash < requiredCash || profile.gold < requiredGold) return {text:'전직 비용이 부족합니다. 현금 '+won(requiredCash)+' / 금괴 '+requiredGold+'개가 필요합니다.'};
  profile.cash -= requiredCash; profile.gold -= requiredGold;
  if (selected[1][1] === 1) {
    profile.firstJob = selected[0]; profile.secondJob = null; profile.job = selected[0];
  } else {
    profile.firstJob = getBaseJobCode(profile) || selected[1][2]; profile.secondJob = selected[0]; profile.job = selected[0];
  }
  if (!profile.jobSkillLevels || typeof profile.jobSkillLevels !== 'object') profile.jobSkillLevels={};
  if (!profile.jobSkillLevels[profile.job]) profile.jobSkillLevels[profile.job]=1;
  profile.jobSkillLevel = getJobSkillLevelFor(profile,profile.job);
  profile.jobEnhance = 0; profile.hasSeenJobGuide = false;
  return {text:'🎉 '+selected[1][1]+'차 전직 완료: '+selected[1][0]+'\n'+(selected[1][1]===2 ? '1차 전직 스킬은 그대로 유지됩니다.\n' : '')+'전직무기 +0부터 강화할 수 있습니다.\n\n'+getJobSkillOverview(profile), imageUrl:getEnhanceImage('success',0,profile.job)};
}
function processJobChange(profile, targetJob) {
  const current=JOB_CATALOG[profile.job];
  const selected=Object.entries(JOB_CATALOG).find(([key,data])=>data[0]===targetJob);
  if (!current || current[1]!==2 || !selected || selected[1][1]!==2 || selected[1][2]!==getBaseJobCode(profile) || selected[0]===profile.job)
    return {text:'2차 전직 후 같은 계열의 다른 2차 직업으로만 변경할 수 있습니다.'};
  if(profile.cash<JOB_CHANGE_CASH || profile.gold<JOB_CHANGE_GOLD || profile.gem<JOB_CHANGE_GEM) return {text:'직업 변경 비용: 현금 '+won(JOB_CHANGE_CASH)+' / 금괴 '+JOB_CHANGE_GOLD+'개 / 보석 '+JOB_CHANGE_GEM+'개'};
  const transferredSkillLevel = getJobSkillLevelFor(profile, profile.job);
  profile.cash-=JOB_CHANGE_CASH;profile.gold-=JOB_CHANGE_GOLD;profile.gem-=JOB_CHANGE_GEM;
  profile.secondJob=selected[0]; profile.job=selected[0];
  // 같은 계열 2차 직업 변경은 강화 비용이 동일하므로 현재 2차 스킬 레벨을 그대로 이전한다.
  setJobSkillLevelFor(profile, selected[0], transferredSkillLevel);
  profile.jobSkillLevel=transferredSkillLevel;
  // 유료 직업 변경 시 오늘의 스킬 사용 횟수와 예약 버프는 모두 초기화한다.
  const st = ensureSkillState(profile);
  st.dailyUses = {};
  st.buffs = {};
  profile.mgsDungeonData = { date: getKSTDateString(), count: 0 };
  return {text:'직업 변경 완료: '+selected[1][0]+'\n2차 스킬 레벨 Lv.'+transferredSkillLevel+' 그대로 이전 완료\n1차 스킬 레벨도 그대로 유지됩니다.\n✨ 직업 변경으로 오늘의 스킬 사용 횟수와 대기 중 버프가 초기화되었습니다.\n\n'+getJobSkillOverview(profile)};
}

function processUpgradeJobSkill(profile, context = {}, target = '') {
  if (!profile.job) return { text: `⚠️ 전직하지 않은 상태에서는 전직 스킬을 강화할 수 없습니다. [/전직]을 먼저 해주세요.` };
  const first=getBaseJobCode(profile), second=getSecondJobCode(profile);
  const t=String(target||'').trim();
  let jobCode = (/^(1|1차|일차|첫)/.test(t) ? first : /^(2|2차|이차|둘)/.test(t) ? second : (second || first));
  if (!jobCode) return {text:'강화할 전직 스킬이 없습니다.'};
  const currentLevel = getJobSkillLevelFor(profile,jobCode);
  if (currentLevel >= 10) return { text: `✨ ${JOB_NAMES[jobCode]} 스킬이 이미 최고 레벨(Lv.10 MAX)에 도달했습니다!` };
  const goldCost = currentLevel * 500;
  if ((profile.gold || 0) < goldCost) return { text: `금괴가 부족합니다!\n(${JOB_NAMES[jobCode]} Lv.${currentLevel}➔Lv.${currentLevel + 1} 필요: 금괴 ${goldCost.toLocaleString()}개 | 보유: ${(profile.gold || 0).toLocaleString()}개)` };
  profile.gold -= goldCost;
  setJobSkillLevelFor(profile,jobCode,currentLevel+1);
  return {text:[`✨ 전직 스킬 승급 성공!`,`${JOB_NAMES[jobCode]} 스킬 레벨: Lv.${currentLevel} ➔ Lv.${currentLevel+1}`,`(소모: 금괴 ${goldCost.toLocaleString()}개)`,getJobInfoText(jobCode,currentLevel+1),'',resourceText(profile)].join('\n')};
}

function processJobSkill(profile, arg, context = {}) {
  if (!profile.job) return { text: `⚠️ 전직 후에 액티브 스킬을 사용할 수 있습니다. [/전직] 명령어로 전직해 보세요.` };
  ensureSkillState(profile);
  const input=String(arg||'').trim();
  if (!input) return {text:getJobSkillOverview(profile)};
  if (/^대결\s+/.test(input) && getSecondJobCode(profile)==='shadow') return processShadowBattle(profile,input.replace(/^대결\s+/,''));
  const first=getBaseJobCode(profile), second=getSecondJobCode(profile);
  const jobCode=/^(1|1차)(\s|$)/.test(input) ? first : /^(2|2차)(\s|$)/.test(input) ? second : null;
  if (!jobCode) return {text:'사용법: /스킬 1 (1차 액티브) 또는 /스킬 2 (2차 액티브)\n\n'+getJobSkillOverview(profile)};
  const st=ensureSkillState(profile), buffs=st.buffs, lv=getJobSkillLevelFor(profile,jobCode), def=JOB_SKILLS[jobCode];
  if (!def) return {text:'사용할 수 있는 스킬이 없습니다.'};
  if (jobCode==='battlemage') return processMgsDungeon(profile);
  if (!consumeSkillUse(profile,jobCode)) return {text:`⚠️ 오늘의 [${def.active}] 사용 횟수를 모두 소모했습니다. (${getSkillUses(profile,jobCode)}/${getSkillDailyMax(profile,jobCode)})`};
  switch(jobCode) {
    case 'warrior':
      buffs.warriorSlash=(buffs.warriorSlash||0)+1;
      if (isJobSkillMaster(profile,'warrior') && Math.random() < 0.15) { st.dailyUses[jobCode]=Math.max(0,(st.dailyUses[jobCode]||1)-1); buffs.warriorMasterRefund=(buffs.warriorMasterRefund||0)+1; }
      break;
    case 'archer': buffs.archerFocus=(buffs.archerFocus||0)+1; break;
    case 'wizard': buffs.wizardSurge=(buffs.wizardSurge||0)+getActiveSkillParams(profile,'wizard').encounters; break;
    case 'thief': buffs.thiefAmbush=(buffs.thiefAmbush||0)+1; break;
    case 'berserker': buffs.berserkerRage=(buffs.berserkerRage||0)+1; break;
    case 'swordmaster': buffs.swordmasterIssen=(buffs.swordmasterIssen||0)+1; break;
    case 'sniper':
      buffs.sniperShot=(buffs.sniperShot||0)+1;
      if (isJobSkillMaster(profile,'sniper') && Math.random() < 0.10) { st.dailyUses[jobCode]=Math.max(0,(st.dailyUses[jobCode]||1)-1); buffs.sniperMasterRefund=(buffs.sniperMasterRefund||0)+1; }
      break;
    case 'ranger': buffs.rangerRain=(buffs.rangerRain||0)+1; break;
    case 'hawkeye': buffs.hawkeyeTrack=(buffs.hawkeyeTrack||0)+getActiveSkillParams(profile,'hawkeye').hunts; break;
    case 'archmage': buffs.archmageMeteor=(buffs.archmageMeteor||0)+1; break;
    case 'elementalist': buffs.elementalistBurst=(buffs.elementalistBurst||0)+1; break;
    case 'necromancer': {
      const ap=getActiveSkillParams(profile,'necromancer');
      if ((st.souls||0) < ap.soulCost) { st.dailyUses[jobCode]=Math.max(0,(st.dailyUses[jobCode]||1)-1); return {text:`⚠️ 영혼이 부족합니다. [망자의 군세]에는 영혼 ${ap.soulCost}개가 필요합니다. (보유 ${st.souls||0}개)`}; }
      st.souls-=ap.soulCost; buffs.necroArmy=(buffs.necroArmy||0)+1; break;
    }
    case 'shadow': buffs.shadowPlunder=(buffs.shadowPlunder||0)+1; break;
    case 'assassin': buffs.assassinExecute=(buffs.assassinExecute||0)+1; break;
    case 'dualblade': buffs.dualRush=(buffs.dualRush||0)+1; break;
  }
  return {text:`✨ [${JOB_NAMES[jobCode]} · ${def.active}] 발동!\n${getActiveSkillDescription(profile,jobCode)}\n오늘 사용: ${getSkillUses(profile,jobCode)}/${getSkillDailyMax(profile,jobCode)}회`};
}

function processShadowBattle(profile, betArg) {
  if (profile.job !== 'shadow') {
    return { text: `⚠️ 섀도우 직업만 스킬 약탈을 사용할 수 있습니다.` };
  }

  const sLvl = getJobSkillLevelFor(profile,'shadow');
  const maxBet = sLvl * 1000000;
  const input = String(betArg == null ? '' : betArg).trim();
  if (!/^[1-9]\d*$/.test(input) || !Number.isSafeInteger(Number(input))) {
    return { text: '사용법: /스킬 금액\n금액은 1 이상의 정수로 입력하세요. (최대 '+won(maxBet)+')' };
  }
  const betAmount = Number(input);

  if (betAmount > maxBet) {
    return { text: `⚠️ 현재 스킬 레벨(Lv.${sLvl})에서는 최대 ${won(maxBet)} 까지만 재화를 걸 수 있습니다.` };
  }

  const combatPower = getAttackPower(profile);
  const reqPctAmount = Math.floor(betAmount * (combatPower / 10000));

  if (!Number.isSafeInteger(reqPctAmount) || reqPctAmount < 1 || !Number.isSafeInteger(profile.cash) || !Number.isSafeInteger(profile.cash + reqPctAmount)) {
    return {text:'계산된 대결 금액이 유효 범위를 벗어났습니다. 금액을 조정해 주세요.'};
  }
  if (profile.cash < reqPctAmount) {
    return { text: `⚠️ 공격력에 해당하는 % 금액(${won(reqPctAmount)})이 부족하여 대결 스킬을 사용할 수 없습니다.` };
  }

  const isSuccess = Math.random() < 0.5;
  if (isSuccess) {
    const achievementWin = applyAchievementCashBonus(reqPctAmount, profile);
    profile.cash += achievementWin;
    return {
      text: [
        `🗡️ [섀도우 대결 약탈 성공! (50%)]`,
        `상대와의 대결에서 승리하여 공격력 비율 재화 +${won(achievementWin)}을(를) 획득했습니다!`,
        `(대결받는 상대의 재화는 변동되지 않습니다.)`,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  } else {
    profile.cash -= reqPctAmount;
    return {
      text: [
        `💥 [섀도우 대결 약탈 실패! (50%)]`,
        `상대와의 대결에서 패배하여 공격력 비율 재화 -${won(reqPctAmount)}을(를) 잃었습니다.`,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  }
}

function checkAndResetPvpLimit(profile) {
  const todayStr = getKSTDateString();
  if (!profile.pvpData || profile.pvpData.date !== todayStr) {
    profile.pvpData = { date: todayStr, count: 0 };
  }
}

function processPvpBattle(profile) {
  checkAndResetPvpLimit(profile);
  const MAX_PVP_COUNT = 10;

  if (profile.pvpData.count >= MAX_PVP_COUNT) {
    return { text: `⚠️ 오늘의 대결 횟수를 모두 소모했습니다. (일일 가능 횟수: ${profile.pvpData.count}/${MAX_PVP_COUNT})` };
  }

  profile.pvpData.count += 1;

  const myPower = getAttackPower(profile);
  const enemyPower = Math.floor(myPower * (rand(80, 120) / 100));

  const myDmg = Math.floor(myPower * (rand(90, 110) / 100));
  const enemyDmg = Math.floor(enemyPower * (rand(90, 110) / 100));

  let outcomeMsg = '';
  let isWin = myDmg >= enemyDmg;

  if (isWin) {
    const rewardCash = applyAchievementCashBonus(myPower * 10, profile);
    profile.cash += rewardCash;
    outcomeMsg = `🎉 [대결 승리!]\n나의 피해량: ${myDmg.toLocaleString()} vs 상대 피해량: ${enemyDmg.toLocaleString()}\n보상 획득: 현금 +${won(rewardCash)} (본인 공격력 * 10)`;
  } else {
    outcomeMsg = `💥 [대결 패배!]\n나의 피해량: ${myDmg.toLocaleString()} vs 상대 피해량: ${enemyDmg.toLocaleString()}\n상대방에게 더 큰 피해를 입어 승리하지 못했습니다.`;
  }

  return {
    text: [
      `⚔️ [1대1 대결 성사] (${profile.pvpData.count}/${MAX_PVP_COUNT}회)`,
      outcomeMsg,
      ``,
      resourceText(profile)
    ].join('\n')
  };
}

function checkAndResetMgsDungeonLimit(profile) {
  const todayStr = getKSTDateString();
  if (!profile.mgsDungeonData || profile.mgsDungeonData.date !== todayStr) {
    profile.mgsDungeonData = { date: todayStr, count: 0 };
  }
}

function processMgsDungeon(playerState) {
  const sLvl = getJobSkillLevelFor(playerState, 'battlemage');
  checkAndResetMgsDungeonLimit(playerState);

  if (playerState.mgsDungeonData.count >= sLvl) {
    return { text: `⚠️ 오늘의 마검사 전용 던전 사용 횟수를 모두 소모했습니다. (현재 스킬 레벨 기준 이용 가능 횟수: ${playerState.mgsDungeonData.count}/${sLvl}회)` };
  }

  playerState.mgsDungeonData.count += 1;

  const targetCount = sLvl * 10;
  const lootMult = getLootMultiplier(playerState);

  let totalEarnedCash = 0;
  let totalEarnedGem = 0;
  let spawnedMonsters = [];

  const validGrades = new Set(FARM_GRADE_STEPS.filter(g => ['B','A','S','EX'].includes(g.replace(/\+?등급$/, ''))));
  const validMonsterPool = monsters.filter(m => validGrades.has(m.grade));

  for (let i = 0; i < targetCount; i++) {
    let monster = getRandomMonsterByProbability(playerState,null,'dungeon');
    let attempts = 0;
    while ((!monster || !validGrades.has(monster.grade)) && attempts < 100) {
      monster = getRandomMonsterByProbability(playerState,null,'dungeon');
      attempts++;
    }

    if (!monster || !validGrades.has(monster.grade)) {
      const baseM = validMonsterPool[rand(0, validMonsterPool.length - 1)];
      const rewardMoney = getDungeonRewardMoney(baseM.grade);
      const rewardGem = getDungeonRewardGem(baseM.grade);
      monster = {
        ...baseM,
        prefix: "",
        fullName: baseM.name,
        rewardMoney,
        rewardGem,
        formattedReward: rewardMoney.toLocaleString() + "원",
        isPassiveTriggered: false
      };
    }

    let earnedCash = Math.floor(monster.rewardMoney * lootMult);
    earnedCash = applyCreatureCashBonus(earnedCash, playerState);

    let earnedGem = monster.rewardGem > 0 ? monster.rewardGem : 0;
    earnedGem = applyCreatureGemBonus(earnedGem, playerState);

    totalEarnedCash += earnedCash;
    totalEarnedGem += earnedGem;

    spawnedMonsters.push(monster);
    if (isAdminIndependentHunt) {
      independentHuntLines.push(`[${i+1}회] [${monster.grade}] ${monster.fullName} | 현금 +${won(earnedCash)}${earnedGem > 0 ? ` | 보석 +${earnedGem}개` : ''}`);
    }
  }

  const battlemageMaster = isJobSkillMaster(playerState,'battlemage');
  if (battlemageMaster) {
    totalEarnedCash = Math.floor(totalEarnedCash * 1.10);
    totalEarnedGem = Math.floor(totalEarnedGem * 1.10);
  }
  playerState.cash = (playerState.cash || 0) + totalEarnedCash;
  if (totalEarnedGem > 0) {
    playerState.gem = (playerState.gem || 0) + totalEarnedGem;
  }

  const gradeRank = Object.fromEntries(FARM_GRADE_STEPS.map((g,i)=>[g,i+1]));

  if (!isAdminIndependentHunt) {
    spawnedMonsters.sort((a, b) => {
      return (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0);
    });
  }

  let monsterInfoBlocks = [];
  if (!isAdminIndependentHunt) spawnedMonsters.forEach((m, idx) => {
    const displayGradeHeader = `[${m.grade}] `;
    if (idx === 0) {
      monsterInfoBlocks.push(
        `${displayGradeHeader}${m.fullName}\n설명: ${m.description}`
      );
    } else {
      monsterInfoBlocks.push(
        `${displayGradeHeader}${m.fullName}`
      );
    }
  });

  let monstersJoined = monsterInfoBlocks.join('\n');
  
  let summaryLines = totalEarnedCash>0 ? [`💵 총 현금 +${won(totalEarnedCash)}`] : [];
  if (totalEarnedGem > 0) {
    summaryLines.push(`💎 총 보석 : ${totalEarnedGem}개`);
  }

  let headerText = `🔮 [마검 전용 던전 토벌 완료! (${targetCount}마리)] (오늘 사용: ${playerState.mgsDungeonData.count}/${sLvl}회)` + (battlemageMaster ? `\n👑 [마스터 효과] 최종 현금·보석 보상 +10%` : '');
  let middleContent = `${isAdminIndependentHunt ? `🎯 [관리자 독립 사냥 ${actualHunts}회]\n` : ''}${monstersJoined}\n\n💰 획득 재화 :\n${summaryLines.join('\n')}`;

  let footerLines = [
    `🔘 배율 x${lootMult.toFixed(2)} (마검 던전 전용)`,
    `💵 현금 : ${won(playerState.cash)}`,
    `💎 보석 : ${(playerState.gem || 0).toLocaleString()}개`
  ];

  const text = `${headerText}\n\n${middleContent}\n\n${footerLines.join('\n')}`;

  // 수정사항 6: /스킬 시 스킬 버튼만 제공
  return {
    text,
    imageUrl: spawnedMonsters[0]?.image || null,
    choices: [{ label: "/스킬", action: "/스킬" }]
  };
}

function checkAndResetDungeonLimit(profile) {
  const todayStr = getKSTDateString();
  if (!profile.dungeonData || profile.dungeonData.date !== todayStr) {
    profile.dungeonData = { date: todayStr, count: 0 };
  }
}

function processGeneralDungeon(profile) {
  checkAndResetDungeonLimit(profile);
  const MAX_DUNGEON_COUNT = 10 + (Math.max(0, Number(profile.combatLevel) || 0) * 2);

  if (profile.dungeonData.count >= MAX_DUNGEON_COUNT) {
    return { text: `⚠️ 오늘의 던전 입장 횟수를 모두 소모했습니다. (일일 가능 횟수: ${profile.dungeonData.count}/${MAX_DUNGEON_COUNT})` };
  }

  profile.dungeonData.count += 1;

  const roll = Math.random() * 100;
  let targetGrade = "A등급";

  if (roll < 1.0) {
    targetGrade = "S+등급";
  } else if (roll < 1.0 + 2.0) {
    targetGrade = "S+등급";
  } else if (roll < 1.0 + 2.0 + 7.0) {
    targetGrade = "S등급";
  } else if (roll < 1.0 + 2.0 + 7.0 + 10.0) {
    targetGrade = "A+등급";
  } else if (roll < 1.0 + 2.0 + 7.0 + 10.0 + 30.0) {
    targetGrade = "A+등급";
  } else {
    targetGrade = "A등급";
  }

  let baseLookupGrade = targetGrade.replace(/\+/g, "");
  const targetMonsters = getMonstersByGrade(baseLookupGrade);
  const baseMonster = targetMonsters[Math.floor(Math.random() * targetMonsters.length)];

  let prefix = "";
  if (targetGrade.includes("+")) {
    const gradePrefixes = prefixes[targetGrade];
    if (gradePrefixes && gradePrefixes.length > 0) {
      prefix = gradePrefixes[Math.floor(Math.random() * gradePrefixes.length)];
    }
  }

  const fullName = prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name;
  const lootMult = getLootMultiplier(profile);

  let rewardMoney = getDungeonRewardMoney(targetGrade);
  rewardMoney = Math.floor(rewardMoney * lootMult * 1.5);
  rewardMoney = applyCreatureCashBonus(rewardMoney, profile);

  let rewardGem = getDungeonRewardGem(targetGrade);
  rewardGem = applyCreatureGemBonus(rewardGem, profile);

  profile.cash = (profile.cash || 0) + rewardMoney;
  if (rewardGem > 0) {
    profile.gem = (profile.gem || 0) + rewardGem;
  }

  let rewardText = `💵 현금 +${won(rewardMoney)}`;
  if (rewardGem > 0) rewardText += `\n💎 보석 +${rewardGem}개`;

  return {
    text: [
      `🏰 [던전 토벌 성공!] (${profile.dungeonData.count}/${MAX_DUNGEON_COUNT}회)`,
      `출현 몬스터 : [${targetGrade}] ${fullName}`,
      `설명 : ${baseMonster.description}`,
      ``,
      `💰 토벌 보상 :`,
      rewardText,
      ``,
      resourceText(profile)
    ].join('\n'),
    imageUrl: getMonsterImage(baseMonster.image,targetGrade),
    choices: END_BATTLE_CHOICES
  };
}

function processImprintCommand(profile) {
  if (!profile.imprints) profile.imprints = {};
  if (!profile.imprintLocks) profile.imprintLocks = { I: false, II: false, III: false, IV: false, V: false };

  const imprintTiers = [
    { key: 'I', name: '각인 I' },
    { key: 'II', name: '각인 II' },
    { key: 'III', name: '각인 III' },
    { key: 'IV', name: '각인 IV' },
    { key: 'V', name: '각인 V' }
  ];

  let lines = [`🔮 [각인 시스템]\n`];

  imprintTiers.forEach((tier) => {
    const isUnlocked = profile.imprints[tier.key] !== undefined;

    if (isUnlocked) {
      const imprintData = profile.imprints[tier.key];
      const opt = imprintData && Array.isArray(imprintData.options) ? imprintData.options[0] : null;
      if (opt && typeof opt === 'object') {
        lines.push(`🔓* ${tier.name} * : ${opt.name || '알 수 없는 옵션'} +${Number(opt.value) || 0}${opt.unit || ''}`);
      } else {
        lines.push(`⚠️ * ${tier.name} * : 옵션 데이터가 손상되었습니다. /각인 변경으로 다시 설정해 주세요.`);
      }
    } else {
      if (tier.key === 'I') {
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : Lv.20 달성`);
      } else if (tier.key === 'II') {
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : 금괴 500개`);
      } else if (tier.key === 'III') {
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : 금괴 1,000개`);
      } else if (tier.key === 'IV') {
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : +20 싱귤래리티 달성`);
      } else if (tier.key === 'V') {
        const jobWeaponName = getWeaponInfo(20, profile.job)[0];
        
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : +20 ${jobWeaponName} 달성`);
      }
    }
  });

  const showHelp = true;
  if (showHelp) {
    lines.push(`\n💡 사용 가능한 명령어:`);
    lines.push(`• /각인 해금 [1~5] - 조건 만족 시 해당 슬롯 해금`);
    lines.push(`• /각인 잠금 [1~5] - 해당 슬롯 옵션 잠금`);
    lines.push(`• /각인 해제 [1~5] - 잠긴 슬롯 해제`);
    lines.push(`• /각인 변경 - 각인 변경 (잠긴 슬롯당 비용 2배)`);
  }

  return { text: lines.join('\n'), choices: IMPRINT_CHOICES };
}

function processImprintUnlock(profile, tierArg) {
  if (!profile.imprints) profile.imprints = {};
  tierArg = tierArg ? tierArg.toUpperCase() : '';

  const mapNumToRoman = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };
  const tierKey = mapNumToRoman[tierArg] || tierArg;

  const validKeys = ['I', 'II', 'III', 'IV', 'V'];
  if (!validKeys.includes(tierKey)) {
    return { text: `⚠️ 올바른 각인 슬롯을 입력해 주세요. (예: /각인 해금 1)` };
  }

  if (profile.imprints[tierKey]) {
    return { text: `⚠️ 이미 해금된 각인 슬롯입니다. (${tierKey})` };
  }

  let unlockSuccess = false;
  let consumeGold = 0;

  if (tierKey === 'I') {
    const currentLevel = profile.level || 1;
    if (currentLevel < 20) {
      return { text: `⚠️ 해금 조건 미달성! (Lv.20 달성 필요)` };
    }
    unlockSuccess = true;
  } else if (tierKey === 'II') {
    if ((profile.gold || 0) < 500) {
      return { text: `⚠️ 금괴가 부족합니다! (각인 II 해금 필요: 금괴 500개)` };
    }
    consumeGold = 500;
    unlockSuccess = true;
  } else if (tierKey === 'III') {
    if ((profile.gold || 0) < 1000) {
      return { text: `⚠️ 금괴가 부족합니다! (각인 III 해금 필요: 금괴 1,000개)` };
    }
    consumeGold = 1000;
    unlockSuccess = true;
  } else if (tierKey === 'IV') {
    const currentEnhanceLvl = profile.enhance ?? 0;
    if (currentEnhanceLvl < 20) {
      return { text: `⚠️ 해금 조건 미달성! (+20 싱귤래리티 달성 필요)` };
    }
    unlockSuccess = true;
  } else if (tierKey === 'V') {
    const jobWeaponName = getWeaponInfo(20, profile.job)[0];

    const currentJobEnhanceLvl = profile.job ? (profile.jobEnhance ?? 0) : 0;
    if (!profile.job || currentJobEnhanceLvl < 20) {
      return { text: `⚠️ 해금 조건 미달성! (+20 ${jobWeaponName} 달성 필요)` };
    }
    unlockSuccess = true;
  }

  if (unlockSuccess) {
    if (consumeGold > 0) profile.gold -= consumeGold;

    let pool = [...IMPRINT_OPTION_POOL];
    const idx = rand(0, pool.length - 1);
    const optTemplate = pool[idx];
    const val = pickWeightedValue(optTemplate.values, optTemplate.weights);
    const selectedOptions = [{ name: optTemplate.name, value: val, unit: optTemplate.unit, key: optTemplate.key }];

    profile.imprints[tierKey] = { options: selectedOptions };

    let optText = `• ${selectedOptions[0].name} +${selectedOptions[0].value}${selectedOptions[0].unit}`;
    return {
      text: [
        `🎉 [각인 ${tierKey} 해금 및 옵션 장착 성공!]`,
        `랜덤 각인이 부여되었습니다:`,
        optText,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  }

  return { text: `⚠️ 각인 해금 조건을 충족하지 않았습니다.` };
}

function processImprintLock(profile, slotNumStr) {
  if (!profile.imprintLocks) profile.imprintLocks = { I: false, II: false, III: false, IV: false, V: false };
  if (!profile.imprints) profile.imprints = {};

  const mapNumToKey = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };
  const key = mapNumToKey[slotNumStr];

  if (!key) {
    return { text: `⚠️ 올바른 각인 슬롯을 입력해 주세요. (1~5 입력, 예: /각인 잠금 1)` };
  }

  if (!profile.imprints[key]) {
    return { text: `⚠️ 아직 해금되지 않은 각인 슬롯입니다 (${slotNumStr}번 슬롯)` };
  }

  if (profile.imprintLocks[key]) {
    return { text: `🔮 [각인 ${slotNumStr}번 슬롯] 이미 잠겨있는 상태입니다.` };
  }

  profile.imprintLocks[key] = true;
  return {
    text: `🔒 [각인 ${slotNumStr}번 슬롯] 잠금 설정되었습니다.`
  };
}

function processImprintUnlockSlot(profile, slotNumStr) {
  if (!profile.imprintLocks) profile.imprintLocks = { I: false, II: false, III: false, IV: false, V: false };
  if (!profile.imprints) profile.imprints = {};

  const mapNumToKey = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };
  const key = mapNumToKey[slotNumStr];

  if (!key) {
    return { text: `⚠️ 올바른 슬롯 번호를 입력해 주세요. (1~5 입력, 예: /각인 해제 1)` };
  }

  if (!profile.imprints[key]) {
    return { text: `⚠️ 아직 해금되지 않은 각인 슬롯입니다 (${slotNumStr}번 슬롯)` };
  }

  if (!profile.imprintLocks[key]) {
    return { text: `🔓 [각인 ${slotNumStr}번 슬롯] 이미 잠금이 해제된 상태입니다.` };
  }

  profile.imprintLocks[key] = false;
  return {
    text: `🔓 [각인 ${slotNumStr}번 슬롯] 잠금이 해제되었습니다.`
  };
}

function processImprintReroll(profile) {
  if (!profile.imprints) profile.imprints = {};
  if (!profile.imprintLocks) profile.imprintLocks = { I: false, II: false, III: false, IV: false, V: false };

  const unlockedKeys = ['I', 'II', 'III', 'IV', 'V'].filter(k => profile.imprints[k]);
  if (unlockedKeys.length === 0) {
    return { text: `⚠️ 해금된 각인 슬롯이 없습니다. 먼저 각인을 해금해 주세요.` };
  }

  let lockedCount = 0;
  unlockedKeys.forEach(k => {
    if (profile.imprintLocks[k]) lockedCount++;
  });

  const baseCash = 10000000;
  const baseGold = 20;
  const multiplier = Math.pow(2, lockedCount);
  const costCash = baseCash * multiplier;
  const costGold = baseGold * multiplier;

  if (profile.cash < costCash || (profile.gold || 0) < costGold) {
    return {
      text: `⚠️ 재화가 부족합니다!\n(필요: 현금 ${won(costCash)}, 금괴 ${costGold.toLocaleString()}개)\n(잠긴 슬롯: ${lockedCount}개)`
    };
  }

  profile.cash -= costCash;
  profile.gold -= costGold;

  unlockedKeys.forEach(k => {
    if (!profile.imprintLocks[k]) {
      let pool = [...IMPRINT_OPTION_POOL];
      const idx = rand(0, pool.length - 1);
      const optTemplate = pool[idx];
      const val = pickWeightedValue(optTemplate.values, optTemplate.weights);
      const selectedOptions = [{ name: optTemplate.name, value: val, unit: optTemplate.unit, key: optTemplate.key }];
      profile.imprints[k] = { options: selectedOptions };
    }
  });

  let resultLines = [`✨ [각인 변경 완료!]`];
  resultLines.push(`💰 소모 재화`);
  resultLines.push(`현금 ${won(costCash)}`);
  resultLines.push(`금괴 ${costGold}개\n`);

  const imprintNames = { I: '각인 I', II: '각인 II', III: '각인 III', IV: '각인 IV', V: '각인 V' };
  
  const jobWeaponName = getWeaponInfo(20, profile.job)[0];

  ['I', 'II', 'III', 'IV', 'V'].forEach(k => {
    if (profile.imprints[k]) {
      const opt = profile.imprints[k].options[0];
      resultLines.push(`🔄* ${imprintNames[k]} * : ${opt.name} +${opt.value}${opt.unit}`);
    } else {
      if (k === 'I') {
        resultLines.push(`🔒 * ${imprintNames[k]} * : 해금 조건 : Lv.20 달성`);
      } else if (k === 'IV') {
        resultLines.push(`🔒 * ${imprintNames[k]} * : 해금 조건 : +20 싱귤래리티 달성`);
      } else if (k === 'V') {
        resultLines.push(`🔒 * ${imprintNames[k]} * : 해금 조건 : +20 ${jobWeaponName} 달성`);
      }
    }
  });

  resultLines.push(``);
  resultLines.push(resourceText(profile));
  return { text: resultLines.join('\n'), choices: IMPRINT_CHOICES };
}

function checkAndResetHuntLimit(playerState) {
  const todayStr = getKSTDateString();
  const dayOfWeek = getKSTParts().weekday;
  const maxLimit = (dayOfWeek === 0 || dayOfWeek === 6) ? 4000 : 2000;

  if (!playerState.huntData || playerState.huntData.date !== todayStr) {
    playerState.huntData = { date: todayStr, count: 0, max: maxLimit, lastClaimedHuntQuest: 0 };
  } else {
    playerState.huntData.max = maxLimit;
    if (playerState.huntData.lastClaimedHuntQuest === undefined) {
      playerState.huntData.lastClaimedHuntQuest = 0;
    }
  }
}

function processWarehouse(profile, arg = '') {
  if (!profile.inventory) profile.inventory = [];

  // /전리품은 T1~T6 세트 전리품 전용 화면이다.
  // 상자는 /상자에서, 기타 특별 아이템은 각 전용 명령에서 확인한다.
  const gearItems = getOwnedGearItems(profile);
  const tierOrder = { T1:1, T2:2, T3:3, T4:4, T5:5, T6:6 };
  const allGearCountPerTier = 4 * EQUIPMENT_SLOTS.length; // 직업 테마 4종 × 6부위 = 티어당 24개

  const ownedUniqueByTier = {};
  for (let n=1;n<=6;n++) ownedUniqueByTier['T'+n] = new Set();
  for (const item of gearItems) {
    if (!item || !/^T[1-6]$/.test(item.tier || '') || !item.gearJob || !item.slot) continue;
    ownedUniqueByTier[item.tier].add(`${item.gearJob}:${item.slot}`);
  }

  const lines = ['🎒 [T1~T6 전리품]'];
  lines.push('※ /전리품에는 세트 장비만 표시됩니다. 상자는 /상자에서 확인하세요.', '');
  lines.push('📊 [티어별 수집 현황]');
  for (let n=1;n<=6;n++) {
    const tier='T'+n;
    lines.push(`${tier} : ${ownedUniqueByTier[tier].size}/${allGearCountPerTier}`);
  }

  if (gearItems.length === 0) {
    lines.push('', '현재 보유 중인 T1~T6 전리품이 없습니다.', '사냥에서 세트 전리품을 획득할 수 있습니다.');
    return lines.join('\n');
  }

  const grouped = new Map();
  for (const item of gearItems) {
    const key = `${item.tier}:${item.gearJob}:${item.slot}`;
    if (!grouped.has(key)) grouped.set(key, { ...item, count:0 });
    grouped.get(key).count++;
  }
  const sorted = [...grouped.values()].sort((a,b)=>
    (tierOrder[a.tier]||99)-(tierOrder[b.tier]||99) ||
    ['warrior','archer','wizard','thief'].indexOf(a.gearJob)-['warrior','archer','wizard','thief'].indexOf(b.gearJob) ||
    EQUIPMENT_SLOTS.indexOf(a.slot)-EQUIPMENT_SLOTS.indexOf(b.slot)
  );

  let currentTier='';
  for (const item of sorted) {
    if (item.tier !== currentTier) {
      currentTier=item.tier;
      lines.push('', `━━ ${currentTier} 전리품 ━━`);
    }
    const countStr=item.count>1 ? ` (${item.count}개)` : '';
    const slotName=EQUIPMENT_SLOT_NAMES[item.slot] || item.categoryName || '장비';
    lines.push(`[${slotName}] ${item.name}${countStr}`);
    lines.push(`  ${item.setName}`);
  }

  const progress = getEquipmentSetProgressLines(profile);
  const set = getEquipmentSetBonuses(profile);
  lines.push('', '🧩 [세트 보유 현황]');
  if (progress.length) lines.push(...progress);
  else lines.push('아직 활성화 가능한 세트가 없습니다.');
  lines.push('', '✨ [현재 적용 중인 세트 효과]', ...(set.active.length ? set.active : ['없음']));
  lines.push('※ 같은 티어·같은 세트의 서로 다른 부위 2/4/6개 보유 시 자동 적용됩니다.');
  return lines.join('\n');
}

function processHunt(playerState) {
  if (!playerState.huntData) {
    playerState.huntData = { date: "", count: 0, lastClaimedHuntQuest: 0 };
  }

  checkAndResetHuntLimit(playerState);
  const MAX_HUNT_COUNT = playerState.huntData.max || 2000;

  if (playerState.huntData.count >= MAX_HUNT_COUNT) {
    return {
      text: `[사냥 불가]\n오늘 사냥 가능 횟수를 모두 소모했습니다.\n(현재 횟수: (${playerState.huntData.count}/${MAX_HUNT_COUNT}))`,
      choices: HUNT_CHOICES,
      imageUrl: null,
      image: null,
      thumbnail: null
    };
  }

  const speed = playerState.speedMultiplier || 1;
  const remainingLimit = MAX_HUNT_COUNT - playerState.huntData.count;
  const actualHunts = Math.min(speed, remainingLimit);
  
  playerState.huntData.count += actualHunts;

  const lootMult = getLootMultiplier(playerState);

  const startingGem=playerState.gem || 0;
  let gemEventCount=0;
  let totalEarnedCash = 0;
  let totalEarnedGem = 0;
  let spawnedMonsters = [];
  let droppedLootTexts = [];
  let independentHuntLines = [];
  const isAdminIndependentHunt = playerState.adminSpeedMode === true;

  const tierPrices = { "T1": 1000000, "T2": 2000000, "T3": 3000000, "T4": 4000000, "T5": 5000000, "T6": 6000000 };

  for (let i = 0; i < actualHunts; i++) {
    let drawn=pickMonsterGrade(getMonsterGradeWeights(playerState,true),Math.random());
    const huntSkillState = ensureSkillState(playerState);
    if (getSecondJobCode(playerState)==='hawkeye' && huntSkillState.buffs.hawkeyeTrack > 0 && drawn !== 'GEM') {
      const secondDraw = pickMonsterGrade(getMonsterGradeWeights(playerState,false),Math.random());
      const rank = {E:0,D:1,C:2,B:3,A:4,S:5,EX:6};
      if ((rank[secondDraw]||0) > (rank[drawn]||0)) drawn = secondDraw;
      huntSkillState.buffs.hawkeyeTrack--;
    }
    if(drawn==='GEM') {
      const amp=getAmplifyInfo(playerState.combatLevel || 0);
      const gems=applyCreatureGemBonus(Math.max(1,rand(amp.minGold,amp.maxGold)),playerState);
      totalEarnedGem+=gems;gemEventCount++;
      if (isAdminIndependentHunt) independentHuntLines.push(`[${i+1}회] 💎 보석 이벤트 | 보석 +${gems}개`);
      else droppedLootTexts.push('💎 [재화] 보석 +'+gems+'개');
      continue;
    }
    const monster = getRandomMonsterByProbability(playerState,drawn);
    if (!monster) continue;

    let earnedCash = Math.floor(monster.rewardMoney * lootMult);
    earnedCash = applyCreatureCashBonus(earnedCash, playerState);

    let earnedGem = applyCreatureGemBonus(monster.rewardGem || 0, playerState);

    const stolen = rollShadowLoot(playerState, earnedCash, earnedGem);
    earnedCash += stolen.cash; earnedGem += stolen.gem;
    if (stolen.text) droppedLootTexts.push(stolen.text);

    totalEarnedCash += earnedCash;
    totalEarnedGem += earnedGem;

    spawnedMonsters.push(monster);
    if (isAdminIndependentHunt) {
      independentHuntLines.push(`[${i+1}회] [${monster.grade}] ${monster.fullName} | 현금 +${won(earnedCash)}${earnedGem > 0 ? ` | 보석 +${earnedGem}개` : ''}`);
    }
    const collectionMessage = recordHuntCollection(playerState, monster);
    if (collectionMessage) droppedLootTexts.push(collectionMessage);

    let boxDropChance = 0.00001; 
    if (monster.grade.includes("+")) {
      boxDropChance = 0.00005; 
    }

    if (Math.random() < boxDropChance) {
      let baseGradeKey = getHuntBoxKey(monster.grade);
      const boxData = HUNT_BOX_INFO[baseGradeKey];
      if (boxData) {
        if (!playerState.inventory) playerState.inventory = [];
        playerState.inventory.push({
          category: 'box',
          boxSource: 'hunt',
          name: boxData.name,
          desc: `${boxData.name}입니다. (/상자 [상자번호] [수량] 명령어로 사용)`
        });
        droppedLootTexts.push(`🎁 [상자 획득!] [${boxData.name}]을(를) 획득했습니다! (/상자 [상자번호] [수량] 명령어로 사용 가능)`);
      }
    }

    // T1~T6 세트 전리품 드롭
    // 몬스터 등급에 따라 드롭 가능한 티어가 고정된다.
    // 일반 등급(D/C/B/A/S/EX)은 처치 시 0.01%, +등급은 처치 시 0.1% 확률로 드롭한다.
    const gearTierByGrade = {
      'D등급':'T1',  'D+등급':'T1',
      'C등급':'T2',  'C+등급':'T2',
      'B등급':'T3',  'B+등급':'T3',
      'A등급':'T4',  'A+등급':'T4',
      'S등급':'T5',  'S+등급':'T5',
      'EX등급':'T6', 'EX+등급':'T6'
    };
    const targetTier = gearTierByGrade[monster.grade] || null;
    const gearDropChance = targetTier ? (monster.grade.includes('+') ? 0.001 : 0.0001) : 0;
    if (targetTier && Math.random() < gearDropChance) {
      const gearJobs = ['warrior','archer','wizard','thief'];
      const chosenGearJob = gearJobs[rand(0, gearJobs.length - 1)];
      const chosenSlot = EQUIPMENT_SLOTS[rand(0, EQUIPMENT_SLOTS.length - 1)];
      const itemData = getGearItem(chosenGearJob, targetTier, chosenSlot);
      if (itemData) {
        if (!playerState.inventory) playerState.inventory = [];
        const alreadyHas = playerState.inventory.some(inv => inv.category==='gear' && inv.gearJob===chosenGearJob && inv.slot===chosenSlot && inv.tier===targetTier);
        if (alreadyHas) {
          let refundAmount = tierPrices[itemData.tier] || 1000000;
          refundAmount = applyCreatureCashBonus(refundAmount, playerState);
          playerState.cash += refundAmount;
          droppedLootTexts.push(`🎉 [전리품 중복 대체] [${itemData.tier}] ${itemData.name}을(를) 이미 보유 중이므로 현금 +${won(refundAmount)}이 지급되었습니다!`);
        } else {
          const beforeCount = new Set(playerState.inventory.filter(inv=>inv.category==='gear' && inv.gearJob===chosenGearJob && inv.tier===targetTier).map(inv=>inv.slot)).size;
          playerState.inventory.push({...itemData});
          const ownedCount = beforeCount + 1;
          const newMark = '🆕 NEW! ';
          droppedLootTexts.push(`${newMark}🎉 [세트 전리품 획득!] [${itemData.tier}] ${itemData.categoryName} - ${itemData.name}\n세트: ${itemData.setName} (${beforeCount}/6 → ${ownedCount}/6부위)\n(/전리품에서 확인)`);
          if (ownedCount === 2 || ownedCount === 4) {
            droppedLootTexts.push(`✨ [${itemData.tier}] ${itemData.setName} ${ownedCount}세트 효과 활성화!`);
          }
          if (ownedCount === 6) {
            const active = getEquipmentSetBonuses(playerState).active.filter(x=>x.includes(`[${itemData.tier}] ${itemData.setName}`));
            droppedLootTexts.push(`🌟 [세트 완성!]\n「${itemData.setName}」\n6/6 부위 수집 완료!${active.length ? '\n\n'+active.join('\n') : ''}`);
          }
        }
      }
    }
  }

  playerState.cash = (playerState.cash || 0) + totalEarnedCash;
  if (totalEarnedGem > 0) {
    playerState.gem = (playerState.gem || 0) + totalEarnedGem;
  }

  const gradeRank = Object.fromEntries(FARM_GRADE_STEPS.map((g,i)=>[g,i+1]));

  spawnedMonsters.sort((a, b) => {
    return (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0);
  });

  let monsterInfoBlocks = [];
  spawnedMonsters.forEach((m, idx) => {
    let displayGradeHeader = `[${m.grade}] `;
    if (playerState.job === 'battlemage' && m.isPassiveTriggered) {
      displayGradeHeader = `[${m.grade}] ⬆️ `;
    }
    if (idx === 0) {
      monsterInfoBlocks.push(
        `${displayGradeHeader}${m.fullName}\n설명: ${m.description}`
      );
    } else {
      monsterInfoBlocks.push(
        `${displayGradeHeader}${m.fullName}`
      );
    }
  });

  let huntQuestRewardMsgs = [];
  const count = playerState.huntData.count;
  const lastClaimed = playerState.huntData.lastClaimedHuntQuest || 0;
  const dice = rand(1, 6);

  if (count >= 100 && lastClaimed < 100) {
    let qCash = applyCreatureCashBonus(5000 * dice, playerState);
    playerState.cash += qCash;
    playerState.huntData.lastClaimedHuntQuest = 100;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (100회) : 현금 +${won(qCash)}`);
  }
  if (count >= 250 && playerState.huntData.lastClaimedHuntQuest < 250) {
    let qCash = applyCreatureCashBonus(10000 * dice, playerState);
    playerState.cash += qCash;
    playerState.huntData.lastClaimedHuntQuest = 250;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (250회) : 현금 +${won(qCash)}`);
  }
  if (count >= 500 && playerState.huntData.lastClaimedHuntQuest < 500) {
    let qCash = applyCreatureCashBonus(15000 * dice, playerState);
    let qGem = applyCreatureGemBonus(1 * dice, playerState);
    playerState.cash += qCash;
    playerState.gem = (playerState.gem || 0) + qGem;
    playerState.huntData.lastClaimedHuntQuest = 500;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (500회) : 현금 +${won(qCash)} 및 보석 +${qGem}개`);
  }
  if (count >= 1000 && playerState.huntData.lastClaimedHuntQuest < 1000) {
    let qCash = applyCreatureCashBonus(20000 * dice, playerState);
    let qGem = applyCreatureGemBonus(2 * dice, playerState);
    playerState.cash += qCash;
    playerState.gem = (playerState.gem || 0) + qGem;
    playerState.huntData.lastClaimedHuntQuest = 1000;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (1000회) : 현금 +${won(qCash)} 및 보석 +${qGem}개`);
  }
  if (count >= 1500 && playerState.huntData.lastClaimedHuntQuest < 1500) {
    let qCash = applyCreatureCashBonus(25000 * dice, playerState);
    let qGem = applyCreatureGemBonus(3 * dice, playerState);
    playerState.cash += qCash;
    playerState.gem = (playerState.gem || 0) + qGem;
    playerState.huntData.lastClaimedHuntQuest = 1500;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (1500회) : 현금 +${won(qCash)} 및 보석 +${qGem}개`);
  }
  if (count >= 2000 && playerState.huntData.lastClaimedHuntQuest < 2000) {
    let qCash = applyCreatureCashBonus(25000 * dice, playerState);
    let qGem = applyCreatureGemBonus(3 * dice, playerState);
    playerState.cash += qCash;
    playerState.gem = (playerState.gem || 0) + qGem;
    playerState.huntData.lastClaimedHuntQuest = 2000;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (2000회) : 현금 +${won(qCash)} 및 보석 +${qGem}개`);
  }
  if (count >= 3000 && playerState.huntData.lastClaimedHuntQuest < 3000) {
    let qCash = applyCreatureCashBonus(30000 * dice, playerState);
    let qGem = applyCreatureGemBonus(4 * dice, playerState);
    playerState.cash += qCash;
    playerState.gem = (playerState.gem || 0) + qGem;
    playerState.huntData.lastClaimedHuntQuest = 3000;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (3000회) : 현금 +${won(qCash)} 및 보석 +${qGem}개`);
  }
  if (count >= 4000 && playerState.huntData.lastClaimedHuntQuest < 4000) {
    let qCash = applyCreatureCashBonus(50000 * dice, playerState);
    let qGem = applyCreatureGemBonus(5 * dice, playerState);
    playerState.cash += qCash;
    playerState.gem = (playerState.gem || 0) + qGem;
    playerState.huntData.lastClaimedHuntQuest = 4000;
    huntQuestRewardMsgs.push(`퀘스트 달성 보상 (4000회) : 현금 +${won(qCash)} 및 보석 +${qGem}개`);
  }

  huntQuestRewardMsgs.push(...claimDailyPassMissions(playerState));

  let finalRewardLines = [];
  if (huntQuestRewardMsgs.length > 0) {
    finalRewardLines.push(huntQuestRewardMsgs.join('\n'));
  }
  if (droppedLootTexts.length > 0) {
    finalRewardLines.push(droppedLootTexts.join('\n'));
  }

  let monstersJoined = isAdminIndependentHunt
    ? independentHuntLines.join('\n')
    : monsterInfoBlocks.join('\n');
  
  let summaryLines = [`💵 총 현금 +${won(totalEarnedCash)}`];
  if (totalEarnedGem > 0) {
    summaryLines.push(`💎 총 보석 : ${totalEarnedGem}개`);
  }

  let middleContent = `${isAdminIndependentHunt ? `🎯 [관리자 독립 사냥 ${actualHunts}회]\n` : ''}${monstersJoined}\n\n💰 획득 재화 :\n${summaryLines.join('\n')}`;
  if(!spawnedMonsters.length)middleContent='';
  if (finalRewardLines.length > 0) {
    middleContent = middleContent + '\n' + finalRewardLines.join('\n');
  }

  const questThresholds = [100, 250, 500, 1000, 1500, 2000, 3000, 4000];
  let nextThreshold = questThresholds.find(t => t > count) || 4000;
  let remainingCount = nextThreshold - count;
  let questLeftText = `📜 퀘스트 보상까지 ${remainingCount}회`;

  let footerLines = [
    '💵 현금 : ' + won(playerState.cash),
    ...((playerState.gem || 0)>startingGem ? ['💎 보석 : '+playerState.gem.toLocaleString()+'개'] : []),
    '',
    '🔘 배율 : x' + lootMult.toFixed(2) + ' | ⏩ 배속 (x' + speed + ')',
    '⚔️ 사냥 횟수 : (' + playerState.huntData.count + '/' + MAX_HUNT_COUNT + ')',
    questLeftText
  ];

  const text = `${middleContent.trim()}\n\n${footerLines.join('\n')}`;
  
  // 수정사항 3: /사냥 후 선택지 /파밍 제거하고 /사냥으로 통일
  const choices = HUNT_CHOICES;

  const firstMonster = spawnedMonsters.length > 0 ? spawnedMonsters[0] : null;

  return {
    combatPerformed: true,
    text,
    choices,
    imageUrl: gemEventCount>0 ? BASE_URL+'/GEM_HUNT.png' : firstMonster?.image ?? null,
    image: firstMonster?.image ?? null,
    thumbnail: firstMonster?.image ?? null,
    url: firstMonster?.image ?? null,
    monster: firstMonster
  };
}

function processSpeedCommand(profile, arg, battle = null) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  const maxAllowed = Math.max(1, profile.combatLevel); 

  let speedVal = parseInt(arg, 10);
  if (isNaN(speedVal) || speedVal < 1 || speedVal > 10) {
    return { text: `⚠️ 올바른 배속 숫자를 입력해 주세요. (1~10 사이, 예: /배속 2)` };
  }

  if (speedVal > maxAllowed) {
    return { text: `⚠️ 증폭 레벨이 부족하여 해당 배속을 설정할 수 없습니다!\n• 현재 증폭 레벨: Lv.${profile.combatLevel}\n• 최대 설정 가능 배속: x${maxAllowed}` };
  }

  profile.speedMultiplier = speedVal;
  profile.adminSpeedMode = false;
  const ongoingFarm = battle && battle.mode === '파밍' && battle.alive && !battle.finished && battle.farmRunCount;
  const timing = ongoingFarm
    ? `진행 중 파밍은 x${battle.farmRunCount}로 유지되며, 다음 파밍 게임부터 x${speedVal}이 적용됩니다. 사냥은 다음 명령부터 적용됩니다.`
    : '다음 파밍 및 사냥부터 적용됩니다.';
  return { text: `⏩ 배속이 [x${speedVal}](으)로 설정되었습니다!\n${timing}` };
}

function processAccumulated(profile) {
  const adventurerCost = profile.totalEnhanceCost || 0;
  const jobCost = profile.totalJobEnhanceCost || 0;
  return {
    text: [
      `📊 [누적 강화 비용]`,
      ``,
      `🎖️모험가`,
      `강화에 들어간 누적 비용은 총 **${won(adventurerCost)}**입니다.`,
      ``,
      `🎖️전직`,
      `강화에 들어간 누적 비용은 총 **${won(jobCost)}**입니다.`
    ].join('\n')
  };
}

function processExchange(profile, arg) {
  const parts = arg.trim().split(/\s+/);
  if (parts.length < 2) {
    return {
      text: [
        `💱 [교환 목록 안내]`,
        `1. 현금 → 금괴 (현금 1,000,000원당 금괴 1개)`,
        `2. 현금 → 보석 (현금 1,000,000원당 보석 1개)`,
        `3. 금괴 → 현금 (금괴 1개당 50,000원)`,
        `4. 보석 → 현금 (보석 1개당 50,000원)`,
        ``,
        `💡예시: [/교환 1 10] (1번 품목으로 10개 교환)`
      ].join('\n')
    };
  }

  const type = parseInt(parts[0], 10);
  const amount = parseInt(parts[1], 10);

  if (isNaN(type) || isNaN(amount) || amount <= 0) {
    return { text: `⚠️ 올바른 교환 번호와 수량을 입력해 주세요. (예: /교환 1 10)` };
  }

  switch (type) {
    case 1: {
      const costCash = 1000000 * amount;
      if (profile.cash < costCash) {
        return { text: `⚠️ 현금이 부족합니다! (필요 현금: ${won(costCash)})` };
      }
      profile.cash -= costCash;
      profile.gold = (profile.gold || 0) + amount;
      return { text: `💱 [교환 완료]\n현금 ${won(costCash)}으로 금괴 ${amount}개를 교환했습니다!\n\n${resourceText(profile)}` };
    }
    case 2: {
      const costCash = 1000000 * amount;
      if (profile.cash < costCash) {
        return { text: `⚠️ 현금이 부족합니다! (필요 현금: ${won(costCash)})` };
      }
      profile.cash -= costCash;
      profile.gem = (profile.gem || 0) + amount;
      return { text: `💱 [교환 완료]\n현금 ${won(costCash)}으로 보석 ${amount}개를 교환했습니다!\n\n${resourceText(profile)}` };
    }
    case 3: {
      const costGold = amount;
      if ((profile.gold || 0) < costGold) {
        return { text: `⚠️ 금괴가 부족합니다! (필요 금괴: ${costGold}개)` };
      }
      profile.gold -= costGold;
      let rewardCash = 50000 * amount;
      rewardCash = applyCreatureCashBonus(rewardCash, profile);
      profile.cash += rewardCash;
      return { text: `💱 [교환 완료]\n금괴 ${amount}개로 현금 ${won(rewardCash)}을(를) 교환했습니다!\n\n${resourceText(profile)}` };
    }
    case 4: {
      const costGem = amount;
      if ((profile.gem || 0) < costGem) {
        return { text: `⚠️ 보석이 부족합니다! (필요 보석: ${costGem}개)` };
      }
      profile.gem -= costGem;
      let rewardCash = 50000 * amount;
      rewardCash = applyCreatureCashBonus(rewardCash, profile);
      profile.cash += rewardCash;
      return { text: `💱 [교환 완료]\n보석 ${amount}개로 현금 ${won(rewardCash)}을(를) 교환했습니다!\n\n${resourceText(profile)}` };
    }
    default:
      return { text: `⚠️ 올바른 교환 번호를 입력해 주세요. (1~4)` };
  }
}

function getJobPassiveRate(profile) {
  const level = Number(profile && profile.jobSkillLevel);
  return Math.max(1, Math.min(10, Number.isFinite(level) ? Math.floor(level) : 1)) / 100;
}
function getMonsterGradeWeights(profile, includeGemEvent=false) {
  const factor=profile && getSecondJobCode(profile)==='battlemage' ? 1+getJobSkillLevelFor(profile,'battlemage')/100 : 1;
  const rows=[['EX',0.001],['S',0.099],['A',0.9],['B',4.1],['C',15],['D',25]];
  const weighted=rows.map(([g,w])=>[g,g==='D'?w:w*factor]);
  if(includeGemEvent)weighted.unshift(['GEM',1]);
  weighted.push(['E',100-weighted.reduce((sum,row)=>sum+row[1],0)]);
  return weighted;
}
function pickMonsterGrade(weights, roll) {
  let value = roll * 100;
  for (const [grade, weight] of weights) { if (value < weight) return grade; value -= weight; }
  return 'E';
}
function getRandomMonsterByProbability(profile = null, selectedBase = null, rewardSource = 'hunt') {
  const weights = getMonsterGradeWeights(profile);
  const baseGradeGroup = selectedBase || pickMonsterGrade(weights, Math.random());
  const isPassiveTriggered = profile && getSecondJobCode(profile) === 'battlemage' && !['E','D'].includes(baseGradeGroup);

  let subRoll = Math.random() * 100;
  let selectedGrade = baseGradeGroup + "등급";
  const plusChance = getSecondJobCode(profile)==='hawkeye' ? 1 + getJobSkillLevelFor(profile,'hawkeye') * 0.1 : 1;
  if(subRoll<plusChance)selectedGrade=baseGradeGroup+'+등급';

  let baseLookupGrade = baseGradeGroup + "등급";

  const targetMonsters = getMonstersByGrade(baseLookupGrade);
  if (!targetMonsters || targetMonsters.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * targetMonsters.length);
  const baseMonster = targetMonsters[randomIndex];

  let prefix = "";
  if (selectedGrade.includes("+")) {
    const gradePrefixes = prefixes[selectedGrade];
    if (gradePrefixes && gradePrefixes.length > 0) {
      prefix = gradePrefixes[Math.floor(Math.random() * gradePrefixes.length)];
    }
  }

  const rewardMoney = rewardSource === 'dungeon' ? getDungeonRewardMoney(selectedGrade) : getRewardMoney(selectedGrade);
  const rewardGem = rewardSource === 'dungeon' ? getDungeonRewardGem(selectedGrade) : (gradeRewards[selectedGrade]?.gem || 0);

  return {
    ...baseMonster,
    image: getMonsterImage(baseMonster.image,selectedGrade),
    grade: selectedGrade,
    prefix: prefix,
    fullName: prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name,
    rewardMoney: rewardMoney,
    rewardGem: rewardGem,
    formattedReward: rewardMoney.toLocaleString() + "원",
    isPassiveTriggered: isPassiveTriggered
  };
}

function getMonstersByGrade(grade) {
  if (!grade) return monsters;
  return monsters.filter(m => m.grade === grade);
}

function getRewardMoney(grade) {
  const range = gradeRewards[grade] || { min: 200, max: 500 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function getDungeonRewardMoney(grade) {
  const range=DUNGEON_GRADE_REWARDS[grade] || {min:200,max:500};
  return rand(range.min,range.max);
}
function getDungeonRewardGem(grade) {
  return DUNGEON_GRADE_REWARDS[grade]?.gem || 0;
}

function startGame(existingProfile) {
  let profile = createProfile(existingProfile);
  let battle = profile.activeFarmBattle && !profile.activeFarmBattle.finished && profile.activeFarmBattle.hp > 0
    ? JSON.parse(JSON.stringify(profile.activeFarmBattle))
    : createBattle(profile);

  return {
    text: `배틀로얄 및 사냥 게임에 오신 것을 환영합니다! 아래 버튼을 누르거나 '/파밍' 등을 입력해 주세요.\n\n${battleStatusBoard(profile, battle)}`,
    imageUrl: null, 
    choices: BATTLE_CHOICES,
    category: 'start',
    state: { profile, battle }
  };
}

// 반환 state를 저장하는 연동과 전달한 state를 재사용하는 연동을 모두 지원한다.
// 레이드 HP는 개인 프로필이 아니라 MongoDB raids 컬렉션에서 공유한다.
function getRaidAttackPower(profile) {
  const power = getAttackPower(createProfile(profile));
  if (!Number.isSafeInteger(power) || power < 0) throw new Error('레이드 공격력이 올바르지 않습니다.');
  return power;
}
function buildRaidText(profile, result) {
  const raid=result.raid, pct=Math.max(0,Math.min(100,raid.hp/raid.maxHp*100));
  const filled=Math.round(pct/10);
  const lines=['👹 협동 레이드',''];
  if(result.attacked) {
    lines.push('💥 피해량 : '+result.damage.toLocaleString());
    if(result.execute)lines.push('🪓 즉시 처형 발동!');
    else if(result.percentStrike)lines.push('🪓 최대 체력 1% 추가 피해!');
    lines.push('💵 현금 +'+result.cashEarned.toLocaleString()+'원','🧈 금괴 +'+result.goldEarned+'개','💎 보석 +'+result.gemEarned+'개','');
  }
  if (result.discovered) lines.push('🔎 새로운 레이드를 최초 발견했습니다!','📦 레이드 상자 +1개','');
  if (result.raidBoxAwarded === 'kill') lines.push('🏆 레이드 처치!','📦 레이드 상자 +1개','');
  if(raid.hp>0 && pct<5)lines.push('HP ???');
  else lines.push('HP:'+'█'.repeat(filled)+'░'.repeat(10-filled)+' ('+pct.toFixed(2)+'%)',raid.hp.toLocaleString()+' / '+raid.maxHp.toLocaleString());
  lines.push('', '🔎 최초 발견자 : '+(raid.discoveredNickname || '아직 없음'), '', '🏆 누적 피해량 TOP 3');
  const leaders=(raid.topContributors || raid.participants || []).slice().sort((a,b)=>b.damage-a.damage || String(a.userId).localeCompare(String(b.userId))).slice(0,3);
  if(!leaders.length)lines.push('아직 참여자가 없습니다.');
  leaders.forEach((p,i)=>lines.push((i+1)+'위 · '+(p.nickname || '이름 없는 유저')+' | 피해량 : '+Number(p.damage || 0).toLocaleString()));
  lines.push('',raid.hp>0 ? '/파밍·/사냥 중 0.1% 확률로 조우합니다.' : '🏆 처치된 레이드입니다. 다음 발견을 기다립니다.');
  return lines.join('\n');
}

const GAME_ADMIN_IDS = Object.freeze([
  '3525f724f1f9b2692a4fc476cb7f9e0a2b9400f2c75d235ee501c45c7dbaf92e04',
  'f7bd90eccfbed43037e9b4a1f623c72ed09b62fd0ba718be65f3ce6397a0d4bb9e'
]);
const ADMIN_RESOURCES = Object.freeze({ 현금: 'cash', 금괴: 'gold', 보석: 'gem', 비밀열쇠: 'keys', 보급: 'supplyItem' });
function isGameAdmin(userId) { return typeof userId === 'string' && GAME_ADMIN_IDS.includes(userId); }
function requiresGameAdmin(utterance) {
  const first = String(utterance || '').trim().split(/\s+/)[0];
  return ['/관리자', '/초기화', '/4655', '/5292', '/9523', '/7586'].includes(first);
}
function parseAdminGrant(utterance) {
  const parts = String(utterance || '').trim().split(/\s+/);
  if (parts.length !== 4 || parts[0] !== '/관리자' || !Object.hasOwn(ADMIN_RESOURCES, parts[2]) || !/^[1-9]\d*$/.test(parts[3])) return null;
  const amount = Number(parts[3]);
  if (!Number.isSafeInteger(amount)) return null;
  return { targetId: parts[1], field: ADMIN_RESOURCES[parts[2]], label: parts[2], amount };
}
function formatRanking(rows) {
  return ['🏆 공격력 랭킹 TOP 5','',...(rows.length ? rows.slice(0,5).map((r,i)=>(i+1)+'위· '+r.nickname+' | Lv.'+r.level+'\n💪 공격력 : '+r.power.toLocaleString()+'\n🎯 무기　 : +'+r.enhance+' '+r.weaponName) : ['등록된 유저가 없습니다.'])].join('\n');
}
function parseAdminRename(utterance) {
  const match=String(utterance||'').trim().match(/^\/관리자\s+(\S+)\s+닉네임\s+(.+)$/u);
  if(!match)return null;
  const nickname=match[2].normalize('NFKC').trim();
  if(!nickname || Array.from(nickname).length>60 || /[\x00-\x1f\x7f]/.test(nickname))return null;
  return {targetId:match[1],nickname};
}

function formatRaidReward(raid, userId) {
  if (!raid || raid.hp > 0) return '';
  const reward = (raid.rewards || []).find(r => r.userId === userId);
  if (!reward) return '참여 기록이 없어 지급받은 보상이 없습니다.';
  return ['🎁 내 레이드 보상 (지급 완료)',
    '기여도 : ' + (reward.damage / raid.maxHp * 100).toFixed(2) + '%',
    '💵 현금 +' + reward.cash.toLocaleString() + '원',
    '🧈 금괴 +' + reward.gold.toLocaleString() + '개',
    '💎 보석 +' + reward.gem.toLocaleString() + '개',
    '🔑 비밀열쇠 +' + reward.keys.toLocaleString() + '개'].join('\n');
}

// Server/DB integration v1: pure calculation only. The server must atomically
// commit actual damage, contribution, cash and defeat rewards in the SAME transaction.
const RAID_RULES_VERSION = 1;
function resolveRaidAttack(profile, raid, options = {}) {
  const source = options.source || 'farm';
  if (!['farm','hunt'].includes(source)) throw new Error('잘못된 레이드 공격 경로입니다.');
  if (!raid || !Number.isSafeInteger(raid.hp) || !Number.isSafeInteger(raid.maxHp) || raid.hp < 0 || raid.maxHp <= 0 || raid.hp > raid.maxHp) throw new Error('레이드 체력 데이터가 올바르지 않습니다.');
  const random = options.random || Math.random;
  const draw = () => { const n=random(); if (!Number.isFinite(n) || n<0 || n>=1) throw new Error('잘못된 레이드 추첨값입니다.'); return n; };
  const empty = {version:RAID_RULES_VERSION,source,attacked:false,damage:0,cashEarned:0,execute:false,percentStrike:false};
  if (raid.hp === 0) return empty;
  const berserker = profile && getSecondJobCode(profile) === 'berserker';
  const chance = berserker ? getJobSkillLevelFor(profile,'berserker')/100 : 0;
  if (!(options.forceEncounter === true && isGameAdmin(options.actorId)) && draw() >= 0.001) return empty;
  const attackPower = getRaidAttackPower(profile);
  if (attackPower <= 0) return empty;
  const execute = berserker && raid.hp < raid.maxHp * 0.01 && draw() < chance;
  const percentStrike = !execute && berserker && draw() < chance;
  const bonusDamage = percentStrike ? Math.max(1, Math.floor(raid.maxHp * 0.01)) : 0;
  const damage = execute ? raid.hp : Math.min(raid.hp, attackPower + Math.min(raid.hp, bonusDamage));
  return {version:RAID_RULES_VERSION,source,attacked:true,attackPower,damage,cashEarned:damage,goldEarned:1+Math.floor(draw()*6),gemEarned:1+Math.floor(draw()*6),execute,percentStrike,defeated:damage===raid.hp};
}
function formatRaidAttackEffects(result) {
  if (!result || !result.attacked) return '';
  return ['👹 공동 레이드 조우!',
    result.execute ? '🪓 즉시 처형 발동!' : result.percentStrike ? '🪓 레이드 최대 체력 1% 추가 피해!' : '',
    '피해량 : '+result.damage.toLocaleString(), '💵 현금 +'+result.cashEarned.toLocaleString()+'원', '🧈 금괴 +'+result.goldEarned+'개', '💎 보석 +'+result.gemEarned+'개'].filter(Boolean).join('\n');
}

function processTurn(state, utterance, context = {}) {
  if (requiresGameAdmin(utterance) && !isGameAdmin(context && context.userId)) {
    return { text: "관리자만 사용할 수 있는 명령어입니다.", choices: [], state: state || {} };
  }
  const adminAttack = String(utterance||'').trim().match(/^\/관리자\s+공격력\s+(\d+)$/);
  if (adminAttack && isGameAdmin(context && context.userId)) {
    const attackVal = Number(adminAttack[1]);
    const profile = createProfile(state && state.profile);
    const battle = state && state.battle;
    if (!Number.isSafeInteger(attackVal) || attackVal < 0) {
      return { text: '⚠️ 관리자 공격력은 0 이상의 안전한 정수만 설정할 수 있습니다.\n예: /관리자 공격력 1000000', state: { profile, battle } };
    }
    profile.adminAttackPower = attackVal;
    return {
      text: `🛠️ [관리자 공격력] ${attackVal.toLocaleString()} 설정 완료\n💪 현재 공격력 : ${getAttackPower(profile).toLocaleString()}`,
      choices: [],
      category: 'adminAttack',
      state: { profile, battle },
      adminAction: 'attack'
    };
  }
  const adminSpeed = String(utterance||'').trim().match(/^\/관리자\s+배속\s+(\d+)$/);
  if (adminSpeed && isGameAdmin(context && context.userId)) {
    const speedVal = Number(adminSpeed[1]);
    const profile = createProfile(state && state.profile);
    const battle = state && state.battle;
    if (!Number.isSafeInteger(speedVal) || speedVal < 1 || speedVal > 1000) {
      return { text: '⚠️ 관리자 배속은 1~1000 사이의 정수만 설정할 수 있습니다.\n예: /관리자 배속 1000', state: { profile, battle } };
    }
    profile.speedMultiplier = speedVal;
    profile.adminSpeedMode = true;
    const ongoingFarm = battle && battle.mode === '파밍' && battle.alive && !battle.finished && battle.farmRunCount;
    const timing = ongoingFarm
      ? `진행 중 파밍은 x${battle.farmRunCount}로 유지되며 다음 파밍 게임부터 x${speedVal}이 적용됩니다.`
      : '다음 파밍 및 사냥부터 적용됩니다.';
    return {
      text: `🛠️ [관리자 배속] x${speedVal} 설정 완료\n• 파밍 : 1회 판정 결과의 재화를 x${speedVal}로 적용\n• 사냥 : 최대 ${speedVal}회를 각각 독립 시행\n${timing}`,
      choices: [],
      category: 'adminSpeed',
      state: { profile, battle },
      adminAction: 'speed'
    };
  }
  const adminJob = String(utterance||'').trim().match(/^\/관리자\s+전직\s+(\S+)$/);
  if(adminJob && isGameAdmin(context.userId)) {
    const profile=createProfile(state && state.profile);
    const entry=Object.entries(JOB_CATALOG).find(([key,data])=>data[0]===adminJob[1]);
    if(!entry)return {text:'지원하는 직업명을 입력하세요: '+Object.values(JOB_CATALOG).map(x=>x[0]).join(', '),state:{profile,battle:state && state.battle}};
    profile.userId=context.userId; profile.job=entry[0]; profile.jobEnhance=0; profile.hasSeenJobGuide=false;
    if(entry[1][1]===1){profile.firstJob=entry[0];profile.secondJob=null;}else{profile.firstJob=entry[1][2];profile.secondJob=entry[0];}
    if(!profile.jobSkillLevels||typeof profile.jobSkillLevels!=='object')profile.jobSkillLevels={}; profile.jobSkillLevels[entry[0]]=profile.jobSkillLevels[entry[0]]||1; if(profile.firstJob)profile.jobSkillLevels[profile.firstJob]=profile.jobSkillLevels[profile.firstJob]||1; profile.jobSkillLevel=getJobSkillLevelFor(profile,entry[0]);
    return {text:'🛠️ 관리자 전직 완료: '+entry[1][0]+'\n조건·비용 없이 전직했습니다. 무기 +0 / 스킬 Lv.1',imageUrl:getEnhanceImage('success',0,profile.job),state:{profile,battle:state && state.battle},adminAction:'job'};
  }
  // context.userId는 서버에서 확인한 본인의 MongoDB 조회 키만 전달한다.
  // 명령어 인수나 닉네임으로 ID를 설정하거나 생성하지 않는다.
  const contextId = context && typeof context.userId === 'string' ? context.userId.trim() : '';
  const stateId = state && typeof state.userId === 'string' ? state.userId.trim() : '';
  const savedId = state && state.profile && typeof state.profile.userId === 'string' ? state.profile.userId.trim() : '';
  const userId = contextId || stateId || savedId;
  const turnState = state && typeof state === 'object' ? state : {};
  if (userId) turnState.profile = { ...(turnState.profile || {}), userId };
  const result = processTurnInternal(turnState, utterance, context);
  // No offline queue: older servers ignore this field, and unprocessed attacks never accrue.
  if (context.sharedRaidPassives === true && result && result.combatPerformed) {
    result.raidIntent = {version:RAID_RULES_VERSION,source:result.category};
  }
  if (context.sharedRaidPassives !== true && result && result.state && result.state.profile && getSecondJobCode(result.state.profile) === 'berserker' && String(utterance).trim() === '/전직') {
    result.text += '\n⚠️ 레이드 패시브: DB·서버 연동 대기 중';
  }
  // /초기화에서도 계정 식별자는 삭제하지 않는다.
  if (userId && result && result.state && result.state.profile) result.state.profile.userId = userId;
  if (state && typeof state === 'object' && result && result.state) {
    state.profile = result.state.profile;
    state.battle = result.state.battle;
  }
  return result;
}

function processTurnInternal(state, utterance, context = {}) {
  if (!state || typeof state !== 'object') state = {};
  
  let profile = createProfile(state.profile);
  let battle = state.battle;

  // 홈페이지/외부 연동에서 battle 객체가 빠지거나 이전 값으로 돌아오는 경우를 방지한다.
  // 프로필에 저장한 activeFarmBattle과 비교해 더 최신 진행 상태를 복구한다.
  const backedUpBattle = profile.activeFarmBattle && typeof profile.activeFarmBattle === 'object'
    ? profile.activeFarmBattle
    : null;
  // 구형 저장 데이터의 turn도 읽어 진행 중인 파밍을 이어받는다.
  const stateBattleVersion = battle ? Number(battle.progressVersion ?? battle.turn ?? 0) : -1;
  const backupBattleVersion = backedUpBattle ? Number(backedUpBattle.progressVersion ?? backedUpBattle.turn ?? 0) : -1;
  if (backedUpBattle && !backedUpBattle.finished && backedUpBattle.alive !== false &&
      (!battle || battle.mode !== '파밍' || battle.finished || battle.alive === false || backupBattleVersion > stateBattleVersion)) {
    battle = JSON.parse(JSON.stringify(backedUpBattle));
  }

  let input = typeof utterance === 'string' ? utterance.trim().replace(/\s+/g, ' ') : '';
  const cleanInput = input.toLowerCase();

  if (cleanInput === '/광고') {
    const rewards={cash:rand(1,100000),gold:rand(0,5),gem:rand(0,5),keys:rand(0,5)};
    for(const [field,amount] of Object.entries(rewards)) {
      const next=Number(profile[field]||0)+amount;
      if(!Number.isSafeInteger(next))return {text:'재화 저장 한도를 초과했습니다.',state:{profile,battle}};
    }
    for(const [field,amount] of Object.entries(rewards))profile[field]=(profile[field]||0)+amount;
    return {text:['🎁 광고 보상','현재는 광고 없이 보상을 지급합니다.','💵 현금 +'+won(rewards.cash),'🧈 금괴 +'+rewards.gold+'개','💎 보석 +'+rewards.gem+'개','🔑 비밀열쇠 +'+rewards.keys+'개'].join('\n'),choices:[],state:{profile,battle},category:'ad'};
  }
  if (/^\/레이드(?:\s|$)/.test(cleanInput)) {
    return { text: '협동 레이드는 서버와 DB의 레이드 기능 연결이 필요합니다.', choices: [], state: { profile, battle } };
  }

  if (/^\/관리자(?:\s|$)/.test(cleanInput) || cleanInput === '/랭킹') {
    return { text: '해당 기능은 서버 연결이 필요합니다.', choices: [], state: { profile, battle } };
  }

  if (cleanInput === '/id') {
    return {
      text: profile.userId
        ? '🆔 내 ID\n' + profile.userId
        : '⚠️ 사용자 ID가 게임에 전달되지 않았습니다. 서버에서 MongoDB 조회에 사용하는 ID를 연결해 주세요.',
      imageUrl: null,
      choices: [],
      category: 'id',
      state: { profile, battle }
    };
  }

  if (cleanInput === "/메인" || cleanInput === "메인" || cleanInput === "시작" || cleanInput === "처음으로") {
    const startResult = startGame(profile);
    state.profile = startResult.state.profile;
    state.battle = startResult.state.battle;
    return {
      text: startResult.text,
      choices: END_BATTLE_CHOICES,
      category: "main",
      imageUrl: startResult.imageUrl,
      image: startResult.image,
      thumbnail: startResult.thumbnail,
      state: { profile: state.profile, battle: startResult.state.battle }
    };
  }

  if (input === '/4655') {
    profile.cash += 1000000000;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n현금 1,000,000,000원이 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }
  if (input === '/5292') {
    let gainedGold = applyCreatureGoldBonus(10000, profile);
    profile.gold += gainedGold;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n금괴 ${gainedGold.toLocaleString()}개가 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }
  if (input === '/9523') {
    let gainedGem = applyCreatureGemBonus(10000, profile);
    profile.gem += gainedGem;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n보석 ${gainedGem.toLocaleString()}개가 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }
  if (input === '/7586') {
    profile.keys = (profile.keys || 0) + 10000;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n비밀열쇠 10,000개가 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }

  if (input === '/출석') {
    const missionMessages = claimDailyPassMissions(profile);
    const todayStr = getKSTDateString();
    if (profile.seasonPass.lastAttendanceDate === todayStr) {
      return {
        text: [...missionMessages, '⚠️ 이미 오늘 출석 체크를 완료하셨습니다.'].join('\n\n'),
        choices: END_BATTLE_CHOICES,
        state: { profile, battle }
      };
    }

    profile.seasonPass.lastAttendanceDate = todayStr;
    const passMsg = grantPassExp(profile, 20);
    return {
      text: [`📅 [출석 체크 완료!]\n오늘의 출석 보상이 지급되었습니다.\n\n${passMsg}`, ...missionMessages].join('\n\n'),
      choices: END_BATTLE_CHOICES,
      state: { profile, battle }
    };
  }

  if (input === '/초기화') {
    state.profile = createProfile({}); 
    state.battle = null; 
    return {
      text: `🔄 [초기화 완료]\n프로필 대시보드와 모든 재화가 초기화되었습니다.\n\n${profileText(state.profile)}`,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'reset',
      state: { profile: state.profile, battle: null }
    };
  }

  state.profile = profile;

  if (profile.job && profile.jobEnhance === undefined) profile.jobEnhance = 0;
  if (profile.enhance === undefined || profile.enhance < 0) profile.enhance = 0;
  
  const isPlayingBattle = battle && battle.alive && !battle.finished;

  if (!input.startsWith('/')) {
    const currentBoard = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
    return {
      text: `⚠️ 모든 명령어는 명령어 앞에 '/'를 반드시 붙여야 동작합니다. (예: /파밍, /프로필, /사냥)\n\n${currentBoard}`,
      imageUrl: null,
      choices: isPlayingBattle ? BATTLE_CHOICES : END_BATTLE_CHOICES,
      state: { profile, battle }
    };
  } else {
    let parts = input.split(' ');
    parts[0] = parts[0].toLowerCase();
    input = parts.join(' ');
  }

  if (input === '/' || input === '/도움말') {
    const helpText = [
      `📜 [사용 가능한 명령어 안내]`,
      `• /랭킹 - 공격력 랭킹`,
      `• /id - 사용자 ID 확인`,
      `• /레이드 - 공동 레이드 체력 조회`,
      `• /광고 - 임시 광고 보상 받기`,
      `• /파밍 - 파밍 시작 (기존 전투 기능 대체)`,
      `• /컬렉션 [페이지] - 사냥 몬스터 수집 현황 및 영구 효과`,
      `• /강화 - 무기 강화`,
      `• /제련 - 제련 정보 확인`,
      `• /연속 강화 [횟수] - 지정 횟수만큼 연속 강화`,
      `• /증폭 - 증폭 정보 확인`,
      `• /배속 [1~10] - 증폭 레벨 제한 내에서 보상 배속 설정`,
      `• /금고 - 금고 정보 확인 및 입/출금/구매/레벨업`,
      `• /열쇠 [수량] - 비밀열쇠를 지정한 수량만큼 연속 사용`,
      `• /상자 - 보유 상자 확인 및 개봉 (/상자 [상자번호] [수량])`,
      `• /보급 [수량] - 보급 재화를 사용해 칭호 및 재화 획득`,
      `• /칭호 - 칭호 정보 및 보유 목록 확인`,
      `• /아바타 - 아바타 정보 및 보유 목록 확인`,
      `• /크리처 - 현재 크리처 정보 및 등급 확인`,
      `• /전직 [직업명] - 전직 안내 및 직업 전직`,
      `• /스킬 - 보유 스킬 확인 (/스킬 1: 1차, /스킬 2: 2차 액티브)`,
      `• /스킬트리 - 1차·2차 패시브/액티브 상세 확인`,
      `• /업적 - 업적 진행도와 누적 현금 보너스 확인`,
      `• /대결 - 1대1 대결`,
      `• /던전 - 고등급 던전 입장`,
      `• /각인 - 각인 정보 확인`,
      `• /전리품 - T1~T6 세트 전리품 및 세트 효과 확인`,
      `• /프로필 - 내 정보 확인`,
      `• /사냥 - 몬스터 사냥 및 현금 보상 획득`,
      `• /누적 - 누적 강화 비용 확인`,
      `• /교환 [번호] [수량] - 재화 교환`,
      `• /출석 - 일일 출석 체크 (시즌 패스 20 EXP)`,
      `• /패스 - 월간 시즌 패스 정보 확인 및 미션 현황`
    ].join('\n');
    return { text: helpText, imageUrl: null, state: { profile, battle } };
  }

  let cmdParts = input.split(' ');
  let command = cmdParts[0];
  let arg = cmdParts.slice(1).join(' ');

  if (command === '/제련' && arg.startsWith('강화')) {
    command = '/제련 강화';
    arg = arg.replace(/^강화\s*/, '').trim();
  } else if (command === '/연속' && /^강화(?:\s|$)/.test(arg)) {
    command = '/연속 강화';
    arg = arg.replace(/^강화\s*/, '').trim();
  } else if (command === '/증폭' && arg.startsWith('강화')) {
    command = '/증폭 강화';
    arg = arg.replace(/^강화\s*/, '').trim();
  } else if (command === '/각인' && arg.startsWith('해금')) {
    command = '/각인 해금';
    arg = arg.replace(/^해금\s*/, '').trim();
  } else if (command === '/각인' && arg.startsWith('잠금')) {
    command = '/각인 잠금';
    arg = arg.replace(/^잠금\s*/, '').trim();
  } else if (command === '/각인' && arg.startsWith('해제')) {
    command = '/각인 해제';
    arg = arg.replace(/^해제\s*/, '').trim();
  } else if (command === '/각인' && arg.startsWith('변경')) {
    command = '/각인 변경';
    arg = arg.replace(/^변경\s*/, '').trim();
  } else if (command === '/전직' && arg.startsWith('스킬') && arg.includes('강화')) {
    command = '/전직 스킬 강화';
    arg = arg.replace(/^스킬\s*강화\s*/, '').trim();
  } else if (command === '/전직' && arg.startsWith('변경')) {
    command = '/전직 변경';
    arg = arg.replace(/^변경\s*/, '').trim();
  } else if (command === '/패스' && arg.startsWith('보상')) {
    command = '/패스 보상';
    arg = arg.replace(/^보상\s*/, '').trim();
  }

  // 1. /파밍 명령어
  if (command === '/파밍') {
    checkAndResetFarmLimit(profile);
    // 기존 저장 데이터의 미지급 달성 보상도 한 번만 복구한다.
    const pendingQuestMessages = claimFarmMilestones(profile);
    const maxFarmLimit = profile.farmData ? profile.farmData.max : FARM_DAILY_LIMIT;

    // 전투 횟수는 '완료된 파밍 게임 수' 기준이다. 진행 중 턴마다 증가시키지 않는다.
    if (profile.farmData.count >= maxFarmLimit) {
      return {
        text: [...pendingQuestMessages, `⚠️ 오늘의 파밍 가능 횟수를 모두 소모했습니다. (일일 가능 횟수: ${profile.farmData.count}/${maxFarmLimit})`].join('\n\n'),
        choices: FARM_CHOICES,
        state: { profile, battle }
      };
    }

    // 진행 중인 전투가 없을 때만 새 게임을 만든다.
    if (!battle || !battle.alive || battle.finished || battle.mode !== '파밍') {
      battle = createBattle(profile);
    }

    battle.progressVersion = (Number(battle.progressVersion ?? battle.turn) || 0) + 1;
    delete battle.turn;
    delete battle.maxTurn;

    // 한 게임의 보상·상자·소모 횟수는 같은 배속을 사용한다.
    // 진행 중 배속 변경은 다음 게임부터 적용한다.
    if (!Number.isInteger(battle.farmRunCount) || battle.farmRunCount < 1) {
      battle.farmRunCount = Math.min(
        Math.max(1, Math.floor(Number(profile.speedMultiplier) || 1)),
        maxFarmLimit - profile.farmData.count
      );
    }
    const farmProfile = { ...profile, speedMultiplier: battle.farmRunCount };
    const fightResult = resolveProgressionFarmTurn(farmProfile, battle);
    const hasEnded = battle.hp <= 0;
    const displayMsgs = [fightResult.text, ...pendingQuestMessages];

    if (hasEnded) {
      battle.finished = true;

      // 누적 보상은 한 게임이 종료될 때 한 번만 지급한다.
      profile.cash += battle.accumulatedCash || 0;
      profile.gold = (profile.gold || 0) + (battle.accumulatedGold || 0);
      profile.gem = (profile.gem || 0) + (battle.accumulatedGem || 0);
      profile.keys = (profile.keys || 0) + (battle.accumulatedKeys || 0);
      profile.supplyItem = (profile.supplyItem || 0) + (battle.accumulatedSupplyItem || 0);

      battle.accumulatedExp = Math.round((battle.accumulatedCash || 0) / 10);
      if (battle.accumulatedExp > 0) {
        // 이미 배율이 적용된 현금으로 계산한 EXP에 추가 배율을 곱하지 않는다.
        const expResult = addExp(profile, battle.accumulatedExp, 1);
        // 실제 지급한 정수 EXP를 종료 내역에 보관한다.
        battle.accumulatedExp = expResult.gained;
        if (expResult.msg) displayMsgs.push(expResult.msg);
      }

      const highestIndex = Number.isInteger(battle.highestGradeIndex) ? battle.highestGradeIndex : -1;
      const highestGrade = highestIndex >= 0
        ? FARM_GRADE_STEPS[Math.min(highestIndex, FARM_GRADE_STEPS.length - 1)]
        : '없음';
      // 기존 등급별 상자 매핑을 유지한다. 처치가 없는 경우에도 기본 E 상자를 지급한다.
      const boxKey = getFarmBoxKey(highestIndex >= 0 ? highestGrade : 'E등급');
      const boxCount = battle.farmRunCount;
      let boxName;
      for (let i = 0; i < boxCount; i++) boxName = addBoxToInventory(profile, boxKey);

      // 종료 시 실제 배속만큼 전투 횟수를 증가시키고 달성한 퀘스트를 지급한다.
      profile.farmData.count = (profile.farmData.count || 0) + battle.farmRunCount;
      displayMsgs.push(...claimFarmMilestones(profile));
      profile.gamesPlayed = (profile.gamesPlayed || 0) + 1;
      profile.activeFarmBattle = null;

      const rewardLines = [];
      if (battle.accumulatedCash >= 1) rewardLines.push(`💵 현금 : +${won(battle.accumulatedCash)}`);
      if (battle.accumulatedGold >= 1) rewardLines.push(`🧈 금괴 : +${battle.accumulatedGold.toLocaleString()}개`);
      if (battle.accumulatedGem >= 1) rewardLines.push(`💎 보석 : +${battle.accumulatedGem.toLocaleString()}개`);
      if (battle.accumulatedKeys >= 1) rewardLines.push(`🔑 비밀열쇠 : +${battle.accumulatedKeys.toLocaleString()}개`);
      if (battle.accumulatedSupplyItem >= 1) rewardLines.push(`📦 보급 : +${battle.accumulatedSupplyItem.toLocaleString()}개`);
      if (battle.accumulatedExp >= 1) rewardLines.push('⭐ Exp +' + battle.accumulatedExp.toLocaleString());
      displayMsgs.push([
        '====☠️[사망]====',
        `최고 처치 등급: ${highestGrade}`,
        '💰 획득 재화',
        ...rewardLines,
        `🪎 ${boxName} +${boxCount}개`
      ].join('\n'));
    } else {
      // 다음 요청에서 state.battle이 누락되더라도 HP/등급/누적 보상이 이어지도록 진행 상태를 프로필에도 저장한다.
      profile.activeFarmBattle = JSON.parse(JSON.stringify(battle));
    }

    return {
      text: [displayMsgs.join('\n\n'), battleStatusBoard({ ...profile, speedMultiplier: battle.farmRunCount }, battle, !!fightResult.encounter), hasEnded ? resourceText(profile) : ''].filter(Boolean).join('\n\n'),

      imageUrl: fightResult.imageUrl,
      choices: FARM_CHOICES,
      category: 'farm',
      combatPerformed: true,
      state: { profile, battle }
    };
  }

  // 3. /강화 명령어 (단일 /확정 강화)
  if (command === '/강화') {
    let targetLvl = parseInt(arg, 10);
    if (!isNaN(targetLvl) && targetLvl > 0) {
      const gResult = processGuaranteedEnhance(profile, targetLvl);
      return {
        text: gResult.text,
        imageUrl: gResult.imageUrl,
        choices: ENHANCE_CHOICES,
        category: 'enhance',
        state: { profile, battle }
      };
    }

    const eResult = processEnhance(profile);
    return {
      text: eResult.text,
      imageUrl: eResult.imageUrl,
      choices: ENHANCE_CHOICES,
      category: 'enhance',
      state: { profile, battle }
    };
  }

  // 4. /연속 강화 명령어
  if (command === '/연속 강화') {
    let count = parseInt(arg, 10);
    if (!/^[1-9]\d*$/.test(arg) || !Number.isSafeInteger(Number(arg))) return { text: '사용법: /연속 강화 [횟수]', choices: [], state: { profile, battle } };

    const mResult = processMultiEnhance(profile, count);
    return {
      text: mResult.text,
      imageUrl: mResult.imageUrl,
      choices: ENHANCE_CHOICES,
      category: 'multiEnhance',
      state: { profile, battle }
    };
  }

  // 5. /제련 명령어
  if (command === '/제련') {
    const rInfo = showRefineInfo(profile);
    return {
      text: rInfo.text,
      imageUrl: null,
      choices: REFINE_CHOICES,
      category: 'refineInfo',
      state: { profile, battle }
    };
  }

  // 6. /제련 강화 명령어
  if (command === '/제련 강화' || command === '/제련강화') {
    const rResult = processRefine(profile);
    return {
      text: rResult.text,
      imageUrl: rResult.imageUrl,
      choices: REFINE_CHOICES,
      category: 'refine',
      state: { profile, battle }
    };
  }

  // 7. /증폭 명령어
  if (command === '/증폭') {
    const aInfo = showAmplifyInfo(profile);
    return {
      text: aInfo.text,
      imageUrl: null,
      choices: AMPLIFY_CHOICES,
      category: 'amplifyInfo',
      state: { profile, battle }
    };
  }

  // 8. /증폭 강화 명령어
  if (command === '/증폭 강화' || command === '/증폭강화') {
    let targetCount = parseInt(arg, 10);
    if (isNaN(targetCount) || targetCount < 1) targetCount = 1;

    const aResult = processAmplify(profile, targetCount);
    return {
      text: aResult.text,
      imageUrl: aResult.imageUrl,
      choices: AMPLIFY_CHOICES,
      category: 'amplify',
      state: { profile, battle }
    };
  }

  // 9. /금고 명령어
  if (command === '/금고') {
    const vResult = processVaultCommand(profile, arg);
    return {
      text: vResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'vault',
      state: { profile, battle }
    };
  }

  // 10. /열쇠 명령어
  if (command === '/열쇠') {
    const kResult = processUseKey(profile, arg);
    return {
      text: kResult.text,
      imageUrl: kResult.imageUrl,
      choices: END_BATTLE_CHOICES,
      category: 'useKey',
      state: { profile, battle }
    };
  }

  // 11. /상자 명령어
  if (command === '/상자') {
    const bResult = processUpdatedBoxesCommand(profile, arg);
    return {
      text: bResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'boxes',
      state: { profile, battle }
    };
  }

  // 12. /보급 명령어
  if (command === '/보급') {
    const sResult = processSupply(profile, arg);
    return {
      text: sResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'supply',
      state: { profile, battle }
    };
  }

  // 13. /칭호 명령어
  if (command === '/칭호') {
    if (arg.startsWith('장착')) {
      const equipArg = arg.replace(/^장착\s*/, '').trim();
      const tEquip = processTitleEquip(profile, equipArg);
      return {
        text: tEquip.text,
        imageUrl: null,
        choices: [],
        category: 'titleEquip',
        state: { profile, battle }
      };
    }

    const tInfo = processTitleInfo(profile);
    return {
      text: tInfo.text,
      imageUrl: null,
      choices: [],
      category: 'titleInfo',
      state: { profile, battle }
    };
  }

  // 14. /크리처 명령어
  if (command === '/아바타') {
    if (arg.startsWith('장착')) {
      const equipArg = arg.replace(/^장착\s*/, '').trim();
      const avatarEquip = processAvatarEquip(profile, equipArg);
      return {
        text: avatarEquip.text,
        imageUrl: null,
        choices: [],
        category: 'avatarEquip',
        state: { profile, battle }
      };
    }

    const avatarInfo = processAvatarInfo(profile);
    return {
      text: avatarInfo.text,
      imageUrl: null,
      choices: [],
      category: 'avatarInfo',
      state: { profile, battle }
    };
  }

  // 15. /크리처 명령어
  if (command === '/크리처') {
    if (arg.startsWith('뽑기')) {
      const cGacha = processCreatureGacha(profile);
      return {
        text: cGacha.text,
        imageUrl: cGacha.imageUrl || null,
        choices: CREATURE_CHOICES,
        category: 'creatureGacha',
        state: { profile, battle }
      };
    }

    const cInfo = processCreatureInfo(profile);
    return {
      text: cInfo.text,
      imageUrl: null,
      choices: CREATURE_CHOICES,
      category: 'creatureInfo',
      state: { profile, battle }
    };
  }

  // 15. /크리처 뽑기 단독 명령어
  if (command === '/크리처 뽑기' || command === '/크리처뽑기') {
    const cGacha = processCreatureGacha(profile);
    return {
      text: cGacha.text,
      imageUrl: cGacha.imageUrl || null,
      choices: CREATURE_CHOICES,
      category: 'creatureGacha',
      state: { profile, battle }
    };
  }

  // 16. /전직 명령어
  if (command === '/전직') {
    const jResult = processJobCommand(profile, arg);
    return {
      text: jResult.text,
      imageUrl: jResult.imageUrl || null,
      choices: jResult.choices || END_BATTLE_CHOICES,
      category: 'job',
      state: { profile, battle }
    };
  }

  // 17. /전직 변경 명령어
  if (command === '/전직 변경' || command === '/전직변경') {
    const jChange = processJobChange(profile, arg);
    return {
      text: jChange.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'jobChange',
      state: { profile, battle }
    };
  }

  // 18. /전직 스킬 강화 명령어
  if (command === '/전직 스킬 강화' || command === '/전직스킬강화') {
    const jUpgrade = processUpgradeJobSkill(profile, context, arg);
    return {
      text: jUpgrade.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'jobSkillUpgrade',
      state: { profile, battle }
    };
  }

  // 19. /업적 명령어
  if (command === '/업적' || command === '/업적목록') {
    return {
      text: getAchievementText(profile),
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'achievement',
      state: { profile, battle }
    };
  }

  // 20. /스킬트리 명령어
  if (command === '/스킬트리') {
    return {
      text: getSkillTreeText(profile),
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'skillTree',
      state: { profile, battle }
    };
  }

  // 20. /스킬 명령어
  if (command === '/스킬') {
    const sResult = processJobSkill(profile, arg, context);
    return {
      text: sResult.text,
      imageUrl: sResult.imageUrl || null,
      choices: sResult.choices || END_BATTLE_CHOICES,
      category: 'skill',
      state: { profile, battle }
    };
  }

  // 21. /대결 명령어
  if (command === '/대결') {
    const pResult = processPvpBattle(profile);
    return {
      text: pResult.text,
      imageUrl: null,
      choices: PVP_CHOICES,
      category: 'pvp',
      state: { profile, battle }
    };
  }

  // 21. /던전 명령어
  if (command === '/던전') {
    const dResult = processGeneralDungeon(profile);
    return {
      text: dResult.text,
      imageUrl: dResult.imageUrl,
      choices: END_BATTLE_CHOICES,
      category: 'dungeon',
      state: { profile, battle }
    };
  }

  // 22. /각인 명령어
  if (command === '/각인') {
    const iResult = processImprintCommand(profile);
    return {
      text: iResult.text,
      imageUrl: null,
      choices: IMPRINT_CHOICES,
      category: 'imprint',
      state: { profile, battle }
    };
  }

  // 23. /각인 해금 명령어
  if (command === '/각인 해금' || command === '/각인해금') {
    const iUnlock = processImprintUnlock(profile, arg);
    return {
      text: iUnlock.text,
      imageUrl: null,
      choices: IMPRINT_CHOICES,
      category: 'imprintUnlock',
      state: { profile, battle }
    };
  }

  // 24. /각인 잠금 명령어
  if (command === '/각인 잠금' || command === '/각인잠금') {
    const iLock = processImprintLock(profile, arg);
    return {
      text: iLock.text,
      imageUrl: null,
      choices: IMPRINT_CHOICES,
      category: 'imprintLock',
      state: { profile, battle }
    };
  }

  // 25. /각인 해제 명령어
  if (command === '/각인 해제' || command === '/각인해제') {
    const iUnlockSlot = processImprintUnlockSlot(profile, arg);
    return {
      text: iUnlockSlot.text,
      imageUrl: null,
      choices: IMPRINT_CHOICES,
      category: 'imprintUnlockSlot',
      state: { profile, battle }
    };
  }

  // 26. /각인 변경 명령어
  if (command === '/각인 변경' || command === '/각인변경') {
    const iReroll = processImprintReroll(profile);
    return {
      text: iReroll.text,
      imageUrl: null,
      choices: IMPRINT_CHOICES,
      category: 'imprintReroll',
      state: { profile, battle }
    };
  }

  // 27. /전리품 명령어
  if (command === '/전리품' || command === '/인벤토리') {
    const wText = processWarehouse(profile, arg);
    return {
      text: wText,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'warehouse',
      state: { profile, battle }
    };
  }

  // 28. /프로필 명령어
  if (command === '/컬렉션') {
    const collection = processMonsterCollection(profile, arg);
    return { text: collection.text, choices: [], category: 'collection', state: { profile, battle } };
  }

  if (command === '/프로필') {
    const pText = profileText(profile, true);
    return {
      text: pText,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'profile',
      state: { profile, battle }
    };
  }

  // 29. /사냥 명령어
  if (command === '/사냥') {
    const hResult = processHunt(profile);
    return {
      text: hResult.text,
      imageUrl: hResult.imageUrl,
      choices: HUNT_CHOICES,
      category: 'hunt',
      combatPerformed: hResult.combatPerformed === true,
      state: { profile, battle }
    };
  }

  // 30. /배속 명령어
  if (command === '/배속') {
    const spResult = processSpeedCommand(profile, arg, battle);
    return {
      text: spResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'speed',
      state: { profile, battle }
    };
  }

  // 31. /누적 명령어
  if (command === '/누적') {
    const accResult = processAccumulated(profile);
    return {
      text: accResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'accumulated',
      state: { profile, battle }
    };
  }

  // 32. /교환 명령어
  if (command === '/교환') {
    const exResult = processExchange(profile, arg);
    return {
      text: exResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'exchange',
      state: { profile, battle }
    };
  }

  // 33. /패스 명령어
  if (command === '/패스') {
    const passResult = processPassCommand(profile);
    return {
      text: passResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'pass',
      state: { profile, battle }
    };
  }

  // 34. /패스 보상 명령어
  if (command === '/패스 보상' || command === '/패스보상') {
    const passClaimResult = processPassClaimRewards(profile);
    return {
      text: passClaimResult.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'passClaim',
      state: { profile, battle }
    };
  }

  // 알 수 없는 명령어 처리
  const board = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
  return {
    text: `⚠️ 알 수 없거나 지원하지 않는 명령어입니다. [/]를 입력하여 전체 명령어 목록을 확인해 보세요.\n\n${board}`,
    imageUrl: null,
    choices: isPlayingBattle ? BATTLE_CHOICES : END_BATTLE_CHOICES,
    state: { profile, battle }
  };
}

// Module Exports (Node.js/카카오 챗봇 백엔드 연동용)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isGameAdmin, requiresGameAdmin, parseAdminGrant, ADMIN_RESOURCES, formatRanking, formatRaidReward,
    RAID_RULES_VERSION, resolveRaidAttack, formatRaidAttackEffects,
    addRaidBox, RAID_BOX_NAME, RAID_TITLE, RAID_AVATAR,
    parseAdminRename, getCurrentEnhanceLevel,
    JOB_CATALOG, JOB_SKILLS, getEnhanceImage, getWeaponInfo,
    RAID_IMAGE: BASE_URL + '/images/raid_1.png',
    getRaidAttackPower,
    buildRaidText,
    startGame,
    processTurn,
    createProfile,
    createBattle,
    profileText,
    resourceText
  };
}

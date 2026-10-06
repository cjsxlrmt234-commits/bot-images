function dailyLimitMessage(label,count,max) { return '⚠️ 오늘의 '+label+' 횟수를 모두 소모했습니다.\n일일 이용 횟수 : '+displayNumber(count)+' / '+displayNumber(max)+'회'; }
// Reject trailing arguments before randomness, spending, attendance or cooldown changes.
function validateCommandInput(utterance) {
 const input=String(utterance||'').trim().replace(/\s+/g,' '),parts=input.split(' '),root=parts[0],arg=parts.slice(1).join(' ');
 const rules={'/파밍':[''],'/사냥':[''],'/던전':[''],'/크리처':['','뽑기'],'/크리처뽑기':[''],'/제련':['','강화'],'/제련강화':['']};
 if(Object.hasOwn(rules,root)&&!rules[root].includes(arg))return '⚠️ 올바른 명령어를 입력해 주세요.\n사용법 : '+(root==='/크리처'?'/크리처 또는 /크리처 뽑기':root==='/제련'?'/제련 또는 /제련 강화':root)+'\n요청은 실행되지 않았습니다.';
 return '';
}
function normalizeEquippedCosmetics(p) {
 for(const [owned,equipped] of [['ownedTitles','equippedTitle'],['ownedAvatars','equippedAvatar']]) {
  p[owned]=[...new Set((Array.isArray(p[owned])?p[owned]:[]).filter(x=>typeof x==='string'&&x.trim()))];
  const candidate=typeof p[equipped]==='string'?p[equipped]:'';
  p[equipped]=p[owned].includes(candidate)?candidate:'';
 }
 p.title=p.equippedTitle;
 p.equippedAvatarIndex=p.ownedAvatars.indexOf(p.equippedAvatar);
}
function rollMonsterGem(grade){
 switch(grade){case 'A등급':return Math.random()<.5?1:0;case 'A+등급':return rand(1,5);case 'S등급':return rand(5,10);case 'S+등급':return rand(10,30);case 'EX등급':return 50;case 'EX+등급':return 100;default:return 0;}
}
function imprintOptionLabel(opt){return ({critDmg:'치명타 데미지',cashBoost:'현금 획득량',critRate:'치명타 확률',critWeight:'치명타 확률 가중치',enhanceCostDown:'강화 비용',expBoost:'경험치 획득량',combatBoost:'공격력'})[opt.key]||opt.name;}
function imprintOptionValue(opt){return (opt.key==='enhanceCostDown'?'-':'+')+opt.value+(opt.unit||'');}
function boxDisplayName(box) { return '['+({farm:'파밍',hunt:'사냥',raid:'레이드'}[box.source])+'] '+(box.source==='hunt'?box.key+'등급 ':'')+box.name; }
function shortageText(profile,costs) {
 const rows=[['cash','💵 현금','원'],['gold','🧈 금괴','개'],['gem','💎 보석','개'],['keys','🔑 비밀열쇠','개'],['supplyItem','📦 보급','개']]
 .filter(([key])=>Number(costs[key])>0)
 .map(([key,label,unit])=>label+' : 필요 '+displayNumber(costs[key])+unit+' / 보유 '+displayNumber(profile[key]||0)+unit);
 return ['⚠️ 재화가 부족합니다.','',...rows].join('\n');
}
function maximumText(label,level) {return '✨ 최고 단계에 도달했습니다.\n'+label+' : '+level;}

// 게임 상태·URL·시각은 변경하지 않고, 사용자에게 전달하는 문구만 정리한다.
function formatDisplayText(text) {
  if(typeof text!=='string')return text;
  return text.replace(/https?:\/\/[^\s]+|\b\d{1,2}:\d{2}(?::\d{2})?\b|[ \t]*:[ \t]*/g,
    token=>token.includes('://') || /^\d/.test(token) ? token : ' : ');
}
function formatDisplayResult(result) {
  if(result && typeof result.text==='string')result.text=formatDisplayText(result.text);
  return result;
}
function spentResourceText(profile,spent) {
  return enhanceResourceText(profile);
}
function enhancementCostText(costs) { return currencyCostText("강화",costs); }
function currencyCostText(kind,costs) {
  const rows=[['cash','💵 현금','원'],['gold','🧈 금괴','개'],['gem','💎 보석','개']]
    .filter(([key])=>Number(costs[key])>0)
    .map(([key,label,unit])=>label+' : '+displayNumber(costs[key])+unit);
  return ['💰 '+kind+' 비용 :',...(rows.length?rows:['무료'])].join('\n');
}
// URL 경로·쿼리는 보존하고 마지막 이미지 파일명만 대문자로 통일한다.
function normalizeImageFilename(value) {
  if(typeof value!=='string')return value;
  const index=value.search(/[?#]/),path=index<0?value:value.slice(0,index),suffix=index<0?'':value.slice(index);
  return path.replace(/([^/]+)\.(png|jpe?g|webp|gif)$/i,(_,name,ext)=>name.toUpperCase()+'.'+ext.toLowerCase())+suffix;
}

const BEGINNER_GUIDE = "🎉 몬스터사냥이 체질입니다에 오신 걸 환영합니다!\n\n🌱 처음이라면 이렇게 시작하세요!\n\n① /파밍 — 몬스터에 도전하기\nHP가 다할 때까지 몬스터에 도전하세요.\n처치 기록에 따라 받은 상자는 /상자에서 확인할 수 있어요!\n\n② /사냥 — 재화 모으기\n몬스터를 만나 현금과 보석을 획득하세요.\n같은 몬스터의 기본·+등급을 모두 처치하면 컬렉션이 완성됩니다!\n\n③ /강화 — 무기 성장시키기\n현금을 사용해 무기를 강화하세요.\n⚠️ 단계에 따라 유지·하락·파괴가 발생할 수 있어요.\n\n매일 첫 사냥·파밍을 진행하면 자동으로 출석 처리됩니다!\n내 상태는 /프로필, 전체 명령어는 /도움말로 확인하세요.\n이 안내는 /가이드로 다시 볼 수 있어요.";
const BEGINNER_CHOICES = ['/사냥','/파밍','/강화','/프로필','/도움말'].map(label => ({label,action:label}));

const MAX_ITEM_USE_PER_REQUEST = 1000;
function parseStrictPositiveInteger(value){const text=String(value==null?'':value).trim();if(!/^[1-9]\d*$/.test(text))return null;const n=Number(text);return Number.isSafeInteger(n)?n:null;}
function displayNumber(value){return Number(value).toLocaleString('en-US');}
function parseItemCount(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return 1;
  if (!/^[1-9]\d*$/.test(text)) return null;
  const count = Number(text);
  return Number.isSafeInteger(count) && count <= MAX_ITEM_USE_PER_REQUEST ? count : null;
}
function enhanceShortageText(profile,row){
 const cash=Math.floor(row.cost*(1-weaponDiscount(profile)/100));
 return shortageText(profile,{cash,gem:profile.job ? row.gemCost||0 : 0});
}

const SUBWEAPON_CATALOG = {
  "warrior": {
    "type": "검집",
    "names": [
      "훈련병의 나무 검집",
      "가죽끈 검집",
      "단단한 참나무 검집",
      "철테 검집",
      "청동 사자 검집",
      "수호병의 강철 검집",
      "기사의 은장 검집",
      "붉은 늑대 검집",
      "흑철 요새 검집",
      "백은 맹세 검집",
      "왕실 근위 검집",
      "불꽃 문양 검집",
      "서리 맹약 검집",
      "천둥의 검집",
      "용비늘 검집",
      "불굴의 성채 검집",
      "태양기사의 검집",
      "심연 봉인 검집",
      "별을 품은 검집",
      "왕의 귀환 검집",
      "영원한 승리의 검집"
    ],
    "desc": [
      "기본 발도 자세를 익히도록 무게를 맞춘 나무 검집.",
      "질긴 가죽끈이 허리를 단단히 잡아 빠른 발도를 돕는다.",
      "오랜 세월 자란 참나무가 거친 충격을 받아낸다.",
      "입구에 두른 철테가 칼날을 곧게 이끈다.",
      "사자 문양의 청동 장식에 전사의 용기를 새겼다.",
      "수많은 경계 근무에도 뒤틀리지 않는 강철 검집.",
      "은빛 장식이 흔들림을 줄여 기사의 검로를 지킨다.",
      "늑대 가죽으로 감싸 손에 착 붙는 붉은 검집.",
      "검은 철판을 겹쳐 작은 요새처럼 단단하게 만들었다.",
      "흰 은판에 동료를 지키겠다는 맹세가 새겨져 있다.",
      "왕을 호위하는 근위대장에게 수여되는 정교한 검집.",
      "칼을 뽑을 때마다 불꽃 문양이 붉게 빛난다.",
      "차가운 서리 문양이 전사의 흐트러진 호흡을 가다듬는다.",
      "발도 순간 낮은 천둥소리가 울려 퍼진다.",
      "겹겹이 엮은 용비늘이 칼날의 힘을 고스란히 품는다.",
      "무너진 성채에서도 끝까지 남은 수호자의 유품.",
      "태양 문장을 품어 긴 전투 속에서도 광채를 잃지 않는다.",
      "검집 안쪽의 봉인이 검에 깃든 심연을 잠재운다.",
      "밤하늘의 별빛이 칼날을 따라 검집 속으로 흘러든다.",
      "왕의 귀환을 기다리며 수백 년간 칼날을 지킨 검집.",
      "수많은 승리의 서약을 품은 전사의 최종 검집."
    ]
  },
  "archer": {
    "type": "화살통",
    "names": [
      "견습 사냥꾼의 화살통",
      "가죽 화살통",
      "자작나무 화살통",
      "깃털 장식 화살통",
      "숲지기의 화살통",
      "매의 눈 화살통",
      "바람결 화살통",
      "은잎 화살통",
      "늑대 추적자 화살통",
      "초승달 화살통",
      "왕실 궁수의 화살통",
      "폭풍깃 화살통",
      "서리매 화살통",
      "번개줄기 화살통",
      "용날개 화살통",
      "황혼 순찰자 화살통",
      "태양깃 화살통",
      "공허 추적자 화살통",
      "별무리 화살통",
      "천공의 지배자 화살통",
      "백발백중의 성좌"
    ],
    "desc": [
      "화살을 꺼내는 동작부터 익히는 견습용 화살통.",
      "부드러운 가죽이 화살촉이 부딪치는 소리를 줄인다.",
      "가벼운 자작나무로 만들어 숲길을 달리기 편하다.",
      "깃털 장식이 바람의 방향을 알려준다.",
      "나무껍질 무늬가 울창한 숲속에서 모습을 감춘다.",
      "매의 문장이 새겨진 사냥꾼의 소중한 화살통.",
      "허리 움직임에 맞춰 유연하게 흔들리는 화살통.",
      "은빛 나뭇잎 장식이 화살깃을 가지런히 지킨다.",
      "늑대를 쫓던 궁수가 긴 추적에 맞게 개량했다.",
      "초승달처럼 휘어진 덮개가 화살을 비로부터 보호한다.",
      "왕실의 명사수에게 지급되는 균형 잡힌 화살통.",
      "폭풍새의 깃털로 안감을 대어 놀랍도록 가볍다.",
      "서리매의 푸른 무늬가 설원에서도 선명하게 빛난다.",
      "번개가 스친 나무로 만들어 미세한 울림이 남아 있다.",
      "용의 날개막을 덧대어 먼 원정에도 닳지 않는다.",
      "황혼의 경계를 지키던 순찰대장의 화살통.",
      "황금빛 깃털이 날아갈 화살에 태양의 색을 입힌다.",
      "소리 없는 공허를 지나온 추적자의 검은 화살통.",
      "화살을 뽑을 때마다 작은 별빛이 손끝에 묻어난다.",
      "구름 위의 사냥터를 누비던 명궁의 유산.",
      "모든 별이 한 표적을 가리키는 전설의 화살통."
    ]
  },
  "wizard": {
    "type": "오브",
    "names": [
      "견습생의 유리 오브",
      "희미한 마력 오브",
      "푸른 수정 오브",
      "룬 문양 오브",
      "새벽 이슬 오브",
      "현자의 숨결 오브",
      "은빛 조율 오브",
      "불꽃 심장 오브",
      "서리꽃 오브",
      "천둥 구름 오브",
      "마도학자의 오브",
      "원소 회랑 오브",
      "달빛 공명 오브",
      "시간의 모래 오브",
      "용의 기억 오브",
      "황혼의 진리 오브",
      "태양의 핵 오브",
      "심연의 눈 오브",
      "별의 탄생 오브",
      "창세의 빛 오브",
      "무한한 지혜의 오브"
    ],
    "desc": [
      "마력의 흐름을 관찰하기 위한 작은 유리 구슬.",
      "손바닥에서 희미한 마력의 빛을 내뿜는다.",
      "맑은 청색 수정이 흩어진 마력을 모은다.",
      "표면에 새긴 기초 룬이 마력의 흐름을 정돈한다.",
      "새벽 이슬을 품어 안쪽에 잔잔한 물결이 보인다.",
      "오랜 현자가 남긴 따뜻한 마력의 흔적을 담았다.",
      "은빛 고리가 흔들리는 마력을 일정하게 맞춘다.",
      "구슬 속 작은 불씨가 심장처럼 규칙적으로 뛴다.",
      "결코 녹지 않는 서리꽃이 투명한 중심에 피어 있다.",
      "손끝에 올리면 작은 먹구름과 번개가 맴돈다.",
      "수많은 연구 기록이 빛의 문자로 새겨져 있다.",
      "여러 원소의 빛이 서로 부딪치지 않고 순환한다.",
      "달빛을 받으면 낮은 공명음으로 주인에게 답한다.",
      "멈추지 않는 모래가 마력의 박자를 재어 준다.",
      "고대 용이 보았던 풍경이 수정 속에 스쳐 지나간다.",
      "해가 지는 순간에만 읽히는 진리의 문장을 품었다.",
      "작은 태양처럼 빛나지만 손안에서는 따뜻하기만 하다.",
      "심연을 바라본 마법사가 봉인한 검은 눈동자.",
      "새로운 별이 태어나는 찰나를 수정 속에 담았다.",
      "세상이 처음 빛났던 순간을 닮은 순백의 오브.",
      "끝없는 질문과 깨달음을 품은 대마법사의 보조 오브."
    ]
  },
  "thief": {
    "type": "수리검",
    "names": [
      "수련용 철표창",
      "날선 삼각 표창",
      "검은 깃 표창",
      "쌍갈래 수리검",
      "그믐달 표창",
      "밤안개 수리검",
      "은빛 독사 표창",
      "그림자 발톱",
      "붉은 전갈 수리검",
      "무음의 표창",
      "암영단의 수리검",
      "유령걸음 표창",
      "서리 송곳 수리검",
      "뇌광 표창",
      "용송곳니 수리검",
      "황혼 암살자의 표창",
      "검은 태양 수리검",
      "심연의 꽃 표창",
      "별을 가르는 수리검",
      "죽음의 속삭임",
      "영원한 암영의 수리검"
    ],
    "desc": [
      "던지는 자세를 익히도록 날을 무디게 만든 철표창.",
      "세 모서리를 고르게 갈아 회전이 안정적이다.",
      "검은 깃 장식이 밤의 옷자락에 자연스럽게 섞인다.",
      "두 갈래 날이 매끄러운 곡선을 그리며 날아간다.",
      "그믐달처럼 얇은 날을 지닌 작고 날렵한 표창.",
      "밤안개를 닮은 무광 표면이 빛의 반사를 줄인다.",
      "독사의 몸짓을 본떠 구불구불한 날을 새겼다.",
      "그림자 짐승의 발톱처럼 짧고 날카로운 투척 무기.",
      "전갈의 꼬리를 닮은 붉은 날이 인상적인 수리검.",
      "바람을 가르는 소리를 줄이도록 날을 다듬었다.",
      "암영단의 정예에게만 주어지는 비밀 문장 수리검.",
      "유령처럼 흔적 없이 임무를 마친 도적의 표창.",
      "차가운 송곳 같은 날이 푸른 빛을 머금는다.",
      "번쩍이는 궤적이 뇌광을 닮은 은백색 표창.",
      "용의 송곳니 조각을 중심에 고정한 수리검.",
      "황혼에만 모습을 드러내던 암살자의 마지막 유품.",
      "검은 태양 문양을 중심으로 날이 방사형으로 펼쳐진다.",
      "심연에서 피어난 꽃처럼 겹겹의 날을 가진 표창.",
      "별빛을 가를 만큼 얇고 정밀하게 연마한 수리검.",
      "손안에서조차 존재감이 희미한 전설의 투척 무기.",
      "어떤 밤에도 주인의 손길을 기억하는 궁극의 수리검."
    ]
  }
};

// 보조무기는 1차 계열에 종속되며 2차 전직 후에도 강화 단계를 유지한다.
// +0에는 보너스가 없고, 강화 단계에 따라 사냥 등급의 상대 가중치만 조정한다.
function getSubweaponLevel(profile) {
  return getBaseJobCode(profile) ? normalizeStoredInt(profile.subweaponEnhance, 0, 0, 20) : 0;
}
const SUBWEAPON_GRADE_BONUS = {E:-0.1,D:-0.05,C:0.1,B:0.1,A:0.05,S:0.01,EX:0.01};
function subweaponGradeText(level) {
  return Object.entries(SUBWEAPON_GRADE_BONUS).map(([grade,rate]) =>
    grade+'등급 등장 가중치 '+(rate*level>=0?'+':'')+(rate*level).toFixed(2)+'%');
}
function subweaponGradeDiff(before,after) {
  return Object.entries(SUBWEAPON_GRADE_BONUS).map(([grade,rate]) => {
    const fmt=n=>(rate*n>=0?'+':'')+(rate*n).toFixed(2)+'%';
    return grade+'등급 등장 가중치 '+fmt(before)+' ➔ '+fmt(after);
  }).join('\n');
}
function getSubweaponImage(profile) {
  const base = getBaseJobCode(profile);
  return SUBWEAPON_CATALOG[base] ? BASE_URL + '/' + base.toUpperCase() + '_AS_' + getSubweaponLevel(profile) + '.png' : null;
}
function getSubweaponInfo(profile) {
  const catalog = SUBWEAPON_CATALOG[getBaseJobCode(profile)];
  if (!catalog) return null;
  const level = getSubweaponLevel(profile);
  return { level, type:catalog.type, name:catalog.names[level], description:catalog.desc[level] };
}
function subweaponText(profile) {
  const info = getSubweaponInfo(profile);
  if (!info) return '보조무기는 1차 전직 이후 사용할 수 있습니다.';
  return ['🧰 [보조무기 · '+info.type+']','+'+info.level+' '+info.name,'📖 '+info.description,'',
    ...subweaponGradeText(info.level),'','기존 등급 가중치에 비율 적용 · 몬스터 확률 합계 정규화',
    '/보조강화 : 1회 강화','/보조강화 15 : +15까지 강화'].join('\n');
}
function processSubweaponEnhance(profile, arg = '') {
  ensureEnhanceLedger(profile);

  if (!getSubweaponInfo(profile)) return {text:'보조무기는 1차 전직 이후 강화할 수 있습니다.'};
  const text = String(arg).trim(), repeated = text !== '';
  const target = repeated && /^[1-9]\d*$/.test(text) ? Number(text) : repeated ? NaN : 20;
  if (!Number.isInteger(target) || target < 1 || target > 20) return {text:'사용법: /보조강화 또는 /보조강화 [목표 단계 1~20]'};
  const initial = getSubweaponLevel(profile);
  if (initial >= 20) return {text:maximumText('🧰 보조무기','+20 '+getSubweaponInfo(profile).name)};
  const eligiblePity=enhancementPityProgress(profile,true);
  if(initial<20 && eligiblePity.spent>=eligiblePity.threshold)return claimEnhancePity(profile,true);
  if (initial >= target) return {text:'이미 목표 강화 단계에 도달했습니다.\n\n'+subweaponText(profile)};
  const pity=enhancementPityProgress(profile,true);
  if(pity.spent>=pity.threshold)return claimEnhancePity(profile,true);
  let attempted=0, cash=0, gems=0, success=0, keep=0, drop=0, destroy=0;
  const limit = repeated ? 100000 : 1;
  const bonus = (getCombinedGrowthInfo(profile).successBonus + getImprintTotalBonus(profile,'enhanceSuccess'))/100;
  const discount = weaponDiscount(profile);
  profile.subweaponEnhance = initial;
  while (profile.subweaponEnhance < target && attempted < limit) {
    if(pity.spent+cash>=pity.threshold)break;
    const row = JOB_ENHANCE_TABLE[profile.subweaponEnhance];
    const cost = Math.max(0, Math.floor(row.cost*(1-discount/100))), gemCost = row.gemCost || 0;
    if (profile.cash < cost || (profile.gem||0) < gemCost) break;
    profile.cash -= cost; profile.gem = (profile.gem||0)-gemCost;
    cash+=cost; gems+=gemCost; attempted++;
    const roll = Math.random(), sr = Math.min(1,row.success+bonus), kr = Math.max(0,row.keep-bonus);
    if (roll < sr) { profile.subweaponEnhance++; success++; }
    else if (roll < sr+kr) keep++;
    else if (roll < sr+kr+(row.drop||0)) { profile.subweaponEnhance=Math.max(0,profile.subweaponEnhance-1); drop++; }
    else { profile.subweaponEnhance=0; destroy++; }
    profile.maxSubweaponEnhanceHistory = Math.max(profile.maxSubweaponEnhanceHistory||0,profile.subweaponEnhance);
  }
  recordEnhanceSpend(profile,'sub',cash);
  profile.totalSubweaponEnhanceCost = (profile.totalSubweaponEnhanceCost||0)+cash;
  let reason = profile.subweaponEnhance>=target ? '목표 강화 달성!' : pity.spent+cash>=pity.threshold ? '천장에 도달하여 목표 강화를 중단했습니다.' : attempted<limit ? enhanceShortageText(profile,JOB_ENHANCE_TABLE[profile.subweaponEnhance]) : repeated ? '100,000회에서 중단했습니다. 같은 명령으로 이어갈 수 있습니다.' : '1회 강화 완료.';
  const info=getSubweaponInfo(profile);
  if(!attempted) return {text:reason+'\n\n'+enhanceResourceText(profile)};
  const heading=repeated ? '🔨 [목표 +'+target+' 강화 · '+displayNumber(attempted)+'회 시도]' : success ? '🔨 [강화 성공]' : keep ? '⏸️ [강화 유지]' : drop ? '🔻 [강화 하락]' : '💥 [강화 파괴]';
  const lines=[repeated ? heading : heading+' +'+initial+' ➔ +'+info.level,'',
    '🧰 보조무기 : +'+info.level+' '+info.name,'📖 '+info.description,'',
    subweaponGradeDiff(initial,info.level)];
  if(repeated) lines.splice(1,0,'강화 단계: +'+initial+' ➔ +'+info.level,reason,'📊 성공: '+displayNumber(success)+'회 | 유지: '+displayNumber(keep)+'회 | 하락: '+displayNumber(drop)+'회 | 파괴: '+displayNumber(destroy)+'회');
  lines.push('',enhancementCostText({cash,gem:gems}),'',spentResourceText(profile,{cash,gem:gems}));
  const notice=enhancementPityNotice(profile,true);
  if(notice)lines.push('',notice);
  return {text:lines.join('\n'), imageUrl:getSubweaponImage(profile)};
}

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
  "warrior": {
    "tier": 1,
    "passive": "철벽",
    "active": "불굴",
    "passiveDesc": "받는 피해 2~20% 감소",
    "activeDesc": "피격 스택 최대100 소비: HP 회복, 다음3회 처치 보정",
    "daily": 3
  },
  "berserker": {
    "tier": 2,
    "passive": "광전사의 피",
    "active": "폭주",
    "passiveDesc": "잃은 HP 비율에 따라 처치 가중치 증가",
    "activeDesc": "/스킬 2 활성화·비활성화, 발동률6~15%, 현재HP20% 소비, 재화4배",
    "daily": 0
  },
  "swordmaster": {
    "tier": 2,
    "passive": "검의 경지",
    "active": "검 선택",
    "passiveDesc": "카운터 Lv당 +0.3%p",
    "activeDesc": "대검·광검·도 중 하나 선택",
    "daily": 0
  },
  "battlemage": {
    "tier": 2,
    "passive": "마력 추적",
    "active": "차원 균열",
    "passiveDesc": "C~EX 출현 가중치 Lv당 +1%",
    "activeDesc": "마검사 전용 던전 · 스킬 레벨당 일일 1회 (Lv.1 1회~Lv.10 10회)",
    "daily": 0
  },
  "archer": {
    "tier": 1,
    "passive": "변이 추적",
    "active": "연속 수렵",
    "passiveDesc": "+등급 출현 확률 Lv당 +0.1%p",
    "activeDesc": "사냥20회 독립 시행, 횟수·퀘스트·패스 증가 없음",
    "daily": 3
  },
  "sniper": {
    "tier": 2,
    "passive": "정밀 조준",
    "active": "현상금 저격",
    "passiveDesc": "치명타 확률 Lv당 +1%p",
    "activeDesc": "E~EX 현상금 표적 추첨 및 현금, S/EX 금괴 보너스",
    "daily": 2
  },
  "ranger": {
    "tier": 2,
    "passive": "레이드 추적",
    "active": "덫 설치",
    "passiveDesc": "레이드 조우 가중치 Lv당 +20%",
    "activeDesc": "덫1개 설치, 1/5/10/23시간에 보상 성장",
    "daily": 2
  },
  "hawkeye": {
    "tier": 2,
    "passive": "끝없는 추적",
    "active": "표적 사격",
    "passiveDesc": "파밍·사냥 한도 각각 Lv당 +1%",
    "activeDesc": "0~10점 3회 합산, 점수별 보상",
    "daily": 2
  },
  "wizard": {
    "tier": 1,
    "passive": "효율적 주문",
    "active": "",
    "passiveDesc": "무기·보조무기 현금 강화 비용 Lv당 -1% · 마력 이해: 파밍 경험치 Lv당 +1%",
    "activeDesc": "",
    "daily": 3
  },
  "archmage": {
    "tier": 2,
    "passive": "선공의 법칙",
    "active": "연속 대결",
    "passiveDesc": "먼저 대결 요청하면 반드시 승리",
    "activeDesc": "/대결 닉네임 횟수 또는 /대결 횟수, 일일10회 안에서 정산",
    "daily": 0
  },
  "elementalist": {
    "tier": 2,
    "passive": "마법 연구",
    "active": "원소 도박",
    "passiveDesc": "매일 화염/번개/냉기/희귀 연구, 파밍·사냥만 적용",
    "activeDesc": "/스킬 2 시작 이지|하드 재화 수량, 최대3연승",
    "daily": 2
  },
  "necromancer": {
    "tier": 2,
    "passive": "영혼 수확",
    "active": "영혼 교환",
    "passiveDesc": "파밍 처치당 영혼1개, 배속 반영",
    "activeDesc": "/스킬 2 교환 현금|금괴|보석|비밀열쇠 수량",
    "daily": 0
  },
  "thief": {
    "tier": 1,
    "passive": "보물 감각",
    "active": "일일상점 선물",
    "passiveDesc": "희귀 재화 이벤트 가중치 Lv당 +1%",
    "activeDesc": "일일상점 상품 중 하나 랜덤 무료 획득",
    "daily": 3
  },
  "shadow": {
    "tier": 2,
    "passive": "분신",
    "active": "암시장",
    "passiveDesc": "Lv당1% 확률로 파밍·사냥 재화2배",
    "activeDesc": "/스킬 2 또는 /암시장, 상품별 하루1회 구매",
    "daily": 0
  },
  "assassin": {
    "tier": 2,
    "passive": "약탈",
    "active": "소매치기",
    "passiveDesc": "Lv당1%p 확률로 파밍 처치 현금 추가 획득",
    "activeDesc": "상인·광부·보석상·귀족 선택 강탈",
    "daily": 2
  },
  "dualblade": {
    "tier": 2,
    "passive": "쌍검 연격",
    "active": "전장 난입",
    "passiveDesc": "레이드 피해량20% 증가",
    "activeDesc": "발견된 살아 있는 레이드 강제 공격, 최초발견 불가",
    "daily": 2
  }
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
  if(st.rulesVersion!==2){st.rulesVersion=2;st.buffs={};}
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
  if (!def || jobCode==='wizard') return 0;
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
  { id:'jobenh10', name:'전직 무기 숙련', desc:'1차·2차 전직 무기 중 최고 +10 달성', type:'jobEnhance', target:10 },
  { id:'jobenh20', name:'전직 무기 초월', desc:'1차·2차 전직 무기 중 최고 +20 달성', type:'jobEnhance', target:20 },
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

function getActiveSkillParams(profile,jobCode){return {level:getJobSkillLevelFor(profile,jobCode)};}
function isJobSkillMaster(profile,jobCode){return getJobSkillLevelFor(profile,jobCode)>=10;}
function getMasterEffectDescription(){return 'Lv.10: 해당 스킬의 성장 수치 최대 적용';}
function getPendingSkillEffects(profile){const s=jobState(profile),st=ensureSkillState(profile);return ['피격 스택: '+s.stacks,'영혼: '+st.souls,...(s.rage?['폭주 활성화']:[]),...(s.sword?['선택 검: '+s.sword]:[]),...(s.trap?['덫 설치 중']:[]),...(s.gamble?['도박 진행 중']:[]),...(skillLevel(profile,'elementalist')?['오늘 연구: '+research(profile).name]:[])];}

function formatSkillNumber(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return n.toFixed(digits).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function getActiveSkillDescription(profile,jobCode){return JOB_SKILLS[jobCode]?.activeDesc||'';}

//
// game.js - 카카오 챗봇 호환 전체 통합 스크립트
//

const VAULT_CAPACITY_PER_LEVEL = 2000000;
const EXP_PER_LEVEL_BASE = 200;
const FARM_DAILY_LIMIT = 500;
const FARM_QUEST_REWARDS = [[10,10000,0],[50,15000,0],[100,20000,1],[250,25000,1],[500,30000,1],[750,40000,2],[1000,50000,2]];
const HUNT_QUEST_REWARDS = [[100,10000,0],[250,15000,0],[500,20000,1],[1000,25000,1],[2000,30000,1],[3000,40000,1],[4000,50000,2]];
const FARM_QUEST_MILESTONES = FARM_QUEST_REWARDS.map(row=>row[0]);
const JOB_UNLOCK_CASH = 10000000;
const JOB_UNLOCK_GOLD = 300;
const JOB_CHANGE_CASH = 20000000;
const JOB_CHANGE_GOLD = 500;
const JOB_CHANGE_GEM = 500;
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

// 크리처 등급별 이미지 번호 (CREATURE_XXXX.png 형식)
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
  return `${BASE_URL}/images/CREATURE_${chosenId}.png`;
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
    "goldChance": 0.005
  },
  "C": {
    "name": "C등급 상자",
    "minCash": 1000,
    "maxCash": 2000,
    "minGold": 1,
    "maxGold": 1,
    "minGem": 1,
    "maxGem": 1,
    "goldChance": 0.01,
    "gemChance": 0.005
  },
  "B": {
    "name": "B등급 상자",
    "minCash": 2000,
    "maxCash": 3000,
    "minGold": 1,
    "maxGold": 1,
    "minGem": 1,
    "maxGem": 1,
    "goldChance": 0.05,
    "gemChance": 0.025,
    "bonusBox": "A",
    "bonusBoxChance": 0.01
  },
  "A": {
    "name": "A등급 상자",
    "minCash": 3000,
    "maxCash": 10000,
    "minGold": 1,
    "maxGold": 2,
    "minGem": 1,
    "maxGem": 2,
    "goldChance": 0.1,
    "gemChance": 0.05,
    "bonusBox": "S",
    "bonusBoxChance": 0.01,
    "monthlyTitleChance": 1
  },
  "S": {
    "name": "S등급 상자",
    "minCash": 10000,
    "maxCash": 50000,
    "minGold": 1,
    "maxGold": 5,
    "minGem": 1,
    "maxGem": 5,
    "goldChance": 0.2,
    "gemChance": 0.1,
    "bonusBox": "EX",
    "bonusBoxChance": 0.01,
    "monthlyTitleChance": 1
  },
  "EX": {
    "name": "EX등급 상자",
    "minCash": 50000,
    "maxCash": 100000,
    "minGold": 5,
    "maxGold": 10,
    "minGem": 5,
    "maxGem": 10,
    "bonusBox": "EX+",
    "bonusBoxChance": 0.01,
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
    if (count >= 2) { result.cashPct += n/100; result.active.push(`[${tier}] ${setName} 2세트: 현금 +${displayNumber(n)}%`); }
    if (count >= 4) { result.critRate += n; result.active.push(`[${tier}] ${setName} 4세트: 치명타 +${displayNumber(n)}%p`); }
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
      lines.push(`[${tier}] ${setName} : ${displayNumber(count)}/6부위${count>=6?' ✅ 6세트':count>=4?' ✅ 4세트':count>=2?' ✅ 2세트':''}`);
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
  { cost: 1000000, success: 0.30, keep: 0.60, drop: 0.10, destroy: 0.00, gemCost: 1 },
  { cost: 1250000, success: 0.27, keep: 0.62, drop: 0.10, destroy: 0.01, gemCost: 2 },
  { cost: 1500000, success: 0.24, keep: 0.65, drop: 0.10, destroy: 0.01, gemCost: 4 },
  { cost: 1750000, success: 0.21, keep: 0.68, drop: 0.10, destroy: 0.01, gemCost: 6 },
  { cost: 2000000, success: 0.18, keep: 0.71, drop: 0.10, destroy: 0.01, gemCost: 8 },
  { cost: 2250000, success: 0.15, keep: 0.79, drop: 0.01, destroy: 0.05, gemCost: 10 },
  { cost: 2500000, success: 0.12, keep: 0.80, drop: 0.01, destroy: 0.07, gemCost: 15 },
  { cost: 2750000, success: 0.10, keep: 0.80, drop: 0.01, destroy: 0.09, gemCost: 20 },
  { cost: 3000000, success: 0.08, keep: 0.80, drop: 0.01, destroy: 0.11, gemCost: 25 },
  { cost: 3500000, success: 0.06, keep: 0.80, drop: 0.01, destroy: 0.13, gemCost: 30 },
  { cost: 4000000, success: 0.04, keep: 0.80, drop: 0.01, destroy: 0.15, gemCost: 40 },
];


// 2차 전직 전용 강화표
// - 성공/유지/하락/파괴 확률은 1차 전직 JOB_ENHANCE_TABLE과 동일
// - 현금 비용은 1차 전직 대비 5배 유지
// - +0 → +1부터 보석 5개, 이후 단계마다 5개씩 증가
const SECOND_JOB_ENHANCE_TABLE = JOB_ENHANCE_TABLE.map((row, index) => ({
  ...row,
  cost: row.cost * 5,
  gemCost: (index + 1) * 5
}));

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
  { cashCost: 10000000, goldCost: 0, success: 0.90, keep: 0.10, destroy: 0.000, drop: 0.00 },
  { cashCost: 15000000, goldCost: 5, success: 0.80, keep: 0.20, destroy: 0.000, drop: 0.00 },
  { cashCost: 20000000, goldCost: 10, success: 0.70, keep: 0.25, destroy: 0.000, drop: 0.05 },
  { cashCost: 25000000, goldCost: 15, success: 0.50, keep: 0.40, destroy: 0.000, drop: 0.10 },
  { cashCost: 30000000, goldCost: 20, success: 0.40, keep: 0.575, destroy: 0.025, drop: 0.00 },
  { cashCost: 35000000, goldCost: 25, success: 0.30, keep: 0.65, destroy: 0.050, drop: 0.00 },
  { cashCost: 40000000, goldCost: 30, success: 0.20, keep: 0.725, destroy: 0.075, drop: 0.00 },
  { cashCost: 45000000, goldCost: 35, success: 0.10, keep: 0.80, destroy: 0.100, drop: 0.00 },
  { cashCost: 50000000, goldCost: 40, success: 0.05, keep: 0.80, destroy: 0.150, drop: 0.00 },
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

// 공명은 증폭과 같은 비용/효과 곡선을 사용하지만 보석으로 강화한다.
for (const row of AMPLIFY_TABLE) {
  row.critWeight=row.level*0.005;
  row.counterWeight=row.level*0.005;
  row.fullCounterWeight=row.level*0.005;
  row.farmBonus=row.level*25;
  row.speedBonus=row.level;
}
const RESONANCE_TABLE = AMPLIFY_TABLE.map(row => ({level:row.level,costNext:row.costNext,
  minGem:row.minGold,maxGem:row.maxGold,multBonus:row.multBonus,
  highGradeWeight:row.level*.01,plusGradeWeight:row.level*.01,
  refineSuccessBonus:row.level*.5,dungeonBonus:row.level,huntBonus:row.level*100,speedBonus:row.level}));
function getResonanceInfo(profile) {
  return RESONANCE_TABLE[normalizeStoredInt(profile && profile.resonanceLevel,0,0,10)];
}
function getCombinedGrowthLevel(profile) {
  return normalizeStoredInt(profile && profile.combatLevel,0,0,10) + getResonanceInfo(profile).level;
}
function getCombinedGrowthInfo(profile, combatLevel = profile && profile.combatLevel) {
  const amp = getAmplifyInfo(combatLevel), resonance = getResonanceInfo(profile);
  return {...amp, multBonus:amp.multBonus+resonance.multBonus, critWeight:amp.critWeight, successBonus:amp.successBonus};
}
const RESONANCE_CHOICES = [{label:'/공명 강화',action:'/공명 강화'}];



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
  { name: '강화 비용 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceCostDown' },
  { name: '경험치 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'expBoost' },
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
  if (statusType === 'destroy' && enhanceLevel > 0) return BASE_URL + '/FAIL.png';
  const level = normalizeWeaponLevel(enhanceLevel);
  const prefix = Object.hasOwn(JOB_WEAPON_IMAGE_PREFIX, job) ? JOB_WEAPON_IMAGE_PREFIX[job] : 'enhance';
  return BASE_URL + '/' + prefix.toUpperCase() + '_' + level + '.png';
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
  return profile && Array.isArray(profile.ownedAvatars) && profile.ownedAvatars.includes(profile.equippedAvatar) && profile.equippedAvatar ? 0.10 : 0;
}

function getTitleMultiplierBonus(profile) {
  return profile && Array.isArray(profile.ownedTitles) && profile.ownedTitles.includes(profile.equippedTitle) && profile.equippedTitle ? 0.10 : 0;
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
  return Math.floor(goldAmount + cBonus.bonusGold);
}

function applyCreatureGemBonus(gemAmount, profile) {
  if (gemAmount <= 0) return 0;
  const cBonus = getCreatureBonus(profile);
  return gemAmount + cBonus.bonusGem;
}

// 파밍·사냥 현금 지급과 프로필이 공유하는 상시 보정. 배속/확률 발동은 제외.
function getCombatCashFactors(profile) {
  const base=getGoldMultiplier(profile); // 크리처 현금 옵션도 여기서 한 번만 가산.
  const equipment=1+getAvatarCashBonus(profile)+getEquipmentSetBonuses(profile).cashPct;
  const elemental=research(profile).cash;
  const achievement=1+getAchievementCashBonusPct(profile)/100;
  return {base,equipment,elemental,achievement,total:base*equipment*elemental*achievement};
}
function calculateCombatCash(profile,baseCash,runs=1) {
  const f=getCombatCashFactors(profile);
  return Math.floor(Math.floor(baseCash*f.base*f.equipment*f.elemental)*runs*f.achievement);
}
function getDedicatedExpMultiplier(profile) {
  return 1+(Math.max(0,getImprintTotalBonus(profile,'expBoost'))+skillLevel(profile,'wizard'))/100;
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
  const ampInfo = getCombinedGrowthInfo(profile);
  const refineBonus = ((profile && profile.refine) || 0) * 0.10; 
  const imprintCashBoost = getImprintTotalBonus(profile, 'cashBoost') / 100;
  const creatureCashPct = getCreatureBonus(profile).cashPct;
  return Number((baseMult + ampInfo.multBonus + refineBonus + imprintCashBoost + creatureCashPct + getTitleMultiplierBonus(profile)).toFixed(2));
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
    baseCrit = lvl * 0.20;
    baseCritDmg = lvl * 0.50;
    
    baseCounter = Math.max(0, lvl - 10) * 0.10;
    baseFullCounter = Math.max(0, lvl - 15) * 0.10;

  }

  const ampInfo = getCombinedGrowthInfo(profile, combatLevel);
  const imprintCritRate = getImprintTotalBonus(profile, 'critRate');
  const imprintCritWeight = getImprintTotalBonus(profile, 'critWeight');

  const collectionBonus = getMonsterCollectionBonus(profile);
  const baseJob = getBaseJobCode(profile);
  const secondJob = getSecondJobCode(profile);
  const archerCrit = skillLevel(profile,'sniper');
  const swordCounter = secondJob === 'swordmaster' ? getJobSkillLevelFor(profile, 'swordmaster') * 0.3 : 0;
  const gearSetBonus = getEquipmentSetBonuses(profile);
  const numCrit = Math.min(100, (baseCrit + imprintCritRate + archerCrit) * (1 + ampInfo.critWeight + (imprintCritWeight / 100)) + collectionBonus.critRate + gearSetBonus.critRate + normalizeStoredInt(profile && profile.refine,0,0,10)*0.5);
  const numCounter = Math.min(100,(baseCounter + collectionBonus.counterRate + swordCounter + gearSetBonus.counterRate)*(1+ampInfo.counterWeight));
  baseCritDmg += collectionBonus.critDmg + gearSetBonus.critDmg;
  const numFullCounter = Math.min(100,baseFullCounter*(1+ampInfo.fullCounterWeight));
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
    `치명타 데미지 +${oldStats.critDmg} ➔ +${newStats.critDmg}`,
    `　카운터 확률 ${oldStats.counter} ➔ ${newStats.counter}`,
    `풀카운터 확률 ${oldStats.fullCounter} ➔ ${newStats.fullCounter}`
  ].join('\n');
}

function refineOptionRows(level) {
  return [['배율',(level*.1).toFixed(2)],['치명타 확률',Number((level*.5).toFixed(1))+'%'],
    ['치명타 데미지',level+'%'],['공격력',(level*2)+'%'],['파밍 처치 확률 가중치',level+'%']];
}
function formatRefineStatDiff(oldRefine,newRefine) {
  const old=refineOptionRows(oldRefine);
  return refineOptionRows(newRefine).map(([label,value],i)=>'• '+label+' +'+old[i][1]+' ➔ +'+value).join('\n');
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
  if(isGameAdmin(profile.userId)&&Number.isSafeInteger(profile.adminAttackPower)&&profile.adminAttackPower>0&&profile.adminAttackPower<=1000000000000)return profile.adminAttackPower;
  const enhance = getCurrentEnhanceLevel(profile);
  const lvl = profile.level || 1;
  const refineLvl = profile.refine || 0;

  const basePower = (lvl * 100) + getWeaponAttackPower(profile) + getCollectionCombatPower(profile);
  const refineBonusMult = 1 + (refineLvl * 0.02);
  const imprintCombatBoost = getImprintTotalBonus(profile, 'combatBoost') / 100;
  
  const warriorBonus = 0;
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
  const wizardBonus = 0;
  const archmageBonus = 0;
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
    levelUpMessages.push(`🎉 [LEVEL UP!] Lv.${displayNumber(profile.level)} 달성!`);
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
  // 이전 버전에서 받은 보상은 유료 수준이었으므로 재지급하지 않는다.
  if (pass.rewardVersion !== 2) {
    pass.freeClaimedRewards = [...pass.claimedRewards];
    pass.paidClaimedRewards = [...pass.claimedRewards];
    pass.rewardVersion = 2;
    pass.premiumMonth = '';
  }
  for (const field of ['freeClaimedRewards', 'paidClaimedRewards']) {
    pass[field] = Array.isArray(pass[field]) ? [...new Set(pass[field].map(Number).filter(n => Number.isSafeInteger(n) && n >= 1))] : [];
  }
  if (pass.premiumMonth !== currentMonthStr) pass.premiumMonth = '';
  pass.lastAttendanceDate = typeof pass.lastAttendanceDate === 'string' ? pass.lastAttendanceDate : '';
  pass.dailyFarmExpClaimed = pass.dailyFarmExpClaimed === true;
  pass.dailyHuntExpClaimed = pass.dailyHuntExpClaimed === true;
  if (profile.seasonPass.lastDailyDate !== todayStr) {
    profile.seasonPass.lastDailyDate = todayStr;
    profile.seasonPass.dailyFarmExpClaimed = false;
    profile.seasonPass.dailyHuntExpClaimed = false;
  }
}

function claimAttendance(profile, automatic = false) {
  checkAndResetSeasonPass(profile);
  const today = getKSTDateString();
  if (profile.seasonPass.lastAttendanceDate === today) return null;
  profile.seasonPass.lastAttendanceDate = today;
  const reward = grantPassExp(profile,20);
  return (automatic ? '📅 [자동 출석 완료!]' : '📅 [출석 체크 완료!]') + '\n' + reward;
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
    msgs.push(`🎫 [시즌 패스] 경험치 +${displayNumber(amount)} 획득! (${displayNumber(pass.exp)}/100)`);
  }
  if (leveledUp) {
    msgs.push(`🎉 [시즌 패스 레벨업!] Lv.${oldLevel} ➔ Lv.${displayNumber(pass.level)}`);
  }

  return msgs.join('\n');
}

function claimDailyPassMissions(profile) {
  checkAndResetSeasonPass(profile);
  checkAndResetFarmLimit(profile);
  checkAndResetHuntLimit(profile);
  const lines = [];
  for (const mission of [
    { count: profile.farmData.count, threshold: 500, flag: 'dailyFarmExpClaimed', name: '파밍' },
    { count: profile.huntData.count, threshold: 2000, flag: 'dailyHuntExpClaimed', name: '사냥' }
  ]) {
    if (mission.count >= mission.threshold && !profile.seasonPass[mission.flag]) {
      const message = grantPassExp(profile, 50);
      profile.seasonPass[mission.flag] = true;
      lines.push('🏁 [시즌 패스 미션 달성] ' + mission.name + ' ' + displayNumber(mission.threshold) + '회 달성!\n' + message);
    }
  }
  return lines;
}

function passRewardAt(level, premium) {
  const reward = premium ? {cash:100000,gold:10,gem:5,keys:0} : {cash:10000,gold:1,gem:0,keys:0};
  if ([1,5,10,15,20].includes(level)) {
    reward.cash += premium ? 1000000 : 100000;
    reward.gold += premium ? 100 : 10;
    reward.gem += premium ? 10 : 1;
    reward.keys += premium ? ([1,5,15].includes(level) ? 5 : 0) : 1;
  }
  return reward;
}

function processPassCommand(profile) {
  const messages = claimDailyPassMissions(profile);
  const pass = profile.seasonPass;
  const premium = pass.premiumMonth === pass.month;
  const claimed = premium ? pass.paidClaimedRewards : pass.freeClaimedRewards;
  const lines = [...messages,
    `🎫 [${pass.month} ${premium ? '유료' : '무료'} 시즌 패스]`,
    `• 현재 패스 레벨 : Lv.${displayNumber(pass.level)}`,
    `• 패스 경험치 : ${displayNumber(pass.exp)} / 100`,
    premium ? '• 이용 기간 : 한국 시간 다음 달 1일 00:00까지' : '• 무료 패스 이용 중', '',
    '📋 [일일 경험치 획득 미션]',
    `• 출석 체크 (사냥·파밍 자동) : 20 EXP ${pass.lastAttendanceDate === getKSTDateString() ? '(완료)' : '(미완료)'}`,
    `• 일일 /파밍 500회 달성 : 50 EXP ${pass.dailyFarmExpClaimed ? '(완료)' : `(${displayNumber(profile.farmData.count)}/500)`}`,
    `• 일일 /사냥 2,000회 달성 : 50 EXP ${pass.dailyHuntExpClaimed ? '(완료)' : `(${displayNumber(profile.huntData.count)}/2,000)`}`, '',
    `🎁 [${premium ? '유료' : '무료'} 패스 보상]`,
    premium ? '• 매 레벨 기본 보상 : 100,000원, 금괴 10개, 보석 5개' : '• 매 레벨 기본 보상 : 10,000원, 금괴 1개',
    '아래 특별 보상은 기본 보상에 추가됩니다.'
  ];
  for (const level of [1,5,10,15,20]) {
    const special = !premium ? '100,000원, 금괴 10개, 보석 1개, 비밀열쇠 1개' :
      '1,000,000원, 금괴 100개, 보석 10개, ' + (level === 10 ? '2026 시즌1 코스튬' : level === 20 ? '2026 시즌1 패스 칭호' : '비밀열쇠 5개');
    lines.push(`• ${displayNumber(level)}레벨 보상 : ${special} ${claimed.includes(level) ? '(수령완료)' : ''}`);
  }
  lines.push('• 21레벨 이상 : 레벨마다 기본 보상 반복 획득', '', '💡 /패스 보상으로 수령 가능한 보상을 일괄 수령하세요.');
  if (premium) lines.push('무료로 이미 수령한 레벨은 부족한 보상만 추가 지급됩니다.');
  return {text:lines.join('\n')};
}

function processPassClaimRewards(profile) {
  checkAndResetSeasonPass(profile);
  const pass = profile.seasonPass;
  const premium = pass.premiumMonth === pass.month;
  const free = new Set(pass.freeClaimedRewards), paid = new Set(pass.paidClaimedRewards);
  const totals = {cash:0,gold:0,gem:0,keys:0}, levels = [], items = [];
  profile.inventory ||= [];
  profile.ownedTitles ||= [];
  for (let level=1; level<=pass.level; level++) {
    if (premium ? paid.has(level) : free.has(level)) continue;
    const reward = passRewardAt(level,premium);
    const previous = premium && free.has(level) ? passRewardAt(level,false) : {cash:0,gold:0,gem:0,keys:0};
    for (const key of Object.keys(totals)) totals[key] += Math.max(0,reward[key]-previous[key]);
    if (premium && level === 10) {
      const name = '2026 시즌1 코스튬';
      profile.inventory.push({category:'costume',name,desc:'2026 시즌1 특별 패스 코스튬 아이템입니다.'});
      items.push(name);
    }
    if (premium && level === 20) {
      const name = '2026 시즌1 패스';
      if (!profile.ownedTitles.includes(name)) profile.ownedTitles.push(name);
      items.push('칭호: '+name);
    }
    free.add(level);
    if (premium) paid.add(level);
    levels.push(level);
  }
  if (!levels.length) return {text:'⚠️ 현재 수령할 수 있는 시즌 패스 보상이 없습니다.'};
  pass.freeClaimedRewards = [...free];
  pass.paidClaimedRewards = [...paid];
  pass.claimedRewards = [...free];
  totals.cash = applyAchievementCashBonus(totals.cash,profile);
  for (const key of Object.keys(totals)) profile[key] = (profile[key] || 0) + totals[key];
  const lines = [`🎁 [${premium ? '유료' : '무료'} 시즌 패스 보상 수령 완료!]`,
    `• 수령한 레벨 구간 : Lv.${levels[0]} ~ Lv.${levels[levels.length-1]} (${levels.length}개 단계)`,
    `• 획득 현금 : +${won(totals.cash)}`, `• 획득 금괴 : +${totals.gold.toLocaleString()}개`];
  if (totals.gem) lines.push(`• 획득 보석 : +${totals.gem.toLocaleString()}개`);
  if (totals.keys) lines.push(`• 획득 비밀열쇠 : +${totals.keys.toLocaleString()}개`);
  if (items.length) lines.push('• 특별 보상 : '+items.join(', '));
  lines.push('',resourceText(profile));
  return {text:lines.join('\n')};

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

const ECONOMY_RULES = Object.freeze({adDailyMax:3,adCashMin:5000,adCashMax:15000,shadowDailyMax:5,vaultHourlyRate:0.001,keyCashMin:2000,keyCashMax:10000,supplyCashMin:30000,supplyCashMax:150000,raidCashRate:0.1});
function getEconomyDay(profile) {
  const date=getKSTDateString();
  if(!profile.economyDaily || profile.economyDaily.date!==date)profile.economyDaily={date,ads:0,shadow:0};
  return profile.economyDaily;
}
function getEconomyStage(profile) { return 1+getJobTier(profile); }
function getKeyCashReward(profile) {return applyCreatureCashBonus(rand(ECONOMY_RULES.keyCashMin,ECONOMY_RULES.keyCashMax)*getEconomyStage(profile),profile);}
function getSupplyCashReward(profile) {return applyCreatureCashBonus(rand(ECONOMY_RULES.supplyCashMin,ECONOMY_RULES.supplyCashMax)*getEconomyStage(profile),profile);}

function createProfile(existing = {}) {
  const safeObj = existing && typeof existing === 'object' ? existing : {};
  
  const nickname = (typeof safeObj.nickname === 'string' && safeObj.nickname.trim() !== '') 
    ? safeObj.nickname 
    : generateRandomNickname();

  let profile = {
    firstEncounters: safeObj.firstEncounters && typeof safeObj.firstEncounters==='object'
      ? {farmSReached:safeObj.firstEncounters.farmSReached===true,huntUsed:safeObj.firstEncounters.huntUsed===true}
      : {farmSReached:safeObj.version!=null,huntUsed:safeObj.version!=null},
    version: normalizeStoredInt(safeObj.version, CURRENT_DATA_VERSION, 0),
    gradeSchemaVersion: 2,
    jobState: safeObj.jobState && typeof safeObj.jobState === "object" ? JSON.parse(JSON.stringify(safeObj.jobState)) : {},
    economyDaily: safeObj.economyDaily && typeof safeObj.economyDaily==='object' ? {date:String(safeObj.economyDaily.date || ''),ads:normalizeStoredInt(safeObj.economyDaily.ads,0,0),shadow:normalizeStoredInt(safeObj.economyDaily.shadow,0,0)} : {date:'',ads:0,shadow:0},
    // 서버가 MongoDB 조회에 사용하는 사용자 ID. 기존 저장 키와 별도로 보존한다.
    adminAttackPower: Number.isSafeInteger(safeObj.adminAttackPower)&&safeObj.adminAttackPower>0&&safeObj.adminAttackPower<=1000000000000 ? safeObj.adminAttackPower : null,
    userId: typeof safeObj.userId === 'string' ? safeObj.userId.trim() : '',
    monsterCollection: normalizeMonsterCollection(safeObj.monsterCollection),
    cash: normalizeStoredInt(safeObj.cash, 0, 0),
    gold: normalizeStoredInt(safeObj.gold, 0, 0),
    gem: normalizeStoredInt(safeObj.gem, 0, 0),
    keys: normalizeStoredInt(safeObj.keys, 0, 0),
    enhance: normalizeStoredInt(safeObj.enhance, 0, 0),
    jobEnhance: normalizeStoredInt(safeObj.jobEnhance, 0, 0),
    subweaponEnhance: normalizeStoredInt(safeObj.subweaponEnhance, 0, 0, 20),
    maxSubweaponEnhanceHistory: normalizeStoredInt(safeObj.maxSubweaponEnhanceHistory ?? safeObj.subweaponEnhance, 0, 0, 20),
    enhanceLedger: safeObj.enhanceLedger && typeof safeObj.enhanceLedger==='object' ? JSON.parse(JSON.stringify(safeObj.enhanceLedger)) : null,
    totalSubweaponEnhanceCost: normalizeStoredInt(safeObj.totalSubweaponEnhanceCost, 0, 0),
    totalEnhanceCost: normalizeStoredInt(safeObj.totalEnhanceCost, 0, 0),       // 모험가 시절 일반무기 누적 강화 비용
    totalJobEnhanceCost: normalizeStoredInt(safeObj.totalJobEnhanceCost, 0, 0), // 전직 이후 전직무기 누적 강화 비용
    refine: normalizeStoredInt(safeObj.refine, 0, 0),
    level: normalizeStoredInt(safeObj.level, 1, 1),
    exp: normalizeStoredInt(safeObj.exp, 0, 0),
    combatLevel: normalizeStoredInt(safeObj.combatLevel, 0, 0),
    resonanceLevel: normalizeStoredInt(safeObj.resonanceLevel, 0, 0, 10),
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
    hasSeenBeginnerGuide: safeObj.hasSeenBeginnerGuide === true,
    farmData: safeObj.farmData && typeof safeObj.farmData === 'object' ? { ...safeObj.farmData } : { date: "", count: 0, lastClaimedFarmQuest: 0 },
    huntData: safeObj.huntData && typeof safeObj.huntData === 'object' ? { ...safeObj.huntData } : { date: "", count: 0, lastClaimedHuntQuest: 0 },
    pvpData: safeObj.pvpData && typeof safeObj.pvpData === 'object' ? { ...safeObj.pvpData } : { date: "", count: 0 },
    dungeonData: safeObj.dungeonData && typeof safeObj.dungeonData === 'object' ? { ...safeObj.dungeonData } : { date: "", count: 0 },
    speedMultiplier: normalizeStoredInt(safeObj.speedMultiplier, 1, 1, 1000),
    adminSpeedMode: safeObj.adminSpeedMode === true,
    adminUnlimitedCounts: safeObj.adminUnlimitedCounts === true,
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
  normalizeEquippedCosmetics(profile);
  ensureEnhanceLedger(profile);
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

  const interest = Math.floor(vault.amount * ECONOMY_RULES.vaultHourlyRate * elapsedHours);
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
    
    let requiredGold = 100;
    if (curLevel >= 1) {
      requiredGold = 1000 + (curLevel - 1) * 500;
    }

    if ((profile.gold || 0) < requiredGold) {
      return {
        text: shortageText(profile,{gold:requiredGold})
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
        currencyCostText(curLevel===0?'해금':'레벨업',{gold:requiredGold}),
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
        `• 해금 비용: 금괴 100개 (1레벨 해금)`,
        `• 1레벨 보관 한도 : 2,000,000원`,
        `• 이자 혜택 : 1시간당 0.1% (최대 12시간, 단리 적용)`,
        ``,
        `💡 /금고 구매 명령어로 금고를 해금할 수 있습니다.`
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

  const inputAmount = parseStrictPositiveInteger(subCommand);
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
      return { text: shortageText(profile,{cash:inputAmount}) };
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
        `• 이자 타이머가 새로 시작되었습니다 (1시간당 0.1%, 최대 12시간).`,
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
      `• 다음 레벨업 비용: 금괴 ${nextUpgradeCost.toLocaleString()}개`,
      ``,
      `💡 명령어 사용법:`,
      `• /금고 [금액] : 금액 입금`,
      `• /금고 출금 : 원금 및 이자 전액 출금`,
      `• /금고 구매 : 금고 레벨업 (한도 +2,000,000원 증가)`
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
  const maxLimit = Math.floor(((day === 0 || day === 6) ? 1000 : FARM_DAILY_LIMIT)*(1+skillLevel(playerState,'hawkeye')*.01)) + getAmplifyInfo(playerState.combatLevel||0).farmBonus;

  if (!playerState.farmData || playerState.farmData.date !== todayStr) {
    playerState.farmData = { date: todayStr, count: 0, max: maxLimit, lastClaimedFarmQuest: 0 };
  } else {
    playerState.farmData.max = maxLimit;
    if (playerState.farmData.lastClaimedFarmQuest === undefined) {
      playerState.farmData.lastClaimedFarmQuest = 0;
    }
  }
}

function activeAbilityText(p) {
  const stats=getEnhanceStats(getCurrentEnhanceLevel(p),p.combatLevel||0,p);
  const amp=getCombinedGrowthInfo(p),res=getResonanceInfo(p);
  const imprint=key=>getImprintTotalBonus(p,key);
  const fmt=n=>Number(n.toFixed(2)).toLocaleString();
  const lines=['✨ 스탯','','💪 공격력 '+fmt(getCombatPower(p))];
  const add=(label,n,unit='%',sign='+')=>{if(Number.isFinite(n)&&n>0)lines.push(label+' '+sign+fmt(n)+unit);};
  add('└ 공격력',((1+(p.refine||0)*.02)*(1+imprint('combatBoost')/100)-1)*100);
  add('└ 수집 공격력',getCollectionCombatPower(p),'');
  add('🎲 치명타 확률',stats.numCrit,'%','');
  add('└ 치명타 확률 가중치',amp.critWeight*100+imprint('critWeight'));
  add('💢 치명타 데미지',(getCriticalMultiplier(p,stats)-2)*100);
  // Use the same mutually exclusive counter ranges as the farming hit check.
  const baseFull=Math.min(100,stats.numFullCounter);
  const baseCounter=Math.min(100-baseFull,stats.numCounter);
  const greatsword=getSecondJobCode(p)==='swordmaster'&&jobState(p).sword==='대검';
  if(greatsword){
    lines.push('↩️ 카운터 확률 0%');
    lines.push('🔁 풀카운터 확률 '+fmt(baseFull+baseCounter)+'%');
    lines.push('└ 대검 · 카운터 '+fmt(baseCounter)+'% 전환 포함');
    add('└ 카운터 확률 가중치',amp.counterWeight*100);
    add('└ 풀카운터 확률 가중치',amp.fullCounterWeight*100);
  }else{
    add('↩️ 카운터 확률',baseCounter,'%','');
    add('└ 카운터 확률 가중치',amp.counterWeight*100);
    add('🔁 풀카운터 확률',baseFull,'%','');
    add('└ 풀카운터 확률 가중치',amp.fullCounterWeight*100);
  }
  const battle=p.activeFarmBattle;
  const live=battle&&battle.alive&&!battle.finished?battle:null;
  const armor=live?((live.helmetLevel>0&&live.helmetDurability>0?live.helmetLevel*3:0)+(live.vestLevel>0&&live.vestDurability>0?live.vestLevel*3:0)):0;
  const warrior=skillLevel(p,'warrior');
  if(imprint('damageReduce')>0||armor>0||warrior>0){
    lines.push('🛡️ 받는 피해 감소');
    add('└ 각인 고정 감소',imprint('damageReduce'),'','-');
    add('└ 투구·갑옷 고정 감소',armor,'','-');
    add('└ 전사 피해 감소',warrior*2,'%','-');
  }
  lines.push('🔘 배율 x'+getGoldMultiplier(p).toFixed(2));
  const cash=(getCombatCashFactors(p).total-1)*100;
  add('💵 파밍 현금 획득량',cash);
  add('💵 사냥 현금 획득량',cash);
  add('⭐ 경험치 획득량',(getDedicatedExpMultiplier(p)-1)*100);
  const range=(lo,hi)=>lo===hi?fmt(lo):fmt(lo)+'~'+fmt(hi);
  lines.push('🧈 파밍 금괴 획득량 '+range(applyCreatureGoldBonus(amp.minGold,p),applyCreatureGoldBonus(amp.maxGold,p))+'개');
  lines.push('💎 사냥 보석 획득량 '+range(applyCreatureGemBonus(res.minGem,p),applyCreatureGemBonus(res.maxGem,p))+'개');
  add('🔨 무기 강화 성공 보정',amp.successBonus+imprint('enhanceSuccess'),'%p');
  add('🔥 제련 강화 성공 보정',res.refineSuccessBonus,'%p');
  add('💰 강화 비용 감소',weaponDiscount(p),'%','-');
  add('🐲 파밍 처치 확률 가중치',normalizeStoredInt(p.refine,0,0,10));
  add('🐲 사냥 A등급 이상 가중치',res.highGradeWeight*100);
  add('🐲 사냥 +등급 가중치',res.plusGradeWeight*100);
  const sub=getSubweaponLevel(p);
  if(sub>0)lines.push('🧰 보조무기 등장 가중치',...Object.entries(SUBWEAPON_GRADE_BONUS).map(([g,v])=>'└ '+g+' '+(v>0?'+':'')+fmt(v*sub)+'%'));
  checkAndResetFarmLimit(p);checkAndResetHuntLimit(p);
  const weekend=[0,6].includes(getKSTParts().weekday);
  lines.push('⚔️ 파밍 일일 한도 '+fmt(p.farmData.max)+'회');
  add('└ 추가 횟수',p.farmData.max-(weekend?1000:FARM_DAILY_LIMIT),'회');
  lines.push('🏹 사냥 일일 한도 '+fmt(p.huntData.max)+'회');
  add('└ 추가 횟수',p.huntData.max-(weekend?4000:2000),'회');
  add('🏰 던전 일일 추가 횟수',res.dungeonBonus,'회');
  lines.push('⏩ 배속 x'+fmt(p.speedMultiplier||1)+' / 최대 x'+fmt(Math.max(1,getCombinedGrowthLevel(p))));
  if(live?.farmRunCount && live.farmRunCount!==(p.speedMultiplier||1))lines.push('└ 진행 중 파밍 x'+fmt(live.farmRunCount));
  const state=jobState(p),first=getBaseJobCode(p),second=getSecondJobCode(p);
  for(const job of [first,second].filter(Boolean)){
    const lv=skillLevel(p,job);

    lines.push('⚡️ '+JOB_NAMES[job]+' Lv.'+fmt(lv));
    if(job==='warrior'){
      lines.push('└ 피격 스택 '+fmt(state.stacks||0));
      if(state.warriorBuff?.turns>0)lines.push('└ 처치 확률 x'+state.warriorBuff.mult.toFixed(2)+' · 남은 '+fmt(state.warriorBuff.turns)+'회');
    }
    if(job==='berserker')lines.push('└ 잃은 HP 비율 × '+fmt((.2+lv*.03)*100)+'%만큼 처치 가중치 증가','└ 폭주 '+(state.rage?'활성':'비활성'),'└ 폭주 발동 시 처치 확률 x'+(1+lv*.05).toFixed(2),'└ 현재 HP 20% 소모 · 최소 HP 1');
    if(job==='swordmaster'){
      lines.push('└ 카운터 확률 보정 +'+fmt(lv*.3)+'%p');
      if(state.sword==='대검')lines.push('└ 대검 · 카운터를 풀카운터로 전환');
      if(state.sword==='광검')lines.push('└ 광검 · '+fmt(lv)+'% 확률로 2단계 진행');
      if(state.sword==='도')lines.push('└ 도 · 피격 시 회피 확률 '+fmt(lv)+'%');
    }
    if(job==='archer')lines.push('└ +등급 기본 확률 보정 +'+fmt(lv*.1)+'%p');
    if(job==='sniper')lines.push('└ 치명타 확률 보정 +'+fmt(lv)+'%p');
    if(job==='ranger')lines.push('└ 레이드 조우 가중치 +'+fmt(lv*20)+'%');
    if(job==='hawkeye')lines.push('└ 추가 일일 횟수는 위 한도에 반영');
    if(job==='wizard')lines.push('└ 강화 비용 감소 -'+fmt(lv)+'% (위 감소율에 포함)','└ 마력 이해 · 파밍 경험치 +'+fmt(lv)+'% (위 증가율에 포함)');
    if(job==='battlemage')lines.push('└ C등급 이상 등장 가중치 +'+fmt(lv)+'%');
    if(job==='archmage')lines.push('└ 선공 대결 승리 확정 · 일괄 대결 가능');
    if(job==='elementalist')lines.push('└ 오늘의 마법 연구 '+research(p).name);
    if(job==='necromancer')lines.push('└ 처치 시 영혼 획득 · 보유 '+fmt(ensureSkillState(p).souls||0)+'개');
    if(job==='thief')lines.push('└ 희귀 재화 가중치 +'+fmt(lv)+'%');
    if(job==='shadow')lines.push('└ 분신 '+fmt(lv)+'% 확률로 재화 x2');
    if(job==='assassin')lines.push('└ 약탈 '+fmt(lv)+'% 확률로 파밍 처치 현금 x2');
    if(job==='dualblade')lines.push('└ 레이드 피해량 +20%');
  }
  if(live?.eliteNext)lines.push('└ 다음 정예 몬스터 처치 확률 x0.80 · 현금 x2');
  lines.push('','※ 가중치·보너스는 위 최종 수치에 반영됩니다.','※ 피해는 고정 감소 → 비율 감소 순서로 적용되며 최소 1입니다.');
  return lines;
}


function profileText(...args) { return formatDisplayText(profileTextRaw(...args)); }
function profileTextRaw(profile) {
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
    `🏆 칭호 : ${displayTitle}`,
    `🎭 아바타 : ${displayAvatar}`,
    `🎖️ 직업 : ${jobDisplay}`,
    `🐾 크리처 : ${creatureDisplay}`,
    `🗡️ ${weaponCategoryName(weaponCategory(p))} : +${currentEnhance} ${wName}`,
    ...(getSubweaponInfo(p) ? ['🧰 보조무기 : +'+getSubweaponLevel(p)+' '+getSubweaponInfo(p).name] : []),
    `🔥 제련 : ${refineStar}`,
    `⭐ Lv.${displayNumber(p.level)} (${(p.exp || 0).toLocaleString()}/${reqExp.toLocaleString()})`,
    `💪 공격력 : ${combatPower.toLocaleString()}`,
    `🌌 증폭 Lv.${p.combatLevel || 0}`,
    `🔮 공명 Lv.${p.resonanceLevel || 0}`,
    `🔘 배율 : x${totalMult}`,
    `⏩ 배속 : x${p.speedMultiplier || 1}`
  ];


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
  return `💵 현금 : ${won(profile.cash)}\n🧈 금괴 : ${(profile.gold || 0).toLocaleString()}개\n💎 보석 : ${(profile.gem || 0).toLocaleString()}개`;
}

function resourceText(...args) { return formatDisplayText(resourceTextRaw(...args)); }
function resourceTextRaw(profile) {
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
    `🏆 [칭호 정보 및 보유 목록]`,
    `현재 장착 칭호 : ${profile.equippedTitle || '없음'}`,
    `보유 효과 : 칭호 1개당 공격력 +1,000 (현재 +${(profile.ownedTitles.length * 1000).toLocaleString()})`,
    `장착 효과 : 배율 +0.10`,
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
      lines.push(`${index + 1}. ${titleName}${isEquipped} — 보유: 공격력 +1,000 / 장착: 배율 +0.10`);
    });
  }

  lines.push(``, `💡 /칭호 장착 [번호] 명령어로 칭호를 장착할 수 있습니다.`);

  return { text: lines.join('\n') };
}

function processTitleEquip(profile, arg) {
  if (!profile.ownedTitles) profile.ownedTitles = [];

  const number = parseStrictPositiveInteger(arg);
  const index = number === null ? -1 : number - 1;
  if (isNaN(index) || index < 0 || index >= profile.ownedTitles.length) {
    return { text: `⚠️ 올바른 칭호 번호를 입력해 주세요. 보유한 칭호 목록의 번호를 확인해 주세요.` };
  }

  const selectedTitle = profile.ownedTitles[index];
  profile.equippedTitle = selectedTitle;
  profile.title = selectedTitle;

  return { text: `🏆 [칭호 장착 완료] '${selectedTitle}' 칭호를 장착했습니다!\n장착 효과 : 배율 +0.10` };
}

function processAvatarInfo(profile) {
  if (!Array.isArray(profile.ownedAvatars)) profile.ownedAvatars = [];
  const avatarCount = profile.ownedAvatars.length;
  const lines = [
    `🎭 [아바타 정보]`,
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
  lines.push(``, `💡 /아바타 장착 [번호] 명령어로 아바타를 장착할 수 있습니다.`);
  return { text: lines.join('\n') };
}

function processAvatarEquip(profile, arg) {
  if (!Array.isArray(profile.ownedAvatars)) profile.ownedAvatars = [];
  const number = parseStrictPositiveInteger(arg);
  const index = number === null ? -1 : number - 1;
  if (!Number.isInteger(index) || index < 0 || index >= profile.ownedAvatars.length) {
    return { text: `⚠️ 올바른 아바타 번호를 입력해 주세요. 보유 목록의 번호를 확인해 주세요.` };
  }
  profile.equippedAvatar = profile.ownedAvatars[index];
  profile.equippedAvatarIndex = index;
  return { text: `🎭 [아바타 장착 완료] '${profile.equippedAvatar}' 아바타를 장착했습니다!\n장착 효과: 현금 획득량 +10%` };
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
    `💡 /크리처 뽑기 명령어로 크리처를 뽑을 수 있습니다. (D~EX 중 가장 높은 등급 효과만 자동 유지)`
  ];

  return { text: lines.join('\n'), choices: CREATURE_CHOICES };
}

function processCreatureGacha(profile) {
  const GACHA_COST_GOLD = 50;

  if ((profile.gold || 0) < GACHA_COST_GOLD) {
    return { 
      text: shortageText(profile,{gold:GACHA_COST_GOLD}),
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
    currencyCostText('뽑기',{gold:GACHA_COST_GOLD}),
    ``,
    updateMsg,
    ``,
    resourceText(profile)
  ];

  return { text: resultLines.join('\n'), imageUrl: pulledImageUrl, choices: CREATURE_CHOICES };
}

function processSupply(profile, countArg = "1") {
  const count = parseItemCount(countArg);
  if (count === null) return {text:'사용법: /보급 [수량 1~1,000]. 잘못된 수량은 사용하지 않습니다.'};

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
        totalCash += applyAchievementCashBonus(100000, profile);
        gainedAvatars.push(`중복 아바타: '${currentMonthAvatar}' → 현금 100,000원 기본 대체`);
      } else {
        profile.ownedAvatars.push(currentMonthAvatar);
        gainedAvatars.push(`월별 아바타: '${currentMonthAvatar}'`);
      }
    }

    if (roll >= 10) {
      if (roll < 60) {
        const combatPower = getAttackPower(profile);
        const dice = rand(1, 6);
        let gainedCash = getSupplyCashReward(profile);
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
  if (gainedAvatars.length > 0) rewardLines.push(`• 🎭 획득 아바타 : ${gainedAvatars.join(', ')}`);

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
    element: null
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
    '🪖 투구 : Lv.' + (b.helmetLevel || 0) + ' |🦺 갑옷 : Lv.' + (b.vestLevel || 0),
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
    '🗡️ '+weaponCategoryName(weaponCategory(p))+' : +' + n + ' ' + getWeaponInfo(n,p.job)[0],
    '🔥 제련 : ' + (REFINE_STARS[Math.min(p.refine,REFINE_STARS.length-1)] || ''),
    '⭐ Lv.' + displayNumber(p.level) + ' (' + (p.exp || 0).toLocaleString() + '/' + req.toLocaleString() + ')',
    '💪 공격력 : ' + displayNumber(getCombatPower(p)),
    '🔘 배율 : x' + getGoldMultiplier(p).toFixed(2) + ' | ⏩ 배속 (x' + (p.speedMultiplier || 1) + ')',
    '⚔️ 전투 횟수 : (' + displayNumber(count) + '/' + (hasUnlimitedCounts(p) ? '무제한' : displayNumber(p.farmData.max)) + ')',
    target ? '📜 퀘스트 보상까지 ' + displayNumber(target-count) + '회' : '📜 오늘의 파밍 퀘스트 완료'
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
  let finalDamage = Math.max(1, Math.floor((rawDamage - totalReduce)*(1-skillLevel(profile,'warrior')*.02)));

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
  image=normalizeImageFilename(image);
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
  { id:'elite_invasion', name:'정예 몬스터 난입' },
  { id:'abandoned_purse', name:'버려진 돈주머니' },
  { id:'ancient_treasury', name:'고대 금고' },
  { id:'gold_vein', name:'노출된 금맥' },
  { id:'crystal_cave', name:'수정 동굴' },
  { id:'lost_keyring', name:'잃어버린 열쇠 꾸러미' },
  { id:'forest_fruit', name:'숲의 생명 열매' },
  { id:'blood_altar', name:'피의 제단' },
  { id:'poison_mist', name:'독안개 지대' },
  { id:'falling_rocks', name:'낙석 함정' },
  { id:'pickpocket_goblin', name:'소매치기 고블린' }
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
  return calculateCombatCash(profile,cash,profile.speedMultiplier || 1);
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
      return { text:`⛲ [랜덤 이벤트] 회복의 샘 발견!\nHP +${displayNumber(healed)} (${before} → ${battle.hp})`, imageUrl:null };
    }
    case 'sealed_door': {
      const keys = speed;
      battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keys;
      return { text:`🚪 [랜덤 이벤트] 봉인된 문 발견!\n문틈에서 비밀열쇠를 발견했습니다.\n🔑 비밀열쇠 +${keys.toLocaleString()}개`, imageUrl:null };
    }
    case 'wandering_merchant': {
      const amp = getAmplifyInfo(profile.combatLevel || 0);
      const gold = applyCreatureGoldBonus(Math.max(1,rand(amp.minGold,amp.maxGold)),profile) * speed;
      battle.accumulatedGold = (battle.accumulatedGold || 0) + gold;
      return { text:`🧙 [랜덤 이벤트] 떠돌이 상인 등장!\n모험을 응원하며 금괴를 건넸습니다.\n🧈 금괴 +${gold.toLocaleString()}개`, imageUrl:null };
    }
    case 'abandoned_purse':
    case 'ancient_treasury': {
      const multiplier = event.id === 'ancient_treasury' ? 3 : 2;
      const cash = getFarmCashReward(profile, battle) * multiplier;
      battle.accumulatedCash = (battle.accumulatedCash || 0) + cash;
      return {text:'💰 [랜덤 이벤트] '+event.name+' 발견!\n💵 현금 +'+won(cash), imageUrl:null};
    }
    case 'gold_vein':
    case 'crystal_cave':
    case 'lost_keyring': {
      const field = {gold_vein:'Gold',crystal_cave:'Gem',lost_keyring:'Keys'}[event.id];
      const label = {Gold:'🧈 금괴',Gem:'💎 보석',Keys:'🔑 비밀열쇠'}[field];
      let amount = 2 * speed;
      if (field === 'Gold') {
        const amp = getAmplifyInfo(profile.combatLevel || 0);
        amount = applyCreatureGoldBonus(Math.max(1,rand(amp.minGold,amp.maxGold)),profile) * speed;
      } else if (field === 'Gem') {
        const resonance = getResonanceInfo(profile);
        amount = applyCreatureGemBonus(Math.max(1,rand(resonance.minGem,resonance.maxGem)),profile) * speed;
      }
      battle['accumulated'+field] = (battle['accumulated'+field] || 0) + amount;
      return {text:'✨ [랜덤 이벤트] '+event.name+' 발견!\n'+label+' +'+displayNumber(amount)+'개',imageUrl:null};
    }
    case 'forest_fruit': {
      const before = battle.hp;
      battle.hp = Math.min(100, battle.hp + 15);
      return {text:'🍎 [랜덤 이벤트] 숲의 생명 열매\nHP +'+displayNumber(battle.hp-before),imageUrl:null};
    }
    case 'blood_altar':
    case 'poison_mist':
    case 'falling_rocks': {
      // 환경 피해는 피격 스택·카운터 대상이 아니며 HP 1을 남긴다.
      const damage = {blood_altar:20,poison_mist:15,falling_rocks:25}[event.id];
      const loss = Math.min(Math.max(0,battle.hp-1),damage);
      battle.hp -= loss;
      let text='⚠️ [랜덤 이벤트] '+event.name+'\nHP -'+displayNumber(loss)+' (이 이벤트로 사망하지 않습니다.)';
      if(event.id==='blood_altar') {
        const cash = getFarmCashReward(profile,battle)*4;
        battle.accumulatedCash = (battle.accumulatedCash || 0)+cash;
        text += '\n💵 현금 +'+won(cash);
      }
      return {text,imageUrl:null};
    }
    case 'pickpocket_goblin': {
      const cash = Math.max(0,battle.accumulatedCash || 0);
      const loss = Math.floor(cash*.1);
      battle.accumulatedCash = cash-loss;
      return {text:'👺 [랜덤 이벤트] 소매치기 고블린\n이번 파밍에서 모은 현금 10%를 도둑맞았습니다.\n💵 현금 -'+won(loss),imageUrl:null};
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
  return {cash:bonusCash,gem:bonusGem,text:parts.length ? '⚡️ [분신] '+parts.join(' / ') : ''};
}
function resolveProgressionFarmTurn(profile,battle){
  const first=profile.firstEncounters,sIndex=FARM_GRADE_STEPS.indexOf('S등급');
  if(first && getFarmGradeIndex(battle.currentGradeIndex)>=sIndex)first.farmSReached=true;
  const firstFarm=!!first && !first.farmSReached;
  const s=jobState(profile),st=ensureSkillState(profile),speed=profile.speedMultiplier||1,second=getSecondJobCode(profile),lv=skillLevel(profile,second);
  let rage=1,notes=[];
  if(second==='berserker'&&s.rage&&Math.random()<(5+lv)/100){const loss=Math.min(Math.max(0,battle.hp-1),Math.ceil(battle.hp*.2));battle.hp-=loss;rage=4;notes.push(`⚡️ 폭주 발동 · HP -${displayNumber(loss)} · 이번 턴 재화 x4`);}
  const before={};for(const key of ['Cash','Gold','Gem','Keys','SupplyItem'])before[key]=battle['accumulated'+key]||0;
  const finish=result=>{
    const clone=shadowDouble(profile),factor=rage*clone,extra=[];
    if(factor>1)for(const key of Object.keys(before)){const field='accumulated'+key,delta=(battle[field]||0)-before[key];if(delta>0){battle[field]+=delta*(factor-1);extra.push(({Cash:'현금',Gold:'금괴',Gem:'보석',Keys:'비밀열쇠',SupplyItem:'보급'})[key]+' 추가 +'+(delta*(factor-1)).toLocaleString());}}
    if(clone===2)notes.push('⚡️ 분신 발동 · 재화 x2');
    result.text=[...notes,result.text,...extra].filter(Boolean).join('\n');return result;
  };
  const randomEvent=firstFarm?null:rollFarmRandomEvent();if(randomEvent){const r=resolveFarmRandomEvent(profile,battle,randomEvent);if(r)return finish(r);}
  const thief=1+skillLevel(profile,'thief')*.01,element=research(profile),roll=firstFarm?100:Math.random()*100;
  const supplyRate=.01*thief,goldRate=thief*element.gold,keyRate=1*thief,jackpotRate=3.495*thief;
  if(roll<supplyRate){battle.accumulatedSupplyItem=(battle.accumulatedSupplyItem||0)+speed;return finish({text:`📦 [재화] 보급 +${displayNumber(speed)}개`,imageUrl:BASE_URL+'/SUPPLY_FARM.png'});}
  if(roll<supplyRate+goldRate){const a=getAmplifyInfo(profile.combatLevel||0),n=applyCreatureGoldBonus(Math.max(1,rand(a.minGold,a.maxGold)),profile)*speed;battle.accumulatedGold=(battle.accumulatedGold||0)+n;return finish({text:`🧈 [재화] 금괴 +${displayNumber(n)}개`,imageUrl:BASE_URL+'/GOLD_FARM.png'});}
  if(roll<supplyRate+goldRate+keyRate){battle.accumulatedKeys=(battle.accumulatedKeys||0)+speed;return finish({text:`🔑 [재화] 비밀열쇠 +${displayNumber(speed)}개`,imageUrl:BASE_URL+'/KEY_FARM.png'});}
  if(roll<supplyRate+goldRate+keyRate+jackpotRate){const n=getFarmCashReward(profile,battle)*10;battle.accumulatedCash=(battle.accumulatedCash||0)+n;return finish({text:'🎰 [재화] 잭팟 현금 +'+won(n),imageUrl:null});}
  const index=getFarmGradeIndex(battle.currentGradeIndex),grade=FARM_GRADE_STEPS[index];
  if(!battle.farmMonster||battle.farmMonster.grade!==grade)battle.farmMonster=createFarmMonster(grade);
  const monster=battle.farmMonster,stats=getEnhanceStats(getCurrentEnhanceLevel(profile),profile.combatLevel||0,profile),critical=Math.random()*100<stats.numCrit;
  const base=getFarmSuccessChance(index);let chance=base*(critical?getCriticalMultiplier(profile,stats):1)*(1+normalizeStoredInt(profile.refine,0,0,10)*.01);
  if(second==='berserker')chance*=1+(1-Math.min(100,battle.hp)/100)*(0.2+lv*.03);
  if(rage===4)chance*=1+lv*.05;
  if(s.warriorBuff?.turns>0){chance*=s.warriorBuff.mult;s.warriorBuff.turns--;}
  const elite=battle.eliteNext===true;if(elite){chance*=.8;battle.eliteNext=false;notes.push('⚠️ 정예: 처치 확률 x0.8 · 처치 현금 x2');}
  chance=Math.max(0,Math.min(100,chance));let killed=firstFarm || Math.random()*100<chance,counter='';
  if(!killed){const roll=Math.random()*100,full=Math.min(100,stats.numFullCounter),normal=Math.min(100-full,stats.numCounter);if(roll<full)counter='풀카운터';else if(roll<full+normal)counter=second==='swordmaster'&&s.sword==='대검'?'풀카운터':'카운터';if(counter==='풀카운터')killed=true;}
  const label=counter?'['+counter+']':critical?'[치명타]':'[공격]',damage=getCombatPower(profile);
  const lines=[`[${grade}] ${monster.fullName}`,`처치 확률 : ${critical?base.toFixed(2)+'% → ':''}${chance.toFixed(2)}%`];
  const encounter={grade,fullName:monster.fullName,gradeIndex:index};
  if(killed){
    let cash=getFarmCashReward(profile,battle)*(elite?2:1);
    if(second==='assassin'&&Math.random()<lv*.01){notes.push('⚡️ 재화 약탈 · 현금 추가 +'+won(cash));cash*=2;}
    battle.accumulatedCash=(battle.accumulatedCash||0)+cash;
    battle.highestGradeIndex=Math.max(Number.isInteger(battle.highestGradeIndex)?battle.highestGradeIndex:-1,index);
    const leap=second==='swordmaster'&&s.sword==='광검'&&Math.random()<lv*.01?2:1;
    battle.currentGradeIndex=Math.min(index+leap,FARM_GRADE_STEPS.length-1);battle.farmMonster=null;
    if(first && battle.currentGradeIndex>=sIndex)first.farmSReached=true;
    if(leap===2)notes.push('⚡️ 광검 · 2단계 진행 (건너뛴 몬스터 보상 없음)');
    if(second==='necromancer'){st.souls+=speed;notes.push(`⚡️ 영혼 +${displayNumber(speed)} (보유 ${displayNumber(st.souls)})`);}
    lines.push(label+' '+Math.floor(damage*(critical?getCriticalMultiplier(profile,stats):1)),'','💵 현금 +'+won(cash));
  }else{
    const dodge=second==='swordmaster'&&s.sword==='도'&&Math.random()<lv*.01;
    const hit=counter||dodge?{finalDamage:0,armorNotes:[]}:calculateCombatDamage(profile,battle,rand(20,30));
    const loss=Math.min(battle.hp,hit.finalDamage);battle.hp=Math.max(0,battle.hp-loss);checkDeath(battle);
    if(loss>0&&skillLevel(profile,'warrior')){s.stacks=Math.min(1000,s.stacks+speed);notes.push(`⚡️ 피격 스택 +${displayNumber(speed)} (보유 ${displayNumber(s.stacks)})`);}
    if(dodge)notes.push('⚡️ 도 · 회피');lines.push(label+' MISS | HP -'+loss,...hit.armorNotes);
  }
  return finish({text:lines.join('\n'),imageUrl:monster.image||null,encounter,missed:!killed});
}


function claimCombatQuests(profile,mode){
 const farm=mode==='farm',data=farm?profile.farmData:profile.huntData,table=farm?FARM_QUEST_REWARDS:HUNT_QUEST_REWARDS,lines=[];
 for(const[count,cash,extra]of table){
   if(data.count<count || (farm?data.lastClaimedFarmQuest:data.lastClaimedHuntQuest)>=count)continue;
   const dice=rand(1,6),money=applyCreatureCashBonus(cash*dice,profile),amount=extra?(farm?applyCreatureGoldBonus(extra*dice,profile):applyCreatureGemBonus(extra*dice,profile)):0;
   profile.cash+=money;const field=farm?'gold':'gem';profile[field]=(profile[field]||0)+amount;
   data[farm?'lastClaimedFarmQuest':'lastClaimedHuntQuest']=count;
   lines.push('퀘스트 달성 보상 ('+displayNumber(count)+'회) :\n💵 현금 +'+won(money)+(amount?'\n'+(farm?'🧈 금괴':'💎 보석')+' +'+displayNumber(amount)+'개':''));
 }
 return lines;
}
function claimFarmMilestones(profile){return [...claimCombatQuests(profile,'farm'),...claimDailyPassMissions(profile)];}

function enhancementPityProgress(p,auxiliary=false) {
  const key=weaponCategory(p,auxiliary),ledger=ensureEnhanceLedger(p);
  return {key,spent:ledger.spent[key]||0,threshold:ledger.claimed[key]?Infinity:enhancePityThreshold(p,key)};
}
function enhancementPityNotice(p,auxiliary=false) {
  const info=enhancementPityProgress(p,auxiliary);
  if(!Number.isFinite(info.threshold)||info.spent<info.threshold)return '';
  const level=auxiliary?getSubweaponLevel(p):getCurrentEnhanceLevel(p);
  return '🎉 '+weaponCategoryName(info.key)+' 강화 천장 달성!\n'+
    (level>=20?'현재 무기도 +20에 도달했습니다. 천장 지급 기회는 소모되지 않습니다.':
    '추가 비용 소모를 막기 위해 강화를 중단했습니다.\n'+(auxiliary?'/보조강화':'/강화')+' 입력 시 추가 재화 소모 없이 +20 강화됩니다.');
}

function processEnhance(profile) {
  ensureEnhanceLedger(profile);
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

    const maxTitle = maximumText('🗡️ '+weaponCategoryName(weaponCategory(profile)),'+20 '+wName);
    const subWeaponLine = `🗡️ ${weaponCategoryName(weaponCategory(profile))} : +20 ${wName}`;

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

  const pityNotice=enhancementPityNotice(profile);
  if(pityNotice)return claimEnhancePity(profile);
  const tableData = activeTable[currentLevel];
  let cost = tableData.cost;
  let gemCost = isJob ? (tableData.gemCost || 0) : 0;
  
  const costDownPct = weaponDiscount(profile);
  cost = Math.floor(cost * (1 - costDownPct / 100));

  if (profile.cash < cost) {
    return { text: shortageText(profile,{cash:cost,gem:gemCost}), imageUrl: null, status: 'nomoney' };
  }
  if (gemCost > 0 && (profile.gem || 0) < gemCost) {
    return { text: shortageText(profile,{cash:cost,gem:gemCost}), imageUrl: null, status: 'nogem' };
  }

  profile.cash -= cost;
  if (gemCost > 0) {
    profile.gem -= gemCost;
  }

  recordEnhanceSpend(profile,weaponCategory(profile),cost);
  if (isJob) {
    profile.totalJobEnhanceCost = (profile.totalJobEnhanceCost || 0) + cost;
  } else {
    profile.totalEnhanceCost = (profile.totalEnhanceCost || 0) + cost;
  }

  const initialEnhance = currentLevel;
  const oldStats = getEnhanceStats(initialEnhance, profile.combatLevel || 0, profile);

  const ampInfo = getCombinedGrowthInfo(profile);
  const imprintSuccessBonus = getImprintTotalBonus(profile, 'enhanceSuccess');
  
  const successRate = Math.min(1.0, tableData.success + ((ampInfo.successBonus + imprintSuccessBonus) / 100));
  const keepRate = Math.max(0, tableData.keep - ((ampInfo.successBonus + imprintSuccessBonus) / 100));
  const dropRate = isJob ? (tableData.drop || 0) : 0;

  const roll = Math.random();
  let resultStatus;
  if(roll<successRate) {
    profile[currentEnhanceKey]++;resultStatus='success';
    if(profile[currentEnhanceKey]>profile[historyKey])profile[historyKey]=profile[currentEnhanceKey];
  } else if(roll<successRate+keepRate)resultStatus='keep';
  else if(isJob && roll<successRate+keepRate+dropRate) {
    profile[currentEnhanceKey]=Math.max(0,profile[currentEnhanceKey]-1);resultStatus='drop';
  } else {profile[currentEnhanceKey]=0;resultStatus='destroy';}
  const after=profile[currentEnhanceKey];
  const [name,description]=getWeaponInfo(after,profile.job);
  const headings={success:'🔨 [강화 성공]',keep:'⏸️ [강화 유지]',drop:'🔻 [강화 하락]',destroy:'💥 [강화 파괴]'};
  const detailMsg=formatEnhanceStatDiff(oldStats,getEnhanceStats(after,profile.combatLevel||0,profile));
  const finalResultText=[headings[resultStatus]+' +'+initialEnhance+' ➔ +'+after,'',
    '🗡️ '+weaponCategoryName(weaponCategory(profile))+' : +'+after+' '+name,'📖 '+description,detailMsg,'',
    enhancementCostText({cash:cost,gem:gemCost}),'',
    spentResourceText(profile,{cash:cost,gem:gemCost})].join('\n');

  return { 
    text: [finalResultText,enhancementPityNotice(profile)].filter(Boolean).join('\n\n'), 
    imageUrl: getEnhanceImage(resultStatus, profile[currentEnhanceKey], profile.job), 
    status: resultStatus 
  };
}

function processEnhanceToTarget(profile, target) {
  if (!Number.isInteger(target) || target < 1 || target > 20) return { text: '사용법: /강화 [목표 단계 1~20]' };
  const pity=enhancementPityProgress(profile);
  if(getCurrentEnhanceLevel(profile)<20 && pity.spent>=pity.threshold)return claimEnhancePity(profile);
  if (getCurrentEnhanceLevel(profile) >= target) return { text: '이미 목표 강화 단계에 도달했습니다.' };
  return processMultiEnhance(profile, 100000, target);
}

function processMultiEnhance(profile, count, target = 20) {
  ensureEnhanceLedger(profile);
  const isJob = Boolean(profile.job);
  const currentEnhanceKey = isJob ? 'jobEnhance' : 'enhance';
  const historyKey = isJob ? 'maxJobEnhanceHistory' : 'maxEnhanceHistory';

  if (profile[currentEnhanceKey] === undefined || profile[currentEnhanceKey] < 0) {
    profile[currentEnhanceKey] = 0;
  }
  if (profile[historyKey] === undefined) {
    profile[historyKey] = profile[currentEnhanceKey];
  }

  const pity=enhancementPityProgress(profile);
  if(profile[currentEnhanceKey]<20 && pity.spent>=pity.threshold)return claimEnhancePity(profile);
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

  const ampInfo = getCombinedGrowthInfo(profile);
  const imprintSuccessBonus = getImprintTotalBonus(profile, 'enhanceSuccess');
  const costDownPct = weaponDiscount(profile);
  const activeTable = getActiveEnhanceTable(profile);

  for (let i = 0; i < targetCount; i++) {
    if (profile[currentEnhanceKey] >= target || profile[currentEnhanceKey] >= activeTable.length) break; 

    if(pity.spent+totalCost>=pity.threshold)break;
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

  recordEnhanceSpend(profile,weaponCategory(profile),totalCost);
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

      const maxTitle = maximumText('🗡️ '+weaponCategoryName(weaponCategory(profile)),'+20 '+wName);
      const subWeaponLine = `🗡️ ${weaponCategoryName(weaponCategory(profile))} : +20 ${wName}`;

      const maxText = [
        maxTitle,
        subWeaponLine,
        detailMsg,
        ``,
        spentResourceText(profile,{cash:totalCost,gem:totalGemCost})
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
      text: enhanceShortageText(profile,activeTable[profile[currentEnhanceKey]]), 
      imageUrl: null, 
      status: 'nomoney' 
    };
  }

  const finalStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
  const detailMsg = formatEnhanceStatDiff(initialStats, finalStats);

  const weaponLine = `🗡️ ${weaponCategoryName(weaponCategory(profile))} : +${profile[currentEnhanceKey]} ${wName}`;

  let statSummary = `성공: ${successCount.toLocaleString()}회 | 유지: ${keepCount.toLocaleString()}회`;
  if (isJob) {
    statSummary += ` | 하락: ${dropCount.toLocaleString()}회 | 파괴: ${destroyCount.toLocaleString()}회`;
  } else {
    statSummary += ` | 파괴: ${destroyCount.toLocaleString()}회`;
  }

  let resultMsg = [
    `🔨 [목표 +${target} 강화 · ${displayNumber(attempted)}회 시도]`,
    `강화 단계: +${initialLevel} ➔ +${profile[currentEnhanceKey]}`,
    profile[currentEnhanceKey] >= target ? '목표 강화 달성!' : pity.spent+totalCost>=pity.threshold ? '천장에 도달하여 목표 강화를 중단했습니다.' : attempted >= targetCount ? '서버 응답 보호를 위해 100,000회에서 중단했습니다. 같은 명령으로 이어갈 수 있습니다.' : enhanceShortageText(profile,activeTable[profile[currentEnhanceKey]]),
    `📊 ${statSummary}`,
    ``,
    weaponLine,
    `📖 ${getWeaponInfo(profile[currentEnhanceKey],profile.job)[1]}`,
    detailMsg,
    ``,
    enhancementCostText({cash:totalCost,gem:totalGemCost}),
    ``,
    enhanceResourceText(profile)
  ].join('\n');

  return {
    text: [resultMsg,enhancementPityNotice(profile)].filter(Boolean).join('\n\n'),
    imageUrl: getEnhanceImage(lastStatus, profile[currentEnhanceKey], profile.job),
    status: lastStatus
  };
}

function showRefineInfo(profile) {
  const level=normalizeStoredInt(profile.refine,0,0,10);
  const block=n=>['🔥 제련 '+n+'성'+(n?' ('+REFINE_STARS[n]+')':''),'',
    ...refineOptionRows(n).map(([label,value])=>'• '+label+' +'+value)].join('\n');
  const lines=[block(level)];
  if(level<10) {
    const row=REFINE_TABLE[level];
    lines.push('',block(level+1),'',enhancementCostText({cash:row.cashCost,gold:row.goldCost}),'',
      '제련 강화를 진행하시려면 /제련 강화 명령어를 입력해 주세요.');
  } else lines.push('',maximumText('🔥 제련','10성 ★★★★★'));
  return {text:lines.join('\n')};
}

function processRefine(profile) {
  if (profile.refine === undefined || profile.refine < 0) profile.refine = 0;

  if (profile.refine >= 10) {
    return { text: maximumText('🔥 제련','10성 ★★★★★'), imageUrl: null, status: 'max' };
  }

  const tableData = REFINE_TABLE[profile.refine];
  const cashCost = tableData.cashCost;
  const goldCost = tableData.goldCost;

  if (profile.cash < cashCost || (profile.gold || 0) < goldCost) {
    return { 
      text: shortageText(profile,{cash:cashCost,gold:goldCost}), 
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

  const bonus=getResonanceInfo(profile).refineSuccessBonus/100;
  const pSuccess = Math.min(1,tableData.success+bonus);
  const pKeep = pSuccess + Math.max(0,tableData.keep-(pSuccess-tableData.success));
  const pDestroy = pKeep + tableData.destroy;
  const pDrop = pDestroy + tableData.drop;

  if (roll < pSuccess) {
    profile.refine += 1;
    resultStatus = 'success';
    const oldStar = REFINE_STARS[currentRefine] || ' ';
    const newStar = REFINE_STARS[profile.refine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, profile.refine);


  } else if (roll < pKeep) {
    resultStatus = 'keep';
    const currStar = REFINE_STARS[currentRefine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, currentRefine);


  } else if (roll < pDestroy) {
    profile.refine = 0;
    resultStatus = 'destroy';
    const statDiff = formatRefineStatDiff(currentRefine, 0);


  } else if (roll < pDrop) {
    profile.refine = Math.max(0, profile.refine - 1);
    resultStatus = 'drop';
    const newStar = REFINE_STARS[profile.refine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, profile.refine);


  } else {
    resultStatus = 'keep';
    const currStar = REFINE_STARS[currentRefine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, currentRefine);


  }

  const headings={success:'🔥 [제련 성공]',keep:'⏸️ [제련 유지]',destroy:'💥 [제련 파괴]',drop:'🔻 [제련 하락]'};
  resultMsg=[headings[resultStatus]+' '+currentRefine+'성 ➔ '+profile.refine+'성','',
    formatRefineStatDiff(currentRefine,profile.refine),'',
    enhancementCostText({cash:cashCost,gold:goldCost}),'',spentResourceText(profile,{cash:cashCost,gold:goldCost})].join('\n');
  return {
    text: resultMsg,
    imageUrl: null,
    status: resultStatus
  };
}

function growthOptionRows(kind,level) {
  const a=kind==='증폭'?AMPLIFY_TABLE[level]:RESONANCE_TABLE[level];
  const pct=n=>Number(n.toFixed(4))+'%';
  const range=(lo,hi)=>lo===hi?displayNumber(lo)+'개':displayNumber(lo)+'~'+displayNumber(hi)+'개';
  return kind==='증폭' ? [
    ['배율','+'+a.multBonus.toFixed(2)],
    ['치명타 확률 가중치','+'+pct(a.critWeight*100)],
    ['카운터 확률 가중치','+'+pct(a.counterWeight*100)],
    ['풀카운터 확률 가중치','+'+pct(a.fullCounterWeight*100)],
    ['무기 강화 성공 보정','+'+a.successBonus.toFixed(1)+'%p'],
    ['파밍 횟수','+'+displayNumber(a.farmBonus)],
    ['파밍 금괴 획득량',range(a.minGold,a.maxGold)],['배속','+'+a.speedBonus]
  ] : [
    ['배율','+'+a.multBonus.toFixed(2)],
    ['몬스터 A등급 이상 가중치','+'+pct(a.highGradeWeight*100)],
    ['몬스터 +등급 가중치','+'+pct(a.plusGradeWeight*100)],
    ['제련 강화 성공 보정','+'+a.refineSuccessBonus.toFixed(1)+'%p'],
    ['던전 일일 횟수','+'+a.dungeonBonus],['사냥 횟수','+'+displayNumber(a.huntBonus)],
    ['사냥 보석 획득량',range(a.minGem,a.maxGem)],['배속','+'+a.speedBonus]
  ];
}
function showGrowthInfo(profile,kind) {
  const amp=kind==='증폭',field=amp?'combatLevel':'resonanceLevel',table=amp?AMPLIFY_TABLE:RESONANCE_TABLE;
  const level=normalizeStoredInt(profile[field],0,0,10),icon=amp?'🌌':'🔮';
  const block=n=>[icon+' '+kind+' Lv.'+n,...growthOptionRows(kind,n).map(([k,v])=>'• '+k+' '+v)].join('\n');
  const lines=[block(level)];
  if(level<10)lines.push('',block(level+1),'',enhancementCostText({[amp?'gold':'gem']:table[level].costNext}),'',kind+' 강화를 진행하시려면 /'+kind+' 강화 명령어를 입력해 주세요.');
  else lines.push('',maximumText(icon+' '+kind,'Lv.10'));
  return {text:lines.join('\n'),imageUrl:null};
}
function showAmplifyInfo(profile){return showGrowthInfo(profile,'증폭');}
function showResonanceInfo(profile){return showGrowthInfo(profile,'공명');}
function processGrowthUpgrade(profile,kind,targetLevels) {
  if(targetLevels!==1)return {text:kind+'은 한 번에 1단계만 강화할 수 있습니다. /'+kind+' 강화',imageUrl:null};
  const amp=kind==='증폭',field=amp?'combatLevel':'resonanceLevel',currency=amp?'gold':'gem',label=amp?'금괴':'보석',table=amp?AMPLIFY_TABLE:RESONANCE_TABLE;
  const before=normalizeStoredInt(profile[field],0,0,10);
  if(before>=10)return {text:maximumText((amp?'🌌':'🔮')+' '+kind,'Lv.10'),imageUrl:null};
  const cost=table[before].costNext;
  if((profile[currency]||0)<cost)return {text:shortageText(profile,{[currency]:cost}),imageUrl:null};
  profile[currency]-=cost;profile[field]=before+1;
  if(amp)checkAndResetFarmLimit(profile);else checkAndResetHuntLimit(profile);
  const old= growthOptionRows(kind,before),next=growthOptionRows(kind,before+1);
  return {text:[(amp?'🌌':'🔮')+' ['+kind+' 강화 성공] Lv.'+before+' ➔ Lv.'+(before+1),'',
    ...next.map(([k,v],i)=>'• '+k+' '+old[i][1]+' ➔ '+v),'',
    enhancementCostText({[currency]:cost}),'',spentResourceText(profile,{[currency]:cost})].join('\n'),imageUrl:null};
}
function processAmplify(profile,targetLevels=1){return processGrowthUpgrade(profile,'증폭',targetLevels);}
function processResonance(profile,targetLevels=1){return processGrowthUpgrade(profile,'공명',targetLevels);}

function processUseKey(profile, countArg) {
  if (!profile.keys || profile.keys <= 0) {
    return { text: `비밀열쇠가 없습니다!\n\n${profileText(profile)}`, imageUrl: null };
  }

  let count = parseItemCount(countArg);
  if (count === null) return {text:'사용법: /열쇠 [수량 1~1,000]. 잘못된 수량은 사용하지 않습니다.'};

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
      let cashAmt = getKeyCashReward(profile);
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

  let rewardLines = [`🔑 비밀열쇠 ${displayNumber(count)}개 연속 사용 결과:`];
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

function processBoxBatch(profile, limit = 100) {
  const catalog=getBoxCatalog();
  for(let i=0;i<catalog.length;i++) {
    const box=catalog[i];
    const count=Math.min(limit,(profile.inventory||[]).filter(x=>x.category==='box' && x.name===box.name && (x.boxSource===box.source || (!x.boxSource && box.source==='hunt'))).length);
    if(!count)continue;
    const before={cash:profile.cash||0,gold:profile.gold||0,gem:profile.gem||0};
    const titles=new Set(profile.ownedTitles||[]),avatars=new Set(profile.ownedAvatars||[]);
    processUpdatedBoxesCommand(profile,String(i+1)+' '+count,true);
    return {name:boxDisplayName(box),count,cash:profile.cash-before.cash,gold:profile.gold-before.gold,gem:profile.gem-before.gem,
      titles:(profile.ownedTitles||[]).filter(x=>!titles.has(x)),avatars:(profile.ownedAvatars||[]).filter(x=>!avatars.has(x))};
  }
  return null;
}

function processAllBoxes(profile) {
  const catalog = getBoxCatalog();
  const lines = ['📦 [상자 일괄개봉]'];
  let total = 0;
  // 현재 추가 상자는 상위 상자로만 이어진다. 새로 획득한 상자도 순서대로 개봉한다.
  for (let pass = 0; pass < catalog.length; pass++) {
    let opened = 0;
    catalog.forEach((box, index) => {
      const count = profile.inventory.filter(item => item.category === 'box' && item.name === box.name && (item.boxSource === box.source || (!item.boxSource && box.source === 'hunt'))).length;
      if (!count) return;
      const before = [profile.cash || 0, profile.gold || 0, profile.gem || 0];
      const titles = new Set(profile.ownedTitles || []), avatars = new Set(profile.ownedAvatars || []);
      processUpdatedBoxesCommand(profile, String(index + 1) + ' ' + count, true);
      const gained = [profile.cash || 0, profile.gold || 0, profile.gem || 0].map((n, i) => n - before[i]);
      lines.push('', boxDisplayName(box) + ' : ' + count.toLocaleString() + '개');
      if (gained[0]) lines.push('💵 현금 +' + won(gained[0]));
      if (gained[1]) lines.push('🧈 금괴 +' + gained[1].toLocaleString() + '개');
      if (gained[2]) lines.push('💎 보석 +' + gained[2].toLocaleString() + '개');
      const addedTitles = (profile.ownedTitles || []).filter(name => !titles.has(name));
      const addedAvatars = (profile.ownedAvatars || []).filter(name => !avatars.has(name));
      if (addedTitles.length) lines.push('🏆 칭호: ' + addedTitles.join(', '));
      if (addedAvatars.length) lines.push('👤 아바타: ' + addedAvatars.join(', '));
      if (!gained.some(Boolean) && !addedTitles.length && !addedAvatars.length) lines.push('새로 획득한 재화·칭호·아바타 없음 (미당첨 또는 이미 보유)');
      total += count; opened += count;
    });
    if (!opened) break;
  }
  if (!total) return { text: '개봉할 수 있는 상자가 없습니다.' };
  const remaining = profile.inventory.filter(item => item.category === 'box').length;
  lines.push('', '총 ' + total.toLocaleString() + '개 개봉 완료.', ...(remaining ? ['남은 상자 ' + remaining + '개는 보관했습니다. /상자 일괄개봉으로 이어서 개봉하세요. 미등록 상자는 개봉하지 않습니다.'] : []), '', resourceText(profile));
  return { text: lines.join('\n') };
}

function processUpdatedBoxesCommand(profile, arg, bulkOpening = false) {
  if (!Array.isArray(profile.inventory)) profile.inventory = [];
  if (!Array.isArray(profile.ownedTitles)) profile.ownedTitles = [];

  let cleanArg = (arg || '').trim();
  if (cleanArg === '일괄개봉') return processAllBoxes(profile);
  if (cleanArg && !/^[1-9]\d*\s+[1-9]\d*$/.test(cleanArg)) return { text: '사용법: /상자 [상자번호] [수량] (예: /상자 1 2)' };
  if (cleanArg && !cleanArg.split(/\s+/).every(x => Number.isSafeInteger(Number(x)))) return { text: '상자번호와 수량은 올바른 정수로 입력해 주세요.' };
  const parts = cleanArg.split(/\s+/).filter(Boolean);
  const catalog = getBoxCatalog();

  if (parts.length === 0) {
    const lines = [`📦 [보유 상자 목록]`];
    catalog.forEach((box, index) => {
      const count = profile.inventory.filter(item => item.category === 'box' && item.name === box.name && (item.boxSource === box.source || (!item.boxSource && box.source === 'hunt'))).length;
      lines.push(`${index + 1}. ${boxDisplayName(box)} : ${displayNumber(count)}개`);
    });
    lines.push(``, `💡 사용법: /상자 [번호] [개수] 또는 /상자 일괄개봉`);
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
  if (!Number.isSafeInteger(openCount) || openCount < 1 || (!bulkOpening && openCount > MAX_ITEM_USE_PER_REQUEST)) return {text:'상자는 한 번에 1~1,000개까지 개봉할 수 있습니다.'};
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
    `🎁 [상자 개봉 완료]\n${boxDisplayName(box)} : ${displayNumber(openCount)}개`,
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
  if(jobCode==='wizard')return '1차 마법사 Lv.'+skillLevel+'\n패시브 [효율적 주문] 강화 비용 Lv당 -1%\n패시브 [마력 이해] 파밍 경험치 Lv당 +1%';
  const fakeProfile={job:jobCode,firstJob:def.tier===1?jobCode:(JOB_CATALOG[jobCode]?.[2]||null),secondJob:def.tier===2?jobCode:null,jobSkillLevel:skillLevel,jobSkillLevels:{[jobCode]:skillLevel}};
  return `${def.tier}차 ${JOB_NAMES[jobCode]} Lv.${skillLevel}\n패시브 [${def.passive}] ${def.passiveDesc}\n액티브 [${def.active}] ${getActiveSkillDescription(fakeProfile,jobCode)}`;
}

function getJobSkillOverview(profile) {
  if (!profile.job) return '⚠️ 전직 후 스킬을 사용할 수 있습니다.';
  ensureSkillState(profile);
  const lines = ['⚡️ [전직 스킬]'];
  const first = getBaseJobCode(profile), second = getSecondJobCode(profile);
  if (first) {
    const lv=getJobSkillLevelFor(profile,first), max=getSkillDailyMax(profile,first), used=getSkillUses(profile,first);
    if(first==='wizard')lines.push('',getJobInfoText(first,lv));
    else lines.push('', `① ${JOB_NAMES[first]} Lv.${displayNumber(lv)}`, `패시브: ${JOB_SKILLS[first].passive} - ${JOB_SKILLS[first].passiveDesc}`, `액티브: ${JOB_SKILLS[first].active} - ${getActiveSkillDescription(profile,first)}`, (max?`사용: ${used}/${displayNumber(max)}회 · /스킬 1`:'횟수 제한 없음 · /스킬 1'));
  }
  if (second) {
    const lv=getJobSkillLevelFor(profile,second), max=getSkillDailyMax(profile,second), used=getSkillUses(profile,second);
    lines.push('', `② ${JOB_NAMES[second]} Lv.${displayNumber(lv)}`, `패시브: ${JOB_SKILLS[second].passive} - ${JOB_SKILLS[second].passiveDesc}`, `액티브: ${JOB_SKILLS[second].active} - ${getActiveSkillDescription(profile,second)}`, second==='battlemage' ? `사용: 마검 던전 ${profile.mgsDungeonData?.count||0}/${displayNumber(lv)}회 · /스킬 2` : (max?`사용: ${used}/${displayNumber(max)}회 · /스킬 2`:'설정·교환형 스킬 · /스킬 2'));
  }
  if (second==='necromancer') lines.push('', `⚡️ 영혼 : ${profile.skillState?.souls||0}개`);
  lines.push('', '강화: /전직 스킬 강화 1차 또는 /전직 스킬 강화 2차');
  return lines.join('\n');
}

function processJobCommand(profile, targetJob) {
  const current = JOB_CATALOG[profile.job];
  const costFactor = current && current[1] === 1 ? 10 : 1;
  const requiredCash = JOB_UNLOCK_CASH * costFactor;
  const requiredGold = JOB_UNLOCK_GOLD * costFactor;
  const choices = Object.entries(JOB_CATALOG).filter(([key, data]) => !current ? data[1] === 1 : current[1] === 1 && data[1] === 2 && data[2] === getBaseJobCode(profile));
  if (!targetJob) return { text: [current ? current[1]+'차 직업 : '+current[0] : '1차 전직 안내',
    choices.length ? '조건: '+(current ? '1차 전직 무기' : '모험가 무기')+' +20 / 현금 '+won(requiredCash)+' / 금괴 '+requiredGold+'개' : '2차 전직을 완료했습니다.',
    ...choices.map(([key,data]) => '/전직 '+data[0]), current ? getJobSkillOverview(profile) : ''].filter(Boolean).join('\n'),
    choices: choices.map(([key,data]) => ({label:'/전직 '+data[0],action:'/전직 '+data[0]})) };
  const selected = choices.find(([key,data])=>data[0]===targetJob);
  if (!selected) return {text:'현재 직업에서 선택할 수 없는 전직입니다. /전직으로 가능한 직업을 확인하세요.'};
  if ((current ? profile.jobEnhance : profile.enhance) < 20) return {text:'전직하려면 현재 무기를 +20까지 강화해야 합니다.'};
  if (profile.cash < requiredCash || profile.gold < requiredGold) return {text:shortageText(profile,{cash:requiredCash,gold:requiredGold})};
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
  return {text:'🎖️ ['+selected[1][1]+'차 전직 완료] '+selected[1][0]+'\n'+(selected[1][1]===2 ? '1차 전직 스킬은 그대로 유지됩니다.\n' : '')+selected[1][1]+'차 전직 무기 +0부터 강화할 수 있습니다.\n\n'+getJobSkillOverview(profile)+'\n\n'+currencyCostText('전직',{cash:requiredCash,gold:requiredGold})+'\n\n'+resourceText(profile), imageUrl:getEnhanceImage('success',0,profile.job)};
}
function resetJobTemporaryEffects(profile) {
  const st = ensureSkillState(profile);
  st.dailyUses = {};
  st.buffs = {};
  const currentJobState=jobState(profile);
  delete currentJobState.warriorBuff;
  currentJobState.rage=false;
  currentJobState.sword='';
  // 덫·진행 중 도박·영혼·수집한 스택은 보관한다.
  profile.mgsDungeonData = { date: getKSTDateString(), count: 0 };
}

function processJobChange(profile, targetJob) {
  const current=JOB_CATALOG[profile.job];
  const selected=Object.entries(JOB_CATALOG).find(([key,data])=>data[0]===targetJob);
  if (!current || !selected || selected[1][1]!==current[1] || selected[0]===profile.job)
    return {text:'같은 전직 차수의 다른 직업으로 변경할 수 있습니다. 예: /전직 변경 궁수 (1차), /전직 변경 스나이퍼 (2차)'};
  if(profile.cash<JOB_CHANGE_CASH || profile.gold<JOB_CHANGE_GOLD || profile.gem<JOB_CHANGE_GEM) return {text:shortageText(profile,{cash:JOB_CHANGE_CASH,gold:JOB_CHANGE_GOLD,gem:JOB_CHANGE_GEM})};
  const transferredSkillLevel = getJobSkillLevelFor(profile, profile.job);
  const transferredFirstSkillLevel=getJobSkillLevelFor(profile,getBaseJobCode(profile));
  const beforeSubweapon=getSubweaponInfo(profile);
  profile.cash-=JOB_CHANGE_CASH;profile.gold-=JOB_CHANGE_GOLD;profile.gem-=JOB_CHANGE_GEM;
  profile.job=selected[0];
  profile.firstJob=selected[1][1]===1?selected[0]:selected[1][2];
  profile.secondJob=selected[1][1]===2?selected[0]:null;
  setJobSkillLevelFor(profile,profile.firstJob,transferredFirstSkillLevel);
  // 같은 전직 차수 간 변경: 주무기·보조 강화 및 천장 기록을 유지하고 각 차수의 스킬 레벨을 이전한다.
  setJobSkillLevelFor(profile, selected[0], transferredSkillLevel);
  profile.jobSkillLevel=transferredSkillLevel;
  // 유료 직업 변경 시 오늘의 스킬 사용 횟수와 예약 버프는 모두 초기화한다.
  resetJobTemporaryEffects(profile);
  const afterSubweapon=getSubweaponInfo(profile);
  const subNotice=beforeSubweapon&&afterSubweapon?'\n🧰 보조무기 +'+afterSubweapon.level+' '+beforeSubweapon.type+' ➔ +'+afterSubweapon.level+' '+afterSubweapon.type+' (누적·천장 기록 유지)':'';
  return {text:'🎖️ [직업 변경 완료] '+current[0]+' ➔ '+selected[1][0]+'\n'+selected[1][1]+'차 스킬 레벨 Lv.'+transferredSkillLevel+' 그대로 이전 완료'+(selected[1][1]===2?'\n1차 스킬 레벨 Lv.'+transferredFirstSkillLevel+' 그대로 이전 완료':'')+subNotice+'\n✨ 직업 변경으로 오늘의 스킬 사용 횟수와 대기 중 버프가 초기화되었습니다.\n\n'+getJobSkillOverview(profile)+'\n\n'+currencyCostText('변경',{cash:JOB_CHANGE_CASH,gold:JOB_CHANGE_GOLD,gem:JOB_CHANGE_GEM})+'\n\n'+resourceText(profile)};
}

function processUpgradeJobSkill(profile, context = {}, target = '') {
  if (!profile.job) return { text: `⚠️ 전직하지 않은 상태에서는 전직 스킬을 강화할 수 없습니다. /전직을 먼저 해주세요.` };
  const first=getBaseJobCode(profile), second=getSecondJobCode(profile);
  const t=String(target||'').trim();
  let jobCode = (/^(1|1차|일차|첫)/.test(t) ? first : /^(2|2차|이차|둘)/.test(t) ? second : (second || first));
  if (!jobCode) return {text:'강화할 전직 스킬이 없습니다.'};
  const currentLevel = getJobSkillLevelFor(profile,jobCode);
  if (currentLevel >= 10) return { text: maximumText('⚡️ '+JOB_NAMES[jobCode]+' 스킬','Lv.10') };
  const goldCost = currentLevel * 100;
  if ((profile.gold || 0) < goldCost) return { text: shortageText(profile,{gold:goldCost}) };
  profile.gold -= goldCost;
  setJobSkillLevelFor(profile,jobCode,currentLevel+1);
  return {text:[`⚡️ [스킬 강화 성공] ${JOB_NAMES[jobCode]} Lv.${currentLevel} ➔ Lv.${currentLevel+1}`,'',getJobInfoText(jobCode,currentLevel+1),'',enhancementCostText({gold:goldCost}),'',spentResourceText(profile,{gold:goldCost})].join('\n')};
}

// 직업 개편 v2. 확률은 %p와 상대 가중치를 구분하고, 보상은 정수로 지급한다.
function skillLevel(p,job) { return getInheritedJobCodes(p).includes(job) ? getJobSkillLevelFor(p,job) : 0; }
function jobState(p) {
  if (!p.jobState || typeof p.jobState!=='object') p.jobState={};
  const s=p.jobState, today=getKSTDateString();
  if(s.version!==2){s.version=2;s.stacks=0;s.rage=false;s.sword='';}
  s.stacks=normalizeStoredInt(s.stacks,0,0,1000);
  if(s.day!==today){s.day=today;s.shopBought=[];s.blackBought=[];s.research=null;}
  return s;
}
function research(p) {
  if(!skillLevel(p,'elementalist'))return {name:'없음',cash:1,gold:1,gem:1};
  const s=jobState(p);
  if(!s.research){const r=Math.random();s.research=r<.05?'희귀':r<.37?'화염':r<.69?'번개':'냉기';}
  const n=skillLevel(p,'elementalist'), all=s.research==='희귀';
  return {name:s.research,cash:all||s.research==='화염'?1+(5+n)/100:1,gold:all||s.research==='번개'?1+n*.1:1,gem:all||s.research==='냉기'?1+n*.1:1};
}
function skillCredit(p,rewards) {
  for(const [k,n]of Object.entries(rewards))if(!['cash','gold','gem','keys','supplyItem'].includes(k)||!Number.isSafeInteger(n)||n<0||!Number.isSafeInteger((p[k]||0)+n))throw Error('스킬 재화가 저장 한도를 초과했습니다.');
  for(const[k,n]of Object.entries(rewards))p[k]=(p[k]||0)+n;
  return Object.entries(rewards).filter(([,n])=>n>0).map(([k,n])=>({cash:'💵 현금',gold:'🧈 금괴',gem:'💎 보석',keys:'🔑 비밀열쇠',supplyItem:'📦 보급'})[k]+' +'+n.toLocaleString()+(k==='cash'?'원':'개')).join('\n');
}
function weaponDiscount(p){return Math.min(90,Math.max(0,getImprintTotalBonus(p,'enhanceCostDown')+skillLevel(p,'wizard')));}
function raidEncounterChance(p){return .001*(1+skillLevel(p,'ranger')*.2);}
function shadowDouble(p){return skillLevel(p,'shadow')>0&&Math.random()<skillLevel(p,'shadow')*.01?2:1;}
const JOB_SHOP_ITEMS=[
 {name:'금괴 1개',cost:180000,reward:{gold:1}},
 {name:'보석 1개',cost:180000,reward:{gem:1}},
 {name:'비밀열쇠 1개',cost:100000,reward:{keys:1}},
 {name:'보급 1개',cost:200000,reward:{supplyItem:1}},
 {name:'금괴 2개',cost:350000,reward:{gold:2}}
];
function dailyShopItems(){let h=0;for(const c of getKSTDateString())h=(h*31+c.charCodeAt(0))>>>0;return [0,1,2].map(i=>JOB_SHOP_ITEMS[(h+i)%JOB_SHOP_ITEMS.length]);}
function jobShop(p,black,arg=''){
  if(black&&!skillLevel(p,'shadow'))return {text:'섀도우만 암시장을 이용할 수 있습니다.'};
  const s=jobState(p),items=black?[{name:'금괴 2개',cost:300000,reward:{gold:2}},{name:'보석 2개',cost:300000,reward:{gem:2}},{name:'열쇠 2개',cost:150000,reward:{keys:2}}]:dailyShopItems();
  const field=black?'blackBought':'shopBought';
  if(!s[field])s[field]=[];
  if(!arg)return {text:[black?'⚡️ 암시장':'🛒 일일상점',...items.map((v,i)=>`${i+1}. ${v.name} : ${won(v.cost)} ${s[field].includes(i)?'(구매완료)':''}`),'품목별 하루 1회 · 한국 시간 자정 갱신',`사용: /${black?'암시장':'일일상점'} 구매 번호`].join('\n')};
  const m=arg.match(/^구매 ([1-3])$/);if(!m)return {text:'구매 1~3 중 하나를 입력하세요.'};
  const i=Number(m[1])-1,v=items[i];if(s[field].includes(i))return {text:'오늘 이미 구매한 상품입니다.'};
  if(p.cash<v.cost)return {text:shortageText(p,{cash:v.cost})};
  const line=skillCredit(p,v.reward);p.cash-=v.cost;s[field].push(i);return {text:'구매 완료\n'+line+'\n'+currencyCostText('구매',{cash:v.cost})};
}
function gamble(p,arg){
  const s=jobState(p);let bet=s.gamble;
  const list=bet?.mode==='하드'?['불','물','대지','바람','얼음','전기','빛','어둠']:['불','물','대지','바람'];
  if(!arg)return {text:bet?`진행 중: ${bet.mode} ${bet.label} ${displayNumber(bet.amount)} / ${bet.wins}연승\n/스킬 2 선택 ${list.join('|')}\n/스킬 2 정산 또는 /스킬 2 포기`:'사용: /스킬 2 시작 이지|하드 현금|금괴|보석|비밀열쇠 수량\n원금 포함 배수: 이지 2/5/10, 하드 3/20/100\n각 속성 동일 확률, 실패 시 이번 판 원금 소멸.'};
  const m=arg.match(/^시작 (이지|하드) (현금|금괴|보석|비밀열쇠) ([1-9]\d*)$/);
  if(m){
    if(bet)return {text:'진행 중인 판부터 끝내세요.'};
    const field={현금:'cash',금괴:'gold',보석:'gem',비밀열쇠:'keys'}[m[2]],amount=Number(m[3]),cap=field==='cash'?100000:10;
    if(!Number.isSafeInteger(amount)||amount>cap)return {text:`한 판 상한: 현금 100,000원, 기타 재화 10개`};
    if((p[field]||0)<amount)return {text:shortageText(p,{[field]:amount})};
    if(!consumeSkillUse(p,'elementalist'))return {text:'오늘 도박 시작 횟수를 모두 사용했습니다.'};
    p[field]-=amount;s.gamble={mode:m[1],label:m[2],field,amount,wins:0};return gamble(p,'');
  }
  if(!bet)return {text:'먼저 도박을 시작하세요.'};
  if(arg==='포기'){delete s.gamble;return {text:'판을 포기했습니다. 건 재화는 반환되지 않습니다.'};}
  const multipliers=bet.mode==='하드'?[0,3,20,100]:[0,2,5,10];
  if(arg==='정산'){
    if(!bet.wins)return {text:'1회 이상 성공해야 정산할 수 있습니다.'};
    const text=skillCredit(p,{[bet.field]:bet.amount*multipliers[bet.wins]});delete s.gamble;return {text:'도박 정산 (원금 포함)\n'+text};
  }
  const pick=arg.match(/^선택 (\S+)$/);if(!pick||!list.includes(pick[1]))return {text:'선택 가능한 속성: '+list.join(', ')};
  const actual=list[rand(0,list.length-1)];
  if(actual!==pick[1]){delete s.gamble;return {text:`결과: ${actual} · 실패\n${bet.label} ${displayNumber(bet.amount)} 원금을 잃었습니다.`};}
  bet.wins++;
  if(bet.wins===3)return {text:`결과: ${actual} · 3연승!\n`+gamble(p,'정산').text};
  return {text:`결과: ${actual} · ${bet.wins}연승!\n현재 정산액: ${displayNumber(bet.amount*multipliers[bet.wins])} (원금 포함)\n/스킬 2 정산 또는 /스킬 2 선택 속성`};
}
function processJobSkill(profile,arg,context={}){
  const input=String(arg||'').trim();
  if(!input)return {text:getJobSkillOverview(profile)};
  const m=input.match(/^(1|2|1차|2차)(?:\s+(.*))?$/);if(!m)return {text:'사용: /스킬 1 또는 /스킬 2'};
  const job=m[1].startsWith('1')?getBaseJobCode(profile):getSecondJobCode(profile),a=m[2]||'';
  if(!job)return {text:'해당 차수의 전직이 필요합니다.'};
  const lv=skillLevel(profile,job),s=jobState(profile),st=ensureSkillState(profile),battle=context.battle;
  if(job==='berserker'){
    if(!['','활성화','비활성화'].includes(a))return {text:'사용: /스킬 2 활성화 또는 /스킬 2 비활성화'};
    if(a)s.rage=a==='활성화';return {text:`⚡️ 폭주 ${s.rage?'활성화':'비활성화'}\n매 파밍 턴 ${5+lv}% 확률: 현재 HP 20% 소모, 해당 턴 재화 x4, 처치 확률 x${(1+lv*.05).toFixed(2)}\n/스킬 2 활성화 · /스킬 2 비활성화`};
  }
  if(job==='swordmaster'){
    if(!['','대검','광검','도'].includes(a))return {text:'선택: 대검·광검·도'};
    if(a)s.sword=a;return {text:`⚡️ 현재 검: ${s.sword||'미선택'}\n/스킬 2 대검 : 카운터를 풀카운터로\n/스킬 2 광검 : 처치 시 ${displayNumber(lv)}% 확률로 2단계 진행\n/스킬 2 도 : 피격 전 ${displayNumber(lv)}% 회피`};
  }
  if(job==='elementalist')return gamble(profile,a);
  if(job==='shadow')return jobShop(profile,true,a);
  if(job==='archmage')return {text:'먼저 대결하면 반드시 승리합니다.\n사용: /대결 닉네임 횟수 또는 /대결 횟수\n일일 10회 안에서 정산, 없는 닉네임은 기존처럼 본인과 대결.'};
  if(job==='ranger'){
    if(!['','설치','회수'].includes(a))return {text:'사용: /스킬 2 설치 또는 /스킬 2 회수'};
    if(a==='설치'){
      if(s.trap)return {text:'설치된 덫을 먼저 회수하세요.'};
      if(!consumeSkillUse(profile,job))return {text:'오늘 설치 횟수를 모두 사용했습니다.'};
      s.trap={at:Date.now(),level:lv};return {text:'⚡️ 덫 설치 완료. 1시간 이후 회수 가능, 23시간에서 최대 보상.'};
    }
    if(!s.trap)return {text:'설치된 덫이 없습니다. /스킬 2 설치'};
    const hours=Math.max(0,(Date.now()-s.trap.at)/3600000),n=s.trap.level;
    if(a!=='회수')return {text:`⚡️ 경과 ${hours.toFixed(1)}시간\n1h 현금 → 5h 금괴 추가 → 10h 보석 추가 → 23h 최대\n/스킬 2 회수`};
    if(hours<1)return {text:'설치 후 1시간이 지나야 회수할 수 있습니다.'};
    const rewards={cash:rand(5000,10000)*n,gold:hours>=23?rand(2,4):hours>=5?rand(1,2):0,gem:hours>=23?rand(2,4):hours>=10?rand(1,2):0};
    const text=skillCredit(profile,rewards);delete s.trap;return {text:'⚡️ 덫 회수\n'+text};
  }
  if(job==='necromancer'){
    const match=a.match(/^교환 (현금|금괴|보석|비밀열쇠) ([1-9]\d*)$/);
    const prices={현금:10,금괴:100,보석:150,비밀열쇠:100};
    if(!match)return {text:`⚡️ 영혼 ${displayNumber(st.souls)}개\n10영혼=현금 ${displayNumber(1000*lv)}원, 100영혼=금괴1, 150영혼=보석1, 100영혼=열쇠1\n/스킬 2 교환 재화 수량 (최대 1,000묶음)`};
    const n=Number(match[2]),cost=prices[match[1]]*n;
    if(!Number.isSafeInteger(n)||n>1000||st.souls<cost)return {text:'영혼 부족 또는 수량 범위 초과입니다.'};
    const field={현금:'cash',금괴:'gold',보석:'gem',비밀열쇠:'keys'}[match[1]],text=skillCredit(profile,{[field]:n*(field==='cash'?1000*lv:1)});st.souls-=cost;return {text:'영혼 교환 완료\n'+text};
  }
  if(['warrior','battlemage','wizard'].includes(job)&&a)return {text:'올바른 스킬 명령어를 입력해 주세요.'};
  if(job==='warrior'){
    if(!battle||battle.mode!=='파밍'||battle.finished||!battle.alive)return {text:'진행 중인 파밍에서 사용하세요.'};
    if(!s.stacks)return {text:'실제 피격으로 쌓은 스택이 없습니다.'};
    if(!consumeSkillUse(profile,job))return {text:'오늘 사용 횟수를 모두 소모했습니다.'};
    const spent=Math.min(100,s.stacks);s.stacks-=spent;
    const healed=Math.min(100-battle.hp,spent*(1+Math.floor(lv/3)));battle.hp+=healed;
    s.warriorBuff={turns:3,mult:1+Math.min(.5,spent*.005+lv*.01)};
    return {text:`⚡️ 스택 ${displayNumber(spent)} 소모 · HP +${displayNumber(healed)}\n다음 3회 몬스터 공격 처치 확률 x${s.warriorBuff.mult.toFixed(2)}`};
  }
  if(job==='wizard')return {text:'마법사는 패시브 효과가 자동 적용됩니다.'};
  if(job==='battlemage')return processMgsDungeon(profile);
  if(job==='dualblade'){
    if(a)return {text:'사용: /스킬 2'};
    if(getSkillUses(profile,job)>=getSkillDailyMax(profile,job))return {text:'오늘 레이드 스킬 횟수를 모두 사용했습니다.'};
    return {text:'레이드 진입 확인 중',skillRaid:true};
  }
  if(job==='assassin'&&!['상인','광부','보석상','귀족'].includes(a))return {text:'대상 선택: /스킬 2 상인|광부|보석상|귀족\n성공률: 일반 70%, 귀족 40%'};
  if(a&&job!=='assassin')return {text:`사용: /스킬 ${m[1]}`};
  if(!consumeSkillUse(profile,job))return {text:'오늘 액티브 사용 횟수를 모두 소모했습니다.'};
  if(job==='archer')return processHunt(profile,{freeSkill:true});
  if(job==='thief'){const items=dailyShopItems(),v=items[rand(0,items.length-1)];return {text:'⚡️ 일일상점 선물: '+v.name+'\n'+skillCredit(profile,v.reward)};}
  if(job==='sniper'){
    const grade=pickMonsterGrade([['EX',.001],['S',.099],['A',.9],['B',4.1],['C',15],['D',25],['E',54.9]],Math.random());
    const rewards={cash:Math.floor(getRewardMoney(grade+'등급')*(1+lv*.1)),gold:grade==='EX'?10:grade==='S'?3:0};
    return {text:`⚡️ 현상금 저격 [${grade}등급]\n`+skillCredit(profile,rewards)};
  }
  if(job==='hawkeye'){
    const scores=[rand(0,10),rand(0,10),rand(0,10)],sum=scores.reduce((x,y)=>x+y,0);
    return {text:`⚡️ 표적: ${scores.join(' / ')} · 합계 ${displayNumber(sum)}/30점\n`+skillCredit(profile,{cash:sum*500*lv,gold:sum>=20?1:0,gem:sum===30?3:0})};
  }
  if(job==='assassin'){
    if(Math.random()>=(a==='귀족'?.4:.7))return {text:'⚡️ 소매치기 실패. 보유 재화 손실은 없습니다.'};
    return {text:'⚡️ '+a+' 소매치기 성공\n'+skillCredit(profile,{cash:a==='상인'||a==='귀족'?rand(5000,10000)*lv:0,gold:a==='광부'||a==='귀족'?rand(1,Math.max(1,Math.ceil(lv/3))):0,gem:a==='보석상'||a==='귀족'?rand(1,Math.max(1,Math.ceil(lv/3))):0})};
  }
  return {text:'사용할 스킬이 없습니다.'};
}


function parsePvpCommand(utterance){
 const arg=String(utterance||'').replace(/^\/대결\s*/,'').trim();
 if(!arg)return {nickname:'',count:1,explicit:false};
 if(arg.startsWith('"')){
   const m=arg.match(/^"([^"\r\n]+)"(?:\s+(\S+))?$/);
   if(!m)return {invalid:true};
   return {nickname:m[1],count:m[2]===undefined?1:Number(m[2]),explicit:m[2]!==undefined,invalid:m[2]!==undefined&&!/^[1-9]\d*$/.test(m[2])};
 }
 if(/^[+-]?[\d.]+$/.test(arg))return {nickname:'',count:Number(arg),explicit:true,invalid:!/^[1-9]\d*$/.test(arg)};
 const m=arg.match(/^(.*?)\s+([+-]?[\d.]+)$/);
 if(m)return {nickname:m[1],count:Number(m[2]),explicit:true,invalid:!/^[1-9]\d*$/.test(m[2])};
 return {nickname:arg,count:1,explicit:false};
}
function processPvpBattle(profile,match){
 const count=match?.requestedCount??1;
 if(!Number.isSafeInteger(count)||count<1||count>10)return {text:'대결 횟수는 1~10 정수입니다.'};
 if((count>1||match?.explicitCount)&&!skillLevel(profile,'archmage'))return {text:'일괄 대결은 아크메이지만 가능합니다.'};
 checkAndResetPvpLimit(profile);const n=Math.min(count,Math.max(0,10-profile.pvpData.count));
 if(!n)return {text:'오늘 대결 10회를 모두 사용했습니다.'};
 const lines=[];for(let i=0;i<n;i++){const before=profile.pvpData.count;lines.push(processPvpBattleSingle(profile,match).text);if(profile.pvpData.count===before)break;}
 return {text:lines.join('\n\n')};
}

function checkAndResetPvpLimit(profile) {
  const todayStr = getKSTDateString();
  if (!profile.pvpData || profile.pvpData.date !== todayStr) {
    profile.pvpData = { date: todayStr, count: 0 };
  }
}

function processPvpBattleSingle(profile, match) {
  if (!match || match.version !== 1) return {text:'실제 유저 대결은 최신 server.js와 db.js 연결이 필요합니다.'};
  if (match.reason === 'own_name') return {text:'본인 닉네임을 지정할 수 없습니다. 다른 닉네임 또는 /대결을 입력하세요.'};
  if (!match.opponent && !['not_found','no_players'].includes(match.reason)) return {text:'대결 상대 정보를 확인하지 못했습니다. 다시 시도해 주세요.'};
  const opponent = match.opponent ? createProfile(match.opponent) : profile;
  const selfBattle = !match.opponent;
  checkAndResetPvpLimit(profile);
  const MAX_PVP_COUNT = 10;

  if (profile.pvpData.count >= MAX_PVP_COUNT) {
    return { text: dailyLimitMessage('대결',profile.pvpData.count,MAX_PVP_COUNT) };
  }

  profile.pvpData.count += 1;

  const myPower = getAttackPower(profile);
  const enemyPower = getAttackPower(opponent);

  const myDmg = Math.floor(myPower * (rand(90, 110) / 100));
  const enemyDmg = Math.floor(enemyPower * (rand(90, 110) / 100));

  let outcomeMsg = '';
  let isWin = skillLevel(profile,'archmage')>0 || myDmg >= enemyDmg;

  if (isWin) {
    const rewardCash = applyCreatureCashBonus(rand(5000,15000)*getEconomyStage(profile),profile);
    profile.cash += rewardCash;
    outcomeMsg = `🎉 [대결 승리!]\n나의 피해량: ${myDmg.toLocaleString()} vs 상대 피해량: ${enemyDmg.toLocaleString()}\n보상 획득: 현금 +${won(rewardCash)} (전직 단계별 보상)`;
  } else {
    outcomeMsg = `💔 [대결 패배!]\n나의 피해량: ${myDmg.toLocaleString()} vs 상대 피해량: ${enemyDmg.toLocaleString()}\n상대방에게 더 큰 피해를 입어 승리하지 못했습니다.`;
  }

  return {
    text: [
      `🥊 [1대1 대결 성사] (${profile.pvpData.count}/${MAX_PVP_COUNT}회)`,
      selfBattle ? (match.reason === 'not_found' ? '해당 닉네임을 찾지 못해 본인 능력치로 대결합니다.' : '다른 유저가 없어 본인 능력치로 대결합니다.') : '상대: '+opponent.nickname,
      '💪 내 공격력: '+myPower.toLocaleString()+' / 상대 공격력: '+enemyPower.toLocaleString(),
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
    return { text: dailyLimitMessage('마검사 전용 던전',playerState.mgsDungeonData.count,sLvl) };
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
    earnedCash = Math.floor(applyCreatureCashBonus(earnedCash, playerState)*research(playerState).cash);

    let earnedGem = monster.rewardGem > 0 ? monster.rewardGem : 0;
    earnedGem = applyCreatureGemBonus(earnedGem, playerState);

    totalEarnedCash += earnedCash;
    totalEarnedGem += earnedGem;

    spawnedMonsters.push(monster);

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

  {
    spawnedMonsters.sort((a, b) => {
      return (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0);
    });
  }

  let monsterInfoBlocks = [];
  spawnedMonsters.forEach((m, idx) => {
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

  let headerText = `⚡️ [마검 전용 던전 토벌 완료! (${targetCount}마리)] (오늘 사용: ${playerState.mgsDungeonData.count}/${sLvl}회)` + (battlemageMaster ? `\n👑 [마스터 효과] 최종 현금·보석 보상 +10%` : '');
  let middleContent = `${monstersJoined}\n\n💰 획득 재화 :\n${summaryLines.join('\n')}`;

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
  const MAX_DUNGEON_COUNT = 10 + getResonanceInfo(profile).dungeonBonus;

  if (profile.dungeonData.count >= MAX_DUNGEON_COUNT) {
    return { text: dailyLimitMessage('던전',profile.dungeonData.count,MAX_DUNGEON_COUNT) };
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

const IMPRINT_UNLOCK_COSTS=Object.freeze({I:0,II:500,III:1000,IV:1500,V:2000});
function imprintSlotLines(profile,key) {
  const data=profile.imprints?.[key],name='각인 '+key;
  if(!data){const cost=IMPRINT_UNLOCK_COSTS[key];return ['🔒 '+name+' : 해금 비용 : '+(cost===0?'무료':'금괴 '+cost.toLocaleString()+'개')];}
  const opt=Array.isArray(data.options)?data.options[0]:null;
  if(!opt||typeof opt!=='object')return ['⚠️ * '+name+' * : 옵션 데이터가 손상되었습니다. /각인 변경으로 다시 설정해 주세요.'];
  const lines=[(profile.imprintLocks?.[key]?'🔒':'🔓')+' '+name+' : '+imprintOptionLabel(opt)+' '+imprintOptionValue(opt)];
  if(!IMPRINT_OPTION_POOL.some(item=>item.key===opt.key))lines.push('└ 기존 보유 옵션 · 현재 추첨 목록에서 제외');
  return lines;
}

function getImprintRerollQuote(profile) {
  const unlockedKeys=['I','II','III','IV','V'].filter(k=>profile.imprints?.[k]);
  const lockedCount=unlockedKeys.filter(k=>profile.imprintLocks?.[k]).length;
  const changeableCount=unlockedKeys.length-lockedCount;
  const multiplier=changeableCount>0?Math.pow(2,lockedCount):0;
  return {unlockedKeys,lockedCount,changeableCount,costCash:1000000*multiplier,costGold:20*multiplier};
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

  let lines = [`🪬 [각인 시스템]\n`];

  imprintTiers.forEach(tier=>lines.push(...imprintSlotLines(profile,tier.key)));

  const quote=getImprintRerollQuote(profile);
  if(quote.changeableCount>0)lines.push('',currencyCostText('변경',{cash:quote.costCash,gold:quote.costGold}));
  else lines.push('',quote.unlockedKeys.length?'변경할 슬롯의 잠금을 해제해 주세요.':'먼저 각인 슬롯을 해금해 주세요.');
  lines.push('', '📋 획득 가능한 각인 (7종)');
  for (const option of IMPRINT_OPTION_POOL) {
    lines.push('• '+imprintOptionLabel(option)+' : '+(option.key==='enhanceCostDown'?'-':'+')+'('+option.values[0]+'~'+option.values[option.values.length-1]+')'+option.unit);
  }
  lines.push('수치별 확률: 낮은 순서대로 30% / 30% / 20% / 10% / 10%');

  const showHelp = true;
  if (showHelp) {
    lines.push(`\n💡 사용 가능한 명령어:`);
    lines.push(`• /각인 해금 [1~5] - 해금 비용으로 해당 슬롯 해금`);
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

  const consumeGold=IMPRINT_UNLOCK_COSTS[tierKey];
  if ((profile.gold||0)<consumeGold) {
    return {text:shortageText(profile,{gold:consumeGold})};
  }
  const unlockSuccess=true;

  if (unlockSuccess) {
    if (consumeGold > 0) profile.gold -= consumeGold;

    let pool = [...IMPRINT_OPTION_POOL];
    const idx = rand(0, pool.length - 1);
    const optTemplate = pool[idx];
    const val = pickWeightedValue(optTemplate.values, optTemplate.weights);
    const selectedOptions = [{ name: optTemplate.name, value: val, unit: optTemplate.unit, key: optTemplate.key }];

    profile.imprints[tierKey] = { options: selectedOptions };

    let optText = '• '+imprintOptionLabel(selectedOptions[0])+' : '+imprintOptionValue(selectedOptions[0]);
    return {
      text: [
        `🪬 [각인 해금 완료] ${tierKey}`,
        ``,
        optText,
        ``,
        currencyCostText('해금',{gold:consumeGold}),
        ``,
        enhanceResourceText(profile)
      ].join('\n')
    };
  }

  return { text: `⚠️ 각인 해금 비용을 확인해 주세요.` };
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
    return { text: `🔒 [각인 ${slotNumStr}번 슬롯] 이미 잠겨있는 상태입니다.` };
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

function processImprintReroll(profile, arg = '') {
  if(String(arg).trim())return {text:'사용법: /각인 변경 (뒤에 다른 단어를 붙이지 마세요.)\n재화는 소모되지 않았습니다.',choices:IMPRINT_CHOICES};
  if (!profile.imprints) profile.imprints = {};
  if (!profile.imprintLocks) profile.imprintLocks = { I: false, II: false, III: false, IV: false, V: false };

  const {unlockedKeys,lockedCount,changeableCount,costCash,costGold}=getImprintRerollQuote(profile);
  if(!unlockedKeys.length)return {text:'⚠️ 해금된 각인 슬롯이 없습니다. 먼저 각인을 해금해 주세요.'};
  if(!changeableCount)return {text:'🔒 해금된 각인이 모두 잠겨 있습니다. 변경할 슬롯의 잠금을 먼저 해제해 주세요.\n재화는 소모되지 않았습니다.',choices:IMPRINT_CHOICES};

  if (profile.cash < costCash || (profile.gold || 0) < costGold) {
    return {
      text: shortageText(profile,{cash:costCash,gold:costGold})
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
  resultLines.push(currencyCostText('변경',{cash:costCash,gold:costGold}), ``);

  for(const key of ['I','II','III','IV','V'])resultLines.push(...imprintSlotLines(profile,key));

  resultLines.push(``);
  resultLines.push(resourceText(profile));
  return { text: resultLines.join('\n'), choices: IMPRINT_CHOICES };
}

function checkAndResetHuntLimit(playerState) {
  const todayStr = getKSTDateString();
  const dayOfWeek = getKSTParts().weekday;
  const maxLimit = Math.floor(((dayOfWeek === 0 || dayOfWeek === 6) ? 4000 : 2000)*(1+skillLevel(playerState,'hawkeye')*.01)) + getResonanceInfo(playerState).huntBonus;

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

function processHunt(playerState, options = {}) {
  const freeSkill = options.freeSkill === true;
  if (!playerState.huntData) {
    playerState.huntData = { date: "", count: 0, lastClaimedHuntQuest: 0 };
  }

  checkAndResetHuntLimit(playerState);
  const pendingHuntRewards=freeSkill?[]:[...claimCombatQuests(playerState,'hunt'),...claimDailyPassMissions(playerState)];
  const MAX_HUNT_COUNT = hasUnlimitedCounts(playerState) ? Infinity : (playerState.huntData.max || 2000);

  if (!freeSkill && playerState.huntData.count >= MAX_HUNT_COUNT) {
    return {
      text: [...pendingHuntRewards,dailyLimitMessage('사냥',playerState.huntData.count,MAX_HUNT_COUNT)].join("\n\n"),
      choices: HUNT_CHOICES,
      imageUrl: null,
      image: null,
      thumbnail: null
    };
  }

  const speed = playerState.speedMultiplier || 1;
  const remainingLimit = MAX_HUNT_COUNT - playerState.huntData.count;
  const actualHunts = freeSkill ? 20 : Math.min(speed, remainingLimit);
  
  if(!freeSkill) playerState.huntData.count += actualHunts;

  const lootMult = getGoldMultiplier(playerState);

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
    const firstHunt=!freeSkill && playerState.firstEncounters && !playerState.firstEncounters.huntUsed;
    let drawn=firstHunt?'S':pickMonsterGrade(getMonsterGradeWeights(playerState,true),Math.random());
    const huntSkillState = ensureSkillState(playerState);
    if(drawn==='GEM') {
      const resonance=getResonanceInfo(playerState);
      const gems=applyCreatureGemBonus(Math.max(1,rand(resonance.minGem,resonance.maxGem)),playerState)*shadowDouble(playerState);
      totalEarnedGem+=gems;gemEventCount++;
      if (isAdminIndependentHunt) independentHuntLines.push(`[${i+1}회] 💎 [재화] 보석 +${displayNumber(gems)}개`);
      else droppedLootTexts.push('💎 [재화] 보석 +'+gems+'개');
      continue;
    }
    const monster = getRandomMonsterByProbability(playerState,drawn,'hunt',!!firstHunt);
    if (!monster) continue;
    if(firstHunt)playerState.firstEncounters.huntUsed=true;

    let earnedCash = calculateCombatCash(playerState,monster.rewardMoney);

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

  // 표시 순서는 추첨 순서를 유지한다. 대표 이미지만 최고 등급을 사용한다.

  let monsterInfoBlocks = [];
  spawnedMonsters.forEach((m, idx) => {
    let displayGradeHeader = `[${m.grade}] `;
    if (playerState.job === 'battlemage' && m.isPassiveTriggered) {
      displayGradeHeader = `[${m.grade}] ⬆️ `;
    }
    if (idx === 0) {
      monsterInfoBlocks.push(
        `${displayGradeHeader}${m.fullName}`
      );
    } else {
      monsterInfoBlocks.push(
        `${displayGradeHeader}${m.fullName}`
      );
    }
  });

  const count=playerState.huntData.count;
  const huntQuestRewardMsgs=freeSkill?[]:[...pendingHuntRewards,...claimCombatQuests(playerState,'hunt'),...claimDailyPassMissions(playerState)];

  let finalRewardLines = [];
  if (huntQuestRewardMsgs.length > 0) {
    finalRewardLines.push(huntQuestRewardMsgs.join('\n'));
  }
  if (droppedLootTexts.length > 0) {
    finalRewardLines.push(droppedLootTexts.filter(line => spawnedMonsters.length > 0 || !line.startsWith('💎 [재화] 보석 +')).join('\n'));
  }

  let monstersJoined = isAdminIndependentHunt
    ? independentHuntLines.join('\n')
    : monsterInfoBlocks.join('\n');
  
  let summaryLines = [`💵 현금 +${won(totalEarnedCash)}`];
  if (totalEarnedGem > 0) {
    summaryLines.push(`💎 보석 : ${totalEarnedGem}개`);
  }

  let middleContent = `${isAdminIndependentHunt ? `🛠️ [관리자 독립 사냥 ${displayNumber(actualHunts)}회]\n` : ''}${monstersJoined}\n\n💰 획득 재화 :\n${summaryLines.join('\n')}`;
  if (!spawnedMonsters.length) middleContent = '💎 [재화] 보석 +' + displayNumber(totalEarnedGem) + '개';
  if (finalRewardLines.length > 0) {
    middleContent = middleContent + '\n\n' + finalRewardLines.filter(Boolean).join('\n\n');
  }

  const questThresholds = HUNT_QUEST_REWARDS.map(row=>row[0]).filter(n=>n<=playerState.huntData.max);
  let nextThreshold = questThresholds.find(t => t > count) || count;
  let remainingCount = nextThreshold - count;
  let questLeftText = remainingCount>0 ? `📜 퀘스트 보상까지 ${displayNumber(remainingCount)}회` : "📜 오늘의 사냥 퀘스트 완료";

  let footerLines = [
    '💵 현금 : ' + won(playerState.cash),
    ...((playerState.gem || 0)>startingGem ? ['💎 보석 : '+playerState.gem.toLocaleString()+'개'] : []),
    '',
    '🔘 배율 : x' + lootMult.toFixed(2) + ' | ⏩ 배속 (x' + speed + ')',
    '⚔️ 사냥 횟수 : (' + displayNumber(playerState.huntData.count) + '/' + (hasUnlimitedCounts(playerState) ? '무제한' : displayNumber(MAX_HUNT_COUNT)) + ')',
    questLeftText
  ];

  const text = `${freeSkill?'⚡️ 무료 사냥20회 (일일 횟수·퀘스트·패스 제외)\n':''}${middleContent.trim()}\n\n${footerLines.join('\n')}`;
  
  // 수정사항 3: /사냥 후 선택지 /파밍 제거하고 /사냥으로 통일
  const choices = HUNT_CHOICES;

  const firstMonster = spawnedMonsters.reduce((best, monster) => !best || gradeRank[monster.grade] > gradeRank[best.grade] ? monster : best, null);

  return {
    combatPerformed: !freeSkill,
    text,
    choices,
    imageUrl: firstMonster?.image ?? (gemEventCount > 0 ? BASE_URL+'/GEM_HUNT.png' : null),
    image: firstMonster?.image ?? null,
    thumbnail: firstMonster?.image ?? null,
    url: firstMonster?.image ?? null,
    monster: firstMonster
  };
}

function processSpeedCommand(profile, arg, battle = null) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  const maxAllowed = Math.max(1, getCombinedGrowthLevel(profile)); 

  const speedVal = parseStrictPositiveInteger(arg);
  if (speedVal === null || speedVal < 1 || speedVal > 20) {
    return { text: `⚠️ 올바른 배속 숫자를 입력해 주세요. (1~20 사이, 예: /배속 2)` };
  }

  if (speedVal > maxAllowed) {
    return { text: `⚠️ 증폭·공명 합산 레벨이 부족하여 해당 배속을 설정할 수 없습니다!\n• 증폭 Lv.${profile.combatLevel} + 공명 Lv.${getResonanceInfo(profile).level}\n• 최대 설정 가능 배속: x${maxAllowed}` };
  }

  profile.speedMultiplier = speedVal;
  profile.adminSpeedMode = false;
  const ongoingFarm = battle && battle.mode === '파밍' && battle.alive && !battle.finished && battle.farmRunCount;
  const timing = ongoingFarm
    ? `진행 중 파밍은 x${battle.farmRunCount}로 유지되며, 다음 파밍 게임부터 x${speedVal}이 적용됩니다. 사냥은 다음 명령부터 적용됩니다.`
    : '다음 파밍 및 사냥부터 적용됩니다.';
  return { text: `⏩ 배속이 [x${speedVal}](으)로 설정되었습니다!\n${timing}` };
}

function weaponCategory(profile, auxiliary=false) {
  return auxiliary?'sub':getJobTier(profile)>0?'job'+getJobTier(profile):'adventurer';
}
function weaponCategoryName(key) {
  return key==='sub'?'보조무기':key==='adventurer'?'모험가 무기':key.replace('job','')+'차 전직 무기';
}
function ensureEnhanceLedger(p) {
  if(!p.enhanceLedger || p.enhanceLedger.version!==1) {
    const tier=getJobTier(p);
    p.enhanceLedger={version:1,spent:{adventurer:normalizeStoredInt(p.totalEnhanceCost,0,0),
      job1:tier===1?normalizeStoredInt(p.totalJobEnhanceCost,0,0):0,job2:0,
      sub:normalizeStoredInt(p.totalSubweaponEnhanceCost,0,0)},claimed:{},
      legacyJobCost:tier!==1?normalizeStoredInt(p.totalJobEnhanceCost,0,0):0};
  }
  const l=p.enhanceLedger;
  if(!l.spent||typeof l.spent!=='object')l.spent={};
  if(!l.claimed||typeof l.claimed!=='object')l.claimed={};
  for(const key of ['adventurer','job1','job2','sub']) {
    l.spent[key]=normalizeStoredInt(l.spent[key],0,0);
    l.claimed[key]=l.claimed[key]===true;
  }
  l.legacyJobCost=normalizeStoredInt(l.legacyJobCost,0,0);
  return l;
}
function recordEnhanceSpend(p,key,cash) {
  const ledger=ensureEnhanceLedger(p);
  if(Number.isSafeInteger(cash)&&cash>0)ledger.spent[key]=(ledger.spent[key]||0)+cash;
}
// Expected cash from +0 to absorbing +20, including stay, downgrade and reset.
// Solve (I-Q)E=c instead of sampling, so the threshold is deterministic.
function expectedEnhanceCash(p,key) {
  const table=key==='adventurer'?ENHANCE_TABLE:key==='job2'?SECOND_JOB_ENHANCE_TABLE:JOB_ENHANCE_TABLE;
  const n=table.length,bonus=(getCombinedGrowthInfo(p).successBonus+getImprintTotalBonus(p,'enhanceSuccess'))/100;
  const discount=weaponDiscount(p)/100;
  const matrix=table.map((row,i)=>{
    const sr=Math.min(1,row.success+bonus);
    const kr=Math.min(1-sr,Math.max(0,row.keep-bonus));
    const dr=key==='adventurer'?0:Math.min(1-sr-kr,row.drop||0);
    const reset=Math.max(0,1-sr-kr-dr);
    const a=Array(n+1).fill(0);a[i]=1;
    if(i+1<n)a[i+1]-=sr;
    a[i]-=kr;a[Math.max(0,i-1)]-=dr;a[0]-=reset;
    a[n]=Math.max(0,Math.floor(row.cost*(1-discount)));
    return a;
  });
  for(let col=0;col<n;col++) {
    let pivot=col;for(let r=col+1;r<n;r++)if(Math.abs(matrix[r][col])>Math.abs(matrix[pivot][col]))pivot=r;
    [matrix[col],matrix[pivot]]=[matrix[pivot],matrix[col]];
    const divisor=matrix[col][col];if(Math.abs(divisor)<1e-14)return Infinity;
    for(let j=col;j<=n;j++)matrix[col][j]/=divisor;
    for(let r=0;r<n;r++)if(r!==col){const factor=matrix[r][col];for(let j=col;j<=n;j++)matrix[r][j]-=factor*matrix[col][j];}
  }
  return Math.max(0,matrix[0][n]);
}
function enhancePityThreshold(p,key){return Math.ceil(expectedEnhanceCash(p,key)*2.5);}
function claimEnhancePity(p,auxiliary=false) {
  if(auxiliary&&!getSubweaponInfo(p))return {text:'보조무기는 1차 전직 이후 사용할 수 있습니다.'};
  const key=weaponCategory(p,auxiliary),label=weaponCategoryName(key),ledger=ensureEnhanceLedger(p);
  if(ledger.claimed[key])return {text:'⚠️ '+label+' 천장은 이미 지급받았습니다. 종류별 최초 1회만 가능합니다.'};
  const field=auxiliary?'subweaponEnhance':p.job?'jobEnhance':'enhance';
  if((p[field]||0)>=20)return {text:'이미 '+label+' +20입니다. 천장 지급 기회는 소모되지 않습니다.'};
  const required=enhancePityThreshold(p,key),spent=ledger.spent[key]||0;
  if(!Number.isSafeInteger(required))return {text:'천장 금액을 계산할 수 없습니다. 관리자에게 문의해 주세요.'};
  if(spent<required)return {text:'⚠️ '+label+' 천장 미달성\n누적 '+won(spent)+' / 천장 '+won(required)+'\n남은 금액 '+won(required-spent)};
  const before=p[field]||0;
  p[field]=20;ledger.claimed[key]=true;
  const history=auxiliary?'maxSubweaponEnhanceHistory':p.job?'maxJobEnhanceHistory':'maxEnhanceHistory';
  p[history]=Math.max(20,p[history]||0);
  return {text:'🔨 [천장 강화 성공] '+label+' +'+before+' ➔ +20\n추가 재화 소모 없이 강화되었습니다.\n해당 무기 종류의 천장 지급 완료 (최초 1회)',
    imageUrl:auxiliary?getSubweaponImage(p):getEnhanceImage('success',20,p.job)};
}
function processAccumulated(profile) {
 const ledger=ensureEnhanceLedger(profile),lines=['📊 [누적 강화 비용]',''];
 for(const key of ['adventurer','job1','job2','sub'])lines.push((key==='sub'?'🧰 ':'🎖️ ')+weaponCategoryName(key),'💵 '+won(ledger.spent[key]||0),'[천장 금액 : '+won(enhancePityThreshold(profile,key))+']',...(ledger.claimed[key]?['천장 지급 완료 · 최초 1회']:[]),'');
 lines.push('천장 도달 후 강화 시 즉시 +20 강화 됩니다.','주무기 : /강화 · 보조무기 : /보조강화','','천장 금액은 능력치 보정 천장 기준입니다.','(기대값 ×2.5)');
 return {text:lines.join('\n')};
}

function processExchange(profile,arg='') {
 const table=[['cash',200000,'gold',1],['cash',1000000,'gem',1],['gold',1,'cash',2000],['gem',1,'cash',10000],['gold',5,'gem',1],['gem',1,'gold',1]];
 const labels={cash:'💵 현금',gold:'🧈 금괴',gem:'💎 보석'},unit=k=>k==='cash'?'원':'개',amountText=(k,n)=>labels[k]+' '+displayNumber(n)+unit(k);
 const input=String(arg).trim();
 if(!input)return {text:['💱 [교환 목록 안내]',...table.map(([a,n,b,m],i)=>(i+1)+'. '+amountText(a,n)+' → '+amountText(b,m)),'','💡 예시 : /교환 1 10 (1번 품목으로 10개 교환)'].join('\n')};
 const match=input.match(/^([1-6])\s+([1-9]\d*)$/);if(!match)return {text:'교환 번호는 1~6, 수량은 1 이상의 정수로 입력하세요.'};
 const [from,price,to,reward]=table[Number(match[1])-1],count=Number(match[2]),cost=count*price,gain=count*reward;
 if(![count,cost,gain,(profile[to]||0)+gain].every(Number.isSafeInteger))return {text:'교환 수량이 안전한 계산 범위를 초과했습니다.'};
 if((profile[from]||0)<cost)return {text:shortageText(profile,{[from]:cost})};
 profile[from]-=cost;profile[to]=(profile[to]||0)+gain;
 return {text:['💱 [교환 완료]',amountText(from,cost)+' → '+amountText(to,gain),'',resourceText(profile)].join('\n')};
}

function getJobPassiveRate(profile) {
  const level = Number(profile && profile.jobSkillLevel);
  return Math.max(1, Math.min(10, Number.isFinite(level) ? Math.floor(level) : 1)) / 100;
}
function getMonsterGradeWeights(profile, includeGemEvent=false, applySubweapon=true) {
  const factor=profile && getSecondJobCode(profile)==='battlemage' ? 1+getJobSkillLevelFor(profile,'battlemage')/100 : 1;
  const rows=[['EX',0.001],['S',0.099],['A',0.9],['B',4.1],['C',15],['D',25]];
  const high=applySubweapon ? 1+getResonanceInfo(profile).highGradeWeight : 1;
  const weighted=rows.map(([g,w])=>[g,(g==='D'?w:w*factor)*(['A','S','EX'].includes(g)?high:1)]);
  if(includeGemEvent)weighted.unshift(['GEM',(1+skillLevel(profile,'thief')*.01)*research(profile).gem]);
  weighted.push(['E',100-weighted.reduce((sum,row)=>sum+row[1],0)]);
  const level=applySubweapon ? getSubweaponLevel(profile || {}) : 0;
  if(level>0) {
    const gemWeight=weighted.find(([g])=>g==='GEM')?.[1] || 0;
    for(const row of weighted) if(row[0]!=='GEM') row[1] *= 1+SUBWEAPON_GRADE_BONUS[row[0]]*level/100;
    const total=weighted.reduce((sum,[g,w])=>sum+(g==='GEM'?0:w),0);
    for(const row of weighted) if(row[0]!=='GEM') row[1] *= (100-gemWeight)/total;
  }
  return weighted;
}
function pickMonsterGrade(weights, roll) {
  let value = roll * 100;
  for (const [grade, weight] of weights) { if (value < weight) return grade; value -= weight; }
  return 'E';
}
function getRandomMonsterByProbability(profile = null, selectedBase = null, rewardSource = 'hunt', baseOnly = false) {
  const weights = getMonsterGradeWeights(profile, false, rewardSource === 'hunt');
  const baseGradeGroup = selectedBase || pickMonsterGrade(weights, Math.random());
  const isPassiveTriggered = profile && getSecondJobCode(profile) === 'battlemage' && !['E','D'].includes(baseGradeGroup);

  let subRoll = Math.random() * 100;
  let selectedGrade = baseGradeGroup + "등급";
  const plusChance = Math.min(100,(1+skillLevel(profile,'archer')*.1)*(rewardSource==='hunt'?1+getResonanceInfo(profile).plusGradeWeight:1));
  if(!baseOnly && subRoll<plusChance)selectedGrade=baseGradeGroup+'+등급';

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
  const rewardGem = rewardSource === 'dungeon' ? getDungeonRewardGem(selectedGrade) : rollMonsterGem(selectedGrade);

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
  return rollMonsterGem(grade);
}

function startGame(existingProfile) {
  return formatDisplayResult(startGameRaw(existingProfile));
}
function startGameRaw(existingProfile) {
  let profile = createProfile(existingProfile);
  const showGuide = !profile.hasSeenBeginnerGuide;
  profile.hasSeenBeginnerGuide = true;
  let battle = profile.activeFarmBattle && !profile.activeFarmBattle.finished && profile.activeFarmBattle.hp > 0
    ? JSON.parse(JSON.stringify(profile.activeFarmBattle))
    : createBattle(profile);

  return {
    text: showGuide ? BEGINNER_GUIDE : `다시 오셨군요! /사냥 또는 /파밍으로 모험을 이어가세요.\n\n${battleStatusBoard(profile, battle)}`,
    imageUrl: null, 
    choices: showGuide ? BEGINNER_CHOICES : BATTLE_CHOICES,
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
function buildRaidText(...args) { return formatDisplayText(buildRaidTextRaw(...args)); }
function buildRaidTextRaw(profile, result) {
  const raid=result.raid, pct=Math.max(0,Math.min(100,raid.hp/raid.maxHp*100));
  const filled=Math.round(pct/10);
  const lines=['👹 협동 레이드',''];
  if(result.attacked) {
    lines.push('💥 피해량 : '+result.damage.toLocaleString());


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
function formatRanking(...args) { return formatDisplayText(formatRankingRaw(...args)); }
function formatRankingRaw(rows) {
  return ['🏆 공격력 랭킹 TOP 5','',...(rows.length ? rows.slice(0,5).map((r,i)=>(i+1)+'위· '+r.nickname+' | Lv.'+displayNumber(r.level)+'\n💪 공격력 : '+r.power.toLocaleString()+'\n🗡️ 무기　 : +'+r.enhance+' '+r.weaponName) : ['등록된 유저가 없습니다.'])].join('\n');
}
function parseAdminRename(utterance) {
  const match=String(utterance||'').trim().match(/^\/관리자\s+(\S+)\s+닉네임\s+(.+)$/u);
  if(!match)return null;
  const nickname=match[2].normalize('NFKC').trim();
  if(!nickname || Array.from(nickname).length>60 || /[\x00-\x1f\x7f]/.test(nickname))return null;
  return {targetId:match[1],nickname};
}

function formatRaidReward(...args) { return formatDisplayText(formatRaidRewardRaw(...args)); }
function formatRaidRewardRaw(raid, userId) {
  if (!raid || raid.hp > 0) return '';
  const reward = (raid.rewards || []).find(r => r.userId === userId);
  if (!reward) return '참여 기록이 없어 지급받은 보상이 없습니다.';
  return ['🎁 내 레이드 보상 ('+(raid.rewardPaid?'지급 완료':'순차 지급 중')+')',
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
  if (!(options.forceEncounter === true && isGameAdmin(options.actorId)) && !(options.skillEncounter===true && skillLevel(profile,'dualblade')>0 && raid.discoveredBy) && draw() >= raidEncounterChance(profile)) return empty;
  const attackPower=Math.floor(getRaidAttackPower(profile)*(skillLevel(profile,'dualblade')?1.2:1));
  if(attackPower<=0)return empty;
  const execute=false,percentStrike=false,damage=Math.min(raid.hp,attackPower);

  return {version:RAID_RULES_VERSION,source,attacked:true,attackPower,damage,cashEarned:Math.floor(damage*ECONOMY_RULES.raidCashRate),goldEarned:1+Math.floor(draw()*6),gemEarned:1+Math.floor(draw()*6),execute,percentStrike,defeated:damage===raid.hp};
}
function formatRaidAttackEffects(...args) { return formatDisplayText(formatRaidAttackEffectsRaw(...args)); }
function formatRaidAttackEffectsRaw(result) {
  if (!result || !result.attacked) return '';
  return ['👹 공동 레이드 조우!',

    '피해량 : '+result.damage.toLocaleString(), '💵 현금 +'+result.cashEarned.toLocaleString()+'원', '🧈 금괴 +'+result.goldEarned+'개', '💎 보석 +'+result.gemEarned+'개'].filter(Boolean).join('\n');
}

function hasUnlimitedCounts(profile) {
  return !!(profile && profile.adminUnlimitedCounts === true && isGameAdmin(profile.userId));
}
function processTurn(state, utterance, context = {}) {
  const invalid=validateCommandInput(utterance);
  if(invalid)return {text:invalid,choices:[],state:state||{}};
  return formatDisplayResult(processTurnRaw(state,utterance,context));
}
function processTurnRaw(state, utterance, context = {}) {
  if (requiresGameAdmin(utterance) && !isGameAdmin(context && context.userId)) {
    return { text: "관리자만 사용할 수 있는 명령어입니다.", choices: [], state: state || {} };
  }
  if (String(utterance || '').trim().split(' ').filter(Boolean).join(' ') === '/관리자 횟수' && isGameAdmin(context && context.userId)) {
    const profile = createProfile(state && state.profile);
    profile.userId = context.userId;
    profile.adminUnlimitedCounts = !profile.adminUnlimitedCounts;
    const result = { text: profile.adminUnlimitedCounts
      ? '🛠️ 횟수 제한 해제: 파밍·사냥 무제한 / 다시 /관리자 횟수를 입력하면 기존 일일 제한으로 돌아갑니다.'
      : '🛠️ 횟수 제한 복원: 기존 파밍·사냥 일일 한도를 적용합니다. / 누적 사용 횟수는 유지됩니다.',
      choices: [], category: 'adminCounts', state: { profile, battle: state && state.battle } };
    if (state && typeof state === 'object') state.profile = profile;
    return result;
  }
  const adminAttack=String(utterance||'').trim().match(/^\/관리자\s+공격력(?:\s+(.*))?$/);
  if(adminAttack && isGameAdmin(context.userId)) {
    const value=adminAttack[1]||'',power=/^[1-9]\d*$/.test(value)?Number(value):NaN;
    if(value!=='해제'&&(!Number.isSafeInteger(power)||power>1000000000000))return {text:'사용법 : /관리자 공격력 [1~1,000,000,000,000] 또는 /관리자 공격력 해제',choices:[],state};
    const profile=createProfile(state&&state.profile);profile.userId=context.userId;profile.adminAttackPower=value==='해제'?null:power;
    const next={...(state||{}),profile};if(state)state.profile=profile;
    return {text:value==='해제'?'🛠️ 관리자 공격력 설정 해제':'🛠️ 관리자 공격력 : '+displayNumber(power),choices:[],state:next};
  }
  const adminSpeed = String(utterance||'').trim().match(/^\/관리자\s+배속\s+(\d+)$/);
  if (adminSpeed && isGameAdmin(context && context.userId)) {
    const speedVal = Number(adminSpeed[1]);
    const profile = createProfile(state && state.profile);
    const battle = state && state.battle;
    if (!Number.isSafeInteger(speedVal) || speedVal < 1 || speedVal > 1000) {
      return { text: '⚠️ 관리자 배속은 1~1,000 사이의 정수만 설정할 수 있습니다.\n예: /관리자 배속 1000', state: { profile, battle } };
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
    resetJobTemporaryEffects(profile);
    return {text:'🛠️ 관리자 전직 완료: '+entry[1][0]+'\n조건·비용 없이 전직했습니다. 무기 +0 / 스킬 Lv.'+getJobSkillLevelFor(profile,entry[0]),imageUrl:getEnhanceImage('success',0,profile.job),state:{profile,battle:state && state.battle},adminAction:'job'};
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
  if(result)for(const field of ['imageUrl','image','thumbnail'])if(typeof result[field]==='string')result[field]=normalizeImageFilename(result[field]);
  if (result && result.state && result.state.profile) {
    const updated = result.state.profile;
    if (result.combatPerformed === true && ['farm','hunt'].includes(result.category)) {
      const attendance = claimAttendance(updated, true);
      if (attendance) result.text = attendance + '\n\n' + result.text;
    }
    // 최초 입력 명령도 그대로 수행하며, 신규 사용자에게만 안내를 한 번 덧붙인다.
    if (!updated.hasSeenBeginnerGuide) {
      updated.hasSeenBeginnerGuide = true;
      result.text += '\n\n' + BEGINNER_GUIDE;
    }
  }
  if(result?.state?.battle?.mode==='파밍' && result.category==='skill') {
    result.state.battle.progressVersion=(result.state.battle.progressVersion||0)+1;
    result.state.profile.activeFarmBattle=JSON.parse(JSON.stringify(result.state.battle));
  }
  // No offline queue: older servers ignore this field, and unprocessed attacks never accrue.
  if (context.sharedRaidPassives === true && result && result.combatPerformed) {
    result.raidIntent = {version:RAID_RULES_VERSION,source:result.category};
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
  // Set today's research on the saved profile before any dashboard clones it.
  if(skillLevel(profile,'elementalist')>0)research(profile);
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

  if (/^\/(암시장|일일상점)(?:\s|$)/.test(input)) {
    const m=input.match(/^\/(암시장|일일상점)(?:\s+(.*))?$/);
    return {...jobShop(profile,m[1]==='암시장',m[2]||''),state:{profile,battle},choices:[]};
  }
  if (cleanInput === '/광고') {
    const day=getEconomyDay(profile);
    if(day.ads>=ECONOMY_RULES.adDailyMax)return {text:'오늘 광고 보상은 모두 받았습니다. (3/3회)',state:{profile,battle},choices:[]};
    const rewards={cash:rand(ECONOMY_RULES.adCashMin,ECONOMY_RULES.adCashMax),gold:rand(0,1),gem:rand(0,1),keys:rand(0,1)};
    for(const [field,amount] of Object.entries(rewards)) {
      const next=Number(profile[field]||0)+amount;
      if(!Number.isSafeInteger(next))return {text:'재화 저장 한도를 초과했습니다.',state:{profile,battle}};
    }
    for(const [field,amount] of Object.entries(rewards))profile[field]=(profile[field]||0)+amount;
    day.ads++;
    return {text:['🎁 광고 보상 ('+day.ads+'/'+ECONOMY_RULES.adDailyMax+'회)' ,'현재는 광고 없이 보상을 지급합니다.','💵 현금 +'+won(rewards.cash),'🧈 금괴 +'+rewards.gold+'개','💎 보석 +'+rewards.gem+'개','🔑 비밀열쇠 +'+rewards.keys+'개'].join('\n'),choices:[],state:{profile,battle},category:'ad'};
  }
  if (/^\/레이드(?:\s|$)/.test(cleanInput)) {
    return { text: '협동 레이드는 서버와 DB의 레이드 기능 연결이 필요합니다.', choices: [], state: { profile, battle } };
  }

  if (/^\/관리자(?:\s|$)/.test(cleanInput) || cleanInput === '/랭킹') {
    return { text: '해당 기능은 서버 연결이 필요합니다.', choices: [], state: { profile, battle } };
  }

  if (cleanInput === '/가이드') {
    profile.hasSeenBeginnerGuide = true;
    return {text:BEGINNER_GUIDE,choices:BEGINNER_CHOICES,imageUrl:null,category:'guide',state:{profile,battle}};
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
      choices: startResult.choices,
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
      choices: [],
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
      choices: [],
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
      choices: [],
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
      choices: [],
      category: 'secret',
      state: { profile, battle }
    };
  }

  if (input === '/출석') {
    const missionMessages = claimDailyPassMissions(profile);
    const attendance = claimAttendance(profile);
    return {text:[attendance || '⚠️ 이미 오늘 출석 체크를 완료하셨습니다.', ...missionMessages].join('\n\n'), choices:END_BATTLE_CHOICES, state:{profile,battle}};
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
      `• /가이드 - 처음 시작하는 분을 위한 안내`,
      `• /랭킹 - 공격력 랭킹`,
      `• /id - 사용자 ID 확인`,
      `• /레이드 - 공동 레이드 체력 조회`,
      `• /광고 - 임시 광고 보상 받기`,
      `• /파밍 - 파밍 시작 (기존 전투 기능 대체)`,
      `• /컬렉션 [페이지] - 사냥 몬스터 수집 현황 및 영구 효과`,
      `• /강화 - 무기 강화`,
      `• /제련 - 제련 정보 확인`,
      `• /강화 [목표 단계] - 목표까지 강화, 재화 부족 시 중단`,
      `• /보조 - 보조무기 능력치 확인`,
      `• /보조강화 - 보조무기 강화`,
      `• /증폭 - 증폭 정보 확인`,
      `• /공명 - 공명 정보 확인`,
      `• /배속 [1~20] - 증폭·공명 합산 레벨 내에서 배속 설정 (최소 x1)`,
      `• /금고 - 금고 정보 확인 및 입/출금/구매/레벨업`,
      `• /열쇠 [수량] - 비밀열쇠를 지정한 수량만큼 연속 사용`,
      `• /상자 - 보유 상자 확인 및 개봉 (/상자 [상자번호] [수량])`,
      `• /보급 [수량] - 보급 재화를 사용해 칭호 및 재화 획득`,
      `• /칭호 - 칭호 정보 및 보유 목록 확인`,
      `• /아바타 - 아바타 정보 및 보유 목록 확인`,
      `• /크리처 - 현재 크리처 정보 및 등급 확인`,
      `• /전직 [직업명] - 전직 안내 및 직업 전직`,
      `• /스킬 - 보유 스킬 확인`,
      `• /업적 - 업적 진행도와 누적 현금 보너스 확인`,
      `• /대결 [닉네임] - 실제 유저 대결 (생략 시 무작위)`,
      `• /던전 - 고등급 던전 입장`,
      `• /각인 - 각인 정보 확인`,
      `• /전리품 - T1~T6 세트 전리품 및 세트 효과 확인`,
      `• /프로필 - 내 정보 확인`,
      `• /스탯 - 적용 중인 능력치 상세 확인`,
      `• /사냥 - 몬스터 사냥 및 현금 보상 획득`,
      `• /누적 - 무기 종류별 누적 비용·천장 확인`,
      `• /강화 - 천장 도달 후 입력 시 주무기 +20`,
      `• /보조강화 - 천장 도달 후 입력 시 보조무기 +20`,
      `• /교환 [번호] [수량] - 재화 교환`,
      `• /출석 - 출석 확인 및 보상 획득`,
      `• /패스 - 월간 시즌 패스 정보 확인 및 미션 현황`,
      `• /일일상점 - 오늘의 상품 · /암시장 - 섀도우 전용 상품`,
      `• /스킬 - 1차·2차 전직 스킬 사용 안내`
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
    const maxFarmLimit = hasUnlimitedCounts(profile) ? Infinity : (profile.farmData ? profile.farmData.max : FARM_DAILY_LIMIT);

    // 전투 횟수는 '완료된 파밍 게임 수' 기준이다. 진행 중 턴마다 증가시키지 않는다.
    if (profile.farmData.count >= maxFarmLimit) {
      return {
        text: [...pendingQuestMessages, dailyLimitMessage('파밍',profile.farmData.count,maxFarmLimit)].join('\n\n'),
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

      battle.accumulatedExp = Math.round((battle.accumulatedCash || 0) / 100);
      if (battle.accumulatedExp > 0) {
        // 이미 배율이 적용된 현금으로 계산한 EXP에 추가 배율을 곱하지 않는다.
        const expResult = addExp(profile, battle.accumulatedExp, getDedicatedExpMultiplier(profile));
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
        '====☠️ [사망]====',
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

  if (command === '/보조' || command === '/보조강화') {
    let result;
    if (command === '/보조강화') result = processSubweaponEnhance(profile, arg);
    else if (/^강화(?:\s|$)/.test(arg)) result = processSubweaponEnhance(profile, arg.replace(/^강화\s*/, ''));
    else if (arg.trim()) result = {text:'사용법: /보조 또는 /보조강화 [목표 단계]'};
    else result = {text:subweaponText(profile)};
    return {...result, imageUrl:getSubweaponImage(profile), choices:[{label:'/보조'},{label:'/보조강화'}], category:'subweapon', state:{profile,battle}};
  }

  // 3. /강화 명령어 (단일 /목표 강화)
  if (command === '/강화') {

    if (arg.trim()) {
      const targetLvl = /^[1-9]\d*$/.test(arg.trim()) ? Number(arg.trim()) : NaN;
      const gResult = processEnhanceToTarget(profile, targetLvl);
      return {
        text: gResult.text,
        imageUrl: getEnhanceImage('success',getCurrentEnhanceLevel(profile),profile.job),
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
    return { text: '기존 /연속 강화는 종료되었습니다. /강화 [목표 단계]를 사용해 주세요. 예: /강화 15', choices: ENHANCE_CHOICES, state: { profile, battle } };
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

  if (command === '/공명' || command === '/공명강화') {
    const value = arg.trim();
    const upgrading = command === '/공명강화' || /^강화(?:\s|$)/.test(value);
    const countText = command === '/공명강화' ? value : value.replace(/^강화\s*/, '');
    let result;
    if (upgrading) {
      result = countText === '' ? processResonance(profile, 1) : {text:'횟수 없이 /공명 강화 를 입력해 주세요. 한 번에 1단계만 강화됩니다.'};
    } else result = value ? {text:'사용법: /공명 또는 /공명 강화 (한 번에 1단계)'} : showResonanceInfo(profile);
    return {...result, imageUrl:null, choices:RESONANCE_CHOICES, category:'resonance', state:{profile,battle}};
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
    const targetCount = !arg.trim() || arg.trim() === '1' ? 1 : NaN;

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
      choices: (profile.vault?.level || 0) > 0
        ? [{label:'/금고',action:'/금고'}, {label:'/금고 레벨업',action:'/금고 레벨업'},
           {label:'금고 100,000원 입금',action:'/금고 100000'}, {label:'/금고 출금',action:'/금고 출금'}]
        : [{label:'/금고 해금',action:'/금고 해금'}, {label:'/금고',action:'/금고'}],
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
      choices:[],
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

  // 20. /스킬 명령어
  if (command === '/스킬') {
    const sResult = processJobSkill(profile, arg, {...context,battle});
    return {
      skillRaid: sResult.skillRaid === true,
      text: sResult.text,
      imageUrl: sResult.imageUrl || null,
      choices: sResult.choices || END_BATTLE_CHOICES,
      category: 'skill',
      state: { profile, battle }
    };
  }

  // 21. /대결 명령어
  if (command === '/대결') {
    const pResult = processPvpBattle(profile, context.pvpMatch);
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
      choices: [{ label: '/던전' }],
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
    const iReroll = processImprintReroll(profile, arg);
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

  if (command === '/스탯') {
    if (arg.trim()) return {text:'사용법: /스탯', state:{profile,battle}};
    const viewProfile=createProfile(profile);
    // Inspect the live battle without changing the saved player state.
    if (battle && battle.mode==='파밍') viewProfile.activeFarmBattle=JSON.parse(JSON.stringify(battle));
    return {
      text:activeAbilityText(viewProfile).join('\n'),
      imageUrl:null,
      choices:[],
      category:'profile',
      state:{profile,battle}
    };
  }

  if (command === '/프로필') {
    if(arg.trim() && arg.trim()!=='상세')return {text:'사용법: /프로필 · 적용 중인 능력치: /스탯',state:{profile,battle}};
    const pText = profileText(profile)+'\n\n✨ 적용 중인 능력치: /스탯';
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
    const accResult = arg.trim() ? {text:'사용법 : /누적 · 천장 강화는 /강화 또는 /보조강화'} : processAccumulated(profile);
    return {
      text: accResult.text,
      imageUrl: accResult.imageUrl || null,
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
      choices:[{label:'/패스 보상',action:'/패스 보상'}],
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
      choices:[{label:'/패스 보상',action:'/패스 보상'}],
      category: 'passClaim',
      state: { profile, battle }
    };
  }

  // 알 수 없는 명령어 처리
  const board = isPlayingBattle ? battleStatusBoard(profile, battle) : profileText(profile);
  return {
    text: `⚠️ 알 수 없거나 지원하지 않는 명령어입니다. /를 입력하여 전체 명령어 목록을 확인해 보세요.\n\n${board}`,
    imageUrl: null,
    choices: isPlayingBattle ? BATTLE_CHOICES : END_BATTLE_CHOICES,
    state: { profile, battle }
  };
}

// Module Exports (Node.js/카카오 챗봇 백엔드 연동용)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { processBoxBatch, normalizeEquippedCosmetics, validateCommandInput, normalizeImageFilename,
    checkAndResetSeasonPass, raidEncounterChance, parsePvpCommand, consumeSkillUse, getSecondJobCode,
    isGameAdmin, requiresGameAdmin, parseAdminGrant, ADMIN_RESOURCES, formatRanking, formatRaidReward,
    RAID_RULES_VERSION, resolveRaidAttack, formatRaidAttackEffects,
    addRaidBox, RAID_BOX_NAME, RAID_TITLE, RAID_AVATAR,
    parseAdminRename, getCurrentEnhanceLevel,
    JOB_CATALOG, JOB_SKILLS, getEnhanceImage, getWeaponInfo,
    RAID_IMAGE: BASE_URL + '/images/RAID_1.png',
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

// 
// game.js - 이미지 출력 및 명령어 인식 완벽 호환 통합 파일
//

const MAX_TURN = 15;
const EXP_PER_LEVEL_BASE = 200;
const JOB_UNLOCK_CASH = 50000000;
const JOB_UNLOCK_GOLD = 500;
const JOB_CHANGE_CASH = 100000000;
const JOB_CHANGE_GOLD = 2000;
const JOB_CHANGE_GEM = 2000;
const REFINE_BASE_CASH = 10000000;

const BASE_URL = 'https://raw.githubusercontent.com/cjsxlrmt234-commits/bot-images/main'; 

const prefixes = {
  "D등급": ["초보", "약한", "지저분한", "배고픈", "겁먹은"],
  "C등급": ["단단한", "날쌘", "거친", "사나운", "독이 묻은"],
  "B등급": ["거대한", "흉포한", "타락한", "어둠의", "철갑"],
  "A등급": ["광폭한", "고대의", "지옥의", "군주", "수호자"],
  "S등급": ["파멸의", "절망의", "신들의", "혼돈의", "태초의"]
};

const monsters = [
  // D등급 (1~10)
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

  // C등급 (1~10)
  { name: "들쇠 토끼", grade: "C등급", description: "튼튼한 뒷발로 강력한 돌려차기를 구사하는 전투용 거대 토끼.", image: `${BASE_URL}/images/C_1.png` },
  { name: "돌멩이 골렘", grade: "C등급", description: "하급 마석의 힘으로 움직이는 거친 바위 조각들의 집합체.", image: `${BASE_URL}/images/C_2.png` },
  { name: "독니 독사", grade: "C등급", description: "늪지대에 서식하며 물리면 마비 효과를 일으키는 초급 독사.", image: `${BASE_URL}/images/C_3.png` },
  { name: "그림자 늑대", grade: "C등급", description: "어두운 숲에서 무리를 지어 사냥하며 야간에 은신 능력이 뛰어난 맹수.", image: `${BASE_URL}/images/C_4.png` },
  { name: "고블린 투창병", grade: "C등급", description: "날카로운 뼈 창을 원거리에서 던져 사냥감을 괴롭히는 소형 휴머노이드.", image: `${BASE_URL}/images/C_5.png` },
  { name: "가시멧돼지", grade: "C등급", description: "온몸이 단단한 강철 가시로 덮여 있어 돌진 공격이 특기인 야수.", image: `${BASE_URL}/images/C_6.png` },
  { name: "부서진 해골 병사", grade: "C등급", description: "고대 전장의 잔해에서 마력에 의해 되살아난 하급 언데드 전사.", image: `${BASE_URL}/images/C_7.png` },
  { name: "하급 샐러맨더", grade: "C등급", description: "불길이 약하게 감싸고 있는 도마뱀 형태로, 뜨거운 열기를 뿜어냄.", image: `${BASE_URL}/images/C_8.png` },
  { name: "맹독 벌레떼", grade: "C등급", description: "떼 지어 날아다니며 상대의 시야를 가리고 피부를 갉아먹는 곤충형 몬스터.", image: `${BASE_URL}/images/C_9.png` },
  { name: "늪지 요괴", grade: "C등급", description: "이끼와 진흙으로 위장하여 지나가는 나그네를 물속으로 끌어들이는 괴물.", image: `${BASE_URL}/images/C_10.png` },

  // B등급 (1~10)
  { name: "철갑 오크 장교", grade: "B등급", description: "두꺼운 철판 갑옷을 두르고 거대한 철퇴를 휘두르는 오크 지휘관.", image: `${BASE_URL}/images/B_1.png` },
  { name: "서리 하피", grade: "B등급", description: "매서운 얼음 바람을 일으키며 높은 고도에서 급강하해 발톱으로 공격하는 괴물.", image: `${BASE_URL}/images/B_2.png` },
  { name: "그림자 암살자", grade: "B등급", description: "빛을 흡수하는 은신 스킬을 사용해 단숨에 급소를 노리는 인간형 유령.", image: `${BASE_URL}/images/B_3.png` },
  { name: "화염 사냥개", grade: "B등급", description: "지옥의 불길을 입은 채 맹렬하게 달리는 머리 두 개 달린 마수.", image: `${BASE_URL}/images/B_4.png` },
  { name: "바위 거인", grade: "B등급", description: "산비탈의 돌무더기가 뭉쳐서 만들어진 거대한 체구의 골렘.", image: `${BASE_URL}/images/B_5.png` },
  { name: "세이렌", grade: "B등급", description: "매혹적인 노랫소리로 항해사나 모험가의 정신을 빼놓고 물속으로 유인하는 정령.", image: `${BASE_URL}/images/B_6.png` },
  { name: "맹독 아라크네", grade: "B등급", description: "온몸에서 강한 산성 독을 뿜어내며 벽과 천장을 자유롭게 기어 다니는 거미 괴물.", image: `${BASE_URL}/images/B_7.png` },
  { name: "유령 기사", grade: "B등급", description: "찢어진 깃발을 들고 밤마다 옛 전장을 순찰하는 저주받은 기사 망령.", image: `${BASE_URL}/images/B_8.png` },
  { name: "라이트닝 드레이크", grade: "B등급", description: "번개를 뿜어내기 시작하는 어린 단계의 용족 괴물.", image: `${BASE_URL}/images/B_9.png` },
  { name: "피의 구울", grade: "B등급", description: "시체를 탐닉하며 인간의 이성을 잃고 육식 본능만 남은 흉포한 언데드.", image: `${BASE_URL}/images/B_10.png` },

  // A등급 (1~10)
  { name: "심연의 리치", grade: "A등급", description: "금지된 흑마술을 극도로 연마해 영혼의 힘으로 언데드 군단을 지휘하는 마법사.", image: `${BASE_URL}/images/A_1.png` },
  { name: "서리 거룡", grade: "A등급", description: "입김만으로 주변 반경 수 킬로미터를 순식간에 얼어붙게 만드는 성숙한 용족.", image: `${BASE_URL}/images/A_2.png` },
  { name: "지옥불 미노타우로스", grade: "A등급", description: "몸 전체가 용암처럼 이글거리는 도끼를 휘두르는 미궁의 지배자.", image: `${BASE_URL}/images/A_3.png` },
  { name: "고대 뱀파이어 백작", grade: "A등급", description: "수백 년 동안 인간의 피를 흡수해 절대적인 속도와 최면 능력을 지닌 흡혈귀.", image: `${BASE_URL}/images/A_4.png` },
  { name: "폭풍의 정령왕", grade: "A등급", description: "하늘에서 거대한 번개와 폭풍을 자유자재로 불러일으키는 재앙급 정령.", image: `${BASE_URL}/images/A_5.png` },
  { name: "철혈의 와이번 킹", grade: "A등급", description: "수많은 와이번 무리를 이끄는 우두머리로, 강철 같은 비늘을 지님.", image: `${BASE_URL}/images/A_6.png` },
  { name: "타락한 성기사 멜키르", grade: "A등급", description: "신성력을 잃고 어둠의 계약에 물들어 거대한 대검을 휘두르는 타락한 영웅.", image: `${BASE_URL}/images/A_7.png` },
  { name: "거대 심해 크라켄", grade: "A등급", description: "바다 한가운데서 배를 통째로 집어삼키는 다리의 촉수를 가진 거대 수중 괴물.", image: `${BASE_URL}/images/A_8.png` },
  { name: "혼돈의 나무", grade: "A등급", description: "숲 전체를 독성 안개로 물들이고 뿌리로 적을 포박하는 거대한 고대 식물.", image: `${BASE_URL}/images/A_9.png` },
  { name: "공허의 마녀", grade: "A등급", description: "차원의 틈새를 열어 시공간을 왜곡하는 저주 마법을 구사하는 최상급 마법사.", image: `${BASE_URL}/images/A_10.png` },

  // S등급 (1)
  { name: "공허의 군주", grade: "S등급", description: "차원과 현실의 경계를 완전히 무너뜨리고 세계를 흡수하려는 외신(外神)적 존재", image: `${BASE_URL}/images/S_1.png` }
];

const gradeRewards = {
  "D등급": { min: 100, max: 300 },
  "D+등급": { min: 400, max:1000  },
  "C등급": { min: 1100, max: 2000 },
  "C+등급": { min: 2200, max: 3000 },
  "B등급": { min: 3300, max: 4000 },
  "B+등급": { min: 4400, max: 6000 },
  "A등급": { min: 7000, max: 10000, gem: 1 },
  "A+등급": { min: 15000, max: 30000, gem: 5 },
  "S등급": { min: 50000, max: 100000, gem: 10 },
  "S+등급": { min: 100000, max: 500000, gem: 50 }
};

const LOOT_DATABASE = {
  stock: [
    { tier: "T1", name: "스탠다드 플라스틱 개머리판", desc: "투박하고 헐거운 사출 플라스틱 소재의 기본 개머리판 — 흔들거리고 어깨에 닿는 느낌이 엉성한 최하위 파츠입니다." },
    { tier: "T2", name: "와이어 프레임 스톡", desc: "철제 와이어를 꺾어 만든 단순한 접이식 개머리판 — 가볍지만 뺨을 대고 조준할 때 안정감이 떨어지는 입문용 파츠입니다." },
    { tier: "T3", name: "택티컬 카빈 스톡", desc: "현대 돌격소총에 널리 쓰이는 길이 조절식 모던 폴리머 개머리판 — 무난한 고정성과 깔끔한 실루엣을 제공합니다." },
    { tier: "T4", name: "에르고노믹 컴뱃 스톡", desc: "고무 패드와 뺨이 닿는 칙패드가 보강된 전술형 개머리판 — 반동 흡수력이 뛰어나 실전파 유저들이 선호하는 중급형 파츠입니다." },
    { tier: "T5", name: "스켈레톤 저격용 스톡", desc: "불필요한 무게를 덜어내고 다이얼로 치수를 정밀 조절할 수 있는 하이엔드 스톡 — 날렵하고 전문적인 저격수 감성을 뿜어냅니다." },
    { tier: "T6", name: "테크니컬 스마트 하이퍼 스톡", desc: "충격 흡수 유압 댐퍼와 자세 교정 센서가 내장된 궁극의 개머리판 — 압도적인 비주얼과 완벽한 반동 제어 스펙을 자랑합니다." }
  ],
  silencer: [
    { tier: "T1", name: "스탠다드 깡통 소음기", desc: "투박한 원통형 철관 — 소음 효과는 미미하지만 튜토리얼 초반에 겨우 얻는 가장 볼품없는 기본형입니다." },
    { tier: "T2", name: "슬림 피스톨 소음기", desc: "가늘고 길쭉한 형태 — 권총이나 소형 기관단총에 장착해 은밀함을 살짝 더해주는 입문용 파츠입니다." },
    { tier: "T3", name: "오퍼레이터 서프레서", desc: "다각 모따기 처리가 된 모던한 폴리머/스틸 혼합형 — 대중적이며 무난한 소음 및 화염 억제력을 보여줍니다." },
    { tier: "T4", name: "플루티드 택티컬 소음기", desc: "총열 표면에 홈(Flute)이 파여 방열 성능을 높인 중급형 — 세련된 디자인과 안정적인 반동 제어를 제공합니다." },
    { tier: "T5", name: "하이엔드 퀵디스커버리 소음기", desc: "티타늄 소재에 퀵 탈착 레버가 장착된 고급형 — 가볍고 날렵한 실루엣으로 하이테크 느낌을 줍니다." },
    { tier: "T6", name: "마스터피스 사일런서", desc: "첨단 흡음 메커니즘과 카본 패턴이 적용된 궁극의 소음기 — 소음과 명중률을 동시에 극대화하는 최상위 파츠입니다." }
  ],
  scope: [
    { tier: "T1", name: "오픈 아이언 사이트 / 플라스틱 도트", desc: "저가형 플라스틱 틀에 대충 박힌 조준기 — 시야가 답답하고 멋이 전혀 나지 않습니다." },
    { tier: "T2", name: "오판 도트 시이트", desc: "투박한 직사각형 박스 형태의 입문용 도트 — 가까운 거리는 잘 보이지만 실내 전투 외에는 아쉬운 성능입니다." },
    { tier: "T3", name: "홀로그래픽 컴팩트 스코프", desc: "원형 링 레티클이 선명하게 빛나는 모던한 1배율 광학기 — 반응 속도가 빠르고 챗봇 무기 디자인에 무난하게 어울립니다." },
    { tier: "T4", name: "하이브리드 중거리 스코프 (3배율)", desc: "접이식 매그니파이어가 조합된 전술형 스코프 — 근거리와 중거리를 모두 커버하는 실전파 유저 선호형입니다." },
    { tier: "T5", name: "샤프슈터 정밀 스코프 (6배율)", desc: "길쭉한 본체와 다이얼이 촘촘히 박힌 저격용 광학 장비 — 날렵하고 전문적인 저격수 감성을 뿜어냅니다." },
    { tier: "T6", name: "테크니컬 스마트 스코프", desc: "열화상 및 탄도 계산 HUD가 연동되는 초고가 하이테크 스코프 — 압도적인 비주얼과 최고급 스펙을 자랑하는 궁극의 조준경입니다." }
  ],
  magazine: [
    { tier: "T1", name: "싱글스택 철제 탄창", desc: "누렇게 바랜 철판 느낌의 얇고 긴 기본 탄창 — 장탄 수도 적고 잔고장이 많아 보이 는 촌스러운 형태입니다." },
    { tier: "T2", name: "바나나형 스틸 탄창", desc: "꺾인 곡선이 들어간 표준형 탄창 — 군용 총기의 상징과도 같지만 다소 낡은 느낌을 줍니다." },
    { tier: "T3", name: "폴리머 윈맥스 탄창", desc: "투명 창이 살짝 나 있어 잔탄 확인이 가능한 모던 폴리머 탄창 — 실용성과 깔끔한 디자인을 챙겼습니다." },
    { tier: "T4", name: "듀얼 클립 패스트 탄창", desc: "탄창 두 개가 밴드로 결합되어 신속한 재장전이 가능한 택티컬형 — 전투 지속력을 높여주는 프로 튜닝 파츠입니다." },
    { tier: "T5", name: "드럼 캔디 탄창", desc: "대용량 탄약을 원형으로 수납하는 드럼 탄창 — 화력 덕후들이 선호하는 거대하고 위압적인 실루엣입니다." },
    { tier: "T6", name: "퀀텀 에너지/고강도 카본 드럼 탄창", desc: "초경량 신소재와 급탄 모터가 내장된 최첨단 하이엔드 탄창 — 미래지향적인 디자인과 무한에 가까운 연사력을 상징합니다." }
  ],
  grip: [
    { tier: "T1", name: "플라스틱 민무늬 손잡이", desc: "총몸과 일체형인 밋밋하고 미끄러운 기본 그립 — 그립감이 떨어지고 장시간 파지 시 손이 아픕니다." },
    { tier: "T2", name: "버티컬 포워드 그립", desc: "총열 하단에 수직으로 장착하는 단순한 손잡이 — 반동을 억제하기 시작하는 가장 기초적인 전술 그립입니다." },
    { tier: "T3", name: "앵글드 택티컬 그립", desc: "비스듬한 각도로 손목 부담을 줄여주는 모던 폴리머 그립 — 현대 소총에서 가장 널리 쓰이는 무난한 파츠입니다." },
    { tier: "T4", name: "러버ized 에르고노믹 그립", desc: "미끄럼 방지 고무 코팅과 손가락 홈이 정교하게 파인 프로 튜닝형 — 최상의 파지감을 제공합니다." },
    { tier: "T5", name: "바이포드 겸용 스켈레톤 그립", desc: "평소에는 날렵한 수직 그립이지만 필요시 다리가 펼쳐지는 하이브리드 파츠 — 저격과 돌격을 모두 잡은 하이엔드 그립입니다." },
    { tier: "T6", name: "스마트 홀로그래픽 컨트롤 그립", desc: "생체 인식 센서와 반동 제어 댐퍼가 내장된 궁극의 마스터피스 그립 — 화려한 LED 라인과 최고 스펙을 자랑합니다." }
  ]
};

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
  { cost: 1250000, success: 0.27, keep: 0.67, drop: 0.05, destroy: 0.01, gemCost: 11 },
  { cost: 1500000, success: 0.24, keep: 0.69, drop: 0.05, destroy: 0.02, gemCost: 12 },
  { cost: 1750000, success: 0.21, keep: 0.71, drop: 0.05, destroy: 0.03, gemCost: 13 },
  { cost: 2000000, success: 0.18, keep: 0.73, drop: 0.05, destroy: 0.04, gemCost: 14 },
  { cost: 2250000, success: 0.15, keep: 0.75, drop: 0.05, destroy: 0.05, gemCost: 15 },
  { cost: 2500000, success: 0.12, keep: 0.77, drop: 0.05, destroy: 0.06, gemCost: 16 },
  { cost: 2750000, success: 0.10, keep: 0.77, drop: 0.05, destroy: 0.08, gemCost: 17 },
  { cost: 3000000, success: 0.08, keep: 0.77, drop: 0.05, destroy: 0.10, gemCost: 18 },
  { cost: 3500000, success: 0.06, keep: 0.77, drop: 0.05, destroy: 0.12, gemCost: 19 },
  { cost: 4000000, success: 0.05, keep: 0.75, drop: 0.05, destroy: 0.15, gemCost: 20 },
];

const REFINE_STARS = [
  ' ',        // 0성 (공백)
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
  { level: 0, costNext: 1000, minGold: 1, maxGold: 1, multBonus: 0.00, headWeight: 0.00, successBonus: 0.0 },
  { level: 1, costNext: 1000, minGold: 1, maxGold: 2, multBonus: 0.20, headWeight: 0.05, successBonus: 0.5 },
  { level: 2, costNext: 2000, minGold: 1, maxGold: 3, multBonus: 0.40, headWeight: 0.10, successBonus: 1.0 },
  { level: 3, costNext: 3000, minGold: 1, maxGold: 4, multBonus: 0.60, headWeight: 0.15, successBonus: 1.5 },
  { level: 4, costNext: 4000, minGold: 1, maxGold: 5, multBonus: 0.80, headWeight: 0.20, successBonus: 2.0 },
  { level: 5, costNext: 5000, minGold: 2, maxGold: 6, multBonus: 1.00, headWeight: 0.30, successBonus: 2.5 },
  { level: 6, costNext: 6000, minGold: 2, maxGold: 7, multBonus: 1.20, headWeight: 0.40, successBonus: 3.0 },
  { level: 7, costNext: 7000, minGold: 2, maxGold: 8, multBonus: 1.50, headWeight: 0.50, successBonus: 3.5 },
  { level: 8, costNext: 8000, minGold: 2, maxGold: 9, multBonus: 1.60, headWeight: 0.65, successBonus: 4.0 },
  { level: 9, costNext: 9000, minGold: 2, maxGold: 10, multBonus: 1.80, headWeight: 0.80, successBonus: 4.5 },
  { level: 10, costNext: 0, minGold: 3, maxGold: 11, multBonus: 2.00, headWeight: 1.00, successBonus: 5.0 }
];

const FARM_TABLE = {
  solo: [
    ['supplyItem', 0.5],
    ['gold', 1],
    ['key', 2.0],
    ['jackpot', 6.5],
    ['damage', 45.0],
    ['kill_single', 40.0],
    ['kill_multi', 5.0]
  ],
  duo: [
    ['supplyItem', 0.75],
    ['gold', 1.5],
    ['key', 2.25],
    ['jackpot', 6.5],
    ['damage', 45.0],
    ['kill_single', 22.0],
    ['kill_multi', 22.0]
  ],
  squad: [
    ['supplyItem', 1.0],
    ['gold', 2],
    ['key', 2.5],
    ['jackpot', 9.5],
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
  { label: '/파밍', action: '/파밍' },
  { label: '/도망', action: '/도망' }
];

const LOBBY_CHOICES = [
  { label: '/파밍', action: '/파밍' },
  { label: '/강화', action: '/강화' }
];

const ENHANCE_CHOICES = [
  { label: '/강화', action: '/강화' },
  { label: '/파밍', action: '/파밍' }
];

const AMPLIFY_CHOICES = [
  { label: '/증폭강화', action: '/증폭강화' }
];

const REFINE_CHOICES = [
  { label: '/제련강화', action: '/제련강화' }
];

const IMPRINT_CHOICES = [
  { label: '/각인변경', action: '/각인변경' }
];

const JOB_CHOICES = [
  { label: '/전직 스팅거', action: '/전직 스팅거' },
  { label: '/전직 센티넬', action: '/전직 센티넬' },
  { label: '/전직 섀도우', action: '/전직 섀도우' }
];

const IMPRINT_OPTION_POOL = [
  { name: '헤드샷 데미지 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'headDmg' },
  { name: '현금 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'cashBoost' },
  { name: '헤드샷 확률 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'headRate' },
  { name: '헤드샷 확률 가중치 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'headWeight' },
  { name: '강화 성공 확률 증가', values: [0.1, 0.2, 0.3, 0.4, 0.5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceSuccess' },
  { name: '강화 비용 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'enhanceCostDown' },
  { name: '추가 금괴 획득 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'goldChance' },
  { name: '듀오, 스쿼드 매칭 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'multiMeet' },
  { name: '경험치 획득량 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'expBoost' },
  { name: '추가 비밀열쇠 획득 확률 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'keyChance' },
  { name: '피해량 감소', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '', key: 'damageReduce' },
  { name: '전투력 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'combatBoost' }
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
  if (statusType === 'destroy' && enhanceLevel > 0) {
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
  return Number(total.toFixed(4));
}

function getLootMultiplier(profile) {
  if (!profile || !profile.inventory || profile.inventory.length === 0) return 1.00;
  let totalMultiplier = 1.00;
  profile.inventory.forEach(item => {
    let tierNum = 1;
    if (item.tier === "T2") tierNum = 2;
    else if (item.tier === "T3") tierNum = 3;
    else if (item.tier === "T4") tierNum = 4;
    else if (item.tier === "T5") tierNum = 5;
    else if (item.tier === "T6") tierNum = 6;
    totalMultiplier += 0.10 * tierNum;
  });
  return Number(totalMultiplier.toFixed(2));
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

  const rawHead = (baseHead + imprintHeadRate) * (1 + ampInfo.headWeight + (imprintHeadWeight / 100));
  const remainingBodyLeg = Math.max(0, 100 - rawHead);
  const numHead = rawHead;
  const numBody = remainingBodyLeg / 2;
  const numLeg = remainingBodyLeg / 2;

  return {
    mult: `x${baseMult}`,
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
    gem: safeObj.gem ?? 0,
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
    inventory: safeObj.inventory ?? [],
    nickname: nickname,
    title: safeObj.title ?? '',
    supplyItem: safeObj.supplyItem ?? safeObj.monthItems ?? 0,
    gamesPlayed: safeObj.gamesPlayed ?? 0,
    maxEnhanceHistory: safeObj.maxEnhanceHistory ?? (safeObj.enhance ?? 0),
    maxJobEnhanceHistory: safeObj.maxJobEnhanceHistory ?? (safeObj.jobEnhance ?? 0),
    hasSeenJobGuide: safeObj.hasSeenJobGuide ?? false,
    farmData: safeObj.farmData ?? { date: "", count: 0, lastClaimedFarmQuest: 0 },
    huntData: safeObj.huntData ?? { date: "", count: 0, lastClaimedHuntQuest: 0 },
    speedMultiplier: safeObj.speedMultiplier ?? 1,
    helpSeen: safeObj.helpSeen ?? {}
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
  const kstDate = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
  const todayStr = kstDate.toISOString().slice(0, 10);
  const dayOfWeek = kstDate.getDay();
  const maxLimit = (dayOfWeek === 0 || dayOfWeek === 6) ? 200 : 100;

  if (!playerState.farmData || playerState.farmData.date !== todayStr) {
    playerState.farmData = { date: todayStr, count: 0, max: maxLimit, lastClaimedFarmQuest: 0 };
  } else {
    playerState.farmData.max = maxLimit;
    if (playerState.farmData.lastClaimedFarmQuest === undefined) {
      playerState.farmData.lastClaimedFarmQuest = 0;
    }
  }
}

function profileText(profile, detailed = false) {
  const p = createProfile(profile);
  const reqExp = getRequiredExp(p.level);
  const combatPower = getCombatPower(p);
  const currentEnhance = getCurrentEnhanceLevel(p);
  const [wName] = getWeaponInfo(currentEnhance, p.job);
  const refineStar = REFINE_STARS[p.refine] || '';
  
  const totalMult = getGoldMultiplier(p).toFixed(2);

  const jobNames = { stinger: '스팅거', sentinel: '센티넬', shadow: '섀도우' };
  const jobDisplay = p.job ? `${jobNames[p.job] || p.job} (Lv.${p.jobSkillLevel || 1})` : '없음';

  let lines = [
    `📊 프로필 대시보드`,
    `닉네임 : ${p.nickname}`,
    `칭호 : ${p.title}`,
    `🎖️ 직업 : ${jobDisplay}`,
    `🎯 무기 : +${currentEnhance} ${wName}`,
    `🔥 제련 : ${refineStar}`,
    `⭐ Lv.${p.level} (${(p.exp || 0).toLocaleString()}/${reqExp.toLocaleString()})`,
    `💪 전투력 : ${combatPower.toLocaleString()} (증폭 Lv.${p.combatLevel || 0})`,
    `🔘 배율 : x${totalMult}`,
    `⏩ 배속 : x${p.speedMultiplier || 1}`
  ];

  if (detailed) {
    const headDmgBonus = getImprintTotalBonus(p, 'headDmg');
    const headRateBonus = getImprintTotalBonus(p, 'headRate');
    const headWeightBonus = getImprintTotalBonus(p, 'headWeight');
    const combatBoostBonus = getImprintTotalBonus(p, 'combatBoost');
    const cashBoostBonus = getImprintTotalBonus(p, 'cashBoost');
    const enhanceSuccessBonus = getImprintTotalBonus(p, 'enhanceSuccess');
    const enhanceCostDownBonus = getImprintTotalBonus(p, 'enhanceCostDown');
    const goldChanceBonus = getImprintTotalBonus(p, 'goldChance');
    const multiMeetBonus = getImprintTotalBonus(p, 'multiMeet');
    const expBoostBonus = getImprintTotalBonus(p, 'expBoost');
    const keyChanceBonus = getImprintTotalBonus(p, 'keyChance');
    const damageReduceBonus = getImprintTotalBonus(p, 'damageReduce');

    if (headDmgBonus !== 0) lines.push(`헤드샷 데미지 : +${headDmgBonus}%`);
    if (headWeightBonus !== 0) lines.push(`헤드샷 가중치 : +${headWeightBonus}%`);
    if (combatBoostBonus !== 0) lines.push(`전투력 증가 : +${combatBoostBonus}%`);

    if (headRateBonus !== 0) lines.push(`헤드샷 확률 증가 : +${headRateBonus}%`);
    if (cashBoostBonus !== 0) lines.push(`현금 획득량 증가 : +${cashBoostBonus}%`);
    if (enhanceSuccessBonus !== 0) lines.push(`강화 성공 확률 증가 : +${enhanceSuccessBonus}%`);
    if (enhanceCostDownBonus !== 0) lines.push(`강화 비용 감소 : +${enhanceCostDownBonus}%`);
    if (goldChanceBonus !== 0) lines.push(`추가 금괴 획득 확률 증가 : +${goldChanceBonus}%`);
    if (multiMeetBonus !== 0) lines.push(`듀오, 스쿼드 매칭 확률 증가 : +${multiMeetBonus}%`);
    if (expBoostBonus !== 0) lines.push(`경험치 획득량 증가 : +${expBoostBonus}%`);
    if (keyChanceBonus !== 0) lines.push(`추가 비밀열쇠 획득 확률 증가 : +${keyChanceBonus}%`);
    if (damageReduceBonus !== 0) lines.push(`피해량 감소 : +${damageReduceBonus}`);

    if (p.imprints && Object.keys(p.imprints).length > 0) {
      lines.push(``, `🔮 장착된 각인 목록 :`);
      const imprintNames = { I: '각인 I', II: '각인 II', III: '각인 III', IV: '각인 IV', V: '각인 V' };
      ['I', 'II', 'III', 'IV', 'V'].forEach(k => {
        if (p.imprints[k] && p.imprints[k].options && p.imprints[k].options.length > 0) {
          const opt = p.imprints[k].options[0];
          lines.push(`• ${imprintNames[k]} : ${opt.name} +${opt.value}${opt.unit}`);
        }
      });
    }
  }

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
    escapeCount: 0,
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
    startSnapshot: { cash: profile?.cash || 0, gold: profile?.gold || 0, gem: profile?.gem || 0, keys: profile?.keys || 0, supplyItem: profile?.supplyItem || 0 },
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

  checkAndResetFarmLimit(p);
  const currentFarmCount = p.farmData ? p.farmData.count : 0;
  const maxFarmLimit = p.farmData ? p.farmData.max : 100;

  const farmThresholds = [10, 25, 50, 100, 150, 200];
  const nextFarmTarget = farmThresholds.find(t => t > currentFarmCount) || 200;
  const remainingFarmCount = Math.max(0, nextFarmTarget - currentFarmCount);
  const questLeftText = `📜 퀘스트 보상까지 ${remainingFarmCount}회`;

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
    `배율 (x${totalMult}) | 배속 (x${p.speedMultiplier || 1})`,
    `전투 횟수 : (${currentFarmCount}/${maxFarmLimit})`,
    questLeftText
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
    `💎 보석 : ${(p.gem || 0).toLocaleString()}개`,
    `🔑 비밀열쇠 : ${(p.keys || 0).toLocaleString()}개`,
    `📦 보급 : ${(p.supplyItem || 0).toLocaleString()}개`
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
  const speed = profile.speedMultiplier || 1;

  if (randVal < 50) {
    const combatPower = getCombatPower(profile);
    const lootCash = combatPower * 100 * speed;
    battle.accumulatedCash += lootCash;
    return `💵 현금 +${won(lootCash)}`;
  } else if (randVal < 80) {
    const ampInfo = getAmplifyInfo(profile ? profile.combatLevel : 0);
    const goldAmt = rand(ampInfo.minGold, ampInfo.maxGold) * speed;
    battle.accumulatedGold = (battle.accumulatedGold || 0) + goldAmt;
    return `🧈 금괴 +${goldAmt}개`;
  } else {
    let keyAdd = 1 * speed;
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keyAdd;
    return `🔑 비밀열쇠 +${keyAdd}개`;
  }
}

function resolveFarmFight(profile, battle) {
  let resultMessages = [];
  let earnedCash = 0;
  let earnedExp = 0;
  let earnedGold = 0;
  let earnedKeys = 0;
  let earnedSupplyItem = 0;
  const targetName = getRandomSurvivorName(); 
  const combatLv = profile.combatLevel || 0;
  const mult = getGoldMultiplier(profile);
  const ampInfo = getAmplifyInfo(combatLv);
  const speed = profile.speedMultiplier || 1;

  const currentFarmTable = FARM_TABLE[battle.mode.toLowerCase()] || FARM_TABLE.solo;
  let outcome = pickWeighted(currentFarmTable);

  if (outcome === 'supplyItem') {
    const combatPower = getCombatPower(profile);
    earnedCash = combatPower * 10 * speed;
    
    const goldBonus = rand(ampInfo.minGold, ampInfo.maxGold) * speed;
    earnedGold += goldBonus;
    
    let keyBonus = 1 * speed;
    const keyChanceBonus = getImprintTotalBonus(profile, 'keyChance');
    if (Math.random() < keyChanceBonus) {
      keyBonus += 1;
    }
    earnedKeys += keyBonus;
    
    earnedSupplyItem = 1 * speed;
    profile.supplyItem = (profile.supplyItem || 0) + earnedSupplyItem;

    battle.accumulatedCash += earnedCash;
    battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBonus;
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keyBonus;
    battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + earnedSupplyItem;

    battle.helmetLevel = 3;
    battle.helmetDurability = 100;
    battle.vestLevel = 3;
    battle.vestDurability = 100;
    
    let supplyMsg = `[📦 보급 1개 획득!] 최고급 Lv.3 헬멧 & Lv.3 조끼 장착 완료! (내구도 100%)\n현금 +${won(earnedCash)}\n금괴 +${goldBonus}개\n비밀열쇠 +${keyBonus}개\n보급 +${earnedSupplyItem}개`;
    resultMessages.push(supplyMsg);
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
    case 'supplyItem':
      {
        const expGained = Math.round(500 * speed);
        earnedExp += expGained;
        battle.accumulatedExp = (battle.accumulatedExp || 0) + expGained;
        resultMessages.push(`(EXP +${expGained.toLocaleString()})`);
      }
      break;
    case 'gold': {
      let goldBonus = rand(ampInfo.minGold, ampInfo.maxGold) * speed;
      const goldChanceBonus = getImprintTotalBonus(profile, 'goldChance');
      if (Math.random() < goldChanceBonus) {
        goldBonus += 1;
      }
      earnedGold += goldBonus;
      battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBonus;
      mainText = `금괴 ${goldBonus.toLocaleString()}개 획득!`;
      break;
    }
    case 'key': {
      let keyAdd = 1 * speed;
      const keyChanceBonus = getImprintTotalBonus(profile, 'keyChance');
      if (Math.random() < keyChanceBonus) {
        keyAdd += 1;
      }
      earnedKeys += keyAdd;
      battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keyAdd;
      mainText = `비밀열쇠 ${keyAdd}개 획득!`;
      break;
    }
    case 'jackpot': {
      const jackpotAmt = Math.round((10393 / 10) * mult * speed);
      earnedCash = jackpotAmt;
      battle.accumulatedCash += earnedCash;
      
      const expGained = Math.round((jackpotAmt / 100));
      earnedExp += expGained;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + expGained;

      mainText = `[잭팟!] 현금 ${won(jackpotAmt)} 획득! (EXP +${expGained.toLocaleString()})`;
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
      const triggerChance = (profile.jobSkillLevel || 1) * 0.02;

      let sentinelTriggered = false;
      if (profile.job === 'sentinel') {
        if (Math.random() < triggerChance) {
          sentinelTriggered = true;
        }
      }

      let skillNote = "";
      if (profile.job === 'stinger' && Math.random() < triggerChance) {
        killCount = rand(4, 5);
        skillNote += `\n⏩ [스팅거 스킬 발동!] 전투 성과가 급증하여 ${killCount} KILL을 달성했습니다!`;
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

      const killAssistReward = Math.round(((killCount * 100) + (assistCount * 50)) * mult * speed);
      const damageReward = Math.round(totalDamageVal * mult * speed);
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

      const baseExp = Math.round(earnedCash / 10);
      earnedExp += baseExp;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + baseExp;

      mainText = `[${killCount} KILL] (+${won(killAssistReward)})${skillNote}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg} (EXP +${baseExp.toLocaleString()})${notes}`;
      break;
    }
    case 'kill_multi': {
      let killCount = rand(2, 3);
      const assistCount = rand(0, 2);
      const triggerChance = (profile.jobSkillLevel || 1) * 0.02;

      let sentinelTriggered = false;
      if (profile.job === 'sentinel') {
        if (Math.random() < triggerChance) {
          sentinelTriggered = true;
        }
      }

      let skillNote = "";
      if (profile.job === 'stinger' && Math.random() < triggerChance) {
        killCount = rand(4, 5);
        skillNote += `\n⏩ [스팅거 스킬 발동!] 전투 성과가 급증하여 ${killCount} KILL을 달성했습니다!`;
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

      const killAssistReward = Math.round(((killCount * 100) + (assistCount * 50)) * mult * speed);
      const damageReward = Math.round(totalDamageVal * mult * speed);
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

      const baseExp = Math.round(earnedCash / 10);
      earnedExp += baseExp;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + baseExp;

      mainText = `${killTextHeader}${skillNote}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg} (EXP +${baseExp.toLocaleString()})${notes}`;
      break;
    }
    default: {
      const lootCash = rand(100, 500) * mult * speed;
      earnedCash = lootCash;
      battle.accumulatedCash += earnedCash;
      
      const baseExp = Math.round(earnedCash / 10);
      earnedExp += baseExp;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + baseExp;
      mainText = `현금 ${won(lootCash)} 획득! (EXP +${baseExp.toLocaleString()})`;
      break;
    }
  }

  if (mainText) resultMessages.push(mainText);

  // 파밍 퀘스트 보상 처리 (매 사냥마다 들어가는 오류 수정 및 지정 횟수별 보상 적용)
  const count = profile.farmData.count;
  const lastClaimed = profile.farmData.lastClaimedFarmQuest || 0;
  const dice = rand(1, 6);
  let farmQuestRewardMsg = "";

  if (count >= 10 && lastClaimed < 10 && count - 1 < 10) {
    const qCash = 5000 * dice;
    profile.cash += qCash;
    profile.farmData.lastClaimedFarmQuest = 10;
    farmQuestRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)}`;
  } else if (count >= 25 && lastClaimed < 25 && count - 1 < 25) {
    const qCash = 10000 * dice;
    profile.cash += qCash;
    profile.farmData.lastClaimedFarmQuest = 25;
    farmQuestRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)}`;
  } else if (count >= 50 && lastClaimed < 50 && count - 1 < 50) {
    const qCash = 15000 * dice;
    const qGold = 1 * dice;
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 50;
    farmQuestRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 금괴 +${qGold}개`;
  } else if (count >= 100 && lastClaimed < 100 && count - 1 < 100) {
    const qCash = 20000 * dice;
    const qGold = 1 * dice;
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 100;
    farmQuestRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 금괴 +${qGold}개`;
  } else if (count >= 150 && lastClaimed < 150 && count - 1 < 150) {
    const qCash = 25000 * dice;
    const qGold = 1 * dice;
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 150;
    farmQuestRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 금괴 +${qGold}개`;
  } else if (count >= 200 && lastClaimed < 200 && count - 1 < 200) {
    const qCash = 30000 * dice;
    const qGold = 2 * dice;
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 200;
    farmQuestRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 금괴 +${qGold}개`;
  }

  if (farmQuestRewardMsg) {
    resultMessages.push(farmQuestRewardMsg);
  }

  return { text: resultMessages.join('\n'), category: outcome, earnedCash, earnedExp, earnedGold, earnedKeys, earnedSupplyItem };
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
  
  const remainingTurns = battle.maxTurn - battle.turn;
  if (remainingTurns > 0) {
    const dec = Math.max(1, Math.floor(battle.survivors / Math.max(1, remainingTurns + 1)) + rand(1, 3));
    battle.survivors = Math.max(2, battle.survivors - dec); 
  } else {
    battle.survivors = 1;
  }
}

function processenhance(profile) {
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

  const activeTable = isJob ? JOB_ENHANCE_TABLE : ENHANCE_TABLE;

  if (currentLevel >= activeTable.length) {
    const stats = getEnhanceStats(currentLevel, profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(stats, stats);

    const maxTitle = `최고 강화 단계 도달! (+20 ${wName})`;
    const subWeaponLine = `🎯 무기 : +20 ${wName}`;

    const maxText = [
      maxTitle,
      subWeaponLine,
      detailMsg,
      ``,
      resourceText(profile)
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

  profile.totalEnhanceCost = (profile.totalEnhanceCost || 0) + cost;

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
                `\n${detailMsg}`;
  } else if (roll < successRate + keepRate) {
    resultStatus = 'keep';
    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [currWName] = getWeaponInfo(profile[currentEnhanceKey], profile.job);

    resultMsg = `[강화 유지] +${initialEnhance} (변동 없음)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +${profile[currentEnhanceKey]} ${currWName}` +
                `\n${detailMsg}`;
  } else if (isJob && roll < successRate + keepRate + dropRate) {
    resultStatus = 'drop';
    profile[currentEnhanceKey] = Math.max(0, profile[currentEnhanceKey] - 1);
    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [dropWName] = getWeaponInfo(profile[currentEnhanceKey], profile.job);

    resultMsg = `[강화 하락] +${initialEnhance} ➔ +${profile[currentEnhanceKey]} (단계 하락)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +${profile[currentEnhanceKey]} ${dropWName}` +
                `\n${detailMsg}`;
  } else {
    resultStatus = 'destroy';
    profile[currentEnhanceKey] = 0;
    const newStats = getEnhanceStats(profile[currentEnhanceKey], profile.combatLevel || 0, profile);
    const detailMsg = formatEnhanceStatDiff(oldStats, newStats);
    const [zeroWName] = getWeaponInfo(0, profile.job);

    resultMsg = `[무기 파괴] +${initialEnhance} ➔ +0 (파괴 및 초기화)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
                `🎯 무기 : +0 ${zeroWName}` +
                `\n${detailMsg}`;
  }

  const finalResultText = [
    resultMsg,
    ``,
    resourceText(profile)
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
  const activeTable = isJob ? JOB_ENHANCE_TABLE : ENHANCE_TABLE;

  let totalExpectedCost = 0;

  for (let lvl = 0; lvl < targetLevel; lvl++) {
    if (lvl >= activeTable.length) break;
    const tableData = activeTable[lvl];
    let cost = tableData.cost;
    cost = Math.floor(cost * (1 - costDownPct / 100));

    const successRate = Math.min(1.0, tableData.success + ((ampInfo.successBonus + imprintSuccessBonus) / 100));
    const keepRate = Math.max(0, tableData.keep - ((ampInfo.successBonus + imprintSuccessBonus) / 100));
    const destroyRate = tableData.destroy || 0;
    const dropRate = tableData.drop || 0;
    const failRateVal = Math.max(0, 1.0 - successRate - keepRate);

    let avgAttempts = 1.0;
    if (successRate > 0) {
      if (failRateVal === 0) {
        avgAttempts = 1 / successRate;
      } else {
        let pS = successRate;
        let pF = failRateVal;
        avgAttempts = 1 / pS + (pF / pS) * (lvl * 1.5);
      }
    }
    totalExpectedCost += cost * Math.max(1, avgAttempts);
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
    resourceText(profile)
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
  const activeTable = isJob ? JOB_ENHANCE_TABLE : ENHANCE_TABLE;

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

  profile.totalEnhanceCost = (profile.totalEnhanceCost || 0) + totalCost;

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
        resourceText(profile)
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
    resourceText(profile)
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
  const currentHead = currentRefine * 1;
  const currentCp = currentRefine * 2;

  if (currentRefine >= 10) {
    return {
      text: [
        `🔥 [현재 제련 정보]`,
        `현재 제련 단계: ${currentRefine}성 (${starStr})`,
        `배율 | x${currentMult}`,
        `헤드샷 데미지 증가 | ${currentHead}%`,
        `전투력 증가 | ${currentCp}%`,
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
      `배율 | x${currentMult}`,
      `헤드샷 데미지 증가 | ${currentHead}%`,
      `전투력 증가 | ${currentCp}%`,
      `📊 성공: ${succP}%`,
      `📊 유지: ${keepP}%`,
      `📊 하락: ${dropP}%`,
      `📊 파괴: ${destP}%`,
      ``,
      `제련 강화를 진행하시려면 [/제련강화] 명령어를 입력해 주세요.`
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
  } else {
    profile.refine = Math.max(0, profile.refine - 1);
    resultStatus = 'drop';
    const newStar = REFINE_STARS[profile.refine] || ' ';
    const statDiff = formatRefineStatDiff(currentRefine, profile.refine);

    resultMsg = `📉 [제련 하락] 제련 단계가 하락하여 ${profile.refine}성(${newStar})이 되었습니다.\n(소모: ${won(cashCost)}, 금괴 ${goldCost}개)\n${statDiff}`;
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
  
  let lines = [
    `⏩ [현재 증폭 정보]`,
    `⏩ 증폭 단계 : Lv.${currentLevel}`,
    `• 배율 가산 : x${currentAmp.multBonus.toFixed(2)}`,
    `• 헤드샷 가중치 : ${Math.round(currentAmp.headWeight * 100)}%`,
    `• 강화 성공 보정 : +${currentAmp.successBonus.toFixed(1)}%`,
    `• 획득 가능 금괴 수량 : ${currentAmp.minGold === currentAmp.maxGold ? `${currentAmp.minGold}개` : `${currentAmp.minGold}개`}`
  ];

  if (currentLevel < 10) {
    const nextAmp = AMPLIFY_TABLE[currentLevel + 1];
    const goldRange = nextAmp.minGold === nextAmp.maxGold ? `${nextAmp.minGold.toLocaleString()}개` : `${nextAmp.minGold.toLocaleString()}~${nextAmp.maxGold.toLocaleString()}개`;
    lines.push(
      ``,
      `⏩ 증폭(Lv.${currentLevel + 1}) 업그레이드 정보:`,
      `• 필요 금괴 : ${nextAmp.costNext.toLocaleString()}개`,
      `• 배율 가산 : x${nextAmp.multBonus.toFixed(2)}`,
      `• 헤드샷 가중치 : ${Math.round(nextAmp.headWeight * 100)}%`,
      `• 강화 성공 보정 : +${nextAmp.successBonus.toFixed(1)}%`,
      `• 획득 가능 금괴 수량 : ${goldRange}`,
      ``,
      `증폭 강화를 진행하시려면 [/증폭강화] 명령어를 입력해 주세요.`
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
    `• 소모 금괴: ${totalGoldSpent.toLocaleString()}개`,
    `• 배율 가산 | x${prevAmp.multBonus.toFixed(2)} ➔ x${nextAmp.multBonus.toFixed(2)}`,
    `• 헤드샷 가중치 | ${Math.round(prevAmp.headWeight * 100)}% ➔ ${Math.round(nextAmp.headWeight * 100)}%`,
    `• 강화 성공 보정: +${prevAmp.successBonus.toFixed(1)}% ➔ +${nextAmp.successBonus.toFixed(1)}%`,
    `• 금괴 획득 수량 | ${goldRangePrev} ➔ ${goldRangeNext}`
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

  for (let i = 0; i < count; i++) {
    const randRoll = Math.random() * 100;
    if (randRoll < 50) { 
      const combatPower = getCombatPower(profile);
      const cashAmt = combatPower * 10;
      totalCash += cashAmt;
      profile.cash += cashAmt;
    } else { 
      const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
      const goldBar = rand(ampInfo.minGold, ampInfo.maxGold);
      totalGold += goldBar;
      profile.gold += goldBar;
    }
  }

  let rewardLines = [`🔑 비밀열쇠 ${count}개 연속 사용 결과:`];
  if (totalCash > 0) {
    rewardLines.push(`💵 현금 +${won(totalCash)}`);
  }
  if (totalGold > 0) {
    rewardLines.push(`🧈 금괴 +${totalGold.toLocaleString()}개`);
  }

  rewardLines.push(``, resourceText(profile));

  return { text: rewardLines.join('\n'), imageUrl: null };
}

function getJobInfoText(jobCode, skillLevel = 1) {
  const chance = skillLevel * 2; 
  if (jobCode === 'stinger') {
    return `⏩ 스팅거 : 적 처치 및 파밍 시 ${chance}% 확률로 대량의 킬수(4~5 KILL)를 단번에 쓸어담습니다.`;
  } else if (jobCode === 'sentinel') {
    return `🛡️ 센티넬 : ${chance}% 확률로 정밀 사격 스킬이 발동하여 적의 헤드를 확정 타격합니다.`;
  } else if (jobCode === 'shadow') {
    return `🗡️ 섀도우 : 적 처치 시 ${chance}% 확률로 은밀하게 추가 재화(현금/금괴/열쇠)를 훔쳐옵니다.`;
  }
  return '';
}

function processJobCommand(profile, targetJob) {
  const jobMap = { '스팅거': 'stinger', '센티넬': 'sentinel', '섀도우': 'shadow' };
  const REQUIRED_CASH = JOB_UNLOCK_CASH;
  const REQUIRED_GOLD = JOB_UNLOCK_GOLD;

  if (profile.job) {
    const jobNames = { stinger: '스팅거', sentinel: '센티넬', shadow: '섀도우' };
    const currentJobName = jobNames[profile.job] || profile.job;
    const skillLevel = profile.jobSkillLevel || 1;
    const currentSkillInfo = getJobInfoText(profile.job, skillLevel);

    let msg = [
      `🎖️ [현재 전직 정보]`,
      `직업: ${currentJobName}`,
      ``,
      `⏩ [전직 스킬]`,
      `${currentJobName} 스킬 레벨: Lv.${skillLevel}`,
      currentSkillInfo,
      `(비용 : 금괴 ${(skillLevel) * 500}개)`
    ];

    if (!profile.hasSeenJobGuide) {
      profile.hasSeenJobGuide = true;
      msg.push(``, `💡 전직을 변경하시려면 [/전직변경 [직업명]] 명령어를 이용해 주세요. (비용: 현금 100,000,000원, 금괴 2,000개, 보석 2,000개, 스킬 레벨 유지)`);
    }

    if (targetJob) {
      msg.unshift(`⚠️ 이미 전직이 완료된 상태입니다! (/전직 명령어로는 전직을 변경할 수 없습니다)\n`);
    }

    return { 
      text: [
        msg.join('\n'),
        ``,
        resourceText(profile)
      ].join('\n') 
    };
  }

  if (!targetJob) {
    return {
      text: [
        `📜 [전직 시스템 안내]`,
        `원하는 직업으로 전직하여 강력한 특수 스킬을 획득하세요!`,
        ``,
        `📋 [전직 조건]`,
        `• 최고 무기 '+20 싱귤래리티' 달성`,
        `• 전직 비용: ${won(REQUIRED_CASH)}, 금괴 ${REQUIRED_GOLD}개`,
        ``,
        `1. ⏩ 스팅거 (/전직 스팅거)`,
        `   - 처치 시 일정 확률로 대량의 킬수(4~5 KILL) 폭발 달성`,
        `2. 🛡️ 센티넬 (/전직 센티넬)`,
        `   - 처치 시 일정 확률로 헤드샷 확정 정밀 사격 발동`,
        `3. 🗡️ 섀도우 (/전직 섀도우)`,
        `   - 적 처치 시 일정 확률로 추가 재화(현금/금괴/열쇠) 은밀 획득`,
        ``,
        `💡 입력예시: [/전직 스팅거], [/전직 센티넬], [/전직 섀도우]`,
        ``,
        resourceText(profile)
      ].join('\n')
    };
  }

  const jobCode = jobMap[targetJob];
  if (!jobCode) {
    return { text: `⚠️ 올바른 전직 직업명을 입력해 주세요. (스팅거, 센티넬, 섀도우)` };
  }

  const currentEnhance = profile.enhance ?? 0;
  if (currentEnhance < 20) {
    return { text: `⚠️ 전직 조건이 부족합니다!\n(+20강 싱귤래리티 달성 필요 | 현재 강화 단계: +${currentEnhance})` };
  }

  if (profile.cash < REQUIRED_CASH || (profile.gold || 0) < REQUIRED_GOLD) {
    return { 
      text: `⚠️ 전직 비용이 부족합니다!\n(필요: ${won(REQUIRED_CASH)}, 금괴 ${REQUIRED_GOLD}개 | 보유: ${won(profile.cash)}, 금괴 ${(profile.gold || 0).toLocaleString()}개)` 
    };
  }

  profile.cash -= REQUIRED_CASH;
  profile.gold -= REQUIRED_GOLD;
  profile.job = jobCode;
  profile.jobSkillLevel = 1;
  profile.hasSeenJobGuide = false;

  return { 
    text: [
      `🎉 [전직 완료] '${targetJob}'(으)로 전직했습니다!`,
      `(소모: ${won(REQUIRED_CASH)}, 금괴 ${REQUIRED_GOLD}개)`,
      getJobInfoText(jobCode, 1),
      ``,
      resourceText(profile)
    ].join('\n') 
  };
}

function processJobChange(profile, targetJob) {
  const jobMap = { '스팅거': 'stinger', '센티넬': 'sentinel', '섀도우': 'shadow' };

  if (!profile.job) {
    return { text: `⚠️ 아직 전직하지 않은 상태입니다. 먼저 [/전직 [직업명]]을 통해 전직해 주세요.` };
  }

  if (!targetJob) {
    return { text: `⚠️ 변경할 직업명을 입력해 주세요! (예: /전직변경 스팅거, /전직변경 센티넬, /전직변경 섀도우)` };
  }

  const jobCode = jobMap[targetJob];
  if (!jobCode) {
    return { text: `⚠️ 올바른 직업명을 입력해 주세요. (스팅거, 센티넬, 섀도우)` };
  }

  if (profile.job === jobCode) {
    return { text: `⚠️ 이미 해당 직업(${targetJob})을 보유 중입니다.` };
  }

  const CHANGE_CASH = JOB_CHANGE_CASH;
  const CHANGE_GOLD = JOB_CHANGE_GOLD;
  const CHANGE_GEM = JOB_CHANGE_GEM;

  if (profile.cash < CHANGE_CASH || (profile.gold || 0) < CHANGE_GOLD || (profile.gem || 0) < CHANGE_GEM) {
    return { 
      text: `재화가 부족합니다!\n(전직변경 필요 비용: 현금 ${won(CHANGE_CASH)}, 금괴 ${CHANGE_GOLD}개, 보석 ${CHANGE_GEM}개)\n(보유: 현금 ${won(profile.cash)}, 금괴 ${(profile.gold || 0).toLocaleString()}개, 보석 ${(profile.gem || 0).toLocaleString()}개)` 
    };
  }

  profile.cash -= CHANGE_CASH;
  profile.gold -= CHANGE_GOLD;
  profile.gem -= CHANGE_GEM;
  profile.job = jobCode;

  const currentSkillLvl = profile.jobSkillLevel || 1;
  return { 
    text: `🔄 [전직 변경 완료] '${targetJob}'(으)로 직업을 변경했습니다! (소모: 현금 ${won(CHANGE_CASH)}, 금괴 ${CHANGE_GOLD}개, 보석 ${CHANGE_GEM}개)\n스킬 레벨(Lv.${currentSkillLvl})은 그대로 유지됩니다.\n${getJobInfoText(jobCode, currentSkillLvl)}` 
  };
}

function processUpgradeJobSkill(profile) {
  if (!profile.job) {
    return { text: `⚠️ 전직하지 않은 상태에서는 전직 스킬을 강화할 수 없습니다. [/전직]을 먼저 해주세요.` };
  }

  const currentLevel = profile.jobSkillLevel || 1;
  if (currentLevel >= 10) {
    return { text: `✨ 전직 스킬이 이미 최고 레벨(Lv.10 MAX)에 도달했습니다!` };
  }

  const goldCost = currentLevel * 500;
  if ((profile.gold || 0) < goldCost) {
    return { text: `금괴가 부족합니다!\n(Lv.${currentLevel}➔Lv.${currentLevel + 1} 강화 필요: 금괴 ${goldCost.toLocaleString()}개 | 보유: 금괴 ${(profile.gold || 0).toLocaleString()}개)` };
  }

  const prevChance = currentLevel * 2;
  profile.gold -= goldCost;
  profile.jobSkillLevel = currentLevel + 1;
  const nextChance = profile.jobSkillLevel * 2;

  const jobNames = { stinger: '스팅거', sentinel: '센티넬', shadow: '섀도우' };

  return { 
    text: [
      `⏩ [전직 스킬 승급 성공!]`,
      `${jobNames[profile.job]} 스킬 레벨: Lv.${currentLevel} ➔ Lv.${profile.jobSkillLevel}`,
      `(소모: 금괴 ${goldCost.toLocaleString()}개)`,
      `🗡️ ${jobNames[profile.job]} : 적 처치 시 ${prevChance}% ➔ ${nextChance}% 확률로 은밀하게 추가 재화(현금/금괴/열쇠)를 훔쳐옵니다.`,
      ``,
      resourceText(profile)
    ].join('\n')
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
      let opt = imprintData.options[0]; 
      lines.push(`🔓* ${tier.name} * : ${opt.name} +${opt.value}${opt.unit}`);
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
        let jobWeaponName = '전직무기';
        if (profile.job === 'shadow') jobWeaponName = '월식의 종언';
        else if (profile.job === 'stinger') jobWeaponName = '울티메이트 판처 코어';
        else if (profile.job === 'sentinel') jobWeaponName = '앱솔루트 오비탈';
        
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : +20 ${jobWeaponName} 달성`);
      }
    }
  });

  const showHelp = checkAndMarkHelp(profile, 'imprint');
  if (showHelp) {
    lines.push(`\n💡 사용 가능한 명령어:`);
    lines.push(`• /각인해금 [1~5] - 조건 만족 시 해당 슬롯 해금`);
    lines.push(`• /각인잠금 [1~5] - 해당 슬롯 옵션 잠금`);
    lines.push(`• /각인해제 [1~5] - 잠긴 슬롯 해제`);
    lines.push(`• /각인변경 - 각인 변경 (잠긴 슬롯당 비용 2배)`);
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
    return { text: `⚠️ 올바른 각인 슬롯을 입력해 주세요. (예: /각인해금 1)` };
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
    const currentEnhanceLvl = getCurrentEnhanceLevel(profile);
    if (currentEnhanceLvl < 20) {
      return { text: `⚠️ 해금 조건 미달성! (+20 싱귤래리티 달성 필요)` };
    }
    unlockSuccess = true;
  } else if (tierKey === 'V') {
    let jobWeaponName = '전직무기';
    if (profile.job === 'shadow') jobWeaponName = '월식의 종언';
    else if (profile.job === 'stinger') jobWeaponName = '울티메이트 판처 코어';
    else if (profile.job === 'sentinel') jobWeaponName = '앱솔루트 오비탈';

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
    return { text: `⚠️ 올바른 각인 슬롯을 입력해 주세요. (1~5 입력, 예: /각인잠금 1)` };
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
    return { text: `⚠️ 올바른 슬롯 번호를 입력해 주세요. (1~5 입력, 예: /각인해제 1)` };
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
  
  let jobWeaponName = '전직무기';
  if (profile.job === 'shadow') jobWeaponName = '월식의 종언';
  else if (profile.job === 'stinger') jobWeaponName = '울티메이트 판처 코어';
  else if (profile.job === 'sentinel') jobWeaponName = '앱솔루트 오비탈';

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
  return { text: resultLines.join('\n' ), choices: IMPRINT_CHOICES };
}

function checkAndResetHuntLimit(playerState) {
  const kstDate = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
  const todayStr = kstDate.toISOString().slice(0, 10);
  const dayOfWeek = kstDate.getDay();
  const maxLimit = (dayOfWeek === 0 || dayOfWeek === 6) ? 4000 : 100000;

  if (!playerState.huntData || playerState.huntData.date !== todayStr) {
    playerState.huntData = { date: todayStr, count: 0, max: maxLimit, lastClaimedHuntQuest: 0 };
  } else {
    playerState.huntData.max = maxLimit;
    if (playerState.huntData.lastClaimedHuntQuest === undefined) {
      playerState.huntData.lastClaimedHuntQuest = 0;
    }
  }
}

function processWarehouse(profile) {
  if (!profile.inventory) profile.inventory = [];
  if (profile.inventory.length === 0) {
    return `🎒 [전리품 목록]\n현재 보유 중인 전리품이 없습니다. 사냥을 통해 전리품을 획득해 보세요!`;
  }

  const tierOrder = { "T1": 1, "T2": 2, "T3": 3, "T4": 4, "T5": 5, "T6": 6 };

  const grouped = {};
  profile.inventory.forEach(item => {
    const key = `${item.tier}_${item.category}_${item.name}`;
    if (!grouped[key]) {
      grouped[key] = {
        tier: item.tier,
        categoryName: item.categoryName,
        name: item.name,
        desc: item.desc,
        count: 0
      };
    }
    grouped[key].count += 1;
  });

  const sortedItems = Object.values(grouped).sort((a, b) => {
    return (tierOrder[a.tier] || 99) - (tierOrder[b.tier] || 99);
  });

  const categoryOrder = { 'stock': 1, 'silencer': 2, 'scope': 3, 'magazine': 4, 'grip': 5 };

  sortedItems.sort((a, b) => {
    const catDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
    if (catDiff !== 0) return catDiff;
    return (tierOrder[a.tier] || 99) - (tierOrder[b.tier] || 99);
  });

  let lines = [`🎒 [전리품 목록]`];
  sortedItems.forEach((item, index) => {
    const countStr = item.count > 1 ? ` (${item.count}개)` : '';
    let multiplierVal = (tierOrder[item.tier] * 0.10).toFixed(2);
    lines.push(`${index + 1}. [${item.tier}] ${item.name}${countStr}\n배율 x${multiplierVal}`);
  });
  return lines.join('\n');
}

function processHunt(playerState) {
  if (!playerState.huntData) {
    playerState.huntData = { date: "", count: 0, lastClaimedHuntQuest: 0 };
  }

  checkAndResetHuntLimit(playerState);
  const MAX_HUNT_COUNT = playerState.huntData.max || 4000;

  if (playerState.huntData.count >= MAX_HUNT_COUNT) {
    return {
      text: `[사냥 불가]\n오늘 사냥 가능 횟수를 모두 소모했습니다.\n(현재 횟수: (${playerState.huntData.count}/${MAX_HUNT_COUNT}))`,
      choices: [{ label: "/메인", action: "/메인" }],
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

  let totalEarnedCash = 0;
  let totalEarnedGem = 0;
  let spawnedMonsters = [];
  let droppedLootTexts = [];

  const tierPrices = { "T1": 1000000, "T2": 2000000, "T3": 3000000, "T4": 4000000, "T5": 5000000, "T6": 6000000 };

  for (let i = 0; i < actualHunts; i++) {
    const monster = getRandomMonsterByProbability();
    if (!monster) continue;

    const earnedCash = Math.floor(monster.rewardMoney * lootMult);
    const earnedGem = monster.rewardGem > 0 ? monster.rewardGem : 0;

    totalEarnedCash += earnedCash;
    totalEarnedGem += earnedGem;

    spawnedMonsters.push(monster);

    let dropChance = 0.001; 
    let isLootDropped = false;
    let targetTier = "";
    const g = monster.grade;

    if (g === "C+등급" && Math.random() < dropChance) { targetTier = "T1"; isLootDropped = true; }
    else if (g === "B등급" && Math.random() < dropChance) { targetTier = "T2"; isLootDropped = true; }
    else if (g === "B+등급" && Math.random() < dropChance) { targetTier = "T3"; isLootDropped = true; }
    else if (g === "A등급" && Math.random() < dropChance) { targetTier = "T4"; isLootDropped = true; }
    else if (g === "A+등급" && Math.random() < dropChance) { targetTier = "T5"; isLootDropped = true; }
    else if ((g === "S등급" || g === "S+등급") && Math.random() < dropChance) { targetTier = "T6"; isLootDropped = true; }

    if (isLootDropped) {
      const categories = ['stock', 'silencer', 'scope', 'magazine', 'grip'];
      const chosenCategory = categories[rand(0, categories.length - 1)];
      const tierList = LOOT_DATABASE[chosenCategory];
      const itemData = tierList.find(i => i.tier === targetTier) || tierList[0];

      const categoryNames = {
        stock: '개머리판',
        silencer: '소음기',
        scope: '스코프',
        magazine: '탄창',
        grip: '그립'
      };
      const catName = categoryNames[chosenCategory];

      if (!playerState.inventory) playerState.inventory = [];
      
      const alreadyHas = playerState.inventory.some(inv => inv.tier === itemData.tier && inv.name === itemData.name);
      if (alreadyHas) {
        const refundAmount = tierPrices[itemData.tier] || 1000000;
        playerState.cash += refundAmount;
        droppedLootTexts.push(`🎉 [전리품 중복 대체] [${itemData.tier}] ${itemData.name} 전리품을 획득했으나 이미 보유 중이므로, 재화로 교체되어 현금 +${won(refundAmount)}이(가) 지급되었습니다!`);
      } else {
        playerState.inventory.push({
          category: chosenCategory,
          categoryName: catName,
          tier: itemData.tier,
          name: itemData.name,
          desc: itemData.desc
        });
        droppedLootTexts.push(`🎉 [전리품 획득!] [${itemData.tier}] ${catName} - ${itemData.name}을(를) 획득했습니다! (/전리품에서 확인)`);
      }
    }
  }

  playerState.cash = (playerState.cash || 0) + totalEarnedCash;
  if (totalEarnedGem > 0) {
    playerState.gem = (playerState.gem || 0) + totalEarnedGem;
  }

  const gradeRank = {
    "S+등급": 10, "S등급": 9, "A+등급": 8, "A등급": 7,
    "B+등급": 6, "B등급": 5, "C+등급": 4, "C등급": 3,
    "D+등급": 2, "D등급": 1
  };

  spawnedMonsters.sort((a, b) => {
    return (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0);
  });

  let monsterInfoBlocks = [];
  spawnedMonsters.forEach((m, idx) => {
    if (idx === 0) {
      monsterInfoBlocks.push(
        `[몬스터 발견!]\n[${m.grade}] ${m.fullName}\n설명: ${m.description}`
      );
    } else {
      monsterInfoBlocks.push(
        `[${m.grade}] ${m.fullName}`
      );
    }
  });

  let totalCashSum = spawnedMonsters.reduce((acc, m) => acc + Math.floor(m.rewardMoney * lootMult), 0);
  let totalGemSum = spawnedMonsters.reduce((acc, m) => acc + (m.rewardGem || 0), 0);

  let questRewardMsg = "";
  const count = playerState.huntData.count;
  const lastClaimed = playerState.huntData.lastClaimedHuntQuest || 0;
  const dice = rand(1, 6);

  if (count >= 100 && lastClaimed < 100 && count - actualHunts < 100) {
    const qCash = 5000 * dice;
    playerState.cash += qCash;
    playerState.huntData.lastClaimedHuntQuest = 100;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)}`;
  } else if (count >= 250 && lastClaimed < 250 && count - actualHunts < 250) {
    const qCash = 10000 * dice;
    playerState.cash += qCash;
    playerState.huntData.lastClaimedHuntQuest = 250;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)}`;
  } else if (count >= 500 && lastClaimed < 500 && count - actualHunts < 500) {
    const qCash = 15000 * dice;
    const qGem = 1 * dice;
    playerState.cash += qCash;
    playerState.gem += qGem;
    playerState.huntData.lastClaimedHuntQuest = 500;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 보석 +${qGem}개`;
  } else if (count >= 1000 && lastClaimed < 1000 && count - actualHunts < 1000) {
    const qCash = 20000 * dice;
    const qGem = 2 * dice;
    playerState.cash += qCash;
    playerState.gem += qGem;
    playerState.huntData.lastClaimedHuntQuest = 1000;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 보석 +${qGem}개`;
  } else if (count >= 1500 && lastClaimed < 1500 && count - actualHunts < 1500) {
    const qCash = 25000 * dice;
    const qGem = 3 * dice;
    playerState.cash += qCash;
    playerState.gem += qGem;
    playerState.huntData.lastClaimedHuntQuest = 1500;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 보석 +${qGem}개`;
  } else if (count >= 2000 && lastClaimed < 2000 && count - actualHunts < 2000) {
    const qCash = 25000 * dice;
    const qGem = 3 * dice;
    playerState.cash += qCash;
    playerState.gem += qGem;
    playerState.huntData.lastClaimedHuntQuest = 2000;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 보석 +${qGem}개`;
  } else if (count >= 3000 && lastClaimed < 3000 && count - actualHunts < 3000) {
    const qCash = 30000 * dice;
    const qGem = 4 * dice;
    playerState.cash += qCash;
    playerState.gem += qGem;
    playerState.huntData.lastClaimedHuntQuest = 3000;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 보석 +${qGem}개`;
  } else if (count >= 4000 && lastClaimed < 4000 && count - actualHunts < 4000) {
    const qCash = 50000 * dice;
    const qGem = 5 * dice;
    playerState.cash += qCash;
    playerState.gem += qGem;
    playerState.huntData.lastClaimedHuntQuest = 4000;
    questRewardMsg = `퀘스트 달성 보상 : 현금 +${won(qCash)} 및 보석 +${qGem}개`;
  }

  let finalRewardLines = [];
  if (questRewardMsg) {
    finalRewardLines.push(questRewardMsg);
  }
  if (droppedLootTexts.length > 0) {
    finalRewardLines.push(droppedLootTexts.join('\n'));
  }

  let monstersJoined = monsterInfoBlocks.join('\n');
  
  let summaryLines = [`💵 총 현금 +${won(totalCashSum)}`];
  if (totalGemSum > 0) {
    summaryLines.push(`💎 총 보석 : ${totalGemSum}개`);
  }

  let middleContent = `${monstersJoined}\n\n💰 획득 재화 :\n${summaryLines.join('\n')}`;
  if (finalRewardLines.length > 0) {
    middleContent = middleContent + '\n' + finalRewardLines.join('\n');
  }

  const questThresholds = [100, 250, 500, 1000, 1500, 2000, 3000, 4000];
  let nextThreshold = questThresholds.find(t => t > count) || 4000;
  let remainingCount = nextThreshold - count;
  let questLeftText = `📜 퀘스트 보상까지 ${remainingCount}회`;

  let footerLines = [
    questLeftText,
    `🔘 배율 x${lootMult.toFixed(2)} (사냥 전용)`,
    `💵 현금 : ${won(playerState.cash)}`,
    `💎 보석 : ${(playerState.gem || 0).toLocaleString()}개`,
    `사냥 횟수 : (${playerState.huntData.count}/${MAX_HUNT_COUNT})`,
    `⏩ ${speed}배속`
  ];

  const text = `${middleContent}\n\n${footerLines.join('\n')}`;
  
  const choices = [
    { label: "/사냥", action: "/사냥" },
    { label: "/파밍", action: "/파밍" }
  ];

  return {
    text,
    choices,
    imageUrl: spawnedMonsters[0]?.image || null,
    image: spawnedMonsters[0]?.image || null,
    thumbnail: spawnedMonsters[0]?.image || null,
    url: spawnedMonsters[0]?.image || null,
    monster: spawnedMonsters[0]
  };
}

function processSpeedCommand(profile, arg) {
  if (profile.combatLevel === undefined) profile.combatLevel = 0;
  const maxAllowed = profile.combatLevel;

  let speedVal = parseInt(arg, 10);
  if (isNaN(speedVal) || speedVal < 1 || speedVal > 10) {
    return { text: `⚠️ 올바른 배속 숫자를 입력해 주세요. (1~10 사이, 예: /배속 2)` };
  }

  if (speedVal > maxAllowed) {
    return { text: `⚠️ 증폭 레벨이 부족하여 해당 배속을 설정할 수 없습니다!\n• 현재 증폭 레벨: Lv.${maxAllowed}\n• 최대 설정 가능 배속: x${maxAllowed}` };
  }

  profile.speedMultiplier = speedVal;
  return { text: `⏩ 배속이 [x${speedVal}](으)로 설정되었습니다! (/사냥 및 /사냥 보상 적용)` };
}

function processAccumulated(profile) {
  const totalCost = profile.totalEnhanceCost || 0;
  return {
    text: `📊 [누적 강화 비용]\n현재까지 강화에 들어간 누적 비용은 총 **${won(totalCost)}**입니다.`
  };
}

function processExchange(profile, arg) {
  const parts = arg.trim().split(/\s+/);
  if (parts.length < 2) {
    return {
      text: [
        `💱 [교환 목록 안내]`,
        `1. 현금 → 금괴 (현금 500,000원당 금괴 1개)`,
        `2. 현금 → 보석 (현금 1,000,000원당 보석 1개)`,
        `3. 금괴 → 현금 (금괴 1개당 50,000원)`,
        `4. 보석 → 현금 (보석 1개당 100,000원)`,
        ``,
        `💡 사용 예시: [/교환 1 10] (1번 품목으로 10개 교환)`
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
      const costCash = 500000 * amount;
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
      const rewardCash = 50000 * amount;
      profile.cash += rewardCash;
      return { text: `💱 [교환 완료]\n금괴 ${amount}개로 현금 ${won(rewardCash)}을(를) 교환했습니다!\n\n${resourceText(profile)}` };
    }
    case 4: {
      const costGem = amount;
      if ((profile.gem || 0) < costGem) {
        return { text: `⚠️ 보석이 부족합니다! (필요 보석: ${costGem}개)` };
      }
      profile.gem -= costGem;
      const rewardCash = 100000 * amount;
      profile.cash += rewardCash;
      return { text: `💱 [교환 완료]\n보석 ${amount}개로 현금 ${won(rewardCash)}을(를) 교환했습니다!\n\n${resourceText(profile)}` };
    }
    default:
      return { text: `⚠️ 올바른 교환 번호를 입력해 주세요. (1~4)` };
  }
}

function getRandomMonsterByProbability() {
  const randVal = Math.random() * 100;
  let selectedGrade = "D등급";

  if (randVal < 0.001) {
    selectedGrade = "S+등급";
  } else if (randVal < 0.01) {
    selectedGrade = "S등급";
  } else if (randVal < 0.11) {
    selectedGrade = "A+등급";
  } else if (randVal < 0.5) {
    selectedGrade = "A등급";
  } else if (randVal < 1.5) {
    selectedGrade = "B+등급";
  } else if (randVal < 5.0) {
    selectedGrade = "B등급";
  } else if (randVal < 10.0) {
    selectedGrade = "C+등급";
  } else if (randVal < 30.0) {
    selectedGrade = "C등급";
  } else if (randVal < 40.0) {
    selectedGrade = "D+등급";
  } else {
    selectedGrade = "D등급";
  }

  let baseLookupGrade = selectedGrade;
  if (selectedGrade === "D+등급") baseLookupGrade = "D등급";
  else if (selectedGrade === "C+등급") baseLookupGrade = "C등급";
  else if (selectedGrade === "B+등급") baseLookupGrade = "B등급";
  else if (selectedGrade === "A+등급") baseLookupGrade = "A등급";
  else if (selectedGrade === "S+등급") baseLookupGrade = "S등급";

  const targetMonsters = getMonstersByGrade(baseLookupGrade);
  if (targetMonsters.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * targetMonsters.length);
  const baseMonster = targetMonsters[randomIndex];

  let prefix = "";
  if (["D등급", "D+등급", "C등급", "C+등급", "B등급", "B+등급", "A등급", "A+등급", "S등급", "S+등급"].includes(selectedGrade)) {
    const baseKey = baseLookupGrade;
    const gradePrefixes = prefixes[baseKey];
    if (gradePrefixes && gradePrefixes.length > 0) {
      let p1 = gradePrefixes[Math.floor(Math.random() * gradePrefixes.length)];
      if (selectedGrade.endsWith("+")) {
        let p2 = gradePrefixes[Math.floor(Math.random() * gradePrefixes.length)];
        prefix = `${p1} ${p2}`;
      } else {
        prefix = p1;
      }
    }
  }

  const rewardMoney = getRewardMoney(selectedGrade);
  const rewardGem = getRewardGem(selectedGrade);

  return {
    ...baseMonster,
    grade: selectedGrade,
    prefix: prefix,
    fullName: prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name,
    rewardMoney: rewardMoney,
    rewardGem: rewardGem,
    formattedReward: rewardMoney.toLocaleString() + "원"
  };
}

function getMonstersByGrade(grade) {
  return monsters.filter(m => m.grade === grade);
}

function getRewardMoney(grade) {
  const range = gradeRewards[grade] || { min: 200, max: 500 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function getRewardGem(grade) {
  const range = gradeRewards[grade];
  return range && range.gem ? range.gem : 0;
}

function startGame(existingProfile) {
  let profile = createProfile(existingProfile);
  let battle = createBattle(profile);

  return {
    text: `배틀로얄 및 사냥 게임에 오신 것을 환영합니다! 아래 버튼을 누르거나 '/파밍' 등을 입력해 주세요.\n\n${battleStatusBoard(profile, battle)}`,
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

  let input = typeof utterance === 'string' ? utterance.trim().replace(/\s+/g, ' ') : '';
  const cleanInput = input.toLowerCase();

  if (cleanInput === "/메인" || cleanInput === "메인" || cleanInput === "시작" || cleanInput === "처음으로") {
    const startResult = startGame(profile);
    state.profile = startResult.state.profile;
    state.battle = startResult.state.battle;
    return {
      text: startResult.text,
      choices: [
        { label: "/파밍", action: "/파밍" }
      ],
      category: "main",
      imageUrl: startResult.imageUrl,
      image: startResult.image,
      thumbnail: startResult.thumbnail,
      state: { profile: state.profile, battle: state.battle }
    };
  }

  if (input === '/4655') {
    profile.cash += 1000000000;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n현금 1,000,000,000원이 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: LOBBY_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }
  if (input === '/5292') {
    profile.gold += 10000;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n금괴 10,000개가 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: LOBBY_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }
  if (input === '/9523') {
    profile.gem += 10000;
    state.profile = profile;
    return {
      text: `🎁 [시크릿 코드 입력 성공]\n보석 10,000개가 지급되었습니다!\n\n${profileText(profile)}`,
      imageUrl: null,
      choices: LOBBY_CHOICES,
      category: 'secret',
      state: { profile, battle }
    };
  }

  if (input === '/초기화') {
    state.profile = createProfile({}); 
    state.battle = null; 
    return {
      text: `🔄 [초기화 완료]\n프로필 대시보드와 모든 재화가 초기화되었습니다.\n\n${profileText(state.profile)}`,
      imageUrl: null,
      choices: LOBBY_CHOICES,
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
      choices: isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES,
      state: { profile, battle }
    };
  } else {
    let parts = input.split(' ');
    parts[0] = parts[0].toLowerCase();
    input = parts.join(' ');
  }

  if (input === '/') {
    const helpText = [
      `📜 [사용 가능한 명령어 안내]`,
      `• /파밍 - 파밍 시작 (기존 전투 기능 대체)`,
      `• /도망 - 전투 중 도망 및 HP 회복`,
      `• /강화 - 무기 강화`,
      `• /강화 [목표수치] - 조건 달성 시 기댓값x2.5배로 즉시 강화 (일반 무기 전용)`,
      `• /제련 - 제련 정보 확인`,
      `• /제련강화 - 무기 제련 시도`,
      `• /연속강화 [횟수] - 지정 횟수만큼 연속 강화`,
      `• /증폭 - 증폭 정보 확인`,
      `• /증폭강화 [수량] - 금괴로 전투력 증폭 강화`,
      `• /배속 [1~10] - 증폭 레벨 제한 내에서 보상 배속 설정`,
      `• /열쇠 [수량] - 비밀열쇠를 지정한 수량만큼 연속 사용`,
      `• /전직 [직업명] - 전직 안내 및 직업 전직`,
      `• /전직변경 [직업변경]`,
      `• /각인 - 각인 정보 확인`,
      `• /전리품 - 획득한 전리품 확인`,
      `• /프로필 - 내 정보 확인`,
      `• /사냥 - 몬스터 사냥 및 현금 보상 획득`,
      `• /누적 - 누적 강화 비용 확인`,
      `• /교환 [번호] [수량] - 재화 교환`
    ].join('\n');
    return { text: helpText, imageUrl: null, state: { profile, battle } };
  }

  let cmdParts = input.split(' ');
  let command = cmdParts[0];
  let arg = cmdParts.slice(1).join(' ');

  let result = { text: '', imageUrl: null, choices: null, category: 'normal' };

  switch (command) {
    case '/파밍': {
      checkAndResetFarmLimit(profile);
      const maxLimit = profile.farmData ? profile.farmData.max : 100;

      if (!isPlayingBattle) {
        if (profile.farmData.count >= maxLimit) {
          result.text = `[파밍 불가]\n오늘 전투(파밍) 가능 횟수를 모두 소모했습니다.\n(현재 횟수: (${profile.farmData.count}/${maxLimit}))`;
          result.choices = LOBBY_CHOICES;
          break;
        }
        profile.farmData.count += 1;
        battle = createBattle(profile);
        state.battle = battle;
      }

      battle.turn += 1;
      applyZoneAttrition(battle);
      const buffMsgs = processBuffs(battle);

      const farmRes = resolveFarmFight(profile, battle);
      let textLines = [ farmRes.text ];

      if (buffMsgs.length > 0) {
        textLines.push(buffMsgs.join('\n'));
      }

      if (!battle.alive) {
        battle.finished = true;
        
        const totalCashGained = battle.accumulatedCash;
        profile.cash += totalCashGained; 

        const totalGoldGained = battle.accumulatedGold || 0;
        const totalGemGained = battle.accumulatedGem || 0;
        const totalKeysGained = battle.accumulatedKeys || 0;
        const totalSupplyItemGained = battle.accumulatedSupplyItem || 0;

        const totalExpGained = battle.accumulatedExp || 0;
        const expRes = addExp(profile, totalExpGained);

        let deathLines = [
          ...textLines,
          ``,
          ``,
          `== [사망] 탈락 (${battle.turn}턴) ==`,
          `💵 현금 +${won(totalCashGained)}`,
          `⭐ EXP +${expRes.gained.toLocaleString()}`
        ];

        if (totalGoldGained > 0) deathLines.push(`🧈 금괴 +${totalGoldGained}개`);
        if (totalGemGained > 0) deathLines.push(`💎 보석 +${totalGemGained}개`);
        if (totalKeysGained > 0) deathLines.push(`🔑 비밀열쇠 +${totalKeysGained}개`);
        if (totalSupplyItemGained > 0) deathLines.push(`📦 보급 +${totalSupplyItemGained}개`);
        deathLines.push(``, profileText(profile));

        result.text = deathLines.filter(Boolean).join('\n');
        result.choices = LOBBY_CHOICES;
        result.category = 'dead';
        state.battle = null;
        break;
      }

      if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
        battle.finished = true;
        battle.result = 'victory';
        
        const victoryBonusCash = Math.round(battle.accumulatedCash * 0.3);
        const finalTotalCash = battle.accumulatedCash + victoryBonusCash;
        profile.cash += finalTotalCash;

        const baseExpReward = battle.accumulatedExp || rand(100, 500);
        const victoryBonusExp = Math.round(baseExpReward * 0.3);
        const expRes = addExp(profile, baseExpReward + victoryBonusExp);

        const totalGoldGained = battle.accumulatedGold || 0;
        const totalGemGained = battle.accumulatedGem || 0;
        const totalKeysGained = battle.accumulatedKeys || 0;
        const totalSupplyItemGained = battle.accumulatedSupplyItem || 0;

        let victoryLines = [
          ...textLines,
          ``,
          `== 🏆 [우승] 치킨 획득! ==`,
          `💵 추가 현금 : ${won(victoryBonusCash)} | EXP +${victoryBonusExp.toLocaleString()}`,
          `💵 현금 총 보상 : +${won(finalTotalCash)}`,
          `⭐ EXP : +${expRes.gained.toLocaleString()}`
        ];

        if (totalGoldGained > 0) victoryLines.push(`🧈 금괴 +${totalGoldGained}개`);
        if (totalGemGained > 0) victoryLines.push(`💎 보석 +${totalGemGained}개`);
        if (totalKeysGained > 0) victoryLines.push(`🔑 비밀열쇠 +${totalKeysGained}개`);
        if (totalSupplyItemGained > 0) victoryLines.push(`📦 보급 +${totalSupplyItemGained}개`);
        victoryLines.push(``, profileText(profile));

        result.text = victoryLines.filter(Boolean).join('\n');
        result.choices = LOBBY_CHOICES;
        result.category = 'victory';
        state.battle = null;
        break;
      }

      result.text = [...textLines, `\n${battleStatusBoard(profile, battle)}`].join('\n');
      result.choices = BATTLE_CHOICES;
      break;
    }
    case '/도망': {
      if (!isPlayingBattle) {
        result.text = `현재 전투 중이 아닙니다. [/파밍]을 입력해 파밍을 시작하세요.\n\n${profileText(profile)}`;
        result.choices = LOBBY_CHOICES;
        break;
      }

      if ((battle.escapeCount || 0) >= 2) {
        result.text = `⚠️ /도망 커맨드는 게임당 최대 2회까지만 사용할 수 있습니다!\n\n${battleStatusBoard(profile, battle)}`;
        result.choices = BATTLE_CHOICES;
        break;
      }

      battle.escapeCount = (battle.escapeCount || 0) + 1;
      battle.turn += 1;
      applyZoneAttrition(battle);
      const buffMsgs = processBuffs(battle);

      const escapeRes = resolveEscapeEvent(profile, battle);
      let textLines = [ `${escapeRes.text} (도망 사용 횟수: ${battle.escapeCount}/2)` ];

      if (buffMsgs.length > 0) {
        textLines.push(buffMsgs.join('\n'));
      }

      if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
        battle.finished = true;
        battle.result = 'victory';
        
        const victoryBonusCash = Math.round(battle.accumulatedCash * 0.3);
        const finalTotalCash = battle.accumulatedCash + victoryBonusCash;
        profile.cash += finalTotalCash;

        const baseExpReward = battle.accumulatedExp || rand(100, 500);
        const victoryBonusExp = Math.round(baseExpReward * 0.3);
        const expRes = addExp(profile, baseExpReward + victoryBonusExp);

        const totalGoldGained = battle.accumulatedGold || 0;
        const totalGemGained = battle.accumulatedGem || 0;
        const totalKeysGained = battle.accumulatedKeys || 0;
        const totalSupplyItemGained = battle.accumulatedSupplyItem || 0;

        let victoryLines = [
          ...textLines,
          ``,
          `== 🏆 [우승] 치킨 획득! ==`,
          `💵 추가 현금 : ${won(victoryBonusCash)} | EXP +${victoryBonusExp.toLocaleString()}`,
          `💵 현금 총 보상 : +${won(finalTotalCash)}`,
          `⭐ EXP : +${expRes.gained.toLocaleString()}`
        ];

        if (totalGoldGained > 0) victoryLines.push(`🧈 금괴 +${totalGoldGained}개`);
        if (totalGemGained > 0) victoryLines.push(`💎 보석 +${totalGemGained}개`);
        if (totalKeysGained > 0) victoryLines.push(`🔑 비밀열쇠 +${totalKeysGained}개`);
        if (totalSupplyItemGained > 0) victoryLines.push(`📦 보급 +${totalSupplyItemGained}개`);
        victoryLines.push(``, profileText(profile));

        result.text = victoryLines.filter(Boolean).join('\n');
        result.choices = LOBBY_CHOICES;
        result.category = 'victory';
        state.battle = null;
        break;
      }

      result.text = [...textLines, `\n${battleStatusBoard(profile, battle)}`].join('\n');
      result.choices = BATTLE_CHOICES;
      break;
    }
    case '/강화': {
      if (arg !== undefined && arg !== '') {
        const targetLvl = parseInt(arg, 10);
        const guarRes = processGuaranteedEnhance(profile, targetLvl);
        result.text = guarRes.text;
        result.imageUrl = guarRes.imageUrl || null;
      } else {
        const enhanceRes = processenhance(profile);
        result.text = enhanceRes.text;
        result.imageUrl = enhanceRes.imageUrl;
      }
      result.choices = ENHANCE_CHOICES;
      break;
    }
    case '/연속강화': {
      const count = arg !== undefined && arg !== '' ? (parseInt(arg, 10) || 1) : 1;
      const multiRes = processMultiEnhance(profile, count);
      result.text = multiRes.text;
      result.imageUrl = multiRes.imageUrl;
      result.choices = ENHANCE_CHOICES;
      break;
    }
    case '/제련': {
      const refineInfo = showRefineInfo(profile);
      result.text = refineInfo.text;
      result.choices = REFINE_CHOICES;
      break;
    }
    case '/제련강화': {
      const refineRes = processRefine(profile);
      result.text = refineRes.text;
      result.choices = REFINE_CHOICES;
      break;
    }
    case '/증폭': {
      const ampInfoRes = showAmplifyInfo(profile);
      result.text = ampInfoRes.text;
      result.imageUrl = ampInfoRes.imageUrl;
      result.choices = AMPLIFY_CHOICES;
      break;
    }
    case '/증폭강화': {
      const targetLvl = parseInt(arg, 10) || 1;
      const ampRes = processAmplify(profile, targetLvl);
      result.text = ampRes.text;
      result.choices = AMPLIFY_CHOICES;
      break;
    }
    case '/배속': {
      const speedRes = processSpeedCommand(profile, arg);
      result.text = speedRes.text;
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
    case '/열쇠': {
      const keyRes = processUseKey(profile, arg);
      result.text = keyRes.text;
      result.choices = LOBBY_CHOICES;
      break;
    }
    case '/전리품': {
      result.text = processWarehouse(profile);
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
    case '/창고': {
      result.text = processWarehouse(profile);
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
    case '/프로필': {
      result.text = profileText(profile, true);
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
    case '/전직': {
      const jobRes = processJobCommand(profile, arg);
      result.text = jobRes.text;
      result.choices = profile.job ? null : JOB_CHOICES;
      break;
    }
    case '/전직변경': {
      const changeRes = processJobChange(profile, arg);
      result.text = changeRes.text;
      result.choices = LOBBY_CHOICES;
      break;
    }
    case '/전직스킬': {
      const skillRes = processUpgradeJobSkill(profile);
      result.text = skillRes.text;
      result.choices = LOBBY_CHOICES;
      break;
    }
    case '/각인': {
      const imprintRes = processImprintCommand(profile);
      result.text = imprintRes.text;
      result.choices = imprintRes.choices;
      break;
    }
    case '/각인해금': {
      const unlockRes = processImprintUnlock(profile, arg);
      result.text = unlockRes.text;
      result.choices = IMPRINT_CHOICES;
      break;
    }
    case '/각인잠금': {
      const lockRes = processImprintLock(profile, arg);
      result.text = lockRes.text;
      result.choices = IMPRINT_CHOICES;
      break;
    }
    case '/각인해제': {
      const unlockSlotRes = processImprintUnlockSlot(profile, arg);
      result.text = unlockSlotRes.text;
      result.choices = IMPRINT_CHOICES;
      break;
    }
    case '/각인변경': {
      const rerollRes = processImprintReroll(profile);
      result.text = rerollRes.text;
      result.choices = rerollRes.choices;
      break;
    }
    case '/사냥': {
      const huntRes = processHunt(profile);
      result.text = huntRes.text;
      result.imageUrl = huntRes.imageUrl;
      result.choices = huntRes.choices;
      break;
    }
    case '/누적': {
      const accRes = processAccumulated(profile);
      result.text = accRes.text;
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
    case '/교환': {
      const exRes = processExchange(profile, arg);
      result.text = exRes.text;
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
    default: {
      result.text = `알 수 없는 명령어입니다. (명령어는 / 를 입력해 확인하세요)`;
      result.choices = isPlayingBattle ? BATTLE_CHOICES : LOBBY_CHOICES;
      break;
    }
  }

  return {
    ...result,
    state: { profile, battle: state.battle }
  };
}

module.exports = {
  prefixes,
  monsters,
  gradeRewards,
  getMonstersByGrade,
  getRandomMonsterByProbability,
  checkAndResetHuntLimit,
  processHunt,
  startGame,
  processTurn,
  createProfile
};

//
// game.js - 카카오 챗봇 호환 전체 통합 스크립트
//

const MAX_TURN = 5;
const EXP_PER_LEVEL_BASE = 200;
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
  "D+등급": ["초보", "약한", "지저분한", "배고픈", "겁먹은"],
  "D++등급": ["흉악한", "날카로운", "광폭한", "변종", "돌연변이"],
  "C+등급": ["단단한", "날쌘", "거친", "사나운", "독이 묻은"],
  "C++등급": ["강철", "맹독", "원혼의", "기괴한", "폭주한"],
  "B+등급": ["거대한", "흉포한", "타락한", "어둠의", "철갑"],
  "B++등급": ["혈투의", "지옥의", "심연의", "저주받은", "사령"],
  "A+등급": ["광폭한", "고대의", "지옥의", "군주", "수호자"],
  "A++등급": ["파멸의", "초월적", "대재앙", "전설의", "불멸의"],
  "S+등급": ["파멸의", "절망의", "신들의", "혼돈의", "태초의"],
  "S++등급": ["신역의", "창세의", "우주의", "공허의", "무한의"],
  "SS+등급": ["차원의", "시공의", "초신성", "절대자", "계시의"],
  "SS++등급": ["신격의", "영원의", "무극의", "근원의", "종언의"],
  "SSS+등급": ["전능의", "천상의", "만물의", "신화의", "무한대의"],
  "SSS++등급": ["차원초월", "창조주의", "전지전능", "신들의군주", "세계선의"],
  "EX+등급": ["빅뱅의", "태초근원", "우주창조", "신역초월", "절대신"],
  "EX++등급": ["전무후무", "신화의정점", "세계의의지", "궁극의", "시공초월"]
};

const monsters = [
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

  { name: "시공의 파괴자", grade: "SS등급", description: "시공간의 틈새를 자유로이 넘나들며 차원을 붕괴시키는 초월체.", image: `${BASE_URL}/images/SS_1.png` },
  { name: "창세의 거신", grade: "SSS등급", description: "우주의 시작과 함께 태어나 행성을 집어삼키는 전설의 존재.", image: `${BASE_URL}/images/SSS_1.png` },
  { name: "절대신 아포피스", grade: "EX등급", description: "모든 차원과 세계선을 초월하여 만물을 주관하는 궁극의 절대자.", image: `${BASE_URL}/images/EX_1.png` }
];

const gradeRewards = {
  "D등급": { min: 100, max: 300 },
  "D+등급": { min: 400, max: 1000 },
  "D++등급": { min: 1100, max: 2000 },
  "C등급": { min: 2100, max: 3000 },
  "C+등급": { min: 3100, max: 4500 },
  "C++등급": { min: 4600, max: 6000 },
  "B등급": { min: 6100, max: 8000 },
  "B+등급": { min: 8100, max: 10000 },
  "B++등급": { min: 10100, max: 15000 },
  "A등급": { min: 15100, max: 20000, gem: 1 },
  "A+등급": { min: 20100, max: 35000, gem: 5 },
  "A++등급": { min: 35100, max: 50000, gem: 8 },
  "S등급": { min: 50100, max: 100000, gem: 10 },
  "S+등급": { min: 100100, max: 500000, gem: 50 },
  "S++등급": { min: 500100, max: 1000000, gem: 100 },
  "SS등급": { min: 1000000, max: 2000000, gem: 200 },
  "SS+등급": { min: 2000000, max: 4000000, gem: 300 },
  "SS++등급": { min: 4000000, max: 8000000, gem: 500 },
  "SSS등급": { min: 8000000, max: 15000000, gem: 1000 },
  "SSS+등급": { min: 15000000, max: 30000000, gem: 2000 },
  "SSS++등급": { min: 30000000, max: 50000000, gem: 3000 },
  "EX등급": { min: 50000000, max: 100000000, gem: 5000 },
  "EX+등급": { min: 100000000, max: 300000000, gem: 10000 },
  "EX++등급": { min: 300000000, max: 500000000, gem: 20000 }
};

// /파밍 5턴 완료 보상 전용 상자. /사냥 상자와 이름과 보상 테이블을 분리한다.
const FARM_BOX_INFO = {
  "D": { name: "D등급 상자", minCash: 100, maxCash: 1000, minGold: 0, maxGold: 0, minGem: 0, maxGem: 0 },
  "C": { name: "C등급 상자", minCash: 1000, maxCash: 5000, minGold: 1, maxGold: 1, minGem: 0, maxGem: 0 },
  "B": { name: "B등급 상자", minCash: 5000, maxCash: 10000, minGold: 1, maxGold: 1, minGem: 1, maxGem: 1 },
  "A": { name: "A등급 상자", minCash: 10000, maxCash: 50000, minGold: 2, maxGold: 2, minGem: 2, maxGem: 2, bonusBox: "S", bonusBoxChance: 0.10 },
  "S": { name: "S등급 상자", minCash: 50000, maxCash: 100000, minGold: 5, maxGold: 5, minGem: 5, maxGem: 5, bonusBox: "EX", bonusBoxChance: 0.10, monthlyTitleChance: 1 },
  "SS": { name: "SS등급 상자", minCash: 100000, maxCash: 200000, minGold: 7, maxGold: 7, minGem: 7, maxGem: 7, bonusBox: "EX", bonusBoxChance: 0.10, monthlyTitleChance: 1 },
  "SSS": { name: "SSS등급 상자", minCash: 200000, maxCash: 300000, minGold: 8, maxGold: 8, minGem: 8, maxGem: 8, bonusBox: "EX", bonusBoxChance: 0.10, monthlyTitleChance: 1 },
  "EX": { name: "EX등급 상자", minCash: 100000, maxCash: 500000, minGold: 10, maxGold: 10, minGem: 10, maxGem: 10, bonusBox: "SEASON", bonusBoxChance: 1, monthlyTitleChance: 1 },
  "SEASON": { name: "시즌 칭호 상자", minCash: 0, maxCash: 0, minGold: 0, maxGold: 0, minGem: 0, maxGem: 0, seasonTitleChance: 1 }
};

// /사냥 희귀 드롭 전용 상자. 기존 상자 보상과 이름을 그대로 유지한다.
const HUNT_BOX_INFO = {
  "D": { name: "나무 상자", minCash: 1000, maxCash: 10000, minGem: 1, maxGem: 5 },
  "C": { name: "은 상자", minCash: 1000, maxCash: 50000, minGem: 1, maxGem: 10 },
  "B": { name: "금 상자", minCash: 10000, maxCash: 100000, minGem: 5, maxGem: 15 },
  "A": { name: "사파이어 상자", minCash: 10000, maxCash: 500000, minGem: 5, maxGem: 20 },
  "S": { name: "에메랄드 상자", minCash: 100000, maxCash: 1000000, minGem: 10, maxGem: 25 },
  "SS": { name: "제이다이트 상자", minCash: 100000, maxCash: 5000000, minGem: 10, maxGem: 30 },
  "SSS": { name: "루비 상자", minCash: 1000000, maxCash: 10000000, minGem: 15, maxGem: 35 },
  "EX": { name: "다이아몬드 상자", minCash: 1000000, maxCash: 50000000, minGem: 15, maxGem: 40 }
};

const MONTHLY_AVATARS = {
  1: "신년의 개척자 아바타", 2: "서리 심장 아바타", 3: "봄의 전령 아바타",
  4: "벚꽃 잔상 아바타", 5: "초원의 수호자 아바타", 6: "태양 기사 아바타",
  7: "폭풍의 지배자 아바타", 8: "한여름 정점 아바타", 9: "결실의 수확자 아바타",
  10: "낙엽의 추적자 아바타", 11: "서릿발 척살자 아바타", 12: "종말의 인도자 아바타"
};

// 5턴 파밍에서 처치할수록 다음 등급으로 도전한다. D→D+→D++→C 순으로 이어진다.
const FARM_GRADE_STEPS = [
  "D등급", "D+등급", "D++등급", "C등급", "C+등급", "C++등급",
  "B등급", "B+등급", "B++등급", "A등급", "A+등급", "A++등급",
  "S등급", "S+등급", "S++등급", "SS등급", "SS+등급", "SS++등급",
  "SSS등급", "SSS+등급", "SSS++등급", "EX등급", "EX+등급", "EX++등급"
];

const LOOT_DATABASE = {
  hilt: [
    { tier: "T1", name: "나무 조각 자루", desc: "거칠게 깎아 만든 임시 나무 자루 — 손에 잡히는 느낌이 엉성하고 쉽게 미끄러집니다." },
    { tier: "T2", name: "가죽 끈 감은 자루", desc: "낡은 가죽을 촘촘히 감아 마찰력을 높인 입문용 자루 — 무난한 파지감을 제공합니다." },
    { tier: "T3", name: "철제 보강 자루", desc: "내구성을 높이기 위해 금속 테두리로 마감한 전술형 자루 — 묵직한 안정감을 줍니다." },
    { tier: "T4", name: "상어 가죽 인체공학 자루", desc: "손가락굴곡에 맞추어 인체공학적으로 성형된 고급 자루 — 최상의 그립감을 선사합니다." },
    { tier: "T5", name: "미스릴 합금 자루", desc: "초경량 고강도 미스릴로 주조된 하이엔드 자루 — 날렵한 조작과 완벽한 균형감을 자랑합니다." },
    { tier: "T6", name: "태초의 마력 자루", desc: "고대 신비의 마력이 서려 손에 쥐는 순간 일체감을 주는 궁극의 자루입니다." }
  ],
  guard: [
    { tier: "T1", name: "녹슨 철판 코등이", desc: "대충 덧댄 조악한 철판 조각 — 방어 능력이 거의 없는 최하위 코등이입니다." },
    { tier: "T2", name: "원형 황동 코등이", desc: "단순한 원형 고리 형태의 기본 코등이 — 상대의 칼날을 가볍게 튕겨내는 입문용입니다." },
    { tier: "T3", name: "십자형 강철 코등이", desc: "튼튼한 탄소강으로 제작된 클래식한 십자 가드 — 안정적인 공방 일체를 지원합니다." },
    { tier: "T4", name: "바스켓 hilt 코등이", desc: "손등 전체를 안전하게 감싸 보호하는 바스켓 형태의 전술형 코등이입니다." },
    { tier: "T5", name: "날개형 정밀 코등이", desc: "상대의 검을 걸어 채기 용이하도록 날개 형태로 날렵하게 가공된 고급 코등이입니다." },
    { tier: "T6", name: "빛의 장벽 코등이", desc: "물리적 실체와 에너지 방벽이 공존하여 적의 공격을 완벽히 무효화하는 궁극의 코등이입니다." }
  ],
  blade: [
    { tier: "T1", name: "무딘 철제 검신", desc: "날이 제대로 서지 않아 때리는 것인지 베는 것인지 분간이 안 가는 기본 검신입니다." },
    { tier: "T2", name: "접철식 강철 검신", desc: "여러 번 달구고 두드려 기본적인 예리함을 갖춘 실용적인 검신입니다." },
    { tier: "T3", name: "열처리 카본 검신", desc: "특수 열처리를 거쳐 단단함과 유연성을 동시에 잡은 대중적인 검신입니다." },
    { tier: "T4", name: "진은 코팅 명품 검신", desc: "표면을 진은으로 코팅하여 마력 전도율과 베기 성능을 대폭 끌어올린 중급형 검신입니다." },
    { tier: "T5", name: "다마스쿠스 패턴 검신", desc: "수천 겹의 결이 살아 숨 쉬며 닿는 모든 것을 두 쪽으로 가르는 하이엔드 검신입니다." },
    { tier: "T6", name: "차원 절단 검신", desc: "시공간의 틈새를 베어내는 초월적인 경지의 궁극의 검신입니다." }
  ],
  scabbard: [
    { tier: "T1", name: "누런 천 검집", desc: "오염된 천 조각을 대충 꿰매어 칼날을 감싼 볼품없는 기본 검집입니다." },
    { tier: "T2", name: "생가죽 검집", desc: "질긴 짐승의 가죽으로 만들어 비바람으로부터 칼날을 보호하는 입문용 검집입니다." },
    { tier: "T3", name: "경질 우드 검집", desc: "단단한 원목을 파내어 제작한 깔끔한 실루엣의 표준형 검집입니다." },
    { tier: "T4", name: "철갑 강화 검집", desc: "외부 충격으로부터 검을 완벽히 보호하는 철제 보강형 검집입니다." },
    { tier: "T5", name: "룬 문자 각인 검집", desc: "고대의 마법 룬이 새겨져 검의 기운을 증폭시키는 고급 검집입니다." },
    { tier: "T6", name: "무한 공간 검집", desc: "내부가 이차원으로 연결되어 무게를 상쇄하고 검을 즉시 출현시키는 궁극의 검집입니다." }
  ],
  pommel: [
    { tier: "T1", name: "플라스틱 마개 폼멜", desc: "균형을 전혀 잡아주지 못하는 가벼운 플라스틱 조각 — 멋이 전혀 나지 않습니다." },
    { tier: "T2", name: "원형 쇳덩이 폼멜", desc: "단순한 무게추 역할만 하는 묵직한 철제 폼멜입니다." },
    { tier: "T3", name: "각진 보석 폼멜", desc: "작은 마석이 박혀 약간의 안정감을 주는 모던한 폼멜입니다." },
    { tier: "T4", name: "견고한 타이탄 폼멜", desc: "전체적인 무게 중심을 손잡이 쪽으로 완벽히 잡아주는 전술형 폼멜입니다." },
    { tier: "T5", name: "정령의 핵 폼멜", desc: "정령의 힘을 품어 검무의 속도를 가속하는 하이엔드 폼멜입니다." },
    { tier: "T6", name: "우주 응집체 폼멜", desc: "중력을 제어하여 검의 파괴력을 극한으로 끌어올리는 최상위 폼멜입니다." }
  ]
};

const WEAPON_TIERS = [
  ['나무젓가락 단검', '고무줄 수제 장난감 단검'],
  ['대나무 검', '장인의 손길로 만든 대나무검'],
  ['목검', '단단한 훈련용 목검'],
  ['철제 단검', '가볍고 날카로운 단검'],
  ['제식 롱소드', '기본적인 기사형 롱소드'],
  ['실버 소드', '은빛 명품 검'],
  ['골드 세공검', '금장 세공 검'],
  ['실바나스', '정령력이 깃든 무기'],
  ['트라이던트', '심해 해양 테마 검'],
  ['라이주', '번개 신수의 전격 검'],
  ['프로메테우스', '불의 권능 아티팩트'],
  ['프시케 블레이드', '태초의 힘이 깃든 검'],
  ['베르단트 오블리비언', '숲의 덩굴 초록빛 검'],
  ['글레이셜 둠', '빙하와 오로라 파멸의 검'],
  ['오니즈카 섀도우', '어둠과 보랏빛 뇌전'],
  ['이터널 바운드', '백사의 힘이 깃든 검'],
  ['헤븐즈 저스티스', '찬란한 천상의 심판'],
  ['이그니스 로어', '흑룡과 불꽃의 포효'],
  ['크로노스 파라독스', '시공간 왜곡 태엽'],
  ['아포테오시스', '신의 권능이 현현한 초월의 검'],
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

const BSK_WEAPON_TIERS = [
  ['부러진 대검', '거칠게 깨진 기본 대검'],
  ['철제 대검', '묵직한 무게감의 철제 대검'],
  ['강철 중검', '단단하게 제련된 강철 중검'],
  ['전투용 양손검', '전장에서 주로 쓰이는 양손검'],
  ['거인의 대검', '거대한 크기의 무식한 대검'],
  ['티타늄 클래셔', '강인한 티타늄 재질의 클래셔'],
  ['골드 코팅 소드', '화려한 금장으로 코팅된 대검'],
  ['중장갑 파괴자', '단단한 장갑을 부수는 대검'],
  ['플라즈마 대검', '고열의 플라즈마 에너지를 두른 대검'],
  ['마그네틱 슬래셔', '전자석의 힘으로 위력을 더한 슬래셔'],
  ['중성자 분쇄검', '주변 물질을 붕괴시키는 중성자 대검'],
  ['붕괴의 양손검', '지형을 뒤흔드는 강력한 양손검'],
  ['진동 소닉 소드', '음파 진동으로 내부를 파괴하는 소닉 소드'],
  ['앱솔루트 프리저', '주위의 모든 것을 얼려버리는 냉동 대검'],
  ['버스트 썬더 블레이드', '벼락의 폭발력을 뿜어내는 블레이드'],
  ['디멘션 브레이커', '공간의 균열을 내는 차원 파괴 대검'],
  ['아포칼립스 그레이트소드', '종말의 전조를 알리는 거대 대검'],
  ['인페르노 볼케이노', '화산의 용암을 두른 인페르노 대검'],
  ['타임 슬립 블레이드', '시간의 흐름을 일시적으로 왜곡하는 대검'],
  ['오메가 싱귤래리티', '궁극의 중력장을 형성하는 오메가 대검'],
  ['울티메이트 버서커 코어', '모든 파괴력을 집약한 궁극의 대검 코어']
];

const SDM_WEAPON_TIERS = [
  ['훈련용 광검', '가볍고 유연한 연습용 광검'],
  ['빛의 자국 광검', '휘둘릴 때 빛의 잔상이 남는 광검'],
  ['일렉트릭 소드', '전격 에너지를 띠는 광검'],
  ['플라즈마 광검', '고열의 빛날을 형성하는 플라즈마 광검'],
  ['아크 라이트소드', '강렬한 아크 방전을 일으키는 광검'],
  ['오비탈 루미너스', '정밀한 제어 장치가 결합된 광검 모델'],
  ['펄스 가디언 블레이드', '에너지 펄스를 방출하는 광검'],
  ['제니스 레이디언트', '정점에 도달하기 시작한 광검'],
  ['A.I. 코어 광검', '인공지능 보조 조준 시스템이 탑재된 광검'],
  ['퀀텀 플래시', '양자역학적 빛의 잔상을 남기는 광검'],
  ['에테르 루미너스', '에테르 에너지를 두른 궁극의 광검'],
  ['네오 일루전', '차세대 기술로 재설계된 광검 아티팩트'],
  ['바이오닉 플라즈마', '생체신호와 동기화되는 광검'],
  ['태로스 블레이드', '고대 거인의 힘이 깃든 강력한 광검'],
  ['아크 펄스 소드', '전기 아크를 연속 방사하는 광검'],
  ['헤븐리 레이디언트', '천상의 가호를 받는 난공불락의 광검'],
  ['제네시스 오비탈', '새로운 질서를 창조하는 광검'],
  ['디바인 가디언', '신성한 수호의 권능이 서린 광검'],
  ['이터널 루미너스', '시공을 초월하여 영원히 빛나는 광검'],
  ['옴니포턴트 플래시', '모든 것을 감시하고 심판하는 전능의 광검'],
  ['앱솔루트 오비탈', '광검 기술력의 궁극적인 정점']
];

const MGS_WEAPON_TIERS = [
  ['마도의 단검', '마력이 감오는 작은 마검'],
  ['룬 각인 마검', '고대 룬 문자가 새겨진 마검'],
  ['에테르 소드', '정제된 에테르를 두른 마검'],
  ['아스트랄 블레이드', '성단과 교감하는 마검'],
  ['소울 바운드 소드', '사용자의 영혼과 동기화되는 마검'],
  ['스펠 브레이커', '마법의 결계를 깨부수는 마검'],
  ['아르카나 소드', '신비로운 아르카나의 힘을 품은 마검'],
  ['초월의 마검', '현실의 물리 법칙을 거스르는 마검'],
  ['차원 공명검', '다른 차원의 마력을 끌어오는 마검'],
  ['스타더스트 블레이드', '별의 먼지가 응축된 마검'],
  ['세레스티얼 소드', '천체의 궤도를 담은 마검'],
  ['이클립스 마검', '일식의 어둠과 빛을 동시에 품은 마검'],
  ['공허의 마검', '주변의 마력을 삼키는 공허의 검'],
  ['태초의 아르카나', '세계 창조의 마력이 서린 마검'],
  ['인피니티 소드', '무한한 마력 회로가 내장된 마검'],
  ['제네시스 마검', '새로운 마법적 질서를 개척하는 마검'],
  ['앱솔루트 아르카나', '마법의 경지를 초월한 궁극의 마검'],
  ['디바인 매직 소드', '신성한 마법의 권능이 깃든 마검'],
  ['이터널 마스터피스', '영원히 완성되지 않는 마법의 명작'],
  ['옴니버스 마검', '모든 차원의 마법을 통섭하는 마검'],
  ['태초와 종말의 마검', '마법의 시작과 끝을 관장하는 궁극의 마검']
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

const ESCAPE_TABLE = [
  ['instant_heal', 60.0],
  ['drink', 25.0],
  ['painkiller', 15.0]
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

const SUPPLY_CHOICES = [
  { label: '/파밍', action: '/파밍' },
  { label: '/사냥', action: '/사냥' }
];

// 수정사항 2: /강화 후 단일 /강화 버튼만 제공
const ENHANCE_CHOICES = [
  { label: '/강화', action: '/강화' }
];

const HUNT_CHOICES = [
  { label: '/사냥', action: '/사냥' },
  { label: '/파밍', action: '/파밍' },
  { label: '/도움말', action: '/도움말' }
];

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
  { label: '/크리처 뽑기', action: '/크리처 뽑기' },
  { label: '/크리처', action: '/크리처' }
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
  { name: '전투력 증가', values: [1, 2, 3, 4, 5], weights: [30, 30, 20, 10, 10], unit: '%', key: 'combatBoost' }
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
  const adjectives = ['조용한', '별속의', '용감한', '빛나는', '차가운', '뜨거운', '화려한', '어두운', '신비로운', '재빠른'];
  const nouns = ['사업자', '미인', '모험가', '사냥꾼', '지배자', '방랑자', '지장보살', '지킴이', '전사', '마법사'];
  
  const adj = adjectives[rand(0, adjectives.length - 1)];
  const noun = nouns[rand(0, nouns.length - 1)];
  const num = String(rand(1000, 9999));

  return `${adj}${noun}${num}`;
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
  } else if (job === 'berserker') {
    return `${BASE_URL}/BSK_${level}.png`;
  } else if (job === 'swordmaster') {
    return `${BASE_URL}/SDM_${level}.png`;
  } else if (job === 'battlemage') {
    return `${BASE_URL}/MGS_${level}.png`;
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
  return Math.floor(amount * (1 + cBonus.cashPct + getAvatarCashBonus(profile)));
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
  if (!profile || !profile.inventory || profile.inventory.length === 0) return 1.00;
  let totalMultiplier = 1.00;
  profile.inventory.forEach(item => {
    const tierNum = { T1: 1, T2: 2, T3: 3, T4: 4, T5: 5, T6: 6 }[item && item.tier];
    if (!tierNum) return;
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
  const creatureCashPct = getCreatureBonus(profile).cashPct;
  return Number((baseMult + ampInfo.multBonus + refineBonus + imprintCashBoost + creatureCashPct).toFixed(2));
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
  } else if (job === 'berserker') {
    return BSK_WEAPON_TIERS[lvl] || BSK_WEAPON_TIERS[0];
  } else if (job === 'swordmaster') {
    return SDM_WEAPON_TIERS[lvl] || SDM_WEAPON_TIERS[0];
  } else if (job === 'battlemage') {
    return MGS_WEAPON_TIERS[lvl] || MGS_WEAPON_TIERS[0];
  }
  return WEAPON_TIERS[lvl] || WEAPON_TIERS[0];
}

function getEnhanceStats(enhanceLevel, combatLevel = 0, profile = null) {
  const isJob = profile && Boolean(profile.job);
  const lvl = Math.max(0, Math.min(20, enhanceLevel || 0));

  let baseMult, baseNormal, baseCrit, baseCritDmg, baseCounter, baseFullCounter;

  if (isJob) {
    baseMult = (2.00 + (lvl * 0.05)).toFixed(2);
    baseCrit = 5.00 + (lvl * 0.10);
    baseCritDmg = 20.00 + (lvl * 1.00);
    baseCounter = 0.50 + (lvl * 0.10);
    baseFullCounter = 0.50 + (lvl * 0.10);
    baseNormal = 100 - baseCrit - baseCounter - baseFullCounter;
  } else {
    baseMult = (1.00 + (lvl * 0.05)).toFixed(2);
    baseCrit = lvl * 0.50;
    baseCritDmg = lvl * 1.00;
    
    if (lvl <= 15) {
      baseCounter = 0.00;
    } else {
      baseCounter = (lvl - 15) * 0.10;
    }

    if (lvl === 20) {
      baseFullCounter = 0.50;
    } else {
      baseFullCounter = 0.00;
    }

    baseNormal = 100 - baseCrit - baseCounter - baseFullCounter;
  }

  const ampInfo = getAmplifyInfo(combatLevel);
  const imprintCritRate = getImprintTotalBonus(profile, 'critRate');
  const imprintCritWeight = getImprintTotalBonus(profile, 'critWeight');

  const numCrit = (baseCrit + imprintCritRate) * (1 + ampInfo.critWeight + (imprintCritWeight / 100));
  const numCounter = baseCounter;
  const numFullCounter = baseFullCounter;
  const numNormal = Math.max(0, 100 - numCrit - numCounter - numFullCounter);

  return {
    mult: `x${baseMult}`,
    normal: `${numNormal.toFixed(2)}%`,
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
    `전투력 증가 | ${oldRefine * 2}% ➔ ${newRefine * 2}%`
  ].join('\n');
}

function getCombatPower(profile) {
  if (!profile) return 0;
  const combatLv = profile.combatLevel || 0;
  const enhance = getCurrentEnhanceLevel(profile);
  const lvl = profile.level || 1;
  const refineLvl = profile.refine || 0;

  const basePower = (lvl * 100) + (combatLv * 500) + (enhance * 300) + getCollectionCombatPower(profile);
  const refineBonusMult = 1 + (refineLvl * 0.02);
  const imprintCombatBoost = getImprintTotalBonus(profile, 'combatBoost') / 100;
  
  let smBonus = 0;
  if (profile.job === 'swordmaster') {
    const sLvl = profile.jobSkillLevel || 1;
    smBonus = sLvl * 0.01;
  }

  return Math.floor(basePower * refineBonusMult * (1 + imprintCombatBoost + smBonus));
}

function calculatePartDamage(profile, forceCrit = false) {
  const enhanceLevel = getCurrentEnhanceLevel(profile);
  const combatLevel = profile ? (profile.combatLevel || 0) : 0;
  const refineLevel = profile ? (profile.refine || 0) : 0;
  
  const stats = getEnhanceStats(enhanceLevel, combatLevel, profile);
  const roll = Math.random() * 100;

  const combatPower = getCombatPower(profile);
  const normalDamage = Math.max(1, Math.floor(combatPower / 100));

  let hitPartName = '평타';
  let damageVal = 0;

  if (forceCrit || roll < stats.numCrit) {
    hitPartName = '치명타';
    const critDmgBonus = Number(stats.critDmg) || 0;
    const refineCritBonus = Math.max(0, Number(refineLevel) || 0);
    const imprintCritBonus = getImprintTotalBonus(profile, 'critDmg');
    damageVal = Math.floor(normalDamage * (2 + (critDmgBonus + refineCritBonus + imprintCritBonus) / 100));
  } else if (roll < stats.numCrit + stats.numCounter) {
    hitPartName = '카운터';
    damageVal = normalDamage * 4;
  } else if (roll < stats.numCrit + stats.numCounter + stats.numFullCounter) {
    hitPartName = '풀카운터';
    damageVal = normalDamage * 8;
  } else {
    hitPartName = '평타';
    damageVal = normalDamage;
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

  if (profile.seasonPass.lastDailyDate !== todayStr) {
    profile.seasonPass.lastDailyDate = todayStr;
    profile.seasonPass.dailyFarmExpClaimed = false;
    profile.seasonPass.dailyHuntExpClaimed = false;
  }
}

function grantPassExp(profile, amount) {
  checkAndResetSeasonPass(profile);
  const pass = profile.seasonPass;
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

function processPassCommand(profile) {
  checkAndResetSeasonPass(profile);
  const pass = profile.seasonPass;
  const todayStr = getKSTDateString();

  let lines = [
    `🎫 [${pass.month} 시즌 패스 대시보드]`,
    `• 현재 패스 레벨 : Lv.${pass.level}`,
    `• 패스 경험치 : ${pass.exp} / 100`,
    ``,
    `📋 [일일 경험치 획득 미션]`,
    `• 출석 체크 : 20 EXP ${pass.lastAttendanceDate === todayStr ? '(완료)' : '(미완료)'}`,
    `• 일일 /파밍 100회 달성 : 50 EXP ${pass.dailyFarmExpClaimed ? '(완료)' : `(${profile.farmData?.count || 0}/100)`}`,
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

const CURRENT_DATA_VERSION = 3;

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
  if (!Number.isInteger(profile.equippedAvatarIndex) || profile.equippedAvatarIndex < 0 || profile.equippedAvatarIndex >= profile.ownedAvatars.length) {
    profile.equippedAvatarIndex = profile.equippedAvatar ? profile.ownedAvatars.indexOf(profile.equippedAvatar) : -1;
  }
  return profile;
}

function createProfile(existing = {}) {
  const safeObj = existing && typeof existing === 'object' ? existing : {};
  
  const nickname = (safeObj.nickname && safeObj.nickname.trim() !== '') 
    ? safeObj.nickname 
    : generateRandomNickname();

  let profile = {
    version: safeObj.version ?? CURRENT_DATA_VERSION,
    cash: safeObj.cash ?? 0,
    gold: safeObj.gold ?? 0,
    gem: safeObj.gem ?? 0,
    keys: safeObj.keys ?? 0,
    enhance: safeObj.enhance ?? 0,
    jobEnhance: safeObj.jobEnhance ?? 0,
    totalEnhanceCost: safeObj.totalEnhanceCost ?? 0,       // 모험가 시절 일반무기 누적 강화 비용
    totalJobEnhanceCost: safeObj.totalJobEnhanceCost ?? 0, // 전직 이후 전직무기 누적 강화 비용
    refine: safeObj.refine ?? 0,
    level: safeObj.level ?? 1,
    exp: safeObj.exp ?? 0,
    combatLevel: safeObj.combatLevel ?? 0,
    job: safeObj.job ?? null,               
    jobSkillLevel: safeObj.jobSkillLevel ?? 1, 
    creature: safeObj.creature ?? null,
    imprints: safeObj.imprints && typeof safeObj.imprints === 'object' ? JSON.parse(JSON.stringify(safeObj.imprints)) : {}, 
    imprintLocks: safeObj.imprintLocks && typeof safeObj.imprintLocks === 'object' ? { ...safeObj.imprintLocks } : { I: false, II: false, III: false, IV: false, V: false }, 
    inventory: Array.isArray(safeObj.inventory) ? safeObj.inventory.filter(item => item && typeof item === 'object').map(item => ({ ...item })) : [],
    nickname: nickname,
    title: safeObj.title ?? '',
    ownedTitles: Array.isArray(safeObj.ownedTitles) ? [...safeObj.ownedTitles] : [],
    equippedTitle: safeObj.equippedTitle ?? '',
    ownedAvatars: Array.isArray(safeObj.ownedAvatars) ? [...safeObj.ownedAvatars] : [],
    equippedAvatar: typeof safeObj.equippedAvatar === 'string' ? safeObj.equippedAvatar : '',
    equippedAvatarIndex: Number.isInteger(safeObj.equippedAvatarIndex) ? safeObj.equippedAvatarIndex : -1,
    supplyItem: safeObj.supplyItem ?? safeObj.monthItems ?? 0,
    gamesPlayed: safeObj.gamesPlayed ?? 0,
    maxEnhanceHistory: safeObj.maxEnhanceHistory ?? (safeObj.enhance ?? 0),
    maxJobEnhanceHistory: safeObj.maxJobEnhanceHistory ?? (safeObj.jobEnhance ?? 0),
    hasSeenJobGuide: safeObj.hasSeenJobGuide ?? false,
    farmData: safeObj.farmData && typeof safeObj.farmData === 'object' ? { ...safeObj.farmData } : { date: "", count: 0, lastClaimedFarmQuest: 0 },
    huntData: safeObj.huntData && typeof safeObj.huntData === 'object' ? { ...safeObj.huntData } : { date: "", count: 0, lastClaimedHuntQuest: 0 },
    pvpData: safeObj.pvpData && typeof safeObj.pvpData === 'object' ? { ...safeObj.pvpData } : { date: "", count: 0 },
    dungeonData: safeObj.dungeonData && typeof safeObj.dungeonData === 'object' ? { ...safeObj.dungeonData } : { date: "", count: 0 },
    speedMultiplier: safeObj.speedMultiplier ?? 1,
    vault: safeObj.vault && typeof safeObj.vault === 'object' ? { ...safeObj.vault } : { level: 0, amount: 0, lastTime: 0 },
    helpSeen: safeObj.helpSeen && typeof safeObj.helpSeen === 'object' ? { ...safeObj.helpSeen } : {},
    seasonPass: safeObj.seasonPass && typeof safeObj.seasonPass === 'object' ? { ...safeObj.seasonPass } : { month: "", level: 1, exp: 0, claimedRewards: [], lastAttendanceDate: "", lastDailyDate: "", dailyFarmExpClaimed: false, dailyHuntExpClaimed: false },
    raidData: safeObj.raidData && typeof safeObj.raidData === 'object' ? { ...safeObj.raidData } : { hp: 100000000 },
    lastSmSkillDate: typeof safeObj.lastSmSkillDate === 'string' ? safeObj.lastSmSkillDate : '',
    mgsDungeonData: safeObj.mgsDungeonData && typeof safeObj.mgsDungeonData === 'object' ? { ...safeObj.mgsDungeonData } : { date: '', count: 0 }
  };

  return migrateProfileData(profile);
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
    const maxLimit = profile.vault.level * 1000000;

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
        `• 1레벨 보관 한도 : 1,000,000원`,
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
    const maxLimit = profile.vault.level * 1000000;
    
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

  const maxLimit = profile.vault.level * 1000000;
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
      `• [/금고 구매] : 금고 레벨업 (한도 +1,000,000원 증가)`
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
  const dayOfWeek = getKSTParts().weekday;
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
  const refineStar = REFINE_STARS[Math.min(p.refine, REFINE_STARS.length - 1)] || '';
  
  const totalMult = getGoldMultiplier(p).toFixed(2);

  const jobNames = { berserker: '버서커', swordmaster: '소드마스터', shadow: '섀도우', battlemage: '마검사' };
  const jobDisplay = p.job ? `${jobNames[p.job] || p.job} (Lv.${p.jobSkillLevel || 1})` : '모험가';
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
    `💪 전투력 : ${combatPower.toLocaleString()} (증폭 Lv.${p.combatLevel || 0} | 보유 효과 +${getCollectionCombatPower(p).toLocaleString()})`,
    `🔘 배율 : x${totalMult}`,
    `⏩ 배속 : x${p.speedMultiplier || 1}`
  ];

  if (detailed) {
    const critDmgBonus = getImprintTotalBonus(p, 'critDmg');
    const critRateBonus = getImprintTotalBonus(p, 'critRate');
    const critWeightBonus = getImprintTotalBonus(p, 'critWeight');
    const combatBoostBonus = getImprintTotalBonus(p, 'combatBoost');
    const cashBoostBonus = getImprintTotalBonus(p, 'cashBoost');
    const enhanceSuccessBonus = getImprintTotalBonus(p, 'enhanceSuccess');
    const enhanceCostDownBonus = getImprintTotalBonus(p, 'enhanceCostDown');
    const goldChanceBonus = getImprintTotalBonus(p, 'goldChance');
    const expBoostBonus = getImprintTotalBonus(p, 'expBoost');
    const keyChanceBonus = getImprintTotalBonus(p, 'keyChance');
    const damageReduceBonus = getImprintTotalBonus(p, 'damageReduce');

    if (critDmgBonus !== 0) lines.push(`치명타 데미지 : +${critDmgBonus}%`);
    if (critWeightBonus !== 0) lines.push(`치명타 가중치 : +${critWeightBonus}%`);
    if (combatBoostBonus !== 0) lines.push(`전투력 증가 : +${combatBoostBonus}%`);

    if (critRateBonus !== 0) lines.push(`치명타 확률 증가 : +${critRateBonus}%`);
    if (cashBoostBonus !== 0) lines.push(`현금 획득량 증가 : +${cashBoostBonus}%`);
    if (enhanceSuccessBonus !== 0) lines.push(`강화 성공 확률 증가 : +${enhanceSuccessBonus}%`);
    if (enhanceCostDownBonus !== 0) lines.push(`강화 비용 감소 : +${enhanceCostDownBonus}%`);
    if (goldChanceBonus !== 0) lines.push(`추가 금괴 획득 확률 증가 : +${goldChanceBonus}%`);
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

function processTitleInfo(profile) {
  if (!profile.ownedTitles) profile.ownedTitles = [];

  const currentMonth = getKSTParts().month;
  const currentMonthTitle = MONTHLY_TITLES[currentMonth];
  const currentSeasonTitle = SEASON_TITLES[1];

  let lines = [
    `🎖️ [칭호 정보 및 보유 목록]`,
    `현재 장착 칭호 : ${profile.equippedTitle || '없음'}`,
    `보유 효과 : 칭호 1개당 전투력 +1,000 (현재 +${(profile.ownedTitles.length * 1000).toLocaleString()})`,
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
      lines.push(`${index + 1}. ${titleName}${isEquipped} — 보유: 전투력 +1,000 / 장착: 금괴 +10%`);
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
    `보유 효과 : 아바타 1개당 전투력 +1,000 (현재 +${(avatarCount * 1000).toLocaleString()})`,
    `장착 효과 : 현금 획득량 +10%`,
    ``,
    `📜 보유 중인 아바타 목록:`
  ];

  if (avatarCount === 0) {
    lines.push(`보유한 아바타가 없습니다. /보급에서 월별 아바타를 획득할 수 있습니다.`);
  } else {
    profile.ownedAvatars.forEach((avatarName, index) => {
      const equipped = index === profile.equippedAvatarIndex ? ' (장착 중)' : '';
      lines.push(`${index + 1}. ${avatarName}${equipped} — 보유: 전투력 +1,000 / 장착: 현금 +10%`);
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
      profile.ownedAvatars.push(currentMonthAvatar);
      gainedAvatars.push(`월별 아바타: '${currentMonthAvatar}'`);
    }

    if (roll >= 10) {
      if (roll < 60) {
        const combatPower = getCombatPower(profile);
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
  if (profile) {
    profile.gamesPlayed = (profile.gamesPlayed || 0) + 1;
  }

  return {
    turn: 0,
    maxTurn: MAX_TURN,
    hp: 100,
    alive: true,
    finished: false,
    result: null,
    mode: '파밍',
    currentGradeIndex: 0,
    highestGradeIndex: 0,
    helmetLevel: 0, 
    helmetDurability: 0, 
    vestLevel: 0,    
    vestDurability: 0,    
    accumulatedCash: 0,
    accumulatedGold: 0,  
    accumulatedGem: 0,
    accumulatedKeys: 0,  
    accumulatedSupplyItem: 0,
    accumulatedExp: 0
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
      
      const icon = buff.name === '체력 물약(중)' ? '💊' : (buff.name === '체력 물약(소)' ? '🧪' : '✨');
      
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
  const b = battle || { turn: 0, maxTurn: MAX_TURN, hp: 100, currentGradeIndex: 0, helmetLevel: 0, helmetDurability: 0, vestLevel: 0, vestDurability: 0 };

  checkAndResetFarmLimit(p);
  const currentFarmCount = p.farmData ? p.farmData.count : 0;
  const maxFarmLimit = p.farmData ? p.farmData.max : 200;

  const farmThresholds = [10, 25, 50, 100, 150, 200];
  const nextFarmTarget = farmThresholds.find(t => t > currentFarmCount) || 200;
  const remainingFarmCount = Math.max(0, nextFarmTarget - currentFarmCount);
  const questLeftText = `📜 퀘스트 보상까지 ${remainingFarmCount}회`;

  const currentEnhance = getCurrentEnhanceLevel(p);
  const wName = getWeaponInfo(currentEnhance, p.job)[0];
  const reqExp = getRequiredExp(p.level);
  const refineStar = REFINE_STARS[Math.min(p.refine, REFINE_STARS.length - 1)] || '';
  
  const totalMult = getGoldMultiplier(p).toFixed(2);

  const currentGrade = FARM_GRADE_STEPS[Math.min(b.currentGradeIndex || 0, FARM_GRADE_STEPS.length - 1)];

  let boardLines = [
    `[${b.turn || 0} / ${b.maxTurn || MAX_TURN}턴] 현재 몬스터 : ${currentGrade}`,
    `HP:${makeHpBar(b.hp)}`,
    `🛡️ 투구: Lv.${b.helmetLevel || 0} (${b.helmetDurability ?? 0}%)`,
    `🦺 갑옷: Lv.${b.vestLevel || 0} (${b.vestDurability ?? 0}%)`,
    `배율 (x${totalMult}) | 배속 (x${p.speedMultiplier || 1})`,
    `전투 횟수 : (${currentFarmCount}/${maxFarmLimit})`,
    questLeftText
  ];

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

function getJosa(name, josaGroup) {
  if (!name) return name;
  const lastChar = name.charCodeAt(name.length - 1);
  const hasBatchim = (lastChar - 0xac00) % 28 !== 0;
  if (josaGroup === '가이') {
    return hasBatchim ? '이' : '가';
  } else if (josaGroup === '은는') {
    return hasBatchim ? '은' : '는';
  } else if (josaGroup === '을를') {
    return hasBatchim ? '을' : '를';
  }
  return '';
}

function getFarmBoxKey(grade) {
  if (grade.startsWith('EX')) return 'EX';
  if (grade.startsWith('SSS')) return 'SSS';
  if (grade.startsWith('SS')) return 'SS';
  if (grade.startsWith('S')) return 'S';
  if (grade.startsWith('A')) return 'A';
  if (grade.startsWith('B')) return 'B';
  if (grade.startsWith('C')) return 'C';
  return 'D';
}

function addBoxToInventory(profile, boxKey) {
  const boxData = FARM_BOX_INFO[boxKey];
  if (!boxData) return null;
  if (!Array.isArray(profile.inventory)) profile.inventory = [];
  profile.inventory.push({
    category: 'box',
    boxSource: 'farm',
    name: boxData.name,
    desc: `${boxData.name}입니다. (/상자 개봉 명령어로 사용)`
  });
  return boxData.name;
}

function getHuntBoxKey(grade) {
  if (grade.startsWith('EX')) return 'EX';
  if (grade.startsWith('SSS')) return 'SSS';
  if (grade.startsWith('SS')) return 'SS';
  if (grade.startsWith('S')) return 'S';
  if (grade.startsWith('A')) return 'A';
  if (grade.startsWith('B')) return 'B';
  if (grade.startsWith('C')) return 'C';
  return 'D';
}

function addHuntBoxToInventory(profile, boxKey) {
  const boxData = HUNT_BOX_INFO[boxKey];
  if (!boxData) return null;
  if (!Array.isArray(profile.inventory)) profile.inventory = [];
  profile.inventory.push({
    category: 'box',
    boxSource: 'hunt',
    name: boxData.name,
    desc: `${boxData.name}입니다. (/상자 개봉 명령어로 사용)`
  });
  return boxData.name;
}

function createFarmMonster(grade) {
  const baseGrade = grade.replace(/[+등급]/g, '');
  const candidates = getMonstersByGrade(`${baseGrade}등급`);
  const baseMonster = candidates.length > 0 ? candidates[rand(0, candidates.length - 1)] : getRandomMonsterByProbability({});
  const prefixList = grade.includes('+') ? (prefixes[grade] || []) : [];
  const prefix = prefixList.length > 0 ? prefixList[rand(0, prefixList.length - 1)] : '';
  const rewardMoney = getRewardMoney(grade);
  const rewardGem = getRewardGem(grade);
  return {
    ...(baseMonster || {}),
    grade,
    fullName: prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name,
    rewardMoney,
    rewardGem
  };
}

function resolveProgressionFarmTurn(profile, battle) {
  const speed = profile.speedMultiplier || 1;
  const eventRoll = Math.random() * 100;

  if (eventRoll < 0.01) {
    battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + 1;
    return { text: `📦 [보급 획득!] 보급 1개를 발견했습니다. (파밍 종료 시 지급)`, imageUrl: null };
  }
  if (eventRoll < 1.01) {
    const ampInfo = getAmplifyInfo(profile.combatLevel || 0);
    const gold = applyCreatureGoldBonus(Math.max(1, rand(ampInfo.minGold, ampInfo.maxGold) * speed), profile);
    battle.accumulatedGold = (battle.accumulatedGold || 0) + gold;
    return { text: `🧈 [금괴 획득!] 금괴 +${gold.toLocaleString()}개 (파밍 종료 시 지급)`, imageUrl: null };
  }
  if (eventRoll < 3.01) {
    const keys = Math.max(1, speed);
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keys;
    return { text: `🔑 [비밀열쇠 획득!] 비밀열쇠 +${keys}개 (파밍 종료 시 지급)`, imageUrl: null };
  }
  if (eventRoll < 10) {
    const cash = applyCreatureCashBonus(Math.round((10393 / 10) * getGoldMultiplier(profile) * speed), profile);
    battle.accumulatedCash += cash;
    battle.accumulatedExp = (battle.accumulatedExp || 0) + Math.max(1, Math.floor(cash / 10));
    return { text: `🎰 [잭팟!] 현금 +${won(cash)} (파밍 종료 시 지급)`, imageUrl: null };
  }

  const gradeIndex = Math.min(battle.currentGradeIndex || 0, FARM_GRADE_STEPS.length - 1);
  const grade = FARM_GRADE_STEPS[gradeIndex];
  const monster = createFarmMonster(grade);
  const successChance = Math.max(10, 80 - (gradeIndex * 10));

  if (Math.random() * 100 < successChance) {
    let cash = Math.floor(monster.rewardMoney * getLootMultiplier(profile) * 0.5 * speed);
    cash = applyCreatureCashBonus(cash, profile);
    const gem = Math.floor(applyCreatureGemBonus(monster.rewardGem || 0, profile) * 0.5 * speed);
    battle.accumulatedCash += cash;
    battle.accumulatedGem = (battle.accumulatedGem || 0) + gem;
    battle.accumulatedExp = (battle.accumulatedExp || 0) + Math.max(1, Math.floor(cash / 10));
    battle.highestGradeIndex = Math.max(battle.highestGradeIndex || 0, gradeIndex);
    battle.currentGradeIndex = Math.min(gradeIndex + 1, FARM_GRADE_STEPS.length - 1);
    const nextGrade = FARM_GRADE_STEPS[battle.currentGradeIndex];
    const rewards = [`💵 현금 +${won(cash)}`];
    if (gem > 0) rewards.push(`💎 보석 +${gem}개`);
    return {
      text: `✅ [${grade}] ${monster.fullName} 처치 성공! (${successChance}% 확률)\n${rewards.join('\n')}\n다음 도전 몬스터: ${nextGrade} (파밍 종료 시 지급)`,
      imageUrl: monster.image || null
    };
  }

  const rawDamage = rand(20, 30);
  const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rawDamage);
  battle.hp = Math.max(0, battle.hp - finalDamage);
  checkDeath(battle);
  const defense = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
  const notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
  return {
    text: `[${grade}] ${monster.fullName} 처치에 실패했습니다. 잔류(MISS) — 같은 몬스터에게 재도전할 수 있습니다.\nHP -${finalDamage}${defense}${notes}`,
    imageUrl: monster.image || null
  };
}

function resolveFarmFight(profile, battle) {
  let resultMessages = [];
  let earnedCash = 0;
  let earnedExp = 0;
  let earnedGold = 0;
  let earnedKeys = 0;
  let earnedSupplyItem = 0;
  
  const spawnedMonster = getRandomMonsterByProbability(profile);
  const monsterName = spawnedMonster ? spawnedMonster.fullName : "몬스터";
  const monsterImage = spawnedMonster ? spawnedMonster.image : null;
  const josaGa = getJosa(monsterName, '가이');

  const combatLv = profile.combatLevel || 0;
  const mult = getGoldMultiplier(profile);
  const ampInfo = getAmplifyInfo(combatLv);
  const speed = profile.speedMultiplier || 1;

  if (profile.job === 'berserker') {
    const sLvl = profile.jobSkillLevel || 1;
    const raidPassChance = sLvl * 0.01;
    if (Math.random() < raidPassChance) {
      if (!profile.raidData) profile.raidData = { hp: 100000000 };
      let raidHp = profile.raidData.hp;
      let raidMsg = `💥 [버서커 패시브 - 레이드 교전 발생!] 거대 레이드 보스 등장! (남은 체력: ${raidHp.toLocaleString()})`;
      
      const myPower = getCombatPower(profile);
      if (raidHp < 1000000 && Math.random() < (sLvl * 0.01)) {
        raidHp = 0;
        profile.raidData.hp = 100000000;
        let rCash = 1;
        let rGold = 1;
        let rGem = 1;
        let rKey = 1;
        let rSupply = 1;
        
        battle.accumulatedCash += rCash;
        battle.accumulatedGold = (battle.accumulatedGold || 0) + rGold;
        battle.accumulatedGem = (battle.accumulatedGem || 0) + rGem;
        battle.accumulatedKeys = (battle.accumulatedKeys || 0) + rKey;
        battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + rSupply;

        raidMsg += `\n☠️ [버서커 스킬 - 처형!] 레이드 보스를 즉시 처형했습니다! 보상 획득: 현금 1원, 금괴 1개, 보석 1개, 비밀열쇠 1개, 보급 1개 (종료 시 정산)`;
      } else {
        let dmgDealt = myPower;
        if (Math.random() < (sLvl * 0.01)) {
          dmgDealt = Math.max(dmgDealt, Math.floor(raidHp * 0.01));
          raidMsg += `\n🪓 [버서커 스킬 - 일격!] 레이드 보스 전체 체력의 1% 피해를 입혔습니다!`;
        } else {
          raidMsg += `\n🪓 레이드 보스에게 전투력(${myPower.toLocaleString()})만큼 피해를 입혔습니다!`;
        }
        raidHp = Math.max(0, raidHp - dmgDealt);
        profile.raidData.hp = raidHp;

        let raidRewardCash = dmgDealt * 10;
        raidRewardCash = applyCreatureCashBonus(raidRewardCash, profile);

        let raidGold = rand(1, 10);
        raidGold = applyCreatureGoldBonus(raidGold, profile);

        let raidGem = rand(1, 10);
        raidGem = applyCreatureGemBonus(raidGem, profile);

        battle.accumulatedCash += raidRewardCash;
        battle.accumulatedGold = (battle.accumulatedGold || 0) + raidGold;
        battle.accumulatedGem = (battle.accumulatedGem || 0) + raidGem;

        raidMsg += `\n보상: 현금 +${won(raidRewardCash)}, 금괴 +${raidGold}개, 보석 +${raidGem}개 (종료 시 정산)`;

        if (raidHp === 0) {
          profile.raidData.hp = 100000000;
          battle.accumulatedCash += 1;
          battle.accumulatedGold = (battle.accumulatedGold || 0) + 1;
          battle.accumulatedGem = (battle.accumulatedGem || 0) + 1;
          battle.accumulatedKeys = (battle.accumulatedKeys || 0) + 1;
          battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + 1;
          raidMsg += `\n🎉 레이드 보스를 토벌했습니다! 추가 보상: 현금 1원, 금괴 1개, 보석 1개, 비밀열쇠 1개, 보급 1개 (종료 시 정산)`;
        }
      }
      resultMessages.push(raidMsg);
    }
  }

  let outcome = 'damage';

  if (outcome === 'supplyItem') {
    const combatPower = getCombatPower(profile);
    earnedCash = applyCreatureCashBonus(combatPower * 10 * speed, profile);
    
    let goldBonus = rand(ampInfo.minGold, ampInfo.maxGold) * speed;
    goldBonus = applyCreatureGoldBonus(goldBonus, profile);
    earnedGold += goldBonus;
    
    let keyBonus = 1 * speed;
    const keyChanceBonus = getImprintTotalBonus(profile, 'keyChance');
    if (Math.random() < keyChanceBonus) {
      keyBonus += 1;
    }
    earnedKeys += keyBonus;
    
    earnedSupplyItem = 1 * speed;

    battle.accumulatedCash += earnedCash;
    battle.accumulatedGold = (battle.accumulatedGold || 0) + goldBonus;
    battle.accumulatedKeys = (battle.accumulatedKeys || 0) + keyBonus;
    battle.accumulatedSupplyItem = (battle.accumulatedSupplyItem || 0) + earnedSupplyItem;

    battle.helmetLevel = 3;
    battle.helmetDurability = 100;
    battle.vestLevel = 3;
    battle.vestDurability = 100;
    
    let supplyMsg = `[📦 보급 1개 획득!] 최고급 Lv.3 투구 & Lv.3 갑옷 장착 완료! (내구도 100%)\n현금 +${won(earnedCash)}\n금괴 +${goldBonus}개\n비밀열쇠 +${keyBonus}개\n보급 +${earnedSupplyItem}개`;
    resultMessages.push(supplyMsg);
  } else {
    if (battle.turn >= 2 && Math.random() < 0.20) {
      if (battle.helmetLevel === 0) {
        battle.helmetLevel = 1;
        battle.helmetDurability = 100;
        resultMessages.push(`🛡️ Lv.1 투구 획득! (내구도 100%)`);
      } else if (battle.helmetLevel < 3 && Math.random() < 0.4) {
        battle.helmetLevel += 1;
        battle.helmetDurability = 100;
        resultMessages.push(`🛡️ Lv.${battle.helmetLevel} 투구로 업그레이드! (내구도 100%)`);
      }
    }

    if (battle.turn >= 2 && Math.random() < 0.20) {
      if (battle.vestLevel === 0) {
        battle.vestLevel = 1;
        battle.vestDurability = 100;
        resultMessages.push(`🦺 Lv.1 갑옷 획득! (내구도 100%)`);
      } else if (battle.vestLevel < 3 && Math.random() < 0.4) {
        battle.vestLevel += 1;
        battle.vestDurability = 100;
        resultMessages.push(`🦺 Lv.${battle.vestLevel} 갑옷으로 업그레이드! (내구도 100%)`);
      }
    }
  }

  let mainText = '';
  let activeImageUrl = null;

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
      goldBonus = applyCreatureGoldBonus(goldBonus, profile);
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
      let jackpotAmt = Math.round((10393 / 10) * mult * speed);
      jackpotAmt = applyCreatureCashBonus(jackpotAmt, profile);
      earnedCash = jackpotAmt;
      battle.accumulatedCash += earnedCash;
      
      const expGained = Math.round((jackpotAmt / 100));
      earnedExp += expGained;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + expGained;

      mainText = `[잭팟!] 현금 ${won(jackpotAmt)} 획득! (EXP +${expGained.toLocaleString()})`;
      break;
    }
    case 'damage': {
      activeImageUrl = monsterImage;
      const rawDmg = rand(12, 25);
      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rawDmg);

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);
      
      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';
      mainText = `[${spawnedMonster ? spawnedMonster.grade : "D등급"}] ${monsterName}에게 공격을 받아 기습당했습니다.\nHP -${finalDamage}${reduceMsg}${notes}`;
      break;
    }
    case 'kill_single': {
      activeImageUrl = monsterImage;
      let killCount = 1;
      const assistCount = 0;
      const sLvl = profile.jobSkillLevel || 1;

      let skillNote = "";

      if (profile.job === 'shadow' && Math.random() < (sLvl * 0.01)) {
        const resRoll = Math.random();
        if (resRoll < 0.33) {
          const lootAmt = applyCreatureCashBonus(100000 * speed, profile);
          battle.accumulatedCash += lootAmt;
          skillNote += `\n🗡️ [섀도우 패시브 발동!] 적에게서 현금 +${won(lootAmt)}을 약탈했습니다!`;
        } else if (resRoll < 0.66) {
          const lootGold = applyCreatureGoldBonus(5 * speed, profile);
          battle.accumulatedGold = (battle.accumulatedGold || 0) + lootGold;
          skillNote += `\n🗡️ [섀도우 패시브 발동!] 적에게서 금괴 +${lootGold}개를 약탈했습니다!`;
        } else {
          const lootGem = applyCreatureGemBonus(5 * speed, profile);
          battle.accumulatedGem = (battle.accumulatedGem || 0) + lootGem;
          skillNote += `\n🗡️ [섀도우 패시브 발동!] 적에게서 보석 +${lootGem}개를 약탈했습니다!`;
        }
      }

      let totalDamageVal = 0;
      let hitPartsList = [];

      for (let i = 0; i < killCount; i++) {
        const { hitPartName, damageVal } = calculatePartDamage(profile, false);
        totalDamageVal += damageVal;
        hitPartsList.push(hitPartName);
      }

      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rand(8, 20));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const killAssistReward = Math.round(((killCount * 100) + (assistCount * 50)) * mult * speed);
      const damageReward = Math.round(totalDamageVal * mult * speed);
      let finalReward = killAssistReward + damageReward;
      finalReward = applyCreatureCashBonus(finalReward, profile);
      
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';

      const baseExp = Math.round(earnedCash / 10);
      earnedExp += baseExp;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + baseExp;

      mainText = `[${killCount} KILL] (+${won(killAssistReward)})\n` +
                 `적에게 (${hitPartsList.join(', ')})를 입혀 [${spawnedMonster ? spawnedMonster.grade : "D등급"}] ${monsterName}${josaGa} 사망했습니다.\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg} (EXP +${baseExp.toLocaleString()})${skillNote}${notes}`;
      break;
    }
    case 'kill_multi': {
      let killCount = rand(2, 3);
      const assistCount = rand(0, 2);
      const sLvl = profile.jobSkillLevel || 1;

      let skillNote = "";

      if (profile.job === 'shadow' && Math.random() < (sLvl * 0.01)) {
        const resRoll = Math.random();
        if (resRoll < 0.33) {
          const lootAmt = applyCreatureCashBonus(100000 * speed, profile);
          battle.accumulatedCash += lootAmt;
          skillNote += `\n🗡️ [섀도우 패시브 발동!] 적에게서 현금 +${won(lootAmt)}을 약탈했습니다!`;
        } else if (resRoll < 0.66) {
          const lootGold = applyCreatureGoldBonus(5 * speed, profile);
          battle.accumulatedGold = (battle.accumulatedGold || 0) + lootGold;
          skillNote += `\n🗡️ [섀도우 패시브 발동!] 적에게서 금괴 +${lootGold}개를 약탈했습니다!`;
        } else {
          const lootGem = applyCreatureGemBonus(5 * speed, profile);
          battle.accumulatedGem = (battle.accumulatedGem || 0) + lootGem;
          skillNote += `\n🗡️ [섀도우 패시브 발동!] 적에게서 보석 +${lootGem}개를 약탈했습니다!`;
        }
      }

      let totalDamageVal = 0;
      let killLines = [];
      let topGradeMonster = null;
      let topGradeRank = -1;
      const killGradeRank = {
        "EX++등급": 24, "EX+등급": 23, "EX등급": 22,
        "SSS++등급": 21, "SSS+등급": 20, "SSS등급": 19,
        "SS++등급": 18, "SS+등급": 17, "SS등급": 16,
        "S++등급": 15, "S+등급": 14, "S등급": 13,
        "A++등급": 12, "A+등급": 11, "A등급": 10,
        "B++등급": 9, "B+등급": 8, "B등급": 7,
        "C++등급": 6, "C+등급": 5, "C등급": 4,
        "D++등급": 3, "D+등급": 2, "D등급": 1
      };

      for (let i = 0; i < killCount; i++) {
        const mObj = getRandomMonsterByProbability(profile);
        const mName = mObj ? mObj.fullName : "몬스터";
        const mGrade = mObj ? mObj.grade : "D등급";
        const mJosaGa = getJosa(mName, '가이');
        const { hitPartName, damageVal } = calculatePartDamage(profile, false);
        totalDamageVal += damageVal;

        if (mObj && (killGradeRank[mGrade] || 0) > topGradeRank) {
          topGradeRank = killGradeRank[mGrade] || 0;
          topGradeMonster = mObj;
        }

        killLines.push(`적에게 (${hitPartName})를 입혀 [${mGrade}] ${mName}${mJosaGa} 사망했습니다.`);
      }

      if (topGradeMonster) {
        activeImageUrl = topGradeMonster.image;
      }

      const { finalDamage, totalReduce, armorNotes } = calculateCombatDamage(profile, battle, rand(15, 30));

      battle.hp = Math.max(0, battle.hp - finalDamage);
      checkDeath(battle);

      const killAssistReward = Math.round(((killCount * 100) + (assistCount * 50)) * mult * speed);
      const damageReward = Math.round(totalDamageVal * mult * speed);
      let finalReward = killAssistReward + damageReward;
      finalReward = applyCreatureCashBonus(finalReward, profile);
      
      earnedCash = finalReward;
      battle.accumulatedCash += earnedCash;

      let reduceMsg = totalReduce > 0 ? ` (방어 -${totalReduce})` : '';
      let notes = armorNotes.length > 0 ? `\n${armorNotes.join('\n')}` : '';

      let killTextHeader = assistCount > 0 
        ? `[${killCount} KILL / ${assistCount} ASSIST] (+${won(killAssistReward)})`
        : `[${killCount} KILL] (+${won(killAssistReward)})`;

      let killDetailText = killLines.join('\n');

      const baseExp = Math.round(earnedCash / 10);
      earnedExp += baseExp;
      battle.accumulatedExp = (battle.accumulatedExp || 0) + baseExp;

      mainText = `${killTextHeader}\n` +
                 `${killDetailText}\n` +
                 `[데미지 ${totalDamageVal.toLocaleString()}] (+${won(damageReward)})\n` +
                 `HP -${finalDamage}${reduceMsg} (EXP +${baseExp.toLocaleString()})${skillNote}${notes}`;
      break;
    }
    default: {
      let lootCash = rand(100, 500) * mult * speed;
      lootCash = applyCreatureCashBonus(lootCash, profile);
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

  const count = profile.farmData.count;
  const lastClaimed = profile.farmData.lastClaimedFarmQuest || 0;
  const dice = rand(1, 6);
  let farmQuestRewardMsgs = [];

  if (count >= 10 && lastClaimed < 10) {
    let qCash = applyCreatureCashBonus(5000 * dice, profile);
    profile.cash += qCash;
    profile.farmData.lastClaimedFarmQuest = 10;
    farmQuestRewardMsgs.push(`퀘스트 달성 보상 (10회) : 현금 +${won(qCash)}`);
  }
  if (count >= 25 && profile.farmData.lastClaimedFarmQuest < 25) {
    let qCash = applyCreatureCashBonus(10000 * dice, profile);
    profile.cash += qCash;
    profile.farmData.lastClaimedFarmQuest = 25;
    farmQuestRewardMsgs.push(`퀘스트 달성 보상 (25회) : 현금 +${won(qCash)}`);
  }
  if (count >= 50 && profile.farmData.lastClaimedFarmQuest < 50) {
    let qCash = applyCreatureCashBonus(15000 * dice, profile);
    let qGold = applyCreatureGoldBonus(1 * dice, profile);
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 50;
    farmQuestRewardMsgs.push(`퀘스트 달성 보상 (50회) : 현금 +${won(qCash)} 및 금괴 +${qGold}개`);
  }
  if (count >= 100 && profile.farmData.lastClaimedFarmQuest < 100) {
    let qCash = applyCreatureCashBonus(20000 * dice, profile);
    let qGold = applyCreatureGoldBonus(1 * dice, profile);
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 100;
    farmQuestRewardMsgs.push(`퀘스트 달성 보상 (100회) : 현금 +${won(qCash)} 및 금괴 +${qGold}개`);
  }
  if (count >= 150 && profile.farmData.lastClaimedFarmQuest < 150) {
    let qCash = applyCreatureCashBonus(25000 * dice, profile);
    let qGold = applyCreatureGoldBonus(1 * dice, profile);
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 150;
    farmQuestRewardMsgs.push(`퀘스트 달성 보상 (150회) : 현금 +${won(qCash)} 및 금괴 +${qGold}개`);
  }
  if (count >= 200 && profile.farmData.lastClaimedFarmQuest < 200) {
    let qCash = applyCreatureCashBonus(30000 * dice, profile);
    let qGold = applyCreatureGoldBonus(2 * dice, profile);
    profile.cash += qCash;
    profile.gold += qGold;
    profile.farmData.lastClaimedFarmQuest = 200;
    farmQuestRewardMsgs.push(`퀘스트 달성 보상 (200회) : 현금 +${won(qCash)} 및 금괴 +${qGold}개`);
  }

  if (farmQuestRewardMsgs.length > 0) {
    resultMessages.push(farmQuestRewardMsgs.join('\n'));
  }

  checkAndResetSeasonPass(profile);
  if (count >= 100 && !profile.seasonPass.dailyFarmExpClaimed) {
    profile.seasonPass.dailyFarmExpClaimed = true;
    const passMsg = grantPassExp(profile, 50);
    resultMessages.push(`🎯 [시즌 패스 미션 달성] 파밍 100회 달성!\n${passMsg}`);
  }

  return { text: resultMessages.join('\n'), imageUrl: activeImageUrl, category: outcome, earnedCash, earnedExp, earnedGold, earnedKeys, earnedSupplyItem };
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
      const existingBuff = battle.buffs.find(b => b.name === '체력 물약(소)');
      if (existingBuff) {
        existingBuff.turnsLeft += 2;
        textResult = `🧪 [체력 물약(소)] 효과 추가 발동! (남은 지속 시간 +2턴 연장 ➔ 총 ${existingBuff.turnsLeft}턴)`;
      } else {
        battle.buffs.push({ name: '체력 물약(소)', turnsLeft: 2, healAmount: 5 });
        textResult = `🧪 [체력 물약(소)] 효과 발동 (2턴 동안 매턴 HP +5 회복)`;
      }
      break;
    }
    case 'painkiller': {
      const existingBuff = battle.buffs.find(b => b.name === '체력 물약(중)');
      if (existingBuff) {
        existingBuff.turnsLeft += 3;
        textResult = `💊 [체력 물약(중)] 효과 추가 발동! (남은 지속 시간 +3턴 연장 ➔ 총 ${existingBuff.turnsLeft}턴)`;
      } else {
        battle.buffs.push({ name: '체력 물약(중)', turnsLeft: 3, healAmount: 5 });
        textResult = `💊 [체력 물약(중)] 효과 발동 (3턴 동안 매턴 HP +5 회복)`;
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

    resultMsg = `[무기 파괴] +${initialEnhance} ➔ +0 (파괴)\n(소모 비용: ${won(cost)}${gemCost > 0 ? `, 보석 ${gemCost}개` : ''})\n` +
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
  const currentCrit = currentRefine * 1;
  const currentCp = currentRefine * 2;

  if (currentRefine >= 10) {
    return {
      text: [
        `🔥 [현재 제련 정보]`,
        `현재 제련 단계: ${currentRefine}성 (${starStr})`,
        `배율 | x${currentMult}`,
        `치명타 데미지 증가 | ${currentCrit}%`,
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
      `치명타 데미지 증가 | ${currentCrit}%`,
      `전투력 증가 | ${currentCp}%`,
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
    `⏩ 증폭 단계 : Lv.${currentLevel}`,
    `• 배율 가산 : x${currentAmp.multBonus.toFixed(2)}`,
    `• 치명타 가중치 : ${Math.round(currentAmp.critWeight * 100)}%`,
    `• 강화 성공 보정 : +${currentAmp.successBonus.toFixed(1)}%`,
    `• 획득 가능 금괴 수량 : ${currentGoldRange}`
  ];

  if (currentLevel < 10) {
    const nextAmp = AMPLIFY_TABLE[currentLevel + 1];
    const goldRange = nextAmp.minGold === nextAmp.maxGold ? `${nextAmp.minGold.toLocaleString()}개` : `${nextAmp.minGold.toLocaleString()}~${nextAmp.maxGold.toLocaleString()}개`;
    lines.push(
      ``,
      `⏩ 증폭(Lv.${currentLevel + 1}) 업그레이드 정보:`,
      `• 필요 금괴 : ${nextAmp.costNext.toLocaleString()}개`,
      `• 배율 가산 : x${nextAmp.multBonus.toFixed(2)}`,
      `• 치명타 가중치 : ${Math.round(nextAmp.critWeight * 100)}%`,
      `• 강화 성공 보정 : +${nextAmp.successBonus.toFixed(1)}%`,
      `• 획득 가능 금괴 수량 : ${goldRange}`,
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
    `• 소모 금괴: ${totalGoldSpent.toLocaleString()}개`,
    `• 배율 가산 | x${prevAmp.multBonus.toFixed(2)} ➔ x${nextAmp.multBonus.toFixed(2)}`,
    `• 치명타 가중치 | ${Math.round(prevAmp.critWeight * 100)}% ➔ ${Math.round(nextAmp.critWeight * 100)}%`,
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
  let totalSupplyItem = 0;

  const combatPower = getCombatPower(profile);
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

  return { text: rewardLines.join('\n'), imageUrl: null };
}

function processBoxesCommand(profile, arg) {
  if (!profile.inventory) profile.inventory = [];

  let cleanArg = (arg || '').trim();
  if (cleanArg.startsWith('개봉')) {
    cleanArg = cleanArg.replace('개봉', '').trim();
  }

  const parts = cleanArg.split(/\s+/).filter(Boolean);
  const boxKeys = Object.keys(FARM_BOX_INFO);

  if (parts.length === 0) {
    let boxCounts = {};
    boxKeys.forEach(k => { boxCounts[FARM_BOX_INFO[k].name] = 0; });

    profile.inventory.forEach(item => {
      if (item.category === 'box') {
        boxCounts[item.name] = (boxCounts[item.name] || 0) + 1;
      }
    });

    let lines = [`📦 [보유 상자 목록]`];
    let idx = 1;
    boxKeys.forEach(key => {
      const box = FARM_BOX_INFO[key];
      const count = boxCounts[box.name] || 0;
      lines.push(`${idx++}. ${box.name}: ${count}개`);
    });
    lines.push(``, `💡 사용법: [/상자 (상자번호) (개수)] 또는 [/상자 개봉 (상자번호) (개수)] (예: /상자 1 2)`);
    return { text: lines.join('\n') };
  }

  const subCmd = parts[0];
  const countArg = parts[1] || '1';

  let targetBoxKey = null;
  const boxIndex = parseInt(subCmd, 10);
  
  if (!isNaN(boxIndex) && boxIndex >= 1 && boxIndex <= boxKeys.length) {
    targetBoxKey = boxKeys[boxIndex - 1];
  } else {
    // 키(D, C, B...) 또는 상자 이름("나무 상자" 등)으로 검색 지원
    for (let k in FARM_BOX_INFO) {
      if (k === subCmd.toUpperCase() || FARM_BOX_INFO[k].name === subCmd) {
        targetBoxKey = k;
        break;
      }
    }
  }

  if (!targetBoxKey) {
    return { text: `⚠️ 올바른 상자 번호나 이름을 입력해 주세요. (예: /상자 1 2)\n/상자 명령어로 목록과 번호를 확인하세요.` };
  }

  const boxData = FARM_BOX_INFO[targetBoxKey];
  let reqCount = parseInt(countArg, 10);
  if (isNaN(reqCount) || reqCount < 1) reqCount = 1;

  // 인벤토리에서 명확하게 상자 이름으로 필터링
  let hasBoxes = profile.inventory.filter(item => item.category === 'box' && item.name === boxData.name);
  if (hasBoxes.length === 0) {
    return { text: `⚠️ 보유 중인 [${boxData.name}]가 없습니다.` };
  }

  let openCount = Math.min(hasBoxes.length, reqCount);
  let removed = 0;
  profile.inventory = profile.inventory.filter(item => {
    if (item.category === 'box' && item.name === boxData.name && removed < openCount) {
      removed++;
      return false;
    }
    return true;
  });

  let totalCash = 0;
  let totalGold = 0;
  let totalGem = 0;
  const specialRewards = [];

  for (let i = 0; i < openCount; i++) {
    let gainedCash = rand(boxData.minCash, boxData.maxCash);
    gainedCash = applyCreatureCashBonus(gainedCash, profile);

    let gainedGold = rand(boxData.minGold || 0, boxData.maxGold || 0);
    gainedGold = applyCreatureGoldBonus(gainedGold, profile);

    let gainedGem = rand(boxData.minGem || 0, boxData.maxGem || 0);
    gainedGem = applyCreatureGemBonus(gainedGem, profile);

    totalCash += gainedCash;
    totalGold += gainedGold;
    totalGem += gainedGem;

    if (boxData.bonusBox && Math.random() < (boxData.bonusBoxChance || 0)) {
      const bonusName = addBoxToInventory(profile, boxData.bonusBox);
      specialRewards.push(`추가 상자: ${bonusName} 1개`);
    }
    if (boxData.monthlyTitleChance && Math.random() < boxData.monthlyTitleChance) {
      const titleName = MONTHLY_TITLES[getKSTParts().month];
      if (!profile.ownedTitles.includes(titleName)) {
        profile.ownedTitles.push(titleName);
        specialRewards.push(`월별 칭호: ${titleName}`);
      }
    }
    if (boxData.seasonTitleChance && Math.random() < boxData.seasonTitleChance) {
      const titleName = SEASON_TITLES[1];
      if (!profile.ownedTitles.includes(titleName)) {
        profile.ownedTitles.push(titleName);
        specialRewards.push(`시즌 칭호: ${titleName}`);
      }
    }
  }

  profile.cash += totalCash;
  profile.gold = (profile.gold || 0) + totalGold;
  profile.gem = (profile.gem || 0) + totalGem;

  let resultLines = [
    `🎁 [${boxData.name} 개봉 완료! (${openCount}개)]`,
    `• 획득 현금 : +${won(totalCash)}`,
    `• 획득 금괴 : +${totalGold.toLocaleString()}개`,
    `• 획득 보석 : +${totalGem.toLocaleString()}개`,
    ``,
    resourceText(profile)
  ];

  if (specialRewards.length > 0) resultLines.splice(4, 0, `• 특별 보상 : ${specialRewards.join(', ')}`);
  return { text: resultLines.join('\n') };
}

function getBoxCatalog() {
  const farmEntries = Object.entries(FARM_BOX_INFO).map(([key, data]) => ({ id: `FARM_${key}`, source: 'farm', key, ...data }));
  const huntEntries = Object.entries(HUNT_BOX_INFO).map(([key, data]) => ({ id: `HUNT_${key}`, source: 'hunt', key, ...data }));
  return [...farmEntries, ...huntEntries];
}

function processUpdatedBoxesCommand(profile, arg) {
  if (!Array.isArray(profile.inventory)) profile.inventory = [];
  if (!Array.isArray(profile.ownedTitles)) profile.ownedTitles = [];

  let cleanArg = (arg || '').trim().replace(/^개봉\s*/, '');
  const parts = cleanArg.split(/\s+/).filter(Boolean);
  const catalog = getBoxCatalog();

  if (parts.length === 0) {
    const lines = [`📦 [보유 상자 목록]`];
    catalog.forEach((box, index) => {
      const count = profile.inventory.filter(item => item.category === 'box' && item.name === box.name && (item.boxSource === box.source || (!item.boxSource && box.source === 'hunt'))).length;
      lines.push(`${index + 1}. [${box.source === 'farm' ? '파밍' : '사냥'}] ${box.name}: ${count}개`);
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

  let totalCash = 0;
  let totalGold = 0;
  let totalGem = 0;
  const specialRewards = [];
  for (let i = 0; i < openCount; i++) {
    totalCash += applyCreatureCashBonus(rand(box.minCash, box.maxCash), profile);
    totalGold += applyCreatureGoldBonus(rand(box.minGold || 0, box.maxGold || 0), profile);
    totalGem += applyCreatureGemBonus(rand(box.minGem || 0, box.maxGem || 0), profile);

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
    `🎁 [${box.source === 'farm' ? '파밍' : '사냥'} · ${box.name} 개봉 완료! (${openCount}개)]`,
    `• 획득 현금 : +${won(totalCash)}`,
    `• 획득 금괴 : +${totalGold.toLocaleString()}개`,
    `• 획득 보석 : +${totalGem.toLocaleString()}개`
  ];
  if (specialRewards.length > 0) lines.push(`• 특별 보상 : ${specialRewards.join(', ')}`);
  lines.push(``, resourceText(profile));
  return { text: lines.join('\n') };
}

function getJobInfoText(jobCode, skillLevel = 1) {
  const chance = skillLevel * 1; 
  if (jobCode === 'berserker') {
    return `🪓 버서커 : 파밍 도중 레이드를 마주할 확률 ${chance}%, 레이드 체력 1% 미만 시 ${chance}% 확률로 즉시 처형, 레이드 체력의 1% 피해를 입힐 확률 ${chance}%`;
  } else if (jobCode === 'swordmaster') {
    return `⚡ 소드마스터 : 전투력 ${chance}% 증가, 매일 랜덤 직업 변경 확률 ${chance}%`;
  } else if (jobCode === 'shadow') {
    const maxBet = skillLevel * 1000000;
    return `🗡️ 섀도우 : 적 처치 시 ${chance}% 확률로 재화 약탈, /스킬 [금액] 커맨드 사용 가능 (최대 약탈 걸기: ${won(maxBet)})`;
  } else if (jobCode === 'battlemage') {
    const huntCount = skillLevel * 10;
    return `🔮 마검사 : 고등급 몬스터 발견 확률 +${chance}%, /스킬 커맨드로 마검 전용 던전 입장 가능 (${skillLevel}회 사용 가능, B등급 이상 몬스터 ${huntCount}마리 연속 처치)`;
  }
  return '';
}

function processJobCommand(profile, targetJob) {
  const jobMap = { '버서커': 'berserker', '소드마스터': 'swordmaster', '섀도우': 'shadow', '마검사': 'battlemage' };
  const REQUIRED_CASH = JOB_UNLOCK_CASH;
  const REQUIRED_GOLD = JOB_UNLOCK_GOLD;

  if (profile.job) {
    const jobNames = { berserker: '버서커', swordmaster: '소드마스터', shadow: '섀도우', battlemage: '마검사' };
    const currentJobName = jobNames[profile.job] || profile.job;
    const skillLevel = profile.jobSkillLevel || 1;

    const currentSkillInfo = getJobInfoText(profile.job, skillLevel);

    let msg = [
      `🎖️ [현재 전직 정보]`,
      `직업: ${currentJobName}`,
      ``,
      `전직 스킬`,
      `${currentJobName} 스킬 레벨: Lv.${skillLevel}`,
      currentSkillInfo,
      `(비용 : 금괴 2000개)`
    ];

    let finalChoices = [
      { label: '/전직 스킬 강화', action: '/전직 스킬 강화' },
      { label: '/전직 변경', action: '/전직 변경' }
    ];

    return { 
      text: [
        msg.join('\n'),
        ``,
        resourceText(profile)
      ].join('\n'),
      choices: finalChoices
    };
  }

  if (!targetJob) {
    let unselectedChoices = [
      { label: '/전직 버서커', action: '/전직 버서커' },
      { label: '/전직 소드마스터', action: '/전직 소드마스터' },
      { label: '/전직 섀도우', action: '/전직 섀도우' },
      { label: '/전직 마검사', action: '/전직 마검사' }
    ];

    return {
      text: [
        `📜 [전직 시스템 안내]`,
        `원하는 직업으로 전직하여 강력한 특수 스킬을 획득하세요!`,
        ``,
        `📋 [전직 조건]`,
        `• 최고 무기 '+20 싱귤래리티' 달성`,
        `• 전직 비용: ${won(REQUIRED_CASH)}, 금괴 ${REQUIRED_GOLD}개`,
        ``,
        `1. 🪓 버서커 (/전직 버서커) - 대검 사용`,
        `   - 파밍 중 레이드 난입 / 즉시 처형 및 1% 피해 확률`,
        `2. ⚡ 소드마스터 (/전직 소드마스터) - 광검 사용`,
        `   - 전투력 % 증가 및 매일 일정 확률 직업 랜덤 변경`,
        `3. 🗡️ 섀도우 (/전직 섀도우) - 단검 사용`,
        `   - 적 처치 시 재화 약탈 / /스킬 [금액] 상대 재화 약탈`,
        `4. 🔮 마검사 (/전직 마검사) - 마검 사용`,
        `   - 고등급 몬스터 발견 확률 증가 / /스킬 입력 시 마검 전용 던전 입장`,
        ``,
        `💡 입력예시: [/전직 버서커], [/전직 소드마스터], [/전직 섀도우], [/전직 마검사]`,
        ``,
        resourceText(profile)
      ].join('\n'),
      choices: unselectedChoices
    };
  }

  const jobCode = jobMap[targetJob];
  if (!jobCode) {
    return { text: `⚠️ 올바른 전직 직업명을 입력해 주세요. (버서커, 소드마스터, 섀도우, 마검사)` };
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
  const jobMap = { '버서커': 'berserker', '소드마스터': 'swordmaster', '섀도우': 'shadow', '마검사': 'battlemage' };

  if (!profile.job) {
    return { text: `⚠️ 아직 전직하지 않은 상태입니다. 먼저 [/전직 [직업명]]을 통해 전직해 주세요.` };
  }

  if (!targetJob) {
    return { text: `⚠️ 변경할 직업명을 입력해 주세요! (예: /전직 변경 버서커, /전직 변경 소드마스터, /전직 변경 섀도우, /전직 변경 마검사)` };
  }

  const jobCode = jobMap[targetJob];
  if (!jobCode) {
    return { text: `⚠️ 올바른 직업명을 입력해 주세요. (버서커, 소드마스터, 섀도우, 마검사)` };
  }

  if (profile.job === jobCode) {
    return { text: `⚠️ 이미 해당 직업(${targetJob})을 보유 중입니다.` };
  }

  const CHANGE_CASH = JOB_CHANGE_CASH;
  const CHANGE_GOLD = JOB_CHANGE_GOLD;
  const CHANGE_GEM = JOB_CHANGE_GEM;

  if (profile.cash < CHANGE_CASH || (profile.gold || 0) < CHANGE_GOLD || (profile.gem || 0) < CHANGE_GEM) {
    return { 
      text: `재화가 부족합니다!\n(전직 변경 필요 비용: 현금 ${won(CHANGE_CASH)}, 금괴 ${CHANGE_GOLD}개, 보석 ${CHANGE_GEM}개)\n(보유: 현금 ${won(profile.cash)}, 금괴 ${(profile.gold || 0).toLocaleString()}개, 보석 ${(profile.gem || 0).toLocaleString()}개)` 
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

  profile.gold -= goldCost;
  profile.jobSkillLevel = currentLevel + 1;

  const jobNames = { berserker: '버서커', swordmaster: '소드마스터', shadow: '섀도우', battlemage: '마검사' };

  return { 
    text: [
      `전직 스킬 승급 성공!`,
      `${jobNames[profile.job]} 스킬 레벨: Lv.${currentLevel} ➔ Lv.${profile.jobSkillLevel}`,
      `(소모: 금괴 ${goldCost.toLocaleString()}개)`,
      getJobInfoText(profile.job, profile.jobSkillLevel),
      ``,
      resourceText(profile)
    ].join('\n')
  };
}

// 통합 /스킬 핸들러 (전직별 스킬 실행)
function processJobSkill(profile, arg) {
  if (!profile.job) {
    return { text: `⚠️ 전직 후에 액티브 스킬을 사용할 수 있습니다. [/전직] 명령어로 전직해 보세요.` };
  }

  if (profile.job === 'shadow') {
    return processShadowBattle(profile, arg);
  } else if (profile.job === 'battlemage') {
    return processMgsDungeon(profile);
  } else if (profile.job === 'berserker') {
    return { text: `🪓 버서커 스킬은 /파밍 및 전투 진행 시 자동 발동되는 패시브 스킬입니다.` };
  } else if (profile.job === 'swordmaster') {
    const todayStr = getKSTDateString();
    const skillLevel = profile.jobSkillLevel || 1;
    const jobNames = { berserker: '버서커', swordmaster: '소드마스터', shadow: '섀도우', battlemage: '마검사' };

    if (profile.lastSmSkillDate !== todayStr) {
      profile.lastSmSkillDate = todayStr;
      if (Math.random() < (skillLevel * 0.01)) {
        const otherJobs = ['berserker', 'shadow', 'battlemage'];
        const chosen = otherJobs[rand(0, otherJobs.length - 1)];
        profile.job = chosen;
        return { text: `⚡ [소드마스터 스킬 발동!] 자정이 지나 최초 /스킬 입력에 따라 직업이 '${jobNames[chosen]}' (으)로 변경되었습니다!` };
      }
    }
    return { text: `⚡ 소드마스터 스킬 상태: 오늘 이미 전직 체크가 완료되었거나 조건에 해당하지 않습니다. (현재 소드마스터 상태이며 내일 자정 이후 변경 기회 부여)` };
  }

  return { text: `⚠️ 사용할 수 있는 스킬이 없습니다.` };
}

function processShadowBattle(profile, betArg) {
  if (profile.job !== 'shadow') {
    return { text: `⚠️ 섀도우 직업만 스킬 약탈을 사용할 수 있습니다.` };
  }

  const sLvl = profile.jobSkillLevel || 1;
  const maxBet = sLvl * 1000000;
  let betAmount = parseInt(betArg, 10);

  if (isNaN(betAmount) || betAmount <= 0) {
    betAmount = maxBet;
  }

  if (betAmount > maxBet) {
    return { text: `⚠️ 현재 스킬 레벨(Lv.${sLvl})에서는 최대 ${won(maxBet)} 까지만 재화를 걸 수 있습니다.` };
  }

  const combatPower = getCombatPower(profile);
  const reqPctAmount = Math.floor(betAmount * (combatPower / 10000));

  if (profile.cash < reqPctAmount) {
    return { text: `⚠️ 전투력에 해당하는 % 금액(${won(reqPctAmount)})이 부족하여 대결 스킬을 사용할 수 없습니다.` };
  }

  const isSuccess = Math.random() < 0.5;
  if (isSuccess) {
    profile.cash += reqPctAmount;
    return {
      text: [
        `🗡️ [섀도우 대결 약탈 성공! (50%)]`,
        `상대와의 대결에서 승리하여 전투력 비율 재화 +${won(reqPctAmount)}을(를) 획득했습니다!`,
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
        `상대와의 대결에서 패배하여 전투력 비율 재화 -${won(reqPctAmount)}을(를) 잃었습니다.`,
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

  const myPower = getCombatPower(profile);
  const enemyPower = Math.floor(myPower * (rand(80, 120) / 100));

  const myDmg = Math.floor(myPower * (rand(90, 110) / 100));
  const enemyDmg = Math.floor(enemyPower * (rand(90, 110) / 100));

  let outcomeMsg = '';
  let isWin = myDmg >= enemyDmg;

  if (isWin) {
    const rewardCash = myPower * 10;
    profile.cash += rewardCash;
    outcomeMsg = `🎉 [대결 승리!]\n나의 피해량: ${myDmg.toLocaleString()} vs 상대 피해량: ${enemyDmg.toLocaleString()}\n보상 획득: 현금 +${won(rewardCash)} (본인 전투력 * 10)`;
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
  const sLvl = playerState.jobSkillLevel || 1;
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

  const validGrades = new Set(["B등급", "B+등급", "A등급", "A+등급", "S등급", "S+등급", "SS등급", "SS+등급", "SSS등급", "EX등급"]);
  const validMonsterPool = monsters.filter(m => validGrades.has(m.grade));

  for (let i = 0; i < targetCount; i++) {
    let monster = getRandomMonsterByProbability(playerState);
    let attempts = 0;
    while ((!monster || !validGrades.has(monster.grade)) && attempts < 100) {
      monster = getRandomMonsterByProbability(playerState);
      attempts++;
    }

    if (!monster || !validGrades.has(monster.grade)) {
      const baseM = validMonsterPool[rand(0, validMonsterPool.length - 1)];
      const rewardMoney = getRewardMoney(baseM.grade);
      const rewardGem = getRewardGem(baseM.grade);
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
  }

  playerState.cash = (playerState.cash || 0) + totalEarnedCash;
  if (totalEarnedGem > 0) {
    playerState.gem = (playerState.gem || 0) + totalEarnedGem;
  }

  const gradeRank = {
    "EX등급": 14, "SSS등급": 13, "SS+등급": 12, "SS등급": 11,
    "S+등급": 10, "S등급": 9, "A+등급": 8, "A등급": 7,
    "B+등급": 6, "B등급": 5
  };

  spawnedMonsters.sort((a, b) => {
    return (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0);
  });

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
  
  let summaryLines = [`💵 총 현금 +${won(totalEarnedCash)}`];
  if (totalEarnedGem > 0) {
    summaryLines.push(`💎 총 보석 : ${totalEarnedGem}개`);
  }

  let headerText = `🔮 [마검 전용 던전 토벌 완료! (${targetCount}마리)] (오늘 사용: ${playerState.mgsDungeonData.count}/${sLvl}회)`;
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
  const MAX_DUNGEON_COUNT = 10 + (Math.max(0, Number(profile.combatLevel) || 0) * 2);

  if (profile.dungeonData.count >= MAX_DUNGEON_COUNT) {
    return { text: `⚠️ 오늘의 던전 입장 횟수를 모두 소모했습니다. (일일 가능 횟수: ${profile.dungeonData.count}/${MAX_DUNGEON_COUNT})` };
  }

  profile.dungeonData.count += 1;

  const roll = Math.random() * 100;
  let targetGrade = "A등급";

  if (roll < 1.0) {
    targetGrade = "S++등급";
  } else if (roll < 1.0 + 2.0) {
    targetGrade = "S+등급";
  } else if (roll < 1.0 + 2.0 + 7.0) {
    targetGrade = "S등급";
  } else if (roll < 1.0 + 2.0 + 7.0 + 10.0) {
    targetGrade = "A++등급";
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

  let rewardMoney = getRewardMoney(targetGrade);
  rewardMoney = Math.floor(rewardMoney * lootMult * 1.5);
  rewardMoney = applyCreatureCashBonus(rewardMoney, profile);

  let rewardGem = getRewardGem(targetGrade);
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
    imageUrl: baseMonster.image || null,
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
        let jobWeaponName = '전직무기';
        if (profile.job === 'shadow') jobWeaponName = '월식의 종언';
        else if (profile.job === 'berserker') jobWeaponName = '울티메이트 버서커 코어';
        else if (profile.job === 'swordmaster') jobWeaponName = '앱솔루트 오비탈';
        else if (profile.job === 'battlemage') jobWeaponName = '태초와 종말의 마검';
        
        lines.push(`🔒 * ${tier.name} * : 해금 조건 : +20 ${jobWeaponName} 달성`);
      }
    }
  });

  const showHelp = checkAndMarkHelp(profile, 'imprint');
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
    let jobWeaponName = '전직무기';
    if (profile.job === 'shadow') jobWeaponName = '월식의 종언';
    else if (profile.job === 'berserker') jobWeaponName = '울티메이트 버서커 코어';
    else if (profile.job === 'swordmaster') jobWeaponName = '앱솔루트 오비탈';
    else if (profile.job === 'battlemage') jobWeaponName = '태초와 종말의 마검';

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
  
  let jobWeaponName = '전직무기';
  if (profile.job === 'shadow') jobWeaponName = '월식의 종언';
  else if (profile.job === 'berserker') jobWeaponName = '울티메이트 버서커 코어';
  else if (profile.job === 'swordmaster') jobWeaponName = '앱솔루트 오비탈';
  else if (profile.job === 'battlemage') jobWeaponName = '태초와 종말의 마검';

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

function processWarehouse(profile) {
  if (!profile.inventory) profile.inventory = [];
  if (profile.inventory.length === 0) {
    return `🎒 [전리품 및 상자 목록]\n현재 보유 중인 전리품이나 상자가 없습니다. 사냥을 통해 전리품과 상자를 획득해 보세요!`;
  }

  const tierOrder = { "T1": 1, "T2": 2, "T3": 3, "T4": 4, "T5": 5, "T6": 6 };

  const grouped = {};
  profile.inventory.forEach(item => {
    const key = `${item.category}_${item.tier || ''}_${item.name}`;
    if (!grouped[key]) {
      grouped[key] = {
        tier: item.tier,
        category: item.category,
        categoryName: item.categoryName,
        name: item.name,
        desc: item.desc,
        count: 0
      };
    }
    grouped[key].count += 1;
  });

  const sortedItems = Object.values(grouped);
  const categoryOrder = { 'box': 0, 'costume': 0, 'hilt': 1, 'guard': 2, 'blade': 3, 'scabbard': 4, 'pommel': 5 };

  sortedItems.sort((a, b) => {
    const catDiff = (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
    if (catDiff !== 0) return catDiff;
    return (tierOrder[a.tier] || 99) - (tierOrder[b.tier] || 99);
  });

  let lines = [`🎒 [전리품 및 상자 목록]`];
  sortedItems.forEach((item, index) => {
    const countStr = item.count > 1 ? ` (${item.count}개)` : '';
    if (item.category === 'box') {
      lines.push(`${index + 1}. [상자] ${item.name}${countStr}`);
    } else if (item.category === 'costume') {
      lines.push(`${index + 1}. [특별] ${item.name}${countStr}`);
    } else {
      let multiplierVal = (tierOrder[item.tier] * 0.10).toFixed(2);
      lines.push(`${index + 1}. [${item.tier}] ${item.name}${countStr}\n배율 x${multiplierVal}`);
    }
  });
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

  let totalEarnedCash = 0;
  let totalEarnedGem = 0;
  let spawnedMonsters = [];
  let droppedLootTexts = [];

  const tierPrices = { "T1": 1000000, "T2": 2000000, "T3": 3000000, "T4": 4000000, "T5": 5000000, "T6": 6000000 };

  for (let i = 0; i < actualHunts; i++) {
    const monster = getRandomMonsterByProbability(playerState);
    if (!monster) continue;

    let earnedCash = Math.floor(monster.rewardMoney * lootMult);
    earnedCash = applyCreatureCashBonus(earnedCash, playerState);

    let earnedGem = monster.rewardGem > 0 ? monster.rewardGem : 0;
    earnedGem = applyCreatureGemBonus(earnedGem, playerState);

    totalEarnedCash += earnedCash;
    totalEarnedGem += earnedGem;

    spawnedMonsters.push(monster);

    let boxDropChance = 0.00001; 
    if (monster.grade.includes("++")) {
      boxDropChance = 0.00010; 
    } else if (monster.grade.includes("+")) {
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
          desc: `${boxData.name}입니다. (/상자 개봉 명령어로 사용)`
        });
        droppedLootTexts.push(`🎁 [상자 획득!] [${boxData.name}]을(를) 획득했습니다! (/상자 개봉 명령어로 사용 가능)`);
      }
    }

    let lootDropChance = 0.001; 
    let isLootDropped = false;
    let targetTier = "";
    const g = monster.grade;

    if (g === "C+등급" && Math.random() < lootDropChance) { targetTier = "T1"; isLootDropped = true; }
    else if (g === "B등급" && Math.random() < lootDropChance) { targetTier = "T2"; isLootDropped = true; }
    else if (g === "B+등급" && Math.random() < lootDropChance) { targetTier = "T3"; isLootDropped = true; }
    else if (g === "A등급" && Math.random() < lootDropChance) { targetTier = "T4"; isLootDropped = true; }
    else if (g === "A+등급" && Math.random() < lootDropChance) { targetTier = "T5"; isLootDropped = true; }
    else if ((g.startsWith("S") || g.startsWith("SS") || g.startsWith("SSS") || g.startsWith("EX")) && Math.random() < lootDropChance) { targetTier = "T6"; isLootDropped = true; }

    if (isLootDropped) {
      const categories = ['hilt', 'guard', 'blade', 'scabbard', 'pommel'];
      const chosenCategory = categories[rand(0, categories.length - 1)];
      const tierList = LOOT_DATABASE[chosenCategory];
      const itemData = tierList.find(i => i.tier === targetTier) || tierList[0];

      const categoryNames = {
        hilt: '자루',
        guard: '코등이',
        blade: '검신',
        scabbard: '검집',
        pommel: '폼멜'
      };
      const catName = categoryNames[chosenCategory];

      if (!playerState.inventory) playerState.inventory = [];
      
      const alreadyHas = playerState.inventory.some(inv => inv.category === chosenCategory && inv.tier === itemData.tier && inv.name === itemData.name);
      if (alreadyHas) {
        let refundAmount = tierPrices[itemData.tier] || 1000000;
        refundAmount = applyCreatureCashBonus(refundAmount, playerState);
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
    "EX++등급": 24, "EX+등급": 23, "EX등급": 22,
    "SSS++등급": 21, "SSS+등급": 20, "SSS등급": 19,
    "SS++등급": 18, "SS+등급": 17, "SS등급": 16,
    "S++등급": 15, "S+등급": 14, "S등급": 13,
    "A++등급": 12, "A+등급": 11, "A등급": 10,
    "B++등급": 9, "B+등급": 8, "B등급": 7,
    "C++등급": 6, "C+등급": 5, "C등급": 4,
    "D++등급": 3, "D+등급": 2, "D등급": 1
  };

  spawnedMonsters.sort((a, b) => {
    return (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0);
  });

  let monsterInfoBlocks = [];
  spawnedMonsters.forEach((m, idx) => {
    let displayGradeHeader = `[${m.grade}] `;
    if (playerState.job === 'battlemage' && m.isPassiveTriggered) {
      displayGradeHeader = `[${m.grade}] ${m.fullName} ⬆️ `;
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

  checkAndResetSeasonPass(playerState);
  if (count >= 2000 && !playerState.seasonPass.dailyHuntExpClaimed) {
    playerState.seasonPass.dailyHuntExpClaimed = true;
    const passMsg = grantPassExp(playerState, 50);
    huntQuestRewardMsgs.push(`🎯 [시즌 패스 미션 달성] 사냥 2000회 달성!\n${passMsg}`);
  }

  let finalRewardLines = [];
  if (huntQuestRewardMsgs.length > 0) {
    finalRewardLines.push(huntQuestRewardMsgs.join('\n'));
  }
  if (droppedLootTexts.length > 0) {
    finalRewardLines.push(droppedLootTexts.join('\n'));
  }

  let monstersJoined = monsterInfoBlocks.join('\n');
  
  let summaryLines = [`💵 총 현금 +${won(totalEarnedCash)}`];
  if (totalEarnedGem > 0) {
    summaryLines.push(`💎 총 보석 : ${totalEarnedGem}개`);
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
  
  // 수정사항 3: /사냥 후 선택지 /파밍 제거하고 /사냥으로 통일
  const choices = HUNT_CHOICES;

  const firstMonster = spawnedMonsters.length > 0 ? spawnedMonsters[0] : null;

  return {
    text,
    choices,
    imageUrl: firstMonster?.image ?? null,
    image: firstMonster?.image ?? null,
    thumbnail: firstMonster?.image ?? null,
    url: firstMonster?.image ?? null,
    monster: firstMonster
  };
}

function processSpeedCommand(profile, arg) {
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
  return { text: `⏩ 배속이 [x${speedVal}](으)로 설정되었습니다! (/파밍 및 /사냥 보상 적용)` };
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

function getRandomMonsterByProbability(profile = null) {
  let randVal = Math.random() * 100;
  let isPassiveTriggered = false;

  if (profile && profile.job === 'battlemage') {
    const sLvl = profile.jobSkillLevel || 1;
    const bonusPct = sLvl * 1;
    randVal = Math.max(0, randVal - bonusPct);
    isPassiveTriggered = true;
  }

  let baseGradeGroup = "D";
  if (randVal < 0.00000001) {
    baseGradeGroup = "EX";
  } else if (randVal < 0.00000001 + 0.00000099) {
    baseGradeGroup = "SSS";
  } else if (randVal < 0.00000001 + 0.00000099 + 0.000099) {
    baseGradeGroup = "SS";
  } else if (randVal < 0.00000001 + 0.00000099 + 0.000099 + 0.0099) {
    baseGradeGroup = "S";
  } else if (randVal < 0.00000001 + 0.00000099 + 0.000099 + 0.0099 + 0.49) {
    baseGradeGroup = "A";
  } else if (randVal < 0.00000001 + 0.00000099 + 0.000099 + 0.0099 + 0.49 + 4.5) {
    baseGradeGroup = "B";
  } else if (randVal < 0.00000001 + 0.00000099 + 0.000099 + 0.0099 + 0.49 + 4.5 + 25.0) {
    baseGradeGroup = "C";
  } else {
    baseGradeGroup = "D";
  }

  let subRoll = Math.random() * 100;
  let selectedGrade = baseGradeGroup + "등급";
  if (subRoll < 1.0) {
    selectedGrade = baseGradeGroup + "++등급";
  } else if (subRoll < 10.0) {
    selectedGrade = baseGradeGroup + "+등급";
  } else {
    selectedGrade = baseGradeGroup + "등급";
  }

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

  const rewardMoney = getRewardMoney(selectedGrade);
  const rewardGem = getRewardGem(selectedGrade);

  return {
    ...baseMonster,
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
    checkAndResetSeasonPass(profile);
    const todayStr = getKSTDateString();
    if (profile.seasonPass.lastAttendanceDate === todayStr) {
      return {
        text: `⚠️ 이미 오늘 출석 체크를 완료하셨습니다.`,
        choices: END_BATTLE_CHOICES,
        state: { profile, battle }
      };
    }

    profile.seasonPass.lastAttendanceDate = todayStr;
    const passMsg = grantPassExp(profile, 20);
    return {
      text: `📅 [출석 체크 완료!]\n오늘의 출석 보상이 지급되었습니다.\n\n${passMsg}`,
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
      `• /파밍 - 파밍 시작 (기존 전투 기능 대체)`,
      `• /강화 - 무기 강화`,
      `• /제련 - 제련 정보 확인`,
      `• /제련 강화 - 무기 제련 시도`,
      `• /연속 강화 [횟수] - 지정 횟수만큼 연속 강화`,
      `• /증폭 - 증폭 정보 확인`,
      `• /증폭 강화 [수량] - 금괴로 전투력 증폭 강화`,
      `• /배속 [1~10] - 증폭 레벨 제한 내에서 보상 배속 설정`,
      `• /금고 - 금고 정보 확인 및 입/출금/구매/레벨업`,
      `• /열쇠 [수량] - 비밀열쇠를 지정한 수량만큼 연속 사용`,
      `• /상자 - 보유 상자 확인 및 개봉 (/상자 개봉 [상자번호] [수량])`,
      `• /보급 [수량] - 보급 재화를 사용해 칭호 및 재화 획득`,
      `• /칭호 - 칭호 정보 및 보유 목록 확인`,
      `• /칭호 장착 [숫자] - 보유한 칭호 장착`,
      `• /아바타 - 아바타 정보 및 보유 목록 확인`,
      `• /아바타 장착 [숫자] - 보유한 아바타 장착`,
      `• /크리처 - 현재 크리처 정보 및 등급 확인`,
      `• /전직 [직업명] - 전직 안내 및 직업 전직`,
      `• /스킬 - 액티브 스킬 사용 (섀도우: /스킬 [금액], 마검사: /스킬)`,
      `• /대결 - 1대1 대결 (승리 시 본인 전투력*10 금액 수령, 일 10회)`,
      `• /던전 - 전 직업 입장 가능 던전 (일 10회)`,
      `• /각인 - 각인 정보 확인`,
      `• /각인 해금 [1~5] - 조건 만족 시 해당 슬롯 해금`,
      `• /각인 잠금 [1~5] - 해당 슬롯 옵션 잠금`,
      `• /각인 해제 [1~5] - 잠긴 슬롯 해제`,
      `• /각인 변경 - 각인 변경`,
      `• /전리품 - 획득한 전리품 확인`,
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
  } else if (command === '/연속' && arg.startsWith('강화')) {
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
    {
    checkAndResetFarmLimit(profile);
    const maxFarmLimit = profile.farmData ? profile.farmData.max : 200;
    if (profile.farmData.count >= maxFarmLimit) {
      return {
        text: `⚠️ 오늘의 파밍 가능 횟수를 모두 소모했습니다. (일일 가능 횟수: ${profile.farmData.count}/${maxFarmLimit})`,
        choices: END_BATTLE_CHOICES,
        state: { profile, battle }
      };
    }

    if (!battle || !battle.alive || battle.finished) battle = createBattle(profile);
    battle.turn += 1;
    profile.farmData.count += 1;

    const fightResult = resolveProgressionFarmTurn(profile, battle);
    const isLastTurn = battle.turn >= battle.maxTurn;
    const hasEnded = !battle.alive || isLastTurn;
    const displayMsgs = [fightResult.text];

    if (hasEnded) {
      battle.finished = true;
      profile.cash += battle.accumulatedCash || 0;
      profile.gold = (profile.gold || 0) + (battle.accumulatedGold || 0);
      profile.gem = (profile.gem || 0) + (battle.accumulatedGem || 0);
      profile.keys = (profile.keys || 0) + (battle.accumulatedKeys || 0);
      profile.supplyItem = (profile.supplyItem || 0) + (battle.accumulatedSupplyItem || 0);

      if (battle.accumulatedExp > 0) {
        const expResult = addExp(profile, battle.accumulatedExp);
        if (expResult.msg) displayMsgs.push(expResult.msg);
      }

      if (isLastTurn) {
        const highestGrade = FARM_GRADE_STEPS[Math.min(battle.highestGradeIndex || 0, FARM_GRADE_STEPS.length - 1)];
        const boxKey = getFarmBoxKey(highestGrade);
        const boxName = addBoxToInventory(profile, boxKey);
        displayMsgs.push(`🎁 [5턴 파밍 완료!] 최고 처치 등급: ${highestGrade}\n보상 상자: ${boxName} 1개를 획득했습니다. (/상자에서 개봉 가능)`);
      } else {
        displayMsgs.push(`☠️ [파밍 종료] HP가 모두 소진되어 파밍이 종료되었습니다.`);
      }

      displayMsgs.push(
        `• 획득 현금 : +${won(battle.accumulatedCash || 0)}`,
        `• 획득 금괴 : +${(battle.accumulatedGold || 0).toLocaleString()}개`,
        `• 획득 보석 : +${(battle.accumulatedGem || 0).toLocaleString()}개`,
        `• 획득 비밀열쇠 : +${(battle.accumulatedKeys || 0).toLocaleString()}개`,
        `• 획득 보급 : +${(battle.accumulatedSupplyItem || 0).toLocaleString()}개`
      );
    }

    return {
      text: [displayMsgs.join('\n\n'), '', battleStatusBoard(profile, battle)].join('\n'),
      imageUrl: fightResult.imageUrl,
      choices: hasEnded ? END_BATTLE_CHOICES : BATTLE_CHOICES,
      category: 'farm',
      state: { profile, battle }
    };
    }

    checkAndResetFarmLimit(profile);
    const maxFarmLimit = profile.farmData ? profile.farmData.max : 200;

    if (profile.farmData.count >= maxFarmLimit) {
      return {
        text: `⚠️ 오늘의 파밍 가능 횟수를 모두 소모했습니다. (일일 가능 횟수: ${profile.farmData.count}/${maxFarmLimit})`,
        choices: END_BATTLE_CHOICES,
        state: { profile, battle }
      };
    }

    if (!battle || !battle.alive || battle.finished) {
      battle = createBattle(profile);
    }

    battle.turn += 1;
    profile.farmData.count += 1;

    const buffMsgs = processBuffs(battle);
    const fightResult = resolveFarmFight(profile, battle);

    applyZoneAttrition(battle);

    let displayMsgs = [];
    if (buffMsgs.length > 0) displayMsgs.push(buffMsgs.join('\n'));
    if (fightResult.text) displayMsgs.push(fightResult.text);

    let currentChoices = BATTLE_CHOICES;

    if (!battle.alive || battle.turn >= battle.maxTurn || battle.survivors <= 1) {
      battle.finished = true;
      currentChoices = END_BATTLE_CHOICES;

      let finalRankText = "🏆 [생존] ";
      if (!battle.alive) {
        finalRankText = "☠️ [사망] ";
      }

      displayMsgs.push(
        ``,
        finalRankText,
        `• 획득 현금 : +${won(battle.accumulatedCash)}`,
        `• 획득 금괴 : +${(battle.accumulatedGold || 0).toLocaleString()}개`,
        `• 획득 보석 : +${(battle.accumulatedGem || 0).toLocaleString()}개`,
        `• 획득 비밀열쇠 : +${(battle.accumulatedKeys || 0).toLocaleString()}개`,
        `• 획득 보급 : +${(battle.accumulatedSupplyItem || 0).toLocaleString()}개`
      );

      profile.cash += battle.accumulatedCash;
      profile.gold = (profile.gold || 0) + (battle.accumulatedGold || 0);
      profile.gem = (profile.gem || 0) + (battle.accumulatedGem || 0);
      profile.keys = (profile.keys || 0) + (battle.accumulatedKeys || 0);
      profile.supplyItem = (profile.supplyItem || 0) + (battle.accumulatedSupplyItem || 0);

      if (battle.accumulatedExp > 0) {
        const expResult = addExp(profile, battle.accumulatedExp);
        if (expResult.msg) displayMsgs.push(expResult.msg);
      }
    }

    const board = battleStatusBoard(profile, battle);
    const fullText = [displayMsgs.join('\n\n'), '', board].join('\n');

    return {
      text: fullText,
      imageUrl: fightResult.imageUrl,
      choices: currentChoices,
      category: 'farm',
      state: { profile, battle }
    };
  }

  // 삭제된 구형 회피 처리(현재 명령어 경로에서는 호출되지 않음)
  if (false) {
    if (!battle || !battle.alive || battle.finished) {
      return {
        text: `⚠️ 현재 진행 중인 전투가 없습니다. [/파밍]으로 전투를 시작하세요.`,
        choices: END_BATTLE_CHOICES,
        state: { profile, battle }
      };
    }

    battle.turn += 1;
    battle.escapeCount = (battle.escapeCount || 0) + 1;

    const buffMsgs = processBuffs(battle);
    const escapeResult = resolveEscapeEvent(profile, battle);

    applyZoneAttrition(battle);

    let displayMsgs = [];
    if (buffMsgs.length > 0) displayMsgs.push(buffMsgs.join('\n'));
    if (escapeResult.text) displayMsgs.push(escapeResult.text);

    let currentChoices = BATTLE_CHOICES;

    if (battle.turn >= battle.maxTurn || battle.survivors <= 1) {
      battle.finished = true;
      currentChoices = END_BATTLE_CHOICES;

      displayMsgs.push(
        ``,
        `🏆 [생존] `,
        `• 획득 현금 : +${won(battle.accumulatedCash)}`,
        `• 획득 금괴 : +${(battle.accumulatedGold || 0).toLocaleString()}개`,
        `• 획득 보석 : +${(battle.accumulatedGem || 0).toLocaleString()}개`,
        `• 획득 비밀열쇠 : +${(battle.accumulatedKeys || 0).toLocaleString()}개`,
        `• 획득 보급 : +${(battle.accumulatedSupplyItem || 0).toLocaleString()}개`
      );

      profile.cash += battle.accumulatedCash;
      profile.gold = (profile.gold || 0) + (battle.accumulatedGold || 0);
      profile.gem = (profile.gem || 0) + (battle.accumulatedGem || 0);
      profile.keys = (profile.keys || 0) + (battle.accumulatedKeys || 0);
      profile.supplyItem = (profile.supplyItem || 0) + (battle.accumulatedSupplyItem || 0);

      if (battle.accumulatedExp > 0) {
        const expResult = addExp(profile, battle.accumulatedExp);
        if (expResult.msg) displayMsgs.push(expResult.msg);
      }
    }

    const board = battleStatusBoard(profile, battle);
    const fullText = [displayMsgs.join('\n\n'), '', board].join('\n');

    return {
      text: fullText,
      imageUrl: null,
      choices: currentChoices,
      category: 'escape',
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
  if (command === '/연속 강화' || command === '/연속강화') {
    let count = parseInt(arg, 10);
    if (isNaN(count) || count < 1) count = 10;

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
        choices: END_BATTLE_CHOICES,
        category: 'titleEquip',
        state: { profile, battle }
      };
    }

    const tInfo = processTitleInfo(profile);
    return {
      text: tInfo.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
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
        choices: END_BATTLE_CHOICES,
        category: 'avatarEquip',
        state: { profile, battle }
      };
    }

    const avatarInfo = processAvatarInfo(profile);
    return {
      text: avatarInfo.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
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
      imageUrl: null,
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
    const jUpgrade = processUpgradeJobSkill(profile);
    return {
      text: jUpgrade.text,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'jobSkillUpgrade',
      state: { profile, battle }
    };
  }

  // 19. /스킬 명령어
  if (command === '/스킬') {
    const sResult = processJobSkill(profile, arg);
    return {
      text: sResult.text,
      imageUrl: sResult.imageUrl || null,
      choices: sResult.choices || END_BATTLE_CHOICES,
      category: 'skill',
      state: { profile, battle }
    };
  }

  // 20. /대결 명령어
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
    const wText = processWarehouse(profile);
    return {
      text: wText,
      imageUrl: null,
      choices: END_BATTLE_CHOICES,
      category: 'warehouse',
      state: { profile, battle }
    };
  }

  // 28. /프로필 명령어
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
      state: { profile, battle }
    };
  }

  // 30. /배속 명령어
  if (command === '/배속') {
    const spResult = processSpeedCommand(profile, arg);
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
    startGame,
    processTurn,
    createProfile,
    createBattle,
    profileText,
    resourceText
  };
}

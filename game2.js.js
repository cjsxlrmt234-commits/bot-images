// game.js - 통합 배틀로얄 및 사냥 시스템 게임 로직

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

// 등급별 몬스터 필터링 함수
function getMonstersByGrade(grade) {
  return monsters.filter(m => m.grade === grade);
}

// 확률 기반 랜덤 몬스터 선택 함수
function getRandomMonsterByProbability() {
  const rand = Math.random() * 100;
  let selectedGrade = "D등급";

  if (rand < 0.01) {
    selectedGrade = "S등급"; // 0.01%
  } else if (rand < 0.01 + 0.49) {
    selectedGrade = "A등급"; // 0.49%
  } else if (rand < 0.5 + 4.5) {
    selectedGrade = "B등급"; // 4.5%
  } else if (rand < 5.0 + 25) {
    selectedGrade = "C등급"; // 25%
  } else {
    selectedGrade = "D등급"; // 70%
  }

  const targetMonsters = getMonstersByGrade(selectedGrade);
  if (targetMonsters.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * targetMonsters.length);
  const baseMonster = targetMonsters[randomIndex];

  // 접두사 랜덤 부착 로직
  const gradePrefixes = prefixes[selectedGrade];
  let prefix = "";
  if (gradePrefixes && gradePrefixes.length > 0) {
    prefix = gradePrefixes[Math.floor(Math.random() * gradePrefixes.length)];
  }

  return {
    ...baseMonster,
    prefix: prefix,
    fullName: prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name
  };
}

// 사냥 실행 핵심 함수 (게임 로직 연동)
function processHunt(player) {
  const monster = getRandomMonsterByProbability();
  if (!monster) {
    return { success: false, message: "사냥감을 찾지 못했습니다." };
  }

  // 예시 전투 처리 및 보상 산정 로직
  return {
    success: true,
    monster: monster,
    message: `[사냥 발견] ${monster.grade} 몬스터 등장!\n이름: ${monster.fullName}\n설명: ${monster.description}`
  };
}

module.exports = {
  prefixes,
  monsters,
  getMonstersByGrade,
  getRandomMonsterByProbability,
  processHunt
};
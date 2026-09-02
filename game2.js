// game.js - 대문자 이미지 파일명 매핑이 적용된 통합 게임 파일

const prefixes = {
  "D등급": ["초보", "약한", "지저분한", "배고픈", "겁먹은"],
  "C등급": ["단단한", "날쌘", "거친", "사나운", "독이 묻은"],
  "B등급": ["거대한", "흉포한", "타락한", "어둠의", "철갑"],
  "A등급": ["광폭한", "고대의", "지옥의", "군주", "수호자"],
  "S등급": ["파멸의", "절망의", "신들의", "혼돈의", "태초의"]
};

const monsters = [
  // D등급 (하급 몬스터) - 대문자 이미지 매핑
  { name: "먼지 정령", grade: "D등급", description: "버려진 공간에서 자생하는 약한 마력의 작은 먼지 덩어리.", image: "/images/D_1.png" },
  { name: "이슬 슬라임", grade: "D등급", description: "숲속의 맑은 물웅덩이에서 발견되는 투명하고 해가 없는 물컹한 생명체.", image: "/images/D_2.png" },
  { name: "들쥐 포식자", grade: "D등급", description: "곡식 창고나 들판을 배회하며 농작물을 훔쳐 먹는 덩치 큰 일반 쥐.", image: "/images/D_3.png" },
  { name: "삐쭉이 묘목", grade: "D등급", description: "마력에 의해 이동 능력을 얻었으나 공격력은 거의 없는 새싹 괴물.", image: "/images/D_4.png" },
  { name: "청동 부스러기 곤충", grade: "D등급", description: "금속 파편을 갉아먹고 사는 장난감 크기의 기계성 곤충.", image: "/images/D_5.png" },
  { name: "좀비 거머리", grade: "D등급", description: "축축한 동굴 바닥에 서식하며 다가오는 생물의 피부에 붙는 흡혈 괴물.", image: "/images/D_6.png" },
  { name: "약초 도둑 토끼", grade: "D등급", description: "마력초의 냄새를 쫓아 모여드는 성가신 이빨의 야생 토끼.", image: "/images/D_7.png" },
  { name: "푸른 파편 박쥐", grade: "D등급", description: "지하 초입에서 서식하며 초음파로 길을 찾는 소형 박쥐.", image: "/images/D_8.png" },
  { name: "이끼 거북이", grade: "D등급", description: "등딱지에 두꺼운 이끼가 자라나 풀숲과 구분이 안 되는 소형 파충류.", image: "/images/D_9.png" },
  { name: "썩은 짚인형", grade: "D등급", description: "폐가나 마법사의 공방 버려진 구석에서 움직이기 시작한 인형.", image: "/images/D_10.png" },

  // C등급 (일반/위협 몬스터)
  { name: "들쇠 토끼", grade: "C등급", description: "튼튼한 뒷발로 강력한 돌려차기를 구사하는 전투용 거대 토끼.", image: "/images/C_1.png" },
  { name: "돌멩이 골렘", grade: "C등급", description: "하급 마석의 힘으로 움직이는 거친 바위 조각들의 집합체.", image: "/images/C_2.png" },
  { name: "독니 독사", grade: "C등급", description: "늪지대에 서식하며 물리면 마비 효과를 일으키는 초급 독사.", image: "/images/C_3.png" },
  { name: "그림자 늑대", grade: "C등급", description: "어두운 숲에서 무리를 지어 사냥하며 야간에 은신 능력이 뛰어난 맹수.", image: "/images/C_4.png" },
  { name: "고블린 투창병", grade: "C등급", description: "날카로운 뼈 창을 원거리에서 던져 사냥감을 괴롭히는 소형 휴머노이드.", image: "/images/C_5.png" },
  { name: "가시멧돼지", grade: "C등급", description: "온몸이 단단한 강철 가시로 덮여 있어 돌진 공격이 특기인 야수.", image: "/images/C_6.png" },
  { name: "부서진 해골 병사", grade: "C등급", description: "고대 전장의 잔해에서 마력에 의해 되살아난 하급 언데드 전사.", image: "/images/C_7.png" },
  { name: "하급 샐러맨더", grade: "C등급", description: "불길이 약하게 감싸고 있는 도마뱀 형태로, 뜨거운 열기를 뿜어냄.", image: "/images/C_8.png" },
  { name: "맹독 벌레떼", grade: "C등급", description: "떼 지어 날아다니며 상대의 시야를 가리고 피부를 갉아먹는 곤충형 몬스터.", image: "/images/C_9.png" },
  { name: "늪지 요괴", grade: "C등급", description: "이끼와 진흙으로 위장하여 지나가는 나그네를 물속으로 끌어들이는 괴물.", image: "/images/C_10.png" },

  // B등급 (상급/정예 몬스터)
  { name: "철갑 오크 장교", grade: "B등급", description: "두꺼운 철판 갑옷을 두르고 거대한 철퇴를 휘두르는 오크 지휘관.", image: "/images/B_1.png" },
  { name: "서리 하피", grade: "B등급", description: "매서운 얼음 바람을 일으키며 높은 고도에서 급강하해 발톱으로 공격하는 괴물.", image: "/images/B_2.png" },
  { name: "그림자 암살자", grade: "B등급", description: "빛을 흡수하는 은신 스킬을 사용해 단숨에 급소를 노리는 인간형 유령.", image: "/images/B_3.png" },
  { name: "화염 사냥개", grade: "B등급", description: "지옥의 불길을 입은 채 맹렬하게 달리는 머리 두 개 달린 마수.", image: "/images/B_4.png" },
  { name: "바위 거인", grade: "B등급", description: "산비탈의 돌무더기가 뭉쳐서 만들어진 거대한 체구의 골렘.", image: "/images/B_5.png" },
  { name: "사이렌", grade: "B등급", description: "매혹적인 노랫소리로 항해사나 모험가의 정신을 빼놓고 물속으로 유인하는 정령.", image: "/images/B_6.png" },
  { name: "맹독 아라크네", grade: "B등급", description: "온몸에서 강한 산성 독을 뿜어내며 벽과 천장을 자유롭게 기어 다니는 거미 괴물.", image: "/images/B_7.png" },
  { name: "유령 기사", grade: "B등급", description: "찢어진 깃발을 들고 밤마다 옛 전장을 순찰하는 저주받은 기사 망령.", image: "/images/B_8.png" },
  { name: "라이트닝 드레이크", grade: "B등급", description: "번개를 뿜어내기 시작하는 어린 단계의 용족 괴물.", image: "/images/B_9.png" },
  { name: "피의 구울", grade: "B등급", description: "시체를 탐닉하며 인간의 이성을 잃고 육식 본능만 남은 흉포한 언데드.", image: "/images/B_10.png" },

  // A등급 (최상급/보스 몬스터)
  { name: "심연의 리치", grade: "A등급", description: "금지된 흑마술을 극도로 연마해 영혼의 힘으로 언데드 군단을 지휘하는 마법사.", image: "/images/A_1.png" },
  { name: "서리 거룡", grade: "A등급", description: "입김만으로 주변 반경 수 킬로미터를 순식간에 얼어붙게 만드는 성숙한 용족.", image: "/images/A_2.png" },
  { name: "지옥불 미노타우로스", grade: "A등급", description: "몸 전체가 용암처럼 이글거리는 도끼를 휘두르는 미궁의 지배자.", image: "/images/A_3.png" },
  { name: "고대 뱀파이어 백작", grade: "A등급", description: "수백 년 동안 인간의 피를 흡수해 절대적인 속도와 최면 능력을 지닌 흡혈귀.", image: "/images/A_4.png" },
  { name: "폭풍의 정령왕", grade: "A등급", description: "하늘에서 거대한 번개와 폭풍을 자유자재로 불러일으키는 재앙급 정령.", image: "/images/A_5.png" },
  { name: "철혈의 와이번 킹", grade: "A등급", description: "수많은 와이번 무리를 이끄는 우두머리로, 강철 같은 비늘을 지님.", image: "/images/A_6.png" },
  { name: "타락한 성기사 멜키르", grade: "A등급", description: "신성력을 잃고 어둠의 계약에 물들어 거대한 대검을 휘두르는 타락한 영웅.", image: "/images/A_7.png" },
  { name: "거대 심해 크라켄", grade: "A등급", description: "바다 한가운데서 배를 통째로 집어삼키는 다리의 촉수를 가진 거대 수중 괴물.", image: "/images/A_8.png" },
  { name: "혼돈의 나무", grade: "A등급", description: "숲 전체를 독성 안개로 물들이고 뿌리로 적을 포박하는 거대한 고대 식물.", image: "/images/A_9.png" },
  { name: "공허의 마녀", grade: "A등급", description: "차원의 틈새를 열어 시공간을 왜곡하는 저주 마법을 구사하는 최상급 마법사.", image: "/images/A_10.png" },

  // S등급 (재앙급/초월적 존재)
  { name: "공허의 군주", grade: "S등급", description: "차원과 현실의 경계를 완전히 무너뜨리고 세계를 흡수하려는 외신(外神)적 존재", image: "/images/S_1.png" }
];

const gradeRewards = {
  "D등급": { min: 10000, max: 50000 },
  "C등급": { min: 50000, max: 100000 },
  "B등급": { min: 100000, max: 200000 },
  "A등급": { min: 300000, max: 500000 },
  "S등급": { min: 500000, max: 5000000 }
};

function getRewardMoney(grade) {
  const range = gradeRewards[grade] || { min: 10000, max: 50000 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function getMonstersByGrade(grade) {
  return monsters.filter(m => m.grade === grade);
}

function getRandomMonsterByProbability() {
  const rand = Math.random() * 100;
  let selectedGrade = "D등급";

  if (rand < 0.01) {
    selectedGrade = "S등급";
  } else if (rand < 0.01 + 0.49) {
    selectedGrade = "A등급";
  } else if (rand < 0.5 + 4.5) {
    selectedGrade = "B등급";
  } else if (rand < 5.0 + 25) {
    selectedGrade = "C등급";
  } else {
    selectedGrade = "D등급";
  }

  const targetMonsters = getMonstersByGrade(selectedGrade);
  if (targetMonsters.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * targetMonsters.length);
  const baseMonster = targetMonsters[randomIndex];

  const gradePrefixes = prefixes[selectedGrade];
  let prefix = "";
  if (gradePrefixes && gradePrefixes.length > 0) {
    prefix = gradePrefixes[Math.floor(Math.random() * gradePrefixes.length)];
  }

  const rewardMoney = getRewardMoney(selectedGrade);

  return {
    ...baseMonster,
    prefix: prefix,
    fullName: prefix ? `${prefix} ${baseMonster.name}` : baseMonster.name,
    rewardMoney: rewardMoney,
    formattedReward: rewardMoney.toLocaleString() + "원"
  };
}

function checkAndResetHuntLimit(playerState) {
  const todayStr = new Date().toISOString().slice(0, 10);

  if (!playerState.huntData || playerState.huntData.date !== todayStr) {
    playerState.huntData = {
      date: todayStr,
      count: 0
    };
  }
}

function processHunt(playerState) {
  if (!playerState.huntData) {
    playerState.huntData = { date: "", count: 0 };
  }

  checkAndResetHuntLimit(playerState);

  const MAX_HUNT_COUNT = 1000;

  if (playerState.huntData.count >= MAX_HUNT_COUNT) {
    return {
      text: `[사냥 불가]\n오늘 사냥 가능 횟수를 모두 소모했습니다.\n내일 자정(00:00) 이후에 다시 도전해주세요!\n(현재 횟수: (${playerState.huntData.count}/${MAX_HUNT_COUNT}))`,
      choices: [{ label: "메인으로", value: "메인" }],
      imageUrl: null
    };
  }

  const monster = getRandomMonsterByProbability();
  if (!monster) {
    return {
      text: `사냥감을 찾지 못했습니다.\n(현재 횟수: (${playerState.huntData.count}/${MAX_HUNT_COUNT}))`,
      choices: [
        { label: "계속 사냥하기", value: "사냥" },
        { label: "메인으로", value: "메인" }
      ],
      imageUrl: null
    };
  }

  playerState.huntData.count += 1;

  const text = `[사냥 발견!] (${monster.grade})\n이름: ${monster.fullName}\n설명: ${monster.description}\n\n획득 보상: ${monster.formattedReward}\n오늘 사냥 횟수: (${playerState.huntData.count}/${MAX_HUNT_COUNT})`;
  
  const choices = [
    { label: "계속 사냥하기", value: "사냥" },
    { label: "메인으로", value: "메인" }
  ];

  return {
    text,
    choices,
    imageUrl: monster.image,
    monster
  };
}

function startGame(existingState = {}) {
  return {
    state: { ...existingState, finished: false },
    text: "배틀로얄 및 사냥 게임에 오신 것을 환영합니다! 아래 메뉴를 선택하거나 '사냥'을 입력해 사냥을 시작하세요.",
    choices: [
      { label: "사냥하기", value: "사냥" },
      { label: "다시하기", value: "다시하기" }
    ],
    category: "main",
    imageUrl: null
  };
}

function processTurn(state, utterance) {
  if (utterance === "사냥" || utterance === "!사냥" || utterance === "사냥하기") {
    const huntResult = processHunt(state);
    return {
      text: huntResult.text,
      choices: huntResult.choices,
      category: "hunt",
      imageUrl: huntResult.imageUrl
    };
  }

  return {
    text: `입력하신 명령: ${utterance}`,
    choices: [
      { label: "사냥하기", value: "사냥" },
      { label: "메인으로", value: "메인" }
    ],
    category: "default",
    imageUrl: null
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
  processTurn
};

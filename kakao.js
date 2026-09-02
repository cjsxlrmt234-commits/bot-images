// kakao.js
// 카카오 i 오픈빌더 스킬 응답 포맷 헬퍼 및 game2.js 연동

const game2 = require('./game2.js');

// 유저들의 게임 상태를 임시로 저장하는 메모리 저장소 (서버 재시작 시 초기화됨. DB 연동 전까지 테스트용)
const userStates = {};

function buildResponse(text, choices = [], imageUrl = null) {
  const outputs = [];

  // 1. [멘트] 본문 텍스트 출력
  outputs.push({ simpleText: { text } });

  // 2. [사진] 이미지가 존재할 경우 출력 (카카오 오픈빌더 규격)
  if (imageUrl) {
    outputs.push({ 
      simpleImage: { 
        imageUrl: imageUrl, 
        altText: "몬스터 이미지" 
      } 
    });
  }

  // 3. [메뉴 선택창] 선택지(choices)가 존재할 경우 리스트 카드 추가
  if (choices && choices.length > 0) {
    outputs.push({
      listCard: {
        header: {
          title: "메뉴 선택"
        },
        items: choices.map((c) => ({
          title: c.label,
          description: c.description || "", 
          action: "message",
          messageText: c.value || c.label,
        })),
      },
    });
  }

  return {
    version: '2.0',
    template: {
      outputs,
    },
  };
}

// 오픈빌더가 보내는 요청에서 사용자 id / 발화 텍스트를 추출
function parseSkillRequest(body) {
  const userId = body?.userRequest?.user?.id || 'unknown-user';
  // 카카오톡은 문장 뒤에 공백이나 보이지 않는 개행 문자가 붙을 수 있으므로 .trim() 필수
  const utterance = (body?.userRequest?.utterance || '').trim();
  return { userId, utterance };
}

// 카카오톡 발화를 받아 game2.js와 연동하여 응답 빌드
function handleGameRequest(body) {
  const { userId, utterance } = parseSkillRequest(body);

  // 유저별 게임 상태가 없으면 초기화
  if (!userStates[userId]) {
    userStates[userId] = {};
  }

  // 슬래시(/)가 붙거나 안 붙거나 모두 대응하도록 처리
  // (예: "/사냥", "사냥", "사냥하기" 모두 캐치)
  let cleanUtterance = utterance;

  // game2.js의 processTurn 함수를 호출해 게임 결과(텍스트, 선택지, 이미지)를 받아옴
  const gameResult = game2.processTurn(userStates[userId], cleanUtterance);

  // game2.js가 돌려준 이미지 필드(imageUrl 또는 image 등)를 안전하게 추출
  const imageUrl = gameResult.imageUrl || gameResult.image || null;

  // 카카오톡 응답 포맷으로 변환하여 반환
  return buildResponse(gameResult.text, gameResult.choices, imageUrl);
}

module.exports = { 
  buildResponse, 
  parseSkillRequest, 
  handleGameRequest 
};

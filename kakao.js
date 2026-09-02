// kakao.js
// 카카오 i 오픈빌더 스킬 응답 포맷 헬퍼 (리스트 카드 세로 정렬 지원)

function buildResponse(text, choices = [], imageUrl = null) {
  const outputs = [];

  // 1. [멘트] 본문 텍스트를 가장 먼저 출력
  outputs.push({ simpleText: { text } });

  // 2. [사진] 이미지가 존재할 경우 두 번째로 출력
  if (imageUrl) {
    outputs.push({ simpleImage: { imageUrl, altText: text.slice(0, 60) } });
  }

  // 3. [메뉴 선택창] choices(선택지)가 존재할 경우 세로로 나열되는 리스트 카드를 추가합니다.
  if (choices && choices.length > 0) {
    outputs.push({
      listCard: {
        header: {
          title: "메뉴 선택"
        },
        items: choices.map((c) => ({
          title: c.label,
          description: c.description || "", // 설명이 없으면 빈 값
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

// 오픈빌더가 보내는 요청에서 사용자 id / 발화 텍스트를 꺼낸다
function parseSkillRequest(body) {
  const userId = body?.userRequest?.user?.id || 'unknown-user';
  const utterance = (body?.userRequest?.utterance || '').trim();
  return { userId, utterance };
}

module.exports = { buildResponse, parseSkillRequest };

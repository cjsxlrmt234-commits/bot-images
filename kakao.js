// 카카오 스킬 응답 헬퍼. 명령 전송값은 표시 이름보다 action을 우선한다.
function buildResponse(text, choices = [], imageUrl = null) {
  const message = typeof text === 'string' && text.trim() ? text : '처리가 완료되었습니다.';
  const outputs = [{ simpleText: { text: message } }];
  if (typeof imageUrl === 'string' && /^https?:\/\/\S+$/i.test(imageUrl)) {
    outputs.push({ simpleImage: { imageUrl, altText: '게임 이미지' } });
  }
  const items = (Array.isArray(choices) ? choices : []).filter(c => c && typeof c.label === 'string' && c.label.trim()).map(c => {
    const command = [c.action, c.value, c.messageText, c.label].find(v => typeof v === 'string' && v.trim() && v !== 'message' && v !== 'block');
    const item = { title: c.label, action: 'message', messageText: command || c.label };
    if (typeof c.description === 'string' && c.description.trim()) item.description = c.description;
    return item;
  });
  if (items.length) outputs.push({ listCard: { header: { title: '메뉴 선택' }, items: items.slice(0, 5) } });
  const template = { outputs };
  // 리스트 카드 제한을 넘는 선택지는 바로가기 응답으로 제공한다.
  if (items.length > 5) template.quickReplies = items.slice(5, 15).map(i => ({ label: i.title, action: 'message', messageText: i.messageText }));
  return { version: '2.0', template };
}

function parseSkillRequest(body) {
  const id = body?.userRequest?.user?.id;
  const text = body?.userRequest?.utterance;
  // 식별자 없는 요청을 공용 unknown-user 계정에 저장하지 않는다.
  return { userId: typeof id === 'string' ? id.trim() : '', utterance: typeof text === 'string' ? text.trim() : '' };
}

module.exports = { buildResponse, parseSkillRequest };

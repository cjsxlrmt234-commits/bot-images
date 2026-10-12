// Kakao: at most 1,000 characters per simpleText and three output bubbles.
function splitText(text){
 let rest=typeof text==='string'&&text.trim()?text:'처리가 완료되었습니다.';const parts=[];
 while(rest.length>900){let end=rest.lastIndexOf('\n',900);if(end<450)end=900;if(/[\uD800-\uDBFF]/.test(rest[end-1]))end--;parts.push(rest.slice(0,end));rest=rest.slice(end);if(rest.startsWith('\n'))rest=rest.slice(1);}
 if(rest)parts.push(rest);return parts;
}
function buildResponsePages(text,choices=[],imageUrl=null,pageId=''){
 const image=typeof imageUrl==='string'&&/^https?:\/\/\S+$/i.test(imageUrl)?imageUrl:null;
 const chunks=splitText(text),size=image?2:3,pages=[],total=Math.ceil(chunks.length/size);
 const items=(Array.isArray(choices)?choices:[]).filter(c=>c&&typeof c.label==='string'&&c.label.trim()).map(c=>({title:Array.from(c.label).slice(0,20).join(''),action:'message',messageText:([c.action,c.value,c.messageText,c.label].find(v=>typeof v==='string'&&v.trim()&&!['message','block'].includes(v))||c.label).slice(0,1000)}));
 for(let page=0;page<total;page++){
  const outputs=chunks.slice(page*size,(page+1)*size).map(t=>({simpleText:{text:t}})),quick=[];
  if(total>1){const next=page+1<total?`/결과 ${pageId} ${page+2}`:'';outputs.at(-1).simpleText.text+=`\n\n📄 ${page+1}/${total}페이지`+(next?` · 다음 : ${next}`:'');if(next)quick.push({label:'다음 결과',action:'message',messageText:next});}
  if(image)outputs.push({simpleImage:{imageUrl:image,altText:'게임 이미지'}});
  if(items.length&&outputs.length<3){outputs.push({listCard:{header:{title:'메뉴 선택'},items:items.slice(0,5)}});quick.push(...items.slice(5,15).map(i=>({label:i.title,action:'message',messageText:i.messageText})));}
  else quick.push(...items.slice(0,10).map(i=>({label:i.title,action:'message',messageText:i.messageText})));
  const template={outputs};if(quick.length)template.quickReplies=quick.slice(0,10);pages.push({version:'2.0',template});
 }
 return pages;
}
function buildResponse(text,choices=[],imageUrl=null){return buildResponsePages(text,choices,imageUrl)[0];}
function parseSkillRequest(body){const id=body?.userRequest?.user?.id,text=body?.userRequest?.utterance;return {userId:typeof id==='string'?id.trim():'',utterance:typeof text==='string'?text.trim():''};}
module.exports={buildResponse,buildResponsePages,parseSkillRequest,splitText};

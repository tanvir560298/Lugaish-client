import {htmlVideos} from '../learn/htmlContent.js';
import {cVideos} from '../learn/cContent.js';
export function sessionRoute(lesson) {
  if(lesson.course==='web-development-html') {
    const video=htmlVideos.find(v=>v.id===lesson.id);
    if(!video)throw Error('This HTML lesson is unavailable.');
    return video.path;
  }
  if(lesson.course==='c-programming') {
    const video=cVideos.find(v=>v.id===lesson.id);
    if(!video)throw Error('This C programming lesson is unavailable.');
    return video.path;
  }
  return lesson.kind==='video'?'/classroom':`/learn/java/${lesson.id}`;
}
export function makeSession({minutes,lesson,owner}) {
  if(!Number.isInteger(minutes)||minutes<10||minutes>120)throw Error('Choose 10–120 whole minutes.');
  if(!lesson?.id||!lesson?.title||!['video','reading'].includes(lesson.kind))throw Error('Select an available lesson.');
  sessionRoute(lesson);
  const review=Math.max(1,Math.round(minutes*.1)),practice=Math.max(2,Math.round(minutes*.3));
  return {version:1,owner,lesson,minutes,stage:0,elapsed:[0,0,0],status:'ready',running:false,
    blocks:[{name:lesson.kind==='video'?'Watch your lesson':'Read and explore',seconds:(minutes-review-practice)*60},
      {name:'Practise what you learned',seconds:practice*60},{name:'Reflect and review',seconds:review*60}],reflection:''};
}
export function parseGuidedRequest(text,subject='english') {
  if(typeof text!=='string'||!/learn|study|session|plan|have|শিখ|পড়|sikh|shikh/i.test(text))return null;
  const match=text.match(/\b(\d{1,3})\s*(?:minutes?|mins?)\b/i);if(!match)return null;
  const minutes=Number(match[1]),topic=/web\s*(?:dev|development)|html|css/i.test(text)?'web development':/\bjava\b/i.test(text)?'java':subject;
  return {minutes,topic,valid:minutes>=10&&minutes<=120};
}
export function tickSession(session,seconds) {
  if(!session||session.status!=='active'||!session.running||!Number.isFinite(seconds)||seconds<=0)return session;
  const elapsed=[...session.elapsed],limit=session.blocks[session.stage].seconds;
  elapsed[session.stage]=Math.min(limit,elapsed[session.stage]+Math.min(seconds,2));
  return {...session,elapsed,running:elapsed[session.stage]<limit};
}
export function advanceSession(session) {
  if(!session||session.status==='completed')return session;
  // Advancing is a student action, never evidence of verified mastery.
  if(session.stage===2)return {...session,status:'completed',running:false};
  return {...session,stage:session.stage+1,status:'ready',running:false};
}
export function encouragement(session) {
  const total=session.elapsed.reduce((sum,n)=>sum+n,0),remaining=session.blocks[session.stage].seconds-session.elapsed[session.stage];
  if(session.status==='completed')return 'Session finished. Reflect on what you tried; time spent is not a mastery score.';
  if(remaining<=0)return 'Your block time is up. Pause, take stock and choose your next step.';
  if(total>=600)return `${Math.floor(total/300)*5} active minutes — steady effort. Keep your next step small.`;
  if(total>=300)return 'Five active minutes — a good start. Keep going at your pace.';
  return session.lesson.kind==='video'&&session.stage===0?'Open the lesson player and press Play. The timer waits for actual playback.':'Take one step at a time. Read, try an example, then check your understanding.';
}
export function restoreSession(raw,owner) {
  if(raw?.owner!==owner||raw?.version!==1)return null;
  try {
    const fresh=makeSession(raw);
    if(!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>2||!Array.isArray(raw.elapsed)||raw.elapsed.length!==3)return null;
    if(raw.elapsed.some((n,i)=>!Number.isFinite(n)||n<0||n>fresh.blocks[i].seconds))return null;
    return {...fresh,stage:raw.stage,elapsed:raw.elapsed,status:raw.status==='completed'?'completed':'paused',reflection:typeof raw.reflection==='string'?raw.reflection.slice(0,1000):''};
  }catch{return null;}
}

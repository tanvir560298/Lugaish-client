import {createContext,useContext,useEffect,useRef,useState,useCallback} from 'react';
import {Link,useLocation,useNavigate,useSearchParams} from 'react-router-dom';
import {useAppContext} from '../state/AppContext.jsx';
import {loadLectureDays,loadLectures} from '../classroom/lectures.js';
import {lessons} from '../learn/content.js';
import {htmlVideos} from '../learn/htmlContent.js';
import {makeSession,tickSession,advanceSession,encouragement,restoreSession,sessionRoute} from './session.js';
import './tanu.css';
import { TANU_AI_AVAILABLE } from './availability.js';
const SessionContext=createContext(null),PlaybackContext=createContext(null);
export const useTanuPlayback=()=>useContext(PlaybackContext);
const clock=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;
const lessonRoute=sessionRoute;
export function TanuSessionProvider({children}) {
  const {state}=useAppContext(); const owner=state.isLoggedIn?state.userEmail:'guest';
  if (!TANU_AI_AVAILABLE) return children;
  return <SessionOwner key={owner} owner={owner}>{children}</SessionOwner>;
}
function SessionOwner({children,owner}) {
  const {pathname}=useLocation(),[session,setSession]=useState(null),[quiet,setQuiet]=useState(false),[storageError,setStorageError]=useState('');
  const playback=useRef(null),ready=useRef(false),current=useRef(null),path=useRef(pathname);path.current=pathname;current.current=session;
  const key=`lugaish_tanu_session_v1:${owner}`;
  useEffect(()=>{try {setSession(restoreSession(JSON.parse(sessionStorage.getItem(key)||'null'),owner));}catch{setStorageError('Session recovery is unavailable in this browser.');}ready.current=true;},[key,owner]);
  useEffect(()=>{if(!ready.current)return;try{if(session)sessionStorage.setItem(key,JSON.stringify(session));else sessionStorage.removeItem(key);}catch{setStorageError('Session cannot be saved. Keep this page open.');}},[session,key]);
  const reportPlayback=useCallback(value=>{playback.current=value;},[]);
  useEffect(()=>{
    if(session?.lesson.kind==='video'&&session.stage===0&&session.elapsed[0]>=session.blocks[0].seconds)
      playback.current?.pause?.();
  },[session?.stage,session?.running,session?.elapsed?.[0],session?.blocks?.[0]?.seconds]);
  useEffect(()=>{
    let last=performance.now();
    const timer=setInterval(()=>{
      const now=performance.now(),delta=(now-last)/1000;last=now;
      setSession(s=>{
        if(!s||document.hidden||path.current!==lessonRoute(s.lesson))return s;
        if(s.stage===0&&s.lesson.kind==='video') {
          const p=playback.current;
          if(!p||p.id!==s.lesson.id||p.status!=='playing'||p.course!==s.lesson.course)return s;
        }
        return tickSession(s,delta);
      });
    },1000);
    return()=>clearInterval(timer);
  },[]);
  useEffect(()=>{
    const pause=()=>setSession(s=>s?.running?{...s,running:false,status:'paused'}:s);
    const visibility=()=>{if(document.hidden)pause();};
    window.addEventListener('pagehide',pause);document.addEventListener('visibilitychange',visibility);
    return()=>{window.removeEventListener('pagehide',pause);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{setSession(s=>s&&pathname!==lessonRoute(s.lesson)&&s.running?{...s,running:false,status:'paused'}:s);},[pathname]);
  return <PlaybackContext.Provider value={reportPlayback}><SessionContext.Provider value={{session,setSession,owner,quiet,setQuiet,storageError,pauseVideo:()=>playback.current?.pause?.()}}>{children}</SessionContext.Provider></PlaybackContext.Provider>;
}
export function TanuGuideSetup() {
  const {state}=useAppContext(),navigate=useNavigate(),ctx=useContext(SessionContext);
  const [params]=useSearchParams();const requestedTopic=params.get('topic')||'';
  const [minutes,setMinutes]=useState(Number(params.get('minutes'))||50),[choices,setChoices]=useState([]),[choice,setChoice]=useState('first-program'),[loading,setLoading]=useState(false),[error,setError]=useState('');
  const [subject,setSubject]=useState(params.get('study')==='html'||requestedTopic==='web development'?'html':params.get('study')==='course'?'course':'java'),[revision,setRevision]=useState(0);
  useEffect(()=>{if(params.has('minutes'))setMinutes(Number(params.get('minutes'))||50);if(params.has('study'))setSubject(params.get('study')==='html'||requestedTopic==='web development'?'html':params.get('study')==='course'?'course':'java');},[params,requestedTopic]);
  useEffect(()=>{
    let active=true;setError('');setChoices([]);
    if(subject==='html'){setChoices(htmlVideos);setChoice(htmlVideos.some(v=>v.id===params.get('video'))?params.get('video'):htmlVideos[0].id);setLoading(false);return;}
    if(subject==='java'){setChoices(lessons.map(l=>({id:l.id,title:l.title,kind:'reading'})));setChoice('first-program');setLoading(false);return;}
    if(!state.isLoggedIn){setError('Sign in to find your authorized course lessons.');setLoading(false);return;}
    setLoading(true);
    (async()=>{
      const days=await loadLectureDays(state.activePathway);const results=[];
      // Bounded discovery; each video is filtered by existing server entitlement rules.
      for(const day of days.slice(0,5)){const videos=await loadLectures(state.activePathway,day.day,state.userEmail,false);results.push(...videos.filter(v=>!v.completed).map(v=>({...v,kind:'video'})));}
      const matches=requestedTopic==='web development'?results.filter(v=>/web|html|css|javascript/i.test(v.title)):results;
      if(active){setChoices(matches);setChoice(matches[0]?.id||'');}
    })().catch(()=>{if(active)setError('Your course lessons could not be checked. Retry without changing your enrollment.');}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[subject,state.isLoggedIn,state.activePathway,state.userEmail,revision,requestedTopic,params]);
  if(!ctx)return null;
  const selected=choices.find(l=>l.id===choice);
  const prepare=()=>{
    try{
      const next=makeSession({minutes:Number(minutes),lesson:selected,owner:ctx.owner});
      // Approval arms a video session; only the matching player's actual
      // playing reports can accrue time. Reading starts with explicit Start.
      ctx.setSession(selected.kind==='video'?{...next,status:'active',running:true}:next);
      navigate(lessonRoute(selected),selected.kind==='video'?{state:{learningCourse:selected.course,learningDay:selected.day,learningLectureId:selected.id}}:undefined);
    }catch(e){setError(e.message);}
  };
  return <section className="tanu-setup" aria-labelledby="tanu-guide-title"><div className="tanu-bot" aria-hidden="true"><span>• •</span></div><div><p className="tanu-eyebrow">TANU AI · GUIDED STUDY</p><h2 id="tanu-guide-title">Tell me how much time you have.</h2><p>I’ll help you choose a real lesson, stay with your session and make room for practice. This guided timer works without a paid AI provider.</p><div className="tanu-fields"><label>Available minutes<input type="number" min="10" max="120" step="1" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label><label>What are we studying?<select value={subject} onChange={e=>setSubject(e.target.value)}><option value="html">Web development · HTML videos (Bangla)</option><option value="java">Java foundations · free self-study</option><option value="course">My current course · {state.activePathway}</option></select></label><label>Choose your lesson<select value={choice} onChange={e=>setChoice(e.target.value)} disabled={loading||!choices.length}>{choices.length?choices.map(l=><option key={l.id} value={l.id}>{l.title}</option>):<option value="">{loading?'Checking access…':'No accessible video lessons'}</option>}</select></label></div>{selected&&Number.isInteger(Number(minutes))&&Number(minutes)>=10&&Number(minutes)<=120&&<p className="tanu-plan">Your plan: {Math.round(Number(minutes)*.1)} min review · {Math.max(2,Math.round(Number(minutes)*.3))} min practice · remaining time {selected.kind==='video'?'watching':'reading'}. This is a time budget, not a claim about video length.</p>}{error&&<p role="alert">{error} <button onClick={()=>setRevision(v=>v+1)}>Retry</button></p>}<button className="tanu-primary" disabled={!selected||loading||(ctx.session&&ctx.session.status!=='completed')} onClick={prepare}>Approve plan & open lesson →</button>{ctx.session&&ctx.session.status!=='completed'&&<p>Finish or end your current session first.</p>}<p className="tanu-note">HTML uses the seven owner-supplied public videos. Enrolled courses still use existing access checks; only the first five available course days are searched here.</p></div></section>;
}
export function TanuCoach({inline=false}) {
  const ctx=useContext(SessionContext),{pathname}=useLocation();
  if(!ctx?.session)return null;
  const {session:s,setSession,quiet,setQuiet}=ctx;
  if(!inline&&pathname==='/classroom')return null;
  const block=s.blocks[s.stage],remaining=Math.max(0,block.seconds-s.elapsed[s.stage]),here=pathname===lessonRoute(s.lesson);
  return <aside className={`tanu-coach ${inline?'tanu-inline':''}`} aria-label="Tanu guided session"><div className="tanu-coach-head"><div className="tanu-bot" aria-hidden="true"><span>• •</span></div><div><strong>Tanu AI</strong><small>{s.lesson.title}</small></div><button aria-pressed={quiet} onClick={()=>setQuiet(v=>!v)}>Quiet {quiet?'on':'off'}</button></div><div className="tanu-time"><span>{s.status==='completed'?'Session summary':`${s.stage+1}/3 · ${block.name}`}</span><strong>{clock(remaining)}</strong></div>{!quiet&&<p role="status">{encouragement(s)}</p>}<p className="tanu-note">{s.status==='completed'?`${clock(s.elapsed.reduce((a,b)=>a+b,0))} active time recorded locally. No course credit or mastery claimed.`:!here?'Session paused while you are away from this lesson.':s.running?'Active only while this page is visible; video time additionally requires playback.':'Paused. Press Start, then Play for video lessons.'}</p>{s.stage===1&&<p>Pause the video and try an example from this lesson. Use its exercise or write a short explanation in your own words.</p>}{s.stage===2&&<label className="tanu-reflection">What did you learn or find difficult?<textarea maxLength={1000} value={s.reflection} onChange={e=>setSession({...s,reflection:e.target.value})}/></label>}<div className="tanu-controls">{s.status!=='completed'&&<><button disabled={!here} onClick={()=>{if(s.running)ctx.pauseVideo();setSession({...s,running:!s.running,status:s.running?'paused':'active'});}}>{s.running?'Pause':'Start / resume'}</button><button onClick={()=>{ctx.pauseVideo();setSession(advanceSession(s));}}>{s.stage===2?'Finish & reflect':'Move to next block'}</button>{!here&&<Link to={lessonRoute(s.lesson)} state={s.lesson.kind==='video'?{learningCourse:s.lesson.course,learningDay:s.lesson.day,learningLectureId:s.lesson.id}:undefined}>Return to lesson →</Link>}</>}<button onClick={()=>{ctx.pauseVideo();setSession(null);}}>{s.status==='completed'?'Close summary':'End session'}</button></div>{ctx.storageError&&<p role="alert">{ctx.storageError}</p>}</aside>;
}

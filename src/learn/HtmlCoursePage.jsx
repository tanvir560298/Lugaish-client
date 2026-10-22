import {useEffect,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {useAppContext} from '../state/AppContext.jsx';
import {useTanuPlayback} from '../tanu/GuidedSession.jsx';
import {createYouTubeLoader} from '../classroom/youtubeApi.js';
import {htmlVideos,htmlExercises,cleanHtmlProgress} from './htmlContent.js';
import './learn.css';
const loadYouTube=createYouTubeLoader({window,document,setTimeout,clearTimeout});

function HtmlPlayer({video}){
 const host=useRef(null),player=useRef(null),report=useTanuPlayback();
 const [enabled,setEnabled]=useState(false),[version,setVersion]=useState(0),[status,setStatus]=useState('idle'),[error,setError]=useState('');
 useEffect(()=>{
  if(!enabled)return;let cancelled=false,instance;setStatus('loading');setError('');
  const publish=status=>{setStatus(status);report?.({id:video.id,course:video.course,status,pause:()=>player.current?.pauseVideo?.()});};
  const timer=setTimeout(()=>{if(!cancelled){setError('The video did not become ready. Retry or open the original YouTube link.');publish('error');}},30000);
  loadYouTube().then(YT=>{
   if(cancelled)return;const mount=document.createElement('div');host.current.replaceChildren(mount);
   instance=new YT.Player(mount,{videoId:video.youtubeId,width:'100%',height:'100%',playerVars:{playsinline:1,autoplay:0,rel:0,origin:window.location.origin},events:{
    onReady:()=>{if(cancelled)return;clearTimeout(timer);publish('ready');},
    onStateChange:({data})=>{if(cancelled)return;publish(data===1?'playing':data===0?'ended':data===2?'paused':'buffering');},
    onError:()=>{if(cancelled)return;clearTimeout(timer);setError('YouTube could not play this video here. Open the original source or retry.');publish('error');}
   }});player.current=instance;
  }).catch(()=>{if(!cancelled){clearTimeout(timer);setError('YouTube could not load. Check your connection or open the source link.');publish('error');}});
  const pause=()=>{if(document.hidden)player.current?.pauseVideo?.();};document.addEventListener('visibilitychange',pause);
  return()=>{cancelled=true;clearTimeout(timer);document.removeEventListener('visibilitychange',pause);report?.(null);player.current=null;instance?.destroy?.();};
 },[video.id,video.youtubeId,video.course,enabled,version,report]);
 return <section aria-label="HTML video player"><div className="html-video-frame" ref={host}/>{!enabled&&<button className="lx-primary" onClick={()=>setEnabled(true)}>Load YouTube player</button>}{enabled&&<p role="status">{status==='playing'?'Playing':status==='ready'?'Ready — press Play in the video to begin.':status==='ended'?'Video ended. Review and mark watched when you are ready.':status==='loading'?'Loading YouTube…':status==='paused'?'Paused':status==='error'?'Playback unavailable':'Waiting for playback'}</p>}{error&&<p role="alert">{error} <button className="lx-secondary" onClick={()=>setVersion(v=>v+1)}>Retry player</button></p>}<p className="lx-fine">Playback is hosted by YouTube. Loading the player connects to YouTube; its availability and privacy policies apply. No autoplay.</p></section>;
}
function HtmlPracticeLab({video}){
 const exercise=htmlExercises[video.id],storageKey=`lugaish_html_draft_v1:${video.id}`;
 const [code,setCode]=useState(()=>{try{return localStorage.getItem(storageKey)??exercise.starter;}catch{return exercise.starter;}}),[saved,setSaved]=useState(true);
 useEffect(()=>{try{localStorage.setItem(storageKey,code);setSaved(true);}catch{setSaved(false);}},[code,storageKey]);
 const reset=()=>{setCode(exercise.starter);try{localStorage.removeItem(storageKey);}catch{setSaved(false);}};
 return <section className="html-practice" aria-labelledby="html-practice-title">
  <div className="html-practice-heading"><div><span className="html-start-kicker">A SMALL HANDS-ON EXERCISE</span><h2 id="html-practice-title">Try it in your browser</h2><p>{exercise.prompt}</p></div><button type="button" className="lx-secondary" onClick={reset}>Reset starter code</button></div>
  <div className="html-practice-grid"><label className="html-code-editor"><span>YOUR HTML <small>{saved?'Draft saved in this browser':'Draft could not be saved'}</small></span><textarea aria-label="Edit HTML code" spellCheck="false" value={code} onChange={event=>setCode(event.target.value)}/></label><div className="html-live-preview"><div className="html-preview-toolbar"><span>LIVE PREVIEW</span><span aria-live="polite">Updates as you type</span></div><iframe title={`Live preview: ${video.title}`} sandbox="" srcDoc={code}/></div></div>
  <p className="lx-fine">Your draft stays in this browser. The preview is sandboxed and does not run scripts.</p>
 </section>;
}
export function HtmlCoursePage(){const {videoId}=useParams();return <HtmlCourse key={videoId||'overview'} videoId={videoId}/>;}
function HtmlCourse({videoId}){
 const {state}=useAppContext(),key=`lugaish_html_watched_v1:${state.isLoggedIn?state.userEmail:'guest'}`;
 const [saved,setSaved]=useState({key:'',value:[]}),[error,setError]=useState('');
 useEffect(()=>{try{setSaved({key,value:cleanHtmlProgress(JSON.parse(localStorage.getItem(key)||'[]'))});}catch{setError('Browser progress storage is unavailable.');}},[key]);
 const completed=saved.key===key?saved.value:[],video=htmlVideos.find(v=>v.id===videoId),next=htmlVideos.find(v=>!completed.includes(v.id))||htmlVideos[0],currentIndex=video?htmlVideos.findIndex(item=>item.id===video.id):-1,previous=currentIndex>0?htmlVideos[currentIndex-1]:null,following=currentIndex>=0?htmlVideos[currentIndex+1]:null;
 const mark=()=>{const value=cleanHtmlProgress([...completed,video.id]);setSaved({key,value});try{localStorage.setItem(key,JSON.stringify(value));}catch{setError('Watched progress could not be saved in this browser.');}};
 if(videoId&&!video)return <div className="lx-learn"><h1>Video not found</h1><Link to="/learn/web-development/html">Back to HTML</Link></div>;
 return <div className="lx-learn lx-html-course"><Link className="lx-back" to="/learn">← All courses</Link><p className="lx-eyebrow"><span className="lx-dot"/> WEB DEVELOPMENT / HTML · BANGLA</p>
  {!video?<>
   <header className="html-course-heading"><div><h1>Build your first website,<br/><em>one small step at a time.</em></h1><p className="lx-lead">Start with the basics, practise each idea, then bring everything together in a portfolio page. Follow the classes in order—each one builds on the last.</p></div><aside className="html-progress-card"><span>YOUR LEARNING PATH</span><strong>{completed.length}<small> / 7</small></strong><p>{completed.length===7?'All classes watched. Nice work!':completed.length?`${completed.length} ${completed.length===1?'class':'classes'} marked watched`:'A fresh start. Begin with class 01.'}</p><div className="html-progress-track" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={completed.length}><span style={{width:`${completed.length/7*100}%`}}/></div></aside></header>
   <section className="html-start-card"><div className="html-start-number">{next.id}</div><div><span className="html-start-kicker">{completed.length?'PICK UP WHERE YOU LEFT OFF':'START HERE'}</span><h2>{completed.length?'Continue learning':'Your first class'}</h2><p>{next.title} · Watch the lesson, try the examples, then mark it complete.</p></div><Link className="lx-primary" to={next.path}>{completed.length?'Continue class':'Start class 01'} <span aria-hidden="true">→</span></Link></section>
   <div className="html-roadmap-heading"><div><span className="lx-eyebrow">THE COURSE, STEP BY STEP</span><h2>Your learning path</h2></div><p>Seven short classes · Taught in Bangla</p></div>
   </>:<>
   <div className="html-lesson-top"><div><span className="html-start-kicker">CLASS {video.id} OF 07</span><h1>{video.title}</h1></div><Link className="lx-secondary" to="/learn/web-development/html">Course roadmap</Link></div><div className="html-lesson-progress"><span>{completed.length} of 7 classes marked watched</span><div className="html-progress-track" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={completed.length}><span style={{width:`${completed.length/7*100}%`}}/></div></div>
   </>}
   {video&&<><HtmlPlayer video={video}/><HtmlPracticeLab video={video}/><div className="html-after-lesson"><div><span className="html-start-kicker">AFTER YOU WATCH</span><h2>Keep your momentum</h2><p>Try the exercise above, then mark this class watched when you’re ready to continue.</p></div><button className="lx-primary" onClick={mark} disabled={completed.includes(video.id)}>{completed.includes(video.id)?'Class marked complete ✓':'I watched this class'}</button></div><div className="html-lesson-navigation">{previous?<Link className="lx-secondary" to={previous.path}>← Previous class<span>{previous.title}</span></Link>:<span/>}{following?<Link className="lx-primary" to={following.path}>Next class →<span>{following.title}</span></Link>:<Link className="lx-primary" to="/learn/web-development/html">Finish course →<span>Review your learning path</span></Link>}</div></>}
   <ol className="lx-syllabus html-roadmap">{htmlVideos.map((item,index)=>{const done=completed.includes(item.id);return <li key={item.id} className={`${done?'is-complete':''} ${video?.id===item.id?'is-current':''}`}><span className="html-roadmap-index">{done?'✓':item.id}</span><Link to={item.path} aria-current={video?.id===item.id?'page':undefined}><span className="html-roadmap-phase">{index<2?'GETTING STARTED':index<5?'BUILDING BLOCKS':'PUT IT TOGETHER'}</span><h2>{item.title}</h2><p>Class {item.id} · Video lesson · Bangla</p></Link><Link className="html-roadmap-open" to={item.path} aria-label={`${video?.id===item.id?'Continue':'Open'} class ${item.id}`}>{video?.id===item.id?'Continue →':done?'Review ↗':'Open class →'}</Link></li>})}</ol>
   <div className="lx-actions"><Link className="lx-secondary" to={`/classroom${video ? `?lesson=${video.id}` : ''}`}>Study in Classroom →</Link><Link className="lx-secondary" to="/study-room">Open my study desk →</Link></div>{error&&<p role="alert">{error}</p>}<p className="lx-notice">Your watched progress is saved in this browser. Mark a lesson watched after you finish it, and return to any lesson whenever you need a refresher.</p></div>;
}

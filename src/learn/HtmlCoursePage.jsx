import {useEffect,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {useAppContext} from '../state/AppContext.jsx';
import {useTanuPlayback} from '../tanu/GuidedSession.jsx';
import {createYouTubeLoader} from '../classroom/youtubeApi.js';
import {htmlVideos,htmlExercises,cleanHtmlProgress} from './htmlContent.js';
import {checkHtmlPractice,htmlMilestones} from './htmlPractice.js';
import './learn.css';
const loadYouTube=createYouTubeLoader({window,document,setTimeout,clearTimeout});

function HtmlPlayer({video}){
 const host=useRef(null),player=useRef(null),report=useTanuPlayback();
 const [version,setVersion]=useState(0),[status,setStatus]=useState('loading'),[error,setError]=useState('');
 useEffect(()=>{
  let cancelled=false,instance;setStatus('loading');setError('');
  const publish=status=>{setStatus(status);report?.({id:video.id,course:video.course,status,pause:()=>player.current?.pauseVideo?.()});};
  const timer=setTimeout(()=>{if(!cancelled){setError('The video did not become ready. Retry or open the original YouTube link.');publish('error');}},30000);
  loadYouTube().then(YT=>{
   if(cancelled)return;const mount=document.createElement('div');host.current.replaceChildren(mount);
   instance=new YT.Player(mount,{videoId:video.youtubeId,width:'100%',height:'100%',playerVars:{playsinline:1,autoplay:0,rel:0,origin:window.location.origin},events:{
    onReady:()=>{if(cancelled)return;clearTimeout(timer);setError('');publish('ready');},
    onStateChange:({data})=>{if(cancelled)return;publish(data===1?'playing':data===0?'ended':data===2?'paused':'buffering');},
    onError:()=>{if(cancelled)return;clearTimeout(timer);setError('YouTube could not play this video here. Open the original source or retry.');publish('error');}
   }});player.current=instance;
  }).catch(()=>{if(!cancelled){clearTimeout(timer);setError('YouTube could not load. Check your connection or open the source link.');publish('error');}});
  const pause=()=>{if(document.hidden)player.current?.pauseVideo?.();};document.addEventListener('visibilitychange',pause);
  return()=>{cancelled=true;clearTimeout(timer);document.removeEventListener('visibilitychange',pause);report?.(null);player.current=null;instance?.destroy?.();};
 },[video.id,video.youtubeId,video.course,version,report]);
 return <section className="html-player" aria-label="HTML video player">
  <div className="html-player-stage" aria-busy={status==='loading'}>
   <div className="html-video-frame" ref={host}/>
   {(status==='loading'||error)&&<div className="html-player-placeholder" role={error?'alert':'status'}><span className="html-player-symbol" aria-hidden="true">{error?'!':'▶'}</span><strong>{error?'Video unavailable':'Getting your class ready…'}</strong><p>{error||'Your lesson will appear here in a moment.'}</p>{error&&<button className="lx-primary" onClick={()=>setVersion(v=>v+1)}>Try again</button>}</div>}
  </div>
  <div className="html-player-footer"><span role="status">{status==='playing'?'● Playing':status==='ended'?'✓ Lesson finished — try the exercise below':status==='paused'?'Paused — continue whenever you’re ready':status==='error'?'Having trouble playing?':status==='loading'?'Preparing your lesson':'Press ▶ to start your class'}</span><a href={video.url} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div>
 </section>;
}
function HtmlPracticeLab({video,onPassed,scope}){
 const exercise=htmlExercises[video.id],storageKey=`lugaish_html_draft_v1:${scope}:${video.id}`;
 const [code,setCode]=useState(()=>{try{return localStorage.getItem(storageKey)??exercise.starter;}catch{return exercise.starter;}}),[saved,setSaved]=useState(true),[feedback,setFeedback]=useState(null);
 useEffect(()=>{try{localStorage.setItem(storageKey,code);setSaved(true);}catch{setSaved(false);}},[code,storageKey]);
 const check=()=>{const result=checkHtmlPractice(video.id,code,exercise.starter,html=>new DOMParser().parseFromString(html,'text/html'));setFeedback(result);if(result.ok)onPassed(video.id);};
 const reset=()=>{setFeedback(null);setCode(exercise.starter);try{localStorage.removeItem(storageKey);}catch{setSaved(false);}};
 return <section id="html-practice" className="html-practice" aria-labelledby="html-practice-title">
  <div className="html-practice-heading"><div><span className="html-start-kicker">STEP 2 · PRACTISE</span><h2 id="html-practice-title">Try it in your browser</h2><p>{exercise.prompt}</p></div><button type="button" className="lx-secondary" onClick={reset}>Reset starter code</button></div>
  <div className="html-practice-grid"><label className="html-code-editor"><span>YOUR HTML <small>{saved?'Draft saved in this browser':'Draft could not be saved'}</small></span><textarea aria-label="Edit HTML code" spellCheck="false" value={code} onChange={event=>{setCode(event.target.value);setFeedback(null);}}/></label><div className="html-live-preview"><div className="html-preview-toolbar"><span>LIVE PREVIEW</span><span aria-live="polite">Updates as you type</span></div><iframe title={`Live preview: ${video.title}`} sandbox="" srcDoc={code}/></div></div>
  <div className="html-practice-check"><button className="lx-primary" onClick={check}>Check my practice <span aria-hidden="true">→</span></button><span>Make a change. See it live. Check your task.</span></div>
  {feedback&&<div className={`html-task-feedback ${feedback.ok?'is-success':''}`} role="status"><strong>{feedback.ok?'✓ You made it work!':'You’re getting there'}</strong><p>{feedback.message}</p>{feedback.ok&&<a href="#html-complete">Ready for your next step? ↓</a>}</div>}
  <p className="lx-fine">Your draft stays in this browser. The preview is sandboxed and does not run scripts.</p>
 </section>;
}
export function HtmlCoursePage(){const {videoId}=useParams();return <HtmlCourse key={videoId||'overview'} videoId={videoId}/>;}
function HtmlCourse({videoId}){
 const {state}=useAppContext(),key=`lugaish_html_watched_v1:${state.isLoggedIn?state.userEmail:'guest'}`;
 const [saved,setSaved]=useState({key:'',value:[]}),[error,setError]=useState(''),[practice,setPractice]=useState({key:'',value:[]}),[celebrate,setCelebrate]=useState(false);
 const practiceKey=key.replace('watched','practice');
 useEffect(()=>{try{setPractice({key:practiceKey,value:cleanHtmlProgress(JSON.parse(localStorage.getItem(practiceKey)||'[]'))});}catch{setError('Practice progress could not be loaded in this browser.');}},[practiceKey]);
 const practised=practice.key===practiceKey?practice.value:[];
 const savePractice=id=>{const value=cleanHtmlProgress([...practised,id]);setPractice({key:practiceKey,value});try{localStorage.setItem(practiceKey,JSON.stringify(value));}catch{setError('Practice progress could not be saved in this browser.');}};
 useEffect(()=>{try{setSaved({key,value:cleanHtmlProgress(JSON.parse(localStorage.getItem(key)||'[]'))});}catch{setError('Browser progress storage is unavailable.');}},[key]);
 const completed=saved.key===key?saved.value:[],video=htmlVideos.find(v=>v.id===videoId),next=htmlVideos.find(v=>!completed.includes(v.id))||htmlVideos[0],currentIndex=video?htmlVideos.findIndex(item=>item.id===video.id):-1,previous=currentIndex>0?htmlVideos[currentIndex-1]:null,following=currentIndex>=0?htmlVideos[currentIndex+1]:null;
 const mark=()=>{setCelebrate(!completed.includes(video.id));const value=cleanHtmlProgress([...completed,video.id]);setSaved({key,value});try{localStorage.setItem(key,JSON.stringify(value));}catch{setError('Watched progress could not be saved in this browser.');}};
 if(videoId&&!video)return <div className="lx-learn"><h1>Video not found</h1><Link to="/learn/web-development/html">Back to HTML</Link></div>;
 return <div className="lx-learn lx-html-course"><Link className="lx-back" to="/learn">← All courses</Link><p className="lx-eyebrow"><span className="lx-dot"/> WEB DEVELOPMENT / HTML · BANGLA</p>
  {!video?<>
   <header className="html-course-heading"><div><h1>Build your first website,<br/><em>one small step at a time.</em></h1><p className="lx-lead">Start with the basics, practise each idea, then bring everything together in a portfolio page. Follow the classes in order—each one builds on the last.</p></div><aside className="html-progress-card"><span>YOUR LEARNING PATH</span><strong>{completed.length}<small> / 7</small></strong><p>{completed.length===7?'All classes watched. Nice work!':completed.length?`${completed.length} ${completed.length===1?'class':'classes'} marked watched`:'A fresh start. Begin with class 01.'}</p><div className="html-progress-track" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={completed.length}><span style={{width:`${completed.length/7*100}%`}}/></div></aside></header>
   <section className="html-start-card"><div className="html-start-number">{next.id}</div><div><span className="html-start-kicker">{completed.length?'PICK UP WHERE YOU LEFT OFF':'START HERE'}</span><h2>{completed.length===7?'Keep your skills growing':completed.length?'Continue learning':'Your first class'}</h2><p>{completed.length===7?'Revisit any class or finish a practice task. Your portfolio is worth another look.':`${next.title} · One class and one small thing to build. That’s enough for today.`}</p></div><Link className="lx-primary" to={next.path}>{completed.length===7?'Revisit class 01':completed.length?'Continue class':'Start class 01'} <span aria-hidden="true">→</span></Link></section>
   <Milestones completed={completed} practised={practised}/>
   <div className="html-roadmap-heading"><div><span className="lx-eyebrow">THE COURSE, STEP BY STEP</span><h2>Your learning path</h2></div><p>Seven short classes · Taught in Bangla</p></div>
   </>:<>
   <div className="html-lesson-top"><div><span className="html-start-kicker">CLASS {video.id} OF 07</span><h1>{video.title}</h1></div><Link className="lx-secondary" to="/learn/web-development/html">Course roadmap</Link></div><div className="html-lesson-progress"><span>{completed.length} of 7 classes marked watched</span><div className="html-progress-track" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={completed.length}><span style={{width:`${completed.length/7*100}%`}}/></div></div>
   </>}
   {video&&<><nav className="html-lesson-steps" aria-label="Lesson steps"><a href="#html-watch"><span>1</span> Watch the class</a><a href="#html-practice"><span>2</span> Try it yourself</a><a href="#html-complete"><span>3</span> Mark watched & continue</a></nav><div className="html-watch-layout" id="html-watch"><HtmlPlayer video={video}/><aside className="html-class-list" aria-label="Course classes"><div className="html-class-list-heading"><span className="html-start-kicker">YOUR CLASSES</span><strong>HTML · Bangla</strong><p>Choose a class to start learning</p></div><ol>{htmlVideos.map(item=><li key={item.id}><Link to={item.path} aria-current={video.id===item.id?'page':undefined}><span className="html-class-number">{completed.includes(item.id)?'✓':video.id===item.id?'▶':item.id}</span><span><strong>{item.title}</strong><small>{video.id===item.id?'Current class':practised.includes(item.id)&&completed.includes(item.id)?'Watched & practised ✓':completed.includes(item.id)?'Watched · Try the practice':`Class ${item.id}`}</small></span></Link></li>)}</ol></aside></div><section className="html-lesson-mission"><div><span className="html-start-kicker">YOUR SMALL WIN TODAY</span><h2>{htmlExercises[video.id].prompt}</h2><p>Watch the example, then make it your own. You can replay any part.</p></div><div className="html-mission-actions"><a className="lx-secondary" href="#html-practice">Let’s practise ↓</a><Link className="lx-secondary" to={`/tanu?tab=chat&subject=web_dev&topic=${encodeURIComponent(`HTML class ${video.id}: ${video.title}`)}`}>Stuck? Ask Tanu ↗</Link></div></section><HtmlPracticeLab key={`${key}:${video.id}`} video={video} scope={state.isLoggedIn?state.userEmail:'guest'} onPassed={savePractice}/><div id="html-complete" className="html-after-lesson"><div><span className="html-start-kicker">STEP 3 · CONTINUE</span><h2>{completed.includes(video.id)?'A small step. Real progress.':'Ready to wrap up?'}</h2><p>{practised.includes(video.id)?'Practice task checked ✓ · Mark the video watched when you have finished.':'Try the practice task above. Mark the video watched when you have finished.'}</p></div><button className="lx-primary" onClick={mark} disabled={completed.includes(video.id)}>{completed.includes(video.id)?'Video marked watched ✓':'I watched this class'}</button></div>{celebrate&&<div className="html-completion-note" role="status"><span aria-hidden="true">✦</span><div><strong>{completed.length===7?'All seven videos watched. Look how far you’ve come!':`Class ${video.id} watched. You’re moving forward!`}</strong><p>{practised.includes(video.id)?'You also passed this class’s practice checks. Keep building on that.':'Your next small win: try this class’s practice task.'}</p></div><a className="lx-primary" href={practised.includes(video.id)?'#html-next':'#html-practice'}>{practised.includes(video.id)?'Choose your next step ↓':'Try the practice ↑'}</a></div>}<div className="html-lesson-navigation" id="html-next">{previous?<Link className="lx-secondary" to={previous.path}>← Previous class<span>{previous.title}</span></Link>:<span/>}{following?<Link className="lx-primary" to={following.path}>Next class →<span>{following.title}</span></Link>:<Link className="lx-primary" to="/learn/web-development/html">Finish course →<span>Review your learning path</span></Link>}</div></>}
   {!video&&<ol className="lx-syllabus html-roadmap">{htmlVideos.map((item,index)=>{const done=completed.includes(item.id);return <li key={item.id} className={`${done?'is-complete':''} ${video?.id===item.id?'is-current':''}`}><span className="html-roadmap-index">{done?'✓':item.id}</span><Link to={item.path} aria-current={video?.id===item.id?'page':undefined}><span className="html-roadmap-phase">{index<2?'GETTING STARTED':index<5?'BUILDING BLOCKS':'PUT IT TOGETHER'}</span><h2>{item.title}</h2><p>Class {item.id} · Video lesson · Bangla</p></Link><Link className="html-roadmap-open" to={item.path} aria-label={`${video?.id===item.id?'Continue':'Open'} class ${item.id}`}>{video?.id===item.id?'Continue →':done?'Review ↗':'Open class →'}</Link></li>})}</ol>}
   {video&&<Milestones completed={completed} practised={practised}/>}
   <div className="lx-actions"><Link className="lx-secondary" to={`/classroom${video ? `?lesson=${video.id}` : ''}`}>Study in Classroom →</Link><Link className="lx-secondary" to="/study-room">Open my study desk →</Link></div>{error&&<p role="alert">{error}</p>}<p className="lx-notice">Your watched progress is saved in this browser. Mark a lesson watched after you finish it, and return to any lesson whenever you need a refresher.</p></div>;
}

function Milestones({completed,practised}){
 return <section className="html-milestones" aria-labelledby="html-milestone-title"><div className="html-milestones-intro"><span className="html-start-kicker">LITTLE WINS ADD UP</span><h2 id="html-milestone-title">See what you’re building</h2><p>Each milestone grows as you watch and practise. Go at your own pace.</p></div><ol>{htmlMilestones.map((milestone,index)=>{const total=milestone.ids.length*2,earned=milestone.ids.reduce((sum,id)=>sum+Number(completed.includes(id))+Number(practised.includes(id)),0),done=earned===total;return <li key={milestone.name} className={done?'is-earned':''}><span className="html-milestone-icon" aria-hidden="true">{done?'✓':['◇','▱','✦'][index]}</span><div><strong>{milestone.name}</strong><p>{milestone.description}</p><progress aria-label={milestone.name} max={total} value={earned}/><small>{done?'Milestone reached':`${earned} / ${total} steps · videos + practice`}</small></div></li>;})}</ol></section>;
}

import {useEffect,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {useAppContext} from '../state/AppContext.jsx';
import {useTanuPlayback} from '../tanu/GuidedSession.jsx';
import {createYouTubeLoader} from '../classroom/youtubeApi.js';
import {htmlVideos,cleanHtmlProgress} from './htmlContent.js';
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
export function HtmlCoursePage(){const {videoId}=useParams();return <HtmlCourse key={videoId||'overview'} videoId={videoId}/>;}
function HtmlCourse({videoId}){
 const {state}=useAppContext(),key=`lugaish_html_watched_v1:${state.isLoggedIn?state.userEmail:'guest'}`;
 const [saved,setSaved]=useState({key:'',value:[]}),[error,setError]=useState('');
 useEffect(()=>{try{setSaved({key,value:cleanHtmlProgress(JSON.parse(localStorage.getItem(key)||'[]'))});}catch{setError('Browser progress storage is unavailable.');}},[key]);
 const completed=saved.key===key?saved.value:[],video=htmlVideos.find(v=>v.id===videoId),next=htmlVideos.find(v=>!completed.includes(v.id))||htmlVideos[0];
 const mark=()=>{const value=cleanHtmlProgress([...completed,video.id]);setSaved({key,value});try{localStorage.setItem(key,JSON.stringify(value));}catch{setError('Watched progress could not be saved in this browser.');}};
 if(videoId&&!video)return <div className="lx-learn"><h1>Video not found</h1><Link to="/learn/web-development/html">Back to HTML</Link></div>;
 return <div className="lx-learn"><Link className="lx-back" to="/learn">← All courses</Link><p className="lx-eyebrow">WEB DEVELOPMENT / HTML · BANGLA</p><h1>{video?`${video.id}. ${video.title}`:'Web Development: HTML'}</h1><p className="lx-lead">Seven beginner-friendly video lessons in Bangla. Learn the basics of HTML, follow along, and build your first portfolio website.</p><p>{completed.length} / 7 marked watched on this browser</p>{!video&&<Link className="lx-primary" to={next.path}>{completed.length?'Continue learning':'Start class 01'} →</Link>}{video&&<><HtmlPlayer video={video}/><div className="lx-actions"><button className="lx-primary" onClick={mark} disabled={completed.includes(video.id)}>{completed.includes(video.id)?'Marked watched ✓':'I watched this lesson'}</button><a className="lx-secondary" href={video.url} target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a><Link className="lx-secondary" to={`/tanu?minutes=50&study=html&topic=web%20development&video=${video.id}`}>Tanu AI · coming soon →</Link>{htmlVideos[Number(video.id)]&&<Link to={htmlVideos[Number(video.id)].path}>Next class →</Link>}</div></>}<ol className="lx-syllabus">{htmlVideos.map(item=><li key={item.id}><span>{completed.includes(item.id)?'✓':item.id}</span><Link to={item.path} aria-current={video?.id===item.id?'page':undefined}><h2>{item.title}</h2><p>Class {item.id} · Bangla · YouTube video</p></Link></li>)}</ol>{error&&<p role="alert">{error}</p>}<p className="lx-notice">Your watched progress is saved in this browser. Mark a lesson watched after you finish it, and return to any lesson whenever you need a refresher.</p></div>;
}

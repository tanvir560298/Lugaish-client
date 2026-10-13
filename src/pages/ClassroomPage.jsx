import { api } from '../api/client.js';
import { HALL_SEATS } from '../shared/learningHall.js';
import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createFullscreenController, lockViewport } from '../classroom/immersive.js';
import { TouchControls } from '../classroom/TouchControls.jsx';
import { Camera, DoorOpen, Hand, LoaderCircle, Maximize, Minimize, Monitor, Pause, Play, RotateCcw, Settings, Square, X } from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { getViewedRole, ROLES } from '../utils/roles.js';
import { createLocalSession, transition, CLASS_ACTIVE } from '../classroom/session.js';
import { loadLectureDays, loadLectures, previewLectures, completeClassroomVideo } from '../classroom/lectures.js';
import '../classroom/classroom.css';

const ClassroomScene=lazy(()=>import('../classroom/ClassroomScene.jsx'));
const STATUS={Loading:'Preparing the room',Waiting:'Make yourself at home',TeacherEntering:'Your teacher is entering',TeacherApproaching:'Your teacher is walking to the front',PreparingLecture:'Preparing your lecture',LectureReady:'Ready to play',LecturePlaying:'Class in progress',LecturePaused:'Lecture paused',Ended:'Class finished',Error:'Something needs attention'};
export function ClassroomPage({ devPreview=false }) {
  const location=useLocation();
  const navigate=useNavigate(),rootRef=useRef(),settingsRef=useRef(),fullscreenRef=useRef();
  const [fullscreen,setFullscreen]=useState(false),[fullscreenSupported,setFullscreenSupported]=useState(false),[moving,setMoving]=useState(false);
  const {state,actions,courseData}=useAppContext();
  const catalogRef=useRef(),theaterRef=useRef(),theaterHost=useRef();
  const [theater,setTheater]=useState(false),[savingProgress,setSavingProgress]=useState(false),[progressMessage,setProgressMessage]=useState('');
  const preview=import.meta.env.DEV && devPreview;
  const [paidBatchAvailable,setPaidBatchAvailable]=useState(false);
  useEffect(()=>{
    let cancelled=false;setPaidBatchAvailable(false);
    if(!preview && state.isLoggedIn)api.getDayModules('paid_batch').then(()=>{if(!cancelled)setPaidBatchAvailable(true);}).catch(()=>{});
    return()=>{cancelled=true;};
  },[preview,state.isLoggedIn,state.userEmail,state.privateBatchAccess,state.privateBatchExplicitlyRevoked]);
  const course=state.activePathway;
  const staff=getViewedRole(state)!==ROLES.learner;
  const [days,setDays]=useState([]),[day,setDay]=useState(0),[lectures,setLectures]=useState([]),[selected,setSelected]=useState('');
  const [catalogLoading,setCatalogLoading]=useState(!preview),[catalogError,setCatalogError]=useState(''),[reloadCatalog,setReloadCatalog]=useState(0);
  const [phase,dispatch]=useReducer(transition,'Loading');
  const [cameraMode,setCameraMode]=useState('lesson'),[quality,setQuality]=useState('high'),[locked,setLocked]=useState(false),[help,setHelp]=useState(false);
  const [media,setMedia]=useState({status:'loading',ready:false,error:''}),[sceneError,setSceneError]=useState(''),[inputError,setInputError]=useState('');
  const [retry,setRetry]=useState(0),[starting,setStarting]=useState(false),[stats,setStats]=useState(null);
  const [touchOnly]=useState(()=>window.matchMedia('(any-pointer: coarse)').matches);
  const [reducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const selectionKey=`lugaish-classroom-selection-v1:${encodeURIComponent(state.userEmail||'learner')}:${course}`;
  const preferred=useRef(null),catalogOwner=useRef('');
  useEffect(()=>{try{preferred.current=JSON.parse(sessionStorage.getItem(selectionKey));}catch{preferred.current=null;}if(location.state?.learningCourse===course&&Number.isInteger(location.state?.learningDay))preferred.current={day:location.state.learningDay,id:preferred.current?.day===location.state.learningDay?preferred.current.id:undefined};},[selectionKey,location.state,course]);
  useEffect(()=>{if(!preview&&day&&selected&&catalogOwner.current===selectionKey){try{sessionStorage.setItem(selectionKey,JSON.stringify({day,id:selected}));}catch{/* Optional restoration; authorization still runs. */}}},[day,selected,selectionKey,preview]);
  const requestEpoch=useRef(0),controlsRef=useRef(),mediaRef=useRef(),startingRef=useRef(false),alive=useRef(true),phaseRef=useRef(phase);
  phaseRef.current=phase;
  const session=useMemo(()=>createLocalSession(),[]);
  const lecture=lectures.find(item=>item.id===selected) ?? null;
  const onReady=useCallback(()=>dispatch('LOADED'),[]);
  const onError=useCallback(message=>{setSceneError(message);dispatch('FAIL');},[]);
  const report=useCallback(update=> {
    setMedia(current=>({...current,...update}));
    if(update.status==='playing')dispatch('PLAYING');
    if(update.status==='paused')dispatch('PAUSED');
    if(update.status==='ended')dispatch('FINISHED');
    if(update.status==='error')dispatch('FAIL');
  },[]);
  useEffect(()=>{
    alive.current=true;
    session.emit('player.join',{displayName:'Local student'});
    return ()=>{alive.current=false;session.emit('player.leave');session.dispose();mediaRef.current?.pause();controlsRef.current?.release();};
  },[session]);
  useEffect(()=>{
    // Switching course or account invalidates the entire room and its selected media.
    requestEpoch.current++;dispatch('END');dispatch('RESET');controlsRef.current?.recover();setLectures([]);setSelected('');setDay(0);setDays([]);
    let cancelled=false;
    if(preview){setLectures([]);setSelected('');setCatalogLoading(false);return;}
    setCatalogLoading(true);setCatalogError('');
    loadLectureDays(course).then(result=>{if(cancelled)return;setDays(result);setDay(result.some(d=>d.day===preferred.current?.day)?preferred.current.day:result[0]?.day || 0);})
      .catch(error=>{if(!cancelled)setCatalogError(error.message);})
      .finally(()=>{if(!cancelled)setCatalogLoading(false);});
    return ()=>{cancelled=true;};
  },[course,preview,reloadCatalog,state.userEmail,state.webDeveloperMode]);
  useEffect(()=>{
    if(preview || !day)return;
    let cancelled=false;setCatalogLoading(true);setCatalogError('');setLectures([]);setSelected('');
    loadLectures(course,day,state.userEmail,staff).then(result=>{if(cancelled)return;catalogOwner.current=selectionKey;setLectures(result);setSelected(result.some(l=>l.id===preferred.current?.id)?preferred.current.id:result[0]?.id || '');})
      .catch(error=>{if(!cancelled)setCatalogError(error.message);})
      .finally(()=>{if(!cancelled)setCatalogLoading(false);});
    return ()=>{cancelled=true;};
  },[day,course,preview,staff,state.userEmail,reloadCatalog]);
  useEffect(()=>{
    const pause=()=>{if(document.hidden){mediaRef.current?.pause();controlsRef.current?.release();}};
    document.addEventListener('visibilitychange',pause);
    return ()=>document.removeEventListener('visibilitychange',pause);
  },[]);
  const start=async()=>{
    if(startingRef.current || phase!=='Waiting' || !lecture || !media.ready)return;
    if(media.nativeOnly){openTheater();return;}
    startingRef.current=true;setStarting(true);setInputError('');
    const epoch=requestEpoch.current;
    try {
      if(!preview){
        const fresh=await loadLectures(course,lecture.day,state.userEmail,staff);
        if(!fresh.some(item=>item.id===lecture.id))throw new Error('This lecture is no longer accessible. Exit and reload the lecture list.');
      }
      if(!alive.current || epoch!==requestEpoch.current || phaseRef.current!=='Waiting')return;
      session.emit('class.start',{lectureId:lecture.id});dispatch('START');
    }catch(error){if(alive.current)setInputError(error.message);}
    finally{startingRef.current=false;if(alive.current)setStarting(false);}
  };
  const stop=()=>{mediaRef.current?.pause();session.emit('class.stop');dispatch('END');};
  const reset=async()=>{
    if(startingRef.current)return;
    startingRef.current=true;setStarting(true);
    const epoch=requestEpoch.current;
    try {
      if(!preview && lecture){
        const fresh=await loadLectures(course,lecture.day,state.userEmail,staff);
        if(!fresh.some(item=>item.id===lecture.id))throw new Error('This lecture is no longer available. Exit and choose another lecture.');
        if(!alive.current || epoch!==requestEpoch.current)return;
        setLectures(fresh);
      }
      mediaRef.current?.reset();dispatch('RESET');if(theater)dispatch('STUDY_READY');setMedia({status:'loading',ready:false,error:''});setRetry(value=>value+1);setInputError('');
    }catch(error){if(alive.current)setInputError(error.message);}
    finally{startingRef.current=false;if(alive.current)setStarting(false);}
  };
  const leave=()=>{requestEpoch.current++;controlsRef.current?.release();mediaRef.current?.pause();navigate(preview?'/learning-spaces-preview':'/learning-spaces');};
  const reloadRoom=()=>{setSceneError('');dispatch('RESET');setMedia({status:'loading',ready:false,error:''});setRetry(value=>value+1);};
  const play=()=>{session.emit('media.state',{lectureId:selected,positionSeconds:mediaRef.current?.position?.() || 0,playing:true,updatedAt:Date.now()});mediaRef.current?.play();};
  useEffect(()=>{
    const restore=lockViewport(document);
    const controller=createFullscreenController(rootRef.current,document,{onChange:setFullscreen,onError:setInputError});fullscreenRef.current=controller;setFullscreenSupported(controller.supported);
    return()=>{controller.dispose();restore();};
  },[]);
  const openCatalog=()=>{controlsRef.current?.release();setHelp(true);catalogRef.current?.showModal();};
  const openTheater=async()=>{
    if(!lecture || startingRef.current)return;
    controlsRef.current?.release();
    const current=lecture,epoch=requestEpoch.current;
    startingRef.current=true;
    try{
      if(!preview){const fresh=await loadLectures(current.course,current.day,state.userEmail,staff);if(!fresh.some(item=>item.id===current.id))throw new Error('This lesson is no longer accessible. Reload the course list.');}
      if(!alive.current || epoch!==requestEpoch.current)return;
      setCameraMode('lesson');dispatch('STUDY_READY');setHelp(true);setTheater(true);theaterRef.current?.showModal();
    }catch(error){if(alive.current)setInputError(error.message);}
    finally{startingRef.current=false;}
  };
  const saveProgress=async()=>{
    if(savingProgress || !lecture || preview || staff)return;
    const current=lecture,epoch=requestEpoch.current;
    setSavingProgress(true);setProgressMessage('');
    try{
      await completeClassroomVideo(current);
      const fresh=await loadLectures(current.course,current.day,state.userEmail,staff);
      if(alive.current && epoch===requestEpoch.current){setLectures(fresh);setProgressMessage('Video complete. Your lesson progress is saved.');}
    }catch(error){if(alive.current && epoch===requestEpoch.current)setProgressMessage(error.message);}
    finally{if(alive.current)setSavingProgress(false);}
  };
  const openSettings=()=>{controlsRef.current?.release();setHelp(true);settingsRef.current?.showModal();};
  const chooseLecture=id=>{requestEpoch.current++;mediaRef.current?.pause();dispatch('END');dispatch('RESET');setMedia({status:'loading',ready:false,error:''});setSelected(id);};
  const classControls=<div className="cr-tool-group">
        {phase==='Waiting' && <button className="cr-button cr-primary" disabled={!lecture || !media.ready || starting} onClick={start}><Play size={16} /> {starting?'Checking access…':'Start class'}</button>}
        {['LectureReady','LecturePaused'].includes(phase) && <button className="cr-button cr-primary" onClick={play}><Play size={16} /> {phase==='LecturePaused'?'Resume lecture':'Play lecture'}</button>}
        {phase==='LecturePlaying' && <button className="cr-button" onClick={()=>mediaRef.current?.pause()}><Pause size={16} /> Pause lecture</button>}
        {CLASS_ACTIVE.has(phase) && <button className="cr-button" onClick={stop}><Square size={14} /> End class</button>}
        {['Ended','Error'].includes(phase) && !sceneError && <button className="cr-button cr-primary" disabled={starting} onClick={reset}><RotateCcw size={16} /> {phase==='Error'?'Retry lecture':'Replay class'}</button>}
      </div>;
  return <section ref={rootRef} className={`cr-page classroom-immersive ${moving&&!help?'cr-hud-moving':''}`} aria-label="Lugaish immersive classroom">
    <div className="cr-stage" aria-label="Interactive 3D classroom">
      <Suspense fallback={<div className="cr-scene-loading" role="status"><LoaderCircle className="cr-spin"/><strong>Opening your classroom…</strong></div>}>
        <ClassroomScene key={retry} session={session} phase={phase} dispatch={dispatch} lecture={lecture} quality={quality} cameraMode={cameraMode} reducedMotion={reducedMotion} controlsRef={controlsRef} mediaRef={mediaRef} onReady={onReady} onError={onError} onStats={setStats} onLockChange={setLocked} onMovementChange={setMoving} onInputError={setInputError} report={report} theater={theater} theaterHost={theaterHost} onBrowse={openCatalog}/>
      </Suspense>
      {locked&&<div className="cr-crosshair" aria-hidden="true">+</div>}
      {sceneError&&<div className="cr-scene-loading" role="alert"><Monitor size={28}/><strong>Reconnect your classroom</strong><p>{sceneError}</p><button className="cr-button cr-primary" onClick={reloadRoom}>Reload room</button><button className="cr-button" onClick={()=>{setQuality('low');reloadRoom();}}>Use low graphics</button><button className="cr-button" onClick={leave}>Exit classroom</button>{!preview&&<Link className="cr-button" to={`/lesson/${day||1}`}>Study in 2D</Link>}</div>}
    </div>
    <header className="cr-hud-top"><div className="cr-hud-brand"><img src="/favicon.svg" alt=""/><span>LUGAISH<small>Classroom · Room 01</small></span></div><nav className="cr-hud-tools" aria-label="Classroom controls"><button className="cr-button cr-glass cr-icon-button" aria-label={fullscreen?'Exit fullscreen':'Enter fullscreen'} title={fullscreenSupported?(fullscreen?'Exit fullscreen':'Fullscreen'):'Fullscreen unavailable in this browser'} disabled={!fullscreenSupported} onClick={()=>{controlsRef.current?.release();setInputError('');fullscreenRef.current?.toggle();}}>{fullscreen?<Minimize size={18}/>:<Maximize size={18}/>}</button><button className="cr-button cr-glass cr-icon-button" aria-label="Settings and controls" onClick={openSettings}><Settings size={18}/></button><button className="cr-button cr-glass" onClick={leave}><DoorOpen size={17}/><span>Exit</span></button></nav></header>
    {!sceneError&&<section className="cr-hud-lesson cr-learning-context" aria-label="Your next learning action"><div><small>{catalogLoading?'Finding your lessons':lecture?'YOUR LEARNING FOCUS':'WELCOME TO YOUR CLASSROOM'}</small><h1>{lecture?.title||'Ready for your next session?'}</h1><p>{media.nativeOnly?'This host supports the personal player. Watch your lesson there.':lecture?`${courseData[course]?.title||course} · Day ${day} · ${lecture.completed?'Video completed':STATUS[phase]}`:preview?'Explore the room. Sign in to access your enrolled lessons.':'Choose an accessible lesson, or bring your work to the library.'}</p></div><div className="cr-context-actions"><button className="cr-button cr-primary" onClick={lecture?openTheater:openCatalog}>{lecture?lecture.completed?'Review Lesson':'Start Learning':'Choose a Lesson'}</button>{lecture&&<button className="cr-button" onClick={openCatalog}>Courses & lessons</button>}{lecture&&courseData[course]?.modules.some(m=>m.lessons.some(l=>Number(l.id.split('-').at(-1))===day&&l.quiz?.length))&&!preview&&<Link className="cr-button" to={`/quiz?day=${day}`}>Lesson practice</Link>}{lecture&&<details className="cr-class-options"><summary>Class presentation</summary>{classControls}</details>}</div></section>}
    <div className="cr-hud-bottom"><div className="cr-hud-movement">{touchOnly?<><TouchControls controlsRef={controlsRef}/><button className="cr-button cr-glass cr-hybrid-walk" onClick={()=>{setCameraMode('third');controlsRef.current?.walk();}}>Keyboard + mouse</button><span className="cr-hud-hint">Drag the scene to look</span></>:<><button className="cr-button cr-glass" onClick={()=>{setCameraMode('third');setInputError('');controlsRef.current?.walk();}}>{locked?'Esc to release':'Explore room'}</button></>}</div><div className="cr-hud-actions"><label className="cr-button cr-glass cr-desk-control"><span>Choose Desk</span><select aria-label="Choose classroom desk" defaultValue="" onFocus={()=>controlsRef.current?.release()} onChange={e=>controlsRef.current?.seat(e.target.value)}><option value="" disabled>100 seats</option>{HALL_SEATS.map((s,i)=><option key={s.id} value={s.id}>Desk {i+1} · Row {s.row+1}</option>)}</select></label><button className="cr-button cr-glass" aria-label="Switch camera view" onClick={()=>{controlsRef.current?.release();setCameraMode(v=>v==='lesson'?'third':'lesson');}}><Camera size={17}/><span>{cameraMode==='lesson'?'Room view':'Lesson view'}</span></button><button className="cr-button cr-glass cr-icon-button" aria-label="Wave hello" onClick={()=>controlsRef.current?.wave()}><Hand size={18}/></button></div></div>
    {(inputError||media.error)&&<aside className="cr-hud-error" role="alert"><p>{inputError||media.error}</p><button className="cr-button" aria-label="Dismiss error" onClick={()=>{setInputError('');setMedia(m=>({...m,error:''}));}}><X size={16}/></button></aside>}
    <dialog ref={catalogRef} className="cr-settings-dialog" aria-labelledby="cr-catalog-title" onClose={()=>setHelp(false)}>
      <div className="cr-settings-heading"><h2 id="cr-catalog-title">Your learning board</h2><button className="cr-button" aria-label="Close learning board" onClick={()=>catalogRef.current.close()}><X size={18}/></button></div>
      <p className="cr-muted">Personal learning · your playback and progress stay independent.</p>
      {!preview&&<label className="cr-field">Course<select value={course} onChange={e=>{stop();actions.switchPathway(e.target.value);}}>{Object.entries(courseData).filter(([id])=>id!=='paid_batch'||paidBatchAvailable).map(([id,data])=><option key={id} value={id}>{data.title}</option>)}</select></label>}
      {!!days.length&&<label className="cr-field">Learning day<select value={day} onChange={e=>{requestEpoch.current++;stop();dispatch('RESET');setDay(Number(e.target.value));setProgressMessage('');}}>{days.map(d=><option key={d.day} value={d.day}>Day {d.day} · {d.title||'Lecture'}</option>)}</select></label>}
      {catalogLoading?<p role="status">Loading accessible lessons…</p>:catalogError?<p role="alert">{catalogError}</p>:lectures.length?<div className="cr-catalog-list">{lectures.map(item=><button key={item.id} className="cr-button" aria-pressed={item.id===selected} onClick={()=>{chooseLecture(item.id);setProgressMessage('');}}><span>{item.title}</span><small>{item.completed?'Completed':item.id===selected?'Selected':'Select'}</small></button>)}</div>:<p className="cr-muted">No accessible video lessons for this day. PDFs, quizzes and other materials remain available in the normal lesson.</p>}
      {catalogError&&<button className="cr-button" onClick={()=>setReloadCatalog(v=>v+1)}>Retry course list</button>}
      {lecture&&<button className="cr-button cr-primary" onClick={()=>{catalogRef.current.close();openTheater();}}>Open selected lesson player</button>}
      {!preview&&<Link className="cr-back" to={`/lesson/${day||1}`} onClick={()=>mediaRef.current?.pause()}>Open full lesson, materials & progress</Link>}
    </dialog>
    <dialog ref={theaterRef} className="cr-theater-dialog" aria-labelledby="cr-theater-title" onClose={()=>{setTheater(false);setHelp(false);}}>
      <div className="cr-settings-heading"><div><small>PERSONAL LEARNING</small><h2 id="cr-theater-title">{lecture?.title||'Lesson player'}</h2></div><button className="cr-button" onClick={()=>theaterRef.current.close()}>Return to 3D <X size={18}/></button></div>
      <div ref={theaterHost} className="cr-theater-media"/>
      <div className="cr-tool-group"><button className="cr-button cr-primary" disabled={!media.ready} onClick={()=>mediaRef.current?.play()}><Play size={16}/>Play / resume</button><button className="cr-button" onClick={()=>mediaRef.current?.pause()}><Pause size={16}/>Pause</button><button className="cr-button" disabled={!fullscreenSupported} onClick={()=>fullscreenRef.current?.toggle()}><Maximize size={16}/>Fullscreen</button>
      {!preview&&!staff&&lecture?.tracksProgress&&<button className="cr-button" disabled={savingProgress||lecture.completed} onClick={saveProgress}>{lecture.completed?'Completed':savingProgress?'Saving…':'Mark video complete'}</button>}</div>
      <p className="cr-muted" role="status">{progressMessage||media.error||'Return to the room anytime. Your saved lesson completion stays intact.'}</p>
      {media.status==='error'&&<button className="cr-button" onClick={reset}>Retry video</button>}
      {(lecture?.completed||phase==='Ended')&&<div className="cr-next-step"><h3>{lecture?.completed?'Video complete. Keep building on it.':'You made time for learning.'}</h3><p>Review your materials, choose another accessible lesson, or practise independently in the Library.</p><div className="cr-tool-group"><Link className="cr-button" to="/daily-lessons">My Classes</Link><Link className="cr-button cr-primary" to={preview?'/study-room-preview':'/study-room'}>Continue in the Library</Link></div></div>}
      {!preview&&<Link className="cr-back" to={`/lesson/${day||1}`} onClick={()=>mediaRef.current?.pause()}>Full lesson & materials</Link>}
    </dialog>
    <dialog ref={settingsRef} className="cr-settings-dialog" aria-labelledby="cr-settings-title" onClose={()=>setHelp(false)} onClick={e=>{if(e.target===settingsRef.current)settingsRef.current.close();}}><div className="cr-settings-heading"><h2 id="cr-settings-title">Classroom settings</h2><button className="cr-button" aria-label="Close settings" onClick={()=>settingsRef.current.close()}><X size={18}/></button></div>
      <p className="cr-muted">{touchOnly?'Use the direction pad to walk. Drag the scene to look around.':'WASD to walk · Shift to run · E to wave. Click Walk around to capture the mouse; Escape releases it.'}</p>
      {!!days.length&&<label className="cr-field">Learning day<select value={day} disabled={CLASS_ACTIVE.has(phase)} onChange={e=>{stop();dispatch('RESET');setDay(Number(e.target.value));setProgressMessage('');}}>{days.map(d=><option key={d.day} value={d.day}>Day {d.day} · {d.title||'Lecture'}</option>)}</select></label>}
      {catalogLoading?<p role="status">Loading your lectures…</p>:catalogError?<div className="cr-error" role="alert">{catalogError}<button className="cr-button" onClick={()=>setReloadCatalog(v=>v+1)}>Retry</button></div>:lectures.length?<label className="cr-field">Projector lecture<select value={selected} disabled={CLASS_ACTIVE.has(phase)} onChange={e=>chooseLecture(e.target.value)}>{lectures.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}</select></label>:<p className="cr-muted">No accessible video lectures yet. You can still explore the room.</p>}
      <label className="cr-field">Camera<select value={cameraMode} onChange={e=>{controlsRef.current?.release();setCameraMode(e.target.value);}}><option value="lesson">Lesson view · unobstructed board</option><option value="third">Room view · third person</option><option value="first">First person</option></select></label>
      <label className="cr-field">Graphics<select value={quality} onChange={e=>setQuality(e.target.value)}><option value="high">Standard · soft shadows</option><option value="low">Low · reduced rendering cost</option></select></label>
      <p className="cr-muted" role="status">{lecture?.title||'Explore the classroom'} · {STATUS[phase]}{media.status==='buffering'?' · Buffering…':''}</p>
      {!fullscreenSupported&&<p className="cr-small">Browser fullscreen is unavailable. The scene still fills your viewport.</p>}
      <div className="cr-tool-group"><button className="cr-button" onClick={()=>controlsRef.current?.recover()}><RotateCcw size={16}/> Return to entrance</button><button className="cr-button" onClick={reloadRoom}>Reload scene</button></div>
      <p className="cr-small">Local classroom session. Use Mark video complete in the theater player to save supported video progress. Day completion remains in the full lesson. Your avatar choice is saved in Learning Spaces.</p>{preview&&<p className="cr-small">Development preview · room only; private paid lessons require enrollment.</p>}
      {stats&&<p className="cr-small">{stats.fps} FPS · {stats.calls} draw calls · {stats.triangles.toLocaleString()} triangles</p>}
      <Link className="cr-back" to={preview?'/learning-spaces-preview':'/learning-spaces'} onClick={()=>{controlsRef.current?.release();mediaRef.current?.pause();}}>Back to campus</Link>
    </dialog>
  </section>;
}

import AmbienceControl from '../study/AmbienceControl.jsx';
import StudyHallPreview from '../study/shared/StudyHallPreview.jsx';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, CloudRain, Coffee, ExternalLink, Maximize2, Minimize2, NotebookPen, Pause, Play, RotateCcw, Square, VolumeX } from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { DeskIllustration } from '../study/DeskIllustration.jsx';
import { useStudySession } from '../study/useStudySession.js';
import { useRainAudio } from '../study/useRainAudio.js';
import { DEFAULT_GOAL, FOCUS_MINUTES, formatClock, formatStudyTime } from '../study/timer.js';
import { SAMPLE_READING, authorizeResource, drivePreviewUrl, loadStudyResources } from '../study/resources.js';
import '../study/study.css';
import { RoomBoundary } from '../study/shared/RoomBoundary.jsx';
import { CharacterSelector } from '../characters/CharacterSelector.jsx';

const SharedRoomPanel = lazy(() => import('../study/shared/SharedRoomPanel.jsx'));
const SEATS = [
  { id: 'window', title: 'Window desk', description: 'Panoramic daylight & campus view.' },
  { id: 'quiet', title: 'Quiet desk', description: 'Grand oak library table for deep focus.' },
  { id: 'lounge', title: 'Reading lounge', description: 'Cozy armchair by the book wall.' },
];

export function StudyRoomPage({ devPreview = false }) {
  const { state } = useAppContext();
  const preview = import.meta.env.DEV && devPreview;
  // Remount account-scoped state on a user/course change so notes cannot cross accounts.
  const scope = preview ? 'local-preview' : `${encodeURIComponent(state.userEmail || 'learner')}:${state.activePathway}`;
  return <StudyWorkspace key={scope} scope={scope} preview={preview} course={state.activePathway} />;
}
function StudyWorkspace({ scope, preview, course }) {
  const location = useLocation();
  const fromEntrance = Boolean(location.state?.fromEntrance);
  const { timer, dispatch, history, notes, setNotes, storageError, retrySaving, remaining, markDone } = useStudySession(scope);
  const rain = useRainAudio();
  const [seat, setSeat] = useState(() => (timer.phase !== 'idle' || fromEntrance ? 'window' : null));
  const [simple, setSimple] = useState(() => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches);
  const [isSeated, setIsSeated] = useState(() => timer.phase !== 'idle' || simple);
  const [instantSeat, setInstantSeat] = useState(false);
  const [graphicsError, setGraphicsError] = useState(false);
  const [focus, setFocus] = useState(false);
  const [shared, setShared] = useState({ active: false, seated: false, controlling: true });
  const [goal, setGoal] = useState(timer.phase==='idle'&&typeof location.state?.studyGoal==='string'?location.state.studyGoal.slice(0,200):timer.kind === 'focus' ? timer.goal : DEFAULT_GOAL);
  const [minutes, setMinutes] = useState(timer.phase==='idle'&&FOCUS_MINUTES.includes(location.state?.studyMinutes)?location.state.studyMinutes:FOCUS_MINUTES.includes(timer.durationMs / 60000) ? timer.durationMs / 60000 : 25);
  const [breakReminder, setBreakReminder] = useState(true);
  const [tab, setTab] = useState('notes');
  const [mode,setMode]=useState('entrance'),[toolsOpen,setToolsOpen]=useState(false);
  const openDesk=useCallback(()=>{setMode('desk');setToolsOpen(false);},[]);
  const openTools=useCallback(()=>{setToolsOpen(true);},[]);
  const changeView=useCallback(value=>{setMode(value);setToolsOpen(false);},[]);
  const [resources, setResources] = useState(preview ? [SAMPLE_READING] : []);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceError, setResourceError] = useState('');
  const [resource, setResource] = useState(null);
  const [retryResources, setRetryResources] = useState(0);
  const requestVersion = useRef(0);
  const pageRef=useRef();
  useEffect(()=>{if(!toolsOpen)return;const previous=document.activeElement;const frame=requestAnimationFrame(()=>pageRef.current?.querySelector('.ls-drawer-heading h2')?.focus());return()=>{cancelAnimationFrame(frame);if(previous?.isConnected)previous.focus();};},[toolsOpen]);
  useEffect(()=>{const header=document.querySelector('.site-header'),bar=pageRef.current?.querySelector('.ls-library-header');const update=()=>pageRef.current?.style.setProperty('--library-top-offset',`${(header?.getBoundingClientRect().height||0)+(bar?.getBoundingClientRect().height||0)}px`);update();const observer=new ResizeObserver(update);if(header)observer.observe(header);if(bar)observer.observe(bar);return()=>observer.disconnect();},[]);
  const busy = ['running', 'paused'].includes(timer.phase);
  const complete = timer.phase === 'complete';
  const taskDone = history.some(item => item.id === timer.id && item.taskDone);
  const totalMs = history.reduce((total, item) => total + item.spentMs, 0);
  const onGraphicsError = useCallback(() => { setGraphicsError(true); setSimple(true); }, []);
  useEffect(() => {
    const original = document.title;
    return () => { document.title = original; };
  }, []);
  useEffect(() => { document.title = `${timer.phase === 'running' ? `${formatClock(remaining)} · ` : ''}Study Room | Lugaish`; }, [remaining, timer.phase]);
  useEffect(() => () => { requestVersion.current++; }, []);
  useEffect(() => {
    if (preview || tab !== 'materials') return;
    let cancelled = false;
    setResourceLoading(true); setResourceError('');
    loadStudyResources(course).then(items => { if (!cancelled) setResources(items); })
      .catch(error => { if (!cancelled) setResourceError(error.message || 'Course materials could not load.'); })
      .finally(() => { if (!cancelled) setResourceLoading(false); });
    return () => { cancelled = true; };
  }, [course, preview, tab, retryResources]);
  const openResource = async item => {
    const version = ++requestVersion.current;
    setResource(null); setResourceError(''); setResourceLoading(true);
    try {
      const accessible = preview ? item : await authorizeResource(course, item);
      if (version === requestVersion.current) setResource(accessible);
    } catch (error) { if (version === requestVersion.current) setResourceError(error.message || 'This material is not available.'); }
    finally { if (version === requestVersion.current) setResourceLoading(false); }
  };
  const isReadyToStudy = shared.seated;
  const start = () => {
    if (!isReadyToStudy || !goal.trim() || !shared.controlling) return;
    if (timer.phase === 'paused') { dispatch({ type: 'START' }); return; }
    dispatch({ type: 'NEW', minutes, goal }); dispatch({ type: 'START' });
  };
  const discardSession = () => {
    if (!window.confirm('Discard this focus session? It will not be added to your study history.')) return;
    dispatch({ type: 'DISCARD', minutes: 25, goal: DEFAULT_GOAL });
    setGoal(DEFAULT_GOAL); setMinutes(25);
  };
  const downloadNotes = () => {
    const url = URL.createObjectURL(new Blob([notes], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'lugaish-study-notes.txt';
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const spacesUrl = preview ? '/learning-spaces-preview' : '/learning-spaces';
  return <section ref={pageRef} className={`ls-page ls-study-page ls-library-page ${focus ? 'ls-is-focused' : ''}`}>
    <div className="ls-library-header"><Link className="ls-back" to={spacesUrl}><ArrowLeft size={16}/>Learning Spaces</Link><div><h1>Study Library</h1><span>{shared.context || 'Choose a desk to begin'}</span></div><div className="ls-library-actions"><AmbienceControl rain={rain}/><button className="ls-button" disabled={!shared.seated} onClick={()=>{setTab('timer');setToolsOpen(true);}}><span role="timer">{formatClock(timer.phase==='idle'?minutes*60000:remaining)}</span> · Focus timer</button></div></div>
    {preview ? <><StudyHallPreview timer={timer} scope={scope} onDesk={openDesk} onTools={openTools} onCloseTools={()=>setToolsOpen(false)} onView={changeView} onState={setShared} viewMode={mode} toolsOpen={toolsOpen}/></> : <RoomBoundary onState={setShared}><Suspense fallback={<p>Preparing study options…</p>}><SharedRoomPanel scope={scope} timer={timer} focus={focus} simple={simple} onState={setShared} onDesk={openDesk} onTools={openTools} onCloseTools={()=>setToolsOpen(false)} onView={changeView} onTable={()=>{setMode('table');setToolsOpen(false);setFocus(false);}} onOverview={()=>{setMode('library');setToolsOpen(false);setFocus(false);}} onFocus={()=>{setFocus(v=>!v);setTab('timer');setToolsOpen(true);}} viewMode={mode} toolsOpen={toolsOpen} /></Suspense></RoomBoundary>}
    {toolsOpen&&<div className="ls-desk-drawer" role="region" aria-label="My desk tools" onKeyDown={e=>{if(e.key==='Escape')setToolsOpen(false);}}><div className="ls-drawer-heading"><h2 tabIndex={-1}>{tab[0].toUpperCase()+tab.slice(1)}</h2><button className="ls-button" onClick={()=>{setToolsOpen(false);setFocus(false);}}>Close tools</button></div><div className="ls-library-tool-tabs" role="group" aria-label="Desk tools">{['notes','timer','goals','materials'].map(tool=><button key={tool} className="ls-button" aria-pressed={tab===tool} onClick={()=>setTab(tool)}>{tool[0].toUpperCase()+tool.slice(1)}</button>)}</div>{storageError && <div className="ls-error" role="alert"><p>{storageError}</p><button className="ls-button" onClick={retrySaving}>Retry saving</button><button className="ls-button" onClick={downloadNotes}>Download notes</button></div>}<div className="ls-study-layout">
      <div className="ls-workspace" hidden={['timer','goals'].includes(tab)}>
        <div className="ls-material-panel">
          <div className="ls-material-tabs" role="tablist" aria-label="Study tools" onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 'notes' : event.key === 'End' ? 'materials' : tab === 'notes' ? 'materials' : 'notes';
            setTab(next); document.getElementById(`study-${next}-tab`)?.focus();
          }}>
            <button id="study-notes-tab" role="tab" tabIndex={tab === 'notes' ? 0 : -1} aria-controls="study-tool-panel" aria-selected={tab === 'notes'} onClick={() => setTab('notes')}><NotebookPen size={17} /> My notebook</button>
            <button id="study-materials-tab" role="tab" tabIndex={tab === 'materials' ? 0 : -1} aria-controls="study-tool-panel" aria-selected={tab === 'materials'} onClick={() => setTab('materials')}><BookOpen size={17} /> Lesson materials</button>
          </div>
          <div id="study-tool-panel" role="tabpanel" aria-labelledby={tab === 'notes' ? 'study-notes-tab' : 'study-materials-tab'} className="ls-tool-content">
            {tab === 'notes' ? <><div className="ls-notebook-heading"><div><h2>A place for your thoughts.</h2><p>New words, useful ideas, questions for your next class.</p></div><span role="status">{storageError ? 'Not saved' : 'Saved on this browser only'}</span></div><label className="ls-sr-only" htmlFor="study-notes">Study notes</label><textarea id="study-notes" className="ls-notebook" maxLength={20000} value={notes} onChange={event => setNotes(event.target.value)} placeholder={'Today I’m learning…\n\nThree things to remember:\n1.\n2.\n3.'} /><p className="ls-inline-note">{notes.length.toLocaleString()} / 20,000 characters · Notes are saved on this device and browser only; they do not sync to other devices.</p></> : <>
              <h2>Keep your reading close.</h2><p className="ls-muted">{preview ? 'Try this short practice activity while your timer runs.' : 'Open an available course PDF beside your timer. You can always use your own book and notebook.'}</p>
              {resourceLoading && <p className="ls-inline-note" role="status">Checking your materials…</p>}
              {resourceError && <div className="ls-error" role="alert">{resourceError}<button className="ls-button" onClick={() => { setResource(null); setRetryResources(value => value + 1); }}>Retry materials</button></div>}
              {!resourceLoading && !resourceError && resources.length === 0 && <p className="ls-inline-note">No PDF materials are available for this course yet. <Link to="/daily-lessons">Open My Classes</Link> for other activities, or use your notebook here.</p>}
              <div className="ls-resource-list">{resources.map(item => <button key={item.id} className="ls-resource-item" aria-pressed={resource?.id === item.id} disabled={resourceLoading} onClick={() => openResource(item)}><BookOpen size={18} /><span>{item.title}</span><ArrowRight size={16} /></button>)}</div>
              {resource?.type === 'reading' && <article className="ls-reading"><p className="ls-eyebrow">READ · THINK · PRACTISE</p><h3>A clear introduction</h3><p>A useful introduction can be short. Say your name, share a little about your work or studies, and explain what you are learning. Add one interest that makes the conversation personal.</p><blockquote>“Hi, I’m Sami. I study business and I’m improving my English for work. In my free time, I enjoy cooking with my family.”</blockquote><h4>Your turn</h4><ol><li>Write your own introduction in the notebook.</li><li>Underline three useful words or phrases.</li><li>Read it aloud once, then try again without looking.</li></ol><button className="ls-button" onClick={() => setTab('notes')}><NotebookPen size={16} /> Write my introduction</button></article>}
              {resource?.url && <div className="ls-pdf-viewer"><div><strong>{resource.title}</strong><a href={resource.url} target="_blank" rel="noopener noreferrer">Open in new tab <ExternalLink size={14} /></a></div>{drivePreviewUrl(resource.url) && <iframe key={resource.id} src={drivePreviewUrl(resource.url)} title={resource.title} allow="fullscreen" referrerPolicy="strict-origin-when-cross-origin" />}<p className="ls-inline-note">If the PDF cannot be displayed or asks you to sign in, use “Open in new tab”. Your focus timer continues while you read.</p></div>}
            </>}
          </div>
        </div>
      </div>
      <aside className="ls-study-sidebar" hidden={!['timer','goals'].includes(tab)}>
        <fieldset className="ls-timer-card" disabled={!shared.controlling || !isReadyToStudy}>
          <p className="ls-eyebrow">{timer.kind === 'break' ? 'A MOMENT TO RESET' : 'ONE THING AT A TIME'}</p><h2>{timer.kind === 'break' ? 'Take a breath.' : complete ? 'You made time.' : 'Your focus session'}</h2>
          {!busy && !complete && <div className="ls-session-setup">
            <label htmlFor="study-goal">What will you work on?</label><input id="study-goal" maxLength={200} value={goal} onChange={event => setGoal(event.target.value)} placeholder="One small, achievable goal" />
            <div className="ls-goal-presets"><button onClick={() => setGoal(DEFAULT_GOAL)}>Read a lesson</button><button onClick={() => setGoal('Review 10 words and use each one in a sentence.')}>Review vocabulary</button><button onClick={() => { setGoal(''); document.getElementById('study-goal')?.focus(); }}>My own goal</button></div>
            <span className="ls-field-label">How long?</span><div className="ls-duration-options" role="group" aria-label="Focus duration">{FOCUS_MINUTES.map(value => <button key={value} aria-pressed={minutes === value} onClick={() => setMinutes(value)}>{value}<small>min</small></button>)}</div>
          </div>}
          {(busy || complete) && <p className="ls-current-goal">{timer.goal}</p>}
          <div className="ls-timer-dial" style={{ '--study-progress': `${timer.phase === 'idle' ? 0 : (1 - remaining / timer.durationMs) * 100}%` }}><span className="ls-timer-number" role="timer" aria-label="Time remaining">{formatClock(timer.phase === 'idle' ? minutes * 60000 : remaining)}</span><span className="ls-timer-state">{timer.phase === 'idle' ? 'Ready when you are' : timer.phase === 'running' ? timer.kind === 'break' ? 'Resting' : 'Time to focus' : timer.phase === 'paused' ? 'Paused · take your time' : 'Session finished'}</span></div>
          <p className="ls-inline-note">Your focus time: <strong>{formatClock(timer.kind === 'focus' ? timer.durationMs - remaining : history[0]?.spentMs || 0)}</strong> · Excludes pauses and breaks.</p>
          {timer.phase === 'idle' && <><button className="ls-button ls-primary ls-full" disabled={!isReadyToStudy || !goal.trim()} onClick={start}><Play size={16} /> Start studying</button>{!isReadyToStudy && <p className="ls-inline-note">{seat && !isSeated ? 'Finding your seat at the desk…' : 'Choose a library chair first.'}</p>}</>}
          {busy && <div className="ls-timer-actions"><button className="ls-button ls-primary" onClick={() => dispatch({ type: timer.phase === 'running' ? 'PAUSE' : 'START' })}>{timer.phase === 'running' ? <Pause size={16} /> : <Play size={16} />}{timer.phase === 'running' ? 'Pause' : 'Resume'}</button><button className="ls-button" onClick={() => dispatch({ type: 'FINISH' })}><Square size={14} /> {timer.kind === 'break' ? 'End break' : 'Finish session'}</button>{timer.kind === 'focus' && <button className="ls-button ls-discard" onClick={discardSession}>Discard session</button>}</div>}
          {complete && <div className="ls-session-summary" role="status">
            {timer.kind === 'focus' ? <><p><strong>Great work. {formatStudyTime(timer.durationMs - timer.remainingMs)} of focus time recorded.</strong></p><button className="ls-button ls-full" disabled={taskDone} onClick={markDone}><CheckCircle2 size={16} />{taskDone ? 'Task marked done' : 'Mark my task done'}</button>{breakReminder && <button className="ls-button ls-full" onClick={() => dispatch({ type: 'BREAK' })}><Coffee size={16} /> Take a 5-minute break</button>}</> : <p>Your break is over. Ready for another small step?</p>}
            <button className="ls-button ls-primary ls-full" onClick={() => { dispatch({ type: 'NEW', minutes, goal }); }}><RotateCcw size={16} /> Continue Studying</button><Link className="ls-button ls-full" to={spacesUrl}>Return to Campus</Link>
          </div>}
          {!focus && <label className="ls-checkbox"><input type="checkbox" checked={breakReminder} onChange={event => setBreakReminder(event.target.checked)} /> Offer a break after each session</label>}
          <p className="ls-timer-note">{timer.phase === 'running' ? 'The timer continues in other tabs and after a refresh. Pause it when you step away.' : 'Focus time is a personal timer, not a course completion score.'}</p>
        </fieldset>
        <div className="ls-sound-card ls-hide-in-focus"><div><CloudRain size={20} /><div><h3>A little atmosphere</h3><p>Silent by default. Sound is optional.</p></div></div><button className="ls-button ls-full" aria-pressed={rain.enabled} onClick={rain.toggle}>{rain.enabled ? <VolumeX size={16} /> : <CloudRain size={16} />}{rain.enabled ? 'Turn rain off' : 'Play soft rain'}</button>{rain.enabled && <label className="ls-volume">Rain volume<input type="range" min="0" max="100" value={rain.volume} onChange={event => rain.setVolume(Number(event.target.value))} /></label>}{rain.error && <p className="ls-inline-note" role="status">{rain.error}</p>}</div>
        <div className="ls-history-card ls-hide-in-focus"><p className="ls-eyebrow">YOUR RECENT STUDY TIME</p><h3>{history.length ? `${formatStudyTime(totalMs)} across ${history.length} ${history.length === 1 ? 'session' : 'sessions'}` : 'Small sessions add up.'}</h3><p className="ls-muted">Saved on this browser. No streaks to keep up with.</p>{history.length === 0 ? <p className="ls-inline-note">Your first finished session will appear here.</p> : <ul>{history.slice(0, 3).map(item => <li key={item.id}><span>{item.goal}</span><small>{formatStudyTime(item.spentMs)} · {item.taskDone ? 'Task done' : 'Time saved'}</small></li>)}</ul>}</div>
      </aside>
    </div>
    </div>}
    {storageError && !toolsOpen && <div className="ls-error" role="alert"><p>{storageError}</p><button className="ls-button" onClick={retrySaving}>Retry saving</button><button className="ls-button" onClick={downloadNotes}>Download notes</button></div>}
  </section>;
}

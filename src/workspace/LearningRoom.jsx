import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BookOpen, Check, CheckCircle2, CloudRain, Coffee, Download, Expand, FileText, Headphones, Minimize2, NotebookPen, Pause, Play, Plus, RotateCcw, Square, Target, Trash2, Video, VolumeX } from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { useStudySession } from '../study/useStudySession.js';
import { useRainAudio } from '../study/useRainAudio.js';
import { FOCUS_MINUTES, formatClock, formatStudyTime } from '../study/timer.js';
import { cleanWorkspace, DAILY_TARGETS, calendarDay, studySummary } from './workspaceState.js';
import { VideoStudyPanel } from './VideoStudyPanel.jsx';
import './learning-room.css';

export function LearningRoom({ kind = 'study' }) {
  const { state } = useAppContext();
  const scope = state.isLoggedIn ? `independent:${encodeURIComponent(state.userEmail)}` : 'independent:guest';
  return <Workspace key={scope} scope={scope} classroom={kind === 'classroom'} signedIn={state.isLoggedIn}/>;
}
function Workspace({ scope, classroom, signedIn }) {
  const location = useLocation();
  const study = useStudySession(scope);
  const { timer, dispatch, remaining, history, notes, setNotes, storageError, retrySaving, markDone } = study;
  const preferenceKey = `lugaish-workspace-v1:${scope}`;
  const [initial] = useState(() => { try { return cleanWorkspace(JSON.parse(localStorage.getItem(preferenceKey) || 'null')); } catch { return cleanWorkspace(null); } });
  const [workspace, setWorkspace] = useState(initial), [preferenceError, setPreferenceError] = useState('');
  const [goal, setGoal] = useState(timer.kind === 'focus' && timer.phase !== 'idle' ? timer.goal : typeof location.state?.studyGoal === 'string' ? location.state.studyGoal.slice(0, 200) : 'Make progress on one thing I’m learning.');
  const [minutes, setMinutes] = useState(FOCUS_MINUTES.includes(location.state?.studyMinutes) ? location.state.studyMinutes : FOCUS_MINUTES.includes(timer.durationMs / 60000) ? timer.durationMs / 60000 : 25);
  const [task, setTask] = useState(''), [focus, setFocus] = useState(false), [tab, setTab] = useState('notes');
  const [pdf, setPdf] = useState(null), [fileError, setFileError] = useState('');
  const fileInput = useRef(null), notesRef = useRef(null);
  const rain = useRainAudio();
  const dayKey = calendarDay();
  const summary = useMemo(() => studySummary(history), [history, dayKey]);
  const busy = timer.phase === 'running' || timer.phase === 'paused';
  const done = timer.phase === 'complete';
  const progress = Math.min(100, summary.today.spentMs / (workspace.target * 60000) * 100);
  const roomName = classroom ? 'Classroom' : 'Study Room';
  useEffect(() => {
    try { localStorage.setItem(preferenceKey, JSON.stringify(workspace)); setPreferenceError(''); }
    catch { setPreferenceError('Your checklist and daily target could not be saved in this browser. Keep this tab open and export your notes before leaving.'); }
  }, [preferenceKey, workspace]);
  useEffect(() => () => { if (pdf) URL.revokeObjectURL(pdf.url); }, [pdf]);
  useEffect(() => { document.title = `${timer.phase === 'running' ? `${formatClock(remaining)} · ` : ''}${roomName} | Lugaish`; }, [timer.phase, remaining, roomName]);
  function start() {
    if (!goal.trim() || timer.phase === 'running') return;
    if (timer.phase === 'paused') { dispatch({ type: 'START' }); return; }
    dispatch({ type: 'NEW', minutes, goal }); dispatch({ type: 'START' });
  }
  function addTask(event) {
    event.preventDefault();
    if (!task.trim() || workspace.tasks.length >= 12) return;
    setWorkspace(current => ({ ...current, tasks: [...current.tasks, { id: crypto.randomUUID(), text: task.trim().slice(0, 200), done: false }] })); setTask('');
  }
  function exportNotes() {
    const url = URL.createObjectURL(new Blob([notes], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `lugaish-notes-${calendarDay()}.txt`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function openPdf(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) { setFileError('Choose a PDF document.'); return; }
    if (file.size > 25 * 1024 * 1024) { setFileError('Choose a PDF smaller than 25 MB.'); return; }
    try { setPdf({ name: file.name, url: URL.createObjectURL(file) }); setFileError(''); setTab('reading'); }
    catch { setFileError('This browser could not open the PDF. Please try another file.'); }
  }
  return <section className={`learning-room ${classroom ? 'lr-classroom' : 'lr-study'} ${focus ? 'lr-focused' : ''}`} aria-labelledby="lr-title">
    <header className="lr-room-toolbar"><Link to="/learning-spaces" className="lr-text-link"><ArrowLeft size={14}/> Campus</Link><div className="lr-room-switch" aria-label="Choose your workspace"><Link to="/study-room" aria-current={!classroom ? 'page' : undefined}><BookOpen size={14}/>Study Room</Link><Link to="/classroom" aria-current={classroom ? 'page' : undefined}><Video size={14}/>Classroom</Link></div><button className="lr-button lr-focus-toggle" aria-pressed={focus} onClick={() => setFocus(value => !value)}>{focus ? <Minimize2 size={15}/> : <Expand size={15}/>} {focus ? 'Exit focus view' : 'Focus view'}</button></header>
    <div className="lr-room-hero"><div><p className="lr-eyebrow">YOUR SPACE. YOUR SUBJECT. YOUR PACE.</p><h1 id="lr-title">{classroom ? 'Make time for what you want to learn.' : 'Your own quiet corner.'}</h1><p>{classroom ? 'Watch a lesson, bring your own learning video, and turn what you learn into notes.' : 'Bring a book, a project, or a question. Settle in and take one small step forward.'}</p><div className="lr-hero-tags"><span><Check size={13}/> Free to use</span><span><Check size={13}/> No course enrollment needed</span><span><Check size={13}/> Ready when you are</span></div></div><div className="lr-room-picture" aria-hidden="true"><img src={classroom ? '/images/campus/classroom.jpg' : '/images/campus/library-arrival.webp'} alt=""/><span>{classroom ? 'YOUR PERSONAL LEARNING SCREEN' : 'A LITTLE QUIET. A LITTLE PROGRESS.'}</span></div></div>
    {!signedIn && <p className="lr-guest-note">You can start right here. Your notes and progress stay in this browser, separately from signed-in accounts.</p>}
    {(storageError || preferenceError) && <div className="lr-storage-warning" role="alert"><p>{storageError || preferenceError}</p><button className="lr-button" onClick={retrySaving}>Retry notes & timer saving</button><button className="lr-button" onClick={exportNotes}>Export notes</button></div>}
    <div className="lr-grid"><div className="lr-main-column">
      {classroom && <VideoStudyPanel watched={workspace.watched} onWatched={id => setWorkspace(current => ({ ...current, watched: current.watched.includes(id) ? current.watched.filter(item => item !== id) : [...current.watched, id] }))}/>}
      <section className="lr-card lr-notebook-card" aria-labelledby="lr-notes-title"><div className="lr-card-heading"><div><span className="lr-eyebrow">LEAVE WITH SOMETHING YOU LEARNED</span><h2 id="lr-notes-title">Your desk</h2></div><span className="lr-save-state" role="status">{storageError ? 'Saving unavailable' : 'Saved in this browser'}</span></div><div className="lr-desk-tabs" role="group" aria-label="Desk tools"><button aria-pressed={tab === 'notes'} onClick={() => setTab('notes')}><NotebookPen size={15}/> Notebook</button><button aria-pressed={tab === 'reading'} onClick={() => setTab('reading')}><FileText size={15}/> My PDF</button><button className="lr-export" onClick={exportNotes}><Download size={15}/> Export notes</button></div>
        {tab === 'notes' ? <div className="lr-notebook-body"><label htmlFor="lr-notes">Capture an idea, work through a problem, or write a question for later.</label><textarea ref={notesRef} id="lr-notes" value={notes} maxLength={20000} onChange={event => setNotes(event.target.value)} placeholder={'What am I learning today?\n\nOne idea to remember…\nOne question to explore…\nMy next step…'}/><div className="lr-notebook-footer"><span>{notes.length.toLocaleString()} / 20,000 characters</span><span>Your notes are private to this browser and account.</span></div></div> : <div className="lr-reading-body"><div className="lr-reading-heading"><div><h3>{pdf ? pdf.name : 'Bring your own reading.'}</h3><p>Open a PDF from your device. It stays on your device and is not uploaded.</p></div><button className="lr-button" onClick={() => fileInput.current.click()}>{pdf ? 'Change PDF' : 'Choose a PDF'}</button></div>{pdf ? <><iframe src={pdf.url} title={`Your PDF: ${pdf.name}`} className="lr-pdf-frame"/><div className="lr-video-controls"><a href={pdf.url} target="_blank" rel="noopener noreferrer" className="lr-text-link">Open PDF in a new tab <ArrowUpRight size={14}/></a><button className="lr-button" onClick={() => setPdf(null)}>Close PDF</button></div><p className="lr-fine">Select your PDF again after a refresh. Your notebook and timer remain saved.</p></> : <div className="lr-reading-empty"><BookOpen size={32}/><p>A textbook, lecture handout, or something you’re curious about.</p><small>PDF · up to 25 MB</small></div>}{fileError && <p role="alert" className="lr-error">{fileError}</p>}</div>}
        <input ref={fileInput} type="file" hidden aria-label="Choose a personal PDF" onChange={openPdf}/>
      </section>
      <section className="lr-card lr-recap"><div className="lr-card-heading"><div><span className="lr-eyebrow">SMALL SESSIONS ADD UP</span><h2>Your week, one session at a time.</h2></div><span className="lr-chip">Last 7 days</span></div><div className="lr-week-chart" aria-label="Focus time in sessions completed over the last seven days">{summary.days.map(day => <div key={day.key} title={`${day.label}: ${day.spentMs ? formatStudyTime(day.spentMs) : 'No finished sessions'}`}><span>{Math.floor(day.spentMs / 60000)}<small>m</small></span><div className="lr-week-track"><i data-active={day.spentMs > 0} style={{ height: `${Math.max(5, Math.min(100, day.spentMs / (workspace.target * 60000) * 100))}%` }}/></div><small>{day.label}</small></div>)}</div><p className="lr-fine">Based on finished personal timer sessions in this browser. Pauses and breaks are excluded.</p>{history.length > 0 && <details className="lr-recent"><summary>Recent sessions</summary><ul>{history.slice(0, 5).map(item => <li key={item.id}><CheckCircle2 size={15}/><span>{item.goal}<small>{new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(item.completedAt))}</small></span><strong>{formatStudyTime(item.spentMs)}</strong></li>)}</ul></details>}</section>
    </div><aside className="lr-side-column" aria-label="Focus tools">
      <section className="lr-card lr-focus-card" aria-labelledby="lr-focus-title"><div className="lr-card-heading"><div><span className="lr-eyebrow">ONE THING AT A TIME</span><h2 id="lr-focus-title">{timer.kind === 'break' ? 'A little room to breathe.' : 'Your focus session'}</h2></div><span className="lr-small-dot" data-running={timer.phase === 'running'}/></div>
        {!busy && !done && <><label htmlFor="lr-goal" className="lr-field-label">What will you work on?</label><input id="lr-goal" value={goal} maxLength={200} onChange={event => setGoal(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) start(); }}/><div className="lr-duration-options" role="group" aria-label="Focus duration">{FOCUS_MINUTES.map(value => <button key={value} aria-pressed={minutes === value} onClick={() => setMinutes(value)}>{value}<small> min</small></button>)}</div></>}
        {(busy || done) && <p className="lr-active-goal">{timer.goal}</p>}
        {!busy && !done && <button className="lr-button lr-primary lr-full" disabled={!goal.trim()} onClick={start}><Play size={16}/>Start focus session</button>}
        <div className="lr-clock"><span role="timer" aria-label="Time remaining">{formatClock(timer.phase === 'idle' ? minutes * 60000 : remaining)}</span><small>{timer.phase === 'running' ? timer.kind === 'break' ? 'TAKE A BREATH' : 'YOU’VE MADE A START' : timer.phase === 'paused' ? 'PAUSED · READY WHEN YOU ARE' : done ? 'SESSION FINISHED' : 'NO PERFECT MOMENT NEEDED'}</small></div>
        {busy && <div className="lr-timer-actions"><button className="lr-button lr-primary" onClick={() => dispatch({ type: timer.phase === 'running' ? 'PAUSE' : 'START' })}>{timer.phase === 'running' ? <Pause size={15}/> : <Play size={15}/>} {timer.phase === 'running' ? 'Pause' : 'Resume'}</button><button className="lr-button" onClick={() => dispatch({ type: 'FINISH' })}><Square size={14}/>Finish & save</button></div>}
        {done && <div className="lr-finished" role="status"><p>{timer.kind === 'focus' ? `${formatStudyTime(timer.durationMs - timer.remainingMs)} of focus time recorded. A little progress is still progress.` : 'Break finished. Ready for your next small step?'}</p>{timer.kind === 'focus' && <><button className="lr-button lr-full" onClick={markDone} disabled={history.some(item => item.id === timer.id && item.taskDone)}><CheckCircle2 size={15}/>{history.some(item => item.id === timer.id && item.taskDone) ? 'Goal marked done' : 'I finished my goal'}</button><button className="lr-button lr-full" onClick={() => dispatch({ type: 'BREAK' })}><Coffee size={15}/>Take a 5-minute break</button></>}<button className="lr-button lr-primary lr-full" onClick={() => dispatch({ type: 'NEW', minutes, goal })}><RotateCcw size={15}/>Set up next session</button></div>}
        <p className="lr-fine">The timer follows the clock across tabs and refreshes. Pause when you step away.</p>
      </section>
      <section className="lr-card lr-target-card"><div className="lr-card-heading"><h2><Target size={17}/>Your daily intention</h2><label className="lr-sr-only" htmlFor="lr-daily-target">Daily focus target</label><select id="lr-daily-target" value={workspace.target} onChange={event => setWorkspace(current => ({ ...current, target: Number(event.target.value) }))}>{DAILY_TARGETS.map(value => <option key={value} value={value}>{value} min</option>)}</select></div><div className="lr-target-number"><strong>{Math.floor(summary.today.spentMs / 60000)}<small> / {workspace.target} min</small></strong><span>{summary.today.count} finished {summary.today.count === 1 ? 'session' : 'sessions'}</span></div><progress value={progress} max="100" aria-label="Progress toward daily focus target"/><p className="lr-fine">{progress >= 100 ? 'You made time for yourself today. Well done.' : 'Recorded from sessions finished today. Your own pace is enough.'}</p></section>
      <section className="lr-card lr-task-card"><div className="lr-card-heading"><h2>Your study checklist</h2><span className="lr-chip">{workspace.tasks.filter(item => item.done).length}/{workspace.tasks.length}</span></div><form onSubmit={addTask}><label className="lr-sr-only" htmlFor="lr-task">Add a study task</label><input id="lr-task" value={task} maxLength={200} onChange={event => setTask(event.target.value)} placeholder="One small next step…"/><button type="submit" className="lr-button" disabled={!task.trim() || workspace.tasks.length >= 12} aria-label="Add task"><Plus size={17}/></button></form>{workspace.tasks.length ? <ul>{workspace.tasks.map(item => <li key={item.id}><label><input type="checkbox" checked={item.done} onChange={() => setWorkspace(current => ({ ...current, tasks: current.tasks.map(old => old.id === item.id ? { ...old, done: !old.done } : old) }))}/><span className={item.done ? 'lr-task-done' : ''}>{item.text}</span></label><button aria-label={`Remove task: ${item.text}`} onClick={() => setWorkspace(current => ({ ...current, tasks: current.tasks.filter(old => old.id !== item.id) }))}><Trash2 size={14}/></button></li>)}</ul> : <p className="lr-fine">Break a big topic into small, doable steps. Your checklist will be here when you come back.</p>}{workspace.tasks.length >= 12 && <p className="lr-fine">12 tasks is plenty. Clear a finished task to add another.</p>}</section>
      <section className="lr-card lr-ambience-card"><div className="lr-card-heading"><h2><Headphones size={17}/>A little atmosphere</h2><button className="lr-button" aria-pressed={rain.enabled} disabled={rain.status === 'loading'} onClick={rain.toggle}>{rain.enabled ? <VolumeX size={15}/> : <CloudRain size={15}/>} {rain.status === 'loading' ? 'Loading…' : rain.enabled ? 'Rain off' : 'Play rain'}</button></div>{rain.enabled && <label className="lr-volume">Volume<input type="range" min="0" max="100" value={rain.volume} onChange={event => rain.setVolume(Number(event.target.value))}/></label>}<p className="lr-fine">Silent until you choose otherwise.</p>{rain.error && <p className="lr-error" role="status">{rain.error}</p>}</section>
      <div className="lr-immersive-link"><Link to={classroom ? '/classroom/immersive' : '/study-room/library'}>Explore the 3D {classroom ? 'classroom' : 'library'} <ArrowUpRight size={15}/></Link><p>Optional · sign in for immersive rooms and shared study features. No course enrollment needed for your workspace.</p></div>
    </aside></div>
    <footer className="lr-room-footer"><span><CheckCircle2 size={14}/>Made room for a little progress.</span><Link to={classroom ? '/study-room' : '/classroom'}>{classroom ? 'Continue in the Study Room' : 'Watch a lesson in Classroom'} <ArrowUpRight size={14}/></Link></footer>
  </section>;
}

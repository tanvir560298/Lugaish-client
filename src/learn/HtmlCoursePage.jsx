import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Check, CheckCircle2, ArrowLeft, ArrowRight, BookOpen, FileText, ExternalLink, Clock, Sparkles, RotateCcw, LockKeyhole, ChevronDown, Code2 } from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { useTanuPlayback } from '../tanu/GuidedSession.jsx';
import { createYouTubeLoader } from '../classroom/youtubeApi.js';
import { allHtmlLessons, htmlModules, cleanHtmlProgress, isHtmlLessonUnlocked } from './htmlContent.js';
import { htmlProgressKey, recordPlayback, watchedFraction, canCompletePlayback } from './htmlWatchProgress.js';
import './html-learning-workspace.css';
const loadYouTube = createYouTubeLoader({ window, document, setTimeout, clearTimeout });
const curriculum = {
  '00': {
    takeaways: ['AI ব্যবহার করেও কেন ওয়েব ডেভেলপমেন্টের ভিত্তি জানা প্রয়োজন।', 'HTML, CSS ও JavaScript কীভাবে একসঙ্গে একটি ওয়েবসাইট তৈরি করে।', 'ছোট ছোট ধাপে শিখে নিজের হাতে কাজ করার মানসিকতা।'],
    notes: ['প্রতিটি lesson বুঝে দেখুন। কোনো অংশ অস্পষ্ট হলে pause করে আবার শুনুন।', 'AI-কে সহযোগী হিসেবে ব্যবহার করুন। তৈরি করা code কেন কাজ করে, সেটিও বুঝতে চেষ্টা করুন।', 'ভিডিও শেষ হলে পরের lesson-এ HTML-এর প্রথম ধারণা শিখবেন।']
  },
  'day-1': {
    takeaways: ['HTML-এর পূর্ণরূপ HyperText Markup Language।', 'HTML ওয়েবপেজের content ও structure নির্ধারণ করে।', 'ব্রাউজার HTML পড়ে heading, paragraph ও অন্যান্য element দেখায়।'],
    notes: ['HTML একটি markup language। এটি দিয়ে পেজের গঠন বর্ণনা করা হয়।', '<h1> দিয়ে প্রধান শিরোনাম এবং <p> দিয়ে অনুচ্ছেদ বোঝানো যায়।', 'এখনই code মুখস্থ করার প্রয়োজন নেই। আগে একটি ওয়েবপেজ কীভাবে গঠিত হয়, সেই ধারণাটি পরিষ্কার করুন।']
  }
};
function readCompleted(key) {
  try {
    const ids = cleanHtmlProgress(JSON.parse(localStorage.getItem(key) || '[]'));
    // Ignore out-of-order or stale marks.
    return allHtmlLessons.filter((lesson, i) => allHtmlLessons.slice(0, i + 1).every(l => ids.includes(l.id))).map(l => l.id);
  } catch { return []; }
}
function HtmlPlayer({ video, storageKey, onCompleted, onProgress, onStorageError }) {
  const host = useRef(null);
  const player = useRef(null);
  const report = useTanuPlayback();
  const [version, setVersion] = useState(0);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const callbacks = useRef({ onCompleted, onProgress, onStorageError });
  callbacks.current = { onCompleted, onProgress, onStorageError };
  useEffect(() => {
    if (!started) return undefined;
    let coverage = [];
    try { coverage = JSON.parse(localStorage.getItem(`${storageKey}:coverage:${video.id}`) || '[]'); } catch { /* Start fresh if unavailable. */ }
    let previous = null, previousWall = null, lastSave = 0, playbackEnded = false;
    const saveCoverage = () => {
      try { localStorage.setItem(`${storageKey}:coverage:${video.id}`, JSON.stringify(coverage)); }
      catch { callbacks.current.onStorageError(); }
    };
    const sample = () => {
      const current = player.current?.getCurrentTime?.() ?? 0;
      const duration = player.current?.getDuration?.() ?? 0;
      const wall = performance.now() / 1000;
      if (!document.hidden && player.current?.getPlayerState?.() === 1) {
        if (previous !== null) coverage = recordPlayback(coverage, previous, current, duration, wall - previousWall);
        previous = current; previousWall = wall;
      } else { previous = null; previousWall = null; }
      if (duration > 0) callbacks.current.onProgress(watchedFraction(coverage, duration));
      if (wall - lastSave > 3) { saveCoverage(); lastSave = wall; }
      return { current, duration };
    };
    const watchTimer = setInterval(sample, 500);
    let cancelled = false;
    let instance;
    setStatus('loading');
    setError('');

    const publish = (newStatus) => {
      setStatus(newStatus);
      report?.({
        id: video.id,
        course: video.course,
        status: newStatus,
        pause: () => player.current?.pauseVideo?.()
      });
    };

    const timer = setTimeout(() => {
      if (!cancelled) {
        setError('The video did not become ready. Retry or open the original YouTube link.');
        publish('error');
      }
    }, 30000);

    loadYouTube().then((YT) => {
      if (cancelled) return;
      const mount = document.createElement('div');
      mount.style.width = '100%';
      mount.style.height = '100%';
      host.current?.replaceChildren(mount);

      instance = new YT.Player(mount, {
        videoId: video.youtubeId,
        width: '100%',
        height: '100%',
        playerVars: {
          playsinline: 1,
          autoplay: 1,
          rel: 0,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            clearTimeout(timer);
            setError('');
            publish('ready');
          },
          onStateChange: ({ data }) => {
            if (cancelled) return;
            if (data === 1) {
              playbackEnded = false;
              previous = instance.getCurrentTime(); previousWall = performance.now() / 1000;
            } else if (data === 0 && !playbackEnded) {
              playbackEnded = true;
              const current = instance.getCurrentTime(), duration = instance.getDuration();
              if (previous !== null && !document.hidden) coverage = recordPlayback(coverage, previous, current, duration, performance.now() / 1000 - previousWall);
              saveCoverage();
              callbacks.current.onProgress(watchedFraction(coverage, duration));
              if (canCompletePlayback(coverage, duration, current)) callbacks.current.onCompleted(video.id);
              previous = null; previousWall = null;
            } else { previous = null; previousWall = null; }
            publish(data === 1 ? 'playing' : data === 0 ? 'ended' : data === 2 ? 'paused' : 'buffering');
          },
          onError: () => {
            if (cancelled) return;
            clearTimeout(timer);
            setError('YouTube could not play this video here. Open the original source or retry.');
            publish('error');
          }
        }
      });
      player.current = instance;
    }).catch(() => {
      if (!cancelled) {
        clearTimeout(timer);
        setError('YouTube could not load. Check your connection or open the source link.');
        publish('error');
      }
    });

    const pause = () => {
      if (document.hidden) player.current?.pauseVideo?.();
    };
    document.addEventListener('visibilitychange', pause);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(watchTimer);
      saveCoverage();
      document.removeEventListener('visibilitychange', pause);
      report?.(null);
      player.current = null;
      try {
        instance?.destroy?.();
      } catch {
        // Safe destroy ignore
      }
    };
  }, [video.id, video.youtubeId, video.course, version, report, storageKey, started]);

  if (!started) return <button type="button" className="hl-lesson-poster" onClick={() => setStarted(true)} aria-label={`Start lesson: ${video.title}`}>
    {video.id === '00' ? <img src="/images/webdev-day0.jpg" alt=""/> : <span className="hl-html-poster-art" aria-hidden="true"><span>&lt;html&gt;</span><strong>What is <em>HTML?</em></strong><small>THE STRUCTURE BEHIND EVERY WEB PAGE</small><span>&lt;/html&gt;</span></span>}
    <span className="hl-poster-shade"/><span className="hl-poster-action"><span className="hl-poster-play"><Play size={26} fill="currentColor"/></span><strong>Start lesson</strong><small>{video.duration} · Learn at your pace</small></span>
  </button>;
  return (
    <div className="hl-player-wrapper" aria-label={`Video player: ${video.title}`}>
      <div className="hl-player-frame" ref={host} />
      {(status === 'loading' || error) && (
        <div className="hl-player-overlay" role={error ? 'alert' : 'status'}>
          {error ? (
            <>
              <div className="hl-player-error-icon" aria-hidden="true">⚠️</div>
              <strong>Video unavailable</strong>
              <p>{error}</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="hl-btn-nav-next"
                  onClick={() => setVersion((v) => v + 1)}
                >
                  <RotateCcw size={15} /> Try again
                </button>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hl-btn-nav-prev"
                >
                  <ExternalLink size={15} /> Open on YouTube
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="hl-player-spinner" aria-hidden="true" />
              <strong>Loading lesson video…</strong>
              <p>Preparing your class streaming from YouTube.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}


export function HtmlCoursePage() {
  const { videoId } = useParams();
  const { state } = useAppContext();
  const scope = state.isLoggedIn ? state.userEmail : 'guest';
  return <HtmlCourseWorkspace key={`${scope}:${videoId || 'start'}`} videoId={videoId} scope={scope} />;
}
function HtmlCourseWorkspace({ videoId, scope }) {
  const storageKey = htmlProgressKey(scope);
  const [completed, setCompleted] = useState(() => readCompleted(storageKey));
  const [initialId] = useState(() => videoId || allHtmlLessons.find(l => !completed.includes(l.id))?.id || '00');
  const lesson = allHtmlLessons.find(l => l.id === initialId);
  const [tab, setTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(true);
  const [fraction, setFraction] = useState(0);
  const [storageError, setStorageError] = useState(false);
  const index = allHtmlLessons.findIndex(l => l.id === initialId);
  const unlocked = lesson && isHtmlLessonUnlocked(lesson.id, completed);
  const done = completed.includes(initialId);
  const next = allHtmlLessons[index + 1];
  const previous = allHtmlLessons[index - 1];
  const complete = id => {
    if (!isHtmlLessonUnlocked(id, completed)) return;
    setCompleted(current => {
      const updated = cleanHtmlProgress([...current, id]);
      try { localStorage.setItem(storageKey, JSON.stringify(updated)); }
      catch { setStorageError(true); }
      return updated;
    });
  };
  // Stay in sync with another tab on this browser and account.
  useEffect(() => {
    const sync = e => { if (e.key === storageKey || e.key === null) setCompleted(readCompleted(storageKey)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [storageKey]);
  const tabs = [['overview', 'Lesson overview', BookOpen], ['notes', 'Study notes', FileText], ['resources', 'Resources', ExternalLink]];
  const onTabKey = event => {
    const at = tabs.findIndex(t => t[0] === tab);
    const target = event.key === 'ArrowRight' ? (at + 1) % tabs.length : event.key === 'ArrowLeft' ? (at + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
    if (target >= 0) { event.preventDefault(); setTab(tabs[target][0]); document.getElementById(`hl-tab-${tabs[target][0]}`)?.focus(); }
  };
  return <div className="hl-workspace-container hl-foundations">
    <nav className="hl-breadcrumb" aria-label="Breadcrumb"><Link to="/learn">All courses</Link><span aria-hidden="true">/</span><span>Web Development</span></nav>
    <header className="hl-course-intro">
      <div><span className="hl-eyebrow"><span /> LEARN. UNDERSTAND. BUILD.</span><h1>Your first step into <span>web development.</span></h1><p>একটি lesson, একটি নতুন ধারণা। নিজের গতিতে শিখুন, শক্ত করুন আপনার ভিত্তি।</p></div>
      <div className="hl-course-facts"><span><BookOpen size={15}/> 2 lessons</span><span><Clock size={15}/> About 4 minutes</span><span><Code2 size={15}/> Beginner friendly</span></div>
    </header>
    <div className="hl-workspace-grid">
      <section className="hl-lesson-area" aria-label="Current lesson">
        {!lesson ? <div className="hl-locked-state"><BookOpen size={36}/><h2>This lesson is no longer available</h2><p>আমাদের নতুন learning journey শুরু করুন Day 0 থেকে।</p><Link to={allHtmlLessons[0].path} className="hl-btn-nav-next">Go to Day 0 <ArrowRight size={16}/></Link></div> : !unlocked ? <div className="hl-locked-state" role="status"><span className="hl-lock-orbit"><LockKeyhole size={32}/></span><span className="hl-eyebrow">ONE STEP AT A TIME</span><h2>Complete Day 0 to unlock HTML.</h2><p>আগের ভিডিওটি শেষ করুন। তারপর এই lesson স্বয়ংক্রিয়ভাবে unlock হবে।</p><Link to={allHtmlLessons[0].path} className="hl-btn-nav-next">Continue Day 0 <ArrowRight size={16}/></Link></div> : <>
          <div className="hl-current-label"><span><span className="hl-live-dot"/> NOW LEARNING · DAY {index}</span><span><Clock size={13}/> {lesson.duration}</span></div>
          <HtmlPlayer video={lesson} storageKey={storageKey} onCompleted={complete} onProgress={setFraction} onStorageError={() => setStorageError(true)}/>
          <div className="hl-lesson-details-card">
            <div className="hl-lesson-title-row"><h2>{index === 0 ? 'Why learn web development in the age of AI?' : 'What is HTML?'}</h2>{done && <span className="hl-completion-badge"><CheckCircle2 size={14}/> Completed</span>}</div>
            <p className="hl-lesson-summary-text">{lesson.summary}</p>
            <div className="hl-watch-status" role="status">{done ? <><CheckCircle2 size={16}/> Lesson complete. {next ? 'Your next lesson is ready.' : 'You’ve finished both published lessons.'}</> : <><Play size={15}/><span>{Math.round(fraction * 100)}% watched · ভিডিওটি শেষ হলে {next ? 'পরের lesson unlock হবে।' : 'lesson complete হবে।'}</span></>}</div>
            <div className="hl-lesson-actions-bar"><div className="hl-action-left-group">{previous ? <Link to={previous.path} className="hl-btn-nav-prev"><ArrowLeft size={16}/> Previous lesson</Link> : <span className="hl-first-lesson">DAY 0 · YOUR JOURNEY STARTS HERE</span>}</div><div className="hl-action-right-group">{next ? done ? <Link to={next.path} className="hl-btn-nav-next">Next: What is HTML? <ArrowRight size={16}/></Link> : <button disabled className="hl-btn-nav-next"><LockKeyhole size={15}/> Next lesson locked</button> : <span className="hl-next-soon"><Sparkles size={16}/> More lessons are on the way</span>}</div></div>
          </div>
          {storageError && <p className="hl-storage-notice" role="alert">এই browser-এ progress save করা যাচ্ছে না। এই page-এ শেখা চালিয়ে যেতে পারবেন, তবে reload করলে progress হারাতে পারে।</p>}
          <section className="hl-tabs-container" aria-label="Lesson material"><div className="hl-tabs-bar" role="tablist" aria-label="Lesson material tabs" onKeyDown={onTabKey}>{tabs.map(([id, label, Icon]) => <button type="button" key={id} id={`hl-tab-${id}`} role="tab" aria-selected={tab === id} aria-controls={`hl-panel-${id}`} tabIndex={tab === id ? 0 : -1} className="hl-tab-btn" onClick={() => setTab(id)}><Icon size={16}/>{label}</button>)}</div>
          <div id={`hl-panel-${tab}`} role="tabpanel" aria-labelledby={`hl-tab-${tab}`} tabIndex={0} className="hl-tab-content">
            {tab === 'overview' && <div className="hl-overview-panel"><span className="hl-section-kicker">WHAT YOU’LL TAKE AWAY</span><h3>{index === 0 ? 'Start with the right mindset.' : 'Understand the structure behind every page.'}</h3><ul className="hl-takeaway-list">{curriculum[lesson.id].takeaways.map(point => <li key={point} className="hl-takeaway-item"><CheckCircle2 size={17}/><span>{point}</span></li>)}</ul></div>}
            {tab === 'notes' && <div className="hl-notes-box"><h3>A few things to remember</h3><ol>{curriculum[lesson.id].notes.map(note => <li key={note}>{note}</li>)}</ol><p>ভিডিওর কোনো অংশ আবার দেখতে চাইলে freely rewind করতে পারেন।</p></div>}
            {tab === 'resources' && <div className="hl-resources-panel"><a className="hl-resource-link-row" href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer"><div className="hl-resource-info"><BookOpen size={20}/><div><div className="hl-resource-title">HTML reference · MDN</div><div className="hl-resource-desc">Explore elements and simple examples</div></div></div><ExternalLink size={15}/></a><Link className="hl-resource-link-row" to={`/tanu?tab=chat&subject=web_dev&topic=${encodeURIComponent(lesson.title)}`}><div className="hl-resource-info"><Sparkles size={20}/><div><div className="hl-resource-title">Ask Tanu about this lesson</div><div className="hl-resource-desc">একটু সহজ করে বুঝতে চাইলে প্রশ্ন করুন</div></div></div><ArrowRight size={15}/></Link><p className="hl-resource-footnote">Course progress tracks playback on this page. Watching on YouTube separately won’t update it.</p></div>}
          </div></section>
        </>}
      </section>
      <aside className={`hl-curriculum-sidebar ${menuOpen ? '' : 'is-mobile-collapsed'}`} aria-label="Course curriculum">
        <button className="hl-mobile-curriculum-trigger" type="button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-controls="hl-lesson-list">Course content · {completed.length}/2 completed<ChevronDown size={17}/></button>
        <div className="hl-curriculum-header"><span className="hl-section-kicker">YOUR LEARNING PATH</span><div className="hl-curriculum-title-row"><h2 className="hl-curriculum-title">Small steps. Real progress.</h2><span className="hl-curriculum-count-badge">{completed.length}/2</span></div><div className="hl-progress-bar-track" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={2} aria-valuenow={completed.length}><div className="hl-progress-bar-fill" style={{ width: `${completed.length * 50}%` }}/></div><p className="hl-progress-caption">{completed.length === 2 ? 'A strong start. Keep your curiosity alive.' : 'Watch in order. Build your foundation.'}</p></div>
        <div id="hl-lesson-list" className="hl-modules-scroll-area"><div className="hl-module-heading"><span>01</span><div><strong>{htmlModules[0].title}</strong><small>2 short lessons · Start here</small></div></div><ul className="hl-module-lessons-list">{allHtmlLessons.map((item, i) => {
          const locked = !isHtmlLessonUnlocked(item.id, completed), isDone = completed.includes(item.id), active = item.id === lesson?.id;
          const content = <><span className="hl-lesson-icon-indicator" aria-hidden="true">{locked ? <LockKeyhole size={15}/> : isDone ? <Check size={15}/> : <Play size={13} fill="currentColor"/>}</span><span className="hl-lesson-row-info"><span className="hl-row-day">DAY {i} · {locked ? 'LOCKED' : isDone ? 'COMPLETED' : active ? 'CURRENT LESSON' : 'READY TO WATCH'}</span><span className="hl-lesson-row-title">{i === 0 ? 'Why learn web development?' : 'What is HTML?'}</span><span className="hl-lesson-row-meta"><Clock size={12}/> {item.duration}{locked && ' · Finish Day 0 first'}</span></span></>;
          return <li key={item.id}>{locked ? <button type="button" disabled className="hl-lesson-row is-locked" aria-label={`Day ${i}: ${item.title}. Locked. Complete Day 0 first.`}>{content}</button> : <Link to={item.path} className={`hl-lesson-row ${active ? 'is-active' : ''} ${isDone ? 'is-completed' : ''}`} aria-current={active ? 'page' : undefined}>{content}</Link>}</li>;
        })}</ul><div className="hl-coming-next"><span><Code2 size={18}/></span><div><strong>A little more, every lesson.</strong><p>নতুন lesson এখানে যোগ হবে। আপাতত এই দুইটি দিয়েই শুরু করুন।</p></div></div></div>
        <div className="hl-save-note"><CheckCircle2 size={14}/><span>Progress saved in this browser{scope !== 'guest' ? ' for your account' : ''}.</span></div>
      </aside>
    </div>
  </div>;
}

import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Play, ArrowRight, Code2, Terminal, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { useTanuPlayback } from '../tanu/GuidedSession.jsx';
import { createYouTubeLoader } from '../classroom/youtubeApi.js';
import { cVideos, cPracticeProblems, cleanCProgress, isClassUnlocked } from './cContent.js';
import { checkCPractice, runCSimulation, cMilestones } from './cPractice.js';
import './learn.css';

const loadYouTube = createYouTubeLoader({ window, document, setTimeout, clearTimeout });

function CPlayer({ video, onEnded }) {
  const host = useRef(null);
  const player = useRef(null);
  const report = useTanuPlayback();
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!video.youtubeId) {
      setStatus('empty');
      return undefined;
    }

    let cancelled = false;
    let instance;
    setStatus('loading');
    setError('');

    const publish = s => {
      setStatus(s);
      report?.({ id: video.id, course: video.course, status: s, pause: () => player.current?.pauseVideo?.() });
    };

    const timer = setTimeout(() => {
      if (!cancelled) {
        setError('The video did not become ready. Retry or open the YouTube link.');
        publish('error');
      }
    }, 30000);

    loadYouTube().then(YT => {
      if (cancelled) return;
      const mount = document.createElement('div');
      host.current?.replaceChildren(mount);
      instance = new YT.Player(mount, {
        videoId: video.youtubeId,
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, autoplay: 0, rel: 0, origin: window.location.origin },
        events: {
          onReady: () => {
            if (cancelled) return;
            clearTimeout(timer);
            setError('');
            publish('ready');
          },
          onStateChange: ({ data }) => {
            if (cancelled) return;
            if (data === 0) {
              publish('ended');
              onEnded?.();
            } else if (data === 1) {
              publish('playing');
            } else if (data === 2) {
              publish('paused');
            } else {
              publish('buffering');
            }
          },
          onError: () => {
            if (cancelled) return;
            clearTimeout(timer);
            setError('YouTube could not play this video here. Open the source link or retry.');
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
      document.removeEventListener('visibilitychange', pause);
      report?.(null);
      player.current = null;
      instance?.destroy?.();
    };
  }, [video.id, video.youtubeId, video.course, version, report, onEnded]);

  if (!video.youtubeId) {
    return (
      <section className="html-player" aria-label="C video player">
        <div className="html-player-stage" style={{ minHeight: '380px' }}>
          <div className="html-player-placeholder">
            <span className="html-player-symbol" aria-hidden="true">🎬</span>
            <strong>Class Video Coming Soon</strong>
            <p>This class video is being edited and uploaded. You can already try the practice problems below!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="html-player" aria-label="C video player">
      <div className="html-player-stage" aria-busy={status === 'loading'}>
        <div className="html-video-frame" ref={host} />
        {(status === 'loading' || error) && (
          <div className="html-player-placeholder" role={error ? 'alert' : 'status'}>
            <span className="html-player-symbol" aria-hidden="true">{error ? '!' : '▶'}</span>
            <strong>{error ? 'Video unavailable' : 'Getting your C class ready…'}</strong>
            <p>{error || 'Your lesson will appear here in a moment.'}</p>
            {error && <button className="lx-primary" onClick={() => setVersion(v => v + 1)}>Try again</button>}
          </div>
        )}
      </div>
      <div className="html-player-footer">
        <span role="status">
          {status === 'playing' ? '● Playing' : status === 'ended' ? '✓ Lesson finished — class completed!' : status === 'paused' ? 'Paused — continue whenever you’re ready' : status === 'error' ? 'Having trouble playing?' : status === 'loading' ? 'Preparing your lesson' : 'Press ▶ to start your class'}
        </span>
        {video.url && (
          <a href={video.url} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
        )}
      </div>
    </section>
  );
}

function CPracticeLab({ video, onPassed, scope }) {
  const problems = cPracticeProblems[video.id] || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentProblem = problems[selectedIdx] || null;

  const storageKey = `lugaish_c_draft_v1:${scope}:${video.id}:${currentProblem?.id || 'default'}`;
  const [code, setCode] = useState(() => {
    if (!currentProblem) return '';
    try {
      return localStorage.getItem(storageKey) ?? currentProblem.starter;
    } catch {
      return currentProblem.starter;
    }
  });

  const [terminalOutput, setTerminalOutput] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!currentProblem) return;
    try {
      const savedCode = localStorage.getItem(storageKey);
      setCode(savedCode ?? currentProblem.starter);
    } catch {
      setCode(currentProblem.starter);
    }
    setTerminalOutput('');
    setFeedback(null);
  }, [currentProblem?.id, storageKey]);

  useEffect(() => {
    if (!currentProblem) return;
    try {
      localStorage.setItem(storageKey, code);
    } catch {
      /* ignore */
    }
  }, [code, storageKey, currentProblem]);

  if (!currentProblem) {
    return (
      <section id="c-practice" className="html-practice">
        <div className="html-practice-heading">
          <div>
            <span className="html-start-kicker">STEP 2 · PRACTICE PROBLEMS</span>
            <h2>Practice Lab</h2>
            <p>Practice exercises for this class will be added soon.</p>
          </div>
        </div>
      </section>
    );
  }

  const handleRun = () => {
    const sim = runCSimulation(code);
    if (!sim.success) {
      setTerminalOutput(`[Compilation Error]\n${sim.errors.join('\n')}`);
    } else {
      setTerminalOutput(sim.output ? `[Program Output]\n${sim.output}` : '[Program exited with code 0 - No output printed]');
    }
  };

  const handleCheck = () => {
    const result = checkCPractice(currentProblem, code);
    setFeedback(result);
    if (result.output) {
      setTerminalOutput(`[Program Output]\n${result.output}`);
    }
    if (result.ok) {
      onPassed(video.id, currentProblem.id);
    }
  };

  const handleReset = () => {
    setCode(currentProblem.starter);
    setTerminalOutput('');
    setFeedback(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="c-practice" className="html-practice" aria-labelledby="c-practice-title">
      <div className="html-practice-heading">
        <div>
          <span className="html-start-kicker">STEP 2 · C PRACTICE LAB</span>
          <h2 id="c-practice-title">{currentProblem.title}</h2>
          <p>{currentProblem.prompt}</p>
        </div>
        <button type="button" className="lx-secondary" onClick={handleReset}>
          <RotateCcw size={14} /> Reset starter code
        </button>
      </div>

      {problems.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" role="tablist" aria-label="Practice problems">
          {problems.map((p, idx) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={idx === selectedIdx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                idx === selectedIdx
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      <div className="html-practice-grid">
        <label className="html-code-editor">
          <span>
            <span className="flex items-center gap-1.5"><Code2 size={13}/> main.c</span>
            <small>C99 Standard</small>
          </span>
          <textarea
            aria-label="Edit C code"
            spellCheck="false"
            value={code}
            onChange={e => {
              setCode(e.target.value);
              setFeedback(null);
            }}
          />
        </label>
        <div className="html-live-preview" style={{ background: '#0a101d', display: 'flex', flexDirection: 'column' }}>
          <div className="html-preview-toolbar" style={{ background: '#0d1527', color: '#94a3b8' }}>
            <span className="flex items-center gap-1.5"><Terminal size={13}/> TERMINAL OUTPUT</span>
            <span>Console</span>
          </div>
          <div className="p-4 font-mono text-xs text-emerald-400 flex-1 whitespace-pre-wrap overflow-auto">
            {terminalOutput || <span className="text-slate-500">Press "Run Code" or "Check Solution" to view execution output...</span>}
          </div>
        </div>
      </div>

      <div className="html-practice-check">
        <button className="lx-primary" onClick={handleCheck}>
          Check Solution <ArrowRight size={15} />
        </button>
        <button className="lx-secondary" onClick={handleRun}>
          <Play size={14} /> Run Code
        </button>
        <span>Write your C code, run to test, then submit solution!</span>
      </div>

      {feedback && (
        <div className={`html-task-feedback ${feedback.ok ? 'is-success' : ''}`} role="status">
          <strong>{feedback.ok ? '✓ Correct! Task Completed' : 'Needs attention'}</strong>
          <p>{feedback.message}</p>
          {feedback.ok && <a href="#c-complete">Ready to advance to the next step? ↓</a>}
        </div>
      )}
      <p className="lx-fine">Your code runs in browser sandbox and is preserved for your study session.</p>
    </section>
  );
}

export function CCoursePage() {
  const { videoId } = useParams();
  return <CCourse key={videoId || 'overview'} videoId={videoId} />;
}

function CCourse({ videoId }) {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const key = `lugaish_c_watched_v1:${state.isLoggedIn ? state.userEmail : 'guest'}`;
  const practiceKey = key.replace('watched', 'practice');

  const [saved, setSaved] = useState({ key: '', value: [] });
  const [practice, setPractice] = useState({ key: '', value: [] });
  const [celebrate, setCelebrate] = useState(false);
  const [error, setError] = useState('');

  // Load watched progress
  useEffect(() => {
    try {
      setSaved({ key, value: cleanCProgress(JSON.parse(localStorage.getItem(key) || '[]')) });
    } catch {
      setError('Progress could not be loaded in this browser.');
    }
  }, [key]);

  // Load practice progress
  useEffect(() => {
    try {
      setPractice({ key: practiceKey, value: JSON.parse(localStorage.getItem(practiceKey) || '[]') });
    } catch {
      /* ignore */
    }
  }, [practiceKey]);

  const completed = saved.key === key ? saved.value : [];
  const practised = practice.key === practiceKey ? practice.value : [];

  const video = cVideos.find(v => v.id === videoId);
  const isLocked = video ? !isClassUnlocked(video.id, completed) : false;

  const currentIndex = video ? cVideos.findIndex(item => item.id === video.id) : -1;
  const previous = currentIndex > 0 ? cVideos[currentIndex - 1] : null;
  const following = currentIndex >= 0 && currentIndex < cVideos.length - 1 ? cVideos[currentIndex + 1] : null;
  const nextUnlocked = cVideos.find(v => !completed.includes(v.id)) || cVideos[0];

  const markCompleted = (targetId = video?.id) => {
    if (!targetId) return;
    if (!completed.includes(targetId)) {
      const updated = cleanCProgress([...completed, targetId]);
      setSaved({ key, value: updated });
      setCelebrate(true);
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {
        setError('Progress could not be saved.');
      }
    }
  };

  const savePractice = (classId, problemId) => {
    const entry = `${classId}:${problemId}`;
    if (!practised.includes(entry)) {
      const updated = [...practised, entry];
      setPractice({ key: practiceKey, value: updated });
      try {
        localStorage.setItem(practiceKey, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    }
  };

  if (videoId && !video) {
    return (
      <div className="lx-learn">
        <h1>Class not found</h1>
        <Link to="/learn/c-programming" className="lx-primary">Back to C Course Roadmap</Link>
      </div>
    );
  }

  // SEQUENTIAL LOCKED SCREEN: If student navigates to a locked class without finishing prior ones
  if (video && isLocked) {
    const priorClass = previous || cVideos[0];
    return (
      <div className="lx-learn lx-html-course">
        <Link className="lx-back" to="/learn/c-programming">← C Programming Roadmap</Link>
        <section className="section-card max-w-2xl mx-auto p-8 sm:p-12 text-center my-12 border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/60 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock size={32} />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-amber-400">Sequential Progression Rule</span>
          <h1 className="text-3xl font-black text-white mt-2 mb-4">Class {video.id} is Locked 🔒</h1>
          <p className="text-slate-300 leading-relaxed mb-6">
            In our curriculum, you must finish <strong>Class {priorClass.id}: {priorClass.title}</strong> before moving forward to this video.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={priorClass.path} className="lx-primary">
              Go to Class {priorClass.id} <ArrowRight size={16} />
            </Link>
            <Link to="/learn/c-programming" className="lx-secondary">
              View All Classes
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="lx-learn lx-html-course">
      <Link className="lx-back" to="/learn">← All courses</Link>
      <p className="lx-eyebrow"><span className="lx-dot" /> PROGRAMMING FUNDAMENTALS / C LANGUAGE · ENGLISH</p>

      {!video ? (
        <>
          <header className="html-course-heading">
            <div>
              <h1>Master C Programming,<br /><em>from the ground up.</em></h1>
              <p className="lx-lead">
                Built with a step-by-step progression system. Finish each class to unlock the next, complete interactive coding challenges, and build solid foundations.
              </p>
            </div>
            <aside className="html-progress-card">
              <span>COURSE PROGRESS</span>
              <strong>{completed.length}<small> / {cVideos.length}</small></strong>
              <p>
                {completed.length === cVideos.length
                  ? 'All classes completed! Amazing achievement!'
                  : completed.length
                  ? `${completed.length} of ${cVideos.length} classes completed`
                  : 'Start your journey with Class 01'}
              </p>
              <div className="html-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={cVideos.length} aria-valuenow={completed.length}>
                <span style={{ width: `${(completed.length / cVideos.length) * 100}%` }} />
              </div>
            </aside>
          </header>

          <section className="html-start-card">
            <div className="html-start-number">{nextUnlocked.id}</div>
            <div>
              <span className="html-start-kicker">{completed.length ? 'CONTINUE YOUR JOURNEY' : 'START HERE'}</span>
              <h2>{completed.length ? nextUnlocked.title : 'Class 01: Welcome to C'}</h2>
              <p>{nextUnlocked.summary}</p>
            </div>
            <Link className="lx-primary" to={nextUnlocked.path}>
              {completed.length ? 'Continue Class' : 'Start Class 01'} <ArrowRight size={16} />
            </Link>
          </section>

          <CMilestones completed={completed} />

          <div className="html-roadmap-heading">
            <div>
              <span className="lx-eyebrow">SEQUENTIAL LEARNING PATH</span>
              <h2>Your Learning Roadmap</h2>
            </div>
            <p>{cVideos.length} classes · Complete in order to unlock</p>
          </div>

          <ol className="lx-syllabus html-roadmap">
            {cVideos.map((item, index) => {
              const done = completed.includes(item.id);
              const unlocked = isClassUnlocked(item.id, completed);

              return (
                <li key={item.id} className={`${done ? 'is-complete' : ''} ${!unlocked ? 'opacity-65' : ''}`}>
                  <span className="html-roadmap-index">
                    {done ? '✓' : !unlocked ? <Lock size={15} /> : item.id}
                  </span>
                  <div>
                    <span className="html-roadmap-phase">
                      {index === 0 ? 'CLASS 01 · OPEN NOW' : unlocked ? 'UNLOCKED' : 'LOCKED · COMPLETE PREVIOUS'}
                    </span>
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                  </div>
                  {unlocked ? (
                    <Link className="html-roadmap-open" to={item.path}>
                      {done ? 'Review ↗' : 'Open Class →'}
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/40 rounded-lg">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <>
          <div className="html-lesson-top">
            <div>
              <span className="html-start-kicker">CLASS {video.id} OF {String(cVideos.length).padStart(2, '0')}</span>
              <h1>{video.title}</h1>
            </div>
            <Link className="lx-secondary" to="/learn/c-programming">Course Roadmap</Link>
          </div>

          <div className="html-lesson-progress">
            <span>{completed.length} of {cVideos.length} classes completed</span>
            <div className="html-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={cVideos.length} aria-valuenow={completed.length}>
              <span style={{ width: `${(completed.length / cVideos.length) * 100}%` }} />
            </div>
          </div>

          <nav className="html-lesson-steps" aria-label="Lesson steps">
            <a href="#c-watch"><span>1</span> Watch Class Video</a>
            <a href="#c-practice"><span>2</span> Solve Practice Problems</a>
            <a href="#c-complete"><span>3</span> Mark Complete & Unlock Next</a>
          </nav>

          <div className="html-watch-layout" id="c-watch">
            <CPlayer video={video} onEnded={() => markCompleted(video.id)} />

            <aside className="html-class-list" aria-label="Course classes">
              <div className="html-class-list-heading">
                <span className="html-start-kicker">MODULE PROGRESSION</span>
                <strong>C Programming</strong>
                <p>Sequential class unlocking</p>
              </div>
              <ol>
                {cVideos.map(item => {
                  const done = completed.includes(item.id);
                  const isCurrent = video.id === item.id;
                  const unlocked = isClassUnlocked(item.id, completed);

                  if (!unlocked) {
                    return (
                      <li key={item.id} className="opacity-50 cursor-not-allowed">
                        <div className="flex gap-3 items-center p-3">
                          <span className="html-class-number text-slate-500"><Lock size={14} /></span>
                          <div>
                            <strong className="text-slate-400">{item.title}</strong>
                            <small className="text-slate-500">Locked · Complete Class {String(Number(item.id) - 1).padStart(2, '0')}</small>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id}>
                      <Link to={item.path} aria-current={isCurrent ? 'page' : undefined}>
                        <span className="html-class-number">
                          {done ? '✓' : isCurrent ? '▶' : item.id}
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>
                            {isCurrent ? 'Current class' : done ? 'Completed ✓' : `Class ${item.id} · Unlocked`}
                          </small>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </aside>
          </div>

          <CPracticeLab video={video} scope={state.isLoggedIn ? state.userEmail : 'guest'} onPassed={savePractice} />

          <div id="c-complete" className="html-after-lesson">
            <div>
              <span className="html-start-kicker">STEP 3 · PROGRESSION</span>
              <h2>{completed.includes(video.id) ? 'Class Completed! Next Class Unlocked' : 'Finish This Class'}</h2>
              <p>
                {completed.includes(video.id)
                  ? 'Great job! You have unlocked the next class in sequence. Continue forward when ready!'
                  : 'Watch the video and try the practice problems. When finished, mark it complete to unlock Class 02!'}
              </p>
            </div>
            <button
              className="lx-primary"
              onClick={() => markCompleted(video.id)}
              disabled={completed.includes(video.id)}
            >
              {completed.includes(video.id) ? 'Class Completed ✓' : 'Mark Class Complete & Unlock Next'}
            </button>
          </div>

          {celebrate && (
            <div className="html-completion-note" role="status">
              <span aria-hidden="true">🎉</span>
              <div>
                <strong>Class {video.id} Finished! Next Class Unlocked!</strong>
                <p>The next module is now unlocked and ready for you.</p>
              </div>
              {following && (
                <Link className="lx-primary" to={following.path}>
                  Go to Class {following.id} →
                </Link>
              )}
            </div>
          )}

          <div className="html-lesson-navigation" id="c-next">
            {previous ? (
              <Link className="lx-secondary" to={previous.path}>
                ← Previous class<span>{previous.title}</span>
              </Link>
            ) : <span />}

            {following ? (
              completed.includes(video.id) ? (
                <Link className="lx-primary" to={following.path}>
                  Next class →<span>{following.title}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className="lx-secondary opacity-60 flex flex-col items-end cursor-not-allowed"
                  title="Finish current class to unlock"
                  disabled
                >
                  <span className="flex items-center gap-1"><Lock size={12}/> Next class locked</span>
                  <span className="text-xs">{following.title}</span>
                </button>
              )
            ) : (
              <Link className="lx-primary" to="/learn/c-programming">
                Finish course →<span>Review Roadmap</span>
              </Link>
            )}
          </div>
        </>
      )}

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

function CMilestones({ completed }) {
  return (
    <section className="html-milestones" aria-labelledby="c-milestone-title">
      <div className="html-milestones-intro">
        <span className="html-start-kicker">MILESTONES & BADGES</span>
        <h2 id="c-milestone-title">Your C Milestones</h2>
        <p>Unlock new milestones as you progress through each class in order.</p>
      </div>
      <ol>
        {cMilestones.map((milestone, index) => {
          const total = milestone.ids.length;
          const earned = milestone.ids.filter(id => completed.includes(id)).length;
          const done = earned === total;

          return (
            <li key={milestone.name} className={done ? 'is-earned' : ''}>
              <span className="html-milestone-icon" aria-hidden="true">
                {done ? '✓' : ['◇', '▱', '✦', '★'][index] || '◇'}
              </span>
              <div>
                <strong>{milestone.name}</strong>
                <p>{milestone.description}</p>
                <progress aria-label={milestone.name} max={total} value={earned} />
                <small>{done ? 'Milestone achieved' : `${earned} / ${total} classes completed`}</small>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

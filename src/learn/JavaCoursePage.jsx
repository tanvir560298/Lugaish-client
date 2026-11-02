import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Lock,
  CheckCircle2,
  Play,
  ArrowRight,
  Code2,
  Terminal,
  RotateCcw,
  Sparkles,
  Coffee,
  Check,
  BookOpen,
  Award,
  Tv
} from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { useTanuPlayback } from '../tanu/GuidedSession.jsx';
import { createYouTubeLoader } from '../classroom/youtubeApi.js';
import {
  javaVideos,
  javaPracticeProblems,
  cleanJavaProgress,
  isJavaClassUnlocked
} from './javaContent.js';
import {
  runJavaSimulation,
  checkJavaPractice,
  javaMilestones
} from './javaPractice.js';
import './learn.css';

const loadYouTube = createYouTubeLoader({ window, document, setTimeout, clearTimeout });

function JavaVideoPlayer({ video, onEnded, onMarkComplete, isCompleted }) {
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
      <section className="html-player" aria-label="Java video player" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div className="html-player-stage" style={{ minHeight: '380px' }}>
          <div className="html-player-placeholder" style={{ background: 'radial-gradient(ellipse at 50% 35%, #451a03, #080f1d 75%)' }}>
            <span className="html-player-symbol" style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
              <Coffee size={28} />
            </span>
            <strong style={{ fontSize: '20px', color: '#fef3c7' }}>{video.title}</strong>
            <p style={{ maxWidth: '460px', color: '#fed7aa', fontSize: '13px', margin: '8px 0 16px', lineHeight: 1.6 }}>
              Tanvir is uploading this class video to the YouTube channel. You can already start practicing in the interactive Java Lab below!
            </p>
            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', background: 'rgba(245, 158, 11, 0.15)', padding: '6px 14px', borderRadius: '20px', color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>
              <Tv size={14} />
              <span>YouTube Video Link will be connected here</span>
            </div>
          </div>
        </div>
        <div className="html-player-footer" style={{ background: 'rgba(24, 13, 4, 0.95)', borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: isCompleted ? '#38bdf8' : '#fbbf24', fontWeight: 600 }}>
              {isCompleted ? '✓ Class Completed' : '☕ Class 01 Ready for Lab Practice'}
            </span>
            <span style={{ color: 'var(--lx-muted)' }}>•</span>
            <span style={{ color: 'var(--lx-muted)' }}>Instructor: <strong style={{ color: '#fed7aa' }}>{video.instructor}</strong></span>
            <span style={{ color: 'var(--lx-muted)' }}>•</span>
            <span style={{ color: 'var(--lx-muted)' }}>{video.duration}</span>
          </div>

          <button
            type="button"
            onClick={onMarkComplete}
            style={{
              background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${isCompleted ? '#10b981' : '#f59e0b'}`,
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '11px',
              color: isCompleted ? '#10b981' : '#fbbf24',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isCompleted ? <Check size={12} /> : null}
            {isCompleted ? 'Completed' : 'Mark Completed'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="html-player" aria-label="Java video player" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
      <div className="html-player-stage" aria-busy={status === 'loading'} style={{ minHeight: '380px' }}>
        <div className="html-video-frame" ref={host} />
        {(status === 'loading' || error) && (
          <div className="html-player-placeholder" role={error ? 'alert' : 'status'}>
            <span className="html-player-symbol" aria-hidden="true">{error ? '!' : '▶'}</span>
            <strong>{error ? 'Video unavailable' : 'Getting your Java class ready…'}</strong>
            <p>{error || 'Your lesson will appear here in a moment.'}</p>
            {error && <button className="lx-primary" onClick={() => setVersion(v => v + 1)}>Try again</button>}
          </div>
        )}
      </div>

      <div className="html-player-footer" style={{ background: 'rgba(24, 13, 4, 0.95)', borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: status === 'playing' ? '#10b981' : isCompleted ? '#38bdf8' : '#fbbf24', fontWeight: 600 }}>
            {status === 'playing' ? '● Playing Lecture' : isCompleted ? '✓ Class Completed' : '▶ Ready to Play'}
          </span>
          <span style={{ color: 'var(--lx-muted)' }}>•</span>
          <span style={{ color: 'var(--lx-muted)' }}>Instructor: <strong style={{ color: '#fed7aa' }}>{video.instructor}</strong></span>
          <span style={{ color: 'var(--lx-muted)' }}>•</span>
          <span style={{ color: 'var(--lx-muted)' }}>{video.duration}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {video.url && (
            <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', fontSize: '11px', textDecoration: 'none' }}>
              Watch on YouTube ↗
            </a>
          )}
          <button
            type="button"
            onClick={onMarkComplete}
            style={{
              background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${isCompleted ? '#10b981' : '#f59e0b'}`,
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '11px',
              color: isCompleted ? '#10b981' : '#fbbf24',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isCompleted ? <Check size={12} /> : null}
            {isCompleted ? 'Watched' : 'Mark Watched'}
          </button>
        </div>
      </div>
    </section>
  );
}

function JavaPracticeLab({ video, onPassed, scope }) {
  const problems = javaPracticeProblems[video.id] || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'notes'
  const currentProblem = problems[selectedIdx] || null;

  const storageKey = `lugaish_java_draft_v1:${scope}:${video.id}:${currentProblem?.id || 'default'}`;
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

  const handleRun = () => {
    const sim = runJavaSimulation(code);
    if (!sim.success) {
      setTerminalOutput(`[Compilation Error - javac Test.java]\n${sim.errors.join('\n')}`);
    } else {
      setTerminalOutput(
        sim.output
          ? `[Java Virtual Machine Output]\n${sim.output}\n\n[Program exited with exit code 0]`
          : '[Program exited with exit code 0 - No output printed]'
      );
    }
  };

  const handleCheck = () => {
    if (!currentProblem) return;
    const result = checkJavaPractice(currentProblem, code);
    setFeedback(result);
    if (result.output) {
      setTerminalOutput(`[Java Output]\n${result.output}\n\n[Status: Verified by Lugaish Java Checker]`);
    }
    if (result.ok) {
      onPassed(video.id, currentProblem.id);
    }
  };

  const handleReset = () => {
    if (!currentProblem) return;
    setCode(currentProblem.starter);
    setTerminalOutput('');
    setFeedback(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  const copyNotesCode = (snippet) => {
    setCode(snippet);
    setActiveTab('lab');
  };

  return (
    <section id="java-practice" className="html-practice" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--lx-border)', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            style={{
              background: activeTab === 'lab' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              borderColor: activeTab === 'lab' ? '#f59e0b' : 'transparent',
              color: activeTab === 'lab' ? '#fbbf24' : 'var(--lx-muted)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Code2 size={15} /> Interactive Java Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            style={{
              background: activeTab === 'notes' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              borderColor: activeTab === 'notes' ? '#f59e0b' : 'transparent',
              color: activeTab === 'notes' ? '#fbbf24' : 'var(--lx-muted)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={15} /> Class Notes & Reference
          </button>
        </div>

        {activeTab === 'lab' && currentProblem && (
          <button type="button" className="lx-secondary" onClick={handleReset} style={{ fontSize: '11px', padding: '6px 12px', minHeight: '34px' }}>
            <RotateCcw size={13} /> Reset starter code
          </button>
        )}
      </div>

      {activeTab === 'notes' ? (
        <div style={{ padding: '8px 4px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ color: '#fbbf24', fontSize: '18px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} /> The Golden Rule of Java Printing
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#fef3c7', margin: '8px 0 0' }}>
              In Class 01, instructor Tanvir Ahmad focuses on the essential behavior of printing in Java:
              <strong> Whatever you write inside double quotes <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#6ee7b7' }}>"..."</code> in <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#93c5fd' }}>System.out.println()</code> is printed directly to the output screen!</strong>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '12px', padding: '16px' }}>
              <strong style={{ display: 'block', color: '#fbbf24', fontSize: '14px', marginBottom: '6px' }}>
                1. Class Structure
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--lx-muted)', margin: 0 }}>
                Every piece of runnable Java code lives inside a class: <code style={{ color: '#fed7aa' }}>public class Test {'{ ... }'}</code>.
              </p>
            </div>

            <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '12px', padding: '16px' }}>
              <strong style={{ display: 'block', color: '#fbbf24', fontSize: '14px', marginBottom: '6px' }}>
                2. The Main Method
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--lx-muted)', margin: 0 }}>
                Execution begins at: <code style={{ color: '#fed7aa' }}>public static void main(String[] args)</code>. It is the entry gate for Java applications.
              </p>
            </div>

            <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '12px', padding: '16px' }}>
              <strong style={{ display: 'block', color: '#fbbf24', fontSize: '14px', marginBottom: '6px' }}>
                3. Newlines with println
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--lx-muted)', margin: 0 }}>
                <code style={{ color: '#fed7aa' }}>println</code> stands for "print line". It prints the text inside double quotes and moves the cursor to a brand new line.
              </p>
            </div>

            <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '12px', padding: '16px' }}>
              <strong style={{ display: 'block', color: '#fbbf24', fontSize: '14px', marginBottom: '6px' }}>
                4. Semicolon Rule
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--lx-muted)', margin: 0 }}>
                Every single instruction/statement in Java must terminate with a semicolon (<code style={{ color: '#fed7aa' }}>;</code>).
              </p>
            </div>
          </div>

          <div style={{ background: '#0a0f1d', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fed7aa' }}>Test.java (Source Code from Class 01)</span>
              <button
                type="button"
                onClick={() => copyNotesCode(`public class Test {\n    public static void main(String[] args)\n    {\n        System.out.println("My name is Tanvir Ahmad");\n        System.out.println("My age is 22");\n        System.out.println("I am from Bangladesh");\n    }\n}`)}
                style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', borderRadius: '6px', color: '#fbbf24', padding: '3px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
              >
                Copy to Practice Lab →
              </button>
            </div>
            <pre style={{ margin: 0, padding: '16px', font: '13px/1.8 monospace', color: '#e2e8f0', overflowX: 'auto' }}>
{`public class Test {
    public static void main(String[] args)
    {
        System.out.println("My name is Tanvir Ahmad");
        System.out.println("My age is 22");
        System.out.println("I am from Bangladesh");
    }
}

// Exercise: Print your name as well as your age and your country on new lines.`}
            </pre>
          </div>
        </div>
      ) : (
        <div>
          {problems.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {problems.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    background: idx === selectedIdx ? 'linear-gradient(135deg, #d97706, #b45309)' : 'var(--lx-panel)',
                    borderColor: idx === selectedIdx ? '#f59e0b' : 'var(--lx-border)',
                    color: idx === selectedIdx ? '#ffffff' : 'var(--lx-muted)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}

          {currentProblem ? (
            <div>
              <div style={{ marginBottom: '18px' }}>
                <span className="html-start-kicker" style={{ color: '#fbbf24' }}>
                  STEP 2 · JAVA PRACTICE LAB · {currentProblem.level.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '22px', margin: '6px 0 8px' }}>{currentProblem.title}</h2>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--lx-muted)', margin: 0 }}>
                  {currentProblem.prompt}
                </p>
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', fontSize: '12px', color: '#fed7aa' }}>
                  <strong>💡 Hint:</strong> {currentProblem.hint}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {/* Code Editor */}
                <div style={{ border: '1px solid var(--lx-border)', borderRadius: '12px', overflow: 'hidden', background: '#0a0f1d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 16px', borderBottom: '1px solid var(--lx-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Code2 size={14} style={{ color: '#fbbf24' }} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#f8fafc', fontWeight: 600 }}>
                        Test.java
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--lx-muted)' }}>Java 25 (Standard Edition)</span>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = e.target.selectionStart;
                        const end = e.target.selectionEnd;
                        const updated = code.substring(0, start) + '    ' + code.substring(end);
                        setCode(updated);
                        setTimeout(() => {
                          e.target.selectionStart = e.target.selectionEnd = start + 4;
                        }, 0);
                      }
                    }}
                    spellCheck="false"
                    style={{
                      width: '100%',
                      minHeight: '260px',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#f8fafc',
                      fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
                      fontSize: '13px',
                      lineHeight: '1.8',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', borderTop: '1px solid var(--lx-border)' }}>
                    <button
                      type="button"
                      onClick={handleRun}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#f8fafc',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Play size={13} /> Run Code
                    </button>
                    <button
                      type="button"
                      onClick={handleCheck}
                      style={{
                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        border: '1px solid #f59e0b',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                      }}
                    >
                      <CheckCircle2 size={14} /> Check Solution
                    </button>
                  </div>
                </div>

                {/* Terminal Output */}
                <div style={{ border: '1px solid var(--lx-border)', borderRadius: '12px', overflow: 'hidden', background: '#050811', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderBottom: '1px solid var(--lx-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#eab308' }} />
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e' }} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--lx-muted)', marginLeft: '8px' }}>
                        JVM Terminal
                      </span>
                    </div>
                    <Terminal size={13} style={{ color: 'var(--lx-muted)' }} />
                  </div>

                  <div style={{ flex: 1, padding: '16px', font: '12px/1.8 monospace', color: '#94a3b8', minHeight: '240px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    <div style={{ color: '#38bdf8', marginBottom: '8px' }}>
                      tanvir@lugaish-java-sandbox:~$ javac Test.java && java Test
                    </div>
                    {terminalOutput ? (
                      <div style={{ color: terminalOutput.includes('Error') ? '#f87171' : '#e2e8f0' }}>
                        {terminalOutput}
                      </div>
                    ) : (
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                        Press "Run Code" or "Check Solution" to compile and see output here...
                      </div>
                    )}
                  </div>

                  {feedback && (
                    <div
                      style={{
                        padding: '12px 16px',
                        borderTop: '1px solid var(--lx-border)',
                        background: feedback.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: feedback.ok ? '#34d399' : '#f87171',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600
                      }}
                    >
                      {feedback.ok ? <Sparkles size={16} /> : <RotateCcw size={16} />}
                      <span>{feedback.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--lx-muted)', fontSize: '13px' }}>
              Practice problems for this class are coming soon.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export function JavaCoursePage() {
  const { videoId } = useParams();
  const { state } = useAppContext();
  const scope = state.userEmail || 'guest';

  // LocalStorage progress
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`lugaish_java_progress_v1:${scope}`) || '[]');
      return cleanJavaProgress(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`lugaish_java_progress_v1:${scope}`, JSON.stringify(completed));
    } catch {
      /* ignore */
    }
  }, [completed, scope]);

  const activeId = videoId || '01';
  const currentVideo = javaVideos.find(v => v.id === activeId) || javaVideos[0];

  const handleMarkComplete = (idToComplete = currentVideo.id) => {
    if (!completed.includes(idToComplete)) {
      setCompleted(prev => cleanJavaProgress([...prev, idToComplete]));
    }
  };

  const handlePracticePassed = (vidId) => {
    handleMarkComplete(vidId);
  };

  const percentComplete = Math.round((completed.length / javaVideos.length) * 100);

  return (
    <div className="lx-learn lx-html-course" style={{ maxWidth: '1400px' }}>
      {/* Top Header */}
      <header className="html-lesson-top" style={{ borderBottom: '1px solid var(--lx-border)', paddingBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Link to="/learn" style={{ color: 'var(--lx-muted)', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Courses <ArrowRight size={12} />
            </Link>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700 }}>Java Programming</span>
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
              Class {currentVideo.id} of {String(javaVideos.length).padStart(2, '0')}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', margin: '4px 0 10px', letterSpacing: '-0.03em' }}>
            {currentVideo.title}
          </h1>
          <p style={{ maxWidth: '780px', color: 'var(--lx-muted)', fontSize: '14px', margin: 0, lineHeight: 1.7 }}>
            {currentVideo.summary}
          </p>
        </div>

        <div className="html-progress-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', minWidth: '220px' }}>
          <span style={{ color: '#fbbf24' }}>COURSE PROGRESS</span>
          <strong style={{ color: '#f8fafc' }}>
            {completed.length} <small>/ {javaVideos.length} classes</small>
          </strong>
          <div className="html-progress-track" style={{ marginTop: '10px' }}>
            <span style={{ width: `${percentComplete}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--lx-muted)' }}>
            {percentComplete}% of Java syllabus completed
          </p>
        </div>
      </header>

      {/* Main Watch & Curriculum Layout */}
      <div className="html-watch-layout" style={{ marginTop: '28px' }}>
        {/* Left: Video Player & Practice Lab */}
        <div style={{ minWidth: 0 }}>
          <JavaVideoPlayer
            video={currentVideo}
            onEnded={() => handleMarkComplete(currentVideo.id)}
            onMarkComplete={() => handleMarkComplete(currentVideo.id)}
            isCompleted={completed.includes(currentVideo.id)}
          />

          <JavaPracticeLab
            video={currentVideo}
            onPassed={handlePracticePassed}
            scope={scope}
          />
        </div>

        {/* Right: Curriculum Roadmap & Class Selector */}
        <aside className="html-class-list" style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <div className="html-class-list-heading" style={{ background: 'rgba(24, 13, 4, 0.6)' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: '#fbbf24' }}>
              JAVA SYLLABUS ROADMAP
            </span>
            <strong style={{ fontSize: '16px', color: '#f8fafc', marginTop: '4px' }}>
              Sequential Classes
            </strong>
            <p style={{ fontSize: '11px', color: 'var(--lx-muted)' }}>
              Complete each class to unlock the next.
            </p>
          </div>

          <ol style={{ padding: '8px' }}>
            {javaVideos.map((vid) => {
              const unlocked = isJavaClassUnlocked(vid.id, completed);
              const isDone = completed.includes(vid.id);
              const isCurrent = vid.id === currentVideo.id;

              return (
                <li key={vid.id}>
                  {unlocked ? (
                    <Link
                      to={`/learn/java-programming/${vid.id}`}
                      aria-current={isCurrent ? 'page' : undefined}
                      style={{
                        background: isCurrent ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                        boxShadow: isCurrent ? 'inset 3px 0 #f59e0b' : 'none'
                      }}
                    >
                      <span className="html-class-number" style={{ color: isDone ? '#10b981' : isCurrent ? '#fbbf24' : 'var(--lx-muted)' }}>
                        {isDone ? <CheckCircle2 size={16} /> : vid.id}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ color: isCurrent ? '#fbbf24' : '#f8fafc' }}>
                          {vid.title.replace(/^Class \d+:\s*/, '')}
                        </strong>
                        <small style={{ color: 'var(--lx-muted)' }}>
                          {vid.youtubeId ? vid.duration : 'YouTube link soon'} {isDone && '· Done ✓'}
                        </small>
                      </div>
                    </Link>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '13px 12px',
                        opacity: 0.5,
                        cursor: 'not-allowed'
                      }}
                    >
                      <span className="html-class-number">
                        <Lock size={14} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ color: 'var(--lx-muted)' }}>
                          {vid.title.replace(/^Class \d+:\s*/, '')}
                        </strong>
                        <small style={{ color: 'var(--lx-muted)' }}>
                          Finish Class {String(Number(vid.id) - 1).padStart(2, '0')} to unlock
                        </small>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </aside>
      </div>

      {/* Milestones Earned */}
      <section className="html-milestones" style={{ marginTop: '50px' }}>
        <div className="html-milestones-intro">
          <span className="html-start-kicker" style={{ color: '#fbbf24' }}>ACHIEVEMENTS</span>
          <h2>Java Learning Milestones</h2>
          <p>Track your verified skill milestones as you code in the interactive lab.</p>
        </div>

        <ol>
          {javaMilestones.map((ms, i) => {
            const earned = completed.length >= i + 1;
            return (
              <li key={ms.id} className={earned ? 'is-earned' : ''} style={{ borderColor: earned ? '#f59e0b' : 'var(--lx-border)' }}>
                <div className="html-milestone-icon" style={{ background: earned ? '#f59e0b' : 'transparent', color: earned ? '#180d04' : 'var(--lx-muted)' }}>
                  <Award size={20} />
                </div>
                <div>
                  <strong style={{ color: earned ? '#fef3c7' : '#f8fafc' }}>{ms.title}</strong>
                  <p>{ms.desc}</p>
                  <small style={{ color: earned ? '#34d399' : 'var(--lx-muted)', fontWeight: 600 }}>
                    {earned ? '✓ Unlocked' : 'Locked — Keep coding'}
                  </small>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

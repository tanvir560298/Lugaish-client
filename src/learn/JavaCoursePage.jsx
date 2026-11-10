import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Code2,
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
  cleanJavaProgress
} from './javaContent.js';
import { javaMilestones } from './javaPractice.js';
import { NestedLoopsPracticeLab } from './NestedLoopsPracticeLab.jsx';
import { JavaTopicPracticeListing } from '../practice/java/JavaTopicPracticeListing.jsx';
import { JavaTopicNotes } from './JavaTopicNotes.jsx';
import { getSolvedProblemIds } from '../practice/java/javaPracticeClient.js';
import './learn.css';
import './javaCourse.css';

const loadYouTube = createYouTubeLoader({ window, document, setTimeout, clearTimeout });

function JavaVideoPlayer({ video, onEnded, onMarkComplete, isCompleted, onSelectSection }) {
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
      <section className="java-lesson-brief" aria-label="Java video player">
        <div className="java-lesson-brief-top">
          <span className="java-lesson-icon"><Tv size={24} /></span>
          <div><span className="java-eyebrow">LESSON {video.id}</span><h2>Video coming soon</h2></div>
          <span className="java-status">In production</span>
        </div>
        <p>The lecture is being prepared. Start with the study notes or put your knowledge to work with the available challenges.</p>
        <div className="java-lesson-actions">
          <button type="button" onClick={() => onSelectSection('notes')}><BookOpen size={16} /> Read lesson notes <ArrowRight size={16} /></button>
          <button type="button" className="java-action-primary" onClick={() => onSelectSection('practice')}><Code2 size={16} /> Start practicing <ArrowRight size={16} /></button>
        </div>
        <div className="java-lesson-meta"><span>Instructor <strong>{video.instructor}</strong></span><span>Java fundamentals</span></div>
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

export function JavaCoursePage() {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const { state } = useAppContext();
  const scope = state.userEmail || 'guest';

  // Navigation tab state: 'notes' | 'practice'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#practice') {
      return 'practice';
    }
    return window.location.hash === '#notes' ? 'notes' : 'practice';
  });

  // Solved problem IDs synchronized with practice system
  const [solvedProblemIds, setSolvedProblemIds] = useState(() => getSolvedProblemIds());

  useEffect(() => {
    const sync = () => setSolvedProblemIds(getSolvedProblemIds());
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  // Listen to hash changes (e.g. from #practice links)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#practice') {
        setActiveTab('practice');
      } else if (window.location.hash === '#notes') {
        setActiveTab('notes');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // LocalStorage course progress
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

  if (!javaVideos || javaVideos.length === 0) {
    return (
      <div className="lx-learn" style={{ maxWidth: '1000px', margin: '40px auto', padding: '30px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '20px',
          padding: '50px 30px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#fbbf24'
          }}>
            <Coffee size={36} />
          </div>
          <span style={{
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 14px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            CURRICULUM READY
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#f8fafc', margin: '0 0 14px' }}>
            Java Programming Course
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto 28px', color: '#94a3b8', fontSize: '15px', lineHeight: 1.7 }}>
            জাভা প্রোগ্রামিং ট্র্যাকের সকল ক্লাস ও প্র্যাকটিস সেশন লোড হচ্ছে...
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/learn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <ArrowRight size={16} /> ব্রাউজ অন্য কোর্সসমূহ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeId = videoId === 'nested-loops' ? '05' : (videoId || javaVideos[0]?.id || '01');
  const currentVideo = javaVideos.find(v => v.id === activeId) || javaVideos[0];
  const currentProblems = javaPracticeProblems[currentVideo.id] || [];
  const topicProblemCount = currentProblems.length;
  const firstChallenge = currentProblems.find(problem => problem.problemType === 'lugaish');

  const handleMarkComplete = (idToComplete = currentVideo.id) => {
    if (!completed.includes(idToComplete)) {
      setCompleted(prev => cleanJavaProgress([...prev, idToComplete]));
    }
  };

  const handlePracticePassed = (vidId) => {
    const targetVideo = javaVideos.find(v => v.id === vidId);
    // Only mark the video completed if a real video actually exists
    if (targetVideo && targetVideo.youtubeId) {
      handleMarkComplete(vidId);
    }
  };

  const percentComplete = Math.round((completed.length / javaVideos.length) * 100);

  return (
    <div className="lx-learn lx-html-course java-course" style={{ maxWidth: '1400px' }}>
      <header className="java-workspace-header">
        <Link to="/learn" className="java-back-link">Courses / Java Programming</Link>
        <div className="java-workspace-title"><div><span className="java-eyebrow">YOUR LEARNING WORKSPACE</span><h1>Java Programming</h1><p>Learn the concepts. Write the code. Build your confidence.</p></div>
        <div className="java-progress-summary"><strong>{percentComplete}%</strong><span>{completed.length} of {javaVideos.length} topics complete</span><progress value={completed.length} max={javaVideos.length} aria-label="Course completion" /></div></div>
        <div className="java-topic-toolbar">
          <label htmlFor="java-topic-select">Current topic</label>
          <select id="java-topic-select" value={currentVideo.id} onChange={event => navigate('/learn/java-programming/' + event.target.value)}>
            {javaVideos.map(video => <option key={video.id} value={video.id}>{video.id} · {video.topicTitle || video.title}</option>)}
          </select>
          <span>{topicProblemCount} practice challenges</span>
        </div>
        <h2 className="java-topic-heading">{currentVideo.topicTitle || currentVideo.title}</h2>
        <p className="java-topic-summary">{currentVideo.summary}</p>
      </header>

      {/* Main Watch & Curriculum Layout */}
      <div className="html-watch-layout" style={{ marginTop: '28px' }}>
        {/* Left: Video Player & Tabs */}
        <div style={{ minWidth: 0 }}>
          {topicProblemCount > 0 && <section className="java-practice-spotlight" aria-label="Start Java practice">
            <div className="java-practice-mark" aria-hidden="true"><Code2 size={30} /></div>
            <div className="java-practice-invitation">
              <span className="java-eyebrow">PRACTICE IS OPEN</span>
              <h2>Your next skill starts with one problem.</h2>
              <p>{topicProblemCount} challenges ready. Write Java, test your ideas, and learn by solving.</p>
              <div className="java-practice-cta">
                {firstChallenge ? <Link className="java-start-challenge" to={`/practice/java/basic-io-variables/${firstChallenge.slug || firstChallenge.id}`}><Code2 size={17} /> Start first challenge <ArrowRight size={17} /></Link> : <button className="java-start-challenge" onClick={() => { setActiveTab('practice'); document.getElementById('java-lesson-sections')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore challenges <ArrowRight size={17} /></button>}
                <button className="java-browse-challenges" onClick={() => { setActiveTab('practice'); document.getElementById('java-lesson-sections')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse all {topicProblemCount} challenges <ArrowRight size={15} /></button>
              </div>
            </div>
          </section>}
          {!currentVideo.youtubeId && <p className="java-video-note"><Tv size={15} /> Video lessons are on the way. Study notes are available now.</p>}
          {currentVideo.youtubeId && <JavaVideoPlayer
            video={currentVideo}
            onSelectSection={section => {
              setActiveTab(section);
              document.getElementById('java-lesson-sections')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            onEnded={() => handleMarkComplete(currentVideo.id)}
            onMarkComplete={() => handleMarkComplete(currentVideo.id)}
            isCompleted={completed.includes(currentVideo.id)}
          />}

          {/* TWO TABS: Topic Overview & Notes vs Practice Problems */}
          <div style={{ marginTop: '28px' }}>
            <div id="java-lesson-sections" className="java-course-tabs" aria-label="Lesson sections">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                aria-pressed={activeTab === 'notes'}
                style={{
                  background: activeTab === 'notes' ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                  borderColor: activeTab === 'notes' ? '#f59e0b' : 'transparent',
                  color: activeTab === 'notes' ? '#fbbf24' : 'var(--lx-muted)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <BookOpen size={16} /> Topic Overview &amp; Notes
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                aria-pressed={activeTab === 'practice'}
                style={{
                  background: activeTab === 'practice' ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                  borderColor: activeTab === 'practice' ? '#f59e0b' : 'transparent',
                  color: activeTab === 'practice' ? '#fbbf24' : 'var(--lx-muted)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Code2 size={16} /> Practice Problems
                {topicProblemCount > 0 && (
                  <span
                    style={{
                      background: activeTab === 'practice' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                      color: activeTab === 'practice' ? '#0f172a' : '#fed7aa',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    {topicProblemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tab 1: Topic Overview & Notes */}
            {activeTab === 'notes' ? (
              <JavaTopicNotes
                video={currentVideo}
                onSwitchToPractice={() => setActiveTab('practice')}
              />
            ) : (
              /* Tab 2: Practice Problems */
              <div>
                {currentVideo.id === '01' ? (
                  <JavaTopicPracticeListing
                    topicSlug="basic-io-variables"
                    topicTitle={currentVideo.topicTitle || currentVideo.title}
                    compact={true}
                  />
                ) : currentVideo.id === '05' ? (
                  <NestedLoopsPracticeLab
                    onPassed={handlePracticePassed}
                    scope={scope}
                    courseId="java-programming"
                  />
                ) : (
                  <div style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px dashed rgba(245, 158, 11, 0.3)',
                    borderRadius: '14px',
                    margin: '12px 0'
                  }}>
                    <Code2 size={36} style={{ color: '#fbbf24', margin: '0 auto 12px' }} />
                    <h3 style={{ color: '#f8fafc', margin: '0 0 8px', fontSize: '18px' }}>
                      {currentVideo.topicTitle || currentVideo.title}
                    </h3>
                    <p style={{ color: 'var(--lx-muted)', fontSize: '13px', margin: '0 auto 18px', maxWidth: '520px', lineHeight: 1.6 }}>
                      Problems for this topic are being prepared. In the meantime, head over to Topic 01 to practice Basic Input, Output &amp; Variables (25 practice problems ready)!
                    </p>
                    <Link
                      to="/learn/java-programming/01"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#0f172a',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      Practice Topic 01 (25 Problems) <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

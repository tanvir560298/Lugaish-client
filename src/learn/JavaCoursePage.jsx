import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
        <div className="html-player-stage" style={{ minHeight: '360px' }}>
          <div className="html-player-placeholder" style={{ background: 'radial-gradient(ellipse at 50% 35%, #451a03, #080f1d 75%)' }}>
            <span className="html-player-symbol" style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
              <Coffee size={28} />
            </span>
            <strong style={{ fontSize: '20px', color: '#fef3c7' }}>{video.title}</strong>
            <p style={{ maxWidth: '480px', color: '#fed7aa', fontSize: '13px', margin: '8px 0 16px', lineHeight: 1.6 }}>
              Tanvir is recording and uploading this lecture video to the YouTube channel. You can review the topic notes and solve the practice problems below!
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
              {isCompleted ? '✓ Class Completed' : `☕ Topic ${video.id} Lecture Ready`}
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

export function JavaCoursePage() {
  const { videoId } = useParams();
  const { state } = useAppContext();
  const scope = state.userEmail || 'guest';

  // Navigation tab state: 'notes' | 'practice'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#practice') {
      return 'practice';
    }
    return 'notes';
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
      {/* Top Header */}
      <header className="html-lesson-top" style={{ borderBottom: '1px solid var(--lx-border)', paddingBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Link to="/learn" style={{ color: 'var(--lx-muted)', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Courses <ArrowRight size={12} />
            </Link>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700 }}>Java Programming Track</span>
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
              Topic {currentVideo.id} of {String(javaVideos.length).padStart(2, '0')}
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
            {completed.length} <small>/ {javaVideos.length} topics</small>
          </strong>
          <div className="html-progress-track" style={{ marginTop: '10px' }}>
            <span style={{ width: `${percentComplete}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--lx-muted)' }}>
            {percentComplete}% of Java syllabus completed
          </p>
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'var(--lx-muted)' }}>Solved Challenges:</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>
              {solvedProblemIds.length} solved
            </span>
          </div>
        </div>
      </header>

      {/* Featured Banner for Nested Loops if on another topic */}
      {currentVideo.id !== '05' && currentVideo.id !== '01' && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(180, 83, 9, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '14px 18px',
            margin: '20px 0 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <div>
              <strong style={{ color: '#fbbf24', fontSize: '13px' }}>
                Featured Practice Set: Nested Loops &amp; Algorithmic Simulation (14 Problems)
              </strong>
              <p style={{ margin: 0, fontSize: '11px', color: '#fed7aa' }}>
                Star triangles, pyramids, Selection Sort, and Codeforces challenges.
              </p>
            </div>
          </div>
          <Link
            to="/learn/java-programming/05"
            style={{
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              border: '1px solid #f59e0b',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '11px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Open 14 Practice Problems <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Main Watch & Curriculum Layout */}
      <div className="html-watch-layout" style={{ marginTop: '28px' }}>
        {/* Left: Video Player & Tabs */}
        <div style={{ minWidth: 0 }}>
          <JavaVideoPlayer
            video={currentVideo}
            onEnded={() => handleMarkComplete(currentVideo.id)}
            onMarkComplete={() => handleMarkComplete(currentVideo.id)}
            isCompleted={completed.includes(currentVideo.id)}
          />

          {/* TWO TABS: Topic Overview & Notes vs Practice Problems */}
          <div style={{ marginTop: '28px' }}>
            <div className="java-course-tabs" aria-label="Lesson sections">
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

        {/* Right: Curriculum Roadmap & Topic Selector */}
        <aside className="html-class-list" style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <div className="html-class-list-heading" style={{ background: 'rgba(24, 13, 4, 0.6)' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: '#fbbf24' }}>
              JAVA 14 TOPICS ROADMAP
            </span>
            <strong style={{ fontSize: '16px', color: '#f8fafc', marginTop: '4px' }}>
              Syllabus Topics
            </strong>
            <p style={{ fontSize: '11px', color: 'var(--lx-muted)' }}>
              Select any topic to view problems &amp; practice.
            </p>
          </div>

          <ol style={{ padding: '8px' }}>
            {javaVideos.map((vid) => {
              const isDone = completed.includes(vid.id);
              const isCurrent = vid.id === currentVideo.id;
              const probs = javaPracticeProblems[vid.id] || [];
              const probCount = probs.length;
              const lugaishProbs = probs.filter(p => p.problemType === 'lugaish');
              const topicSolved = lugaishProbs.filter(p => solvedProblemIds.includes(p.id)).length;

              return (
                <li key={vid.id}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <strong style={{ color: isCurrent ? '#fbbf24' : '#f8fafc' }}>
                          {vid.topicTitle || vid.title.replace(/^Topic \d+:\s*/, '')}
                        </strong>
                        {probCount > 0 && (
                          <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '9px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {probCount} {probCount === 1 ? 'Problem' : 'Problems'}
                          </span>
                        )}
                      </div>
                      <small style={{ color: 'var(--lx-muted)' }}>
                        {probCount > 0
                          ? `${probCount} Practice ${probCount === 1 ? 'Problem' : 'Problems'}${topicSolved > 0 ? ` · ${topicSolved}/${lugaishProbs.length} Solved` : ''}`
                          : 'Problems uploading soon'} {isDone && '· Done ✓'}
                      </small>
                    </div>
                  </Link>
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

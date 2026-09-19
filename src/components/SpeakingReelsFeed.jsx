import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Mic,
  Maximize2,
  Minimize2,
  Share2,
  CheckCircle2,
  Flame,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Square,
  Clock,
  Award,
  Smartphone,
  Monitor
} from 'lucide-react';

export function SpeakingReelsFeed({
  reels = [],
  topicTitle = 'How to Introduce Yourself',
  onComplete,
  isCompleted = false,
  isCompleting = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoActuallyPlaying, setIsVideoActuallyPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState(() => (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'theater' : 'phone'));
  const [playbackRate, setPlaybackRate] = useState(1);
  const [likes, setLikes] = useState(() => reels.map(r => r.likesCount || 300));
  const [hasLiked, setHasLiked] = useState(() => reels.map(() => false));
  const [heartParticles, setHeartParticles] = useState([]);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [copiedPillar, setCopiedPillar] = useState(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Video and container refs
  const feedContainerRef = useRef(null);
  const videoRefs = useRef([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const activeReel = reels[activeIndex] || reels[0];

  // Auto-play active reel, pause inactive
  useEffect(() => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeIndex) {
        videoEl.playbackRate = playbackRate;
        videoEl.muted = isMuted;
        if (isPlaying) {
          videoEl.play().catch(() => {
            // Autoplay with sound might be blocked by browser policy
            videoEl.muted = true;
            setIsMuted(true);
            videoEl.play().catch(() => {});
          });
        } else {
          videoEl.pause();
        }
      } else {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }, [activeIndex, isPlaying, isMuted, playbackRate]);

  // Scroll to active index smoothly
  const scrollToReel = (index) => {
    if (index < 0 || index >= reels.length) return;
    const container = feedContainerRef.current;
    if (container) {
      const targetElement = container.children[index];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    setActiveIndex(index);
    setIsPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowDown', 'j'].includes(e.key)) {
        e.preventDefault();
        scrollToReel(Math.min(activeIndex + 1, reels.length - 1));
      } else if (['ArrowUp', 'k'].includes(e.key)) {
        e.preventDefault();
        scrollToReel(Math.max(activeIndex - 1, 0));
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (['m', 'M'].includes(e.key)) {
        setIsMuted(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, reels.length]);

  // Handle intersection/scroll to detect which reel is in view
  const handleScroll = () => {
    const container = feedContainerRef.current;
    if (!container) return;
    const { scrollTop, clientHeight } = container;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reels.length) {
      setActiveIndex(newIndex);
      setIsPlaying(true);
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      if (!activeVideo.paused) {
        activeVideo.pause();
        setIsPlaying(false);
        setIsVideoActuallyPlaying(false);
      } else {
        activeVideo.play()
          .then(() => {
            setIsPlaying(true);
            setIsVideoActuallyPlaying(true);
          })
          .catch(() => {
            activeVideo.muted = true;
            setIsMuted(true);
            activeVideo.play().then(() => {
              setIsPlaying(true);
              setIsVideoActuallyPlaying(true);
            }).catch(() => {});
          });
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  // Like button action with floating particles
  const handleLike = (e) => {
    e?.stopPropagation();
    const liked = hasLiked[activeIndex];
    setHasLiked(prev => {
      const next = [...prev];
      next[activeIndex] = !liked;
      return next;
    });
    setLikes(prev => {
      const next = [...prev];
      next[activeIndex] = liked ? next[activeIndex] - 1 : next[activeIndex] + 1;
      return next;
    });

    if (!liked) {
      const id = Date.now();
      setHeartParticles(prev => [...prev, { id, x: (Math.random() - 0.5) * 60, y: -20 }]);
      setTimeout(() => {
        setHeartParticles(prev => prev.filter(p => p.id !== id));
      }, 1200);
    }
  };

  // Cycle speed
  const cyclePlaybackRate = (e) => {
    e?.stopPropagation();
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) activeVideo.playbackRate = nextRate;
  };

  // Copy sample text
  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedPillar(key);
    setTimeout(() => setCopiedPillar(null), 2000);
  };

  // Voice recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone permission required for speaking drill. Please allow access in browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Top Banner Alert / Reel Status */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/20 text-purple-300 shadow-inner">
            <Flame size={20} className="animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-200">
                📱 Reels Mode
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Reel {activeIndex + 1} of {reels.length}
              </span>
            </div>
            <h3 className="mt-0.5 text-base font-black text-white sm:text-lg">
              {topicTitle}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle: Phone vs Widescreen */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('phone')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === 'phone'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Reels View"
            >
              <Smartphone size={13} />
              <span>Reels Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('theater')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === 'theater'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Widescreen Theater View (16:9)"
            >
              <Monitor size={13} />
              <span>Widescreen (16:9)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCheatSheet(true)}
            className="glow-button glow-button-blue py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <BookOpen size={14} />
            <span>4-Pillar Formula</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={isCompleting || isCompleted}
            className={`glow-button py-2 px-4 text-xs font-black uppercase tracking-wider ${
              isCompleted
                ? 'glow-button-green bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                : 'glow-button-blue shadow-lg shadow-purple-600/30'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>{isCompleted ? 'Completed (+500 XP)' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Reels Vertical Phone + Side Study Hub */}
      <div className={`grid gap-8 ${viewMode === 'theater' ? 'grid-cols-1' : 'lg:grid-cols-12'} lg:items-start`}>
        {/* Left Column: Reels Player (9:16 vertical feed container or 16:9 theater) */}
        <div className={`${viewMode === 'theater' ? 'w-full max-w-4xl mx-auto' : 'lg:col-span-7'} flex flex-col items-center`}>
          {/* Frame Canvas */}
          <div className={`relative w-full ${
            viewMode === 'theater'
              ? 'max-w-4xl rounded-3xl border-2 border-purple-500/40 bg-slate-950 p-2 shadow-[0_0_70px_rgba(168,85,247,0.35)] ring-1 ring-white/10'
              : 'max-w-[400px] rounded-[2.75rem] border-4 border-slate-800/80 bg-slate-950 p-2.5 shadow-[0_0_60px_rgba(168,85,247,0.3)] ring-1 ring-white/10'
          }`}>
            {/* Top Phone Notch / Dynamic Island (Only in Phone mode) */}
            {viewMode === 'phone' && (
              <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 h-5 w-28 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-500/60 animate-pulse mr-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              </div>
            )}

            {/* Scrollable Reels Viewport (Snap Scroll) */}
            <div
              ref={feedContainerRef}
              onScroll={handleScroll}
              className={`relative ${
                viewMode === 'theater' ? 'h-[480px] sm:h-[540px]' : 'h-[680px]'
              } w-full overflow-y-scroll snap-y snap-mandatory rounded-[2.25rem] bg-black scrollbar-none`}
              style={{ scrollBehavior: 'smooth' }}
            >
              {reels.map((reel, index) => {
                const isActive = index === activeIndex;
                const isYouTube = Boolean(reel.youtubeId || reel.youtubeEmbedUrl);
                const isUpcoming = Boolean(reel.isUpcoming || (!reel.videoUrl && !isYouTube));

                return (
                  <div
                    key={reel.id || index}
                    className={`relative ${
                      viewMode === 'theater' ? 'h-[480px] sm:h-[540px]' : 'h-[680px]'
                    } w-full snap-start snap-always shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-between`}
                  >
                    {/* Video Player, YouTube Embed, or Upcoming Teaser */}
                    {isYouTube ? (
                      <div className="relative h-full w-full bg-black flex flex-col justify-center items-center overflow-hidden">
                        {/* Ambient blurred backdrop using YouTube thumbnail */}
                        <div
                          className="pointer-events-none absolute inset-0 bg-cover bg-center blur-3xl opacity-35 scale-125"
                          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${reel.youtubeId || '2mJRqQUGNRA'}/hqdefault.jpg)` }}
                        />
                        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

                        {/* Top Finale Banner Tag */}
                        <div className="absolute top-4 left-4 z-20 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/50 bg-red-600/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                            🎬 Grand Finale Case Study
                          </span>
                        </div>

                        {/* Responsive Widescreen YouTube Frame */}
                        <div className="relative z-10 w-full aspect-video max-w-full shadow-2xl px-2">
                          <iframe
                            src={reel.youtubeEmbedUrl || `https://www.youtube.com/embed/${reel.youtubeId}?rel=0`}
                            title={reel.title || 'IELTS Speaking Grand Finale Case Study'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-2xl border border-white/20 shadow-2xl"
                          />
                        </div>
                      </div>
                    ) : !isUpcoming ? (
                      <div className="relative h-full w-full cursor-pointer overflow-hidden bg-black" onClick={togglePlay}>
                        {/* Ambient blurred backdrop for letterboxing so no edges get cut off */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
                          <video
                            src={reel.videoUrl}
                            aria-hidden="true"
                            className="h-full w-full object-cover blur-3xl opacity-40 scale-125"
                            muted
                            playsInline
                            tabIndex={-1}
                          />
                          <div className="absolute inset-0 bg-slate-950/30" />
                        </div>

                        <video
                          ref={el => videoRefs.current[index] = el}
                          src={reel.videoUrl}
                          playsInline
                          loop
                          preload="auto"
                          className="relative z-10 h-full w-full object-contain mx-auto select-none pointer-events-auto"
                          onPlay={() => {
                            setIsPlaying(true);
                            setIsVideoActuallyPlaying(true);
                          }}
                          onPause={() => {
                            setIsVideoActuallyPlaying(false);
                          }}
                          onTimeUpdate={(e) => {
                            if (isActive) {
                              setCurrentTime(e.currentTarget.currentTime);
                              setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100);
                            }
                          }}
                          onLoadedMetadata={(e) => {
                            if (isActive) setDuration(e.currentTarget.duration);
                          }}
                          onError={(e) => {
                            if (reel.fallbackVideoUrl && e.currentTarget.src !== reel.fallbackVideoUrl) {
                              e.currentTarget.src = reel.fallbackVideoUrl;
                              e.currentTarget.load();
                              if (isActive && isPlaying) e.currentTarget.play().catch(() => {});
                            }
                          }}
                        />

                        {/* Centered Play / Pause Animation Indicator */}
                        {(!isPlaying || !isVideoActuallyPlaying) && isActive && (
                          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-black/40 backdrop-blur-[2px]">
                            <div className="flex flex-col items-center gap-2.5">
                              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 text-white shadow-2xl backdrop-blur-md animate-scale-up">
                                <Play size={36} className="fill-current ml-1" />
                              </div>
                              <span className="rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-xl border border-white/15">
                                Tap anywhere to play
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Upcoming Reel 2 Custom Teaser */
                      <div className="relative h-full w-full flex flex-col justify-between p-6 bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-950 text-white select-none">
                        <div className="mt-12 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-200">
                            ✨ Reel 2 · Tanvir's Speaking Drill
                          </span>
                          <h4 className="mt-4 text-2xl font-black leading-snug text-white">
                            {reel.title || 'Model Introduction & Pronunciation Drill'}
                          </h4>
                          <p className="mt-2 text-xs leading-5 text-purple-200/80">
                            Tanvir is preparing your second video drill for this topic!
                          </p>
                        </div>

                        {/* Interactive Drill Practice Card Inside Reel */}
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md space-y-3">
                          <p className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                            <Sparkles size={14} /> Spoken Formula Ready
                          </p>
                          <div className="text-xs space-y-2 text-slate-200">
                            <p className="font-semibold text-white">4-Pillar Self-Introduction:</p>
                            <div className="grid gap-1.5 text-[11px] text-slate-300">
                              <div className="flex items-start gap-2 bg-black/40 rounded-lg p-2">
                                <span className="font-bold text-purple-400">1.</span>
                                <span><strong>Name:</strong> Hello, I'm Tanvir Ahmad from Dhaka.</span>
                              </div>
                              <div className="flex items-start gap-2 bg-black/40 rounded-lg p-2">
                                <span className="font-bold text-purple-400">2.</span>
                                <span><strong>Background:</strong> I'm an instructor passionate about language fluency.</span>
                              </div>
                              <div className="flex items-start gap-2 bg-black/40 rounded-lg p-2">
                                <span className="font-bold text-purple-400">3.</span>
                                <span><strong>Focus:</strong> Right now, I'm helping students bridge to Band 6+.</span>
                              </div>
                              <div className="flex items-start gap-2 bg-black/40 rounded-lg p-2">
                                <span className="font-bold text-purple-400">4.</span>
                                <span><strong>Passion:</strong> In my downtime, I love deep discussions and books.</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tanvir Voice Note Placeholder */}
                        <div className="mb-14 rounded-xl border border-purple-500/30 bg-purple-950/60 p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-500/30 grid place-items-center text-purple-300">
                              <Sparkles size={16} />
                            </div>
                            <div>
                              <p className="font-bold text-white">Video 2 URL Plug-in Slot</p>
                              <p className="text-[10px] text-purple-300">Ready to play upon link update</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => scrollToReel(0)}
                            className="text-[11px] font-bold text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            <RotateCcw size={12} /> Watch Reel 1
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Gradient Dimmer Overlays for Top/Bottom */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                    {/* Right-Side Action Stack (Reels Toolbar) */}
                    <div className="absolute right-3 bottom-16 z-30 flex flex-col items-center gap-4">
                      {/* Heart / Like Button */}
                      <div className="relative flex flex-col items-center">
                        <button
                          type="button"
                          onClick={handleLike}
                          className={`grid h-12 w-12 place-items-center rounded-full backdrop-blur-md transition transform active:scale-75 ${
                            hasLiked[index]
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 scale-110'
                              : 'bg-black/50 text-white border border-white/20 hover:bg-black/70'
                          }`}
                        >
                          <Heart size={22} className={hasLiked[index] ? 'fill-current' : ''} />
                        </button>
                        <span className="mt-1 text-[11px] font-extrabold text-white drop-shadow">
                          {likes[index]}
                        </span>

                        {/* Floating Heart Particles */}
                        <AnimatePresence>
                          {heartParticles.map(p => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 1, scale: 0.8, y: 0, x: 0 }}
                              animate={{ opacity: 0, scale: 1.6, y: -80, x: p.x }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.9, ease: 'easeOut' }}
                              className="pointer-events-none absolute text-rose-400"
                            >
                              <Heart size={26} className="fill-current" />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Mute / Unmute Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        title={isMuted ? 'Unmute' : 'Mute'}
                        className="grid h-11 w-11 place-items-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-md transition hover:bg-black/70"
                      >
                        {isMuted ? <VolumeX size={19} className="text-rose-300" /> : <Volume2 size={19} className="text-emerald-300" />}
                      </button>

                      {/* Playback Speed Controller */}
                      <button
                        type="button"
                        onClick={cyclePlaybackRate}
                        title={`Speed: ${playbackRate}x`}
                        className="grid h-11 w-11 place-items-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-md transition hover:bg-black/70 text-xs font-black"
                      >
                        <span className="text-amber-300">{playbackRate}x</span>
                      </button>

                      {/* View Mode Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewMode(v => v === 'theater' ? 'phone' : 'theater');
                        }}
                        title={viewMode === 'theater' ? 'Switch to Mobile Reels Feed' : 'Switch to Fullscreen Widescreen View'}
                        className="grid h-11 w-11 place-items-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-md transition hover:bg-black/70"
                      >
                        {viewMode === 'theater' ? (
                          <Smartphone size={18} className="text-purple-300" />
                        ) : (
                          <Monitor size={18} className="text-cyan-300" />
                        )}
                      </button>

                      {/* 4-Pillars Formula Cheat Sheet Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCheatSheet(true);
                        }}
                        title="Open 4-Pillar Cheat Sheet"
                        className="grid h-11 w-11 place-items-center rounded-full bg-purple-600/80 border border-purple-400/40 text-white backdrop-blur-md transition hover:scale-105 shadow-lg shadow-purple-600/40 animate-pulse"
                      >
                        <Sparkles size={18} className="text-amber-300" />
                      </button>

                      {/* Google Drive Link if provided */}
                      {reel.driveViewUrl && (
                        <a
                          href={reel.driveViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open original video on Google Drive"
                          className="grid h-11 w-11 place-items-center rounded-full bg-black/50 border border-white/20 text-slate-300 backdrop-blur-md transition hover:text-white"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}

                      {/* YouTube Video Link if provided */}
                      {reel.youtubeUrl && (
                        <a
                          href={reel.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open case study on YouTube"
                          className="grid h-11 w-11 place-items-center rounded-full bg-red-600/90 border border-red-400/40 text-white backdrop-blur-md transition hover:scale-110 shadow-lg shadow-red-600/40"
                        >
                          <Play size={16} className="fill-current ml-0.5" />
                        </a>
                      )}
                    </div>

                    {/* Bottom Content Overlay (Author, Description, Tags) */}
                    <div className="absolute left-3 right-16 bottom-5 z-20 space-y-2 pointer-events-auto">
                      {/* Author Pill */}
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 grid place-items-center font-black text-xs text-white shadow-md">
                          T
                        </div>
                        <span className="text-xs font-black text-white drop-shadow flex items-center gap-1">
                          {reel.instructor || 'Tanvir Ahmad'}
                          <span className="rounded-full bg-blue-500 p-0.5 text-white">
                            <Check size={8} />
                          </span>
                        </span>
                        <span className="rounded-md bg-purple-500/30 px-1.5 py-0.5 text-[9px] font-bold text-purple-200 border border-purple-400/30">
                          Instructor
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-sm font-black text-white leading-snug drop-shadow line-clamp-2">
                        {reel.title}
                      </h3>
                      <p className="text-[11px] text-slate-200 leading-4 line-clamp-2 drop-shadow">
                        {reel.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(reel.tags || []).map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-cyan-300 drop-shadow">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scrubbing Progress Bar at Bottom of Video */}
                    {!isUpcoming && (
                      <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/20">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Floating Up / Down Snap Navigation */}
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToReel(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="glow-button glow-button-muted py-2 px-3 text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                >
                  <ChevronUp size={16} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToReel(activeIndex + 1)}
                  disabled={activeIndex === reels.length - 1}
                  className="glow-button glow-button-blue py-2 px-3 text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                >
                  <span>Next Reel</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Reel Progress Counter Indicator */}
              <div className="flex items-center gap-1.5">
                {reels.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => scrollToReel(i)}
                    className={`cursor-pointer rounded-full transition-all ${
                      i === activeIndex
                        ? 'h-2 w-6 bg-gradient-to-r from-purple-400 to-cyan-400 shadow-md shadow-purple-500/50'
                        : 'h-2 w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Speaking Study Hub & Voice Recorder */}
        <div className={`${viewMode === 'theater' ? 'w-full max-w-4xl mx-auto mt-6' : 'lg:col-span-5'} space-y-6`}>
          {/* Speaking Formula Card */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-950/70 via-slate-900/90 to-slate-950 p-6 shadow-2xl shadow-purple-950/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-500/20 text-purple-300">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    4-Pillar Self-Intro Formula
                  </h4>
                  <p className="text-[11px] font-semibold text-purple-300">
                    No memorization · Natural Band 6+ delivery
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                Elevator Pitch
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  step: '1',
                  name: 'Name & Origin',
                  sample: "Hi, I'm [Your Name], originally from Dhaka, Bangladesh.",
                  hint: 'Clear pronunciation, relaxed smile.',
                },
                {
                  step: '2',
                  name: 'Background / Profession',
                  sample: "I graduated in Computer Science and currently work as a software specialist.",
                  hint: 'State your field in one simple, confident sentence.',
                },
                {
                  step: '3',
                  name: 'Current Focus / IELTS Goal',
                  sample: "Right now, I'm dedicating my focus to achieving IELTS Band 6.5 to pursue higher studies in Canada.",
                  hint: 'Connect your purpose clearly.',
                },
                {
                  step: '4',
                  name: '1 Unique Passion',
                  sample: "Beyond work, I'm a huge fan of landscape photography and weekend cycling.",
                  hint: 'Makes your answer authentic and memorable.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 space-y-2 transition hover:border-purple-400/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-black text-purple-200">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-purple-500/30 text-[10px] text-purple-300 font-bold">
                        {item.step}
                      </span>
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(item.sample, idx)}
                      className="text-[10px] font-bold text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedPillar === idx ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-mono bg-white/[0.03] p-2 rounded-xl border border-white/5">
                    "{item.sample}"
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    💡 {item.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Recording Drill Box */}
          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 p-6 shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                  isRecording ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  <Mic size={18} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    Self-Introduction Voice Drill
                  </h4>
                  <p className="text-[11px] font-semibold text-cyan-300">
                    Record your 60-second spontaneous intro
                  </p>
                </div>
              </div>
              {isRecording && (
                <span className="flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-300 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{formatTime(recordingSeconds)}</span>
                </span>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-xs leading-relaxed text-slate-300">
                Hit record, introduce yourself using the 4 pillars above without reading word-for-word, and listen back to test your flow and pronunciation.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="glow-button glow-button-blue bg-gradient-to-r from-cyan-600 to-blue-600 py-3 px-5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                  >
                    <Mic size={16} />
                    <span>Start Recording (60s)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="glow-button bg-rose-600 hover:bg-rose-500 text-white py-3 px-5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/40 animate-pulse"
                  >
                    <Square size={16} className="fill-current" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordedAudioUrl && (
                  <a
                    href={recordedAudioUrl}
                    download="my-speaking-intro-drill.webm"
                    className="glow-button glow-button-muted py-3 px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Download Recording</span>
                  </a>
                )}
              </div>

              {recordedAudioUrl && (
                <div className="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-3 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Your Drill Recording Ready:
                  </p>
                  <audio src={recordedAudioUrl} controls className="w-full h-8" />
                </div>
              )}
            </div>
          </div>

          {/* Full Practice Navigation Button */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-white">Full AI Speaking Drill Room</p>
              <p className="text-[11px] text-slate-400">Practice with interactive AI prompts &amp; feedback</p>
            </div>
            <a
              href="/speaking-practice?language=english&day=3"
              className="glow-button glow-button-muted py-2 px-3.5 text-xs font-bold flex items-center gap-1 text-purple-300 hover:text-white"
            >
              <span>Open AI Room</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Slide-Up / Full Cheatsheet Modal */}
      {showCheatSheet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setShowCheatSheet(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl w-full overflow-hidden rounded-3xl border border-purple-500/40 bg-slate-950 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-gradient-to-r from-purple-950/80 to-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-purple-500/20 grid place-items-center text-purple-300">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Tanvir's High-Impact Self-Introduction Script
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    Master Formula for IELTS &amp; Everyday Fluency
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCheatSheet(false)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5 text-sm">
              <div className="rounded-2xl border border-purple-400/30 bg-purple-950/40 p-4 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                  Full 60-Second Model Monologue
                </span>
                <p className="text-slate-200 leading-relaxed font-serif text-base italic">
                  "Hello! My name is Tanvir Ahmad, born and raised in Dhaka, Bangladesh. Currently, I am an English language instructor focusing on bridging foundational students to IELTS Band 6 and beyond. In my day-to-day life, I spend most of my energy refining interactive learning tools for learners who want genuine speaking confidence without rote memorization. Outside of teaching, I am truly enthusiastic about reading psychology books, listening to classical podcasts, and exploring new coffee spots on weekends. Thank you!"
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Golden Rules from Tanvir:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>No Memorized Robot Tone:</strong> Talk as if speaking to a colleague over coffee.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>The Pause Power:</strong> Never say "umm... aaah...". Simply pause, take a calm breath, and continue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Smile with Your Voice:</strong> Smiling physically relaxes your vocal cords, making English sound warm and natural.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 p-4 bg-slate-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCheatSheet(false)}
                className="glow-button glow-button-blue py-2.5 px-5 text-xs font-black uppercase tracking-wider"
              >
                Got It, Back to Reels
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

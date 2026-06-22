import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { useAppContext } from '../state/AppContext.jsx';
import { 
  Trophy, Egg, Bird, Flame, Zap, Eye, ArrowRight, 
  Sparkles, Compass, Mountain, Sun, Crown, Lock, CheckCircle2,
  Anchor, Wind, Shield, Rocket, Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- BIOMES: BACKGROUND CHANGES EVERY 7-14 DAYS ---
const BIOMES = [
  { day: 1,  color: "#083344", label: "The Deep Grotto", icon: <Anchor size={14}/> }, // Cyan
  { day: 14, color: "#064e3b", label: "The Verdant Wilds", icon: <Wind size={14}/> },  // Emerald
  { day: 28, color: "#1e1b4b", label: "The Indigo Ridge", icon: <Mountain size={14}/> }, // Blue
  { day: 42, color: "#4c1d95", label: "The Twilight Veil", icon: <Sparkles size={14}/> }, // Purple
  { day: 60, color: "#7c2d12", label: "The Crimson Ascent", icon: <Flame size={14}/> },  // Orange
  { day: 80, color: "#451a03", label: "The Solar Peak", icon: <Sun size={14}/> }      // Gold
];

const LIGHT_BIOMES = [
  { day: 1,  color: "#e0f7ff", label: "The Clear Grotto", icon: <Anchor size={14}/> },
  { day: 14, color: "#dcfce7", label: "The Verdant Wilds", icon: <Wind size={14}/> },
  { day: 28, color: "#e0e7ff", label: "The Indigo Ridge", icon: <Mountain size={14}/> },
  { day: 42, color: "#f3e8ff", label: "The Twilight Veil", icon: <Sparkles size={14}/> },
  { day: 60, color: "#ffedd5", label: "The Crimson Ascent", icon: <Flame size={14}/> },
  { day: 80, color: "#fef3c7", label: "The Solar Peak", icon: <Sun size={14}/> }
];

const WEEKLY_BREAKTHROUGHS = {
  7:  "Your brain has started recognizing new phonetic patterns. The fog is lifting.",
  14: "Basic sentence structures are becoming muscle memory. You're thinking faster.",
  21: "The 'Struggle Barrier' is broken. You can now greet the world with confidence.",
  28: "Your vocabulary bank has tripled. You are no longer just a traveler.",
  35: "Pronunciation is smoothing out. Native sounds are becoming your sounds.",
  42: "You can now sustain a 2-minute conversation without panic.",
  49: "Complex grammar is no longer a puzzle—it's a tool you're using.",
  56: "You've reached the 'Flow State'. Learning feels like breathing.",
  63: "You can watch news and movies and understand the core message.",
  70: "Professional communication is within your reach. You are an Elite.",
  77: "You are starting to dream in your new language. Your soul is bilingual.",
  84: "Transformation nearly complete. You are a leader in this language.",
};

export function PathwaysPage() {
  const { courseData, actions, state } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('english');
  const [unlockTaps, setUnlockTaps] = useState({});
  const [unlockedDays, setUnlockedDays] = useState(() => new Set());
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });
  const activeBiomes = state.theme === 'light' ? LIGHT_BIOMES : BIOMES;

  // --- DYNAMIC BACKGROUND ENGINE ---
  const backgroundColor = useTransform(
    smoothProgress,
    activeBiomes.map(b => (b.day - 1) / 90),
    activeBiomes.map(b => b.color)
  );

  const pathData = useMemo(() => {
    let days = [];
    const pathway = courseData?.[activeTab] || { modules: [] };
    const allLessons = pathway.modules.flatMap(m => m.lessons.map(l => ({...l, moduleTitle: m.title})));

    for (let i = 1; i <= 90; i++) {
      const lesson = allLessons[i - 1];
      days.push({
        id: lesson?.id || `day-${activeTab}-${i}`,
        dayNumber: i,
        title: lesson?.title || `Discovery ${i}`,
        isWeekly: i % 7 === 0,
        isPlaceholder: !lesson,
      });
    }
    return days;
  }, [activeTab, courseData]);

  const nextLessonIndex = useMemo(() => {
    const firstOpenIndex = pathData.findIndex(day => !state.completedLessons?.includes(day.id));
    return firstOpenIndex === -1 ? pathData.length - 1 : firstOpenIndex;
  }, [pathData, state.completedLessons]);

  function handleLockedTap(day) {
    const currentTaps = unlockTaps[day.id] ?? 0;
    const nextTaps = Math.min(currentTaps + 1, 3);

    setUnlockTaps(prev => ({ ...prev, [day.id]: nextTaps }));

    if (nextTaps === 3) {
      setUnlockedDays(prev => {
        const next = new Set(prev);
        next.add(day.id);
        return next;
      });
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    }
  }

  return (
    <motion.div 
      ref={containerRef}
      style={{ background: backgroundColor }}
      className={`pathways-page relative min-h-screen transition-colors duration-1000 ${state.theme === 'light' ? 'text-slate-950' : 'text-white'}`}
    >
      {/* 1. ATMOSPHERIC LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <EnvironmentParticles progress={smoothProgress} />
      </div>

      {/* 2. THE FLOATING PROGRESS HUD */}
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-black/40 p-3 backdrop-blur-2xl sm:p-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <div className="hidden md:block">
               <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Your Journey</div>
               <div className="flex gap-1">
                 {activeBiomes.map(b => (
                   <motion.div 
                     key={b.day}
                     animate={{ opacity: (smoothProgress.get() * 90) >= b.day ? 1 : 0.2 }}
                     className="w-4 h-1 rounded-full bg-white"
                   />
                 ))}
               </div>
            </div>
            <h2 className="text-xl font-black italic tracking-tighter sm:text-2xl">Lugaish Odyssey</h2>
          </div>

          <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1 sm:flex">
            {['english', 'arabic'].map(l => (
              <button 
                key={l} 
                onClick={() => setActiveTab(l)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all sm:px-6 ${activeTab === l ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-28 lg:py-40">
        
        {/* THE FLOATING CHARACTER */}
        <div className="pointer-events-none fixed left-1/2 top-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <EvolutionCharacter progress={smoothProgress} />
        </div>

        {/* THE CENTRAL GLOWING FILAMENT */}
        <div className="absolute bottom-20 left-4 top-16 w-[1px] bg-white/10 sm:left-1/2 sm:top-28 sm:bottom-28 sm:-translate-x-1/2 lg:top-40 lg:bottom-40" />
        <motion.div 
          style={{ scaleY: smoothProgress, originY: 0 }}
          className="absolute bottom-20 left-4 top-16 z-10 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-500 to-amber-500 shadow-[0_0_20px_#fff] sm:left-1/2 sm:top-28 sm:bottom-28 sm:-translate-x-1/2 lg:top-40 lg:bottom-40"
        />

        <div className="relative z-20 space-y-14 sm:space-y-24 lg:space-y-32">
          {pathData.map((day, idx) => {
             const completed = state.completedLessons?.includes(day.id);
             const isToday = !completed && idx === nextLessonIndex;
             const isTomorrow = !completed && idx === nextLessonIndex + 1;
             const isUnlocked = unlockedDays.has(day.id);
             const isLocked = !completed && !isToday && !isTomorrow && !isUnlocked;
             
             if (day.isWeekly) {
               return (
                 <WeeklyBreakthrough 
                   key={day.id} 
                   day={day.dayNumber} 
                   text={WEEKLY_BREAKTHROUGHS[day.dayNumber]} 
                   isPassed={(smoothProgress.get() * 90) >= day.dayNumber}
                 />
               );
             }

             return (
               <StoryNode 
                 key={day.id}
                 day={day}
                 index={idx}
                 completed={completed}
                 isToday={isToday}
                 isTomorrow={isTomorrow}
                 isLocked={isLocked}
                 isUnlocked={isUnlocked}
                 tapCount={unlockTaps[day.id] ?? 0}
                 onLockedTap={() => handleLockedTap(day)}
                 onAction={() => {
                   if (day.isPlaceholder) return;
                   actions.setActiveLesson(day.id, activeTab);
                   navigate(`/lesson/${day.dayNumber}`);
                 }}
               />
             );
          })}
        </div>

        {/* THE FINAL ALTAR */}
        <div className="relative mt-24 flex min-h-[70svh] flex-col items-center justify-center text-center sm:mt-40 lg:mt-60 lg:min-h-screen">
          <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             whileInView={{ opacity: 1, scale: 1 }}
             onViewportEnter={() => confetti({ particleCount: 200, spread: 80, origin: { y: 0.8 } })}
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border-4 border-white bg-gradient-to-t from-amber-500 to-orange-400 shadow-[0_0_70px_rgba(245,158,11,0.45)] sm:h-44 sm:w-44 sm:rounded-[3rem] sm:border-8 lg:h-56 lg:w-56 lg:rounded-[4rem]">
              <Crown size={72} className="text-white sm:h-24 sm:w-24 lg:h-[100px] lg:w-[100px]" />
            </div>
          </motion.div>
          <h2 className="mt-8 text-5xl font-black uppercase italic leading-none tracking-tighter sm:mt-12 sm:text-7xl lg:text-8xl">Apex <br/> Master.</h2>
        </div>
      </main>
    </motion.div>
  );
}

/* ---------------- WEEKLY GATE ---------------- */

function WeeklyBreakthrough({ day, text, isPassed }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="flex w-full justify-center py-8 sm:py-14 lg:py-20"
    >
      <div className={`relative w-full max-w-2xl rounded-[2rem] border-2 p-1 transition-all duration-700 sm:rounded-[3rem] ${isPassed ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent opacity-20'}`}>
         <div className="space-y-4 p-5 text-center sm:p-10">
           <div className="mb-4 flex items-center justify-center gap-2 sm:gap-3">
              <div className="h-px w-6 bg-white/20 sm:w-10" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400 sm:text-xs sm:tracking-[0.4em]">Week {day/7} Breakthrough</span>
              <div className="h-px w-6 bg-white/20 sm:w-10" />
           </div>
           <h3 className="text-lg font-black italic leading-tight tracking-tight sm:text-2xl">
             "{text}"
           </h3>
           <div className="flex flex-wrap justify-center gap-3 pt-4 sm:gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/40"><Shield size={14}/> Protection</div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/40"><Rocket size={14}/> Velocity</div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/40"><Lightbulb size={14}/> Clarity</div>
           </div>
         </div>
      </div>
    </motion.div>
  );
}

/* ---------------- STORY NODE ---------------- */

function StoryNode({ day, index, completed, isToday, isTomorrow, isLocked, isUnlocked, tapCount, onLockedTap, onAction }) {
  const isLeft = index % 2 === 0;
  const alignment = isLeft ? 'justify-start' : 'justify-start sm:justify-end';
  const tapsLeft = Math.max(3 - tapCount, 0);
  const nodeTitle = completed || isToday || isTomorrow || isUnlocked ? day.title : 'Sleepy Step';

  function handleClick() {
    if (isLocked) {
      onLockedTap();
      return;
    }

    if (isToday || completed || isUnlocked) {
      onAction();
    }
  }

  return (
    <div className={`flex w-full ${alignment}`}>
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-50px" }}
        className="w-full max-w-[300px] pl-8 sm:pl-0"
      >
        <div 
          onClick={handleClick}
          className={`relative min-h-[220px] cursor-pointer overflow-hidden rounded-[2rem] border-2 p-5 transition-all duration-500 sm:rounded-[2.5rem] sm:p-8 ${
            isToday 
              ? 'z-20 border-orange-200 bg-gradient-to-br from-orange-100 via-amber-100 to-white text-slate-950 shadow-[0_0_70px_rgba(251,146,60,0.5)] sm:scale-110' 
              : isTomorrow
                ? 'border-amber-300/30 bg-amber-500/10 text-amber-50 shadow-[0_0_32px_rgba(245,158,11,0.16)]'
                : completed 
                  ? 'bg-white/5 border-emerald-500/20 text-white/60' 
                  : isUnlocked
                    ? 'border-cyan-300/30 bg-cyan-500/10 text-white'
                    : 'bg-slate-950/50 border-white/5 text-white/80'
          }`}
        >
          {isToday && (
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                animate={{ scale: [0.9, 1.18, 0.9], opacity: [0.45, 0.85, 0.45] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-400/40 blur-2xl"
              />
              <motion.div
                animate={{ y: [10, -8, 10], rotate: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute bottom-4 right-5 text-6xl"
              >
                🔥
              </motion.div>
            </div>
          )}

          {isTomorrow && (
            <motion.div
              animate={{ opacity: [0.35, 0.7, 0.35], y: [3, -3, 3] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="pointer-events-none absolute bottom-5 right-6 text-4xl opacity-60"
            >
              🔥
            </motion.div>
          )}

          {isLocked && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-950/88 p-5 text-center backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-2 text-cyan-200/80">
                {[...Array(9)].map((_, eyeIndex) => (
                  <motion.div
                    key={eyeIndex}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.45, 1, 0.45] }}
                    transition={{ repeat: Infinity, duration: 1.8 + eyeIndex * 0.08, delay: eyeIndex * 0.05 }}
                  >
                    <Eye size={18} />
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-white">I am almost dead</p>
                <p className="mt-2 text-xs font-bold text-slate-300">
                  Tap {tapsLeft} more {tapsLeft === 1 ? 'time' : 'times'} to unlock me
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Day {day.dayNumber}</span>
             {completed && <CheckCircle2 size={16} className="text-emerald-500" />}
             {isLocked && <Lock size={16} className="text-cyan-200/70" />}
          </div>
          <h3 className="font-black text-xl leading-none uppercase tracking-tighter mb-4">
            {nodeTitle}
          </h3>
          {isToday && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1.5 rounded-full w-fit">
              Burning today <ArrowRight size={12} />
            </div>
          )}
          {isTomorrow && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase bg-amber-300/10 text-amber-100 px-3 py-1.5 rounded-full w-fit">
              Warming up
            </div>
          )}
          {isUnlocked && !completed && !isToday && !day.isPlaceholder && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase bg-cyan-300/10 text-cyan-100 px-3 py-1.5 rounded-full w-fit">
              Unlocked <ArrowRight size={12} />
            </div>
          )}
          {day.isPlaceholder && !isLocked && (
            <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-50">Coming soon</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- CHARACTER ---------------- */

function EvolutionCharacter({ progress }) {
  const [idx, setIdx] = useState(0);
  const stage = useTransform(progress, [0, 0.3, 0.7], [0, 1, 2]);

  useMotionValueEvent(stage, "change", (v) => setIdx(Math.floor(v)));

  return (
    <motion.div 
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="flex flex-col items-center"
    >
      <div className="h-32 w-32 rounded-[2.8rem] bg-black/40 backdrop-blur-3xl border-2 border-white/10 flex items-center justify-center shadow-2xl relative">
         <AnimatePresence mode="wait">
           <motion.div
             key={idx}
             initial={{ scale: 0, rotate: -10 }}
             animate={{ scale: 1, rotate: 0 }}
             exit={{ scale: 0 }}
           >
             {idx === 0 && <Egg size={55} className="text-cyan-400" />}
             {idx === 1 && <Bird size={55} className="text-blue-400" />}
             {idx === 2 && <Flame size={55} className="text-orange-400" />}
           </motion.div>
         </AnimatePresence>
      </div>
      <div className="mt-4 px-4 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
           {idx === 0 ? "Incubating Power" : idx === 1 ? "Wings Unfolding" : "Radiant Soul"}
         </p>
      </div>
    </motion.div>
  );
}

function EnvironmentParticles({ progress }) {
  const particles = useMemo(() => [...Array(25)].map(() => ({
    x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 1,
  })), []);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            y: useTransform(progress, [0, 1], [0, -600 * (p.size / 2)])
          }}
        />
      ))}
    </>
  );
}

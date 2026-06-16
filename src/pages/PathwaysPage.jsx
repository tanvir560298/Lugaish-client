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
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  // --- DYNAMIC BACKGROUND ENGINE ---
  const backgroundColor = useTransform(
    smoothProgress,
    BIOMES.map(b => (b.day - 1) / 90),
    BIOMES.map(b => b.color)
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

  return (
    <motion.div 
      ref={containerRef}
      style={{ background: backgroundColor }}
      className="relative min-h-screen text-white transition-colors duration-1000"
    >
      {/* 1. ATMOSPHERIC LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <EnvironmentParticles progress={smoothProgress} />
      </div>

      {/* 2. THE FLOATING PROGRESS HUD */}
      <header className="sticky top-0 z-[100] p-6 backdrop-blur-2xl border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
               <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Your Journey</div>
               <div className="flex gap-1">
                 {BIOMES.map(b => (
                   <motion.div 
                     key={b.day}
                     animate={{ opacity: (smoothProgress.get() * 90) >= b.day ? 1 : 0.2 }}
                     className="w-4 h-1 rounded-full bg-white"
                   />
                 ))}
               </div>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter">Lugaish Odyssey</h2>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {['english', 'arabic'].map(l => (
              <button 
                key={l} 
                onClick={() => setActiveTab(l)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === l ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 py-40">
        
        {/* THE FLOATING CHARACTER */}
        <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none z-50">
          <EvolutionCharacter progress={smoothProgress} />
        </div>

        {/* THE CENTRAL GLOWING FILAMENT */}
        <div className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-[1px] bg-white/10" />
        <motion.div 
          style={{ scaleY: smoothProgress, originY: 0 }}
          className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-500 to-amber-500 shadow-[0_0_20px_#fff] z-10"
        />

        <div className="space-y-32 relative z-20">
          {pathData.map((day, idx) => {
             const completed = state.completedLessons?.includes(day.id);
             const isNext = !completed && (idx === 0 || state.completedLessons?.includes(pathData[idx-1]?.id));
             
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
                 isNext={isNext}
                 onAction={() => {
                   if (day.isPlaceholder) return;
                   actions.setActiveLesson(day.id, activeTab);
                   navigate('/lesson');
                 }}
               />
             );
          })}
        </div>

        {/* THE FINAL ALTAR */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center mt-60 relative">
          <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             whileInView={{ opacity: 1, scale: 1 }}
             onViewportEnter={() => confetti({ particleCount: 200, spread: 80, origin: { y: 0.8 } })}
          >
            <div className="h-56 w-56 bg-gradient-to-t from-amber-500 to-orange-400 rounded-[4rem] flex items-center justify-center border-8 border-white shadow-[0_0_100px_rgba(245,158,11,0.5)]">
              <Crown size={100} className="text-white" />
            </div>
          </motion.div>
          <h2 className="text-8xl font-black italic tracking-tighter mt-12 leading-none uppercase">Apex <br/> Master.</h2>
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
      className="w-full py-20 flex justify-center"
    >
      <div className={`relative max-w-2xl w-full p-1 border-2 rounded-[3rem] transition-all duration-700 ${isPassed ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent opacity-20'}`}>
         <div className="p-10 text-center space-y-4">
           <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-white/20" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-400">Week {day/7} Breakthrough</span>
              <div className="h-px w-10 bg-white/20" />
           </div>
           <h3 className="text-2xl font-black italic tracking-tight leading-tight">
             "{text}"
           </h3>
           <div className="pt-4 flex justify-center gap-6">
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

function StoryNode({ day, index, completed, isNext, onAction }) {
  const isLeft = index % 2 === 0;

  return (
    <div className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-50px" }}
        className="w-full max-w-[300px]"
      >
        <div 
          onClick={onAction}
          className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer ${
            isNext 
              ? 'bg-white text-slate-900 border-white scale-110 shadow-[0_0_50px_rgba(255,255,255,0.3)] z-20' 
              : completed 
                ? 'bg-white/5 border-emerald-500/20 text-white/60' 
                : 'bg-white/5 border-white/5 text-white/5 blur-[3px] hover:blur-0'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Day {day.dayNumber}</span>
             {completed && <CheckCircle2 size={16} className="text-emerald-500" />}
          </div>
          <h3 className="font-black text-xl leading-none uppercase tracking-tighter mb-4">
            {isNext || completed ? day.title : 'Mystery Step'}
          </h3>
          {isNext && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1.5 rounded-full w-fit">
              Conquer <ArrowRight size={12} />
            </div>
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
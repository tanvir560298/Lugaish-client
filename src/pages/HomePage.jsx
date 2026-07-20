import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../state/AppContext.jsx';
import { COURSE_START_DATE } from '../utils/courseLaunch.js';
import { 
  CheckCircle2, 
  BookOpen,
  Languages,
  Zap, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Target,
  ChevronDown,
  CalendarDays,
  BellRing
} from 'lucide-react';

const HeroScene = lazy(() => import('../components/HeroScene.jsx'));

// Animation Constants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

function getCourseCountdown() {
  const remaining = Math.max(0, COURSE_START_DATE.getTime() - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);

  return { days, hours, minutes, hasStarted: remaining === 0 };
}

function CourseLaunchNotice() {
  const [countdown, setCountdown] = useState(getCourseCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCourseCountdown()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      aria-label="Course launch announcement"
      className="course-launch-notice relative overflow-hidden rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] p-4 shadow-[0_18px_55px_rgba(245,158,11,0.10)] backdrop-blur-xl sm:p-5"
    >
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-300/15 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20">
            <BellRing size={19} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              {countdown.hasStarted ? 'We are live' : 'Course launch announcement'}
            </p>
            <p className="mt-1 text-lg font-black leading-tight text-white sm:text-xl">
              {countdown.hasStarted ? 'অপেক্ষার পালা শেষ—কোর্স এখন শুরু!' : 'অপেক্ষার পালা শেষ হতে চলেছে!'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-300 sm:text-sm">
              <CalendarDays size={15} className="text-amber-300" aria-hidden="true" />
              {countdown.hasStarted ? 'Your learning journey starts here.' : 'কোর্স শুরু হচ্ছে ১ আগস্ট ২০২৬'}
            </p>
          </div>
        </div>

        {!countdown.hasStarted && (
          <div className="grid shrink-0 grid-cols-3 gap-2" aria-label={`${countdown.days} days, ${countdown.hours} hours and ${countdown.minutes} minutes remaining`}>
            {[
              [countdown.days, 'Days'],
              [countdown.hours, 'Hours'],
              [countdown.minutes, 'Min']
            ].map(([value, label]) => (
              <div key={label} className="min-w-14 rounded-xl border border-white/10 bg-slate-950/55 px-2 py-2 text-center">
                <span className="block text-lg font-black tabular-nums text-white">{String(value).padStart(2, '0')}</span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}

export function HomePage() {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();
  const isLoggedIn = state.isLoggedIn;
  const [showHeroScene, setShowHeroScene] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const scheduleHeroScene = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 250));
    const cancelHeroScene = window.cancelIdleCallback ?? window.clearTimeout;
    const id = scheduleHeroScene(() => setShowHeroScene(true));

    return () => cancelHeroScene(id);
  }, []);

  const handleStart = (path) => {
    if (isLoggedIn) {
      actions.enrollPathway(path);
    } else {
      actions.switchPathway(path);
    }
    navigate(isLoggedIn ? '/pathways' : '/login');
  };

  return (
    <div className="home-page bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- HERO: THE GRAND ENTRANCE --- */}
      <section className="home-hero relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden py-14 sm:py-20 lg:min-h-screen lg:py-0 lg:pt-20">
        {showHeroScene && (
          <Suspense fallback={<div className="absolute inset-0 bg-slate-950" />}>
            <HeroScene />
          </Suspense>
        )}

        <div className="app-shell relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <CourseLaunchNotice />

            {/* Mascot Welcome */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="hero-kicker inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md sm:px-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Sparkles size={16} />
              </div>
              <span className="text-xs font-bold text-blue-100 sm:text-sm">AI-powered English and Arabic learning.</span>
            </motion.div>

            <h1 className="text-5xl font-black leading-[0.9] tracking-tighter sm:text-6xl md:text-8xl lg:text-9xl">
              Climb to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 italic">
                Fluency.
              </span>
            </h1>

            <p className="max-w-lg text-base font-medium leading-relaxed text-slate-400 sm:text-lg lg:text-xl">
              Join <span className="text-white">1,200+ early adopters</span> mastering English and Arabic through AI-guided practice, daily 10-minute "ascents," and weekly interview preparation.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-5 sm:pt-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStart('english')}
                className="hero-primary-button group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white transition-all sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
              >
                Start English <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStart('arabic')}
                className="hero-secondary-button flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4 text-base font-black text-white transition-all sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
              >
                Start Arabic
              </motion.button>
            </div>
            
            <div className="flex flex-col gap-3 pt-2 text-slate-500 sm:flex-row sm:items-center sm:gap-6 sm:pt-4">
               <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">AI-Powered Practice</span>
               </div>
               <div className="flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Weekly Interview Prep</span>
               </div>
            </div>
          </motion.div>

          {/* Interactive Preview Card */}
          <motion.div
            style={{ y: yOffset }}
            className="hidden lg:block relative"
          >
             <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full" />
             <div className="hero-preview relative glass-card p-2 rounded-[3rem] border border-white/10 shadow-2xl">
                <div className="bg-slate-950 rounded-[2.8rem] overflow-hidden border border-white/5 p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Target size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Mission</p>
                        <p className="text-sm font-bold">Daily Greetings</p>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
                      10m
                    </div>
                  </div>
                  
                  {/* Visual Ladder Preview */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className={`h-12 w-full rounded-2xl border flex items-center px-4 gap-4 ${step === 1 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5'}`}>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${step === 1 ? 'bg-blue-500' : 'bg-slate-800'}`}>
                          {step === 1 ? <CheckCircle2 size={12} /> : step}
                        </div>
                        <div className={`h-2 rounded-full bg-current opacity-20 ${step === 1 ? 'w-24' : 'w-16'}`} />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <div className="hero-preview-action w-full h-14 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center font-black gap-2">
                      Continue Ascent <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 opacity-50 sm:bottom-10"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Explore</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* --- THE ASCENT PHILOSOPHY --- */}
      <section className="home-features relative border-y border-white/5 bg-slate-900/30 py-16 sm:py-24 lg:py-32">
        <div className="app-shell">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-3 lg:gap-12">
            {[
              { icon: <Zap />, iconClass: "text-blue-500", title: "AI-Guided Practice", desc: "Use AI-assisted prompts and review to practice English and Arabic with more confidence between lessons." },
              { icon: <Flame />, iconClass: "text-orange-500", title: "Daily Momentum", desc: "Build a habit that lasts. 10 minutes of focused lessons, practice, and progress tracking keeps you moving." },
              { icon: <Trophy />, iconClass: "text-emerald-500", title: "Interview Readiness", desc: "Prepare for weekly output checks with guided speaking practice, progress milestones, and structured pathways." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                className={`home-feature-card home-feature-card-${i + 1} rounded-[2rem] border border-white/5 bg-slate-950 p-6 transition-all hover:border-blue-500/20 sm:p-8 lg:p-10 group`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${item.iconClass}`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PATHWAY SELECTION --- */}
      <section className="home-pathways overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="app-shell">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">Choose your <br/>Learning Destination.</h2>
            <p className="mx-auto max-w-2xl text-base italic text-slate-400 sm:text-xl">"A different language is a different vision of life."</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <PathCard 
              keyName="english"
              icon={<BookOpen size={34} />}
              badge="English Speaking"
              title="Speak Global English" 
              desc="AI-supported English practice for business, travel, interviews, and confident daily communication."
              color="blue"
              features={["AI Practice Support", "Business Meetings", "Interview Readiness"]}
              onStart={() => handleStart('english')}
            />
            <PathCard 
              keyName="arabic"
              icon={<Languages size={34} />}
              badge="Arabic Fluency"
              title="Understand Arabic" 
              desc="AI-assisted Arabic practice with cultural context, everyday phrases, and guided confidence-building."
              color="emerald"
              features={["AI Practice Support", "Cultural Context", "Daily Conversation"]}
              onStart={() => handleStart('arabic')}
            />
          </div>
        </div>
      </section>

      {/* --- THE "ESCAPE" PRICING TEASER --- */}
      <section className="home-offer relative overflow-hidden bg-gradient-to-b from-transparent to-blue-900/10 py-16 sm:py-24 lg:py-32">
        <div className="app-shell relative z-10">
           <div className="home-offer-card glass-card relative overflow-hidden rounded-[2rem] border border-blue-500/20 p-6 text-center sm:rounded-[3rem] sm:p-12 md:p-20 lg:rounded-[4rem]">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />
              
              {/* Mascot Cameo */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-8 inline-block rounded-2xl bg-white px-4 py-3 text-xs font-black text-slate-950 shadow-2xl sm:mb-10 sm:px-6 sm:text-sm"
              >
                🎉 PREMIUM IS FREE RIGHT NOW!
              </motion.div>

              <h2 className="mb-6 text-4xl font-black leading-none tracking-tighter sm:text-5xl md:text-8xl">
                Become a <br/> Founding Member.
              </h2>
              
              <p className="mx-auto mb-8 max-w-2xl text-base text-slate-300 sm:mb-12 sm:text-xl">
                Join the launch phase and get <span className="text-white font-bold underline underline-offset-8 decoration-emerald-500">full premium access for free</span>, including AI-assisted practice support as the platform grows. 
                Normally 299 BDT/mo — today, it's our gift to you.
              </p>

              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-[1.5rem] bg-white px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-colors hover:bg-emerald-400 sm:w-auto sm:rounded-[2rem] sm:px-12 sm:py-6 sm:text-2xl"
                >
                  View Launch Offer
                </motion.button>
              </Link>

              <div className="mt-8 flex flex-col justify-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 sm:mt-12 sm:flex-row sm:gap-8">
                <span>No Credit Card</span>
                <span>•</span>
                <span>Lifetime Founding Status</span>
                <span>•</span>
                <span>Limited Slots</span>
              </div>
           </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <footer className="home-final-section py-16 text-center sm:py-24 lg:py-32">
         <div className="app-shell">
            <div className="home-final-card mx-auto max-w-3xl rounded-[2rem] border border-blue-400/20 bg-slate-900/70 px-6 py-10 shadow-[0_30px_90px_rgba(37,99,235,0.18)] sm:rounded-[3rem] sm:px-10 sm:py-14">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Start your first lesson</p>
              <h2 className="text-3xl font-black uppercase tracking-[0.12em] text-white sm:text-5xl">Ready to climb?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Sign in with Google and continue your English or Arabic pathway with AI-assisted practice support.
              </p>
              <div className="mt-8 flex justify-center">
                 <button
                   onClick={() => navigate('/login')}
                   className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-black text-slate-950 shadow-[0_18px_50px_rgba(255,255,255,0.18)] transition hover:bg-emerald-300 hover:shadow-[0_22px_60px_rgba(52,211,153,0.24)] sm:w-auto sm:px-10 sm:text-xl"
                 >
                   Continue with Google <ArrowRight size={22} />
                 </button>
              </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENT: PATH CARD ---
const pathCardColors = {
  blue: {
    ghost: 'text-blue-500/5',
    dot: 'bg-blue-500',
    hover: 'group-hover:bg-blue-500',
  },
  emerald: {
    ghost: 'text-emerald-500/5',
    dot: 'bg-emerald-500',
    hover: 'group-hover:bg-emerald-500',
  },
};

function PathCard({ icon, badge, title, desc, color, features, onStart }) {
  const colorClasses = pathCardColors[color] ?? pathCardColors.blue;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`home-path-card home-path-card-${color} group relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/50 p-6 sm:rounded-[3rem] sm:p-10 lg:rounded-[3.5rem] lg:p-12`}
    >
      <div className={`pointer-events-none absolute right-0 top-0 p-8 text-[7rem] font-black ${colorClasses.ghost} transition-opacity group-hover:opacity-10 sm:p-12 sm:text-[12rem]`}>
        {color === 'blue' ? 'EN' : 'AR'}
      </div>
      
      <div className="relative z-10">
        <div className={`home-path-icon mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ${colorClasses.dot} text-white shadow-2xl sm:mb-8`}>
          {icon}
        </div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{badge}</p>
        <h3 className="mb-4 text-3xl font-black sm:text-4xl">{title}</h3>
        <p className="mb-8 max-w-xs text-base text-slate-400 sm:text-lg">{desc}</p>
        
        <ul className="mb-8 space-y-4 sm:mb-12">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 font-bold text-sm text-slate-300">
              <div className={`h-2 w-2 rounded-full ${colorClasses.dot}`} />
              {f}
            </li>
          ))}
        </ul>

        <button 
          onClick={onStart}
          className={`home-path-button w-full rounded-2xl bg-white py-4 text-base font-black text-slate-950 transition-all ${colorClasses.hover} group-hover:text-white sm:py-5 sm:text-lg`}
        >
          Launch Pathway
        </button>
      </div>
    </motion.div>
  );
}

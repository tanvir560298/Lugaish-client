import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../state/AppContext.jsx';
import { 
  CheckCircle2, 
  Globe2, 
  Zap, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Target,
  ChevronDown
} from 'lucide-react';
import HeroScene from '../components/HeroScene.jsx';

// Animation Constants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function HomePage() {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();
  const isLoggedIn = state.isLoggedIn;
  const { scrollYProgress } = useScroll();
  
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const handleStart = (path) => {
    actions.switchPathway(path);
    navigate(isLoggedIn ? '/pathways' : '/login');
  };

  return (
    <div className="bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- HERO: THE GRAND ENTRANCE --- */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-slate-950" />}>
          <HeroScene />
        </Suspense>

        <div className="app-shell relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Mascot Welcome */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Sparkles size={16} />
              </div>
              <span className="text-sm font-bold text-blue-100">Welcome to the future of learning.</span>
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
              Climb to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 italic">
                Fluency.
              </span>
            </h1>

            <p className="max-w-lg text-xl text-slate-400 leading-relaxed font-medium">
              Join <span className="text-white">1,200+ early adopters</span> mastering English and Arabic through daily 10-minute "ascents." No fluff, just progress.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStart('english')}
                className="group px-10 py-5 bg-blue-600 rounded-2xl font-black text-xl text-white flex items-center gap-3 transition-all"
              >
                Start English <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStart('arabic')}
                className="px-10 py-5 bg-slate-900 border border-slate-800 rounded-2xl font-black text-xl text-white flex items-center gap-3 transition-all"
              >
                Start Arabic
              </motion.button>
            </div>
            
            <div className="flex items-center gap-6 text-slate-500 pt-4">
               <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Free Premium Launch</span>
               </div>
               <div className="flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">5-Day Streaks</span>
               </div>
            </div>
          </motion.div>

          {/* Interactive Preview Card */}
          <motion.div
            style={{ y: yOffset }}
            className="hidden lg:block relative"
          >
             <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full" />
             <div className="relative glass-card p-2 rounded-[3rem] border border-white/10 shadow-2xl">
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
                    <div className="w-full h-14 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center font-black gap-2">
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
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 opacity-50 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Explore</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* --- THE ASCENT PHILOSOPHY --- */}
      <section className="py-32 relative bg-slate-900/30 border-y border-white/5">
        <div className="app-shell">
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { icon: <Zap />, color: "blue", title: "Instant Impact", desc: "Start speaking from Day 1. Our lessons focus on high-frequency communication." },
              { icon: <Flame />, color: "orange", title: "Daily Momentum", desc: "Build a habit that lasts. 10 minutes is all you need to reach new heights." },
              { icon: <Trophy />, color: "emerald", title: "Mastery Path", desc: "Unlock certificates and badges as you conquer increasingly complex pathways." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                className="p-10 rounded-[2.5rem] bg-slate-950 border border-white/5 hover:border-blue-500/20 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-${item.color}-500`}>
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
      <section className="py-32 overflow-hidden">
        <div className="app-shell">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6">Choose your <br/>Learning Destination.</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto italic">"A different language is a different vision of life."</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <PathCard 
              keyName="english"
              flag="🇬🇧" 
              title="Speak Global English" 
              desc="The standard for business, travel, and international technology."
              color="blue"
              features={["Native Pronunciation", "Business Meetings", "Daily Slang"]}
              onStart={() => handleStart('english')}
            />
            <PathCard 
              keyName="arabic"
              flag="🇸🇦" 
              title="Understand Arabic" 
              desc="Unlock cultural depth and colloquial fluency across the Arab world."
              color="emerald"
              features={["Alphabet Basics", "Cultural Context", "Daily Conversation"]}
              onStart={() => handleStart('arabic')}
            />
          </div>
        </div>
      </section>

      {/* --- THE "ESCAPE" PRICING TEASER --- */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="app-shell relative z-10">
           <div className="glass-card p-12 md:p-20 rounded-[4rem] border border-blue-500/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />
              
              {/* Mascot Cameo */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-block px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm mb-10 shadow-2xl"
              >
                🎉 PREMIUM IS FREE RIGHT NOW!
              </motion.div>

              <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                Become a <br/> Founding Member.
              </h2>
              
              <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-12">
                Join the launch phase and get <span className="text-white font-bold underline underline-offset-8 decoration-emerald-500">full premium access for free</span>. 
                Normally 299 BDT/mo — today, it's our gift to you.
              </p>

              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-2xl shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:bg-emerald-400 transition-colors"
                >
                  View Launch Offer
                </motion.button>
              </Link>

              <div className="mt-12 flex justify-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-xs">
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
      <footer className="py-32 text-center">
         <div className="app-shell">
            <h2 className="text-4xl font-black text-slate-700 mb-8 uppercase tracking-widest">Ready to climb?</h2>
            <div className="flex justify-center">
               <button 
                 onClick={() => navigate('/login')}
                 className="flex items-center gap-3 text-2xl font-black text-white hover:text-blue-400 transition-colors"
               >
                 Create Your Profile <ArrowRight />
               </button>
            </div>
         </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENT: PATH CARD ---
function PathCard({ flag, title, desc, color, features, onStart }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`relative p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 overflow-hidden group`}
    >
      <div className={`absolute top-0 right-0 p-12 text-[12rem] font-black text-${color}-500/5 pointer-events-none group-hover:opacity-10 transition-opacity`}>
        {flag}
      </div>
      
      <div className="relative z-10">
        <div className="text-6xl mb-8">{flag}</div>
        <h3 className="text-4xl font-black mb-4">{title}</h3>
        <p className="text-slate-400 text-lg mb-8 max-w-xs">{desc}</p>
        
        <ul className="space-y-4 mb-12">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 font-bold text-sm text-slate-300">
              <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
              {f}
            </li>
          ))}
        </ul>

        <button 
          onClick={onStart}
          className={`w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-lg group-hover:bg-${color}-500 group-hover:text-white transition-all`}
        >
          Launch Pathway
        </button>
      </div>
    </motion.div>
  );
}
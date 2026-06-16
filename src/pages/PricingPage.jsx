import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Zap, 
  Star,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

// --- THE ESCAPING MASCOT ---
const EscapingMascot = () => {
  return (
    <motion.div 
      className="absolute -left-12 top-20 z-30 hidden lg:block"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Speech Bubble */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-20 -left-16 bg-yellow-400 text-slate-900 px-4 py-2 rounded-2xl font-black text-xs shadow-xl border-2 border-slate-900 whitespace-nowrap"
      >
        I'M OUTTA HERE! <br/> IT'S FREE OVER THERE! 🏃‍♂️
        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-yellow-400 rotate-45 border-r-2 border-b-2 border-slate-900" />
      </motion.div>

      {/* The Mascot Character (Runner) */}
      <motion.div
        animate={{ 
          x: [-2, 2, -2],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="relative"
      >
        {/* Character Body */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border-4 border-white/20 shadow-2xl flex items-center justify-center">
           <div className="flex gap-2">
             <div className="w-2 h-4 bg-white rounded-full animate-pulse" />
             <div className="w-2 h-4 bg-white rounded-full animate-pulse" />
           </div>
           {/* Reaching Arm */}
           <motion.div 
             animate={{ rotate: [0, -30, 0] }}
             transition={{ duration: 0.3, repeat: Infinity }}
             className="absolute -left-6 top-6 w-10 h-3 bg-indigo-500 rounded-full border-2 border-white/20 origin-right"
           />
        </div>
      </motion.div>
    </motion.div>
  );
};

export function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 text-slate-50 sm:pb-24 lg:pb-32">
      
      {/* GLOW BACKGROUNDS */}
      <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-[90px] sm:h-96 sm:w-96 sm:blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-[90px] sm:h-96 sm:w-96 sm:blur-[120px]" />

      <div className="app-shell relative z-10 pt-10 sm:pt-16 lg:pt-20">
        
        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-24">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 sm:mb-6 sm:px-4 sm:text-xs"
          >
            <Sparkles size={14} />
            Limited Founding Member Launch
          </motion.div>
          <h1 className="mb-5 text-4xl font-black leading-none tracking-tighter sm:text-5xl md:text-7xl">
            Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase italic">Entire Path</span>
          </h1>
          <p className="text-base text-slate-400 sm:text-lg md:text-xl">
            Lugaish is currently in early-access. To celebrate our launch, 
            we are giving away <span className="text-white font-bold underline decoration-blue-500">Lifetime Premium Access</span> to our first users.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
          
          {/* --- CARD 1: THE FOUNDING ACCESS (FREE) --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            className="relative group"
          >
            {/* Pulsing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[3rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-6 sm:rounded-[2.8rem] sm:p-10 md:p-14">
              <div className="mb-8 flex items-start justify-between gap-4 sm:mb-12">
                <div>
                  <h2 className="mb-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Founding <br/>Member</h2>
                  <p className="text-emerald-400 font-bold flex items-center gap-2">
                    <TrendingDown size={18} />
                    100% OFF — Limited Time
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 sm:h-16 sm:w-16 sm:rounded-3xl">
                  <Star size={32} fill="currentColor" />
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black italic tracking-tighter sm:text-7xl">FREE</span>
                  <span className="text-lg font-bold text-slate-500 line-through sm:text-2xl">299 BDT</span>
                </div>
                <p className="text-slate-400 mt-2 font-medium">Full access to English & Arabic pathways.</p>
              </div>

              <div className="mb-8 space-y-4 sm:mb-12">
                {[
                  "Complete English Language Path",
                  "Complete Arabic Language Path",
                  "Daily Progress Tracking",
                  "Native Audio Pronunciation",
                  "Founding Member Exclusive Badge",
                  "Priority Future Updates"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 py-4 text-base font-black text-white shadow-2xl shadow-blue-500/20 transition-all hover:shadow-emerald-500/40 sm:py-6 sm:text-xl"
                >
                  Get Started Free <ArrowRight size={22} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* --- CARD 2: PRO (PAID/FUTURE) --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            className="relative"
          >
            {/* THE CHARACTER ESCAPING FROM THIS CARD */}
            <EscapingMascot />

            <div className="group relative h-full overflow-hidden rounded-[2rem] border-2 border-purple-500/30 bg-slate-900/50 p-6 backdrop-blur-xl sm:rounded-[2.8rem] sm:p-10 md:p-14">
              {/* Subtle Overlay to show it's "coming soon" but still pretty */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none" />
              
              <div className="mb-8 flex items-start justify-between gap-4 sm:mb-12">
                <div>
                  <h2 className="mb-2 text-3xl font-black italic tracking-tight text-slate-300 sm:text-4xl">Pro <br/>Plan</h2>
                  <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">Upcoming Price</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 sm:h-16 sm:w-16 sm:rounded-3xl">
                  <Zap size={32} />
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tighter text-slate-500 sm:text-7xl">299</span>
                  <span className="text-lg font-bold italic text-slate-500 sm:text-2xl">BDT/mo</span>
                </div>
                <p className="text-slate-500 mt-2 font-medium">Standard price for new students post-launch.</p>
              </div>

              <div className="mb-8 space-y-4 opacity-50 sm:mb-12">
                {[
                  "Standard Course Access",
                  "Daily Progress Tracking",
                  "Community Support",
                  "Basic Audio Tools"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-slate-700" />
                    <span className="text-slate-500 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 text-base font-black text-slate-600 sm:py-6 sm:text-xl">
                Become a Pro
              </div>
              
              <p className="text-center mt-6 text-purple-400/50 text-sm font-bold animate-pulse">
                 Locked — Join Free Access Instead!
              </p>
            </div>
          </motion.div>

        </div>

        {/* URGENCY SECTION */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="mx-auto mt-12 flex max-w-4xl flex-col items-stretch justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:mt-20 sm:p-8 md:flex-row md:items-center md:gap-8"
        >
          <div className="flex items-start gap-4 sm:items-center sm:gap-6">
            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Clock size={28} className="animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Don't wait for the price hike.</h4>
              <p className="text-slate-400">Join our launch community today and keep your free access forever.</p>
            </div>
          </div>
          <Link to="/login">
            <button className="w-full rounded-xl bg-white px-8 py-4 font-black text-slate-900 transition-colors hover:bg-emerald-400 md:w-auto">
              Claim My Spot
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

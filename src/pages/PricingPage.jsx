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
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden pb-32">
      
      {/* GLOW BACKGROUNDS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="app-shell relative z-10 pt-20">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} />
            Limited Founding Member Launch
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase italic">Entire Path</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl">
            Lugaish is currently in early-access. To celebrate our launch, 
            we are giving away <span className="text-white font-bold underline decoration-blue-500">Lifetime Premium Access</span> to our first users.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto relative">
          
          {/* --- CARD 1: THE FOUNDING ACCESS (FREE) --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            className="relative group"
          >
            {/* Pulsing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[3rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative h-full bg-slate-900 rounded-[2.8rem] border border-white/10 p-10 md:p-14 overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-white mb-2">Founding <br/>Member</h2>
                  <p className="text-emerald-400 font-bold flex items-center gap-2">
                    <TrendingDown size={18} />
                    100% OFF — Limited Time
                  </p>
                </div>
                <div className="h-16 w-16 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400">
                  <Star size={32} fill="currentColor" />
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black tracking-tighter italic">FREE</span>
                  <span className="text-slate-500 line-through text-2xl font-bold">299 BDT</span>
                </div>
                <p className="text-slate-400 mt-2 font-medium">Full access to English & Arabic pathways.</p>
              </div>

              <div className="space-y-4 mb-12">
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
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl text-white font-black text-xl shadow-2xl shadow-blue-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3"
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

            <div className="h-full bg-slate-900/50 backdrop-blur-xl rounded-[2.8rem] border-2 border-purple-500/30 p-10 md:p-14 relative overflow-hidden group">
              {/* Subtle Overlay to show it's "coming soon" but still pretty */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-300 mb-2 italic">Pro <br/>Plan</h2>
                  <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">Upcoming Price</p>
                </div>
                <div className="h-16 w-16 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-400">
                  <Zap size={32} />
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black tracking-tighter text-slate-500">299</span>
                  <span className="text-slate-500 text-2xl font-bold italic">BDT/mo</span>
                </div>
                <p className="text-slate-500 mt-2 font-medium">Standard price for new students post-launch.</p>
              </div>

              <div className="space-y-4 mb-12 opacity-50">
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

              <div className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-slate-600 font-black text-xl flex items-center justify-center gap-3 cursor-not-allowed">
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
           className="mt-20 p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Clock size={28} className="animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Don't wait for the price hike.</h4>
              <p className="text-slate-400">Join our launch community today and keep your free access forever.</p>
            </div>
          </div>
          <Link to="/login">
            <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-emerald-400 transition-colors">
              Claim My Spot
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
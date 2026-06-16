import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ We only import the basic ones that aren't breaking. 
// If these break too, we will replace them with SVGs as well.
import { 
  Sparkles, 
  Zap, 
  Code, 
  Video, 
  PenTool, 
  GraduationCap, 
  User, 
  Cpu, 
  Globe 
} from 'lucide-react';

// --- 🛡️ FAIL-PROOF SVG ICONS (Manually Defined) ---
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const TEAM_DATA = [
  { id: 1, name: "Dr. Sarah Ahmed", role: "Lead English Instructor", category: "Instruction", bio: "Linguistics expert with 12+ years of experience in ESL and cognitive learning.", icon: <GraduationCap size={24} />, color: "from-blue-500 to-cyan-400" },
  { id: 2, name: "Yasin Mansour", role: "Arabic Curriculum Designer", category: "Instruction", bio: "Specializes in Modern Standard Arabic and colloquial dialects for global learners.", icon: <Globe size={24} />, color: "from-emerald-500 to-teal-400" },
  { id: 3, name: "Alex Rivera", role: "Senior Web Developer", category: "Technology", bio: "Crafting the digital engine and the 'Odyssey' experience.", icon: <Code size={24} />, color: "from-purple-500 to-pink-400" },
  { id: 4, name: "Layla Chen", role: "Lead Video Editor", category: "Creative", bio: "The eye behind the cinematic lesson visuals and motion graphics.", icon: <Video size={24} />, color: "from-orange-500 to-red-400" },
  { id: 5, name: "Marcus Thorne", role: "UI/UX Architect", category: "Technology", bio: "Designing interfaces that feel like a quest, not an app.", icon: <Cpu size={24} />, color: "from-indigo-500 to-blue-400" },
  { id: 6, name: "Sofia Rossi", role: "Content Editor", category: "Creative", bio: "Ensuring every word is crisp, professional, and impactful.", icon: <PenTool size={24} />, color: "from-yellow-400 to-orange-500" }
];

const CATEGORIES = ["All", "Instruction", "Technology", "Creative"];

export function ArchitectsPage() {
  const [filter, setFilter] = useState("All");
  const filteredTeam = TEAM_DATA.filter(member => filter === "All" ? true : member.category === filter);

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-40 overflow-hidden">
      <section className="relative py-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
            <Sparkles size={14} /> The Minds Behind Lugaish
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-white">
            The Architects.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed">
            A collective of instructors, engineers, and creators dedicated to transforming how the world communicates.
          </p>
        </div>
      </section>

      <nav className="flex justify-center mb-20 px-6">
        <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10 backdrop-blur-xl">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-8 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6">
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTeam.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -10 }} className="group relative h-[450px] rounded-[3rem] bg-slate-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20">
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${member.color} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
      <div className="p-10 h-full flex flex-col">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white mb-8 shadow-2xl`}>
          {member.icon}
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-3xl font-black tracking-tighter text-white leading-none">{member.name}</h3>
          <p className="text-blue-400 text-xs font-black uppercase tracking-widest">{member.role}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
        </div>
        <div className="flex gap-4 pt-8 border-t border-white/5">
          <SocialIcon icon={<TwitterIcon />} />
          <SocialIcon icon={<LinkedinIcon />} />
          <SocialIcon icon={<GithubIcon />} />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <User size={150} strokeWidth={1} color="white" />
      </div>
    </motion.div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all">
      {icon}
    </button>
  );
}
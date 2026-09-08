import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Star, 
  Quote, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TESTIMONIALS = [
  {
    name: 'Fahim Rahman',
    role: 'Frontend Engineer',
    location: 'Dhaka',
    avatarBg: 'from-blue-500 to-indigo-600',
    initials: 'FR',
    track: 'English Pathway',
    streak: '14-Day Streak',
    story: 'The weekly interview readiness checks gave me the exact speaking cadence I needed to pass my overseas remote developer interview.',
    rating: 5,
  },
  {
    name: 'Dr. Nabila Khan',
    role: 'Healthcare Professional',
    location: 'Sylhet',
    avatarBg: 'from-emerald-500 to-teal-600',
    initials: 'NK',
    track: 'Arabic Pathway',
    streak: '21-Day Streak',
    story: 'Learning conversational Arabic in 10-minute daily ascents fits into my hospital schedule without overwhelming me. It feels effortless.',
    rating: 5,
  },
  {
    name: 'Samiul Hasan',
    role: 'Computer Science Student',
    location: 'Chittagong',
    avatarBg: 'from-purple-500 to-pink-600',
    initials: 'SH',
    track: 'Founding Member',
    streak: '30-Day Streak',
    story: 'The instant AI feedback loop on pronunciation is like having a private tutor in my pocket 24/7. My confidence jumped in two weeks.',
    rating: 5,
  },
];

export function SocialProofSection() {
  return (
    <section className="home-social-proof relative overflow-hidden border-t border-white/5 bg-slate-950/60 py-16 sm:py-24 lg:py-32">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="app-shell relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-emerald-300">
            <Award size={14} />
            <span>Proven Milestones</span>
          </div>
          <h2 className="text-3xl font-black text-white sm:text-5xl md:text-6xl tracking-tight">
            Built for learners who demand <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">
              real-world fluency.
            </span>
          </h2>
          <p className="text-base text-slate-400 sm:text-lg">
            See how early adopters are transforming their daily routines into career-defining confidence.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md transition hover:border-blue-500/30"
            >
              <div>
                {/* Rating Stars & Track Badge */}
                <div className="flex items-center justify-between gap-2 pb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                    <Flame size={12} className="text-orange-400" />
                    {item.streak}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
                  "{item.story}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-white/5 pt-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.avatarBg} text-xs font-black text-white shadow-md`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role} • {item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Milestone Certificate Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-amber-300/30 bg-gradient-to-br from-amber-500/[0.08] via-slate-950 to-blue-950/40 p-6 sm:p-10 lg:p-12 shadow-2xl"
        >
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300">
                <ShieldCheck size={14} />
                <span>Verified Credentials</span>
              </div>
              <h3 className="text-2xl font-black text-white sm:text-4xl">
                Earn Official Milestone Certificates
              </h3>
              <p className="text-sm text-slate-300 sm:text-base leading-relaxed max-w-xl">
                Every 7, 14, and 30 days of consistent ascents unlock cryptographically verified, shareable certificates. Showcase your verified fluency on LinkedIn, CVs, and professional portfolios.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Permanent verification URL</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>High-resolution printable PDF</span>
                </div>
              </div>
            </div>

            {/* Certificate Visual Card Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border-2 border-amber-300/60 bg-slate-950 p-6 shadow-2xl shadow-amber-500/10 text-center">
                <div className="absolute inset-1.5 rounded-xl border border-amber-200/20 pointer-events-none" />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300/80 bg-white p-1 shadow-lg shadow-amber-400/20">
                  <img src="/favicon.png" alt="Lugaish Seal" className="h-full w-full object-contain rounded-full" />
                </div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Certificate of Completion</p>
                <h4 className="mt-1 text-base font-black text-white">Founding Learner Ascent</h4>
                <p className="mt-1 text-xs text-slate-400 font-medium">Verified 14-Day Consecutive Mastery</p>
                <div className="mt-4 flex items-center justify-center gap-3 border-t border-white/10 pt-3 text-[10px] font-bold text-slate-400">
                  <span>Lugaish Official Seal</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-400">LUG-CERT-2026</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

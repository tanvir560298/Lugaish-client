import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  ArrowRight, 
  CreditCard, 
  PhoneCall, 
  Calendar, 
  Award, 
  BookOpen, 
  MessageSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';
import { InPersonBatchModal } from './InPersonBatchModal.jsx';

export function InPersonBatchCard({ className = '', variant = 'pricing' }) {
  const { state } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [localUnlocked, setLocalUnlocked] = useState(false);

  // Check if unlocked via state or localStorage
  const isUnlocked = Boolean(
    state.inPersonBatch?.hasApplied ||
    state.inPersonBatch?.status === 'pending' ||
    state.inPersonBatch?.status === 'approved' ||
    state.inPersonBatch?.status === 'enrolled' ||
    localUnlocked
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lugaish_in_person_unlocked');
      if (stored === 'true') {
        setLocalUnlocked(true);
      }
    }
  }, [state.inPersonBatch]);

  const batchStatus = state.inPersonBatch?.status || 'pending';
  const paymentStatus = state.inPersonBatch?.paymentStatus || 'unpaid';

  const statusLabel = 
    batchStatus === 'enrolled' ? 'Enrolled & Confirmed' :
    batchStatus === 'approved' ? 'Seat Reserved (Approved)' :
    batchStatus === 'contacted' ? 'Coordinator In Touch' :
    'Application Received';

  const statusColor = 
    batchStatus === 'enrolled' ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300' :
    batchStatus === 'approved' ? 'border-blue-400/40 bg-blue-500/20 text-blue-300' :
    'border-amber-400/40 bg-amber-500/20 text-amber-300';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
          isUnlocked
            ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-500/10'
            : 'border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl'
        } ${className}`}
      >
        {/* Glow Accents */}
        <div className={`absolute -right-16 -top-16 h-64 w-64 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${
          isUnlocked ? 'bg-emerald-500/20' : 'bg-blue-600/15'
        }`} />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="relative p-6 sm:p-10 md:p-12">
          
          {/* Top Pill / Badge */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                isUnlocked 
                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' 
                  : 'border-amber-400/30 bg-amber-500/10 text-amber-300'
              }`}>
                {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                {isUnlocked ? 'Unlocked & Active' : 'Private Cohort • Gated Access'}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-300">
                Paid In-Person Batch
              </span>
            </div>

            {isUnlocked && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
                {statusLabel}
              </span>
            )}
          </div>

          {/* Title & Headline */}
          <div className="mb-8">
            <h3 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Private In-Person Batch
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              {isUnlocked
                ? 'Welcome! You have unlocked full access to the Lugaish in-person cohort at the Islamic University of Madinah. Review your batch details, venue location, and seat confirmation below.'
                : 'An exclusive face-to-face language immersion cohort at the Islamic University of Madinah with Tanvir Ahmad & Ishaat Alhumaidi. Strictly limited to 12 students per batch.'}
            </p>
          </div>

          {/* Gated / Locked State */}
          {!isUnlocked && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/20">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Small Group Classroom Training</h4>
                    <p className="mt-0.5 text-xs text-slate-400">Strictly capped at 12 seats for personalized, face-to-face attention.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Venue: Islamic University of Madinah</h4>
                    <p className="mt-0.5 text-xs text-slate-400">Campus venue in Madinah Munawwarah with dedicated weekend and evening class timings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/20">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Paid Intensive Curriculum</h4>
                    <p className="mt-0.5 text-xs text-slate-400">Complete printed kits, live mock interview drills, and direct mentor coaching.</p>
                  </div>
                </div>
              </div>

              {/* Locked Teaser Box */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 p-5 text-center sm:p-6">
                <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-black uppercase tracking-widest mb-1.5">
                  <Lock size={14} /> Schedule & Pricing Gated
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  To keep the in-person cohort exclusive and focused, full batch schedule, exact physical venue, and fee structure are visible only to applicants who express interest.
                </p>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-500 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Sparkles size={17} />
                  Fill Form to Unlock Private Batch
                </button>
              </div>
            </div>
          )}

          {/* Unlocked State: Full Details & Paid Fee Revealed */}
          {isUnlocked && (
            <div className="space-y-8">
              {/* Pricing Display */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    In-Person Cohort Tuition
                  </span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">Upcoming</span>
                    <span className="rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1 text-xs font-black text-purple-300 uppercase">
                      Paid Batch
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">This is a paid cohort. Official tuition fee will be announced soon directly to shortlisted candidates.</p>
                </div>

                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-right">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Seat Capacity</span>
                  <span className="text-lg font-black text-emerald-300">Max 12 Seats</span>
                  <span className="block text-[10px] text-slate-400">Small Cohort Guarantee</span>
                </div>
              </div>

              {/* In-Person Perks Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Islamic University of Madinah", desc: "Campus venue in Madinah Munawwarah with dedicated class setup", icon: <MapPin size={16} className="text-blue-400" /> },
                  { title: "1-on-1 Speaking Correction", desc: "Live accent, phonetics, and articulation coaching in real time", icon: <MessageSquare size={16} className="text-emerald-400" /> },
                  { title: "Printed Master Workbook", desc: "Physical study kit, daily drills, and lexical notebooks included", icon: <BookOpen size={16} className="text-purple-400" /> },
                  { title: "Weekly In-Person Interviews", desc: "Face-to-face simulation to eliminate speaking hesitation", icon: <Users size={16} className="text-amber-400" /> },
                  { title: "Dual Master Instructors", desc: "Instruction directed by Tanvir Ahmad & Ishaat Alhumaidi", icon: <Zap size={16} className="text-cyan-400" /> },
                  { title: "Physical Stamped Certificate", desc: "Verified physical credential presented at graduation", icon: <Award size={16} className="text-emerald-400" /> },
                ].map((perk, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5">
                    <div className="mt-0.5 shrink-0">{perk.icon}</div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{perk.title}</h5>
                      <p className="text-[11px] text-slate-400">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment & Seat Confirmation Details */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-widest">
                  <CreditCard size={16} /> Payment & Account Information
                </div>

                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3.5">
                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Account Details</span>
                    <span className="block mt-1 font-semibold text-white text-sm">Will be announced later</span>
                    <span className="text-[10px] text-amber-400 font-semibold mt-0.5 block">Shared upon admission</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3.5">
                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Batch Type</span>
                    <span className="block mt-1 font-bold text-white text-sm">Paid In-Person Batch</span>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">Fee announced soon</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3.5">
                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Venue</span>
                    <span className="block mt-1 font-bold text-white text-sm">Univ. of Madinah</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Madinah, Saudi Arabia</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-white/10 text-slate-300">
                  <p>
                    📌 <strong>Note:</strong> Official payment account numbers and fee details will be announced and sent directly to shortlisted candidates once applications are reviewed.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/8801700000000?text=${encodeURIComponent('Hello Lugaish Team, I have filled the Private In-Person Batch interest form and want to confirm my seat.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  <PhoneCall size={18} /> Chat with Admission Coordinator
                </a>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-slate-300 hover:bg-white/10 transition"
                >
                  Edit Interest Preferences
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>

      {/* Interest Form Modal */}
      <InPersonBatchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setLocalUnlocked(true);
        }}
      />
    </>
  );
}

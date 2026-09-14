import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Send, 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { useAppContext } from '../state/AppContext.jsx';

export function InPersonBatchModal({ isOpen, onClose, onSuccess }) {
  const { state, actions } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: state.userName || '',
    email: state.userEmail || (typeof window !== 'undefined' ? localStorage.getItem('lugaish_in_person_email') || '' : ''),
    phone: '',
    whatsapp: '',
    city: 'Madinah',
    area: '',
    preferredTrack: state.activePathway || 'english',
    preferredSchedule: 'weekend_morning',
    occupation: state.learnerProfile?.profession || '',
    learningGoal: state.learnerProfile?.expectation || '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setError('Please enter a valid phone number (at least 8 digits) so our coordinator can reach you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await actions.applyInPersonBatch({
        ...formData,
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
      });
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Could not register your interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-blue-500/10 sm:p-10 my-auto"
        >
          {/* Top Glow */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  <Sparkles size={13} /> Details Unlocked
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  Welcome to the Private In-Person Batch!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                  Your interest form has been recorded. Full schedule, physical classroom venue, and paid seat reservation details are now unlocked on your screen.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-medium text-slate-400 text-left max-w-md mx-auto space-y-1">
                <p><strong className="text-white">Registered for:</strong> {formData.preferredTrack === 'both' ? 'English + Arabic' : formData.preferredTrack.toUpperCase()} In-Person Cohort</p>
                <p><strong className="text-white">Preferred Slot:</strong> {formData.preferredSchedule.replace('_', ' ').toUpperCase()}</p>
                <p><strong className="text-white">Contact Phone:</strong> {formData.phone}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-3.5 text-sm font-black text-white shadow-xl hover:opacity-95 transition"
              >
                View Unlocked Batch Details
              </button>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-blue-300">
                  <Lock size={12} /> Exclusive Private Cohort
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Private In-Person Batch
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Limited to 12 students at the Islamic University of Madinah for high-touch, face-to-face mentorship and live speaking practice. Fill out this brief form to unlock schedule, venue, and fee details.
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-xs font-semibold text-red-200">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Phone Number (Call / SMS) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      WhatsApp Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-emerald-500/70" />
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        placeholder="Same as phone or WhatsApp #"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Target Pathway
                    </label>
                    <select
                      value={formData.preferredTrack}
                      onChange={(e) => handleChange('preferredTrack', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 px-3 text-sm text-white focus:border-blue-400 focus:outline-none"
                    >
                      <option value="english">English Masterclass</option>
                      <option value="arabic">Arabic Pathway</option>
                      <option value="both">Both (Combined)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Location / Campus Area
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => handleChange('area', e.target.value)}
                        placeholder="Madinah / Univ. Campus"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Preferred Timing
                    </label>
                    <select
                      value={formData.preferredSchedule}
                      onChange={(e) => handleChange('preferredSchedule', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 px-3 text-sm text-white focus:border-blue-400 focus:outline-none"
                    >
                      <option value="weekend_morning">Weekend Morning (Fri/Sat)</option>
                      <option value="weekend_evening">Weekend Evening (Fri/Sat)</option>
                      <option value="weekday_evening">Weekday Evening</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    What is your primary goal for this in-person batch?
                  </label>
                  <textarea
                    rows={2}
                    value={formData.learningGoal}
                    onChange={(e) => handleChange('learningGoal', e.target.value)}
                    placeholder="E.g., Job interview preparation, public speaking, fluent Quranic/conversational Arabic..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 py-4 text-base font-black text-white shadow-xl shadow-blue-500/20 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 transition"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {isSubmitting ? 'Registering Interest...' : 'Unlock Private In-Person Batch Details'}
                  </button>
                  <p className="text-center text-[11px] font-medium text-slate-500 mt-2.5">
                    🔒 Submitting registers your priority and immediately unlocks batch schedule, physical location, and paid fee structure.
                  </p>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

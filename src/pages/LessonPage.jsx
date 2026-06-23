import { motion } from 'framer-motion';
import { ArrowLeft, Clock3, Sparkles, TimerReset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, getPathFromState } from '../state/AppContext.jsx';

export function LessonPage() {
  const { state, courseData } = useAppContext();
  const pathway = getPathFromState(state, courseData);
  const navigate = useNavigate();

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{pathway.title}</p>
          <h1 className="text-3xl font-black text-white sm:text-5xl">Lesson is coming soon</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            We are preparing this level. Please wait for the next content drop.
          </p>
        </div>
        <button
          type="button"
          className="glow-button glow-button-muted"
          onClick={() => navigate('/daily-lessons')}
        >
          <ArrowLeft size={18} />
          Daily lessons
        </button>
      </div>

      <div className="section-card relative min-h-[58svh] overflow-hidden p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_34rem)]" />
        <div className="relative grid min-h-[50svh] place-items-center text-center">
          <div className="w-full max-w-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="mx-auto grid h-36 w-36 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_70px_rgba(16,185,129,0.2)]"
            >
              <TimerReset size={58} />
            </motion.div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-emerald-400">
              Level loading
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
              Coming Soon
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-400">
              This lesson page is currently locked while the full class content is being prepared.
            </p>

            <div className="mx-auto mt-8 h-3 max-w-sm overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.25, ease: 'easeInOut' }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
              />
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/daily-lessons')}
                className="glow-button glow-button-blue justify-center"
              >
                <Clock3 size={18} />
                Wait for update
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="glow-button glow-button-muted justify-center"
              >
                <Sparkles size={18} />
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

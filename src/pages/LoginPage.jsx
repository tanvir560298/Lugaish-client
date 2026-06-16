import { useState, useEffect, useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../state/AppContext.jsx';
import { 
  User, 
  Mail, 
  Briefcase, 
  Target, 
  Clock, 
  Share2, 
  ChevronRight, 
  Trophy,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

 // --- SUB-COMPONENT: THE CLIMBING CHARACTER (FIXED VERSION) ---
const LadderVisual = ({ progress }) => {
  const messages = [
    "Ready to start the climb?",
    "Great start! Keep going!",
    "You're halfway to the top!",
    "Almost there, don't stop!",
    "One more step to greatness!",
    "CONGRATS! YOU MADE IT! 🏆"
  ];

  // Logic to ensure message index stays within bounds
  const currentMessage = messages[Math.min(
    Math.floor((progress / 100) * messages.length), 
    messages.length - 1
  )];

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center pt-32 pb-12 px-12">
      {/* 
         CONTAINER BOX 
         Added overflow-visible to ensure bubble isn't clipped 
      */}
      <div className="relative h-[400px] w-24 overflow-visible">
        
        {/* The Ladder Rails */}
        <div className="absolute inset-y-0 left-0 w-2 bg-slate-800/50 rounded-full" />
        <div className="absolute inset-y-0 right-0 w-2 bg-slate-800/50 rounded-full" />
        
        {/* The Rungs (Steps) */}
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className="absolute left-0 right-0 h-2 bg-slate-800/50 rounded-full"
            style={{ top: `${(i) * 16.6}%` }}
          />
        ))}

        {/* The Glowing Progress Line */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-emerald-400 to-emerald-300 rounded-full z-10"
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />

        {/* The Character (Lugie) */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-30"
          initial={{ bottom: '0%' }}
          animate={{ 
            // We stop at 95% visually so the head doesn't clip the very top rail
            bottom: `${progress}%`,
            y: progress === 100 ? [0, -10, 0] : 0
          }}
          transition={{ 
            bottom: { type: 'spring', stiffness: 60, damping: 15 },
            y: { duration: 2, repeat: Infinity }
          }}
        >
          {/* Speech Bubble - Adjusted positioning to never get cut off */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentMessage}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -65, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-2xl font-black text-xs shadow-2xl border-2 transition-colors duration-500 ${
                progress === 100 
                ? 'bg-emerald-500 text-white border-emerald-400' 
                : 'bg-white text-slate-900 border-blue-100'
              }`}
            >
              {currentMessage}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b-2 border-r-2 ${
                progress === 100 ? 'bg-emerald-500 border-emerald-400' : 'bg-white border-blue-100'
              }`} />
            </motion.div>
          </AnimatePresence>

          {/* Character Body */}
          <motion.div 
             className={`w-16 h-16 rounded-2xl shadow-2xl border-4 flex items-center justify-center transition-all duration-500 ${
               progress === 100 
               ? 'bg-emerald-500 border-white shadow-emerald-500/50 scale-110' 
               : 'bg-gradient-to-br from-blue-500 to-emerald-500 border-white/20'
             }`}
          >
            {progress === 100 ? (
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Trophy size={32} className="text-white" />
              </motion.div>
            ) : (
              <Sparkles size={32} className="text-white" />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Floor */}
      <div className="mt-8 text-center">
        <div className="w-48 h-2 bg-slate-800/50 rounded-full mx-auto" />
        <p className="mt-4 text-slate-500 font-black uppercase tracking-[0.4em] text-[9px]">Level: {Math.floor(progress / 20) + 1}</p>
      </div>
    </div>
  );
};

export function LoginPage() {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? '/dashboard';
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: state.userName || '',
    email: state.userEmail || '',
    password: '',
    profession: state.learnerProfile?.profession || '',
    expectation: state.learnerProfile?.expectation || '',
    courseDuration: state.learnerProfile?.courseDuration || '',
    referralSource: state.learnerProfile?.referralSource || '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dynamic progress calculation based on non-empty strings
  const progress = useMemo(() => {
    const fields = isLogin
      ? [form.email, form.password]
      : Object.values(form);
    const filledFields = fields.filter(value => value && value.trim() !== '').length;
    return (filledFields / fields.length) * 100;
  }, [form, isLogin]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (state.isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;
    if (!isLogin && !form.name.trim()) return;

    setError('');
    setIsSubmitting(true);

    try {
      await actions.authenticate({
        mode: isLogin ? 'login' : 'signup',
        name: form.name.trim() || form.email.split('@')[0],
        email: form.email.trim(),
        password: form.password,
        languageSelected: state.activePathway,
        learnerProfile: {
          profession: form.profession,
          expectation: form.expectation,
          courseDuration: form.courseDuration,
          referralSource: form.referralSource,
        },
      });
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setIsSubmitting(false);
      return;
    }

    setIsSuccess(true);
    
    // Epic Celebration
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, 1600);
  };

  // --- REGISTRATION UI ---
  return (
    <section className="relative min-h-[calc(100svh-96px)]">
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        
        {/* LEFT COLUMN: THE LADDER (STICKY) */}
        <div className="sticky top-12 hidden lg:block h-[650px] rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-visible">
           <LadderVisual progress={progress} />
        </div>

        {/* RIGHT COLUMN: THE FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-7 py-2 sm:space-y-10 sm:py-4"
        >
          <div className="space-y-4">
             <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">
               {isLogin ? 'Welcome Back.' : 'Start your Ascent.'}
             </h1>
             <p className="text-base text-slate-400 sm:text-lg">
               {isLogin ? 'Sign in to continue your English and Arabic learning journey.' : 'Complete your profile to unlock your personalized pathway.'}
             </p>
          </div>

          <div className="grid grid-cols-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`rounded-[1.2rem] px-4 py-3 text-sm font-black transition-all ${isLogin ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`rounded-[1.2rem] px-4 py-3 text-sm font-black transition-all ${!isLogin ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {!isLogin && <InputField label="Name" value={form.name} onChange={v => updateField('name', v)} />}
              <InputField label="Email" type="email" value={form.email} onChange={v => updateField('email', v)} />
              <InputField label="Password" type="password" value={form.password} onChange={v => updateField('password', v)} />
            </div>

            {!isLogin && (
              <>
                <SelectField 
                  label="Profession" 
                  value={form.profession}
                  onChange={v => updateField('profession', v)}
                  options={["Student", "Teacher", "Professional", "Business Owner", "Freelancer", "Other"]}
                />

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">Your Expectations</label>
                  <textarea
                    value={form.expectation}
                    onChange={e => updateField('expectation', e.target.value)}
                    placeholder="I want to speak confidently..."
                    className="w-full h-32 rounded-[2rem] border border-white/10 bg-slate-900/50 px-6 py-4 text-white focus:border-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <SelectField 
                    label="Course Duration" 
                    value={form.courseDuration}
                    onChange={v => updateField('courseDuration', v)}
                    options={["1 Month", "3 Months", "6 Months", "Flexible"]}
                  />
                  <SelectField 
                    label="How you found us" 
                    value={form.referralSource}
                    onChange={v => updateField('referralSource', v)}
                    options={["Social Media", "Friend", "Search", "Other"]}
                  />
                </div>
              </>
            )}

            {error && (
              <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-100">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              className={`w-full rounded-[1.5rem] py-4 text-base font-black transition-all sm:rounded-[2rem] sm:py-6 sm:text-xl ${
                progress === 100 
                ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Connecting...' : isSuccess ? "Finishing the Climb..." : progress === 100 ? (isLogin ? 'Continue Learning' : 'Ready to Launch!') : (isLogin ? 'Enter Email & Password' : 'Complete the Steps Above')}
            </button>

            <p className="text-center text-sm font-semibold text-slate-400">
              {isLogin ? "Don't have an account yet? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(prev => !prev);
                  setError('');
                }}
                className="text-blue-300 hover:text-emerald-300"
              >
                {isLogin ? 'Create your ascent profile' : 'Sign in instead'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>

      {/* FULL SCREEN CELEBRATION OVERLAY */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} className="mb-6 rounded-[2rem] bg-emerald-500 p-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] sm:mb-8 sm:rounded-[3rem] sm:p-8">
              <Trophy size={64} className="text-white sm:h-20 sm:w-20" />
            </motion.div>
            <h2 className="mb-2 text-4xl font-black text-white sm:text-6xl">YOU MADE IT!</h2>
            <p className="text-lg font-bold italic tracking-tight text-emerald-400 sm:text-2xl">Your premium journey starts now.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Minimalist Internal Components for the form
function InputField({ label, value, onChange, type="text" }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-400 ml-1">{label}</label>
      <input 
        type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all focus:border-blue-500 sm:px-6 sm:py-4"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-400 ml-1">{label}</label>
      <select 
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-blue-500 sm:px-6 sm:py-4"
      >
        <option value="">Select Option</option>
        {options.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
      </select>
    </div>
  );
}

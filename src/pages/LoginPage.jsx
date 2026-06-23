import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, LockKeyhole, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getGoogleRedirectLoginResult, isFirebaseConfigured, signInWithGoogle, waitForFirebaseUser } from '../lib/firebase.js';
import { useAppContext } from '../state/AppContext.jsx';

const GOOGLE_REDIRECT_CONTEXT_KEY = 'lugaish_google_redirect_context';
const SIGNUP_ENABLED = false;

function getFriendlyAuthError(error) {
  const code = error?.code || error?.message || '';

  if (code.includes('auth/configuration-not-found')) {
    return 'Firebase Authentication is not enabled yet. Enable Google sign-in in Firebase Console.';
  }

  if (code.includes('auth/operation-not-allowed')) {
    return 'Google sign-in is not enabled yet. Turn on Google provider in Firebase Authentication.';
  }

  if (code.includes('auth/unauthorized-domain')) {
    return 'This local domain is not authorized in Firebase. Add 127.0.0.1 and localhost in Authorized domains.';
  }

  if (code.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in was closed before finishing.';
  }

  if (code.includes('auth/missing-initial-state')) {
    return 'Safari blocked the sign-in state. Use the same live domain as Firebase authDomain, then try again.';
  }

  return error?.message || 'Google sign in failed';
}

function LadderVisual({ progress = 0, isSignup = false }) {
  const progressPercent = Math.max(0, Math.min(1, progress)) * 100;
  const currentStep = Math.round(progress * 5);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-12 pb-12 pt-28">
      <div className="absolute left-16 top-16 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
        {isSignup ? `${currentStep}/5 profile steps` : 'Secure sign in'}
      </div>

      <div className="relative h-[430px] w-28 overflow-visible">
        <div className="absolute inset-y-0 left-0 w-2 rounded-full bg-slate-800/50" />
        <div className="absolute inset-y-0 right-0 w-2 rounded-full bg-slate-800/50" />
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`absolute left-0 right-0 h-2 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-emerald-400/80' : 'bg-slate-800/70'}`}
            style={{ top: `${i * 16.6}%` }}
          />
        ))}

        <motion.div
          className="absolute bottom-0 left-0 right-0 z-10 rounded-full bg-gradient-to-t from-blue-600 via-emerald-400 to-emerald-300"
          animate={{ height: `${Math.max(12, progressPercent)}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />

        <motion.div
          className="absolute left-1/2 z-30 -translate-x-1/2"
          animate={{ bottom: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        >
          <motion.div
            animate={{ opacity: 1, y: -65, scale: progress > 0 ? 1 : 0.95 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="absolute left-1/2 whitespace-nowrap rounded-2xl border-2 border-emerald-400 bg-emerald-500 px-4 py-2 text-xs font-black text-white shadow-2xl -translate-x-1/2"
          >
            {isSignup ? (progress >= 1 ? 'Ready to start.' : 'Fill to climb.') : 'One click return.'}
            <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-emerald-400 bg-emerald-500" />
          </motion.div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-emerald-500 shadow-2xl shadow-emerald-500/50">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </motion.div>
      </div>

      {[0, 1, 2].map(index => (
        <div
          key={index}
          className={`absolute right-16 rounded-2xl border px-4 py-3 text-sm font-black shadow-2xl backdrop-blur transition-colors duration-500 ${
            currentStep > index + 1
              ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100'
              : 'border-white/10 bg-white/5 text-white'
          }`}
          style={{ top: `${34 + index * 15}%` }}
        >
          Step {index + 1}
        </div>
      ))}
    </div>
  );
}

export function LoginPage({ mode = 'login' }) {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? '/dashboard';
  const isSignup = SIGNUP_ENABLED && (mode === 'signup' || location.pathname === '/signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    displayName: '',
    profession: '',
    expectation: '',
    courseDuration: '',
    referralSource: '',
  });

  const celebrate = () => {
    const end = Date.now() + 1400;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#10b981'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#10b981'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const finishGoogleLogin = async ({ idToken, user }, context = {}) => {
    await actions.authenticateWithFirebase({
      idToken,
      languageSelected: context.languageSelected ?? state.activePathway,
      displayName: context.displayName ?? form.displayName,
      firebaseUser: {
        name: user.displayName,
        email: user.email,
        avatarUrl: user.photoURL,
      },
      learnerProfile: context.isSignup
        ? {
            profession: context.learnerProfile?.profession ?? '',
            expectation: context.learnerProfile?.expectation ?? '',
            courseDuration: context.learnerProfile?.courseDuration ?? '',
            referralSource: context.learnerProfile?.referralSource ?? '',
          }
        : undefined,
    });
    setIsSuccess(true);
    celebrate();
    setTimeout(() => navigate(redirectTo, { replace: true }), 900);
  };

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let ignore = false;

    async function handleRedirectResult() {
      setIsSubmitting(true);
      try {
        const storedContext = sessionStorage.getItem(GOOGLE_REDIRECT_CONTEXT_KEY);
        const redirectResult = await getGoogleRedirectLoginResult();
        const result = redirectResult ?? (storedContext ? await waitForFirebaseUser() : null);
        if (!result) {
          setIsSubmitting(false);
          return;
        }

        const context = JSON.parse(storedContext || '{}');
        sessionStorage.removeItem(GOOGLE_REDIRECT_CONTEXT_KEY);
        if (!ignore) await finishGoogleLogin(result, context);
      } catch (err) {
        if (!ignore) {
          setError(getFriendlyAuthError(err));
          setIsSubmitting(false);
        }
      }
    }

    handleRedirectResult();

    return () => {
      ignore = true;
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      sessionStorage.setItem(GOOGLE_REDIRECT_CONTEXT_KEY, JSON.stringify({
        isSignup,
        languageSelected: state.activePathway,
        displayName: form.displayName,
        learnerProfile: {
          profession: form.profession,
          expectation: form.expectation,
          courseDuration: form.courseDuration,
          referralSource: form.referralSource,
        },
      }));
      await signInWithGoogle();
    } catch (err) {
      setError(getFriendlyAuthError(err));
      setIsSubmitting(false);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const completedFields = [
    form.displayName,
    form.profession,
    form.courseDuration,
    form.expectation,
    form.referralSource,
  ].filter(value => value.trim()).length;
  const visualProgress = isSignup ? completedFields / 5 : 0.45;

  if (state.isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="relative min-h-[calc(100svh-96px)]">
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="sticky top-12 hidden h-[650px] overflow-visible rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-sm lg:block">
          <LadderVisual progress={visualProgress} isSignup={isSignup} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 py-2 sm:py-4"
        >
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
              <Sparkles size={14} />
              {isSignup ? 'Google only signup' : 'Google only sign in'}
            </p>
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">
              {isSignup ? 'Start your ascent.' : 'Continue your ascent.'}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {isSignup
                ? 'Tell us a little about your goal, then create your account with Google.'
                : 'Use your Google account to return to your lessons, progress, and enrolled courses.'}
            </p>
          </div>

          <div className="section-card max-w-xl p-6 sm:p-8">
            {isSignup ? (
            <div className="mb-6 grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="displayName" className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Name
                </label>
                <input
                  id="displayName"
                  value={form.displayName}
                  onChange={event => updateForm('displayName', event.target.value)}
                  placeholder="Your preferred name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:bg-white/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="profession" className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Profession
                  </label>
                  <input
                    id="profession"
                    value={form.profession}
                    onChange={event => updateForm('profession', event.target.value)}
                    placeholder="Student, job holder..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:bg-white/10"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="courseDuration" className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Course Duration
                  </label>
                  <div className="select-field">
                    <select
                      id="courseDuration"
                      value={form.courseDuration}
                      onChange={event => updateForm('courseDuration', event.target.value)}
                    >
                      <option value="">Choose one</option>
                      <option value="3-months">3 months</option>
                      <option value="6-months">6 months</option>
                      <option value="1-year">1 year</option>
                      <option value="2-years">2 years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="expectation" className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Learning Goal
                </label>
                <textarea
                  id="expectation"
                  value={form.expectation}
                  onChange={event => updateForm('expectation', event.target.value)}
                  placeholder="Speaking, job interview, travel, Quranic Arabic..."
                  rows={3}
                  className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:bg-white/10"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="referralSource" className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  How did you hear about us?
                </label>
                <div className="select-field">
                  <select
                    id="referralSource"
                    value={form.referralSource}
                    onChange={event => updateForm('referralSource', event.target.value)}
                  >
                    <option value="">Choose one</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="friend">Friend or family</option>
                    <option value="search">Google search</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            ) : (
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <LockKeyhole size={22} />
                </div>
                <h2 className="text-xl font-black text-white">Welcome back</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-400">
                  Sign in with the same Google account you used before. Your profile and courses stay attached.
                </p>
              </div>
            )}

            <div className="mb-6 grid gap-3">
              {[
                'No password to remember',
                'One account for English and Arabic courses',
                'Course enrollment stays attached to your Google account',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>

            {isFirebaseConfigured ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="google-login-shell flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-emerald-500" />}
                Continue with Google
              </button>
            ) : (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-sm font-semibold text-amber-100">
                Firebase login needs the frontend Firebase environment values.
              </div>
            )}

            {error && (
              <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-100">
                {error}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center backdrop-blur-2xl"
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

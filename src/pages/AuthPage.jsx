import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext.jsx';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { actions, state } = useAppContext();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await actions.authenticate({
        mode: isLogin ? 'login' : 'signup',
        name: name || email.split('@')[0],
        email,
        password,
        languageSelected: state.activePathway,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[60vh] py-20">
      <div className="max-w-md mx-auto section-card p-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-slate-400 mb-8">
          {isLogin ? 'Sign in to continue learning' : 'Start your language journey today'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button type="submit" className="glow-button glow-button-blue w-full py-3 font-bold mt-6">
            {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <p className="text-center text-slate-400 mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </section>
  );
}

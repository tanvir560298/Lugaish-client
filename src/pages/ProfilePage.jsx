import { useAppContext } from '../state/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();

  if (!state.isLoggedIn) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-300 mb-4">Please log in to view your profile</p>
      </div>
    );
  }

  const level = Math.floor(state.xp / 500) + 1;

  return (
    <section className="space-y-8 pb-12 sm:space-y-12 sm:pb-20">
      <div className="-mx-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-10 sm:-mx-6 sm:px-6 sm:py-16">
        <h1 className="text-4xl font-black text-white sm:text-5xl">Your Profile</h1>
      </div>

      <div className="app-shell max-w-2xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="section-card p-6 text-center sm:p-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white">
            {state.userName?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{state.userName || 'Learner'}</h2>
          <p className="text-slate-400 mb-6">Level {level} • {state.xp.toLocaleString()} XP</p>

          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-8 sm:gap-4">
            <div>
              <p className="text-sm text-slate-400">Streak</p>
              <p className="text-xl font-bold text-yellow-400 sm:text-2xl">🔥 {state.streak}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Lessons</p>
              <p className="text-xl font-bold text-emerald-400 sm:text-2xl">{state.completedLessons.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Badges</p>
              <p className="text-xl font-bold text-purple-400 sm:text-2xl">{state.badges.length}</p>
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="section-card p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">📊 Learning Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Language</p>
              <p className="font-bold text-white">
                {state.activePathway === 'english' ? '🇬🇧 English' : '🇸🇦 Arabic'}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Current Day</p>
              <p className="font-bold text-white">Day {state.activeLessonId.split('-')[2] || 1}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Total XP</p>
              <p className="font-bold text-white">{state.xp.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Premium Status</p>
              <p className="font-bold text-emerald-400">🔓 Active</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-card p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/today')}
              className="glow-button glow-button-blue w-full text-left px-6 py-4"
            >
              → Continue Learning
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="glow-button glow-button-muted w-full text-left px-6 py-4"
            >
              → View Progress
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="section-card p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">⚙️ Settings</h3>
          <div className="space-y-4">
            <button
              onClick={actions.toggleTheme}
              className="w-full flex justify-between items-center p-4 rounded-lg hover:bg-white/5 transition"
            >
              <span className="text-slate-300">Theme</span>
              <span className="text-sm font-semibold text-slate-400">
                {state.theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
            <button
              onClick={actions.logout}
              className="w-full text-left px-4 py-4 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 hover:bg-red-500/20 transition font-semibold"
            >
              ← Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useAppContext } from '../state/AppContext.jsx';
import { Link } from 'react-router-dom';

export function ProgressPage() {
  const { state } = useAppContext();

  const level = Math.floor(state.xp / 500) + 1;
  const completionPercent = (state.completedLessons.length / 30) * 100;

  return (
    <section className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 py-16 -mx-6 px-6">
        <h1 className="text-5xl font-black text-white">Your Progress</h1>
      </div>

      <div className="app-shell space-y-8">
        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="section-card p-8 text-center">
            <p className="text-sm text-slate-400 mb-2">TOTAL XP</p>
            <p className="text-4xl font-black text-white">{state.xp.toLocaleString()}</p>
          </div>
          <div className="section-card p-8 text-center">
            <p className="text-sm text-slate-400 mb-2">CURRENT LEVEL</p>
            <p className="text-4xl font-black text-blue-400">{level}</p>
          </div>
          <div className="section-card p-8 text-center">
            <p className="text-sm text-slate-400 mb-2">STREAK</p>
            <p className="text-4xl font-black text-yellow-400">🔥 {state.streak}</p>
          </div>
          <div className="section-card p-8 text-center">
            <p className="text-sm text-slate-400 mb-2">LESSONS COMPLETED</p>
            <p className="text-4xl font-black text-emerald-400">{state.completedLessons.length}</p>
          </div>
        </div>

        {/* Completion Bar */}
        <div className="section-card p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Course Progress</h2>
            <p className="text-lg font-bold text-slate-300">{Math.round(completionPercent)}%</p>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-4">
            {state.completedLessons.length} of 30 lessons completed
          </p>
        </div>

        {/* Badges */}
        <div className="section-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🏆 Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: '7-Day Streak', unlocked: state.streak >= 7 },
              { name: 'First 10 Lessons', unlocked: state.completedLessons.length >= 10 },
              { name: 'XP Master (500+)', unlocked: state.xp >= 500 },
              { name: 'Halfway There (15/30)', unlocked: state.completedLessons.length >= 15 },
              { name: 'Course Complete (30/30)', unlocked: state.completedLessons.length >= 30 },
              { name: 'Consistency King', unlocked: state.streak >= 14 },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-6 text-center transition ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/50'
                    : 'bg-slate-900/30 border border-white/10 opacity-50'
                }`}
              >
                <p className="text-3xl mb-2">{badge.unlocked ? '🏆' : '🔒'}</p>
                <p className="font-semibold text-white">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Heatmap */}
        <div className="section-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📅 Activity Heatmap</h2>
          <p className="text-slate-400 mb-6">Your learning consistency over the past 12 weeks</p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 84 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-sm border border-white/10 ${
                  idx % 3 === 0
                    ? 'bg-emerald-500/60'
                    : idx % 3 === 1
                      ? 'bg-emerald-500/30'
                      : 'bg-slate-900/50'
                }`}
                title={`Day ${idx + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">Darker squares = more activity on that day</p>
        </div>

        {/* Call to Action */}
        <Link to="/today" className="glow-button glow-button-blue w-full py-4 text-lg font-bold text-center">
          Continue to Today's Lesson →
        </Link>
      </div>
    </section>
  );
}

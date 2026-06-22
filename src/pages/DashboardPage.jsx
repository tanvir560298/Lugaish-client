import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext, getLessonFromState, getPathFromState } from '../state/AppContext.jsx';

export function DashboardPage() {
  const { state, courseData } = useAppContext();

  if (!state.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  const pathway = getPathFromState(state, courseData);
  const activeLesson = getLessonFromState(state, courseData);
  const enrolledCount = state.enrolledPathways?.length ?? 1;
  const displayName = state.userName || 'Lugaish Learner';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'LL';
  const level = Math.floor(state.xp / 500) + 1;
  const xpInLevel = state.xp % 500;
  const remaining = 500 - xpInLevel;

  const badges = useMemo(
    () => [
      { id: 'visionary-voice', label: 'Visionary Voice', description: 'Gain 500 XP to unlock visionary status.', unlocked: state.badges.includes('visionary-voice') },
      { id: 'streak-warrior', label: 'Streak Warrior', description: 'Maintain a 7-day learning streak.', unlocked: state.streak >= 7 },
      { id: 'rhetorical-elite', label: 'Rhetorical Elite', description: 'Surpass 1,500 total XP points.', unlocked: state.xp >= 1500 },
    ],
    [state.badges, state.streak, state.xp],
  );

  return (
    <section className="space-y-10">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <div className="section-card p-8 text-center">
            <div className="mx-auto mb-6 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-4xl font-black text-white">{initials}</div>
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.24em] text-slate-400">Student Leader</p>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Learning streak</span>
                <span className="font-semibold text-white">{state.streak} days</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Rank title</span>
                <span className="font-semibold text-white">{level >= 4 ? 'Orator Elite' : level >= 3 ? 'Visionary' : level >= 2 ? 'Pathfinder' : 'Initiate'}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Modules completed</span>
                <span className="font-semibold text-white">{state.completedLessons.length}</span>
              </div>
            </div>
          </div>

          <div className="section-card p-8">
            <h3 className="text-lg font-semibold text-white">Level progression</h3>
            <div className="relative mt-8 h-28 w-28 mx-auto">
              <svg viewBox="0 0 130 130" className="h-full w-full rotate-[-90deg]">
                <circle cx="65" cy="65" r="54" className="fill-none stroke-white/10 stroke-[9]" />
                <circle
                  cx="65"
                  cy="65"
                  r="54"
                  className="fill-none stroke-gradient stroke-[9]"
                  style={{
                    strokeDasharray: 339.292,
                    strokeDashoffset: 339.292 - (xpInLevel / 500) * 339.292,
                  }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <p className="text-3xl font-black text-white">{state.xp.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Level {level}</p>
              </div>
            </div>
            <p className="mt-6 text-center text-slate-400">{remaining} XP remaining for Level {level + 1}</p>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="section-card p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current course</p>
                <h2 className="mt-3 text-2xl font-bold text-white">{pathway.title}</h2>
                <p className="mt-3 text-slate-400">{activeLesson?.description ?? 'Pick a pathway to begin your next lesson.'}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-400">{enrolledCount} enrolled course{enrolledCount > 1 ? 's' : ''}</p>
              </div>
              <Link to="/daily-lessons" className="glow-button glow-button-blue">
                Open Today
              </Link>
            </div>
          </div>

          <div className="section-card p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Consistency calendar</h3>
                <p className="mt-2 text-sm text-slate-400">Visualize learner activity from the last 12 weeks.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">Updated daily</div>
            </div>
            <div className="mt-6 grid grid-cols-[repeat(12,minmax(0,1fr))] gap-2 overflow-x-auto py-4">
              {state.activityData.map(item => (
                <div key={item.date} className={`h-12 w-full rounded-xl ${item.intensity === 0 ? 'bg-white/5' : item.intensity === 1 ? 'bg-blue-500/20' : item.intensity === 2 ? 'bg-blue-500/40' : item.intensity === 3 ? 'bg-blue-500/60' : 'bg-blue-500'}`} title={`${new Date(item.date).toLocaleDateString()} — ${item.xp} XP`} />
              ))}
            </div>
          </div>

          <div className="section-card p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white">Achievements</h3>
                <p className="mt-2 text-slate-400">Track earned badges and milestones for progress motivation.</p>
              </div>
              <span className="badge-pill border-green-400/20 bg-green-500/10 text-green-100">{badges.filter(item => item.unlocked).length} unlocked</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {badges.map(badge => (
                <div key={badge.id} className={`rounded-[1.5rem] border p-5 ${badge.unlocked ? 'border-green-400/20 bg-green-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                  <div className="text-2xl">{badge.unlocked ? '🏆' : '🔒'}</div>
                  <h4 className="mt-4 text-lg font-semibold">{badge.label}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

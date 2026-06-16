import { useMemo } from 'react';
import { useAppContext } from '../state/AppContext.jsx';

const communityUsers = [
  { name: 'Aisha Rahman', avatar: 'AR', xp: 1820 },
  { name: 'Omar Khalid', avatar: 'OK', xp: 980 },
  { name: 'Fatima Masoud', avatar: 'FM', xp: 850 },
  { name: 'Yousef Al-Sayed', avatar: 'YS', xp: 720 },
  { name: 'Zainab Mahmoud', avatar: 'ZM', xp: 600 },
];

export function LeaderboardPage() {
  const { state } = useAppContext();

  const sorted = useMemo(() => {
    const list = [...communityUsers, { name: 'Jameel Hassan', avatar: 'JH', xp: state.xp, isYou: true }];
    return list.sort((a, b) => b.xp - a.xp);
  }, [state.xp]);

  return (
    <section className="space-y-10">
      <div className="section-card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Leaderboard</p>
        <h1 className="mt-4 text-4xl font-black text-white">Youth leaders ranked by XP.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">See how close you are to the top of the community and what goals to chase next.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="section-card p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {sorted.slice(0, 3).map((user, index) => (
              <div key={user.name} className={`rounded-[2rem] border p-8 ${index === 0 ? 'border-amber-400/20 bg-amber-500/10' : index === 1 ? 'border-slate-400/20 bg-slate-900/80' : 'border-orange-500/20 bg-orange-500/10'}`}>
                <div className="flex items-center justify-between gap-3 text-sm uppercase tracking-[0.24em] text-slate-400">
                  <span>Rank {index + 1}</span>
                  <span>{user.avatar}</span>
                </div>
                <p className="mt-8 text-3xl font-black text-white">{user.name}</p>
                <p className="mt-4 text-slate-300">{Math.floor(user.xp / 500) + 1} · Level</p>
                <p className="mt-2 text-2xl font-semibold text-white">{user.xp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Global standings</p>
          <div className="mt-6 space-y-3">
            {sorted.map((user, index) => (
              <div key={user.name} className={`flex items-center justify-between gap-4 rounded-[1.5rem] border px-5 py-4 ${user.isYou ? 'border-blue-400/20 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-3xl bg-slate-900 text-sm font-semibold text-white">{user.avatar}</div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">Level {Math.floor(user.xp / 500) + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{user.xp.toLocaleString()} XP</p>
                  <p className="text-xs text-slate-400">Rank {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

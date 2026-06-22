import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpenCheck, FilePenLine, ShieldCheck, UsersRound } from 'lucide-react';
import { api } from '../api/client.js';
import { useAppContext, getLessonFromState, getPathFromState } from '../state/AppContext.jsx';
import { ROLE_LABELS, ROLE_VALUES, ROLES, hasPermission, normalizeRole } from '../utils/roles.js';

function RoleBadge({ role }) {
  const normalized = normalizeRole(role);
  const tone = normalized === ROLES.webDeveloper
    ? 'border-blue-400/30 bg-blue-500/10 text-blue-100'
    : normalized === ROLES.instructor
      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
      : normalized === ROLES.editor
        ? 'border-amber-400/30 bg-amber-500/10 text-amber-100'
        : 'border-white/10 bg-white/5 text-slate-300';

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone}`}>
      {ROLE_LABELS[normalized]}
    </span>
  );
}

function StaffActionCard({ icon, title, description, to, disabled = false }) {
  const content = (
    <div className={`rounded-2xl border p-5 transition ${disabled ? 'border-white/10 bg-white/[0.03] opacity-60' : 'border-white/10 bg-white/5 hover:border-emerald-400/40 hover:bg-white/10'}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
        {icon}
      </div>
      <h4 className="text-base font-black text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );

  if (disabled) return content;
  return <Link to={to}>{content}</Link>;
}

function RoleManagementPanel({ canManageRoles }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!canManageRoles) return;

    let ignore = false;
    setIsLoading(true);
    api.listUsers()
      .then(data => {
        if (!ignore) setUsers(data.users ?? []);
      })
      .catch(error => {
        if (!ignore) setMessage(error.message || 'Could not load users.');
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [canManageRoles]);

  const updateRole = async (userId, role) => {
    setMessage('');
    try {
      const response = await api.updateUserRole(userId, { role });
      setUsers(prev => prev.map(user => (user.id === userId ? response.user : user)));
      setMessage('Role updated.');
    } catch (error) {
      setMessage(error.message || 'Role update failed.');
    }
  };

  if (!canManageRoles) return null;

  return (
    <div className="section-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Web developer control</p>
          <h3 className="mt-2 text-xl font-black text-white">Role management</h3>
          <p className="mt-2 text-sm text-slate-400">Promote instructors, editors, or learners after they sign in once.</p>
        </div>
        <RoleBadge role={ROLES.webDeveloper} />
      </div>

      {message && (
        <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
          {message}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.4fr_1fr_190px] gap-3 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          <span>User</span>
          <span>Current role</span>
          <span>Set role</span>
        </div>

        {isLoading ? (
          <div className="px-4 py-5 text-sm font-semibold text-slate-400">Loading users...</div>
        ) : users.length ? (
          users.map(user => (
            <div key={user.id} className="grid grid-cols-[1.4fr_1fr_190px] items-center gap-3 border-t border-white/10 px-4 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{user.name || 'Unnamed learner'}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <select
                value={normalizeRole(user.role)}
                onChange={event => updateRole(user.id, event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-black uppercase tracking-wider text-white outline-none focus:border-emerald-400"
              >
                {ROLE_VALUES.map(role => (
                  <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                ))}
              </select>
            </div>
          ))
        ) : (
          <div className="px-4 py-5 text-sm font-semibold text-slate-400">No users found yet.</div>
        )}
      </div>
    </div>
  );
}

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
  const role = normalizeRole(state.userRole);
  const isStaff = role !== ROLES.learner;
  const canManageRoles = hasPermission(role, 'manage_roles');
  const canManageLessons = hasPermission(role, 'manage_lessons');
  const canCreatePost = hasPermission(role, 'create_post');
  const canPublish = hasPermission(role, 'publish_post');

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
            <div className="mt-3 flex justify-center">
              <RoleBadge role={role} />
            </div>
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
          {isStaff && (
            <div className="section-card p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Staff workspace</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{ROLE_LABELS[role]} dashboard</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Your dashboard now changes based on account role. Learners see progress, staff see publishing and lesson tools, and the web developer can manage roles.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.permissions.map(permission => (
                    <span key={permission} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-300">
                      {permission.replaceAll('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StaffActionCard
                  icon={<UsersRound size={21} />}
                  title="Users"
                  description={canManageRoles ? 'Review learners and assign instructor or editor access.' : 'Only the web developer can change team roles.'}
                  to="/dashboard"
                  disabled={!canManageRoles}
                />
                <StaffActionCard
                  icon={<BookOpenCheck size={21} />}
                  title="Lessons"
                  description={canManageLessons ? 'Plan daily lessons, tasks, and learner materials.' : 'Lesson tools are for instructors and the web developer.'}
                  to="/daily-lessons"
                  disabled={!canManageLessons}
                />
                <StaffActionCard
                  icon={<FilePenLine size={21} />}
                  title="Posts"
                  description={canCreatePost ? 'Draft course updates, announcements, and learning posts.' : 'Publishing access has not been assigned.'}
                  to="/architects"
                  disabled={!canCreatePost}
                />
                <StaffActionCard
                  icon={<ShieldCheck size={21} />}
                  title="Publishing"
                  description={canPublish ? 'Approve edited content before learners see it.' : 'Editors and the web developer can publish.'}
                  to="/dashboard"
                  disabled={!canPublish}
                />
              </div>
            </div>
          )}

          <RoleManagementPanel canManageRoles={canManageRoles} />

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

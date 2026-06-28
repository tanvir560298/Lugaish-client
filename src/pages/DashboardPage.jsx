import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpenCheck, ChevronDown, ClipboardList, FilePenLine, GraduationCap, RefreshCw, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react';
import { api } from '../api/client.js';
import { useAppContext } from '../state/AppContext.jsx';
import { ROLE_LABELS, ROLE_VALUES, ROLES, hasPermission, normalizeRole } from '../utils/roles.js';

const XP_PER_LEVEL = 500;
const CONSISTENCY_DAY_COUNT = 14;

function getCourseLessons(pathway) {
  return pathway.modules.flatMap(module => module.lessons);
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateFromKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getCourseConsistency({ courseActivity = {}, courseStartedAt, selectedCourse }) {
  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const startDate = getDateFromKey(courseStartedAt?.[selectedCourse] ?? todayKey);
  const activity = courseActivity?.[selectedCourse] ?? {};

  return Array.from({ length: CONSISTENCY_DAY_COUNT }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (CONSISTENCY_DAY_COUNT - 1 - index));
    const dateKey = getLocalDateKey(date);
    const hasCompleted = Boolean(activity[dateKey]);
    const hasStarted = date >= startDate;
    const isToday = dateKey === todayKey;
    const isMissed = hasStarted && !hasCompleted && date < getDateFromKey(todayKey);
    const status = hasCompleted ? 'completed' : isMissed ? 'missed' : isToday && hasStarted ? 'today' : 'neutral';

    return {
      date,
      dateKey,
      status,
      lessonId: activity[dateKey]?.lessonId,
    };
  });
}

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
    <div className={`h-full rounded-2xl border p-5 transition ${disabled ? 'border-white/10 bg-white/[0.03] opacity-60' : 'border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10'}`}>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-950/20">
        {icon}
      </div>
      <h4 className="text-base font-black text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );

  if (disabled) return content;
  return <Link to={to}>{content}</Link>;
}

function getInitials(name = '', email = '') {
  const source = name.trim() || email.split('@')[0] || 'Learner';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'L';
}

function LearnerRoleRow({ user, onRoleChange, canManageRoles }) {
  const role = normalizeRole(user.role);

  return (
    <div className={`grid gap-4 border-t border-white/10 px-4 py-4 transition hover:bg-white/[0.03] ${canManageRoles ? 'lg:grid-cols-[1.35fr_0.75fr_190px]' : 'lg:grid-cols-[1.35fr_0.75fr]' } lg:items-center`}>
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-emerald-500/30 text-sm font-black text-white">
          {getInitials(user.name, user.email)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">{user.name || 'Unnamed learner'}</p>
          <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 lg:justify-start">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 lg:hidden">Current</span>
        <RoleBadge role={role} />
      </div>

      {canManageRoles && (
        <div className="relative flex items-center">
          <select
            value={role}
            onChange={event => onRoleChange(user.id, event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-slate-950 px-3 pr-10 text-xs font-black uppercase tracking-wider text-white outline-none transition focus:border-emerald-400"
          >
            {ROLE_VALUES.map(item => (
              <option key={item} value={item}>{ROLE_LABELS[item]}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-400" />
        </div>
      )}
    </div>
  );
}

function SeatCapacityPanel({ users, seatLimits }) {
  const courses = [
    { key: 'english', label: 'English Pathway' },
    { key: 'arabic', label: 'Arabic Pathway' },
  ];

  const pendingApplications = users.flatMap(user => (
    user.seatApplications ?? []
  ).filter(application => application.status === 'pending').map(application => ({
    ...application,
    userName: user.name,
    userEmail: user.email,
  })));

  return (
    <div className="section-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">Seat capacity</p>
          <h3 className="mt-2 text-xl font-black text-white">Cohort seats and applications</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This shows when each course reaches its student limit and who has requested a priority seat.
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-200">
          <ClipboardList size={22} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {courses.map(course => {
          const seatLimit = seatLimits[course.key] ?? 100;
          const enrolledCount = users.filter(user => user.enrolledPathways?.includes(course.key)).length;
          const remaining = Math.max(seatLimit - enrolledCount, 0);
          const isFull = remaining <= 0;

          return (
            <div key={course.key} className={`rounded-2xl border p-5 ${isFull ? 'border-amber-400/30 bg-amber-500/10' : 'border-emerald-400/20 bg-emerald-500/10'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-white">{course.label}</h4>
                  <p className="mt-2 text-sm text-slate-400">{isFull ? 'Cohort full' : `${remaining} seats available`}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isFull ? 'border-amber-300/30 bg-amber-400/10 text-amber-100' : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'}`}>
                  {isFull ? 'Full' : 'Open'}
                </span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${isFull ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min((enrolledCount / seatLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {enrolledCount}/{seatLimit} enrolled
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/20">
        <div className="bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          Pending seat applications
        </div>
        {pendingApplications.length ? (
          pendingApplications.map((application, index) => (
            <div key={`${application.userEmail}-${application.language}-${application.submittedAt}-${index}`} className="grid gap-3 border-t border-white/10 px-4 py-4 lg:grid-cols-[1fr_0.7fr_0.8fr] lg:items-start">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{application.userName || 'Unnamed learner'}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{application.userEmail}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Course</p>
                <p className="mt-1 text-sm font-semibold capitalize text-slate-200">{application.language}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Message</p>
                <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-300">{application.goal || 'No message added.'}</p>
                {application.contactPreference && (
                  <p className="mt-2 text-xs font-semibold text-emerald-200">Contact: {application.contactPreference}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-5 text-sm font-semibold text-slate-400">No pending applications yet.</div>
        )}
      </div>
    </div>
  );
}

function RoleManagementPanel({ canManageRoles, canViewRoles }) {
  const [users, setUsers] = useState([]);
  const [seatLimits, setSeatLimits] = useState({ english: 110, arabic: 55 });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!canViewRoles) return;

    let ignore = false;
    let retryTimer;
    setIsLoading(true);
    api.listUsers()
      .then(data => {
        if (!ignore) {
          setUsers(data.users ?? []);
          setMessage('');
          setSeatLimits({
            english: data.courseSeatLimits?.english ?? data.courseSeatLimit ?? 110,
            arabic: data.courseSeatLimits?.arabic ?? data.courseSeatLimit ?? 55,
          });
        }
      })
      .catch(error => {
        if (!ignore) {
          setMessage(error.message || 'Could not load users.');
          retryTimer = setTimeout(() => setReloadKey(value => value + 1), 10000);
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
      clearTimeout(retryTimer);
    };
  }, [canViewRoles, reloadKey]);

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

  if (!canViewRoles) return null;

  return (
    <div className="space-y-6">
      {canManageRoles && <SeatCapacityPanel users={users} seatLimits={seatLimits} />}

      <div className="section-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
              {canManageRoles ? 'Web developer control' : 'Team role directory'}
            </p>
            <h3 className="mt-2 text-xl font-black text-white">{canManageRoles ? 'Role management' : 'Role overview'}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {canManageRoles
                ? 'Promote instructors, editors, or learners after they sign in once.'
                : 'View learner and staff roles. Only the web developer can make changes.'}
            </p>
          </div>
          <RoleBadge role={canManageRoles ? ROLES.webDeveloper : ROLES.instructor} />
        </div>

        {message && (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-amber-100">{message} Retrying automatically.</p>
            <button
              type="button"
              onClick={() => setReloadKey(value => value + 1)}
              disabled={isLoading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-300/25 bg-amber-300/10 px-3 text-xs font-black uppercase tracking-widest text-amber-100 transition hover:bg-amber-300/20 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              Retry now
            </button>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/20">
          <div className={`hidden gap-3 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 ${canManageRoles ? 'lg:grid-cols-[1.35fr_0.75fr_190px]' : 'lg:grid-cols-[1.35fr_0.75fr]'} lg:grid`}>
            <span>User</span>
            <span>Current role</span>
            {canManageRoles && <span>Set role</span>}
          </div>

          {isLoading ? (
            <div className="px-4 py-5 text-sm font-semibold text-slate-400">Loading users...</div>
          ) : users.length ? (
            users.map(user => (
              <LearnerRoleRow key={user.id} user={user} onRoleChange={updateRole} canManageRoles={canManageRoles} />
            ))
          ) : (
            <div className="px-4 py-5 text-sm font-semibold text-slate-400">No users found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { state, actions, courseData } = useAppContext();
  const enrolledPathways = state.enrolledPathways?.length ? state.enrolledPathways : [state.activePathway];
  const [selectedCourse, setSelectedCourse] = useState(state.activePathway);

  useEffect(() => {
    if (!enrolledPathways.includes(selectedCourse)) {
      setSelectedCourse(enrolledPathways[0] ?? state.activePathway);
    }
  }, [enrolledPathways, selectedCourse, state.activePathway]);

  const badges = useMemo(
    () => [
      { id: 'visionary-voice', label: 'Visionary Voice', description: 'Gain 500 XP to unlock visionary status.', unlocked: state.badges.includes('visionary-voice') },
      { id: 'streak-warrior', label: 'Streak Warrior', description: 'Maintain a 7-day learning streak.', unlocked: state.streak >= 7 },
      { id: 'rhetorical-elite', label: 'Rhetorical Elite', description: 'Surpass 1,500 total XP points.', unlocked: state.xp >= 1500 },
    ],
    [state.badges, state.streak, state.xp],
  );

  if (!state.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  const pathway = courseData[selectedCourse] ?? courseData.english;
  const courseLessons = getCourseLessons(pathway);
  const completedCourseLessons = courseLessons.filter(lesson => state.completedLessons.includes(lesson.id));
  const nextLesson = courseLessons.find(lesson => !state.completedLessons.includes(lesson.id)) ?? courseLessons[courseLessons.length - 1];
  const courseProgress = courseLessons.length ? Math.round((completedCourseLessons.length / courseLessons.length) * 100) : 0;
  const consistency = getCourseConsistency({
    courseActivity: state.courseActivity,
    courseStartedAt: state.courseStartedAt,
    selectedCourse,
  });
  const completedDays = consistency.filter(item => item.status === 'completed').length;
  const missedDays = consistency.filter(item => item.status === 'missed').length;
  const enrolledCount = enrolledPathways.length;
  const displayName = state.userName || 'Lugaish Learner';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'LL';
  const level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const remaining = XP_PER_LEVEL - xpInLevel;
  const levelProgress = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
  const role = normalizeRole(state.userRole);
  const isStaff = role !== ROLES.learner;
  const canManageRoles = hasPermission(role, 'manage_roles');
  const canViewRoles = isStaff;
  const canManageLessons = hasPermission(role, 'manage_lessons');
  const canCreatePost = hasPermission(role, 'create_post');
  const canPublish = hasPermission(role, 'publish_post');

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
                <span>{pathway.title.replace(' Pathway', '')} completed</span>
                <span className="font-semibold text-white">{completedCourseLessons.length}/{courseLessons.length}</span>
              </div>
            </div>
          </div>

          <div className="section-card p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400">Learning level</p>
                <h3 className="mt-2 text-lg font-black text-white">Level {level}</h3>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-200">
                <GraduationCap size={21} />
              </div>
            </div>
            <div className="relative mx-auto mt-8 h-40 w-40">
              <svg viewBox="0 0 130 130" className="h-full w-full rotate-[-90deg]">
                <circle cx="65" cy="65" r="54" className="fill-none stroke-white/10 stroke-[10]" />
                <circle
                  cx="65"
                  cy="65"
                  r="54"
                  className="fill-none stroke-gradient stroke-[10]"
                  style={{
                    strokeDasharray: 339.292,
                    strokeDashoffset: 339.292 - (xpInLevel / XP_PER_LEVEL) * 339.292,
                  }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-4xl font-black text-white">{levelProgress}%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Complete</p>
                </div>
              </div>
            </div>
            <div className="mt-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                <span>{xpInLevel} XP</span>
                <span>{XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <TrendingUp size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                <p>
                  <span className="font-black text-white">{remaining} XP</span> until Level {level + 1}. Complete lessons and quizzes to move up.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {canManageRoles && (
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

          <RoleManagementPanel canManageRoles={canManageRoles} canViewRoles={canViewRoles} />

          <div className="section-card p-6 sm:p-8">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Course view</p>
                <h2 className="mt-3 text-2xl font-bold text-white">{pathway.title}</h2>
              </div>
              <div className="grid gap-2 sm:flex">
                {enrolledPathways.map(pathwayKey => {
                  const course = courseData[pathwayKey];
                  const isSelected = selectedCourse === pathwayKey;

                  return (
                    <button
                      key={pathwayKey}
                      type="button"
                      onClick={() => setSelectedCourse(pathwayKey)}
                      className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition ${
                        isSelected
                          ? 'border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {course.flag} {course.title.replace(' Pathway', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_220px] lg:items-center">
              <div>
                <p className="text-slate-400">{nextLesson?.description ?? 'Pick a pathway to begin your next lesson.'}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Progress</p>
                    <p className="mt-2 text-2xl font-black text-white">{courseProgress}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Done</p>
                    <p className="mt-2 text-2xl font-black text-emerald-300">{completedCourseLessons.length}/{courseLessons.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Courses</p>
                    <p className="mt-2 text-2xl font-black text-blue-200">{enrolledCount}</p>
                  </div>
                </div>
              </div>

              <Link
                to="/daily-lessons"
                onClick={() => actions.switchPathway(selectedCourse)}
                className="glow-button glow-button-blue justify-center text-center"
              >
                Open Today
              </Link>
            </div>
          </div>

          <div className="section-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{pathway.title.replace(' Pathway', '')} consistency</h3>
                <p className="mt-2 text-sm text-slate-400">Green means class completed that day. Red means that course was missed.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-widest">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-emerald-200">{completedDays} done</span>
                <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-2 text-red-200">{missedDays} missed</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-7 gap-2 sm:grid-cols-[repeat(14,minmax(0,1fr))]">
              {consistency.map(item => (
                <div
                  key={item.dateKey}
                  className={`flex h-16 flex-col items-center justify-center rounded-2xl border text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'completed'
                      ? 'border-emerald-400/30 bg-emerald-500/20 text-emerald-100'
                      : item.status === 'missed'
                        ? 'border-red-400/30 bg-red-500/20 text-red-100'
                        : item.status === 'today'
                          ? 'border-blue-400/30 bg-blue-500/15 text-blue-100'
                          : 'border-white/10 bg-white/5 text-slate-500'
                  }`}
                  title={`${item.date.toLocaleDateString()} - ${item.status}`}
                >
                  <span>{item.date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  <span className="mt-1 text-sm text-white/90">{item.date.getDate()}</span>
                </div>
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

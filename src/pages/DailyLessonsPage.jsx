import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  Film,
  FileText,
  Headphones,
  ListChecks,
  Lock,
  Mic,
  Pause,
  Play,
  Plus,
  Settings2,
  Sparkles,
  TimerReset,
  UsersRound,
  Video,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { isEmailLinkedWithPrivateBatch, useAppContext } from '../state/AppContext.jsx';
import { ROLES, isStudentPreview } from '../utils/roles.js';

const LEARNER_PREVIEW_DAYS = 8;
const WEB_DEVELOPER_PLANNING_DAYS = 90;

function formatScheduledDate(dateKey) {
  if (typeof dateKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return '';
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

const MODULE_PRESENTATION = {
  video: {
    label: 'Video lesson',
    startLabel: 'Start lesson',
    reviewLabel: 'Review lesson',
    Icon: Film,
    accent: 'text-blue-300',
  },
  ai_practice: {
    label: 'AI practice session',
    startLabel: 'Start practice',
    reviewLabel: 'Review practice',
    Icon: Mic,
    accent: 'text-emerald-300',
  },
  interview: {
    label: 'Interview session',
    startLabel: 'Join interview',
    reviewLabel: 'Open interview',
    Icon: UsersRound,
    accent: 'text-violet-300',
  },
};

function getStaticLessons(pathway) {
  let dayNumber = 0;
  return pathway.modules.flatMap(module => module.lessons.map(lesson => {
    dayNumber += 1;
    return {
      ...lesson,
      moduleTitle: module.title,
      dayNumber,
    };
  }));
}

function buildDayCards(staticLessons, remoteModules, minimumDays) {
  const modulesByDay = new Map(remoteModules.map(module => [module.day, module]));
  const highestConfiguredDay = remoteModules.reduce((highestDay, module) => Math.max(highestDay, module.day), 0);
  const dayCount = Math.max(minimumDays, staticLessons.length, highestConfiguredDay);

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    const staticLesson = staticLessons[index];
    const remoteModule = modulesByDay.get(day);

    if (remoteModule) {
      return {
        ...remoteModule,
        day,
        id: staticLesson?.id ?? `configured-${day}`,
        staticLesson,
        configured: true,
      };
    }

    if (staticLesson) {
      return {
        day,
        id: staticLesson.id,
        title: staticLesson.title,
        description: staticLesson.description,
        moduleType: 'video',
        published: true,
        available: false,
        questionCount: 0,
        staticLesson,
        configured: false,
      };
    }

    return {
      day,
      id: `placeholder-${day}`,
      title: 'Coming soon',
      description: 'This day can be configured as a video lesson, AI practice session, or interview.',
      moduleType: null,
      published: false,
      available: false,
      questionCount: 0,
      staticLesson: null,
      configured: false,
    };
  });
}

function ModuleStats({ day, language }) {
  const lesson = day.staticLesson;
  const baseClass = 'rounded-2xl border border-white/10 bg-white/5 p-3';

  if (language === 'paid_batch' || day.staticLesson?.dayType) {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="rounded-xl border border-purple-400/25 bg-purple-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-purple-300">
          {day.staticLesson?.dayType || 'Class Masterclass'}
        </span>
        {day.staticLesson?.weekendMock && (
          <span className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
            Full Mock Included
          </span>
        )}
      </div>
    );
  }

  if (['arabic', 'english'].includes(language)) {
    if (day.day % 2 !== 0) {
      return (
        <div className="mt-6 grid grid-cols-2 gap-2 text-center">
          <div className={baseClass}><FileText size={16} className="mx-auto mb-2 text-emerald-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Study</p></div>
          <div className={baseClass}><BookOpen size={16} className="mx-auto mb-2 text-blue-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reading Task</p></div>
        </div>
      );
    } else {
      return (
        <div className="mt-6 grid grid-cols-2 gap-2 text-center">
          <div className={baseClass}><ListChecks size={16} className="mx-auto mb-2 text-amber-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MCQ Quiz</p></div>
          <div className={baseClass}><Sparkles size={16} className="mx-auto mb-2 text-emerald-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Practice</p></div>
        </div>
      );
    }
  }

  if (day.moduleType === 'ai_practice') {
    return (
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className={baseClass}><Mic size={16} className="mx-auto mb-2 text-emerald-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Voice</p></div>
        <div className={baseClass}><Headphones size={16} className="mx-auto mb-2 text-blue-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{day.questionCount || 0} Questions</p></div>
        <div className={baseClass}><Sparkles size={16} className="mx-auto mb-2 text-amber-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Feedback</p></div>
      </div>
    );
  }

  if (day.moduleType === 'interview') {
    return (
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className={baseClass}><UsersRound size={16} className="mx-auto mb-2 text-violet-300" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live queue</p></div>
        <div className={baseClass}><Video size={16} className="mx-auto mb-2 text-blue-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interview</p></div>
        <div className={baseClass}><Clock3 size={16} className="mx-auto mb-2 text-amber-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly</p></div>
      </div>
    );
  }

  if (!day.moduleType) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Waiting for the course plan
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-3 gap-2 text-center">
      <div className={baseClass}><Film size={16} className="mx-auto mb-2 text-blue-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Video</p></div>
      <div className={baseClass}><BookOpen size={16} className="mx-auto mb-2 text-emerald-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lesson?.cards?.length ?? 0} Cards</p></div>
      <div className={baseClass}><ListChecks size={16} className="mx-auto mb-2 text-amber-400" /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lesson?.quiz?.length ?? 0} Quiz</p></div>
    </div>
  );
}

export function DailyLessonsPage() {
  const { state, actions, courseData } = useAppContext();
  const navigate = useNavigate();
  const [comingSoon, setComingSoon] = useState(null);
  const [dayModuleData, setDayModuleData] = useState({
    modules: [],
    completedDays: [],
    currentDay: 0,
    courseDay: 0,
    courseStarted: false,
    courseStartAt: '',
    courseStartDate: '',
    nextUnlockAt: '',
  });
  const [hasLoadedDayModules, setHasLoadedDayModules] = useState(false);
  const [dayModuleError, setDayModuleError] = useState('');
  const [isDay1AudioPlaying, setIsDay1AudioPlaying] = useState(false);
  const day1AudioRef = useRef(null);

  const toggleDay1Audio = () => {
    if (!day1AudioRef.current) return;
    if (isDay1AudioPlaying) {
      day1AudioRef.current.pause();
      setIsDay1AudioPlaying(false);
    } else {
      if (day1Audio2Ref.current && isDay1Audio2Playing) {
        day1Audio2Ref.current.pause();
        setIsDay1Audio2Playing(false);
      }
      day1AudioRef.current.play().then(() => {
        setIsDay1AudioPlaying(true);
      }).catch(err => {
        console.warn('Audio playback error:', err);
      });
    }
  };

  const [isDay1Audio2Playing, setIsDay1Audio2Playing] = useState(false);
  const day1Audio2Ref = useRef(null);

  const toggleDay1Audio2 = () => {
    if (!day1Audio2Ref.current) return;
    if (isDay1Audio2Playing) {
      day1Audio2Ref.current.pause();
      setIsDay1Audio2Playing(false);
    } else {
      if (day1AudioRef.current && isDay1AudioPlaying) {
        day1AudioRef.current.pause();
        setIsDay1AudioPlaying(false);
      }
      day1Audio2Ref.current.play().then(() => {
        setIsDay1Audio2Playing(true);
      }).catch(err => {
        console.warn('Audio 2 playback error:', err);
      });
    }
  };
  const isWebDeveloper = !isStudentPreview(state) && [ROLES.webDeveloper, ROLES.tester, ROLES.instructor, ROLES.editor, ROLES.intern].includes(state.userRole);
  const canAccessPrivateBatch = isWebDeveloper
    || Boolean(state.privateBatchAccess)
    || state.enrolledPathways?.includes('paid_batch')
    || isEmailLinkedWithPrivateBatch(state.userEmail)
    || (isStudentPreview(state) && Boolean(state.privateBatchAccess || isEmailLinkedWithPrivateBatch(state.userEmail) || state.userEmail === 'tahmadium@gmail.com'));
  const baseEnrolled = [...new Set([
    ...(state.enrolledPathways?.length ? state.enrolledPathways : ['arabic', 'english']),
    ...(canAccessPrivateBatch ? ['paid_batch'] : []),
  ])];
  const enrolledPathways = baseEnrolled.filter(pathwayKey => {
    if (pathwayKey === 'paid_batch') return canAccessPrivateBatch;
    return Boolean(courseData[pathwayKey]);
  });
  const availableToEnroll = Object.keys(courseData).filter(pathway => {
    if (enrolledPathways.includes(pathway)) return false;
    if (courseData[pathway]?.isPrivate) return false;
    return true;
  });
  const pathway = courseData[state.activePathway] ?? courseData.english;
  const staticLessons = useMemo(() => getStaticLessons(pathway), [pathway]);
  const plannedDays = useMemo(
    () => buildDayCards(
      staticLessons,
      dayModuleData.modules ?? [],
      isWebDeveloper ? WEB_DEVELOPER_PLANNING_DAYS : LEARNER_PREVIEW_DAYS,
    ),
    [dayModuleData.modules, isWebDeveloper, staticLessons],
  );
  const hasRemoteDayPlan = hasLoadedDayModules && !dayModuleError;
  const courseStartedForLearner = dayModuleData.courseStarted === true;
  const days = useMemo(() => {
    if (state.activePathway === 'paid_batch') {
      return plannedDays.filter(day => day.day === 1);
    }
    if (isWebDeveloper) return plannedDays;
    if (!hasRemoteDayPlan || !courseStartedForLearner) return [];

    // Learners only see dates that the server has explicitly configured,
    // published, and unlocked. Static courseData must never create a generic
    // practice/video CTA before the real course schedule says it is ready.
    return plannedDays.filter(day => {
      // Learners can review every released PDF/quiz day from Day 1 through
      // today. Future curriculum remains hidden until Bangladesh midnight.
      if (['arabic', 'english'].includes(state.activePathway) && day.day > dayModuleData.courseDay) return false;
      if (day.day > dayModuleData.courseDay) return false;

      // Arabic & English have a bundled PDF/quiz curriculum. Keep the calendar sequence
      // contiguous even if a legacy database row is temporarily missing, so
      // Day 4 cannot disappear while later days remain visible.
      if (['arabic', 'english'].includes(state.activePathway) && day.staticLesson) return true;

      return day.configured && day.published && day.available === true;
    });
  }, [courseStartedForLearner, dayModuleData.courseDay, hasRemoteDayPlan, isWebDeveloper, plannedDays, state.activePathway]);

  useEffect(() => {
    if (!comingSoon) return undefined;

    const timeout = window.setTimeout(() => setComingSoon(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [comingSoon]);

  useEffect(() => {
    let ignore = false;
    setHasLoadedDayModules(false);
    setDayModuleError('');

    if (state.activePathway === 'paid_batch') {
      setDayModuleData({
        modules: [],
        completedDays: [],
        currentDay: 1,
        courseDay: 60,
        courseStarted: true,
        courseStartAt: '',
        courseStartDate: '',
        nextUnlockAt: '',
      });
      setHasLoadedDayModules(true);
      return undefined;
    }

    api.getDayModules(state.activePathway, { learnerPreview: isStudentPreview(state) })
      .then(response => {
        if (ignore) return;
        const courseSchedule = response.courseSchedule ?? response;
        setDayModuleData({
          modules: Array.isArray(response.modules) ? response.modules : [],
          completedDays: Array.isArray(response.completedDays) ? response.completedDays : [],
          currentDay: Math.max(Number(response.currentDay) || 0, 0),
          courseDay: Math.max(Number(response.courseDay ?? courseSchedule.calendarDay) || 0, 0),
          courseStarted: courseSchedule.courseStarted === true,
          courseStartAt: typeof courseSchedule.courseStartAt === 'string' ? courseSchedule.courseStartAt : '',
          courseStartDate: typeof courseSchedule.courseStartDate === 'string' ? courseSchedule.courseStartDate : '',
          nextUnlockAt: typeof response.nextUnlockAt === 'string' ? response.nextUnlockAt : '',
        });
      })
      .catch(error => {
        if (!ignore) setDayModuleError(error.message || 'The latest day plan could not be loaded.');
      })
      .finally(() => {
        if (!ignore) setHasLoadedDayModules(true);
      });

    return () => {
      ignore = true;
    };
  }, [state.activePathway, state.userRole, state.webDeveloperMode]);

  const openDay = day => {
    if (!day.moduleType) {
      if (isWebDeveloper) navigate(`/lesson/${day.day}?configure=1`);
      else setComingSoon(`Day ${day.day}`);
      return;
    }

    if (!['arabic', 'english'].includes(state.activePathway)) {
      if (day.moduleType === 'ai_practice') {
        navigate(`/speaking-practice?language=${state.activePathway}&day=${day.day}`);
        return;
      }

      if (day.moduleType === 'interview') {
        navigate(`/interview?language=${state.activePathway}&day=${day.day}`);
        return;
      }
    }

    if (day.staticLesson?.id) actions.setActiveLesson(day.staticLesson.id, state.activePathway);
    navigate(`/lesson/${day.day}`);
  };

  const enrollCourse = pathwayKey => {
    actions.enrollPathway(pathwayKey);
  };

  return (
    <section className="daily-lessons-page space-y-8 pb-20">
      <div className="section-card overflow-hidden p-0">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent lg:block" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-purple-300">
              {state.activePathway === 'paid_batch' ? '💎 Level 6 Private Batch · Single Focus' : 'Daily lessons'}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {state.activePathway === 'paid_batch' ? 'Day 1: IELTS Listening Masterclass' : 'Pick today\'s learning box.'}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
              {state.activePathway === 'paid_batch'
                ? 'Welcome to your private batch! Today is Day 1 — zero distractions, pure focus on Listening Module Part 1.'
                : 'Each date has one learning format chosen by your course team: a video lesson, AI practice session, or interview.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-2 sm:flex">
          {enrolledPathways.map(pathwayKey => {
            const isActive = state.activePathway === pathwayKey;
            const course = courseData[pathwayKey];
            if (!course) return null;
            const isPaidBatch = pathwayKey === 'paid_batch';

            return (
              <button
                key={pathwayKey}
                type="button"
                onClick={() => actions.switchPathway(pathwayKey)}
                className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black uppercase tracking-widest transition ${
                  isActive
                    ? (isPaidBatch
                        ? 'border-purple-400/40 bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-500/20')
                    : (isPaidBatch
                        ? 'border-purple-400/20 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10')
                }`}
              >
                {isPaidBatch ? (
                  <>
                    <span>💎</span>
                    <span>Paid Batch</span>
                  </>
                ) : (
                  <span>{course.title.replace(' Pathway', '')} Lessons</span>
                )}
              </button>
            );
          })}
        </div>

        {availableToEnroll.length > 0 && (
          <div className="grid gap-2 sm:flex">
            {availableToEnroll.map(pathwayKey => (
              <button
                key={pathwayKey}
                type="button"
                onClick={() => enrollCourse(pathwayKey)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
              >
                <Plus size={16} />
                Add {courseData[pathwayKey]?.title?.replace(' Pathway', '') || pathwayKey}
              </button>
            ))}
          </div>
        )}
      </div>

      {dayModuleError && (
        <p className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {isWebDeveloper
            ? `${dayModuleError} You can retry when the connection is back.`
            : `${dayModuleError} The day plan is read-only until it can be verified, so no lesson can be opened from this screen yet.`}
        </p>
      )}

      {!hasLoadedDayModules && !isWebDeveloper && (
        <p className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          Loading your verified course-day plan…
        </p>
      )}

      {hasRemoteDayPlan && !isWebDeveloper && !courseStartedForLearner && (
        <p className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-4 text-sm leading-6 text-blue-100">
          Your course has not started yet. Daily lessons and speaking tests will appear here only when the server opens the scheduled course date
          {dayModuleData.courseStartDate || dayModuleData.courseStartAt ? ` (${dayModuleData.courseStartDate || dayModuleData.courseStartAt})` : ''}.
        </p>
      )}

      {hasRemoteDayPlan && !isWebDeveloper && courseStartedForLearner && days.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
          No published learning box is scheduled for you right now. Your course team&apos;s next server-configured date will appear here when it opens.
        </p>
      )}

      {hasRemoteDayPlan && !isWebDeveloper && dayModuleData.nextUnlockAt && dayModuleData.completedDays.includes(dayModuleData.currentDay) && (
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-5 py-4 text-sm leading-6 text-cyan-50">
          <strong>Day {dayModuleData.currentDay} complete.</strong> Your next learning day unlocks after 12:00 AM Bangladesh time. Your progress is safely stored in your account.
        </div>
      )}

      <div className={state.activePathway === 'paid_batch' ? 'mx-auto max-w-2xl w-full' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'}>
        {days.map((day, index) => {
          const isPaidBatch = state.activePathway === 'paid_batch';
          let presentation = MODULE_PRESENTATION[day.moduleType] ?? null;
          if (isPaidBatch) {
            presentation = {
              label: day.staticLesson?.dayType || 'Listening Day',
              startLabel: 'Launch Day 1 Masterclass',
              reviewLabel: 'Review Day 1 Masterclass',
              Icon: Headphones,
              accent: 'text-purple-300',
            };
          } else if (['arabic', 'english'].includes(state.activePathway)) {
            if (day.day % 2 !== 0) {
              presentation = {
                label: 'PDF Learning Day',
                startLabel: 'Open PDF',
                reviewLabel: 'Review PDF',
                Icon: BookOpen,
                accent: 'text-emerald-300',
              };
            } else {
              presentation = {
                label: 'Quiz Day',
                startLabel: 'Start Quiz',
                reviewLabel: 'Review Quiz',
                Icon: ListChecks,
                accent: 'text-amber-300',
              };
            }
          }
          const scheduledDate = formatScheduledDate(day.daySchedule?.scheduledFor);
          const isCurrentDay = isPaidBatch ? (day.day === 1) : (!isWebDeveloper && day.day === dayModuleData.courseDay);
          const isPublished = Boolean(day.published);
          const premiumLocked = Boolean(day.premiumLocked);
          const planPendingForLearner = !hasLoadedDayModules && !isWebDeveloper;
          const planUnavailableForLearner = Boolean(dayModuleError) && !isWebDeveloper;
          const planReadOnlyForLearner = planPendingForLearner || planUnavailableForLearner;
          const isNextQuizCompleted = day.day % 2 !== 0 && Boolean(
            (hasRemoteDayPlan && dayModuleData.completedDays?.includes(day.day + 1))
            || (days[index + 1]?.staticLesson && state.completedLessons?.includes(days[index + 1].staticLesson.id))
          );
          const completed = Boolean(
            (hasRemoteDayPlan && dayModuleData.completedDays?.includes(day.day))
            || (day.staticLesson && state.completedLessons?.includes(day.staticLesson.id))
            || isNextQuizCompleted
          );
          const availableFromServer = isPaidBatch || day.available === true || (
            ['arabic', 'english'].includes(state.activePathway)
            && Boolean(day.staticLesson)
            && day.day <= dayModuleData.courseDay
          );
          const fallbackIsNext = index === 0 || Boolean(days[index - 1]?.staticLesson && state.completedLessons.includes(days[index - 1].staticLesson.id));
          const isLocked = planReadOnlyForLearner || (!isWebDeveloper && (
            premiumLocked
            || !isPublished
            || (isPaidBatch ? false : (hasRemoteDayPlan ? !availableFromServer : !fallbackIsNext && !completed))
          ));
          const Icon = presentation?.Icon ?? Clock3;
          const actionLabel = planPendingForLearner
            ? 'Loading plan'
            : planUnavailableForLearner
              ? 'Plan unavailable'
            : !day.moduleType
            ? (isWebDeveloper ? 'Configure day' : 'Coming soon')
            : isLocked
              ? (premiumLocked ? 'Premium required' : !isPublished ? 'Coming soon' : 'Complete previous day')
              : completed
                ? (presentation?.reviewLabel || 'Review Topic')
                : (presentation?.startLabel || 'Open Class Topic');

          if (isPaidBatch && day.day === 1) {
            return (
              <article
                key={day.id}
                className="section-card relative overflow-hidden p-6 sm:p-8 transition border-2 border-purple-400/80 bg-gradient-to-br from-purple-950/80 via-slate-900/95 to-slate-950 shadow-[0_0_50px_rgba(168,85,247,0.35),0_0_90px_rgba(59,130,246,0.2)] animate-day-active-card"
              >
                {/* Live Beam Shimmer Top Border */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-live-shimmer" />

                {/* Ambient Radial Background Pulses */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-cyan-500/15 blur-2xl animate-pulse" style={{ animationDelay: '1.2s' }} />

                {/* Top Active Radar & Equalizer Status Bar */}
                <div className="relative z-10 mb-6 flex items-center justify-between rounded-2xl border border-purple-400/30 bg-purple-950/70 px-4 py-3 shadow-lg shadow-purple-950/50 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80"></span>
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400"></span>
                    </span>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
                        🔥 TODAY WE ARE ON DAY 1
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        IELTS Listening Module · Part 1
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-1.5 h-6 px-2">
                    <span className="inline-block w-1 rounded-full bg-purple-400 animate-[soundwave-bar-1_1s_ease-in-out_infinite]"></span>
                    <span className="inline-block w-1 rounded-full bg-cyan-400 animate-[soundwave-bar-2_0.8s_ease-in-out_infinite]"></span>
                    <span className="inline-block w-1 rounded-full bg-emerald-400 animate-[soundwave-bar-3_1.1s_ease-in-out_infinite]"></span>
                    <span className="inline-block w-1 rounded-full bg-amber-400 animate-[soundwave-bar-4_0.9s_ease-in-out_infinite]"></span>
                  </div>
                </div>

                {/* Card Title & Animated Icon */}
                <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-200">
                        Class 01
                      </span>
                      <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-200">
                        Listening Day
                      </span>
                      <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-200">
                        2 Books Ready
                      </span>
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        Band 6 Target
                      </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                      Topic 1: Listening Module Part 1
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-purple-200">
                      Form & Note Completion Masterclass
                    </p>
                  </div>

                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/40 animate-bounce">
                    <Headphones size={26} />
                  </div>
                </div>

                {/* Core Focus & Key Mechanics */}
                <p className="relative z-10 text-sm leading-6 text-slate-300">
                  {day.staticLesson?.coreStructure || 'IELTS Listening Part 1 — Form & Note Completion Masterclass (Names, Numbers, Postcodes, Dates & Distractor Defense)।'}
                </p>

                {/* Strategy Highlight Badges */}
                <div className="relative z-10 mt-5 grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs text-purple-200">
                    <span className="text-purple-400 font-bold">📑</span>
                    <span>Class 1 Slides & Strategy Guide</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-200">
                    <span className="text-indigo-400 font-bold">📘</span>
                    <span>Official Practice Tests Book Included</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold">🔊</span>
                    <span>A vs E vs I & G vs J Spelling Traps</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-300">
                    <span className="text-amber-400 font-bold">🏆</span>
                    <span>Target: 10/10 Score (+500 XP)</span>
                  </div>
                </div>

                {/* Direct Course PDF & Audio Materials Inside Card */}
                <div className="relative z-10 mt-6 space-y-2.5 rounded-2xl border border-purple-400/30 bg-purple-950/40 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-widest text-purple-300 flex items-center gap-1.5">
                      <span>📚 Course Materials</span>
                      <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">2 Books + 2 Audios + Question Sheet</span>
                    </p>
                    <span className="text-[10px] font-bold text-slate-400">Click to open &amp; play</span>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {/* Tips PDF */}
                    <a
                      href="https://drive.google.com/file/d/1xvDT_G_oAXLwRy4Os1XjkypZvvPjsR_x/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2.5 rounded-xl border border-purple-400/30 bg-purple-900/30 p-3 transition hover:border-purple-400 hover:bg-purple-900/60 hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-105 transition">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>Tips PDF</span>
                            <span className="rounded bg-purple-500/30 px-1 py-0.2 text-[9px] font-bold text-purple-200">Slides</span>
                          </p>
                          <p className="truncate text-[10px] font-medium text-slate-300">
                            Part 1 Guide & Strategies
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="shrink-0 text-slate-400 group-hover:text-purple-300" />
                    </a>

                    {/* Book PDF */}
                    <a
                      href="https://drive.google.com/file/d/10KSNZalZosook_mGGlK82PIBe4maasm2/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2.5 rounded-xl border border-indigo-400/30 bg-indigo-900/30 p-3 transition hover:border-indigo-400 hover:bg-indigo-900/60 hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:scale-105 transition">
                          <BookOpen size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>Book PDF</span>
                            <span className="rounded bg-indigo-500/30 px-1 py-0.2 text-[9px] font-bold text-indigo-200">Full Book</span>
                          </p>
                          <p className="truncate text-[10px] font-medium text-slate-300">
                            @IELTS_Practice_Tests.pdf
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="shrink-0 text-slate-400 group-hover:text-indigo-300" />
                    </a>
                  </div>

                  {/* Audio File Player - Directly Under The Books */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-950/40 p-3 transition hover:border-emerald-400/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                        isDay1AudioPlaying ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        <Headphones size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>Listening Drill Audio</span>
                          <span className="rounded bg-emerald-500/30 px-1 py-0.2 text-[9px] font-bold text-emerald-200">MP3</span>
                        </p>
                        <p className="truncate text-[10px] font-medium text-slate-300">
                          Official Part 1 Form Completion Audio Drill
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDay1Audio();
                        }}
                        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-black transition shadow-md ${
                          isDay1AudioPlaying
                            ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/30'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30'
                        }`}
                      >
                        {isDay1AudioPlaying ? <Pause size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
                        <span>{isDay1AudioPlaying ? 'Pause Audio' : 'Play Audio'}</span>
                      </button>

                      <a
                        href="https://drive.google.com/file/d/1ODDAamucZshhbOanDN_UC36khUdPZcPT/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
                        title="Open in Google Drive"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    {/* Hidden Audio Element for Day 1 */}
                    <audio
                      ref={day1AudioRef}
                      preload="none"
                      onEnded={() => setIsDay1AudioPlaying(false)}
                      onPause={() => setIsDay1AudioPlaying(false)}
                      onPlay={() => setIsDay1AudioPlaying(true)}
                    >
                      <source src="/audio/day1-ielts-listening-audio.mp3" type="audio/mpeg" />
                      <source src="https://drive.usercontent.google.com/download?id=1ODDAamucZshhbOanDN_UC36khUdPZcPT&export=download" type="audio/mpeg" />
                    </audio>
                  </div>

                  {/* Question Picture Row - After Audio File */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-cyan-400/30 bg-cyan-950/40 p-3 transition hover:border-cyan-400/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>Question Picture</span>
                          <span className="rounded bg-cyan-500/30 px-1 py-0.2 text-[9px] font-bold text-cyan-200">Worksheet</span>
                        </p>
                        <p className="truncate text-[10px] font-medium text-slate-300">
                          Part 1 Form Completion Questions 1–10
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <a
                        href="/images/day1-listening-question-sheet.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 rounded-lg bg-cyan-600/30 border border-cyan-400/30 px-3.5 py-2 text-xs font-black text-cyan-200 hover:bg-cyan-600 hover:text-white transition shadow-md"
                      >
                        <Eye size={13} />
                        <span>View Question Picture</span>
                        <ExternalLink size={13} />
                      </a>

                      <a
                        href="https://drive.google.com/file/d/12tb8zkiP2Y7tab9n6NE7KJodfemPJuYY/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
                        title="Open in Google Drive"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Audio Drill 2 Row - After Question Picture */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-teal-400/30 bg-teal-950/40 p-3 transition hover:border-teal-400/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                        isDay1Audio2Playing ? 'bg-teal-400 text-slate-950 animate-pulse' : 'bg-teal-500/20 text-teal-300'
                      }`}>
                        <Headphones size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>Listening Drill Audio 2</span>
                          <span className="rounded bg-teal-500/30 px-1 py-0.2 text-[9px] font-bold text-teal-200">Part 2</span>
                        </p>
                        <p className="truncate text-[10px] font-medium text-slate-300">
                          Follow-up Cambridge Practice Audio Drill
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDay1Audio2();
                        }}
                        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-black transition shadow-md ${
                          isDay1Audio2Playing
                            ? 'bg-teal-400 text-slate-950 shadow-teal-400/30'
                            : 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-600/30'
                        }`}
                      >
                        {isDay1Audio2Playing ? <Pause size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
                        <span>{isDay1Audio2Playing ? 'Pause Audio 2' : 'Play Audio 2'}</span>
                      </button>

                      <a
                        href="https://drive.google.com/file/d/11Q8pZegls5VJjaUu8OiN97Mdf6ldlGUv/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
                        title="Open in Google Drive"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    {/* Hidden Audio 2 Element */}
                    <audio
                      ref={day1Audio2Ref}
                      preload="none"
                      onEnded={() => setIsDay1Audio2Playing(false)}
                      onPause={() => setIsDay1Audio2Playing(false)}
                      onPlay={() => setIsDay1Audio2Playing(true)}
                    >
                      <source src="/audio/day1-ielts-listening-audio-2.mp3" type="audio/mpeg" />
                      <source src="https://drive.usercontent.google.com/download?id=11Q8pZegls5VJjaUu8OiN97Mdf6ldlGUv&export=download" type="audio/mpeg" />
                    </audio>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="relative z-10 mt-7">
                  <button
                    type="button"
                    onClick={() => openDay(day)}
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-purple-600/30 transition hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.99]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full" />
                    <Headphones size={18} className="animate-pulse" />
                    <span>{completed ? 'Review Day 1 Masterclass' : 'Launch Day 1 Listening Masterclass'}</span>
                    <Sparkles size={16} className="text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  </button>
                </div>
              </article>
            );
          }

          return (
            <article
              key={day.id}
              className={`section-card relative overflow-hidden p-5 transition sm:p-6 ${
                !isLocked && !completed && day.moduleType ? 'border-blue-400/30 shadow-[0_24px_70px_rgba(37,99,235,0.16)]' : ''
              } ${isCurrentDay ? 'border-cyan-300/80 ring-2 ring-cyan-300/50 shadow-[0_0_35px_rgba(34,211,238,0.65),0_0_90px_rgba(37,99,235,0.38)]' : ''} ${!day.moduleType && !isWebDeveloper ? 'border-dashed opacity-70' : ''}`}
            >
              {isCurrentDay && (
                <>
                  <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-cyan-300/15 via-blue-500/5 to-transparent" />
                  <div className="absolute right-20 top-5 z-10 rounded-full border border-cyan-200/50 bg-cyan-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_0_24px_rgba(103,232,249,0.9)]">
                    Today
                  </div>
                </>
              )}
              <div className="relative mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${presentation?.accent ?? 'text-slate-500'}`}>Day {day.day}{presentation ? ` · ${presentation.label}` : ''}</p>
                  {scheduledDate && <p className="mt-1 text-xs font-bold text-slate-500">{scheduledDate}</p>}
                  <h2 className="mt-2 text-xl font-black leading-tight text-white">
                    {state.activePathway === 'paid_batch'
                      ? (day.staticLesson?.topicTitle || day.title || `Topic ${day.day}`)
                      : ['arabic', 'english'].includes(state.activePathway)
                        ? (day.day % 2 !== 0 ? `Day ${day.day} PDF` : `Day ${day.day} Quiz`)
                        : day.title}
                  </h2>
                </div>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                  completed ? 'bg-emerald-500/15 text-emerald-400' : isLocked ? 'bg-white/5 text-slate-500' : 'bg-blue-500 text-white'
                }`}>
                  {completed ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : <Icon size={19} />}
                </div>
              </div>

              <p className="min-h-12 text-sm leading-6 text-slate-400">
                {state.activePathway === 'paid_batch'
                  ? (day.staticLesson?.description || `Study session for Topic ${day.day}`)
                  : ['arabic', 'english'].includes(state.activePathway)
                    ? (day.day % 2 !== 0 ? "Read the day's PDF learning resource." : "Complete the day's review quiz.")
                    : day.description}
              </p>
              <ModuleStats day={day} language={state.activePathway} />

              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  disabled={planReadOnlyForLearner || (isLocked && !isWebDeveloper)}
                  onClick={() => {
                    if (planReadOnlyForLearner) return;
                    if (isLocked && !isWebDeveloper) {
                      setComingSoon(premiumLocked ? 'Arabic Premium' : !isPublished ? `Day ${day.day}` : 'Complete the previous day');
                      return;
                    }
                    openDay(day);
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-widest transition disabled:cursor-not-allowed ${
                    isLocked && !isWebDeveloper
                      ? 'bg-white/5 text-slate-500'
                      : completed
                        ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-white'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-emerald-500'
                  }`}
                >
                  {actionLabel}
                  {!isLocked && <Sparkles size={15} />}
                </button>

                {isWebDeveloper && (
                  <button
                    type="button"
                    onClick={() => navigate(`/lesson/${day.day}?configure=1`)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-100"
                  >
                    <Settings2 size={15} /> {day.configured ? 'Configure day' : 'Plan this day'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {comingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] grid place-items-center bg-slate-950/80 p-6 backdrop-blur-xl"
            onClick={() => setComingSoon(null)}
          >
            <motion.div
              initial={{ scale: 0.82, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(16,185,129,0.18)]"
              onClick={event => event.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              >
                <TimerReset size={42} />
              </motion.div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Daily course plan</p>
              <h2 className="mt-3 text-3xl font-black text-white">{comingSoon} is not open yet</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your course team will publish this day when it is ready. Complete the current day to unlock the next scheduled session.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

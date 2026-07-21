import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Film,
  Headphones,
  ListChecks,
  Lock,
  Mic,
  Plus,
  Settings2,
  Sparkles,
  TimerReset,
  UsersRound,
  Video,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAppContext } from '../state/AppContext.jsx';
import { ROLES } from '../utils/roles.js';

const LEARNER_PREVIEW_DAYS = 8;
const WEB_DEVELOPER_PLANNING_DAYS = 30;

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

function ModuleStats({ day }) {
  const lesson = day.staticLesson;
  const baseClass = 'rounded-2xl border border-white/10 bg-white/5 p-3';

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
  });
  const [hasLoadedDayModules, setHasLoadedDayModules] = useState(false);
  const [dayModuleError, setDayModuleError] = useState('');
  const isWebDeveloper = [ROLES.webDeveloper, ROLES.tester].includes(state.userRole);
  const enrolledPathways = state.enrolledPathways?.length ? state.enrolledPathways : [state.activePathway];
  const availableToEnroll = Object.keys(courseData).filter(pathway => !enrolledPathways.includes(pathway));
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
    if (isWebDeveloper) return plannedDays;
    if (!hasRemoteDayPlan || !courseStartedForLearner) return [];

    // Learners only see dates that the server has explicitly configured,
    // published, and unlocked. Static courseData must never create a generic
    // practice/video CTA before the real course schedule says it is ready.
    return plannedDays.filter(day => (
      day.configured
      && day.published
      && day.available === true
      && day.day <= dayModuleData.courseDay
    ));
  }, [courseStartedForLearner, dayModuleData.courseDay, hasRemoteDayPlan, isWebDeveloper, plannedDays]);

  useEffect(() => {
    if (!comingSoon) return undefined;

    const timeout = window.setTimeout(() => setComingSoon(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [comingSoon]);

  useEffect(() => {
    let ignore = false;
    setHasLoadedDayModules(false);
    setDayModuleError('');

    api.getDayModules(state.activePathway)
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
  }, [state.activePathway]);

  const openDay = day => {
    if (!day.moduleType) {
      if (isWebDeveloper) navigate(`/lesson/${day.day}?configure=1`);
      else setComingSoon(`Day ${day.day}`);
      return;
    }

    if (day.moduleType === 'ai_practice') {
      navigate(`/speaking-practice?language=${state.activePathway}&day=${day.day}`);
      return;
    }

    if (day.moduleType === 'interview') {
      navigate(`/interview?language=${state.activePathway}&day=${day.day}`);
      return;
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
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Daily lessons</p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Pick today&apos;s learning box.</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
              Each date has one learning format chosen by your course team: a video lesson, AI practice session, or interview.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-2 sm:flex">
          {enrolledPathways.map(pathwayKey => {
            const isActive = state.activePathway === pathwayKey;
            const course = courseData[pathwayKey];

            return (
              <button
                key={pathwayKey}
                type="button"
                onClick={() => actions.switchPathway(pathwayKey)}
                className={`rounded-2xl border px-5 py-3 text-sm font-black uppercase tracking-widest transition ${
                  isActive
                    ? 'border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {course.title.replace(' Pathway', '')} Lessons
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
                Add {courseData[pathwayKey].title.replace(' Pathway', '')}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {days.map((day, index) => {
          const presentation = MODULE_PRESENTATION[day.moduleType] ?? null;
          const isPublished = Boolean(day.published);
          const planPendingForLearner = !hasLoadedDayModules && !isWebDeveloper;
          const planUnavailableForLearner = Boolean(dayModuleError) && !isWebDeveloper;
          const planReadOnlyForLearner = planPendingForLearner || planUnavailableForLearner;
          const completed = hasRemoteDayPlan
            ? dayModuleData.completedDays.includes(day.day)
            : Boolean(day.staticLesson && state.completedLessons.includes(day.staticLesson.id));
          const availableFromServer = day.available === true;
          const fallbackIsNext = index === 0 || Boolean(days[index - 1]?.staticLesson && state.completedLessons.includes(days[index - 1].staticLesson.id));
          const isLocked = planReadOnlyForLearner || (!isWebDeveloper && (!isPublished || (hasRemoteDayPlan ? !availableFromServer : !fallbackIsNext && !completed)));
          const Icon = presentation?.Icon ?? Clock3;
          const actionLabel = planPendingForLearner
            ? 'Loading plan'
            : planUnavailableForLearner
              ? 'Plan unavailable'
            : !day.moduleType
            ? (isWebDeveloper ? 'Configure day' : 'Coming soon')
            : isLocked
              ? (!isPublished ? 'Coming soon' : 'Complete previous day')
              : completed
                ? presentation.reviewLabel
                : presentation.startLabel;

          return (
            <article
              key={day.id}
              className={`section-card relative overflow-hidden p-5 transition sm:p-6 ${
                !isLocked && !completed && day.moduleType ? 'border-blue-400/30 shadow-[0_24px_70px_rgba(37,99,235,0.16)]' : ''
              } ${!day.moduleType && !isWebDeveloper ? 'border-dashed opacity-70' : ''}`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${presentation?.accent ?? 'text-slate-500'}`}>Day {day.day}{presentation ? ` · ${presentation.label}` : ''}</p>
                  <h2 className="mt-2 text-xl font-black leading-tight text-white">{day.title}</h2>
                </div>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                  completed ? 'bg-emerald-500/15 text-emerald-400' : isLocked ? 'bg-white/5 text-slate-500' : 'bg-blue-500 text-white'
                }`}>
                  {completed ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : <Icon size={19} />}
                </div>
              </div>

              <p className="min-h-12 text-sm leading-6 text-slate-400">{day.description}</p>
              <ModuleStats day={day} />

              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  disabled={planReadOnlyForLearner || (isLocked && !isWebDeveloper)}
                  onClick={() => {
                    if (planReadOnlyForLearner) return;
                    if (isLocked && !isWebDeveloper) {
                      setComingSoon(!isPublished ? `Day ${day.day}` : 'Complete the previous day');
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

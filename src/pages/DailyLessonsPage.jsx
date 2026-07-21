import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock3, Film, ListChecks, Lock, Mic, Play, Plus, Sparkles, TimerReset, Video } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAppContext } from '../state/AppContext.jsx';
import { ROLES } from '../utils/roles.js';

function getLessons(pathway) {
  return pathway.modules.flatMap(module =>
    module.lessons.map((lesson, index) => ({
      ...lesson,
      moduleTitle: module.title,
      dayNumber: index + 1,
    })),
  );
}

export function DailyLessonsPage() {
  const { state, actions, courseData } = useAppContext();
  const navigate = useNavigate();
  const [comingSoon, setComingSoon] = useState(null);
  const [enabledPracticeDays, setEnabledPracticeDays] = useState([]);
  const isWebDeveloper = state.userRole === ROLES.webDeveloper;
  const enrolledPathways = state.enrolledPathways?.length ? state.enrolledPathways : [state.activePathway];
  const availableToEnroll = Object.keys(courseData).filter(pathway => !enrolledPathways.includes(pathway));
  const pathway = courseData[state.activePathway] ?? courseData.english;
  const lessons = useMemo(() => getLessons(pathway), [pathway]);

  useEffect(() => {
    if (!comingSoon) return undefined;

    const timeout = window.setTimeout(() => setComingSoon(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [comingSoon]);

  useEffect(() => {
    let ignore = false;

    api.getSpeakingPracticeAvailability(state.activePathway)
      .then(response => {
        if (!ignore) {
          setEnabledPracticeDays(Array.isArray(response.enabledDays) ? response.enabledDays : []);
        }
      })
      .catch(() => {
        if (!ignore) setEnabledPracticeDays([]);
      });

    return () => {
      ignore = true;
    };
  }, [state.activePathway]);

  const openLesson = (lesson) => {
    actions.setActiveLesson(lesson.id, state.activePathway);
    navigate(`/lesson/${lesson.dayNumber}`);
  };

  const showComingSoon = (title) => {
    setComingSoon(title);
  };

  const enrollCourse = (pathwayKey) => {
    actions.enrollPathway(pathwayKey);
  };

  return (
    <section className="daily-lessons-page space-y-8 pb-20">
      <div className="section-card overflow-hidden p-0">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent lg:block" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Daily lessons</p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Pick today&apos;s small learning box.</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
              You start with one course. Add the second course only when you need it, and both lesson tracks will stay here.
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson, index) => {
          const completed = state.completedLessons.includes(lesson.id);
          const isNext = !completed && (index === 0 || state.completedLessons.includes(lessons[index - 1]?.id));
          const isLocked = !completed && !isNext;
          const hasSpeakingPractice = enabledPracticeDays.includes(lesson.dayNumber);

          return (
            <article
              key={lesson.id}
              className={`section-card relative overflow-hidden p-5 transition sm:p-6 ${
                isNext ? 'border-blue-400/30 shadow-[0_24px_70px_rgba(37,99,235,0.16)]' : ''
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Day {lesson.dayNumber}</p>
                  <h2 className="mt-2 text-xl font-black leading-tight text-white">{lesson.title}</h2>
                </div>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                  completed ? 'bg-emerald-500/15 text-emerald-400' : isLocked ? 'bg-white/5 text-slate-500' : 'bg-blue-500 text-white'
                }`}>
                  {completed ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : <Play size={18} />}
                </div>
              </div>

              <p className="min-h-12 text-sm leading-6 text-slate-400">{lesson.description}</p>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Film size={16} className="mx-auto mb-2 text-blue-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Video</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <BookOpen size={16} className="mx-auto mb-2 text-emerald-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lesson.cards.length} Cards</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <ListChecks size={16} className="mx-auto mb-2 text-amber-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lesson.quiz.length} Quiz</p>
                </div>
              </div>

              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={() => (isLocked ? showComingSoon(`Day ${lesson.dayNumber}`) : openLesson(lesson))}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-widest transition ${
                    isLocked
                      ? 'bg-white/5 text-slate-500 hover:bg-red-500/10 hover:text-red-100'
                      : completed
                        ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-white'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-emerald-500'
                  }`}
                >
                  {isLocked ? 'Complete previous day' : completed ? 'Review Lesson' : 'Start Lesson'}
                  {!isLocked && <Sparkles size={15} />}
                </button>
                {(isWebDeveloper || (!isLocked && hasSpeakingPractice)) && (
                  <button
                    type="button"
                    onClick={() => navigate(`/speaking-practice?language=${state.activePathway}&day=${lesson.dayNumber}${isWebDeveloper ? '&manage=1' : ''}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-blue-200 transition hover:bg-blue-500 hover:text-white"
                  >
                    <Mic size={15} /> {isWebDeveloper ? 'Manage AI practice' : 'Speaking practice'}
                  </button>
                )}
              </div>
            </article>
          );
        })}

        {Array.from({ length: 6 }).map((_, index) => {
          const dayNumber = lessons.length + index + 1;
          const isInterviewDay = dayNumber === 7;

          if (isInterviewDay) {
            return (
              <article key={`placeholder-${index}`} className="section-card border-blue-400/30 p-5 shadow-[0_24px_70px_rgba(37,99,235,0.14)] sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">Day 7</p>
                    <h2 className="mt-2 text-xl font-black leading-tight text-white">Weekly Interview Session</h2>
                  </div>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500 text-white">
                    <Video size={18} />
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  Join your weekly output check, get your room serial, and wait respectfully until your turn.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/interview')}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition hover:bg-emerald-500"
                >
                  Open Interview Queue <Sparkles size={15} />
                </button>
              </article>
            );
          }

          return (
            <article key={`placeholder-${index}`} className="section-card border-dashed p-5 opacity-70 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                    Day {dayNumber}
                  </p>
                  <h2 className="mt-2 text-xl font-black text-white">Coming Soon</h2>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-slate-500">
                  <Clock3 size={18} />
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-400">A new daily box can be added here for video, tasks, and practice.</p>
              <button
                type="button"
                onClick={() => showComingSoon(`Day ${dayNumber}`)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-widest text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-100"
              >
                Preview Waitlist <Sparkles size={15} />
              </button>
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
              <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Level loading</p>
              <h2 className="mt-3 text-3xl font-black text-white">{comingSoon} is coming soon</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                This lesson box is being prepared. Finish the open lesson first and the next level will unlock.
              </p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

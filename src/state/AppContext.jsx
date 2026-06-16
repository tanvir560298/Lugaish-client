import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api/client.js';
import { COURSE_DATA } from '../data/courseData.js';

const LOCAL_STORAGE_KEY = 'lugaish_state_v1';

const defaultState = {
  xp: 1250,
  streak: 12,
  completedLessons: [],
  activePathway: 'english',
  activeLessonId: 'en-les-1',
  badges: ['visionary-voice'],
  activityData: [],
  userName: '',
  userEmail: '',
  learnerProfile: {
    profession: '',
    expectation: '',
    courseDuration: '',
    referralSource: '',
  },
  isLoggedIn: false,
  theme: 'dark',
};

const AppContext = createContext(null);

function generateActivityData() {
  const now = new Date();
  return Array.from({ length: 84 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (83 - index));
    const dayOfWeek = date.getDay();
    let intensity = 0;
    let xp = 0;

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (Math.random() > 0.4) {
        intensity = Math.ceil(Math.random() * 3);
        xp = intensity * 50;
      }
    } else if (Math.random() > 0.8) {
      intensity = 4;
      xp = 200;
    }

    return {
      date: date.toISOString(),
      intensity,
      xp,
    };
  });
}

function loadState() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return { ...defaultState, activityData: generateActivityData() };

  try {
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (error) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return { ...defaultState, activityData: generateActivityData() };
  }
}

function saveState(state) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function computeLevel(xp) {
  return Math.floor(xp / 500) + 1;
}

function getLessonApiPayload(lessonId, pathway) {
  const path = COURSE_DATA[pathway];
  const lessons = path?.modules.flatMap(module => module.lessons) ?? [];
  const day = lessons.findIndex(lesson => lesson.id === lessonId) + 1;

  if (!day) return null;
  return { day, language: pathway };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme ?? 'dark';
  }, [state.theme]);

  const actions = useMemo(() => ({
    switchPathway(pathway) {
      setState(prev => ({ ...prev, activePathway: pathway }));
    },
    setActiveLesson(lessonId, pathway) {
      setState(prev => ({ ...prev, activeLessonId: lessonId, activePathway: pathway }));
    },
    completeLesson(lessonId) {
      setState(prev => {
        const completed = prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId];

        return { ...prev, completedLessons: completed };
      });

      const payload = getLessonApiPayload(lessonId, state.activePathway);
      if (payload) {
        api.completeLesson(payload).catch(() => {});
      }
    },
    submitQuiz(lessonId, responses) {
      const payload = getLessonApiPayload(lessonId, state.activePathway);
      if (!payload) return Promise.resolve();

      return api.submitQuiz({
        ...payload,
        responses: responses.map(selectedAnswer => ({ selectedAnswer })),
      }).catch(() => {});
    },
    login(profile) {
      const nextProfile = typeof profile === 'string'
        ? { userName: profile }
        : profile;

      setState(prev => ({
        ...prev,
        userName: nextProfile.userName ?? prev.userName,
        userEmail: nextProfile.userEmail ?? prev.userEmail,
        learnerProfile: {
          ...prev.learnerProfile,
          ...(nextProfile.learnerProfile ?? {}),
        },
        isLoggedIn: true,
      }));
    },
    async authenticate({ mode, name, email, password, languageSelected, learnerProfile }) {
      const response = mode === 'login'
        ? await api.login({ email, password })
        : await api.signup({ name, email, password, languageSelected });

      setAuthToken(response.token);
      setState(prev => ({
        ...prev,
        userName: response.user?.name ?? name ?? prev.userName,
        userEmail: response.user?.email ?? email ?? prev.userEmail,
        activePathway: response.user?.languageSelected ?? languageSelected ?? prev.activePathway,
        learnerProfile: {
          ...prev.learnerProfile,
          ...(learnerProfile ?? {}),
        },
        isLoggedIn: true,
      }));

      return response;
    },
    logout() {
      setAuthToken(null);
      setState(prev => ({ ...prev, userName: '', userEmail: '', isLoggedIn: false }));
    },
    toggleTheme() {
      setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    },
    addXP(amount) {
      setState(prev => {
        const xp = prev.xp + amount;
        const badges = [...prev.badges];

        if (computeLevel(xp) >= 4 && !badges.includes('rhetorical-elite')) {
          badges.push('rhetorical-elite');
        }

        const activityData = prev.activityData?.length
          ? [...prev.activityData]
          : generateActivityData();
        const today = activityData[activityData.length - 1];
        const updatedToday = {
          ...today,
          xp: today.xp + amount,
          intensity: today.xp + amount > 150 ? 4 : today.xp + amount > 100 ? 3 : today.xp + amount > 50 ? 2 : 1,
        };

        activityData[activityData.length - 1] = updatedToday;

        return { ...prev, xp, badges, activityData };
      });
    },
  }), [state.activePathway]);

  const value = useMemo(() => ({ state, actions, courseData: COURSE_DATA }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

export function getLessonFromState(state, courseData) {
  const path = courseData[state.activePathway];
  if (!path) return null;

  for (const module of path.modules) {
    const lesson = module.lessons.find(item => item.id === state.activeLessonId);
    if (lesson) return lesson;
  }

  return path.modules[0]?.lessons[0] ?? null;
}

export function getPathFromState(state, courseData) {
  return courseData[state.activePathway] ?? courseData.english;
}

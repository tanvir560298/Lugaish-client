import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api/client.js';
import { COURSE_DATA } from '../data/courseData.js';
import { ROLES, getRolePermissions, normalizeRole } from '../utils/roles.js';

const LOCAL_STORAGE_KEY = 'lugaish_state_v1';
const ACTIVITY_DAY_COUNT = 84;

const defaultState = {
  xp: 0,
  streak: 0,
  completedLessons: [],
  enrolledPathways: ['english'],
  activePathway: 'english',
  activeLessonId: 'en-les-1',
  badges: [],
  activityData: [],
  courseActivity: {},
  courseStartedAt: {},
  userName: '',
  userEmail: '',
  userRole: ROLES.learner,
  permissions: [],
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
  return Array.from({ length: ACTIVITY_DAY_COUNT }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (ACTIVITY_DAY_COUNT - 1 - index));
    return {
      date: date.toISOString(),
      intensity: 0,
      xp: 0,
    };
  });
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isDemoProgressState(state) {
  return state.xp === 1250
    && state.streak === 12
    && Array.isArray(state.badges)
    && state.badges.length === 1
    && state.badges[0] === 'visionary-voice'
    && (!Array.isArray(state.completedLessons) || state.completedLessons.length === 0);
}

function normalizeFreshProgress(state) {
  if (!isDemoProgressState(state)) return state;

  return {
    ...state,
    xp: defaultState.xp,
    streak: defaultState.streak,
    badges: defaultState.badges,
    completedLessons: defaultState.completedLessons,
    activityData: generateActivityData(),
  };
}

function loadState() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return { ...defaultState, activityData: generateActivityData() };

  try {
    const parsed = JSON.parse(raw);
    return normalizeFreshProgress({ ...defaultState, ...parsed });
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

function getFirstLessonId(pathway) {
  return COURSE_DATA[pathway]?.modules[0]?.lessons[0]?.id ?? defaultState.activeLessonId;
}

function normalizeState(state) {
  const activePathway = COURSE_DATA[state.activePathway] ? state.activePathway : defaultState.activePathway;
  const enrolledPathways = Array.isArray(state.enrolledPathways) && state.enrolledPathways.length
    ? state.enrolledPathways.filter(pathway => COURSE_DATA[pathway])
    : [activePathway];

  return {
    ...state,
    activePathway,
    enrolledPathways: [...new Set([...(enrolledPathways.length ? enrolledPathways : []), activePathway])],
    courseActivity: state.courseActivity && typeof state.courseActivity === 'object' ? state.courseActivity : {},
    courseStartedAt: [...new Set([...(enrolledPathways.length ? enrolledPathways : []), activePathway])].reduce((acc, pathway) => ({
      ...acc,
      [pathway]: state.courseStartedAt?.[pathway] ?? getDateKey(),
    }), {}),
    userRole: normalizeRole(state.userRole),
    permissions: Array.isArray(state.permissions) && state.permissions.length
      ? state.permissions
      : getRolePermissions(state.userRole),
  };
}

function getLessonApiPayload(lessonId, pathway) {
  const path = COURSE_DATA[pathway];
  const lessons = path?.modules.flatMap(module => module.lessons) ?? [];
  const day = lessons.findIndex(lesson => lesson.id === lessonId) + 1;

  if (!day) return null;
  return { day, language: pathway };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => normalizeState(loadState()));

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme ?? 'dark';
  }, [state.theme]);

  const actions = useMemo(() => ({
    switchPathway(pathway) {
      setState(prev => {
        const currentPath = COURSE_DATA[pathway];
        const activeLessonExists = currentPath?.modules
          .flatMap(module => module.lessons)
          .some(lesson => lesson.id === prev.activeLessonId);

        return {
          ...prev,
          activePathway: pathway,
          activeLessonId: activeLessonExists ? prev.activeLessonId : getFirstLessonId(pathway),
        };
      });
    },
    enrollPathway(pathway) {
      setState(prev => ({
        ...prev,
        activePathway: pathway,
        activeLessonId: getFirstLessonId(pathway),
        enrolledPathways: [...new Set([...(prev.enrolledPathways ?? []), pathway])],
        courseStartedAt: {
          ...(prev.courseStartedAt ?? {}),
          [pathway]: prev.courseStartedAt?.[pathway] ?? getDateKey(),
        },
      }));

      api.enrollPathway({ language: pathway }).catch(() => {});
    },
    setActiveLesson(lessonId, pathway) {
      setState(prev => ({
        ...prev,
        activeLessonId: lessonId,
        activePathway: pathway,
        enrolledPathways: pathway ? [...new Set([...(prev.enrolledPathways ?? []), pathway])] : prev.enrolledPathways,
      }));
    },
    completeLesson(lessonId) {
      setState(prev => {
        const completed = prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId];
        const pathway = prev.activePathway;
        const todayKey = getDateKey();
        const courseActivity = {
          ...(prev.courseActivity ?? {}),
          [pathway]: {
            ...(prev.courseActivity?.[pathway] ?? {}),
            [todayKey]: {
              lessonId,
              completedAt: new Date().toISOString(),
            },
          },
        };

        return { ...prev, completedLessons: completed, courseActivity };
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
        userRole: normalizeRole(nextProfile.userRole ?? prev.userRole),
        permissions: nextProfile.permissions ?? getRolePermissions(nextProfile.userRole ?? prev.userRole),
        learnerProfile: {
          ...prev.learnerProfile,
          ...(nextProfile.learnerProfile ?? {}),
        },
        isLoggedIn: true,
        enrolledPathways: prev.enrolledPathways?.length ? prev.enrolledPathways : [prev.activePathway],
      }));
    },
    async authenticate({ mode, name, email, password, languageSelected, learnerProfile }) {
      let response;

      try {
        response = mode === 'login'
          ? await api.login({ email, password })
          : await api.signup({ name, email, password, languageSelected });
      } catch (error) {
        if (!import.meta.env.DEV) {
          throw error;
        }

        response = {
          token: 'local-dev-session',
          user: {
            name: name || email.split('@')[0],
            email,
            role: ROLES.learner,
            permissions: [],
            languageSelected,
            enrolledPathways: [languageSelected],
          },
        };
      }

      setAuthToken(response.token);
      setState(prev => ({
        ...prev,
        userName: response.user?.name ?? name ?? prev.userName,
        userEmail: response.user?.email ?? email ?? prev.userEmail,
        userRole: normalizeRole(response.user?.role ?? prev.userRole),
        permissions: response.user?.permissions ?? getRolePermissions(response.user?.role ?? prev.userRole),
        activePathway: response.user?.languageSelected ?? languageSelected ?? prev.activePathway,
        activeLessonId: getFirstLessonId(response.user?.languageSelected ?? languageSelected ?? prev.activePathway),
        enrolledPathways: response.user?.enrolledPathways?.length
          ? response.user.enrolledPathways
          : [
              ...new Set([
                ...((mode === 'login' && prev.enrolledPathways?.length) ? prev.enrolledPathways : []),
                response.user?.languageSelected ?? languageSelected ?? prev.activePathway,
              ]),
            ],
        learnerProfile: {
          ...prev.learnerProfile,
          ...(learnerProfile ?? {}),
        },
        isLoggedIn: true,
      }));

      return response;
    },
    async authenticateWithFirebase({ idToken, languageSelected, displayName, firebaseUser, learnerProfile }) {
      let response;
      const localDevUser = {
        token: 'local-dev-firebase-session',
        user: {
          name: displayName || firebaseUser?.name || firebaseUser?.email?.split('@')[0] || 'Learner',
          email: firebaseUser?.email || '',
          avatarUrl: firebaseUser?.avatarUrl,
          role: ROLES.learner,
          permissions: [],
          languageSelected,
          enrolledPathways: [languageSelected],
          learnerProfile,
        },
      };

      try {
        response = import.meta.env.DEV && import.meta.env.VITE_USE_BACKEND_AUTH !== 'true'
          ? localDevUser
          : await api.firebaseLogin({
              idToken,
              languageSelected,
              displayName,
              learnerProfile,
            });
      } catch (error) {
        if (!import.meta.env.DEV && import.meta.env.VITE_REQUIRE_BACKEND_AUTH === 'true') {
          throw error;
        }

        response = localDevUser;
      }

      setAuthToken(response.token);
      setState(prev => ({
        ...prev,
        userName: response.user?.name ?? prev.userName,
        userEmail: response.user?.email ?? prev.userEmail,
        userRole: normalizeRole(response.user?.role ?? prev.userRole),
        permissions: response.user?.permissions ?? getRolePermissions(response.user?.role ?? prev.userRole),
        activePathway: response.user?.languageSelected ?? languageSelected ?? prev.activePathway,
        activeLessonId: getFirstLessonId(response.user?.languageSelected ?? languageSelected ?? prev.activePathway),
        enrolledPathways: response.user?.enrolledPathways?.length
          ? response.user.enrolledPathways
          : [response.user?.languageSelected ?? languageSelected ?? prev.activePathway],
        learnerProfile: {
          ...prev.learnerProfile,
          ...(response.user?.learnerProfile ?? learnerProfile ?? {}),
        },
        isLoggedIn: true,
      }));

      return response;
    },
    logout() {
      setAuthToken(null);
      setState(prev => ({
        ...prev,
        userName: '',
        userEmail: '',
        userRole: ROLES.learner,
        permissions: [],
        isLoggedIn: false,
      }));
    },
    toggleTheme() {
      setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    },
    addXP(amount) {
      setState(prev => {
        const xp = prev.xp + amount;
        const badges = [...prev.badges];

        if (xp >= 500 && !badges.includes('visionary-voice')) {
          badges.push('visionary-voice');
        }

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

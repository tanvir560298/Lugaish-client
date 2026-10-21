import { serverLearningAccess, visibleEnrollments } from "./identityPolicy.js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getAuthToken, setAuthToken } from "../api/client.js";
import { COURSE_DATA } from "../data/courseData.js";
import {
  ROLES,
  getRolePermissions,
  isStudentPreview,
  normalizeRole,
} from "../utils/roles.js";
import {
  COURSE_START_DATE_KEY,
  getEffectiveCourseStartKey,
  hasCourseStarted,
} from "../utils/courseLaunch.js";

const LOCAL_STORAGE_KEY = "lugaish_state_v1";
const LINKED_PRIVATE_BATCH_STORAGE_KEY = "lugaish_linked_private_batch_emails";
const UNLINKED_PRIVATE_BATCH_STORAGE_KEY =
  "lugaish_unlinked_private_batch_emails";
const ACTIVITY_DAY_COUNT = 84;

export const PAID_BATCH_PRECONFIGURED_EMAILS = new Set(); // No student email roster in browser code.

export function getLinkedPrivateBatchEmails() {
  try {
    const raw = localStorage.getItem(LINKED_PRIVATE_BATCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUnlinkedPrivateBatchEmails() {
  try {
    const raw = localStorage.getItem(UNLINKED_PRIVATE_BATCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isEmailLinkedWithPrivateBatch(email) {
  if (!email) return false;
  const lower = String(email).trim().toLowerCase();
  const unlinked = getUnlinkedPrivateBatchEmails().map((e) =>
    String(e).trim().toLowerCase(),
  );
  if (unlinked.includes(lower)) return false;
  if (PAID_BATCH_PRECONFIGURED_EMAILS.has(lower)) return true;
  const list = getLinkedPrivateBatchEmails();
  return list.map((e) => String(e).trim().toLowerCase()).includes(lower);
}

export function saveLinkedPrivateBatchEmail(email, isLinked) {
  if (!email) return;
  const lower = String(email).trim().toLowerCase();
  const linked = getLinkedPrivateBatchEmails().filter(
    (e) => String(e).trim().toLowerCase() !== lower,
  );
  const unlinked = getUnlinkedPrivateBatchEmails().filter(
    (e) => String(e).trim().toLowerCase() !== lower,
  );
  if (isLinked) {
    linked.push(lower);
  } else {
    unlinked.push(lower);
  }
  localStorage.setItem(
    LINKED_PRIVATE_BATCH_STORAGE_KEY,
    JSON.stringify(linked),
  );
  localStorage.setItem(
    UNLINKED_PRIVATE_BATCH_STORAGE_KEY,
    JSON.stringify(unlinked),
  );
}

const defaultState = {
  xp: 0,
  streak: 0,
  completedLessons: [],
  enrolledPathways: ["english"],
  activePathway: "english",
  activeLessonId: "en-les-1",
  badges: [],
  activityData: [],
  courseActivity: {},
  courseStartedAt: {},
  userName: "",
  userEmail: "",
  userRole: ROLES.learner,
  webDeveloperMode: "developer",
  permissions: [],
  isPremium: false,
  privateBatchAccess: false,
  paidBatchMonths: 1,
  referralCode: "",
  learnerProfile: {
    profession: "",
    expectation: "",
    courseDuration: "",
    referralSource: "",
  },
  isLoggedIn: false,
  theme: "dark",
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
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDemoProgressState(state) {
  return (
    state.xp === 1250 &&
    state.streak === 12 &&
    Array.isArray(state.badges) &&
    state.badges.length === 1 &&
    state.badges[0] === "visionary-voice" &&
    (!Array.isArray(state.completedLessons) ||
      state.completedLessons.length === 0)
  );
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
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { ...defaultState, activityData: generateActivityData() };
    const parsed = JSON.parse(raw);
    return normalizeFreshProgress({
      ...defaultState,
      ...parsed,
      learnerProfile: {
        ...defaultState.learnerProfile,
        ...(parsed.learnerProfile ?? {}),
      },
    });
  } catch (error) {
    try { localStorage.removeItem(LOCAL_STORAGE_KEY); } catch { /* Storage may be disabled. */ }
    return { ...defaultState, activityData: generateActivityData() };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota limits in preview
  }
}

function computeLevel(xp) {
  return Math.floor(xp / 500) + 1;
}

export function getFirstLessonId(pathway) {
  const selectedPathway = COURSE_DATA[pathway] ?? COURSE_DATA.english;
  return selectedPathway?.modules?.[0]?.lessons?.[0]?.id ?? "en-les-1";
}

export function expandCompletedLessons(lessonIds) {
  if (!Array.isArray(lessonIds)) return [];
  const set = new Set(lessonIds);
  for (const id of lessonIds) {
    if (typeof id !== "string") continue;
    const match = id.match(/^([a-z]+-les-)(\d+)$/);
    if (match) {
      const prefix = match[1];
      const dayNum = Number.parseInt(match[2], 10);
      if (dayNum > 1 && dayNum % 2 === 0) {
        // Completing an even-day quiz implies the preceding odd-day PDF was completed!
        set.add(`${prefix}${dayNum - 1}`);
      }
    }
  }
  return [...set];
}

function normalizeState(state) {
  const isTesterMode = state.webDeveloperMode === "tester";
  const isStaff = normalizeRole(state.userRole) === ROLES.webDeveloper;
  const isExplicitlyRevoked = state.privateBatchExplicitlyRevoked === true;

  let hasPrivateAccess = false;
  if (isStaff && !isTesterMode) {
    hasPrivateAccess = true;
  } else if (!isExplicitlyRevoked) {
    hasPrivateAccess = Boolean(state.privateBatchAccess === true);
  }

  const activePathway =
    COURSE_DATA[state.activePathway] &&
    (state.activePathway !== "paid_batch" || hasPrivateAccess)
      ? state.activePathway
      : state.activePathway === "paid_batch"
        ? "english"
        : defaultState.activePathway;

  const rawEnrolled = Array.isArray(state.enrolledPathways)
    ? state.enrolledPathways
    : [activePathway];
  const enrolledFiltered = rawEnrolled.filter((pathway) => {
    if (!COURSE_DATA[pathway]) return false;
    if (pathway === "paid_batch") return hasPrivateAccess;
    return true;
  });

  if (hasPrivateAccess && !enrolledFiltered.includes("paid_batch")) {
    enrolledFiltered.push("paid_batch");
  }

  const normalizedEnrolledPathways = visibleEnrollments(
    enrolledFiltered,
    activePathway,
    state.isLoggedIn,
  );
  const completedLessons = expandCompletedLessons(state.completedLessons);
  const paidBatchMonths =
    isStaff && !isTesterMode
      ? 5
      : Math.max(Number(state.paidBatchMonths) || 1, 1);

  return {
    ...state,
    privateBatchAccess: hasPrivateAccess,
    privateBatchExplicitlyRevoked: isExplicitlyRevoked,
    paidBatchMonths,
    completedLessons,
    activePathway,
    enrolledPathways: [...new Set(normalizedEnrolledPathways)],
    courseActivity:
      state.courseActivity && typeof state.courseActivity === "object"
        ? state.courseActivity
        : {},
    courseStartedAt: [...new Set(normalizedEnrolledPathways)].reduce(
      (acc, pathway) => ({
        ...acc,
        [pathway]: getEffectiveCourseStartKey(state.courseStartedAt?.[pathway]),
      }),
      {},
    ),
    userRole: normalizeRole(state.userRole),
    webDeveloperMode:
      state.webDeveloperMode === "tester" ? "tester" : "developer",
    permissions:
      Array.isArray(state.permissions) && state.permissions.length
        ? state.permissions
        : getRolePermissions(state.userRole),
    isLoggedIn: Boolean(
      state.isLoggedIn &&
        getAuthToken() &&
        !getAuthToken().startsWith("local-dev-"),
    ),
  };
}

function getLessonApiPayload(lessonId, pathway) {
  let lang = pathway;
  if (typeof lessonId === "string") {
    if (lessonId.startsWith("ar-")) lang = "arabic";
    else if (lessonId.startsWith("en-")) lang = "english";
    else if (lessonId.startsWith("pb-")) lang = "paid_batch";
  }
  const path = COURSE_DATA[lang];
  const lessons = path?.modules.flatMap((module) => module.lessons) ?? [];
  const day = lessons.findIndex((lesson) => lesson.id === lessonId) + 1;

  if (!day) return null;
  return { day, language: lang };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => normalizeState(loadState()));
  const [publishedCourseData, setPublishedCourseData] = useState({});
  useEffect(() => {
    let active = true;
    setPublishedCourseData({});
    if (!state.isLoggedIn) return;
    api
      .getCourses()
      .then(async (courses) => {
        const entries = await Promise.all(
          courses
            .filter((c) => c.status === "published")
            .map(async (course) => {
              try {
                const data = await api.getCourse(course.language);
                return [
                  course.language,
                  {
                    title: course.title,
                    description: course.description,
                    isPrivate: course.language === "paid_batch",
                    modules: [
                      {
                        id: `${course.language}-published`,
                        title: course.title,
                        lessons: data.lessons.map((l) => ({
                          ...l,
                          id: `${course.generation}:${course.language}-les-${l.day}`,
                          cards: [],
                          quiz: [],
                          speakingTasks: [],
                        })),
                      },
                    ],
                  },
                ];
              } catch {
                return null;
              }
            }),
        );
        if (active)
          setPublishedCourseData(Object.fromEntries(entries.filter(Boolean)));
      })
      .catch(() => {
        if (active) setPublishedCourseData({});
      });
    return () => {
      active = false;
    };
  }, [state.isLoggedIn, state.userEmail]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme ?? "dark";
  }, [state.theme]);

  useEffect(() => {
    if (!state.isLoggedIn) return;

    let ignore = false;

    async function refreshExpiredSession() {
      try {
        const user = await api.currentUser();
        if (!ignore) {
          const access = serverLearningAccess(user),
            isRevoked = access.privateBatchExplicitlyRevoked,
            hasAccess = access.privateBatchAccess,
            baseEnrolled = access.enrolledPathways;

          setState((previous) =>
            normalizeState({
              ...previous,
              userName: user?.name ?? previous.userName,
              userEmail: user?.email ?? previous.userEmail,
              userRole: normalizeRole(user?.role ?? previous.userRole),
              permissions:
                user?.permissions ??
                getRolePermissions(user?.role ?? previous.userRole),
              privateBatchAccess: hasAccess,
              privateBatchExplicitlyRevoked: isRevoked,
              paidBatchMonths: Math.max(Number(user?.paidBatchMonths) || 1, 1),
              enrolledPathways: baseEnrolled,
              isPremium: Boolean(user?.isPremium),
              referralCode: user?.referralCode ?? previous.referralCode,
              learnerProfile: {
                ...previous.learnerProfile,
                ...(user?.learnerProfile ?? {}),
              },
            }),
          );
        }
      } catch (error) {
        if (error.status !== 401) return;

        try {
          const { waitForFirebaseUser } = await import("../lib/firebase.js");
          const firebaseSession = await waitForFirebaseUser();
          if (!firebaseSession?.user) {
            setAuthToken(null);
            if (!ignore)
              setState((previous) => ({ ...previous, isLoggedIn: false }));
            return;
          }

          const response = await api.firebaseLogin({
            idToken: firebaseSession.idToken,
            languageSelected: state.activePathway,
            displayName: firebaseSession.user.displayName || state.userName,
          });

          setAuthToken(response.token);
          if (!ignore) {
            const access = serverLearningAccess(response.user),
              isRevoked = access.privateBatchExplicitlyRevoked,
              hasAccess = access.privateBatchAccess,
              baseEnrolled = access.enrolledPathways;

            setState((previous) =>
              normalizeState({
                ...previous,
                userName: response.user?.name ?? previous.userName,
                userEmail: response.user?.email ?? previous.userEmail,
                userRole: normalizeRole(
                  response.user?.role ?? previous.userRole,
                ),
                permissions:
                  response.user?.permissions ??
                  getRolePermissions(response.user?.role ?? previous.userRole),
                privateBatchAccess: hasAccess,
                privateBatchExplicitlyRevoked: isRevoked,
                paidBatchMonths: Math.max(
                  Number(response.user?.paidBatchMonths) || 1,
                  1,
                ),
                enrolledPathways: baseEnrolled,
                isLoggedIn: true,
              }),
            );
          }
        } catch (refreshError) {
          if (
            !getAuthToken() ||
            refreshError?.status === 400 ||
            refreshError?.status === 401 ||
            refreshError?.status === 403
          ) {
            setAuthToken(null);
            if (!ignore)
              setState((previous) => ({ ...previous, isLoggedIn: false }));
          }
        }
      }
    }

    refreshExpiredSession();

    return () => {
      ignore = true;
    };
  }, []);

  const actions = useMemo(
    () => ({
      switchPathway(pathway) {
        setState((prev) => {
          const currentPath = COURSE_DATA[pathway];
          const activeLessonExists = currentPath?.modules
            .flatMap((module) => module.lessons)
            .some((lesson) => lesson.id === prev.activeLessonId);

          return {
            ...prev,
            activePathway: pathway,
            activeLessonId: activeLessonExists
              ? prev.activeLessonId
              : getFirstLessonId(pathway),
          };
        });
      },
      async enrollPathway(pathway) {
        if (state.isLoggedIn) {
          await api.enrollPathway({ language: pathway });
        }

        setState((prev) => ({
          ...prev,
          activePathway: pathway,
          activeLessonId: getFirstLessonId(pathway),
          enrolledPathways: [
            ...new Set([...(prev.enrolledPathways ?? []), pathway]),
          ],
          courseStartedAt: {
            ...(prev.courseStartedAt ?? {}),
            [pathway]: getEffectiveCourseStartKey(
              prev.courseStartedAt?.[pathway] ?? COURSE_START_DATE_KEY,
            ),
          },
        }));
      },
      setActiveLesson(lessonId, pathway) {
        setState((prev) => ({
          ...prev,
          activeLessonId: lessonId,
          activePathway: pathway,
          enrolledPathways: pathway
            ? [...new Set([...(prev.enrolledPathways ?? []), pathway])]
            : prev.enrolledPathways,
        }));
      },
      completeLesson(lessonId) {
        setState((prev) => {
          const rawCompleted = prev.completedLessons.includes(lessonId)
            ? prev.completedLessons
            : [...prev.completedLessons, lessonId];
          const completed = expandCompletedLessons(rawCompleted);
          const pathway = prev.activePathway;
          const todayKey = getDateKey();
          const courseActivity = hasCourseStarted()
            ? {
                ...(prev.courseActivity ?? {}),
                [pathway]: {
                  ...(prev.courseActivity?.[pathway] ?? {}),
                  [todayKey]: {
                    lessonId,
                    completedAt: new Date().toISOString(),
                  },
                },
              }
            : prev.courseActivity;

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

        return api.submitQuiz(
          {
            ...payload,
            responses: responses.map((selectedAnswer) => ({ selectedAnswer })),
          },
          { learnerPreview: isStudentPreview(state) },
        );
      },
      recordServerQuizCompletion(lessonId, result) {
        setState((prev) => {
          const rawCompleted = prev.completedLessons.includes(lessonId)
            ? prev.completedLessons
            : [...prev.completedLessons, lessonId];
          const completedLessons = expandCompletedLessons(rawCompleted);
          const xp = Number.isFinite(Number(result?.totalXP))
            ? Number(result.totalXP)
            : prev.xp + (Number(result?.xpAwarded) || 0);
          const streak = Number.isFinite(Number(result?.streak))
            ? Number(result.streak)
            : Number(result?.xpAwarded) > 0 && prev.streak === 0
              ? 1
              : prev.streak;
          const badges = [...prev.badges];
          if (xp >= 500 && !badges.includes("visionary-voice"))
            badges.push("visionary-voice");
          if (computeLevel(xp) >= 4 && !badges.includes("rhetorical-elite"))
            badges.push("rhetorical-elite");

          const pathway = prev.activePathway;
          const todayKey = getDateKey();
          const courseActivity =
            hasCourseStarted() && Number(result?.xpAwarded) > 0
              ? {
                  ...(prev.courseActivity ?? {}),
                  [pathway]: {
                    ...(prev.courseActivity?.[pathway] ?? {}),
                    [todayKey]: {
                      lessonId,
                      completedAt: new Date().toISOString(),
                    },
                  },
                }
              : prev.courseActivity;

          return {
            ...prev,
            completedLessons,
            xp,
            streak,
            badges,
            courseActivity,
          };
        });
      },
      async authenticate({
        mode,
        name,
        email,
        password,
        languageSelected,
        learnerProfile,
      }) {
        const response =
          mode === "login"
            ? await api.login({ email, password })
            : await api.signup({ name, email, password, languageSelected });
        if (!response?.token || !response?.user?.email)
          throw new Error(
            "The server did not return an authenticated session.",
          );

        setAuthToken(response.token);
        setState((prev) => ({
          ...prev,
          userName: response.user?.name ?? name ?? prev.userName,
          userEmail: response.user?.email ?? email ?? prev.userEmail,
          userRole: normalizeRole(response.user?.role ?? prev.userRole),
          permissions:
            response.user?.permissions ??
            getRolePermissions(response.user?.role ?? prev.userRole),
          activePathway:
            response.user?.languageSelected ??
            languageSelected ??
            prev.activePathway,
          activeLessonId: getFirstLessonId(
            response.user?.languageSelected ??
              languageSelected ??
              prev.activePathway,
          ),
          enrolledPathways: Array.isArray(response.user?.enrolledPathways)
            ? response.user.enrolledPathways
            : [
                ...new Set([
                  ...(mode === "login" && prev.enrolledPathways?.length
                    ? prev.enrolledPathways
                    : []),
                  response.user?.languageSelected ??
                    languageSelected ??
                    prev.activePathway,
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
      async authenticateWithFirebase({
        idToken,
        languageSelected,
        displayName,
        firebaseUser,
        learnerProfile,
        referralCode,
      }) {
        const firebaseEmail = firebaseUser?.email?.toLowerCase() || "";
        const response = await api.firebaseLogin({
          idToken,
          languageSelected,
          displayName,
          learnerProfile,
          referralCode,
        });
        if (!response?.token || !response?.user?.email)
          throw new Error(
            "The server did not return an authenticated session.",
          );

        setAuthToken(response.token);
        const access = serverLearningAccess(response.user),
          isRevoked = access.privateBatchExplicitlyRevoked,
          hasAccess = access.privateBatchAccess;
        const targetLang =
          response.user?.languageSelected ?? languageSelected ?? "english";
        const initialPathway =
          targetLang === "paid_batch" && !hasAccess ? "english" : targetLang;

        setState((prev) =>
          normalizeState({
            ...prev,
            userName: response.user?.name ?? prev.userName,
            userEmail: response.user?.email ?? prev.userEmail,
            userRole: normalizeRole(response.user?.role ?? prev.userRole),
            permissions:
              response.user?.permissions ??
              getRolePermissions(response.user?.role ?? prev.userRole),
            privateBatchAccess: hasAccess,
            privateBatchExplicitlyRevoked: isRevoked,
            paidBatchMonths: Math.max(
              Number(response.user?.paidBatchMonths) || 1,
              1,
            ),
            activePathway: initialPathway,
            activeLessonId: getFirstLessonId(initialPathway),
            enrolledPathways: access.enrolledPathways,
            isPremium: Boolean(response.user?.isPremium),
            referralCode: response.user?.referralCode ?? prev.referralCode,
            learnerProfile: {
              ...prev.learnerProfile,
              ...(response.user?.learnerProfile ?? learnerProfile ?? {}),
            },
            isLoggedIn: true,
          }),
        );

        return response;
      },
      async logout() {
        setAuthToken(null);
        setState((prev) => ({
          ...prev,
          userName: "",
          userEmail: "",
          userRole: ROLES.learner,
          permissions: [],
          isPremium: false,
          referralCode: "",
          isLoggedIn: false,
        }));

        try {
          const { signOutFirebase } = await import("../lib/firebase.js");
          await signOutFirebase();
        } catch {
          // Local session is already cleared; Firebase cleanup can safely fail offline.
        }
      },
      toggleTheme() {
        setState((prev) => ({
          ...prev,
          theme: prev.theme === "dark" ? "light" : "dark",
        }));
      },
      toggleWebDeveloperMode() {
        setState((prev) => {
          if (normalizeRole(prev.userRole) !== ROLES.webDeveloper) return prev;
          const nextMode =
            prev.webDeveloperMode === "tester" ? "developer" : "tester";
          return normalizeState({
            ...prev,
            webDeveloperMode: nextMode,
          });
        });
      },
      addXP(amount) {
        setState((prev) => {
          const xp = prev.xp + amount;
          const badges = [...prev.badges];

          if (xp >= 500 && !badges.includes("visionary-voice")) {
            badges.push("visionary-voice");
          }

          if (computeLevel(xp) >= 4 && !badges.includes("rhetorical-elite")) {
            badges.push("rhetorical-elite");
          }

          const activityData = prev.activityData?.length
            ? [...prev.activityData]
            : generateActivityData();
          const today = activityData[activityData.length - 1];
          const updatedToday = {
            ...today,
            xp: today.xp + amount,
            intensity:
              today.xp + amount > 150
                ? 4
                : today.xp + amount > 100
                  ? 3
                  : today.xp + amount > 50
                    ? 2
                    : 1,
          };

          activityData[activityData.length - 1] = updatedToday;

          return { ...prev, xp, badges, activityData };
        });
      },
      setPrivateBatchAccess(email, isLinked, months) {
        saveLinkedPrivateBatchEmail(email, isLinked);
        setState((prev) => {
          const isCurrent =
            prev.userEmail?.toLowerCase() === email?.toLowerCase();
          if (!isCurrent) return prev;
          return normalizeState({
            ...prev,
            privateBatchAccess: Boolean(isLinked),
            privateBatchExplicitlyRevoked: !isLinked,
            paidBatchMonths: months
              ? Math.max(Number(months) || 1, 1)
              : prev.paidBatchMonths,
            enrolledPathways: (prev.enrolledPathways || []).filter(
              (p) => p !== "paid_batch" || Boolean(isLinked),
            ),
          });
        });
      },
    }),
    [state.activePathway, state.isLoggedIn],
  );

  const value = useMemo(
    () => ({
      state,
      actions,
      courseData:
        !isStudentPreview(state) &&
        [ROLES.webDeveloper, ROLES.instructor, ROLES.editor].includes(
          state.userRole,
        )
          ? Object.fromEntries(
              Object.entries(COURSE_DATA).map(([key, course]) => [
                key,
                {
                  ...course,
                  title: `Archived editing reference · ${course.title}`,
                },
              ]),
            )
          : publishedCourseData,
    }),
    [state, actions, publishedCourseData],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
}

export function getLessonFromState(state, courseData) {
  const path = courseData[state.activePathway];
  if (!path) return null;

  for (const module of path.modules) {
    const lesson = module.lessons.find(
      (item) => item.id === state.activeLessonId,
    );
    if (lesson) return lesson;
  }

  return path.modules[0]?.lessons[0] ?? null;
}

export function getPathFromState(state, courseData) {
  return (
    courseData[state.activePathway] ??
    courseData.english ?? { title: "Published courses", modules: [] }
  );
}

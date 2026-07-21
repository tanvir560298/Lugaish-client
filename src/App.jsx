import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { api } from './api/client.js';
import { Layout } from './components/Layout.jsx';
import { SEO } from './components/SEO.jsx';
import { AppProvider, useAppContext } from './state/AppContext.jsx';
import { ROLES } from './utils/roles.js';

const HomePage = lazy(() => import('./pages/HomePage.jsx').then(module => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx').then(module => ({ default: module.DashboardPage })));
const PathwaysPage = lazy(() => import('./pages/PathwaysPage.jsx').then(module => ({ default: module.PathwaysPage })));
const LessonPage = lazy(() => import('./pages/LessonPage.jsx').then(module => ({ default: module.LessonPage })));
const QuizPage = lazy(() => import('./pages/QuizPage.jsx').then(module => ({ default: module.QuizPage })));
const DailyLessonsPage = lazy(() => import('./pages/DailyLessonsPage.jsx').then(module => ({ default: module.DailyLessonsPage })));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx').then(module => ({ default: module.LoginPage })));
const CoursePage = lazy(() => import('./pages/CoursePage.jsx').then(module => ({ default: module.CoursePage })));
const TodayPage = lazy(() => import('./pages/TodayPage.jsx').then(module => ({ default: module.TodayPage })));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx').then(module => ({ default: module.PricingPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage.jsx').then(module => ({ default: module.ProgressPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx').then(module => ({ default: module.ProfilePage })));
const ArchitectsPage = lazy(() => import('./pages/ArchitectsPage.jsx').then(module => ({ default: module.ArchitectsPage })));
const InterviewPage = lazy(() => import('./pages/InterviewPage.jsx').then(module => ({ default: module.InterviewPage })));
const SpeakingPracticePage = lazy(() => import('./pages/SpeakingPracticePage.jsx').then(module => ({ default: module.SpeakingPracticePage })));

function PageFallback() {
  return (
    <div className="grid min-h-[60svh] place-items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }) {
  const { state } = useAppContext();
  const location = useLocation();

  if (!state.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function formatLaunchDate(value, dateKey = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (match) {
    const [year, month, day] = match.slice(1).map(Number);
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year, month - 1, day)));
  }
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date);
}

function CourseLaunchGuard({ children }) {
  const { state } = useAppContext();
  const [reloadKey, setReloadKey] = useState(0);
  const [launchState, setLaunchState] = useState({ loading: true, started: false, startAt: '', startDate: '', error: '' });
  const isWebDeveloper = [ROLES.webDeveloper, ROLES.tester].includes(state.userRole);

  useEffect(() => {
    if (isWebDeveloper) {
      setLaunchState({ loading: false, started: true, startAt: '', startDate: '', error: '' });
      return undefined;
    }

    let ignore = false;
    setLaunchState(current => ({ ...current, loading: true, error: '' }));
    api.getDayModules(state.activePathway)
      .then(response => {
        if (ignore) return;
        const courseSchedule = response.courseSchedule ?? response;
        setLaunchState({
          loading: false,
          started: courseSchedule.courseStarted === true,
          startAt: typeof courseSchedule.courseStartAt === 'string' ? courseSchedule.courseStartAt : '',
          startDate: typeof courseSchedule.courseStartDate === 'string' ? courseSchedule.courseStartDate : '',
          error: '',
        });
      })
      .catch(error => {
        if (!ignore) {
          setLaunchState({
            loading: false,
            started: false,
            startAt: '',
            startDate: '',
            error: error.message || 'The course launch status could not be verified.',
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [isWebDeveloper, reloadKey, state.activePathway]);

  if (isWebDeveloper || launchState.started) return children;
  if (launchState.loading) return <PageFallback />;

  return (
    <section className="mx-auto grid min-h-[60svh] max-w-3xl place-items-center py-10">
      <div className="section-card w-full p-8 text-center sm:p-12">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Course schedule</p>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          {launchState.error ? 'Course access is temporarily unavailable' : 'Your course has not started yet'}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
          {launchState.error
            ? `${launchState.error} Learning pages stay locked until the server can verify your course schedule.`
            : `Lessons, speaking practice, interviews, and quizzes will open from the server-scheduled launch${launchState.startAt || launchState.startDate ? ` on ${formatLaunchDate(launchState.startAt, launchState.startDate)}` : ''}.`}
        </p>
        {launchState.error && (
          <button type="button" onClick={() => setReloadKey(value => value + 1)} className="glow-button glow-button-muted mt-7">
            Retry schedule check
          </button>
        )}
      </div>
    </section>
  );
}

function ProtectedCourseRoute({ children }) {
  return <ProtectedRoute><CourseLaunchGuard>{children}</CourseLaunchGuard></ProtectedRoute>;
}

export default function App() {
  return (
    <AppProvider>
      <SEO />
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<Navigate to="/login" replace />} />
            <Route path='/auth' element={<Navigate to="/login" replace />} />
            <Route path='/pricing' element={<PricingPage />} />
            <Route path='/course/:language' element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
            <Route path='/today' element={<ProtectedCourseRoute><TodayPage /></ProtectedCourseRoute>} />
            <Route path='/lesson' element={<ProtectedCourseRoute><LessonPage /></ProtectedCourseRoute>} />
            <Route path='/lesson/:day' element={<ProtectedCourseRoute><LessonPage /></ProtectedCourseRoute>} />
            <Route path='/quiz' element={<ProtectedCourseRoute><QuizPage /></ProtectedCourseRoute>} />
            <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path='/progress' element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path='/pathways' element={<ProtectedRoute><PathwaysPage /></ProtectedRoute>} />
            <Route path='/daily-lessons' element={<ProtectedCourseRoute><DailyLessonsPage /></ProtectedCourseRoute>} />
            <Route path='/interview' element={<ProtectedCourseRoute><InterviewPage /></ProtectedCourseRoute>} />
            <Route path='/speaking-practice' element={<ProtectedCourseRoute><SpeakingPracticePage /></ProtectedCourseRoute>} />
            <Route path='/leaderboard' element={<Navigate to="/daily-lessons" replace />} />
            <Route path="/architects" element={<ArchitectsPage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AppProvider>
  );
}

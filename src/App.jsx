import {InformationPage} from './pages/InformationPage.jsx';

import { CatalogGuard } from './courses/Catalog.jsx';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { api } from './api/client.js';
import { Layout } from './components/Layout.jsx';
import { SEO } from './components/SEO.jsx';
import { AppProvider, useAppContext } from './state/AppContext.jsx';
import { ROLES, isStudentPreview, getViewedRole } from './utils/roles.js';

const IndependentSpeaking = lazy(() => import('./courses/IndependentSpeaking.jsx').then(m => ({default:m.IndependentSpeaking})));
const ManageCourses = lazy(() => import('./courses/ManageCourses.jsx').then(m => ({default:m.ManageCourses})));
const LearningSpacesPage = lazy(() => import('./pages/LearningSpacesPage.jsx').then(module => ({ default: module.LearningSpacesPage })));
const StudyRoomPage = lazy(() => import('./pages/StudyRoomPage.jsx').then(module => ({ default: module.StudyRoomPage })));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage.jsx').then(module => ({ default: module.ClassroomPage })));

const HomePage = lazy(() => import('./pages/HomePage.jsx').then(module => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx').then(module => ({ default: module.DashboardPage })));
const PathwaysPage = lazy(() => import('./pages/PathwaysPage.jsx').then(module => ({ default: module.PathwaysPage })));
const PublishedLesson = lazy(() => import('./courses/PublishedLesson.jsx').then(m => ({default:m.PublishedLesson})));
const LessonPage = lazy(() => import('./pages/LessonPage.jsx').then(module => ({ default: module.LessonPage })));
const SpeakingPreviewPage = lazy(() => import('./pages/SpeakingPreviewPage.jsx').then(module=>({default:module.SpeakingPreviewPage})));
const PracticePreviewPage = lazy(() => import('./pages/PracticePreviewPage.jsx').then(module => ({ default: module.PracticePreviewPage })));
const ReviewPage = lazy(() => import('./learning/review/ReviewPage.jsx').then(m=>({default:m.ReviewPage})));
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
const CertificatePage = lazy(() => import('./pages/CertificatePage.jsx').then(module => ({ default: module.CertificatePage })));
const LearnPage = lazy(() => import('./learn/LearnPages.jsx').then(m => ({default:m.LearnPage})));
const JavaPathPage = lazy(() => import('./learn/LearnPages.jsx').then(m => ({default:m.JavaPathPage})));
const JavaLessonPage = lazy(() => import('./learn/LearnPages.jsx').then(m => ({default:m.JavaLessonPage})));
const NovyraWorkspace = lazy(() => import('./novyra/NovyraWorkspace.jsx').then(module => ({ default: module.NovyraWorkspace })));
import { NovyraProvider } from './novyra/NovyraContext.jsx';
import { NovyraPanel } from './novyra/NovyraPanel.jsx';

function PageFallback() {
  return (
    <div className="grid min-h-[60svh] place-items-center" role="status" aria-label="Loading page">
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
  const isWebDeveloper = !isStudentPreview(state)
    && [ROLES.webDeveloper, ROLES.tester, ROLES.instructor, ROLES.editor, ROLES.intern].includes(state.userRole);

  useEffect(() => {
    if (isWebDeveloper || state.activePathway === 'paid_batch') {
      setLaunchState({ loading: false, started: true, startAt: '', startDate: '', error: '' });
      return undefined;
    }

    let ignore = false;
    setLaunchState(current => ({ ...current, loading: true, error: '' }));
    api.getDayModules(state.activePathway, { learnerPreview: isStudentPreview(state) })
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
  }, [isWebDeveloper, reloadKey, state.activePathway, state.userRole, state.webDeveloperMode]);

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

function StudentLesson() { const {state}=useAppContext(); return !isStudentPreview(state)&&[ROLES.webDeveloper,ROLES.instructor,ROLES.editor,ROLES.tester].includes(state.userRole)?<LessonPage/>:<PublishedLesson/>; }

function DashboardEntry(){const {state}=useAppContext();return getViewedRole(state)===ROLES.learner?<Navigate to='/progress' replace/>:<DashboardPage/>;}

function ProtectedCourseRoute({ children }) {
  return <ProtectedRoute><CatalogGuard staff><CourseLaunchGuard>{children}</CourseLaunchGuard></CatalogGuard></ProtectedRoute>;
}

export default function App() {
  return (
    <AppProvider>
      <NovyraProvider>
        <SEO />
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/privacy' element={<InformationPage kind="privacy"/>}/>
              <Route path='/terms' element={<InformationPage kind="terms"/>}/>
              <Route path='/support' element={<InformationPage kind="support"/>}/>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<Navigate to="/login" replace />} />
              <Route path='/auth' element={<Navigate to="/login" replace />} />
              <Route path='/manage-courses' element={<ProtectedRoute><ManageCourses /></ProtectedRoute>} />
              <Route path='/learn' element={<LearnPage />} />
              <Route path='/learn/java' element={<JavaPathPage />} />
              <Route path='/learn/java/:lessonId' element={<JavaLessonPage />} />
              <Route path='/novyra' element={<ProtectedRoute><NovyraWorkspace /></ProtectedRoute>} />
              <Route path='/pricing' element={<PricingPage />} />
              <Route path='/course/:language' element={<ProtectedRoute><CatalogGuard><CoursePage /></CatalogGuard></ProtectedRoute>} />
              <Route path='/learning-spaces' element={<LearningSpacesPage />} />
              <Route path='/study-room' element={<ProtectedRoute><StudyRoomPage /></ProtectedRoute>} />
              {import.meta.env.DEV && <Route path='/learning-spaces-preview' element={<LearningSpacesPage devPreview />} />}
              {import.meta.env.DEV && <Route path='/study-room-preview' element={<StudyRoomPage devPreview />} />}
              <Route path='/classroom' element={<ProtectedRoute><ClassroomPage /></ProtectedRoute>} />
              {import.meta.env.DEV && <Route path='/speaking-preview' element={<IndependentSpeaking/>} />}
              {import.meta.env.DEV && <Route path='/practice-preview' element={<CatalogGuard><PracticePreviewPage /></CatalogGuard>} />}
              {import.meta.env.DEV && <Route path='/classroom-preview' element={<ClassroomPage devPreview />} />}
              <Route path='/today' element={<ProtectedCourseRoute><StudentLesson /></ProtectedCourseRoute>} />
              <Route path='/lesson' element={<ProtectedCourseRoute><StudentLesson /></ProtectedCourseRoute>} />
              <Route path='/lesson/:day' element={<ProtectedCourseRoute><StudentLesson /></ProtectedCourseRoute>} />
              <Route path='/review-mistakes' element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
              <Route path='/quiz' element={<ProtectedCourseRoute><QuizPage /></ProtectedCourseRoute>} />
              <Route path='/dashboard' element={<ProtectedRoute><DashboardEntry /></ProtectedRoute>} />
              <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path='/certificate/:code' element={<CertificatePage />} />
              <Route path='/progress' element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
              <Route path='/pathways' element={<ProtectedRoute><CatalogGuard><PathwaysPage /></CatalogGuard></ProtectedRoute>} />
              <Route path='/daily-lessons' element={<ProtectedCourseRoute><DailyLessonsPage /></ProtectedCourseRoute>} />
              <Route path='/interview' element={<ProtectedCourseRoute><InterviewPage /></ProtectedCourseRoute>} />
              <Route path='/speaking-practice' element={<ProtectedRoute><CatalogGuard staff fallback={<IndependentSpeaking/>}><CourseLaunchGuard><SpeakingPracticePage /></CourseLaunchGuard></CatalogGuard></ProtectedRoute>} />
              <Route path='/leaderboard' element={<Navigate to="/daily-lessons" replace />} />
              <Route path="/architects" element={<ArchitectsPage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
          <NovyraPanel />
        </Layout>
      </NovyraProvider>
    </AppProvider>
  );
}

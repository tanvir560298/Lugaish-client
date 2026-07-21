import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { SEO } from './components/SEO.jsx';
import { AppProvider, useAppContext } from './state/AppContext.jsx';

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
            <Route path='/today' element={<ProtectedRoute><TodayPage /></ProtectedRoute>} />
            <Route path='/lesson' element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
            <Route path='/lesson/:day' element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
            <Route path='/quiz' element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path='/progress' element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path='/pathways' element={<ProtectedRoute><PathwaysPage /></ProtectedRoute>} />
            <Route path='/daily-lessons' element={<ProtectedRoute><DailyLessonsPage /></ProtectedRoute>} />
            <Route path='/interview' element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
            <Route path='/speaking-practice' element={<ProtectedRoute><SpeakingPracticePage /></ProtectedRoute>} />
            <Route path='/leaderboard' element={<Navigate to="/daily-lessons" replace />} />
            <Route path="/architects" element={<ArchitectsPage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AppProvider>
  );
}

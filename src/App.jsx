import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { PathwaysPage } from './pages/PathwaysPage.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { QuizPage } from './pages/QuizPage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { CoursePage } from './pages/CoursePage.jsx';
import { TodayPage } from './pages/TodayPage.jsx';
import { PricingPage } from './pages/PricingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { ProgressPage } from './pages/ProgressPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AppProvider, useAppContext } from './state/AppContext.jsx';
import { ArchitectsPage } from './pages/ArchitectsPage.jsx';

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
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/auth' element={<Navigate to="/login" replace />} />
          <Route path='/pricing' element={<PricingPage />} />
          <Route path='/course/:language' element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path='/today' element={<ProtectedRoute><TodayPage /></ProtectedRoute>} />
          <Route path='/lesson/:day' element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path='/quiz' element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/progress' element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path='/pathways' element={<ProtectedRoute><PathwaysPage /></ProtectedRoute>} />
          <Route path='/leaderboard' element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/architects" element={<ArchitectsPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

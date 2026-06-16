import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { PathwaysPage } from './pages/PathwaysPage.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { QuizPage } from './pages/QuizPage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { CoursePage } from './pages/CoursePage.jsx';
import { TodayPage } from './pages/TodayPage.jsx';
import { PricingPage } from './pages/PricingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { ProgressPage } from './pages/ProgressPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AppProvider } from './state/AppContext.jsx';
import { ArchitectsPage } from './pages/ArchitectsPage.jsx';

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/pricing' element={<PricingPage />} />
          <Route path='/course/:language' element={<CoursePage />} />
          <Route path='/today' element={<TodayPage />} />
          <Route path='/lesson/:day' element={<LessonPage />} />
          <Route path='/quiz' element={<QuizPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/progress' element={<ProgressPage />} />
          <Route path='/pathways' element={<PathwaysPage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
          <Route path="/architects" element={<ArchitectsPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

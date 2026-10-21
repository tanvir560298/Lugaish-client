import { useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { NewTaskNotification } from './NewTaskNotification.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import { isStudentPreview } from '../utils/roles.js';
const StudyInvitations = lazy(() => import('../study/shared/StudyInvitations.jsx'));
const LearningResourceNotification = lazy(() => import('./LearningResourceNotification.jsx').then(module => ({ default: module.LearningResourceNotification })));

export function Layout({ children }) {
  const { state, actions } = useAppContext();
  const { pathname } = useLocation();
  const isClassroom = /^\/classroom(\/immersive|-preview)$/.test(pathname);
  const isStudyRoom = /^\/study-room(\/library|-preview)$/.test(pathname);
  const isIndependentRoom = ['/study-room', '/classroom'].includes(pathname);
  const previewing = isStudentPreview(state);
  if(isClassroom)return <main id="main-content" tabIndex={-1} className="classroom-route-shell">{children}</main>;
  return (
    <div className={`main-container bg-bg text-slate-100 ${isStudyRoom ? 'has-study-library' : ''}`}>
      <a href="#main-content" className="campus-skip-link">Skip to content</a>
      <Header />
      {state.isLoggedIn && <Suspense fallback={null}><StudyInvitations /></Suspense>}
      {previewing && (
        <div className="border-b border-amber-400/20 bg-amber-500/10 px-4 py-2 text-center text-xs font-bold text-amber-100">
          Tester mode: you are viewing the learner experience. Your Web Developer role is unchanged.
          <button type="button" onClick={actions.toggleWebDeveloperMode} className="ml-2 underline underline-offset-2">Exit preview</button>
        </div>
      )}
      {!isStudyRoom && !isIndependentRoom && <NewTaskNotification />}
      <main id="main-content" tabIndex={-1} className={isStudyRoom?'study-library-route-shell':'app-shell py-4 sm:py-6 lg:py-8'}>{children}</main>
      {!isStudyRoom&&<Footer />}
      {!isStudyRoom && !isIndependentRoom && state.isLoggedIn && <Suspense fallback={null}><LearningResourceNotification /></Suspense>}

    </div>
  );
}

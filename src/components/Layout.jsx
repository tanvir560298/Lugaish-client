import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { LearningResourceNotification } from './LearningResourceNotification.jsx';
import { NewTaskNotification } from './NewTaskNotification.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import { isStudentPreview } from '../utils/roles.js';

export function Layout({ children }) {
  const { state, actions } = useAppContext();
  const previewing = isStudentPreview(state);
  return (
    <div className="main-container bg-bg text-slate-100">
      <Header />
      {previewing && (
        <div className="border-b border-amber-400/20 bg-amber-500/10 px-4 py-2 text-center text-xs font-bold text-amber-100">
          Tester mode: you are viewing the learner experience. Your Web Developer role is unchanged.
          <button type="button" onClick={actions.toggleWebDeveloperMode} className="ml-2 underline underline-offset-2">Exit preview</button>
        </div>
      )}
      <NewTaskNotification />
      <main className="app-shell py-4 sm:py-6 lg:py-8">{children}</main>
      <Footer />
      <LearningResourceNotification />
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ChartNoAxesCombined, User } from 'lucide-react';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { LearningResourceNotification } from './LearningResourceNotification.jsx';
import { NewTaskNotification } from './NewTaskNotification.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import { isStudentPreview, getViewedRole, ROLES } from '../utils/roles.js';

export function Layout({ children }) {
  const { state, actions } = useAppContext();
  const { pathname } = useLocation();
  const mobileLinks = [
    { to: "/daily-lessons", label: "My Classes", icon: BookOpen, active: /^\/(daily-lessons|today|lesson|quiz|speaking-practice|interview|pathways|course)(\/|$)/.test(pathname) },
    { to: "/dashboard", label: getViewedRole(state) === ROLES.learner ? "My Progress" : "Staff Dashboard", icon: ChartNoAxesCombined, active: /^\/(dashboard|progress|certificate)(\/|$)/.test(pathname) },
    { to: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
  ];
  const previewing = isStudentPreview(state);
  return (
    <div className={`main-container bg-bg text-slate-100 ${state.isLoggedIn ? 'has-mobile-navigation' : ''}`}>
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
      {state.isLoggedIn && (
        <nav aria-label="Learning navigation" className="learning-bottom-nav fixed inset-x-0 bottom-0 z-[90] grid grid-cols-3 border-t px-2 pt-2 xl:hidden">
          {mobileLinks.map(({ to, label, icon: Icon, active }) => (
            <Link key={to} to={to} aria-current={active ? 'page' : undefined}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-semibold">
              <Icon size={21} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

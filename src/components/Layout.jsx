import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { LearningResourceNotification } from './LearningResourceNotification.jsx';

export function Layout({ children }) {
  return (
    <div className="main-container bg-bg text-slate-100">
      <Header />
      <main className="app-shell py-4 sm:py-6 lg:py-8">{children}</main>
      <Footer />
      <LearningResourceNotification />
    </div>
  );
}

import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function Layout({ children }) {
  return (
    <div className="main-container bg-bg text-slate-100">
      <Header />
      <main className="app-shell py-8">{children}</main>
      <Footer />
    </div>
  );
}

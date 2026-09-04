import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useAppContext } from '../state/AppContext.jsx';
import { 
  Menu, 
  X, 
  Hammer, 
  LayoutDashboard, 
  Gauge,
  Sparkles,
  CalendarDays,
  CreditCard,
  Sun,
  Moon,
  Activity,
  Code2,
  Eye,
} from 'lucide-react';
import { ROLES } from '../utils/roles.js';
import { getUnviewedCertificateCount } from '../utils/certificateStorage.js';

const navLinks = [
  { href: '/', label: 'Overview', icon: <LayoutDashboard size={16} />, exact: true },
  { href: '/daily-lessons', label: 'Today', icon: <CalendarDays size={16} /> },
  { href: '/pricing', label: 'Plans', icon: <CreditCard size={16} /> },
  { href: '/architects', label: 'Architects', icon: <Hammer size={16} /> },
];

export function Header() {
  const { state, actions } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const level = Math.floor(state.xp / 500) + 1;
  const themeLabel = state.theme === 'dark' ? 'Light mode' : 'Dark mode';
  const dashboardLink = { href: '/dashboard', label: 'Dashboard', icon: <Gauge size={16} /> };
  const visibleNavLinks = state.isLoggedIn ? [...navLinks, dashboardLink] : navLinks;
  const canSwitchMode = state.userRole === ROLES.webDeveloper;
  const isTesterMode = canSwitchMode && state.webDeveloperMode === 'tester';
  const isLinkActive = (link) => (
    link.exact
      ? location.pathname === link.href
      : location.pathname === link.href || location.pathname.startsWith(`${link.href}/`)
  );
  const unviewedCertificateCount = React.useMemo(() => {
    if (!state.isLoggedIn) return 0;
    return getUnviewedCertificateCount(state.completedLessons, state.activePathway);
  }, [state.isLoggedIn, state.completedLessons, state.activePathway, location.pathname]);

  return (
    <header className="site-header sticky top-0 z-[100] border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        
        {/* --- 1. LUGAISH BRAND --- */}
        <Link to="/" className="relative group flex shrink-0 items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20"
          >
            <img src="/favicon.png" alt="Lugaish" className="h-full w-full object-cover" />
          </motion.div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tighter text-white leading-none">LUGAISH</h1>
            <p className="text-[9px] font-bold tracking-[0.3em] text-emerald-400 uppercase mt-1">Founding Phase</p>
          </div>
        </Link>

        {/* --- 2. DESKTOP NAV (Magnetic Style) --- */}
        <nav className="header-nav hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          <LayoutGroup>
            {visibleNavLinks.map((link) => {
              const isActive = isLinkActive(link);

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    nav-link header-nav-link
                    relative flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition-all 2xl:px-4
                    ${isActive ? 'nav-link-active text-white' : 'text-slate-400 hover:text-slate-200'}
                  `}
                >
                  {/* The Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="header-nav-active-pill absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <span className="relative z-10">{link.icon}</span>
                  <span className="relative z-10">{link.label}</span>
                  {link.href === '/dashboard' && unviewedCertificateCount > 0 && (
                    <span className="relative z-10 ml-0.5 flex h-2 w-2" title={`${unviewedCertificateCount} new certificate available`}>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </LayoutGroup>
        </nav>

        {/* --- 3. ACTIONS & USER STATUS --- */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4">
          {canSwitchMode && (
            <button
              type="button"
              onClick={actions.toggleWebDeveloperMode}
              className={`header-control hidden items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition lg:inline-flex ${isTesterMode ? 'border-amber-400/30 bg-amber-500/10 text-amber-200' : 'border-violet-400/30 bg-violet-500/10 text-violet-200'}`}
              aria-pressed={isTesterMode}
              title={isTesterMode ? 'Switch to Web Developer mode' : 'Preview the website as a student'}
            >
              {isTesterMode ? <Eye size={16} /> : <Code2 size={16} />}
              {isTesterMode ? 'Tester mode' : 'Developer mode'}
            </button>
          )}
          
          <button
            type="button"
            onClick={actions.toggleTheme}
            className="header-control header-icon-button hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 sm:inline-flex"
            aria-label={themeLabel}
            title={themeLabel}
          >
            {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Progress Badge */}
          {state.isLoggedIn && (
            <div className="header-control header-progress hidden items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 xl:flex">
              <div className="flex items-center gap-3">
                <Activity size={15} className="text-emerald-400" />
                <div className="leading-none">
                  <span className="block text-[10px] font-black text-white uppercase tracking-wider">{state.userName || 'Learner'}</span>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{state.xp} XP earned</span>
                </div>
              </div>
            </div>
          )}

          {/* Auth Button */}
          {state.isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={actions.logout}
              className="header-signout px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all sm:px-4"
            >
              Sign Out
            </motion.button>
          ) : (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="header-auth px-3 py-2.5 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors sm:px-6"
              >
                Sign In <Sparkles size={12} className="inline ml-1" />
              </motion.button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="header-menu header-icon-button relative xl:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open navigation menu"
          >
            {unviewedCertificateCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500 border-2 border-slate-950"></span>
              </span>
            )}
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- 4. MOBILE MENU (Animated Dropdown) --- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav xl:hidden border-t border-white/5 bg-[#020617] overflow-hidden"
          >
            <div className="p-4 space-y-2 sm:p-6 sm:space-y-4">
              <button
                type="button"
                onClick={actions.toggleTheme}
                className="header-control header-mobile-theme mb-2 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-black uppercase tracking-widest text-white"
              >
                <span>{themeLabel}</span>
                {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {state.isLoggedIn && (
                <div className="header-control rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your progress</p>
                  <p className="mt-1 text-base font-black text-white">{state.userName || 'Learner'} · Level {level} · {state.xp} XP</p>
                </div>
              )}

              {canSwitchMode && (
                <button
                  type="button"
                  onClick={actions.toggleWebDeveloperMode}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-wider ${isTesterMode ? 'border-amber-400/30 bg-amber-500/10 text-amber-100' : 'border-violet-400/30 bg-violet-500/10 text-violet-100'}`}
                >
                  <span>{isTesterMode ? 'Tester mode' : 'Developer mode'}</span>
                  {isTesterMode ? <Eye size={18} /> : <Code2 size={18} />}
                </button>
              )}

              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-3 py-3 text-lg font-black text-white italic sm:text-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-500">{link.icon}</span>
                    {link.label}
                  </div>
                  {link.href === '/dashboard' && unviewedCertificateCount > 0 && (
                    <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-300 not-italic">
                      NEW
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

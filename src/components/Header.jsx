import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useAppContext } from '../state/AppContext.jsx';
import { 
  Menu, 
  X, 
  Flame, 
  User, 
  Hammer, 
  LayoutDashboard, 
  Map, 
  Sparkles,
  Trophy,
  CreditCard
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Overview', icon: <LayoutDashboard size={16} />, exact: true },
  { href: '/pathways', label: 'Odyssey', icon: <Map size={16} /> },
  { href: '/pricing', label: 'Plans', icon: <CreditCard size={16} /> },
  { href: '/architects', label: 'Architects', icon: <Hammer size={16} /> }, // NEW PAGE
  { href: '/leaderboard', label: 'Hall of Fame', icon: <Trophy size={16} /> },
];

export function Header() {
  const { state, actions } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        
        {/* --- 1. THE EVOLVING LOGO --- */}
        <Link to="/" className="relative group flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            className="relative h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-500 shadow-lg shadow-blue-500/20"
          >
            {/* Shimmer Effect */}
            <motion.div 
              animate={{ x: [-40, 80] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-white/20 -skew-x-12 w-4 opacity-50"
            />
            <span className="text-xl font-black text-white italic">L</span>
          </motion.div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tighter text-white leading-none">LUGAISH</h1>
            <p className="text-[9px] font-bold tracking-[0.3em] text-emerald-400 uppercase mt-1">Founding Phase</p>
          </div>
        </Link>

        {/* --- 2. DESKTOP NAV (Magnetic Style) --- */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          <LayoutGroup>
            {navLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.href
                : location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    relative flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest transition-all
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                  `}
                >
                  {/* The Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <span className="relative z-10">{link.icon}</span>
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </LayoutGroup>
        </nav>

        {/* --- 3. ACTIONS & USER STATUS --- */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          
          {/* User Progress Badge */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
            {state.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">{state.userName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-orange-500" />
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-wider">{state.streak}D STREAK</span>
              </div>
            )}
          </div>

          {/* Auth Button */}
          {state.isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={actions.logout}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Sign Out
            </motion.button>
          ) : (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-3 py-2.5 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors sm:px-6"
              >
                Launch <Sparkles size={12} className="inline ml-1" />
              </motion.button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
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
            className="lg:hidden border-t border-white/5 bg-[#020617] overflow-hidden"
          >
            <div className="p-4 space-y-2 sm:p-6 sm:space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3 text-lg font-black text-white italic sm:text-xl"
                >
                  <span className="text-emerald-500">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

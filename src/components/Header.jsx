import { isStudentPreview } from "../utils/roles.js";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut, ArrowUpRight, ArrowRight, Code2 } from "lucide-react";
import { useAppContext } from "../state/AppContext.jsx";
import { ROLES, getViewedRole } from "../utils/roles.js";
import "./header.css";
import { getUnviewedCertificateCount } from "../utils/certificateStorage.js";
const links = [
  ["/", "Home"],
  ["/learn", "Courses"],
  ["/learning-spaces", "Campus"],
  ["/tanu", "Tanu AI"],
  ["/architects", "About"],
];
export function Header() {
  const { state, actions } = useAppContext(),
    { pathname, hash } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false),
    [accountOpen, setAccountOpen] = useState(false);
  const header = useRef(null),
    menu = useRef(null),
    account = useRef(null),
    accountButton = useRef(null);
  const themeLabel = state.theme === "dark" ? "Light mode" : "Dark mode";
  const staff = getViewedRole(state) !== ROLES.learner,
    developer = state.userRole === ROLES.webDeveloper;
  const certificates = state.isLoggedIn
    ? getUnviewedCertificateCount(state.completedLessons, state.activePathway)
    : 0;
  const active = (href) =>
    href === "/"
      ? pathname === "/"
      : href === "/learn"
        ? /^\/(learn|upcoming|course|pricing)(\/|$)/.test(pathname)
      : href === "/tanu"
        ? /^\/(tanu|novyra)(\/|$)/.test(pathname)
        : href === "/learning-spaces"
        ? /^\/(learning-spaces|classroom|study-room)(-preview)?(\/|$)/.test(
            pathname,
          )
        : href === "/daily-lessons"
          ? /^\/(daily-lessons|lesson|quiz|course|pathways)(\/|$)/.test(
              pathname,
            )
          : href === "/speaking-practice"
            ? /^\/(speaking-practice|speaking-preview)(\/|$)/.test(pathname)
            : pathname === href || pathname.startsWith(href + "/");
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname, hash]);
  useEffect(() => {
    if (!mobileOpen && !accountOpen) return;
    const key = (e) => {
      if (e.key === "Escape") {
        if (accountOpen) {
          setAccountOpen(false);
          accountButton.current?.focus();
        } else {
          setMobileOpen(false);
          menu.current?.focus();
        }
      }
    };
    const outside = (e) => {
      if (mobileOpen && !header.current?.contains(e.target)) setMobileOpen(false);
      if (accountOpen && !account.current?.contains(e.target))
        setAccountOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [mobileOpen, accountOpen]);
  const accountLinks = (
    <>
      {!isStudentPreview(state) &&
        [ROLES.webDeveloper, ROLES.instructor, ROLES.editor].includes(
          state.userRole,
        ) && <Link to="/manage-courses">Course publication</Link>}
      <Link to="/profile">My profile</Link>
      <Link to="/daily-lessons">My Classes</Link>
      <Link to="/speaking-practice">Speaking practice</Link>
      <Link to="/tanu">Tanu AI Companion</Link>
      <Link to="/review-mistakes">Review Mistakes</Link>
      <Link to={staff ? "/dashboard" : "/progress"}>
        {staff ? "Staff Dashboard" : "My Learning Progress"}
        {certificates > 0 && (
          <small>
            {certificates} new certificate{certificates === 1 ? "" : "s"}
          </small>
        )}
      </Link>
      {developer && (
        <button onClick={actions.toggleWebDeveloperMode}>
          {state.webDeveloperMode === "tester"
            ? "Switch to developer mode"
            : "Preview as a student"}
        </button>
      )}
      <button
        onClick={() => {
          setAccountOpen(false);
          setMobileOpen(false);
          actions.logout();
        }}
      >
        <LogOut size={16} /> Sign out
      </button>
    </>
  );
  return (
    <header className="site-header academic-header studio-header" ref={header}>
      <div className="academic-header-inner">
        <Link to="/" className="academic-brand" aria-label="Lugaish home">
          <img src="/favicon.png" alt="" />
          <span>
            Lugaish<span className="brand-period">.</span><small>LEARN. BUILD. GROW.</small>
          </span>
        </Link>
        <nav className="header-nav academic-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              className="header-nav-link"
              key={href}
              to={href}
              aria-current={active(href) ? "page" : undefined}
            >
              {label}{href === "/tanu" && <span className="nav-ai-mark" aria-hidden="true">✦</span>}
            </Link>
          ))}
        </nav>
        <div className="academic-header-actions">
          <button
            className="header-control academic-icon"
            onClick={actions.toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {state.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {state.isLoggedIn ? (
            <div className="academic-account" ref={account}>
              <button
                ref={accountButton}
                className="academic-account-trigger"
              aria-label={accountOpen?"Close account menu":"Open account menu"}
                aria-expanded={accountOpen}
                aria-controls="account-navigation"
                onClick={() => {
                  setAccountOpen((v) => !v);
                  setMobileOpen(false);
                }}
              >
                <User size={17} />
                <span>{state.userName || "My account"}</span>
                <ChevronDown size={15} />
              </button>
              {accountOpen && (
                <nav
                  id="account-navigation"
                  className="academic-account-panel"
                  aria-label="Account navigation"
                >
                  {accountLinks}
                </nav>
              )}
            </div>
          ) : (
            <><Link className="header-signin" to="/login">Sign in</Link><Link className="header-auth header-start campus-button" to="/learn/web-development/html">Start learning <ArrowUpRight size={16}/></Link></>
          )}
          <button
            ref={menu}
            className="header-menu academic-icon"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMobileOpen((v) => !v);
              setAccountOpen(false);
            }}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-nav academic-mobile-nav"
          aria-label="Mobile navigation"
        >
          <div className="mobile-nav-caption">EXPLORE LUGAISH</div>
          {links.map(([href, label], index) => (
            <Link key={href} to={href} aria-current={active(href) ? "page" : undefined}>
              <span className="mobile-nav-number">0{index + 1}</span><span>{label}</span><ArrowUpRight size={17}/>
            </Link>
          ))}
          <Link className="mobile-course-highlight" to="/learn/web-development/html"><Code2 size={20}/><span>Web Development<small>Free · 7 Bangla video lessons</small></span><ArrowRight size={17}/></Link>
          {!state.isLoggedIn && <Link className="mobile-signin" to="/login">Already learning? <strong>Sign in <ArrowUpRight size={14}/></strong></Link>}
        </nav>
      )}
    </header>
  );
}

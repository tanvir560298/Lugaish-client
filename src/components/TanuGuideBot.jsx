import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  X,
  ArrowRight,
  BookOpen,
  PenTool,
  Code2,
  Terminal,
  Coffee,
  Building2
} from 'lucide-react';
import './tanu-guide-bot.css';

const ONLINE_COURSES = [
  {
    id: 'ielts-writing',
    path: '/learn/ielts-writing',
    title: 'IELTS Writing Foundation',
    subtitle: '7-Day Writing Lessons + Day 08 Mastery Exam',
    badge: 'Featured · Live',
    badgeColor: '#34d399',
    icon: PenTool,
    iconBg: 'rgba(52, 211, 153, 0.15)',
    iconColor: '#34d399'
  },
  {
    id: 'web-dev',
    path: '/learn/web-development/html',
    title: 'Web Development Course',
    subtitle: 'HTML, CSS & 7 Bangla Video Lessons',
    badge: 'Live · Free',
    badgeColor: '#38bdf8',
    icon: Code2,
    iconBg: 'rgba(56, 189, 248, 0.15)',
    iconColor: '#38bdf8'
  },
  {
    id: 'c-programming',
    path: '/learn/c-programming',
    title: 'C Programming Course',
    subtitle: 'Variables, Loops, Functions & Logic Building',
    badge: 'Live',
    badgeColor: '#60a5fa',
    icon: Terminal,
    iconBg: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#60a5fa'
  },
  {
    id: 'java-programming',
    path: '/learn/java-programming',
    title: 'Java Programming Course',
    subtitle: 'OOP, Classes, Methods & Problem Solving',
    badge: 'Live',
    badgeColor: '#fbbf24',
    icon: Coffee,
    iconBg: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#fbbf24'
  },
  {
    id: 'tanu-ai',
    path: '/tanu',
    title: 'Tanu AI Study Companion',
    subtitle: '24/7 AI Tutor for Questions & Study Routines',
    badge: 'AI Tutor',
    badgeColor: '#c084fc',
    icon: Sparkles,
    iconBg: 'rgba(192, 132, 252, 0.15)',
    iconColor: '#c084fc'
  },
  {
    id: 'learning-spaces',
    path: '/learning-spaces',
    title: 'Virtual Campus & Study Spaces',
    subtitle: '3D Library, quiet study room & peers',
    badge: 'Campus',
    badgeColor: '#a7f3d0',
    icon: Building2,
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#34d399'
  },
  {
    id: 'all-courses',
    path: '/learn',
    title: 'Browse All Courses',
    subtitle: 'Full course catalog & learning pathways',
    badge: 'Catalog',
    badgeColor: '#94a3b8',
    icon: BookOpen,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#ffffff'
  }
];

export function TanuGuideBot() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showPeek, setShowPeek] = useState(() => {
    try {
      return !sessionStorage.getItem('lugaish_tanu_peek_dismissed');
    } catch {
      return true;
    }
  });

  const cardRef = useRef(null);

  const dismissPeek = useCallback(() => {
    setShowPeek(false);
    try {
      sessionStorage.setItem('lugaish_tanu_peek_dismissed', 'true');
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  // Auto-dismiss peek speech bubble after 7 seconds so it does not obstruct
  useEffect(() => {
    if (showPeek) {
      const timer = setTimeout(() => {
        dismissPeek();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showPeek, dismissPeek]);

  // Close when tapping outside the guide card
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isOpen]);

  const handleSelectCourse = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="tanu-guide-container">
      {/* Peek Speech Bubble */}
      {showPeek && !isOpen && (
        <div className="tanu-peek-bubble" onClick={() => { setIsOpen(true); dismissPeek(); }}>
          <span>Tanu:</span> Want me to guide you to a course? 🚀
          <button
            className="tanu-peek-close"
            aria-label="Dismiss message"
            onClick={(e) => {
              e.stopPropagation();
              dismissPeek();
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* The Open Course Navigator Card */}
      {isOpen && (
        <div className="tanu-guide-card" ref={cardRef} role="dialog" aria-label="Tanu Course Guide">
          {/* Header */}
          <div className="tanu-guide-header">
            <div className="tanu-guide-header-title">
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #34d399 0%, #38bdf8 100%)',
                display: 'grid',
                placeItems: 'center',
                color: '#0f172a'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h4>Tanu Course Guide</h4>
                <span>Your Friendly Learning Guide</span>
              </div>
            </div>
            <button
              className="tanu-guide-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close guide"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="tanu-guide-body">
            <div className="tanu-dialogue-box">
              <div className="tanu-dialogue-kicker">
                <Sparkles size={12} />
                ONLINE COURSES
              </div>
              <strong style={{ display: 'block', color: '#ffffff', marginBottom: '3px' }}>
                Want me to take you to a course? (কোন কোর্সে যাবেন?)
              </strong>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                নিচের যেকোনো লাইভ কোর্সে ক্লিক করে সরাসরি পড়াশোনা শুরু করুন:
              </span>
            </div>

            {/* Direct Jump Buttons to All Online Courses */}
            <div className="tanu-action-list">
              {ONLINE_COURSES.map((c) => {
                const Icon = c.icon;
                const isCurrent = location.pathname.startsWith(c.path);
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`tanu-action-btn ${isCurrent ? 'is-highlight' : ''}`}
                    onClick={() => handleSelectCourse(c.path)}
                  >
                    <div className="tanu-action-btn-icon" style={{ background: c.iconBg, color: c.iconColor }}>
                      <Icon size={17} />
                    </div>
                    <div className="tanu-action-btn-text">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>{c.title}</strong>
                        {c.badge && (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: c.badgeColor,
                            border: `1px solid ${c.badgeColor}40`
                          }}>
                            {c.badge}
                          </span>
                        )}
                      </div>
                      <small>{c.subtitle}</small>
                    </div>
                    <ArrowRight size={14} color="#94a3b8" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cute Floating Robot Mascot Button */}
      <button
        className="tanu-bot-avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Tanu Course Guide" : "Open Tanu Course Guide"}
        title="Tanu Course Guide — Click me to view all online courses!"
      >
        {/* Glowing Beacon on Antenna */}
        <span className="tanu-antenna-beacon" />

        {/* Animated Cute SVG Robot */}
        <svg className="tanu-bot-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Robot Head Body */}
          <rect x="18" y="24" width="64" height="52" rx="18" fill="url(#botGradient)" stroke="#38bdf8" strokeWidth="2.5" />
          
          {/* Antenna Pole */}
          <line x1="50" y1="24" x2="50" y2="12" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="11" r="5" fill="#34d399" />

          {/* Ear Pieces */}
          <rect x="11" y="42" width="7" height="16" rx="3.5" fill="#38bdf8" />
          <rect x="82" y="42" width="7" height="16" rx="3.5" fill="#38bdf8" />

          {/* Digital Screen Face */}
          <rect x="25" y="32" width="50" height="36" rx="10" fill="#091326" />

          {/* Cute Blinking Eyes */}
          <g className="tanu-bot-eye">
            <circle cx="39" cy="48" r="6" fill="#38bdf8" />
            <circle cx="41" cy="46" r="2.2" fill="#ffffff" />

            <circle cx="61" cy="48" r="6" fill="#38bdf8" />
            <circle cx="63" cy="46" r="2.2" fill="#ffffff" />
          </g>

          {/* Cheerful Smile */}
          <path d="M43 58 Q50 64 57 58" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Cute Cheeks */}
          <circle cx="32" cy="55" r="2.5" fill="rgba(244, 114, 182, 0.7)" />
          <circle cx="68" cy="55" r="2.5" fill="rgba(244, 114, 182, 0.7)" />

          {/* Gradients */}
          <defs>
            <linearGradient id="botGradient" x1="18" y1="24" x2="82" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" />
              <stop offset="0.5" stopColor="#0f172a" />
              <stop offset="1" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
}

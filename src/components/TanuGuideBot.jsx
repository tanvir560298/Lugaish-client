import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  BookOpen,
  PenTool,
  HelpCircle,
  ChevronRight,
  Eye,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import './tanu-guide-bot.css';

const TOUR_STEPS = [
  {
    id: 'menu',
    title: 'মেনু ও ৩-ডট (☰) বাটন',
    selectors: ['[data-tour="mobile-menu"]', '.header-menu', '.academic-nav'],
    text: '১ম স্টেপ: উপরে থাকা এই মেনু বাটন (☰ বা ৩-ডট) অথবা নেভিগেশন বারে ক্লিক করলেই সব পৃষ্ঠার লিঙ্ক পেয়ে যাবে!',
    hint: 'মোবাইলে ৩-ডট বা ☰ আইকনে ট্যাপ করো'
  },
  {
    id: 'courses',
    title: 'কোর্স ক্যাটালগ (Courses)',
    selectors: ['[data-tour="courses-link"]', 'a[href="/learn"]'],
    text: '২য় স্টেপ: সব কোর্স ও নতুন রিলিজ দেখতে এই "Courses" বাটনে ট্যাপ করো। এখানে সবগুলো ক্লাস সাজানো আছে।',
    hint: 'কোর্স তালিকায় যেতে এই বাটনে ক্লিক করো'
  },
  {
    id: 'ielts-writing',
    title: 'IELTS Writing & প্রোগ্রামিং ক্লাসেস',
    selectors: ['[data-course="ielts-writing"]', '[data-tour="course-cards"]', '.web-course-card', '.home-paths'],
    text: '৩য় স্টেপ: এই যে নতুন IELTS Writing Foundation ও Java/C কোর্স! সরাসরি পড়াশোনা শুরু করতে কার্ডের "Start" বাটনে ক্লিক করো।',
    hint: 'কার্ডের বাটনে চাপ দিলে সরাসরি ক্লাস ওপেন হবে',
    scroll: true
  },
  {
    id: 'tanu-companion',
    title: 'Tanu AI স্টাডি হেল্পার',
    selectors: ['[data-tour="tanu-link"]', 'a[href="/tanu"]'],
    text: '৪র্থ স্টেপ: কোনো পড়াশোনায় সাহায্য লাগলে আমাকে (Tanu) ডাকলেই আমি তোমার পড়ার রুটিন ও প্রশ্নের উত্তর বুঝিয়ে দেবো!',
    hint: 'যেকোনো সময় সাহায্যের জন্য Tanu AI-তে আসো'
  }
];

function getVisibleElement(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden' && (rect.width > 0 || rect.height > 0)) {
        return el;
      }
    }
  }
  return null;
}

export function TanuGuideBot() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showPeek, setShowPeek] = useState(true);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  // Update spotlight target positioning
  const updateSpotlight = useCallback(() => {
    if (!tourActive) {
      setTargetRect(null);
      return;
    }

    const currentStepConfig = TOUR_STEPS[tourStep];
    if (!currentStepConfig) return;

    const element = getVisibleElement(currentStepConfig.selectors || [currentStepConfig.selector]);
    if (element) {
      if (currentStepConfig.scroll) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Small delay to allow smooth scroll to complete before measuring
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          fixedTop: rect.top,
          fixedLeft: rect.left
        });
      }, 200);
    } else {
      setTargetRect(null);
    }
  }, [tourActive, tourStep]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [updateSpotlight]);

  const handleStartTour = () => {
    setIsOpen(true);
    setTourActive(true);
    setTourStep(0);
    setShowPeek(false);
  };

  const handleNextTourStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      // Completed tour
      setTourActive(false);
      setTargetRect(null);
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep > 0) {
      setTourStep(prev => prev - 1);
    }
  };

  const handleCloseGuide = () => {
    setIsOpen(false);
    setTourActive(false);
    setTargetRect(null);
  };

  const currentStep = TOUR_STEPS[tourStep];

  return (
    <>
      {/* Target Spotlight Highlight Ring & Pointer Arrow */}
      {tourActive && targetRect && (
        <div className="tanu-spotlight-overlay" aria-hidden="true">
          <div
            className="tanu-target-spotlight"
            style={{
              top: `${targetRect.fixedTop - 6}px`,
              left: `${targetRect.fixedLeft - 6}px`,
              width: `${targetRect.width + 12}px`,
              height: `${targetRect.height + 12}px`
            }}
          />
          <div
            className="tanu-pointer-hand"
            style={{
              top: `${Math.max(10, targetRect.fixedTop - 36)}px`,
              left: `${targetRect.fixedLeft + targetRect.width / 2 - 14}px`,
              fontSize: '28px'
            }}
          >
            👇
          </div>
        </div>
      )}

      {/* Floating Mascot Trigger & Bubble */}
      <div className="tanu-guide-container">
        {/* Peek Speech Bubble */}
        {showPeek && !isOpen && (
          <div className="tanu-peek-bubble" onClick={() => setIsOpen(true)}>
            <span>Tanu Bot:</span> বাটনগুলো চিনতে চাও? আমি গাইড করি! 👋
            <button
              className="tanu-peek-close"
              aria-label="Dismiss message"
              onClick={(e) => {
                e.stopPropagation();
                setShowPeek(false);
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* The Open Guide Card */}
        {isOpen && (
          <div className="tanu-guide-card" role="dialog" aria-label="Lugaish Guide Bot">
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
                  <h4>Tanu Guide Bot</h4>
                  <span>তোমার ফ্রেন্ডলি স্টাডি গাইড</span>
                </div>
              </div>
              <button
                className="tanu-guide-close-btn"
                onClick={handleCloseGuide}
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="tanu-guide-body">
              {/* TOUR MODE */}
              {tourActive ? (
                <div>
                  <div className="tanu-dialogue-kicker">
                    <Compass size={13} />
                    STEP 0{tourStep + 1} OF 0{TOUR_STEPS.length}
                  </div>
                  <div className="tanu-dialogue-box">
                    <strong style={{ display: 'block', color: '#38bdf8', marginBottom: '4px' }}>
                      {currentStep.title}
                    </strong>
                    <p style={{ margin: 0 }}>{currentStep.text}</p>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                      💡 {currentStep.hint}
                    </div>
                  </div>

                  <div className="tanu-tour-controls" style={{ marginTop: '14px' }}>
                    <button
                      className="tanu-tour-nav-btn"
                      onClick={handlePrevTourStep}
                      disabled={tourStep === 0}
                      style={{ opacity: tourStep === 0 ? 0.4 : 1 }}
                    >
                      <ArrowLeft size={14} /> আগে
                    </button>

                    <button
                      className="tanu-tour-nav-btn"
                      onClick={() => setTourActive(false)}
                      style={{ color: '#94a3b8' }}
                    >
                      ট্যুর থামাও
                    </button>

                    <button
                      className="tanu-tour-nav-btn is-primary"
                      onClick={handleNextTourStep}
                    >
                      {tourStep === TOUR_STEPS.length - 1 ? (
                        <>শেষ করো <Check size={14} /></>
                      ) : (
                        <>পরবর্তী <ArrowRight size={14} /></>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* MAIN MENU & QUICK SHORTCUTS */
                <>
                  <div className="tanu-dialogue-box">
                    <div className="tanu-dialogue-kicker">
                      <Sparkles size={12} />
                      সহজ গাইডলাইন
                    </div>
                    <strong>কী করতে চাও?</strong> নিচে ক্লিক করলেই আমি তোমাকে সরাসরি নিয়ে যাবো, কোনো বাটন খোঁজা লাগবে না!
                  </div>

                  {/* Dedicated 3-Dots Menu Finder */}
                  <button
                    className="tanu-action-btn is-highlight"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsOpen(true);
                      setTourActive(true);
                      setTourStep(0);
                    }}
                    style={{ marginBottom: '8px' }}
                  >
                    <div className="tanu-action-btn-icon" style={{ background: '#38bdf8', color: '#091326' }}>
                      <Compass size={18} />
                    </div>
                    <div className="tanu-action-btn-text">
                      <strong style={{ color: '#38bdf8' }}>👉 ৩-ডট (☰) মেনু কোথায়? দেখাও</strong>
                      <small>উপরে থাকা মেনু বাটনটি হাইলাইট করে দেখাবো</small>
                    </div>
                    <ChevronRight size={16} color="#38bdf8" />
                  </button>

                  {/* Guided Tour Banner Button */}
                  <button
                    className="tanu-action-btn"
                    onClick={handleStartTour}
                    style={{ marginBottom: '8px' }}
                  >
                    <div className="tanu-action-btn-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <Eye size={16} />
                    </div>
                    <div className="tanu-action-btn-text">
                      <strong>✨ সবগুলো বাটন বুঝিয়ে দাও (ফুল ট্যুর)</strong>
                      <small>কোর্স, IELTS, নেভিগেশন ও স্টাডি অপশনের গাইড</small>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  {/* Direct Jump Buttons */}
                  <div className="tanu-action-list">
                    <button
                      className="tanu-action-btn"
                      onClick={() => {
                        navigate('/learn/ielts-writing/1');
                        handleCloseGuide();
                      }}
                    >
                      <div className="tanu-action-btn-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                        <PenTool size={16} />
                      </div>
                      <div className="tanu-action-btn-text">
                        <strong>IELTS Writing Day 01 শুরু করো</strong>
                        <small>বাক্য তৈরি ও গ্রামার প্র্যাকটিস ল্যাব</small>
                      </div>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      className="tanu-action-btn"
                      onClick={() => {
                        navigate('/learn');
                        handleCloseGuide();
                      }}
                    >
                      <div className="tanu-action-btn-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                        <BookOpen size={16} />
                      </div>
                      <div className="tanu-action-btn-text">
                        <strong>সবগুলো কোর্স একসাথে দেখো</strong>
                        <small>Java, C, Web Development & IELTS</small>
                      </div>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      className="tanu-action-btn"
                      onClick={() => {
                        navigate('/tanu');
                        handleCloseGuide();
                      }}
                    >
                      <div className="tanu-action-btn-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                        <Sparkles size={16} />
                      </div>
                      <div className="tanu-action-btn-text">
                        <strong>Tanu AI স্টাডি কম্প্যানিয়ন</strong>
                        <small>পড়ার রুটিন তৈরি ও প্রশ্নের উত্তর পেতে</small>
                      </div>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Cute Floating Robot Mascot Button */}
        <button
          className="tanu-bot-avatar-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Tanu Guide Bot" : "Open Tanu Guide Bot"}
          title="Tanu Guide Bot — বাটনগুলো চিনতে আমাকে ক্লিক করো!"
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
    </>
  );
}


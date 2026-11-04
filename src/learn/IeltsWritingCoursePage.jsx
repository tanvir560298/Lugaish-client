import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Trophy,
  PenTool,
  Clock,
  Layers,
  HelpCircle,
  Lightbulb,
  FileText,
  Eye,
  EyeOff,
  ChevronRight,
  Award,
  Send,
  Zap,
  Lock,
  Unlock,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  IELTS_WRITING_WEEK_1_INFO,
  IELTS_WRITING_WEEK_1_DAYS
} from '../data/ieltsWritingWeek1Data.js';
import { IeltsWeeklyExam } from './IeltsWeeklyExam.jsx';
import './learn.css';
import './ielts-writing.css';

function triggerCelebration() {
  try {
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 }
    });
  } catch {
    // fallback if canvas not supported
  }
}

const PROGRESS_STORAGE_KEY = 'lugaish_ielts_writing_progress_v1';
const DRAFTS_STORAGE_KEY = 'lugaish_ielts_writing_drafts_v1';

function getStoredProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completedDays: [], scores: {} };
  } catch {
    return { completedDays: [], scores: {} };
  }
}

function saveStoredProgress(data) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save progress', err);
  }
}

function getStoredDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredDraft(day, text) {
  try {
    const all = getStoredDrafts();
    all[day] = text;
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save draft', err);
  }
}

export function IeltsWritingCoursePage() {
  const { day: rawDay } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(getStoredProgress);
  const [drafts, setDrafts] = useState(getStoredDrafts);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [savedNotification, setSavedNotification] = useState('');
  const [previewAllDays, setPreviewAllDays] = useState(false);

  // Next incomplete lesson in week 1
  const nextIncompleteDay = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7].find(d => !progress.completedDays.includes(d)) || 8;
  }, [progress.completedDays]);

  // If no day specified in route, open next incomplete day
  const currentDayNum = Math.max(1, Math.min(8, parseInt(rawDay || String(nextIncompleteDay), 10) || 1));

  // 3-Step linear progression: 'study' | 'quiz' | 'words_writing'
  const [activeStep, setActiveStep] = useState('study');

  // Quiz State (Single unified submission)
  const [selectedOptions, setSelectedOptions] = useState({});
  const [typedAnswers, setTypedAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // Vocabulary Practice State
  const [vocabInputs, setVocabInputs] = useState({});
  const [vocabChecked, setVocabChecked] = useState({});
  const [vocabResults, setVocabResults] = useState({});

  const dayData = useMemo(() => {
    return IELTS_WRITING_WEEK_1_DAYS.find(d => d.day === currentDayNum) || IELTS_WRITING_WEEK_1_DAYS[0];
  }, [currentDayNum]);

  // Handle Exam Completion for Day 8
  const handleExamComplete = useCallback((examResult) => {
    setProgress(prev => {
      const isCompleted = prev.completedDays.includes(8);
      const updated = {
        ...prev,
        completedDays: isCompleted ? prev.completedDays : [...prev.completedDays, 8],
        scores: {
          ...prev.scores,
          'day-8': examResult.score,
          'week-1-exam': examResult.score
        }
      };
      saveStoredProgress(updated);
      return updated;
    });
    triggerCelebration();
  }, []);

  // Reset states when changing day
  useEffect(() => {
    setActiveStep('study');
    setShowModelAnswer(false);
    setSelectedOptions({});
    setTypedAnswers({});
    setIsQuizSubmitted(false);
    setQuizResults({});
    setQuizScore(null);
    setVocabInputs({});
    setVocabChecked({});
    setVocabResults({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDayNum]);

  const isDayCompleted = progress.completedDays.includes(currentDayNum);

  // Reset progress confirmation
  const handleResetProgress = () => {
    if (window.confirm('আপনি কি সত্যিই আপনার অগ্রগতি রিসেট করতে চান? (Are you sure you want to reset your progress?)')) {
      const fresh = { completedDays: [], scores: {} };
      setProgress(fresh);
      saveStoredProgress(fresh);
      setPreviewAllDays(false);
      navigate('/learn/ielts-writing/1');
    }
  };

  // Day Complete Handler with Verification & Confetti
  const handleCompleteDay = () => {
    const isCompleted = progress.completedDays.includes(currentDayNum);
    const newCompleted = isCompleted
      ? progress.completedDays
      : [...progress.completedDays, currentDayNum].sort((a, b) => a - b);

    const calculatedScore = quizScore
      ? quizScore.percentage
      : (progress.scores[`day_${currentDayNum}`] || 85);

    const updated = {
      ...progress,
      completedDays: newCompleted,
      scores: {
        ...progress.scores,
        [`day_${currentDayNum}`]: calculatedScore
      }
    };

    setProgress(updated);
    saveStoredProgress(updated);
    triggerCelebration();

    if (currentDayNum < 7) {
      setSavedNotification(`🎉 অসাধারণ! Day 0${currentDayNum} সফলভাবে সম্পন্ন হয়েছে! Day 0${currentDayNum + 1} আনলক হয়ে গেছে।`);
      setTimeout(() => {
        setSavedNotification('');
        navigate(`/learn/ielts-writing/${currentDayNum + 1}`);
      }, 1600);
    } else if (currentDayNum === 7) {
      setSavedNotification('🏆 চমৎকার! আপনি Week 1-এর ৭টি ক্লাসই শেষ করেছেন! Day 08 Mastery Exam আনলক হয়ে গেছে!');
      setTimeout(() => {
        setSavedNotification('');
        navigate('/learn/ielts-writing/8');
      }, 1800);
    } else {
      setSavedNotification('🎉 দিনটি সফলভাবে সম্পন্ন হয়েছে!');
      setTimeout(() => setSavedNotification(''), 3000);
    }
  };

  // Option selection
  const handleSelectOption = (problemId, optIndex) => {
    if (isQuizSubmitted) return;
    setSelectedOptions(prev => ({ ...prev, [problemId]: optIndex }));
  };

  // Text input change
  const handleInputChange = (problemId, val) => {
    if (isQuizSubmitted) return;
    setTypedAnswers(prev => ({ ...prev, [problemId]: val }));
  };

  // Unified Single Quiz Submission
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const results = {};
    const problems = dayData.practiceProblems || [];

    problems.forEach((problem) => {
      const pid = problem.id;
      let isCorrect = false;
      let userAnswer = '';
      let correctAnswer = '';

      if (problem.type === 'mcq') {
        const selectedIdx = selectedOptions[pid];
        userAnswer = selectedIdx !== undefined ? problem.options[selectedIdx] : '(Not answered)';
        correctAnswer = problem.options[problem.correctIndex];
        isCorrect = selectedIdx === problem.correctIndex;
      } else {
        const rawInput = (typedAnswers[pid] || '').trim();
        userAnswer = rawInput || '(Blank)';
        correctAnswer = problem.correctAnswer;
        const cleanUser = rawInput.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
        const cleanCorrect = (problem.correctAnswer || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
        const acceptable = (problem.acceptableAnswers || []).map(a => a.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''));
        isCorrect = cleanUser === cleanCorrect || acceptable.includes(cleanUser);
      }

      if (isCorrect) correctCount++;
      results[pid] = { isCorrect, userAnswer, correctAnswer };
    });

    const scoreData = {
      correct: correctCount,
      total: problems.length,
      percentage: problems.length > 0 ? Math.round((correctCount / problems.length) * 100) : 0
    };

    setQuizResults(results);
    setQuizScore(scoreData);
    setIsQuizSubmitted(true);
    if (scoreData.percentage >= 60) {
      triggerCelebration();
    }

    // Save score to progress
    const updated = {
      ...progress,
      scores: { ...progress.scores, [`day_${currentDayNum}`]: scoreData.percentage }
    };
    setProgress(updated);
    saveStoredProgress(updated);

    // Smooth scroll to top of quiz to review
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleRetakeQuiz = () => {
    setSelectedOptions({});
    setTypedAnswers({});
    setIsQuizSubmitted(false);
    setQuizResults({});
    setQuizScore(null);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Vocabulary Practice Check
  const handleCheckVocab = (wordIndex, targetWord) => {
    const input = (vocabInputs[wordIndex] || '').trim().toLowerCase();
    const cleanTarget = targetWord.trim().toLowerCase();
    const isMatch = input === cleanTarget;
    setVocabChecked(prev => ({ ...prev, [wordIndex]: true }));
    setVocabResults(prev => ({ ...prev, [wordIndex]: isMatch }));
  };

  // Writing draft handler
  const currentDraft = drafts[currentDayNum] || '';
  const handleDraftChange = (e) => {
    const text = e.target.value;
    setDrafts(prev => ({ ...prev, [currentDayNum]: text }));
    saveStoredDraft(currentDayNum, text);
  };

  const wordCount = currentDraft.trim() ? currentDraft.trim().split(/\s+/).length : 0;
  const isWordCountSufficient = wordCount >= (dayData.writingChallenge?.minimumWords || 35);

  // Quiz answered count
  const practiceProblems = dayData.practiceProblems || [];
  const answeredCount = practiceProblems.filter(p => {
    if (p.type === 'mcq') return selectedOptions[p.id] !== undefined;
    return !!(typedAnswers[p.id] || '').trim();
  }).length;
  const totalQuestions = practiceProblems.length;

  return (
    <div className="ielts-course-shell">
      {/* Breadcrumb Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--lx-muted)', marginBottom: '16px' }}>
        <Link to="/learn" style={{ color: 'var(--lx-accent)', textDecoration: 'none' }}>Courses</Link>
        <span>/</span>
        <span style={{ color: 'var(--lx-text)', fontWeight: 600 }}>IELTS Writing Foundation</span>
        <span>/</span>
        <span style={{ color: 'var(--lx-accent)' }}>Day 0{currentDayNum}</span>
      </nav>

      {/* Course Banner Header */}
      <header className="ielts-header-card">
        <div className="ielts-header-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="lx-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                60-DAY IELTS WRITING · WEEK 1
              </span>
              <span style={{ fontSize: '12px', color: 'var(--lx-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {dayData.timeMinutes} Mins Daily
              </span>
            </div>
            <h1 className="ielts-header-title">
              {dayData.isExam ? `🏆 ${dayData.title}` : `Day 0${dayData.day}: ${dayData.title}`}
            </h1>
            <p className="ielts-header-subtitle">
              {dayData.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 750,
              background: isDayCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.12)',
              color: isDayCompleted ? '#34d399' : '#60a5fa',
              border: isDayCompleted ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              {isDayCompleted ? <CheckCircle2 size={14} /> : <Clock size={13} />}
              {isDayCompleted ? (dayData.isExam ? 'Exam Passed ✓' : 'Day Completed ✓') : 'In Progress'}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--lx-muted)' }}>
              Week 1: {progress.completedDays.filter(d => d <= 7).length} of 7 Lessons Complete
            </span>
          </div>
        </div>

        {/* Overall Week 1 Progress Bar */}
        <div style={{
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ color: 'var(--lx-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} color="#60a5fa" />
              Week 1 Progress:
              <strong style={{ color: '#ffffff' }}>
                {progress.completedDays.filter(d => d <= 7).length} / 7 Completed
              </strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#34d399', fontWeight: 750 }}>
                {Math.round((progress.completedDays.filter(d => d <= 7).length / 7) * 100)}%
              </span>
              <button
                type="button"
                onClick={handleResetProgress}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--lx-muted)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${(progress.completedDays.filter(d => d <= 7).length / 7) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {savedNotification && (
          <div style={{
            marginTop: '12px',
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34d399',
            fontSize: '12.5px',
            fontWeight: 600
          }}>
            {savedNotification}
          </div>
        )}
      </header>

      {/* 8-Day Quick Switcher Bar with Unlock States (Horizontal Swiper on Mobile) */}
      <div className="ielts-day-switcher-bar">
        {IELTS_WRITING_WEEK_1_DAYS.map((d) => {
          const isSelected = d.day === currentDayNum;
          const isDone = progress.completedDays.includes(d.day);
          const isExamDay = d.isExam;
          const isUnlocked = d.day === 1 || progress.completedDays.includes(d.day - 1) || previewAllDays;
          const dayScore = progress.scores?.[isExamDay ? 'week-1-exam' : `day_${d.day}`];

          return (
            <Link
              key={d.day}
              to={`/learn/ielts-writing/${d.day}`}
              className="ielts-day-switcher-item"
              onClick={(e) => {
                if (!isUnlocked && !previewAllDays) {
                  e.preventDefault();
                  if (window.confirm(`Day 0${d.day} এখনও লক করা আছে। এটি আনলক করতে প্রথমে Day 0${d.day - 1} সম্পন্ন করুন। আপনি কি প্রিভিউ মোডে এই ক্লাসটি দেখতে চান?`)) {
                    setPreviewAllDays(true);
                    navigate(`/learn/ielts-writing/${d.day}`);
                  }
                }
              }}
              style={{
                background: isSelected 
                  ? (isExamDay ? 'rgba(245, 158, 11, 0.22)' : 'rgba(59, 130, 246, 0.22)') 
                  : isDone
                    ? 'rgba(16, 185, 129, 0.08)'
                    : (isExamDay ? 'rgba(245, 158, 11, 0.05)' : 'var(--lx-panel, rgba(15, 23, 42, 0.6))'),
                border: isSelected 
                  ? (isExamDay ? '1.5px solid #fbbf24' : '1.5px solid #3b82f6') 
                  : isDone
                    ? '1px solid rgba(16, 185, 129, 0.35)'
                    : (isExamDay ? '1px dashed rgba(245, 158, 11, 0.35)' : '1px solid var(--lx-border, rgba(255, 255, 255, 0.08))'),
                opacity: (!isUnlocked && !isDone) ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ 
                  fontSize: '10.5px', 
                  fontWeight: 800, 
                  color: isSelected 
                    ? (isExamDay ? '#fbbf24' : '#60a5fa') 
                    : isDone
                      ? '#34d399'
                      : (isExamDay ? '#f59e0b' : 'var(--lx-muted)') 
                }}>
                  {isExamDay ? 'DAY 08 🏆' : `DAY 0${d.day}`}
                </span>
                {isDone ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#34d399', fontSize: '10px', fontWeight: 750 }}>
                    <Check size={11} /> {dayScore ? `${dayScore}%` : '✓'}
                  </span>
                ) : !isUnlocked ? (
                  <Lock size={11} color="var(--lx-muted)" />
                ) : null}
              </div>
              <strong style={{ 
                fontSize: '11.5px', 
                lineHeight: 1.25, 
                fontWeight: isSelected ? 700 : 500, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {d.title}
              </strong>
            </Link>
          );
        })}
      </div>

      {/* RENDER EXAM OR STANDARD 3-STEP LESSON */}
      {dayData.isExam ? (
        (progress.completedDays.filter(d => d <= 7).length < 7 && !previewAllDays) ? (
          <div className="ielts-card" style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid #fbbf24',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 14px',
              color: '#fbbf24'
            }}>
              <Trophy size={32} />
            </div>

            <span className="lx-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: '#fbbf24', color: '#fbbf24', marginBottom: '10px' }}>
              WEEK 1 MASTERY EXAM · DAY 08
            </span>

            <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '10px 0 6px', fontWeight: 800, color: '#ffffff' }}>
              পরীক্ষাটি এখনও আনলক হয়নি 🔒
            </h2>

            <p style={{ fontSize: '14px', color: 'var(--lx-muted)', lineHeight: 1.55, maxWidth: '560px', margin: '0 auto 20px' }}>
              Week 1 Mastery Exam (৫০ মার্কস) দিতে হলে আপনাকে প্রথমে <strong>Day 01 থেকে Day 07</strong> পর্যন্ত সবগুলো ক্লাস ও প্র্যাকটিস কুইজ সম্পন্ন করতে হবে।
            </p>

            {/* Visual Progress Bar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px 16px', borderRadius: '12px', marginBottom: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>আপনার অগ্রগতি (Week 1 Progress):</span>
                <span style={{ color: '#fbbf24', fontWeight: 750 }}>
                  {progress.completedDays.filter(d => d <= 7).length} / 7 দিন সম্পন্ন ({Math.round((progress.completedDays.filter(d => d <= 7).length / 7) * 100)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(progress.completedDays.filter(d => d <= 7).length / 7) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            <div className="ielts-completion-actions" style={{ justifyContent: 'center' }}>
              <Link
                to={`/learn/ielts-writing/${nextIncompleteDay}`}
                className="ielts-submit-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 750,
                  fontSize: '14px'
                }}
              >
                পরবর্তী ক্লাসে যান (Day 0{nextIncompleteDay}) <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => setPreviewAllDays(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--lx-muted)',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
              >
                প্রিভিউ মোডে পরীক্ষা দেখুন (Preview Exam)
              </button>
            </div>
          </div>
        ) : (
          <IeltsWeeklyExam
            examData={dayData}
            progress={progress}
            onExamComplete={handleExamComplete}
          />
        )
      ) : (
        <>
          {/* 3-STEP PROGRESSIVE STEPPER (Streamlined & Clutter-Free) */}
          <div className="ielts-stepper-container" role="tablist" aria-label="Course Steps">
            <button
              className={`ielts-step-item ${activeStep === 'study' ? 'is-active' : ''}`}
              onClick={() => {
                setActiveStep('study');
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              role="tab"
              aria-selected={activeStep === 'study'}
            >
              <div className="ielts-step-badge">
                {isDayCompleted ? '✓' : '1'}
              </div>
              <div className="ielts-step-content">
                <strong>
                  <span className="step-label-desktop">1. Study Lesson (পড়ুন)</span>
                  <span className="step-label-mobile">1. Study</span>
                </strong>
                <small>Grammar Theory, Rules & Pitfalls</small>
              </div>
            </button>

            <button
              className={`ielts-step-item ${activeStep === 'quiz' ? 'is-active' : ''}`}
              onClick={() => {
                setActiveStep('quiz');
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              role="tab"
              aria-selected={activeStep === 'quiz'}
            >
              <div className="ielts-step-badge">
                {isQuizSubmitted && quizScore?.percentage >= 60 ? '✓' : '2'}
              </div>
              <div className="ielts-step-content">
                <strong>
                  <span className="step-label-desktop">2. Practice Quiz (পরীক্ষা)</span>
                  <span className="step-label-mobile">2. Quiz</span>
                </strong>
                <small>
                  {isQuizSubmitted
                    ? (quizScore?.percentage >= 60
                        ? `✓ Passed: ${quizScore?.correct}/${totalQuestions} (${quizScore?.percentage}%)`
                        : `⚠️ Needs 60%: ${quizScore?.correct}/${totalQuestions} (${quizScore?.percentage}%)`)
                    : `${totalQuestions} Questions · Min 60% to Pass`}
                </small>
              </div>
            </button>

            <button
              className={`ielts-step-item ${activeStep === 'words_writing' ? 'is-active' : ''}`}
              onClick={() => {
                setActiveStep('words_writing');
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              role="tab"
              aria-selected={activeStep === 'words_writing'}
            >
              <div className="ielts-step-badge">
                {isWordCountSufficient ? '✓' : '3'}
              </div>
              <div className="ielts-step-content">
                <strong>
                  <span className="step-label-desktop">3. 3 New Words & Writing</span>
                  <span className="step-label-mobile">3. Write</span>
                </strong>
                <small>
                  {isWordCountSufficient
                    ? `✓ Word count met (${wordCount} words)`
                    : `Vocabulary & ${dayData.writingChallenge?.minimumWords || 35} Words Challenge`}
                </small>
              </div>
            </button>
          </div>

      {/* =========================================================================
          STEP 1: STUDY LESSON (GRAMMAR THEORY, FORMULAS, EXAMPLES & TRAPS)
          ========================================================================= */}
      {activeStep === 'study' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Objectives Card */}
          <div className="ielts-card">
            <h3 style={{ fontSize: '17px', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 700 }}>
              <CheckCircle2 size={18} /> Today's Learning Outcomes (আজকের ক্লাসে যা শিখবেন)
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: 'var(--lx-text, #f1f5f9)' }}>
              {dayData.outcomes.map((item, idx) => (
                <li key={idx} style={{ lineHeight: 1.55 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* In-depth Grammar Theory Discussion */}
          <div className="ielts-card" style={{ lineHeight: 1.75 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span className="lx-pill" style={{ background: 'rgba(234, 179, 8, 0.12)', borderColor: 'rgba(234, 179, 8, 0.35)', color: '#facc15' }}>
                DEEP GRAMMAR FOUNDATION
              </span>
              <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', margin: 0, fontWeight: 750, color: '#ffffff' }}>
                সহজ ভাষায় ব্যাকরণ ও বাক্য গঠনের নিয়ম
              </h2>
            </div>

            <div style={{ whiteSpace: 'pre-line', fontSize: '14.5px', color: 'var(--lx-text, #e2e8f0)', lineHeight: 1.75 }}>
              {dayData.grammarTheory.banglaExplanation.trim()}
            </div>

            {/* Core Sentence Formulas */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '15px', marginBottom: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} /> মূল বাক্য কাঠামো ও ফর্মুলা (Sentence Formulas)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                {dayData.grammarTheory.formulas.map((f, i) => (
                  <div key={i} style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.25)'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.name}
                    </span>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#67e8f9', margin: '6px 0 4px', fontWeight: 700 }}>
                      {f.structure}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--lx-muted, #94a3b8)' }}>
                      <em>e.g., {f.example}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IELTS Band Impact Card */}
            <div style={{
              marginTop: '20px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '13.5px', color: '#fbbf24', display: 'block', marginBottom: '3px' }}>
                  IELTS Writing Band 7+ Connection:
                </strong>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--lx-text, #f1f5f9)', lineHeight: 1.55 }}>
                  {dayData.grammarTheory.ieltsImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Model Worked Examples */}
          <div className="ielts-card">
            <h3 style={{ fontSize: '18px', margin: '0 0 14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
              <CheckCircle2 size={18} /> Model Worked Examples (বিশ্লেষণসহ উদাহরণ)
            </h3>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--lx-border)', color: 'var(--lx-muted)', fontSize: '11.5px' }}>
                    <th style={{ padding: '10px 12px' }}>#</th>
                    <th style={{ padding: '10px 12px' }}>Parsing / Structure</th>
                    <th style={{ padding: '10px 12px' }}>Complete Sentence &amp; Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {dayData.workedExamples.map((ex, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: 700 }}>0{idx + 1}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'ui-monospace, monospace', color: '#93c5fd' }}>
                        {ex.s && <span>[S: {ex.s}] + [V: {ex.v}] {ex.o ? `+ [O: ${ex.o}]` : ''} {ex.comp ? `+ [Comp: ${ex.comp}]` : ''}</span>}
                        {ex.word && <span><strong>{ex.word}</strong> ({ex.pos})</span>}
                        {ex.noun && <span>{ex.noun} ({ex.note})</span>}
                        {ex.sub && <span>[Sub: {ex.sub}] + [V: {ex.v}]</span>}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--lx-text)' }}>
                        <strong>{ex.sentence || (ex.s ? `${ex.s} ${ex.v} ${ex.o || ex.comp || ''}.` : '')}</strong>
                        {ex.meaning && <div style={{ fontSize: '12px', color: 'var(--lx-muted)', marginTop: '2px' }}>{ex.meaning}</div>}
                        {ex.rule && <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>Rule: {ex.rule}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Common Mistakes & Traps */}
          <div className="ielts-card">
            <h3 style={{ fontSize: '18px', margin: '0 0 14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
              <AlertCircle size={18} /> Common Traps vs Correct Academic English (সাধারণ ভুল ও সমাধান)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px' }}>
              {dayData.commonTraps.map((trap, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}>
                  <div style={{ color: '#ef4444', fontSize: '12.5px', textDecoration: 'line-through', marginBottom: '4px' }}>
                    ❌ {trap.incorrect}
                  </div>
                  <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 750, marginBottom: '6px' }}>
                    ✅ {trap.correct}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--lx-muted)', lineHeight: 1.5 }}>
                    <strong>ব্যাখ্যা / লজিক:</strong> {trap.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call to Action to Quiz */}
          <div className="ielts-card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1.5px solid rgba(59, 130, 246, 0.35)',
            marginTop: '8px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{ fontWeight: 750, fontSize: '15.5px', color: '#ffffff', marginBottom: '4px' }}>
                ধাপ ১ পড়া শেষ হয়েছে? (Finished Reading Step 1?)
              </div>
              <div style={{ fontSize: '13px', color: 'var(--lx-muted)' }}>
                নিয়মগুলো বুঝে থাকলে এবার ৫টি প্র্যাকটিস কুইজে অংশ নিয়ে নিজেকে যাচাই করুন (পাস করতে ৬০% প্রয়োজন)।
              </div>
            </div>
            <button
              onClick={() => {
                setActiveStep('quiz');
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              className="ielts-submit-btn"
            >
              <CheckCircle2 size={16} /> কুইজ শুরু করুন ({totalQuestions} Questions) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: PRACTICE QUIZ (EXAM TIME · UNIFIED SUBMISSION · DETAILED EXPLANATIONS)
          ========================================================================= */}
      {activeStep === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Banner */}
          <div className="ielts-quiz-header-banner">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="lx-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6', color: '#60a5fa' }}>
                  DAILY PRACTICE EXAM
                </span>
                <span style={{ fontSize: '12px', color: 'var(--lx-muted)' }}>
                  Day 0{dayData.day} · {totalQuestions} Questions
                </span>
              </div>
              <h3 style={{ fontSize: '20px', margin: '4px 0', fontWeight: 800, color: '#ffffff' }}>
                Sentence Building & Grammar Test
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--lx-muted)' }}>
                প্রতিটি প্রশ্নের উত্তর নির্বাচন করুন। সব উত্তর শেষে নিচে থাকা "Submit All Answers" বাটনে চাপ দিয়ে ফলাফল দেখুন।
              </p>
            </div>

            {isQuizSubmitted && (
              <button
                onClick={handleRetakeQuiz}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} /> Retake Quiz (পুনরায় পরীক্ষা দাও)
              </button>
            )}
          </div>

          {/* Submitted Score Summary Banner */}
          {isQuizSubmitted && quizScore && (
            <div className="ielts-card" style={{
              background: quizScore.percentage >= 70
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: quizScore.percentage >= 70 ? '1.5px solid #10b981' : '1.5px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: quizScore.percentage >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `2px solid ${quizScore.percentage >= 70 ? '#34d399' : '#f87171'}`,
                  fontSize: '18px',
                  fontWeight: 800,
                  color: quizScore.percentage >= 70 ? '#34d399' : '#f87171',
                  flexShrink: 0
                }}>
                  {quizScore.percentage}%
                </div>
                <div>
                  <h4 style={{ fontSize: '17px', margin: '0 0 3px', fontWeight: 800, color: '#ffffff' }}>
                    {quizScore.percentage >= 90
                      ? '🌟 Outstanding! Band 7.5+ Grammatical Control!'
                      : quizScore.percentage >= 70
                        ? '👏 Well Done! Solid Foundation!'
                        : '💡 Good Effort! Review the explanations below.'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--lx-muted)' }}>
                    You scored <strong>{quizScore.correct}</strong> out of <strong>{quizScore.total}</strong> correct.
                    নিচে প্রতিটি ভুলের বিস্তারিত ব্যাখ্যা দেখে নাও!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveStep('words_writing');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="ielts-submit-btn"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderColor: '#34d399' }}
              >
                ধাপ ৩: শব্দ ও রাইটিং <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dayData.practiceProblems.map((problem, pIdx) => {
              const res = quizResults[problem.id];
              const isAnswered = isQuizSubmitted && !!res;
              const isCorrect = res?.isCorrect;

              return (
                <div
                  key={problem.id}
                  className={`ielts-question-card ${isAnswered ? (isCorrect ? 'is-correct' : 'is-incorrect') : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="lx-pill" style={{ textTransform: 'uppercase' }}>
                      QUESTION 0{pIdx + 1} · {problem.type.replace('_', ' ')}
                    </span>
                    {isAnswered && (
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 750,
                        color: isCorrect ? '#34d399' : '#f87171',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {isCorrect ? 'Correct (+1 Point)' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '15.5px', fontWeight: 650, margin: '0 0 14px', color: '#ffffff', lineHeight: 1.5 }}>
                    {problem.question}
                  </p>

                  {/* MCQ Options */}
                  {problem.type === 'mcq' && (
                    <div className="ielts-options-stack">
                      {problem.options.map((opt, optIdx) => {
                        const isSelected = selectedOptions[problem.id] === optIdx;
                        let extraClass = '';
                        if (isQuizSubmitted) {
                          if (optIdx === problem.correctIndex) {
                            extraClass = 'is-correct-reveal';
                          } else if (isSelected) {
                            extraClass = 'is-wrong-reveal';
                          }
                        } else if (isSelected) {
                          extraClass = 'is-selected';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(problem.id, optIdx)}
                            disabled={isQuizSubmitted}
                            className={`ielts-option-row ${extraClass}`}
                          >
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '12px',
                              fontWeight: 750,
                              background: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff',
                              flexShrink: 0
                            }}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            {isQuizSubmitted && optIdx === problem.correctIndex && (
                              <Check size={16} color="#34d399" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Input for Rearrange / Error Fix */}
                  {problem.type !== 'mcq' && (
                    <div style={{ marginBottom: '14px' }}>
                      <input
                        type="text"
                        value={typedAnswers[problem.id] || ''}
                        onChange={(e) => handleInputChange(problem.id, e.target.value)}
                        disabled={isQuizSubmitted}
                        placeholder="Type your corrected answer here..."
                        className="ielts-text-input"
                        style={isAnswered ? {
                          borderColor: isCorrect ? '#10b981' : '#ef4444',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
                        } : undefined}
                      />
                    </div>
                  )}

                  {/* DETAILED EXPLANATION BOX (Always shown after submission) */}
                  {isQuizSubmitted && (
                    <div className="ielts-explanation-box">
                      <div className="exp-correct-target">
                        ✓ Correct Answer: {problem.correctAnswer || problem.options[problem.correctIndex]}
                      </div>
                      {!isCorrect && (
                        <div style={{ fontSize: '13px', color: '#fca5a5', marginBottom: '6px' }}>
                          <strong>Your Answer:</strong> {res?.userAnswer}
                        </div>
                      )}
                      <div className="exp-bangla-note">
                        <strong style={{ color: '#38bdf8' }}>গ্রামার লজিক ও ব্যাখ্যা:</strong> {problem.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SINGLE BOTTOM SUBMIT BAR */}
          {!isQuizSubmitted && (
            <div className="ielts-quiz-submit-bar">
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>
                  Ready to check your answers?
                </strong>
                <span style={{ fontSize: '12.5px', color: 'var(--lx-muted)' }}>
                  Answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions
                </span>
              </div>

              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0}
                className="ielts-submit-btn"
                style={{ opacity: answeredCount === 0 ? 0.5 : 1 }}
              >
                <Send size={16} /> Submit All Answers (সব উত্তর জমা দিন)
              </button>
            </div>
          )}

          {/* After Submission Footer Navigation */}
          {isQuizSubmitted && (
            <div className="ielts-card" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: quizScore?.percentage >= 60 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: quizScore?.percentage >= 60 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
              marginTop: '16px',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff', marginBottom: '4px' }}>
                  {quizScore?.percentage >= 60
                    ? `🎉 কুইজ পাস! আপনার স্কোর: ${quizScore?.correct}/${quizScore?.total} (${quizScore?.percentage}%)`
                    : `⚠️ কুইজে পাশ করতে কমপক্ষে ৬০% নম্বর প্রয়োজন (আপনার স্কোর: ${quizScore?.correct}/${quizScore?.total}, ${quizScore?.percentage}%)`}
                </strong>
                <span style={{ fontSize: '13px', color: 'var(--lx-muted)' }}>
                  {quizScore?.percentage >= 60
                    ? 'এবার ৩ নম্বর ধাপে গিয়ে ৩টি নতুন শব্দ ও রাইটিং প্র্যাকটিস শুরু করুন।'
                    : 'নিচে প্রতিটি প্রশ্নের সঠিক উত্তর ও গ্রামার ব্যাখ্যা ভালো করে দেখে নিয়ে আবার কুইজ দিন।'}
                </span>
              </div>

              <div className="ielts-completion-actions">
                <button
                  onClick={handleRetakeQuiz}
                  className="lx-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={15} /> কুইজ আবার দিন (Retake)
                </button>

                <button
                  onClick={() => {
                    setActiveStep('words_writing');
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="ielts-submit-btn"
                  style={{
                    padding: '12px 22px',
                    background: quizScore?.percentage >= 60 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined,
                    borderColor: quizScore?.percentage >= 60 ? '#34d399' : undefined
                  }}
                >
                  ধাপ ৩: শব্দ ও রাইটিং <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 3: 3 NEW WORDS & WRITING CHALLENGE
          ========================================================================= */}
      {activeStep === 'words_writing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* SECTION A: DAILY 3 NEW WORDS (VOCABULARY BUILDER: COMMON -> HARDER) */}
          <div className="ielts-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="lx-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8', color: '#38bdf8' }}>
                <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
                DAILY VOCABULARY ACCELERATOR
              </span>
              <span style={{ fontSize: '12px', color: 'var(--lx-muted)' }}>
                Common ➔ Academic Band 7+
              </span>
            </div>

            <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', margin: '4px 0 8px', fontWeight: 800, color: '#ffffff' }}>
              🌟 Now Let's Learn 3 New Words (আজকের ৩টি প্রয়োজনীয় শব্দ)
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)', maxWidth: '780px' }}>
              প্রতিদিন সহজ শব্দ থেকে ধাপে ধাপে উচ্চমার্গের শব্দ শিখুন। প্রথমে বাংলা অর্থ দেখুন, এরপর বাস্তব বাক্যে প্রয়োগ বুঝে নিজেই বাক্য বানিয়ে প্র্যাকটিস করুন।
            </p>

            {/* 3 Word Cards Grid */}
            <div className="ielts-vocab-grid">
              {(dayData.dailyThreeWords || []).map((w, wIdx) => {
                const isChecked = vocabChecked[wIdx];
                const isCorrect = vocabResults[wIdx];

                return (
                  <div key={wIdx} className="ielts-vocab-card">
                    {/* Level Tag */}
                    <div className={`ielts-vocab-level-tag ${w.level.toLowerCase()}`}>
                      {w.levelBadge}
                    </div>

                    {/* Word & Phonetic */}
                    <div className="ielts-vocab-word-header">
                      <span className="ielts-vocab-word">{w.word}</span>
                      <span className="ielts-vocab-phonetic">{w.phonetic}</span>
                      <span className="ielts-vocab-pos">{w.pos}</span>
                    </div>

                    {/* Bangla Meaning First */}
                    <div className="ielts-vocab-bangla">
                      বাংলা অর্থ: {w.banglaMeaning}
                    </div>

                    {/* English Definition */}
                    <div className="ielts-vocab-english">
                      <strong>Definition:</strong> {w.englishDefinition}
                    </div>

                    {/* IELTS Academic Sentence Context */}
                    <div className="ielts-vocab-sentence-box">
                      <strong>Academic Context Sentence:</strong>
                      <p style={{ margin: 0, color: '#e2e8f0', fontStyle: 'italic' }}>
                        "{w.ieltsSentence}"
                      </p>
                    </div>

                    {/* Examiner Tip */}
                    <div style={{ fontSize: '12px', color: 'var(--lx-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                      <strong style={{ color: '#38bdf8' }}>💡 ব্যান্ড স্কোর টিপ:</strong> {w.contextTip}
                    </div>

                    {/* Interactive Practice */}
                    <div className="ielts-vocab-practice-box">
                      <div style={{ fontSize: '13px', fontWeight: 650, color: '#ffffff', marginBottom: '8px' }}>
                        ✍️ Practice Question:
                      </div>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>
                        {w.practiceQuestion}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={vocabInputs[wIdx] || ''}
                          onChange={(e) => setVocabInputs({ ...vocabInputs, [wIdx]: e.target.value })}
                          placeholder={`Type ${w.targetWord}...`}
                          className="ielts-text-input"
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: isChecked
                              ? (isCorrect ? '1.5px solid #10b981' : '1.5px solid #ef4444')
                              : undefined
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleCheckVocab(wIdx, w.targetWord)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Check
                        </button>
                      </div>

                      {isChecked && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          fontWeight: 650,
                          color: isCorrect ? '#34d399' : '#f87171'
                        }}>
                          {isCorrect ? '✓ Correct! Well done.' : `❌ Try again! Correct word is: "${w.targetWord}".`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION B: DAILY WRITING CHALLENGE */}
          <div className="ielts-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="lx-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                DAILY WRITING PRODUCTION
              </span>
              <h3 style={{ fontSize: '19px', margin: 0, fontWeight: 750, color: '#ffffff' }}>
                Independent Writing Task
              </h3>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              marginBottom: '18px',
              fontSize: '14.5px',
              color: 'var(--lx-text)',
              lineHeight: 1.6
            }}>
              <strong>Task Prompt:</strong> {dayData.writingChallenge.prompt}
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ fontSize: '12.5px', color: 'var(--lx-muted)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Writing Checklist (লেখার শর্তাবলী):
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--lx-muted)' }}>
                {dayData.writingChallenge.checklist.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Live Textarea (iOS Friendly 16px Font) */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <textarea
                value={currentDraft}
                onChange={handleDraftChange}
                placeholder="Start typing your sentences or paragraph here. Your progress is saved automatically..."
                rows={7}
                className="ielts-textarea"
                style={{
                  border: isWordCountSufficient ? '1.5px solid rgba(16, 185, 129, 0.5)' : undefined
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px',
                fontSize: '12px',
                color: isWordCountSufficient ? '#34d399' : 'var(--lx-muted)'
              }}>
                <span>
                  Word Count: <strong>{wordCount}</strong> / {dayData.writingChallenge.minimumWords} words minimum
                </span>
                <span>{currentDraft ? '✓ Draft saved to local browser' : 'Type to auto-save'}</span>
              </div>
            </div>

            {/* Model Answer Toggle */}
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: '1px solid var(--lx-border)',
                  color: 'var(--lx-accent)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {showModelAnswer ? <EyeOff size={15} /> : <Eye size={15} />}
                {showModelAnswer ? 'Hide Teacher Model Paragraph' : 'View Teacher Model Paragraph (ব্যান্ড ৮+ নমুনা)'}
              </button>

              {showModelAnswer && (
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  lineHeight: 1.65,
                  fontSize: '13.5px',
                  color: 'var(--lx-text)'
                }}>
                  <strong style={{ display: 'block', color: 'var(--lx-accent)', marginBottom: '6px' }}>
                    Teacher Model Answer:
                  </strong>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>
                    "{dayData.writingChallenge.modelAnswer}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION C: DAY 0{currentDayNum} COMPLETION SUMMARY & ADVANCE */}
          <div className="ielts-card" style={{
            background: isDayCompleted
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: isDayCompleted ? '1.5px solid #10b981' : '1.5px solid rgba(59, 130, 246, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <span className="lx-pill" style={{
                  background: isDayCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  borderColor: isDayCompleted ? '#34d399' : '#3b82f6',
                  color: isDayCompleted ? '#34d399' : '#60a5fa'
                }}>
                  {isDayCompleted ? '✓ DAY COMPLETED' : 'FINAL STEP · COMPLETE TODAY\'S LESSON'}
                </span>
                <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', margin: '8px 0 4px', fontWeight: 800, color: '#ffffff' }}>
                  {isDayCompleted ? `🎉 Day 0${currentDayNum} সফলভাবে সম্পন্ন হয়েছে!` : `Day 0${currentDayNum} এর অগ্রগতি ও সমাপ্তি`}
                </h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)' }}>
                  নিচের ৩টি কাজ শেষ হলেই আপনার আজকের ক্লাসটি পাস হিসেবে গণ্য হবে এবং পরবর্তী দিনটি আনলক হয়ে যাবে।
                </p>
              </div>

              {isDayCompleted && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontWeight: 750,
                  fontSize: '12.5px'
                }}>
                  <CheckCircle2 size={16} /> পাস (স্কোর: {progress.scores?.[`day_${currentDayNum}`] || 85}%)
                </div>
              )}
            </div>

            {/* 3 Milestones Checklist */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <CheckCircle2 size={18} color="#34d399" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>১. গ্রামার অধ্যায়ন</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>নিয়ম ও Traps পড়া হয়েছে</div>
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: isQuizSubmitted && quizScore?.percentage >= 60
                  ? '1px solid #10b981'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {isQuizSubmitted && quizScore?.percentage >= 60 ? (
                  <CheckCircle2 size={18} color="#34d399" />
                ) : (
                  <Clock size={18} color="#f59e0b" />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>২. প্র্যাকটিস কুইজ</div>
                  <div style={{ fontSize: '11px', color: isQuizSubmitted ? (quizScore?.percentage >= 60 ? '#34d399' : '#f87171') : '#94a3b8' }}>
                    {isQuizSubmitted ? `স্কোর: ${quizScore?.correct}/${quizScore?.total} (${quizScore?.percentage}%)` : 'কুইজ সম্পন্ন করুন (Min ৬০%)'}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: isWordCountSufficient
                  ? '1px solid #10b981'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {isWordCountSufficient ? (
                  <CheckCircle2 size={18} color="#34d399" />
                ) : (
                  <Clock size={18} color="#f59e0b" />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>৩. রাইটিং প্র্যাকটিস</div>
                  <div style={{ fontSize: '11px', color: isWordCountSufficient ? '#34d399' : '#94a3b8' }}>
                    {wordCount} / {dayData.writingChallenge.minimumWords} শব্দ লেখা হয়েছে
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Action Button & Navigation */}
            <div className="ielts-completion-actions">
              <button
                onClick={handleCompleteDay}
                className="ielts-submit-btn"
                style={{
                  background: isDayCompleted
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderColor: '#34d399',
                  color: '#ffffff',
                  fontSize: '14.5px',
                  padding: '12px 24px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle2 size={18} />
                {isDayCompleted ? `Day 0${currentDayNum} সম্পন্ন হয়েছে ✓ (পুনরায় সংরক্ষণ)` : `🎉 আজকের ক্লাস সম্পূর্ণ করুন (Complete Day 0${currentDayNum})`}
              </button>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {currentDayNum < 7 && (
                  <Link
                    to={`/learn/ielts-writing/${currentDayNum + 1}`}
                    className="lx-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 18px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: 650,
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '13.5px'
                    }}
                  >
                    Day 0{currentDayNum + 1} তে যান <ArrowRight size={16} />
                  </Link>
                )}

                {currentDayNum === 7 && (
                  <Link
                    to="/learn/ielts-writing/8"
                    className="ielts-submit-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 22px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: 750,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderColor: '#fbbf24',
                      color: '#ffffff',
                      fontSize: '13.5px'
                    }}
                  >
                    <Trophy size={16} /> Day 08 Mastery Exam এ যান <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    )}
  </div>
);
}

export default IeltsWritingCoursePage;


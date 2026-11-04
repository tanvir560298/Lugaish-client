import React, { useState, useEffect, useMemo } from 'react';
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
  HelpCircle as QuestionIcon
} from 'lucide-react';
import {
  IELTS_WRITING_WEEK_1_INFO,
  IELTS_WRITING_WEEK_1_DAYS
} from '../data/ieltsWritingWeek1Data.js';
import './learn.css';
import './ielts-writing.css';

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
  const { day: rawDay = '1' } = useParams();
  const navigate = useNavigate();
  const currentDayNum = Math.max(1, Math.min(7, parseInt(rawDay, 10) || 1));

  // 3-Step linear progression: 'study' | 'quiz' | 'words_writing'
  const [activeStep, setActiveStep] = useState('study');

  const [progress, setProgress] = useState(getStoredProgress);
  const [drafts, setDrafts] = useState(getStoredDrafts);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [savedNotification, setSavedNotification] = useState('');

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

  const toggleDayComplete = () => {
    const isCompleted = progress.completedDays.includes(currentDayNum);
    const newCompleted = isCompleted
      ? progress.completedDays.filter(d => d !== currentDayNum)
      : [...progress.completedDays, currentDayNum];

    const updated = { ...progress, completedDays: newCompleted };
    setProgress(updated);
    saveStoredProgress(updated);

    if (!isCompleted && currentDayNum < 7) {
      setSavedNotification(`🎉 Day ${currentDayNum} completed! Advancing to Day ${currentDayNum + 1}...`);
      setTimeout(() => {
        setSavedNotification('');
        navigate(`/learn/ielts-writing/${currentDayNum + 1}`);
      }, 1500);
    } else {
      setSavedNotification(isCompleted ? 'Marked as incomplete' : '🎉 Day completed!');
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

    dayData.practiceProblems.forEach((problem) => {
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
      total: dayData.practiceProblems.length,
      percentage: Math.round((correctCount / dayData.practiceProblems.length) * 100)
    };

    setQuizResults(results);
    setQuizScore(scoreData);
    setIsQuizSubmitted(true);

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
  const answeredCount = dayData.practiceProblems.filter(p => {
    if (p.type === 'mcq') return selectedOptions[p.id] !== undefined;
    return !!(typedAnswers[p.id] || '').trim();
  }).length;
  const totalQuestions = dayData.practiceProblems.length;

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
      <header style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1.5px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '20px',
        padding: '28px clamp(20px, 3vw, 36px)',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="lx-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                60-DAY IELTS WRITING CHALLENGE · WEEK 1
              </span>
              <span style={{ fontSize: '12px', color: 'var(--lx-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {dayData.timeMinutes} Minutes Daily
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', margin: '4px 0 8px', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Day 0{dayData.day}: {dayData.title}
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: 'var(--lx-muted)', maxWidth: '720px' }}>
              {dayData.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 750,
              background: isDayCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.12)',
              color: isDayCompleted ? '#34d399' : '#60a5fa',
              border: isDayCompleted ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              {isDayCompleted ? <CheckCircle2 size={15} /> : <Clock size={14} />}
              {isDayCompleted ? 'Day Completed' : 'In Progress'}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--lx-muted)' }}>
              Week 1: {progress.completedDays.length} of 7 Days Completed
            </span>
          </div>
        </div>

        {savedNotification && (
          <div style={{
            marginTop: '16px',
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34d399',
            fontSize: '13px',
            fontWeight: 600
          }}>
            {savedNotification}
          </div>
        )}
      </header>

      {/* 7-Day Quick Switcher Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
        gap: '8px',
        marginBottom: '26px'
      }}>
        {IELTS_WRITING_WEEK_1_DAYS.map((d) => {
          const isSelected = d.day === currentDayNum;
          const isDone = progress.completedDays.includes(d.day);
          return (
            <Link
              key={d.day}
              to={`/learn/ielts-writing/${d.day}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 12px',
                borderRadius: '12px',
                background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'var(--lx-panel, rgba(15, 23, 42, 0.6))',
                border: isSelected ? '1.5px solid #3b82f6' : '1px solid var(--lx-border, rgba(255, 255, 255, 0.08))',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.18s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? '#60a5fa' : 'var(--lx-muted)' }}>
                  DAY 0{d.day}
                </span>
                {isDone && <Check size={13} color="#34d399" />}
              </div>
              <strong style={{ fontSize: '12px', lineHeight: 1.3, fontWeight: isSelected ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.title}
              </strong>
            </Link>
          );
        })}
      </div>

      {/* 3-STEP PROGRESSIVE STEPPER (Streamlined & Clutter-Free) */}
      <div className="ielts-stepper-container" role="tablist" aria-label="Course Steps">
        <button
          className={`ielts-step-item ${activeStep === 'study' ? 'is-active' : ''}`}
          onClick={() => setActiveStep('study')}
          role="tab"
          aria-selected={activeStep === 'study'}
        >
          <div className="ielts-step-badge">1</div>
          <div className="ielts-step-content">
            <strong>1. Study Lesson (পড়ুন)</strong>
            <small>Grammar Theory, Rules & Pitfalls</small>
          </div>
        </button>

        <button
          className={`ielts-step-item ${activeStep === 'quiz' ? 'is-active' : ''}`}
          onClick={() => setActiveStep('quiz')}
          role="tab"
          aria-selected={activeStep === 'quiz'}
        >
          <div className="ielts-step-badge">2</div>
          <div className="ielts-step-content">
            <strong>2. Practice Quiz (পরীক্ষা)</strong>
            <small>
              {isQuizSubmitted
                ? `Score: ${quizScore?.correct}/${totalQuestions} (${quizScore?.percentage}%)`
                : `${totalQuestions} Questions · Submit All`}
            </small>
          </div>
        </button>

        <button
          className={`ielts-step-item ${activeStep === 'words_writing' ? 'is-active' : ''}`}
          onClick={() => setActiveStep('words_writing')}
          role="tab"
          aria-selected={activeStep === 'words_writing'}
        >
          <div className="ielts-step-badge">3</div>
          <div className="ielts-step-content">
            <strong>3. 3 New Words & Writing</strong>
            <small>Vocabulary Builder & Challenge</small>
          </div>
        </button>
      </div>

      {/* =========================================================================
          STEP 1: STUDY LESSON (GRAMMAR THEORY, FORMULAS, EXAMPLES & TRAPS)
          ========================================================================= */}
      {activeStep === 'study' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Objectives Card */}
          <div style={{
            background: 'var(--lx-panel, #0f172a)',
            border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 700 }}>
              <CheckCircle2 size={18} /> Today's Learning Outcomes (আজকের ক্লাসে যা শিখবেন)
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--lx-text, #f1f5f9)' }}>
              {dayData.outcomes.map((item, idx) => (
                <li key={idx} style={{ lineHeight: 1.6 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* In-depth Grammar Theory Discussion */}
          <div style={{
            background: 'var(--lx-panel, #0f172a)',
            border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            padding: '28px',
            lineHeight: 1.8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="lx-pill" style={{ background: 'rgba(234, 179, 8, 0.12)', borderColor: 'rgba(234, 179, 8, 0.35)', color: '#facc15' }}>
                DEEP GRAMMAR FOUNDATION
              </span>
              <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 750, color: '#ffffff' }}>
                সহজ ভাষায় ব্যাকরণ ও বাক্য গঠনের নিয়ম
              </h2>
            </div>

            <div style={{ whiteSpace: 'pre-line', fontSize: '15px', color: 'var(--lx-text, #e2e8f0)' }}>
              {dayData.grammarTheory.banglaExplanation.trim()}
            </div>

            {/* Core Sentence Formulas */}
            <div style={{ marginTop: '28px' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} /> মূল বাক্য কাঠামো ও ফর্মুলা (Sentence Formulas)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {dayData.grammarTheory.formulas.map((f, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.25)'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.name}
                    </span>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13.5px', color: '#67e8f9', margin: '8px 0 6px', fontWeight: 700 }}>
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
              marginTop: '24px',
              padding: '18px 20px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '14px', color: '#fbbf24', display: 'block', marginBottom: '4px' }}>
                  IELTS Writing Band 7+ Connection:
                </strong>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-text, #f1f5f9)', lineHeight: 1.6 }}>
                  {dayData.grammarTheory.ieltsImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Model Worked Examples */}
          <div style={{
            background: 'var(--lx-panel, #0f172a)',
            border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            padding: '26px'
          }}>
            <h3 style={{ fontSize: '19px', margin: '0 0 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
              <CheckCircle2 size={18} /> Model Worked Examples (বিশ্লেষণসহ উদাহরণ)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--lx-border)', color: 'var(--lx-muted)', fontSize: '12px' }}>
                    <th style={{ padding: '12px 14px' }}>#</th>
                    <th style={{ padding: '12px 14px' }}>Parsing / Structure</th>
                    <th style={{ padding: '12px 14px' }}>Complete Sentence & Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {dayData.workedExamples.map((ex, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 700 }}>0{idx + 1}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'ui-monospace, monospace', color: '#93c5fd' }}>
                        {ex.s && <span>[S: {ex.s}] + [V: {ex.v}] {ex.o ? `+ [O: ${ex.o}]` : ''} {ex.comp ? `+ [Comp: ${ex.comp}]` : ''}</span>}
                        {ex.word && <span><strong>{ex.word}</strong> ({ex.pos})</span>}
                        {ex.noun && <span>{ex.noun} ({ex.note})</span>}
                        {ex.sub && <span>[Sub: {ex.sub}] + [V: {ex.v}]</span>}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--lx-text)' }}>
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
          <div style={{
            background: 'var(--lx-panel, #0f172a)',
            border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            padding: '26px'
          }}>
            <h3 style={{ fontSize: '19px', margin: '0 0 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
              <AlertCircle size={18} /> Common Traps vs Correct Academic English (সাধারণ ভুল ও সমাধান)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {dayData.commonTraps.map((trap, idx) => (
                <div key={idx} style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}>
                  <div style={{ color: '#ef4444', fontSize: '13px', textDecoration: 'line-through', marginBottom: '6px' }}>
                    ❌ {trap.incorrect}
                  </div>
                  <div style={{ color: '#10b981', fontSize: '14.5px', fontWeight: 750, marginBottom: '8px' }}>
                    ✅ {trap.correct}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--lx-muted)', lineHeight: 1.5 }}>
                    <strong>ব্যাখ্যা / লজিক:</strong> {trap.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call to Action to Quiz */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={() => {
                setActiveStep('quiz');
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
              className="ielts-submit-btn"
            >
              Ready for Exam Time? Start Practice Quiz ({totalQuestions} Questions) <ArrowRight size={16} />
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
            <div style={{
              background: quizScore.percentage >= 70
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: quizScore.percentage >= 70 ? '1.5px solid #10b981' : '1.5px solid #ef4444',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: quizScore.percentage >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `2px solid ${quizScore.percentage >= 70 ? '#34d399' : '#f87171'}`,
                  fontSize: '22px',
                  fontWeight: 800,
                  color: quizScore.percentage >= 70 ? '#34d399' : '#f87171'
                }}>
                  {quizScore.percentage}%
                </div>
                <div>
                  <h4 style={{ fontSize: '20px', margin: '0 0 4px', fontWeight: 800, color: '#ffffff' }}>
                    {quizScore.percentage >= 90
                      ? '🌟 Outstanding! Band 7.5+ Grammatical Control!'
                      : quizScore.percentage >= 70
                        ? '👏 Well Done! Solid Foundation!'
                        : '💡 Good Effort! Review the explanations below.'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--lx-muted)' }}>
                    You scored <strong>{quizScore.correct}</strong> out of <strong>{quizScore.total}</strong> correct.
                    নিচে প্রতিটি ভুলের বিস্তারিত ব্যাখ্যা দেখে নাও!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveStep('words_writing');
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                }}
                className="ielts-submit-btn"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderColor: '#34d399' }}
              >
                Proceed to 3 New Words & Writing <ArrowRight size={16} />
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
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: isAnswered
                            ? (isCorrect ? '1.5px solid #10b981' : '1.5px solid #ef4444')
                            : '1px solid var(--lx-border, rgba(255, 255, 255, 0.15))',
                          color: '#ffffff',
                          fontSize: '14.5px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={() => {
                  setActiveStep('study');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="lx-secondary"
                style={{ cursor: 'pointer' }}
              >
                <ArrowLeft size={16} /> Review Lesson Theory
              </button>

              <button
                onClick={() => {
                  setActiveStep('words_writing');
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                }}
                className="ielts-submit-btn"
              >
                Next Step: Learn 3 New Words & Write <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 3: 3 NEW WORDS & WRITING CHALLENGE
          ========================================================================= */}
      {activeStep === 'words_writing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* SECTION A: DAILY 3 NEW WORDS (VOCABULARY BUILDER: COMMON -> HARDER) */}
          <div style={{
            background: 'var(--lx-panel, #0f172a)',
            border: '1.5px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="lx-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8', color: '#38bdf8' }}>
                <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
                DAILY VOCABULARY ACCELERATOR
              </span>
              <span style={{ fontSize: '12px', color: 'var(--lx-muted)' }}>
                Common ➔ Academic Band 7+
              </span>
            </div>

            <h3 style={{ fontSize: '22px', margin: '4px 0 8px', fontWeight: 800, color: '#ffffff' }}>
              🌟 Now Let's Learn 3 New Words (আজকের ৩টি প্রয়োজনীয় শব্দ)
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--lx-muted)', maxWidth: '780px' }}>
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
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: isChecked
                              ? (isCorrect ? '1.5px solid #10b981' : '1.5px solid #ef4444')
                              : '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            fontSize: '13px',
                            outline: 'none'
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
          <div style={{
            background: 'var(--lx-panel, #0f172a)',
            border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span className="lx-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                DAILY WRITING PRODUCTION
              </span>
              <h3 style={{ fontSize: '20px', margin: 0, fontWeight: 750, color: '#ffffff' }}>
                Independent Writing Task
              </h3>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              marginBottom: '20px',
              fontSize: '15px',
              color: 'var(--lx-text)',
              lineHeight: 1.6
            }}>
              <strong>Task Prompt:</strong> {dayData.writingChallenge.prompt}
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontSize: '13px', color: 'var(--lx-muted)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Writing Checklist (লেখার শর্তাবলী):
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--lx-muted)' }}>
                {dayData.writingChallenge.checklist.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Live Textarea */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <textarea
                value={currentDraft}
                onChange={handleDraftChange}
                placeholder="Start typing your sentences or paragraph here. Your progress is saved automatically..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: isWordCountSufficient ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--lx-border)',
                  color: '#ffffff',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
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
            <div style={{ marginTop: '20px' }}>
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
                  marginTop: '14px',
                  padding: '18px 20px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  lineHeight: 1.7,
                  fontSize: '14px',
                  color: 'var(--lx-text)'
                }}>
                  <strong style={{ display: 'block', color: 'var(--lx-accent)', marginBottom: '8px' }}>
                    Teacher Model Answer:
                  </strong>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>
                    "{dayData.writingChallenge.modelAnswer}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION C: HOMEWORK & FINISH DAY */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div>
              <h4 style={{ fontSize: '18px', margin: '0 0 6px', fontWeight: 750, color: '#ffffff' }}>
                {isDayCompleted ? `Day 0${currentDayNum} is Complete!` : `Finished Day 0${currentDayNum}?`}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--lx-muted)' }}>
                Mark your attendance and unlock Day {Math.min(7, currentDayNum + 1)} in the 60-Day Challenge.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={toggleDayComplete}
                className="ielts-submit-btn"
                style={{
                  background: isDayCompleted ? 'rgba(16, 185, 129, 0.2)' : undefined,
                  color: isDayCompleted ? '#34d399' : '#ffffff',
                  borderColor: isDayCompleted ? '#34d399' : undefined
                }}
              >
                <CheckCircle2 size={16} />
                {isDayCompleted ? 'Completed ✓' : `Mark Day 0${currentDayNum} Done`}
              </button>

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
                    fontWeight: 650
                  }}
                >
                  Go to Day 0{currentDayNum + 1} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

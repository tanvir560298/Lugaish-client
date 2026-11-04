// src/learn/IeltsWeeklyExam.jsx
// Weekly Mastery Exam Component for 60-Day IELTS Writing Challenge
// Fully Responsive, Distraction-Free, Accessible, and Reusable

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Check,
  X,
  Eye,
  HelpCircle,
  FileText,
  Pause,
  Play
} from 'lucide-react';
import {
  WEEK_1_EXAM_DATA,
  DEFAULT_EXAM_SETTINGS,
  analyzeWritingResponse
} from '../data/ieltsWeeklyExamData.js';
import './ielts-exam.css';

const DRAFT_KEY = 'lugaish_ielts_exam_draft_week_1';
const ATTEMPTS_KEY = 'lugaish_ielts_exam_attempts_week_1';

export function IeltsWeeklyExam({
  examData = WEEK_1_EXAM_DATA,
  progress = { completedDays: [], scores: {} },
  onExamComplete
}) {
  const [examState, setExamState] = useState('intro'); // 'intro' | 'exam' | 'results'
  const [activeSection, setActiveSection] = useState('sectionA');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewDetails, setShowReviewDetails] = useState(true);

  // Timer State
  const initialSeconds = (examData.timeMinutes || 40) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Student Answers
  const [answersA, setAnswersA] = useState({}); // { [qId]: optionIndex }
  const [answersB, setAnswersB] = useState({}); // { [qId]: typedString }
  const [answersC, setAnswersC] = useState({}); // { [qId]: correctedSentence }
  const [answersD, setAnswersD] = useState({}); // { [qId]: sentence }
  const [answersE, setAnswersE] = useState(''); // paragraph text

  // Submission Results State
  const [finalResult, setFinalResult] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Load Saved Draft if exists
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        if (draft.answersA) setAnswersA(draft.answersA);
        if (draft.answersB) setAnswersB(draft.answersB);
        if (draft.answersC) setAnswersC(draft.answersC);
        if (draft.answersD) setAnswersD(draft.answersD);
        if (draft.answersE) setAnswersE(draft.answersE);
        if (draft.secondsRemaining && draft.secondsRemaining > 0) {
          setSecondsRemaining(draft.secondsRemaining);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Autosave Draft
  useEffect(() => {
    if (examState === 'exam') {
      try {
        const draft = {
          answersA,
          answersB,
          answersC,
          answersD,
          answersE,
          secondsRemaining,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }
  }, [examState, answersA, answersB, answersC, answersD, answersE, secondsRemaining]);

  // Timer Countdown Effect
  useEffect(() => {
    if (examState !== 'exam' || isTimerPaused) return;

    if (secondsRemaining <= 0) {
      // Auto-submit when time expires
      handleSubmitExam();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [examState, isTimerPaused, secondsRemaining]);

  // Format Timer Display
  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [secondsRemaining]);

  // Questions Count & Answered Progress Calculation
  const totalQuestionsCount = 10 + 10 + 5 + 5 + 1; // 31 items
  const answeredCount = useMemo(() => {
    let count = 0;
    // Section A
    count += Object.keys(answersA).filter(k => answersA[k] !== undefined).length;
    // Section B
    count += Object.keys(answersB).filter(k => answersB[k] && answersB[k].trim()).length;
    // Section C
    count += Object.keys(answersC).filter(k => answersC[k] && answersC[k].trim()).length;
    // Section D
    count += Object.keys(answersD).filter(k => answersD[k] && answersD[k].trim()).length;
    // Section E
    if (answersE && answersE.trim().length > 20) count += 1;
    return count;
  }, [answersA, answersB, answersC, answersD, answersE]);

  // Section E Live Vocabulary Tracker
  const paragraphAnalysis = useMemo(() => {
    return analyzeWritingResponse(answersE, examData.sections.sectionE.task.targetVocabularyPool);
  }, [answersE, examData.sections.sectionE.task.targetVocabularyPool]);

  // Start Exam
  const handleStartExam = () => {
    setExamState('exam');
    setActiveSection('sectionA');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit & Grade Exam
  const handleSubmitExam = useCallback(() => {
    setShowSubmitModal(false);

    // 1. Grade Section A (MCQs) — 10 Marks
    let scoreA = 0;
    const reviewA = examData.sections.sectionA.questions.map(q => {
      const userSelected = answersA[q.id];
      const isCorrect = userSelected === q.correctIndex;
      if (isCorrect) scoreA += 1;
      return {
        ...q,
        userSelected,
        isCorrect
      };
    });

    // 2. Grade Section B (Fill Blanks) — 10 Marks
    let scoreB = 0;
    const reviewB = examData.sections.sectionB.questions.map(q => {
      const userTyped = (answersB[q.id] || '').trim().toLowerCase();
      const isCorrect = q.acceptedAnswers.some(acc => acc.toLowerCase() === userTyped);
      if (isCorrect) scoreB += 1;
      return {
        ...q,
        userTyped,
        isCorrect
      };
    });

    // 3. Grade Section C (Grammar Correction) — 10 Marks (2 marks each)
    let scoreC = 0;
    const reviewC = examData.sections.sectionC.questions.map(q => {
      const userTyped = (answersC[q.id] || '').trim().toLowerCase();
      // Intelligent key phrase matching
      const hasKeyWord = q.acceptedKeywords.some(kw => userTyped.includes(kw.toLowerCase()));
      // Not identical to the original incorrect sentence
      const notOriginal = userTyped !== q.incorrectSentence.toLowerCase();
      const isCorrect = hasKeyWord && notOriginal && userTyped.length > 15;
      if (isCorrect) scoreC += 2;
      return {
        ...q,
        userTyped,
        isCorrect,
        earnedMarks: isCorrect ? 2 : 0
      };
    });

    // Confirmed Objective Score (Out of 30)
    const confirmedObjectiveScore = scoreA + scoreB + scoreC;

    // 4. Section D Provisional Evaluation (Sentence Writing) — 10 Marks (2 marks each)
    let provisionalScoreD = 0;
    const reviewD = examData.sections.sectionD.questions.map(q => {
      const text = (answersD[q.id] || '').trim();
      const words = text.split(/\s+/).filter(Boolean);
      const targetRegex = new RegExp(`\\b${q.targetWord.toLowerCase()}(s|es|d|ed|ing)?\\b`, 'i');
      const hasTarget = targetRegex.test(text.toLowerCase());
      const hasLength = words.length >= (q.minimumWords || 7);

      let marks = 0;
      if (hasTarget && hasLength) {
        marks = 2;
      } else if (hasTarget || hasLength) {
        marks = 1;
      }
      provisionalScoreD += marks;

      return {
        ...q,
        text,
        wordCount: words.length,
        hasTarget,
        provisionalMarks: marks
      };
    });

    // 5. Section E Provisional Evaluation (Paragraph Writing) — 10 Marks
    const paragraphWords = answersE.trim().split(/\s+/).filter(Boolean).length;
    const targetWordsUsed = paragraphAnalysis.foundWords;
    let provisionalScoreE = 0;

    // Word count check (70-100 target) -> up to 2 marks
    if (paragraphWords >= 65 && paragraphWords <= 125) {
      provisionalScoreE += 2;
    } else if (paragraphWords >= 40) {
      provisionalScoreE += 1;
    }

    // Target Vocabulary usage (>= 5 words) -> up to 4 marks
    if (targetWordsUsed.length >= 5) {
      provisionalScoreE += 4;
    } else if (targetWordsUsed.length >= 3) {
      provisionalScoreE += 3;
    } else if (targetWordsUsed.length >= 1) {
      provisionalScoreE += 1;
    }

    // Baseline coherence & grammar structure check -> up to 4 marks
    if (paragraphWords >= 60 && answersE.includes('.')) {
      provisionalScoreE += 4;
    } else if (paragraphWords >= 30) {
      provisionalScoreE += 2;
    }

    const provisionalWritingScore = provisionalScoreD + provisionalScoreE;
    const provisionalTotalScore = confirmedObjectiveScore + provisionalWritingScore;
    const passingThreshold = 35; // 70% of 50 marks
    const isPassed = provisionalTotalScore >= passingThreshold || confirmedObjectiveScore >= 21;

    const resultRecord = {
      attemptNumber: attemptHistory.length + 1,
      submittedAt: new Date().toISOString(),
      timeUsedSeconds: initialSeconds - secondsRemaining,
      scoreA,
      scoreB,
      scoreC,
      confirmedObjectiveScore,
      provisionalScoreD,
      provisionalScoreE,
      provisionalWritingScore,
      provisionalTotalScore,
      isPassed,
      reviewA,
      reviewB,
      reviewC,
      reviewD,
      reviewE: {
        text: answersE,
        wordCount: paragraphWords,
        targetWordsUsed,
        provisionalScoreE
      }
    };

    setFinalResult(resultRecord);
    setExamState('results');

    // Save Attempt History to localStorage
    const updatedHistory = [...attemptHistory, resultRecord];
    setAttemptHistory(updatedHistory);
    try {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updatedHistory));
      localStorage.removeItem(DRAFT_KEY); // Clear draft
    } catch {
      // ignore
    }

    // Notify Parent Course Page
    if (onExamComplete) {
      onExamComplete({
        examId: examData.examId,
        score: provisionalTotalScore,
        objectiveScore: confirmedObjectiveScore,
        passed: isPassed,
        attemptNumber: updatedHistory.length
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    answersA,
    answersB,
    answersC,
    answersD,
    answersE,
    attemptHistory,
    examData,
    initialSeconds,
    onExamComplete,
    paragraphAnalysis.foundWords,
    secondsRemaining
  ]);

  // Retake Exam
  const handleRetakeExam = () => {
    setAnswersA({});
    setAnswersB({});
    setAnswersC({});
    setAnswersD({});
    setAnswersE('');
    setSecondsRemaining(initialSeconds);
    setExamState('exam');
    setActiveSection('sectionA');
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section Progress Helper for Section Tabs
  const getSectionStatusBadge = (secKey) => {
    if (secKey === 'sectionA') {
      const count = Object.keys(answersA).length;
      return `${count}/10`;
    }
    if (secKey === 'sectionB') {
      const count = Object.keys(answersB).filter(k => answersB[k] && answersB[k].trim()).length;
      return `${count}/10`;
    }
    if (secKey === 'sectionC') {
      const count = Object.keys(answersC).filter(k => answersC[k] && answersC[k].trim()).length;
      return `${count}/5`;
    }
    if (secKey === 'sectionD') {
      const count = Object.keys(answersD).filter(k => answersD[k] && answersD[k].trim()).length;
      return `${count}/5`;
    }
    if (secKey === 'sectionE') {
      return answersE && answersE.trim().length > 20 ? '1/1' : '0/1';
    }
    return '';
  };

  // =========================================================================
  // RENDER VIEW 1: EXAM INTRO & INSTRUCTIONS
  // =========================================================================
  if (examState === 'intro') {
    const isWeek1Done = progress.completedDays && [1, 2, 3, 4, 5, 6, 7].every(d => progress.completedDays.includes(d));

    return (
      <div className="ielts-exam-container" aria-labelledby="exam-intro-title">
        <div className="exam-intro-card">
          <div className="exam-intro-header">
            <div className="exam-trophy-badge">
              <Trophy size={28} />
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {examData.badge}
              </span>
              <h2 id="exam-intro-title" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, margin: '4px 0 6px', color: 'var(--lx-text)' }}>
                {examData.title}
              </h2>
              <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--lx-muted)' }}>
                {examData.subtitle}
              </p>
            </div>
          </div>

          {!isWeek1Done && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#fbbf24'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Study Recommendation:</strong> You have not yet marked all Days 1–7 as completed. While you are welcome to test your knowledge, completing Days 1–7 ensures maximum mastery of all 21 words and grammar rules.
              </div>
            </div>
          )}

          <div className="exam-intro-meta-grid">
            <div className="exam-meta-box">
              <Clock size={20} color="#38bdf8" />
              <div>
                <strong>{examData.timeMinutes} Minutes</strong>
                <small>Duration (Pausable)</small>
              </div>
            </div>
            <div className="exam-meta-box">
              <Award size={20} color="#34d399" />
              <div>
                <strong>{examData.totalMarks} Total Marks</strong>
                <small>5 Comprehensive Sections</small>
              </div>
            </div>
            <div className="exam-meta-box">
              <CheckCircle2 size={20} color="#60a5fa" />
              <div>
                <strong>70% (35 Marks)</strong>
                <small>Passing Benchmark</small>
              </div>
            </div>
            <div className="exam-meta-box">
              <BookOpen size={20} color="#c084fc" />
              <div>
                <strong>21 Words &amp; 7 Rules</strong>
                <small>Based on Days 1–7</small>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 750, margin: '24px 0 12px', color: 'var(--lx-text)' }}>
            Exam Structure &amp; Marks Distribution
          </h3>
          <table className="exam-sections-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Focus Area</th>
                <th>Items</th>
                <th>Marks</th>
                <th>Suggested Time</th>
              </tr>
            </thead>
            <tbody>
              {examData.instructions.sectionsSummary.map((s, idx) => (
                <tr key={idx}>
                  <td><strong>{s.name.split(':')[0]}</strong></td>
                  <td>{s.name.split(':')[1]}</td>
                  <td>{s.questions} Questions</td>
                  <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>{s.marks} Marks</span></td>
                  <td>{s.timeEstimate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.06))',
            borderRadius: '12px',
            padding: '16px 20px',
            margin: '24px 0'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', color: 'var(--lx-text)' }}>
              Candidate Guidelines &amp; Academic Integrity
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.7, color: 'var(--lx-muted)' }}>
              {examData.instructions.rules.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          {attemptHistory.length > 0 && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              fontSize: '13px',
              color: 'var(--lx-text)'
            }}>
              <strong>Previous Attempts:</strong> You have completed this exam {attemptHistory.length} time(s).
              Latest score: <strong>{attemptHistory[attemptHistory.length - 1].provisionalTotalScore}/50</strong> (
              {attemptHistory[attemptHistory.length - 1].isPassed ? 'Passed ✓' : 'Needs Practice'}
              ). You may retake the exam anytime to improve your score.
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '28px' }}>
            <button
              onClick={handleStartExam}
              className="ielts-submit-btn"
              style={{ fontSize: '16px', padding: '14px 34px' }}
            >
              Start Week 1 Mastery Exam <ArrowRight size={18} />
            </button>
            <span style={{ fontSize: '12px', color: 'var(--lx-muted)' }}>
              Continuous auto-save is enabled.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER VIEW 2: ACTIVE EXAM INTERFACE
  // =========================================================================
  if (examState === 'exam') {
    return (
      <div className="ielts-exam-container" aria-label="IELTS Mastery Exam Mode">
        {/* Sticky Status Bar */}
        <div className="exam-sticky-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`exam-timer-pill ${secondsRemaining < 300 ? 'is-warning' : ''}`}>
              <Clock size={16} />
              <span>{formattedTime}</span>
              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                aria-label={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              >
                {isTimerPaused ? <Play size={13} /> : <Pause size={13} />}
              </button>
            </div>
            {isTimerPaused && (
              <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>
                (Timer Paused)
              </span>
            )}
          </div>

          <div className="exam-progress-stat">
            Answered: <strong>{answeredCount}</strong> / {totalQuestionsCount}
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="ielts-submit-btn"
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Submit Exam
          </button>
        </div>

        {/* Section Jump Tabs */}
        <div className="exam-section-tabs" role="tablist" aria-label="Exam Sections">
          <button
            className={`exam-tab-btn ${activeSection === 'sectionA' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('sectionA')}
            role="tab"
            aria-selected={activeSection === 'sectionA'}
          >
            Sec A: Vocab MCQ <span className="exam-tab-badge">{getSectionStatusBadge('sectionA')}</span>
          </button>
          <button
            className={`exam-tab-btn ${activeSection === 'sectionB' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('sectionB')}
            role="tab"
            aria-selected={activeSection === 'sectionB'}
          >
            Sec B: Blanks <span className="exam-tab-badge">{getSectionStatusBadge('sectionB')}</span>
          </button>
          <button
            className={`exam-tab-btn ${activeSection === 'sectionC' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('sectionC')}
            role="tab"
            aria-selected={activeSection === 'sectionC'}
          >
            Sec C: Grammar <span className="exam-tab-badge">{getSectionStatusBadge('sectionC')}</span>
          </button>
          <button
            className={`exam-tab-btn ${activeSection === 'sectionD' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('sectionD')}
            role="tab"
            aria-selected={activeSection === 'sectionD'}
          >
            Sec D: Sentences <span className="exam-tab-badge">{getSectionStatusBadge('sectionD')}</span>
          </button>
          <button
            className={`exam-tab-btn ${activeSection === 'sectionE' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('sectionE')}
            role="tab"
            aria-selected={activeSection === 'sectionE'}
          >
            Sec E: Paragraph <span className="exam-tab-badge">{getSectionStatusBadge('sectionE')}</span>
          </button>
        </div>

        {/* SECTION A: VOCABULARY MCQ (10 Questions, 10 Marks) */}
        {activeSection === 'sectionA' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', color: 'var(--lx-text)' }}>
                {examData.sections.sectionA.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)' }}>
                {examData.sections.sectionA.instructions}
              </p>
            </div>

            {examData.sections.sectionA.questions.map((q, idx) => (
              <div key={q.id} className="exam-question-card">
                <div className="exam-question-header">
                  <span className="exam-question-kicker">Question 0{idx + 1} · Day {q.daySource} Target</span>
                  <span className="exam-question-points">1 Mark</span>
                </div>
                <p className="exam-question-text">{q.question}</p>
                <div className="exam-options-grid">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answersA[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        className={`exam-option-btn ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setAnswersA({ ...answersA, [q.id]: optIdx })}
                      >
                        <span className="exam-option-letter">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                className="ielts-submit-btn"
                onClick={() => { setActiveSection('sectionB'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
              >
                Next Section: Fill in the Blanks <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: FILL IN THE BLANKS (10 Questions, 10 Marks) */}
        {activeSection === 'sectionB' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', color: 'var(--lx-text)' }}>
                {examData.sections.sectionB.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)' }}>
                {examData.sections.sectionB.instructions}
              </p>
            </div>

            {examData.sections.sectionB.questions.map((q, idx) => (
              <div key={q.id} className="exam-question-card">
                <div className="exam-question-header">
                  <span className="exam-question-kicker">Question {idx < 9 ? `0${idx + 1}` : idx + 1} · Day {q.daySource} Target</span>
                  <span className="exam-question-points">1 Mark</span>
                </div>
                <p className="exam-question-text">{q.sentence}</p>
                <div style={{ maxWidth: '420px', marginTop: '10px' }}>
                  <input
                    type="text"
                    className="exam-text-input"
                    placeholder="Type your answer here..."
                    value={answersB[q.id] || ''}
                    onChange={(e) => setAnswersB({ ...answersB, [q.id]: e.target.value })}
                  />
                  {q.hint && (
                    <small style={{ display: 'block', marginTop: '6px', fontSize: '11px', color: 'var(--lx-muted)', fontStyle: 'italic' }}>
                      💡 Hint: {q.hint}
                    </small>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                className="lx-secondary"
                onClick={() => { setActiveSection('sectionA'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                style={{ padding: '10px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} /> Back to Section A
              </button>
              <button
                className="ielts-submit-btn"
                onClick={() => { setActiveSection('sectionC'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
              >
                Next Section: Grammar Correction <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION C: GRAMMAR CORRECTION (5 Questions, 10 Marks - 2 marks each) */}
        {activeSection === 'sectionC' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', color: 'var(--lx-text)' }}>
                {examData.sections.sectionC.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)' }}>
                {examData.sections.sectionC.instructions}
              </p>
            </div>

            {examData.sections.sectionC.questions.map((q, idx) => (
              <div key={q.id} className="exam-question-card">
                <div className="exam-question-header">
                  <span className="exam-question-kicker">Grammar Challenge 0{idx + 1} · {q.topic}</span>
                  <span className="exam-question-points">2 Marks</span>
                </div>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '12px',
                  color: '#f87171',
                  fontSize: '14px',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  ❌ Incorrect: "{q.incorrectSentence}"
                </div>
                <p style={{ fontSize: '13px', margin: '0 0 10px', color: 'var(--lx-muted)' }}>
                  {q.prompt}
                </p>
                <input
                  type="text"
                  className="exam-text-input"
                  placeholder="Type the corrected sentence..."
                  value={answersC[q.id] || ''}
                  onChange={(e) => setAnswersC({ ...answersC, [q.id]: e.target.value })}
                />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                className="lx-secondary"
                onClick={() => { setActiveSection('sectionB'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                style={{ padding: '10px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} /> Back to Section B
              </button>
              <button
                className="ielts-submit-btn"
                onClick={() => { setActiveSection('sectionD'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
              >
                Next Section: Sentence Writing <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION D: SENTENCE WRITING (5 Questions, 10 Marks - 2 marks each) */}
        {activeSection === 'sectionD' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', color: 'var(--lx-text)' }}>
                {examData.sections.sectionD.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)' }}>
                {examData.sections.sectionD.instructions}
              </p>
            </div>

            {examData.sections.sectionD.questions.map((q, idx) => {
              const currentSentence = answersD[q.id] || '';
              const words = currentSentence.trim().split(/\s+/).filter(Boolean);
              const targetRegex = new RegExp(`\\b${q.targetWord.toLowerCase()}(s|es|d|ed|ing)?\\b`, 'i');
              const hasTarget = targetRegex.test(currentSentence.toLowerCase());

              return (
                <div key={q.id} className="exam-question-card">
                  <div className="exam-question-header">
                    <span className="exam-question-kicker">
                      Sentence 0{idx + 1} · Target Word: <strong style={{ color: '#38bdf8' }}>{q.targetWord}</strong> ({q.pos})
                    </span>
                    <span className="exam-question-points">2 Marks</span>
                  </div>
                  <p className="exam-question-text">{q.prompt}</p>
                  <input
                    type="text"
                    className="exam-text-input"
                    placeholder={`Write an academic sentence incorporating "${q.targetWord}"...`}
                    value={currentSentence}
                    onChange={(e) => setAnswersD({ ...answersD, [q.id]: e.target.value })}
                  />
                  <div className="exam-word-counter">
                    <span>
                      Words: <strong>{words.length}</strong> (Minimum {q.minimumWords || 7})
                    </span>
                    <span>
                      Target Word Status:{' '}
                      <strong style={{ color: hasTarget ? '#34d399' : '#f87171' }}>
                        {hasTarget ? 'Detected ✓' : 'Not Detected'}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                className="lx-secondary"
                onClick={() => { setActiveSection('sectionC'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                style={{ padding: '10px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} /> Back to Section C
              </button>
              <button
                className="ielts-submit-btn"
                onClick={() => { setActiveSection('sectionE'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
              >
                Next Section: Paragraph Writing <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION E: PARAGRAPH WRITING (1 Task, 10 Marks) */}
        {activeSection === 'sectionE' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', color: 'var(--lx-text)' }}>
                {examData.sections.sectionE.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--lx-muted)' }}>
                {examData.sections.sectionE.instructions}
              </p>
            </div>

            <div className="exam-question-card">
              <div className="exam-question-header">
                <span className="exam-question-kicker">Capstone Task · 70–100 Words Target</span>
                <span className="exam-question-points">10 Marks</span>
              </div>
              <h4 style={{ fontSize: '17px', margin: '0 0 8px', color: 'var(--lx-text)', fontWeight: 750 }}>
                "{examData.sections.sectionE.task.topic}"
              </h4>
              <p style={{ fontSize: '13px', margin: '0 0 14px', color: 'var(--lx-muted)', lineHeight: 1.6 }}>
                Requirements: Write a cohesive paragraph answering the prompt. Integrate at least <strong>five (5)</strong> vocabulary words from the pool below. When you use a word, its tag lights up green!
              </p>

              {/* Target Vocabulary Chips Cloud */}
              <div className="exam-vocab-pool" aria-label="Available vocabulary pool">
                {examData.sections.sectionE.task.targetVocabularyPool.map((w, idx) => {
                  const isUsed = paragraphAnalysis.foundWords.includes(w);
                  return (
                    <span key={idx} className={`exam-vocab-chip ${isUsed ? 'is-used' : ''}`}>
                      {w} {isUsed && '✓'}
                    </span>
                  );
                })}
              </div>

              <textarea
                className="exam-textarea"
                placeholder="Write your academic paragraph here..."
                value={answersE}
                onChange={(e) => setAnswersE(e.target.value)}
              />

              <div className="exam-word-counter">
                <span>
                  Word Count: <strong>{paragraphAnalysis.wordCount}</strong> / 70–100 target
                </span>
                <span>
                  Target Words Found:{' '}
                  <strong style={{ color: paragraphAnalysis.targetCount >= 5 ? '#34d399' : '#fbbf24' }}>
                    {paragraphAnalysis.targetCount} of 5 required
                  </strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                className="lx-secondary"
                onClick={() => { setActiveSection('sectionD'); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                style={{ padding: '10px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} /> Back to Section D
              </button>
              <button
                className="ielts-submit-btn"
                onClick={() => setShowSubmitModal(true)}
                style={{ fontSize: '15px', padding: '12px 28px' }}
              >
                Finish &amp; Submit Exam <Trophy size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showSubmitModal && (
          <div className="exam-modal-backdrop" role="dialog" aria-label="Confirm Exam Submission">
            <div className="exam-modal-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Trophy size={28} color="#fbbf24" />
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--lx-text)' }}>
                  Ready to Submit Exam?
                </h3>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--lx-muted)', margin: '0 0 16px' }}>
                You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestionsCount}</strong> items.
                {answeredCount < totalQuestionsCount && (
                  <span style={{ display: 'block', color: '#f87171', marginTop: '8px', fontWeight: 650 }}>
                    ⚠️ Note: You have {totalQuestionsCount - answeredCount} unanswered question(s). Unanswered questions will receive zero marks.
                  </span>
                )}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="lx-secondary"
                  onClick={() => setShowSubmitModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px' }}
                >
                  Return to Review
                </button>
                <button
                  type="button"
                  className="ielts-submit-btn"
                  onClick={handleSubmitExam}
                >
                  Confirm &amp; Grade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER VIEW 3: RESULTS & PEDAGOGICAL REVIEW
  // =========================================================================
  if (examState === 'results' && finalResult) {
    const {
      confirmedObjectiveScore,
      provisionalWritingScore,
      provisionalTotalScore,
      isPassed,
      scoreA,
      scoreB,
      scoreC,
      provisionalScoreD,
      provisionalScoreE,
      reviewA,
      reviewB,
      reviewC,
      reviewD,
      reviewE
    } = finalResult;

    return (
      <div className="ielts-exam-container" aria-label="Exam Results and Performance Analysis">
        {/* Banner */}
        <div className={`exam-result-banner ${isPassed ? 'is-pass' : 'is-fail'}`}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', color: isPassed ? '#34d399' : '#f87171', textTransform: 'uppercase' }}>
              {isPassed ? 'Assessment Completed · Passed' : 'Assessment Completed · Needs Practice'}
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 850, margin: '6px 0 10px', color: 'var(--lx-text)' }}>
              {isPassed ? 'Congratulations! Milestone Reached' : 'Keep Building! Further Review Advised'}
            </h2>
            <p style={{ margin: 0, fontSize: '14px', maxWidth: '520px', color: 'var(--lx-muted)', lineHeight: 1.6 }}>
              {isPassed
                ? 'You have demonstrated solid mastery of Week 1 foundational grammar and academic vocabulary. You are now well prepared to progress to Week 2.'
                : 'Review the detailed question explanations below and revisit earlier daily lessons to reinforce tricky countability or sentence structure rules before proceeding.'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="exam-score-display">
              <span className="exam-score-big" style={{ color: isPassed ? '#34d399' : '#f87171' }}>
                {provisionalTotalScore}
              </span>
              <span className="exam-score-total">/ 50</span>
            </div>
            <small style={{ display: 'block', color: 'var(--lx-muted)', marginTop: '4px', fontSize: '12px' }}>
              Passing Threshold: 35 / 50 (70%)
            </small>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="exam-scores-breakdown-grid">
          <div className="exam-breakdown-card">
            <strong>Section A: Vocab MCQ</strong>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>{scoreA} / 10</span>
            <small>Meanings &amp; Usage</small>
          </div>
          <div className="exam-breakdown-card">
            <strong>Section B: Fill in Blanks</strong>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>{scoreB} / 10</span>
            <small>Contextual Collocations</small>
          </div>
          <div className="exam-breakdown-card">
            <strong>Section C: Grammar Rules</strong>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>{scoreC} / 10</span>
            <small>Syntactic Accuracy</small>
          </div>
          <div className="exam-breakdown-card">
            <strong>Section D: Sentences (Provisional)</strong>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24' }}>{provisionalScoreD} / 10</span>
            <small>Awaiting Teacher Verification</small>
          </div>
          <div className="exam-breakdown-card">
            <strong>Section E: Paragraph (Provisional)</strong>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24' }}>{provisionalScoreE} / 10</span>
            <small>{reviewE.targetWordsUsed.length} / 5 target words used</small>
          </div>
        </div>

        {/* Objective vs Writing Transparency Notice */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--lx-border, rgba(255, 255, 255, 0.08))',
          borderRadius: '14px',
          padding: '18px 22px',
          marginBottom: '30px',
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--lx-muted)'
        }}>
          <strong style={{ color: 'var(--lx-text)' }}>Grading Transparency Note:</strong>
          {' '}Sections A, B, and C (Confirmed Objective Score: <strong>{confirmedObjectiveScore} / 30</strong>) are graded automatically against verified pedagogical answer keys. Sections D and E (Provisional Writing Score: <strong>{provisionalWritingScore} / 20</strong>) are evaluated using automated syntactic and lexical pattern analysis and are pending formal teacher review. This diagnostic exam provides a foundation benchmark and does not constitute an official IELTS test band score.
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowReviewDetails(!showReviewDetails)}
            className="lx-secondary"
            style={{ padding: '12px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={16} />
            {showReviewDetails ? 'Hide Detailed Item Review' : 'View Question-by-Question Review'}
          </button>
          <button
            onClick={handleRetakeExam}
            className="ielts-submit-btn"
            style={{ padding: '12px 24px' }}
          >
            <RotateCcw size={16} /> Retake Exam Practice
          </button>
        </div>

        {/* DETAILED QUESTION-BY-QUESTION REVIEW */}
        {showReviewDetails && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 16px', color: 'var(--lx-text)' }}>
              Comprehensive Item Explanations &amp; Feedback
            </h3>

            {/* Section A Review */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '17px', color: '#38bdf8', margin: '0 0 12px' }}>
                Section A: Vocabulary MCQ ({scoreA} / 10)
              </h4>
              {reviewA.map((q, idx) => (
                <div key={q.id} className="exam-question-card" style={{ borderColor: q.isCorrect ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)' }}>
                  <div className="exam-question-header">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      Question 0{idx + 1} {q.isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
                    </span>
                    <span className="exam-question-points">Target: {q.targetWord}</span>
                  </div>
                  <p className="exam-question-text">{q.question}</p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    Your Answer:{' '}
                    <strong style={{ color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      {q.userSelected !== undefined ? q.options[q.userSelected] : 'None (Skipped)'}
                    </strong>
                    {!q.isCorrect && (
                      <span style={{ marginLeft: '12px', color: '#34d399' }}>
                        Correct: <strong>{q.options[q.correctIndex]}</strong>
                      </span>
                    )}
                  </p>
                  <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', fontSize: '12.5px', color: 'var(--lx-muted)' }}>
                    💡 <strong>Rationale:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            {/* Section B Review */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '17px', color: '#38bdf8', margin: '0 0 12px' }}>
                Section B: Fill in the Blanks ({scoreB} / 10)
              </h4>
              {reviewB.map((q, idx) => (
                <div key={q.id} className="exam-question-card" style={{ borderColor: q.isCorrect ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)' }}>
                  <div className="exam-question-header">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      Question {idx < 9 ? `0${idx + 1}` : idx + 1} {q.isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
                    </span>
                    <span className="exam-question-points">Target: {q.targetWord}</span>
                  </div>
                  <p className="exam-question-text">{q.sentence}</p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    Your Input:{' '}
                    <strong style={{ color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      "{q.userTyped || '(Empty)'}"
                    </strong>
                    {!q.isCorrect && (
                      <span style={{ marginLeft: '12px', color: '#34d399' }}>
                        Accepted: <strong>{q.acceptedAnswers.join(' / ')}</strong>
                      </span>
                    )}
                  </p>
                  <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', fontSize: '12.5px', color: 'var(--lx-muted)' }}>
                    💡 <strong>Rule:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            {/* Section C Review */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '17px', color: '#38bdf8', margin: '0 0 12px' }}>
                Section C: Grammar Correction ({scoreC} / 10)
              </h4>
              {reviewC.map((q, idx) => (
                <div key={q.id} className="exam-question-card" style={{ borderColor: q.isCorrect ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)' }}>
                  <div className="exam-question-header">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      Challenge 0{idx + 1} · {q.topic} {q.isCorrect ? '✓ (+2 Marks)' : '✗ (0 Marks)'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#f87171' }}>
                    ❌ Original: "{q.incorrectSentence}"
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    Your Correction:{' '}
                    <strong style={{ color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      "{q.userTyped || '(None)'}"
                    </strong>
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#34d399' }}>
                    Model Correction: <strong>"{q.modelAnswer}"</strong>
                  </p>
                  <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', fontSize: '12.5px', color: 'var(--lx-muted)' }}>
                    💡 <strong>Grammatical Principle:</strong> {q.keyRule}
                  </div>
                </div>
              ))}
            </div>

            {/* Section D Review */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '17px', color: '#fbbf24', margin: '0 0 12px' }}>
                Section D: Sentence Writing (Provisional: {provisionalScoreD} / 10)
              </h4>
              {reviewD.map((q, idx) => (
                <div key={q.id} className="exam-question-card">
                  <div className="exam-question-header">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
                      Sentence 0{idx + 1} (Target: {q.targetWord}) · Provisional Score: {q.provisionalMarks}/2
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--lx-muted)' }}>
                    Prompt: {q.prompt}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px', fontStyle: 'italic', color: 'var(--lx-text)' }}>
                    "{q.text || '(Empty submission)'}"
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '12.5px', color: '#38bdf8' }}>
                    Benchmark Model: "{q.modelExample}"
                  </p>
                </div>
              ))}
            </div>

            {/* Section E Review */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '17px', color: '#fbbf24', margin: '0 0 12px' }}>
                Section E: Paragraph Writing (Provisional: {provisionalScoreE} / 10)
              </h4>
              <div className="exam-question-card">
                <div className="exam-question-header">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
                    "{examData.sections.sectionE.task.topic}"
                  </span>
                  <span className="exam-question-points">
                    {reviewE.wordCount} words · {reviewE.targetWordsUsed.length} / 5 words
                  </span>
                </div>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  margin: '10px 0'
                }}>
                  "{reviewE.text || '(No paragraph written)'}"
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--lx-muted)', margin: '10px 0' }}>
                  Target vocabulary identified in your response:{' '}
                  <strong style={{ color: '#34d399' }}>
                    {reviewE.targetWordsUsed.length > 0 ? reviewE.targetWordsUsed.join(', ') : 'None detected'}
                  </strong>
                </div>

                <div style={{
                  marginTop: '12px',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  fontSize: '13px',
                  lineHeight: 1.7
                }}>
                  <strong style={{ display: 'block', color: '#60a5fa', marginBottom: '6px' }}>
                    Teacher Model Paragraph (Band 8+ Standard):
                  </strong>
                  "{examData.sections.sectionE.task.modelAnswer}"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

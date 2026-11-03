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
  Award
} from 'lucide-react';
import {
  IELTS_WRITING_WEEK_1_INFO,
  IELTS_WRITING_WEEK_1_DAYS
} from '../data/ieltsWritingWeek1Data.js';
import './learn.css';

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
    console.error('Failed to save progress to localStorage', err);
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
    console.error('Failed to save draft to localStorage', err);
  }
}

export function IeltsWritingCoursePage() {
  const { day: rawDay = '1' } = useParams();
  const navigate = useNavigate();
  const currentDayNum = Math.max(1, Math.min(7, parseInt(rawDay, 10) || 1));

  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'traps' | 'practice' | 'writing' | 'homework'
  const [progress, setProgress] = useState(getStoredProgress);
  const [drafts, setDrafts] = useState(getStoredDrafts);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [savedNotification, setSavedNotification] = useState('');

  // Practice state for current day
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userInputs, setUserInputs] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const dayData = useMemo(() => {
    return IELTS_WRITING_WEEK_1_DAYS.find(d => d.day === currentDayNum) || IELTS_WRITING_WEEK_1_DAYS[0];
  }, [currentDayNum]);

  // Reset tab and answers when switching day
  useEffect(() => {
    setActiveTab('theory');
    setShowModelAnswer(false);
    setSelectedAnswers({});
    setUserInputs({});
    setSubmittedAnswers({});
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

  // Practice answer handling
  const handleSelectOption = (problemId, optIndex) => {
    if (submittedAnswers[problemId]) return;
    setSelectedAnswers(prev => ({ ...prev, [problemId]: optIndex }));
  };

  const handleInputChange = (problemId, value) => {
    setUserInputs(prev => ({ ...prev, [problemId]: value }));
  };

  const handleSubmitProblem = (problem) => {
    const pid = problem.id;
    let isCorrect = false;

    if (problem.type === 'mcq') {
      isCorrect = selectedAnswers[pid] === problem.correctIndex;
    } else {
      const userText = (userInputs[pid] || '').trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      const correctText = (problem.correctAnswer || '').trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      const acceptable = (problem.acceptableAnswers || []).map(a => a.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''));
      isCorrect = userText === correctText || acceptable.includes(userText);
    }

    setSubmittedAnswers(prev => ({
      ...prev,
      [pid]: {
        isSubmitted: true,
        isCorrect
      }
    }));
  };

  const handleResetPractice = () => {
    setSelectedAnswers({});
    setUserInputs({});
    setSubmittedAnswers({});
  };

  // Draft writing handling
  const currentDraft = drafts[currentDayNum] || '';
  const handleDraftChange = (e) => {
    const text = e.target.value;
    setDrafts(prev => ({ ...prev, [currentDayNum]: text }));
    saveStoredDraft(currentDayNum, text);
  };

  const wordCount = currentDraft.trim() ? currentDraft.trim().split(/\s+/).length : 0;
  const isWordCountSufficient = wordCount >= (dayData.writingChallenge?.minimumWords || 40);

  // Practice Score
  const totalPracticeCount = dayData.practiceProblems.length;
  const correctCount = Object.values(submittedAnswers).filter(a => a.isCorrect).length;
  const attemptedCount = Object.keys(submittedAnswers).length;

  return (
    <div className="lx-learn" style={{ maxWidth: '1360px', padding: 'clamp(20px, 3vw, 48px)' }}>
      {/* Top Breadcrumb & Course Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--lx-muted)', marginBottom: '16px' }}>
        <Link to="/learn" style={{ color: 'var(--lx-accent)', textDecoration: 'none' }}>Courses</Link>
        <span>/</span>
        <span style={{ color: 'var(--lx-text)', fontWeight: 600 }}>IELTS Writing Foundation</span>
        <span>/</span>
        <span style={{ color: 'var(--lx-accent)' }}>Day 0{currentDayNum}</span>
      </nav>

      <header style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '20px',
        padding: '28px clamp(20px, 3vw, 36px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="lx-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                WEEK 1 · FOUNDATION CHALLENGE
              </span>
              <span style={{ fontSize: '12px', color: 'var(--lx-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {dayData.timeMinutes} Minutes Daily
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 38px)', margin: '4px 0 8px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Day 0{dayData.day}: {dayData.title}
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: 'var(--lx-muted)', maxWidth: '720px' }}>
              {dayData.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <button
              onClick={toggleDayComplete}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isDayCompleted ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: isDayCompleted ? '#34d399' : '#ffffff',
                border: isDayCompleted ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(59, 130, 246, 0.5)',
                boxShadow: isDayCompleted ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              <CheckCircle2 size={16} />
              {isDayCompleted ? 'Completed ✓' : 'Mark Day Complete'}
            </button>
            <span style={{ fontSize: '11px', color: 'var(--lx-muted)' }}>
              Week 1 Progress: {progress.completedDays.length} / 7 Days Done
            </span>
          </div>
        </div>

        {/* Saved Toast Notification */}
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

      {/* 7-Day Navigation Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
        marginBottom: '32px'
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
                padding: '12px 14px',
                borderRadius: '12px',
                background: isSelected
                  ? 'rgba(59, 130, 246, 0.18)'
                  : 'var(--lx-panel)',
                border: isSelected
                  ? '1px solid var(--lx-accent)'
                  : '1px solid var(--lx-border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.18s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? 'var(--lx-accent)' : 'var(--lx-muted)' }}>
                  DAY 0{d.day}
                </span>
                {isDone && <Check size={14} color="#34d399" />}
              </div>
              <strong style={{ fontSize: '12px', lineHeight: 1.3, fontWeight: isSelected ? 700 : 500 }}>
                {d.title}
              </strong>
            </Link>
          );
        })}
      </div>

      {/* Main Study Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
        {/* Section Navigation Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--lx-border)',
          paddingBottom: '14px'
        }}>
          {[
            { id: 'theory', label: '1. Grammar Explanation & Rules', icon: BookOpen },
            { id: 'traps', label: '2. Worked Examples & Pitfalls', icon: Lightbulb },
            { id: 'practice', label: `3. Interactive Practice Lab (${totalPracticeCount})`, icon: Sparkles },
            { id: 'writing', label: '4. Daily Writing Challenge', icon: PenTool },
            { id: 'homework', label: '5. Homework & Vocab', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--lx-accent)' : '1px solid var(--lx-border)',
                  background: isActive ? 'color-mix(in srgb, var(--lx-accent) 15%, var(--lx-panel))' : 'var(--lx-panel)',
                  color: isActive ? 'var(--lx-text)' : 'var(--lx-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: GRAMMAR THEORY & RULES */}
        {activeTab === 'theory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Learning Outcomes Card */}
            <div style={{
              background: 'var(--lx-panel)',
              border: '1px solid var(--lx-border)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lx-accent)' }}>
                <CheckCircle2 size={18} /> Today's Learning Objectives (আজকের ক্লাসের লক্ষ্য)
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--lx-text)' }}>
                {dayData.outcomes.map((item, idx) => (
                  <li key={idx} style={{ lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Bangla & English Theory Explanation */}
            <div style={{
              background: 'var(--lx-panel)',
              border: '1px solid var(--lx-border)',
              borderRadius: '16px',
              padding: '28px',
              lineHeight: 1.8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span className="lx-pill" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#facc15' }}>
                  IN-DEPTH EXPLANATION
                </span>
                <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 750 }}>
                  ব্যাখ্যা ও ব্যাকরণিক নিয়মাবলী
                </h2>
              </div>

              <div style={{ whiteSpace: 'pre-line', fontSize: '15px', color: 'var(--lx-text)' }}>
                {dayData.grammarTheory.banglaExplanation.trim()}
              </div>

              {/* Core Formulas */}
              <div style={{ marginTop: '28px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--lx-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} /> Core Sentence Formulas & Structure
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {dayData.grammarTheory.formulas.map((f, i) => (
                    <div key={i} style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase' }}>{f.name}</span>
                      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#67e8f9', margin: '8px 0 6px', fontWeight: 600 }}>
                        {f.structure}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--lx-muted)' }}>
                        <em>e.g., {f.example}</em>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IELTS Band Impact Alert */}
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
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--lx-text)', lineHeight: 1.6 }}>
                    {dayData.grammarTheory.ieltsImpact}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActiveTab('traps')}
                className="lx-primary"
                style={{ cursor: 'pointer' }}
              >
                Proceed to Worked Examples & Traps <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: WORKED EXAMPLES & PITFALLS */}
        {activeTab === 'traps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Worked Examples Table */}
            <div style={{
              background: 'var(--lx-panel)',
              border: '1px solid var(--lx-border)',
              borderRadius: '16px',
              padding: '26px'
            }}>
              <h3 style={{ fontSize: '20px', margin: '0 0 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lx-accent)' }}>
                <CheckCircle2 size={18} /> Model Worked Examples (বিশ্লেষণসহ উদাহরণ)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--lx-border)', color: 'var(--lx-muted)', fontSize: '12px' }}>
                      <th style={{ padding: '12px 14px' }}>#</th>
                      <th style={{ padding: '12px 14px' }}>Sentence Structure / Parsing</th>
                      <th style={{ padding: '12px 14px' }}>Complete Sentence & Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayData.workedExamples.map((ex, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '12px 14px', color: 'var(--lx-accent)', fontWeight: 700 }}>0{idx + 1}</td>
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

            {/* Common Traps / Pitfalls */}
            <div style={{
              background: 'var(--lx-panel)',
              border: '1px solid var(--lx-border)',
              borderRadius: '16px',
              padding: '26px'
            }}>
              <h3 style={{ fontSize: '20px', margin: '0 0 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
                <AlertCircle size={18} /> Common Mistakes vs Correct Academic English (সাধারণ ভুল ও সমাধান)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {dayData.commonTraps.map((trap, idx) => (
                  <div key={idx} style={{
                    padding: '18px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    <div style={{ color: '#ef4444', fontSize: '13px', textDecoration: 'line-through', marginBottom: '6px' }}>
                      ❌ {trap.incorrect}
                    </div>
                    <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                      ✅ {trap.correct}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--lx-muted)', lineHeight: 1.5 }}>
                      <strong>লজিক:</strong> {trap.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setActiveTab('theory')} className="lx-secondary" style={{ cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Back to Theory
              </button>
              <button onClick={() => setActiveTab('practice')} className="lx-primary" style={{ cursor: 'pointer' }}>
                Start Practice Lab ({totalPracticeCount} Questions) <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE PRACTICE LAB */}
        {activeTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Practice Score Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '14px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--lx-text)', display: 'block' }}>
                  Interactive Practice Lab: Day 0{dayData.day}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--lx-muted)' }}>
                  Solved {attemptedCount} of {totalPracticeCount} problems · Correct: {correctCount}
                </span>
              </div>
              <button
                onClick={handleResetPractice}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: '1px solid var(--lx-border)',
                  color: 'var(--lx-muted)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} /> Reset Exercises
              </button>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {dayData.practiceProblems.map((problem, pIdx) => {
                const sub = submittedAnswers[problem.id];
                const isAnswered = !!sub;
                const isCorrect = sub?.isCorrect;

                return (
                  <div
                    key={problem.id}
                    style={{
                      background: 'var(--lx-panel)',
                      border: isAnswered
                        ? isCorrect
                          ? '1px solid rgba(16, 185, 129, 0.4)'
                          : '1px solid rgba(239, 68, 68, 0.4)'
                        : '1px solid var(--lx-border)',
                      borderRadius: '14px',
                      padding: '22px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="lx-pill" style={{ textTransform: 'uppercase' }}>
                        QUESTION 0{pIdx + 1} · {problem.type.replace('_', ' ')}
                      </span>
                      {isAnswered && (
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: isCorrect ? '#34d399' : '#f87171',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {isCorrect ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: 'var(--lx-text)' }}>
                      {problem.question}
                    </p>

                    {/* MCQ Options */}
                    {problem.type === 'mcq' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {problem.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[problem.id] === optIdx;
                          let optBg = 'rgba(255, 255, 255, 0.03)';
                          let optBorder = 'rgba(255, 255, 255, 0.1)';

                          if (isAnswered) {
                            if (optIdx === problem.correctIndex) {
                              optBg = 'rgba(16, 185, 129, 0.15)';
                              optBorder = 'rgba(52, 211, 153, 0.5)';
                            } else if (isSelected) {
                              optBg = 'rgba(239, 68, 68, 0.15)';
                              optBorder = 'rgba(248, 113, 113, 0.5)';
                            }
                          } else if (isSelected) {
                            optBg = 'rgba(59, 130, 246, 0.15)';
                            optBorder = 'rgba(59, 130, 246, 0.5)';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(problem.id, optIdx)}
                              disabled={isAnswered}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 14px',
                                borderRadius: '10px',
                                background: optBg,
                                border: `1px solid ${optBorder}`,
                                color: 'var(--lx-text)',
                                fontSize: '14px',
                                textAlign: 'left',
                                cursor: isAnswered ? 'default' : 'pointer',
                                transition: 'all 0.12s ease'
                              }}
                            >
                              <span style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: isSelected ? 'var(--lx-accent)' : 'rgba(255, 255, 255, 0.1)',
                                color: isSelected ? '#ffffff' : 'var(--lx-muted)'
                              }}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Input Field for Rearrange / Error Fix */}
                    {problem.type !== 'mcq' && (
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="text"
                          value={userInputs[problem.id] || ''}
                          onChange={(e) => handleInputChange(problem.id, e.target.value)}
                          disabled={isAnswered}
                          placeholder="Type your corrected sentence here..."
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid var(--lx-border)',
                            color: 'var(--lx-text)',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    )}

                    {/* Submit / Check Button */}
                    {!isAnswered && (
                      <button
                        onClick={() => handleSubmitProblem(problem)}
                        disabled={problem.type === 'mcq' ? selectedAnswers[problem.id] === undefined : !(userInputs[problem.id] || '').trim()}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Check Answer
                      </button>
                    )}

                    {/* Explanation Box */}
                    {isAnswered && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '13px',
                        color: 'var(--lx-muted)',
                        lineHeight: 1.5
                      }}>
                        {problem.correctAnswer && (
                          <div style={{ color: '#34d399', fontWeight: 600, marginBottom: '4px' }}>
                            Correct: {problem.correctAnswer}
                          </div>
                        )}
                        <div><strong>ব্যাখ্যা:</strong> {problem.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <button onClick={() => setActiveTab('traps')} className="lx-secondary" style={{ cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Back to Examples
              </button>
              <button onClick={() => setActiveTab('writing')} className="lx-primary" style={{ cursor: 'pointer' }}>
                Proceed to Writing Challenge <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: WRITING CHALLENGE */}
        {activeTab === 'writing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'var(--lx-panel)',
              border: '1px solid var(--lx-border)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span className="lx-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                  DAILY WRITING PRODUCTION
                </span>
                <h3 style={{ fontSize: '20px', margin: 0, fontWeight: 700 }}>
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

              {/* Requirement Checklist */}
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

              {/* Live Writing Textarea */}
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
                    border: isWordCountSufficient ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--lx-border)',
                    color: 'var(--lx-text)',
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

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setActiveTab('practice')} className="lx-secondary" style={{ cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Back to Practice
              </button>
              <button onClick={() => setActiveTab('homework')} className="lx-primary" style={{ cursor: 'pointer' }}>
                Go to Homework & Vocab <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: HOMEWORK & VOCABULARY */}
        {activeTab === 'homework' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'var(--lx-panel)',
              border: '1px solid var(--lx-border)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span className="lx-pill" style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.35)', color: '#c084fc' }}>
                  DAY 0{dayData.day} HOMEWORK
                </span>
                <h3 style={{ fontSize: '20px', margin: 0, fontWeight: 700 }}>
                  পরের দিনের জন্য হোমওয়ার্ক টাস্ক
                </h3>
              </div>

              <div style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                fontSize: '15px',
                color: 'var(--lx-text)',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                <strong>Task Instructions:</strong> {dayData.homework.taskDescription}
              </div>

              {/* 5 Vocabulary Words of the Day */}
              <div>
                <h4 style={{ fontSize: '16px', margin: '0 0 12px', color: 'var(--lx-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} /> Essential IELTS Vocabulary of the Day (আজকের ৫টি প্রয়োজনীয় শব্দ)
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {dayData.homework.newVocabulary.map((word, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#93c5fd'
                      }}
                    >
                      {idx + 1}. {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Final Action / Day Completion Card */}
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
                <h4 style={{ fontSize: '18px', margin: '0 0 6px', fontWeight: 700 }}>
                  {isDayCompleted ? `Day 0${currentDayNum} is Complete!` : `Ready to finish Day 0${currentDayNum}?`}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--lx-muted)' }}>
                  Mark your attendance and unlock Day {Math.min(7, currentDayNum + 1)} in the 60-Day challenge.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={toggleDayComplete}
                  className="lx-primary"
                  style={{
                    background: isDayCompleted ? 'rgba(16, 185, 129, 0.2)' : undefined,
                    color: isDayCompleted ? '#34d399' : '#ffffff',
                    borderColor: isDayCompleted ? '#34d399' : undefined,
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle2 size={16} />
                  {isDayCompleted ? 'Completed ✓' : `Mark Day 0${currentDayNum} Done`}
                </button>

                {currentDayNum < 7 && (
                  <Link
                    to={`/learn/ielts-writing/${currentDayNum + 1}`}
                    className="lx-secondary"
                    style={{ textDecoration: 'none' }}
                  >
                    Go to Day 0{currentDayNum + 1} <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


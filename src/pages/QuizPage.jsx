import { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, LoaderCircle, PartyPopper, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext, getLessonFromState } from '../state/AppContext.jsx';
import { isStudentPreview } from '../utils/roles.js';

export function QuizPage() {
  const { state, actions, courseData } = useAppContext();
  const activeLesson = getLessonFromState(state, courseData);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTesterMode = isStudentPreview(state);
  const isStaffPreview = searchParams.get('preview') === '1' && !isTesterMode;
  const isPreview = isStaffPreview || isTesterMode;
  const previewDay = Math.max(Number(searchParams.get('day')) || 1, 1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [responses, setResponses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [xpEarned, setXpEarned] = useState(0);
  const [serverScore, setServerScore] = useState(null);
  const [highScoreCelebration, setHighScoreCelebration] = useState(false);

  const questions = activeLesson.quiz ?? [];
  const question = questions[questionIndex];
  const progress = useMemo(() => `${questionIndex + 1} / ${questions.length}`, [questionIndex, questions.length]);
  const score = responses.reduce((total, response, index) => (
    total + (response === questions[index]?.answer ? 1 : 0)
  ), 0);

  const celebrateHighScore = () => {
    const colors = ['#34d399', '#60a5fa', '#fbbf24', '#c084fc', '#ffffff'];
    confetti({ particleCount: 90, spread: 75, startVelocity: 45, origin: { x: 0.2, y: 0.72 }, colors });
    confetti({ particleCount: 90, spread: 75, startVelocity: 45, origin: { x: 0.8, y: 0.72 }, colors });
    window.setTimeout(() => {
      confetti({ particleCount: 120, spread: 110, origin: { y: 0.55 }, colors });
    }, 350);
  };

  if (!question) {
    return (
      <section className="section-card p-8 text-center">
        <h1 className="text-2xl font-black text-white">Quiz is being prepared</h1>
        <p className="mt-3 text-slate-400">Please return to today&apos;s lesson and try again later.</p>
        <button type="button" className="glow-button glow-button-blue mt-6" onClick={() => navigate('/daily-lessons')}>Back to lessons</button>
      </section>
    );
  }

  const checkAnswer = () => {
    if (selectedIndex === null || answerChecked) return;
    setResponses(previous => {
      const next = previous.slice(0, questionIndex);
      next[questionIndex] = selectedIndex;
      return next;
    });
    setAnswerChecked(true);
    setSubmitError('');
  };

  const finishQuiz = async () => {
    if (isPreview) {
      setXpEarned(0);
      setServerScore(score);
      setIsCompleted(true);
      return;
    }

    const finalResponses = responses.length === questions.length
      ? responses
      : [...responses.slice(0, questionIndex), selectedIndex];
    if (finalResponses.length !== questions.length || finalResponses.some(answer => !Number.isSafeInteger(answer))) {
      setSubmitError('Please answer every question before finishing the quiz.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await actions.submitQuiz(activeLesson.id, finalResponses);
      actions.recordServerQuizCompletion(activeLesson.id, result);
      setXpEarned(Number(result?.xpAwarded) || 0);
      const correctAnswers = Number.isFinite(Number(result?.correctAnswers)) ? Number(result.correctAnswers) : score;
      const percentage = Number.isFinite(Number(result?.score))
        ? Number(result.score)
        : Math.round((correctAnswers / questions.length) * 100);
      setServerScore(correctAnswers);
      if (Number(result?.xpAwarded) > 0) {
        setHighScoreCelebration(true);
        celebrateHighScore();
      }
      setIsCompleted(true);
    } catch (error) {
      setSubmitError(error.message || 'Your result could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueQuiz = () => {
    if (!answerChecked) return;
    if (questionIndex + 1 === questions.length) {
      finishQuiz();
      return;
    }
    setQuestionIndex(previous => previous + 1);
    setSelectedIndex(null);
    setAnswerChecked(false);
  };

  const restartMistakes = () => {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswerChecked(false);
    setIsCompleted(false);
    setResponses([]);
    setSubmitError('');
    setXpEarned(0);
    setServerScore(null);
    setHighScoreCelebration(false);
  };

  const selectedIsCorrect = selectedIndex === question.answer;

  return (
    <section className="space-y-8">
      <div className="section-card p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{isStaffPreview ? 'Staff MCQ preview' : 'Quiz challenge'}</p>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{activeLesson.title}</h1>
          </div>
          {!isCompleted && <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">{progress}</div>}
        </div>

        {isCompleted ? (
          <div className="mt-10 grid gap-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-4xl">🏆</div>
            <h2 className="text-3xl font-black text-white">{isStaffPreview ? 'MCQ preview completed!' : 'Quiz completed!'}</h2>
            <p className="text-slate-400">{isPreview ? 'This preview did not change XP, progress, or learner completion.' : 'Review every answer below and revisit the ones that need more practice.'}</p>
            {highScoreCelebration && (
              <div className="relative overflow-hidden rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-500/20 via-violet-500/15 to-emerald-500/20 p-6 shadow-2xl shadow-amber-500/10">
                <Sparkles className="absolute right-5 top-5 text-amber-300" size={24} />
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/30">
                  <PartyPopper size={28} />
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-amber-200">Outstanding achievement</p>
                <h3 className="mt-2 text-2xl font-black text-white">Brilliant work, {state.userName || 'Learner'}!</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-200">Quiz complete — you earned 500 XP! Your focus and consistency are turning today&apos;s lesson into real language confidence.</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">XP earned</p>
                <p className="mt-3 text-3xl font-black text-green-300">+{xpEarned}</p>
                {!xpEarned && <p className="mt-2 text-xs text-slate-500">{isPreview ? 'Preview mode does not award XP.' : 'XP was already earned for this lesson.'}</p>}
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Accuracy</p>
                <p className="mt-3 text-3xl font-black text-white">{serverScore ?? score} / {questions.length}</p>
              </div>
            </div>

            <div className="space-y-3 text-left">
              {questions.map((item, index) => {
                const isCorrect = responses[index] === item.answer;
                return (
                  <div key={item.question} className={`rounded-2xl border p-4 ${isCorrect ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-red-400/20 bg-red-500/10'}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={20} /> : <XCircle className="mt-0.5 shrink-0 text-red-300" size={20} />}
                      <div>
                        <p className="font-bold text-white">{item.question}</p>
                        {!isCorrect && <p className="mt-2 text-sm text-slate-300">Correct answer: {item.options[item.answer]}</p>}
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {(serverScore ?? score) < questions.length && <button type="button" className="glow-button glow-button-muted justify-center" onClick={restartMistakes}><RotateCcw size={18} /> Practise again</button>}
              <button type="button" className="glow-button glow-button-blue justify-center" onClick={() => navigate(isStaffPreview ? `/lesson/${previewDay}` : '/daily-lessons')}>
                {isStaffPreview ? 'Back to lesson' : 'Back to daily lessons'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6 sm:mt-10">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-5 sm:p-8">
              <h2 className="text-xl font-bold text-white sm:text-2xl">{question.question}</h2>
              <div className="mt-6 grid gap-3 sm:gap-4">
                {question.options.map((option, index) => {
                  const isCorrectOption = answerChecked && index === question.answer;
                  const isWrongSelection = answerChecked && index === selectedIndex && index !== question.answer;
                  const optionClass = isCorrectOption
                    ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-50'
                    : isWrongSelection
                      ? 'border-red-400/60 bg-red-500/15 text-red-50'
                      : selectedIndex === index
                        ? 'border-blue-400/60 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/30 hover:bg-white/10';
                  return (
                    <button key={option} type="button" disabled={answerChecked} className={`w-full rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${optionClass} disabled:cursor-default disabled:opacity-100`} onClick={() => setSelectedIndex(index)}>
                      <span className="mr-4 font-bold text-blue-300">{String.fromCharCode(65 + index)}</span>{option}
                    </button>
                  );
                })}
              </div>

              {answerChecked && (
                <div role="status" className={`mt-6 rounded-2xl border p-4 ${selectedIsCorrect ? 'border-emerald-400/25 bg-emerald-500/10' : 'border-red-400/25 bg-red-500/10'}`}>
                  <div className="flex items-center gap-2 font-black text-white">
                    {selectedIsCorrect ? <CheckCircle2 size={20} className="text-emerald-300" /> : <XCircle size={20} className="text-red-300" />}
                    {selectedIsCorrect ? 'Correct!' : 'Not quite—keep learning.'}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{question.explanation}</p>
                </div>
              )}
            </div>

            {submitError && <p role="alert" className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">{submitError}</p>}

            <div className="flex justify-end">
              {!answerChecked ? (
                <button type="button" className="glow-button glow-button-green disabled:cursor-not-allowed disabled:opacity-50" onClick={checkAnswer} disabled={selectedIndex === null}>Check answer</button>
              ) : (
                <button type="button" className="glow-button glow-button-blue disabled:cursor-not-allowed disabled:opacity-50" onClick={continueQuiz} disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
                  {questionIndex + 1 === questions.length ? (submitError ? 'Try saving again' : 'Finish quiz') : 'Next question'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

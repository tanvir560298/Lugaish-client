import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, getLessonFromState } from '../state/AppContext.jsx';

export function QuizPage() {
  const { state, actions, courseData } = useAppContext();
  const activeLesson = getLessonFromState(state, courseData);
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [responses, setResponses] = useState([]);

  const question = activeLesson.quiz[questionIndex];
  const progress = useMemo(() => `${questionIndex + 1} / ${activeLesson.quiz.length}`, [questionIndex, activeLesson.quiz.length]);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    const correct = selectedIndex === question.answer;
    const nextResponses = [...responses, selectedIndex];
    setResponses(nextResponses);
    if (correct) setScore(prev => prev + 1);

    if (questionIndex + 1 === activeLesson.quiz.length) {
      setIsCompleted(true);
      actions.submitQuiz(activeLesson.id, nextResponses);
      actions.addXP(100);
      actions.completeLesson(activeLesson.id);
      return;
    }

    setQuestionIndex(prev => prev + 1);
    setSelectedIndex(null);
  };

  return (
    <section className="space-y-8">
      <div className="section-card p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quiz challenge</p>
            <h1 className="text-3xl font-black text-white">{activeLesson.title}</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            {progress}
          </div>
        </div>

        {isCompleted ? (
          <div className="mt-10 grid gap-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-4xl">🏆</div>
            <h2 className="text-3xl font-black text-white">Module Completed!</h2>
            <p className="text-slate-400">Great work! You successfully reinforced your bilingual leadership vocabulary.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">XP earned</p>
                <p className="mt-3 text-3xl font-black text-green-300">+100</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Accuracy</p>
                <p className="mt-3 text-3xl font-black text-white">{score} / {activeLesson.quiz.length}</p>
              </div>
            </div>
            <button className="glow-button glow-button-blue mx-auto" onClick={() => navigate('/dashboard')}>
              Go to dashboard
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8">
              <h2 className="text-2xl font-bold text-white">{question.question}</h2>
              <div className="mt-6 grid gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    className={`w-full rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${selectedIndex === index ? 'border-blue-400/60 bg-blue-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/30 hover:bg-white/10'}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span className="mr-4 font-bold text-blue-300">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="glow-button glow-button-green disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={selectedIndex === null}
              >
                {questionIndex + 1 === activeLesson.quiz.length ? 'Finish quiz' : 'Submit answer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

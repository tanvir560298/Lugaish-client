import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, getLessonFromState, getPathFromState } from '../state/AppContext.jsx';

export function LessonPage() {
  const { state, actions, courseData } = useAppContext();
  const lesson = getLessonFromState(state, courseData);
  const pathway = getPathFromState(state, courseData);
  const [activeTab, setActiveTab] = useState('vocab');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  const progressLabel = useMemo(() => {
    const total = lesson?.cards.length ?? 0;
    return `${cardIndex + 1} / ${total}`;
  }, [cardIndex, lesson]);

  const currentCard = lesson?.cards[cardIndex];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{pathway.title}</p>
          <h1 className="text-4xl font-black text-white">{lesson.title}</h1>
          <p className="mt-3 text-slate-400">{lesson.description}</p>
        </div>
        <button
          className="glow-button glow-button-muted"
          onClick={() => navigate('/pathways')}
        >
          Change pathway
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="section-card p-8">
          <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-4">
            <div className="flex gap-3">
              <button className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === 'vocab' ? 'bg-blue-500/20 text-white' : 'bg-white/5 text-slate-300'}`} onClick={() => setActiveTab('vocab')}>Vocabulary</button>
              <button className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === 'phrases' ? 'bg-blue-500/20 text-white' : 'bg-white/5 text-slate-300'}`} onClick={() => setActiveTab('phrases')}>Phrases</button>
            </div>
            <span className="text-sm text-slate-400">{progressLabel}</span>
          </div>

          {activeTab === 'vocab' ? (
            <div className="mt-8 space-y-6">
              <div className="relative mx-auto w-full max-w-2xl perspective-1200">
                <div className={`relative min-h-[420px] transform-style preserve-3d transition-transform duration-700 ${flipped ? 'rotate-y-180' : ''}`} style={{ perspective: '1200px' }}>
                  <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-soft backface-hidden">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{currentCard?.type ?? ''}</span>
                    <h2 className="mt-8 text-5xl font-black text-white">{currentCard?.word}</h2>
                    <p className="mt-8 text-slate-400">Tap the card to reveal the translation, context, and example.</p>
                  </div>
                  <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-soft rotate-y-180 backface-hidden">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{currentCard?.type ?? ''}</span>
                    <h2 className="mt-8 text-5xl font-black text-green-400">{currentCard?.translation}</h2>
                    <p className="mt-8 text-slate-300">{currentCard?.explanation}</p>
                    <p className="mt-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-4 text-slate-100">"{currentCard?.example}"</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button className="glow-button glow-button-blue" onClick={() => setFlipped(prev => !prev)}>
                  {flipped ? 'Flip back' : 'Reveal answer'}
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <button className="rounded-full bg-white/5 px-4 py-2" onClick={() => setCardIndex(prev => Math.max(prev - 1, 0))} disabled={cardIndex === 0}>Previous</button>
                  <button className="rounded-full bg-white/5 px-4 py-2" onClick={() => setCardIndex(prev => Math.min(prev + 1, (lesson.cards.length ?? 1) - 1))} disabled={cardIndex >= (lesson.cards.length ?? 1) - 1}>Next</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {lesson.phrases.map((phrase, index) => (
                <div key={index} className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                  <p className="text-xl font-semibold text-white">{phrase.text}</p>
                  <p className="mt-3 text-slate-400">{phrase.translation}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">Progress through the module, then test your retention with the quiz.</p>
            <button className="glow-button glow-button-green" onClick={() => navigate('/quiz')}>
              Take module quiz
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="section-card p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current path</p>
            <h2 className="mt-4 text-2xl font-bold text-white">{pathway.title}</h2>
            <p className="mt-3 text-slate-400">{pathway.description}</p>
          </div>

          <div className="section-card p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Leaderboard teaser</p>
            <h3 className="mt-4 text-xl font-bold text-white">Stay competitive</h3>
            <p className="mt-3 text-slate-400">Review your position among other student leaders and earn XP to climb higher.</p>
            <button className="mt-6 glow-button glow-button-muted" onClick={() => navigate('/leaderboard')}>
              View leaderboard
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

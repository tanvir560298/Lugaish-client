import { useAppContext } from '../state/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export function TodayPage() {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();

  if (!state.isLoggedIn) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-300 mb-4">Please log in to start learning</p>
        <Link to="/login" className="glow-button glow-button-blue">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleCompleteLesson = () => {
    actions.addXP(100);
    // Move to next day
    navigate('/quiz');
  };

  const language = state.activePathway === 'english' ? 'English' : 'Arabic';

  return (
    <section className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-900/30 to-emerald-900/30 py-16 -mx-6 px-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">Today's lesson</p>
        <h1 className="text-5xl font-black text-white mb-4">Day {state.activeLessonId.split('-')[2] || 1}</h1>
        <p className="text-xl text-slate-300">Master {language} step by step</p>
      </div>

      <div className="app-shell space-y-8">
        {/* Video Section */}
        <div className="section-card p-10">
          <h2 className="text-2xl font-bold text-white mb-6">📹 Lesson Video</h2>
          <div className="bg-slate-900 rounded-lg aspect-video mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">▶️</div>
              <p className="text-slate-400">Video placeholder (10-15 minutes)</p>
            </div>
          </div>
          <p className="text-slate-300">
            Today you'll learn the fundamentals of {language} including pronunciation, basic grammar, and
            practical vocabulary for everyday use.
          </p>
        </div>

        {/* Vocabulary Section */}
        <div className="section-card p-10">
          <h2 className="text-2xl font-bold text-white mb-6">📖 Vocabulary Words</h2>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-slate-900/50 rounded-lg p-6 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-slate-400">Word {i}</p>
                    <p className="text-2xl font-bold text-white">English Word</p>
                  </div>
                  <span className="text-sm text-emerald-400">🔊</span>
                </div>
                <p className="text-slate-300 text-sm mb-2">Example: "This is an example sentence."</p>
                <p className="text-slate-400 text-sm">Translation: الترجمة العربية</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar Concept */}
        <div className="section-card p-10">
          <h2 className="text-2xl font-bold text-white mb-6">🧠 Grammar Concept</h2>
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
              <p className="text-blue-200 font-bold text-lg mb-2">Present Simple Tense</p>
              <p className="text-slate-300 mb-4">Used for facts, habits, and general statements.</p>
              <div className="space-y-2 text-sm text-slate-300">
                <p>✓ "I learn English every day"</p>
                <p>✓ "She speaks Arabic fluently"</p>
                <p>✓ "They are students"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Speaking Practice */}
        <div className="section-card p-10">
          <h2 className="text-2xl font-bold text-white mb-6">🎤 Speaking Practice</h2>
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-6 border border-white/10">
              <p className="text-sm text-slate-400 mb-3">Task 1: Repeat after the audio</p>
              <p className="text-white font-semibold mb-4">"Hello, my name is Ahmed"</p>
              <button className="glow-button glow-button-blue w-full">🎤 Record your voice</button>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 border border-white/10">
              <p className="text-sm text-slate-400 mb-3">Task 2: Respond to a question</p>
              <p className="text-white font-semibold mb-4">"What is your name?"</p>
              <button className="glow-button glow-button-blue w-full">🎤 Record your voice</button>
            </div>
          </div>
        </div>

        {/* Complete Lesson Button */}
        <button
          onClick={handleCompleteLesson}
          className="glow-button glow-button-blue w-full py-5 text-xl font-bold"
        >
          ✓ Complete Lesson & Take Quiz →
        </button>
      </div>
    </section>
  );
}

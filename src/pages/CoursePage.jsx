import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext.jsx';
import { useState, useEffect } from 'react';

export function CoursePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { actions } = useAppContext();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch course details
    if (language === 'english') {
      setCourse({
        id: 'english',
        name: 'English Pathway',
        description: 'Master English communication from basics to fluency',
        totalDays: 30,
        difficulty: 'Beginner to Advanced',
        modules: [
          { title: 'Beginner Basics', lessons: 5, days: '1-5' },
          { title: 'Basic Conversation', lessons: 7, days: '6-12' },
          { title: 'Daily Speaking', lessons: 8, days: '13-20' },
          { title: 'Advanced Vocabulary', lessons: 10, days: '21-30' },
        ],
      });
    } else if (language === 'arabic') {
      setCourse({
        id: 'arabic',
        name: 'Arabic Pathway',
        description: 'Learn Arabic fluently with cultural context',
        totalDays: 30,
        difficulty: 'Beginner to Advanced',
        modules: [
          { title: 'Alphabet & Basics', lessons: 5, days: '1-5' },
          { title: 'Everyday Phrases', lessons: 7, days: '6-12' },
          { title: 'Conversational Arabic', lessons: 8, days: '13-20' },
          { title: 'Advanced Grammar', lessons: 10, days: '21-30' },
        ],
      });
    }
    setLoading(false);
  }, [language]);

  if (loading) return <div className="text-center py-20 text-white">Loading course...</div>;
  if (!course) return <div className="text-center py-20 text-white">Course not found</div>;

  return (
    <section className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-16 -mx-6 px-6">
        <h1 className="text-5xl font-black text-white mb-4">{course.name}</h1>
        <p className="text-xl text-slate-300 mb-8">{course.description}</p>
        <div className="flex flex-wrap gap-6">
          <div className="section-card p-6 bg-blue-500/10">
            <p className="text-sm text-slate-400">Total duration</p>
            <p className="text-3xl font-bold text-white">{course.totalDays} days</p>
          </div>
          <div className="section-card p-6 bg-emerald-500/10">
            <p className="text-sm text-slate-400">Difficulty</p>
            <p className="text-3xl font-bold text-white">{course.difficulty}</p>
          </div>
        </div>
      </div>

      <div className="app-shell">
        <h2 className="text-3xl font-bold text-white mb-8">📚 Course Modules</h2>
        <div className="space-y-4">
          {course.modules.map((module, idx) => (
            <div key={idx} className="section-card p-8 hover:bg-white/5 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{module.title}</h3>
                  <p className="text-slate-400 mt-2">{module.lessons} lessons • {module.days}</p>
                </div>
                <span className="badge-pill border-blue-400/30 bg-blue-500/10 text-blue-200">
                  Module {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            actions.switchPathway(language);
            navigate('/today');
          }}
          className="glow-button glow-button-blue w-full mt-12 py-4 text-lg font-bold"
        >
          Start Course →
        </button>
      </div>
    </section>
  );
}

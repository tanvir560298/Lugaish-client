import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext.jsx';
import { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { api } from '../api/client.js';

export function CoursePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useAppContext();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [enrollmentError, setEnrollmentError] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationForm, setApplicationForm] = useState({
    goal: '',
    availability: '',
    contactPreference: '',
  });

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

  useEffect(() => {
    let ignore = false;

    async function loadEnrollmentStatus() {
      try {
        const status = await api.getEnrollmentStatus(language);
        if (!ignore) setEnrollmentStatus(status);
      } catch {
        if (!ignore) setEnrollmentStatus(null);
      }
    }

    if (language) loadEnrollmentStatus();

    return () => {
      ignore = true;
    };
  }, [language, state.isLoggedIn]);

  const isFull = enrollmentStatus?.isFull && !enrollmentStatus?.isEnrolled;

  async function handleStartCourse() {
    setEnrollmentError('');

    if (!state.isLoggedIn) {
      actions.switchPathway(language);
      navigate('/login');
      return;
    }

    setIsStarting(true);
    try {
      await actions.enrollPathway(language);
      navigate('/today');
    } catch (error) {
      if (error.status === 409 || error.code === 'COURSE_FULL') {
        setEnrollmentStatus(prev => ({
          ...(prev ?? {}),
          isFull: true,
          isEnrolled: false,
          limit: error.data?.limit ?? prev?.limit,
          enrolledCount: error.data?.enrolledCount ?? prev?.enrolledCount,
          seatsAvailable: 0,
        }));
        setShowApplication(true);
        setEnrollmentError('This cohort is at capacity right now. Send us a seat request and our team will review it.');
      } else {
        setEnrollmentError(error.message || 'Could not start the course. Please try again.');
      }
    } finally {
      setIsStarting(false);
    }
  }

  async function handleApplicationSubmit(event) {
    event.preventDefault();
    setEnrollmentError('');
    setApplicationMessage('');

    if (!state.isLoggedIn) {
      actions.switchPathway(language);
      navigate('/login');
      return;
    }

    setIsSubmittingApplication(true);
    try {
      const response = await api.applyForSeat({
        language,
        ...applicationForm,
      });
      setApplicationMessage(response.message || 'Message sent to our team. They will get back to you soon.');
      setEnrollmentStatus(prev => ({
        ...(prev ?? {}),
        hasApplied: true,
        applicationStatus: 'pending',
      }));
      setApplicationForm({ goal: '', availability: '', contactPreference: '' });
    } catch (error) {
      setEnrollmentError(error.message || 'Could not send your application. Please try again.');
    } finally {
      setIsSubmittingApplication(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-white">Loading course...</div>;
  if (!course) return <div className="text-center py-20 text-white">Course not found</div>;

  return (
    <section className="space-y-8 pb-12 sm:space-y-12 sm:pb-20">
      <div className="-mx-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-10 sm:-mx-6 sm:px-6 sm:py-16">
        <h1 className="mb-4 text-4xl font-black text-white sm:text-5xl">{course.name}</h1>
        <p className="mb-6 text-base text-slate-300 sm:mb-8 sm:text-xl">{course.description}</p>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="section-card bg-blue-500/10 p-5 sm:p-6">
            <p className="text-sm text-slate-400">Total duration</p>
            <p className="text-2xl font-bold text-white sm:text-3xl">{course.totalDays} days</p>
          </div>
          <div className="section-card bg-emerald-500/10 p-5 sm:p-6">
            <p className="text-sm text-slate-400">Difficulty</p>
            <p className="text-2xl font-bold text-white sm:text-3xl">{course.difficulty}</p>
          </div>
        </div>
      </div>

      <div className="app-shell">
        <h2 className="mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl">📚 Course Modules</h2>
        <div className="space-y-4">
          {course.modules.map((module, idx) => (
            <div key={idx} className="section-card p-5 transition hover:bg-white/5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{module.title}</h3>
                  <p className="text-slate-400 mt-2">{module.lessons} lessons • {module.days}</p>
                </div>
                <span className="badge-pill border-blue-400/30 bg-blue-500/10 text-blue-200">
                  Module {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {enrollmentError && (
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-100">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p className="text-sm font-semibold leading-6">{enrollmentError}</p>
          </div>
        )}

        {applicationMessage && (
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100">
            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
            <p className="text-sm font-semibold leading-6">{applicationMessage}</p>
          </div>
        )}

        {isFull ? (
          <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-300">Cohort at capacity</p>
                <h3 className="text-2xl font-black text-white sm:text-3xl">This learning cohort is full.</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                  We are keeping this group focused so every learner gets proper attention. Try again when the next cohort opens, or apply for a priority seat if your timing is urgent.
                </p>
                {typeof enrollmentStatus?.limit === 'number' && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                    {enrollmentStatus.enrolledCount ?? enrollmentStatus.limit}/{enrollmentStatus.limit} seats filled
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={() => setShowApplication(prev => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-100"
                >
                  Apply for a Seat <Send size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
                >
                  View Plans <ArrowRight size={17} />
                </button>
              </div>
            </div>

            {showApplication && (
              <form onSubmit={handleApplicationSubmit} className="mt-8 grid gap-4 border-t border-white/10 pt-8">
                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="lg:col-span-2">
                    <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Why do you need a seat?</span>
                    <textarea
                      value={applicationForm.goal}
                      onChange={event => setApplicationForm(prev => ({ ...prev, goal: event.target.value }))}
                      className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                      placeholder="Tell us your learning goal or timeline."
                      maxLength={500}
                    />
                  </label>
                  <div className="grid gap-4">
                    <label>
                      <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Availability</span>
                      <input
                        value={applicationForm.availability}
                        onChange={event => setApplicationForm(prev => ({ ...prev, availability: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                        placeholder="Weekdays, weekends..."
                        maxLength={200}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Best contact</span>
                      <input
                        value={applicationForm.contactPreference}
                        onChange={event => setApplicationForm(prev => ({ ...prev, contactPreference: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                        placeholder="Email, WhatsApp, phone..."
                        maxLength={120}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingApplication}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmittingApplication ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {isSubmittingApplication ? 'Sending...' : 'Send Application'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <button
            onClick={handleStartCourse}
            disabled={isStarting}
            className="glow-button glow-button-blue mt-12 flex w-full items-center justify-center gap-2 py-4 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isStarting ? <Loader2 className="animate-spin" size={20} /> : null}
            {isStarting ? 'Starting...' : 'Start Course →'}
          </button>
        )}
      </div>
    </section>
  );
}

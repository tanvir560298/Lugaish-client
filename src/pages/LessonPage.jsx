import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ListVideo,
  LoaderCircle,
  Mic,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Trash2,
  UsersRound,
  Video,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAppContext, getPathFromState } from '../state/AppContext.jsx';
import { ROLES } from '../utils/roles.js';

function formatDuration(minutes) {
  const value = Number(minutes) || 0;
  if (value < 60) return `${value} min`;

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function getModuleForm(lesson, staticLesson, day) {
  return {
    moduleType: lesson?.moduleType ?? 'video',
    published: lesson?.modulePublished !== false,
    title: lesson?.title ?? staticLesson?.title ?? `Day ${day} learning session`,
    description: lesson?.description ?? staticLesson?.description ?? '',
    introTitle: lesson?.moduleIntroTitle ?? '',
    introText: lesson?.moduleIntroText ?? '',
  };
}

function VideoPlaceholder({ isWebDeveloper }) {
  return (
    <div className="grid aspect-video place-items-center border border-white/10 bg-slate-950/70 text-center">
      <div className="max-w-sm px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
          <Video size={30} />
        </div>
        <h2 className="mt-5 text-2xl font-black text-white">Lesson video coming soon</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {isWebDeveloper
            ? 'Add the first YouTube lesson below to make it available here.'
            : 'Your learning team is preparing the video playlist for this lesson.'}
        </p>
      </div>
    </div>
  );
}

function ModuleTypePanel({ lesson, language, day, isWebDeveloper, navigate }) {
  const type = lesson.moduleType ?? 'video';

  if (type === 'ai_practice') {
    return (
      <div className="section-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"><Mic size={25} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">AI practice session</p>
              <h2 className="mt-1 text-2xl font-black text-white">{lesson.moduleIntroTitle || 'Ready to practise aloud?'}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {lesson.moduleIntroText || 'Listen to each question, answer by microphone, review your transcript, and receive instant keyword feedback.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {isWebDeveloper && (
              <button type="button" onClick={() => navigate(`/speaking-practice?language=${language}&day=${day}&manage=1`)} className="glow-button glow-button-muted py-4">
                <Settings2 size={18} /> Manage questions
              </button>
            )}
            <button type="button" onClick={() => navigate(`/speaking-practice?language=${language}&day=${day}`)} className="glow-button glow-button-blue py-4">
              <Mic size={18} /> {isWebDeveloper ? 'Preview practice' : 'Start practice'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'interview') {
    return (
      <div className="section-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-200"><UsersRound size={25} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-300">Interview session</p>
              <h2 className="mt-1 text-2xl font-black text-white">{lesson.moduleIntroTitle || 'Join the interview queue'}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {lesson.moduleIntroText || 'Receive your room and serial, then wait respectfully until it is your turn.'}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => navigate(`/interview?language=${language}&day=${day}`)} className="glow-button glow-button-blue py-4">
            <UsersRound size={18} /> Open interview
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export function LessonPage() {
  const { state, courseData } = useAppContext();
  const pathway = getPathFromState(state, courseData);
  const navigate = useNavigate();
  const { day: dayParam = '1' } = useParams();
  const [searchParams] = useSearchParams();
  const day = Math.max(Number.parseInt(dayParam, 10) || 1, 1);
  const language = state.activePathway;
  const isWebDeveloper = state.userRole === ROLES.webDeveloper;
  const staticLessons = useMemo(() => pathway.modules.flatMap(module => module.lessons), [pathway]);
  const staticLesson = staticLessons[day - 1] ?? null;
  const [lesson, setLesson] = useState({ videos: [], moduleType: 'video', modulePublished: true });
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [videoForm, setVideoForm] = useState({ title: '', youtubeUrl: '', durationMinutes: '' });
  const [isVideoSaving, setIsVideoSaving] = useState(false);
  const [videoMessage, setVideoMessage] = useState('');
  const [isVideoCompleting, setIsVideoCompleting] = useState(false);
  const [videoCompletionMessage, setVideoCompletionMessage] = useState('');
  const [moduleForm, setModuleForm] = useState(() => getModuleForm(null, staticLesson, day));
  const [isModuleSaving, setIsModuleSaving] = useState(false);
  const [moduleMessage, setModuleMessage] = useState('');
  const [configurationOpen, setConfigurationOpen] = useState(searchParams.get('configure') === '1');

  useEffect(() => {
    if (searchParams.get('configure') === '1' && isWebDeveloper) setConfigurationOpen(true);
  }, [isWebDeveloper, searchParams]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError('');
    setVideoMessage('');
    setVideoCompletionMessage('');
    setIsVideoCompleting(false);
    setModuleMessage('');

    api.getLesson(language, day)
      .then(data => {
        if (ignore) return;
        const videos = Array.isArray(data.videos) ? data.videos : [];
        const normalizedLesson = { ...data, videos, moduleType: data.moduleType ?? 'video', modulePublished: data.modulePublished !== false };
        setLesson(normalizedLesson);
        setModuleForm(getModuleForm(normalizedLesson, staticLesson, day));
        setSelectedVideoId(current => videos.some(video => video._id === current) ? current : videos[0]?._id ?? '');
      })
      .catch(requestError => {
        if (ignore) return;
        if (isWebDeveloper && requestError.status === 404) {
          const draftLesson = { videos: [], moduleType: 'video', modulePublished: false, title: '', description: '', moduleIntroTitle: '', moduleIntroText: '' };
          setLesson(draftLesson);
          setModuleForm(getModuleForm(draftLesson, staticLesson, day));
          setSelectedVideoId('');
          return;
        }
        setError(requestError.message || 'Could not load this learning day.');
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [day, isWebDeveloper, language, reloadKey, staticLesson]);

  const selectedVideo = lesson.videos.find(video => video._id === selectedVideoId) ?? lesson.videos[0];
  const moduleType = lesson.moduleType ?? 'video';
  const title = lesson.title || staticLesson?.title || `Day ${day} learning session`;
  const description = lesson.description || staticLesson?.description || 'Follow the course team\'s plan for this day.';

  const submitVideo = async event => {
    event.preventDefault();
    setIsVideoSaving(true);
    setVideoMessage('');

    try {
      const response = await api.addLessonVideo(language, day, {
        ...videoForm,
        durationMinutes: Number(videoForm.durationMinutes),
        lessonTitle: moduleForm.title || title,
        lessonDescription: moduleForm.description || description,
      });
      const videos = response.lesson?.videos ?? [];
      setLesson(response.lesson);
      setSelectedVideoId(videos[videos.length - 1]?._id ?? '');
      setVideoForm({ title: '', youtubeUrl: '', durationMinutes: '' });
      setVideoMessage('Video added to this day.');
    } catch (requestError) {
      setVideoMessage(requestError.message || 'Could not add the video.');
    } finally {
      setIsVideoSaving(false);
    }
  };

  const removeVideo = async videoId => {
    setVideoMessage('');

    try {
      const response = await api.deleteLessonVideo(language, day, videoId);
      const videos = response.lesson?.videos ?? [];
      setLesson(response.lesson);
      setSelectedVideoId(current => current === videoId ? videos[0]?._id ?? '' : current);
      setVideoMessage('Video removed from this day.');
    } catch (requestError) {
      setVideoMessage(requestError.message || 'Could not remove the video.');
    }
  };

  const completeVideoDay = async () => {
    if (isWebDeveloper || moduleType !== 'video' || !lesson.videos.length) return;

    setIsVideoCompleting(true);
    setVideoCompletionMessage('');
    try {
      await api.completeLesson({ language, day });
      setVideoCompletionMessage('Video day complete. Opening your next scheduled learning box...');
      window.setTimeout(() => navigate('/daily-lessons'), 650);
    } catch (requestError) {
      setVideoCompletionMessage(requestError.message || 'The video day could not be marked complete. Please try again.');
      setIsVideoCompleting(false);
    }
  };

  const saveModule = async event => {
    event.preventDefault();
    if (!moduleForm.title.trim()) {
      setModuleMessage('Add a title before saving this day.');
      return;
    }

    setIsModuleSaving(true);
    setModuleMessage('');
    try {
      const response = await api.updateDayModule(language, day, {
        ...moduleForm,
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim(),
        introTitle: moduleForm.introTitle.trim(),
        introText: moduleForm.introText.trim(),
      });
      const savedModule = response.module;
      const updatedLesson = {
        ...lesson,
        title: savedModule.title,
        description: savedModule.description,
        moduleType: savedModule.moduleType,
        modulePublished: savedModule.published,
        moduleIntroTitle: savedModule.introTitle,
        moduleIntroText: savedModule.introText,
        speakingQuestions: savedModule.questions ?? [],
      };
      setLesson(updatedLesson);
      setModuleForm(getModuleForm(updatedLesson, staticLesson, day));
      setModuleMessage(response.message || 'Day settings saved.');
    } catch (requestError) {
      setModuleMessage(requestError.message || 'Could not save this day.');
    } finally {
      setIsModuleSaving(false);
    }
  };

  return (
    <section className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">{pathway.title} · Day {day}</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isWebDeveloper && (
            <button type="button" onClick={() => setConfigurationOpen(open => !open)} className="glow-button glow-button-muted">
              <Settings2 size={18} /> {configurationOpen ? 'Close setup' : 'Configure day'}
            </button>
          )}
          <button type="button" className="glow-button glow-button-muted" onClick={() => navigate('/daily-lessons')}>
            <ArrowLeft size={18} /> Daily lessons
          </button>
        </div>
      </div>

      {isWebDeveloper && configurationOpen && (
        <div className="section-card p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"><Settings2 size={21} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Web Developer course setup</p>
              <h2 className="mt-1 text-xl font-black text-white">Choose what learners receive on Day {day}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Publish only when this day is ready. Learners receive one module type, not a separate practice button.</p>
            </div>
          </div>

          <form onSubmit={saveModule} className="mt-6 grid gap-5">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Day format</span>
                <select
                  value={moduleForm.moduleType}
                  onChange={event => {
                    const nextType = event.target.value;
                    setModuleForm(current => ({
                      ...current,
                      moduleType: nextType,
                      // A newly converted AI day starts as a private draft so
                      // questions can be added before learners see anything.
                      published: nextType === 'ai_practice' && lesson.moduleType !== 'ai_practice' && !lesson.speakingQuestions?.length
                        ? false
                        : current.published,
                    }));
                  }}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none focus:border-emerald-400/50"
                >
                  <option value="video">Video lesson</option>
                  <option value="ai_practice">AI speaking practice</option>
                  <option value="interview">Interview session</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Learner-facing title</span>
                <input required maxLength={160} value={moduleForm.title} onChange={event => setModuleForm(current => ({ ...current, title: event.target.value }))} placeholder="Day title" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Day description</span>
              <textarea maxLength={2000} rows={3} value={moduleForm.description} onChange={event => setModuleForm(current => ({ ...current, description: event.target.value }))} placeholder="Explain what the learner will do today." className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50" />
            </label>

            {(moduleForm.moduleType === 'ai_practice' || moduleForm.moduleType === 'interview') && (
              <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <p className="text-xs font-black uppercase tracking-widest text-blue-300">Opening message before learners begin</p>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Heading</span>
                  <input maxLength={160} value={moduleForm.introTitle} onChange={event => setModuleForm(current => ({ ...current, introTitle: event.target.value }))} placeholder="For example: Your speaking warm-up" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Instructions</span>
                  <textarea maxLength={2000} rows={4} value={moduleForm.introText} onChange={event => setModuleForm(current => ({ ...current, introText: event.target.value }))} placeholder="Tell learners what to do before they begin." className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50" />
                </label>
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm text-slate-300">
              <input type="checkbox" checked={moduleForm.published} onChange={event => setModuleForm(current => ({ ...current, published: event.target.checked }))} className="mt-1 h-4 w-4 accent-emerald-400" />
              <span><strong className="text-white">Publish this day for learners</strong><br />An AI practice day needs at least one saved question before it can be published.</span>
            </label>

            {moduleMessage && <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{moduleMessage}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={isModuleSaving} className="glow-button glow-button-blue disabled:cursor-wait disabled:opacity-60">
                {isModuleSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />} {isModuleSaving ? 'Saving day...' : 'Save day setup'}
              </button>
              {lesson.moduleType === 'ai_practice' && (
                <button type="button" onClick={() => navigate(`/speaking-practice?language=${language}&day=${day}&manage=1`)} className="glow-button glow-button-muted">
                  <Mic size={18} /> Manage AI questions
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {error ? (
        <div className="section-card flex min-h-72 flex-col items-center justify-center p-8 text-center">
          <RefreshCw size={34} className="text-amber-300" />
          <h2 className="mt-4 text-xl font-black text-white">This learning day could not load</h2>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <button type="button" onClick={() => setReloadKey(value => value + 1)} className="glow-button glow-button-muted mt-6"><RefreshCw size={17} /> Retry</button>
        </div>
      ) : isLoading ? (
        <div className="section-card grid min-h-72 place-items-center"><LoaderCircle size={34} className="animate-spin text-slate-400" /></div>
      ) : moduleType !== 'video' ? (
        <ModuleTypePanel lesson={lesson} language={language} day={day} isWebDeveloper={isWebDeveloper} navigate={navigate} />
      ) : (
        <>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl shadow-black/20">
              {selectedVideo ? (
                <iframe
                  key={selectedVideo.youtubeId}
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : <VideoPlaceholder isWebDeveloper={isWebDeveloper} />}

              {selectedVideo && (
                <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{selectedVideo.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"><Clock3 size={14} />{formatDuration(selectedVideo.durationMinutes)}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-300"><Video size={17} /> YouTube lesson</span>
                </div>
              )}
            </div>

            <aside className="overflow-hidden rounded-lg border border-white/10 bg-slate-900/70">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-2"><ListVideo size={19} className="text-emerald-300" /><h2 className="font-black text-white">Lesson playlist</h2></div>
                <span className="text-xs font-black text-slate-400">{lesson.videos.length} videos</span>
              </div>
              <div className="max-h-[34rem] space-y-2 overflow-y-auto p-3">
                {lesson.videos.length ? lesson.videos.map((video, index) => {
                  const isSelected = video._id === selectedVideo?._id;
                  return (
                    <div key={video._id} className={`group flex gap-3 rounded-lg border p-2 transition ${isSelected ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]'}`}>
                      <button type="button" onClick={() => setSelectedVideoId(video._id)} className="flex min-w-0 flex-1 gap-3 text-left">
                        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-slate-950">
                          <img src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
                          <span className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-950"><Play size={14} fill="currentColor" /></span></span>
                        </div>
                        <span className="min-w-0 py-1"><span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Video {index + 1}</span><span className="mt-1 line-clamp-2 block text-sm font-bold leading-5 text-white">{video.title}</span><span className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400"><Clock3 size={12} /> {formatDuration(video.durationMinutes)}</span></span>
                      </button>
                      {isWebDeveloper && <button type="button" title="Remove video" aria-label={`Remove ${video.title}`} onClick={() => removeVideo(video._id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-red-400/10 hover:text-red-300"><Trash2 size={16} /></button>}
                    </div>
                  );
                }) : <div className="px-4 py-12 text-center text-sm leading-6 text-slate-400">The playlist is empty. Videos added by the learning team will appear here.</div>}
              </div>
            </aside>
          </div>

          {!isWebDeveloper && lesson.videos.length > 0 && (
            <div className="section-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Daily progress</p>
                <h2 className="mt-2 text-xl font-black text-white">Finished today&apos;s video lesson?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Mark this video day complete to unlock the next learning format chosen by your course team.</p>
                {videoCompletionMessage && <p role="status" className="mt-3 text-sm font-semibold text-emerald-200">{videoCompletionMessage}</p>}
              </div>
              <button type="button" onClick={completeVideoDay} disabled={isVideoCompleting} className="glow-button glow-button-blue shrink-0 py-4 disabled:cursor-wait disabled:opacity-60">
                {isVideoCompleting ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {isVideoCompleting ? 'Finishing day...' : 'Finish video day'}
              </button>
            </div>
          )}

          {isWebDeveloper && (
            <div className="section-card p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300"><Video size={22} /></div>
                <div><p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Lesson management</p><h2 className="mt-1 text-xl font-black text-white">Add a YouTube video</h2></div>
              </div>
              <form onSubmit={submitVideo} className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr_160px_auto] lg:items-end">
                <label className="block"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Topic</span><input required maxLength={120} value={videoForm.title} onChange={event => setVideoForm(current => ({ ...current, title: event.target.value }))} placeholder="Pronunciation practice" className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50" /></label>
                <label className="block"><span className="text-xs font-black uppercase tracking-widest text-slate-400">YouTube link</span><input required type="url" value={videoForm.youtubeUrl} onChange={event => setVideoForm(current => ({ ...current, youtubeUrl: event.target.value }))} placeholder="https://youtu.be/..." className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50" /></label>
                <label className="block"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Duration (min)</span><input required type="number" min="1" max="600" value={videoForm.durationMinutes} onChange={event => setVideoForm(current => ({ ...current, durationMinutes: event.target.value }))} placeholder="12" className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50" /></label>
                <button type="submit" disabled={isVideoSaving} className="glow-button glow-button-blue min-h-12 justify-center disabled:cursor-wait disabled:opacity-60">{isVideoSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />} Add video</button>
              </form>
              {videoMessage && <p className="mt-4 text-sm font-semibold text-slate-300">{videoMessage}</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}

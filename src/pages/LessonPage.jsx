import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock3, ListVideo, LoaderCircle, Play, Plus, RefreshCw, Trash2, Video } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAppContext, getPathFromState } from '../state/AppContext.jsx';
import { hasPermission } from '../utils/roles.js';

function formatDuration(minutes) {
  const value = Number(minutes) || 0;
  if (value < 60) return `${value} min`;

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function VideoPlaceholder({ canManageLessons }) {
  return (
    <div className="grid aspect-video place-items-center border border-white/10 bg-slate-950/70 text-center">
      <div className="max-w-sm px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
          <Video size={30} />
        </div>
        <h2 className="mt-5 text-2xl font-black text-white">Lesson video coming soon</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {canManageLessons
            ? 'Add the first YouTube lesson below to make it available here.'
            : 'Your learning team is preparing the video playlist for this lesson.'}
        </p>
      </div>
    </div>
  );
}

export function LessonPage() {
  const { state, courseData } = useAppContext();
  const pathway = getPathFromState(state, courseData);
  const navigate = useNavigate();
  const { day: dayParam = '1' } = useParams();
  const day = Math.max(Number.parseInt(dayParam, 10) || 1, 1);
  const language = state.activePathway;
  const canManageLessons = hasPermission(state.userRole, 'manage_lessons');
  const staticLessons = useMemo(
    () => pathway.modules.flatMap(module => module.lessons),
    [pathway],
  );
  const staticLesson = staticLessons[day - 1] ?? staticLessons[0];
  const [lesson, setLesson] = useState({ videos: [] });
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState({ title: '', youtubeUrl: '', durationMinutes: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError('');

    api.getLesson(language, day)
      .then(data => {
        if (ignore) return;
        const videos = Array.isArray(data.videos) ? data.videos : [];
        setLesson({ ...data, videos });
        setSelectedVideoId(current => (
          videos.some(video => video._id === current) ? current : videos[0]?._id ?? ''
        ));
      })
      .catch(requestError => {
        if (!ignore) setError(requestError.message || 'Could not load lesson videos.');
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [day, language, reloadKey]);

  const selectedVideo = lesson.videos.find(video => video._id === selectedVideoId) ?? lesson.videos[0];

  const submitVideo = async event => {
    event.preventDefault();
    setIsSaving(true);
    setFormMessage('');

    try {
      const response = await api.addLessonVideo(language, day, {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        lessonTitle: staticLesson?.title,
        lessonDescription: staticLesson?.description,
      });
      const videos = response.lesson?.videos ?? [];
      setLesson(response.lesson);
      setSelectedVideoId(videos[videos.length - 1]?._id ?? '');
      setForm({ title: '', youtubeUrl: '', durationMinutes: '' });
      setFormMessage('Video added to the lesson.');
    } catch (requestError) {
      setFormMessage(requestError.message || 'Could not add the video.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeVideo = async videoId => {
    setFormMessage('');

    try {
      const response = await api.deleteLessonVideo(language, day, videoId);
      const videos = response.lesson?.videos ?? [];
      setLesson(response.lesson);
      setSelectedVideoId(current => (current === videoId ? videos[0]?._id ?? '' : current));
      setFormMessage('Video removed from the lesson.');
    } catch (requestError) {
      setFormMessage(requestError.message || 'Could not remove the video.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
            {pathway.title} - Day {day}
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            {staticLesson?.title ?? lesson.title ?? `Lesson ${day}`}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
            {staticLesson?.description ?? lesson.description ?? 'Watch the lesson videos and practice at your own pace.'}
          </p>
        </div>
        <button type="button" className="glow-button glow-button-muted" onClick={() => navigate('/daily-lessons')}>
          <ArrowLeft size={18} />
          Daily lessons
        </button>
      </div>

      {error ? (
        <div className="section-card flex min-h-72 flex-col items-center justify-center p-8 text-center">
          <RefreshCw size={34} className="text-amber-300" />
          <h2 className="mt-4 text-xl font-black text-white">Lesson videos could not load</h2>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <button type="button" onClick={() => setReloadKey(value => value + 1)} className="glow-button glow-button-muted mt-6">
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl shadow-black/20">
            {isLoading ? (
              <div className="grid aspect-video place-items-center text-slate-400">
                <LoaderCircle size={34} className="animate-spin" />
              </div>
            ) : selectedVideo ? (
              <iframe
                key={selectedVideo.youtubeId}
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <VideoPlaceholder canManageLessons={canManageLessons} />
            )}

            {selectedVideo && (
              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-black text-white">{selectedVideo.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <Clock3 size={14} />
                    {formatDuration(selectedVideo.durationMinutes)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-300">
                  <Video size={17} /> YouTube lesson
                </span>
              </div>
            )}
          </div>

          <aside className="overflow-hidden rounded-lg border border-white/10 bg-slate-900/70">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-2">
                <ListVideo size={19} className="text-emerald-300" />
                <h2 className="font-black text-white">Lesson playlist</h2>
              </div>
              <span className="text-xs font-black text-slate-400">{lesson.videos.length} videos</span>
            </div>

            <div className="max-h-[34rem] space-y-2 overflow-y-auto p-3">
              {lesson.videos.length ? lesson.videos.map((video, index) => {
                const isSelected = video._id === selectedVideo?._id;
                return (
                  <div
                    key={video._id}
                    className={`group flex gap-3 rounded-lg border p-2 transition ${isSelected ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]'}`}
                  >
                    <button type="button" onClick={() => setSelectedVideoId(video._id)} className="flex min-w-0 flex-1 gap-3 text-left">
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-slate-950">
                        <img
                          src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-black/25">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-950">
                            <Play size={14} fill="currentColor" />
                          </span>
                        </span>
                      </div>
                      <span className="min-w-0 py-1">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Video {index + 1}</span>
                        <span className="mt-1 line-clamp-2 block text-sm font-bold leading-5 text-white">{video.title}</span>
                        <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Clock3 size={12} /> {formatDuration(video.durationMinutes)}
                        </span>
                      </span>
                    </button>
                    {canManageLessons && (
                      <button
                        type="button"
                        title="Remove video"
                        aria-label={`Remove ${video.title}`}
                        onClick={() => removeVideo(video._id)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-red-400/10 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              }) : (
                <div className="px-4 py-12 text-center text-sm leading-6 text-slate-400">
                  The playlist is empty. Videos added by the learning team will appear here.
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {canManageLessons && (
        <div className="section-card p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Lesson management</p>
              <h2 className="mt-1 text-xl font-black text-white">Add a YouTube video</h2>
            </div>
          </div>

          <form onSubmit={submitVideo} className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr_160px_auto] lg:items-end">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Topic</span>
              <input
                required
                maxLength={120}
                value={form.title}
                onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
                placeholder="Pronunciation practice"
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">YouTube link</span>
              <input
                required
                type="url"
                value={form.youtubeUrl}
                onChange={event => setForm(current => ({ ...current, youtubeUrl: event.target.value }))}
                placeholder="https://youtu.be/..."
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Duration (min)</span>
              <input
                required
                type="number"
                min="1"
                max="600"
                value={form.durationMinutes}
                onChange={event => setForm(current => ({ ...current, durationMinutes: event.target.value }))}
                placeholder="12"
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>
            <button type="submit" disabled={isSaving} className="glow-button glow-button-blue min-h-12 justify-center disabled:cursor-wait disabled:opacity-60">
              {isSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />}
              Add video
            </button>
          </form>

          {formMessage && <p className="mt-4 text-sm font-semibold text-slate-300">{formMessage}</p>}
        </div>
      )}
    </section>
  );
}

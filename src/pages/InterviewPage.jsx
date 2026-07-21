import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, ExternalLink, Loader2, Mail, UsersRound, Video } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';

function formatTime(value) {
  if (!value) return 'Just now';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function statusTone(status) {
  if (status === 'done') return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100';
  if (status === 'skipped') return 'border-amber-400/30 bg-amber-500/10 text-amber-100';
  return 'border-blue-400/30 bg-blue-500/10 text-blue-100';
}

function QueueEntryRow({ entry, canManageQueue, onStatusChange, isUpdating }) {
  return (
    <div className="grid gap-4 border-t border-white/10 px-4 py-4 lg:grid-cols-[84px_1fr_0.75fr_220px] lg:items-center">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Serial</p>
        <p className="mt-1 text-xl font-black text-white">#{entry.roomSerial}</p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-white">{entry.name || 'Learner'}</p>
        <p className="truncate text-xs font-semibold text-slate-500">{entry.email}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusTone(entry.status)}`}>
          {entry.status}
        </span>
        <span className="text-xs font-semibold text-slate-500">{formatTime(entry.joinedAt)}</span>
      </div>
      {canManageQueue && (
        <div className="grid grid-cols-3 gap-2">
          {['waiting', 'done', 'skipped'].map(status => (
            <button
              key={status}
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange(entry.id, status)}
              className={`rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition disabled:cursor-not-allowed disabled:opacity-50 ${
                entry.status === status
                  ? 'border-white/30 bg-white text-slate-950'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomPanel({ room, entries, canManageQueue, onStatusChange, updatingEntryId }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/50">
      <div className="flex flex-col gap-4 bg-white/[0.04] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">{room.roomName}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {room.assignedCount}/{room.capacity} assigned · {room.waitingCount} waiting
          </p>
        </div>
        <a
          href={room.meetUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10"
        >
          Open Meet <ExternalLink size={15} />
        </a>
      </div>

      {entries.length ? (
        entries.map(entry => (
          <QueueEntryRow
            key={entry.id}
            entry={entry}
            canManageQueue={canManageQueue}
            onStatusChange={onStatusChange}
            isUpdating={updatingEntryId === entry.id}
          />
        ))
      ) : (
        <div className="border-t border-white/10 px-4 py-5 text-sm font-semibold text-slate-500">
          No learners assigned to this room yet.
        </div>
      )}
    </div>
  );
}

export function InterviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedLanguage = searchParams.get('language');
  const requestedDay = Number(searchParams.get('day'));
  const hasScheduledContext = ['english', 'arabic'].includes(requestedLanguage)
    && Number.isInteger(requestedDay)
    && requestedDay > 0;
  const language = hasScheduledContext ? requestedLanguage : null;
  const day = hasScheduledContext ? requestedDay : null;
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [updatingEntryId, setUpdatingEntryId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadSession() {
    const data = await api.getWeeklyInterview({ language, day });
    setSession(data);
  }

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError('');
    setSession(null);

    if (!hasScheduledContext) {
      setIsLoading(false);
      return () => {
        ignore = true;
      };
    }

    api.getWeeklyInterview({ language, day })
      .then(data => {
        if (!ignore) setSession(data);
      })
      .catch(err => {
        if (!ignore) setError(err.message || 'Could not load the weekly interview session.');
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [day, hasScheduledContext, language]);

  const entriesByRoom = useMemo(() => {
    const grouped = {};
    (session?.entries ?? []).forEach(entry => {
      grouped[entry.roomIndex] = [...(grouped[entry.roomIndex] ?? []), entry];
    });
    return grouped;
  }, [session?.entries]);

  async function handleJoin() {
    if (!session?.canJoinInterview) return;
    setError('');
    setMessage('');
    setIsJoining(true);

    try {
      const response = await api.joinWeeklyInterview({ language, day });
      try {
        await api.completeLesson({ language, day });
        setMessage(`${response.message} This scheduled day is complete, so your next learning day is unlocked.`);
      } catch {
        setMessage(`${response.message} Your queue place is saved; course progress will refresh when the connection is available.`);
      }
      await loadSession();
      window.open(response.entry.meetUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err.message || 'Could not join the interview session.');
    } finally {
      setIsJoining(false);
    }
  }

  async function handleStatusChange(entryId, status) {
    setError('');
    setMessage('');
    setUpdatingEntryId(entryId);

    try {
      await api.updateInterviewStatus(entryId, { status });
      await loadSession();
      setMessage('Interview queue updated.');
    } catch (err) {
      setError(err.message || 'Could not update the queue.');
    } finally {
      setUpdatingEntryId('');
    }
  }

  if (!hasScheduledContext) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 pb-20">
        <div className="section-card p-8 text-center sm:p-12">
          <Video size={36} className="mx-auto text-amber-300" />
          <h1 className="mt-5 text-3xl font-black text-white">Choose a scheduled interview day</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Interview access is linked to a specific course day. Open it from Daily Lessons when your course team schedules an interview for you.</p>
          <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-blue mt-7"><ArrowLeft size={18} /> Daily lessons</button>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="grid min-h-[60svh] place-items-center">
        <Loader2 className="animate-spin text-blue-400" size={42} />
      </div>
    );
  }

  if (error && !session) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 pb-20">
        <div className="section-card p-8 text-center sm:p-12">
          <AlertCircle size={36} className="mx-auto text-amber-300" />
          <h1 className="mt-5 text-3xl font-black text-white">This interview session is not open yet</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Return to Daily Lessons and open the learning format assigned to your current course day.</p>
          <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{error}</p>
          <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-blue mt-7"><ArrowLeft size={18} /> Daily lessons</button>
        </div>
      </section>
    );
  }

  const ownEntry = session?.ownEntry;
  const canManageQueue = Boolean(session?.canManageQueue);
  const canJoinInterview = Boolean(session?.canJoinInterview);
  const dayModule = session?.dayModule;

  return (
    <section className="space-y-8 pb-20">
      <div className="-mx-4 border-b border-white/10 bg-gradient-to-br from-blue-950/50 via-slate-950 to-emerald-950/30 px-4 py-10 sm:-mx-6 sm:px-6 sm:py-14">
        <div className="app-shell grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
              <Video size={14} /> Day {dayModule?.day ?? day} · scheduled interview
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">{dayModule?.introTitle || dayModule?.title || 'Join the interview session.'}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {dayModule?.introText || dayModule?.description || 'Tap the button once to receive your room and serial. Please wait and be respectful to everyone while you wait for your serial.'}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Scheduled queue</p>
            <p className="mt-2 text-3xl font-black text-white">{session?.totalAssigned ?? 0}/{session?.totalCapacity ?? 100}</p>
            <p className="mt-1 text-sm font-semibold text-slate-400">learners assigned</p>
          </div>
        </div>
      </div>

      <div className="app-shell space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-100">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p className="text-sm font-semibold leading-6">{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100">
            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
            <p className="text-sm font-semibold leading-6">{message}</p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <aside className="space-y-6">
            <div className="section-card p-6 sm:p-8">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-200">
                <UsersRound size={24} />
              </div>
              <h2 className="mt-5 text-2xl font-black text-white">Your queue position</h2>
              {ownEntry ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{ownEntry.roomName}</p>
                    <p className="mt-2 text-5xl font-black text-white">#{ownEntry.roomSerial}</p>
                    <p className="mt-2 text-sm text-slate-400">Your serial inside this 25-person room.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overall</p>
                      <p className="mt-1 text-2xl font-black text-blue-100">#{ownEntry.globalSerial}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status</p>
                      <p className="mt-2 text-sm font-black uppercase text-emerald-200">{ownEntry.status}</p>
                    </div>
                  </div>
                  <a
                    href={ownEntry.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-blue-500"
                  >
                    Open Assigned Meet <ExternalLink size={17} />
                  </a>
                </div>
              ) : canJoinInterview ? (
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-6 text-slate-400">
                    You have not joined this week&apos;s interview queue yet. The system will assign you to the first available room.
                  </p>
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isJoining ? <Loader2 className="animate-spin" size={18} /> : <Video size={18} />}
                    {isJoining ? 'Assigning...' : 'Join scheduled interview'}
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] p-5 text-sm leading-6 text-blue-100">
                  Preview mode is active. Web Developers can review this scheduled interview day, but cannot join the learner queue.
                </div>
              )}
            </div>

            <div className="section-card p-6">
              <div className="flex items-start gap-3 text-slate-300">
                <Clock3 className="mt-1 shrink-0 text-emerald-300" size={20} />
                <p className="text-sm leading-6">
                  Please wait and be respectful to everyone while you wait for your serial.
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3 text-slate-300">
                <Mail className="mt-1 shrink-0 text-blue-300" size={20} />
                <p className="text-sm leading-6">
                  If you face any problem, contact <a className="font-black text-blue-200 underline-offset-4 hover:underline" href={`mailto:${session?.supportEmail ?? 'lugaish2026@gmail.com'}`}>{session?.supportEmail ?? 'lugaish2026@gmail.com'}</a>.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {canManageQueue ? (
              <>
                <div className="section-card p-6 sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Instructor queue</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Room-wise serial board</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Use this board beside Google Meet to call students by room serial. Mark learners done or skipped after each interview.
                  </p>
                </div>

                {(session?.rooms ?? []).map(room => (
                  <RoomPanel
                    key={room.roomIndex}
                    room={room}
                    entries={entriesByRoom[room.roomIndex] ?? []}
                    canManageQueue={canManageQueue}
                    onStatusChange={handleStatusChange}
                    updatingEntryId={updatingEntryId}
                  />
                ))}
              </>
            ) : (
              <div className="section-card p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">Room assignment</p>
                <h2 className="mt-2 text-2xl font-black text-white">How the weekly session works</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(session?.rooms ?? []).map(room => (
                    <div key={room.roomIndex} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h3 className="text-base font-black text-white">{room.roomName}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {room.assignedCount}/{room.capacity} learners assigned
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink, Link2, CheckCircle2, MonitorPlay, RotateCcw } from 'lucide-react';
import { htmlVideos } from '../learn/htmlContent.js';
import { youtubeId } from './workspaceState.js';
import { createYouTubeLoader, youtubePlayerErrorMessage } from '../classroom/youtubeApi.js';

let youtubeLoader;
function loadYouTubeApi() {
  youtubeLoader ||= createYouTubeLoader({ window, document, setTimeout, clearTimeout });
  return youtubeLoader();
}

export function VideoStudyPanel({ watched, onWatched }) {
  const initial = new URLSearchParams(window.location.search).get('lesson');
  const [selected, setSelected] = useState(htmlVideos.find(item => item.id === initial) || htmlVideos[0]);
  const [custom, setCustom] = useState(''), [error, setError] = useState(''), [loaded, setLoaded] = useState(false), [playerError, setPlayerError] = useState(''), [attempt, setAttempt] = useState(0), [playerStatus, setPlayerStatus] = useState('');
  const playerHost = useRef(null);
  function choose(video) { setSelected(video); setLoaded(false); setError(''); setPlayerError(''); setPlayerStatus(''); setAttempt(0); }
  useEffect(() => {
    if (!loaded) return undefined;
    let cancelled = false, player, readyTimer;
    setPlayerError(''); setPlayerStatus('Connecting to YouTube…');
    const fail = message => {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(readyTimer); setPlayerStatus(''); setPlayerError(message);
      try { player?.destroy(); } catch { /* Player may not have initialized. */ }
    };
    loadYouTubeApi().then(YT => {
      if (cancelled || !playerHost.current) return;
      const mount = document.createElement('div');
      playerHost.current.replaceChildren(mount);
      player = new YT.Player(mount, {
        width: '100%', height: '100%', videoId: selected.youtubeId,
        playerVars: { playsinline: 1, rel: 0 },
        events: {
          onReady: event => { if (!cancelled) { clearTimeout(readyTimer); event.target.getIframe()?.setAttribute('title', `Study video: ${selected.title}`); setPlayerStatus(''); } },
          onError: event => fail(youtubePlayerErrorMessage(event.data)),
        },
      });
      readyTimer = setTimeout(() => fail('YouTube is taking too long to respond. Check your connection, retry, or open the source on YouTube.'), 20000);
    }).catch(cause => fail(cause.message || 'YouTube could not load. Check your connection and retry.'));
    return () => { cancelled = true; clearTimeout(readyTimer); try { player?.destroy(); } catch { /* Ignore teardown during navigation. */ } };
  }, [loaded, selected.youtubeId, attempt]);
  function addVideo(event) {
    event.preventDefault();
    const id = youtubeId(custom);
    if (!id) { setError('Enter a valid HTTPS YouTube video link, such as https://www.youtube.com/watch?v=…'); return; }
    choose({ id: `personal-${id}`, youtubeId: id, title: 'Your study video', url: `https://www.youtube.com/watch?v=${id}`, personal: true });
  }
  return <section className="lr-card lr-video" aria-labelledby="lr-video-title">
    <div className="lr-card-heading"><div><span className="lr-eyebrow">YOUR PERSONAL LEARNING SCREEN</span><h2 id="lr-video-title">{selected.title}</h2></div><span className="lr-chip">{selected.personal ? 'Your video' : 'HTML · Bangla'}</span></div>
    <div className="lr-video-screen">{loaded ? <div className="lr-video-player-shell"><div className="lr-video-player-host" ref={playerHost}/>{playerStatus && <p className="lr-video-status" role="status">{playerStatus}</p>}{playerError && <div className="lr-video-prompt lr-video-error" role="alert"><MonitorPlay size={36}/><strong>Video unavailable here</strong><p>{playerError}</p><button className="lr-button lr-primary" onClick={() => { setPlayerError(''); setAttempt(value => value + 1); }}><RotateCcw size={15}/> Retry player</button><a className="lr-text-link" href={selected.url} target="_blank" rel="noopener noreferrer">Open on YouTube <ExternalLink size={14}/></a></div>}</div> : <div className="lr-video-prompt"><MonitorPlay size={40}/><strong>A little watching. A lot of learning.</strong><p>Load the player when you’re ready. No autoplay.</p><button className="lr-button lr-primary" onClick={() => setLoaded(true)}><Play size={16}/> Load lesson player</button><small>Loading connects to YouTube. If playback is unavailable here, you can open the source below.</small></div>}</div>
    <div className="lr-video-controls"><a className="lr-text-link" href={selected.url} target="_blank" rel="noopener noreferrer">Open on YouTube <ExternalLink size={14}/></a>{!selected.personal && <button className="lr-button" aria-pressed={watched.includes(selected.id)} onClick={() => onWatched(selected.id)}><CheckCircle2 size={15}/>{watched.includes(selected.id) ? 'Marked studied' : 'Mark as studied'}</button>}</div>
    <details className="lr-playlist"><summary>Free Web Development lessons <span>{watched.length} / {htmlVideos.length} marked studied</span></summary><div>{htmlVideos.map(video => <button key={video.id} aria-pressed={selected.id === video.id} onClick={() => choose(video)}><span>{watched.includes(video.id) ? <CheckCircle2 size={15}/> : video.id}</span><span>{video.title}</span><Play size={13}/></button>)}</div></details>
    <form className="lr-own-video" onSubmit={addVideo}><label htmlFor="lr-video-url"><Link2 size={15}/> Learning something else? Bring your own video.</label><div><input id="lr-video-url" type="url" value={custom} onChange={event => setCustom(event.target.value)} placeholder="Paste a YouTube video link" required maxLength={2048}/><button className="lr-button" type="submit">Use video</button></div>{error && <p className="lr-error" role="alert">{error}</p>}</form>
    <p className="lr-fine">Study marks are saved in this browser only. They do not sync across devices or award course credit or certificates.</p>
  </section>;
}

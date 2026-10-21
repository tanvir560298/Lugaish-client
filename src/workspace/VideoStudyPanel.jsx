import { useState } from 'react';
import { Play, ExternalLink, Link2, CheckCircle2, MonitorPlay } from 'lucide-react';
import { htmlVideos } from '../learn/htmlContent.js';
import { youtubeId } from './workspaceState.js';

export function VideoStudyPanel({ watched, onWatched }) {
  const initial = new URLSearchParams(window.location.search).get('lesson');
  const [selected, setSelected] = useState(htmlVideos.find(item => item.id === initial) || htmlVideos[0]);
  const [custom, setCustom] = useState(''), [error, setError] = useState(''), [loaded, setLoaded] = useState(false);
  function choose(video) { setSelected(video); setLoaded(false); setError(''); }
  function addVideo(event) {
    event.preventDefault();
    const id = youtubeId(custom);
    if (!id) { setError('Enter a valid HTTPS YouTube video link, such as https://www.youtube.com/watch?v=…'); return; }
    choose({ id: `personal-${id}`, youtubeId: id, title: 'Your study video', url: `https://www.youtube.com/watch?v=${id}`, personal: true });
  }
  return <section className="lr-card lr-video" aria-labelledby="lr-video-title">
    <div className="lr-card-heading"><div><span className="lr-eyebrow">YOUR PERSONAL LEARNING SCREEN</span><h2 id="lr-video-title">{selected.title}</h2></div><span className="lr-chip">{selected.personal ? 'Your video' : 'HTML · Bangla'}</span></div>
    <div className="lr-video-screen">{loaded ? <iframe key={selected.youtubeId} src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?playsinline=1&rel=0`} title={`Study video: ${selected.title}`} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <div className="lr-video-prompt"><MonitorPlay size={40}/><strong>A little watching. A lot of learning.</strong><p>Load the player when you’re ready. No autoplay.</p><button className="lr-button lr-primary" onClick={() => setLoaded(true)}><Play size={16}/> Load lesson player</button><small>Loading connects to YouTube. You can also open the source below.</small></div>}</div>
    <div className="lr-video-controls"><a className="lr-text-link" href={selected.url} target="_blank" rel="noopener noreferrer">Open on YouTube <ExternalLink size={14}/></a>{!selected.personal && <button className="lr-button" aria-pressed={watched.includes(selected.id)} onClick={() => onWatched(selected.id)}><CheckCircle2 size={15}/>{watched.includes(selected.id) ? 'Marked studied' : 'Mark as studied'}</button>}</div>
    <details className="lr-playlist"><summary>Free Web Development lessons <span>{watched.length} / {htmlVideos.length} marked studied</span></summary><div>{htmlVideos.map(video => <button key={video.id} aria-pressed={selected.id === video.id} onClick={() => choose(video)}><span>{watched.includes(video.id) ? <CheckCircle2 size={15}/> : video.id}</span><span>{video.title}</span><Play size={13}/></button>)}</div></details>
    <form className="lr-own-video" onSubmit={addVideo}><label htmlFor="lr-video-url"><Link2 size={15}/> Learning something else? Bring your own video.</label><div><input id="lr-video-url" type="url" value={custom} onChange={event => setCustom(event.target.value)} placeholder="Paste a YouTube video link" required maxLength={2048}/><button className="lr-button" type="submit">Use video</button></div>{error && <p className="lr-error" role="alert">{error}</p>}</form>
    <p className="lr-fine">Study marks are your own browser-saved checklist. They do not award course credit or certificates.</p>
  </section>;
}

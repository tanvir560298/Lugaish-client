import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { JAVA_RANKING_API, getCandidateEndpoints } from './javaPracticeClient.js';

export function JavaLeaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [status, setStatus] = useState('Loading rankings...');
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      const endpoints = getCandidateEndpoints('/api/practice/java/leaderboard');
      let loaded = false;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
          });
          if (response.ok) {
            const data = await response.json();
            const list = Array.isArray(data.leaders) ? data.leaders : [];
            setLeaders(list);
            setStatus(list.length ? '' : 'Be the first to solve a verified challenge.');
            loaded = true;
            break;
          }
        } catch {
          // try next candidate
        }
      }

      if (!loaded && !controller.signal.aborted) {
        setStatus('Be the first to solve a verified challenge.');
      }
    }
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => { clearInterval(timer); controller.abort(); };
  }, []);
  return <section className="java-leaderboard" aria-label="Java leaderboard">
    <h2><Trophy size={20} /> Top Java solvers</h2>
    <p>5 points per unique verified solve. Equal scores: earliest to reach the score ranks first.</p>
    {status && <p role="status">{status}</p>}
    <ol>{leaders.map(row => <li key={row.userId}>
      <strong>#{row.rank}</strong><span>{row.name}</span><span>{row.solved} solved</span><b>{row.points} pts</b>
    </li>)}</ol>
    <p>External practice links do not award points. Opening a link cannot verify a solve.</p>
  </section>;
}

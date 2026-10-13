import { createStreamHub } from './streamHub.js';
import { getAuthToken } from '../../api/client.js';
const base = `${(import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '')}/study`;
export async function roomRequest(path, body, signal) {
  const response = await fetch(`${base}${path}`, {
    method: body ? 'POST' : 'GET', signal,
    headers: { Authorization: `Bearer ${getAuthToken() || ''}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || 'The room could not be reached.'), { status: response.status });
  return data;
}
async function rawRoomStream(signal, onSnapshot, token) {
  const response = await fetch(`${base}/events`, { headers: { Authorization: `Bearer ${token}` }, signal });
  if (!response.ok || !response.body) throw Object.assign(new Error(`Study room connection failed (HTTP ${response.status}).`),{status:response.status});
  const reader = response.body.getReader(), decoder = new TextDecoder();
  let buffer = '';
  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let end;
      while ((end = buffer.indexOf('\n\n')) >= 0) {
        const event = buffer.slice(0, end); buffer = buffer.slice(end + 2);
        if (event.startsWith('event: unavailable')) throw new Error('The room could not be reached.');
        const data = event.split('\n').find(line => line.startsWith('data: '));
        if (data) onSnapshot(JSON.parse(data.slice(6)));
      }
    }
  } finally { reader.releaseLock(); }
  if (!signal.aborted) throw new Error('Reconnecting');
}

// Header notifications and the Study Room share one authenticated connection.
const subscribe=createStreamHub((key,signal,onSnapshot)=>rawRoomStream(signal,onSnapshot,key));
export function roomStream(signal,onSnapshot){return subscribe(getAuthToken()||'',signal,onSnapshot);}

import { useCallback, useEffect, useRef, useState } from 'react';
import { roomRequest, roomStream } from './transport.js';
import { useCharacter } from '../../characters/useCharacter.js';
import { remainingAt } from '../timer.js';
// A fresh document gets a fresh controller ID even when a browser duplicates
// sessionStorage. The previous ID allows a refresh to reclaim its own seat.
let previousClient = null;
const documentClient = crypto.randomUUID();
try { previousClient = sessionStorage.getItem('lugaish-study-tab'); sessionStorage.setItem('lugaish-study-tab', documentClient); } catch { /* Room access can still work without refresh recovery. */ }

export function useSharedRoom(timer) {
  const client = documentClient;
  const {characterId}=useCharacter();
  const character=useRef(characterId);character.current=characterId;
  const [data, setData] = useState({ room: null, invitations: [], me: '' });
  const [connected, setConnected] = useState(false);
  const [connectionError,setConnectionError]=useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const latest = useRef(data), liveTimer = useRef(timer), mounted = useRef(true), inFlight = useRef(false);
  const lastPulse = useRef(0), clock=useRef(0);
  latest.current = data; liveTimer.current = timer;
  const update = useCallback(value => {
    if (!mounted.current) return;
    clock.current=value.serverNow-Date.now();
    setData(value); setConnected(true);setConnectionError('');
    // Incoming network events keep presence alive in background tabs without
    // depending solely on throttled interval timers or document visibility.
    if (value.room?.members.some(m => m.id === value.me && m.controller === client) && Date.now() - lastPulse.current > 4500) {
      lastPulse.current = Date.now();
      roomRequest(`/${value.room.id}/action`, { action: 'heartbeat', client,characterId:character.current }).catch(() => { if (mounted.current) setConnected(false); });
    }
  }, [client]);
  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    let retry;
    const connect = async () => {
      try { update(await roomRequest('/home',undefined,controller.signal));await roomStream(controller.signal, update); }
      catch (e) { if (!controller.signal.aborted) { setConnected(false);setConnectionError(e.status===401?'Private rooms need a valid sign-in. Sign in again.':e.message||'Private room connection failed.'); retry = setTimeout(connect, 2500); } }
    };
    connect();
    return () => { mounted.current = false; controller.abort(); clearTimeout(retry); };
  }, [update]);
  const run = useCallback(async (path, body) => {
    if (inFlight.current) return null;
    inFlight.current = true; setPending(true); setError('');
    try {
      const result = await roomRequest(path, { ...body, client });
      const fresh = await roomRequest('/home'); update(fresh);
      return result;
    } catch (e) { if (mounted.current) setError(e.message || 'Connection lost. Please try again.'); return null; }
    finally { inFlight.current = false; if (mounted.current) setPending(false); }
  }, [client, update]);
  const action = useCallback((action, values = {}) => run(`/${latest.current.room?.id}/action`, { action, ...values }), [run]);
  const mine = data.room?.members.find(m => m.id === data.me);
  const controlling = mine?.controller === client;
  useEffect(() => {
    if (mine && previousClient && mine.controller === previousClient) action('takeover');
  }, [mine?.controller, action]);
  useEffect(() => {
    if (!data.room?.id || !controlling) return;
    const beat = () => {if(Date.now()-lastPulse.current<4500)return;lastPulse.current=Date.now();roomRequest(`/${data.room.id}/action`, { action: 'heartbeat', client,characterId:character.current }).catch(() => { if (mounted.current) setConnected(false); });};
    beat();
    const interval = setInterval(beat, 5000);
    return () => clearInterval(interval);
  }, [data.room?.id, controlling, client, characterId]);
  // Only the controlling tab publishes transitions. Stream ticks do not resend
  // timer state or extend deadlines. Reconnect reconciles the current phase.
  useEffect(() => {
    if (!data.room?.id || !controlling || !connected) return;
    const current = liveTimer.current;
    const phase = current.phase === 'running' ? current.kind === 'break' ? 'break' : 'studying' : 'paused';
    roomRequest(`/${data.room.id}/action`, { action: 'timer', client, phase,
      sessionId: current.id, remainingMs: remainingAt(current, Date.now()) })
      .catch(e => { if (mounted.current) { setError(e.message || 'Your shared timer could not update.'); setConnected(false); } });
  }, [data.room?.id, controlling, connected, client, timer.id, timer.phase, timer.kind, timer.endsAt]);
  return { ...data, mine, controlling, client, clock, connected, connectionError, error, pending, run, action };
}

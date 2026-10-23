import { supportsWebGL2 } from '../../utils/webglSupport.js';
import { CampusArtwork } from '../../components/CampusArtwork.jsx';
import { getCharacterPreset } from '../../characters/characterPresets.js';
import { restoredPersonalSeat, rememberPersonalSeat } from './personalSeat.js';
import LibraryDock from './LibraryDock.jsx';
import { LIBRARY_TABLES } from './libraryLayout.js';
import { tableForSeat, STUDY_TABLES, STUDY_SEATS } from '../../../server/study/tableLayout.js';
import { HALL_CAPACITY } from '../../shared/learningHall.js';
import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { entranceChoiceState } from './libraryCamera.js';
import { roomRequest } from './transport.js';
import { useSharedRoom } from './useSharedRoom.js';
import { formatClock } from '../timer.js';
import './shared.css';
import TableChat from './TableChat.jsx';
import FriendSearch from './FriendSearch.jsx';
import { CharacterSelector } from '../../characters/CharacterSelector.jsx';
import SeatControls from './SeatControls.jsx';
import { seatMotion, leaveSeatMotion } from '../../../server/study/seating.js';
import { useCharacter } from '../../characters/useCharacter.js';
import { Invitations } from './Invitations.jsx';
const SharedScene = lazy(() => import('./SharedScene.jsx'));
const preload = () => import('./SharedScene.jsx');
const labels = { studying: 'Studying', paused: 'Paused', break: 'On a break', reconnecting: 'Reconnecting' };
export default function SharedRoomPanel({ scope, timer, focus, simple, onState, onDesk, onTools, onCloseTools, onView, onOverview, onTable, onFocus, viewMode, toolsOpen }) {
  const [graphicsSupported] = useState(supportsWebGL2);
  const shared = useSharedRoom(timer);
  const [welcomeDismissed,setWelcomeDismissed]=useState(false),[entryIntent,setEntryIntent]=useState('all');
  const [choosing,setChoosing]=useState(false),[candidate,setCandidate]=useState(null),[more,setMore]=useState(false),[seatMenu,setSeatMenu]=useState(false),[chatOpen,setChatOpen]=useState(false),[quality,setQuality]=useState('standard'),[seatHint,setSeatHint]=useState('');
  useEffect(()=>{if(toolsOpen){setChatOpen(false);setMore(false);}},[toolsOpen]);
  const deskRequested=useRef(false);
  const beginChoose=()=>{setMore(false);setChatOpen(false);setChoosing(true);setCandidate(null);setWelcomeDismissed(true);onOverview?.();};
  const controlsDialog=useRef(),{characterId}=useCharacter();
  const [localPerson,setLocalPerson]=useState(null),[localNow,setLocalNow]=useState(Date.now);
  useEffect(()=>{const tick=setInterval(()=>setLocalNow(Date.now()),1000);return()=>clearInterval(tick);},[]);
  const { room, invitations, mine, controlling, pending, connected, error, action, run } = shared;
  const [params, setParams] = useSearchParams();
  const [friends, setFriends] = useState(Boolean(params.get('invite')));
  const [email, setEmail] = useState(''), [inviteLink, setInviteLink] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [entered, setEntered] = useState(true), [opening, setOpening] = useState(false);
  const [simpleRoom, setSimpleRoom] = useState(simple || !graphicsSupported), [graphicsError, setGraphicsError] = useState(!graphicsSupported);
  const [showPeople, setShowPeople] = useState(true), [allowGreetings, setAllowGreetings] = useState(false);
  const [dismissedUpdates,setDismissedUpdates]=useState([]);
  const [mute, setMute] = useState(true);
  const [publicSeats,setPublicSeats]=useState(null),[publicNotice,setPublicNotice]=useState('');
  useEffect(()=>{if(!connected||room)return;const controller=new AbortController();roomRequest('/public/tables',undefined,controller.signal).then(value=>{setPublicSeats(value.tables.reduce((n,t)=>n+t.available,0));setPublicNotice('');}).catch(e=>{if(e.name!=='AbortError')setPublicNotice(e.message);});return()=>controller.abort();},[connected,room?.id]);
  const joinRandom=async()=>{deskRequested.current=!mine?.seat;const result=await run('/public/join',{direct,characterId});if(result){setLocalPerson(null);setWelcomeDismissed(true);setMute(true);onTable?.();}else{deskRequested.current=false;setPublicSeats(null);}};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const direct = simpleRoom || reduced;
  const myTable=STUDY_TABLES.find(t=>t.id===tableForSeat(mine?.seat));
  const ready=room?Boolean(connected&&mine?.seat&&mine.arrivesAt<=room.serverNow&&mine.phase!=='reconnecting'):Boolean(localPerson?.seat&&localPerson.arrivesAt<=localNow);
  useEffect(()=>{if(!room&&(!localPerson?.seat||ready))rememberPersonalSeat(scope,localPerson?.seat);},[scope,room?.id,localPerson?.seat,ready]);
  const activeSeat=room?mine?.seat:localPerson?.seat;
  const leaveLocal=()=>{const at=Date.now(),motion=leaveSeatMotion(localPerson?.seat,at,direct);setLocalPerson(p=>p?{...p,seat:null,motion,arrivesAt:motion?.endsAt||at}:null);};
  const leavingMotion=room?mine?.motion:localPerson?.motion;
  useEffect(()=>{if(!activeSeat&&leavingMotion&&viewMode==='desk'&&localNow+(room?shared.clock.current:0)>=leavingMotion.startedAt+1200)onOverview?.();},[activeSeat,leavingMotion,viewMode,localNow,room?.id,onOverview]);
  const activeTable=LIBRARY_TABLES.find(t=>t.id===tableForSeat(activeSeat));
  const context=room?(room.kind==='public'?'Public table':'Private room'):localPerson?.seat?'Personal desk':'Choose a desk to begin';
  useEffect(()=>{onState({active:Boolean(room),seated:ready,controlling:!room||controlling,context:activeSeat?`${context} · Table ${activeTable?.number} · Seat ${STUDY_SEATS.find(s=>s.id===activeSeat)?.number}`:context});},[room?.id,ready,controlling,context,activeSeat,activeTable?.number,onState]);

  useEffect(() => {
    if (room && controlling && mine?.muted !== (mute || (focus && !allowGreetings))) action('mute', { muted: mute || (focus && !allowGreetings) });
  }, [room?.id, controlling, mute, focus, allowGreetings, mine?.muted, action]);
  useEffect(() => { if (room && !simpleRoom) preload(); }, [room?.id, simpleRoom]);
  useEffect(() => {
    if (!opening) return;
    const timeout = setTimeout(() => { setEntered(true); setOpening(false); }, 650);
    return () => clearTimeout(timeout);
  }, [opening]);
  const join = async () => {
    deskRequested.current=true;
    const result = await run('/accept', confirmation);
    if(result)setWelcomeDismissed(true);else deskRequested.current=false;
    if (result) { setConfirmation(null); setEntered(false); if (params.has('invite')) setParams({}, { replace: true }); }
  };
  const invite = async event => {
    event.preventDefault();
    const result = await action('invite', { email });
    if (result?.token) { setInviteLink(`${location.origin}/study-room?invite=${encodeURIComponent(result.token)}`); setEmail(''); }
  };
  useEffect(()=>{setEntered(true);},[room?.id]);
  const chooseSeat = async seat => {
    if(seat===(room?mine?.seat:localPerson?.seat)&&ready){setChoosing(false);setCandidate(null);controlsDialog.current?.close();onDesk?.();return;}
    deskRequested.current=true;
    if(room){if(await action('seat',{seat,direct})){setWelcomeDismissed(true);setChoosing(false);setCandidate(null);controlsDialog.current?.close();}else deskRequested.current=false;return;}
    if(localPerson?.arrivesAt>Date.now())return;
    setWelcomeDismissed(true);setChoosing(false);setCandidate(null);controlsDialog.current?.close();
    const at=Date.now();setLocalNow(at);
    const motion=seatMotion(localPerson?.seat,seat,at);
    setLocalPerson({id:'personal-library',name:'You · personal desk',characterId,seat,phase:'paused',focusMs:0,motion,arrivesAt:direct?at:motion.endsAt});
  };
  const deskSeat=room?mine?.seat:localPerson?.seat,deskArrives=room?mine?.arrivesAt:localPerson?.arrivesAt;
  const previousDesk=useRef(null);
  useEffect(()=>{if(!deskSeat)previousDesk.current=null;if(ready&&deskSeat&&deskArrives<=(room?room.serverNow:localNow)&&previousDesk.current!==`${room?.id||'personal'}:${deskSeat}`){previousDesk.current=`${room?.id||'personal'}:${deskSeat}`;if(deskRequested.current||viewMode==='entrance'){deskRequested.current=false;setWelcomeDismissed(true);onDesk?.();}}},[ready,deskSeat,deskArrives,room?.id,room?.serverNow,localNow,onDesk]);
  const visibleRoom=room||{name:'Personal library',members:localPerson?[{...localPerson,characterId,phase:timer.phase==='running'?(timer.kind==='break'?'break':'studying'):'paused'}]:[],serverNow:localNow};
  const entrance=entranceChoiceState({connected,room,mine,now:room?.serverNow||localNow});
  const welcome=!ready&&!activeSeat&&!choosing&&!welcomeDismissed;
  return <div className="sr-shell sr-immersive-library">
    {welcome&&<section className="sr-library-welcome" aria-labelledby="library-welcome-title"><span className="ls-eyebrow">COME IN. MAKE YOURSELF AT HOME.</span><h2 id="library-welcome-title">Make yourself at home.</h2><p>Choose a comfortable desk, or study with your invited friends.</p>
    {entrance.canReturn&&<button className="ls-button ls-primary" onClick={()=>{setWelcomeDismissed(true);onDesk?.();}}>Return to My Desk</button>}
    {room&&!entrance.canReturn&&<p className="sr-caption">{connected?'Your room is preserved. Choose an available seat, or wait for your arrival/reconnection.':'Checking your existing room session…'}</p>}
    <div className="sr-welcome-choices"><button className="ls-button ls-primary" onClick={beginChoose}>Choose My Desk<small>Find a chair in one of four study zones</small></button><button className="ls-button" onClick={()=>{setEntryIntent('friends');setFriends(true);controlsDialog.current.showModal();}}>Study with Friends<small>Create or join an invitation-only room</small></button><button className="ls-button" disabled={pending||!connected||publicSeats===null||Boolean(room&&room.kind!=='public')} onClick={joinRandom}>Join a Random Table<small>{pending?'Finding your seat…':'Public library · 5 students per table'}</small></button></div>
    <p className="sr-caption" role="status">{publicNotice||(publicSeats===null?'Your seat is confirmed by the server when you join.':`${publicSeats} public seats available at last check · 100 total. Availability is rechecked when joining.`)}</p>
    <button className="ls-text-button" onClick={()=>{setWelcomeDismissed(true);onOverview?.();}}>Explore the library first →</button></section>}
    {false&&<div className="sr-library-toolbar"><span>2D library · personal, private & public seating</span><button className="ls-button" onClick={()=>controlsDialog.current.showModal()}>Tables & friends</button><button className="ls-button" disabled={graphicsError} onClick={()=>setSimpleRoom(false)}>3D library</button></div>}
    <div className="sr-membership-panel"><strong>{context}{activeTable?` · Table ${activeTable.number} · Seat ${STUDY_SEATS.find(s=>s.id===activeSeat)?.number}`:''}</strong><span>{room?connected?activeSeat?`${room.members.filter(m=>tableForSeat(m.seat)===tableForSeat(activeSeat)&&m.phase!=='reconnecting').length}/5 connected at this table`:`${room.members.filter(m=>m.phase!=='reconnecting').length} connected in this room`:'Reconnecting · occupancy unknown':'Personal seating · no live occupancy'}{activeTable?` · ${activeTable.name}`:''}{activeSeat&&!ready?' · Settling into your chair':''}</span>{activeSeat&&<button className="ls-button" aria-expanded={seatMenu} onClick={()=>setSeatMenu(v=>!v)}>Seat menu</button>}{seatMenu&&<div className="sr-seat-menu"><button className="ls-button" onClick={()=>{setSeatMenu(false);beginChoose();}}>Change Seat</button><button className="ls-button" disabled={pending||activeSeat&&!ready||room&&(!controlling||!connected)} onClick={async()=>{if(room){if(!await action('stand',{direct}))return;}else{leaveLocal();previousDesk.current=null;}setSeatMenu(false);setWelcomeDismissed(true);onCloseTools?.();if(direct)onOverview?.();}}>Leave Table</button></div>}</div>
    {choosing&&<section className="sr-selection-panel"><strong>Choose a highlighted chair.</strong><button className="ls-button" onClick={()=>controlsDialog.current.showModal()}>Accessible seat list</button><button className="ls-button" onClick={()=>{setChoosing(false);setCandidate(null);setWelcomeDismissed(Boolean(activeSeat));onView?.(ready?'desk':'entrance');}}>Cancel</button>{candidate&&<div className="sr-seat-preview"><span>{LIBRARY_TABLES.find(t=>t.id===tableForSeat(candidate))?.name} · Table {STUDY_TABLES.find(t=>t.id===tableForSeat(candidate))?.number} · Seat {STUDY_SEATS.find(s=>s.id===candidate)?.number}</span><button className="ls-button ls-primary" disabled={pending||room&&(!controlling||!connected)||activeSeat&&!ready} onClick={()=>chooseSeat(candidate)}>{pending?'Assigning…':'Sit Here'}</button></div>}</section>}
    {seatHint&&<div className="sr-seat-hint" role="status">{seatHint}<button className="ls-button" onClick={()=>{setSeatHint('');beginChoose();}}>Choose Seat</button><button className="ls-button" onClick={()=>setSeatHint('')}>Dismiss</button></div>}
    {!simpleRoom?<Suspense fallback={<p className="sr-notice">Opening the university library…</p>}><SharedScene clock={room?shared.clock:undefined} room={visibleRoom} hideControls quality={quality} choosing={choosing} candidate={candidate} onTables={beginChoose} onTools={onDesk} onOverview={onOverview} onFocus={onFocus} onSimple={()=>setSimpleRoom(true)} viewMode={viewMode} local={!room} me={room?shared.me:'personal-library'} onSeat={id=>{if(!choosing)beginChoose();setCandidate(id);}} onError={()=>{setGraphicsError(true);setSimpleRoom(true);}}/></Suspense>:<div className="sr-simple-stage"><div className="sr-library-fallback-art" aria-hidden="true"><CampusArtwork kind="library" preserveAspectRatio="xMidYMid slice"/></div>{choosing?<SeatControls room={visibleRoom} me={room?shared.me:'personal-library'} mine={room?mine:localPerson} connected={!room||connected} local={!room} disabled={room&&(pending||!controlling||!connected)} candidate={candidate} onPreview={setCandidate} onSeat={chooseSeat}/>:<div className="sr-simple-context">{ready&&<img className="sr-simple-avatar" src={getCharacterPreset(characterId).avatarAsset} alt="Your selected character"/>}<h2>{ready?'My Desk':'Library entrance'}</h2><p>{ready?`${activeTable?.name} · Your seat is kept while you use the study tools.`:'A quiet space for your next study session. Choose a desk to begin.'}</p>{ready&&<button className="ls-button ls-primary" onClick={onTools}>Open Study Tools</button>}</div>}</div>}
    <LibraryDock view={viewMode} seated={Boolean(activeSeat)} onLibrary={()=>{onOverview?.();setMore(false);}} onDesk={()=>ready?onDesk?.():setSeatHint('Choose a chair and wait until you are seated. Then open My Desk for your study tools.')} onChoose={beginChoose} onTools={()=>{setChatOpen(false);ready?onTools?.():setSeatHint('Choose a chair and wait until you are seated. Then open My Desk for your study tools.');}} more={more} onMore={()=>{onCloseTools?.();setChatOpen(false);setMore(v=>!v);}}/>
    {more&&<div className="sr-scene-settings"><h3>Library options</h3><label>Camera<select value={viewMode} onChange={e=>onView?.(e.target.value)}><option value="entrance">Entrance</option><option value="library">Library map</option><option value="explore">Eye-level explore</option><option value="desk" disabled={!ready}>My Desk</option></select></label><label>Graphics<select value={quality} onChange={e=>setQuality(e.target.value)}><option value="standard">Standard</option><option value="low">Low · no shadows</option></select></label><button className="ls-button" disabled={graphicsError&&!simpleRoom} onClick={()=>{setSimpleRoom(v=>!v);setMore(false);}}>{simpleRoom?'Try 3D':'Use 2D fallback'}</button><button className="ls-button" onClick={()=>{setEntryIntent('friends');setFriends(true);controlsDialog.current.showModal();setMore(false);}}>Private group & invitations</button><button className="ls-button" onClick={()=>{onCloseTools?.();setChatOpen(v=>!v);setMore(false);}}>Table Chat</button></div>}
    {ready&&<button className="ls-button sr-chat-launch" onClick={()=>{onCloseTools?.();setChatOpen(v=>!v);}}>Table Chat</button>}
    {chatOpen&&<div className="sr-chat-drawer"><div className="sr-heading"><h2>Table Chat</h2><button className="ls-button" onClick={()=>setChatOpen(false)}>Close chat</button></div>{room&&room.kind!=='public'&&ready?<TableChat room={room} mine={mine} me={shared.me} messages={shared.tableMessages} preferences={shared.preferences} disabled={pending||!controlling||!connected} run={run}/>:<><p>Chat is available only to members seated together in an invitation-only private group. Public tables and personal desks have no chat.</p><button className="ls-button" onClick={()=>{setEntryIntent('friends');setFriends(true);controlsDialog.current.showModal();setChatOpen(false);}}>Private group options</button></>}</div>}
    <dialog ref={controlsDialog} className="sr-library-dialog"><div className="sr-heading"><h2>Tables & private rooms</h2><button className="ls-button" onClick={()=>controlsDialog.current.close()}>Back to library</button></div>
    <CharacterSelector/>
    {!room&&localPerson&&<button className="ls-button" disabled={!ready} onClick={leaveLocal}>Leave personal seat</button>}
    {!room&&entryIntent!=='friends'&&<SeatControls room={visibleRoom} me="personal-library" mine={localPerson} local disabled={false} candidate={candidate} onPreview={setCandidate} onSeat={chooseSeat}/>}

    {entryIntent!=='solo'&&!focus&&<FriendSearch room={room} mine={mine} me={shared.me} action={action} run={run} preferences={shared.preferences} disabled={pending||(room&&!controlling)||!connected}/> }
    {shared.joinUpdates?.filter(r=>!dismissedUpdates.includes(r.id)).map(r=><div className="sr-notice" role="status" key={r.id}>{r.status==='accepted'?'Request accepted. Your avatar is joining the table.':r.status==='declined'?'Your join request was declined.':'That request is no longer available.'}<button className="ls-button" onClick={()=>setDismissedUpdates(old=>[...old,r.id])}>Dismiss</button></div>)}
    {shared.joinRequests?.map(r=><div className="sr-call" key={r.id} role="region" aria-label="Table join request"><p>{r.name} wants to join your study table.</p><button className="ls-button ls-primary" disabled={pending||!controlling} onClick={()=>run('/requests/answer',{id:r.id,accept:true})}>Accept</button><button className="ls-button" disabled={pending} onClick={()=>run('/requests/answer',{id:r.id,accept:false})}>Decline</button><button className="ls-button" onClick={()=>run('/preferences',{blockRequest:r.id})}>Block</button></div>)}
    {entryIntent!=='solo'&&!room && <div className="sr-choice ls-hide-in-focus"><div><span className="ls-eyebrow">MAKE YOURSELF COMFORTABLE</span><h2>Your own pace. Good company.</h2><p>Keep your personal desk, or join a shared hall with up to 100 students.</p></div><div className="sr-actions"><button className="ls-button" aria-pressed={!friends} onClick={() => setFriends(false)}>Study alone</button><button className="ls-button ls-primary" aria-pressed={friends} onClick={() => setFriends(true)}>Study with friends</button></div></div>}
    {entryIntent!=='solo'&&!room && friends && <div className="sr-lobby"><h3>Your private university library</h3><p>Invitation only. Your notes, goals, reading, and rain sound stay private.</p><button className="ls-button ls-primary" disabled={pending || !connected} onClick={() => run('/create', {}).then(result => { if (result) setEntered(false); })}>Create a room</button></div>}
    {(!focus || allowGreetings) && <Invitations items={invitations} open={friends && !room} pending={pending} onAccept={setConfirmation} onDecline={values => run('/decline', values)} />}
    {params.get('invite') && !confirmation && <p className="sr-invite"><button className="ls-button" onClick={() => setConfirmation({ token: params.get('invite') })}>Review invitation link</button> Only the invited account can join.</p>}
    {confirmation && <div className="sr-confirm" role="region" aria-label="Confirm joining"><h3>Join your friend’s study table?</h3><p>Your notebook and current countdown stay with you. Only your name, seat, and time studying in this room are shared. You will sit at the table your friend invited you to.</p>{room ? <p>Leave your current room first, then accept this invitation.</p> : <button className="ls-button ls-primary" disabled={pending || !connected} onClick={join}>Join room</button>}<button className="ls-button" onClick={() => setConfirmation(null)}>Not now</button></div>}
    {room && <>
      <div className="sr-heading"><div><span className="ls-eyebrow">{room.kind==='public'?'PUBLIC LIBRARY':'INVITATION-ONLY'} · {room.members.length}/{HALL_CAPACITY} STUDENTS</span><h2>{room.name}</h2><p>Your notes and materials are yours alone.</p></div><button className="ls-button" disabled={pending || !controlling} onClick={async () => { if (await action('leave')) { setEntered(false); setInviteLink(''); } }}>Leave room</button></div>
      {!controlling && <div className="sr-notice">Another tab controls your seat and shared timer. <button className="ls-button" disabled={pending} onClick={() => action('takeover')}>Use this tab</button></div>}
      {!entered && !focus && <div className={`sr-entrance ${opening ? 'sr-opening' : ''}`}><div className="sr-door" aria-hidden="true"><span>Study Room</span><i /></div><div><h3>Your library is ready.</h3><p>Explore four study zones and choose a seat at one of 20 tables.</p><div className="sr-actions"><button className="ls-button ls-primary" onPointerEnter={preload} onClick={() => direct ? setEntered(true) : setOpening(true)}>Open door</button><button className="ls-button" onClick={() => setEntered(true)}>Enter directly</button></div></div></div>}
      {(entered || focus) && <>
        {!focus && <><div className="sr-view-tools"><p>Browse the library, choose a free chair, and settle in. Your study tools remain below.</p><button className="ls-button" disabled={graphicsError} onClick={() => setSimpleRoom(value => !value)}>{simpleRoom ? 'Try 3D view' : 'Use simple view'}</button></div>

          <SeatControls room={room} me={shared.me} mine={mine} connected={connected} candidate={candidate} onPreview={setCandidate} simple={simpleRoom} disabled={pending || !controlling || !connected} onSeat={chooseSeat} />
          {graphicsError && <p className="sr-notice">3D is unavailable. You’re still in the same room in simple view.</p>}
        </>}


        <div className="sr-overlap"><div><span>{myTable?`Time studying at Table ${myTable.number}`:'Time studying together'}</span><strong role="timer">{formatClock(myTable?(room.tableTogetherMs?.[myTable.id]||0):room.togetherMs)}</strong></div><p>Group overlap is counted once while at least two friends at the same table focus. Each person may have joined at a different time.</p></div>
        <button className="ls-button" aria-expanded={showPeople} onClick={() => setShowPeople(value => !value)}>{showPeople ? 'Hide other timers' : 'Who is studying?'}</button>
        {showPeople && <ul className="sr-people" aria-label="Who is studying?">{room.members.map(person => <li key={person.id}><div><strong>{person.name}{person.id === shared.me ? ' (you)' : ''}{person.id === room.hostId ? ' · Host' : ''}</strong><span>{labels[person.phase]} · {formatClock(person.focusMs)}{!person.seat ? ' · Choose a seat' : ''}</span>{person.greeting && !focus && <small className="sr-greeting">{person.greeting.text}</small>}</div>{person.id !== shared.me && controlling && <div className="sr-actions">{room.kind!=='public'&&<button className="ls-button" disabled={pending || !connected} onClick={() => action('call', { target: person.id })}>Call over</button>}<button className="ls-button" disabled={pending||!connected} onClick={()=>run('/preferences',{block:person.id})}>Block</button>{room.hostId === shared.me && <button className="ls-button" disabled={pending} onClick={() => { if (window.confirm(`Remove ${person.name} from this room?`)) action('remove', { target: person.id }); }}>Remove</button>}</div>}</li>)}</ul>}
        <p className="sr-caption">Participant times count verified focus since joining this room. Your personal countdown and earlier solo time stay in your private timer below.</p>
        {mine?.call && !mute && (!focus || allowGreetings) && <div className="sr-call" role="status"><p>{mine.call.name} invited you to sit together.</p><button className="ls-button ls-primary" disabled={pending || !controlling} onClick={() => action('answer', { accept: true, direct })}>Join table</button><button className="ls-button" disabled={pending || !controlling} onClick={() => action('answer', { accept: false })}>Not now</button></div>}
        {!focus && <div className="sr-social"><button className="ls-button" disabled={pending || !controlling || !connected} onClick={() => action('wave')}>Wave hello</button><label><input type="checkbox" checked={mute} onChange={e => setMute(e.target.checked)} /> Mute greetings</label></div>}
        <label className="sr-caption"><input type="checkbox" checked={allowGreetings} onChange={e => setAllowGreetings(e.target.checked)} /> Allow social invitations during focus view</label>

      </>}
    </>}
    </dialog>
    {!connected && <p className="sr-notice" role="status">{shared.connectionError||'Connecting to private rooms…'} Your personal library tools still work. Shared presence pauses after 20 seconds offline; your seat is held for two minutes.</p>}
    {error && <p className="ls-error" role="alert">{error}</p>}
  </div>;
}

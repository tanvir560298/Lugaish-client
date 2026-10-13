import {reportOperationalEvent} from '../../utils/operations.js';
import CampusLighting from '../../shared/CampusLighting.jsx';
import { STUDY_TABLES, tableForSeat } from '../../../server/study/tableLayout.js';
import { Component, memo, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { fitLibraryCamera, LIBRARY_BOUNDS, constrainExplore, constrainLibraryOrbit, ENTRANCE_CAMERA } from './libraryCamera.js';
import { Vector3 } from 'three';
import { STUDY_SEATS } from '../../../server/study/tableLayout.js';
import { LIBRARY_TABLES, LIBRARY_ZONES, libraryOccupancy } from './libraryLayout.js';
import StudyTables from './StudyTables.jsx';
import { sceneSignature } from './renderState.js';
import { scheduleSceneFrames } from './frameSchedule.js';
import RemoteAvatar from './RemoteAvatar.jsx';
const ignoreStats=()=>{};
class Boundary extends Component {
  state={failed:false};static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){reportOperationalEvent('library_render_failure');this.props.onError();}render(){return this.state.failed?null:this.props.children;}
}
function LibraryCamera({mode,seatId,tableId,onCutaway}) {
 const outside=useRef(false);
 const {camera,invalidate,size}=useThree(),lastExplore=useRef([0,1.65,14.5]),controls=useRef(),destination=useRef(null),reduced=useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const seat=STUDY_SEATS.find(s=>s.id===seatId),table=STUDY_TABLES.find(t=>t.id===(tableId||seat?.tableId));
  if(mode==='desk'&&!seat)return; // Keep the settled camera during the confirmed stand/leave transition.
  const fitted=fitLibraryCamera(LIBRARY_BOUNDS,size.width/size.height,camera.fov);
  let eye=fitted.eye.toArray(),target=fitted.target.toArray();
  if(mode==='entrance'){eye=[...ENTRANCE_CAMERA.eye];target=[...ENTRANCE_CAMERA.target];lastExplore.current=eye;}
  if(mode==='explore'){eye=[0,1.65,14.5];target=[0,1.65,10];lastExplore.current=eye;}
  if(mode==='desk'&&seat){const [x,,z]=seat.position;const distance=size.width/size.height<.8?3.3:3.1;eye=[x-Math.sin(seat.facing)*distance+Math.cos(seat.facing)*1.05,2.05,z-Math.cos(seat.facing)*distance-Math.sin(seat.facing)*1.05];target=[(x+table.x)/2,1.0,(z+table.z)/2];}
  if(mode==='table'&&table){eye=[table.x+4,4.8,table.z+5];target=[table.x,1.15,table.z];}
  destination.current={eye:new Vector3(...eye),target:new Vector3(...target)};invalidate();
 },[mode,seatId,tableId,camera,invalidate,size.width,size.height]);
 useFrame((_,dt)=>{
  if(!controls.current)return;
  const reportCutaway=()=>{const value=mode==='overview'||Math.abs(camera.position.x)>15.8||Math.abs(camera.position.z)>16.8||camera.position.y>5.25;if(value!==outside.current){outside.current=value;onCutaway?.(value);}};
  if(!destination.current){
   if(mode==='explore'){
    const safe=constrainExplore(lastExplore.current,camera.position.toArray()),correction=new Vector3(...safe).sub(camera.position);
    camera.position.set(...safe);controls.current.target.add(correction);lastExplore.current=safe;
   }
   else if(mode!=='overview'){
    camera.position.set(...constrainLibraryOrbit(camera.position.toArray(),controls.current.target.toArray(),mode));
   }
   camera.lookAt(controls.current.target);reportCutaway();
   return;
  }
  const d=destination.current,a=reduced.current?1:1-Math.exp(-5*Math.min(dt,.1));
  camera.position.lerp(d.eye,a);controls.current.target.lerp(d.target,a);controls.current.update();reportCutaway();
  if(camera.position.distanceTo(d.eye)<.025&&controls.current.target.distanceTo(d.target)<.025)destination.current=null;
  else invalidate();
 });
 return <OrbitControls ref={controls} target={ENTRANCE_CAMERA.target} minDistance={mode==='explore'?1:1.5} maxDistance={100} maxPolarAngle={Math.PI/2-.04} enableDamping enablePan={mode==='explore'} onStart={()=>{destination.current=null;}}/>;
}
function Interior({room,local,me,onSeat,onError,clock:sharedClock,cameraMode,cameraCutaway,onCutaway,quality,onStats,choosing,candidate,hovered,onHover,onTable,tableId}) {
  const {gl,invalidate}=useThree(),clock=useRef(room.serverNow-Date.now());if(sharedClock)clock.current=sharedClock.current;
  useEffect(()=>{const lost=e=>{e.preventDefault();onError();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onError]);
  useEffect(()=>{
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop=()=>{};
    const start=()=>{stop();invalidate();stop=scheduleSceneFrames({room,getNow:()=>Date.now()+clock.current,invalidate,low:quality==='low',reducedMotion:preference.matches});};
    start();preference.addEventListener('change',start);
    return()=>{stop();preference.removeEventListener('change',start);};
  },[room,quality,invalidate]);
  const sample=useRef({time:0,frames:0});
  useFrame((_,dt)=>{sample.current.time+=dt;sample.current.frames++;if(sample.current.time>=2){onStats({fps:Math.round(sample.current.frames/sample.current.time),calls:gl.info.render.calls,triangles:gl.info.render.triangles});sample.current={time:0,frames:0};}});
  const counts=libraryOccupancy(room);
  const mine=room.members.find(m=>m.id===me),occupied=new Set(room.members.map(m=>m.seat).filter(Boolean));
  return <>
    <CampusLighting quality={quality}/><color attach="background" args={['#e7e8de']}/><ambientLight intensity={.25}/><hemisphereLight args={['#f4f6ef','#899183',.85]}/><directionalLight position={[14,9,7]} intensity={2.25} color="#fff1d5" castShadow={quality==='standard'} shadow-mapSize={[1024,1024]} shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-normalBias={.04} shadow-radius={3}/>
    <directionalLight position={[-10,4,-9]} intensity={.35} color="#e0eaf1"/><StudyTables cutaway={cameraMode==='overview'||cameraCutaway} hovered={hovered} onHover={onHover} onTable={onTable} occupied={occupied} selected={candidate||mine?.seat} choosing={choosing} onSeat={id=>{const person=room.members.find(m=>m.seat===id);if(!person||person.id===me)onSeat(id);}}/>
    {room.members.map((person,index)=><RemoteAvatar showLabel={person.id!==me||cameraMode!=='desk'} key={person.id} person={person} index={index} room={room} clock={sharedClock||clock}/>)}
    <LibraryCamera onCutaway={onCutaway} mode={cameraMode} seatId={mine?.seat} tableId={tableId}/>
  </>;
}
function SharedScene(props) {
 const [cameraCutaway,setCameraCutaway]=useState(false);
 const [cameraMode,setCameraMode]=useState(props.viewMode==='desk'?'desk':'entrance'),[quality,setQuality]=useState('standard'),[stats,setStats]=useState(null),[settings,setSettings]=useState(false),[hovered,setHovered]=useState(null),[tableId,setTableId]=useState(null);
 useEffect(()=>{setTableId(null);},[props.room?.id]);
 useEffect(()=>{if(props.viewMode)setCameraMode(props.viewMode==='desk'?'desk':props.viewMode==='entrance'?'entrance':props.viewMode==='table'?'table':props.viewMode==='explore'?'explore':'overview');},[props.viewMode]);
 useEffect(()=>{if(props.quality)setQuality(props.quality);},[props.quality]);
 const seated=Boolean(props.room.members.find(m=>m.id===props.me)?.seat);
 return <div className="sr-library-stage">
 {!props.hideControls&&<div className="sr-floating-dock" role="group" aria-label="Library controls"><button className="ls-button" aria-pressed={cameraMode==='overview'} onClick={()=>{setCameraMode('overview');props.onOverview?.();}}>Overview</button><button className="ls-button" disabled={!seated} aria-pressed={cameraMode==='desk'} onClick={()=>{setCameraMode('desk');props.onTools?.();}}>My Desk</button><button className="ls-button ls-primary" onClick={props.onTables}>Choose a Seat</button><button className="ls-button" onClick={props.onFocus} disabled={!seated}>Focus</button><button className="ls-button" aria-expanded={settings} onClick={()=>setSettings(v=>!v)}>Settings</button></div>}
 {!props.hideControls&&settings&&<div className="sr-scene-settings"><h3>Library settings</h3><label>Camera<select value={cameraMode} onChange={e=>setCameraMode(e.target.value)}><option value="entrance">Entrance View</option><option value="overview">Overview</option><option value="desk" disabled={!seated}>My Desk</option><option value="table" disabled={!seated&&!tableId}>Table View</option><option value="explore">Explore · entrance view</option></select></label><label>Graphics<select value={quality} onChange={e=>setQuality(e.target.value)}><option value="standard">Standard · shadows</option><option value="low">Low · no shadows</option></select></label><button className="ls-button" onClick={props.onSimple}>Use 2D library</button><small>{stats&&`${stats.fps} FPS · ${stats.calls} draw calls`}</small></div>}
 {!props.hideControls&&<span className="sr-camera-badge">{({entrance:'Entrance View',overview:'Library Overview',desk:'My Desk',table:'Table View',explore:'Explore'})[cameraMode]} · {props.local?'Personal seating':props.room?.kind==='public'?'Public shared library':'Private shared room'}</span>}
 {cameraMode==='overview'&&<div className="sr-zone-legend" aria-label="Library zones">{LIBRARY_ZONES.map(z=><span key={z.id}><i style={{background:z.color}}/>{z.name}</span>)}</div>}
 {(hovered||tableId)&&<div className="sr-table-discovery"><strong>{LIBRARY_TABLES.find(t=>t.id===(hovered||tableId))?.name}</strong><span>Table {LIBRARY_TABLES.find(t=>t.id===(hovered||tableId))?.number} · {props.local?'Personal seating':`${props.room.members.filter(m=>tableForSeat(m.seat)===(hovered||tableId)).length}/5 assigned`}</span><button className="ls-button" onClick={props.onTables}>Choose a chair</button></div>}
 <div className="sr-scene"><Boundary onError={props.onError}><Canvas shadows={quality==='standard'} frameloop="demand" dpr={quality==='low'?1:[1,1.3]} camera={{position:ENTRANCE_CAMERA.eye,fov:48,near:.08,far:150}} onCreated={({camera,size})=>{camera.position.set(...ENTRANCE_CAMERA.eye);camera.lookAt(...ENTRANCE_CAMERA.target);}} gl={{powerPreference:'low-power',antialias:true}}><Interior cameraCutaway={cameraCutaway} onCutaway={setCameraCutaway} {...props} hovered={hovered} onHover={setHovered} tableId={tableId} onTable={id=>{setTableId(id);setCameraMode('table');}} cameraMode={cameraMode} quality={quality} onStats={props.hideControls?ignoreStats:setStats}/></Canvas></Boundary></div></div>;
}

export default memo(SharedScene,(a,b)=>a.viewMode===b.viewMode&&a.quality===b.quality&&a.choosing===b.choosing&&a.candidate===b.candidate&&a.hideControls===b.hideControls&&a.local===b.local&&a.me===b.me&&a.clock===b.clock&&sceneSignature(a.room)===sceneSignature(b.room));

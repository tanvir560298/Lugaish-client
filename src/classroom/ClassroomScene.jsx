import {reportOperationalEvent} from '../utils/operations.js';
import { Component, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from './Environment.jsx';
import { Player } from './Player.jsx';
import { Teacher } from './Teacher.jsx';
import { Projector } from './Projector.jsx';

const CLASSROOM_CAMERA={fov:62,near:.08,far:90,position:[-10.3,1.8,14.7]};
const CANVAS_RESIZE={scroll:false,debounce:{scroll:0,resize:0}};

class SceneBoundary extends Component {
  state={error:false};
  static getDerivedStateFromError(){return {error:true};}
  componentDidCatch(){reportOperationalEvent('classroom_render_failure');this.props.onError('The 3D room could not be rendered. Try Low quality or reload the room.');}
  render(){return this.state.error ? null : this.props.children;}
}
function Lifecycle({ onReady, onError, onStats }) {
  const {gl}=useThree();
  const started=useRef(false), sample=useRef({time:0,frames:0});
  useEffect(()=> {
    const canvas=gl.domElement;
    const loss=event=> {event.preventDefault();onError('The graphics connection was lost. Reload the room to reconnect.');};
    canvas.addEventListener('webglcontextlost',loss);
    return ()=>canvas.removeEventListener('webglcontextlost',loss);
  },[gl,onError]);
  useFrame((_,dt)=> {
    if(!started.current){started.current=true;onReady();}
    sample.current.time+=dt;sample.current.frames++;
    if(sample.current.time>=2){onStats({fps:Math.round(sample.current.frames/sample.current.time),calls:gl.info.render.calls,triangles:gl.info.render.triangles});sample.current={time:0,frames:0};}
  });
  return null;
}
export default function ClassroomScene(props) {
  const [supported]=useState(()=> {
    try {const c=document.createElement('canvas');const gl=c.getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}
  });
  useEffect(()=>{if(!supported)props.onError('WebGL 2 is unavailable. Enable hardware acceleration or use another browser. You can still study in My Classes.');},[supported,props.onError]);
  if(!supported)return null;
  return <SceneBoundary onError={props.onError}>
    <Canvas resize={CANVAS_RESIZE} shadows={props.quality==='high'} dpr={props.quality==='high'?[1,1.5]:1} camera={CLASSROOM_CAMERA}
      gl={{antialias:props.quality==='high',powerPreference:'high-performance'}} fallback={<p>3D graphics are unavailable. Please return to My Classes.</p>}>
      <Lifecycle onReady={props.onReady} onError={props.onError} onStats={props.onStats} />
      <Environment onSeat={id=>props.controlsRef.current?.seat(id)} phase={props.phase} quality={props.quality} reducedMotion={props.reducedMotion} onBrowse={props.onBrowse} />
      <Player session={props.session} cameraMode={props.cameraMode} controlsRef={props.controlsRef} onLockChange={props.onLockChange} onInputError={props.onInputError} onMovementChange={props.onMovementChange} reducedMotion={props.reducedMotion} />
      <Teacher phase={props.phase} dispatch={props.dispatch} reducedMotion={props.reducedMotion} />
      <Projector lecture={props.lecture} phase={props.phase} mediaRef={props.mediaRef} report={props.report} theater={props.theater} theaterHost={props.theaterHost} />
    </Canvas>
  </SceneBoundary>;
}

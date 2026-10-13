import { Component, Suspense } from 'react';
import { Environment } from '@react-three/drei';
class OptionalLight extends Component {
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?null:this.props.children;}
}
// Local CC0 daylight capture; no per-frame probes or background replacement.
// Physical-phone/mobile and low graphics retain the lighter direct-light path.
export default function CampusLighting({quality}){
 const enabled=quality!=='low'&&!window.matchMedia('(max-width:760px)').matches;
 return enabled?<OptionalLight><Suspense fallback={null}><Environment files="/textures/campus/daylight-1k.hdr" background={false} environmentIntensity={.32}/></Suspense></OptionalLight>:null;
}

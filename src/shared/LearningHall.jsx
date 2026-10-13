import { Block, RepeatedBlocks } from '../classroom/Blocks.jsx';
import { RoundedFurniture } from '../study/shared/RoundedFurniture.jsx';
import GroundShadows from './GroundShadows.jsx';
import CampusWindows from './CampusWindows.jsx';
import { HALL, HALL_SEATS } from './learningHall.js';
export function HallFurniture({onSeat,occupied=new Set(),selected}) {
  const desks=HALL_SEATS.map(s=>s.desk),legs=HALL_SEATS.flatMap(s=>[-.55,.55].flatMap(x=>[-.23,.23].map(z=>[s.desk[0]+x,.36,s.desk[2]+z])));
  const click=seats=>event=>{event.stopPropagation();const seat=seats[event.instanceId];if(seat)onSeat?.(seat.id);};
  return <>
    <GroundShadows items={desks} size={[1.65,.95]}/><GroundShadows items={HALL_SEATS.map(s=>s.position)} size={[.8,.8]}/>
    <RoundedFurniture items={desks} size={[1.35,.065,.65]} color="#efebe0" surface="oak" onClick={click(HALL_SEATS)}/>
    <RepeatedBlocks items={legs} size={[.045,.71,.045]} color="#41514f"/>
    <RepeatedBlocks items={HALL_SEATS.flatMap(s=>[-.21,.21].flatMap(x=>[-.19,.19].map(z=>[s.position[0]+x,.23,s.position[2]+z])))} size={[.035,.44,.035]} color="#41514f"/>
    {[false,true].map(active=>{const seats=HALL_SEATS.filter(s=>(occupied.has(s.id)||s.id===selected)===active);return seats.length?<group key={String(active)}>
      <RoundedFurniture surface="fabric" items={seats.map(s=>[s.position[0],.46,s.position[2]])} size={[.52,.085,.49]} color={active?'#d2a85a':'#819b89'} onClick={click(seats)}/>
      <RoundedFurniture surface="fabric" items={seats.map(s=>[s.position[0],.76,s.position[2]+.23])} size={[.52,.42,.06]} color={active?'#b38a43':'#819b89'} onClick={click(seats)}/>
    </group>:null;})}
    <RepeatedBlocks items={HALL_SEATS.map(s=>[s.desk[0]-.28,.79,s.desk[2]-.02])} size={[.28,.018,.2]} color="#e3dfd0"/>
  </>;
}
export function HallArchitecture({classroom=false}) {
  const {width:w,depth:d,height:h}=HALL;
  return <>
    <Block at={[0,-.1,0]} size={[w,.2,d]} color="#f0e8d9" surface="floor"/>
    <Block at={[0,.003,0]} size={[2.3,.006,d]} color="#9aaa96" surface="fabric"/>
    <Block at={[-w/2-.1,h/2,0]} size={[.2,h,d+.4]} color="#f1eee5" surface="wall"/>
    <Block at={[w/2+.1,.425,0]} size={[.2,.85,d+.4]} color="#f1eee5" surface="wall"/>
    <Block at={[w/2+.1,3.925,0]} size={[.2,.55,d+.4]} color="#f1eee5" surface="wall"/>
    <RepeatedBlocks items={[-7.5,-2.5,2.5,7.5].map(z=>[w/2+.1,2.25,z])} size={[.2,2.8,1.15]} color="#f1eee5" surface="wall"/>
    <RepeatedBlocks items={[-13.4625,13.4625].map(z=>[w/2+.1,2.25,z])} size={[.2,2.8,3.075]} color="#f1eee5" surface="wall"/>
    <Block at={[0,h/2,-d/2-.1]} size={[w,h,.2]} color="#e8e5da" surface="wall"/>
    <Block at={[0,h/2,d/2+.1]} size={[w,h,.2]} color="#e8e5da" surface="wall"/>
    <CampusWindows x={w/2-.06} bays={[-10,-5,0,5,10]} height={2.8} center={2.25} width={3.85}/>
    <RepeatedBlocks items={[-w/2+.035,w/2-.035].map(x=>[x,.13,0])} size={[.08,.25,d]} color="#9b8d75" surface="oak"/>
    <RepeatedBlocks items={[-10,-5,0,5,10].map(z=>[w/2-.15,2.1,z+2.2])} size={[.22,4.2,.18]} color="#e4d8c0" surface="oak"/>
    <Block at={[classroom?-10.8:0,1.08,d/2-.02]} size={[1.4,2.16,.06]} color="#9c7956"/>
    <Block at={[classroom?-10.8:0,2.28,d/2-.08]} size={[1.7,.12,.1]} color="#4c5d5a"/>
    <Block at={[0,2,-d/2+.13]} size={[4.5,2.65,.10]} color="#253d3e"/>
    <Block at={[0,3.4,-d/2+.19]} size={[4.8,.07,.12]} color="#ddc7a3"/>
    <Block at={[0,.65,-d/2+.19]} size={[4.8,.12,.12]} color="#ddc7a3"/>
    <RepeatedBlocks items={[-2.35,2.35].map(x=>[x,2,-d/2+.18])} size={[.1,2.85,.14]} color="#ddc7a3"/>
    <RepeatedBlocks items={Array.from({length:65},(_,i)=>-11.7+i*.365).filter(x=>Math.abs(x)>2.6).map(x=>[x,2.05,-d/2+.09])} size={[.16,3.3,.12]} color="#c7ab82" surface="oak"/>
    <mesh position={[0,3.48,-d/2+.22]}><boxGeometry args={[4.7,.025,.07]}/><meshBasicMaterial color="#ffebc2"/></mesh>

    <Block at={[2.8,.74,-13.5]} size={[1.8,.075,.8]} color="#b59670"/>
    <Block at={[2.8,.36,-13.5]} size={[1.65,.7,.1]} color="#7a8981"/>
    {[-6,6].flatMap(x=>[-10,-4,2,8].map(z=><group key={`${x}:${z}`}>
      <Block at={[x,h-.12,z]} size={[3,.06,.22]} color="#657572"/>
      <mesh position={[x,h-.16,z]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[2.8,.15]}/><meshBasicMaterial color="#fff3d9"/></mesh>
    </group>))}
  </>;
}

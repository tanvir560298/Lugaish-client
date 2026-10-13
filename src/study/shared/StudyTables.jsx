import GroundShadows from '../../shared/GroundShadows.jsx';
import CampusWindows from '../../shared/CampusWindows.jsx';
import { RoundedFurniture } from './RoundedFurniture.jsx';
import { LIBRARY_TABLES, LIBRARY_ZONES } from './libraryLayout.js';
import LibraryInterior from './LibraryInterior.jsx';
import { Block, RepeatedBlocks } from '../../classroom/Blocks.jsx';
import { STUDY_TABLES, STUDY_SEATS, STUDY_HALL } from '../../../server/study/tableLayout.js';
export default function StudyTables({occupied=new Set(),selected,choosing,onSeat,onHover,onTable,hovered,cutaway=false}) {
  const {width:w,depth:d,height:oldHeight}=STUDY_HALL;
  const h=5.4;
  const zoneColors=['#879782','#b99c77','#849cab','#70938b'];
  const seatColors=(seats,back=false)=>seats.map(s=>occupied.has(s.id)||s.id===selected?back?'#ad8f56':'#c3a266':choosing?'#b5cab8':zoneColors[LIBRARY_ZONES.findIndex(z=>z.id===LIBRARY_TABLES.find(t=>t.id===s.tableId)?.zoneId)]);
  const click=seats=>e=>{e.stopPropagation();const s=seats[e.instanceId];if(s)onSeat(s.id);};
  return <>
    <Block at={[0,-.1,0]} size={[w,.2,d]} color="#f1e9dc" surface="floor"/><Block at={[0,.003,0]} size={[1.3,.006,d]} color="#9eafa0" surface="fabric"/>
    <Block at={[-w/2-.1,h/2,0]} size={[.2,h,d]} color="#f4f1e8" surface="wall"/><group visible={!cutaway}>
     <Block at={[w/2+.1,.425,0]} size={[.2,.85,d]} color="#f4f1e8" surface="wall"/>
     <Block at={[w/2+.1,4.875,0]} size={[.2,1.05,d]} color="#f4f1e8" surface="wall"/>
     <RepeatedBlocks items={[-9,-3,3,9].map(z=>[w/2+.1,2.6,z])} size={[.2,3.5,1.45]} color="#f4f1e8" surface="wall"/>
     <RepeatedBlocks items={[-15.6375,15.6375].map(z=>[w/2+.1,2.6,z])} size={[.2,3.5,2.725]} color="#f4f1e8" surface="wall"/>
    </group>
    <Block at={[0,h/2,-d/2-.1]} size={[w,h,.2]} color="#e7e4d9" surface="wall"/><Block visible={!cutaway} at={[0,h/2,d/2+.1]} size={[w,h,.2]} color="#e7e4d9" surface="wall"/>
    {!cutaway&&<CampusWindows x={w/2-.06} bays={[-12,-6,0,6,12]} height={3.5} center={2.6} width={4.55}/>}
    <LibraryInterior cutaway={cutaway}/>
    <GroundShadows items={STUDY_TABLES.map(t=>[t.x,0,t.z])} size={[3.4,2.1]}/><GroundShadows items={STUDY_SEATS.map(s=>s.position)} size={[.8,.8]}/>
    {hovered&&<RoundedFurniture items={STUDY_TABLES.filter(t=>t.id===hovered).map(t=>[t.x,.75,t.z])} size={[2.88,.04,1.58]} color="#c6a46c"/>}
    <RepeatedBlocks items={STUDY_TABLES.filter((_,i)=>i%2===0).map(t=>[t.x+.45,.815,t.z])} size={[.45,.035,.3]} color="#47504c"/>
    <RepeatedBlocks items={STUDY_TABLES.filter((_,i)=>i%2===0).map(t=>[t.x+.45,1,t.z-.13])} size={[.45,.34,.025]} color="#343d3a"/>
    <RepeatedBlocks items={STUDY_TABLES.filter((_,i)=>i%2===0).map(t=>[t.x+.45,1,t.z-.112])} size={[.39,.27,.007]} color="#b7cfce"/>
    <RoundedFurniture items={STUDY_TABLES.map(t=>[t.x,.74,t.z])} size={[2.8,.08,1.5]} color="#eadac0" surface="oak" onHover={e=>onHover?.(e?STUDY_TABLES[e.instanceId]?.id:null)} onClick={e=>{e.stopPropagation();onTable?.(STUDY_TABLES[e.instanceId]?.id);}}/>
    <RepeatedBlocks items={STUDY_TABLES.flatMap(t=>[-1.1,1.1].flatMap(x=>[-.48,.48].map(z=>[t.x+x,.36,t.z+z])))} size={[.07,.72,.07]} color="#4c625d"/>
    <RepeatedBlocks items={STUDY_SEATS.flatMap(s=>[-.2,.2].flatMap(x=>[-.18,.18].map(z=>[s.position[0]+x,.23,s.position[2]+z])))} size={[.035,.44,.035]} color="#53644d"/>
    <RoundedFurniture items={STUDY_SEATS.map(s=>[s.position[0],.46,s.position[2]])} size={[.52,.09,.49]} surface="fabric" color="#ffffff" colors={seatColors(STUDY_SEATS)} onClick={click(STUDY_SEATS)}/>
    {[false,true].map(side=>{const seats=STUDY_SEATS.filter(s=>(Math.abs(Math.sin(s.facing))>.5)===side);return <RoundedFurniture key={String(side)} items={seats.map(s=>[s.position[0]-Math.sin(s.facing)*.23,.76,s.position[2]-Math.cos(s.facing)*.23])} size={side?[.06,.42,.52]:[.52,.42,.06]} surface="fabric" color="#ffffff" colors={seatColors(seats,true)} onClick={click(seats)}/>;})}
    {['#b79b65','#728c76','#80715b'].map((color,i)=><RepeatedBlocks key={color} items={STUDY_TABLES.filter((t,n)=>n%3===i).map(t=>[t.x-.2,.815,t.z+.28])} size={[.26,.045,.34]} color={color}/>)}
    <RepeatedBlocks items={STUDY_SEATS.map(s=>[s.position[0]+Math.sin(s.facing)*.9,.80,s.position[2]+Math.cos(s.facing)*.9])} size={[.27,.018,.22]} color="#f7f0db"/>
  </>;
}

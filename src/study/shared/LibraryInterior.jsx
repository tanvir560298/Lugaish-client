import CampusSign from '../../shared/CampusSign.jsx';
import CampusPlant from '../../shared/CampusPlant.jsx';
import { RoundedFurniture } from './RoundedFurniture.jsx';
import { Html } from '@react-three/drei';
import { Block, RepeatedBlocks } from '../../classroom/Blocks.jsx';
import { LIBRARY_SHELVES, LIBRARY_ZONES } from './libraryLayout.js';
import { STUDY_TABLES } from '../../../server/study/tableLayout.js';
const bookColors=['#748b78','#b98d69','#647d92','#cab98e'];
export default function LibraryInterior({cutaway=false}){
 return <>
  <Block at={[0,.008,15.5]} size={[3.1,.015,2.2]} color="#526a59"/>
  <Block at={[-1.8,2.7,16.8]} size={[.16,5.4,.15]} color="#a88c69"/>
  <Block at={[1.8,2.7,16.8]} size={[.16,5.4,.15]} color="#a88c69"/>
  <Block at={[0,4.7,16.8]} size={[3.75,.18,.15]} color="#a88c69"/>
  {LIBRARY_ZONES.map((zone,i)=><group key={zone.id}>
   <Block at={[-10.5+i*7,.006,0]} size={[5.4,.008,27]} color={zone.color} surface="fabric"/>
   <Block at={[-10.5+i*7,2.8,-16.89]} size={[5.4,3.3,.07]} color={zone.color} surface="wall"/>
   <RepeatedBlocks items={Array.from({length:14},(_,n)=>[-12.8+i*7+n*.355,4.78,-16.84])} size={[.13,.9,.1]} color="#c3ab89" surface="oak"/>
   <CampusSign text={zone.name} position={[-10.5+i*7,3.55,-16.78]} width={3.6} height={.56}/>
  </group>)}
  {LIBRARY_SHELVES.map(s=><group key={s.z}>
   <Block at={[s.x-.3,1.65,s.z]} size={[.09,3.3,s.depth]} color="#aa8e68" surface="oak"/>
   <RepeatedBlocks items={[s.z-1.87,s.z+1.87].map(z=>[s.x,1.65,z])} size={[s.width,3.3,.075]} color="#d4bea0" surface="oak"/>
   <RepeatedBlocks items={[.12,.75,1.38,2.01,2.64,3.27].map(y=>[s.x,y,s.z])} size={[s.width,.07,s.depth]} color="#d4bea0" surface="oak"/>
  </group>)}
  {bookColors.map((color,c)=><RepeatedBlocks key={color} items={LIBRARY_SHELVES.flatMap(s=>[.46,1.09,1.72,2.35,2.98].flatMap(y=>Array.from({length:5},(_,i)=>[s.x+.07,y,s.z-1.65+(i*4+c)*.17])))} size={[.4,.47,.13]} color={color}/>)}
  <RepeatedBlocks items={LIBRARY_SHELVES.flatMap(s=>[.46,1.09,1.72,2.35,2.98].flatMap(y=>Array.from({length:20},(_,i)=>[s.x+.276,y-.12,s.z-1.65+i*.17])))} size={[.006,.022,.105]} color="#e5dbba"/>
  <RepeatedBlocks items={STUDY_TABLES.map(t=>[t.x-.75,.82,t.z])} size={[.24,.05,.22]} color="#59685b"/>
  <RepeatedBlocks items={STUDY_TABLES.map(t=>[t.x-.75,1.06,t.z])} size={[.025,.45,.025]} color="#59685b"/>
  <RepeatedBlocks items={STUDY_TABLES.map(t=>[t.x-.68,1.29,t.z])} size={[.32,.1,.22]} color="#dbcfad"/>
  <RepeatedBlocks items={STUDY_TABLES.map(t=>[t.x-.68,1.23,t.z])} size={[.26,.015,.17]} color="#ffebbb" surface="lamp"/>
  <RepeatedBlocks items={[-12,-6,0,6,12].map(z=>[15.85,2.7,z+2.6])} size={[.18,5.4,.24]} color="#d5c5ab" surface="oak"/>
  <RepeatedBlocks items={[-15.93,15.93].map(x=>[x,.15,0])} size={[.09,.3,34]} color="#b8a489" surface="oak"/>
  {[-10,10].map(x=><group key={x} position={[x,0,15.25]}>
   <RoundedFurniture items={[[0,.36,0]]} size={[3,.52,1]} color="#7c9586" surface="fabric"/>
   <RoundedFurniture items={[[0,.78,.4]]} size={[3,.7,.18]} color="#7c9586" surface="fabric"/>
   <RoundedFurniture items={[[-.96,.64,0],[0,.64,0],[.96,.64,0]]} size={[.9,.13,.8]} color="#a5b4a0" surface="fabric"/>
   <Block at={[0,.15,-1]} size={[1.2,.3,.6]} color="#e5cfa9" surface="oak"/>
   <Html position={[0,1.5,0]} center distanceFactor={9} zIndexRange={[5,0]}><span className="sr-reading-label">Reading lounge</span></Html>
  </group>)}
  {[-14.6,14.6].map(x=><CampusPlant key={x} position={[x,0,15.3]}/>)}
  {!cutaway&&<>
   <Block at={[0,5.42,0]} size={[32,.1,34]} color="#f1eee5" surface="wall"/>
   <RepeatedBlocks items={[-14,-7,0,7,14].map(x=>[x,5.2,0])} size={[.15,.36,34]} color="#c7b18e" surface="oak"/>
   <RepeatedBlocks items={[-14,-7,0,7,14].map(z=>[0,5.2,z])} size={[32,.36,.15]} color="#c7b18e" surface="oak"/>
   <RepeatedBlocks items={Array.from({length:81},(_,i)=>[-15.8+i*.395,5.34,0])} size={[.06,.04,34]} color="#d5c6ac"/>
  </>}
  <RepeatedBlocks items={[-10.5,-3.5,3.5,10.5].flatMap(x=>[-8,3,12].map(z=>[x,4.05,z]))} size={[2.5,.12,.45]} color="#506560"/>
  {[-10.5,-3.5,3.5,10.5].flatMap(x=>[-8,3,12].map(z=><mesh key={`${x}:${z}`} position={[x,3.98,z]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[2.3,.35]}/><meshBasicMaterial color="#fff0ca"/></mesh>))}
 </>;
}

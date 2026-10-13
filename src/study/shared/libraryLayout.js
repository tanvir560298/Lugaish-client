import { STUDY_TABLES, STUDY_SEATS } from '../../../server/study/tableLayout.js';
export const LIBRARY_ZONES=[
 {id:'quiet',name:'Quiet Study',description:'Space for independent focus',color:'#d8d6bd'},
 {id:'reading',name:'Reading Gallery',description:'Bring your notes and reading',color:'#c3d0c3'},
 {id:'focus',name:'Focus Studio',description:'Work toward your own goal',color:'#d6c9b3'},
 {id:'together',name:'Together Corner',description:'Study alongside your invited friends',color:'#c7ccd9'},
];
export const LIBRARY_TABLES=STUDY_TABLES.map((table,i)=>({...table,zoneId:LIBRARY_ZONES[i%4].id,name:`${LIBRARY_ZONES[i%4].name} ${Math.floor(i/4)+1}`,capacity:STUDY_SEATS.filter(s=>s.tableId===table.id).length}));
// Furnishings remain outside the established avatar transfer corridors.
export const LIBRARY_SHELVES=[-11,-5,1,7].map(z=>({x:-15.55,z,width:.7,depth:3.8}));
export function libraryOccupancy(room){
 const members=room?.members||[];
 const seats=new Set(members.map(m=>m.seat).filter(id=>STUDY_SEATS.some(s=>s.id===id)));
 return {present:members.filter(m=>m.phase!=='reconnecting').length,reserved:seats.size,available:STUDY_SEATS.length-seats.size};
}

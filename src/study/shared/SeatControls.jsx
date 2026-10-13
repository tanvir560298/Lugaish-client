import { useEffect, useState } from 'react';
import { STUDY_TABLES, STUDY_SEATS, tableForSeat } from '../../../server/study/tableLayout.js';
import { LIBRARY_TABLES, LIBRARY_ZONES, libraryOccupancy } from './libraryLayout.js';
import { formatClock } from '../timer.js';
const labels={studying:'Studying',paused:'Paused',break:'On a break',reconnecting:'Reconnecting'};
export default function SeatControls({room,me,mine,disabled,onSeat,connected=true,local=false,onPreview,candidate}) {
  const [picked,setPicked]=useState(null);
  const selected=candidate||picked;
  const [zone,setZone]=useState('all'),[availableOnly,setAvailableOnly]=useState(false);
  const counts=libraryOccupancy(room);
  const [table,setTable]=useState(tableForSeat(mine?.seat)||'table-1');
  useEffect(()=>{const id=tableForSeat(mine?.seat);if(id)setTable(id);},[mine?.seat]);
  const members=room.members.filter(m=>tableForSeat(m.seat)===table);
  return <div className="sr-table-browser">
    <div className="sr-library-dashboard" aria-label="Live library occupancy"><div><strong>{local?'Personal':connected?counts.present:'Reconnecting'}</strong><span>{local?'No live presence':'Connected in this room'}</span></div><div><strong>{connected?counts.available:'Unknown'}</strong><span>Available seats</span></div><div><strong>{connected?counts.reserved:'Unknown'}</strong><span>Assigned seats</span></div></div>
    <div className="sr-library-filters"><label>Study zone <select value={zone} onChange={e=>setZone(e.target.value)}><option value="all">All zones</option>{LIBRARY_ZONES.map(z=><option key={z.id} value={z.id}>{z.name}</option>)}</select></label><label><input type="checkbox" checked={availableOnly} onChange={e=>setAvailableOnly(e.target.checked)}/> Show available tables</label><span>{local?'Personal desk · no live users':room.kind==='public'?'Public library · chat disabled':'Private group · invited members'}</span></div>
    <div className="sr-heading"><div><h3>Choose your table</h3><p>Four library zones · 20 tables · 5 seats per table</p></div><span>{members.length}/5 seats at this table</span></div>
    <div className="sr-table-picker" role="group" aria-label="Choose a five-person study table">{LIBRARY_TABLES.filter(t=>zone==='all'||t.zoneId===zone).filter(t=>!availableOnly||room.members.filter(m=>tableForSeat(m.seat)===t.id).length<t.capacity).map(t=>{const count=room.members.filter(m=>tableForSeat(m.seat)===t.id).length;return <button type="button" key={t.id} className="ls-button" aria-pressed={table===t.id} onClick={()=>setTable(t.id)}>{t.name}<small>{count}/{t.capacity} seated</small></button>;})}</div>
    <div className="sr-five-seats" role="group" aria-label={`Five seats at ${table.replace('-',' ')}`}>{STUDY_SEATS.filter(s=>s.tableId===table).map(s=>{const person=room.members.find(m=>m.seat===s.id);return <button key={s.id} className="sr-seat" type="button" disabled={disabled||Boolean(person&&person.id!==me)||mine?.arrivesAt>room.serverNow} aria-pressed={selected===s.id||person?.id===me} onClick={()=>{setPicked(s.id);onPreview?.(s.id);}}><strong>{person?person.name:'Choose chair'}</strong><small>Seat {s.number} · {person?(person.arrivesAt>room.serverNow?'Arriving':labels[person.phase]):'Available'}</small>{person&&<small>{formatClock(person.focusMs)}</small>}</button>;})}</div>
    {selected&&<div className="sr-seat-preview"><strong>{LIBRARY_TABLES.find(t=>t.id===tableForSeat(selected))?.name} · Table {STUDY_TABLES.find(t=>t.id===tableForSeat(selected))?.number} · Seat {STUDY_SEATS.find(s=>s.id===selected)?.number}</strong><button className="ls-button ls-primary" disabled={disabled||mine?.arrivesAt>room.serverNow||Boolean(room.members.find(m=>m.seat===selected&&m.id!==me))} onClick={()=>onSeat(selected)}>Sit Here</button></div>}
  </div>;
}

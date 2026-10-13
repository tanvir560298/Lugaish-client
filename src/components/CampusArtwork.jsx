/* Original, lightweight architectural illustration; no WebGL or remote assets. */
export function CampusArtwork({kind='library',preserveAspectRatio='xMidYMid meet'}) {
 const library=kind==='library';
 return <svg className="campus-artwork" viewBox="0 0 600 360" preserveAspectRatio={preserveAspectRatio} role="img" aria-label={library?'Illustrated university library with reading tables and tall windows':'Illustrated classroom with a lesson board and student desks'}>
  <rect width="600" height="360" fill="#e8eee8"/>
  <path d="M0 280 600 235V360H0Z" fill="#d1c5af"/>
  <path d="M55 55 520 30V241L55 282Z" fill="#f8f6ee"/>
  {[100,220,340].map(x=><g key={x}><path d={`M${x} 75l80-5v140l-80 7Z`} fill="#b9d3cc"/><path d={`M${x+40} 73v140M${x} 145l80-5`} stroke="#f8f6ee" strokeWidth="6"/></g>)}
  <path d="M460 70h65v166l-65 6Z" fill="#667f72"/>
  {library?[95,140,185,230].map((y,i)=><g key={y}><path d={`M467 ${y}h50`} stroke="#dcc6a1" strokeWidth="5"/>{[0,1,2,3,4].map(n=><rect key={n} x={470+n*9} y={y-22} width="6" height="20" rx="1" fill={['#b5916b','#e4dcca','#94b6a3'][ (n+i)%3]}/>)}</g>):<g><rect x="210" y="90" width="180" height="103" rx="3" fill="#254b43"/><path d="M235 122h125m-125 20h80m-80 20h105" stroke="#d7e6de" strokeWidth="3"/></g>}
  {[{x:115,y:260},{x:330,y:245}].map(({x,y})=><g key={x}><path d={`M${x} ${y}v57m120-67v50`} stroke="#5d6e63" strokeWidth="7"/><path d={`M${x-24} ${y-8}l110-19 67 24-114 20Z`} fill="#ae895d"/><path d={`M${x-24} ${y-8}v8l63 22 114-20v-5l-114 20Z`} fill="#94714d"/><path d={`M${x+20} ${y-9}l25-5 17 7-25 5Z`} fill="#f4eedf"/><path d={`M${x+79} ${y-16}v-27`} stroke="#5c7266" strokeWidth="3"/><path d={`M${x+65} ${y-40}q14-25 28 0Z`} fill="#657f70"/><path d={`M${x+10} ${y+36}v-20l25-5v20m65-6v-20l25-5v20`} stroke="#617b69" strokeWidth="12" strokeLinejoin="round"/></g>)}
  <path d="M535 282h30l-5 38h-20Z" fill="#ad9272"/><path d="M550 288v-73m0 41q-40-30-28-42 28 4 28 42m0-8q35-40 41-22-8 30-41 33m0-15q-15-40 0-48 17 18 0 48" fill="#6a8b69" stroke="#6a8b69" strokeWidth="3"/>
  <path d="M0 340 600 290" stroke="#c1b59f" strokeWidth="2"/>
 </svg>;
}

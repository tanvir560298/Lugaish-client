// DEVELOPMENT ONLY: interaction QA, not curriculum, progress or instructor approval.
export const fixtureQuestions=[
 {id:'choice',type:'choice',prompt:'Developer fixture: select the label “Library”.',options:['Library','Classroom','Speaking'],answer:0,explanation:'This checks answer selection, not language knowledge.'},
 {id:'blank',type:'blank',prompt:'Developer fixture: enter the supplied word “study”.',acceptedAnswers:['study'],explanation:'This checks English whitespace and case handling.'},
 {id:'matching',type:'matching',prompt:'Developer fixture: match identical labels.',pairs:[{left:'Notes',right:'Notes'},{left:'Timer',right:'Timer'}]},
 {id:'ordering',type:'ordering',prompt:'Developer fixture: arrange the supplied sequence “A B C”.',tokens:['C','A','B'],order:[1,2,0]},
];
export const arabicFixture=[{id:'arabic-blank',type:'blank',prompt:'اختبار تقني فقط: اكتب «أ» كما هي.',acceptedAnswers:['أ'],explanation:'Technical input fixture. Alif with hamza is preserved; plain alif is not accepted.'}];

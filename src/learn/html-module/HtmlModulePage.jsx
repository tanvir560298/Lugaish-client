import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Check, ChevronLeft, ChevronRight, Code2, Copy, Play, RotateCcw, Trophy } from 'lucide-react';
import { useAppContext } from '../../state/AppContext.jsx';
import { htmlLessons, lessonPath, moduleBase, moduleTitle } from './lessons.js';
import { htmlProblems, finalProject } from './problems.js';
import { htmlQuiz, gradeQuiz } from './quiz.js';
import { cleanModuleProgress, moduleStorageKey, moduleProgressPercent, moduleResumePath, previewDocument, validateProblem, recordAttempt } from './engine.js';
import './module.css';

const parse=source=>new DOMParser().parseFromString(source,'text/html');
function readSaved(key,fallback){try{return {value:JSON.parse(localStorage.getItem(key)||'null')??fallback,error:''};}catch{return {value:fallback,error:'Browser storage পড়া যায়নি। এই session-এ শেখা চালাতে পারেন, তবে progress সংরক্ষিত নাও হতে পারে।'};}}

export function HtmlModulePage(){
 const {state}=useAppContext();
 const scope=state.isLoggedIn?state.userEmail:'guest';
 return <ModuleWorkspace key={scope} scope={scope}/>;
}
function ModuleWorkspace({scope}){
 const location=useLocation(),key=moduleStorageKey(scope);
 const [initial]=useState(()=>readSaved(key,{}));
 const [progress,setProgress]=useState(()=>cleanModuleProgress(initial.value));
 const [storageError,setStorageError]=useState(initial.error);
 const [menuOpen,setMenuOpen]=useState(false);
 const path=location.pathname.slice(moduleBase.length).split('/').filter(Boolean);
 const page=path[0]||'overview';
 const lesson=htmlLessons.find(l=>l.id===path[1]);
 const update=fn=>setProgress(previous=>cleanModuleProgress(fn(previous)));
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(progress));}catch{setStorageError('Progress save করা যায়নি। Browser storage permission বা জায়গা পরীক্ষা করুন।');}},[key,progress]);
 const selectedLesson=page==='lessons'?lesson?.id:null;
 useEffect(()=>{if(selectedLesson)setProgress(p=>p.lastLesson===selectedLesson?p:{...p,lastLesson:selectedLesson});},[selectedLesson]);
 const percent=moduleProgressPercent(progress);
 const problem=htmlProblems.find(p=>p.id===path[1]);
 let content;
 if(page==='overview')content=<Overview progress={progress}/>;
 else if(page==='lessons'&&lesson)content=<Lesson key={lesson.id} lesson={lesson} progress={progress} update={update} scope={scope}/>;
 else if(page==='practice'&&!path[1])content=<Arena progress={progress}/>;
 else if(page==='practice'&&problem)content=<Problem key={problem.id} problem={problem} progress={progress} update={update} scope={scope}/>;
 else if(page==='assessment')content=<Assessment update={update}/>;
 else if(page==='project')content=<Problem key="final-project" problem={finalProject} progress={progress} update={update} scope={scope}/>;
 else content=<section><h1>এই পাঠটি পাওয়া যায়নি</h1><Link to={moduleBase}>Module overview-তে ফিরুন</Link></section>;
 return <div className="hm-shell">
  <header className="hm-top"><Link to="/learn/web-development/html"><ChevronLeft size={16}/> Web Development / HTML</Link><span><BookOpen size={15}/> বাংলা পাঠ · HTML only</span></header>
  <div className="hm-layout">
   <aside className="hm-sidebar" aria-label="Module navigation">
    <p className="hm-eyebrow">WEB DEVELOPMENT · MODULE 01</p><h2>HTML Fundamentals</h2><p>পড়ুন। বদলে দেখুন। নিজে তৈরি করুন।</p>
    <label className="hm-progress-label">Module progress <strong>{percent}%</strong><progress max="100" value={percent}/></label>
    <button className="hm-menu-toggle" aria-expanded={menuOpen} aria-controls="html-module-menu" onClick={()=>setMenuOpen(v=>!v)}>Lessons & module menu <span>{menuOpen?'−':'+'}</span></button>
    <nav id="html-module-menu" className={menuOpen?'is-open':''} aria-label="HTML lessons" onClick={()=>setMenuOpen(false)}><NavLink end to={moduleBase}>Overview & roadmap</NavLink>{htmlLessons.map(l=><NavLink key={l.id} to={lessonPath(l.id)}><span className="hm-lesson-num">{progress.lessons.includes(l.id)?<Check size={14}/>:l.id}</span><span>{l.title}</span></NavLink>)}<NavLink end to={`${moduleBase}/practice`}><Code2 size={16}/> Practice Arena <small>{progress.solved.filter(id=>id!=='final-project').length}/{htmlProblems.length}</small></NavLink><NavLink to={`${moduleBase}/assessment`}><Trophy size={16}/> Review quiz {progress.quizPassed&&'✓'}</NavLink><NavLink to={`${moduleBase}/project`}>Final mini-project {progress.solved.includes('final-project')&&'✓'}</NavLink></nav>
    <p className="hm-storage">Progress ও drafts এই browser-এ {scope==='guest'?'guest হিসেবে':'আপনার account-এর জন্য আলাদা করে'} রাখা হয়। অন্য device-এ sync হয় না।</p>
   </aside>
   <div className="hm-main" lang="bn">{storageError&&<p className="hm-alert" role="alert">{storageError}</p>}{content}</div>
  </div>
 </div>;
}
function Overview({progress}){
 return <><p className="hm-eyebrow">READ → EXPLORE → PRACTISE</p><h1>{moduleTitle}</h1><p className="hm-lead">একেবারে শুরু থেকে বাংলা ব্যাখ্যা, editable উদাহরণ আর নিজের হাতে practice। Video ছাড়াও প্রতিটি বিষয় শিখতে পারবেন।</p><div className="hm-stats"><span><strong>{htmlLessons.length}</strong> reading lessons</span><span><strong>{htmlProblems.length}</strong> original problems</span><span><strong>{htmlQuiz.length}</strong> review questions</span><span><strong>1</strong> final project</span></div><div className="hm-actions"><Link className="hm-primary" to={moduleResumePath(progress)}>{progress.lastLesson?'Continue learning':'Start lesson 1-0'} <ChevronRight size={16}/></Link><Link className="hm-secondary" to={`${moduleBase}/practice`}>Practice Arena</Link></div><section className="hm-callout"><h2>শুরু করার আগে</h2><p>HTML কী তা না জানলেও সমস্যা নেই। একটি browser এবং চাইলে local file-এর জন্য VS Code লাগবে। CSS, JavaScript, tables বা backend এই module-এর assessment-এ নেই। Code-এ একটি পরিবর্তন করে Run দিন, তারপর কেন output বদলাল বলার চেষ্টা করুন।</p></section><h2>আপনার learning roadmap</h2><div className="hm-roadmap">{htmlLessons.map(l=><Link key={l.id} to={lessonPath(l.id)}><span>{l.id}</span><div><h3>{l.title}</h3><p>{l.subtitle}</p></div><span>{progress.lessons.includes(l.id)?'✓':'→'}</span></Link>)}</div><section className="hm-callout"><h2>Completion কীভাবে গণনা হয়?</h2><p>{htmlLessons.length}টি lesson complete, {htmlProblems.length}টি problem-এর checks pass, final project-এর checks pass এবং quiz-এ অন্তত ১২/১৫ সঠিক—মোট {htmlLessons.length + htmlProblems.length + 2}টি milestone দিয়ে progress গণনা হয়। Lesson complete নিজে mark করবেন; এটি দক্ষতার certificate নয়। Automatic checker structure দেখে, লেখার মান বা মৌলিকতা বিচার করে না।</p></section><Link to="/learn/web-development/html">আগের ৭টি video class দেখুন →</Link></>;
}
function TextList({items}){return <ul>{items.map((item,i)=><li key={i}>{item}</li>)}</ul>;}
function Lesson({lesson,progress,update,scope}){
 const index=htmlLessons.findIndex(l=>l.id===lesson.id),done=progress.lessons.includes(lesson.id);
 const words=[lesson.intro,...lesson.sections.map(s=>s[1])].join(' ').split(/\s+/).length;
 return <article className="hm-lesson"><p className="hm-eyebrow">LESSON {lesson.id} · প্রায় {Math.max(4,Math.ceil(words/100)+2)} মিনিট</p><h1>{lesson.title}</h1><p className="hm-lead">{lesson.subtitle}</p><section className="hm-objectives"><h2>এই পাঠ শেষে যা পারবেন</h2><TextList items={lesson.objectives}/></section><h2>চেনা ঘটনা দিয়ে শুরু</h2><p>{lesson.intro}</p>{lesson.sections.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}<section><h2>Syntax বুঝি</h2><p className="hm-syntax">{lesson.syntax}</p></section><section><h2>Code example & live output</h2><p>{lesson.output}</p><CodeLab key={lesson.id} initialCode={lesson.code} draftKey={`${moduleStorageKey(scope)}:lesson:${lesson.id}`} title={`Lesson ${lesson.id} example`}/></section><section><h2>Code breakdown</h2><TextList items={lesson.breakdown}/></section>{lesson.id==='1-10'&&<ListExplorer/>}<section className="hm-mistakes"><h2>সাধারণ ভুল ও সংশোধন</h2>{lesson.mistakes.map(([mistake,fix])=><div key={mistake}><h3>{mistake}</h3><p>{fix}</p></div>)}</section><section><h2>দ্রুত revision</h2><TextList items={lesson.revision}/></section><section><h2>নিজেকে প্রশ্ন করুন</h2><ol>{lesson.questions.map(q=><li key={q}>{q}</li>)}</ol><p className="hm-muted">উত্তর নিজের ভাষায় বলুন, তারপর উপরের ব্যাখ্যার সঙ্গে মিলিয়ে দেখুন।</p></section><section className="hm-callout"><h2>Try it yourself</h2><p>{lesson.task}</p><Link to={`${moduleBase}/practice?lesson=${lesson.id}`}>এই বিষয়ের practice →</Link></section><div className="hm-complete"><p>{done?'এই পাঠ complete হিসেবে রাখা হয়েছে।':'পাঠ ও ছোট কাজ শেষ হলে mark করুন।'}</p><button className="hm-primary" disabled={done} onClick={()=>update(p=>({...p,lessons:[...p.lessons,lesson.id]}))}>{done?<><Check size={16}/> Lesson complete</>:'Mark lesson complete'}</button></div><nav className="hm-next" aria-label="Lesson pagination">{index>0?<Link to={lessonPath(htmlLessons[index-1].id)}><ChevronLeft size={16}/> Previous lesson</Link>:<Link to={moduleBase}>Overview</Link>}{index<htmlLessons.length-1?<Link to={lessonPath(htmlLessons[index+1].id)}>Continue learning <ChevronRight size={16}/></Link>:<Link to={`${moduleBase}/practice`}>Go to Practice Arena <ChevronRight size={16}/></Link>}</nav></article>;
}
function Highlight({code}){
 return <pre className="hm-code"><code>{code.split(/(<!--[^]*?-->|<!doctype[^>]*>|<\/?[a-zA-Z][^>]*>)/gi).map((part,i)=>part.startsWith('<')?<span className={part.startsWith('<!--')?'hm-comment':'hm-tag'} key={i}>{part}</span>:part)}</code></pre>;
}
function CodeLab({initialCode,draftKey,title,onCheck,feedback,rules}){
 const [loaded]=useState(()=>readSaved(draftKey,initialCode));
 const [code,setCode]=useState(typeof loaded.value==='string'?loaded.value:initialCode);
 const [rendered,setRendered]=useState(code),[message,setMessage]=useState(loaded.error),[saveState,setSaveState]=useState(loaded.error?'Save unavailable':'Draft loaded');
 const [showSource,setShowSource]=useState(false),[needsRun,setNeedsRun]=useState(false);
 useEffect(()=>{setSaveState('Saving…');const timer=setTimeout(()=>{try{localStorage.setItem(draftKey,JSON.stringify(code));setSaveState('Draft saved in this browser');}catch{setSaveState('Draft could not be saved');}},350);return()=>clearTimeout(timer);},[code,draftKey]);
 const preview=useMemo(()=>previewDocument(rendered,parse),[rendered]);
 const copy=async()=>{try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(code);setMessage('Code copied.');}catch{setMessage('Copy করা যায়নি। Editor-এর code select করে copy করুন।');}};
 return <div className="hm-lab"><div className="hm-lab-toolbar"><span><Code2 size={15}/> HTML editor</span><div><button onClick={copy}><Copy size={14}/> Copy code</button><button onClick={()=>{if(code!==initialCode&&!window.confirm('নিজের edit বাদ দিয়ে starter code ফিরিয়ে আনবেন?'))return;setCode(initialCode);setRendered(initialCode);setNeedsRun(false);setMessage('Starter code restored.');onCheck?.(null);}}><RotateCcw size={14}/> Reset</button></div></div><label className="hm-editor-label">{title}<textarea aria-label={title} value={code} maxLength={100000} onChange={e=>{setCode(e.target.value);setNeedsRun(true);onCheck?.(null);}} spellCheck="false" autoCapitalize="off" autoCorrect="off"/></label><div className="hm-runbar"><button className="hm-primary" onClick={()=>{setRendered(code);setNeedsRun(false);setMessage('Preview updated.');}}><Play size={14}/> Run / Preview</button>{onCheck&&<button className="hm-secondary" onClick={()=>{setRendered(code);setNeedsRun(false);onCheck(code);}}>Check answer</button>}<span role="status">{saveState}{needsRun?' · Preview needs Run':''}</span></div>{message&&<p className="hm-lab-message" role="status">{message}</p>}<div className="hm-preview-heading"><span>Browser preview</span><span>Scripts ও submissions বন্ধ</span></div><iframe title={`${title} output`} sandbox="" referrerPolicy="no-referrer" srcDoc={preview}/><p className="hm-muted hm-preview-note">শুধু embedded sample images দেখা যায়। নিরাপত্তার জন্য বাইরের image, link navigation ও form submission বন্ধ। আসল password লিখবেন না।</p><button className="hm-source-toggle" onClick={()=>setShowSource(v=>!v)} aria-expanded={showSource}>{showSource?'Hide':'Show'} syntax-highlighted code</button>{showSource&&<Highlight code={code}/>} {rules&&<div className="hm-checklist"><h3>Requirements checklist</h3><ul>{rules.map((r,i)=><li key={i} className={feedback?.checks?.[i]?.ok?'hm-check-pass':''}><span>{feedback?feedback.checks?.[i]?.ok?'✓':'○':'○'}</span>{r.label}</li>)}</ul></div>}{feedback&&<div className={`hm-feedback ${feedback.ok?'hm-passed':''}`} role="status"><strong>{feedback.ok?'সব structural checks pass করেছে।':'আরও কিছু সংশোধন দরকার।'}</strong><p>{feedback.error|| (feedback.ok?'Output ও লেখার অর্থ নিজেও মিলিয়ে দেখুন।':'উপরের checklist-এর অসম্পূর্ণ বিষয়গুলো ঠিক করে আবার Check answer দিন।')}</p></div>}</div>;
}
function ListExplorer(){
 const [ordered,setOrdered]=useState(true),[nested,setNested]=useState(false);const Tag=ordered?'ol':'ul';
 const example=`<${ordered?'ol':'ul'}>\n  <li>শনিবার${nested?'\n    <ul><li>পাঠ</li><li>Practice</li></ul>\n  ':''}</li>\n  <li>রবিবার</li>\n</${ordered?'ol':'ul'}>`;
 return <section className="hm-callout"><h2>List visual explorer</h2><p>ধরন বদলে parent ও child item-এর সম্পর্ক দেখুন। কোনো animation বাধ্যতামূলক নয়।</p><div className="hm-actions"><button className="hm-secondary" aria-pressed={ordered} onClick={()=>setOrdered(true)}>Ordered</button><button className="hm-secondary" aria-pressed={!ordered} onClick={()=>setOrdered(false)}>Unordered</button><label><input type="checkbox" checked={nested} onChange={e=>setNested(e.target.checked)}/> Nested কাজ দেখান</label></div><Highlight code={example}/><div className="hm-list-demo" aria-live="polite"><Tag><li>শনিবার{nested&&<ul><li>পাঠ</li><li>Practice</li></ul>}</li><li>রবিবার</li></Tag></div></section>;
}
function Arena({progress}){
 const location=useLocation();const queryLesson=new URLSearchParams(location.search).get('lesson')||'all';
 const [difficulty,setDifficulty]=useState('all'),[topic,setTopic]=useState(queryLesson),[status,setStatus]=useState('all');
 const selected=htmlProblems.filter(p=>(difficulty==='all'||p.difficulty===difficulty)&&(topic==='all'||p.lesson===topic)&&(status==='all'||(status==='solved'?progress.solved.includes(p.id):!progress.solved.includes(p.id))));
 return <><p className="hm-eyebrow">BUILD ONE SMALL THING AT A TIME</p><h1>Module 1 — HTML Practice Arena</h1><p className="hm-lead">নিজের code লিখুন। Requirements বুঝে output দেখুন, তারপর structure পরীক্ষা করুন। Indentation বা attribute order মিলিয়ে grading হয় না।</p><p>{progress.attempted.filter(id=>id!=='final-project').length} attempted · {progress.solved.filter(id=>id!=='final-project').length}/{htmlProblems.length} solved</p><div className="hm-filters"><label>Difficulty<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>{['all','Easy','Medium','Challenge'].map(x=><option key={x} value={x}>{x==='all'?'All difficulties':x}</option>)}</select></label><label>Related lesson<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">All lessons</option>{htmlLessons.map(l=><option key={l.id} value={l.id}>{l.id} · {l.title}</option>)}</select></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All problems</option><option value="solved">Solved</option><option value="remaining">Remaining</option></select></label></div><div className="hm-problem-grid">{selected.map(p=><Link key={p.id} to={`${moduleBase}/practice/${p.id}`}><span className="hm-problem-meta">{p.difficulty} · Lesson {p.lesson}</span><h2>{p.id}. {p.title}</h2><p>{p.description}</p><strong>{progress.solved.includes(p.id)?'Solved ✓':progress.attempted.includes(p.id)?'Continue attempt →':'Start problem →'}</strong></Link>)}</div>{!selected.length&&<p className="hm-callout">এই filter-এ কোনো problem নেই। অন্য filter বেছে নিন।</p>}</>;
}
function Problem({problem,progress,update,scope}){
 const [feedback,setFeedback]=useState(null),[showSolution,setShowSolution]=useState(false);
 const check=code=>{if(code===null){setFeedback(null);return;}const result=validateProblem(problem,code,parse);setFeedback(result);update(p=>recordAttempt(p,problem.id,result.ok));};
 const isFinal=problem.id==='final-project';
 const nextProblem=htmlProblems[htmlProblems.findIndex(p=>p.id===problem.id)+1];
 return <article><Link className="hm-back" to={`${moduleBase}/practice`}>← Practice Arena</Link><p className="hm-eyebrow">{problem.difficulty.toUpperCase()} · LESSON {problem.lesson}</p><h1>{isFinal?problem.title:`${problem.id}. ${problem.title}`}</h1><p className="hm-lead">{problem.description}</p><p><Link to={lessonPath(problem.lesson)}>সংশ্লিষ্ট lesson পড়ুন →</Link></p><section className="hm-callout"><h2>Expected rendered page</h2><p>{problem.expected}</p></section><CodeLab initialCode={problem.starter} draftKey={`${moduleStorageKey(scope)}:problem:${problem.id}`} title={`Problem ${problem.id} HTML code`} onCheck={check} feedback={feedback} rules={problem.rules}/><section className="hm-help"><h2>প্রয়োজনে সাহায্য</h2>{problem.hints.map((hint,i)=><details key={i}><summary>Hint {i+1}</summary><p>{hint}</p></details>)}{!showSolution?<button className="hm-secondary" onClick={()=>setShowSolution(true)}>{progress.solved.includes(problem.id)?'Review solution':'সমাধান দেখে সাহায্য নিতে চাই'}</button>:<div><h3>একটি সম্ভাব্য solution</h3><p>সমাধান দেখা completion নয়। নিজের code বুঝে লিখে checker চালান। একাধিক বৈধ সমাধান থাকতে পারে।</p><Highlight code={problem.solution}/><p>{problem.explanation}</p></div>}</section>{isFinal&&<section className="hm-callout"><h2>নিজের final review</h2><TextList items={['Heading hierarchy এবং paragraph nesting ঠিক আছে?','Link destination ও image path নিজের local browser-এ পরীক্ষা করেছেন?','প্রতিটি input-এর unique id এবং label আছে?','নিজের মৌলিক content লিখেছেন এবং demo form-এর সীমা জানিয়েছেন?']}/><p>Structural checks pass করা এই human review-এর বিকল্প নয়।</p></section>}<nav className="hm-next"><Link to={`${moduleBase}/practice`}>সব problems</Link><Link to={isFinal?`${moduleBase}/assessment`:nextProblem?`${moduleBase}/practice/${nextProblem.id}`:`${moduleBase}/practice`}>{isFinal?'Review quiz':!nextProblem?'Practice Arena':'Next problem'} →</Link></nav></article>;
}
function Assessment({update}){
 const [answers,setAnswers]=useState({}),[submitted,setSubmitted]=useState(false);
 const result=submitted?gradeQuiz(answers):[],score=result.filter(r=>r.ok).length;
 const complete=htmlQuiz.every(q=>Number.isInteger(answers[q.id]));
 return <section><p className="hm-eyebrow">MODULE REVIEW · 15 QUESTIONS</p><h1>শেখা বিষয় মিলিয়ে দেখি</h1><p className="hm-lead">Concept, output prediction, error finding ও structure। সব প্রশ্নের উত্তর দিয়ে submit করুন। Module milestone-এর জন্য অন্তত ১২/১৫ সঠিক প্রয়োজন; আবার চেষ্টা করা যায়।</p><form onSubmit={e=>{e.preventDefault();if(!complete)return;setSubmitted(true);if(gradeQuiz(answers).filter(r=>r.ok).length>=12)update(p=>({...p,quizPassed:true}));}}>{htmlQuiz.map((q,index)=><fieldset className="hm-question" key={q.id} disabled={submitted}><legend><span>{index+1}. {q.kind}</span>{q.prompt}</legend>{q.options.map((option,i)=><label key={i}><input type="radio" name={q.id} checked={answers[q.id]===i} onChange={()=>setAnswers(a=>({...a,[q.id]:i}))}/><span>{option}</span></label>)}{submitted&&<p className={result[index].ok?'hm-correct':'hm-incorrect'}>{result[index].ok?'✓ সঠিক':'○ আবার ভাবুন'} — {q.explanation} সঠিক উত্তর: {q.options[q.answer]}</p>}</fieldset>)}<div className="hm-actions">{!submitted?<><button className="hm-primary" disabled={!complete} type="submit">Submit answers</button><span role="status">{Object.keys(answers).length}/15 answered</span></>:<><p role="status">ফল: {score}/15 · {score>=12?'Quiz milestone complete ✓':'ব্যাখ্যা পড়ে আবার চেষ্টা করুন।'}</p><button type="button" className="hm-secondary" onClick={()=>{setSubmitted(false);setAnswers({});}}>Try again</button><Link to={`${moduleBase}/project`}>Final mini-project →</Link></>}</div></form></section>;
}

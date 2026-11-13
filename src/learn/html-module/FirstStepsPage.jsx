import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Play, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../state/AppContext.jsx';
import { moduleBase } from './lessons.js';
import { previewDocument, validateProblem } from './engine.js';
import { firstSteps, firstPractice, nextTopics, firstProgressKey, cleanFirstProgress } from './firstSteps.js';
import './module.css';
import './firstSteps.css';
const parse = source => new DOMParser().parseFromString(source, 'text/html');
const stepPath = id => `${moduleBase}/steps/${id}`;
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
export function FirstStepsPage() {
  const {state} = useAppContext();
  const scope = state.isLoggedIn ? state.userEmail : 'guest';
  return <Journey key={scope} scope={scope}/>;
}
function Journey({scope}) {
  const {'*': path = ''} = useParams();
  const navigate = useNavigate();
  const id = path.startsWith('steps/') ? path.split('/')[1] : 'motivation';
  const index = firstSteps.findIndex(s => s.id === id), step = firstSteps[index];
  const key = firstProgressKey(scope);
  const [completed, setCompleted] = useState(() => cleanFirstProgress(load(key, [])));
  const [error, setError] = useState('');
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(completed)); } catch { setError('Progress save করা যায়নি। Browser বন্ধ করলে এই অগ্রগতি হারাতে পারে।'); } }, [key, completed]);
  const mark = () => setCompleted(p => cleanFirstProgress([...p, id]));
  if (!step) return <div className="hm-shell"><h1>এই অংশটি পাওয়া যায়নি</h1><Link to={moduleBase}>প্রথম থেকে শুরু করুন</Link></div>;
  return <div className="hm-shell fs-shell" lang="bn">
    <header className="hm-top"><Link to="/learn"><ArrowLeft size={15}/> Web Development</Link><span>HTML · প্রথম ছোট ধাপ</span></header>
    <div className="fs-heading"><p className="hm-eyebrow">অল্প পড়ি · নিজে লিখি · ফল দেখি</p><h1>একটু একটু করে HTML শিখি</h1><p>আজ শুধু heading আর paragraph। একটি অংশ বুঝে পরের অংশে যাব।</p></div>
    <nav className="fs-stepper" aria-label="শেখার ধাপ">{firstSteps.map((s,i) => <Link key={s.id} to={stepPath(s.id)} aria-current={s.id === id ? 'step' : undefined}><span>{completed.includes(s.id) ? <Check size={15}/> : i+1}</span>{s.short}</Link>)}</nav>
    {error && <p className="hm-alert" role="alert">{error}</p>}
    <article className="fs-content" key={id}><p className="hm-eyebrow">ধাপ {index+1} / {firstSteps.length}</p><h2>{step.title}</h2>
      {id !== 'practice' ? <><p className="fs-intro">{step.intro}</p>{step.paragraphs.map(p => <p key={p}>{p}</p>)}{step.code && <SmallEditor initial={step.code} scope={scope} id={id}/>}<p className="fs-takeaway">{step.takeaway}</p></> : <><p className="fs-intro">নিচের ছবির বড় শিরোনাম ও ছোট বাক্যটি দেখুন। নিজের HTML লিখে একই output তৈরি করুন। কোনো রং বা CSS লাগবে না।</p><figure className="fs-target"><figcaption>আপনার লক্ষ্য — ছবিটির মতো output বানান</figcaption><picture><source media="(max-width: 560px)" srcSet="/images/html-first-page-target-mobile.svg" width="360" height="180"/><img src="/images/html-first-page-target.svg" width="760" height="240" alt="সাদা পৃষ্ঠায় বড় শিরোনাম: আমার প্রথম ওয়েবপেজ। নিচে সাধারণ অনুচ্ছেদ: আমি আজ HTML শেখা শুরু করেছি।"/></picture><p>লেখা দুটো হুবহু রাখুন। Device বা font অনুযায়ী মাপে সামান্য পার্থক্য হলে সমস্যা নেই।</p></figure><SmallEditor initial={firstPractice.starter} scope={scope} id={id} onPassed={mark}/></>}
      <nav className="hm-next" aria-label="আগের ও পরের ধাপ">{index > 0 ? <Link to={stepPath(firstSteps[index-1].id)}><ArrowLeft size={15}/> আগের অংশ</Link> : <Link to="/learn">সব courses</Link>}{index < firstSteps.length-1 ? <button className="hm-primary" onClick={() => {mark(); navigate(stepPath(firstSteps[index+1].id));}}>বুঝেছি, পরের অংশ <ArrowRight size={15}/></button> : <Link to={stepPath('heading')}>Heading আবার দেখি →</Link>}</nav>
      {id === 'practice' && completed.includes('practice') && <div className="fs-takeaway" role="status">✓ প্রথম ছোট ধাপ শেষ! আপনি heading আর paragraph দিয়ে একটি webpage তৈরি করেছেন।</div>}
    </article>
    <footer className="fs-coming"><strong>এরপর অল্প অল্প করে যোগ করব</strong><p>{nextTopics.join(' → ')}</p><small>এগুলো পরের অংশের পরিকল্পনা; এখন একসঙ্গে সব পড়তে হবে না।</small></footer>
  </div>;
}
function SmallEditor({initial, scope, id, onPassed}) {
  const key = `${firstProgressKey(scope)}:draft:${id}`;
  const [code, setCode] = useState(() => { const saved = load(key, initial); return typeof saved === 'string' ? saved : initial; });
  const [output, setOutput] = useState(code), [feedback, setFeedback] = useState(null), [solution, setSolution] = useState(false), [saved, setSaved] = useState('');
  useEffect(() => { setSaved('Saving…'); const timer = setTimeout(() => {try {localStorage.setItem(key, JSON.stringify(code));setSaved('এই browser-এ draft saved');} catch {setSaved('Draft save করা যায়নি');}}, 300);return () => clearTimeout(timer); }, [code, key]);
  const preview = useMemo(() => previewDocument(output, parse), [output]);
  const check = () => {setOutput(code);const result = validateProblem(firstPractice, code, parse);setFeedback(result);if (result.ok) onPassed?.();};
  return <section className="fs-editor" aria-label={onPassed ? 'ছবি দেখে HTML practice' : 'উদাহরণ বদলে দেখি'}>
    <div className="fs-editor-header"><h3>{onPassed ? 'এবার নিজের code লিখুন' : 'শব্দ বদলে Run চাপুন'}</h3><button onClick={() => {if (code !== initial && !window.confirm('নিজের লেখা বাদ দিয়ে শুরুতে ফিরবেন?')) return;setCode(initial);setOutput(initial);setFeedback(null);}}><RotateCcw size={14}/> Reset</button></div>
    <label>আপনার HTML<textarea aria-label="আপনার HTML code" value={code} maxLength={100000} onChange={e => {setCode(e.target.value);setFeedback(null);}} spellCheck="false" autoCapitalize="off" autoCorrect="off"/></label>
    <div className="hm-actions"><button className="hm-primary" onClick={() => {setOutput(code);setFeedback(null);}}><Play size={15}/> Run / Preview</button>{onPassed && <button className="hm-secondary" onClick={check}>উত্তর মিলিয়ে দেখি</button>}<small role="status">{saved}</small></div>
    <div className="fs-preview-label">আপনার output</div><iframe sandbox="" referrerPolicy="no-referrer" title="আপনার HTML-এর output" srcDoc={preview}/>
    {feedback && <div className="fs-feedback" role="status"><strong>{feedback.ok ? '✓ ছবির heading ও paragraph ঠিক হয়েছে!' : 'আরেকটু চেষ্টা করুন'}</strong>{feedback.error && <p>{feedback.error}</p>}<ul>{feedback.checks.map(c => <li key={c.label}>{c.ok ? '✓' : '○'} {c.label}</li>)}</ul></div>}
    {onPassed && <div className="fs-help"><h3>আটকে গেছেন?</h3>{firstPractice.hints.map((h,i) => <details key={h}><summary>Hint {i+1}</summary><p>{h}</p></details>)}<button className="hm-secondary" aria-expanded={solution} onClick={() => setSolution(v => !v)}>{solution ? 'Code লুকাই' : 'না পারলে সাহায্যের code দেখি'}</button>{solution && <div><pre><code>{firstPractice.solution}</code></pre><p><code>h1</code> বড় শিরোনাম তৈরি করেছে। <code>p</code> নিচের বাক্যটি আলাদা অনুচ্ছেদ করেছে। আগে code-টি বুঝুন, তারপর editor-এ নিজের হাতে লিখে দেখুন।</p></div>}</div>}
  </section>;
}

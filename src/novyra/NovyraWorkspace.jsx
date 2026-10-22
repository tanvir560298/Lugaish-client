import {TanuGuideSetup} from '../tanu/GuidedSession.jsx';
import {useEffect} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {Calendar,MessageSquare,Code,HelpCircle,Brain,ArrowRight,Sparkles} from 'lucide-react';
import {useNovyra} from './NovyraContext.jsx';
import {StudyPlannerCard} from './StudyPlannerCard.jsx';
import {NovyraChatView,TANU_SUBJECTS} from './NovyraChatView.jsx';
import {CodeMentorView} from './CodeMentorView.jsx';
import {PracticeQuizCard} from './PracticeQuizCard.jsx';
import {StudentMemoryCard} from './StudentMemoryCard.jsx';
import {NovyraOnboardingModal} from './NovyraOnboardingModal.jsx';
import './tanu-workspace.css';
const TABS=[{id:'chat',label:'Ask Tanu',icon:MessageSquare},{id:'planner',label:'Plan my study',icon:Calendar},{id:'practice',label:'Practise a topic',icon:HelpCircle},{id:'code',label:'Work on code',icon:Code},{id:'memory',label:'My goals',icon:Brain},{id:'guided',label:'Study with a timer',icon:Calendar}];
const TASKS=[{id:'chat',title:'“I don’t understand this”',description:'Ask about your class or a confusing idea.',icon:MessageSquare},{id:'planner',title:'“What should I study today?”',description:'Choose a topic and time. Get a step-by-step routine.',icon:Calendar},{id:'practice',title:'“Let me try a question”',description:'Answer a short quiz and review the explanation.',icon:HelpCircle}];
export function NovyraWorkspace(){
 const [params,setParams]=useSearchParams();
 const {profile,activeSubject,setActiveSubject,openOnboarding}=useNovyra();
 const activeTab=TABS.some(t=>t.id===params.get('tab'))?params.get('tab'):params.has('minutes')?'guided':'chat';
 const topic=params.get('topic')||'';
 useEffect(()=>{const requested=params.get('subject');if(TANU_SUBJECTS.some(([id])=>id===requested))setActiveSubject(requested);},[params,profile,setActiveSubject]);
 const choose=id=>{const next=new URLSearchParams(params);next.set('tab',id);setParams(next,{preventScrollReset:true});document.querySelector(".tanu-workspace-main")?.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});};
 return <div className="tanu-workspace"><NovyraOnboardingModal/><header className="tanu-workspace-hero"><span className="tanu-kicker"><Sparkles size={14}/> YOUR LEARNING COMPANION</span><h1>A little help.<br className="tanu-mobile-break"/> <em>A clear next step.</em></h1><p>Tanu helps you understand your HTML lessons, make a study routine, and practise what you learn. Start with one small thing.</p><div className="tanu-task-grid">{TASKS.map(task=>{const Icon=task.icon;return <button key={task.id} onClick={()=>choose(task.id)} aria-pressed={activeTab===task.id}><Icon size={21}/><strong>{task.title}</strong><span>{task.description}</span><small>Let’s start <ArrowRight size={13}/></small></button>;})}</div></header>
 <main className="tanu-workspace-main"><nav className="tanu-workspace-tabs" aria-label="Tanu tools">{TABS.map(tab=>{const Icon=tab.icon;return <button key={tab.id} aria-current={activeTab===tab.id?'page':undefined} onClick={()=>choose(tab.id)}><Icon size={15}/>{tab.label}</button>;})}</nav>
 {activeTab==='chat'&&<NovyraChatView topic={topic}/>}
 {activeTab==='planner'&&<><div className="tanu-tool-intro"><h2>A plan you can actually follow</h2><p>Choose your subject, the part you want to learn, and the time you have. Review the routine before starting.</p></div><StudyPlannerCard initialTopic={topic} initialDuration={Number(params.get('duration'))||null}/></>}
 {activeTab==='practice'&&<><div className="tanu-tool-intro"><h2>Try it. Learn from the answer.</h2><p>Choose a topic, answer the questions, then review what you missed. A practice result helps you decide what to revisit.</p></div><PracticeQuizCard initialSubject={activeSubject} initialTopic={topic||'Core Fundamentals'}/></>}
 {activeTab==='code'&&<><div className="tanu-tool-intro"><h2>Bring the code you’re stuck on</h2><p>Paste a short example and explain what you expected. Built-in mode offers general checklists; a tailored code review needs online AI.</p></div><CodeMentorView/></>}
 {activeTab==='memory'&&<StudentMemoryCard/>}
 {activeTab==='guided'&&<><div className="tanu-tool-intro"><h2>One focused study session</h2><p>Choose a lesson and a time budget. Review the steps, then start when you’re ready.</p></div><TanuGuideSetup/></>}
 <footer className="tanu-workspace-footer"><button onClick={openOnboarding}>Personalise Tanu’s explanations →</button><span>Want to learn by building instead?</span><Link to="/learn/web-development/html">Go to the HTML course <ArrowRight size={14}/></Link></footer></main></div>;
}

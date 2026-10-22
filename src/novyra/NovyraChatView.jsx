import {Link} from 'react-router-dom';
import {useState,useRef,useEffect} from 'react';
import {Send,Sparkles,Trash2,ArrowRight} from 'lucide-react';
import {useNovyra} from './NovyraContext.jsx';
import {TanuMessage} from './TanuMessage.jsx';
import './tanu-workspace.css';
export const TANU_SUBJECTS=[['web_dev','HTML / Web Development'],['english','English'],['arabic','Arabic'],['java','Java'],['python','Python'],['c','C'],['javascript','JavaScript'],['computer_science','Computer Science']];

export function NovyraChatView({compact=false,topic=''}) {
 const {messages,sendMessage,isChatLoading,clearChat,stopReply,activeSubject,setActiveSubject,usage}=useNovyra();
 const [input,setInput]=useState('');
 const feed=useRef(null),editor=useRef(null);
 const subject=TANU_SUBJECTS.find(([id])=>id===activeSubject)?.[1]||'your subject';
 const offline=usage?.engineMode==='offline-template';
 const prompts=activeSubject==='web_dev'?[
  {title:'Understand a concept',description:'A small explanation with an example',prompt:topic?`Help me understand ${topic}`:'What is the difference between h1 and h2?'},
  {title:'Find a place to start',description:'Get a small task from the first class',prompt:'What will I learn in HTML class 01?'},
  {title:'Plan today’s study',description:'Turn 30 minutes into a clear routine',prompt:`Make me a 30-minute study routine for ${topic||'HTML class 01'}`},
 ]:[
  {title:'Ask about a topic',description:'Tell Tanu exactly what is confusing',draft:`I am learning ${subject}. I need help understanding `},
  {title:'Plan today’s study',description:'Start with a manageable 30 minutes',prompt:`Make me a 30-minute study routine for ${subject}`},
  {title:'Bring a practice question',description:'Share the question and what you have tried',draft:`My ${subject} question is: \n\nWhat I tried: `},
 ];
 useEffect(()=>{const el=feed.current;if(el)el.scrollTo({top:el.scrollHeight,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[messages,isChatLoading]);
 const send=async(text)=>{if(!text.trim()||isChatLoading)return;setInput('');await sendMessage(text,{subject:activeSubject});};
 const draft=text=>{setInput(text);editor.current?.focus();};
 const last=messages.at(-1);
 const retryText=last?.isError?[...messages].reverse().find(m=>m.sender==='student')?.content:null;
 return <section className={`tanu-chat ${compact?'is-compact':''}`} aria-label="Tanu learning chat">
  <header className="tanu-chat-header"><div><span className="tanu-chat-mark"><Sparkles size={18}/></span><div><strong>Let’s work through it</strong><small>One question. One small step forward.</small></div></div><button type="button" className="tanu-icon-button" onClick={clearChat} disabled={isChatLoading||!messages.length} aria-label="Start a new conversation" title="Start a new conversation"><Trash2 size={17}/></button></header>
  <div className="tanu-chat-context"><label>Learning <select value={activeSubject} onChange={e=>setActiveSubject(e.target.value)} disabled={isChatLoading}>{TANU_SUBJECTS.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label><span className="tanu-engine-status" role="status">{offline?'Built-in guide':usage?.engineMode==='online-configured'?'Online AI configured':usage?.engineMode==='unavailable'?'Connection unavailable':'Checking connection…'}</span></div>
  {topic&&<p className="tanu-topic">Class context: <strong>{topic.slice(0,160)}</strong></p>}
  <p className="tanu-chat-note">{offline?'Built-in mode gives prepared HTML course help and study routines. It cannot understand every question or review arbitrary code like online AI.':usage?.engineMode==='unavailable'?'The learning service could not be reached. You can still open your HTML classes below.':'Ask a specific question or paste a short code example. Check answers against your lesson; AI can make mistakes.'}</p>
  <div className="tanu-chat-feed" ref={feed} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
   {!messages.length?<div className="tanu-chat-welcome"><span className="tanu-kicker">A LITTLE HELP TO GET GOING</span><h2>Where are you stuck?</h2><p>You don’t need a perfect question. Choose a starting point, or tell me what you’re trying to do.</p><div className="tanu-chat-starters">{prompts.map(p=><button disabled={isChatLoading} key={p.title} onClick={()=>p.draft?draft(p.draft):send(p.prompt)}><span><strong>{p.title}</strong><small>{p.description}</small></span><ArrowRight size={17}/></button>)}</div></div>:messages.map(msg=><article key={msg.id} className={`tanu-chat-message ${msg.sender==='student'?'is-student':'is-tanu'} ${msg.isError?'is-error':''}`}><span className="tanu-message-author">{msg.sender==='student'?'You':'Tanu'}</span><TanuMessage content={msg.content}/>{msg.actionUrl?.startsWith('/tanu?')&&<Link className="tanu-message-action" to={msg.actionUrl}>{msg.actionUrl.includes('tab=planner')?'Build this study routine':'Set up guided study'} <ArrowRight size={14}/></Link>}{msg.sender!=='student'&&!msg.isError&&activeSubject==='web_dev'&&/\bclass\s*0?([1-7])\b/i.test(msg.content)&&<Link className="tanu-message-action" to={`/learn/web-development/html/${String(Number(msg.content.match(/\bclass\s*0?([1-7])\b/i)[1])).padStart(2,'0')}`}>Open this HTML class <ArrowRight size={14}/></Link>}</article>)}
   {isChatLoading&&<div className="tanu-chat-thinking" role="status"><Sparkles size={15}/><span>{last?.isStreaming?'Tanu is replying…':'Tanu is preparing a reply…'}</span><button type="button" onClick={stopReply}>Stop</button></div>}
   {retryText&&!isChatLoading&&<button className="tanu-text-button" onClick={()=>send(retryText)}>Try sending that question again →</button>}
  </div>
  {messages.length>0&&<div className="tanu-chat-next"><span>Keep going</span><button disabled={isChatLoading} onClick={()=>draft(activeSubject==='web_dev'?'What is the difference between div and span?':`My question about ${subject} is: `)}>Ask another question</button><Link to={`/tanu?tab=practice&subject=${activeSubject}`}>Try a practice quiz →</Link></div>}
  <form className="tanu-chat-composer" onSubmit={e=>{e.preventDefault();send(input);}}><label className="sr-only" htmlFor={compact?'tanu-panel-question':'tanu-question'}>Your question for Tanu</label><textarea ref={editor} id={compact?'tanu-panel-question':'tanu-question'} value={input} maxLength={8000} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(input);}}} placeholder={activeSubject==='web_dev'?"Example: h1 আর h2 কখন ব্যবহার করব?":`I’m learning ${subject}. I’m stuck on…`} rows={2}/><button type="submit" disabled={!input.trim()||isChatLoading} aria-label="Send question"><Send size={19}/></button><small>Enter to send · Shift + Enter for a new line · বাংলা বা English-এ লিখতে পারো</small></form>
 </section>;
}

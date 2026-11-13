import { htmlLessons, moduleBase, lessonPath } from './lessons.js';
import { htmlProblems, finalProject } from './problems.js';

const meaningful=el=>!!el?.textContent?.trim();
const elements=(root,selector)=>[...root.querySelectorAll(selector)];
const safeHref=value=>{
 const v=(value||'').trim();
 return !!v&&!/[\u0000-\u0020]/.test(v)&&!v.startsWith('//')&&!/^(?:javascript|data|vbscript|file|blob):/i.test(v)&&(!v.includes(':')||/^https?:\/\//i.test(v));
};
const https=value=>{try{return new URL(value).protocol==='https:';}catch{return false;}};
const goodImage=el=>{
 const src=el.getAttribute('src')?.trim()||'';
 return !!src&&!/^(?:javascript|vbscript|file):/i.test(src)&&!!el.getAttribute('alt')?.trim()&&['width','height'].every(a=>/^[1-9]\d*$/.test(el.getAttribute(a)||''));
};
const directItems=el=>[...el.children].filter(e=>e.localName==='li'&&meaningful(e));
function hasLabel(doc,el){
 const id=el.getAttribute('id');
 return !!id&&elements(doc,'[id]').filter(e=>e.getAttribute('id')===id).length===1&&!!el.getAttribute('name')?.trim()&&elements(doc,'label').some(label=>label.getAttribute('for')===id&&meaningful(label));
}
function passes(rule,doc,source){
 const find=selector=>elements(doc,selector);
 switch(rule.kind){
  case 'count': return find(rule.selector).filter(meaningful).length>=rule.min;
  case 'text': return find(rule.selector).some(e=>e.textContent.replace(/\s+/g,' ').trim()===rule.value);
  case 'attribute': return find(rule.selector).some(e=>meaningful(e)&&e.getAttribute(rule.name)?.toLowerCase()===rule.value);
  case 'directItems': return find(rule.selector).some(e=>directItems(e).length>=rule.min);
  case 'labelled': return find('form input').some(e=>(e.getAttribute('type')||'text').toLowerCase()===rule.type&&hasLabel(doc,e));
  case 'requiredTypes': return rule.types.every(type=>find('form input').some(e=>e.getAttribute('type')===type&&e.hasAttribute('required')&&hasLabel(doc,e)));
  case 'select': return find('form select').some(e=>hasLabel(doc,e)&&elements(e,'option').filter(o=>meaningful(o)&&!!o.getAttribute('value')?.trim()&&!o.hasAttribute('disabled')).length>=rule.min);
  case 'image': return find('img').filter(goodImage).length>=rule.min;
  case 'link': return find('a[href]').some(e=>{
   const href=e.getAttribute('href'),rel=(e.getAttribute('rel')||'').toLowerCase().split(/\s+/);
   return meaningful(e)&&safeHref(href)&&(rule.external?https(href)&&e.getAttribute('target')==='_blank'&&rel.includes('noopener')&&rel.includes('noreferrer'):!/^https?:/i.test(href)&&!href.startsWith('#'));
  });
  case 'resourceList': return find('ul').some(list=>new Set(directItems(list).map(li=>elements(li,'a[href]').find(a=>meaningful(a)&&https(a.getAttribute('href')))?.getAttribute('href')).filter(Boolean)).size>=rule.min);
  case 'imageGroups': return find('div').filter(div=>elements(div,'img').some(goodImage)&&elements(div,'p').some(meaningful)).length>=rule.min;
  case 'nested': return find('li > ul, li > ol').some(list=>directItems(list).length>=rule.min&&['ul','ol'].includes(list.parentElement?.parentElement?.localName));
  case 'document': {
   // Browser parsers repair omitted html/head/body; require authored tags too.
   const authored=source.replace(/<!--[\s\S]*?-->/g,'');
   return /^\s*<!doctype\s+html\s*>/i.test(authored)&&['html','head','body'].every(tag=>new RegExp(`<${tag}(?:\\s|>)`,'i').test(authored)&&new RegExp(`</${tag}\\s*>`,'i').test(authored))&&!!doc.documentElement?.getAttribute('lang')?.trim()&&find('head title').some(meaningful)&&find('head meta').some(e=>e.getAttribute('charset')?.toLowerCase()==='utf-8')&&find('head meta').some(e=>e.getAttribute('name')?.toLowerCase()==='viewport'&&/width\s*=\s*device-width/i.test(e.getAttribute('content')||''));
  }
  default: return false;
 }
}
export function validateProblem(problem,source,parse){
 if(typeof source!=='string'||source.length>100000)return {ok:false,checks:[],error:'Code সর্বোচ্চ 100,000 অক্ষরের মধ্যে রাখুন।'};
 try{
  const doc=parse(source);
  // Hidden/template content is not rendered output and must not satisfy tasks.
  for(const el of elements(doc,'template, [hidden], [aria-hidden="true"]'))el.remove();
  const forbidden=elements(doc,'script,style,iframe,object,embed,table,link,base').length||elements(doc,'meta').some(e=>e.getAttribute('http-equiv'))||elements(doc,'*').some(el=>[...el.attributes].some(a=>/^on/i.test(a.name)||a.name==='style'||a.name==='srcdoc')||['href','action','formaction'].some(a=>el.hasAttribute(a)&&!safeHref(el.getAttribute(a))));
  const checks=problem.rules.map(rule=>({label:rule.label,ok:passes(rule,doc,source)}));
  return {ok:!forbidden&&checks.every(c=>c.ok),checks,error:forbidden?'এই module-এ HTML-only content দিন। Scripts, CSS, tables, embedded pages ও unsafe URLs ব্যবহার করবেন না।':''};
 }catch{return {ok:false,checks:[],error:'HTML পরীক্ষা করা যায়নি। Code ও document structure দেখে আবার চেষ্টা করুন।'};}
}

export const PREVIEW_POLICY="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; frame-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none'";
export function previewDocument(source,parse){
 const doc=parse(String(source).slice(0,100000));
 for(const el of elements(doc,'script,iframe,object,embed,link,base,meta[http-equiv],style'))el.remove();
 for(const el of elements(doc,'*')){
  for(const a of [...el.attributes])if(/^on/i.test(a.name)||['srcdoc','style','action','formaction','ping','srcset'].includes(a.name))el.removeAttribute(a.name);
  if(el.localName==='a')el.removeAttribute('href');
  if(el.localName==='img'&&!/^data:image\/(?:png|gif|jpeg|webp|svg\+xml)[;,]/i.test(el.getAttribute('src')||''))el.removeAttribute('src');
 }
 // The first CSP is trusted; sanitize before serialization. No app DOM injection.
 return `<!doctype html><html lang="bn"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${PREVIEW_POLICY}"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font:16px/1.7 system-ui,sans-serif;margin:20px;color:#172b3a;background:#fff;overflow-wrap:anywhere}img{max-width:100%;height:auto}input,select,button{font:inherit;max-width:100%;box-sizing:border-box}label{margin-right:6px}</style></head><body>${doc.body?.innerHTML||''}</body></html>`;
}

const lessonIds=new Set(htmlLessons.map(l=>l.id));
const problemIds=new Set([...htmlProblems.map(p=>p.id),finalProject.id]);
const cleanList=(value,allowed)=>[...new Set((Array.isArray(value)?value:[]).filter(x=>allowed.has(x)))];
export function cleanModuleProgress(value){
 const p=value&&typeof value==='object'?value:{};
 return {lessons:cleanList(p.lessons,lessonIds),attempted:cleanList(p.attempted,problemIds),solved:cleanList(p.solved,problemIds),lastLesson:lessonIds.has(p.lastLesson)?p.lastLesson:null,quizPassed:p.quizPassed===true};
}
export function moduleProgressPercent(p){return Math.round((p.lessons.length+p.solved.length+Number(p.quizPassed))/(htmlLessons.length+htmlProblems.length+2)*100);}
export function moduleResumePath(p){return p.lastLesson?lessonPath(p.lastLesson):lessonPath(htmlLessons[0].id);}
export function moduleStorageKey(scope){return `lugaish_html_module1_v1:${scope||'guest'}`;}
export function recordAttempt(p,id,ok){return cleanModuleProgress({...p,attempted:[...p.attempted,id],solved:ok?[...p.solved,id]:p.solved});}
export { moduleBase };

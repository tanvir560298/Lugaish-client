import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { htmlLessons, lessonPath, moduleBase } from './lessons.js';
import { htmlProblems, finalProject } from './problems.js';
import { htmlQuiz, gradeQuiz } from './quiz.js';
import { validateProblem, previewDocument, cleanModuleProgress, recordAttempt, moduleProgressPercent, moduleResumePath, moduleStorageKey } from './engine.js';
const browser=new JSDOM('');
const parse=html=>new browser.window.DOMParser().parseFromString(html,'text/html');

test('ordered original curriculum includes all 11 lessons and the complete educational structure',()=>{
 assert.deepEqual(htmlLessons.map(l=>l.id),Array.from({length:11},(_,i)=>`1-${i}`));
 for(const l of htmlLessons){
  for(const key of ['title','intro','syntax','code','output','task'])assert.ok(l[key]?.trim(),`${l.id}: ${key}`);
  assert.equal(l.objectives.length,3);assert.ok(l.sections.length>=5);assert.ok(l.breakdown.length>=3);assert.ok(l.mistakes.length>=2);assert.ok(l.questions.length>=2);assert.ok(l.revision.length>=3);
  assert.match(l.intro,/[\u0980-\u09ff]/);assert.equal(parse(l.code).querySelectorAll('script,style,table').length,0);
  assert.match(lessonPath(l.id),/^\/learn\/web-development\/html\/module-1\/lessons\//);
 }
});
for(const p of [...htmlProblems,finalProject]){
 test(`${p.id}: authored solution passes and unchanged starter fails`,()=>{
  const result=validateProblem(p,p.solution,parse);assert.ok(result.ok,JSON.stringify(result));
  assert.equal(validateProblem(p,p.starter,parse).ok,false);
  const reformatted=p.solution.replace(/></g,'>\n    <');
  assert.equal(validateProblem(p,reformatted,parse).ok,true);
 });
 test(`${p.id}: each requirement has a satisfiable visible checklist label`,()=>{
  assert.ok(p.rules.length>=2);assert.ok(p.hints.length);assert.match(p.description,/[\u0980-\u09ff]/);
  assert.ok(p.rules.every(r=>r.label.trim()));
 });
}
test('practice inventory, difficulty and assessment scope are complete',()=>{
 assert.equal(htmlProblems.length,24);assert.equal(new Set(htmlProblems.map(p=>p.id)).size,24);
 assert.deepEqual(new Set(htmlProblems.map(p=>p.difficulty)),new Set(['Easy','Medium','Challenge']));
 for(const p of htmlProblems)assert.ok(htmlLessons.some(l=>l.id===p.lesson));
 assert.equal(htmlQuiz.length,15);assert.equal(new Set(htmlQuiz.map(q=>q.kind)).size,4);
 assert.ok(htmlQuiz.every(q=>q.options.length===4&&q.options[q.answer]&&q.explanation));
 assert.equal(gradeQuiz({}).filter(r=>r.ok).length,0);
 assert.equal(gradeQuiz(Object.fromEntries(htmlQuiz.map(q=>[q.id,q.answer]))).filter(r=>r.ok).length,15);
});
test('checkers reject concrete incomplete structures instead of exact-source matching',()=>{
 const shopping=htmlProblems.find(p=>p.id==='07');
 assert.equal(validateProblem(shopping,'<h1>ব্যাগ</h1><ul><li>A<ul><li>B</li><li>C</li><li>D</li></ul></li></ul>',parse).ok,false);
 assert.equal(validateProblem(shopping,'<h1>ব্যাগ</h1><ul><li>A</li><li>B</li><li>C</li><li> </li></ul>',parse).ok,false);
 const links=htmlProblems.find(p=>p.id==='09');
 assert.equal(validateProblem(links,'<a href="about.html">About</a><a href="https://example.com" target="_blank" rel="noopener">Reference</a>',parse).ok,false);
 assert.equal(validateProblem(links,'<a href="about.html">About</a><a rel="noreferrer noopener" target="_blank" href="https://example.com">Reference</a>',parse).ok,true);
 const form=htmlProblems.find(p=>p.id==='14');
 assert.equal(validateProblem(form,form.solution.replace('for="n"','for="wrong"'),parse).ok,false);
 assert.equal(validateProblem(form,form.solution.replace('id="e"','id="n"'),parse).ok,false);
 assert.equal(validateProblem(htmlProblems[9],htmlProblems[9].solution.replace('alt="আমার learning card"','alt=""'),parse).ok,false);
});
test('hidden/template/comment content cannot satisfy required output',()=>{
 const p=htmlProblems[0];
 for(const code of [`<!--${p.solution}-->`,`<template>${p.solution}</template>`,`<div hidden>${p.solution}</div>`])assert.equal(validateProblem(p,code,parse).ok,false);
 assert.equal(validateProblem(p,p.solution+'<script>alert(1)</script>',parse).ok,false);
 assert.equal(validateProblem(p,p.solution+'<p onclick="alert(1)">X</p>',parse).ok,false);
 assert.equal(validateProblem(p,p.solution+'<a href="javascript:alert(1)">X</a>',parse).ok,false);
});
test('complete-document task does not accept browser-repaired missing source tags',()=>{
 const p=htmlProblems.find(p=>p.id==='18');
 assert.equal(validateProblem(p,p.solution.replace('<body>',''),parse).ok,false);
 assert.equal(validateProblem(p,p.solution.replace('<!DOCTYPE html>',''),parse).ok,false);
 assert.equal(validateProblem(p,p.solution.replace('<meta charset="utf-8">',''),parse).ok,false);
});
test('preview sanitizes hostile markup and uses a restrictive trusted CSP',()=>{
 const output=previewDocument('<meta http-equiv="refresh" content="0;url=https://bad.test"><base href="https://bad.test"><script>alert(1)</script><iframe src="https://bad.test"></iframe><form action="https://bad.test"><input onfocus="alert(1)"><button formaction="https://bad.test">Go</button></form><a href="javascript:alert(1)" ping="https://bad.test">Link</a><img src="https://bad.test/track" srcset="https://bad.test/track 2x" onerror="alert(1)"><h1>Safe heading</h1>',parse);
 const doc=parse(output);
 assert.equal(doc.querySelectorAll('script,iframe,base,[onfocus],[onerror],[action],[formaction],[ping],[srcset],a[href]').length,0);
 assert.equal(doc.querySelector('img').hasAttribute('src'),false);
 assert.equal(doc.querySelectorAll('meta[http-equiv]').length,1);
 assert.match(doc.querySelector('meta[http-equiv]').getAttribute('content'),/script-src 'none'/);
 assert.match(output,/form-action 'none'/);assert.match(output,/img-src data:/);
 assert.equal(doc.querySelector('h1').textContent,'Safe heading');
});
test('progress cleans corrupt IDs, resumes lessons, tracks attempts and counts all milestones once',()=>{
 const p=cleanModuleProgress({lessons:['1-0','1-0','bad'],attempted:['01','01','99'],solved:['01','99'],lastLesson:'1-0'});
 assert.deepEqual(p.lessons,['1-0']);assert.deepEqual(p.solved,['01']);assert.equal(moduleResumePath(p),lessonPath('1-0'));
 assert.equal(moduleResumePath(cleanModuleProgress(null)),lessonPath('1-0'));
 const attempted=recordAttempt(p,'02',false);assert.ok(attempted.attempted.includes('02'));assert.equal(attempted.solved.includes('02'),false);
 assert.ok(recordAttempt(attempted,'02',true).solved.includes('02'));
 const all=cleanModuleProgress({lessons:htmlLessons.map(l=>l.id),solved:[...htmlProblems.map(p=>p.id),'final-project'],quizPassed:true});
 assert.equal(moduleProgressPercent(all),100);assert.equal(moduleProgressPercent(cleanModuleProgress({})),0);
 assert.deepEqual(cleanModuleProgress(JSON.parse(JSON.stringify(all))),all);
 assert.notEqual(moduleStorageKey('guest'),moduleStorageKey('student@example.com'));
 assert.equal(moduleBase,'/learn/web-development/html/module-1');
});

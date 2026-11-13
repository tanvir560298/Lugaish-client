import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { firstSteps, firstPractice, firstProgressKey, cleanFirstProgress } from './firstSteps.js';
import { validateProblem } from './engine.js';
const browser=new JSDOM('');
const parse=html=>new browser.window.DOMParser().parseFromString(html,'text/html');
test('first release teaches motivation, heading, paragraph and one visual practice, without setup lessons',()=>{
 assert.deepEqual(firstSteps.map(s=>s.id),['motivation','heading','paragraph','practice']);
 assert.doesNotMatch(JSON.stringify(firstSteps),/VS Code|VSCode|installation|Practice Arena/);
 assert.ok(firstSteps.slice(0,3).every(s=>s.intro&&s.paragraphs.length>=3&&s.takeaway));
 assert.equal(firstPractice.rules.length,2);
 assert.ok(!firstPractice.starter.includes('<h1>'));
});
test('visual task accepts correct output and rejects missing or different text',()=>{
 assert.equal(validateProblem(firstPractice,firstPractice.solution,parse).ok,true);
 assert.equal(validateProblem(firstPractice,'<h1>আমার প্রথম ওয়েবপেজ</h1>',parse).ok,false);
 assert.equal(validateProblem(firstPractice,'<h1>ভিন্ন লেখা</h1><p>আমি আজ HTML শেখা শুরু করেছি।</p>',parse).ok,false);
 assert.equal(validateProblem(firstPractice,firstPractice.solution.replace('<h1>','<h1>  ').replace('</h1>','  </h1>'),parse).ok,true);
});
test('new short flow keeps independent progress and matching output image',()=>{
 assert.notEqual(firstProgressKey('guest'),'lugaish_html_module1_v1:guest');
 assert.deepEqual(cleanFirstProgress(['motivation','motivation','1-7',{},'practice']),['motivation','practice']);
 const image=readFileSync('public/images/html-first-page-target.svg','utf8');
 assert.match(image,/আমার প্রথম ওয়েবপেজ/);assert.match(image,/আমি আজ HTML শেখা শুরু করেছি।/);
 const page=readFileSync('src/learn/html-module/FirstStepsPage.jsx','utf8');
 assert.match(page,/useState\(false\)/);assert.match(page,/না পারলে সাহায্যের code দেখি/);
 const app=readFileSync('src/App.jsx','utf8');assert.match(app,/import\('\.\/learn\/html-module\/FirstStepsPage.jsx'\)/);
});

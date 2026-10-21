import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { send, evaluate, visit, close } from './browserClient.mjs';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4174';
// A dedicated profile keeps real student data out of this check.
await send('Runtime.enable');
async function waitFor(expression) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error(`Timed out: ${expression}`);
}
async function open(path, width = 1280) {
  await visit(base + path, width);
  await waitFor("!!document.querySelector('.lx-home,.lx-learn')");
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth + 1'), false, `Overflow on ${path} at ${width}`);
  assert.equal(await evaluate("document.body.textContent.includes('This page could not load.')"), false);
}
try {
  await open('/');
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
  await open('/learn?category=creative', 390);
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 1);
  assert.match(await evaluate("document.querySelector('.upcoming-card').textContent"), /Video Editing/);
  await open('/learn?category=invalid');
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
  await open('/upcoming/c-programming', 390);
  await evaluate("localStorage.removeItem('lugaish_course_interest:c-programming'); location.reload()");
  await waitFor("!!document.querySelector('.upcoming-preview button[aria-pressed=false]')");
  await evaluate("document.querySelector('.upcoming-preview button[aria-pressed]').click()");
  await waitFor("document.querySelector('.upcoming-preview button[aria-pressed]')?.getAttribute('aria-pressed')==='true'");
  assert.equal(await evaluate("localStorage.getItem('lugaish_course_interest:c-programming')"), '1');
  await open('/upcoming/c-programming', 390);
  await waitFor("document.querySelector('.upcoming-preview button[aria-pressed]')?.getAttribute('aria-pressed')==='true'");
  await evaluate("document.querySelector('.upcoming-preview button[aria-pressed]').click()");
  await waitFor("localStorage.getItem('lugaish_course_interest:c-programming')===null");
  for (const id of ['arabic-learning', 'video-editing', 'english-masterclass']) {
    await open(`/upcoming/${id}`);
    assert.equal(await evaluate("document.querySelectorAll('.lx-syllabus li').length"), 5);
  }
  await open('/upcoming/missing', 390);
  assert.match(await evaluate('document.body.textContent'), /Course preview not found/);
  await open('/', 390);
  await mkdir('docs/visual-checks', { recursive: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile('docs/visual-checks/upcoming-mobile.png', Buffer.from(shot.data, 'base64'));
  await open('/');
  await evaluate("document.getElementById('upcoming-courses').scrollIntoView()");
  const desktop = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('docs/visual-checks/upcoming-desktop.png', Buffer.from(desktop.data, 'base64'));
  const mock = await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    const originalFetch = window.fetch;
    window.fetch = (url, options) => /\\/courses$/.test(String(url))
      ? Promise.resolve(new Response(JSON.stringify([{language:'english',title:'Published English',description:'Public course preview',status:'published'}]), {headers:{'Content-Type':'application/json'}}))
      : originalFetch(url, options);
  ` });
  await visit(base + '/course/english');
  await waitFor("document.querySelector('h1')?.textContent==='Published English'");
  assert.match(await evaluate('document.body.textContent'), /Sign in to enroll/);
  await evaluate("Array.from(document.querySelectorAll('a')).find(a=>a.textContent==='Sign in to enroll').click()");
  await waitFor("location.pathname==='/login'");
  assert.equal(await evaluate("history.state.usr.from.pathname"), '/course/english');
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: mock.identifier });
  const blocked = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Storage.prototype.getItem = function() { throw new Error('Storage disabled'); }; Storage.prototype.removeItem = function() { throw new Error('Storage disabled'); };" });
  await open('/');
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: blocked.identifier });
  console.log('PASS: home, category filters, four course previews, invalid routes, saved interest persistence/removal, mobile overflow, guest course preview, login return path, disabled storage recovery.');
} finally { close(); }

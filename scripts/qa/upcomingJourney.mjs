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
  for (const width of [1440, 1024, 768, 390, 360]) {
    await open('/', width);
    assert.equal(await evaluate("document.querySelectorAll('[data-course=web-development]').length"), 1);
    assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
    const desktop = await evaluate("getComputedStyle(document.querySelector('.academic-nav')).display!=='none'");
    if (desktop) {
      assert.equal(await evaluate("(()=>{const brand=document.querySelector('.academic-brand').getBoundingClientRect(),nav=document.querySelector('.academic-nav').getBoundingClientRect(),actions=document.querySelector('.academic-header-actions').getBoundingClientRect();return brand.right<=nav.left&&nav.right<=actions.left})()"), true, `Navbar overlap at ${width}`);
    } else {
      await evaluate("document.querySelector('button[aria-controls=mobile-navigation]').click()");
      await waitFor("!!document.querySelector('#mobile-navigation')");
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
      await waitFor("!document.querySelector('#mobile-navigation')");
      assert.equal(await evaluate("document.activeElement.getAttribute('aria-controls')"), 'mobile-navigation');
      await evaluate("document.querySelector('button[aria-controls=mobile-navigation]').click()");
      await evaluate("document.querySelector('#mobile-navigation a[href=\"/learn\"]').click()");
      await waitFor("location.pathname==='/learn' && !document.querySelector('#mobile-navigation')");
      assert.equal(await evaluate("document.querySelector('.academic-nav a[href=\"/learn\"]').getAttribute('aria-current')"), 'page');
    }
  }
  await open('/');
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
  await open('/learn?category=creative', 390);
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
  assert.equal(await evaluate("document.querySelectorAll('[data-course=web-development]').length"), 1);
  assert.equal(await evaluate("!!(document.querySelector('[data-course=web-development]').compareDocumentPosition(document.getElementById('upcoming-courses')) & Node.DOCUMENT_POSITION_FOLLOWING)"), true);
  assert.equal(await evaluate("!!document.querySelector('a[href=\"/learn/java\"]')"), false);
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
  for (const retired of ['/learn/java', '/learn/java/first-program', '/course/english', '/course/arabic', '/pricing']) {
    await visit(base + retired);
    await waitFor("location.pathname==='/learn' && !!document.querySelector('[data-course=web-development]')");
  }
  await visit(base + '/profile');
  await waitFor("location.pathname==='/login'");
  assert.equal(await evaluate("history.state.usr.from.pathname"), '/profile');
  const blocked = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Storage.prototype.getItem = function() { throw new Error('Storage disabled'); }; Storage.prototype.removeItem = function() { throw new Error('Storage disabled'); };" });
  await open('/');
  assert.equal(await evaluate("document.querySelectorAll('.upcoming-card').length"), 4);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: blocked.identifier });
  console.log('PASS: home, one ongoing course followed by four upcoming courses, four course previews, invalid routes, saved interest persistence/removal, navbar spacing/Escape/navigation at five widths, mobile overflow, retired course redirects, login return path, disabled storage recovery.');
} finally { close(); }

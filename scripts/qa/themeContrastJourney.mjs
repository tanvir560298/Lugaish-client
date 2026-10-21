import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { send, evaluate, visit, close } from './browserClient.mjs';
import { scanTextContrast } from './contrastScan.mjs';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4174';
const results = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function setTheme(theme) {
  if (await evaluate('document.documentElement.dataset.theme') !== theme) {
    await evaluate(`document.querySelector('button[aria-label="${theme === 'dark' ? 'Dark' : 'Light'} mode"]').click()`);
  }
  await pause(400);
  assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
}
async function check(label, theme, width) {
  const failures = await evaluate(`(${scanTextContrast.toString()})()`);
  results.push({ label, theme, width, failures });
  if (failures.length) console.error(label, theme, width, JSON.stringify(failures));
}
async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(`docs/visual-checks/theme-${name}.png`, Buffer.from(result.data, 'base64'));
}
try {
  await mkdir('docs/visual-checks', { recursive: true });
  for (const theme of ['dark', 'light']) {
    // The app selection must override the operating system's opposite preference.
    await send('Emulation.setEmulatedMedia', { features: [
      { name: 'prefers-color-scheme', value: theme === 'dark' ? 'light' : 'dark' },
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ] });
    for (const path of ['/', '/learn', '/learn/java', '/learn/java/first-program', '/learn/web-development/html', '/pricing', '/login', '/learning-spaces', '/tanu', '/architects', '/support', '/privacy', '/terms', '/upcoming/c-programming', '/upcoming/arabic-learning', '/upcoming/video-editing', '/upcoming/english-masterclass']) {
      await visit(base + path);
      await setTheme(theme);
      await pause(200);
      await check(path, theme, 1280);
    }
    await visit(base + '/tanu');
    await setTheme(theme);
    for (const tab of ['Tutor Chat', 'Code Mentor', 'Practice Quizzes', 'My Memory & Goals']) {
      await evaluate(`Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === ${JSON.stringify(tab)}).click()`);
      await pause(350);
      await check(`Tanu / ${tab}`, theme, 1280);
    }
    await screenshot(`tanu-${theme}`);
    await evaluate("document.querySelector('[title=\"Open Tanu AI Companion\"]').click()");
    await pause(350);
    await check('Tanu drawer', theme, 1280);
    await screenshot(`drawer-${theme}`);
    for (const path of ['/', '/learn', '/tanu', '/login']) {
      await visit(base + path, 390);
      await setTheme(theme);
      await check(path, theme, 390);
      assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth + 1'), false, `Mobile overflow: ${path}`);
      if (path === '/') {
        await evaluate("document.querySelector('button[aria-controls=mobile-navigation]').click()");
        await pause(200);
        await check('Mobile navigation', theme, 390);
        await screenshot(`mobile-${theme}`);
      }
    }
    await send('Page.reload');
    await pause(600);
    assert.equal(await evaluate('document.documentElement.dataset.theme'), theme, 'Theme survives reload');
  }
  await writeFile('docs/visual-checks/theme-contrast.json', JSON.stringify(results, null, 2) + '\n');
  const count = results.reduce((total, result) => total + result.failures.length, 0);
  assert.equal(count, 0, `${count} text contrast failures; inspect docs/visual-checks/theme-contrast.json`);
  console.log(`PASS: ${results.length} text contrast checks, app theme overrides device preference, theme persists, mobile layouts stay in viewport.`);
} finally { close(); }

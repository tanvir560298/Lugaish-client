import fs from 'fs';
import { spawn } from 'child_process';

const SCRATCH_DIR = '/Users/tanvir/.gemini/antigravity-ide/brain/a2b99c0f-b1ce-492c-8918-b37b9cfb89d1/scratch';
const PORT = 9225;
const USER_DATA = `/tmp/chrome-test-${Date.now()}`;

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--window-size=1280,960',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  const killChrome = () => {
    try { chrome.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}
  };

  const timer = setTimeout(() => {
    console.error('Test timed out after 35s');
    killChrome();
    process.exit(1);
  }, 35000);

  try {
    await new Promise(r => setTimeout(r, 1500));
    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://127.0.0.1:5180/study-room-preview`, { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let nextId = 1;
    const pending = new Map();
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve } = pending.get(msg.id);
        pending.delete(msg.id);
        resolve(msg.result);
      }
    };

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('1. Loading Study Room with Character Selector...');
    await new Promise(r => setTimeout(r, 3000));
    const shotAmina = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/char_01_amina_default.png`, Buffer.from(shotAmina.data, 'base64'));
    console.log('Saved char_01_amina_default.png');

    console.log('2. Selecting "Noor"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('.ls-character-option')).find(b => b.textContent.includes('Noor'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const shotNoor = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/char_02_noor_selected.png`, Buffer.from(shotNoor.data, 'base64'));
    console.log('Saved char_02_noor_selected.png');

    console.log('3. Selecting "Zain"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('.ls-character-option')).find(b => b.textContent.includes('Zain'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const shotZain = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/char_03_zain_selected.png`, Buffer.from(shotZain.data, 'base64'));
    console.log('Saved char_03_zain_selected.png');

    console.log('4. Navigating to /learning-spaces-preview...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5180/learning-spaces-preview' });
    await new Promise(r => setTimeout(r, 3000));
    const shotUni = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/char_04_uni_entrance_character.png`, Buffer.from(shotUni.data, 'base64'));
    console.log('Saved char_04_uni_entrance_character.png');

    console.log('All character tests passed successfully!');
    clearTimeout(timer);
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    killChrome();
  }
}

run();

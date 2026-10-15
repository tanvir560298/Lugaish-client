import fs from 'fs';
import { spawn } from 'child_process';

const SCRATCH_DIR = '/Users/tanvir/.gemini/antigravity-ide/brain/a2b99c0f-b1ce-492c-8918-b37b9cfb89d1/scratch';

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1280,900',
  ]);

  try {
    await new Promise(r => setTimeout(r, 1200));
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://127.0.0.1:5180/study-room-preview', { method: 'PUT' });
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

    console.log('1. Waiting 3s for initial load (Window desk seated)...');
    await new Promise(r => setTimeout(r, 3000));
    const shotWindow = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seat_01_window.png`, Buffer.from(shotWindow.data, 'base64'));
    console.log('Saved seat_01_window.png');

    console.log('2. Clicking "Quiet desk"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('.ls-seat-options button')).find(b => b.textContent.includes('Quiet desk'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 3500));
    const shotQuiet = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seat_02_quiet.png`, Buffer.from(shotQuiet.data, 'base64'));
    console.log('Saved seat_02_quiet.png');

    console.log('3. Clicking "Reading lounge"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('.ls-seat-options button')).find(b => b.textContent.includes('Reading lounge'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 3500));
    const shotLounge = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seat_03_lounge.png`, Buffer.from(shotLounge.data, 'base64'));
    console.log('Saved seat_03_lounge.png');

    console.log('4. Clicking "Leave seat" for Room Overview...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Leave seat'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    const shotOverview = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seat_04_grand_overview.png`, Buffer.from(shotOverview.data, 'base64'));
    console.log('Saved seat_04_grand_overview.png');

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

run();

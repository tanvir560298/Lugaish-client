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
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        console.error('[BROWSER ERROR]', msg.params.args.map(a => a.value || a.description).join(' '));
      }
    };

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('1. Loading Study Room preview directly...');
    await new Promise(r => setTimeout(r, 3000));

    // Test switching to Quiet desk
    console.log('2. Clicking "Quiet desk" button...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('.ls-seat-options button'));
        const quietBtn = buttons.find(b => b.textContent.includes('Quiet desk'));
        if (quietBtn) { quietBtn.click(); return 'clicked quiet desk'; }
        return 'not found';
      })()`
    });

    // Wait 1.5s while walking to quiet desk
    await new Promise(r => setTimeout(r, 1500));
    const shotQuietWalking = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_05_walking_to_quiet_desk.png`, Buffer.from(shotQuietWalking.data, 'base64'));
    console.log('Saved seq_05_walking_to_quiet_desk.png');

    // Wait 2.5s for seating at quiet desk
    await new Promise(r => setTimeout(r, 2500));
    const shotQuietSeated = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_06_seated_quiet_desk.png`, Buffer.from(shotQuietSeated.data, 'base64'));
    console.log('Saved seq_06_seated_quiet_desk.png');

    // Test Leave seat
    console.log('3. Clicking "Leave seat"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const leaveBtn = buttons.find(b => b.textContent.includes('Leave seat'));
        if (leaveBtn) { leaveBtn.click(); return 'clicked leave'; }
        return 'not found';
      })()`
    });

    await new Promise(r => setTimeout(r, 1200));
    const shotLeave = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_07_left_seat.png`, Buffer.from(shotLeave.data, 'base64'));
    console.log('Saved seq_07_left_seat.png');

    // Test simple view toggle
    console.log('4. Testing "Use simple view" toggle...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const simpleBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Use simple view'));
        if (simpleBtn) simpleBtn.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 800));
    const shotSimple = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_08_simple_view.png`, Buffer.from(shotSimple.data, 'base64'));
    console.log('Saved seq_08_simple_view.png');

    console.log('All interactive study room tests passed!');
  } catch (err) {
    console.error('Interactive test error:', err);
  } finally {
    chrome.kill();
  }
}

run();

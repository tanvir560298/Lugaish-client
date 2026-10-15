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
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://127.0.0.1:5180/learning-spaces-preview', { method: 'PUT' });
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
    await send('DOM.enable');

    console.log('1. Waiting 3s for University Entrance scene to load...');
    await new Promise(r => setTimeout(r, 3000));

    // Capture Entrance View
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_01_entrance_courtyard.png`, Buffer.from(shot1.data, 'base64'));
    console.log('Saved seq_01_entrance_courtyard.png');

    // Click "Go to Study Room"
    console.log('2. Clicking "Go to Study Room"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const studyBtn = buttons.find(b => b.textContent.includes('Go to Study Room'));
        if (studyBtn) { studyBtn.click(); return 'clicked study button'; }
        return 'not found';
      })()`
    });

    // Wait 1.8s during walk towards door
    await new Promise(r => setTimeout(r, 1800));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_02_walking_to_door.png`, Buffer.from(shot2.data, 'base64'));
    console.log('Saved seq_02_walking_to_door.png');

    // Poll until navigation to /study-room-preview occurs
    console.log('3. Waiting for arrival at door and transition to Study Room...');
    let navUrl = '';
    const startWait = Date.now();
    while (Date.now() - startWait < 8000) {
      const checkUrl = await send('Runtime.evaluate', { expression: 'window.location.pathname' });
      navUrl = checkUrl.result?.value;
      if (navUrl.includes('study-room')) {
        console.log(`Navigated to ${navUrl} after ${(Date.now() - startWait)}ms!`);
        break;
      }
      await new Promise(r => setTimeout(r, 300));
    }

    // Capture arrival inside Study Room
    await new Promise(r => setTimeout(r, 1000));
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_03_study_room_arrival.png`, Buffer.from(shot3.data, 'base64'));
    console.log('Saved seq_03_study_room_arrival.png');

    // Poll until seated (or wait 4s for sitDown animation)
    console.log('4. Waiting for student to approach chair, turn, and sit down...');
    let seatedState = null;
    const startSitWait = Date.now();
    while (Date.now() - startSitWait < 6000) {
      const evalState = await send('Runtime.evaluate', {
        expression: `(() => {
          const header = document.querySelector('.ls-desk-header')?.textContent || '';
          const caption = document.querySelector('.ls-desk-caption')?.textContent || '';
          const startBtn = document.querySelector('.ls-timer-card button.ls-primary');
          const isSeated = header.includes('Seated');
          return {
            header,
            caption,
            isSeated,
            startDisabled: startBtn ? startBtn.disabled : null,
            startText: startBtn ? startBtn.textContent : ''
          };
        })()`,
        returnByValue: true
      });
      seatedState = evalState.result?.value;
      if (seatedState?.isSeated) {
        console.log(`Student reached chair and sat down! State:`, seatedState);
        break;
      }
      await new Promise(r => setTimeout(r, 400));
    }

    await new Promise(r => setTimeout(r, 800));
    const shot4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${SCRATCH_DIR}/seq_04_seated_controls_unlocked.png`, Buffer.from(shot4.data, 'base64'));
    console.log('Saved seq_04_seated_controls_unlocked.png');

    console.log('Full sequence completed successfully!');
  } catch (err) {
    console.error('Sequence test error:', err);
  } finally {
    chrome.kill();
  }
}

run();

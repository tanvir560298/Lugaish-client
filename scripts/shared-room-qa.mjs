// Real local integration test. Creates and drops a uniquely named test database;
// never connects to the application's database or production. Browser tooling
// is optional and supplied externally through QA_PLAYWRIGHT_MODULE.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(new URL('../server/package.json', import.meta.url));
const mongoose = require('mongoose'), jwt = require('jsonwebtoken');
const root = fileURLToPath(new URL('../', import.meta.url));
const database = `lugaish_study_test_${process.pid}`;
const secret = `local-fixture-${process.pid}-${Date.now()}`;
const apiPort = 5012, webPort = 4182;
const base = `http://127.0.0.1:${apiPort}/api/study`, web = `http://127.0.0.1:${webPort}`;
const children = []; let browser;
async function ready(url) {
  for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) return; } catch {} await delay(100); }
  throw new Error(`Service did not start: ${url}`);
}
const launch = (args, env) => { const child = spawn(process.execPath, args, { cwd: root, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] }); children.push(child); child.stderr.on('data', b => process.stderr.write(b)); return child; };
try {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
  const { User } = await import('../server/src/models/User.js');
  const { StudyRoom } = await import('../server/study/models.js');
  const names = ['Amina', 'Tanvir', 'Rafi', 'Mira', 'Sami', 'Noor', 'Outside'];
  const users = await User.create(names.map((name, i) => ({ name, email: `study-qa-${i}@example.test`, authProvider: 'local' })));
  const tokens = users.map(u => jwt.sign({ userId: String(u._id) }, secret, { expiresIn: '1h' }));
  const clients = users.map((_, i) => `qa-client-${i}`);
  launch(['server/src/index.js'], { NODE_ENV: 'development', PORT: String(apiPort), MONGODB_URI: `mongodb://127.0.0.1:27017/${database}`, JWT_SECRET: secret, CORS_ORIGIN: web, FIREBASE_PROJECT_ID: 'local-study-qa' });
  await ready(`http://127.0.0.1:${apiPort}/health`);
  async function request(i, path, body, expected = 200) {
    const res = await fetch(`${base}${path}`, { headers: { Authorization: `Bearer ${tokens[i]}`, 'Content-Type': 'application/json' }, method: body ? 'POST' : 'GET', ...(body ? { body: JSON.stringify({ client: clients[i], ...body }) } : {}) });
    const data = await res.json(); assert.equal(res.status, expected, JSON.stringify(data)); return data;
  }
  const anon = await fetch(`${base}/home`); assert.equal(anon.status, 401);
  // Independent auth sessions, real MongoDB and real bearer verification.
  let roomId;
  if (process.env.QA_PLAYWRIGHT_MODULE) {
    launch(['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'], { VITE_API_URL: `http://127.0.0.1:${apiPort}/api` });
    await ready(web);
    const { chromium } = await import(process.env.QA_PLAYWRIGHT_MODULE);
    browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    const errors = [];
    const contexts = await Promise.all([browser.newContext({ viewport: { width: 1280, height: 900 } }), browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })]);
    for (let i = 0; i < 2; i++) await contexts[i].addInitScript(({ token, email }) => {
      localStorage.setItem('lugaish_auth_token', token);
      if (!localStorage.getItem('lugaish_state_v1')) localStorage.setItem('lugaish_state_v1', JSON.stringify({ isLoggedIn: true, userRole: 'learner', userEmail: email, activePathway: 'english', enrolledPathways: ['english'] }));
    }, { token: tokens[i], email: users[i].email });
    const [a, b] = await Promise.all(contexts.map(c => c.newPage()));
    for (const p of [a, b]) p.on('pageerror', e => errors.push(e.message));
    await Promise.all([a.goto(`${web}/study-room`), b.goto(`${web}/study-room`)]);
    await a.getByLabel('Study notes', { exact: true }).fill('Private Amina notebook');
    await a.getByRole('button', { name: 'Window desk', exact: false }).click();
    await a.getByRole('button', { name: 'Start studying', exact: true }).click();
    const timerId = await a.evaluate(() => JSON.parse(localStorage.getItem('lugaish-study-v1:study-qa-0%40example.test:english:timer')).id);
    await a.getByRole('button', { name: 'Study with friends', exact: true }).click();
    await a.getByRole('button', { name: 'Create a room', exact: true }).click();
    await a.getByRole('button', { name: 'Enter directly', exact: true }).click();
    await a.getByRole('button', { name: 'Use simple view', exact: true }).click();
    await a.locator('.sr-seat-1').click();
    await a.locator('summary').filter({ hasText: /^Invite a friend$/ }).click();
    await a.getByLabel('Friend’s email').fill(users[1].email);
    await a.getByRole('button', { name: 'Invite a friend', exact: true }).click();
    await a.getByLabel('Private invitation link').waitFor();
    const invited = (await request(1, '/home')).invitations; assert.equal(invited.length, 1);
    await b.locator('summary').filter({ hasText: /Study invitations/ }).click();
    await b.getByRole('button', { name: 'Accept', exact: true }).click();
    await b.getByRole('button', { name: 'Join room', exact: true }).click();
    await b.getByRole('button', { name: 'Enter directly', exact: true }).click();
    await b.locator('.sr-seat-4').click();
    await b.getByRole('button', { name: 'Start studying', exact: true }).click();
    await delay(2200);
    const home = await request(0, '/home'); roomId = home.room.id;
    assert.equal(home.room.members.length, 2); assert.ok(home.room.togetherMs > 500);
    assert.equal(await a.evaluate(() => JSON.parse(localStorage.getItem('lugaish-study-v1:study-qa-0%40example.test:english:timer')).id), timerId);
    assert.equal(await b.getByLabel('Study notes', { exact: true }).inputValue(), '');
    await a.getByRole('button', { name: 'Call over', exact: true }).click();
    await b.getByRole('button', { name: 'Join table', exact: true }).waitFor();
    assert.equal((await request(1, '/home')).room.members.find(m => m.id === String(users[1]._id)).seat, 's4');
    await b.getByRole('button', { name: 'Join table', exact: true }).click();
    await delay(1100);
    assert.equal((await request(1, '/home')).room.members.find(m => m.id === String(users[1]._id)).seat, 's2');
    await b.getByRole('button', { name: 'Focus view', exact: true }).click();
    await delay(1200);
    await StudyRoom.updateOne({ _id: roomId }, { $set: { 'members.$[m].lastCall': 0 } }, { arrayFilters: [{ 'm.id': String(users[0]._id) }] });
    await a.getByRole('button', { name: 'Call over', exact: true }).click();
    await delay(1100);
    assert.equal(await b.getByRole('button', { name: 'Join table', exact: true }).count(), 0);
    assert.equal((await request(1, '/home')).room.members.find(m => m.id === String(users[1]._id)).call, null);
    await b.getByRole('button', { name: 'Pause', exact: true }).click();
    await delay(1100);
    const paused = (await request(0, '/home')).room.togetherMs;
    await delay(1100); assert.equal((await request(0, '/home')).room.togetherMs, paused);
    await b.getByRole('button', { name: 'Resume', exact: true }).click();
    await delay(1100);
    const beforeOffline = (await request(0, '/home')).room;
    await contexts[1].setOffline(true);
    console.log('Checking real network loss and the 20-second reconnection grace…');
    await delay(22000);
    const offline = (await request(0, '/home')).room;
    assert.equal(offline.members.find(m => m.id === String(users[1]._id)).phase, 'reconnecting');
    assert.ok(offline.togetherMs - beforeOffline.togetherMs <= 20500);
    const stopped = offline.togetherMs;
    await delay(1100); assert.equal((await request(0, '/home')).room.togetherMs, stopped);
    await contexts[1].setOffline(false);
    await delay(7000);
    const resumed = (await request(0, '/home')).room;
    assert.equal(resumed.members.find(m => m.id === String(users[1]._id)).seat, 's2');
    assert.ok(resumed.togetherMs > stopped);
    await b.getByRole('button', { name: 'Exit focus view', exact: true }).click();
    await a.reload();
    await a.getByRole('button', { name: 'Enter directly', exact: true }).click();
    assert.equal(await a.getByLabel('Study notes', { exact: true }).inputValue(), 'Private Amina notebook');
    await a.locator('.sr-seat-1[aria-pressed=true]').waitFor();
    await a.locator('.sr-scene canvas').waitFor();
    await a.screenshot({ path: '/tmp/lugaish-shared-desktop.png', fullPage: true });
    await b.screenshot({ path: '/tmp/lugaish-shared-mobile.png', fullPage: true });
    assert.ok(await b.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    // A second tab of the same account must not create a sixth/duplicate person.
    const duplicate = await contexts[0].newPage(); await duplicate.goto(`${web}/study-room`);
    assert.equal((await request(0, '/home')).room.members.length, 2);
    await duplicate.getByRole('button', { name: 'Use this tab', exact: true }).click();
    await a.getByRole('button', { name: 'Use this tab', exact: true }).waitFor();
    await duplicate.close();
    await a.getByRole('button', { name: 'Use this tab', exact: true }).click();
    assert.deepEqual(errors, []);
    console.log('PASS: two isolated authenticated Chrome sessions; real invitations, presence, overlap, call/accept, focus suppression, pause/resume, offline grace/recovery, private notes, refresh, duplicate-tab control, desktop 3D, mobile no overflow.');
    await browser.close(); browser = null;
    for (let i = 0; i < 2; i++) await request(i, `/${roomId}/action`, { action: 'takeover' });
  } else {
    roomId = (await request(0, '/create', {})).room.id;
    const inv = await request(0, `/${roomId}/action`, { action: 'invite', email: users[1].email });
    const delivered = await request(1, '/invitations');
    assert.equal(delivered.length, 1);
    await request(1, '/accept', { token: inv.token });
  }
  // Control fixtures use real API calls; only time-bound cooldown/expiry setup
  // is edited directly in this disposable test database.
  for (let i = 2; i <= 5; i++) {
    await StudyRoom.updateOne({ _id: roomId }, { $set: { 'members.$[m].lastInvite': 0 } }, { arrayFilters: [{ 'm.id': String(users[0]._id) }] });
    const inv = await request(0, `/${roomId}/action`, { action: 'invite', email: users[i].email });
    clients[i] = `qa-client-${i}`;
    if (i < 4) await request(i, '/accept', { token: inv.token });
    else tokens[`inv${i}`] = inv.token;
  }
  const finalJoin = await Promise.all([4, 5].map(async i => {
    const res = await fetch(`${base}/accept`, { method: 'POST', headers: { Authorization: `Bearer ${tokens[i]}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tokens[`inv${i}`], client: clients[i] }) });
    return { i, status: res.status };
  }));
  assert.deepEqual(finalJoin.map(x => x.status).sort(), [200, 409]);
  const winner = finalJoin.find(x => x.status === 200).i;
  assert.equal((await request(0, '/home')).room.members.length, 5);
  await request(6, `/${roomId}/action`, { action: 'seat', seat: 's3', direct: true }, 403);
  await request(6, '/accept', { token: tokens[`inv${winner}`] }, 403);
  const race = await Promise.all([2, 3].map(async i => {
    const res = await fetch(`${base}/${roomId}/action`, { method: 'POST', headers: { Authorization: `Bearer ${tokens[i]}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ client: clients[i], action: 'seat', seat: 's3', direct: true }) });
    return res.status;
  }));
  assert.deepEqual(race.sort(), [200, 409]);
  // The last unoccupied chair is also reserved atomically, even when a seated
  // participant and the fifth arrival request it at the same instant.
  const lastChair = await Promise.all([1, winner].map(async i => {
    const res = await fetch(`${base}/${roomId}/action`, { method: 'POST', headers: { Authorization: `Bearer ${tokens[i]}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ client: clients[i], action: 'seat', seat: 's5', direct: true }) });
    return res.status;
  }));
  assert.deepEqual(lastChair.sort(), [200, 409]);
  const snapshot = await request(0, '/home');
  assert.ok(!JSON.stringify(snapshot.room).includes('@example.test'));
  await request(2, `/${roomId}/action`, { action: 'remove', target: String(users[0]._id) }, 403);
  await request(0, `/${roomId}/action`, { action: 'leave' });
  const next = await request(1, '/home'); assert.equal(next.room.hostId, String(users[1]._id)); assert.equal(next.room.members.length, 4);
  await request(1, `/${roomId}/action`, { action: 'timer', sessionId: 'invalid', phase: 'studying', remainingMs: -1 }, 400);
  await request(1, `/${roomId}/action`, { action: 'remove', target: String(users[winner]._id) });
  assert.equal((await request(winner, '/home')).room, null);
  const expired = await request(1, `/${roomId}/action`, { action: 'invite', email: users[6].email });
  await StudyRoom.updateOne({ _id: roomId }, { $set: { 'invitations.$[i].expiresAt': Date.now() - 1 } }, { arrayFilters: [{ 'i.email': users[6].email }] });
  await request(6, '/accept', { token: expired.token }, 403);
  assert.equal((await request(6, '/invitations')).length, 0);
  await StudyRoom.updateOne({ _id: roomId }, { $set: { 'members.$[m].lastInvite': 0 } }, { arrayFilters: [{ 'm.id': String(users[1]._id) }] });
  const declined = await request(1, `/${roomId}/action`, { action: 'invite', email: users[6].email });
  const pending = await request(6, '/invitations');
  await request(6, '/decline', { roomId, invitationId: pending[0].id });
  await request(6, '/accept', { token: declined.token }, 403);
  await StudyRoom.updateOne({ _id: roomId }, { $set: { 'members.$[m].lastInvite': 0 } }, { arrayFilters: [{ 'm.id': String(users[1]._id) }] });
  const revoked = await request(1, `/${roomId}/action`, { action: 'invite', email: users[6].email });
  await request(1, `/${roomId}/action`, { action: 'revoke' });
  await request(6, '/accept', { token: revoked.token }, 403);
  await StudyRoom.updateOne({ _id: roomId }, { $set: { 'members.$[m].lastSeen': Date.now() - 121000 } }, { arrayFilters: [{ 'm.id': String(users[1]._id) }] });
  const recoveredHost = (await request(2, '/home')).room;
  assert.equal(recoveredHost.hostId, String(users[2]._id));
  assert.equal((await request(1, '/home')).room, null);
  console.log('PASS: five-person boundary with simultaneous final joins; competing same-seat claims; unauthorized actions; wrong-account invitation; host transfer; invalid timers; private snapshot fields.');
  console.log('PASS: final-chair race, host removal, invitation expiry/decline/revocation, and stale-host seat release/transfer.');
} finally {
  if (browser) await browser.close();
  for (const child of children) child.kill('SIGTERM');
  if (mongoose.connection.readyState === 1) {
    assert.equal(mongoose.connection.name, database);
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
}

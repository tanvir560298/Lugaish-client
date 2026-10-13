import test from 'node:test';
import assert from 'node:assert/strict';
import { createTimer, timerReducer, remainingAt, restoreTimer, formatClock, recordSession, readHistory } from './timer.js';
import { availableResources, drivePreviewUrl } from './resourcePolicy.js';
const start = (now = 1000) => timerReducer(createTimer(25, 'Read chapter one'), { type: 'START', now });

test('deadline time stays accurate when browser ticks are throttled', () => {
  const timer = start();
  assert.equal(remainingAt(timer, 301000), 20 * 60000);
  const done = timerReducer(timer, { type: 'TICK', now: 9000000 });
  assert.equal(done.phase, 'complete');
  assert.equal(done.completedAt, 1501000);
  assert.equal(done.remainingMs, 0);
});
test('pausing and resuming excludes paused time from focus time', () => {
  const paused = timerReducer(start(), { type: 'PAUSE', now: 301000 });
  assert.equal(paused.remainingMs, 20 * 60000);
  assert.equal(remainingAt(paused, 999999), 20 * 60000);
  const resumed = timerReducer(paused, { type: 'START', now: 1000000 });
  const done = timerReducer(resumed, { type: 'FINISH', now: 1060000 });
  assert.equal(done.durationMs - done.remainingMs, 6 * 60000);
});
test('refresh restores running, paused, and completed sessions safely', () => {
  assert.equal(remainingAt(restoreTimer(JSON.parse(JSON.stringify(start())), 61000), 61000), 24 * 60000);
  assert.equal(restoreTimer(start(), 9000000).phase, 'complete');
  const paused = timerReducer(start(), { type: 'PAUSE', now: 11000 });
  assert.equal(restoreTimer(paused, 9000000).remainingMs, paused.remainingMs);
});
test('malformed saved timers reset without propagating invalid values', () => {
  for (const input of [null, {}, { ...start(), durationMs: -1 }, { ...start(), remainingMs: Infinity }, { ...start(), endsAt: null }, { ...start(), startedAt: undefined }]) {
    assert.equal(restoreTimer(input).phase, 'idle');
  }
});
test('duplicate start cannot extend a running timer', () => {
  const timer = start();
  assert.equal(timerReducer(timer, { type: 'START', now: 99999 }), timer);
});
test('finishing while paused preserves studied time and never counts a break', () => {
  const paused = timerReducer(start(), { type: 'PAUSE', now: 61000 });
  const done = timerReducer(paused, { type: 'FINISH', now: 9000000 });
  const history = recordSession([], done);
  assert.equal(history[0].spentMs, 60000);
  const breakTimer = timerReducer(done, { type: 'BREAK', now: 9000000 });
  assert.equal(breakTimer.durationMs, 300000);
  assert.equal(breakTimer.kind, 'break');
  assert.equal(recordSession(history, timerReducer(breakTimer, { type: 'TICK', now: 9400000 })), history);
});
test('completion history is idempotent under refresh and strict effects', () => {
  const done = timerReducer(start(), { type: 'FINISH', now: 91000 });
  const first = recordSession([], done);
  assert.equal(recordSession(first, done), first);
  assert.equal(first[0].taskDone, false);
  assert.equal(first[0].spentMs, 90000);
  assert.equal(recordSession([], createTimer()).length, 0);
});
test('saved history rejects corrupt rows and caps retained records', () => {
  assert.deepEqual(readHistory([{}, null, { id: 'bad', goal: 'x', spentMs: -1, completedAt: 1 }]), []);
  assert.equal(readHistory(Array.from({ length: 80 }, (_, i) => ({ id: String(i), goal: 'Read', spentMs: 60000, completedAt: 1 }))).length, 50);
});
test('display rounds up seconds without ever displaying negative time', () => {
  assert.equal(formatClock(1500000), '25:00');
  assert.equal(formatClock(1001), '00:02');
  assert.equal(formatClock(-10), '00:00');
});
test('study resources obey verified course day and explicit locks', () => {
  const resources = [{ day: 1 }, { day: 3 }, { day: 5 }];
  assert.equal(availableResources(resources, {}).length, 0);
  assert.deepEqual(availableResources(resources, { courseStarted: true, courseDay: 3 }), [{ day: 1 }, { day: 3 }]);
  assert.deepEqual(availableResources(resources, { courseStarted: true, courseDay: 5, modules: [{ day: 3, premiumLocked: true }, { day: 5, published: false }] }), [{ day: 1 }]);
});
test('PDF embeds only use the exact HTTPS Google Drive host', () => {
  assert.equal(drivePreviewUrl('https://drive.google.com/file/d/abc-123/view?usp=sharing'), 'https://drive.google.com/file/d/abc-123/preview');
  for (const source of ['javascript:alert(1)', 'https://drive.google.com.evil.test/file/d/abc/view', 'http://drive.google.com/file/d/abc/view']) assert.equal(drivePreviewUrl(source), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanWorkspace, studySummary, calendarDay, youtubeId } from './workspaceState.js';
test('workspace restoration bounds tasks and rejects duplicate ids, malformed values and invented lesson progress', () => {
  const saved = cleanWorkspace({ target: 999, tasks: [{ id: 'a', text: ' Read chapter 3 ', done: true }, { id: 'a', text: 'Duplicate' }, { id: 'b', text: ' ' }, null], watched: ['01', '01', '07', '08', '<script>'] });
  assert.deepEqual(saved, { target: 60, tasks: [{ id: 'a', text: 'Read chapter 3', done: true }], watched: ['01', '07'] });
  assert.equal(cleanWorkspace(null).tasks.length, 0);
});
test('daily recap counts only real unique finished sessions and uses local calendar dates', () => {
  const now = new Date(2026, 9, 21, 14).getTime();
  const yesterday = new Date(2026, 9, 20, 23).getTime();
  const history = [{ id: 'a', spentMs: 1500000, completedAt: now - 1000 }, { id: 'a', spentMs: 1500000, completedAt: now }, { id: 'b', spentMs: 900000, completedAt: yesterday }, { id: 'zero', spentMs: 0, completedAt: now }, { id: 'future', spentMs: 1000, completedAt: now + 1000 }];
  const summary = studySummary(history, now);
  assert.equal(summary.today.spentMs, 1500000);
  assert.equal(summary.today.count, 1);
  assert.equal(summary.days[5].count, 1);
  assert.equal(summary.totalMs, 2400000);
  assert.equal(summary.days.length, 7);
  assert.equal(summary.today.key, calendarDay(now));
});
test('personal study videos accept supported YouTube links and reject deceptive or unsafe origins', () => {
  for (const link of ['https://youtu.be/YEZHgqqsocs', 'https://www.youtube.com/watch?v=YEZHgqqsocs&t=12', 'https://youtube.com/shorts/YEZHgqqsocs', 'https://www.youtube-nocookie.com/embed/YEZHgqqsocs']) assert.equal(youtubeId(link), 'YEZHgqqsocs');
  for (const link of ['javascript:alert(1)', 'https://youtube.com.evil.example/watch?v=YEZHgqqsocs', 'https://youtube.com@evil.example/watch?v=YEZHgqqsocs', 'http://youtube.com/watch?v=YEZHgqqsocs', 'https://youtube.com/watch?v=bad', 'https://youtube.com:8443/watch?v=YEZHgqqsocs', 'https://youtube.com/playlist?list=123']) assert.equal(youtubeId(link), null);
});

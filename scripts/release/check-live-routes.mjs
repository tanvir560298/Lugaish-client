// No credentials or state-changing requests: protected routes must reject
// anonymous access instead of falling through to the API 404 handler.
const base = (process.argv[2] || 'https://lugaish-server.onrender.com/api').replace(/\/$/, '');
const paths = ['auth/me', 'lessons/english/1', 'progress/english',
  'quiz/access/english/1', 'learning/english', 'analytics/english',
  'analytics/arabic', 'novyra/profile', 'novyra/plans/active', 'novyra/usage',
  'achievements/summary', 'interviews/weekly', 'email/status', 'payment/status',
  'study/events'];
let failures = 0;
for (const path of paths) {
  try {
    const response = await fetch(`${base}/${path}`, { signal: AbortSignal.timeout(20000) });
    const body = await response.json();
    const ok = response.status === 401 && body.error === 'No token provided';
    console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${path}`);
    if (!ok) failures++;
  } catch (error) {
    console.error(`FAIL ${path}: ${error.message}`);
    failures++;
  }
}
if (failures) process.exitCode = 1;

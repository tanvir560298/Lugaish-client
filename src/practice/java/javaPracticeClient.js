import { API_BASE_URL, getAuthToken } from '../../api/client.js';
import { TOPIC_1_METADATA, SOLVED_STORAGE_KEY, FALLBACK_PUBLIC_PROBLEMS } from './javaPracticeData.js';

export const JAVA_RANKING_API = API_BASE_URL || '/api';

/**
 * Returns array of solved problem IDs from local storage.
 */
export function getSolvedProblemIds() {
  try {
    const raw = localStorage.getItem(SOLVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Checks if a specific problem ID is marked as solved.
 */
export function isProblemSolved(problemId) {
  if (!problemId) return false;
  const list = getSolvedProblemIds();
  return list.includes(problemId);
}

/**
 * Records a problem ID as solved into local storage.
 */
export function markProblemSolved(problemId) {
  if (!problemId) return;
  try {
    const list = getSolvedProblemIds();
    if (!list.includes(problemId)) {
      list.push(problemId);
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.error('Failed to save solved problem status to storage:', err);
  }
}

/**
 * Helper to construct candidate API endpoints:
 * 1. Same-origin relative path (for Vercel serverless /api routes)
 * 2. Absolute API_BASE_URL (if configured)
 */
export function getCandidateEndpoints(relativePath) {
  const cleanRelative = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  const endpoints = [];

  // Same-origin endpoint (for Vercel serverless deployment)
  if (typeof window !== 'undefined') {
    endpoints.push(cleanRelative);
  }

  // Configured API_BASE_URL endpoint
  if (API_BASE_URL && API_BASE_URL !== '/api') {
    const candidate = `${API_BASE_URL}${cleanRelative.replace(/^\/api/, '')}`;
    if (!endpoints.includes(candidate)) {
      endpoints.push(candidate);
    }
  }

  if (endpoints.length === 0) {
    endpoints.push(cleanRelative);
  }

  return endpoints;
}

/**
 * Fetches practice topic and public problems list.
 */
export async function fetchTopicProblems(topicSlug = 'basic-io-variables') {
  const endpoints = getCandidateEndpoints(`/api/practice/java/topics/${topicSlug}`);

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        const serverProblems = Array.isArray(data.problems) && data.problems.length > 0
          ? data.problems
          : (FALLBACK_PUBLIC_PROBLEMS[topicSlug] || []);
        return {
          topic: data.topic || TOPIC_1_METADATA,
          problems: serverProblems
        };
      }
    } catch (err) {
      console.warn(`[PracticeClient] Could not fetch topics from ${endpoint}:`, err.message);
    }
  }

  return {
    topic: TOPIC_1_METADATA,
    problems: FALLBACK_PUBLIC_PROBLEMS[topicSlug] || []
  };
}

/**
 * Fetches a single public problem's details by topic and slug.
 */
export async function fetchProblemDetail(topicSlug = 'basic-io-variables', problemSlug) {
  const endpoints = getCandidateEndpoints(`/api/practice/java/topics/${topicSlug}/problems/${problemSlug}`);

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.problem) return data.problem;
      }
    } catch {
      // try next
    }
  }

  const fallbackList = FALLBACK_PUBLIC_PROBLEMS[topicSlug] || [];
  return fallbackList.find(p => p.slug === problemSlug || p.id === problemSlug) || null;
}

/**
 * Direct sandboxed execution via Judge0 CE (https://ce.judge0.com) with base64 encoding and polling.
 * Used as high-reliability direct fallback for running code in browser client.
 */
async function executeDirectJudge0({ sourceCode, stdin = '' }) {
  const toBase64 = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str || '')));
    } catch {
      return '';
    }
  };

  const fromBase64 = (str) => {
    if (!str || typeof str !== 'string') return '';
    try {
      const decoded = decodeURIComponent(escape(atob(str.trim())));
      return decoded;
    } catch {
      try {
        return atob(str.trim());
      } catch {
        return str;
      }
    }
  };

  const payload = {
    source_code: toBase64(sourceCode),
    language_id: 62, // OpenJDK 13/14
    stdin: stdin ? toBase64(stdin) : '',
    cpu_time_limit: 5,
    memory_limit: 128000
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  const res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal
  });

  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`Execution service responded with HTTP ${res.status}`);
  }

  let data = await res.json();

  // If in queue or processing, poll the token
  if (data?.status?.id <= 2 && data?.token) {
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const poll = await fetch(`https://ce.judge0.com/submissions/${data.token}?base64_encoded=true`);
        if (poll.ok) {
          const polled = await poll.json();
          if (polled?.status?.id > 2) {
            data = polled;
            break;
          }
        }
      } catch {
        // continue polling
      }
    }
  }

  const statusId = data?.status?.id ?? 0;
  const statusDesc = data?.status?.description ?? 'Unknown';

  let verdict = 'Accepted';
  if (statusId === 3) verdict = 'Accepted';
  else if (statusId === 4) verdict = 'Wrong Answer';
  else if (statusId === 5) verdict = 'Time Limit Exceeded';
  else if (statusId === 6) verdict = 'Compilation Error';
  else if (statusId >= 7 && statusId <= 12) verdict = 'Runtime Error';
  else if (statusId >= 13) verdict = 'Execution Service Unavailable';
  else if (statusId <= 2) verdict = 'Time Limit Exceeded';
  else verdict = statusDesc;

  return {
    success: verdict === 'Accepted',
    verdict,
    statusId,
    stdout: fromBase64(data.stdout),
    stderr: fromBase64(data.stderr),
    compileOutput: fromBase64(data.compile_output),
    message: fromBase64(data.message),
    time: parseFloat(data.time) || 0,
    memory: parseInt(data.memory, 10) || 0
  };
}

/**
 * Runs student Java code with optional custom input (no judge / no hidden tests).
 */
export async function runJavaCode({ sourceCode, stdin = '' }) {
  const endpoints = getCandidateEndpoints('/api/practice/java/run');

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCode, stdin }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data && data.verdict) {
          return data;
        }
      }
    } catch (backendErr) {
      console.warn(`[PracticeClient] Endpoint ${endpoint} failed:`, backendErr.message);
    }
  }

  // Fallback: direct isolated execution via Judge0 CE
  try {
    const directResult = await executeDirectJudge0({ sourceCode, stdin });
    return directResult;
  } catch (err) {
    console.error('[PracticeClient] Direct sandbox execution failed:', err);
    if (err.name === 'AbortError') {
      return {
        success: false,
        verdict: 'Time Limit Exceeded',
        stderr: 'Code execution timed out.',
        stdout: '',
        compileOutput: ''
      };
    }
    return {
      success: false,
      verdict: 'Execution Service Unavailable',
      stderr: 'Unable to communicate with compiler service. Please check your internet connection and try again.',
      stdout: '',
      compileOutput: ''
    };
  }
}

/**
 * Submits student Java code for official evaluation against official test cases.
 */
export async function submitJavaSolution({ topicSlug = 'basic-io-variables', problemId, sourceCode }) {
  const endpoints = getCandidateEndpoints('/api/practice/java/submit');
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ topicSlug, problemId, sourceCode }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data.verdict === 'Accepted' && data.success) {
          markProblemSolved(problemId);
        }
        return data;
      }

      if (res.status === 404) {
        lastError = 'API route not found';
        continue;
      }

      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        verdict: 'Execution Service Unavailable',
        message: errData.error || `Judge service responded with HTTP ${res.status}. Please retry shortly.`
      };
    } catch (err) {
      lastError = err.message;
    }
  }

  // Only the server judge can issue an official verdict against hidden tests.

  return {
    success: false,
    verdict: 'Execution Service Unavailable',
    message: lastError || 'Could not connect to the judge service. Please verify connectivity and retry shortly.'
  };
}

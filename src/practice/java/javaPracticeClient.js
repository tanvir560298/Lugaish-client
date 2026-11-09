import { API_BASE_URL } from '../../api/client.js';
import { TOPIC_1_METADATA, SOLVED_STORAGE_KEY, FALLBACK_PUBLIC_PROBLEMS } from './javaPracticeData.js';

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
 * Fetches practice topic and public problems list.
 */
export async function fetchTopicProblems(topicSlug = 'basic-io-variables') {
  try {
    const res = await fetch(`${API_BASE_URL}/practice/java/topics/${topicSlug}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { topic: TOPIC_1_METADATA, problems: FALLBACK_PUBLIC_PROBLEMS[topicSlug] || [] };
      }
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    const serverProblems = Array.isArray(data.problems) && data.problems.length > 0 ? data.problems : (FALLBACK_PUBLIC_PROBLEMS[topicSlug] || []);
    return {
      topic: data.topic || TOPIC_1_METADATA,
      problems: serverProblems
    };
  } catch (err) {
    console.warn('[PracticeClient] Could not fetch problems from server, falling back to local metadata:', err.message);
    return {
      topic: TOPIC_1_METADATA,
      problems: FALLBACK_PUBLIC_PROBLEMS[topicSlug] || []
    };
  }
}

/**
 * Fetches a single public problem's details by topic and slug.
 */
export async function fetchProblemDetail(topicSlug = 'basic-io-variables', problemSlug) {
  try {
    const res = await fetch(`${API_BASE_URL}/practice/java/topics/${topicSlug}/problems/${problemSlug}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.problem) return data.problem;
    }
  } catch (err) {
    console.warn('[PracticeClient] Failed to fetch problem detail from server, checking fallback:', err.message);
  }

  const fallbackList = FALLBACK_PUBLIC_PROBLEMS[topicSlug] || [];
  return fallbackList.find(p => p.slug === problemSlug || p.id === problemSlug) || null;
}

/**
 * Runs student Java code with optional custom input (no judge / no hidden tests).
 */
export async function runJavaCode({ sourceCode, stdin = '' }) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${API_BASE_URL}/practice/java/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceCode, stdin }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await res.json();
    return data;
  } catch (err) {
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
      stderr: 'Unable to communicate with compiler service. Please try again.',
      stdout: '',
      compileOutput: ''
    };
  }
}

/**
 * Submits student Java code for official evaluation against official test cases.
 */
export async function submitJavaSolution({ topicSlug = 'basic-io-variables', problemId, sourceCode }) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(`${API_BASE_URL}/practice/java/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicSlug, problemId, sourceCode }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await res.json();

    // If accepted, mark locally as solved
    if (data.verdict === 'Accepted' && data.success) {
      markProblemSolved(problemId);
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        verdict: 'Time Limit Exceeded',
        message: 'Submission evaluation timed out.'
      };
    }
    return {
      success: false,
      verdict: 'Execution Service Unavailable',
      message: 'Could not connect to the judge service. Please try again in a few moments.'
    };
  }
}


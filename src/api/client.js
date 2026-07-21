const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN_KEY = 'lugaish_auth_token';
const REQUEST_TIMEOUT_MS = Math.max(Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000, 1000);

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

const RETRY_DELAY_MIN_MS = 800;
const RETRY_DELAY_MAX_MS = 2200;
const inFlightGetRequests = new Map();

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRetryDelay() {
  return Math.round(
    RETRY_DELAY_MIN_MS + Math.random() * (RETRY_DELAY_MAX_MS - RETRY_DELAY_MIN_MS),
  );
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const { timeoutMs = REQUEST_TIMEOUT_MS, ...fetchOptions } = options;
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The server took too long to respond. Please try again.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
async function executeRequest(path, options = {}) {
  const token = getAuthToken();
  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  };
  const canRetry = !options.method || options.method === 'GET';
  let response;

  try {
    response = await fetchWithTimeout(`${API_BASE_URL}${path}`, requestOptions);
  } catch (error) {
    if (canRetry) {
      // Spread retries across clients so a waking free-tier server is not hit
      // by every browser again at exactly the same moment.
      await wait(getRetryDelay());

      try {
        response = await fetchWithTimeout(`${API_BASE_URL}${path}`, requestOptions);
      } catch (retryError) {
        throw retryError?.message?.includes('too long')
          ? retryError
          : new Error('Server is temporarily unavailable. Please try again in a moment.');
      }
    } else {
      throw error?.message?.includes('too long')
        ? error
        : new Error('Server is temporarily unavailable. Please try again in a moment.');
    }
  }

  const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error ?? 'Request failed');
    error.status = response.status;
    error.code = data.code;
    error.data = data;
    throw error;
  }

  return data;
}

function request(path, options = {}) {
  const method = options.method ?? 'GET';
  if (method !== 'GET') return executeRequest(path, options);

  // React can mount a screen twice in development. Reuse an identical active
  // GET instead of sending duplicate work to the API server.
  const requestKey = `${getAuthToken() ?? 'anonymous'}:${path}`;
  const existingRequest = inFlightGetRequests.get(requestKey);
  if (existingRequest) return existingRequest;

  const pendingRequest = executeRequest(path, options)
    .finally(() => inFlightGetRequests.delete(requestKey));

  inFlightGetRequests.set(requestKey, pendingRequest);
  return pendingRequest;
}

export const api = {
  signup(payload) {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  firebaseLogin(payload) {
    return request('/auth/firebase', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  currentUser() {
    return request('/auth/me');
  },
  enrollPathway(payload) {
    return request('/auth/enroll', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getEnrollmentStatus(language) {
    return request(`/auth/enrollment-status/${language}`);
  },
  applyForSeat(payload) {
    return request('/auth/seat-applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  listUsers() {
    return request('/auth/users');
  },
  updateUserRole(userId, payload) {
    return request(`/auth/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  removeUser(userId) {
    return request(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  },
  completeLesson(payload) {
    return request('/lessons/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getLesson(language, day) {
    return request(`/lessons/${language}/${day}`);
  },
  addLessonVideo(language, day, payload) {
    return request(`/lessons/${language}/${day}/videos`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteLessonVideo(language, day, videoId) {
    return request(`/lessons/${language}/${day}/videos/${videoId}`, {
      method: 'DELETE',
    });
  },
  getSpeakingPractice(language, day) {
    return request(`/lessons/${language}/${day}/speaking-practice`);
  },
  updateSpeakingPractice(language, day, payload) {
    return request(`/lessons/${language}/${day}/speaking-practice`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  updateProgress(payload) {
    return request('/progress/update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  submitQuiz(payload) {
    return request('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getWeeklyInterview() {
    return request('/interviews/weekly');
  },
  joinWeeklyInterview() {
    return request('/interviews/join', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
  updateInterviewStatus(entryId, payload) {
    return request(`/interviews/entries/${entryId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  getMailStatus() {
    return request('/email/status');
  },
  getMailOAuthUrl() {
    return request('/email/oauth/url');
  },
  sendTestEmail(payload) {
    return request('/email/send-test', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  sendEmailCampaign(payload) {
    return request('/email/campaigns', {
      method: 'POST',
      body: JSON.stringify(payload),
      timeoutMs: 120000,
    });
  },
  activateLatestSignupCampaign() {
    return request('/email/campaigns/latest/activate-signup', { method: 'POST' });
  },
};

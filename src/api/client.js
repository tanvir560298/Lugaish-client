const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const TOKEN_KEY = 'lugaish_auth_token';

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

const RETRY_DELAY_MS = 1200;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
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
    response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  } catch (error) {
    if (canRetry) {
      await wait(RETRY_DELAY_MS);

      try {
        response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
      } catch {
        throw new Error('Server is temporarily unavailable. Please try again in a moment.');
      }
    } else {
      throw new Error('Server is temporarily unavailable. Please try again in a moment.');
    }
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error ?? 'Request failed');
    error.status = response.status;
    error.code = data.code;
    error.data = data;
    throw error;
  }

  return data;
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
  completeLesson(payload) {
    return request('/lessons/complete', {
      method: 'POST',
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
};

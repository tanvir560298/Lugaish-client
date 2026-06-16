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

async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed');
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
  currentUser() {
    return request('/auth/me');
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
};

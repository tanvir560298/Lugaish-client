import {shouldClearSession} from '../state/identityPolicy.js';
import {reportOperationalEvent} from '../utils/operations.js';
const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')).replace(/\/$/, '');
const TOKEN_KEY = 'lugaish_auth_token';
const REQUEST_TIMEOUT_MS = Math.max(Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000, 1000);

export function getAuthToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
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

function isLearnerPreviewRequest() {
  try {
    const savedState = JSON.parse(localStorage.getItem('lugaish_state_v1') || '{}');
    return savedState.userRole === 'web_developer' && savedState.webDeveloperMode === 'tester';
  } catch {
    return false;
  }
}

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

    reportOperationalEvent('api_failure');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
async function executeRequest(path, options = {}) {
  const token = getAuthToken();
  const learnerPreview = isLearnerPreviewRequest();
  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(learnerPreview ? { 'X-Lugaish-Learner-Preview': '1' } : {}),
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

  let data = {};
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      throw new Error('The server returned an invalid response. Please retry or contact support.');
    }
  }
  if (!response.ok) {
    if(response.status>=500)reportOperationalEvent('api_failure');
    if(response.status===401)reportOperationalEvent('auth_failure');
    if (response.status === 401 && shouldClearSession(token,getAuthToken())) setAuthToken(null);
    const error = new Error(data.error ?? 'Request failed');
    error.requestId=response.headers.get('X-Request-Id');
    if(response.status>=500&&error.requestId)error.message+=` Reference: ${error.requestId}`;
    error.status = response.status;
    error.code = data.code;
    error.data = data;
    throw error;
  }

  return data;
}

export function request(path, options = {}) {
  const method = options.method ?? 'GET';
  if (method !== 'GET') return executeRequest(path, options);

  // React can mount a screen twice in development. Reuse an identical active
  // GET instead of sending duplicate work to the API server.
  const explicitLearnerPreview = options.headers?.['X-Lugaish-Learner-Preview'] === '1';
  const requestKey = `${getAuthToken() ?? 'anonymous'}:${explicitLearnerPreview || isLearnerPreviewRequest() ? 'learner-preview' : 'normal'}:${path}`;
  const existingRequest = inFlightGetRequests.get(requestKey);
  if (existingRequest) return existingRequest;

  const pendingRequest = executeRequest(path, options)
    .finally(() => inFlightGetRequests.delete(requestKey));

  inFlightGetRequests.set(requestKey, pendingRequest);
  return pendingRequest;
}

export const api = {
  getLearningAnalytics(language, {range='7',zone='UTC',page=1}={}) { return request(`/analytics/${language}?${new URLSearchParams({range,zone,page})}`); },
  getLearning(language) { return request(`/learning/${language}`); },
  retryMistake(language, payload) { return request(`/learning/${language}/retry`, {method:'POST',body:JSON.stringify(payload)}); },
  updatePublishedContent(language, day, payload) { return request(`/courses/manage/${language}/lessons/${day}/content`, {method:'PUT',body:JSON.stringify(payload)}); },
  manageCourses() { return request('/courses/manage'); },
  saveCourse(language, payload) { return request(`/courses/manage/${language}`, { method: 'PUT', body: JSON.stringify(payload) }); },
  publishLesson(language, day, status) { return request(`/courses/manage/${language}/lessons/${day}/publication`, { method: 'PUT', body: JSON.stringify({status}) }); },
  getCourses() { return request("/courses"); },
  getCourse(language) { return request(`/courses/${language}`); },
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
  updateUserPrivateBatch(userId, payload) {
    return request(`/auth/users/${userId}/private-batch`, {
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
  getQuizAccess(language, day) {
    return request(`/quiz/access/${language}/${day}`);
  },
  getQuizResult(language, day) {
    return request(`/quiz/result/${language}/${day}`);
  },
  getLesson(language, day) {
    return request(`/lessons/${language}/${day}`);
  },
  getDayModules(language, { learnerPreview = false } = {}) {
    return request(`/lessons/${language}/day-modules`, {
      headers: learnerPreview ? { 'X-Lugaish-Learner-Preview': '1' } : {},
    });
  },
  updateDayModule(language, day, payload) {
    return request(`/lessons/${language}/${day}/module`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
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
  completeLessonVideo(language, day, videoId) {
    return request(`/lessons/${language}/${day}/videos/${videoId}/complete`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
  getSpeakingPractice(language, day) {
    return request(`/lessons/${language}/${day}/speaking-practice`);
  },
  updateSpeakingPractice(language, day, payload) {
    return request(`/lessons/${language}/${day}/module`, {
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
  submitQuiz(payload, { learnerPreview = false } = {}) {
    return request('/quiz/submit', {
      method: 'POST',
      headers: learnerPreview ? { 'X-Lugaish-Learner-Preview': '1' } : {},
      body: JSON.stringify(payload),
    });
  },
  getAchievementSummary() {
    return request('/achievements/summary');
  },
  claimCertificate(language, milestone) {
    return request(`/achievements/certificates/${language}/${milestone}`, { method: 'POST' });
  },
  verifyCertificate(code) {
    return request(`/achievements/certificates/verify/${encodeURIComponent(code)}`);
  },
  getWeeklyInterview({ language, day } = {}) {
    const query = new URLSearchParams();
    if (language) query.set('language', language);
    if (day) query.set('day', String(day));
    const queryString = query.toString();
    const suffix = queryString ? `?${queryString}` : '';
    return request(`/interviews/weekly${suffix}`);
  },
  joinWeeklyInterview({ language, day } = {}) {
    return request('/interviews/join', {
      method: 'POST',
      body: JSON.stringify({ language, day }),
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
  getBankDetails() {
    return request('/payment/bank-details');
  },
  updateBankDetails(payload) {
    return request('/payment/bank-details', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getPaymentStatus() {
    return request('/payment/status');
  },
  submitPaymentTransfer(payload) {
    return request('/payment/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  listAdminPaymentRecords() {
    return request('/payment/admin/records');
  },
  confirmPayment(payload) {
    return request('/payment/admin/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  remindPayment(payload) {
    return request('/payment/admin/remind', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  dismissPaymentNotification(id) {
    return request(`/payment/notifications/${id}/dismiss`, { method: 'POST' });
  },
};

import {consumeChatStream} from './chatStream.js';
import {request,API_BASE_URL,getAuthToken} from "../api/client.js";

export const novyraClient = {
  // Student Profile & Memory
  async getProfile() {
    return request("/novyra/profile");
  },

  async updateProfile(updates) {
    return request("/novyra/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Conversational Tutor
  async sendMessage({ sessionId = "default", contextType = "general", subject = "general", message, onDelta, signal }) {
    if(onDelta){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);try{const response=await fetch(`${API_BASE_URL}/novyra/chat`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${getAuthToken()||''}`},body:JSON.stringify({sessionId,contextType,subject,message,stream:true}),signal:signal?AbortSignal.any([signal,controller.signal]):controller.signal});return await consumeChatStream(response,onDelta);}catch(error){if(signal?.aborted)throw Error('Reply stopped. You can send another question when ready.');if(error.name==='AbortError'||error.name==='TimeoutError')throw Error('Tanu took too long. Please try your question again.');throw error;}finally{clearTimeout(timer);}}

    return request("/novyra/chat", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        contextType,
        subject,
        message,
      }),
    });
  },

  async getChatHistory(sessionId = "default") {
    return request(`/novyra/chat/history?sessionId=${encodeURIComponent(sessionId)}`);
  },

  // Intelligent Study Planner
  async getActivePlan() {
    return request("/novyra/plans/active");
  },

  async getPlans() {
    return request("/novyra/plans");
  },

  async createPlan({ subject = "english", topic = "General Study", durationMinutes = 60 }) {
    return request("/novyra/plans", {
      method: "POST",
      body: JSON.stringify({
        subject,
        topic,
        durationMinutes,
      }),
    });
  },

  async updatePlan(planId, updates) {
    return request(`/novyra/plans/${encodeURIComponent(planId)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Practice Quiz Generator
  async generatePracticeQuiz({ subject = "english", topic = "Fundamentals" }) {
    return request("/novyra/practice/generate", {
      method: "POST",
      body: JSON.stringify({
        subject,
        topic,
      }),
    });
  },

  // Programming Mentor (Code Analysis)
  async analyzeCode({ language = "c", code, question }) {
    return request("/novyra/code/analyze", {
      method: "POST",
      body: JSON.stringify({
        language,
        code,
        question,
      }),
    });
  },

  // Quota & Usage
  async getUsage() {
    return request("/novyra/usage");
  },
};

import { request } from "../api/client.js";

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
  async sendMessage({ sessionId = "default", contextType = "general", subject = "general", message }) {
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

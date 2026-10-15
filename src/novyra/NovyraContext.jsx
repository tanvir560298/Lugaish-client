import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { novyraClient } from "./novyraClient.js";
import { getAuthToken } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import {parseGuidedRequest} from '../tanu/session.js';

const NovyraContext = createContext(null);

export function NovyraProvider({ children }) {
  const {state} = useAppContext();
  // Remount private context on login, logout and account changes. Late requests
  // belong to an unmounted provider and cannot expose the previous student's state.
  const identity = state.isLoggedIn ? `${state.userEmail}:${getAuthToken() || ''}` : 'anonymous';
  return <NovyraSessionProvider key={identity} authenticated={state.isLoggedIn}>{children}</NovyraSessionProvider>;
}

function NovyraSessionProvider({ children, authenticated }) {
  const [profile, setProfile] = useState(null);
  const [fullProfile, setFullProfile] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(() => `novyra-session-${Date.now()}`);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [avatarState, setAvatarState] = useState("idle");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState("english");
  const [usage, setUsage] = useState(null);
  const [activeTimer, setActiveTimer] = useState({
    blockIndex: null,
    remainingSeconds: 0,
    totalSeconds: 0,
    isRunning: false,
    blockTitle: "",
  });

  const timerRef = useRef(null);

  // Load Profile and Active Plan when authenticated
  const loadProfile = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const data = await novyraClient.getProfile();
      if (data?.profile) {
        setProfile(data.profile);
        setFullProfile(data.fullProfile);
        if (data.profile.targetSubject) {
          setActiveSubject(data.profile.targetSubject);
        }
        if (!data.profile.onboardingCompleted) {
          // Open onboarding for new students
          setIsOnboardingOpen(true);
        }
      }
    } catch (err) {
      console.warn("Could not load Tanu AI profile:", err?.message);
    }
  }, []);

  const loadActivePlan = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const plan = await novyraClient.getActivePlan();
      setActivePlan(plan);
    } catch (err) {
      console.warn("Could not load active study plan:", err?.message);
    }
  }, []);

  const loadUsage = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const u = await novyraClient.getUsage();
      setUsage(u);
    } catch (err) {
      console.warn("Could not load usage data:", err?.message);
      setUsage({engineMode:'unavailable'});
    }
  }, []);

  // Timer ticker
  useEffect(() => {
    if (activeTimer.isRunning && activeTimer.remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setActiveTimer((prev) => {
          if (prev.remainingSeconds <= 1) {
            clearInterval(timerRef.current);
            return { ...prev, remainingSeconds: 0, isRunning: false };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTimer.isRunning, activeTimer.remainingSeconds]);

  // Initial load
  useEffect(() => {
    if (!authenticated) return;
    loadProfile();
    loadActivePlan();
    loadUsage();
  }, [authenticated, loadProfile, loadActivePlan, loadUsage]);

  // Timer actions
  const startTimer = (blockIndex, durationMinutes, title = "") => {
    const totalSec = Math.max(60, durationMinutes * 60);
    setActiveTimer({
      blockIndex,
      remainingSeconds: totalSec,
      totalSeconds: totalSec,
      isRunning: true,
      blockTitle: title,
    });
  };

  const pauseTimer = () => {
    setActiveTimer((prev) => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setActiveTimer((prev) => ({ ...prev, isRunning: true }));
  };

  const resetTimer = () => {
    setActiveTimer({
      blockIndex: null,
      remainingSeconds: 0,
      totalSeconds: 0,
      isRunning: false,
      blockTitle: "",
    });
  };

  // Chat actions
  const sendMessage = async (text, options = {}) => {
    if (!text || !text.trim()) return null;
    const timeRequest = parseGuidedRequest(text,activeSubject);
    if(timeRequest) {
      const {minutes,topic}=timeRequest;
      const reply={id:crypto.randomUUID(),sender:'novyra',timestamp:new Date().toISOString(),
        content:minutes>=10&&minutes<=120?`Let's prepare a ${minutes}-minute session. Open Guided Study below, choose a real available lesson and approve the plan. No timer has started yet.`:'Choose between 10 and 120 minutes for a guided session.',
        ...(minutes>=10&&minutes<=120?{actionUrl:`/tanu?minutes=${minutes}&study=${topic==='java'?'java':'course'}&topic=${encodeURIComponent(topic)}`}:{})};
      setMessages(previous=>[...previous,{id:crypto.randomUUID(),sender:'student',content:text,timestamp:new Date().toISOString()},reply]);
      return {message:reply,provider:'guided-session-tool'};
    }
    const studentMsg = {
      id: `msg-${Date.now()}`,
      sender: "student",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setIsChatLoading(true);
    setAvatarState("thinking");

    try {
      const resp = await novyraClient.sendMessage({
        sessionId,
        contextType: options.contextType || "workspace",
        subject: options.subject || activeSubject,
        message: text.trim(),
      });

      if (resp?.message) {
        setMessages((prev) => [...prev, resp.message]);
        setAvatarState(resp.avatarState || "responding");
      }
      loadUsage();
      return resp;
    } catch (err) {
      const errMsg = {
        id: `err-${Date.now()}`,
        sender: "novyra",
        content: `I'm having trouble connecting to my learning engine: ${err.message}. Please try again in a moment.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      setAvatarState("idle");
      return null;
    } finally {
      setIsChatLoading(false);
      // Return avatar to idle after 4 seconds if responding
      setTimeout(() => {
        setAvatarState((curr) => (curr === "responding" ? "idle" : curr));
      }, 4000);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setAvatarState("idle");
  };

  // Profile actions
  const updateProfile = async (updates) => {
    const updated = await novyraClient.updateProfile(updates);
    setProfile(updated);
    if (updated?.targetSubject) setActiveSubject(updated.targetSubject);
    return updated;
  };

  const completeOnboarding = async (data) => {
    const updated = await updateProfile({
      ...data,
      onboardingCompleted: true,
    });
    setIsOnboardingOpen(false);
    return updated;
  };

  // Plan actions
  const createPlan = async ({ subject, topic, durationMinutes }) => {
    const newPlan = await novyraClient.createPlan({ subject, topic, durationMinutes });
    setActivePlan(newPlan);
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const completeBlock = async (blockIndex, studentNotes = "") => {
    if (!activePlan) return;
    const updated = await novyraClient.updatePlan(activePlan._id, {
      completedBlockIndex: blockIndex,
      studentNotes,
    });
    setActivePlan(updated);
    if (activeTimer.blockIndex === blockIndex) {
      resetTimer();
    }
    return updated;
  };

  const setPlanStatus = async (status) => {
    if (!activePlan) return;
    const updated = await novyraClient.updatePlan(activePlan._id, { status });
    setActivePlan(updated);
    return updated;
  };

  const openPanel = (options = {}) => {
    if (options.subject) setActiveSubject(options.subject);
    setIsPanelOpen(true);
  };

  const closePanel = () => setIsPanelOpen(false);
  const togglePanel = () => setIsPanelOpen((prev) => !prev);

  const value = {
    profile,
    fullProfile,
    activePlan,
    plans,
    messages,
    sessionId,
    isChatLoading,
    avatarState,
    isPanelOpen,
    isOnboardingOpen,
    activeSubject,
    usage,
    activeTimer,
    // Actions
    setAvatarState,
    setActiveSubject,
    loadProfile,
    updateProfile,
    completeOnboarding,
    sendMessage,
    clearChat,
    loadActivePlan,
    createPlan,
    completeBlock,
    setPlanStatus,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    openPanel,
    closePanel,
    togglePanel,
    openOnboarding: () => setIsOnboardingOpen(true),
    closeOnboarding: () => setIsOnboardingOpen(false),
  };

  return <NovyraContext.Provider value={value}>{children}</NovyraContext.Provider>;
}

export function useNovyra() {
  const ctx = useContext(NovyraContext);
  if (!ctx) {
    throw new Error("useNovyra must be used within a NovyraProvider");
  }
  return ctx;
}

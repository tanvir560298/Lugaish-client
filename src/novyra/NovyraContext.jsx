import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { novyraClient } from "./novyraClient.js";
import { getAuthToken } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import { useLocation } from "react-router-dom";
import {parseGuidedRequest} from '../tanu/session.js';

import { TANU_AI_AVAILABLE } from '../tanu/availability.js';

const NovyraContext = createContext(null);

export function NovyraProvider({ children }) {
  const {state} = useAppContext();
  const {pathname} = useLocation();
  const tanuRouteOpen = pathname === "/tanu" || pathname.startsWith("/tanu/") || pathname === "/novyra" || pathname.startsWith("/novyra/");
  // Remount private context on login, logout and account changes. Late requests
  // belong to an unmounted provider and cannot expose the previous student's state.
  const identity = state.isLoggedIn ? `${state.userEmail}:${getAuthToken() || ''}` : 'anonymous';
  return <NovyraSessionProvider key={identity} authenticated={state.isLoggedIn && TANU_AI_AVAILABLE && tanuRouteOpen}>{children}</NovyraSessionProvider>;
}

function NovyraSessionProvider({ children, authenticated }) {
  const [profile, setProfile] = useState(null);
  const [fullProfile, setFullProfile] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sessionId,setSessionId] = useState(() => `novyra-${crypto.randomUUID()}`);
  const requestRef=useRef(0),sendingRef=useRef(false),abortRef=useRef(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [avatarState, setAvatarState] = useState("idle");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState("web_dev");
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

  useEffect(()=>()=>{requestRef.current++;abortRef.current?.abort();},[]);

  // Chat actions
  const sendMessage = async (text, options = {}) => {
    if (!text || !text.trim() || sendingRef.current) return null;
    const isRoutineRequest = /\b(study routine|study plan|study schedule|daily routine|routine)\b|পড়ার রুটিন|পড়ার পরিকল্পনা|স্টাডি রুটিন/i.test(text);
    const timeRequest = isRoutineRequest ? null : parseGuidedRequest(text,activeSubject);
    if(timeRequest) {
      const {minutes,topic}=timeRequest;
      const reply={id:crypto.randomUUID(),sender:'novyra',timestamp:new Date().toISOString(),
        content:minutes>=10&&minutes<=120?`Let's prepare a ${minutes}-minute session. Open Guided Study below, choose a real available lesson and approve the plan. No timer has started yet.`:'Choose between 10 and 120 minutes for a guided session.',
        ...(minutes>=10&&minutes<=120?{actionUrl:`/tanu?minutes=${minutes}&study=${topic==='java'?'java':'course'}&topic=${encodeURIComponent(topic)}`}:{})};
      setMessages(previous=>[...previous,{id:crypto.randomUUID(),sender:'student',content:text,timestamp:new Date().toISOString()},reply]);
      return {message:reply,provider:'guided-session-tool'};
    }
    const request=++requestRef.current;
    sendingRef.current=true;
    const controller=new AbortController();abortRef.current=controller;
    const streamingId=crypto.randomUUID();let streamed='';let frame;
    const flush=()=>{frame=null;if(request!==requestRef.current)return;setMessages(previous=>previous.some(m=>m.id===streamingId)?previous.map(m=>m.id===streamingId?{...m,content:streamed}:m):[...previous,{id:streamingId,sender:'novyra',content:streamed,isStreaming:true}]);};
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
        signal:controller.signal,
        onDelta:delta=>{streamed+=delta;if(!frame)frame=requestAnimationFrame(flush);},
      });

      if(request!==requestRef.current)return null;
      if (resp?.message) {
        if(frame)cancelAnimationFrame(frame);
        setMessages((prev) => [...prev.filter(m=>m.id!==streamingId), resp.message]);
        setAvatarState(resp.avatarState || "responding");
      }
      loadUsage();
      return resp;
    } catch (err) {
      if(request!==requestRef.current)return null;
      const errMsg = {
        id: `err-${Date.now()}`,
        sender: "novyra",
        content: `I'm having trouble connecting to my learning engine: ${err.message}. Please try again in a moment.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      if(frame)cancelAnimationFrame(frame);
      setMessages((prev) => [...prev.filter(m=>m.id!==streamingId), errMsg]);
      setAvatarState("idle");
      return null;
    } finally {
      if(frame)cancelAnimationFrame(frame);
      if(request===requestRef.current){
      abortRef.current=null;
      sendingRef.current=false;
      setIsChatLoading(false);
      // Return avatar to idle after 4 seconds if responding
      setTimeout(() => {
        setAvatarState((curr) => (curr === "responding" ? "idle" : curr));
      }, 4000);
      }
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    requestRef.current++;
    sendingRef.current=false;
    setIsChatLoading(false);
    setSessionId(`novyra-${crypto.randomUUID()}`);
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
    stopReply:()=>abortRef.current?.abort(),
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

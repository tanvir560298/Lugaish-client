import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Award,
  Zap,
  Globe2,
  Briefcase
} from 'lucide-react';

const CHALLENGES = {
  english: {
    id: 'english',
    badge: 'Interview Readiness',
    icon: <Briefcase size={16} className="text-blue-400" />,
    scenario: 'Job Interview Simulation',
    promptText: 'Could you tell me how you handle tight project deadlines under pressure?',
    promptAudioText: 'Could you tell me how you handle tight project deadlines under pressure?',
    lang: 'en-US',
    options: [
      {
        id: 'opt1',
        text: 'I prioritize critical path deliverables, communicate transparently with stakeholders, and adapt sprints proactively.',
        isCorrect: true,
        score: '98%',
        feedback: 'Superb! Structured, confident, and professional vocabulary that interviewers look for.',
      },
      {
        id: 'opt2',
        text: 'I just work 16 hours straight without telling the team until the last minute.',
        isCorrect: false,
        score: '45%',
        feedback: 'Shows hard work, but interviewers prefer team communication and structured prioritization.',
      },
      {
        id: 'opt3',
        text: 'Deadlines are usually unrealistic, so I just do whatever part is easiest first.',
        isCorrect: false,
        score: '30%',
        feedback: 'Avoid defensive language. Focus on proactive problem-solving and collaboration.',
      },
    ],
  },
  arabic: {
    id: 'arabic',
    badge: 'Everyday Fluency',
    icon: <Globe2 size={16} className="text-emerald-400" />,
    scenario: 'Authentic Greeting & Warmth',
    promptText: 'أَهْلاً وَسَهْلاً! كَيْفَ حَالُكَ اليَوْم؟ (Ahlan wa Sahlan! How are you today?)',
    promptAudioText: 'أهلاً وسهلاً، كيف حالك اليوم؟',
    lang: 'ar-SA',
    options: [
      {
        id: 'opt1',
        text: 'أَهْلاً بِكَ! أَنَا بِخَيْرٍ وَالحَمْدُ لِلَّه، شُكْرًا لَك! (Ahlan bik! I am well, praise be to God, thank you!)',
        isCorrect: true,
        score: '99%',
        feedback: 'ممتاز! A culturally authentic, warm, and natural response for native Arabic speakers.',
      },
      {
        id: 'opt2',
        text: 'إِلَى اللِّقَاء، أَنَا لَا أَعْرِفُك (Ila al-liqa\', I do not know you)',
        isCorrect: false,
        score: '35%',
        feedback: 'This translates to an abrupt goodbye. Use a welcoming reply when greeted.',
      },
      {
        id: 'opt3',
        text: 'أَنَا لَا أُرِيدُ التَّحَدُّث (Ana la ureed al-tahadduth - I don\'t want to speak)',
        isCorrect: false,
        score: '20%',
        feedback: 'Too blunt. In Arabic culture, reciprocating warmth is key to building connection.',
      },
    ],
  },
};

export function InteractiveTrialWidget({ onStartPathway }) {
  const [activeTab, setActiveTab] = useState('english');
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const utteranceRef = useRef(null);

  const currentChallenge = CHALLENGES[activeTab];
  const selectedOption = currentChallenge.options.find(opt => opt.id === selectedOptionId);

  // Stop any active audio on tab switch or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTabChange = (tabKey) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSelectedOptionId(null);
    setActiveTab(tabKey);
  };

  const playPromptAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentChallenge.promptAudioText);
    utterance.lang = currentChallenge.lang;
    utterance.rate = 0.92; // slightly slower for instructional clarity
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().startsWith(currentChallenge.lang.toLowerCase().slice(0, 2)));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectOption = (option) => {
    setSelectedOptionId(option.id);
    if (option.isCorrect) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ffffff'],
        });
      } catch {
        // Fallback gracefully if confetti fails
      }
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
  };

  return (
    <div className="interactive-trial-widget relative overflow-hidden rounded-[2.5rem] border border-blue-500/25 bg-slate-950/80 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl sm:rounded-[3rem] sm:p-10 lg:p-12">
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-[90px]" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-blue-300">
              <Sparkles size={14} />
              <span>Zero-Login Playground</span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Experience the 10-Minute Ascent
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Test your conversational reflexes in 10 seconds and feel the instant AI feedback loop.
            </p>
          </div>

          {/* Language Switcher Tabs */}
          <div className="inline-flex rounded-2xl border border-white/10 bg-slate-900/90 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('english')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
                activeTab === 'english'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase size={14} />
              <span>English Prep</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('arabic')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
                activeTab === 'arabic'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 size={14} />
              <span>Arabic Fluency</span>
            </button>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentChallenge.icon}
              <span>{currentChallenge.scenario}</span>
            </div>
            
            <button
              type="button"
              onClick={playPromptAudio}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-black transition-all ${
                isPlayingAudio
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 animate-pulse'
                  : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
              title="Listen to native audio prompt"
            >
              <Volume2 size={15} />
              <span>{isPlayingAudio ? 'Listening...' : 'Play Prompt Audio'}</span>
              {isPlayingAudio && (
                <span className="flex items-center gap-0.5">
                  <span className="h-2 w-0.5 animate-bounce bg-emerald-400" />
                  <span className="h-3 w-0.5 animate-bounce bg-emerald-400 delay-100" />
                  <span className="h-2 w-0.5 animate-bounce bg-emerald-400 delay-200" />
                </span>
              )}
            </button>
          </div>

          <p className="text-base font-bold text-white sm:text-xl leading-relaxed">
            "{currentChallenge.promptText}"
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            How would you respond in this scenario? Pick the most natural answer below:
          </p>
        </div>

        {/* Interactive Options */}
        <div className="space-y-3 sm:space-y-4">
          {currentChallenge.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let cardStyle = 'border-white/10 bg-slate-900/50 hover:border-blue-500/40 hover:bg-slate-900/80 text-slate-200';

            if (selectedOptionId) {
              if (option.isCorrect) {
                cardStyle = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-100 shadow-lg shadow-emerald-500/10';
              } else if (isSelected) {
                cardStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-200';
              } else {
                cardStyle = 'border-white/5 bg-slate-900/30 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5 ${cardStyle}`}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-transform group-hover:scale-105 ${
                  isSelected && option.isCorrect
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : isSelected && !option.isCorrect
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {isSelected && option.isCorrect ? <CheckCircle2 size={16} /> : String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold leading-relaxed sm:text-base">
                    {option.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Drawer */}
        <AnimatePresence>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-6 overflow-hidden"
            >
              <div className={`rounded-2xl border p-5 sm:p-6 ${
                selectedOption.isCorrect 
                  ? 'border-emerald-400/40 bg-emerald-500/10' 
                  : 'border-amber-400/30 bg-amber-500/10'
              }`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black ${
                        selectedOption.isCorrect ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
                      }`}>
                        <Sparkles size={12} />
                        AI Evaluation: {selectedOption.score} Match
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-200 leading-relaxed">
                      {selectedOption.feedback}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                    >
                      <RotateCcw size={14} />
                      <span>Retry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartPathway(activeTab)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Claim Free Founding Streak</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

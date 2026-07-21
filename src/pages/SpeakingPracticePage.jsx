import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CircleStop,
  Headphones,
  LoaderCircle,
  Mic,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAppContext } from '../state/AppContext.jsx';
import { ROLES } from '../utils/roles.js';
import { scoreSpeakingTranscript } from '../utils/speakingScoring.js';

const RESULT_STORAGE_KEY = 'lugaish_latest_speaking_result_v1';
const LOCAL_SET_PREFIX = 'lugaish_speaking_questions_v1';
const MAX_QUESTIONS = 30;
const NATURAL_VOICE_HINTS = ['natural', 'enhanced', 'premium', 'neural', 'google', 'microsoft', 'samantha', 'majed', 'maged', 'tarik'];

function createQuestion(language) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `question-${Date.now()}`,
    question: '',
    language,
    expectedKeywords: [],
    sampleAnswer: '',
    maxMarks: 10,
    audioUrl: '',
  };
}

function getLocalSetKey(language, day) {
  return `${LOCAL_SET_PREFIX}:${language}:${day}`;
}

function readLocalSet(language, day) {
  try {
    const raw = localStorage.getItem(getLocalSetKey(language, day));
    if (raw === null) return null;
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

function saveLocally(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function validateQuestionSet(questions) {
  if (questions.length > MAX_QUESTIONS) return `A lesson can have at most ${MAX_QUESTIONS} questions.`;
  const ids = new Set();

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const label = `Question ${index + 1}`;
    if (!question.id || !/^[A-Za-z0-9_-]+$/.test(question.id) || question.id.length > 80) return `${label} has an invalid ID.`;
    if (ids.has(question.id.toLowerCase())) return `${label} has a duplicate ID.`;
    ids.add(question.id.toLowerCase());
    if (!question.question.trim()) return `${label} needs question text.`;
    if (question.question.length > 500) return `${label} must be 500 characters or fewer.`;
    if (!question.expectedKeywords.length) return `${label} needs at least one expected keyword.`;
    if (question.expectedKeywords.length > 30) return `${label} can have at most 30 keywords.`;
    if (question.expectedKeywords.some(keyword => keyword.length > 100)) return `${label} has a keyword longer than 100 characters.`;
    if (!question.sampleAnswer.trim()) return `${label} needs a sample answer.`;
    if (question.sampleAnswer.length > 2000) return `${label}'s sample answer must be 2,000 characters or fewer.`;
    if (!(Number(question.maxMarks) > 0 && Number(question.maxMarks) <= 100)) return `${label}'s marks must be between 1 and 100.`;
    if (question.audioUrl) {
      try {
        const url = new URL(question.audioUrl);
        if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
          return `${label}'s audio URL must use HTTPS.`;
        }
      } catch {
        return `${label} has an invalid audio URL.`;
      }
    }
  }

  return '';
}

function pickPreferredVoice(voices, locale) {
  const languageVoices = voices.filter(voice => voice.lang?.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));
  return languageVoices.find(voice => NATURAL_VOICE_HINTS.some(hint => voice.name.toLowerCase().includes(hint)))
    ?? languageVoices.find(voice => voice.default)
    ?? languageVoices[0]
    ?? voices[0];
}

export function SpeakingPracticePage() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = searchParams.get('language') === 'arabic' ? 'arabic' : 'english';
  const locale = language === 'arabic' ? 'ar-SA' : 'en-US';
  const day = Math.max(Number.parseInt(searchParams.get('day') ?? '1', 10) || 1, 1);
  const shouldOpenManager = searchParams.get('manage') === '1';
  const isWebDeveloper = state.userRole === ROLES.webDeveloper;
  const [questions, setQuestions] = useState([]);
  const [draftQuestions, setDraftQuestions] = useState([]);
  const [practiceEnabled, setPracticeEnabled] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(true);
  const [loadNotice, setLoadNotice] = useState('');
  const [managerOpen, setManagerOpen] = useState(shouldOpenManager);
  const [managerMessage, setManagerMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [results, setResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [speechRate, setSpeechRate] = useState(0.92);
  const recognitionRef = useRef(null);
  const interimTranscriptRef = useRef('');
  const audioRef = useRef(null);
  const sessionStartedRef = useRef(false);

  const RecognitionConstructor = typeof window === 'undefined'
    ? null
    : window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const recognitionSupported = Boolean(RecognitionConstructor);
  const currentQuestion = questions[questionIndex];
  const currentResult = results.find(result => result.questionId === currentQuestion?.id);
  const isRtl = language === 'arabic';

  useEffect(() => {
    if (!shouldOpenManager || !isWebDeveloper) return;
    setManagerOpen(true);
  }, [isWebDeveloper, shouldOpenManager]);

  useEffect(() => {
    let ignore = false;
    const localSet = isWebDeveloper ? readLocalSet(language, day) : null;
    const localQuestions = localSet ?? [];
    setQuestions(isWebDeveloper ? localQuestions : []);
    setDraftQuestions(isWebDeveloper ? localQuestions : []);
    setPracticeEnabled(false);
    setQuestionIndex(0);
    setTranscript('');
    setResults([]);
    setIsFinished(false);
    sessionStartedRef.current = false;
    setLoadNotice(localSet ? 'Using the private draft saved in this browser.' : '');
    setIsRemoteLoading(true);

    api.getSpeakingPractice(language, day)
      .then(response => {
        if (ignore) return;
        const remoteQuestions = Array.isArray(response.questions) ? response.questions : [];
        const enabled = Boolean(response.enabled);
        if (sessionStartedRef.current) {
          setPracticeEnabled(enabled);
          setLoadNotice('The saved lesson settings loaded. Your current edits were kept.');
          return;
        }
        setPracticeEnabled(enabled);
        setQuestions(remoteQuestions);
        setDraftQuestions(isWebDeveloper ? remoteQuestions : []);
        setLoadNotice(isWebDeveloper
          ? enabled
            ? 'AI practice is live for learners.'
            : 'This question set is private. Enable it when learners should see the test.'
          : enabled
            ? 'AI practice is ready for this lesson.'
            : 'AI practice is not available for this lesson yet.');
      })
      .catch(() => {
        if (ignore) return;
        setPracticeEnabled(false);
        if (isWebDeveloper && localSet) {
          setQuestions(localQuestions);
          setDraftQuestions(localQuestions);
          setLoadNotice('The server draft could not be loaded. This browser-only draft is not visible to learners.');
          return;
        }
        setQuestions([]);
        setDraftQuestions([]);
        setLoadNotice(isWebDeveloper
          ? 'The lesson question set could not be loaded. Try again before publishing.'
          : 'AI practice is not available for this lesson yet.');
      })
      .finally(() => {
        if (!ignore) {
          setIsRemoteLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [day, isWebDeveloper, language]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const preferred = pickPreferredVoice(availableVoices, locale);
      setSelectedVoiceName(current => (
        availableVoices.some(voice => voice.name === current && voice.lang?.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()))
          ? current
          : preferred?.name || ''
      ));
    };

    updateVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', updateVoices);
  }, [locale]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort?.();
    }
    window.speechSynthesis?.cancel();
    audioRef.current?.pause?.();
  }, []);

  const abortRecognition = () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort?.();
    }
    interimTranscriptRef.current = '';
    setInterimTranscript('');
    setIsListening(false);
    setIsStopping(false);
  };

  const stopQuestionAudio = () => {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause?.();
    audioRef.current = null;
  };

  const speakQuestion = () => {
    setSpeechError('');
    if (!currentQuestion) return;
    sessionStartedRef.current = true;
    abortRecognition();
    stopQuestionAudio();

    if (!('speechSynthesis' in window)) {
      setSpeechError('Text-to-speech is not available in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.lang = locale;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.voice = voices.find(voice => voice.name === selectedVoiceName) ?? pickPreferredVoice(voices, locale) ?? null;
    utterance.onerror = event => {
      if (!['canceled', 'interrupted'].includes(event.error)) {
        setSpeechError('The browser could not read this question.');
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  const playRecordedQuestion = () => {
    if (!currentQuestion?.audioUrl) return;
    sessionStartedRef.current = true;
    setSpeechError('');
    abortRecognition();
    stopQuestionAudio();
    const audio = new Audio(currentQuestion.audioUrl);
    audioRef.current = audio;
    audio.onerror = () => setSpeechError('The recorded question audio could not play. Use the browser voice instead.');
    audio.play().catch(() => setSpeechError('The recorded question audio could not play. Use the browser voice instead.'));
  };

  const stopListening = () => {
    if (!recognitionRef.current || isStopping) return;
    setIsStopping(true);
    try {
      recognitionRef.current.stop?.();
    } catch {
      abortRecognition();
      setSpeechError('The microphone could not stop cleanly. Your finalized transcript is still available.');
    }
  };

  const startListening = () => {
    if (!RecognitionConstructor || !currentQuestion) return;
    sessionStartedRef.current = true;
    abortRecognition();
    stopQuestionAudio();
    setSpeechError('');
    setInterimTranscript('');

    const recognition = new RecognitionConstructor();
    recognition.lang = locale;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = event => {
      let finalText = '';
      let interimText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0]?.transcript ?? '';
        if (event.results[index].isFinal) finalText += `${text} `;
        else interimText += text;
      }
      if (finalText) setTranscript(current => `${current} ${finalText}`.replace(/\s+/g, ' ').trim());
      interimTranscriptRef.current = interimText;
      setInterimTranscript(interimText);
    };
    recognition.onerror = event => {
      const messages = {
        'not-allowed': 'Microphone permission was denied. Allow microphone access and try again.',
        'service-not-allowed': 'This browser has blocked its speech recognition service.',
        'audio-capture': 'No working microphone was found.',
        'no-speech': 'No speech was detected. Please try again.',
        'language-not-supported': `Speech recognition does not support ${locale} on this device.`,
        network: 'The browser speech service is unavailable. Check your connection and retry.',
        aborted: '',
      };
      setSpeechError(messages[event.error] ?? 'Speech recognition stopped unexpectedly. Please retry.');
      recognitionRef.current = null;
      interimTranscriptRef.current = '';
      setInterimTranscript('');
      setIsListening(false);
      setIsStopping(false);
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        const remainingInterim = interimTranscriptRef.current;
        if (remainingInterim) {
          setTranscript(current => `${current} ${remainingInterim}`.replace(/\s+/g, ' ').trim());
        }
        recognitionRef.current = null;
        interimTranscriptRef.current = '';
        setInterimTranscript('');
        setIsListening(false);
        setIsStopping(false);
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      abortRecognition();
      setSpeechError('The microphone could not start. Stop any other recording and try again.');
    }
  };

  const submitAnswer = () => {
    if (isListening || isStopping) {
      setSpeechError('Stop listening and wait for the final transcript before submitting.');
      return;
    }
    if (!currentQuestion || !transcript.trim()) {
      setSpeechError('Record or type an answer before submitting.');
      return;
    }
    stopListening();
    const result = scoreSpeakingTranscript(currentQuestion, transcript);
    setResults(current => [...current.filter(item => item.questionId !== currentQuestion.id), result]);
    setSpeechError('');
  };

  const retryQuestion = () => {
    abortRecognition();
    stopQuestionAudio();
    setTranscript('');
    setInterimTranscript('');
    setSpeechError('');
    setResults(current => current.filter(item => item.questionId !== currentQuestion?.id));
  };

  const finishTest = () => {
    abortRecognition();
    stopQuestionAudio();
    const earnedMarks = results.reduce((total, result) => total + result.marks, 0);
    const availableMarks = questions.reduce((total, question) => total + Number(question.maxMarks || 0), 0);
    const totalOutOf100 = availableMarks ? Math.round((earnedMarks / availableMarks) * 100) : 0;
    const savedResult = {
      language,
      day,
      completedAt: new Date().toISOString(),
      totalMarks: totalOutOf100,
      answeredQuestions: results.length,
      totalQuestions: questions.length,
      results: results.map(({ transcript: _transcript, ...result }) => result),
    };
    const learnerKey = String(state.userEmail || 'learner').trim().toLowerCase();
    saveLocally(`${RESULT_STORAGE_KEY}:${learnerKey}:${language}:${day}`, savedResult);
    setIsFinished(true);
  };

  const nextQuestion = () => {
    if (questionIndex >= questions.length - 1) {
      finishTest();
      return;
    }
    abortRecognition();
    stopQuestionAudio();
    setQuestionIndex(index => index + 1);
    setTranscript('');
    setInterimTranscript('');
    setSpeechError('');
  };

  const updateDraft = (index, field, value) => {
    sessionStartedRef.current = true;
    setDraftQuestions(current => current.map((question, questionIndexValue) => (
      questionIndexValue === index
        ? {
            ...question,
            [field]: field === 'expectedKeywords'
              ? value.split(',').map(keyword => keyword.trim()).filter(Boolean)
              : field === 'maxMarks'
                ? Math.max(Number(value) || 0, 0)
                : value,
          }
        : question
    )));
  };

  const saveQuestionSet = async () => {
    if (isRemoteLoading) {
      setManagerMessage('Wait for the published lesson set to finish loading before saving.');
      return;
    }
    sessionStartedRef.current = true;
    const validationMessage = validateQuestionSet(draftQuestions);
    if (validationMessage) {
      setManagerMessage(validationMessage);
      return;
    }
    if (practiceEnabled && draftQuestions.length === 0) {
      setManagerMessage('Add at least one question before enabling AI practice for learners.');
      return;
    }
    const validQuestions = draftQuestions.map(question => ({
      ...question,
      question: question.question.trim(),
      expectedKeywords: question.expectedKeywords.map(keyword => keyword.trim()).filter(Boolean),
      sampleAnswer: question.sampleAnswer.trim(),
      audioUrl: question.audioUrl?.trim() || undefined,
      maxMarks: Number(question.maxMarks),
    }));
    setIsSaving(true);
    setManagerMessage('');
    const savedLocalCopy = saveLocally(getLocalSetKey(language, day), validQuestions);

    try {
      const response = await api.updateSpeakingPractice(language, day, {
        enabled: practiceEnabled,
        questions: validQuestions,
      });
      const savedQuestions = response.questions ?? validQuestions;
      setQuestions(savedQuestions);
      setDraftQuestions(savedQuestions);
      setPracticeEnabled(Boolean(response.enabled));
      setManagerMessage(response.enabled
        ? 'AI practice is live for learners on this day.'
        : 'Private draft saved. Learners cannot see this AI practice yet.');
    } catch (error) {
      setQuestions(validQuestions);
      setDraftQuestions(validQuestions);
      setManagerMessage(savedLocalCopy
        ? `${error.message || 'Server save is unavailable.'} This browser-only draft is not visible to learners.`
        : `${error.message || 'Server save is unavailable.'} Browser storage was also unavailable, so this draft lasts only until the page reloads.`);
    } finally {
      abortRecognition();
      stopQuestionAudio();
      setQuestionIndex(0);
      setResults([]);
      setTranscript('');
      setIsFinished(false);
      setIsSaving(false);
    }
  };

  const earnedMarks = results.reduce((total, result) => total + result.marks, 0);
  const availableMarks = questions.reduce((total, question) => total + Number(question.maxMarks || 0), 0);
  const totalOutOf100 = availableMarks ? Math.round((earnedMarks / availableMarks) * 100) : 0;
  const languageVoices = voices.filter(voice => voice.lang?.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));

  if (isFinished) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 pb-20">
        <div className="section-card overflow-hidden p-8 text-center sm:p-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Sparkles size={36} />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.26em] text-emerald-400">Speaking test complete</p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-7xl">{totalOutOf100}/100</h1>
          <p className="mt-3 text-slate-400">You answered {results.length} of {questions.length} questions. Your latest result is saved on this device.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-muted py-4">
              <ArrowLeft size={18} /> Daily lessons
            </button>
            <button type="button" onClick={() => { setQuestionIndex(0); setResults([]); setTranscript(''); setIsFinished(false); }} className="glow-button glow-button-blue py-4">
              <RefreshCw size={18} /> Try the test again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!isWebDeveloper && !isRemoteLoading && !practiceEnabled) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 pb-20">
        <div className="section-card p-8 text-center sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
            <Mic size={28} />
          </div>
          <h1 className="mt-6 text-3xl font-black text-white">AI practice is not available yet</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-400">Your learning team has not enabled the AI speaking test for Day {day} yet. It will appear here as soon as it is published.</p>
          <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-muted mt-8 py-4">
            <ArrowLeft size={18} /> Back to lessons
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="speaking-practice-page space-y-6 pb-20">
      <div className="section-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">AI Speaking Practice · Prototype</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">{language === 'arabic' ? 'Arabic' : 'English'} · Day {day}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-400">Listen, answer naturally, review your transcript, and receive lightweight keyword-based feedback.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isWebDeveloper && (
              <button type="button" disabled={isRemoteLoading} onClick={() => { sessionStartedRef.current = true; setManagerOpen(open => !open); }} className="glow-button glow-button-muted disabled:cursor-wait disabled:opacity-50">
                {isRemoteLoading ? <LoaderCircle size={17} className="animate-spin" /> : <Plus size={17} />} {isRemoteLoading ? 'Loading question manager' : 'Manage questions'}
              </button>
            )}
            <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-muted">
              <ArrowLeft size={17} /> Lessons
            </button>
          </div>
        </div>
      </div>

      {isWebDeveloper && managerOpen && (
        <div className="section-card p-5 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">Web Developer tools</p>
              <h2 className="mt-2 text-2xl font-black text-white">Day {day} question set</h2>
              <p className="mt-2 text-sm text-slate-400">Only you can edit this set. Separate keywords with commas; an optional audio URL adds a recorded alternative to browser text-to-speech.</p>
            </div>
            <button type="button" disabled={isRemoteLoading || draftQuestions.length >= MAX_QUESTIONS} onClick={() => { sessionStartedRef.current = true; setDraftQuestions(current => [...current, createQuestion(language)]); }} className="glow-button glow-button-muted disabled:cursor-not-allowed disabled:opacity-40">
              <Plus size={17} /> Add question
            </button>
          </div>
          <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-4">
            <input
              type="checkbox"
              checked={practiceEnabled}
              disabled={isRemoteLoading}
              onChange={event => {
                sessionStartedRef.current = true;
                setPracticeEnabled(event.target.checked);
              }}
              className="mt-1 h-5 w-5 accent-emerald-400 disabled:cursor-wait"
            />
            <span>
              <span className="block font-black text-white">Enable AI practice for learners</span>
              <span className="mt-1 block text-sm leading-6 text-slate-400">
                {practiceEnabled
                  ? 'This day is live: enrolled learners can open and complete the AI speaking test.'
                  : 'This is a private draft: learners cannot see the AI speaking test for this day.'}
              </span>
            </span>
          </label>
          <div className="mt-6 space-y-4">
            {draftQuestions.map((question, index) => (
              <div key={question.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-black text-white">Question {index + 1}</p>
                  <button type="button" disabled={isRemoteLoading} onClick={() => { sessionStartedRef.current = true; setDraftQuestions(current => current.filter((_, itemIndex) => itemIndex !== index)); }} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-wait disabled:opacity-40" aria-label={`Remove question ${index + 1}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <textarea disabled={isRemoteLoading} aria-label={`Question ${index + 1} text`} maxLength={500} value={question.question} onChange={event => updateDraft(index, 'question', event.target.value)} placeholder="Question text" rows={3} dir={isRtl ? 'rtl' : 'ltr'} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 disabled:cursor-wait disabled:opacity-50" />
                  <textarea disabled={isRemoteLoading} aria-label={`Question ${index + 1} sample answer`} maxLength={2000} value={question.sampleAnswer} onChange={event => updateDraft(index, 'sampleAnswer', event.target.value)} placeholder="Sample answer" rows={3} dir={isRtl ? 'rtl' : 'ltr'} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 disabled:cursor-wait disabled:opacity-50" />
                  <input disabled={isRemoteLoading} aria-label={`Question ${index + 1} expected keywords`} value={question.expectedKeywords.join(', ')} onChange={event => updateDraft(index, 'expectedKeywords', event.target.value)} placeholder="Expected keywords, separated by commas" dir={isRtl ? 'rtl' : 'ltr'} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 disabled:cursor-wait disabled:opacity-50" />
                  <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                    <input disabled={isRemoteLoading} type="number" min="1" max="100" value={question.maxMarks} onChange={event => updateDraft(index, 'maxMarks', event.target.value)} aria-label={`Question ${index + 1} maximum marks`} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 disabled:cursor-wait disabled:opacity-50" />
                    <input disabled={isRemoteLoading} type="url" maxLength={2048} aria-label={`Question ${index + 1} optional recorded audio URL`} value={question.audioUrl ?? ''} onChange={event => updateDraft(index, 'audioUrl', event.target.value)} placeholder="Optional recorded audio URL" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 disabled:cursor-wait disabled:opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {managerMessage && <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{managerMessage}</p>}
          <button type="button" onClick={saveQuestionSet} disabled={isSaving || isRemoteLoading} className="glow-button glow-button-blue mt-5 w-full py-4 disabled:opacity-50">
            {isSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : practiceEnabled ? 'Save and publish AI practice' : 'Save private question draft'}
          </button>
        </div>
      )}

      {isRemoteLoading ? (
        <div className="section-card flex items-center justify-center gap-3 p-10 text-center text-slate-300">
          <LoaderCircle size={22} className="animate-spin text-blue-300" /> Checking this lesson&apos;s AI practice availability…
        </div>
      ) : !currentQuestion ? (
        <div className="section-card p-10 text-center">
          <h2 className="text-2xl font-black text-white">No practice questions yet</h2>
          <p className="mt-2 text-slate-400">The Web Developer can add this lesson&apos;s first private question set here.</p>
        </div>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="section-card p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">Question {questionIndex + 1} of {questions.length}</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">{currentQuestion.maxMarks} marks</span>
            </div>
            <div className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5 sm:p-7" dir={isRtl ? 'rtl' : 'ltr'}>
              <p className="text-xl font-black leading-9 text-white sm:text-2xl">{currentQuestion.question}</p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_auto]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Browser voice
                <select value={selectedVoiceName} onChange={event => setSelectedVoiceName(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm normal-case tracking-normal text-white">
                  {(languageVoices.length ? languageVoices : voices).map(voice => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} · {voice.lang}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Speed
                <select value={speechRate} onChange={event => setSpeechRate(Number(event.target.value))} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm normal-case tracking-normal text-white">
                  <option value="0.8">Slow</option>
                  <option value="0.92">Natural</option>
                  <option value="1">Normal</option>
                </select>
              </label>
              <div className="grid gap-2 self-end">
                <button type="button" onClick={speakQuestion} className="glow-button glow-button-muted py-3.5"><Volume2 size={18} /> Browser voice</button>
                {currentQuestion.audioUrl && <button type="button" onClick={playRecordedQuestion} className="glow-button glow-button-muted py-3"><Headphones size={17} /> Recorded audio</button>}
              </div>
            </div>

            {!recognitionSupported && (
              <div role="status" className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                Speech recognition is unavailable in this browser. Use a recent Chrome or Edge browser, or type your answer below for prototype testing.
              </div>
            )}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="speaking-transcript" className="text-sm font-black text-white">Your transcript</label>
                {isListening && <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" /> Listening</span>}
              </div>
              <textarea id="speaking-transcript" value={`${transcript}${interimTranscript ? ` ${interimTranscript}` : ''}`} onChange={event => { sessionStartedRef.current = true; setTranscript(event.target.value); interimTranscriptRef.current = ''; setInterimTranscript(''); }} disabled={Boolean(currentResult)} rows={6} dir={isRtl ? 'rtl' : 'ltr'} placeholder="Your spoken words will appear here. You can review or correct them before submitting." className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 leading-7 text-white outline-none transition focus:border-emerald-400 disabled:opacity-70" />
            </div>

            {speechError && <p role="alert" className="mt-3 text-sm font-semibold text-amber-300">{speechError}</p>}

            {!currentResult && (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button type="button" onClick={startListening} disabled={!recognitionSupported || isListening || isStopping} className="glow-button glow-button-blue py-4 disabled:cursor-not-allowed disabled:opacity-40"><Mic size={18} /> Start speaking</button>
                  <button type="button" onClick={stopListening} disabled={!isListening || isStopping} className="glow-button glow-button-muted py-4 disabled:cursor-not-allowed disabled:opacity-40"><CircleStop size={18} /> {isStopping ? 'Finishing...' : 'Stop listening'}</button>
                  <button type="button" onClick={submitAnswer} disabled={isListening || isStopping} className="glow-button glow-button-green py-4 disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 size={18} /> Submit answer</button>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Recognition is supplied by your browser and may use its online speech service. Lugaish does not upload or store your microphone audio.</p>
              </>
            )}

            {currentResult && (
              <div aria-live="polite" className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-white">Answer feedback</h2>
                  <p className="text-2xl font-black text-emerald-300">{currentResult.marks}/{currentResult.maxMarks}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{currentResult.feedback}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><p className="text-xs font-black uppercase tracking-wider text-emerald-400">Matched keywords</p><p className="mt-2 text-sm text-slate-300">{currentResult.matchedKeywords.join(', ') || 'None yet'}</p></div>
                  <div><p className="text-xs font-black uppercase tracking-wider text-amber-400">Missing keywords</p><p className="mt-2 text-sm text-slate-300">{currentResult.missingKeywords.join(', ') || 'None'}</p></div>
                </div>
                <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-4" dir={isRtl ? 'rtl' : 'ltr'}><p className="text-xs font-black uppercase tracking-wider text-slate-500">Sample answer</p><p className="mt-2 text-sm leading-6 text-slate-300">{currentQuestion.sampleAnswer}</p></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={retryQuestion} className="glow-button glow-button-muted py-4"><RefreshCw size={18} /> Retry</button>
                  <button type="button" onClick={nextQuestion} className="glow-button glow-button-blue py-4">{questionIndex === questions.length - 1 ? 'Finish test' : 'Next question'} <Sparkles size={18} /></button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="section-card p-5">
              <div className="flex items-center gap-3"><Headphones size={20} className="text-blue-300" /><h2 className="font-black text-white">Test progress</h2></div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all" style={{ width: `${questions.length ? (results.length / questions.length) * 100 : 0}%` }} /></div>
              <p className="mt-3 text-sm text-slate-400">{results.length}/{questions.length} answered · current score {totalOutOf100}/100</p>
              {loadNotice && <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">{loadNotice}</p>}
            </div>
            <button type="button" onClick={finishTest} className="glow-button glow-button-muted w-full py-4">Finish test now</button>
          </aside>
        </div>
      )}
    </section>
  );
}

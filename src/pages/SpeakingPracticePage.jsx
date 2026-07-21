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
  Settings2,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { getLocalSpeakingQuestions } from '../data/speakingQuestions.ts';
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
  if (questions.length > MAX_QUESTIONS) return `A day can have at most ${MAX_QUESTIONS} questions.`;
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

function buildModulePayload(module, language, day, questions, published) {
  return {
    moduleType: 'ai_practice',
    published,
    title: module?.title || `Day ${day} AI speaking practice`,
    description: module?.description || 'Listen, speak, and receive instant feedback.',
    introTitle: module?.introTitle || '',
    introText: module?.introText || '',
    questions,
    language,
  };
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
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [draftQuestions, setDraftQuestions] = useState([]);
  const [publishForLearners, setPublishForLearners] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(true);
  const [loadNotice, setLoadNotice] = useState('');
  const [accessError, setAccessError] = useState(null);
  const [managerOpen, setManagerOpen] = useState(shouldOpenManager && isWebDeveloper);
  const [managerMessage, setManagerMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasBegun, setHasBegun] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [results, setResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [completionNotice, setCompletionNotice] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [speechRate, setSpeechRate] = useState(0.92);
  const recognitionRef = useRef(null);
  const interimTranscriptRef = useRef('');
  const audioRef = useRef(null);
  const sessionStartedRef = useRef(false);
  const completionSentRef = useRef(false);
  const lastAutoReadKeyRef = useRef('');

  const RecognitionConstructor = typeof window === 'undefined'
    ? null
    : window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const recognitionSupported = Boolean(RecognitionConstructor);
  const currentQuestion = questions[questionIndex];
  const currentResult = results.find(result => result.questionId === currentQuestion?.id);
  const isRtl = language === 'arabic';
  const isPracticeDay = !module || module.moduleType === 'ai_practice';

  useEffect(() => {
    if (shouldOpenManager && isWebDeveloper) setManagerOpen(true);
  }, [isWebDeveloper, shouldOpenManager]);

  useEffect(() => {
    let ignore = false;
    const localSet = isWebDeveloper ? readLocalSet(language, day) : null;
    setModule(null);
    setQuestions([]);
    setDraftQuestions(localSet ?? []);
    setPublishForLearners(false);
    setHasBegun(false);
    setQuestionIndex(0);
    setTranscript('');
    setInterimTranscript('');
    setResults([]);
    setIsFinished(false);
    setCompletionNotice('');
    setAccessError(null);
    sessionStartedRef.current = false;
    completionSentRef.current = false;
    lastAutoReadKeyRef.current = '';
    setLoadNotice(localSet ? 'A private browser draft is available for the Web Developer.' : '');
    setIsRemoteLoading(true);

    api.getSpeakingPractice(language, day)
      .then(response => {
        if (ignore) return;
        const remoteQuestions = Array.isArray(response.questions) ? response.questions : [];
        const savedModule = {
          moduleType: response.moduleType ?? 'ai_practice',
          title: response.title ?? '',
          description: response.description ?? '',
          introTitle: response.introTitle ?? '',
          introText: response.introText ?? '',
          published: Boolean(response.published ?? response.enabled),
        };
        setAccessError(null);
        setModule(savedModule);
        setPublishForLearners(savedModule.published);
        if (sessionStartedRef.current) {
          setLoadNotice('The saved question set loaded. Your current attempt was kept.');
          return;
        }
        setQuestions(remoteQuestions);
        setDraftQuestions(remoteQuestions.length || !localSet ? remoteQuestions : localSet);
        setLoadNotice(isWebDeveloper
          ? savedModule.moduleType === 'ai_practice'
            ? savedModule.published
              ? 'This AI practice day is live for learners.'
              : 'This AI practice draft is private until you publish it.'
            : 'Configure this day as AI speaking practice before adding questions.'
          : 'Read the instructions, then begin the scheduled practice session.');
      })
      .catch(error => {
        if (ignore) return;
        if (!isWebDeveloper) {
          setAccessError({
            status: error.status,
            message: error.message || 'This scheduled AI practice session is not available yet.',
          });
        }
        setLoadNotice(error.message || (isWebDeveloper
          ? 'The day configuration could not be loaded. Try again before publishing.'
          : 'This AI practice session is not available yet.'));
      })
      .finally(() => {
        if (!ignore) setIsRemoteLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [day, isWebDeveloper, language]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;

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
      if (!['canceled', 'interrupted'].includes(event.error)) setSpeechError('The browser could not read this question.');
    };
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!hasBegun || !currentQuestion) return undefined;
    const readKey = `${questionIndex}:${currentQuestion.id}`;
    if (lastAutoReadKeyRef.current === readKey) return undefined;
    lastAutoReadKeyRef.current = readKey;
    const timeout = window.setTimeout(() => speakQuestion(), 80);
    return () => window.clearTimeout(timeout);
  }, [currentQuestion, hasBegun, questionIndex]);

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
        if (remainingInterim) setTranscript(current => `${current} ${remainingInterim}`.replace(/\s+/g, ' ').trim());
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

    if (!isWebDeveloper && results.length === questions.length && !completionSentRef.current) {
      completionSentRef.current = true;
      api.completeLesson({ language, day })
        .then(() => setCompletionNotice('Day complete — the next scheduled day is now unlocked.'))
        .catch(() => setCompletionNotice('Your test result is saved here. The course progress will refresh when the connection is available.'));
    } else if (!isWebDeveloper && results.length < questions.length) {
      setCompletionNotice('Your result is saved, but complete every question to unlock the next scheduled day.');
    }
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

  const loadStarterQuestions = () => {
    if (draftQuestions.length) {
      setManagerMessage('Clear the current draft before loading the starter template.');
      return;
    }
    const starterQuestions = getLocalSpeakingQuestions(language).map(question => ({
      ...question,
      id: `${question.id}-day-${day}`,
      audioUrl: question.audioUrl ?? '',
    }));
    setDraftQuestions(starterQuestions);
    setManagerMessage('Starter questions loaded. Edit them before saving this day.');
  };

  const saveQuestionSet = async () => {
    if (isRemoteLoading) {
      setManagerMessage('Wait for the day settings to finish loading before saving.');
      return;
    }
    if (!isPracticeDay) {
      setManagerMessage('Choose AI speaking practice in the Day setup before adding questions.');
      return;
    }
    const validationMessage = validateQuestionSet(draftQuestions);
    if (validationMessage) {
      setManagerMessage(validationMessage);
      return;
    }
    if (publishForLearners && draftQuestions.length === 0) {
      setManagerMessage('Add at least one question before publishing AI practice.');
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
      const response = await api.updateDayModule(
        language,
        day,
        buildModulePayload(module, language, day, validQuestions, publishForLearners),
      );
      const savedModule = response.module;
      const savedQuestions = savedModule.questions ?? validQuestions;
      setModule({
        moduleType: savedModule.moduleType,
        title: savedModule.title,
        description: savedModule.description,
        introTitle: savedModule.introTitle,
        introText: savedModule.introText,
        published: savedModule.published,
      });
      setQuestions(savedQuestions);
      setDraftQuestions(savedQuestions);
      setPublishForLearners(Boolean(savedModule.published));
      setManagerMessage(savedModule.published
        ? 'AI practice is live for learners on this day.'
        : 'Private AI practice draft saved. Learners cannot see it yet.');
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
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-300"><Sparkles size={36} /></div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.26em] text-emerald-400">Speaking test complete</p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-7xl">{totalOutOf100}/100</h1>
          <p className="mt-3 text-slate-400">You answered {results.length} of {questions.length} questions. Your latest result is saved on this device.</p>
          {completionNotice && <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] px-4 py-3 text-sm text-emerald-100">{completionNotice}</p>}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-muted py-4"><ArrowLeft size={18} /> Daily lessons</button>
            <button type="button" onClick={() => { setQuestionIndex(0); setResults([]); setTranscript(''); setHasBegun(true); setIsFinished(false); lastAutoReadKeyRef.current = ''; }} className="glow-button glow-button-blue py-4"><RefreshCw size={18} /> Try the test again</button>
          </div>
        </div>
      </section>
    );
  }

  if (!isRemoteLoading && !isWebDeveloper && accessError) {
    const isScheduleRestriction = [403, 404, 409].includes(accessError.status);
    return (
      <section className="mx-auto max-w-3xl space-y-6 pb-20">
        <div className="section-card p-8 text-center sm:p-12">
          <Mic size={34} className="mx-auto text-amber-300" />
          <h1 className="mt-5 text-3xl font-black text-white">
            {isScheduleRestriction ? 'This AI practice is not open yet' : 'This AI practice could not be opened'}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            {isScheduleRestriction
              ? 'Open the learning format assigned to your current course day, then return when this practice session is unlocked.'
              : accessError.message}
          </p>
          {isScheduleRestriction && accessError.message && (
            <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {accessError.message}
            </p>
          )}
          <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-blue mt-7"><ArrowLeft size={18} /> Daily lessons</button>
        </div>
      </section>
    );
  }

  if (!isRemoteLoading && module && !isPracticeDay && !isWebDeveloper) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 pb-20">
        <div className="section-card p-8 text-center sm:p-12">
          <Settings2 size={34} className="mx-auto text-amber-300" />
          <h1 className="mt-5 text-3xl font-black text-white">This day is not an AI practice session</h1>
          <p className="mt-3 text-slate-400">Return to Daily Lessons and open the learning format scheduled for this day.</p>
          <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-blue mt-7"><ArrowLeft size={18} /> Daily lessons</button>
        </div>
      </section>
    );
  }

  if (!isWebDeveloper && !hasBegun && !isRemoteLoading && currentQuestion) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 pb-20">
        <div className="section-card relative overflow-hidden p-8 sm:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Day {day} · AI speaking practice</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">{module?.introTitle || 'Ready to speak with confidence?'}</h1>
            <p className="mt-5 text-base leading-8 text-slate-300">{module?.introText || 'Listen to each question, answer by microphone, check your transcript, and receive instant feedback before continuing.'}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Questions</p><p className="mt-2 text-2xl font-black text-white">{questions.length}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scoring</p><p className="mt-2 text-2xl font-black text-white">Out of 100</p></div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => { lastAutoReadKeyRef.current = ''; setHasBegun(true); }} className="glow-button glow-button-blue py-4"><Mic size={18} /> Begin practice</button>
              <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-muted py-4"><ArrowLeft size={18} /> Back to lessons</button>
            </div>
          </div>
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
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">AI Speaking Practice</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">{language === 'arabic' ? 'Arabic' : 'English'} · Day {day}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-400">{module?.description || 'Listen, answer naturally, review your transcript, and receive lightweight keyword-based feedback.'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isWebDeveloper && (
              <button type="button" disabled={isRemoteLoading} onClick={() => setManagerOpen(open => !open)} className="glow-button glow-button-muted disabled:cursor-wait disabled:opacity-50">
                {isRemoteLoading ? <LoaderCircle size={17} className="animate-spin" /> : <Settings2 size={17} />} {isRemoteLoading ? 'Loading setup' : 'Manage questions'}
              </button>
            )}
            <button type="button" onClick={() => navigate('/daily-lessons')} className="glow-button glow-button-muted"><ArrowLeft size={17} /> Lessons</button>
          </div>
        </div>
      </div>

      {isWebDeveloper && managerOpen && (
        <div className="section-card p-5 sm:p-8">
          {!isPracticeDay ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5 text-amber-100">
              <h2 className="text-xl font-black">Choose AI practice first</h2>
              <p className="mt-2 text-sm leading-6">Configure Day {day} as an AI speaking practice session before adding its questions.</p>
              <button type="button" onClick={() => navigate(`/lesson/${day}?configure=1`)} className="glow-button glow-button-muted mt-5"><Settings2 size={17} /> Configure day</button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">Web Developer question editor</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Day {day} AI question set</h2>
                  <p className="mt-2 text-sm text-slate-400">Learners see these questions only when this day is published. Separate expected keywords with commas. A hosted audio URL is optional; browser text-to-speech is always available.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={loadStarterQuestions} disabled={Boolean(draftQuestions.length)} className="glow-button glow-button-muted disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={17} /> Starter template</button>
                  <button type="button" disabled={draftQuestions.length >= MAX_QUESTIONS} onClick={() => setDraftQuestions(current => [...current, createQuestion(language)])} className="glow-button glow-button-muted disabled:cursor-not-allowed disabled:opacity-40"><Plus size={17} /> Add question</button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {draftQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between"><p className="text-sm font-black text-white">Question {index + 1}</p><button type="button" onClick={() => setDraftQuestions(current => current.filter((_, itemIndex) => itemIndex !== index))} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-300" aria-label={`Remove question ${index + 1}`}><Trash2 size={16} /></button></div>
                    <div className="grid gap-3 lg:grid-cols-2">
                      <textarea aria-label={`Question ${index + 1} text`} maxLength={500} value={question.question} onChange={event => updateDraft(index, 'question', event.target.value)} placeholder="Question text" rows={3} dir={isRtl ? 'rtl' : 'ltr'} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" />
                      <textarea aria-label={`Question ${index + 1} sample answer`} maxLength={2000} value={question.sampleAnswer} onChange={event => updateDraft(index, 'sampleAnswer', event.target.value)} placeholder="Sample answer" rows={3} dir={isRtl ? 'rtl' : 'ltr'} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" />
                      <input aria-label={`Question ${index + 1} expected keywords`} value={question.expectedKeywords.join(', ')} onChange={event => updateDraft(index, 'expectedKeywords', event.target.value)} placeholder="Expected keywords, separated by commas" dir={isRtl ? 'rtl' : 'ltr'} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" />
                      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                        <input type="number" min="1" max="100" value={question.maxMarks} onChange={event => updateDraft(index, 'maxMarks', event.target.value)} aria-label={`Question ${index + 1} maximum marks`} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" />
                        <input type="url" maxLength={2048} aria-label={`Question ${index + 1} optional recorded audio URL`} value={question.audioUrl ?? ''} onChange={event => updateDraft(index, 'audioUrl', event.target.value)} placeholder="Optional recorded audio URL" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm text-slate-300">
                <input type="checkbox" checked={publishForLearners} onChange={event => setPublishForLearners(event.target.checked)} className="mt-1 h-4 w-4 accent-emerald-400" />
                <span><strong className="text-white">Publish this AI practice day</strong><br />Only the Web Developer can make the question set visible to learners.</span>
              </label>
              {managerMessage && <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{managerMessage}</p>}
              <button type="button" onClick={saveQuestionSet} disabled={isSaving} className="glow-button glow-button-blue mt-5 w-full py-4 disabled:opacity-50">{isSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}{isSaving ? 'Saving...' : 'Save AI practice day'}</button>
            </>
          )}
        </div>
      )}

      {isRemoteLoading ? (
        <div className="section-card grid min-h-72 place-items-center"><LoaderCircle size={34} className="animate-spin text-slate-400" /></div>
      ) : !currentQuestion ? (
        <div className="section-card p-10 text-center">
          <h2 className="text-2xl font-black text-white">No practice questions are live yet</h2>
          <p className="mt-2 text-slate-400">{isWebDeveloper ? 'Configure the day and add its question set above.' : loadNotice || 'Your course team is preparing this practice session.'}</p>
          {isWebDeveloper && <button type="button" onClick={() => navigate(`/lesson/${day}?configure=1`)} className="glow-button glow-button-muted mt-6"><Settings2 size={17} /> Configure day</button>}
        </div>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="section-card p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">Question {questionIndex + 1} of {questions.length}</p><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">{currentQuestion.maxMarks} marks</span></div>
            <div className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5 sm:p-7" dir={isRtl ? 'rtl' : 'ltr'}><p className="text-xl font-black leading-9 text-white sm:text-2xl">{currentQuestion.question}</p></div>

            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_auto]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Browser voice<select value={selectedVoiceName} onChange={event => setSelectedVoiceName(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm normal-case tracking-normal text-white">{(languageVoices.length ? languageVoices : voices).map(voice => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} · {voice.lang}</option>)}</select></label>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Speed<select value={speechRate} onChange={event => setSpeechRate(Number(event.target.value))} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm normal-case tracking-normal text-white"><option value="0.8">Slow</option><option value="0.92">Natural</option><option value="1">Normal</option></select></label>
              <div className="grid gap-2 self-end"><button type="button" onClick={speakQuestion} className="glow-button glow-button-muted py-3.5"><Volume2 size={18} /> Read question</button>{currentQuestion.audioUrl && <button type="button" onClick={playRecordedQuestion} className="glow-button glow-button-muted py-3"><Headphones size={17} /> Recorded audio</button>}</div>
            </div>

            {!recognitionSupported && <div role="status" className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">Speech recognition is unavailable in this browser. Use a recent Chrome or Edge browser, or type your answer below for practice.</div>}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="speaking-transcript" className="text-sm font-black text-white">Your transcript</label>{isListening && <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" /> Listening</span>}</div>
              <textarea id="speaking-transcript" value={`${transcript}${interimTranscript ? ` ${interimTranscript}` : ''}`} onChange={event => { sessionStartedRef.current = true; setTranscript(event.target.value); interimTranscriptRef.current = ''; setInterimTranscript(''); }} disabled={Boolean(currentResult)} rows={6} dir={isRtl ? 'rtl' : 'ltr'} placeholder="Your spoken words will appear here. You can review or correct them before submitting." className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 leading-7 text-white outline-none transition focus:border-emerald-400 disabled:opacity-70" />
            </div>
            {speechError && <p role="alert" className="mt-3 text-sm font-semibold text-amber-300">{speechError}</p>}

            {!currentResult ? (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-3"><button type="button" onClick={startListening} disabled={!recognitionSupported || isListening || isStopping} className="glow-button glow-button-blue py-4 disabled:cursor-not-allowed disabled:opacity-40"><Mic size={18} /> Start speaking</button><button type="button" onClick={stopListening} disabled={!isListening || isStopping} className="glow-button glow-button-muted py-4 disabled:cursor-not-allowed disabled:opacity-40"><CircleStop size={18} /> {isStopping ? 'Finishing...' : 'Stop listening'}</button><button type="button" onClick={submitAnswer} disabled={isListening || isStopping} className="glow-button glow-button-green py-4 disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 size={18} /> Submit answer</button></div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Recognition is supplied by your browser and may use its online speech service. Lugaish does not upload or store your microphone audio.</p>
              </>
            ) : (
              <div aria-live="polite" className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-white">Answer feedback</h2><p className="text-2xl font-black text-emerald-300">{currentResult.marks}/{currentResult.maxMarks}</p></div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{currentResult.feedback}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-wider text-emerald-400">Matched keywords</p><p className="mt-2 text-sm text-slate-300">{currentResult.matchedKeywords.join(', ') || 'None yet'}</p></div><div><p className="text-xs font-black uppercase tracking-wider text-amber-400">Missing keywords</p><p className="mt-2 text-sm text-slate-300">{currentResult.missingKeywords.join(', ') || 'None'}</p></div></div>
                <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-4" dir={isRtl ? 'rtl' : 'ltr'}><p className="text-xs font-black uppercase tracking-wider text-slate-500">Sample answer</p><p className="mt-2 text-sm leading-6 text-slate-300">{currentQuestion.sampleAnswer}</p></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" onClick={retryQuestion} className="glow-button glow-button-muted py-4"><RefreshCw size={18} /> Retry</button><button type="button" onClick={nextQuestion} className="glow-button glow-button-blue py-4">{questionIndex === questions.length - 1 ? 'Finish test' : 'Next question'} <Sparkles size={18} /></button></div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="section-card p-5"><div className="flex items-center gap-3"><Headphones size={20} className="text-blue-300" /><h2 className="font-black text-white">Test progress</h2></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all" style={{ width: `${questions.length ? (results.length / questions.length) * 100 : 0}%` }} /></div><p className="mt-3 text-sm text-slate-400">{results.length}/{questions.length} answered · current score {totalOutOf100}/100</p>{loadNotice && <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">{loadNotice}</p>}</div>
            <button type="button" onClick={finishTest} className="glow-button glow-button-muted w-full py-4">Finish test now</button>
          </aside>
        </div>
      )}
    </section>
  );
}

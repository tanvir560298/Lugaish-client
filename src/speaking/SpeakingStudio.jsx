import { Mic } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { createVoiceRecorder } from "./recording.js";
import "./speaking.css";
export const SpeakingStudio = forwardRef(function SpeakingStudio(
  {
    questions,
    currentIndex = 0,
    language,
    personal = false,
    onBeforeAudio = () => {},
    children,
  },
  ref,
) {
  const [finishedSummary, setFinishedSummary] = useState(null);
  const [mode, setMode] = useState(personal ? "repeat" : "guided"),
    [phraseIndex, setPhraseIndex] = useState(currentIndex),
    [voice, setVoice] = useState({
      status: "idle",
      duration: 0,
      url: null,
      error: "",
    }),
    [level, setLevel] = useState(0),
    [reference, setReference] = useState(false),
    [referenceError, setReferenceError] = useState(""),
    [summary, setSummary] = useState({ seconds: 0, attempts: 0, phrases: [] });
  const controller = useRef(),
    referenceAudio = useRef(),
    utterance = useRef(),
    activePhrase = useRef();
  const phrase =
    questions[mode === "repeat" ? phraseIndex : currentIndex] ?? questions[0];
  activePhrase.current = phrase?.id;
  function stopReference() {
    referenceAudio.current?.pause();
    if (referenceAudio.current) {
      referenceAudio.current.onended = referenceAudio.current.onerror = null;
    }
    referenceAudio.current = null;
    if (utterance.current) {
      utterance.current.onend = utterance.current.onerror = null;
      window.speechSynthesis?.cancel();
      utterance.current = null;
    }
    setReference(false);
  }
  function reset() {
    stopReference();
    controller.current?.reset();
  }
  useImperativeHandle(ref, () => ({ reset }));
  useEffect(() => {
    const recorder = createVoiceRecorder({
      onChange: setVoice,
      onLevel: setLevel,
      onRecorded: ({ duration }) =>
        setSummary((s) => ({
          seconds: s.seconds + duration,
          attempts: s.attempts + 1,
          phrases: [...new Set([...s.phrases, activePhrase.current])],
        })),
    });
    controller.current = recorder;
    return () => {
      recorder.dispose();
      referenceAudio.current?.pause();
      if (utterance.current) {
        utterance.current.onend = utterance.current.onerror = null;
        window.speechSynthesis?.cancel();
      }
      controller.current = null;
    };
  }, []);
  useEffect(() => {
    reset();
  }, [mode, phrase?.id]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        reset();
        onBeforeAudio();
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, [onBeforeAudio]);
  async function listen() {
    stopReference();
    controller.current?.pause();
    onBeforeAudio();
    setReferenceError("");
    if (!phrase) return;
    if (phrase.audioUrl) {
      const audio = new Audio(phrase.audioUrl);
      referenceAudio.current = audio;
      audio.onended = () => {
        if (referenceAudio.current === audio) setReference(false);
      };
      audio.onerror = () => {
        if (referenceAudio.current !== audio) return;
        setReference(false);
        setReferenceError(
          "The reference audio could not play. Read the phrase or try again.",
        );
      };
      setReference(true);
      try {
        await audio.play();
      } catch {
        if (referenceAudio.current !== audio) return;
        setReference(false);
        setReferenceError("Reference playback was blocked. Try again.");
      }
      return;
    }
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setReferenceError(
        "Browser voice is unavailable. The supplied phrase remains readable.",
      );
      return;
    }
    const u = new SpeechSynthesisUtterance(phrase.question);
    u.lang = language === "arabic" ? "ar-SA" : "en-US";
    u.rate = 0.9;
    u.voice =
      window.speechSynthesis
        .getVoices()
        .find((v) =>
          v.lang.toLowerCase().startsWith(language === "arabic" ? "ar" : "en"),
        ) ?? null;
    u.onend = () => {
      if (utterance.current === u) setReference(false);
    };
    u.onerror = () => {
      if (utterance.current !== u) return;
      setReference(false);
      setReferenceError(
        "Browser voice could not read this phrase. Try a recorded reference if supplied.",
      );
    };
    utterance.current = u;
    setReference(true);
    window.speechSynthesis.speak(u);
  }
  const active = ["requesting", "recording", "stopping"].includes(voice.status);
  return (
    <section className="speaking-studio" aria-label="Speaking studio">
      <div className="voice-heading">
        <div>
          <p className="voice-eyebrow">
            YOUR SPEAKING STUDIO ·{" "}
            {language === "arabic" ? "ARABIC" : "ENGLISH"}
          </p>
          <h2>A little practice. More confidence.</h2>
        </div>
        {!personal && (
          <Link to="/daily-lessons">Change language in My Classes</Link>
        )}
      </div>
      <div className="voice-modes" role="group" aria-label="Speaking mode">
        {(personal
          ? [
              ["repeat", "Personal reading"],
              ["free", "AI conversation · unavailable"],
            ]
          : [
              ["guided", "Guided conversation"],
              ["repeat", "Listen & Repeat"],
              ["free", "Free Conversation"],
            ]
        ).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={mode === id}
            onClick={() => {
              reset();
              onBeforeAudio();
              setMode(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "free" ? (
        <div className="voice-panel">
          <h3>Open conversation needs a connected AI service.</h3>
          <p>
            {personal
              ? "No conversational AI provider is configured. You can still record a passage from your own notes locally."
              : "No conversational AI provider is configured. Guided conversation uses the existing activity scripts; it does not generate AI replies."}
          </p>
          <button onClick={() => setMode(personal ? "repeat" : "guided")}>
            {personal ? "Return to personal reading" : "Try guided practice"}
          </button>
        </div>
      ) : (
        <>
          <div className="voice-panel">
            <div className="voice-layout">
              <div>
                {mode === "repeat" && !personal && (
                  <label className="voice-field">
                    Choose a supplied phrase
                    <select
                      value={phraseIndex}
                      onChange={(e) => {
                        reset();
                        onBeforeAudio();
                        setPhraseIndex(Number(e.target.value));
                      }}
                    >
                      {questions.map((q, i) => (
                        <option key={q.id} value={i}>
                          {q.question}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <p className="voice-eyebrow">
                  {personal
                    ? "READ, RECORD, LISTEN"
                    : mode === "repeat"
                      ? "LISTEN, RECORD, COMPARE"
                      : "YOUR CURRENT SPEAKING TURN"}
                </p>
                <h3 dir="auto" lang={language === "arabic" ? "ar" : "en"}>
                  {phrase?.question}
                </h3>
                <p>
                  {personal
                    ? "Open your notes and choose a short passage. Record yourself reading it, then listen back. No reference audio or pronunciation grade is supplied."
                    : mode === "repeat"
                      ? "Hear the supplied phrase, repeat it, then compare your playback. This is listening practice, not a pronunciation grade."
                      : "Record a reply locally, or use the transcript controls below. Reference playback reads the existing question."}
                </p>
                {!personal && (
                  <div className="voice-actions">
                    <button onClick={listen} disabled={active}>
                      Hear reference
                    </button>
                    <button onClick={stopReference} disabled={!reference}>
                      Stop reference
                    </button>
                  </div>
                )}
                {referenceError && <p role="alert">{referenceError}</p>}
              </div>
              <div className="voice-capture">
                <p className="voice-eyebrow">
                  LOCAL RECORDING · MAX 60 SECONDS
                </p>
                <div
                  className="voice-orb"
                  data-active={voice.status === "recording"}
                  aria-hidden="true"
                >
                  <Mic size={32} />
                </div>
                <p role="status">
                  {
                    {
                      idle: "Ready when you are",
                      requesting: "Waiting for microphone permission",
                      recording: "Microphone active",
                      stopping: "Preparing your playback",
                      ready: "Your recording is ready",
                      playing: "Playing your recording",
                      error: "Try another attempt",
                    }[voice.status]
                  }
                </p>
                <meter
                  min="0"
                  max="1"
                  value={level}
                  aria-label="Actual microphone input level"
                />
                <div className="voice-actions">
                  {active ? (
                    <button
                      className="voice-primary"
                      onClick={() => controller.current?.stop()}
                      disabled={voice.status === "stopping"}
                    >
                      {voice.status === "requesting"
                        ? "Cancel permission request"
                        : "Stop recording"}
                    </button>
                  ) : (
                    <button
                      className="voice-primary"
                      disabled={reference}
                      onClick={() => {
                        setFinishedSummary(null);
                        onBeforeAudio();
                        stopReference();
                        controller.current?.start();
                      }}
                    >
                      Record my voice
                    </button>
                  )}
                  {voice.url && (
                    <>
                      <button
                        onClick={() => {
                          onBeforeAudio();
                          stopReference();
                          controller.current?.play();
                        }}
                        disabled={active}
                      >
                        Play my recording
                      </button>
                      <button
                        onClick={() => controller.current?.pause()}
                        disabled={voice.status !== "playing"}
                      >
                        Pause playback
                      </button>
                      <button onClick={reset} disabled={active}>
                        Delete recording
                      </button>
                    </>
                  )}
                </div>
                {voice.duration > 0 && (
                  <p>{voice.duration.toFixed(1)} seconds recorded</p>
                )}
                {voice.error && (
                  <p role="alert" className="voice-error">
                    {voice.error}
                  </p>
                )}
              </div>
            </div>
            <p className="voice-privacy">
              Recording stays in memory on this page and is never uploaded by
              Lugaish. Only one attempt is kept; retry, changing phrase/mode,
              leaving or hiding this page deletes it.{" "}
              {!personal &&
                "Browser transcription below is separate and may use an online browser service."}
            </p>
          </div>
          {mode === "guided" && <div className="voice-guided">{children}</div>}
        </>
      )}
      {summary.attempts > 0 && (
        <div className="voice-summary" role="status">
          <strong>Your actual practice this visit</strong>
          <p>
            {summary.attempts} recordings · {summary.phrases.length}{" "}
            {personal ? "reading prompts" : "supplied phrases"} ·{" "}
            {summary.seconds.toFixed(1)} seconds captured.
          </p>
          <p>
            These local activities do not mark a course lesson complete. Course
            progress requires a published course activity.
          </p>
          <button
            onClick={() => {
              reset();
              onBeforeAudio();
              setFinishedSummary(summary);
              setSummary({ seconds: 0, attempts: 0, phrases: [] });
            }}
          >
            Finish local recording session
          </button>
        </div>
      )}
      {finishedSummary && (
        <div className="voice-summary" role="status">
          <strong>Your local practice session is finished.</strong>
          <p>
            {finishedSummary.attempts} recordings across{" "}
            {finishedSummary.phrases.length}{" "}
            {personal ? "reading prompts" : "supplied phrases"} ·{" "}
            {finishedSummary.seconds.toFixed(1)} seconds captured. All audio has
            been deleted.
          </p>
        </div>
      )}
      <div className="voice-actions">
        <Link to="/learning-spaces">Learning Spaces</Link>
        <Link to="/daily-lessons">My Classes</Link>
      </div>
    </section>
  );
});

import { useState } from "react";
import { SpeakingStudio } from "../speaking/SpeakingStudio.jsx";
export function IndependentSpeaking() {
  const [language, setLanguage] = useState("english");
  const questions = [
    {
      id: `personal-speaking:${language}`,
      question:
        language === "arabic"
          ? "اقرأ فقرة من ملاحظاتك بصوت واضح."
          : "Read a short passage from your own notes aloud.",
      sampleAnswer: "",
      expectedKeywords: [],
      maxMarks: 0,
    },
  ];
  return (
    <div className="platform-page">
      <header className="platform-page-heading">
        <p className="platform-eyebrow">PERSONAL VOICE PRACTICE</p>
        <h1>Your voice, your practice.</h1>
        <p>
          Course conversations are unavailable while the catalog is empty.
          Record and listen to your own reading here. Recordings stay in this
          visit. No course marks or AI assessment are awarded.
        </p>
        <label className="voice-field">
          Reading language{" "}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="arabic">Arabic</option>
          </select>
        </label>
      </header>
      <p className="voice-language-note">
        Changing language clears your current recording. Your microphone starts
        only when you choose Record.
      </p>
      <SpeakingStudio
        key={language}
        personal
        questions={questions}
        language={language}
      />
    </div>
  );
}

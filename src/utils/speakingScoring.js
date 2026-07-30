export function normalizeSpeakingText(value, language) {
  const normalized = String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase(language === 'arabic' ? 'ar-SA' : 'en-US')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return language === 'arabic'
    ? normalized.replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي')
    : normalized;
}

function phraseCoverage(answer, phrase, language) {
  const answerTokens = new Set(normalizeSpeakingText(answer, language).split(' ').filter(Boolean));
  const phraseTokens = normalizeSpeakingText(phrase, language).split(' ').filter(Boolean);
  if (!phraseTokens.length) return 0;
  return phraseTokens.filter(token => answerTokens.has(token)).length / phraseTokens.length;
}

function scoreAcceptedResponse(question, transcript) {
  const accepted = Array.isArray(question.acceptedResponses) ? question.acceptedResponses : [];
  if (!accepted.length) return null;
  return Math.max(...accepted.map(response => phraseCoverage(transcript, response, question.language)));
}

export function scoreSpeakingTranscript(question, transcript, { recognitionConfidence } = {}) {
  const normalizedAnswer = normalizeSpeakingText(transcript, question.language);
  const keywords = question.expectedKeywords.filter(Boolean);
  const searchableAnswer = question.language === 'arabic'
    ? normalizedAnswer
        .split(' ')
        .flatMap(token => (token.length > 3 && /^[وفبكل]/.test(token) ? [token, token.slice(1)] : [token]))
        .join(' ')
    : normalizedAnswer;
  const paddedAnswer = ` ${searchableAnswer} `;
  const matchedKeywords = keywords.filter(keyword => {
    const normalizedKeyword = normalizeSpeakingText(keyword, question.language);
    return normalizedKeyword && paddedAnswer.includes(` ${normalizedKeyword} `);
  });
  const missingKeywords = keywords.filter(keyword => !matchedKeywords.includes(keyword));
  const keywordRatio = keywords.length ? matchedKeywords.length / keywords.length : 0;
  const acceptedRatio = scoreAcceptedResponse(question, transcript);
  const questionRatio = question.scoringStrategy === 'question_reading'
    ? phraseCoverage(transcript, question.question, question.language)
    : null;
  let ratio = questionRatio ?? acceptedRatio ?? keywordRatio;

  // A name may be given directly or after أنا / اسمي. Require at least one
  // identity token so repeating only the prompt never earns full marks.
  if (question.scoringStrategy === 'name') {
    const tokens = normalizedAnswer.split(' ').filter(Boolean);
    const contentTokens = tokens.filter(token => !['انا', 'اسمي', 'الاسم'].includes(token));
    ratio = contentTokens.length ? Math.max(ratio, tokens.length === 1 ? 0.9 : 1) : 0;
  }

  const confidence = Number(recognitionConfidence);
  const hasConfidence = Number.isFinite(confidence) && confidence > 0 && confidence <= 1;
  // Browser confidence is only a supporting signal: pronunciation/recognition
  // contributes at most 20%, while phrase accuracy remains the main criterion.
  const confidenceFactor = hasConfidence ? 0.8 + (0.2 * confidence) : 1;
  const marks = Math.round(ratio * confidenceFactor * Number(question.maxMarks || 0));

  return {
    questionId: question.id,
    transcript: transcript.trim(),
    marks,
    maxMarks: Number(question.maxMarks || 0),
    matchedKeywords,
    missingKeywords,
    recognitionConfidence: hasConfidence ? Math.round(confidence * 100) : null,
    feedback: ratio === 1
      ? hasConfidence && confidence < 0.65
        ? 'Your phrase is correct. Speak a little more clearly and steadily for stronger recognition.'
        : 'Excellent. The required Arabic phrase was recognized.'
      : ratio >= 0.5
        ? 'Good attempt. Repeat the full Arabic phrase more clearly for a higher score.'
        : 'Try again slowly and include the key Arabic words shown in the example.',
  };
}

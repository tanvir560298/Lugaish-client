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

export function scoreSpeakingTranscript(question, transcript) {
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
  const marks = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * Number(question.maxMarks || 0))
    : 0;
  const ratio = keywords.length ? matchedKeywords.length / keywords.length : 0;

  return {
    questionId: question.id,
    transcript: transcript.trim(),
    marks,
    maxMarks: Number(question.maxMarks || 0),
    matchedKeywords,
    missingKeywords,
    feedback: ratio === 1
      ? 'Excellent coverage. You included every key idea.'
      : ratio >= 0.5
        ? 'Good attempt. Add the missing ideas to make the answer stronger.'
        : 'Try again and include more of the key ideas in a complete sentence.',
  };
}

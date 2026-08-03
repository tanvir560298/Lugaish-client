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

const ENGLISH_MEETING_SIGNALS = {
  1: {
    relevant: value => value.split(' ').filter(Boolean).some(token => !['hi', 'hello', 'hey', 'im', 'i', 'am', 'my', 'name', 'is'].includes(token)),
    required: value => /\b(i am|i m|im|my name is)\b/.test(value) || value.split(' ').length <= 3,
  },
  2: {
    relevant: value => /\b(yes|yeah|yep|no|not|first day|new)\b/.test(value),
    required: value => /\b(yes|yeah|yep|no|not)\b/.test(value),
  },
  3: {
    relevant: value => /\b(from|come from|hometown|village|city|country|bangladesh)\b/.test(value) || value.split(' ').length <= 3,
    required: value => /\b(from|hometown|bangladesh|dhaka|rangpur|chittagong|chattogram|sylhet|rajshahi|khulna|barishal|mymensingh|comilla|cumilla)\b/.test(value) || value.split(' ').length <= 3,
  },
  4: {
    relevant: value => /\b(live|living|stay|staying|now|dhaka|mirpur|uttara)\b/.test(value) || value.split(' ').length <= 3,
    required: value => /\b(live|living|stay|staying|dhaka|mirpur|uttara|rangpur|chittagong|chattogram|sylhet|rajshahi|khulna)\b/.test(value) || value.split(' ').length <= 3,
  },
  5: {
    relevant: value => /\b(student|study|studying|work|working|job|teacher|employee|business|freelancer)\b/.test(value),
    required: value => /\b(student|study|studying|work|working|job|teacher|employee|freelancer)\b/.test(value),
  },
  6: {
    relevant: value => value.split(' ').length > 0,
    required: value => /\b(study|studying|subject|science|english|arabic|business|engineering|medicine|technology|work|working|teacher|developer|designer|company|job)\b/.test(value) || value.split(' ').length <= 4,
  },
  7: {
    relevant: value => /\b(what|where|when|why|how|who|which|are|do|did|can|could|would|is)\b/.test(value),
    required: value => /\b(what|where|when|why|how|who|which|are you|do you|did you|can you|is your)\b/.test(value),
  },
};

const ENGLISH_SELF_INTRODUCTION_SIGNALS = {
  1: {
    relevant: value => /\b(well|good|fine|great|thanks|thank|hello|hi|doing)\b/.test(value) || value.split(' ').length <= 3,
    required: value => /\b(well|good|fine|great|thanks|thank|doing)\b/.test(value) || value.split(' ').length <= 3,
  },
  2: {
    relevant: value => /\b(name|called|my|i'm|i am)\b/.test(value),
    required: value => /\b(name|called|i'm|i am|my name)\b/.test(value),
  },
  3: {
    relevant: value => /\b(from|hometown|bangladesh|rangpur|dhaka|city|country|live)\b/.test(value),
    required: value => /\b(from|hometown|bangladesh|rangpur|dhaka|city|country)\b/.test(value),
  },
  4: {
    relevant: value => /\b(live|living|stay|now|dhaka|rangpur|city|area)\b/.test(value),
    required: value => /\b(live|living|stay|now|dhaka|rangpur|area|city)\b/.test(value),
  },
  5: {
    relevant: value => /\b(student|study|work|job|university|college|employee|freelancer|business)\b/.test(value),
    required: value => /\b(student|study|work|job|university|college|employee|freelancer|business)\b/.test(value),
  },
  6: {
    relevant: value => /\b(study|study|subject|business|computer|science|engineering|administration|work|job)\b/.test(value),
    required: value => /\b(study|subject|business|computer|science|engineering|administration|work|job)\b/.test(value),
  },
  7: {
    relevant: value => /\b(enjoy|hobby|free|time|read|watch|music|movie|sport|game|travel)\b/.test(value),
    required: value => /\b(enjoy|hobby|free|time|read|watch|music|movie|sport|game|travel)\b/.test(value),
  },
  8: {
    relevant: value => /\b(learn|english|reason|because|want|improve|career|study|work)\b/.test(value),
    required: value => /\b(english|learn|reason|because|want|improve|career|study|work)\b/.test(value),
  },
  9: {
    relevant: value => /\b(goal|future|want|plan|dream|career|travel)\b/.test(value),
    required: value => /\b(goal|future|want|plan|dream|career|travel)\b/.test(value),
  },
  10: {
    relevant: value => /\b(name|from|live|student|study|work|goal|future|english|hometown)\b/.test(value),
    required: value => /\b(name|from|live|student|study|work|goal|future|english|hometown)\b/.test(value),
  },
};

function scoreEnglishFirstMeeting(question, transcript, recognitionConfidence) {
  const answer = normalizeSpeakingText(transcript, 'english');
  const words = answer.split(' ').filter(Boolean);
  const signals = ENGLISH_MEETING_SIGNALS[Number(question.conversationStep)] ?? ENGLISH_MEETING_SIGNALS[6];
  const relevant = signals.relevant(answer);
  const required = signals.required(answer);
  const understandable = words.length > 0 && relevant;
  const completeSentence = words.length >= 3 && (
    /\b(i|im|my|this|it|yes|no|what|where|how|are|do|can)\b/.test(answer)
  );
  const grammar = completeSentence && !/\bi from\b|\bi live (at|in the) dhaka\b|\bi am study\b/.test(answer);
  const extraDetail = words.length >= 7 || /\b(because|with|and|but|also|too|excited)\b/.test(answer);
  const natural = words.length >= 4 || (Number(question.conversationStep) === 7 && required);

  const rubricMarks = (relevant ? 3 : 0)
    + (required ? 2 : 0)
    + (understandable ? 2 : 0)
    + (grammar ? 1 : 0)
    + (extraDetail ? 1 : 0)
    + (natural ? 1 : 0);
  const marks = Number(question.conversationStep) === 7
    ? rubricMarks
    : words.length <= 2
      ? Math.min(rubricMarks, 6)
      : !extraDetail && words.length <= 6
        ? Math.min(rubricMarks, 8)
        : rubricMarks;
  const confidence = Number(recognitionConfidence);
  const hasConfidence = Number.isFinite(confidence) && confidence > 0 && confidence <= 1;

  return {
    questionId: question.id,
    transcript: transcript.trim(),
    marks,
    maxMarks: 10,
    matchedKeywords: required ? ['meaning understood'] : [],
    missingKeywords: required ? [] : ['answer the question clearly'],
    recognitionConfidence: hasConfidence ? Math.round(confidence * 100) : null,
    feedback: marks >= 9
      ? 'Excellent—clear, natural, and easy to understand.'
      : marks >= 7
        ? 'Good answer. Rafi understood you and can continue naturally.'
        : marks >= 5
          ? 'Your meaning is understandable. A fuller sentence will make it stronger.'
          : 'Rafi could not clearly understand that answer. Try answering the question directly.',
  };
}

function scoreEnglishSelfIntroduction(question, transcript, recognitionConfidence) {
  const answer = normalizeSpeakingText(transcript, 'english');
  const words = answer.split(' ').filter(Boolean);
  const signals = ENGLISH_SELF_INTRODUCTION_SIGNALS[Number(question.conversationStep)] ?? ENGLISH_SELF_INTRODUCTION_SIGNALS[10];
  const relevant = signals.relevant(answer);
  const required = signals.required(answer);
  const understandable = words.length > 0 && relevant;
  const completeSentence = words.length >= 3 || /\b(i|my|am|is|live|study|work|from|name|goal|english)\b/.test(answer);
  const expanded = words.length >= 7 || /\b(because|and|also|but|with|like|enjoy|want|goal|future)\b/.test(answer);
  const natural = words.length >= 4 || (Number(question.conversationStep) === 10 && required);
  const introReady = Number(question.conversationStep) === 10
    ? required && expanded && completeSentence
    : relevant && required;

  const rubricMarks = (relevant ? 2 : 0)
    + (required ? 2 : 0)
    + (understandable ? 2 : 0)
    + (completeSentence ? 1 : 0)
    + (expanded ? 1 : 0)
    + (natural ? 1 : 0)
    + (introReady ? 1 : 0);
  const marks = Math.min(10, rubricMarks);
  const confidence = Number(recognitionConfidence);
  const hasConfidence = Number.isFinite(confidence) && confidence > 0 && confidence <= 1;

  return {
    questionId: question.id,
    transcript: transcript.trim(),
    marks,
    maxMarks: 10,
    matchedKeywords: required ? ['meaning understood'] : [],
    missingKeywords: required ? [] : ['answer the question clearly'],
    recognitionConfidence: hasConfidence ? Math.round(confidence * 100) : null,
    feedback: marks >= 9
      ? 'Excellent—your answer was clear, complete, and easy to follow.'
      : marks >= 7
        ? 'Good answer. You gave useful details and stayed on topic.'
        : marks >= 5
          ? 'Your meaning is understandable. Add one more detail or reason to strengthen it.'
          : 'Try answering the question more directly and include a little more detail.',
  };
}

export function scoreSpeakingTranscript(question, transcript, { recognitionConfidence } = {}) {
  if (question.scoringStrategy === 'english_first_meeting') {
    return scoreEnglishFirstMeeting(question, transcript, recognitionConfidence);
  }
  if (question.scoringStrategy === 'english_self_introduction') {
    return scoreEnglishSelfIntroduction(question, transcript, recognitionConfidence);
  }

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

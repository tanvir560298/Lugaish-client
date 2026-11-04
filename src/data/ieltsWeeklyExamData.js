// src/data/ieltsWeeklyExamData.js
// 60-Day IELTS Writing Challenge — Weekly Mastery Assessment System
// Reusable Exam Engine & Week 1 Mastery Exam Specification

export const DEFAULT_EXAM_SETTINGS = {
  timeLimitMinutes: 40,
  passingScorePercent: 70, // 70% threshold (35 out of 50 total marks)
  objectivePassingPercent: 70, // 21 out of 30 objective marks
  maxRetakes: 5,
  autosaveKeyPrefix: 'lugaish_ielts_exam_draft',
  resultsKeyPrefix: 'lugaish_ielts_exam_results'
};

export const WEEK_1_EXAM_DATA = {
  day: 8,
  examId: 'ielts-writing-week-1-exam',
  weekNumber: 1,
  title: 'Week 1 Mastery Exam',
  subtitle: 'Vocabulary, Grammar & Writing Mastery Assessment',
  badge: 'Official Weekly Assessment',
  isExam: true,
  timeMinutes: 40,
  totalMarks: 50,
  passingThreshold: 0.7, // 70% (35/50)
  targetBand: 'Foundation to Band 6.5+',

  instructions: {
    overview: 'This comprehensive exam assesses your mastery of all 21 academic vocabulary words, core sentence structures, parts of speech, be-verbs, articles, countability rules, Present Simple, and Subject-Verb Agreement taught during Days 1 to 7.',
    sectionsSummary: [
      { name: 'Section A: Vocabulary MCQ', questions: 10, marks: 10, timeEstimate: '8 mins' },
      { name: 'Section B: Fill in the Blanks', questions: 10, marks: 10, timeEstimate: '8 mins' },
      { name: 'Section C: Grammar Correction', questions: 5, marks: 10, timeEstimate: '8 mins' },
      { name: 'Section D: Sentence Writing', questions: 5, marks: 10, timeEstimate: '8 mins' },
      { name: 'Section E: Paragraph Writing', questions: 1, marks: 10, timeEstimate: '8 mins' }
    ],
    rules: [
      'Total time allowed: 40 minutes.',
      'Total marks: 50. Passing mark: 35/50 (70%).',
      'Sections A, B, and C (30 marks) are graded automatically upon submission.',
      'Sections D and E (20 marks) undergo instant rubric-based analysis and are marked as provisional pending teacher review.',
      'Your work is continuously auto-saved. You can review and modify your answers until you click "Submit Exam".'
    ]
  },

  sections: {
    // =======================================================================
    // SECTION A: VOCABULARY MCQ (10 Questions, 10 Marks)
    // =======================================================================
    sectionA: {
      title: 'Section A: Vocabulary Multiple Choice',
      instructions: 'Select the option that most accurately defines or completes the sentence using the vocabulary taught in Days 1–7. (1 mark each)',
      totalMarks: 10,
      questions: [
        {
          id: 'sA-q1',
          daySource: 1,
          targetWord: 'Facilitate',
          question: 'Which academic verb means "to make an action, process, or development much easier to achieve"?',
          options: ['Dismantle', 'Facilitate', 'Postpone', 'Complicate'],
          correctIndex: 1,
          explanation: '"Facilitate" (সহজতর করা) means to make a process easier. Example: "Modern digital tools facilitate interactive collaboration between students and teachers."'
        },
        {
          id: 'sA-q2',
          daySource: 2,
          targetWord: 'Indispensable',
          question: 'Complete the sentence with the most precise academic adjective: "A reliable dictionary and consistent reading are _______ tools for self-directed learners."',
          options: ['negligible', 'indispensable', 'temporary', 'dispensable'],
          correctIndex: 1,
          explanation: '"Indispensable" (অপরিহার্য / যার বিকল্প নেই) means absolutely essential and too important to be without.'
        },
        {
          id: 'sA-q3',
          daySource: 2,
          targetWord: 'Crucial',
          question: 'What is the closest synonym for the academic adjective "crucial" as used in IELTS arguments?',
          options: ['Minor', 'Vital / Decisive', 'Optional', 'Superficial'],
          correctIndex: 1,
          explanation: '"Crucial" (অত্যন্ত গুরুত্বপূর্ণ / নির্ণায়ক) means decisive or critical for the success of something.'
        },
        {
          id: 'sA-q4',
          daySource: 3,
          targetWord: 'Renowned',
          question: 'Oxford University is globally _______ for its research excellence in medicine and the humanities.',
          options: ['renowned', 'anonymous', 'ordinary', 'isolated'],
          correctIndex: 0,
          explanation: '"Renowned" (আন্তর্জাতিকভাবে সুখ্যাত) means widely known, celebrated, and admired for high quality.'
        },
        {
          id: 'sA-q5',
          daySource: 3,
          targetWord: 'Prominent',
          question: 'Several _______ scholars participated in the international climate policy conference.',
          options: ['prominent', 'passive', 'fragile', 'hasty'],
          correctIndex: 0,
          explanation: '"Prominent" (বিশিষ্ট / প্রভাবশালী) describes individuals or institutions that are notable and influential.'
        },
        {
          id: 'sA-q6',
          daySource: 4,
          targetWord: 'Ecosystem',
          question: 'Marine biologists emphasize that chemical pollution severely disrupts the balance of the coastal _______.',
          options: ['equipment', 'ecosystem', 'furniture', 'luggage'],
          correctIndex: 1,
          explanation: 'An "ecosystem" (বাস্তুতন্ত্র) refers to all plants and living creatures in an area considered in relation to their environment.'
        },
        {
          id: 'sA-q7',
          daySource: 5,
          targetWord: 'Obstacle',
          question: 'Which countable noun refers to "a barrier or challenge that blocks progress or prevents an outcome"?',
          options: ['Obstacle', 'Information', 'Advice', 'Traffic'],
          correctIndex: 0,
          explanation: '"Obstacle" (প্রতিবন্ধকতা / পথরোধকারী বাধা) is a countable noun meaning something that hinders advancement.'
        },
        {
          id: 'sA-q8',
          daySource: 5,
          targetWord: 'Dilemma',
          question: 'Government policymakers confront an ethical _______ when balancing industrial expansion against forest preservation.',
          options: ['dilemma', 'furniture', 'homework', 'advice'],
          correctIndex: 0,
          explanation: 'A "dilemma" (উভয়সংকট) is a challenging situation where a difficult choice must be made between two alternatives.'
        },
        {
          id: 'sA-q9',
          daySource: 6,
          targetWord: 'Allocate',
          question: 'In the IELTS Writing exam, candidates are strongly advised to _______ at least 40 minutes for Task 2.',
          options: ['consume', 'allocate', 'connect', 'problem'],
          correctIndex: 1,
          explanation: '"Allocate" (বরাদ্দ করা) means to designate resources, time, or funds for a specific academic purpose.'
        },
        {
          id: 'sA-q10',
          daySource: 7,
          targetWord: 'Synthesize',
          question: 'In high-scoring academic essays, candidates must _______ diverse ideas into a unified conclusion.',
          options: ['separate', 'synthesize', 'neglect', 'distort'],
          correctIndex: 1,
          explanation: '"Synthesize" (সমন্বয় করা) means to combine a range of different ideas, facts, or findings into a coherent whole.'
        }
      ]
    },

    // =======================================================================
    // SECTION B: FILL IN THE BLANKS (10 Questions, 10 Marks)
    // =======================================================================
    sectionB: {
      title: 'Section B: Contextual Fill in the Blanks',
      instructions: 'Fill in each blank with the correct learned vocabulary word in its proper grammatical form. (1 mark each)',
      totalMarks: 10,
      questions: [
        {
          id: 'sB-q1',
          daySource: 1,
          targetWord: 'Improve',
          sentence: 'Diligent daily study consistently ________ (improve) a student\'s sentence fluency and confidence.',
          acceptedAnswers: ['improves', 'improve'],
          hint: 'Subject "study" is singular. Present Simple takes -s.',
          explanation: 'With singular subject "study", the Present Simple verb form is "improves".'
        },
        {
          id: 'sB-q2',
          daySource: 1,
          targetWord: 'Require',
          sentence: 'Rigorous academic writing ________ (require) disciplined paragraph planning and lexical precision.',
          acceptedAnswers: ['requires', 'require'],
          hint: 'Gerund "writing" is singular uncountable.',
          explanation: 'The gerund "writing" acts as a singular subject, taking "requires".'
        },
        {
          id: 'sB-q3',
          daySource: 2,
          targetWord: 'Useful',
          sentence: 'Maintaining an organized vocabulary journal is an exceptionally ________ (useful) strategy for revision.',
          acceptedAnswers: ['useful'],
          hint: 'Adjective form describing the noun "strategy".',
          explanation: '"Useful" (দরকারী / উপকারী) is an attributive adjective modifying "strategy".'
        },
        {
          id: 'sB-q4',
          daySource: 3,
          targetWord: 'Famous',
          sentence: 'William Shakespeare is a ________ (famous) English author whose plays are studied across the globe.',
          acceptedAnswers: ['famous'],
          hint: 'Common adjective meaning recognized by many.',
          explanation: '"Famous" (বিখ্যাত) describes a widely celebrated individual.'
        },
        {
          id: 'sB-q5',
          daySource: 4,
          targetWord: 'Environment',
          sentence: 'Establishing a quiet study ________ (environment) enables learners to concentrate on complex grammar.',
          acceptedAnswers: ['environment'],
          hint: 'Singular noun referring to surroundings.',
          explanation: '"Environment" (পরিবেশ) is a noun referring to physical or psychological surroundings.'
        },
        {
          id: 'sB-q6',
          daySource: 4,
          targetWord: 'Surroundings',
          sentence: 'Students feel revitalized when their campus ________ (surroundings) contain lush natural greenery.',
          acceptedAnswers: ['surroundings', 'surrounding'],
          hint: 'Plural noun for the physical area around you.',
          explanation: '"Surroundings" (পারিপার্শ্বিক অবস্থা) is a plural noun taking plural agreement ("contain").'
        },
        {
          id: 'sB-q7',
          daySource: 5,
          targetWord: 'Problem',
          sentence: 'Excessive anxiety before timed examinations is a frequent ________ (problem) among beginner candidates.',
          acceptedAnswers: ['problem'],
          hint: 'Countable singular noun preceded by "a".',
          explanation: '"Problem" (সমস্যা) is a singular countable noun following "a frequent".'
        },
        {
          id: 'sB-q8',
          daySource: 6,
          targetWord: 'Consume',
          sentence: 'Modern data centers ________ (consume) substantial quantities of electrical energy every month.',
          acceptedAnswers: ['consume', 'consumes'],
          hint: 'Plural subject "centers" takes base verb.',
          explanation: 'The plural subject "data centers" takes the base verb "consume".'
        },
        {
          id: 'sB-q9',
          daySource: 6,
          targetWord: 'Prioritize',
          sentence: 'Experienced instructors urge candidates to ________ (prioritize) grammatical accuracy before writing speed.',
          acceptedAnswers: ['prioritize', 'prioritise'],
          hint: 'Infinitive base form after "to".',
          explanation: 'After the infinitive particle "to", use the base form "prioritize" (or UK "prioritise").'
        },
        {
          id: 'sB-q10',
          daySource: 7,
          targetWord: 'Correlate',
          sentence: 'Scientific studies prove that frequent writing exercises closely ________ (correlate) with higher band scores.',
          acceptedAnswers: ['correlate', 'correlates'],
          hint: 'Plural subject "exercises" takes base verb.',
          explanation: 'Plural subject "writing exercises" takes the base plural verb "correlate".'
        }
      ]
    },

    // =======================================================================
    // SECTION C: GRAMMAR CORRECTION (5 Questions, 10 Marks - 2 marks each)
    // =======================================================================
    sectionC: {
      title: 'Section C: Grammar Correction & Analysis',
      instructions: 'Each sentence contains a major grammatical error taught during Days 1–7. Identify and type the corrected sentence. (2 marks each)',
      totalMarks: 10,
      questions: [
        {
          id: 'sC-q1',
          daySource: 1,
          topic: 'Sentence Fragment (Day 1)',
          incorrectSentence: 'Because the university library was closed during the weekend.',
          prompt: 'Rewrite this sentence fragment so that it forms a grammatically complete sentence.',
          modelAnswer: 'The university library was closed during the weekend.',
          alternativeModel: 'Because the university library was closed during the weekend, students studied at home.',
          keyRule: 'A subordinate clause beginning with "Because" cannot stand alone without an independent main clause.',
          acceptedKeywords: ['library was closed', 'students studied', 'closed during the weekend']
        },
        {
          id: 'sC-q2',
          daySource: 3,
          topic: 'Be-Verb Misuse (Day 3)',
          incorrectSentence: 'Many international students are agree with the revised scholarship policy.',
          prompt: 'Correct the sentence by removing the redundant auxiliary be-verb.',
          modelAnswer: 'Many international students agree with the revised scholarship policy.',
          keyRule: 'In Present Simple active sentences, do not insert "am/is/are" before active lexical verbs like "agree".',
          acceptedKeywords: ['students agree with', 'agree with the']
        },
        {
          id: 'sC-q3',
          daySource: 4,
          topic: 'Phonetic Article Rules (Day 4)',
          incorrectSentence: 'She submitted an application to an university in Australia after waiting for a hour.',
          prompt: 'Correct the two article errors based on English phonetic pronunciation rules.',
          modelAnswer: 'She submitted an application to a university in Australia after waiting for an hour.',
          keyRule: '"University" begins with a consonant glide /juː/ sound (takes "a"). "Hour" begins with a silent \'h\' /aʊ/ sound (takes "an").',
          acceptedKeywords: ['to a university', 'for an hour']
        },
        {
          id: 'sC-q4',
          daySource: 5,
          topic: 'Uncountable Noun Traps (Day 5)',
          incorrectSentence: 'The lecturer provided several useful advices and equipments for our laboratory experiment.',
          prompt: 'Correct the pluralization and quantifier errors for the uncountable nouns.',
          modelAnswer: 'The lecturer provided much useful advice and equipment for our laboratory experiment.',
          alternativeModel: 'The lecturer provided several useful pieces of advice and equipment for our laboratory experiment.',
          keyRule: '"Advice" and "equipment" are strictly uncountable nouns. They never take plural -s and cannot be preceded directly by "several".',
          acceptedKeywords: ['advice and equipment', 'pieces of advice', 'useful advice']
        },
        {
          id: 'sC-q5',
          daySource: 7,
          topic: 'Subject-Verb Agreement (Day 7)',
          incorrectSentence: 'The quality of these educational programs are recognized by international universities.',
          prompt: 'Correct the subject-verb agreement error caused by the intervening prepositional phrase.',
          modelAnswer: 'The quality of these educational programs is recognized by international universities.',
          keyRule: 'The real syntactic subject is "quality" (singular), not the prepositional noun "programs". Therefore, use "is".',
          acceptedKeywords: ['quality of these educational programs is', 'programs is recognized']
        }
      ]
    },

    // =======================================================================
    // SECTION D: SENTENCE WRITING (5 Questions, 10 Marks - 2 marks each)
    // =======================================================================
    sectionD: {
      title: 'Section D: Guided Academic Sentence Construction',
      instructions: 'Construct one grammatically complete, academic sentence for each specified target word. Each sentence must be at least 7 words long. (2 marks each)',
      totalMarks: 10,
      questions: [
        {
          id: 'sD-q1',
          daySource: 2,
          targetWord: 'Indispensable',
          pos: 'Adjective',
          prompt: 'Write one grammatically complete sentence using "indispensable" to describe an essential educational tool, study habit, or language skill.',
          minimumWords: 7,
          modelExample: 'Disciplined time management is indispensable for candidates aiming for high IELTS scores.'
        },
        {
          id: 'sD-q2',
          daySource: 1,
          targetWord: 'Facilitate',
          pos: 'Verb',
          prompt: 'Write one grammatically complete sentence using "facilitate" (or "facilitates") describing how teachers, computers, or libraries help students learn.',
          minimumWords: 7,
          modelExample: 'Modern online portals facilitate continuous interaction between teachers and remote students.'
        },
        {
          id: 'sD-q3',
          daySource: 5,
          targetWord: 'Obstacle',
          pos: 'Noun (Countable)',
          prompt: 'Write one grammatically complete sentence using "obstacle" (or "obstacles") discussing a difficulty students encounter in academic life.',
          minimumWords: 7,
          modelExample: 'Financial constraints remain a major obstacle for talented students pursuing university degrees.'
        },
        {
          id: 'sD-q4',
          daySource: 6,
          targetWord: 'Allocate',
          pos: 'Verb',
          prompt: 'Write one grammatically complete sentence using "allocate" (or "allocates") discussing how someone should distribute study time, money, or energy.',
          minimumWords: 7,
          modelExample: 'Dedicated students allocate at least two hours daily to master English sentence patterns.'
        },
        {
          id: 'sD-q5',
          daySource: 7,
          targetWord: 'Correlate',
          pos: 'Verb',
          prompt: 'Write one grammatically complete sentence using "correlate" (or "correlates") discussing the link between practice/effort and academic success.',
          minimumWords: 7,
          modelExample: 'Extensive reading hours strongly correlate with superior lexical acquisition and writing fluency.'
        }
      ]
    },

    // =======================================================================
    // SECTION E: PARAGRAPH WRITING (1 Task, 10 Marks)
    // =======================================================================
    sectionE: {
      title: 'Section E: Integrative Paragraph Writing',
      instructions: 'Write a cohesive academic paragraph of 70–100 words answering the prompt below. You must naturally integrate at least five (5) learned vocabulary words from Week 1. (10 marks)',
      totalMarks: 10,
      task: {
        id: 'sE-task1',
        topic: 'How Can Daily Study Habits Help Students Succeed in Academic Life?',
        targetLength: '70–100 words',
        minWords: 65,
        maxWords: 125,
        targetVocabularyPool: [
          'improve', 'require', 'facilitate', 'useful', 'crucial', 'indispensable',
          'famous', 'prominent', 'renowned', 'environment', 'surroundings', 'ecosystem',
          'problem', 'obstacle', 'dilemma', 'consume', 'allocate', 'prioritize',
          'connect', 'correlate', 'synthesize'
        ],
        requiredWordsCount: 5,
        rubric: [
          { criterion: 'Grammatical Range & Accuracy (GRA)', maxMarks: 3, description: 'Subject-Verb agreement, correct Present Simple verb forms, correct articles, and zero fragments.' },
          { criterion: 'Lexical Resource & Vocab Integration (LR)', maxMarks: 3, description: 'Natural and accurate usage of at least five (5) target vocabulary words from Week 1.' },
          { criterion: 'Coherence & Cohesion (CC)', maxMarks: 2, description: 'Smooth logical progression from topic sentence to supporting examples and conclusion.' },
          { criterion: 'Task Achievement & Word Count (TR)', maxMarks: 2, description: 'Full response to the prompt within the 70–100 word target.' }
        ],
        modelAnswer: 'Developing consistent daily study habits is crucial for long-term academic excellence. When learners allocate dedicated time each morning, they significantly improve their sentence clarity and reading comprehension. A quiet study environment is indispensable because it helps students prioritize deep concentration over digital distractions. Furthermore, regular practice enables students to overcome any learning obstacle and connect complex theories with practical examples. Ultimately, disciplined study routines correlate directly with superior exam achievements and future intellectual growth.'
      }
    }
  }
};

/**
 * Dynamically extract all learned vocabulary from Days 1 to 7 without duplicate hardcoding.
 * @param {number} weekNumber - Week number (default 1)
 * @param {Array} daysArray - The array of day objects
 * @returns {Array} Array of 21 unique word objects with metadata
 */
export function getWeekVocabulary(weekNumber = 1, daysArray = []) {
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = weekNumber * 7;

  const vocabularyList = [];
  const relevantDays = daysArray.filter(d => d.day >= startDay && d.day <= endDay);

  relevantDays.forEach(dayObj => {
    if (Array.isArray(dayObj.dailyThreeWords)) {
      dayObj.dailyThreeWords.forEach(w => {
        vocabularyList.push({
          ...w,
          dayNumber: dayObj.day,
          dayTitle: dayObj.title,
          dayBadge: dayObj.badge
        });
      });
    }
  });

  return vocabularyList;
}

/**
 * Helper to analyze a student paragraph for target vocabulary words.
 * @param {string} text - The student paragraph
 * @param {Array<string>} targetPool - Array of target vocabulary stems
 * @returns {object} Analysis with count, found words list, and word count
 */
export function analyzeWritingResponse(text = '', targetPool = []) {
  if (!text || typeof text !== 'string') {
    return { wordCount: 0, foundWords: [], targetCount: 0 };
  }

  const cleanText = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const foundWords = [];
  targetPool.forEach(target => {
    const stem = target.toLowerCase();
    // match word boundary or inflectional forms (e.g. improve, improves, improved, improving)
    const regex = new RegExp(`\\b${stem}(s|es|d|ed|ing|tion|tions)?\\b`, 'i');
    if (regex.test(cleanText)) {
      if (!foundWords.includes(target)) {
        foundWords.push(target);
      }
    }
  });

  return {
    wordCount,
    foundWords,
    targetCount: foundWords.length
  };
}

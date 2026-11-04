// src/data/ieltsWritingWeek1Data.js
// 60-Day IELTS Writing Challenge — Week 1: Sentence Building & Basic Grammar
// Developed for Lugaish Language Learning Platform

import { WEEK_1_EXAM_DATA, getWeekVocabulary as getWeeklyVocabularyHelper } from './ieltsWeeklyExamData.js';

export const IELTS_WRITING_WEEK_1_INFO = {
  courseId: 'ielts-writing-foundation',
  title: '60-Day IELTS Writing Challenge',
  weekNumber: 1,
  weekTitle: 'Week 1: Sentence Building & Basic Grammar',
  targetBand: 'Foundation to Band 6.5+',
  instructor: 'Tanvir Ahmad',
  totalDays: 8, // Days 1-7 Instructional & Revision + Day 8 Weekly Mastery Exam
  description: 'Master English sentence architecture, parts of speech, be-verbs, articles, plurals, Present Simple, and Subject-Verb Agreement, concluding with the comprehensive Week 1 Mastery Exam.'
};

export const IELTS_WRITING_WEEK_1_DAYS = [
  // =========================================================================
  // DAY 1: WHAT IS A SENTENCE?
  // =========================================================================
  {
    day: 1,
    title: 'What Is a Sentence?',
    subtitle: 'Subject, Verb, Object & Core Sentence Patterns',
    badge: 'Sentence Architecture',
    timeMinutes: 20,
    outcomes: [
      'Understand what constitutes a grammatically complete English sentence.',
      'Identify Subject, Verb, and Object in complex academic statements.',
      'Master the basic S-V-O word order without translating Bengali word-order verbatim.',
      'Avoid sentence fragments and incorrect auxiliary verb insertions (e.g., "I am study").',
      'Construct at least 5 correct sentences independently about personal life and education.'
    ],
    grammarTheory: {
      banglaExplanation: `
একটি পূর্ণাঙ্গ ইংরেজি বাক্য (Sentence) হতে হলে দুটি মৌলিক উপাদান থাকা অপরিহার্য:
১. **Subject (কর্তা):** বাক্যটি কাকে বা কী নিয়ে কথা বলছে।
২. **Verb (ক্রিয়া):** Subject কী করছে বা Subject-এর অবস্থা কী।

💡 **মনে রাখুন — সব বাক্যে Object থাকা বাধ্যতামূলক নয়:**
অনেকে মনে করেন প্রতিটি বাক্যে Object থাকতেই হবে। এটি ভুল ধারণা!
• **Subject + Verb (অকর্মক ক্রিয়া):** *"Birds fly."* বা *"Children sleep."* — এখানে কোনো Object ছাড়াই বাক্যটি ব্যাকরণগতভাবে সম্পূর্ণ।
• **Subject + Verb + Complement (অবস্থা/পরিচয়):** *"She is a doctor."* বা *"Education is vital."* — এখানে 'doctor' বা 'vital' হলো Subject Complement।
• **Subject + Verb + Object (সকর্মক ক্রিয়া):** যখন কোনো কাজের লক্ষ্য বা গ্রহীতা থাকে, তখন ইংরেজি ভাষার নির্দিষ্ট নিয়ম হলো: **Subject + Verb + Object (S + V + O)**।
যেমন: *"Students learn English."* — কখনোই বাংলা পদক্রম অনুযায়ী *"Students English learn"* বলা যাবে না।

⚠️ **Sentence Fragment (অসম্পূর্ণ বাক্য) চেনার উপায়:**
বাংলায় অনেক সময় ছোট খণ্ডবাক্য বলে ভাব প্রকাশ করা যায়, কিন্তু লিখিত ইংরেজিতে Finite Verb ছাড়া কোনো বাক্য পূর্ণাঙ্গ নয়।
• *"In the morning with my friends"* — বাক্য নয়, কারণ কোনো Subject ও Finite Verb নেই (এটি কেবল একটি Phrase)।
• *"The university student who lives in Dhaka"* — বাক্য নয়, কারণ ছাত্রটি কী করে বা তার অবস্থা কী, তা বলা হয়নি (Fragment)।
• *"The student studies English."* — একটি **সঠিক ও পূর্ণাঙ্গ বাক্য**।
      `,
      formulas: [
        { name: 'Pattern 1 (Intransitive S-V)', structure: 'Subject (S) + Verb (V)', example: 'Children (S) + sleep (V).' },
        { name: 'Pattern 2 (Linking S-V-C)', structure: 'Subject (S) + Verb (V) + Complement (C)', example: 'Education (S) + is (V) + vital (Complement).' },
        { name: 'Pattern 3 (Transitive S-V-O)', structure: 'Subject (S) + Verb (V) + Object (O)', example: 'Students (S) + learn (V) + English (O).' },
        { name: 'Pattern 4 (S-V-A)', structure: 'Subject (S) + Verb (V) + Adverbial/Place', example: 'Many people (S) + live (V) + in large cities (Adverbial).' }
      ],
      ieltsImpact: 'IELTS Writing Criteria: Grammatical Range & Accuracy (GRA)-তে ভালো করতে হলে Sentence Fragment ও ভুল পদক্রম সম্পূর্ণ পরিহার করতে হবে। প্রতিটি বাক্যে সুস্পষ্ট Subject ও Finite Verb-এর সমন্বয়ে গঠিত সঠিক বাক্য কাঠামোই রচনার ভিত্তি।'
    },
    workedExamples: [
      { id: 1, s: 'I', v: 'study', o: 'English literature', meaning: 'আমি ইংরেজি সাহিত্য নিয়ে পড়াশোনা করি।' },
      { id: 2, s: 'The government', v: 'builds', o: 'modern schools', meaning: 'সরকার আধুনিক বিদ্যালয় নির্মাণ করে।' },
      { id: 3, s: 'Computers', v: 'save', o: 'valuable time', meaning: 'কম্পিউটার মূল্যবান সময় বাঁচায়।' },
      { id: 4, s: 'Education', v: 'changes', o: 'human society', meaning: 'শিক্ষা মানবসমাজকে পরিবর্তন করে।' },
      { id: 5, s: 'Teachers', v: 'guide', o: 'young learners', meaning: 'শিক্ষকরা তরুণ শিক্ষার্থীদের দিকনির্দেশনা দেন।' },
      { id: 6, s: 'Fresh air', v: 'improves', o: 'mental health', meaning: 'বিশুদ্ধ বাতাস মানসিক স্বাস্থ্যের উন্নতি ঘটায়।' },
      { id: 7, s: 'Active children', v: 'play', o: 'outdoor games', meaning: 'সক্রিয় শিশুরা বাইরের খেলাধুলা করে।' },
      { id: 8, s: 'Universities', v: 'offer', o: 'research opportunities', meaning: 'বিশ্ববিদ্যালয়গুলো গবেষণার সুযোগ প্রদান করে।' }
    ],
    commonTraps: [
      {
        incorrect: 'I English study at night.',
        correct: 'I study English at night.',
        reason: 'বাংলা নিয়মে Verb শেষে দেওয়া যাবে না। Action Verb সর্বদা Object-এর পূর্বে বসবে।'
      },
      {
        incorrect: 'I am study English every day.',
        correct: 'I study English every day.',
        reason: 'Present Simple Active বাক্যে মূল Verb (study) সক্রিয় থাকলে অযথা "am" বসবে না।'
      },
      {
        incorrect: 'Because technology changes education.',
        correct: 'Technology changes education.',
        reason: '"Because" যুক্ত ক্লজের পরে আরেকটি স্বাধীন বাক্য না থাকলে তা Sentence Fragment বা অসম্পূর্ণ বাক্য।'
      },
      {
        incorrect: 'My brother football plays very well.',
        correct: 'My brother plays football very well.',
        reason: 'Verb (plays) অবশ্যই Object (football)-এর আগে বসবে।'
      }
    ],
    practiceProblems: [
      {
        id: 'd1-p1',
        type: 'mcq',
        question: 'Identify the Subject in this sentence: "The new computer system improves student productivity."',
        options: ['improves', 'student productivity', 'The new computer system', 'productivity'],
        correctIndex: 2,
        explanation: 'বাক্যটি কাকে নিয়ে? "The new computer system" হলো Subject যা পুরো কাজের চালিকাশক্তি।'
      },
      {
        id: 'd1-p2',
        type: 'mcq',
        question: 'Which of the following is a COMPLETE sentence (not a fragment)?',
        options: [
          'Because learning English is very important.',
          'The young student living in the dormitory.',
          'Reading books develops analytical skills.',
          'Working in a large multinational company.'
        ],
        correctIndex: 2,
        explanation: '"Reading books develops analytical skills" বাক্যে স্পষ্ট Subject (Reading books) এবং Finite Verb (develops) আছে।'
      },
      {
        id: 'd1-p3',
        type: 'mcq',
        question: 'What is the correct word order?',
        options: [
          'The teacher grammar explains clearly.',
          'The teacher explains grammar clearly.',
          'Grammar the teacher explains clearly.',
          'The teacher clearly grammar explains.'
        ],
        correctIndex: 1,
        explanation: 'Subject (The teacher) + Verb (explains) + Object (grammar) + Adverb (clearly).'
      },
      {
        id: 'd1-p4',
        type: 'rearrange',
        question: 'Rearrange into a correct English sentence: [knowledge / books / provide / valuable]',
        correctAnswer: 'Books provide valuable knowledge.',
        acceptableAnswers: ['Books provide valuable knowledge.', 'Valuable books provide knowledge.'],
        explanation: 'Subject: Books, Verb: provide, Object: valuable knowledge.'
      },
      {
        id: 'd1-p5',
        type: 'rearrange',
        question: 'Rearrange into a correct English sentence: [the student / essay / an / wrote / academic]',
        correctAnswer: 'The student wrote an academic essay.',
        explanation: 'Subject: The student, Verb: wrote, Object: an academic essay.'
      },
      {
        id: 'd1-p6',
        type: 'error_fix',
        question: 'Fix the error: "I am agree with your opinion."',
        targetWord: 'am agree',
        correctAnswer: 'I agree with your opinion.',
        explanation: '"Agree" নিজেই একটি Verb। সাধারণ Present Simple-এ "am agree" লেখা মারাত্মক ভুল।'
      },
      {
        id: 'd1-p7',
        type: 'error_fix',
        question: 'Fix the error: "She football plays with her classmates."',
        targetWord: 'football plays',
        correctAnswer: 'She plays football with her classmates.',
        explanation: 'Action verb "plays" অবশ্যই object "football"-এর আগে বসবে।'
      },
      {
        id: 'd1-p8',
        type: 'mcq',
        question: 'In the sentence "Technology connects people worldwide", what is the word "people"?',
        options: ['Subject', 'Verb', 'Object', 'Adjective'],
        correctIndex: 2,
        explanation: 'Verb (connects)-কে "কাদের যুক্ত করে?" প্রশ্ন করলে উত্তর আসে "people", তাই এটি Object।'
      },
      {
        id: 'd1-p9',
        type: 'rearrange',
        question: 'Rearrange into a correct sentence: [computers / use / daily / researchers]',
        correctAnswer: 'Researchers use computers daily.',
        explanation: 'Subject: Researchers, Verb: use, Object: computers, Adverb: daily.'
      },
      {
        id: 'd1-p10',
        type: 'error_fix',
        question: 'Fix the sentence: "The professor the lecture delivered yesterday."',
        correctAnswer: 'The professor delivered the lecture yesterday.',
        explanation: 'Verb "delivered" অবশ্যই Object "the lecture"-এর পূর্বে বসবে।'
      }
    ],
    writingChallenge: {
      prompt: 'Write 5 simple, grammatically complete sentences about yourself (your studies, your daily habits, and your language learning goals). Follow the Subject + Verb + Object structure strictly.',
      minimumWords: 35,
      checklist: [
        'Each sentence has a clear Subject and a Finite Verb.',
        'No sentence uses "am" before an action verb (e.g., no "I am live").',
        'Word order is strictly Subject + Verb + Object.',
        'Proper capitalization at the start and full stop at the end.'
      ],
      modelAnswer: 'I study computer science at a university. I read English articles every morning. My brother helps me with grammar exercises. I want to achieve Band 7 in the IELTS examination. Practice improves my writing confidence.'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Improve",
        "phonetic": "/ɪmˈpruːv/",
        "pos": "Verb",
        "banglaMeaning": "উন্নত করা / বৃদ্ধি করা",
        "englishDefinition": "To make or become better in quality, skill, or condition.",
        "ieltsSentence": "Regular practice significantly improves your sentence accuracy and IELTS writing score.",
        "contextTip": "IELTS Writing Task 2-এ উন্নয়ন বা বৃদ্ধির আলোচনায় \"increase\" বা \"improve\" সবচেয়ে নির্ভরযোগ্য ট্রানজিটিভ ভার্ব।",
        "practiceQuestion": "Complete the sentence: \"Daily reading _______ writing fluency.\"",
        "targetWord": "improves",
        "hint": "Use the 3rd person singular form (-s)."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Require",
        "phonetic": "/rɪˈkwaɪər/",
        "pos": "Verb",
        "banglaMeaning": "প্রয়োজন হওয়া / দাবি করা",
        "englishDefinition": "To need something for a particular purpose or official standard.",
        "ieltsSentence": "Academic writing requires clarity, factual support, and accurate sentence structures.",
        "contextTip": "'require' একটি উপযুক্ত প্রাতিষ্ঠানিক ও আনুষ্ঠানিক শব্দ (যেমন: 'The task requires focus')। তবে সব জায়গায় অন্ধভাবে 'need'-এর বদলে 'require' বসানো ঠিক নয়; স্বাভাবিক ও অর্থবোধক ব্যবহার বজায় রাখাই সঠিক ইংরেজির লক্ষণ।",
        "practiceQuestion": "Complete the sentence: \"Higher education _______ deep critical thinking skills.\"",
        "targetWord": "requires",
        "hint": "Use the 3rd person singular form (-s)."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Facilitate",
        "phonetic": "/fəˈsɪlɪteɪt/",
        "pos": "Verb",
        "banglaMeaning": "সহজতর করা / কোনো প্রক্রিয়াকে সুগম করা",
        "englishDefinition": "To make an action, process, or development much easier to achieve.",
        "ieltsSentence": "Modern digital classrooms facilitate personalized learning experiences for ambitious university students.",
        "contextTip": "সাধারণ \"help\"-এর জায়গায় \"facilitate\" ব্যবহার করলে পরীক্ষক আপনার উচ্চমার্গের লেক্সিক্যাল রিসোর্স লক্ষ্য করবেন।",
        "practiceQuestion": "Complete the sentence: \"Good public transportation _______ urban economic growth.\"",
        "targetWord": "facilitates",
        "hint": "Use the 3rd person singular form (-s)."
    }
],
    homework: {
      taskDescription: 'Write 5 more sentences about your family (2 sentences), your education (2 sentences), and your favorite hobby (1 sentence). Identify the Subject, Verb, and Object for each sentence.',
      newVocabulary: ['improve', 'achieve', 'require', 'support', 'develop']
    }
  },

  // =========================================================================
  // DAY 2: PARTS OF SPEECH FOR SENTENCE BUILDING
  // =========================================================================
  {
    day: 2,
    title: 'Parts of Speech — Foundation',
    subtitle: 'Nouns, Pronouns, Verbs & Adjectives in Context',
    badge: 'Word Categories',
    timeMinutes: 20,
    outcomes: [
      'Accurately identify Nouns, Pronouns, Verbs, and Adjectives in academic English.',
      'Place Adjectives correctly (before Nouns and after Linking Verbs).',
      'Distinguish tricky Noun vs Adjective pairs (e.g., importance vs important, convenience vs convenient).',
      'Use pronouns smoothly to eliminate awkward, repetitive noun usage.',
      'Write 6 descriptive sentences demonstrating correct word placement.'
    ],
    grammarTheory: {
      banglaExplanation: `
একটি সুন্দর ইংরেজি বাক্য লিখতে প্রধান ৪টি Parts of Speech সম্পর্কে গভীর ধারণা থাকা প্রয়োজন:

১. **Noun (বিশেষ্য — Naming Word):**
ব্যক্তি, বস্তু, স্থান বা ধারণার নাম। 
IELTS Writing-এ Abstract Nouns প্রচুর ব্যবহৃত হয়: *education, pollution, poverty, development, technology*। Noun সাধারণত বাক্যে Subject বা Object হিসেবে বসে।

২. **Pronoun (সর্বনাম — Noun Replacer):**
Noun-এর পুনরাবৃত্তি এড়াতে Pronoun বসে।
• *বারবার নাম বলা:* "Sara is a student. Sara studies English. Sara wants to go abroad."
• *স্বাভাবিক ইংরেজি:* "Sara is a student. **She** studies English. **She** wants to go abroad."
Subject Pronouns: *I, you, he, she, it, we, they*। Object Pronouns: *me, you, him, her, it, us, them*।

৩. **Verb (ক্রিয়া — Action or State):**
বাক্যের প্রাণ। কাজ বোঝালে Action Verb (*study, solve, analyze*), আর অস্তিত্ব/অবস্থা বোঝালে Linking Verb (*be, seem, become*)।

৪. **Adjective (নাম বিশেষণ — Describing Word):**
Noun বা Pronoun-এর দোষ, গুণ, অবস্থা বা বৈশিষ্ট্য প্রকাশ করে। Adjective-এর অবস্থান ২টি:
• **Position 1 (Noun-এর পূর্বে):** an *interesting* book, *diligent* students.
• **Position 2 (Linking Verb-এর পরে):** Education is *important*. The exam was *difficult*.
      `,
      formulas: [
        { name: 'Attributive Adjective', structure: 'Adjective + Noun', example: 'a diligent (Adj) + student (Noun)' },
        { name: 'Predicative Adjective', structure: 'Subject + Linking Verb + Adjective', example: 'Education (S) + is (V) + essential (Adj).' },
        { name: 'Pronoun Replacement', structure: 'Noun Phrase -> Subject Pronoun', example: 'The researchers -> They' }
      ],
      ieltsImpact: 'পরীক্ষক Lexical Resource ও GRA-তে লক্ষ্য করেন আপনি Noun এবং Adjective-এর সঠিক রূপটি ব্যবহার করছেন কিনা। যেমন: "This topic is importance" একটি ব্যাকরণগত ত্রুটি; গুণ বা বৈশিষ্ট্য প্রকাশে Adjective রূপ "This topic is important" ব্যবহার করতে হবে।'
    },
    workedExamples: [
      { id: 1, word: 'Education', pos: 'Noun', sentence: 'Higher education empowers young individuals.', meaning: 'উচ্চশিক্ষা তরুণদের ক্ষমতায়ন করে।' },
      { id: 2, word: 'Important', pos: 'Adjective', sentence: 'English is an important global language.', meaning: 'ইংরেজি একটি গুরুত্বপূর্ণ বৈশ্বিক ভাষা।' },
      { id: 3, word: 'They', pos: 'Pronoun', sentence: 'They conduct scientific experiments in the lab.', meaning: 'তারা ল্যাবরেটরিতে বৈজ্ঞানিক পরীক্ষা পরিচালনা করে।' },
      { id: 4, word: 'Improve', pos: 'Verb', sentence: 'Regular writing practice improves vocabulary.', meaning: 'নিয়মিত লেখার অনুশীলন শব্দভাণ্ডারের উন্নতি ঘটায়।' },
      { id: 5, word: 'Beneficial', pos: 'Adjective', sentence: 'Physical exercise is beneficial for heart health.', meaning: 'শারীরিক ব্যায়াম হৃদযন্ত্রের স্বাস্থ্যের জন্য উপকারী।' },
      { id: 6, word: 'Convenient', pos: 'Adjective', sentence: 'Public transport is convenient for commuters.', meaning: 'গণপরিবহন যাত্রীদের জন্য সুবিধাজনক।' }
    ],
    commonTraps: [
      {
        incorrect: 'She is a student good.',
        correct: 'She is a good student.',
        reason: 'ইংরেজিতে Adjective সর্বদা Noun-এর পূর্বে বসে (attributive position)।'
      },
      {
        incorrect: 'Education is very importance for life.',
        correct: 'Education is very important for life.',
        reason: 'Importance হলো Noun; Linking Verb "is"-এর পরে গুণ বোঝাতে Adjective "important" বসবে।'
      },
      {
        incorrect: 'My brother is very intelligence.',
        correct: 'My brother is very intelligent.',
        reason: 'Intelligence হলো Noun; ব্যক্তির গুণ বোঝাতে Adjective "intelligent" ব্যবহার করতে হবে।'
      },
      {
        incorrect: 'Him studies English regularly.',
        correct: 'He studies English regularly.',
        reason: 'Subject স্থানে Subject Pronoun "He" বসবে, Object Pronoun "Him" নয়।'
      }
    ],
    practiceProblems: [
      {
        id: 'd2-p1',
        type: 'mcq',
        question: 'Identify the Part of Speech of the bold word: "Technology makes human life **comfortable**."',
        options: ['Noun', 'Verb', 'Adjective', 'Pronoun'],
        correctIndex: 2,
        explanation: '"Comfortable" শব্দটি "life" (Noun)-এর অবস্থা প্রকাশ করছে, তাই এটি একটি Adjective।'
      },
      {
        id: 'd2-p2',
        type: 'mcq',
        question: 'Choose the correct word: "Metro rail is extremely ______ for urban commuters."',
        options: ['convenience', 'convenient', 'conveniently', 'conveniences'],
        correctIndex: 1,
        explanation: 'Linking Verb "is"-এর পরে Adjective রূপ "convenient" বসবে।'
      },
      {
        id: 'd2-p3',
        type: 'mcq',
        question: 'Choose the correct pronoun: "______ submitted the research paper yesterday."',
        options: ['Him', 'He', 'His', 'Them'],
        correctIndex: 1,
        explanation: 'বাক্যের Subject হিসেবে Subjective Pronoun "He" বসবে।'
      },
      {
        id: 'd2-p4',
        type: 'error_fix',
        question: 'Fix the error: "They discussed an issue serious during the meeting."',
        correctAnswer: 'They discussed a serious issue during the meeting.',
        explanation: 'Adjective "serious" অবশ্যই Noun "issue"-এর পূর্বে বসবে।'
      },
      {
        id: 'd2-p5',
        type: 'mcq',
        question: 'Which word in this sentence is a NOUN: "Diligent students achieve outstanding academic results."',
        options: ['Diligent', 'students', 'achieve', 'outstanding'],
        correctIndex: 1,
        explanation: '"students" হলো Noun (ব্যক্তিবাচক নাম)। Diligent এবং outstanding হলো Adjective।'
      },
      {
        id: 'd2-p6',
        type: 'error_fix',
        question: 'Fix the error: "This online course is of great useful for students."',
        correctAnswer: 'This online course is of great use for students.',
        explanation: '"great" (Adjective)-এর পরে Noun "use" বসবে, অথবা "This online course is very useful" লেখা যায়।'
      },
      {
        id: 'd2-p7',
        type: 'rearrange',
        question: 'Rearrange into a correct sentence: [an / completed / assignment / difficult / she]',
        correctAnswer: 'She completed a difficult assignment.',
        explanation: 'Subject: She, Verb: completed, Object: a difficult assignment (Adj + Noun).'
      },
      {
        id: 'd2-p8',
        type: 'mcq',
        question: 'Choose the correct form: "Global warming is a serious ______ for future generations."',
        options: ['threat', 'threaten', 'threatening', 'threats'],
        correctIndex: 0,
        explanation: 'Adjective "serious"-এর পরে Singular Noun "threat" বসবে।'
      },
      {
        id: 'd2-p9',
        type: 'error_fix',
        question: 'Fix the error: "He is a person very honesty."',
        correctAnswer: 'He is a very honest person.',
        explanation: 'Adjective "honest" Noun "person"-এর পূর্বে বসে।'
      },
      {
        id: 'd2-p10',
        type: 'mcq',
        question: 'Replace the bold noun phrase with a pronoun: "**The teachers and students** celebrated the victory."',
        options: ['We', 'They', 'Them', 'He'],
        correctIndex: 1,
        explanation: 'Third-person plural subject-এর জন্য সঠিক সর্বনাম হলো "They"।'
      }
    ],
    writingChallenge: {
      prompt: 'Write 6 descriptive sentences about your best friend or favorite teacher. You MUST use at least 3 distinct adjectives (e.g., patient, intelligent, inspiring, helpful, hardworking) and underline or highlight them.',
      minimumWords: 40,
      checklist: [
        'Adjectives placed directly before nouns or after be-verbs.',
        'No confusion between Noun and Adjective forms (e.g., patience vs patient).',
        'Use pronouns (he/she/they) naturally instead of repeating names.',
        'Proper punctuation throughout.'
      ],
      modelAnswer: 'My best friend is an intelligent person. He is always helpful when I face difficult math problems. We study together in the university library. He has a patient attitude toward learning. We enjoy productive academic discussions.'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Useful",
        "phonetic": "/ˈjuːsfl/",
        "pos": "Adjective",
        "banglaMeaning": "দরকারী / উপকারী",
        "englishDefinition": "Able to be used for a practical purpose or helping you to do something.",
        "ieltsSentence": "Learning basic grammar rules is useful for constructing error-free paragraphs.",
        "contextTip": "\"useful\" একটি বর্ণনামূলক Adjective যা Noun-এর গুণ প্রকাশ করে (e.g., a useful skill)।",
        "practiceQuestion": "Complete the sentence: \"Online libraries provide _______ resources for research students.\"",
        "targetWord": "useful",
        "hint": "Type the adjective form."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Crucial",
        "phonetic": "/ˈkruːʃl/",
        "pos": "Adjective",
        "banglaMeaning": "অত্যন্ত গুরুত্বপূর্ণ / নির্ণায়ক",
        "englishDefinition": "Extremely important or decisive for the success of something.",
        "ieltsSentence": "Time management is a crucial factor during the official IELTS writing examination.",
        "contextTip": "প্রবন্ধে বারবার \"important\" না লিখে ভ্যারিয়েশন হিসেবে \"crucial\" বা \"vital\" ব্যবহার করুন।",
        "practiceQuestion": "Complete the sentence: \"Early childhood education plays a _______ role in mental development.\"",
        "targetWord": "crucial",
        "hint": "Type the adjective meaning extremely important."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Indispensable",
        "phonetic": "/ˌɪndɪˈspensəbl/",
        "pos": "Adjective",
        "banglaMeaning": "অপরিহার্য / যার কোনো বিকল্প নেই",
        "englishDefinition": "Too important to be without; completely essential.",
        "ieltsSentence": "Technological tools have become indispensable assets in modern university research.",
        "contextTip": "Band 8+ লেক্সিক্যাল স্ট্যান্ডার্ডের জন্য \"essential\"-এর উচ্চমানের প্রতিশব্দ হলো \"indispensable\"।",
        "practiceQuestion": "Complete the sentence: \"Clean drinking water is an _______ human necessity.\"",
        "targetWord": "indispensable",
        "hint": "Spelling tip: in-dis-pen-sable (ends in -able)."
    }
],
    homework: {
      taskDescription: 'Write a short description of your dream career using 6 sentences. Use at least 4 adjectives and identify their corresponding nouns.',
      newVocabulary: ['essential', 'significant', 'practical', 'diligent', 'inspiring']
    }
  },

  // =========================================================================
  // DAY 3: BE VERBS (AM, IS, ARE, WAS, WERE)
  // =========================================================================
  {
    day: 3,
    title: 'Be Verbs: Am, Is, Are, Was, Were',
    subtitle: 'Stative Sentences, Negation, Questions & Avoiding IELTS Traps',
    badge: 'Stative Grammar',
    timeMinutes: 20,
    outcomes: [
      'Master the accurate use of am, is, are (Present) and was, were (Past).',
      'Construct affirmative, negative, and question forms with Be verbs.',
      'Distinguish action verbs from state verbs to eliminate the fatal "I am agree" trap.',
      'Describe identity, condition, profession, and location accurately in writing.',
      'Produce 8 varied stative sentences error-free.'
    ],
    grammarTheory: {
      banglaExplanation: `
যখন বাক্যে কোনো শারীরিক কাজ বা গতিশীল ক্রিয়া ঘটে না, বরং কারো **পরিচয় (Identity), অবস্থা (State), গুণ (Quality), অবস্থান (Location) বা অস্তিত্ব** বোঝানো হয়, তখন **Be Verb** বসে।

**বর্তমান কাল (Present Be Verbs):**
• **I $\\rightarrow$ am** (I am a university student.)
• **He / She / It / Singular Noun $\\rightarrow$ is** (Air pollution is a major problem.)
• **You / We / They / Plural Noun $\\rightarrow$ are** (Libraries are essential resources.)

**অতীত কাল (Past Be Verbs):**
• **I / He / She / It $\\rightarrow$ was** (The student was present yesterday.)
• **You / We / They $\\rightarrow$ were** (They were happy with the results.)

**৩টি মৌলিক রূপ:**
১. Positive (+): Subject + Be Verb + Complement (*She is energetic.*)
২. Negative (-): Subject + Be Verb + **not** + Complement (*The proposal is not feasible.*)
৩. Question (?): Be Verb + Subject + Complement? (*Is clean water accessible to all?*)
      `,
      formulas: [
        { name: 'Identity/Role', structure: 'Subject + Be Verb + Noun Phrase', example: 'Tanvir (S) + is (V) + an IELTS instructor (Noun Phrase).' },
        { name: 'State/Quality', structure: 'Subject + Be Verb + Adjective', example: 'Higher education (S) + is (V) + expensive (Adj).' },
        { name: 'Location', structure: 'Subject + Be Verb + Prepositional Phrase', example: 'The students (S) + are (V) + in the science lab (Prep Phrase).' }
      ],
      ieltsImpact: 'IELTS-এ পরীক্ষার্থীরা একটি মারাত্মক ভুল করে: "The table is show the data" বা "I am agree with the author"। মনে রাখবেন: সাধারণ Present Simple-এ মূল Action Verb থাকলে Be Verb কখনোই পাশাপাশি বসে না।'
    },
    workedExamples: [
      { id: 1, s: 'Air pollution', v: 'is', comp: 'a serious threat to public health', meaning: 'বায়ুদূষণ জনস্বাস্থ্যের জন্য একটি গুরুতর হুমকি।' },
      { id: 2, s: 'The candidates', v: 'are', comp: 'well-prepared for the exam', meaning: 'প্রার্থীরা পরীক্ষার জন্য সুপ্রস্তুত।' },
      { id: 3, s: 'The seminar', v: 'was', comp: 'informative and engaging', meaning: 'সেমিনারটি তথ্যবহুল ও আকর্ষণীয় ছিল।' },
      { id: 4, s: 'Modern classrooms', v: 'are not', comp: 'traditional anymore', meaning: 'আধুনিক শ্রেণিকক্ষগুলো আর সনাতন নয়।' },
      { id: 5, s: 'Was', v: 'the government policy', comp: 'successful in reducing crime?', meaning: 'সরকারি নীতিটি কি অপরাধ কমাতে সফল ছিল?' },
      { id: 6, s: 'I', v: 'am', comp: 'committed to improving my band score', meaning: 'আমি আমার ব্যান্ড স্কোরের উন্নতিতে প্রতিশ্রুতিবদ্ধ।' }
    ],
    commonTraps: [
      {
        incorrect: 'I am agree with this statement.',
        correct: 'I agree with this statement.',
        reason: '"Agree" নিজেই একটি Verb। এখানে "am" ব্যবহারের কোনো ব্যাকরণিক ভিত্তি নেই।'
      },
      {
        incorrect: 'The students was very excited.',
        correct: 'The students were very excited.',
        reason: 'Students হলো Plural Subject, তাই Past Tense-এ "were" বসবে।'
      },
      {
        incorrect: 'Why you are late for the lecture?',
        correct: 'Why are you late for the lecture?',
        reason: 'প্রশ্নবোধক বাক্যে Be Verb Subject-এর পূর্বে চলে আসে।'
      },
      {
        incorrect: 'The information are very valuable.',
        correct: 'The information is very valuable.',
        reason: 'Information একটি Uncountable Noun, তাই এর সাথে Singular Verb "is" বসে।'
      }
    ],
    practiceProblems: [
      {
        id: 'd3-p1',
        type: 'mcq',
        question: 'Fill in the blank: "Clean water and sanitation ______ basic human rights."',
        options: ['is', 'are', 'was', 'am'],
        correctIndex: 1,
        explanation: '"Clean water and sanitation" দুটি বিষয় "and" দিয়ে যুক্ত, তাই Plural Verb "are" হবে।'
      },
      {
        id: 'd3-p2',
        type: 'mcq',
        question: 'Fill in the blank: "The candidate ______ absent from yesterday\'s interview."',
        options: ['is', 'was', 'were', 'are'],
        correctIndex: 1,
        explanation: 'অতীতের কথা (yesterday) এবং Subject একবচন (The candidate), তাই "was" হবে।'
      },
      {
        id: 'd3-p3',
        type: 'error_fix',
        question: 'Fix the error: "I am disagree with the author\'s conclusion."',
        correctAnswer: 'I disagree with the author\'s conclusion.',
        explanation: '"Disagree" নিজেই একটি Action/Opinion Verb। "am" বাদ দিতে হবে।'
      },
      {
        id: 'd3-p4',
        type: 'rearrange',
        question: 'Make a question: [technology / is / in modern life / essential ?]',
        correctAnswer: 'Is technology essential in modern life?',
        explanation: 'প্রশ্নবোধক গঠনে Be Verb শুরুতে আসবে: Is + technology + essential + in modern life?'
      },
      {
        id: 'd3-p5',
        type: 'error_fix',
        question: 'Fix the error: "The research findings was published last month."',
        correctAnswer: 'The research findings were published last month.',
        explanation: 'Findings হলো Plural Noun, তাই Past Tense-এ "were" হবে।'
      },
      {
        id: 'd3-p6',
        type: 'mcq',
        question: 'Choose the correct negative sentence:',
        options: [
          'She is not ready for the writing assessment.',
          'She not is ready for the writing assessment.',
          'She does not be ready for the writing assessment.',
          'She are not ready for the writing assessment.'
        ],
        correctIndex: 0,
        explanation: 'Be Verb-এর নেতিবাচক গঠন: Subject + is + not + Complement।'
      },
      {
        id: 'd3-p7',
        type: 'error_fix',
        question: 'Fix the error: "He was go to school yesterday."',
        correctAnswer: 'He went to school yesterday.',
        explanation: 'Past Simple-এ অ্যাকশন বোঝাতে "went" হবে, "was go" কোনো ইংরেজি গঠন নয়।'
      },
      {
        id: 'd3-p8',
        type: 'mcq',
        question: 'Fill in the blank: "All the equipment in the laboratory ______ fully operational."',
        options: ['are', 'is', 'were', 'have'],
        correctIndex: 1,
        explanation: '"Equipment" একটি Uncountable Noun, তাই Singular Verb "is" গ্রহণ করে।'
      },
      {
        id: 'd3-p9',
        type: 'rearrange',
        question: 'Make a negative sentence: [not / the lecture / interesting / was]',
        correctAnswer: 'The lecture was not interesting.',
        explanation: 'Subject: The lecture, Be Verb: was, Negative: not, Complement: interesting.'
      },
      {
        id: 'd3-p10',
        type: 'error_fix',
        question: 'Fix the error: "Are the university open on Sundays?"',
        correctAnswer: 'Is the university open on Sundays?',
        explanation: 'University হলো Singular Noun, তাই প্রশ্ন করার জন্য "Is" বসবে।'
      }
    ],
    writingChallenge: {
      prompt: 'Write 8 sentences describing your current academic life or workplace using Be verbs: 3 positive statements (am/is/are), 3 past statements (was/were), and 2 questions.',
      minimumWords: 50,
      checklist: [
        'Correct agreement between subject and be-verb (is vs are, was vs were).',
        'No "am agree" or "is go" errors.',
        'Proper question mark at the end of questions.',
        'Variety of complements (Adjectives, Nouns, Locations).'
      ],
      modelAnswer: 'I am a dedicated student. My classes are intellectually stimulating. The university campus is modern and spacious. Yesterday, the library was crowded with researchers. We were very tired after the long seminar. Was the teacher available for questions? Is practical learning better than theoretical lectures?'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Famous",
        "phonetic": "/ˈfeɪməs/",
        "pos": "Adjective",
        "banglaMeaning": "বিখ্যাত / সুপরিচিত",
        "englishDefinition": "Known and recognized by many people.",
        "ieltsSentence": "Oxford is a famous academic institution known for worldwide research excellence.",
        "contextTip": "Be-verb-এর পর Predicative Adjective হিসেবে অবস্থা বোঝাতে \"famous\" বসে।",
        "practiceQuestion": "Complete the sentence: \"Shakespeare was a _______ English playwright.\"",
        "targetWord": "famous",
        "hint": "Type the common adjective for well-known."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Prominent",
        "phonetic": "/ˈprɑːmɪnənt/",
        "pos": "Adjective",
        "banglaMeaning": "বিশিষ্ট / গুরুত্বপূর্ণ ও প্রভাবশালী",
        "englishDefinition": "Important, famous, or noticeable.",
        "ieltsSentence": "Renewable energy is a prominent topic in contemporary environmental debates.",
        "contextTip": "IELTS Task 2-এ সমাজ বা বিজ্ঞানের অগ্রণী বিষয়ের ক্ষেত্রে \"prominent role\" বা \"prominent issue\" লিখুন।",
        "practiceQuestion": "Complete the sentence: \"The scientist played a _______ role in developing clean energy.\"",
        "targetWord": "prominent",
        "hint": "Starts with pro- and ends with -nent."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Renowned",
        "phonetic": "/rɪˈnaʊnd/",
        "pos": "Adjective",
        "banglaMeaning": "আন্তর্জাতিকভাবে সুখ্যাত ও প্রশংসিত",
        "englishDefinition": "Widely known and highly admired for quality or achievement.",
        "ieltsSentence": "The professor is internationally renowned for groundbreaking climate change publications.",
        "contextTip": "সাধারণ \"famous\"-এর তুলনায় \"renowned\" শব্দটি গভীর শ্রদ্ধা ও বিশ্বজনীন স্বীকৃতি প্রকাশ করে।",
        "practiceQuestion": "Complete the sentence: \"The hospital is _______ for its exceptional cardiac surgery.\"",
        "targetWord": "renowned",
        "hint": "Spelled re-n-o-w-n-e-d."
    }
],
    homework: {
      taskDescription: 'Write 6 sentences about your hometown using at least 3 different Be verbs. Include details on whether it is peaceful, crowded, or modern.',
      newVocabulary: ['available', 'accessible', 'feasible', 'reliable', 'exceptional']
    }
  },

  // =========================================================================
  // DAY 4: ARTICLES (A, AN, THE & ZERO ARTICLE)
  // =========================================================================
  {
    day: 4,
    title: 'Articles: A, An, The & Zero Article',
    subtitle: 'Phonetic Rules, General vs Specific & Academic Countability',
    badge: 'Determiners & Articles',
    timeMinutes: 20,
    outcomes: [
      'Apply the phonetic sound-based rule for "a" vs "an" without letter-based confusion.',
      'Correctly use "a university", "a European", "an honest person", and "an MBA".',
      'Understand when to use the definite article "the" for specific or unique entities.',
      'Master the "Zero Article" rule for general plural nouns and uncountable abstract concepts.',
      'Eliminate the chronic IELTS mistake of putting "The" before general concepts (e.g., "The education").'
    ],
    grammarTheory: {
      banglaExplanation: `
Articles হলো Noun-এর পূর্বে বসে Noun-টি অনির্দিষ্ট (General) নাকি নির্দিষ্ট (Specific)—তা নির্ধারণ করে।

**১. A বনাম An (ধ্বনির খেলা, অক্ষরের নয়!):**
আমরা স্কুলে শিখেছি Vowel থাকলে 'an', Consonant থাকলে 'a'। কিন্তু আসল নিয়ম হলো **Sound (উচ্চারণ)**:
• **A + Consonant Sound:** *a book, a pen, a student*।
  ⚠️ **ব্যতিক্রম:** শব্দে 'U' বা 'Eu'-এর উচ্চারণ যদি বাংলা **"ইউ" (yu)**-এর মতো হয়, তবে তার পূর্বে **"a"** বসে!
  যেমন: *a **u**niversity* (উচ্চারণ: ইউনূভার্সিটি), *a **u**seful device*, *a **E**uropean nation*, *a **u**nique idea*।
• **An + Vowel Sound (অ, আ, এ, ই):** *an apple, an elephant, an institution*।
  ⚠️ **ব্যতিক্রম:** 'H' যদি অনুচ্চারিত (Silent) থাকে:
  যেমন: *an **h**our* (উচ্চারণ: আওয়ার), *an **h**onest officer*, *an **h**onorable guest*।
  ⚠️ সংক্ষেপ শব্দের ক্ষেত্রে: *an **M**BA, an **I**ELTS score, an **M**Sc* (উচ্চারণ 'এম' $\\rightarrow$ 'এ' ভাওয়েল সাউন্ড)।

**২. The (Definite Article):**
• যখন পাঠক/শ্রোতা পূর্বেই জানে কোনটির কথা বলা হচ্ছে (*I read a book. The book was helpful.*)
• পৃথিবীতে অনন্য ও একক বস্তু (*the sun, the internet, the world*).
• Superlative degree-এর আগে (*the best, the most significant*).

**৩. Zero Article (কোথায় Article বসবে না? — IELTS-এর সবচেয়ে মারাত্মক ট্র্যাপ!):**
• **General Plural Nouns (সাধারণ বহুবচন):** ❌ *The students need books.* $\\rightarrow$ ✅ ***Students need books.***
• **Uncountable & Abstract Nouns (বিমূর্ত ধারণা):**
  ❌ *The education is important.* $\\rightarrow$ ✅ ***Education is important.***
  ❌ *The pollution damages health.* $\\rightarrow$ ✅ ***Pollution damages health.***
      `,
      formulas: [
        { name: 'Singular Indefinite', structure: 'a / an + Singular Countable Noun', example: 'a university student / an honest answer' },
        { name: 'Definite Reference', structure: 'the + Specific Noun', example: 'the data presented in the chart' },
        { name: 'Zero Article (General)', structure: 'Ø + Uncountable Noun / Plural Countable Noun', example: 'Pollution (Ø) affects ecosystems (Ø).' }
      ],
      ieltsImpact: 'IELTS Writing Task 2-এ প্রতিটি প্যারার শুরুতে পরীক্ষার্থীরা "The society", "The education", "The technology" লেখে। সাধারণ অর্থে Abstract Noun-এর আগে "The" বসলে সরাসরি Grammar স্কোর ৫.৫-এ নেমে যায়।'
    },
    workedExamples: [
      { id: 1, sentence: 'He graduated from a university in Germany.', rule: '"university" starts with consonant sound /juː/' },
      { id: 2, sentence: 'She is an honest and hardworking researcher.', rule: '"honest" starts with silent h (vowel sound /ɒ/)' },
      { id: 3, sentence: 'The internet has transformed global communication.', rule: 'Unique universal system -> the' },
      { id: 4, sentence: 'Education plays a vital role in national development.', rule: 'Abstract general concept -> Zero article' },
      { id: 5, sentence: 'The highest percentage was recorded in 2020.', rule: 'Superlative degree -> the' },
      { id: 6, sentence: 'Water is essential for agricultural sustainability.', rule: 'General uncountable noun -> Zero article' }
    ],
    commonTraps: [
      {
        incorrect: 'She is studying in an university.',
        correct: 'She is studying in a university.',
        reason: '"University" শব্দটি "ইউ" (consonant sound /j/) দিয়ে শুরু হয়, তাই "a" বসবে।'
      },
      {
        incorrect: 'The education is vital for every child.',
        correct: 'Education is vital for every child.',
        reason: 'সাধারণ অর্থে Abstract Noun (Education)-এর পূর্বে "The" বসে না।'
      },
      {
        incorrect: 'He made a honest mistake.',
        correct: 'He made an honest mistake.',
        reason: '"Honest"-এ "h" উচ্চারিত হয় না (silent h), vowel sound দিয়ে শুরু হওয়ায় "an" হবে।'
      },
      {
        incorrect: 'I bought book yesterday.',
        correct: 'I bought a book yesterday.',
        reason: 'Singular Countable Noun কখনো কোনো Determiner/Article ছাড়া একা বসতে পারে না।'
      }
    ],
    practiceProblems: [
      {
        id: 'd4-p1',
        type: 'mcq',
        question: 'Choose the correct article: "She completed ______ Master\'s degree in Economics."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 0,
        explanation: '"Master\'s" শুরু হয়েছে কনসোনেন্ট সাউন্ড /m/ দিয়ে, তাই "a" হবে।'
      },
      {
        id: 'd4-p2',
        type: 'mcq',
        question: 'Choose the correct article: "It takes almost ______ hour to commute to office."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        explanation: '"Hour"-এ "h" অনুচ্চারিত (silent), উচ্চারণ "আওয়ার" (vowel sound), তাই "an" হবে।'
      },
      {
        id: 'd4-p3',
        type: 'error_fix',
        question: 'Fix the error: "This is an European research foundation."',
        correctAnswer: 'This is a European research foundation.',
        explanation: '"European"-এর উচ্চারণ "ইউ" (consonant sound /j/) দিয়ে শুরু, তাই "a" হবে।'
      },
      {
        id: 'd4-p4',
        type: 'mcq',
        question: 'Choose the correct option: "______ pollution is a major threat to global ecology."',
        options: ['The', 'A', 'An', 'No article'],
        correctIndex: 3,
        explanation: 'সাধারণভাবে বায়ু বা পরিবেশ দূষণ (Uncountable Noun) বোঝালে কোনো Article বসে না।'
      },
      {
        id: 'd4-p5',
        type: 'error_fix',
        question: 'Fix the error: "I saw a documentary. A documentary was fascinating."',
        correctAnswer: 'I saw a documentary. The documentary was fascinating.',
        explanation: 'দ্বিতীয় বাক্যে ডকুমেন্টারিটি নির্দিষ্ট হয়ে গেছে, তাই "the" বসবে।'
      },
      {
        id: 'd4-p6',
        type: 'mcq',
        question: 'Fill in the blank: "He is ______ honorable member of the academic council."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        explanation: '"Honorable"-এ "h" সাইলেন্ট, তাই "an" বসবে।'
      },
      {
        id: 'd4-p7',
        type: 'error_fix',
        question: 'Fix the error: "The money cannot buy genuine happiness."',
        correctAnswer: 'Money cannot buy genuine happiness.',
        explanation: 'সাধারণ অর্থে "Money" একটি Uncountable Noun, তাই এর পূর্বে "The" বসবে না।'
      },
      {
        id: 'd4-p8',
        type: 'mcq',
        question: 'Fill in the blank: "Mount Everest is ______ highest peak in the world."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 2,
        explanation: 'Superlative degree ("highest")-এর পূর্বে সর্বদা "the" বসে।'
      },
      {
        id: 'd4-p9',
        type: 'rearrange',
        question: 'Rearrange into a sentence: [a / device / smartphone / is / useful]',
        correctAnswer: 'A smartphone is a useful device.',
        acceptableAnswers: ['A smartphone is a useful device.'],
        explanation: 'Smartphone এবং useful device উভয় Singular Countable Noun Phrase-এর পূর্বে "a" বসবে।'
      },
      {
        id: 'd4-p10',
        type: 'error_fix',
        question: 'Fix the error: "She gave me an advice regarding the IELTS exam."',
        correctAnswer: 'She gave me advice regarding the IELTS exam.',
        explanation: '"Advice" একটি Uncountable Noun, তাই এর পূর্বে সরাসরি "an" বসে না।'
      }
    ],
    writingChallenge: {
      prompt: 'Write a short paragraph of 50–60 words describing your school, university, or workplace. Use articles (a, an, the, and zero article) intentionally and correctly.',
      minimumWords: 45,
      checklist: [
        'Used "a" before consonant sounds and "an" before vowel sounds.',
        'Did not use "The" before general abstract nouns like education or knowledge.',
        'Used "the" for specific or previously mentioned things.',
        'Every singular countable noun has an article or determiner.'
      ],
      modelAnswer: 'I study at a reputable university in my city. The campus provides modern laboratories and an extensive library for students. Education is considered a priority by the faculty. I met an inspiring professor who offered valuable guidance for my research project.'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Environment",
        "phonetic": "/ɪnˈvaɪrənmənt/",
        "pos": "Noun",
        "banglaMeaning": "পরিবেশ / চারপাশের প্রাকৃতিক পরিমণ্ডল",
        "englishDefinition": "The natural world, including air, water, and land in which life exists.",
        "ieltsSentence": "Human industrial activities continue to exert severe pressure on the global environment.",
        "contextTip": "প্রাকৃতিক পরিবেশ বোঝাতে সর্বদা definite article \"the environment\" ব্যবহার করতে হয়।",
        "practiceQuestion": "Complete the sentence: \"Protecting the _______ is an urgent priority for all nations.\"",
        "targetWord": "environment",
        "hint": "Remember the silent \"n\" before \"ment\"."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Surroundings",
        "phonetic": "/səˈraʊndɪŋz/",
        "pos": "Noun (Plural)",
        "banglaMeaning": "পারিপার্শ্বিক অবস্থা / চারপাশের পরিবেশ",
        "englishDefinition": "The place where someone or something is and the things that are in it.",
        "ieltsSentence": "A clean and peaceful learning environment positively influences student cognitive focus.",
        "contextTip": "\"surroundings\" শব্দটি সর্বদা Plural হিসেবে ব্যবহৃত হয় এবং এর সাথে Plural Verb বসে।",
        "practiceQuestion": "Complete the sentence: \"Students thrive when their physical _______ are organized and calm.\"",
        "targetWord": "surroundings",
        "hint": "Do not forget the final plural -s."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Ecosystem",
        "phonetic": "/ˈiːkəʊsɪstəm/",
        "pos": "Noun",
        "banglaMeaning": "বাস্তুতন্ত্র / প্রাকৃতিক ভারসাম্য ব্যবস্থা",
        "englishDefinition": "All plants and living creatures in an area considered in relation to their environment.",
        "ieltsSentence": "Deforestation causes irreparable degradation to marine and terrestrial ecosystems alike.",
        "contextTip": "IELTS Environmental Essays-এ \"nature\" বা \"forest\"-এর চেয়ে \"ecosystem\" অনেক বেশি স্পেসিফিক ও একাডেমিক।",
        "practiceQuestion": "Complete the sentence: \"Excessive plastic pollution damages the delicate marine _______.\"",
        "targetWord": "ecosystem",
        "hint": "Spelling: eco + system."
    }
],
    homework: {
      taskDescription: 'Write 5 sentences explaining "Why Knowledge Is Power". Highlight all articles and explain why zero article was used for uncountable nouns.',
      newVocabulary: ['university', 'engineer', 'opportunity', 'phenomenon', 'initiative']
    }
  },

  // =========================================================================
  // DAY 5: NOUNS, PLURALS & COUNTABILITY
  // =========================================================================
  {
    day: 5,
    title: 'Nouns, Plurals & Countability',
    subtitle: 'Singular/Plural Rules, 10 Fatal Uncountable Traps & Quantifiers',
    badge: 'Noun Precision',
    timeMinutes: 20,
    outcomes: [
      'Accurately distinguish Countable and Uncountable nouns in academic contexts.',
      'Master plural spelling rules: regular (-s, -es, -ies, -ves) and irregular forms.',
      'Identify and avoid the 10 most common uncountable noun traps in IELTS Writing.',
      'Select proper quantifiers (many, much, few, little, a lot of) without error.',
      'Construct 8 sentences displaying academic noun precision.'
    ],
    grammarTheory: {
      banglaExplanation: `
IELTS Writing-এ শিক্ষার্থীদের সবচেয়ে ঘন ঘন ভুলগুলোর অন্যতম হলো **Uncountable Noun-কে বহুবচন বানানো**।

**১. Countable Nouns (যা ১, ২, ৩ করে গণনা করা যায়):**
• এদের একবচন ও বহুবচন রূপ থাকে: *one book $\\rightarrow$ two books, one student $\\rightarrow$ ten students*।
• বহুবচন করার নিয়ম:
  - সাধারণ ক্ষেত্রে: *book $\\rightarrow$ books, laptop $\\rightarrow$ laptops*
  - শেষে -s, -sh, -ch, -x থাকলে: *box $\\rightarrow$ boxes, watch $\\rightarrow$ watches, bus $\\rightarrow$ buses*
  - Consonant + y থাকলে: *city $\\rightarrow$ cities, country $\\rightarrow$ countries*
  - -f বা -fe থাকলে: *leaf $\\rightarrow$ leaves, knife $\\rightarrow$ knives* (ব্যতিক্রম: *roof $\\rightarrow$ roofs*)
  - **Irregular Plurals:** *child $\\rightarrow$ children, person $\\rightarrow$ people, criterion $\\rightarrow$ criteria, datum $\\rightarrow$ data, woman $\\rightarrow$ women*।

**২. IELTS-এর সর্বনাশা ১০টি Uncountable Nouns (মুখস্থ রাখা বাধ্যতামূলক):**
এদের সাথে কখনো **-s/-es** যুক্ত হবে না এবং এদের আগে সরাসরি **a/an** বসবে না!
১. **Information** (❌ many informations $\\rightarrow$ ✅ some information / pieces of information)
২. **Advice** (❌ many advices $\\rightarrow$ ✅ some advice / a piece of advice)
৩. **Research** (❌ many researches $\\rightarrow$ ✅ extensive research / research studies)
৪. **Furniture** (❌ furnitures $\\rightarrow$ ✅ items of furniture / furniture)
৫. **Equipment** (❌ equipments $\\rightarrow$ ✅ pieces of equipment / modern equipment)
৬. **Knowledge** (❌ knowledges $\\rightarrow$ ✅ vast knowledge / in-depth knowledge)
৭. **Feedback** (❌ feedbacks $\\rightarrow$ ✅ constructive feedback)
৮. **Traffic** (❌ heavy traffics $\\rightarrow$ ✅ heavy traffic)
৯. **Evidence** (❌ many evidences $\\rightarrow$ ✅ compelling evidence)
১০. **Accommodation** (❌ accommodations $\\rightarrow$ ✅ student accommodation)

**৩. Quantifiers (পরিমাণবাচক শব্দের সঠিক জোড়া):**
• **Countable Plural:** *many, a few, several, a number of* (many books, few errors)
• **Uncountable:** *much, a little, a large amount of* (much information, little patience)
• **উভয় ক্ষেত্রে:** *some, a lot of, plenty of*
      `,
      formulas: [
        { name: 'Countable Quantifier', structure: 'many / a few / several + Plural Countable Noun', example: 'many students / several challenges' },
        { name: 'Uncountable Quantifier', structure: 'much / a little / an amount of + Uncountable Noun', example: 'much information / a little guidance' },
        { name: 'Partitive Expression', structure: 'a piece of / an item of + Uncountable Noun', example: 'a piece of advice / two items of furniture' }
      ],
      ieltsImpact: 'IELTS Task 1 ও Task 2-এ পরীক্ষক Uncountable Noun-এর সাথে "-s" দেখলেই Lexical Resource এবং Grammar উভয় ক্রাইটেরিয়াতেই মার্কস কেটে দেন। যেমন "The graph shows informations" লিখলে বড় ধরনের জরিমানা হয়।'
    },
    workedExamples: [
      { id: 1, noun: 'Advice', usage: 'The career counselor offered valuable advice to the students.', note: 'Never "advices"' },
      { id: 2, noun: 'Criteria', usage: 'Several academic criteria must be met for university admission.', note: 'Plural of criterion' },
      { id: 3, noun: 'Research', usage: 'Scientists conducted extensive research on renewable biofuels.', note: 'Never "researches"' },
      { id: 4, noun: 'Traffic', usage: 'Heavy traffic causes significant commuting delays in mega-cities.', note: 'Never "traffics"' },
      { id: 5, noun: 'Equipment', usage: 'The laboratory is furnished with advanced diagnostic equipment.', note: 'Never "equipments"' },
      { id: 6, noun: 'Children', usage: 'Many children prefer interactive digital learning tools.', note: 'Never "childrens"' }
    ],
    commonTraps: [
      {
        incorrect: 'She gave me many useful advices.',
        correct: 'She gave me some useful advice.',
        reason: '"Advice" Uncountable Noun, তাই বহুবচনে "-s" বা "many" বসবে না।'
      },
      {
        incorrect: 'The university bought new equipments.',
        correct: 'The university bought new equipment.',
        reason: '"Equipment" Uncountable Noun, এর সাথে "-s" যুক্ত হয় না।'
      },
      {
        incorrect: 'There are much students in the classroom.',
        correct: 'There are many students in the classroom.',
        reason: 'Students গণনাযোগ্য (Countable), তাই "much"-এর পরিবর্তে "many" বসবে।'
      },
      {
        incorrect: 'The childrens are playing in the park.',
        correct: 'The children are playing in the park.',
        reason: '"Child"-এর বহুবচন রূপ হলো "children", এর সাথে অতিরিক্ত "s" হয় না।'
      }
    ],
    practiceProblems: [
      {
        id: 'd5-p1',
        type: 'mcq',
        question: 'What is the correct plural form of "child"?',
        options: ['childs', 'childrens', 'children', 'childes'],
        correctIndex: 2,
        explanation: '"Child" একটি irregular noun, এর বহুবচন হলো "children"।'
      },
      {
        id: 'd5-p2',
        type: 'mcq',
        question: 'Choose the correct sentence:',
        options: [
          'We need more informations about the course.',
          'We need more information about the course.',
          'We need an information about the course.',
          'We need many informations about the course.'
        ],
        correctIndex: 1,
        explanation: '"Information" Uncountable Noun, এর সাথে -s বা an বসে না।'
      },
      {
        id: 'd5-p3',
        type: 'mcq',
        question: 'Fill in the blank: "There are ______ historical cities in Bangladesh."',
        options: ['much', 'many', 'a little', 'an amount of'],
        correctIndex: 1,
        explanation: '"Cities" Plural Countable Noun, তাই এর সাথে "many" বসবে।'
      },
      {
        id: 'd5-p4',
        type: 'error_fix',
        question: 'Fix the error: "The researcher conducted many researches on solar energy."',
        correctAnswer: 'The researcher conducted extensive research on solar energy.',
        explanation: '"Research" Uncountable Noun। "extensive research" বা "many research studies" লেখা সঠিক।'
      },
      {
        id: 'd5-p5',
        type: 'mcq',
        question: 'What is the plural form of "criterion"?',
        options: ['criterions', 'criteria', 'criterias', 'criterium'],
        correctIndex: 1,
        explanation: '"Criterion" গ্রিক মূল শব্দ, এর বহুবচন রূপ হলো "criteria"।'
      },
      {
        id: 'd5-p6',
        type: 'error_fix',
        question: 'Fix the error: "He gave me a good advice for my interview."',
        correctAnswer: 'He gave me good advice for my interview.',
        explanation: '"Advice" Uncountable Noun, তাই সরাসরি "a" বসবে না (বা "a piece of advice" বলা যায়)।'
      },
      {
        id: 'd5-p7',
        type: 'rearrange',
        question: 'Rearrange into a sentence: [furniture / comfortable / purchased / the office / new]',
        correctAnswer: 'The office purchased new comfortable furniture.',
        acceptableAnswers: ['The office purchased new comfortable furniture.', 'The office purchased comfortable new furniture.'],
        explanation: 'Subject: The office, Verb: purchased, Object: comfortable new furniture.'
      },
      {
        id: 'd5-p8',
        type: 'mcq',
        question: 'Fill in the blank: "How ______ traffic was there on the highway?"',
        options: ['many', 'much', 'few', 'several'],
        correctIndex: 1,
        explanation: '"Traffic" Uncountable Noun, তাই পরিমাণ জানতে "much" ব্যবহৃত হয়।'
      },
      {
        id: 'd5-p9',
        type: 'error_fix',
        question: 'Fix the error: "Both womens are qualified software engineers."',
        correctAnswer: 'Both women are qualified software engineers.',
        explanation: '"Woman"-এর বহুবচন হলো "women", এর সাথে "s" যুক্ত করা ভুল।'
      },
      {
        id: 'd5-p10',
        type: 'mcq',
        question: 'Choose the correct quantifier: "The library has ______ books on world history."',
        options: ['a little', 'a large amount of', 'a large number of', 'much'],
        correctIndex: 2,
        explanation: '"Books" Plural Countable Noun, তাই "a large number of" বসবে।'
      }
    ],
    writingChallenge: {
      prompt: 'Write 8 sentences on "Why Education Is Important". Your sentences must deliberately include at least 2 plural nouns, 2 uncountable nouns (e.g., knowledge, information, advice, research), and 2 quantifiers (many, much, some, a lot of).',
      minimumWords: 55,
      checklist: [
        'No "-s" added to uncountable nouns (no informations, advices, knowledges).',
        'Irregular plurals written correctly (children, people, criteria).',
        'Proper quantifiers paired with countable vs uncountable nouns.',
        'Clear sentence logic and flow.'
      ],
      modelAnswer: 'Education provides many opportunities for young people in modern society. It offers valuable knowledge that helps individuals solve complex problems. Many students attend universities to gain professional qualifications. Teachers provide useful advice during academic projects. Comprehensive research shows that educated citizens contribute significantly to national economic growth.'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Problem",
        "phonetic": "/ˈprɑːbləm/",
        "pos": "Noun (Countable)",
        "banglaMeaning": "সমস্যা / জটিল পরিস্থিতি",
        "englishDefinition": "A matter or situation regarded as unwelcome or harmful and needing to be overcome.",
        "ieltsSentence": "Traffic congestion is a severe problem in many rapidly expanding metropolitan areas.",
        "contextTip": "\"problem\" একটি Countable Noun, তাই Singular হলে \"a problem\" বা Plural হলে \"problems\" লিখতে হয়।",
        "practiceQuestion": "Complete the sentence: \"Urban air pollution remains a critical _______ in developing countries.\"",
        "targetWord": "problem",
        "hint": "Type the singular countable noun."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Obstacle",
        "phonetic": "/ˈɑːbstəkl/",
        "pos": "Noun (Countable)",
        "banglaMeaning": "প্রতিবন্ধকতা / পথরোধকারী বাধা",
        "englishDefinition": "A thing that blocks one’s way or prevents or hinders progress.",
        "ieltsSentence": "High tuition fees represent a major obstacle for underprivileged students seeking tertiary degrees.",
        "contextTip": "IELTS Writing-এ \"problem\"-এর সুন্দর ও ফর্মাল সিনোনিম হিসেবে \"obstacle\" বা \"barrier\" ব্যবহৃত হয়।",
        "practiceQuestion": "Complete the sentence: \"Language barriers can be a significant _______ to international trade.\"",
        "targetWord": "obstacle",
        "hint": "Spelled o-b-s-t-a-c-l-e."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Dilemma",
        "phonetic": "/dɪˈlemə/",
        "pos": "Noun (Countable)",
        "banglaMeaning": "উভয়সংকট / কঠিন নৈতিক বা কৌশলগত দ্বন্দ্ব",
        "englishDefinition": "A situation in which a difficult choice has to be made between two or more alternatives.",
        "ieltsSentence": "Policymakers face an ethical dilemma between rapid industrialization and environmental preservation.",
        "contextTip": "যখন দুটি বিপরীতধর্মী গুরুত্বপূর্ণ বিষয়ের মধ্যে সিদ্ধান্ত নেওয়া কঠিন হয়, তখন \"dilemma\" শব্দটি পরীক্ষককে মুগ্ধ করে।",
        "practiceQuestion": "Complete the sentence: \"Balancing career ambitions and family duties poses a genuine _______ for young parents.\"",
        "targetWord": "dilemma",
        "hint": "Double \"m\": di-lem-ma."
    }
],
    homework: {
      taskDescription: 'Write a 60-word paragraph describing the items in your study room or office. Underline all countable nouns in blue and all uncountable nouns in green.',
      newVocabulary: ['criterion', 'equipment', 'evidence', 'feedback', 'phenomenon']
    }
  },

  // =========================================================================
  // DAY 6: PRESENT SIMPLE TENSE & DAILY ROUTINE
  // =========================================================================
  {
    day: 6,
    title: 'Present Simple Tense',
    subtitle: 'Daily Habits, Universal Facts, Do/Does & -s/-es Spelling Rules',
    badge: 'Tense Mastery',
    timeMinutes: 20,
    outcomes: [
      'Understand when Present Simple is required (Habits, facts, universal truths, academic descriptions).',
      'Accurately apply the third-person singular -s/-es/-ies spelling rules.',
      'Construct affirmative, negative (do not / does not), and question forms without error.',
      'Revert main verbs to base form after does/doesn\'t (e.g., "She doesn\'t like", not "doesn\'t likes").',
      'Incorporate frequency adverbs (always, usually, often, sometimes, never) into daily routine writing.'
    ],
    grammarTheory: {
      banglaExplanation: `
IELTS Writing-এ সাধারণ সত্য, বৈজ্ঞানিক বাস্তবতা এবং সমাজ বা মানুষের নিয়মিত কার্যকলাপ প্রকাশ করার জন্য **Present Simple Tense** সবচেয়ে গুরুত্বপূর্ণ।

**১. Present Simple কখন ব্যবহৃত হয়?**
• **Universal Truths & Facts (চিরন্তন সত্য বা বৈজ্ঞানিক সত্য):**
  *Water boils at 100°C.* / *The sun rises in the east.*
• **Habits & Routines (দৈনন্দিন অভ্যাস ও নিয়ম):**
  *I study English for two hours every day.* / *He attends classes regularly.*
• **General Statements in IELTS Writing (সাধারণ সামাজিক বাস্তবতা):**
  *Many people believe that technology improves education.*

**২. ৩টি বাক্যের কাঠামো (Formulas):**
• **Positive (+):** Subject + Base Verb (+ s/es if He/She/It/Singular) + Object
  *I study.* / *She **studies**.*
• **Negative (-):** Subject + **do / does + not** + Base Verb (সর্বদা মূল রূপ!) + Object
  *I do not study.* / *He **does not study**.* (কখনোই *does not studies* নয়!)
• **Interrogative (?):** **Do / Does** + Subject + Base Verb + Object?
  *Do you study?* / *Does she **study**?*

**৩. Third-Person Singular -s/-es Rules:**
যখন Subject **He, She, It** বা কোনো **Singular Noun** (The student, My brother):
• অধিকাংশ ক্ষেত্রে -s: *work $\\rightarrow$ works, read $\\rightarrow$ reads, write $\\rightarrow$ writes*
• শেষে -ss, -sh, -ch, -x, -o থাকলে -es: *teach $\\rightarrow$ teaches, wash $\\rightarrow$ washes, go $\\rightarrow$ goes*
• Consonant + y থাকলে -ies: *study $\\rightarrow$ studies, fly $\\rightarrow$ flies*
• Vowel + y থাকলে শুধু -s: *play $\\rightarrow$ plays*
• বিশেষ রূপ: *have $\\rightarrow$ **has***

**৪. Frequency Adverbs (কত ঘন ঘন ঘটে?):**
*Always (১০০%), Usually (৮০%), Often (৬০%), Sometimes (৪০%), Rarely (১০%), Never (০%)*।
এরা সাধারণত Main Verb-এর পূর্বে বসে: *I **usually read** newspapers in the morning.*
      `,
      formulas: [
        { name: 'Affirmative (3rd Person)', structure: 'He / She / It + Verb(-s/-es) + Object', example: 'She (S) + attends (V) + daily lectures (O).' },
        { name: 'Negative with Does not', structure: 'Subject + does not + Base Verb', example: 'He (S) + does not study (V) + late at night.' },
        { name: 'Question with Do/Does', structure: 'Do / Does + Subject + Base Verb?', example: 'Does (Aux) + technology (S) + enhance (V) + learning?' }
      ],
      ieltsImpact: 'IELTS Writing Task 2-এ Third-person singular Subject-এর সাথে -s/-es বাদ দেওয়া একটি সাধারণ অসতর্কতামূলক ত্রুটি (যেমন: Society depends on technology)। নির্ভুল টেন্স ও সঠিক রূপ বজায় রাখা Grammatical Range & Accuracy-র জন্য অত্যন্ত গুরুত্বপূর্ণ।'
    },
    workedExamples: [
      { id: 1, s: 'The government', v: 'invests', o: 'in public transportation', meaning: 'সরকার গণপরিবহনে বিনিয়োগ করে।' },
      { id: 2, s: 'Many individuals', v: 'prefer', o: 'remote working opportunities', meaning: 'অনেক ব্যক্তি দূরবর্তী কাজের সুযোগ পছন্দ করেন।' },
      { id: 3, s: 'The library', v: 'does not charge', o: 'membership fees', meaning: 'লাইব্রেরিটি সদস্যপদ ফি নেয় না।' },
      { id: 4, s: 'Does', sub: 'higher education', v: 'guarantee', o: 'career success?', meaning: 'উচ্চশিক্ষা কি ক্যারিয়ারের সাফল্য নিশ্চিত করে?' },
      { id: 5, s: 'I', adv: 'always', v: 'complete', o: 'my assignments on time', meaning: 'আমি সর্বদা সময়মতো আমার অ্যাসাইনমেন্ট সম্পন্ন করি।' },
      { id: 6, s: 'She', v: 'has', o: 'a systematic study timetable', meaning: 'তার একটি সুশৃঙ্খল পড়ার সময়সূচি আছে।' }
    ],
    commonTraps: [
      {
        incorrect: 'He go to university every morning.',
        correct: 'He goes to university every morning.',
        reason: 'He হলো Third-person singular, তাই Verb-এর সাথে -es যুক্ত হবে।'
      },
      {
        incorrect: 'She doesn\'t likes hot coffee.',
        correct: 'She doesn\'t like hot coffee.',
        reason: 'Does/Doesn\'t ব্যবহারের পর Main Verb সর্বদা Base Form (মূল রূপ)-এ ফিরে আসে।'
      },
      {
        incorrect: 'Does he works in an office?',
        correct: 'Does he work in an office?',
        reason: 'Does-এর পরে Verb-এর সাথে আবার "s" যুক্ত করা মারাত্মক ব্যাকরণিক ভুল।'
      },
      {
        incorrect: 'My father have a laptop.',
        correct: 'My father has a laptop.',
        reason: 'My father singular subject, তাই "have"-এর পরিবর্তে "has" হবে।'
      }
    ],
    practiceProblems: [
      {
        id: 'd6-p1',
        type: 'mcq',
        question: 'Choose the correct verb form: "The university professor ______ complex ideas clearly."',
        options: ['explain', 'explains', 'explaining', 'is explain'],
        correctIndex: 1,
        explanation: 'Subject (The university professor) Singular, তাই Verb-এর সাথে -s যুক্ত হবে: "explains"।'
      },
      {
        id: 'd6-p2',
        type: 'error_fix',
        question: 'Fix the error: "She don\'t like to attend morning classes."',
        correctAnswer: 'She doesn\'t like to attend morning classes.',
        explanation: 'Third-person singular "She"-এর সাথে "doesn\'t" বসে, "don\'t" নয়।'
      },
      {
        id: 'd6-p3',
        type: 'mcq',
        question: 'Choose the correct negative sentence:',
        options: [
          'He does not works on Sundays.',
          'He does not work on Sundays.',
          'He do not work on Sundays.',
          'He is not work on Sundays.'
        ],
        correctIndex: 1,
        explanation: 'Does not-এর পর Main Verb মূল রূপে থাকবে: "does not work"।'
      },
      {
        id: 'd6-p4',
        type: 'rearrange',
        question: 'Make a question: [English / study / she / does / every day ?]',
        correctAnswer: 'Does she study English every day?',
        explanation: 'প্রশ্নবোধক গঠন: Does + she + study + English + every day?'
      },
      {
        id: 'd6-p5',
        type: 'error_fix',
        question: 'Fix the error: "My brother watch television after dinner."',
        correctAnswer: 'My brother watches television after dinner.',
        explanation: 'Watch-এর শেষে -ch থাকায় singular subject-এর সাথে "-es" যুক্ত হয়ে "watches" হবে।'
      },
      {
        id: 'd6-p6',
        type: 'mcq',
        question: 'Fill in the blank: "Public transport ______ traffic congestion in metropolitan areas."',
        options: ['reduce', 'reduces', 'reducing', 'are reduce'],
        correctIndex: 1,
        explanation: '"Public transport" singular subject, তাই "reduces" হবে।'
      },
      {
        id: 'd6-p7',
        type: 'rearrange',
        question: 'Place the adverb correctly: [I / vocabulary / practice / usually / in the morning]',
        correctAnswer: 'I usually practice vocabulary in the morning.',
        explanation: 'Frequency Adverb "usually" মূল ক্রিয়া "practice"-এর পূর্বে বসে।'
      },
      {
        id: 'd6-p8',
        type: 'error_fix',
        question: 'Fix the error: "Does this course provides free study materials?"',
        correctAnswer: 'Does this course provide free study materials?',
        explanation: 'Does ব্যবহারের পর main verb মূল রূপ "provide"-এ ফিরে আসবে।'
      },
      {
        id: 'd6-p9',
        type: 'mcq',
        question: 'Choose the correct form: "Many university students ______ online learning platforms."',
        options: ['prefers', 'prefer', 'is preferring', 'has preferred'],
        correctIndex: 1,
        explanation: '"Many university students" Plural Subject, তাই Base Verb "prefer" বসবে।'
      },
      {
        id: 'd6-p10',
        type: 'error_fix',
        question: 'Fix the error: "Technology change our daily communication."',
        correctAnswer: 'Technology changes our daily communication.',
        explanation: 'Technology singular subject, তাই verb-এর সাথে -s যুক্ত হয়ে "changes" হবে।'
      }
    ],
    writingChallenge: {
      prompt: 'Write 8–10 sentences describing "My Daily Routine as an IELTS Learner". Use Present Simple tense strictly and incorporate at least 3 frequency adverbs (always, usually, often, sometimes, never).',
      minimumWords: 60,
      checklist: [
        'Present simple tense used for regular habits and routines.',
        'Third-person singular forms (-s/-es) used correctly when mentioning others.',
        'At least 3 frequency adverbs placed before main verbs.',
        'No "am study" or "is go" structures.'
      ],
      modelAnswer: 'I wake up at six o\'clock every morning. I usually review thirty new vocabulary words before breakfast. My tutor sends daily writing feedback via email. I always read academic articles from international publications for thirty minutes. In the afternoon, I attend university lectures. I often practice sentence building exercises in the evening. I never submit assignments without proofreading my grammar.'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Consume",
        "phonetic": "/kənˈsuːm/",
        "pos": "Verb",
        "banglaMeaning": "ব্যবহার বা ভোগ করা / খাওয়া",
        "englishDefinition": "To use up, eat, drink, or expend resources, fuel, or energy.",
        "ieltsSentence": "Modern vehicles consume substantially less fuel due to advanced mechanical efficiency.",
        "contextTip": "Present Simple-এ Third-Person Singular Subject হলে \"consumes\" লিখতে হয়।",
        "practiceQuestion": "Complete the sentence: \"A heavy computer program _______ a large amount of battery power.\"",
        "targetWord": "consumes",
        "hint": "Third-person singular (-s)."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Allocate",
        "phonetic": "/ˈæləkeɪt/",
        "pos": "Verb",
        "banglaMeaning": "নির্দিষ্ট কাজের জন্য বরাদ্দ করা",
        "englishDefinition": "To distribute resources, time, or funds for a particular purpose.",
        "ieltsSentence": "Responsible governments allocate substantial financial budgets to healthcare and primary education.",
        "contextTip": "IELTS Writing Task 2-এ সরকারি বাজেট বরাদ্দের ক্ষেত্রে \"allocate\" অপরিহার্য একটি ভার্ব।",
        "practiceQuestion": "Complete the sentence: \"The ministry should _______ more funds for public school libraries.\"",
        "targetWord": "allocate",
        "hint": "Base form after modal \"should\"."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Prioritize",
        "phonetic": "/praɪˈɔːrətaɪz/",
        "pos": "Verb",
        "banglaMeaning": "গুরুত্ব অনুসারে অগ্রাধিকার দেওয়া",
        "englishDefinition": "To designate or treat something as more important than other things.",
        "ieltsSentence": "Successful students prioritize constructive study habits over mindless digital distractions.",
        "contextTip": "\"Give importance to\"-এর চেয়ে একক শব্দ \"prioritize\" অনেক বেশি পরিশীলিত ও প্রভাবশালী।",
        "practiceQuestion": "Complete the sentence: \"Urban city planners must _______ pedestrian safety over vehicle speed.\"",
        "targetWord": "prioritize",
        "hint": "Spelled p-r-i-o-r-i-t-i-z-e."
    }
],
    homework: {
      taskDescription: 'Write 6 sentences describing the daily routine of a family member or friend (e.g., your mother, father, or roommate). Ensure every sentence uses the third-person -s/-es correctly.',
      newVocabulary: ['regularly', 'consistently', 'frequently', 'maintain', 'prioritize']
    }
  },

  // =========================================================================
  // DAY 7: SUBJECT-VERB AGREEMENT & WEEK 1 MASTERY EXAM
  // =========================================================================
  {
    day: 7,
    title: 'Subject–Verb Agreement & Review',
    subtitle: 'Syntactic Harmony, Intervening Phrases & Week 1 Mastery Exam',
    badge: 'Mastery & Diagnostic Test',
    timeMinutes: 25,
    outcomes: [
      'Apply the fundamental rule: Singular Subject = Singular Verb, Plural Subject = Plural Verb.',
      'Ignore intervening prepositional phrases (e.g., "The quality of these apples is high").',
      'Handle compound subjects with "and", "or", and indefinite pronouns (everyone, each).',
      'Consolidate all grammar rules from Days 1 to 6 (Articles, Plurals, Be Verbs, Present Simple).',
      'Pass the Week 1 Diagnostic Exam (20+ marks out of 25) and write an academic student profile.'
    ],
    grammarTheory: {
      banglaExplanation: `
Subject–Verb Agreement-এর মূল নীতি খুব সহজ: **Subject যদি Singular হয়, Verb-ও Singular হবে; Subject যদি Plural হয়, Verb-ও Plural হবে।**
কিন্তু পরীক্ষায় সাবজেক্টের সাথে অতিরিক্ত তথ্য জুড়ে দিয়ে শিক্ষার্থীদের বিভ্রান্ত করা হয়!

**IELTS-এর জন্য ৪টি গোল্ডেন রুলস:**

১. **Intervening Prepositional Phrases (মাঝের শব্দে বিভ্রান্ত হবেন না!):**
Subject এবং Verb-এর মাঝে যদি Preposition যুক্ত অতিরিক্ত অংশ (*of, in, with, along with, together with*) থাকে, মূল Subject কিন্তু পরিবর্তিত হয় না।
• *"The quality **of these products** (is / are) exceptional."*
  $\\rightarrow$ কথা বলা হচ্ছে **The quality** (একবচন) নিয়ে, products নিয়ে নয়! তাই সঠিক উত্তর: **is**।
• *"The students **in this university** (studies / study) diligently."*
  $\\rightarrow$ Subject হলো **The students** (বহুবচন), তাই সঠিক উত্তর: **study**।

২. **Compound Subjects with 'AND':**
দুটি ভিন্ন Noun যদি 'and' দিয়ে যুক্ত হয়, তারা Plural Verb গ্রহণ করে:
• *Tanvir and his colleague **work** collaboratively.*

৩. **Indefinite Pronouns (সর্বদা Singular!):**
*Everyone, everybody, someone, somebody, anyone, nobody, each, every* $\\rightarrow$ এদের পরে Verb সর্বদা **Singular** হয়।
• *Everyone **wants** to score Band 8 in IELTS.* (Not *want*)
• *Each of the participants **has** an academic goal.* (Not *have*)

৪. **Collective Nouns:**
*The government, the committee, the organization* সাধারণত একটি একক প্রতিষ্ঠান হিসেবে Singular Verb গ্রহণ করে:
• *The government **aims** to reduce illiteracy.*
      `,
      formulas: [
        { name: 'Singular Agreement', structure: 'Singular Subject + Verb(-s/-es) / is / was', example: 'The cost of living (S) + is (V) + rising.' },
        { name: 'Plural Agreement', structure: 'Plural Subject + Base Verb / are / were', example: 'Renewable technologies (S) + reduce (V) + pollution.' },
        { name: 'Indefinite Pronoun Agreement', structure: 'Each / Everyone + Singular Verb', example: 'Every student (S) + deserves (V) + quality education.' }
      ],
      ieltsImpact: 'Subject-Verb Agreement-এর ভুল একাডেমিক রচনার সাবলীলতা ও স্পষ্টতা নষ্ট করে। প্রাতিষ্ঠানিক লেখায় উচ্চমানের নির্ভুলতা বজায় রাখতে Subject ও Verb-এর সংখ্যা ও প্রকারের সামঞ্জস্য নিশ্চিত করা বাঞ্ছনীয়।'
    },
    workedExamples: [
      { id: 1, sub: 'The percentage of female researchers', v: 'has increased', note: 'Subject is "The percentage" (singular)' },
      { id: 2, sub: 'Neither the teacher nor the students', v: 'were present', note: 'Verb agrees with the closer subject "students"' },
      { id: 3, sub: 'Each of the participants', v: 'receives', note: '"Each" takes a singular verb' },
      { id: 4, sub: 'Clean water and healthy food', v: 'are vital', note: 'Compound subject connected by "and"' },
      { id: 5, sub: 'The number of road accidents', v: 'is decreasing', note: '"The number of" takes singular verb' },
      { id: 6, sub: 'A large number of students', v: 'prefer online courses', note: '"A number of" takes plural verb' }
    ],
    commonTraps: [
      {
        incorrect: 'The cost of modern facilities are high.',
        correct: 'The cost of modern facilities is high.',
        reason: 'Subject হলো "The cost" (Singular), "facilities" নয়। তাই Verb "is" হবে।'
      },
      {
        incorrect: 'Everyone in our class want to pass.',
        correct: 'Everyone in our class wants to pass.',
        reason: '"Everyone" Indefinite Pronoun, এটি সর্বদা Singular Verb গ্রহণ করে।'
      },
      {
        incorrect: 'The government have decided to build a bridge.',
        correct: 'The government has decided to build a bridge.',
        reason: '"The government" একটি একক প্রতিষ্ঠান (Collective noun), তাই "has" বসবে।'
      },
      {
        incorrect: 'There is many problems in our city.',
        correct: 'There are many problems in our city.',
        reason: '"There"-এর পরে Verb নির্ধারিত হয় পরবর্তী Noun অনুযায়ী ("many problems" = plural)।'
      }
    ],
    practiceProblems: [
      {
        id: 'd7-p1',
        type: 'mcq',
        question: 'Choose the correct verb: "The price of agricultural goods ______ risen sharply."',
        options: ['have', 'has', 'are', 'were'],
        correctIndex: 1,
        explanation: 'Subject হলো "The price" (Singular), "goods" নয়। তাই "has" হবে।'
      },
      {
        id: 'd7-p2',
        type: 'mcq',
        question: 'Choose the correct verb: "Everyone in the seminar ______ attentive to the speaker."',
        options: ['were', 'was', 'are', 'have been'],
        correctIndex: 1,
        explanation: '"Everyone" সর্বদা Singular Verb "was" গ্রহণ করে।'
      },
      {
        id: 'd7-p3',
        type: 'error_fix',
        question: 'Fix the error: "The teacher, along with his students, are visiting the museum."',
        correctAnswer: 'The teacher, along with his students, is visiting the museum.',
        explanation: '"Along with" দ্বারা যুক্ত অংশ মূল Subject-কে পরিবর্তন করে না। মূল Subject "The teacher" (singular), তাই "is" হবে।'
      },
      {
        id: 'd7-p4',
        type: 'mcq',
        question: 'Choose the correct verb: "Clean air and fresh water ______ essential for longevity."',
        options: ['is', 'are', 'was', 'has been'],
        correctIndex: 1,
        explanation: 'দুটি বিষয় "and" দ্বারা যুক্ত হওয়ায় Plural Verb "are" হবে।'
      },
      {
        id: 'd7-p5',
        type: 'error_fix',
        question: 'Fix the error: "There is several reasons behind this environmental trend."',
        correctAnswer: 'There are several reasons behind this environmental trend.',
        explanation: 'Noun phrase হলো "several reasons" (Plural), তাই "There are" হবে।'
      },
      {
        id: 'd7-p6',
        type: 'mcq',
        question: 'Choose the correct verb: "A large number of applicants ______ applied for the scholarship."',
        options: ['has', 'have', 'is', 'was'],
        correctIndex: 1,
        explanation: '"A large number of" Plural Verb "have" গ্রহণ করে।'
      },
      {
        id: 'd7-p7',
        type: 'error_fix',
        question: 'Fix the error: "Each of the candidates have unique qualifications."',
        correctAnswer: 'Each of the candidates has unique qualifications.',
        explanation: '"Each" সর্বদা Singular Verb "has" গ্রহণ করে।'
      },
      {
        id: 'd7-p8',
        type: 'mcq',
        question: 'Week 1 Review: "She is ______ honest civil servant who works hard."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        explanation: '"Honest" vowel sound দিয়ে শুরু, তাই "an" বসবে (Day 4 Rule)।'
      },
      {
        id: 'd7-p9',
        type: 'error_fix',
        question: 'Week 1 Review: "He gave me many useful advices yesterday."',
        correctAnswer: 'He gave me some useful advice yesterday.',
        explanation: '"Advice" Uncountable Noun, তাই এর সাথে "-s" হয় না (Day 5 Rule)।'
      },
      {
        id: 'd7-p10',
        type: 'error_fix',
        question: 'Week 1 Review: "I am completely agree with the proposed policy."',
        correctAnswer: 'I completely agree with the proposed policy.',
        explanation: '"Agree" Action Verb, তাই "am agree" লেখা ভুল (Day 1 & Day 3 Rule)।'
      }
    ],
    writingChallenge: {
      prompt: 'Week 1 Graduation Writing Task: Write a cohesive paragraph of 60–80 words titled "My Life and Aspirations as an IELTS Student". You must incorporate: (1) At least two Present Simple sentences, (2) One Be-verb statement, (3) Correct articles (a, an, the, and zero article), (4) Proper singular/plural agreement with zero fragments.',
      minimumWords: 65,
      checklist: [
        'Strict Subject-Verb agreement throughout (Singular subject = singular verb).',
        'No "I am agree" or unnecessary auxiliary verbs.',
        'Accurate usage of articles and uncountable nouns.',
        'Between 60 and 80 words.'
      ],
      modelAnswer: 'I am an ambitious university student aiming for higher education in the United Kingdom. I study English every day to enhance my language competence. My university provides an excellent academic environment with extensive research facilities. Learning academic writing requires consistent practice and patience. Achieving Band 7 in IELTS opens remarkable career opportunities for my future. I always complete my daily grammar tasks with genuine enthusiasm.'
    },
    dailyThreeWords: [
    {
        "level": "Common",
        "levelBadge": "Level 1 · Common Foundation",
        "word": "Connect",
        "phonetic": "/kəˈnekt/",
        "pos": "Verb",
        "banglaMeaning": "যুক্ত করা / সম্পর্কিত হওয়া",
        "englishDefinition": "To bring together or establish a relationship between two or more things.",
        "ieltsSentence": "High-speed internet networks connect rural communities to global educational resources.",
        "contextTip": "Subject যদি Plural হয় (networks), Verb-এর সাথে -s যুক্ত হবে না (connect)।",
        "practiceQuestion": "Complete the sentence: \"Effective teachers _______ classroom lessons to real-world experience.\"",
        "targetWord": "connect",
        "hint": "Plural subject \"teachers\" takes base verb."
    },
    {
        "level": "Intermediate",
        "levelBadge": "Level 2 · Academic Core",
        "word": "Correlate",
        "phonetic": "/ˈkɔːrəleɪt/",
        "pos": "Verb",
        "banglaMeaning": "পরস্পর সম্পর্কযুক্ত হওয়া / সমানুপাতিক হওয়া",
        "englishDefinition": "To have a mutual relationship or connection, in which one thing affects another.",
        "ieltsSentence": "Academic studies prove that parental involvement strongly correlates with children’s academic success.",
        "contextTip": "IELTS Task 1 ও Task 2-এ দুটি উপাত্তের সম্পর্ক তুলে ধরতে \"correlates with\" একটি অসাধারণ টার্ম।",
        "practiceQuestion": "Complete the sentence: \"Higher education levels generally _______ with higher lifetime earnings.\"",
        "targetWord": "correlate",
        "hint": "Plural subject \"levels\" takes base verb correlate."
    },
    {
        "level": "Advanced",
        "levelBadge": "Level 3 · Band 7+ Lexical Resource",
        "word": "Synthesize",
        "phonetic": "/ˈsɪnθəsaɪz/",
        "pos": "Verb",
        "banglaMeaning": "বিভিন্ন তথ্য একত্র করে সমন্বিত সিদ্ধান্তে পৌঁছানো",
        "englishDefinition": "To combine a range of different ideas, facts, or elements into a coherent whole.",
        "ieltsSentence": "A proficient IELTS essay synthesizes diverse arguments before presenting a balanced final conclusion.",
        "contextTip": "Band 8+ Writing-এ তথ্য সমন্বয় করার সামর্থ্য বোঝাতে \"synthesize\" শব্দটি ব্যবহৃত হয়।",
        "practiceQuestion": "Complete the sentence: \"Researchers must _______ data from multiple experiments to form a clear theory.\"",
        "targetWord": "synthesize",
        "hint": "Base form after modal \"must\"."
    }
],
    homework: {
      taskDescription: 'Complete the Week 1 Self-Assessment Checklist and review any mistakes made in Days 1 to 6 before moving to Week 2: Compound & Complex Sentences.',
      newVocabulary: ['competence', 'remarkable', 'collaborative', 'comprehensive', 'perseverance']
    }
  },

  // =========================================================================
  // DAY 8: WEEK 1 MASTERY EXAM (COMPREHENSIVE ASSESSMENT)
  // =========================================================================
  WEEK_1_EXAM_DATA
];

/**
 * Helper to retrieve all vocabulary for a given week from the dataset.
 */
export function getWeekVocabulary(weekNumber = 1) {
  return getWeeklyVocabularyHelper(weekNumber, IELTS_WRITING_WEEK_1_DAYS);
}

export { WEEK_1_EXAM_DATA };


export const COURSE_DATA = {
  english: {
    title: 'English Pathway',
    flag: '🇬🇧',
    description: 'Build fluent communication and leadership skills for global impact.',
    accent: 'blue',
    modules: [
      {
        id: 'en-mod-1',
        title: 'Everyday Leadership Interactions',
        description: 'Introduce yourself with confidence and practice persuasive teamwork language.',
        lessons: [
          {
            id: 'en-les-1',
            title: 'Introducing Yourself & Vision',
            description: 'Master the personal introduction and articulate a compelling vision.',
            langCode: 'en-US',
            cards: [
              { word: 'Initiative', translation: 'Taking the first step', type: 'noun', explanation: 'The power to start action confidently and independently.', example: 'Taking initiative makes every team move forward.' },
              { word: 'Visionary', translation: 'Future-focused thinker', type: 'adjective', explanation: 'Thinking beyond the present to shape a bold future.', example: 'A visionary leader inspires others with a clear purpose.' },
              { word: 'Collaborate', translation: 'Work together', type: 'verb', explanation: 'Working together to create stronger ideas and solutions.', example: 'Great teams collaborate across differences to achieve results.' },
              { word: 'Empower', translation: 'Give confidence and ability', type: 'verb', explanation: 'Giving others the confidence and resources to take action.', example: 'A good leader empowers teammates to own success.' },
            ],
            phrases: [
              { text: 'I believe we can make a difference by working together.', translation: 'Use this to express teamwork and shared impact.' },
              { text: 'My vision for this project is to foster community growth.', translation: 'Use this to explain a future-focused goal.' },
              { text: 'Let\'s align our goals and share the responsibility.', translation: 'Use this to invite teamwork and accountability.' },
            ],
            quiz: [
              {
                question: "Which word means 'the ability to assess and initiate things independently'?",
                options: ['Empower', 'Initiative', 'Collaborate', 'Visionary'],
                answer: 1,
                explanation: 'Initiative refers to taking the first step or starting something independently.',
              },
              {
                question: 'Complete the sentence: "A ______ leader inspires others with their long-term ideas."',
                options: ['collaborate', 'initiative', 'visionary', 'empower'],
                answer: 2,
                explanation: '"Visionary" is the adjective that describes planning for the future with imagination and foresight.',
              },
              {
                question: "Which phrase best matches 'Collaborate'?",
                options: ['Give up quickly', 'Work together', 'Speak louder', 'Start alone'],
                answer: 1,
                explanation: 'Collaborate means to work together toward a shared result.',
              },
            ],
          },
          {
            id: 'en-les-2',
            title: 'Public Speaking Basics',
            description: 'Learn how to capture attention, use vocal variety, and deliver powerful speeches.',
            langCode: 'en-US',
            cards: [
              { word: 'Eloquence', translation: 'Powerful expression', type: 'noun', explanation: 'Fluent or persuasive speaking or writing.', example: 'Her eloquence moved the audience to take action.' },
              { word: 'Articulate', translation: 'Express clearly', type: 'verb', explanation: 'Express an idea or feeling clearly and fluently.', example: 'A leader must be able to articulate their thoughts under pressure.' },
              { word: 'Resonance', translation: 'Deep impact', type: 'noun', explanation: 'A quality of sound or message that feels strong and memorable.', example: 'A voice with resonance commands attention in a large hall.' },
              { word: 'Persuade', translation: 'Convince with reasons', type: 'verb', explanation: 'Cause someone to do or believe something through reasoning.', example: 'He used stories to persuade the council to fund the center.' },
            ],
            phrases: [
              { text: 'Speaking from the heart builds trust with your audience.', translation: 'Use this when discussing authentic communication.' },
              { text: 'Clear communication is the bridge between confusion and clarity.', translation: 'Use this to explain why simple language matters.' },
            ],
            quiz: [
              {
                question: 'Choose the correct word for: "fluent or persuasive speaking or writing"',
                options: ['Articulate', 'Resonance', 'Eloquence', 'Persuade'],
                answer: 2,
                explanation: 'Eloquence represents fluent, powerful, and persuasive speech or writing.',
              },
              {
                question: 'What is the primary goal of public speaking in leadership?',
                options: ['To speak as fast as possible', 'To hide personal feelings', 'To persuade and inspire the audience', 'To read directly from a script'],
                answer: 2,
                explanation: 'Leadership public speaking aims to connect, persuade, and inspire others to act.',
              },
            ],
          },
        ],
      },
    ],
  },
  arabic: {
    title: 'Arabic Pathway',
    flag: '🇸🇦',
    description: 'Master Modern Standard Arabic for public rhetoric and leadership dialogues.',
    accent: 'green',
    modules: [
      {
        id: 'ar-mod-1',
        title: 'Arabic Foundations for Leaders',
        description: 'Start with friendly Arabic words, simple phrases, and confidence-building practice.',
                lessons: [
          // Day 1
          {
            id: 'ar-les-1',
            title: 'Lesson 1: Leadership Words',
            description: 'Learn four useful Arabic leadership words with simple English support.',
            langCode: 'ar-SA',
            cards: [
              { word: 'Leadership', translation: 'Qiyadah', type: 'noun', explanation: 'Qiyadah means guiding people toward a shared goal.', example: 'Use it when talking about leading a team or project.' },
              { word: 'Integrity', translation: 'Nazahah', type: 'noun', explanation: 'Nazahah means honesty and strong moral character.', example: 'Use it when describing someone trustworthy.' },
              { word: 'Influence', translation: 'Taathir', type: 'noun', explanation: 'Taathir means the ability to create a positive effect.', example: 'Use it when a leader inspires others to act.' },
              { word: 'Responsibility', translation: 'Masuliyyah', type: 'noun', explanation: 'Masuliyyah means being accountable for choices and duties.', example: 'Use it when talking about commitment and ownership.' },
            ],
            phrases: [
              { text: 'A great leader builds other leaders.', translation: 'Arabic phrase practice coming soon.' },
              { text: 'Shared teamwork is the key to lasting success.', translation: 'Arabic phrase practice coming soon.' },
            ],
            quiz: [],
          },
          // Day 2
          {
            id: 'ar-les-2',
            title: 'Lesson 2: Speaking With Impact',
            description: 'Practice simple Arabic-linked words for speaking, delivery, and persuasion.',
            langCode: 'ar-SA',
            cards: [
              { word: 'Eloquence', translation: 'Balaghah', type: 'noun', explanation: 'Balaghah means clear, powerful, and fitting expression.', example: 'Use it when speech sounds graceful and convincing.' },
              { word: 'Persuasion', translation: 'Iqna', type: 'noun', explanation: 'Iqna means helping someone accept an idea through reasons.', example: 'Use it when presenting an argument or proposal.' },
              { word: 'Delivery', translation: 'Ilqa', type: 'noun', explanation: 'Ilqa means how you present words with voice and presence.', example: 'Use it when practicing speeches or presentations.' },
            ],
            phrases: [
              { text: 'A kind persuasive word opens hearts and minds.', translation: 'Arabic phrase practice coming soon.' },
              { text: 'Speak clearly so people can understand your message.', translation: 'Arabic phrase practice coming soon.' },
            ],
            quiz: [
            {
                        "question": "“هٰذَا” (Hadha) শব্দের সঠিক বাংলা অর্থ কোনটি?",
                        "options": [
                                    "সে / তিনি",
                                    "এটি / এই",
                                    "তারা",
                                    "তুমি"
                        ],
                        "answer": 1,
                        "explanation": "“هٰذَا” (Hadha) শব্দের অর্থ হলো “এটি” বা “এই”।"
            },
            {
                        "question": "“একটি বাড়ি” এর সঠিক আরবি প্রতিশব্দ কোনটি?",
                        "options": [
                                    "مَسْجِدٌ (Masjidun)",
                                    "بَابٌ (Baabun)",
                                    "كِتَابٌ (Kitaabun)",
                                    "بَيْتٌ (Baytun)"
                        ],
                        "answer": 3,
                        "explanation": "“بَيْتٌ” (Baytun) অর্থ হলো একটি বাড়ি।"
            },
            {
                        "question": "“এটি একটি মসজিদ” এর সঠিক আরবি অনুবাদ কী হবে?",
                        "options": [
                                    "هٰذَا بَيْتٌ (Hadha baytun)",
                                    "هٰذَا مَسْجِدٌ (Hadha masjidun)",
                                    "هٰذَا بَابٌ (Hadha baabun)",
                                    "مَا هٰذَا؟ (Ma hadha?)"
                        ],
                        "answer": 1,
                        "explanation": "“هٰذَا َمْسِجٌد” (Hadha masjidun) অর্থ হলো “এটি একটি মসজিদ।”"
            },
            {
                        "question": "“مَا هٰذَا؟” (Ma hadha?) প্রশ্নটির সঠিক অর্থ কী?",
                        "options": [
                                    "এটি কী?",
                                    "তুমি কে?",
                                    "কেমন আছো?",
                                    "তোমার নাম কী?"
                        ],
                        "answer": 0,
                        "explanation": "“مَا” (Ma) অর্থ কী এবং “هٰذَا” (Hadha) অর্থ এটি। অর্থাৎ “مَا هٰذَا؟” অর্থ “এটি কী?”।"
            },
            {
                        "question": "“এটি একটি চাবি” - এর সঠিক আরবি অনুবাদ কোনটি?",
                        "options": [
                                    "هٰذَا قَلَمٌ",
                                    "هٰذَا كِتَابٌ",
                                    "هٰذَا مِفْتَاحٌ",
                                    "هٰذَا بَابٌ"
                        ],
                        "answer": 2,
                        "explanation": "“مِفْتَاحٌ” (Miftaahun) অর্থ চাবি। তাই “هٰذَا مِفْتَاحٌ” অর্থ “এটি একটি চাবি।”"
            },
            {
                        "question": "কেউ যদি প্রশ্ন করে “مَا اسْمُكَ؟” (Maa ismuka?), তবে এর উত্তর সাধারণত কীভাবে শুরু করতে হবে?",
                        "options": [
                                    "بِخَيْرٍ (Bi-khayrin)",
                                    "كَيْفَ (Kayfa)",
                                    "اِسْمِي... (Ismii...)",
                                    "هٰذَا... (Hadha...)"
                        ],
                        "answer": 2,
                        "explanation": "“مَا اسْمُكَ؟” মানে “তোমার নাম কী?”। এর উত্তরে নিজের নাম বলতে “اِسْمِي...” (আমার নাম...) ব্যবহার করতে হয়।"
            },
            {
                        "question": "“كَيْفَ حَالُكَ؟” (Kayfa haaluka?) বাক্যটি দ্বারা কী বোঝানো হয়?",
                        "options": [
                                    "তোমার নাম কী?",
                                    "তুমি কোথা থেকে এসেছ?",
                                    "এটি কি একটি বাড়ি?",
                                    "তুমি কেমন আছো?"
                        ],
                        "answer": 3,
                        "explanation": "“كَيْفَ حَالُكَ؟” অর্থ হলো “তুমি কেমন আছো?”।"
            },
            {
                        "question": "“كَيْفَ حَالُكَ؟” (তুমি কেমন আছো?) প্রশ্নের জবাবে সাধারণত কী বলা হয়?",
                        "options": [
                                    "اِسْمِي خَالِدٌ",
                                    "بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ",
                                    "هٰذَا بَيْتٌ",
                                    "نَعَمْ، هٰذَا مَسْجِدٌ"
                        ],
                        "answer": 1,
                        "explanation": "কুশল জিজ্ঞাসার জবাবে বলতে হয় “بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ” (ভালো আছি, আলহামদুলিল্লাহ)।"
            },
            {
                        "question": "ছবিতে একটি কলম দেখিয়ে যদি প্রশ্ন করা হয় “مَا هٰذَا؟” (এটি কী?), তবে সঠিক উত্তর কোনটি হবে?",
                        "options": [
                                    "هٰذَا كِتَابٌ",
                                    "هٰذَا قَلَمٌ",
                                    "هٰذَا بَابٌ",
                                    "هٰذَا بَيْتٌ"
                        ],
                        "answer": 1,
                        "explanation": "“قَلَمٌ” (Qalamun) অর্থ হলো কলম। তাই সঠিক উত্তর “هٰذَا قَلَمٌ” (এটি একটি কলম)।"
            },
            {
                        "question": "“أَهٰذَا بَيْتٌ؟” (A-hadha baytun?) এর অর্থ কী এবং এর সঠিক উত্তর নিচের কোনটি?",
                        "options": [
                                    "এটি কি একটি মসজিদ? - نَعَمْ، هٰذَا مَسْجِدٌ",
                                    "এটি কি একটি বাড়ি? - نَعَمْ، هٰذَا بَيْتٌ",
                                    "এটি কি একটি দরজা? - هٰذَا بَابٌ",
                                    "এটি কি একটি বই? - هٰذَا كِتَابٌ"
                        ],
                        "answer": 1,
                        "explanation": "“أَهٰذَا بَيْتٌ؟” অর্থ “এটি কি একটি বাড়ি?” এবং এর উত্তর হলো “نَعَمْ، هٰذَا بَيْتٌ” (হ্যাঁ, এটি একটি বাড়ি)।"
            }
],
          },
          // Day 3 (PDF 2)
          {
            id: 'ar-les-3',
            title: 'Lesson 3: Arabic Reading Practice (PDF 02)',
            description: 'Continue your Arabic learning with this Day 3 reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 4 (Quiz 2)
          {
            id: 'ar-les-4',
            title: 'Lesson 4: MCQ Quiz Practice',
            description: 'Practice Arabic greetings and leadership vocabulary.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
            {
                        "question": "আরবী ভাষায় “কে?” (মানুষের ক্ষেত্রে) জিজ্ঞাসার জন্য সঠিক শব্দ কোনটি?",
                        "options": [
                                    "مَا (Maa)",
                                    "مَنْ (Man)",
                                    "أَيْنَ (Ayna)",
                                    "مِنْ (Min)"
                        ],
                        "answer": 1,
                        "explanation": "আরবী ভাষায় মানুষের পরিচয় জানতে “مَنْ” (Man) ব্যবহার করা হয়।"
            },
            {
                        "question": "“ذٰلِكَ” (Dhaalika) শব্দটির সঠিক বাংলা অর্থ কোনটি?",
                        "options": [
                                    "এটি / এই (কাছের)",
                                    "সে / তিনি (অনুপস্থিত)",
                                    "ওইটি / ওই (দূরের)",
                                    "তুমি (উপস্থিত)"
                        ],
                        "answer": 2,
                        "explanation": "“ذٰلِكَ” (Dhaalika) অর্থ হলো “ওইটি” বা “ওই”, যা দূরের কোনো পুরুষবাচক বস্তুকে নির্দেশ করতে ব্যবহৃত হয়।"
            },
            {
                        "question": "“ইনি একজন ডাক্তার।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "هٰذَا مُدَرِّسٌ",
                                    "هٰذَا طَبِيبٌ",
                                    "هٰذَا تَاجِرٌ",
                                    "هٰذَا إِمَامٌ"
                        ],
                        "answer": 1,
                        "explanation": "“طَبِيبٌ” (Tabiibun) অর্থ ডাক্তার। তাই সঠিক বাক্যটি হলো “هٰذَا طَبِيبٌ”।"
            },
            {
                        "question": "“مَا ذٰلِكَ؟” (Maa dhaalika?) প্রশ্নটির সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "ইনি কে?",
                                    "এটি কী?",
                                    "ওইটি কী?",
                                    "তুমি কে?"
                        ],
                        "answer": 2,
                        "explanation": "“مَا” অর্থ কী এবং “ذٰلِكَ” অর্থ ওইটি। তাই “مَا ذٰلِكَ؟” অর্থ “ওইটি কী?”।"
            },
            {
                        "question": "দূরে একটি তারা (Star - نَجْمٌ) দেখিয়ে যদি প্রশ্ন করা হয় “مَا ذٰلِكَ؟” (ওইটি কী?), তবে সঠিক উত্তর কোনটি হবে?",
                        "options": [
                                    "ذٰلِكَ بَيْتٌ",
                                    "ذٰلِكَ نَجْمٌ",
                                    "هٰذَا نَجْمٌ",
                                    "ذٰلِكَ مَسْجِدٌ"
                        ],
                        "answer": 1,
                        "explanation": "“نَجْمٌ” (Najmun) অর্থ তারা। দূরের জিনিস বোঝাতে “ذٰلِكَ” ব্যবহার করা হয়েছে। তাই সঠিক উত্তর “ذٰلِكَ نَجْمٌ” (ওইটি একটি তারা)।"
            },
            {
                        "question": "“مِنْ أَيْنَ أَنْتَ؟” (Min ayna anta?) বাক্যটি দ্বারা কী জানতে চাওয়া হয়?",
                        "options": [
                                    "তোমার নাম কী?",
                                    "তুমি কেমন আছো?",
                                    "তুমি কোথা থেকে এসেছ?",
                                    "তোমার পেশা কী?"
                        ],
                        "answer": 2,
                        "explanation": "“مِنْ أَيْنَ أَنْتَ؟” অর্থ হলো “তুমি কোথা থেকে এসেছ?”।"
            },
            {
                        "question": "“আমি পাকিস্তান থেকে এসেছি।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "أَنَا بَاكِسْتَانِيٌّ",
                                    "أَنَا مِنْ بَاكِسْتَانَ",
                                    "أَنَا مِنْ تُرْكِيَا",
                                    "أَنَا تُرْكِيٌّ"
                        ],
                        "answer": 1,
                        "explanation": "“أَنَا مِنْ بَاكِسْتَانَ” (Anaa min Baakistaan) অর্থ “আমি পাকিস্তান থেকে এসেছি।”"
            },
            {
                        "question": "“َهْل أَنْتَ بَاكِسْتَانِيٌّ؟” (তুমি কি একজন পাকিস্তানি?) এর জবাবে হ্যাঁ-সূচক উত্তরটি কী হবে?",
                        "options": [
                                    "لاَ، أَنَا تُرْكِيٌّ",
                                    "نَعَمْ، أَنَا بَاكِسْتَانِيٌّ",
                                    "نَعَمْ، أَنَا مِنْ بَاكِسْتَانَ",
                                    "اِسْمِي شَرِيفٌ"
                        ],
                        "answer": 1,
                        "explanation": "জাতীয়তাবাচক প্রশ্ন “َهْل أَنْتَ بَاكِسْتَانِيٌّ؟” এর হ্যাঁ-সূচক জবাব হলো “نَعَمْ، أَنَا بَاكِسْتَانِيٌّ” (হ্যাঁ, আমি পাকিস্তানি)।"
            },
            {
                        "question": "“আমি তুর্কি (Turkiyyun)।” এর সঠিক আরবী বাক্য কোনটি?",
                        "options": [
                                    "أَنَا تُرْكِيٌّ",
                                    "أَنَا مِنْ تُرْكِيَا",
                                    "أَنَا بَاكِسْتَانِيٌّ",
                                    "أَنَا مِنْ بَاكِسْتَانَ"
                        ],
                        "answer": 0,
                        "explanation": "“أَنَا تُرْكِيٌّ” (Anaa Turkiyyun) অর্থ “আমি তুর্কি।” (জাতীয়তা নির্দেশক)।"
            },
            {
                        "question": "একজন শিক্ষককে দেখিয়ে যদি প্রশ্ন করা হয় “َمْن هٰذَا؟” (ইনি কে?), তবে সঠিক আরবী উত্তর কোনটি?",
                        "options": [
                                    "هٰذَا تَاجِرٌ",
                                    "هٰذَا طَبِيبٌ",
                                    "هٰذَا مُدَرِّسٌ",
                                    "هٰذَا إِمَامٌ"
                        ],
                        "answer": 2,
                        "explanation": "“مُدَرِّسٌ” (Mudarrisun) অর্থ শিক্ষক। তাই সঠিক উত্তর হলো “هٰذَا مُدَرِّسٌ” (ইনি একজন শিক্ষক)।"
            }
],
          },
          // Day 5 (PDF 3)
          {
            id: 'ar-les-5',
            title: 'Lesson 5: Arabic Reading Practice (PDF 03)',
            description: 'Strengthen your Arabic skills with this Day 5 reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 6 (Quiz 3)
          {
            id: 'ar-les-6',
            title: 'Lesson 6: MCQ Quiz Practice',
            description: 'Practice Arabic leadership terms and meanings.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'Taathir (تأثير) শব্দের অর্থ কী?',
                options: ['সততা', 'প্রভাব', 'নেতৃত্ব', 'দায়িত্ব'],
                answer: 1,
                explanation: 'Taathir (تأثير) অর্থ হলো প্রভাব।',
              },
              {
                question: 'Masuliyyah (مسؤولية) শব্দের সঠিক অর্থ কোনটি?',
                options: ['সততা', 'প্রভাব', 'নেতৃত্ব', 'দায়িত্ব'],
                answer: 3,
                explanation: 'Masuliyyah (مسؤولية) অর্থ হলো দায়িত্ব।',
              },
            ],
          },
          // Day 7 (PDF 4)
          {
            id: 'ar-les-7',
            title: 'Lesson 7: Arabic Reading Practice (PDF 04)',
            description: 'Build on your progress with this Day 7 Arabic reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 8 (Quiz 4)
          {
            id: 'ar-les-8',
            title: 'Lesson 8: MCQ Quiz Practice',
            description: 'Practice Arabic public speaking and rhetoric vocabulary.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'Balaghah (بلاغة) শব্দের অর্থ কী?',
                options: ['উপস্থাপন', 'প্ররোচনা', 'বাগ্মিতা', 'সততা'],
                answer: 2,
                explanation: 'Balaghah (بلاغة) অর্থ হলো বাগ্মিতা (Eloquence).',
              },
              {
                question: 'Iqna (إقناع) বলতে কী বোঝায়?',
                options: ['উপস্থাপন', 'প্ররোচনা/প্রভাবিত করা', 'বাগ্মিতা', 'সততা'],
                answer: 1,
                explanation: 'Iqna (إقناع) বলতে প্ররোচনা বা প্রভাবিত করা (Persuasion) বোঝায়।',
              },
            ],
          },
          // Day 9 (PDF 5)
          {
            id: 'ar-les-9',
            title: 'Lesson 9: Arabic Reading Practice (PDF 05)',
            description: 'Keep improving with this Day 9 Arabic reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 10 (Quiz 5)
          {
            id: 'ar-les-10',
            title: 'Lesson 10: MCQ Quiz Practice',
            description: 'Practice public speaking and core leadership vocabulary.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'Ilqa (إلقاء) শব্দের অর্থ কী?',
                options: ['বাগ্মিতা', 'প্ররোচনা', 'উপস্থাপন/বক্তৃতা প্রদান', 'দায়িত্ব'],
                answer: 2,
                explanation: 'Ilqa (إلقاء) শব্দের অর্থ হলো উপস্থাপন বা বক্তৃতা প্রদান (Delivery).',
              },
              {
                question: 'নেতৃত্ব বোঝাতে নিচের কোন আরবি শব্দটি সঠিক?',
                options: ['Nazahah', 'Qiyadah', 'Taathir', 'Ilqa'],
                answer: 1,
                explanation: 'নেতৃত্ব বোঝাতে সঠিক আরবি শব্দ হলো Qiyadah (قيادة)।',
              },
            ],
          },
          // Day 11 (PDF 6)
          {
            id: 'ar-les-11',
            title: 'Lesson 11: Arabic Reading Practice (PDF 06)',
            description: 'Expand your learning with this Day 11 Arabic reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 12 (Quiz 6)
          {
            id: 'ar-les-12',
            title: 'Lesson 12: MCQ Quiz Practice',
            description: 'Review integrity and influence terms in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'সততা বোঝাতে নিচের কোন আরবি শব্দটি ব্যবহার করা হয়?',
                options: ['Nazahah', 'Qiyadah', 'Iqna', 'Balaghah'],
                answer: 0,
                explanation: 'সততা বোঝাতে Nazahah (نزاهة) শব্দটি ব্যবহৃত হয়।',
              },
              {
                question: 'প্রভাব বা Influence বোঝাতে কোন শব্দটি ব্যবহৃত হয়?',
                options: ['Ilqa', 'Taathir', 'Masuliyyah', 'Nazahah'],
                answer: 1,
                explanation: 'প্রভাব বোঝাতে Taathir (تأثير) ব্যবহৃত হয়।',
              },
            ],
          },
          // Day 13 (PDF 7)
          {
            id: 'ar-les-13',
            title: 'Lesson 13: Arabic Reading Practice (PDF 07)',
            description: 'Deepen your Arabic practice with this Day 13 learning resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 14 (Quiz 7)
          {
            id: 'ar-les-14',
            title: 'Lesson 14: MCQ Quiz Practice',
            description: 'Practice Arabic responsibility and eloquence terms.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'দায়িত্ব বা Responsibility বোঝাতে সঠিক আরবি শব্দ কোনটি?',
                options: ['Qiyadah', 'Nazahah', 'Masuliyyah', 'Iqna'],
                answer: 2,
                explanation: 'দায়িত্ব বোঝাতে Masuliyyah (مسؤولية) শব্দটি সঠিক।',
              },
              {
                question: 'বাগ্মিতা বা Eloquence বোঝাতে সঠিক আরবি শব্দ কোনটি?',
                options: ['Balaghah', 'Ilqa', 'Taathir', 'Nazahah'],
                answer: 0,
                explanation: 'বাগ্মিতা বোঝাতে Balaghah (بلاغة) সঠিক।',
              },
            ],
          },
          // Day 15 (PDF 8)
          {
            id: 'ar-les-15',
            title: 'Lesson 15: Arabic Reading Practice (PDF 08)',
            description: 'Continue building confidence with this Day 15 Arabic learning resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 16 (Quiz 8)
          {
            id: 'ar-les-16',
            title: 'Lesson 16: MCQ Quiz Practice',
            description: 'Practice Arabic speech delivery and persuasion.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'প্ররোচনা বা Persuasion বোঝাতে কোন আরবি শব্দটি সঠিক?',
                options: ['Qiyadah', 'Iqna', 'Ilqa', 'Nazahah'],
                answer: 1,
                explanation: 'প্ররোচনা বোঝাতে Iqna (إقناع) সঠিক।',
              },
              {
                question: 'বক্তৃতা উপস্থাপন বা Delivery বোঝাতে নিচের কোনটি সঠিক?',
                options: ['Ilqa', 'Balaghah', 'Taathir', 'Masuliyyah'],
                answer: 0,
                explanation: 'উপস্থাপন বোঝাতে Ilqa (إلقاء) সঠিক।',
              },
            ],
          },
          // Day 17 (PDF 9)
          {
            id: 'ar-les-17',
            title: 'Lesson 17: Arabic Reading Practice (PDF 09)',
            description: 'Advance your Arabic learning with this Day 17 reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 18 (Quiz 9)
          {
            id: 'ar-les-18',
            title: 'Lesson 18: MCQ Quiz Practice',
            description: 'Review common Arabic greetings and expressions.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'আরби ভাষায় কুশল জিজ্ঞেস করতে নিচের কোন বাক্যটি সঠিক?',
                options: ['মিন আইনা আন্তা?', 'কাইফা হালুকা?', 'মা ইসমুকা?', 'আহলান ওয়া সাহলান'],
                answer: 1,
                explanation: 'কুশল বা কেমন আছো তা জিজ্ঞাসা করতে “কাইফা হালুকা?” ব্যবহৃত হয়।',
              },
              {
                question: 'পুরুষবাচক সম্বোধনে "কেমন আছো?" জিজ্ঞেস করতে কোনটি সঠিক?',
                options: ['কাইফা হালুকা?', 'কাইফা হালুকি?', 'মা ইসমুকা?', 'আনা মিনাল মাগরিব'],
                answer: 0,
                explanation: 'পুরুষের ক্ষেত্রে “কাইফা হালুকা?” ব্যবহার করা হয়।',
              },
            ],
          },
          // Day 19 (PDF 10)
          {
            id: 'ar-les-19',
            title: 'Lesson 19: Arabic Reading Practice (PDF 10)',
            description: 'Keep progressing with this Day 19 Arabic reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 20 (Quiz 10)
          {
            id: 'ar-les-20',
            title: 'Lesson 20: MCQ Quiz Practice',
            description: 'Review female greetings and answers in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'নারীবাচক সম্বোধনে "কেমন আছো?" জিজ্ঞেস করতে কোনটি সঠিক?',
                options: ['কাইফা হালুকা?', 'কাইফা হালুকি?', 'মা ইসমুকা?', 'আনা বাংলাদেশিয়্যাতুন'],
                answer: 1,
                explanation: 'নারীদের ক্ষেত্রে “কাইফা হালুকি?” সঠিক বাক্য।',
              },
              {
                question: "কেউ জিজ্ঞেস করল 'কাইফা হালুকা?', সঠিক উত্তর কী হবে?",
                options: ['ইসমি আহমাদ', 'আনা মিনাল উরদুন', 'বিখাইরিন, আলহামদুলিল্লাহ', 'আনা তালিবুন'],
                answer: 2,
                explanation: 'কেমন আছো প্রশ্নের উত্তর সাধারণত “বিখাইরিন, আলহামদুলিল্লাহ” (ভালো আছি, আলহামদুলিল্লাহ) হয়।',
              },
            ],
          },
          // Day 21 (PDF 11)
          {
            id: 'ar-les-21',
            title: 'Lesson 21: Arabic Reading Practice (PDF 11)',
            description: 'Reinforce your progress with this Day 21 Arabic reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 22 (Quiz 11)
          {
            id: 'ar-les-22',
            title: 'Lesson 22: MCQ Quiz Practice',
            description: 'Practice introducing names in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'কারও নাম জিজ্ঞাসা করতে কোন বাক্যটি ব্যবহার করা হয়?',
                options: ['মিন আইনা আন্তা?', 'মা ইসমুকা?', 'কাইফা হালুকা?', 'আহলান ওয়া সাহলান'],
                answer: 1,
                explanation: 'কারও নাম জানতে চাইলে “মা ইসমুকা?” (আপনার নাম কী?) বলা হয়।',
              },
              {
                question: "Educator জিজ্ঞেস করলেন 'মা ইসমুকা?', সঠিক উত্তর কোনটি?",
                options: ['ইসমি আহমাদ', 'আনা বিখাইরিন', 'আনা মিনাল উরদুন', 'আনা তালিবুন'],
                answer: 0,
                explanation: 'নামের উত্তরে “ইসমি [নাম]” (আমার নাম [নাম]) বলা হয়।',
              },
            ],
          },
          // Day 23 (PDF 12)
          {
            id: 'ar-les-23',
            title: 'Lesson 23: Arabic Reading Practice (PDF 12)',
            description: 'Broaden your Arabic knowledge with this Day 23 reading and practice resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 24 (Quiz 12)
          {
            id: 'ar-les-24',
            title: 'Lesson 24: MCQ Quiz Practice',
            description: 'Practice identifying countries and origins in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'আপনি কোথা থেকে এসেছেন তা জানতে কোন প্রশ্নটি করা হয়?',
                options: ['মা ইসমুকা?', 'মিন আইনা আন্তা?', 'কাইফা হালুকা?', 'আহলান ওয়া সাহলান'],
                answer: 1,
                explanation: 'কোথা থেকে এসেছেন তা জানতে “মিন আইনা আন্তা?” (তুমি কোথা থেকে এসেছ?) ব্যবহৃত হয়।',
              },
              {
                question: "কেউ জিজ্ঞেস করল 'মিন আইনা আন্তা?', সঠিক উত্তর কোনটি?",
                options: ['আনা মিসর', 'আনা মিন মিসর', 'আনা মিসরিউন', 'জিনসিয়াতি মিসর'],
                answer: 1,
                explanation: '“আনা মিন মিসর” এর অর্থ “আমি মিশর থেকে এসেছি।”',
              },
            ],
          },
          // Day 25 (PDF 13)
          {
            id: 'ar-les-25',
            title: 'Lesson 25: Arabic Reading Practice (PDF 13)',
            description: 'Develop your Arabic skills further with this Day 25 learning resource.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 26 (Quiz 13)
          {
            id: 'ar-les-26',
            title: 'Lesson 26: MCQ Quiz Practice',
            description: 'Practice nationalities in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'জাতীয়তা জানতে পুরুষবাচক সম্বোধনে কোনটি সঠিক?',
                options: ['মিন আইনা আন্তা?', 'মা জিনসিয়্যাতুকা আন্তা?', 'কাইফা হালুকা?', 'মা ইসমুকা?'],
                answer: 1,
                explanation: 'জাতীয়তা জানতে পুরুষ সম্বোধনে “মা জিনসিয়্যাতুকা আন্তা?” ব্যবহৃত হয়।',
              },
              {
                question: 'কোনো ছাত্রী বাংলাদেশি হলে তার সঠিক জাতীয়তা প্রকাশ কোনটি?',
                options: ['আনা বাংলাদেশ', 'আনা মিন বাংলাদেশিয়্যাহ', 'আনা বাংলাদেশিয়্যাতুন', 'আনা বাংলাদেশিয়্যুন'],
                answer: 2,
                explanation: 'ছাত্রী (স্ত্রীলিঙ্গ) এর জাতীয়তা প্রকাশে “আনা বাংলাদেশিয়্যাতুন” সঠিক বাক্য।',
              },
            ],
          },
        ],
      },
    ],
  },
};

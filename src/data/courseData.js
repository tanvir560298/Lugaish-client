export const COURSE_DATA = {
  english: {
    title: 'English Spelling Masterclass Pathway',
    flag: '🇬🇧',
    description: 'Master English spelling rules and vocabulary with daily PDF lessons and quizzes.',
    accent: 'blue',
    modules: [
      {
        id: 'en-mod-1',
        title: 'English Spelling Masterclass',
        description: 'A comprehensive 30-day curriculum covering the most critical spelling rules.',
        lessons: Array.from({ length: 30 }, (_, index) => {
          const day = index + 1;
          if (day % 2 !== 0) {
            return {
              id: `en-les-${day}`,
              title: `Lesson ${day}: English Spelling (PDF)`,
              description: `Review English spelling rules and root words on Day ${day}.`,
              langCode: 'en-US',
              cards: [],
              phrases: [],
              quiz: [],
            };
          } else {
            const spellingQuizzes = [
              [
                { question: 'Choose the correct spelling:', options: ['Receive', 'Recieve', 'Receve', 'Recive'], answer: 0, explanation: 'Remember "i before e except after c".' },
                { question: 'Select the correct spelling:', options: ['Believe', 'Beleive', 'Belive', 'Beleev'], answer: 0, explanation: 'In "believe", i comes before e.' },
                { question: 'Which word is spelled correctly?', options: ['Separate', 'Seperate', 'Seperat', 'Separret'], answer: 0, explanation: 'The word is "separate" with an "a" in the middle.' }
              ],
              [
                { question: 'Identify the correct spelling:', options: ['Definitely', 'Definately', 'Definetely', 'Definatly'], answer: 0, explanation: 'It comes from "finite", so it has "definite" + "ly".' },
                { question: 'Choose the correct spelling:', options: ['Until', 'Untill', 'Untile', 'Untyl'], answer: 0, explanation: '"Until" ends with a single "l".' },
                { question: 'Select the correct spelling:', options: ['Calendar', 'Calender', 'Calandar', 'Calander'], answer: 0, explanation: 'The correct spelling is "calendar".' }
              ]
            ];
            const qIdx = Math.floor(day / 2) % spellingQuizzes.length;
            return {
              id: `en-les-${day}`,
              title: `Lesson ${day}: Spelling Practice Quiz`,
              description: `Complete the review quiz to finish Day ${day}.`,
              langCode: 'en-US',
              cards: [],
              phrases: [],
              quiz: spellingQuizzes[qIdx],
            };
          }
        }),
      }
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
                        "question": "আরবী শব্দে “ال” (Al-) যুক্ত হলে শব্দটির কী পরিবর্তন হয়?",
                        "options": [
                                    "শব্দটি অনির্দিষ্ট (Indefinite) হয়ে যায়",
                                    "শব্দটি নির্দিষ্ট (Definite) হয়ে যায় এবং তানউইন উঠে যায়",
                                    "শব্দটির অর্থ পরিবর্তন হয় না",
                                    "শব্দটির শেষে দুই জবর যুক্ত হয়"
                        ],
                        "answer": 1,
                        "explanation": "আরবী শব্দে “ال” (Al-) যুক্ত হলে শব্দটি নির্দিষ্ট (Definite) হয় এবং এর তানউইন উঠে গিয়ে এক হরকত বিশিষ্ট হয়।"
            },
            {
                        "question": "“بَيْتٌ” (Baytun) শব্দটিকে নির্দিষ্ট (Definite) করতে চাইলে সঠিক রূপ কোনটি হবে?",
                        "options": [
                                    "اَلْبَيْتٌ (Al-baytun)",
                                    "بَيْتُ اَلْ (Baytu al)",
                                    "اَلْبَيْتُ (Al-baytu)",
                                    "بَيْتُোনٌ (Baytuunun)"
                        ],
                        "answer": 2,
                        "explanation": "“بَيْتٌ” (Baytun) এর নির্দিষ্ট রূপ হলো “اَلْبَيْتُ” (Al-baytu)।"
            },
            {
                        "question": "আরবী ভাষায় “ভাঙা” (Broken) এর প্রতিশব্দ কোনটি?",
                        "options": [
                                    "مَفْتُوحٌ (Maftuuhun)",
                                    "مَكْسُورٌ (Maksuurun)",
                                    "جَالِسٌ (Jaalisun)",
                                    "وَاقِفٌ (Waaqifun)"
                        ],
                        "answer": 1,
                        "explanation": "আরবী ভাষায় “ভাঙা” বা Broken এর প্রতিশব্দ হলো “مَكْسُورٌ” (Maksuurun)।"
            },
            {
                        "question": "“দরজাটি খোলা।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "اَلْبَابُ مَكْسُورٌ",
                                    "اَلْبَابُ مَفْتُوحٌ",
                                    "اَلْبَابُ جَالِسٌ",
                                    "هٰذَا بَابٌ"
                        ],
                        "answer": 1,
                        "explanation": "“اَلْبَابُ مَفْتُوحٌ” (Al-baabu maftuuhun) অর্থ “দরজাটি খোলা।”"
            },
            {
                        "question": "“اَلْمُدَرِّسُ وَاقِفٌ” (Al-mudarrisu waaqifun) বাক্যটির সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "শিক্ষকটি বসে আছেন।",
                                    "ছাত্রটি দাঁড়িয়ে আছে।",
                                    "শিক্ষকটি দাঁড়িয়ে আছেন।",
                                    "প্রকৌশলীটি কাজ করছেন।"
                        ],
                        "answer": 2,
                        "explanation": "“اَلْمُدَرِّسُ وَاقِفٌ” অর্থ “শিক্ষকটি দাঁড়িয়ে আছেন।”"
            },
            {
                        "question": "“ইনি আমার ভাই, উনি একজন শিক্ষক।” এর আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "هٰذَا صَدِيقِي، هُوَ مُهَنْدِسٌ",
                                    "هٰذَا أَخِي، هُوَ مُدَرِّسٌ",
                                    "هٰذَا أَخِي، هُوَ طَبِيبٌ",
                                    "هٰذَا مُدَرِّسٌ"
                        ],
                        "answer": 1,
                        "explanation": "“هٰذَا أَخِي، هُوَ مُدَرِّسٌ” (Hadha akhii, huwa mudarrisun) অর্থ “ইনি আমার ভাই, উনি একজন শিক্ষক।”"
            },
            {
                        "question": "“مُهَنْدِسٌ” (Muhandisun) শব্দটির সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "ব্যবসায়ী",
                                    "শিক্ষক",
                                    "ডাক্তার",
                                    "প্রকৌশলী"
                        ],
                        "answer": 3,
                        "explanation": "“مُهَنْدِسٌ” (Muhandisun) শব্দের অর্থ হলো প্রকৌশলী (Engineer)।"
            },
            {
                        "question": "“ইনি আমার বন্ধু, উনি একজন প্রকৌশলী।” - এর আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "هٰذَا صَدِيقِي، هُوَ مُهَنْدِسٌ",
                                    "هٰذَا أَخِي, هُوَ مُدَرِّسٌ",
                                    "هٰذَا طَبِيبٌ",
                                    "هٰذَا صَدِيقِي، هُوَ تَاجِرٌ"
                        ],
                        "answer": 0,
                        "explanation": "“هٰذَا صَدِيقِي، هُوَ مُهَنْدِسٌ” (Hadha sadiiqii, huwa muhandisun) অর্থ “ইনি আমার বন্ধু, উনি একজন প্রকৌশলী।”"
            },
            {
                        "question": "বিদায় জানানোর জন্য আরবী কথোপকথনে সাধারণত কোন বাক্যটি ব্যবহার করা হয়?",
                        "options": [
                                    "أَهْلًا وَسَهْلًا (Ahlan wa sahlan)",
                                    "كَيْفَ حَالُكَ (Kayfa haaluka)",
                                    "مَعَ السَّلَامَةِ (Ma'as-salaamah)",
                                    "مَا اسْمُكَ (Maa ismuka)"
                        ],
                        "answer": 2,
                        "explanation": "আরবীতে বিদায় নেওয়ার সময় “مَعَ السَّلَامَةِ” (সালামের সাথে থাকুন / বিদায়) বলা হয়।"
            },
            {
                        "question": "“ছেলেটি বসা।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "اَلْوَلَدُ وَاقِفٌ",
                                    "اَلْوَلَدُ جَالِسٌ",
                                    "هٰذَا وَلَدٌ",
                                    "اَلْوَلَدُ مَكْسُورٌ"
                        ],
                        "answer": 1,
                        "explanation": "“اَلْوَلَدُ جَالِسٌ” (Al-waladu jaalisun) অর্থ “ছেলেটি বসা।”"
            }
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
                        "question": "আরবী ভাষায় “فِي” (Fii) এবং “عَلَى” (Alaa) শব্দ দুটিকে কী বলা হয়?",
                        "options": [
                                    "সর্বনাম (Pronouns)",
                                    "হারফে জার / অব্যয় (Prepositions)",
                                    "ইশারা / নির্দেশক (Pointers)",
                                    "বিশেষণ (Adjectives)"
                        ],
                        "answer": 1,
                        "explanation": "“فِي” (মধ্যে) এবং “عَلَى” (উপরে) শব্দ দুটি হলো হারফে জার (Prepositions)।"
            },
            {
                        "question": "হারফে জার (যেমন: فِي) এর পরের বিশেষ্যটির (Noun) শেষ হরকতে কী বসে?",
                        "options": [
                                    "পেশ / Dammah",
                                    "জবর / Fathah",
                                    "জের / Kasrah",
                                    "সাকিন / Sukun"
                        ],
                        "answer": 2,
                        "explanation": "হারফে জার এর পরের বিশেষ্যটি মাজরুর হয় এবং এর শেষ অক্ষরে জের বা Kasrah বসে।"
            },
            {
                        "question": "“টেবিলের ওপরে” এর সঠিক আরবী রূপ কোনটি?",
                        "options": [
                                    "عَلَى الْمَكْتَبُ (‘Alaa al-maktabu)",
                                    "عَلَى الْمَكْتَبِ (‘Alaa al-maktabi)",
                                    "فِي الْمَكْتَبِ (Fii al-maktabi)",
                                    "عَلَى الْمَكْتَبَ (‘Alaa al-maktaba)"
                        ],
                        "answer": 1,
                        "explanation": "“عَلَى” হারফে জারের পরে “الْمَكْتَبِ” এর শেষে জের হয়ে সঠিক রূপ হবে “عَلَى الْمَكْتَبِ”।"
            },
            {
                        "question": "পুরুষবাচক নামের পরিবর্তে “সে/তিনি” বোঝাতে কোন আরবী সর্বনাম (Pronoun) ব্যবহৃত হয়?",
                        "options": [
                                    "هِيَ (Hiya)",
                                    "أَنْتَ (Anta)",
                                    "هُوَ (Huwa)",
                                    "أَنَا (Anaa)"
                        ],
                        "answer": 2,
                        "explanation": "পুরুষবাচক নামের পরিবর্তে “সে/তিনি” বোঝাতে “هُوَ” (Huwa) এবং স্ত্রীবাচকের ক্ষেত্রে “هِيَ” (Hiya) ব্যবহার করা হয়।"
            },
            {
                        "question": "“আমিনা রান্নাঘরে আছে।” - এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "آمِنَةُ فِي الْغُرْفَةِ",
                                    "آمِنَةُ عَلَى الْمَكْتَبِ",
                                    "آمِنَةُ فِي الْمَطْبَخِ",
                                    "هُوَ فِي الْمَطْبَخِ"
                        ],
                        "answer": 2,
                        "explanation": "“آمِنَةُ فِي الْمَطْبَخِ” (Aaminatu fii al-matbakhi) অর্থ “আমিনা রান্নাঘরে আছে।”"
            },
            {
                        "question": "আরবী ভাষায় “মা” এবং “বাবา” এর প্রতিশব্দ জুটি কোনটি?",
                        "options": [
                                    "جَدٌّ - جَدَّةٌ",
                                    "وَالِدٌ - وَالِدَةٌ",
                                    "أَخٌ - أُخْتٌ",
                                    "صَدِيقٌ - صَدِيقَةٌ"
                        ],
                        "answer": 1,
                        "explanation": "“وَالِدٌ” অর্থ বাবা এবং “وَالِدَةٌ” অর্থ মা।"
            },
            {
                        "question": "“শাজাতুন” (شَجَرَةٌ) শব্দের সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "পরিবার",
                                    "কক্ষ",
                                    "ঘর",
                                    "গাছ / বংশলতিকা"
                        ],
                        "answer": 3,
                        "explanation": "“شَجَرَةٌ” (Shajaratun) শব্দের অর্থ হলো গাছ বা বংশলতিকা।"
            },
            {
                        "question": "আরবী যুক্ত সর্বনাম “ـهُ” (-hu) এর সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "আমার (my)",
                                    "তোমার (your)",
                                    "তাঁর / তার (his)",
                                    "আমাদের (our)"
                        ],
                        "answer": 2,
                        "explanation": "যুক্ত সর্বনাম “ـهُ” (-hu) মালিকানা অর্থে “তার/তাঁর” (his) প্রকাশ করে।"
            },
            {
                        "question": "“ইনি তাঁর দাদা আবদুল মুত্তালিব।” বাক্যটির সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "هٰذَا وَالِدُهُ عَبْدُ اللَّهِ",
                                    "هٰذَا جَدُّهُ عَبْدُ الْمُطَّلِبِ",
                                    "هٰذِهِ وَالِدَتُهُ آمِنَةُ",
                                    "هٰذَا أَخِي"
                        ],
                        "answer": 1,
                        "explanation": "“جَدُّهُ” মানে তার দাদা। তাই বাক্যটির সঠিক আরবী হলো “هٰذَا جَدُّهُ عَبْدُ الْمُطَّلِبِ”।"
            },
            {
                        "question": "“آمِنَةُ فِي الْمَطْبَخِ” (আমিনা রান্নাঘরে) - এই বাক্যে আমিনার নাম পুনরায় না লিখে “সে রান্নাঘরে” বলতে চাইলে সঠিক আরবী বাক্য কী হবে?",
                        "options": [
                                    "هُوَ فِي الْمَطْبَخِ (Huwa fii al-matbakhi)",
                                    "هِيَ فِي الْمَطْبَخِ (Hiya fii al-matbakhi)",
                                    "أَنَا فِي الْمَطْبَخِ",
                                    "هٰذِهِ فِي الْمَطْبَخِ"
                        ],
                        "answer": 1,
                        "explanation": "আমিনা স্ত্রীবাচক হওয়ায় তার ক্ষেত্রে সর্বনাম “هِيَ” (Hiya) ব্যবহার করে সঠিক বাক্য হবে “هِيَ فِي الْمَطْبَخِ”।"
            }
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
                        "question": "আরবী ব্যাকরণে “মালিকানা গঠন” (Possession) কে কী বলা হয়?",
                        "options": [
                                    "হারফে জার ও মাজরুর",
                                    "মুদাফ ও মুদাফ ইলাইহি (Mudaf & Mudaf Ilayh)",
                                    "ইশারা ও বাদাল",
                                    "মুক্তাদা ও খাবার"
                        ],
                        "answer": 1,
                        "explanation": "আরবী ব্যাকরণে মালিকানা বা সম্বন্ধবাচক গঠনকে “মুদাফ ও মুদাফ ইলাইহি” বলা হয়।"
            },
            {
                        "question": "মুদাফ (Mudaf - প্রথম শব্দ) এর ক্ষেত্রে নিচের কোন নিয়মটি প্রযোজ্য?",
                        "options": [
                                    "শব্দের শুরুতে ال বসে এবং শেষে জের হয়",
                                    "শব্দের শুরুতে ال বসে না এবং শেষে তানউইন হয় না",
                                    "শব্দটি সবসময় স্ত্রীবাচক হয়",
                                    "শব্দের শেষে তানউইন বসে"
                        ],
                        "answer": 1,
                        "explanation": "মুদাফ বা সম্বন্ধযুক্ত প্রথম শব্দের শুরুতে কখনো ال বসে না এবং এর শেষে তানউইনও হয় না।"
            },
            {
                        "question": "“মুহাম্মদের বই” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "اَلْكِتَابُ مُحَمَّدٍ",
                                    "كِتَابُ مُحَمَّدٍ (Kitaabu Muhammadin)",
                                    "كِتَابٌ مُحَمَّدٌ",
                                    "كِتَابُ مُحَمَّদٌ"
                        ],
                        "answer": 1,
                        "explanation": "প্রথম শব্দ মুদাফ হওয়ায় তানউইন ও ال ছাড়া “كِتَابُ” এবং দ্বিতীয় শব্দ মুদাফ ইলাইহি হওয়ায় জেরযুক্ত “مُحَمَّدٍ” হয়ে সঠিক রূপ হবে “كِتَابُ مُحَمَّدٍ”।"
            },
            {
                        "question": "“Baytullaahi” (بَيْتُ اللَّهِ) শব্দগুচ্ছের সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "আল্লাহর রাসুল",
                                    "আল্লাহর ঘর",
                                    "আল্লাহর ক্ষমা",
                                    "আল্লাহর সৃষ্টি"
                        ],
                        "answer": 1,
                        "explanation": "“بَيْتُ اللَّهِ” (Baytullaahi) অর্থ আল্লাহর ঘর।"
            },
            {
                        "question": "“বন্ধ” (Closed) এর আরবী প্রতিশব্দ কোনটি?",
                        "options": [
                                    "مَفْتُوحٌ (Maftuuhun)",
                                    "مُغْلَقٌ (Mughlaqun)",
                                    "مَكْسُورٌ (Maksuurun)",
                                    "جَالِسٌ (Jaalisun)"
                        ],
                        "answer": 1,
                        "explanation": "“বন্ধ” বা Closed এর আরবী প্রতিশব্দ হলো “مُغْلَقٌ” (Mughlaqun)।"
            },
            {
                        "question": "আরবী ব্যাকরণে মামা ও খালা এর সঠিক প্রতিশব্দ কোনটি?",
                        "options": [
                                    "عَمٌّ - عَمَّةٌ",
                                    "خَالٌ - خَالَةٌ",
                                    "أَبٌ - أُمٌّ",
                                    "اِبْنٌ - بِنْتٌ"
                        ],
                        "answer": 1,
                        "explanation": "“خَالٌ” অর্থ মামা এবং “خَالَةٌ” অর্থ খালা।"
            },
            {
                        "question": "“ইনি আমার মা সাঈদা, উনি একজন ডাক্তার।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "هٰذَا وَالِدِي عَدْنَانُ, هُوَ مُهَنْدِسٌ",
                                    "هٰذِهِ وَالِدَتِي سَعِيدَةُ، هِيَ طَبِيبَةٌ",
                                    "هٰذِهِ وَالِدَتِي سَعِيدَةُ, هِيَ مُদَرِّسَةٌ",
                                    "هٰذِهِ خَالَتِي"
                        ],
                        "answer": 1,
                        "explanation": "মা স্ত্রীবাচক হওয়ায় “هٰذِهِ وَالِدَتِي سَعِيدَةُ” এবং পেসার ক্ষেত্রে “ِهيَ طَبِيبَةٌ” ব্যবহার করে সঠিক বাক্য হবে “هٰذِهِ وَالِدَتِي سَعِيدَةُ، هِيَ طَبِيبَةٌ”।"
            },
            {
                        "question": "“তোমার ছেলে” (পুরুষ শ্রোতার ক্ষেত্রে) এর আরবী প্রতিশব্দ কোনটি?",
                        "options": [
                                    "اِبْنِي (Ibnii)",
                                    "اِبْنُكَ (Ibnuka)",
                                    "اِبْنُهُ (Ibnuhu)",
                                    "بِنْتُكَ (Bintuka)"
                        ],
                        "answer": 1,
                        "explanation": "পুরুষ শ্রোতার ক্ষেত্রে “তোমার ছেলে” হবে “اِبْنُكَ” (Ibnuka)।"
            },
            {
                        "question": "“বইটি টেবিলের নিচে আছে।” এর সঠিক আরবী অনুবাদ কোনটি? (নিচে = تَحْتَ)",
                        "options": [
                                    "اَلْكِتَابُ عَلَى الْمَكْتَبِ",
                                    "اَلْكِتَابُ تَحْتَ الْمَكْتَبِ",
                                    "اَلْكِتَابُ فِي الْمَسْجِدِ",
                                    "اَلْكِتَابُ هُنَاك"
                        ],
                        "answer": 1,
                        "explanation": "“তহতা” (تَحْتَ) অর্থ নিচে। সঠিক বাক্যটি হলো “اَلْكِتَابُ تَحْتَ الْمَكْتَبِ”।"
            },
            {
                        "question": "“রজুলুন সালিহুন” (رَجُلٌ صَالِحٌ) শব্দগুচ্ছের সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "একজন বড় ব্যবসায়ী",
                                    "একজন নেককার মানুষ",
                                    "একজন সৎ শিক্ষক",
                                    "একজন দক্ষ প্রকৌশলী"
                        ],
                        "answer": 1,
                        "explanation": "“رَجُلٌ صَالِحٌ” (Rajulun saalihun) অর্থ একজন নেককার বা ভালো মানুষ।"
            }
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
                        "question": "আরবী ব্যাকরণে সাধারণত স্ত্রীবাচক শব্দের শেষে কোন চিহ্নটি থাকে?",
                        "options": [
                                    "আলিফ তানউইন (ًا)",
                                    "গোল তা (ة)",
                                    "লম্বা তা (ত)",
                                    "ইয়া (ي)"
                        ],
                        "answer": 1,
                        "explanation": "সাধারণত স্ত্রীবাচক বিশেষ্য বা গুণের শেষে গোল তা (ة) বা Taa Marbutah থাকে।"
            },
            {
                        "question": "আরবী ব্যাকরণে শরীরের কোন অঙ্গগুলো সাধারণত স্ত্রীবাচক (Feminine) হিসেবে বিবেচিত হয়?",
                        "options": [
                                    "যে অঙ্গগুলো একটি মাত্র থাকে (যেমন: নাক, মুখ)",
                                    "যে অঙ্গগুলো জোড়ায় জোড়ায় থাকে (যেমন: চোখ, কান, হাত, পা)",
                                    "হাড়ের সাথে যুক্ত অঙ্গসমূহ",
                                    "সবগুলোই পুরুষবাচক শব্দ"
                        ],
                        "answer": 1,
                        "explanation": "জোড়ায় জোড়ায় বা Paired body parts (চোখ, কান, হাত, পা ইত্যাদি) ব্যাকরণগতভাবে সবসময় স্ত্রীবাচক ধরা হয়।"
            },
            {
                        "question": "“এটি একটি ঘড়ি।” এর সঠিক আরবী অনুবাদ কোনটি? (ঘড়ি = سَاعَةٌ)",
                        "options": [
                                    "هٰذَا سَاعَةٌ",
                                    "هٰذِهِ سَاعَةٌ (Haadhihi saa'atun)",
                                    "ذٰلِكَ سَاعَةٌ",
                                    "هٰذِهِ مِكْوَاةٌ"
                        ],
                        "answer": 1,
                        "explanation": "ঘড়ি (سَاعَةٌ) স্ত্রীবাচক হওয়ায় সঠিক ইশারা হবে “هٰذِهِ”। অর্থাৎ “هٰذِهِ سَاعَةٌ”।"
            },
            {
                        "question": "নিচের কোন শব্দটি শেষে গোল তা (ة) না থাকা সত্ত্বেও ব্যাকরণগতভাবে স্ত্রীবাচক (Feminine) शब्द?",
                        "options": [
                                    "بَيْتٌ (Baytun)",
                                    "طَبِيبٌ (Tabiibun)",
                                    "قِدْرٌ (Qidrun)",
                                    "قَلَمٌ (Qalamun)"
                        ],
                        "answer": 2,
                        "explanation": "“قِدْرٌ” (Qidrun - পাতিল) শব্দটি কোনো গোল তা ছাড়া ব্যবহৃত হলেও এটি একটি ব্যতিক্রমী স্ত্রীবাচক শব্দ।"
            },
            {
                        "question": "কোনো মেয়েকে “তোমার নাম কী?” জিজ্ঞাসা করার সঠিক আরবী বাক্য কোনটি?",
                        "options": [
                                    "مَا اسْمُكَ؟ (Maa ismuka?)",
                                    "مَا اسْمُكِ؟ (Maa ismuki?)",
                                    "مَا اسْمِي؟",
                                    "كَيْفَ حَالُكِ؟"
                        ],
                        "answer": 1,
                        "explanation": "মেয়ে বা স্ত্রীবাচকের ক্ষেত্রে কাচরাহযুক্ত “مَا اسْمُكِ؟” (Maa ismuki?) ব্যবহার করা হয়।"
            },
            {
                        "question": "“চামচ” এবং “ইস্ত্রি” এর সঠিক আরবী প্রতিশব্দ যুগল কোনটি?",
                        "options": [
                                    "قِدْرٌ - سَيَّارَةٌ",
                                    "مِلْعَقَةٌ - مِكْوَاةٌ",
                                    "سَاعَةٌ - مِلْعَقَةٌ",
                                    "يَدٌ - رِجْلٌ"
                        ],
                        "answer": 1,
                        "explanation": "“مِلْعَقَةٌ” অর্থ চামচ এবং “مِكْوَاةٌ” অর্থ ইস্ত্রি (Iron)।"
            },
            {
                        "question": "“هٰذَا أَنْفٌ” (এটি একটি নাক) এবং “هٰذِهِ أُذُنٌ” (এটি একটি কান) - এর মাধ্যমে ব্যাকরণের কোন নিয়মটি প্রকাশিত হয়?",
                        "options": [
                                    "নাক পুরুষবাচক কারণ এটি একটি, কান স্ত্রীবাচক কারণ এটি জোড়ায় থাকে",
                                    "উভয় শব্দই ব্যাকরণগতভাবে পুরুষবাচক",
                                    "নাক স্ত্রীবাচক এবং কান পুরুষবাচক",
                                    "উভয় শব্দই ব্যাকরণগতভাবে স্ত্রীবাচক"
                        ],
                        "answer": 0,
                        "explanation": "শরীরের একক অঙ্গগুলো (যেমন নাক - أَنْفٌ) পুরুষবাচক এবং জোড় অঙ্গগুলো (যেমন কান - أُذُنٌ) ব্যাকরণগতভাবে স্ত্রীবাচক।"
            },
            {
                        "question": "কোনো নারীকে “তুমি কেমন আছো?” জিজ্ঞাসা করার সঠিক আরবী বাক্য কোনটি?",
                        "options": [
                                    "كَيْفَ حَالُكَ؟ (Kayfa haaluka?)",
                                    "كَيْفَ حَالُكِ؟ (Kayfa haaluki?)",
                                    "كَيْفَ حَالُهُ?",
                                    "مَا اسْمُكِ؟"
                        ],
                        "answer": 1,
                        "explanation": "নারী বা স্ত্রীবাচকের ক্ষেত্রে কাচরাহযুক্ত “كَيْفَ حَالُكِ؟” (Kayfa haaluki?) বলা হয়।"
            },
            {
                        "question": "“আর তুমি কেমন আছো?” (কোনো মেয়েকে জিজ্ঞাসা করতে) এর সঠিক আরবী বাক্য কোনটি?",
                        "options": [
                                    "وَكَيْفَ حَالُكَ أَنْتَ؟",
                                    "وَكَيْفَ حَالُكِ أَنْتِ؟",
                                    "كَيْفَ حَالُكِ؟",
                                    "وَكَيْفَ حَالُهُ؟"
                        ],
                        "answer": 1,
                        "explanation": "স্ত্রীবাচক সর্বনাম “أَنْتِ” ব্যবহার করে সঠিক বাক্য হবে “وَكَيْفَ حَالُكِ أَنْتِ？”।"
            },
            {
                        "question": "“খাদিজার গাড়ি” এর সঠিক আরবী রূপ কোনটি হবে? (গাড়ি = سَيَّارَةٌ)",
                        "options": [
                                    "سَيَّارَةُ خَدِيجَةِ",
                                    "سَيَّارَةُ خَدِيجَةُ",
                                    "سَيَّارَةٌ خَدِيجَةَ",
                                    "اَلسَّيَّارَةُ خَدِيجَةُ"
                        ],
                        "answer": 0,
                        "explanation": "মুদাফ ও মুদাফ ইলাইহি নিয়মে প্রথম শব্দে তানউইন ছাড়া পেশ এবং দ্বিতীয় শব্দের শেষে জের হয়ে সঠিক রূপ হবে “سَيَّارَةُ خَدِيجَةِ” (খাদিজার জন্য কাচরাহ)।"
            }
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
                        "question": "দূরের কোনো স্ত্রীবাচক শব্দকে নির্দেশ করতে কোন আরবী শব্দ ব্যবহার করা হয়?",
                        "options": [
                                    "ذٰلِكَ (Dhaalika)",
                                    "تِلْكَ (Tilka)",
                                    "هٰذِهِ (Haadhihi)",
                                    "هٰذَا (Haadhaa)"
                        ],
                        "answer": 1,
                        "explanation": "দূরের স্ত্রীবাচক শব্দ নির্দেশ করতে “تِلْكَ” (Tilka) এবং পুরুষবাচক হলে “ذٰلِكَ” (Dhaalika) ব্যবহৃত হয়।"
            },
            {
                        "question": "“ওইটি একটি ডিম।” এর সঠিক আরবী অনুবাদ কোনটি? (ডিম = بَيْضَةٌ)",
                        "options": [
                                    "ذٰلِكَ بَيْضَةٌ",
                                    "تِلْكَ بَيْضَةٌ (Tilka baydatun)",
                                    "هٰذِهِ بَيْضَةٌ",
                                    "تِلْكَ بَطَّةٌ"
                        ],
                        "answer": 1,
                        "explanation": "ডিম (بَيْضَةٌ) স্ত্রীবাচক হওয়ায় দূরের নির্দেশক “تِلْكَ” হয়ে সঠিক রূপ হবে “تِلْكَ بَيْضَةٌ”।"
            },
            {
                        "question": "আরবী ব্যাকরণে “বাদাল” (Al-Badal) এর নিয়ম অনুযায়ী “هٰذَا الرَّجُلُ” (Haadhaa ar-rajulu) এর সঠিক বাংলা অর্থ কী?",
                        "options": [
                                    "এটি একজন লোক।",
                                    "এই লোকটি",
                                    "সে একজন লোক।",
                                    "ওই লোকটি"
                        ],
                        "answer": 1,
                        "explanation": "ইশারা বা নির্দেশক শব্দের পর সরাসরি ال-যুক্ত বিশেষ্য এলে সেটি পূর্ণ বাক্য না হয়ে “এই লোকটি” জাতীয় নির্দিষ্ট বাক্যাংশ প্রকাশ করে।"
            },
            {
                        "question": "“এই লোকটি একজন ব্যবসায়ী।” বাক্যটির সঠিক আরবী রূপ কোনটি?",
                        "options": [
                                    "هٰذَا الرَّجُلُ تَاجِرٌ",
                                    "هٰذَا رَجُلٌ تَاجِرٌ",
                                    "هٰذَا الرَّجُلُ مُدَرِّসٌ",
                                    "ذٰلِكَ الرَّজُلُ طَبِيبٌ"
                        ],
                        "answer": 0,
                        "explanation": "“هٰذَا الرَّجُلُ” (এই লোকটি) + “تَاجِرٌ” (ব্যবসায়ী)। সঠিক বাক্যটি হলো “هٰذَا الرَّجُلُ تَاجِرٌ”।"
            },
            {
                        "question": "“আমি দয়া করে একটি ফ্ল্যাট চাই।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "لَدَيْنَا شَقَّةٌ جَمِيلَةٌ",
                                    "أُرِيدُ شَقَّةً مِنْ فَضْلِكَ",
                                    "فِي أَيِّ حَيٍّ الشَّقَّةُ؟",
                                    "أَيْنَ الْبَيْتُ؟"
                        ],
                        "answer": 1,
                        "explanation": "“أُرِيدُ” (আমি চাই) + “شَقَّةً” (একটি ফ্ল্যাট) + “مِنْ فَضْلِكَ” (অনুগ্রহ করে)।"
            },
            {
                        "question": "“আমাদের একটি সুন্দর ফ্ল্যাট আছে।” বাক্যটির সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "أُرِيدُ شَقَّةً جَمِيلَةً",
                                    "لَدَيْنَا شَقَّةٌ جَمِيلَةٌ",
                                    "اَلشَّقَّةُ فِي حَيِّ الْمَطَارِ",
                                    "تِلْكَ الشَّقَّةُ قَرِيبَةٌ"
                        ],
                        "answer": 1,
                        "explanation": "“لَدَيْنَا” (আমাদের আছে) + “شَقَّةٌ جَمِيلَةٌ” (একটি সুন্দর ফ্ল্যাট)।"
            },
            {
                        "question": "“ফ্ল্যাটটি বিমানবন্দর এলাকায়।” এর সঠিক আরবী অনুবাদ কোনটি? (বিমানবন্দর এলাকা = حَيِّ الْمَطَارِ)",
                        "options": [
                                    "اَلشَّقَّةُ فِي حَيِّ الْمَطَارِ",
                                    "اَلشَّقَّةُ فِي الْفَصْلِ",
                                    "اَلشَّقَّةُ فِي الْبَيْتِ",
                                    "اَلشَّقَّةُ بَعِيدَةٌ"
                        ],
                        "answer": 0,
                        "explanation": "“اَلشَّقَّةُ فِي حَيِّ الْمَطَارِ” (Ash-shaqqatu fii hayyil-mataari) অর্থ “ফ্ল্যাটটি বিমানবন্দর এলাকায়।”"
            },
            {
                        "question": "“Qariibun” (قَرِيبٌ) এবং “Ba'iidun” (بَعِيدٌ) শব্দ দুটির বাংলা অর্থ যথাক্রমে কী?",
                        "options": [
                                    "ভাঙা ও খোলা",
                                    "কাছে ও দূরে",
                                    "ছোট ও বড়",
                                    "ভালো ও খারাপ"
                        ],
                        "answer": 1,
                        "explanation": "“قَرِيبٌ” অর্থ কাছে এবং “بَعِيدٌ” অর্থ দূরে।"
            },
            {
                        "question": "“হাঁস” এবং “মুরগি” এর সঠিক আরবী শব্দ যুগল কোনটি?",
                        "options": [
                                    "بَيْضَةٌ - دَجَاجَةٌ",
                                    "بَطَّةٌ - دَجَاجَةٌ",
                                    "شَقَّةٌ - حَيٌّ",
                                    "رَقْمٌ - بَطَّةٌ"
                        ],
                        "answer": 1,
                        "explanation": "“بَطَّةٌ” (Battatun) অর্থ হাঁস এবং “دَجَاجَةٌ” (Dajaajatun) অর্থ মুরগি।"
            },
            {
                        "question": "“ওই ফ্ল্যাটটি কাছে।” এর সঠিক আরবী অনুবাদ কোনটি?",
                        "options": [
                                    "ذٰلِكَ الْبَيْتُ بَعِيدٌ",
                                    "تِلْكَ الشَّقَّةُ قَرِيبَةٌ",
                                    "هٰذِهِ الشَّقَّةُ قَرِيبَةٌ",
                                    "تِلْكَ الشَّقَّةُ بَعِيدَةٌ"
                        ],
                        "answer": 1,
                        "explanation": "ফ্ল্যাট (شَقَّةٌ) স্ত্রীবাচক এবং দূরের হওয়ায় “تِلْكَ الشَّقَّةُ قَرِيبَةٌ” সঠিক আরবী বাক্য।"
            }
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
          // Day 27 (PDF 14)
          {
            id: 'ar-les-27',
            title: 'Lesson 27: Arabic Reading Practice (PDF 14)',
            description: 'Learn family vocabulary, possessive pronouns, and masculine and feminine pointers in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 28 (Quiz 14)
          {
            id: 'ar-les-28',
            title: 'Lesson 28: MCQ Quiz Practice',
            description: 'Review the family vocabulary and grammar from Arabic PDF 14.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: 'আরবি শব্দ “أُسْرَةٌ” (Usratun)-এর সঠিক বাংলা অর্থ কোনটি?',
                options: ['বংশলতিকা', 'পরিবার', 'বাবা', 'মা'],
                answer: 1,
                explanation: '“أُسْرَةٌ” (Usratun) অর্থ পরিবার।',
              },
              {
                question: '“شَجَرَةٌ” (Shajaratun) শব্দের সঠিক অর্থ কোনটি?',
                options: ['পরিবার', 'মা', 'গাছ বা বংশলতিকা', 'ছেলে'],
                answer: 2,
                explanation: '“شَجَرَةٌ” (Shajaratun) অর্থ গাছ; পারিবারিক প্রসঙ্গে এটি বংশলতিকা বোঝায়।',
              },
              {
                question: '“দাদা/নানা” বোঝাতে কোন আরবি শব্দটি ব্যবহৃত হয়?',
                options: ['جَدٌّ (Jaddun)', 'وَالِدٌ (Walidun)', 'اِبْنٌ (Ibnun)', 'عَمٌّ (Ammun)'],
                answer: 0,
                explanation: '“جَدٌّ” (Jaddun) অর্থ দাদা বা নানা।',
              },
              {
                question: '“কন্যা/মেয়ে” বোঝাতে কোন আরবি শব্দটি সঠিক?',
                options: ['اِبْنٌ (Ibnun)', 'جَدَّةٌ (Jaddatun)', 'بِنْتٌ (Bintun)', 'عَمٌّ (Ammun)'],
                answer: 2,
                explanation: '“بِنْتٌ” (Bintun) বা “اِبْنَةٌ” (Ibnatun) অর্থ কন্যা বা মেয়ে।',
              },
              {
                question: '“চাচা” (Paternal Uncle) বোঝাতে কোন আরবি শব্দটি ব্যবহৃত হয়?',
                options: ['خَالٌ (Khaalun)', 'أَخٌ (Akhun)', 'وَالِدٌ (Walidun)', 'عَمٌّ (Ammun)'],
                answer: 3,
                explanation: '“عَمٌّ” (Ammun) অর্থ পিতৃকুলের চাচা।',
              },
              {
                question: '“তার বাবা” (His Father) বোঝাতে “وَالِدٌ” (Walidun)-এর সঙ্গে কোন রূপটি সঠিক?',
                options: ['وَالِدُهُ (Waliduhu)', 'وَالِدُهَا (Waliduhaa)', 'وَالِدِي (Walidii)', 'وَالِدُكَ (Waliduka)'],
                answer: 0,
                explanation: 'পুরুষবাচক “তার” বোঝাতে শব্দের শেষে ـهُ যুক্ত হয়; তাই “وَالِدُهُ” অর্থ তার বাবা।',
              },
              {
                question: '“তার নাম” (His Name) বোঝাতে কোন রূপটি সঠিক?',
                options: ['اِسْمُهَا (Ismuhaa)', 'اِسْمُهُ (Ismuhu)', 'اِسْمِي (Ismii)', 'اِسْمُكَ (Ismuka)'],
                answer: 1,
                explanation: '“اِسْمٌ” শব্দের শেষে ـهُ যুক্ত করে “اِسْمُهُ” বলা হয়, যার অর্থ তার নাম।',
              },
              {
                question: 'কাছের কোনো পুরুষবাচক ব্যক্তিকে নির্দেশ করতে কোন শব্দটি ব্যবহৃত হয়?',
                options: ['هٰذَا (Haadhaa)', 'هٰذِهِ (Haadhihi)', 'هٰؤُلَاءِ (Haaulaai)', 'ذٰلِكَ (Dhaalika)'],
                answer: 0,
                explanation: 'কাছের পুরুষবাচক ব্যক্তি বা বস্তুর জন্য “هٰذَا” ব্যবহৃত হয়।',
              },
              {
                question: '“ইনি আমার মা” বলতে সঠিক স্ত্রীবাচক নির্দেশকসহ কোন বাক্যটি হবে?',
                options: ['هٰذَا وَالِدَتِي', 'هٰذِهِ وَالِدَتِي', 'هٰذَا وَالِدِي', 'هٰؤُلَاءِ وَالِدَتِي'],
                answer: 1,
                explanation: '“وَالِدَةٌ” স্ত্রীবাচক হওয়ায় কাছের নির্দেশক হিসেবে “هٰذِهِ” ব্যবহৃত হয়।',
              },
              {
                question: '“أُسْرَةُ الرَّسُولِ” (রাসুলের পরিবার) কোন ব্যাকরণিক গঠন?',
                options: ['Na‘t-Man‘ut', 'Question sentence', 'Mudaf-Mudaf Ilayh', 'Verb sentence'],
                answer: 2,
                explanation: '“أُسْرَةُ الرَّسُولِ” একটি Mudaf-Mudaf Ilayh বা সম্বন্ধযুক্ত পদগঠন।',
              },
            ],
          },
          // Day 29 (PDF 15)
          {
            id: 'ar-les-29',
            title: 'Lesson 29: Arabic Reading Practice (PDF 15)',
            description: 'Practice family introductions, professions, feminine possession, and gender agreement in Arabic.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [],
          },
          // Day 30 (Quiz 15)
          {
            id: 'ar-les-30',
            title: 'Lesson 30: MCQ Quiz Practice',
            description: 'Review family introductions and profession grammar from Arabic PDF 15.',
            langCode: 'ar-SA',
            cards: [],
            phrases: [],
            quiz: [
              {
                question: '“صُورَةٌ” (Suuratun) শব্দের সঠিক বাংলা অর্থ কোনটি?',
                options: ['ছবি', 'পরিবার', 'ভাই', 'পেশা'],
                answer: 0,
                explanation: '“صُورَةٌ” (Suuratun) অর্থ ছবি বা চিত্র।',
              },
              {
                question: '“ভাই” বোঝাতে কোন আরবি শব্দটি ব্যবহৃত হয়?',
                options: ['أُخْتٌ (Ukhtun)', 'أَخٌ (Akhun)', 'عَمَّةٌ (Ammatun)', 'خَالٌ (Khaalun)'],
                answer: 1,
                explanation: '“أَخٌ” (Akhun) অর্থ ভাই।',
              },
              {
                question: '“বোন” বোঝাতে কোন আরবি শব্দটি সঠিক?',
                options: ['أَخٌ (Akhun)', 'بِنْتٌ (Bintun)', 'أُخْتٌ (Ukhtun)', 'وَالِدَةٌ (Walidatun)'],
                answer: 2,
                explanation: '“أُخْتٌ” (Ukhtun) অর্থ বোন।',
              },
              {
                question: '“আমার মামা” বোঝাতে PDF-এ কোন রূপটি শেখানো হয়েছে?',
                options: ['عَمِّي (Ammii)', 'أَخِي (Akhii)', 'وَالِدِي (Walidii)', 'خَالِي (Khaalii)'],
                answer: 3,
                explanation: '“خَالِي” (Khaalii) অর্থ আমার মামা।',
              },
              {
                question: '“নারী ডাক্তার” বোঝাতে সঠিক আরবি শব্দ কোনটি?',
                options: ['طَبِيبٌ (Tabiibun)', 'طَبِيبَةٌ (Tabiibatun)', 'مُعَلِّمَةٌ (Muallimatun)', 'مُهَنْدِسٌ (Muhandisun)'],
                answer: 1,
                explanation: '“طَبِيبَةٌ” (Tabiibatun) অর্থ নারী ডাক্তার।',
              },
              {
                question: '“তার বাড়ি” (Her House) বোঝাতে সঠিক আরবি রূপ কোনটি?',
                options: ['بَيْتُهُ (Baytuhu)', 'بَيْتُهَا (Baytuhaa)', 'بَيْتِي (Baytii)', 'بَيْتُكَ (Baytuka)'],
                answer: 1,
                explanation: 'স্ত্রীবাচক “তার” বোঝাতে শব্দের শেষে ـهَا যুক্ত হয়; তাই “بَيْتُهَا” অর্থ তার বাড়ি।',
              },
              {
                question: '“তিনি একজন নারী প্রকৌশলী”—এখানে প্রকৌশলীর সঠিক স্ত্রীবাচক আরবি শব্দ কোনটি?',
                options: ['مُهَنْدِسٌ (Muhandisun)', 'طَبِيبَةٌ (Tabiibatun)', 'مُهَنْدِسَةٌ (Muhandisatun)', 'مُعَلِّمٌ (Muallimun)'],
                answer: 2,
                explanation: 'পুরুষবাচক “مُهَنْدِسٌ”-এর শেষে ة যোগ করে স্ত্রীবাচক “مُهَنْدِسَةٌ” হয়।',
              },
              {
                question: '“এটি আমার পরিবারের ছবি”—বাক্যে “ছবি” স্ত্রীবাচক হওয়ায় কোন নির্দেশকটি সঠিক?',
                options: ['هٰذِهِ (Haadhihi)', 'هٰذَا (Haadhaa)', 'ذٰلِكَ (Dhaalika)', 'هُوَ (Huwa)'],
                answer: 0,
                explanation: '“صُورَةٌ” স্ত্রীবাচক শব্দ, তাই কাছের নির্দেশক হিসেবে “هٰذِهِ” ব্যবহৃত হয়।',
              },
              {
                question: '“ইনি আমার বাবা, তিনি একজন প্রকৌশলী”—এর সঠিক আরবি বাক্য কোনটি?',
                options: ['هٰذِهِ وَالِدَتِي، هِيَ طَبِيبَةٌ', 'هٰذَا أَخِي، هُوَ طَالِبٌ', 'هٰذِهِ أُخْتِي، هِيَ مُعَلِّمَةٌ', 'هٰذَا وَالِدِي، هُوَ مُهَنْدِسٌ'],
                answer: 3,
                explanation: 'বাবার জন্য “هٰذَا وَالِدِي” এবং পুরুষ প্রকৌশলীর জন্য “هُوَ مُهَنْدِسٌ” সঠিক।',
              },
              {
                question: '“ইনি আমার বোন, তিনি একজন শিক্ষিকা”—এর সঠিক আরবি বাক্য কোনটি?',
                options: ['هٰذَا أَخِي، هُوَ مُعَلِّمٌ', 'هٰذِهِ وَالِدَتِي، هِيَ طَبِيبَةٌ', 'هٰذِهِ أُخْتِي، هِيَ مُعَلِّمَةٌ', 'هٰذَا جَدِّي، هُوَ مُهَنْدِسٌ'],
                answer: 2,
                explanation: 'বোনের জন্য “هٰذِهِ أُخْتِي” এবং শিক্ষিকার জন্য “هِيَ مُعَلِّمَةٌ” সঠিক।',
              },
            ],
          },
        ],
      },
    ],
  },
};

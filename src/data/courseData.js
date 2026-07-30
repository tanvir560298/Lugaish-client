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
            quiz: [
              {
                question: 'কেউ যদি আপনাকে "السَّلَامُ عَلَيْكُمْ" (আসসালামু আলাইকুম) বলে, তবে সঠিক উত্তর কোনটি হবে?',
                options: ['أَهْلًا وَسَهْلًا (আহলান ওয়া সাহলান)', 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ (ওয়া আলাইকুমুস সালাম...)', 'بِخَيْرٍ وَالحَمْدُ لِلَّهِ (বিখাইরিন আলহামদুলিল্লাহ)', 'أَنَا مِنْ المَغْرِبِ (আনা মিনাল মাগরিব)'],
                answer: 1,
                explanation: 'সালামের সঠিক উত্তর হলো “ওয়া আলাইকুমুস সালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু।”',
              },
              {
                question: '"مَا اسْمُكَ؟" (মা ইসমুকা?) প্রশ্নটির মাধ্যমে কী জিজ্ঞাসা করা হয়?',
                options: ['বয়স জিজ্ঞাসা করা হয়', 'নাম জিজ্ঞাসা করা হয়', 'জাতীয়তা বা দেশ জিজ্ঞাসা করা হয়', 'শারীরিক সুস্থতা বা অবস্থা জিজ্ঞাসা করা হয়'],
                answer: 1,
                explanation: '“মা ইসমুকা?” অর্থ “আপনার নাম কী?”',
              },
              {
                question: 'শিক্ষক যদি আপনাকে জিজ্ঞাসা করেন: "مَا اسْمُكَ؟" (আপনার নাম কী?), তবে সঠিক উত্তর কোনটি?',
                options: ['اسْمِي أَحْمَدُ (আমার নাম আহমাদ)', 'أَنَا بِخَيْرٍ، الحَمْدُ لِلَّهِ (আমি ভালো আছি, আলহামদুলিল্লাহ)', 'أَنَا مِنْ الأُرْدُنِّ (আমি জর্ডান থেকে এসেছি)', 'أَنَا طَالِبٌ فِي المَدْرَسَةِ (আমি স্কুলের ছাত্র)'],
                answer: 0,
                explanation: '“ইসমি আহমাদ” অর্থ “আমার নাম আহমাদ।”',
              },
              {
                question: 'কেউ যদি আপনাকে জিজ্ঞাসা করে: "كَيْفَ حَالُكَ؟" (আপনি কেমন আছেন?), তবে উপযুক্ত উত্তর কী হবে?',
                options: ['اسْمِي مُحَمَّدٌ (আমার নাম মুহাম্মদ)', 'أَنَا سُورِيٌّ (আমি সিরিয়ান)', 'بِخَيْرٍ، الحَمْدُ لِلَّهِ (ভালো আছি, আলহামদুলিল্লাহ)', 'عُمْرِي عَشْرُ سَنَوَاتٍ (আমার বয়স ১০ বছর)'],
                answer: 2,
                explanation: 'কুশল জিজ্ঞাসার উপযুক্ত উত্তর হলো “বিখাইরিন, আলহামদুলিল্লাহ।”',
              },
              {
                question: 'কোনো মেয়েকে (স্ত্রীলিঙ্গ) তার কুশল বা কেমন আছে জিজ্ঞাসা করার জন্য কোনটি সঠিক?',
                options: ['كَيْفَ حَالُكَ؟ (কাইফা হালুকা?)', 'كَيْفَ حَالُكِ؟ (কাইফা হালুকি?)', 'مِنْ أَيْنَ أَنْتَ؟ (মিন আইনা আন্তা?)', 'مَا اسْمُهُ؟ (মা ইসমুহু?)'],
                answer: 1,
                explanation: 'স্ত্রীলিঙ্গ সম্বোধনে “كِ” ব্যবহৃত হয়: “কাইফা হালুকি?”',
              },
              {
                question: '"مِنْ أَيْنَ أَنْتَ؟" (মিন আইনা আন্তা?) প্রশ্নটি কী জানার জন্য ব্যবহার করা হয়?',
                options: ['পেশা ও কাজ', 'মূল দেশ বা জন্মস্থান/বসবাস', 'স্বাস্থ্য ও অবস্থা', 'বয়স ও তারিখ'],
                answer: 1,
                explanation: 'প্রশ্নটি কারও দেশ বা সে কোথা থেকে এসেছে তা জানতে ব্যবহৃত হয়।',
              },
              {
                question: 'কেউ যদি জিজ্ঞাসা করে: "مِنْ أَيْنَ أَنْتَ؟" (আপনি কোথা থেকে এসেছেন?), তবে সঠিক আরবি উত্তর কোনটি?',
                options: ['أَنَا المِصْرُ', 'أَنَا مِنْ مِصْرَ (আমি মিশর থেকে এসেছি)', 'أَنَا مِصْرِيٌّ', 'جِنْسِيَّتِي مِصْرَ'],
                answer: 1,
                explanation: '“আনা মিন মিসর” অর্থ “আমি মিশর থেকে এসেছি।”',
              },
              {
                question: 'আপনাকে যদি প্রশ্ন করা হয়: "مَا جِنْسِيَّتُكَ أَنْتَ؟" (আপনার জাতীয়তা কী?) এবং আপনি বাংলাদেশি হন, তবে উত্তর কী হবে?',
                options: ['أَنَا مِنْ بَنْغْلَادِيْش', 'أَنَا بَنْغْلَادِيْشِيٌّ (আমি বাংলাদেশি)', 'أَنَا أَعِيشُ فِي بَنْغْلَادِيْش', 'بَنْغْلَادِيْش بَلَدِي'],
                answer: 1,
                explanation: 'পুরুষ বক্তার জন্য “আনা বাংলাদেশিয়্যুন” সঠিক জাতীয়তা প্রকাশ করে।',
              },
              {
                question: 'কোনো ছাত্রীকে (স্ত্রীলিঙ্গ) তার জাতীয়তা জিজ্ঞাসা করার জন্য সঠিক বাক্য কোনটি?',
                options: ['مَا جِنْسِيَّتُكَ أَنْتَ؟', 'مَا جِنْسِيَّتُكِ أَنْتِ؟', 'مِنْ أَيْنَ أَنْتَ؟', 'كَيْفَ حَالُكَ؟'],
                answer: 1,
                explanation: 'ছাত্রীকে স্ত্রীলিঙ্গে জিজ্ঞাসা করতে “جِنْسِيَّتُكِ أَنْتِ” ব্যবহৃত হয়।',
              },
              {
                question: 'একজন ছাত্রী বাংলাদেশ থেকে এসেছে, তাকে যদি প্রশ্ন করা হয়: "مَا جِنْسِيَّتُكِ أَنْتِ؟", সে কীভাবে উত্তর দেবে?',
                options: ['أَنَا بَنْغْلَادِيْش', 'أَنَا مِنْ بَنْغْلَادِيْشِيَّة', 'أَنَا بَنْغْلَادِيْشِيَّةٌ (আমি বাংলাদেশি - স্ত্রীলিঙ্গ)', 'أَنَا بَنْغْلَادِيْشِيٌّ'],
                answer: 2,
                explanation: 'নারী বক্তার জন্য সঠিক রূপ “আনা বাংলাদেশিয়্যাতুন।”',
              },
            ],
          },
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
                question: 'Which word means persuasion?',
                options: ['Balaghah', 'Ilqa', 'Iqna', 'Nazahah'],
                answer: 2,
                explanation: 'Iqna means persuasion.',
              },
            ],
          },
        ],
      },
    ],
  },
};

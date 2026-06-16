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
              { word: 'Initiative', translation: 'المبادرة', type: 'noun', explanation: 'The power to start action confidently and independently.', example: 'Taking initiative makes every team move forward.' },
              { word: 'Visionary', translation: 'ذو رؤية / استشرافي', type: 'adjective', explanation: 'Thinking beyond the present to shape a bold future.', example: 'A visionary leader inspires others with a clear purpose.' },
              { word: 'Collaborate', translation: 'يتعاون', type: 'verb', explanation: 'Working together to create stronger ideas and solutions.', example: 'Great teams collaborate across differences to achieve results.' },
              { word: 'Empower', translation: 'يمكّن / يقوّي', type: 'verb', explanation: 'Giving others the confidence and resources to take action.', example: 'A good leader empowers teammates to own success.' },
            ],
            phrases: [
              { text: 'I believe we can make a difference by working together.', translation: 'أعتقد أنه يمكننا إحداث فرق من خلال العمل معًا.' },
              { text: 'My vision for this project is to foster community growth.', translation: 'رؤيتي لهذا المشروع هي تعزيز نمو المجتمع.' },
              { text: 'Let\'s align our goals and share the responsibility.', translation: 'دعونا نوائم أهدافنا ونتقاسم المسؤولية.' },
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
                question: "What is the translation of 'Collaborate' in Arabic?",
                options: ['يمكّن', 'يتعاون', 'ذو رؤية', 'المبادرة'],
                answer: 1,
                explanation: 'Collaborate translates to يتعاون (to work jointly).',
              },
            ],
          },
          {
            id: 'en-les-2',
            title: 'Public Speaking Basics',
            description: 'Learn how to capture attention, use vocal variety, and deliver powerful speeches.',
            langCode: 'en-US',
            cards: [
              { word: 'Eloquence', translation: 'الفصاحة / البلاغة', type: 'noun', explanation: 'Fluent or persuasive speaking or writing.', example: 'Her eloquence moved the audience to take action.' },
              { word: 'Articulate', translation: 'يعبر بوضوح', type: 'verb', explanation: 'Express an idea or feeling clearly and fluently.', example: 'A leader must be able to articulate their thoughts under pressure.' },
              { word: 'Resonance', translation: 'الرنين / الصدى', type: 'noun', explanation: 'A quality of sound that makes it deep and reverberating.', example: 'A voice with resonance commands attention in a large hall.' },
              { word: 'Persuade', translation: 'يقنع', type: 'verb', explanation: 'Cause someone to do or believe something through reasoning.', example: 'He used stories to persuade the council to fund the center.' },
            ],
            phrases: [
              { text: 'Speaking from the heart builds trust with your audience.', translation: 'التحدث من القلب يبني الثقة مع جمهورك.' },
              { text: 'Clear communication is the bridge between confusion and clarity.', translation: 'التواصل الواضح هو الجسر بين الارتباك والوضوح.' },
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
        title: 'أساسيات القيادة والتواصل',
        description: 'تعلم مصطلحات القيادة والخطابة باللغة العربية الفصحى.',
        lessons: [
          {
            id: 'ar-les-1',
            title: 'صفات القائد الناجح',
            description: 'التعرف على المفردات والعبارات الخاصة بالقيادة.',
            langCode: 'ar-SA',
            cards: [
              { word: 'قيادة', translation: 'Leadership', type: 'اسم', explanation: 'القدرة على توجيه وإلهام الآخرين لتحقيق هدف مشترك.', example: 'القيادة الحقيقية تتطلب الصبر والتعاطف.' },
              { word: 'نزاهة', translation: 'Integrity', type: 'اسم', explanation: 'الالتزام بالقيم الأخلاقية والصدق في كل الظروف.', example: 'النزاهة هي أساس ثقة الفريق في القائد.' },
              { word: 'تأثير', translation: 'Influence', type: 'اسم', explanation: 'القدرة على إحداث تغيير إيجابي في الآخرين.', example: 'يظهر تأثير القائد في تحفيز فريقه للعمل بحماس.' },
              { word: 'مسؤولية', translation: 'Responsibility', type: 'اسم', explanation: 'تحمل نتائج القرارات والالتزامات أمام الفريق.', example: 'القيادة مسؤولية كبيرة وليست مجرد منصب.' },
            ],
            phrases: [
              { text: 'القائد العظيم هو من يصنع قادة آخرين وليس أتباعاً.', translation: 'A great leader creates other leaders, not followers.' },
              { text: 'العمل الجماعي المشترك هو مفتاح النجاح المستدام.', translation: 'Shared teamwork is the key to sustainable success.' },
            ],
            quiz: [
              {
                question: "ما معنى كلمة 'نزاهة' باللغة الإنجليزية؟",
                options: ['Responsibility', 'Influence', 'Integrity', 'Leadership'],
                answer: 2,
                explanation: 'Integrity تعني الالتزام بالأخلاق والصدق، وهي المعنى الأقرب لـ نزاهة.',
              },
              {
                question: "أكمل العبارة: 'القيادة هي القدرة على ______ الآخرين نحو الأفضل.'",
                options: ['تجاهل', 'إلهام وتوجيه', 'إحباط', 'عزل'],
                answer: 1,
                explanation: 'القيادة تهدف إلى إلهام وتوجيه الآخرين بشكل إيجابي.',
              },
            ],
          },
          {
            id: 'ar-les-2',
            title: 'الخطابة والتأثير العام',
            description: 'تعلم مهارات الخطابة والإقناع باللغة العربية الفصحى.',
            langCode: 'ar-SA',
            cards: [
              { word: 'بلاغة', translation: 'Rhetoric / Eloquence', type: 'اسم', explanation: 'قوة التعبير ووضوح الكلام وملاءمته للموقف.', example: 'تشتهر البلاغة العربية بقدرتها على التأثير.' },
              { word: 'إقناع', translation: 'Persuasion', type: 'اسم', explanation: 'توجيه آراء الآخرين بواسطة الحجج والأدلة.', example: 'يحتاج القائد إلى مهارة الإقناع لكسب الدعم.' },
              { word: 'إلقاء', translation: 'Delivery / Presentation', type: 'اسم', explanation: 'طريقة نطق الكلمات واستخدام النبرة ولغة الجسد.', example: 'كان إلقاء الخطيب مؤثرًا ومقنعًا.' },
            ],
            phrases: [
              { text: 'الكلمة الطيبة والمقنعة تفتح مغاليق القلوب والعقول.', translation: 'A kind persuasive word opens hearts and minds.' },
              { text: 'تحدَّثْ كي أراك؛ فالمرء مخبوء تحت لسانه لا ثيابه.', translation: 'Speak to be seen; a person is hidden beneath their tongue, not clothing.' },
            ],
            quiz: [
              {
                question: 'أي من الكلمات التالية تعني عملية توجيه آراء الآخرين بالحجج؟',
                options: ['بلاغة', 'إلقاء', 'إقناع', 'نزاهة'],
                answer: 2,
                explanation: 'الإقناع هو كسب قبول الآخرين بالحجة والمنطق.',
              },
            ],
          },
        ],
      },
    ],
  },
};

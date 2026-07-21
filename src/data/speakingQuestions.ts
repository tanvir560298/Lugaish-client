export type SpeakingLanguage = 'english' | 'arabic';

export type SpeakingQuestion = {
  id: string;
  question: string;
  language: SpeakingLanguage;
  expectedKeywords: string[];
  sampleAnswer: string;
  maxMarks: number;
  audioUrl?: string;
};

export const SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  {
    id: 'english-introduction',
    question: 'Please introduce yourself and describe one goal you want to achieve.',
    language: 'english',
    expectedKeywords: ['my name', 'goal', 'learn'],
    sampleAnswer: 'My name is Ahmed. My goal is to learn English and communicate confidently.',
    maxMarks: 10,
  },
  {
    id: 'english-daily-routine',
    question: 'What do you usually do in the morning?',
    language: 'english',
    expectedKeywords: ['morning', 'usually', 'breakfast'],
    sampleAnswer: 'I usually wake up early, eat breakfast, and plan my work in the morning.',
    maxMarks: 10,
  },
  {
    id: 'english-teamwork',
    question: 'Why is teamwork important?',
    language: 'english',
    expectedKeywords: ['teamwork', 'together', 'goal'],
    sampleAnswer: 'Teamwork is important because people work together and reach a shared goal.',
    maxMarks: 10,
  },
  {
    id: 'english-learning',
    question: 'How do you practice English every day?',
    language: 'english',
    expectedKeywords: ['practice', 'English', 'every day'],
    sampleAnswer: 'I practice English every day by listening, speaking, and learning new words.',
    maxMarks: 10,
  },
  {
    id: 'english-leadership',
    question: 'What makes someone a good leader?',
    language: 'english',
    expectedKeywords: ['leader', 'listen', 'support'],
    sampleAnswer: 'A good leader listens to people, supports the team, and communicates clearly.',
    maxMarks: 10,
  },
  {
    id: 'arabic-introduction',
    question: 'عرّف بنفسك وتحدث عن هدف تريد تحقيقه.',
    language: 'arabic',
    expectedKeywords: ['اسمي', 'هدفي', 'أتعلم'],
    sampleAnswer: 'اسمي أحمد، وهدفي أن أتعلم اللغة العربية وأتحدث بثقة.',
    maxMarks: 10,
  },
  {
    id: 'arabic-morning',
    question: 'ماذا تفعل عادةً في الصباح؟',
    language: 'arabic',
    expectedKeywords: ['الصباح', 'عادة', 'الفطور'],
    sampleAnswer: 'أستيقظ مبكراً عادةً، وأتناول الفطور في الصباح، ثم أبدأ عملي.',
    maxMarks: 10,
  },
  {
    id: 'arabic-teamwork',
    question: 'لماذا العمل الجماعي مهم؟',
    language: 'arabic',
    expectedKeywords: ['العمل الجماعي', 'معاً', 'الهدف'],
    sampleAnswer: 'العمل الجماعي مهم لأننا نعمل معاً ونصل إلى الهدف المشترك.',
    maxMarks: 10,
  },
  {
    id: 'arabic-learning',
    question: 'كيف تتدرب على اللغة العربية كل يوم؟',
    language: 'arabic',
    expectedKeywords: ['أتدرب', 'العربية', 'كل يوم'],
    sampleAnswer: 'أتدرب على اللغة العربية كل يوم بالاستماع والتحدث وتعلم كلمات جديدة.',
    maxMarks: 10,
  },
  {
    id: 'arabic-leadership',
    question: 'ما صفات القائد الجيد؟',
    language: 'arabic',
    expectedKeywords: ['القائد', 'يستمع', 'يدعم'],
    sampleAnswer: 'القائد الجيد يستمع إلى الناس ويدعم الفريق ويتواصل بوضوح.',
    maxMarks: 10,
  },
];

export function getLocalSpeakingQuestions(language: SpeakingLanguage): SpeakingQuestion[] {
  return SPEAKING_QUESTIONS.filter(question => question.language === language);
}

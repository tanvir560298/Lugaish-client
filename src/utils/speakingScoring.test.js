import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSpeakingText, scoreSpeakingTranscript } from './speakingScoring.js';

const baseQuestion = {
  id: 'test',
  language: 'arabic',
  maxMarks: 10,
  expectedKeywords: [],
  acceptedResponses: [],
  scoringStrategy: 'keywords',
};

test('Arabic normalization removes tashkeel and normalizes alif', () => {
  assert.equal(normalizeSpeakingText('السَّلَامُ عَلَيْكُمْ', 'arabic'), 'السلام عليكم');
  assert.equal(normalizeSpeakingText('إِسْمِي أَحْمَدُ', 'arabic'), 'اسمي احمد');
});

test('an accepted short greeting receives full phrase marks', () => {
  const result = scoreSpeakingTranscript({
    ...baseQuestion,
    scoringStrategy: 'greeting',
    expectedKeywords: ['وعليكم السلام'],
    acceptedResponses: ['وعليكم السلام', 'أهلا', 'مرحبا'],
  }, 'مَرْحَبًا');
  assert.equal(result.marks, 10);
});

test('echoing the greeting prompt is not accepted as the response', () => {
  const result = scoreSpeakingTranscript({
    ...baseQuestion,
    scoringStrategy: 'greeting',
    expectedKeywords: ['وعليكم السلام'],
    acceptedResponses: ['وعليكم السلام', 'أهلا', 'مرحبا'],
  }, 'السلام عليكم');
  assert.ok(result.marks < 10);
});

test('a direct student name is accepted', () => {
  const result = scoreSpeakingTranscript({
    ...baseQuestion,
    scoringStrategy: 'name',
    expectedKeywords: ['اسمي', 'أنا'],
    acceptedResponses: ['اسمي أحمد', 'أنا أحمد'],
  }, 'فاطمة');
  assert.equal(result.marks, 9);
});

test('question reading uses phrase coverage and recognition confidence', () => {
  const result = scoreSpeakingTranscript({
    ...baseQuestion,
    question: 'مَا اسْمُكَ؟',
    scoringStrategy: 'question_reading',
  }, 'ما اسمك', { recognitionConfidence: 0.75 });
  assert.equal(result.marks, 10);
  assert.equal(result.recognitionConfidence, 75);
});

test('English first-meeting scoring judges meaning instead of exact sentences', () => {
  const question = {
    ...baseQuestion,
    language: 'english',
    conversationStep: 3,
    scoringStrategy: 'english_first_meeting',
  };
  assert.ok(scoreSpeakingTranscript(question, 'My hometown is Sylhet.').marks >= 7);
  assert.ok(scoreSpeakingTranscript(question, 'I live in Dhaka now.').marks < 5);
});

test('English return-question step accepts natural personal questions', () => {
  const result = scoreSpeakingTranscript({
    ...baseQuestion,
    language: 'english',
    conversationStep: 7,
    scoringStrategy: 'english_first_meeting',
  }, 'What subject do you study?');
  assert.ok(result.marks >= 9);
});

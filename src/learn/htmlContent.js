// Owner-supplied public YouTube references, in the requested order.
// Titles checked against YouTube on 15 October 2026. Durations not inferred.
export const htmlWelcomeVideo = {
  id: '00',
  youtubeId: 'A0exlm8BHCc',
  title: 'Why Learn Web Development When AI Can Build Websites? | Day 0',
  displayTitle: 'Why learn web development in the age of AI?',
  shortTitle: 'Why learn web development?',
  subtitle: 'Welcoming Video · Ready for a New Journey',
  summary: 'AI এর যুগে কেন ওয়েব ডেভেলপমেন্ট শিখবেন? কোডিং শুরু করার আগে সঠিক মানসিকতা, মৌলিক ভিত্তি এবং কীভাবে এই নতুন জার্নিতে সফল হবেন তা জানুন।',
  duration: '3:23',
  durationMinutes: '3 min',
  course: 'web-development-html',
  topic: 'html',
  kind: 'video',
  path: '/learn/web-development/html/00',
  url: 'https://www.youtube.com/watch?v=A0exlm8BHCc'
};

export const htmlDay1Video = {
  id: 'day-1',
  youtubeId: 'i6NGvCsGIsc',
  title: 'What Is HTML? Explained in 30 Seconds | Web Development Day 1',
  displayTitle: 'What is HTML?',
  shortTitle: 'What is HTML?',
  subtitle: '30-Second Quick Concept · Day 1',
  summary: 'HTML আসলে কী? মাত্র ৩০ সেকেন্ডে সহজে বুঝে নিন ব্রাউজারে ওয়েবপেজের ভিত্তি কীভাবে কাজ করে।',
  duration: '30 sec',
  durationMinutes: '30 sec',
  course: 'web-development-html',
  topic: 'html',
  kind: 'video',
  path: '/learn/web-development/html/day-1',
  url: 'https://www.youtube.com/watch?v=i6NGvCsGIsc'
};

export const cssIntroVideo = {
  id: 'css-1',
  youtubeId: 'cX3x7TLxe8k',
  title: 'CSS Introduction · Video 1 | Web Development',
  displayTitle: 'CSS Introduction (Video 1)',
  shortTitle: 'CSS Introduction',
  subtitle: 'CSS Foundations · Video 1',
  summary: 'HTML-এর পর এবার CSS দিয়ে ওয়েবপেজকে সুন্দর, রঙিন এবং আধুনিক ডিজাইনে সাজানোর যাত্রা শুরু করুন।',
  duration: 'CSS Intro',
  durationMinutes: 'CSS Intro',
  course: 'web-development-html',
  topic: 'css',
  kind: 'video',
  path: '/learn/web-development/html/css-1',
  url: 'https://www.youtube.com/watch?v=cX3x7TLxe8k'
};

// HTML lessons appear first; CSS lessons unlock only after all HTML lessons are completed.
export const htmlOnlyVideos = [htmlWelcomeVideo, htmlDay1Video];
export const cssVideos = [cssIntroVideo];
export const htmlVideos = [...htmlOnlyVideos, ...cssVideos];

export const htmlModules = [
  {
    id: 'module-0',
    number: '01',
    title: 'Your Web Development Foundation',
    titleBn: 'HTML দিয়ে শুরু হোক যাত্রা',
    description: 'সঠিক মানসিকতা থেকে HTML-এর প্রথম ধারণা',
    lessons: htmlOnlyVideos.map((lesson, i) => ({
      ...lesson,
      orderNumber: i,
      orderLabel: `DAY ${i}`,
      moduleTitle: 'Your Web Development Foundation',
      lockHint: i === 0 ? '' : `Finish Day ${i - 1} first`
    }))
  },
  {
    id: 'module-1',
    number: '02',
    title: 'CSS Foundations',
    titleBn: 'HTML শেষে CSS দিয়ে ডিজাইন',
    description: 'HTML শেষ করার পর CSS দিয়ে ওয়েবসাইট সাজানো শিখুন',
    lessons: cssVideos.map((lesson, i) => ({
      ...lesson,
      orderNumber: htmlOnlyVideos.length + i,
      orderLabel: `CSS ${i + 1}`,
      moduleTitle: 'CSS Foundations',
      lockHint: 'Finish HTML first'
    }))
  }
];

export const allHtmlLessons = htmlModules.flatMap(module => module.lessons);
export const htmlExercises = {};
export function cleanHtmlProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => allHtmlLessons.some(v => v.id === id)))];
}
export function isHtmlLessonUnlocked(id, completed) {
  const index = allHtmlLessons.findIndex(lesson => lesson.id === id);
  return index >= 0 && allHtmlLessons.slice(0, index).every(lesson => completed.includes(lesson.id));
}

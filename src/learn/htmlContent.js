// Owner-supplied public YouTube references, in the requested order.
// Titles checked against YouTube on 15 October 2026. Durations not inferred.
export const htmlWelcomeVideo = {
  id: '00',
  youtubeId: 'A0exlm8BHCc',
  title: 'Why Learn Web Development When AI Can Build Websites? | Day 0',
  subtitle: 'Welcoming Video · Ready for a New Journey',
  summary: 'AI এর যুগে কেন ওয়েব ডেভেলপমেন্ট শিখবেন? কোডিং শুরু করার আগে সঠিক মানসিকতা, মৌলিক ভিত্তি এবং কীভাবে এই নতুন জার্নিতে সফল হবেন তা জানুন।',
  duration: '3:23',
  durationMinutes: '3 min',
  course: 'web-development-html',
  kind: 'video',
  path: '/learn/web-development/html/00',
  url: 'https://www.youtube.com/watch?v=A0exlm8BHCc'
};

export const htmlDay1Video = {
  id: 'day-1',
  youtubeId: 'i6NGvCsGIsc',
  title: 'What Is HTML? Explained in 30 Seconds | Web Development Day 1',
  subtitle: '30-Second Quick Concept · Day 1',
  summary: 'HTML আসলে কী? মাত্র ৩০ সেকেন্ডে সহজে বুঝে নিন ব্রাউজারে ওয়েবপেজের ভিত্তি কীভাবে কাজ করে।',
  duration: '30 sec',
  durationMinutes: '30 sec',
  course: 'web-development-html',
  kind: 'video',
  path: '/learn/web-development/html/day-1',
  url: 'https://www.youtube.com/watch?v=i6NGvCsGIsc'
};

// Only the two owner-approved animated lessons are published.
export const htmlVideos = [htmlWelcomeVideo, htmlDay1Video];
export const allHtmlLessons = htmlVideos;
export const htmlModules = [{
  id: 'module-0', number: '01', title: 'Your Web Development Foundation',
  titleBn: 'শুরু হোক আপনার শেখার যাত্রা',
  description: 'সঠিক মানসিকতা থেকে HTML-এর প্রথম ধারণা',
  lessons: htmlVideos.map((lesson, i) => ({ ...lesson, orderNumber: i, orderLabel: `Day ${i}`, moduleTitle: 'Web Development Foundations' }))
}];
export const htmlExercises = {};
export function cleanHtmlProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => allHtmlLessons.some(v => v.id === id)))];
}
export function isHtmlLessonUnlocked(id, completed) {
  const index = allHtmlLessons.findIndex(lesson => lesson.id === id);
  return index >= 0 && allHtmlLessons.slice(0, index).every(lesson => completed.includes(lesson.id));
}

// Published incrementally. Keep future topics as roadmap labels, not full lessons.
export const firstSteps = [
  { id: 'motivation', title: 'শুরু করার ছোট্ট সাহস', short: 'শুরু করি',
    intro: 'আপনি যে ওয়েবসাইটে এখন পড়ছেন, সেটিও একদিন একটি ছোট লেখা দিয়ে শুরু হয়েছিল। নিজের পরিচয়, পছন্দের গল্প বা শেখার খাতা—HTML দিয়ে আপনার কথাও একটি ওয়েবপেজে তুলে ধরতে পারবেন।',
    paragraphs: ['আজ সবকিছু শিখতে হবে না। শুধু একটি শিরোনাম আর তার নিচে নিজের কথা লিখব। এটুকু দিয়েই আপনার প্রথম ওয়েবপেজ তৈরি হবে।', 'HTML browser-কে বলে কোন লেখা শিরোনাম আর কোনটি সাধারণ অনুচ্ছেদ। আপনি code লিখবেন, Run চাপবেন, আর পাশেই তার ফল দেখবেন।', 'কিছু install করার প্রয়োজন নেই। এই ওয়েবসাইটের editor-এই কাজ করবেন। ভুল হলে লেখা বদলে আবার চেষ্টা করবেন। না পারলে hint এবং সাহায্যের code আছে।'],
    takeaway: 'আজকের লক্ষ্য: নিজের হাতে একটি heading ও একটি paragraph তৈরি করা।' },
  { id: 'heading', title: 'Heading — লেখার শিরোনাম', short: 'Heading',
    intro: 'খাতার প্রথম পাতায় যেমন একটি নাম লিখেন, ওয়েবপেজেও বিষয়টি বোঝানোর জন্য একটি শিরোনাম থাকে। HTML-এ সেই শিরোনামকে heading বলে।',
    paragraphs: ['একটি প্রধান শিরোনাম লিখতে h1 ব্যবহার করি। শুরুতে <h1>, মাঝে আপনার লেখা, শেষে </h1>। শেষের tag-এ / চিহ্নটি দেখে browser বোঝে শিরোনাম এখানেই শেষ।', 'নিচের উদাহরণে “আমার প্রথম ওয়েবপেজ” হলো শিরোনামের লেখা। শব্দগুলো বদলে নিজের নাম দিন, তারপর Run / Preview চাপুন। পুরো tag বদলানোর প্রয়োজন নেই।', 'HTML-এ h1 থেকে h6 পর্যন্ত ছয়টি heading level আছে। h1 মূল শিরোনাম, h2 বড় বিভাগের শিরোনাম, h3 তার ভেতরের উপবিভাগ। শুধু ছোট বা বড় দেখানোর জন্য level বেছে নেবেন না। আজ আমরা শুধু একটি h1 দিয়ে শুরু করছি।'],
    code: '<h1>আমার প্রথম ওয়েবপেজ</h1>',
    takeaway: 'Tag হলো নির্দেশনা, মাঝের লেখাটি হলো content। Preview-তে tag নয়, শিরোনামটি দেখবেন।' },
  { id: 'paragraph', title: 'Paragraph — শিরোনামের নিচে নিজের কথা', short: 'Paragraph',
    intro: 'শিরোনাম বিষয়টি জানায়। এবার তার নিচে একটি বাক্যে নিজের কথা লিখি। সাধারণ অনুচ্ছেদ লিখতে HTML-এর p tag ব্যবহার করি।',
    paragraphs: ['<p> দিয়ে শুরু করুন, নিজের বাক্য লিখুন, তারপর </p> দিয়ে শেষ করুন। এটিই একটি paragraph। যেমন: “আমি আজ HTML শেখা শুরু করেছি।”', 'নিচের code-এ প্রথম line-এ heading, পরের line-এ paragraph আছে। দুটো আলাদা element। প্রতিটির opening ও closing tag আলাদা।', 'আরেকটি অনুচ্ছেদ লিখতে নতুন একটি <p>...</p> যোগ করুন। শুধু editor-এ Enter চাপলেই browser-এ নতুন paragraph তৈরি হয় না। এখন বাক্যটি নিজের মতো বদলে Run দিয়ে দেখুন।'],
    code: '<h1>আমার প্রথম ওয়েবপেজ</h1>\n<p>আমি আজ HTML শেখা শুরু করেছি।</p>',
    takeaway: 'একটি h1 + একটি p দিয়েই ছবির মতো একটি ছোট webpage বানাতে পারবেন। এবার নিজে চেষ্টা করুন।' },
  { id: 'practice', title: 'ছবি দেখে প্রথম ওয়েবপেজ বানাই', short: 'নিজে করি' }
];
export const firstPractice = {
  id: 'first-page',
  starter: '<!-- ছবিটি দেখে এখানে নিজের HTML লিখুন -->',
  solution: '<h1>আমার প্রথম ওয়েবপেজ</h1>\n<p>আমি আজ HTML শেখা শুরু করেছি।</p>',
  rules: [
    {kind:'text', selector:'h1', value:'আমার প্রথম ওয়েবপেজ', label:'h1-এ লিখুন: আমার প্রথম ওয়েবপেজ'},
    {kind:'text', selector:'p', value:'আমি আজ HTML শেখা শুরু করেছি।', label:'p-তে লিখুন: আমি আজ HTML শেখা শুরু করেছি।'}
  ],
  hints: ['বড় শিরোনামের জন্য h1 এবং নিচের বাক্যের জন্য p লাগবে।', 'প্রতিটি opening tag-এর পরে লেখা দিন, তারপর matching closing tag লিখুন।']
};
export const nextTopics = ['Text formatting', 'Lists', 'Links', 'Images', 'Forms'];
export const firstProgressKey = scope => `lugaish_html_first_steps_v1:${scope || 'guest'}`;
export function cleanFirstProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => firstSteps.some(s => s.id === id)))];
}

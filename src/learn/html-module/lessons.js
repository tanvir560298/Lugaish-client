// Original Bengali curriculum. Add lessons here without changing the reading UI.
export const moduleBase = '/learn/web-development/html/module-1';
export const sampleImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="100"%3E%3Crect width="160" height="100" fill="%23dbeafe"/%3E%3Ctext x="25" y="58" font-size="20"%3EMy learning%3C/text%3E%3C/svg%3E';
export const htmlLessons = [
  {
    id:'1-0', title:'Introduction to HTML', subtitle:'ওয়েবপেজের ভাষার সঙ্গে প্রথম পরিচয়',
    objectives:['HTML-এর কাজ নিজের ভাষায় বলতে পারবেন।','HTML, CSS ও JavaScript-এর দায়িত্ব আলাদা করতে পারবেন।','একটি ছোট উদাহরণ বদলে browser-এর output বুঝতে পারবেন।'],
    intro:'ধরুন বন্ধুকে আপনার পড়ার ক্লাব সম্পর্কে জানাবেন। একটি নাম, পরিচিতি আর বইয়ের তালিকা লিখলেন। কাগজে এগুলো দেখাতে পারেন; আবার একই তথ্য browser-এ একটি ওয়েবপেজ হিসেবেও দেখাতে পারেন। HTML সেই তথ্যের কাঠামো তৈরি করে। শুরু করার জন্য coding-এর কোনো পূর্ব অভিজ্ঞতা দরকার নেই।',
    sections:[
      ['HTML আসলে কী?','HTML-এর পূর্ণ নাম HyperText Markup Language। Markup মানে লেখার অংশগুলোকে চিহ্ন দিয়ে পরিচয় দেওয়া। কোনটি শিরোনাম, কোনটি অনুচ্ছেদ, কোনটি link—এগুলো HTML জানায়। এটি programming language নয়; নিজে হিসাব করা বা সিদ্ধান্ত নেওয়ার নিয়ম চালায় না। তবে প্রায় প্রতিটি ওয়েবপেজের অর্থপূর্ণ ভিত্তি তৈরি করে।'],
      ['Browser কীভাবে পড়ে?','Chrome, Firefox বা অন্য browser একটি HTML document পড়ে। angle bracket-এর মধ্যে থাকা tag দেখে element-এর ধরন বোঝে, তারপর পেজ দেখায়। আপনি সাধারণত tag দেখতে পান না; tag দিয়ে চিহ্নিত content দেখেন। View Source-এ মূল HTML দেখা যায়, আর developer tools-এ browser-এর তৈরি document structure দেখা যায়। দুটো সব সময় হুবহু এক নয়।'],
      ['তিনটি আলাদা দায়িত্ব','একটি ঘরের সঙ্গে তুলনা করুন: HTML হলো ঘরের কাঠামো ও কক্ষের পরিচয়। CSS রং, মাপ ও সাজানোর নিয়ম দেয়। JavaScript দরজা খোলা বা কোনো action-এর পরে পরিবর্তনের মতো আচরণ যোগ করে। এই module-এ আমরা শুধু HTML শিখব। সুন্দর কাঠামো শেখার জন্য এখনই রং বা animation দরকার নেই।'],
      ['শুরুতে কীভাবে পড়বেন?','প্রথমে code পড়ুন, তারপর output দেখুন। এবার শুধু একটি শব্দ বদলে Run / Preview চাপুন। পরিবর্তনের কারণ বলার চেষ্টা করুন। সব tag একসঙ্গে মুখস্থ না করে একটি ছোট page বারবার তৈরি করুন। ভুল হলে ভয় পাবেন না; browser অনেক ভুল নিজে ঠিক করে বলে ভুল code-ও কখনো সুন্দর দেখাতে পারে।'],
      ['এই module-এর পথ','Setup দিয়ে শুরু করে text, headings, containers, lists, links, images ও forms শিখবেন। পরে পুরো document লিখবেন, revision project করবেন, এবং nested list দেখবেন। প্রতিটি lesson-এ ছোট কাজ আছে। Practice Arena-তে একই বিষয় নতুন সমস্যায় প্রয়োগ করবেন। শেষে quiz ও mini-project দিয়ে নিজের বোঝাপড়া যাচাই করবেন।']
    ],
    syntax:'<h1>...</h1> একটি প্রধান heading। <p>...</p> একটি paragraph। Tag-এর নামের বদলে মাঝের content-টাই output-এ লেখা হিসেবে আসে।',
    code:'<h1>আমাদের পড়ার ক্লাব</h1>\n<p>প্রতি শুক্রবার আমরা একটি গল্প পড়ি।</p>',
    breakdown:['প্রথম লাইনে h1 নামের element ক্লাবের নামকে মূল heading করেছে।','দ্বিতীয় লাইনের p আলাদা paragraph তৈরি করেছে।','বাংলা লেখাও content; HTML tag-গুলোর নাম English-এই থাকবে।'],
    output:'বড় heading-এর নিচে একটি আলাদা paragraph দেখবেন। Browser-এর নিজস্ব default style ব্যবহৃত হচ্ছে।',
    mistakes:[['Tag-সহ পুরো code paragraph হিসেবে লিখে দেওয়া','Editor-এ actual tag লিখুন; শুধু h1 শব্দ লিখলে heading হবে না।'],['একটি heading দেখেই পুরো HTML আয়ত্ত হয়েছে ভাবা','এই উদাহরণ শুধু শুরু; পরে structure, attributes ও accessibility শিখতে হবে।']],
    revision:['HTML content-এর অর্থ ও কাঠামো দেয়।','Browser tag interpret করে output দেখায়।','CSS ও JavaScript এই module-এর assessed scope-এর বাইরে।'],
    questions:['HTML কেন শুধু plain text নয়?','কোন প্রযুক্তি রং দেয়, আর কোনটি interaction যোগ করে?','Paragraph-এর লেখা বদলালে output-এর কোন অংশ বদলাবে?'],
    task:'ক্লাবের নাম বদলে নিজের শেখার জায়গার নাম দিন। Paragraph-এ এই সপ্তাহে কী শিখতে চান লিখুন।'
  },
  {
    id:'1-1',title:'Getting Started with HTML and VS Code',subtitle:'প্রথম file, tag ও attribute',
    objectives:['index.html file তৈরি ও browser-এ খুলতে পারবেন।','Tag, element, content ও attribute আলাদা করতে পারবেন।','Save এবং refresh-এর সম্পর্ক বুঝবেন।'],
    intro:'খাতার লেখা রাখার জন্য যেমন খাতা দরকার, code রাখার জন্য file দরকার। প্রথম কাজ হলো একটি আলাদা folder বানানো। এর মধ্যে index.html নামে file রাখবেন। File-এর নাম সুন্দর হওয়া নয়, সঠিক extension থাকা বেশি গুরুত্বপূর্ণ। একই folder-এ পরে ছবি ও অন্য page রাখা সহজ হবে।',
    sections:[
      ['নিজের কাজের জায়গা','VS Code একটি text editor: code লিখতে ও file সাজাতে সাহায্য করে। সফটওয়্যারটি official website থেকে install করুন। একটি learning-html folder খুলুন, New File দিয়ে index.html বানান। এখানে .html file-এর ধরন বোঝায়। index.html.txt হলে browser plain text হিসেবে নিতে পারে। Save করার সময় file-এর পুরো নাম পরীক্ষা করুন।'],
      ['Tag থেকে element','<p> হলো opening tag, </p> closing tag। মাঝখানে লেখা content। এই তিনটি মিলে paragraph element। Closing tag-এ slash থাকে, opening tag-এ নয়। Element-এর মধ্যে আরেকটি element থাকতে পারে; তখন ভেতরেরটি আগে বন্ধ হয়। বক্সের মধ্যে ছোট বক্স রাখার মতো করে nesting ভাবুন।'],
      ['Attribute কী?','Attribute element সম্পর্কে অতিরিক্ত তথ্য দেয় এবং opening tag-এর মধ্যে লেখা হয়। lang="bn" document-এর ভাষা বোঝাতে পারে; title="..." অতিরিক্ত পরামর্শমূলক লেখা দেয়। name="value" pattern চিনুন। মানের চারপাশে quote রাখলে space-সহ লেখা বুঝতে সুবিধা হয়। Attribute-কে closing tag-এ লেখা যাবে না।'],
      ['File দেখা ও পরিবর্তন','File save করে file manager থেকে browser দিয়ে খুলুন। Browser-এ local file address দেখা স্বাভাবিক। আবার editor-এ ফিরে একটি বাক্য বদলে save করুন, browser refresh করুন। Save না করলে পুরোনো content-ই দেখা যাবে। Live Server কাজে লাগতে পারে, কিন্তু এই module পড়তে extension বাধ্যতামূলক নয়।'],
      ['নিজে পড়ে নিশ্চিত হওয়া','Code indentation অর্থাৎ ভেতরের line একটু ডানে রাখা মানুষের পড়ার সুবিধা; সাধারণত এতে browser-এর output বদলায় না। Tag name, quote, closing order ও content আগে দেখুন। Code নিজের হাতে লিখে দেখুন। Copy করলে বানানের ভুল এড়ানো যায়, কিন্তু প্রতিটি অংশ কী করছে না বুঝলে নতুন page তৈরি কঠিন হবে।']
    ],
    syntax:'<p title="একটি পরিচিতি">আমি HTML শিখছি।</p> — p tag, title attribute, মাঝের বাক্য content, এবং পুরোটা element।',
    code:'<h1>আমার প্রথম HTML file</h1>\n<p title="Learning note">আমি একটি file save করে browser-এ খুলেছি।</p>',
    breakdown:['h1 প্রথম heading তৈরি করেছে।','p-এর title attribute অতিরিক্ত তথ্য দিয়েছে; এটি paragraph-এর দৃশ্যমান লেখা নয়।','দুটি element পাশাপাশি লেখা, একটি অন্যটির ভেতরে নয়।'],
    output:'একটি heading এবং paragraph দেখা যাবে। title-এর tooltip সব device-এ একইভাবে কাজ করে না, তাই জরুরি তথ্য শুধু title-এ রাখবেন না।',
    mistakes:[['File-এর নাম index.html.txt','File extension দেখিয়ে নাম ঠিক করুন।'],['<p>একটি <strong>গুরুত্বপূর্ণ</p></strong>','ভেতরের strong আগে বন্ধ করুন: <p>একটি <strong>গুরুত্বপূর্ণ</strong></p>।']],
    revision:['HTML file text editor-এ লেখা যায়।','Attribute opening tag-এর ভেতরে থাকে।','Edit → Save → Refresh চক্র মনে রাখুন।'],
    questions:['Tag আর element-এর পার্থক্য কী?','File save না করে refresh করলে কী হতে পারে?','Attribute কোথায় লিখবেন?'],
    task:'নিজের computer-এ index.html তৈরি করুন। একটি heading ও নিজের উদ্দেশ্য লেখা paragraph যোগ করে save ও refresh করুন।'
  },
  {
    id:'1-2',title:'HTML Text and Formatting',subtitle:'লেখার চেহারা ও অর্থের পার্থক্য',
    objectives:['p দিয়ে আলাদা paragraph লিখবেন।','b/i এবং strong/em-এর উদ্দেশ্য বুঝবেন।','অর্থপূর্ণ text formatting ব্যবহার করবেন।'],
    intro:'একটি নোটিশে কিছু তথ্য সাধারণ, কিছু তথ্য খুব গুরুত্বপূর্ণ। “আগামীকাল পরীক্ষা” আর “সময় সকাল নয়টা”—সব লেখা একভাবে রাখলে পাঠক জরুরি অংশ হারাতে পারেন। HTML দিয়ে শুধু লেখা মোটা করা নয়, লেখার গুরুত্বও বোঝানো যায়। এখানে দেখতে একই রকম হলেও অর্থ আলাদা হতে পারে।',
    sections:[
      ['অনুচ্ছেদ আলাদা রাখুন','p একটি paragraph চিহ্নিত করে। একটি বিষয় নিয়ে কয়েকটি বাক্য লিখে p বন্ধ করুন, পরের বিষয়ের জন্য নতুন p লিখুন। Editor-এ Enter চাপা মানেই browser-এ নতুন paragraph নয়। সাধারণ text-এর একাধিক space ও line break browser অনেক সময় একটি space হিসেবে দেখায়। তাই structure-এর জন্য element ব্যবহার করুন।'],
      ['গুরুত্বের জন্য strong','strong এমন অংশে ব্যবহার করুন যার গুরুত্ব, জরুরিতা বা সতর্কতা বোঝাতে চান। Browser সাধারণত bold দেখায়, কিন্তু bold-ই এর সংজ্ঞা নয়। Screen reader ও অন্য উপস্থাপনাও অর্থ ব্যবহার করতে পারে, যদিও সব assistive tool একইভাবে উচ্চারণ বদলায় না। জরুরি তথ্য পুরো বাক্যেই পরিষ্কার লিখুন।'],
      ['জোরের জন্য em','em কোনো শব্দে stress বা জোর দেয়। “আমি আজই জমা দেব”—এখানে আজই শব্দে জোর দিলে বাক্যের অর্থের focus বোঝা যায়। Browser সাধারণত italic করে। পুরো paragraph italic করার বদলে যে অংশে সত্যিই জোর দরকার, সেই অংশ ঘিরে em ব্যবহার করুন।'],
      ['b ও i কখন?','b গুরুত্ব দাবি না করে কোনো অংশের দিকে দৃষ্টি টানে, যেমন একটি তালিকায় keyword। i আলাদা স্বর বা বিশেষ ধরনের text বোঝাতে পারে, যেমন বিদেশি শব্দ বা কোনো নামকরণ। এগুলো শুধুই strong/em-এর ছোট বানান নয়। শুধু styling চাইলে পরে CSS শিখবেন; এখন content-এর অর্থ অনুযায়ী tag নির্বাচন করুন।'],
      ['পড়ার মতো code','একটি paragraph-এর মধ্যে strong বা em রাখা যায়। ভেতরের tag আগে বন্ধ করুন, তারপর p। সবকিছু bold করলে গুরুত্বপূর্ণ অংশের আলাদা গুরুত্ব থাকে না। Output দেখে নিজেকে প্রশ্ন করুন: reader কি আমার উদ্দেশ্য বুঝবে? Tag সরিয়ে দিলেও যদি বাক্য অস্পষ্ট হয়, আগে লেখাটি পরিষ্কার করুন।']
    ],
    syntax:'<p>আগামীকাল <strong>শেষ সময়</strong>। আজই <em>নিজে</em> যাচাই করুন।</p> — text element-এর ভেতরে formatting element রাখা হয়েছে।',
    code:'<p>আমাদের <b>HTML</b> পাঠ শুরু হয়েছে।</p>\n<p><strong>জরুরি:</strong> নিজের কাজ save করুন।</p>\n<p>আমি <em>প্রতিদিন</em> একটু practice করি।</p>\n<p><i>Bonjour</i> একটি French greeting।</p>',
    breakdown:['প্রথম p-তে b একটি keyword সামনে এনেছে।','strong জরুরি নির্দেশনার গুরুত্ব বোঝায়।','em প্রতিদিন শব্দে জোর দেয়, i আলাদা ভাষার শব্দ চিহ্নিত করে।'],
    output:'চারটি paragraph দেখবেন। b/strong সাধারণত মোটা এবং i/em সাধারণত বাঁকা দেখা যায়; অর্থের পার্থক্য source code-এ আছে।',
    mistakes:[['নতুন paragraph-এর জন্য অনেক Enter দেওয়া','দুটি p element লিখুন।'],['সব লেখাকে strong করা','কেবল প্রকৃত জরুরি অংশে strong দিন।'],['ভুল nesting','শেষে খোলা ভেতরের tag-টিই আগে বন্ধ করুন।']],
    revision:['p paragraph তৈরি করে।','strong গুরুত্ব, em stress বোঝায়।','b এবং i-এর নিজস্ব উদ্দেশ্য আছে।'],
    questions:['strong এবং b কি পুরোপুরি একই অর্থ দেয়?','একটি paragraph-এর ভেতরে em রাখা যায় কি?','Enter চাপা আর p লেখা কেন এক নয়?'],
    task:'দুটি paragraph-এ নিজের পড়ার রুটিন লিখুন। একটি জরুরি তথ্য strong এবং একটি জোরের শব্দ em দিয়ে চিহ্নিত করুন।'
  },
  {
    id:'1-3',title:'Headings and HTML Containers',subtitle:'শিরোনামের স্তর এবং content-এর দল',
    objectives:['h1–h6-এর hierarchy অনুসরণ করবেন।','div ও span-এর কাজ চিনবেন।','Default block ও inline আচরণ বুঝবেন।'],
    intro:'একটি বইয়ে বইয়ের নাম, অধ্যায়ের নাম এবং ছোট উপবিভাগের নাম আলাদা স্তরে থাকে। ওয়েবপেজেও পাঠক একই ধরনের সংগঠন আশা করেন। শুধু বড় অক্ষরে লেখা heading নয়; HTML heading element বিষয়গুলোর সম্পর্ক জানায়। এই সম্পর্ক keyboard ও assistive technology দিয়ে content খুঁজতেও সাহায্য করতে পারে।',
    sections:[
      ['শিরোনামের ছয় স্তর','h1 সবচেয়ে উচ্চ স্তর, তারপর h2 থেকে h6। একটি ছোট beginner page-এ একটি পরিষ্কার h1 রাখুন। তার বড় অংশগুলো h2 এবং সেই অংশের ছোট উপবিভাগ h3। শুধু ছোট দেখানোর জন্য h1-এর পরে h5 দেবেন না। Heading-এর level বিষয়বস্তুর সম্পর্ক অনুযায়ী নির্ধারণ হয়, পছন্দের font size দিয়ে নয়।'],
      ['Container মানে দল','div একটি সাধারণ container—কয়েকটি element একসঙ্গে রাখার বাক্স। উদাহরণে নাম, পরিচিতি ও আগ্রহ একটি div-এর মধ্যে রাখলে দল বোঝা সহজ হয়। div নিজে heading বা paragraph-এর নির্দিষ্ট অর্থ দেয় না। তাই heading দরকার হলে h2, paragraph দরকার হলে p-ই ব্যবহার করুন।'],
      ['লাইনের ভেতরে span','span ছোট text-এর অংশকে আলাদা করে চিহ্নিত করার সাধারণ container। “প্রিয় বিষয়: HTML” বাক্যে শুধু HTML span-এর মধ্যে রাখা যায়। কোনো অতিরিক্ত style না দিলে সাধারণত দৃশ্যমান পার্থক্য হবে না। গুরুত্বপূর্ণ বোঝাতে strong দরকার হলে span দিয়ে সেই অর্থ পাওয়া যায় না।'],
      ['Block এবং inline','Browser-এর default display-তে div, p ও headings সাধারণত নতুন লাইনে শুরু হয়। span, strong ও em বাক্যের লাইনের সঙ্গে থাকে। এটিকে যথাক্রমে block ও inline আচরণ বলা হয়। পরে CSS এই আচরণ পরিবর্তন করতে পারে, তাই এগুলোকে চিরস্থায়ী বৈশিষ্ট্য ভাববেন না। এখন default output বুঝলেই যথেষ্ট।'],
      ['ছোট লেখা ও সঠিক nesting','small সাধারণত side comment বা fine print-এর জন্য। মূল তথ্যকে ছোট করতে এটি ব্যবহার করবেন না। Paragraph-এর ভেতরে div বা heading ঢোকাবেন না; browser নিজে paragraph শেষ করে structure বদলে দিতে পারে। Container-এর ভেতরে p রাখুন, কিন্তু p-এর ভেতরে বড় structural block নয়। Output স্বাভাবিক লাগলেও structure পরীক্ষা করুন।']
    ],
    syntax:'<div><h2>বিষয়</h2><p>আমার পছন্দ <span>HTML</span>।</p></div> — div দল করেছে, span লাইনের একটি অংশ চিহ্নিত করেছে।',
    code:'<h1>আমার শেখার খাতা</h1>\n<div>\n  <h2>প্রথম সপ্তাহ</h2>\n  <h3>আজকের লক্ষ্য</h3>\n  <p>আমি <span>HTML</span> শিখব।</p>\n</div>\n<small>নিজের practice-এর জন্য তৈরি।</small>',
    breakdown:['h1 পুরো page-এর পরিচয়। h2-এর অধীনে h3 রয়েছে।','div-এর মধ্যে সম্পর্কিত বিষয়গুলো একত্রে আছে।','span text-এর inline অংশ, small একটি গৌণ নোট।'],
    output:'পর্যায়ক্রমে heading-এর মাপ ছোট হবে। div-এর আলাদা border হবে না, span-ও নিজে নতুন line তৈরি করবে না।',
    mistakes:[['শুধু font size পছন্দ করে heading বাছা','বিষয়ের স্তর অনুযায়ী heading নিন।'],['p-এর মধ্যে div লেখা','div-এর মধ্যে paragraph রাখুন।']],
    revision:['Heading-এর level অর্থপূর্ণ সম্পর্ক বোঝায়।','div সাধারণ block container, span সাধারণ inline container।','Container নিজে বিশেষ দৃশ্যমান design তৈরি করে না।'],
    questions:['h2-এর ছোট উপবিভাগে কোন heading যুক্তিযুক্ত?','span-এ text রাখলেই কি রং বদলাবে?','small দিয়ে মূল নির্দেশনা লেখা ঠিক হবে কেন বা কেন নয়?'],
    task:'একটি h1, দুটি h2 এবং একটি h3 দিয়ে learning journal তৈরি করুন। একটি div ও একটি span ব্যবহার করুন।'
  },
  {
    id:'1-4',title:'Lists, Line Breaks and Buttons',subtitle:'তালিকা ও ছোট action-এর কাঠামো',
    objectives:['ul/ol-এর মধ্যে li লিখবেন।','br-এর উপযুক্ত ব্যবহার করবেন।','button-এর type নির্বাচন করবেন।'],
    intro:'বাজারের জিনিস আর রান্নার ধাপ একই ধরনের তালিকা নয়। বাজারে কোন জিনিস আগে লেখা হলো তা সাধারণত জরুরি নয়। কিন্তু রান্নায় চুলা জ্বালানোর আগে হাঁড়ি প্রস্তুত করা দরকার হতে পারে। HTML-এ এই দুই ধরনের সম্পর্ক প্রকাশ করার জন্য আলাদা list আছে।',
    sections:[
      ['Unordered list','ul হলো unordered list। প্রতিটি item li-এর মধ্যে লিখতে হয়। Browser সাধারণত bullet দেখায়। বিষয়গুলোর order বদলালেও অর্থ না বদলালে ul উপযুক্ত, যেমন শখ, প্রয়োজনীয় জিনিস বা শেখার বিষয়। শুধু কয়েকটি paragraph-এর সামনে গোল চিহ্ন লিখে list-এর অর্থ পাওয়া যায় না।'],
      ['Ordered list','ol হলো ordered list। Browser সাধারণত সংখ্যা দেখায়। রুটিন, নির্দেশনা বা কোনো প্রক্রিয়ার ধাপের জন্য ব্যবহার করুন যখন ক্রমটি অর্থপূর্ণ। প্রতিটি li list-এর সরাসরি item হয়। হাতে 1, 2, 3 লিখবেন না; browser numbering করবে। এতে মাঝখানে item যোগ করলেও নিজে সব সংখ্যা বদলাতে হয় না।'],
      ['Line break','br একটি void element: এর জন্য closing tag লাগে না। একটি ঠিকানা বা কবিতার মতো content-এ প্রয়োজনীয় line break দিতে পারেন। নতুন paragraph চাইলে p ব্যবহার করুন। শুধু খালি জায়গা বাড়ানোর জন্য অনেক br বসানো structure দুর্বল করে। Layout-এর spacing পরে CSS-এর দায়িত্ব।'],
      ['Button কী করে?','button একটি action control। <button type="button">...</button> নিজে কোনো JavaScript behavior বানায় না। তাই শুধু button লিখলেই save, login বা download বাস্তবায়িত হয় না। Form-এর মধ্যে type না দিলে submit হয়ে যেতে পারে। সাধারণ নিষ্ক্রিয় practice button-এ type="button" লিখে উদ্দেশ্য পরিষ্কার রাখুন।'],
      ['সঠিক গঠন পড়ে দেখা','প্রথমে list খুলুন, তারপর item, সব item শেষে list বন্ধ করুন। li-গুলোকে একই level-এ indentation দিন। button-এর লেখা action বোঝাবে—শুধু “এখানে” নয়। পরে browser preview-তে list-এর সংখ্যা, bullet এবং button আলাদা করে চিনুন। Keyboard-এর Tab দিয়ে button focus হয় কি না নিজের browser-এও দেখুন।']
    ],
    syntax:'<ul><li>একটি item</li></ul> এবং <ol><li>প্রথম ধাপ</li></ol>। <br> closing tag ছাড়া লেখা হয়।',
    code:'<h1>আজকের পরিকল্পনা</h1>\n<ul><li>খাতা</li><li>কলম</li></ul>\n<ol><li>পাঠ পড়ি</li><li>উদাহরণ লিখি</li><li>Practice করি</li></ol>\n<p>Learning Club<br>ঢাকা, বাংলাদেশ</p>\n<button type="button">শেখা শুরু করি</button>',
    breakdown:['ul জিনিসের unordered দল, ol ধারাবাহিক কাজ।','প্রতিটি তালিকার entry আলাদা li।','br একই paragraph-এ address-এর পরের line তৈরি করেছে।','Button একটি control দেখাচ্ছে, কোনো course শুরু করার behavior নয়।'],
    output:'একটি bullet list, একটি numbered list, দুই লাইনের ঠিকানা এবং button দেখবেন। Preview-তে button চাপলে কিছু না হওয়া এই উদাহরণে স্বাভাবিক।',
    mistakes:[['li-কে ul বা ol ছাড়া লেখা','Item-গুলোকে একটি list-এর মধ্যে রাখুন।'],['সব spacing-এ br','নতুন ভাবের জন্য নতুন p ব্যবহার করুন।']],
    revision:['Order জরুরি হলে ol, না হলে ul।','List item লিখতে li লাগে।','Button-এর চেহারা আর কাজের implementation আলাদা।'],
    questions:['Recipe steps-এর জন্য কোন list ভালো?','br-এর closing tag কেন লিখবেন না?','type="button" দিলে কি নিজে form submit হয়?'],
    task:'তিনটি পড়ার জিনিসের ul ও তিনটি পড়ার ধাপের ol লিখুন। নিচে একটি type="button" button দিন।'
  },
  {
    id:'1-5',title:'HTML Links',subtitle:'এক page থেকে অন্য ঠিকানায় যাওয়া',
    objectives:['a ও href দিয়ে link বানাবেন।','Absolute এবং relative URL আলাদা করবেন।','নতুন tab-এর safe pattern লিখবেন।'],
    intro:'ওয়েবের একটি বড় সুবিধা হলো এক লেখা থেকে আরেক জায়গায় যেতে পারা। যেমন একটি course page থেকে lesson খোলা। Link-এর দৃশ্যমান লেখা আর গন্তব্য আলাদা জিনিস। “HTML reference পড়ুন” লেখা থাকতে পারে, কিন্তু কোথায় যাবে তা href attribute নির্ধারণ করে।',
    sections:[
      ['Anchor element','a-কে anchor element বলা হয়। Opening tag-এর href-এ গন্তব্য দিন, মাঝে অর্থপূর্ণ text দিন। শুধু “Click here” না লিখে গন্তব্য বা কাজ বুঝিয়ে লিখলে পাঠক সুবিধা পান। Screen reader দিয়ে link-এর তালিকা শুনলেও যেন বোঝা যায়। href না থাকলে সেটি সাধারণ clickable navigation link হিসেবে কাজ করবে না।'],
      ['Absolute URL','https:// দিয়ে পূর্ণ address দিলে সেটি absolute URL। অন্য website-এ যাওয়ার জন্য ব্যবহার করতে পারেন। Spelling ও domain ঠিক আছে কি দেখুন। Text-এর সঙ্গে গন্তব্যের মিল থাকা জরুরি; বিশ্বাসযোগ্য নাম লিখে অন্য জায়গায় পাঠানো বিভ্রান্তিকর। অজানা link থেকে software নামানোর আগে উৎস যাচাই করুন।'],
      ['Relative path','about.html একই folder-এর file বোঝায়। pages/about.html ভেতরের pages folder-এর file, আর ../index.html এক ধাপ parent folder-এ যায়। Slash এবং file extension ঠিক হতে হবে। আপনার computer-এর C drive-এর পুরো path অন্য মানুষের কাছে কাজ করবে না। Project folder-এর সম্পর্ক অনুযায়ী path লিখতে শিখুন।'],
      ['নতুন tab','সাধারণ link একই tab-এ খোলে। সত্যিই দরকার হলে target="_blank" দিন এবং rel="noopener noreferrer" ব্যবহার করুন। noopener নতুন page-এর opener access সীমিত করে; noreferrer referrer তথ্যও পাঠানো বন্ধ করে। আধুনিক browser-এর কিছু সুরক্ষা default থাকলেও explicit pattern পড়তে পরিষ্কার। Link text-এ নতুন tab-এর কথা জানানো ভালো।'],
      ['এই lab-এর সীমা','Practice preview একটি sandbox: বাইরের site খোলা বা নতুন window তৈরি সীমিত রাখা হয়েছে। তাই link-এর রূপ দেখবেন, কিন্তু navigation না চলা HTML-এর ভুল বোঝায় না। নিজের local file browser-এ খুলে বাস্তব navigation পরীক্ষা করুন। কোন গন্তব্যে যাবেন তা আগে address দেখে নিন; preview-তে বাস্তব login করবেন না।']
    ],
    syntax:'<a href="about.html">আমাদের সম্পর্কে</a>। href-এ URL, মাঝের text-এ ব্যবহারকারীর পড়ার নাম।',
    code:'<p><a href="about.html">আমাদের সম্পর্কে</a></p>\n<p><a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">HTML reference — নতুন tab</a></p>',
    breakdown:['about.html একটি relative destination; file-টি সত্যিই থাকতে হবে।','দ্বিতীয় link পূর্ণ https URL ব্যবহার করেছে।','target নতুন tab চায়; rel নিরাপদ external-link pattern।'],
    output:'দুটি link সাধারণত underlined হবে। Preview sandbox-এ navigation সীমিত, local browser-এ file-গুলো দিয়ে পরীক্ষা করুন।',
    mistakes:[['href-এর বানান ভুল করে herf','Attribute-এর নাম href লিখুন।'],['https:// ছাড়া বাইরের domain লেখা','Browser সেটিকে relative path ভাবতে পারে; পূর্ণ URL লিখুন।']],
    revision:['a + href navigation link তৈরি করে।','Relative path বর্তমান file-এর অবস্থানের ওপর নির্ভর করে।','নতুন tab দরকার হলে target ও rel বুঝে ব্যবহার করুন।'],
    questions:['about.html ও https://example.com/about-এর পার্থক্য কী?','অর্থপূর্ণ link text কেন প্রয়োজন?','Sandbox-এ link না খুললে কি সব সময় code ভুল?'],
    task:'একটি relative link ও একটি https external link লিখুন। External link-এ নতুন tab ও নিরাপদ rel দিন।'
  },
  {
    id:'1-6',title:'HTML Images',subtitle:'ছবির ঠিকানা, মাপ ও বিকল্প বর্ণনা',
    objectives:['img-এর src ও alt লিখবেন।','Folder path-এর ভুল শনাক্ত করবেন।','width/height দিয়ে অনুপাত বজায় রাখবেন।'],
    intro:'পরিচিতি পেজে একটি ছবি যোগ করতে চাইলে ছবির file কোথায় আছে তা জানাতে হয়। শুধু “আমার ছবি” লিখলে browser ছবি খুঁজে পায় না। img element ছবির উৎসের ঠিকানা গ্রহণ করে। কিন্তু ছবি দেখা না গেলেও পাঠক যেন প্রয়োজনীয় অর্থ পান, সেটিও আমাদের দায়িত্ব।',
    sections:[
      ['img ও src','img একটি void element; এর closing tag নেই। src হলো source অর্থাৎ ছবির address। একটি online ছবির পূর্ণ https address দিতে পারেন, তবে অনুমতি ও নির্ভরযোগ্যতা গুরুত্বপূর্ণ। অন্য site image hotlink বন্ধ করতে পারে বা file সরিয়ে নিতে পারে। নিজের project-এর images folder-এ অনুমোদিত file রাখা বেশি নিয়ন্ত্রণ দেয়।'],
      ['Local folder বুঝুন','index.html-এর পাশে images folder থাকলে images/profile.jpg লিখুন। HTML file যদি pages folder-এ থাকে, parent-এ ফেরার জন্য ../images/profile.jpg লাগতে পারে। File-এর নাম, বড়-ছোট অক্ষর, extension ও slash পরীক্ষা করুন। অনেক server-এ Photo.jpg এবং photo.jpg আলাদা file; নিজের machine-এ চললেও hosted site-এ সমস্যা হতে পারে।'],
      ['Alt text','alt হলো ছবির অর্থপূর্ণ বিকল্প বর্ণনা। ছবি load না হলে অথবা image দেখতে না পারলে এটি কাজে লাগে। “image” বা file-এর নামের বদলে প্রাসঙ্গিক বিষয় লিখুন, যেমন “নোটবুকে HTML layout আঁকা”। নিছক সাজসজ্জার ছবি হলে alt="" উপযুক্ত হতে পারে। এই module-এর practice-এ অর্থপূর্ণ ছবি ব্যবহার করছি, তাই বর্ণনামূলক alt চাই।'],
      ['মাপ ও অনুপাত','width ও height attribute সাধারণত integer pixel dimension নেয়। মূল ছবির অনুপাতের সঙ্গে মান মিললে distortion হয় না এবং browser জায়গা সংরক্ষণ করতে পারে। একটি 160×100 ছবি 320×200 করা একই অনুপাত; 320×50 করলে অস্বাভাবিক চ্যাপ্টা হবে। Responsive styling পরে CSS-এ শিখবেন।'],
      ['Broken image পরীক্ষা','ছবি না এলে প্রথমে path দেখুন, তারপর file সত্যিই আছে কি না, শেষে browser network বা file permission দেখুন। Module preview শুধু embedded sample image দেখায় এবং বাইরের image request আটকায়; এটি tracking ও অপ্রত্যাশিত network request কমায়। নিজের local browser-এ external বা local file দিয়ে পরীক্ষা করুন। অন্য মানুষের ব্যক্তিগত ছবি অনুমতি ছাড়া প্রকাশ করবেন না।']
    ],
    syntax:'<img src="images/profile.jpg" alt="পড়ার টেবিলে একটি খোলা বই" width="160" height="100">',
    code:`<h1>আমার শেখার স্মৃতি</h1>\n<img src='${sampleImage}' alt="আমার learning card" width="160" height="100">\n<p>ছবির ঠিকানা ও বর্ণনা দুটোই গুরুত্বপূর্ণ।</p>`,
    breakdown:['Sample-এর src-এ একটি embedded SVG data image আছে, তাই internet image প্রয়োজন নেই।','alt অর্থ বুঝিয়েছে; এটি caption-এর বিকল্প নয়।','width এবং height একই অনুপাতে রাখা হয়েছে।'],
    output:'একটি হালকা নীল learning card দেখা যাবে। নিজের images/... path preview-তে নয়, আপনার স্থানীয় project-এ পরীক্ষা করতে হবে।',
    mistakes:[['Image.png-এর বদলে image.jpg লেখা','আসল filename ও extension মিলিয়ে নিন।'],['alt বাদ দেওয়া','অর্থপূর্ণ ছবির জন্য প্রাসঙ্গিক বিকল্প বর্ণনা দিন।']],
    revision:['src গন্তব্য বলে, alt অর্থ বলে।','img-এর closing tag লাগে না।','অনুপাতহীন মাপ ছবি বিকৃত করতে পারে।'],
    questions:['ছবি না এলে কোন তিনটি জিনিস পরীক্ষা করবেন?','alt আর filename কেন এক জিনিস নয়?','160×100-এর দ্বিগুণ মাপ কত?'],
    task:'Sample image রেখে alt নিজের ভাষায় লিখুন। মাপ 320×200 করুন এবং আগের অনুপাতের সঙ্গে তুলনা করুন।'
  },
  {
    id:'1-7',title:'Basic HTML Forms',subtitle:'Label-সহ input ও নির্বাচন',
    objectives:['Label-এর সঙ্গে input যুক্ত করবেন।','text/email/password ও select ব্যবহার করবেন।','HTML form আর backend processing আলাদা করবেন।'],
    intro:'একটি ক্লাবে নাম লেখাতে নাম, email এবং পছন্দের session জানতে চাইতে পারেন। কাগজের ফর্মের মতো ওয়েবেও ঘর থাকে। HTML সেই ঘরগুলো বানায়। কিন্তু input ঘর বানালেই তথ্য নিরাপদে জমা বা account তৈরি হয়ে যায় না। এই lesson-এ form-এর structure শিখব, বাস্তব submission নয়।',
    sections:[
      ['Form-এর দল','form সম্পর্কিত input controls একসঙ্গে রাখে। বাস্তব system-এ action গন্তব্য এবং method request-এর ধরন নির্ধারণ করে। এখানে backend বা request handling assessed নয়। Preview form submission আটকায়। তাই নিজের আসল password, email বা অন্য ব্যক্তিগত তথ্য sample form-এ দেবেন না। কাল্পনিক তথ্য দিয়ে practice করুন।'],
      ['Label কেন দরকার','label-এর for এবং input-এর id একই হলে দুটো যুক্ত হয়। Label-এ click করলে সাধারণত input focus পায় এবং assistive technology নাম বুঝতে পারে। id পুরো document-এ unique হতে হবে। placeholder কেবল নমুনা বা ছোট hint; label-এর বিকল্প নয়। Input-এর name পরবর্তী submission-এ field চেনাতে কাজে লাগে।'],
      ['সঠিক input type','type="text" সাধারণ লেখা, email email-জাতীয় input এবং password পর্দায় অক্ষর ঢেকে রাখে। Password masking কোনো encryption নয়। number সংখ্যার জন্য; ফোন নম্বরকে হিসাবের সংখ্যা ভাববেন না। required ফাঁকা থাকা আটকাতে browser validation চাইতে পারে, কিন্তু বাস্তব system-এ server validation-ও দরকার হয়।'],
      ['Checkbox, radio ও অন্য input','checkbox এক বা একাধিক স্বাধীন পছন্দের জন্য, যেমন নোট পেতে চাই। radio একই name-এর একটি group থেকে একটি পছন্দ নেয়; প্রত্যেকটির id আলাদা ও value আলাদা রাখুন। date তারিখ এবং tel ফোনের জন্য উপযোগী হতে পারে। সব ক্ষেত্রেই label দিন। Browser-এর দেখানোর ধরন device অনুযায়ী বদলাতে পারে; সঠিক type ব্যবহার করা ব্যবহারকারীকে সহায়তা করে।'],
      ['পছন্দের তালিকা','select একটি choice control এবং option তার পছন্দগুলো। প্রতিটি option-এর value code-এ ব্যবহৃত মান; দৃশ্যমান text শিক্ষার্থীর পড়ার নাম। দুটি আলাদা হতে পারে। Label select-এর সঙ্গেও যুক্ত করুন। প্রয়োজন হলে খালি value-র prompt option দিন। Option-কে select-এর বাইরে লিখলে সঠিক dropdown হবে না।'],
      ['Login ও registration','একটি login form সাধারণত email/password নেয়; registration-এ নাম ও course choice থাকতে পারে। নিচের উদাহরণে দুটি form আলাদা, তাই id-ও আলাদা। Button-এ type="submit" form-এর action চায়; type="button" নিজে submit করে না। এখানে login button আছে মানে authentication আছে—এমন ভাববেন না। JavaScript ও backend ছাড়া আমরা কেবল UI structure দেখছি।']
    ],
    syntax:'<label for="student">নাম</label><input id="student" name="student" type="text"> — for ও id একই।',
    code:'<h1>Form practice</h1>\n<form>\n  <h2>Login demo</h2>\n  <label for="login-email">Email</label>\n  <input id="login-email" name="email" type="email" required>\n  <label for="login-password">Password</label>\n  <input id="login-password" name="password" type="password" required>\n  <button type="submit">Login demo</button>\n</form>\n<form>\n  <h2>Student registration demo</h2>\n  <label for="student-name">নাম</label>\n  <input id="student-name" name="student" type="text" required>\n  <label for="course">কোর্স</label>\n  <select id="course" name="course">\n    <option value="html">HTML</option>\n    <option value="english">English</option>\n  </select>\n  <label for="updates">Learning notes চাই</label>\n  <input id="updates" name="updates" type="checkbox" value="yes">\n  <button type="submit">Register demo</button>\n</form>',
    breakdown:['দুটি form-এর purpose আলাদা এবং headings তা জানায়।','প্রতিটি field-এ for/id matching label আছে।','Input-এর type ও name আলাদা কাজ করছে।','Select-এর option-গুলোর value আলাদা; submit button sandbox-এ data পাঠাবে না।'],
    output:'একটি login form ও একটি registration form দেখা যাবে। HTML-only controls সাধারণ browser style-এ থাকবে।',
    mistakes:[['দুটি input-এ একই id','প্রতিটি field-এর id আলাদা করে label-ও ঠিক করুন।'],['placeholder-ই শুধু label','দৃশ্যমান label যোগ করুন।'],['Password ঢাকলেই secure ভাবা','বাস্তব security এই module-এর বাইরে; sample data-ই ব্যবহার করুন।']],
    revision:['Label সব form control-এর পরিচয় স্পষ্ট করে।','Input type উদ্দেশ্য অনুযায়ী নিন।','Form UI authentication বা data storage নয়।'],
    questions:['for এবং id না মিললে কী সমস্যা?','password type কী নিশ্চয়তা দেয় না?','select-এর সরাসরি choice element কোনটি?'],
    task:'Registration form-এ label-সহ email input যোগ করুন। Course select-এ একটি নতুন option লিখুন।'
  },
  {
    id:'1-8',title:'Complete HTML Document Structure',subtitle:'একটি পূর্ণ document line ধরে বোঝা',
    objectives:['Doctype ও document skeleton লিখবেন।','head এবং body আলাদা করবেন।','charset, viewport, title ও lang-এর উদ্দেশ্য বুঝবেন।'],
    intro:'এতক্ষণ preview-তে ছোট HTML fragment দেখেছি। Browser fragment-ও দেখাতে পারে, কিন্তু একটি সম্পূর্ণ file-এর পরিচ্ছন্ন structure শেখা জরুরি। বইয়ের বাইন্ডিং, পরিচয়পাতা এবং মূল লেখার মতো document-এরও আলাদা দায়িত্বের অংশ আছে। এই lesson-এর শেষে খালি file থেকে পূর্ণ page লিখতে পারবেন।',
    sections:[
      ['Doctype দিয়ে শুরু','<!DOCTYPE html> browser-কে modern HTML-এর standards mode ব্যবহার করতে জানায়। এটি সাধারণ element নয় এবং closing tag নেই। একেবারে শুরুতে লিখুন। বড়/ছোট অক্ষরের কয়েকটি বৈধ রূপ আছে; এখানে পরিচিত uppercase pattern ব্যবহার করছি। Doctype থাকলেই অবশ্য সব ভুল code valid হয় না।'],
      ['Root element','html পুরো document-এর root element। lang="bn" মূল ভাষা বাংলা জানায়। English মূল লেখা হলে en দিন। এই তথ্য উচ্চারণ, অনুবাদ ও ভাষাভিত্তিক processing-এ সাহায্য করে। Tag-এর নাম English বলে document-এর ভাষা English হয়ে যায় না; ভাষা নির্ভর করে content-এর ওপর।'],
      ['Head-এর metadata','head-এ document সম্পর্কে তথ্য থাকে। meta charset="utf-8" বাংলা-সহ বিস্তৃত character সঠিকভাবে বোঝাতে সাহায্য করে; file-ও UTF-8-এ save করতে হবে। title browser tab ও bookmark-এর নাম দেয়। এটি body-এর heading নয়। Head-এর লেখা সাধারণ page content হিসেবে দেখানোর জায়গা নয়।'],
      ['Viewport ও body','meta name="viewport" content="width=device-width, initial-scale=1" mobile browser-এর viewport সেট করতে সাহায্য করে। এটি একাই সব layout responsive করে দেয় না। body-এ দৃশ্যমান headings, paragraphs, lists, images ও forms থাকবে। Head-এর title এবং body-এর h1 আলাদা দায়িত্ব পালন করে; দুটোতেই ভালো পরিচয় দিন।'],
      ['পুরো document পরীক্ষা','একটি html-এর ভেতরে একটি head এবং একটি body রাখুন। ভুলভাবে body-এর মধ্যে head লিখবেন না। Browser ভাঙা structure নিজে সামলাতে পারে, তাই শুধু দেখতে ঠিক আছে বলে source সঠিক ধরে নেবেন না। নিচের code copy করে নতুন file-এ save করুন, tab title ও page heading আলাদা করে খেয়াল করুন। তারপর প্রতিটি line-এর দায়িত্ব নিজের ভাষায় বলুন।']
    ],
    syntax:'<!DOCTYPE html> → html → head + body। head-এ metadata, body-এ ব্যবহারকারীর পড়ার content।',
    code:'<!DOCTYPE html>\n<html lang="bn">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>আমার HTML খাতা</title>\n</head>\n<body>\n  <h1>আজকের শেখা</h1>\n  <p>আমি একটি পূর্ণ HTML document লিখেছি।</p>\n</body>\n</html>',
    breakdown:['Line 1: doctype standards mode নির্দেশ করে। Line 2: html root ও বাংলা ভাষা।','Line 3–7: head; charset text encoding, viewport mobile viewport, title tab-এর নাম।','Line 8–11: body; heading ও paragraph দৃশ্যমান content।','শেষ line root বন্ধ করেছে; indentation দিয়ে nesting দেখা সহজ।'],
    output:'Preview-তে heading ও paragraph দেখবেন। iframe-এর title তার enclosing UI-তে নির্ধারিত; tab title পরীক্ষা করতে নিজের file আলাদা browser tab-এ খুলুন।',
    mistakes:[['title-কে h1-এর বিকল্প ভাবা','দৃশ্যমান heading body-তে h1 দিয়ে লিখুন।'],['বাংলা ভেঙে গেলে শুধু font বদলানো','File encoding এবং meta charset-ও পরীক্ষা করুন।']],
    revision:['Doctype element নয়।','head metadata ধরে, body content ধরে।','Viewport tag responsive design-এর একমাত্র শর্ত নয়।'],
    questions:['title ও h1 কোথায় লিখবেন?','lang কেন গুরুত্বপূর্ণ?','Doctype-এর closing tag আছে কি?'],
    task:'সম্পূর্ণ document লিখে নিজের learning diary-এর title, h1 এবং দুটি paragraph দিন। charset ও viewport রাখুন।'
  },
  {
    id:'1-9',title:'HTML Revision and Application',subtitle:'শেখা বিষয় মিলিয়ে একটি page',
    objectives:['সব মৌলিক element এক page-এ মিলাবেন।','পরিকল্পনা থেকে code তৈরি করবেন।','নিজের structure ও accessibility review করবেন।'],
    intro:'আলাদা ইট চিনলেই বাড়ি তৈরি হয়ে যায় না; ইটগুলো কীভাবে সাজবে সেটিও ভাবতে হয়। একইভাবে tag মুখস্থ করা আর ব্যবহারযোগ্য ছোট webpage বানানো আলাদা দক্ষতা। আজ একটি reading club page বানাব। লক্ষ্য fancy design নয়—অর্থপূর্ণ তথ্য, সঠিক structure এবং অনুসরণযোগ্য action।',
    sections:[
      ['Code-এর আগে content','কাগজে লিখুন page-এর নাম, দুই বাক্যের পরিচিতি, তিনটি বই বা কাজ, একটি resource link এবং membership interest form। কে page পড়বে তা ভাবুন। এরপর তথ্যগুলোকে heading ও paragraph-এ ভাগ করুন। এই planning করলে কোন tag কোথায় লাগবে তা নিজেই পরিষ্কার হতে শুরু করে।'],
      ['Structure তৈরি','প্রথমে doctype, html, head, title, meta ও body লিখুন। body-তে একটি মূল h1 দিন। পরিচিতি ও কার্যক্রমের জন্য h2 দিন। সম্পর্কিত অংশ div-এ রাখতে পারেন। শুধু line break দিয়ে আলাদা বড় অংশ বানাবেন না। বৈধ nesting বজায় রাখতে paragraph-এর বাইরে list ও form রাখুন।'],
      ['List, link ও image','তিনটি পছন্দের বই ul-এ লিখুন; ক্লাবে যোগ দেওয়ার ধাপ ol-এ লিখতে পারেন। Resource link-এর text পরিষ্কার রাখুন। একটি relevant image দিন এবং alt লিখুন। এই lab-এর sample embedded image ব্যবহার করলে preview-তে দেখবেন; নিজের file নিয়ে কাজের সময় সঠিক relative path লিখুন।'],
      ['Form-এর উদ্দেশ্য পরিষ্কার','নাম ও email-এর input, label এবং session select দিন। প্রতিটি id unique কি না দেখুন। Form-টি HTML-only demonstration—এ কথা পাঠককে জানান। এখানে data জমা হয় না। বাস্তব service-এর মতো password চাইতে যাবেন না। যে field উদ্দেশ্যের জন্য দরকার নেই, সেটি সংগ্রহ না করাই ভালো।'],
      ['নিজেই reviewer হন','প্রথমে page-এর heading hierarchy পড়ুন। তারপর link-এর destination, image description ও label matching দেখুন। Keyboard দিয়ে controls-এ যেতে পারেন কি পরীক্ষা করুন। ভুল spelling, ফাঁকা content ও অপ্রয়োজনীয় tag ঠিক করুন। Practice checker কেবল নির্দিষ্ট structure পরীক্ষা করে; লেখা ভালো কি না বা তথ্য সত্য কি না তা বিচার করতে পারে না।'],
      ['শেষ করার মানে','Run দিয়ে output দেখুন, checklist দিয়ে structure যাচাই করুন, তারপর নিজের ভাষায় code ব্যাখ্যা করুন। ছোট পরিবর্তন করুন: ক্লাবের বদলে portfolio হলে কোন অংশ বদলাবে? নতুন বিষয়েও একই ধারণা কাজে লাগাতে পারলেই শেখা স্থায়ী হয়। Final project-এ নিজের original text লিখবেন; উদাহরণ হুবহু জমা দেওয়া লক্ষ্য নয়।']
    ],
    syntax:'একটি পূর্ণ document-এর body-তে h1, h2, p, img, ul/li, a ও form/input/select একত্রে ব্যবহার করুন।',
    code:`<!DOCTYPE html>\n<html lang="bn">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>পড়ার ক্লাব</title></head>\n<body>\n<h1>শুক্রবারের পড়ার ক্লাব</h1>\n<p>আমরা গল্প পড়ি এবং শেখা বিষয় নিয়ে কথা বলি।</p>\n<img src='${sampleImage}' alt="পড়ার ক্লাবের learning card" width="160" height="100">\n<h2>আমাদের কাজ</h2>\n<ul><li>গল্প পড়া</li><li>নোট লেখা</li><li>আলোচনা</li></ul>\n<p><a href="https://example.com/books">বইয়ের resource</a></p>\n<h2>আগ্রহ জানান — demo</h2>\n<form><label for="club-name">নাম</label><input id="club-name" name="name" type="text"><button type="submit">Demo পাঠান</button></form>\n<small>এই form তথ্য সংরক্ষণ করে না।</small>\n</body>\n</html>`,
    breakdown:['head document-এর metadata ধরে রেখেছে।','body-তে পরিচিতি, image ও কাজের list রয়েছে।','form-এর label/input id মিলে গেছে।','small পাঠককে demo সীমা জানিয়েছে।'],
    output:'ছবি, কাজের তালিকা, resource link ও demo form-সহ একটি সাধারণ club page দেখা যাবে। CSS ছাড়া browser-এর default layout-ই প্রত্যাশিত।',
    mistakes:[['দেখতে সুন্দর হলেই structure ঠিক ধরে নেওয়া','Code ও checklist দুটোই পরীক্ষা করুন।'],['Demo form-কে কাজ করছে বলে প্রচার করা','Storage বা backend না থাকলে সীমা পরিষ্কার লিখুন।']],
    revision:['Content plan থেকে tag নির্বাচন করুন।','একত্রে ব্যবহারের সময়ও nesting ও labels ঠিক রাখুন।','Automatic checker সম্পূর্ণ quality review নয়।'],
    questions:['কেন coding-এর আগে content লিখবেন?','Image-এর alt review-এ কী দেখবেন?','Demo form-এর সীমা কেন বলা উচিত?'],
    task:'নিজের book club বা study group নিয়ে নতুন page তৈরি করুন। উদাহরণের নাম ও বাক্য বদলে মৌলিক content লিখুন।'
  },
  {
    id:'1-10',title:'Understanding HTML Lists Visually',subtitle:'Ordered, unordered ও nested list',
    objectives:['List-এর parent-child সম্পর্ক দেখবেন।','একটি li-এর ভেতরে nested list লিখবেন।','List type বদলে output তুলনা করবেন।'],
    intro:'একটি ব্যাগে কয়েকটি খাতা আছে, আর একটি খাতার মধ্যে আবার কয়েকটি chapter। এখানে বাইরের দল এবং ভেতরের উপদল আছে। HTML nested list-এও একই সম্পর্ক দেখা যায়। আজ শুধু সংখ্যা বা bullet দেখা নয়, কোন item-এর অধীনে কোন subitem আছে তা বুঝব।',
    sections:[
      ['Parent আর child','যে element-এর ভেতরে আরেকটি element থাকে তাকে parent, ভেতরেরটিকে child বলা যায়। ul বা ol-এর সরাসরি list item হয় li। একটি item-এর আরও তথ্যের তালিকা থাকলে সেই li-এর ভেতরেই নতুন ul বা ol রাখুন। শুধু বাইরের list-এর পাশে আরেক list বসালে সেই সম্পর্ক ঠিকভাবে প্রকাশ হয় না।'],
      ['এক item-এর ভেতরে আরেক দল','“সোমবার” একটি বাইরের item, তার ভেতরে “HTML পড়া” ও “নোট লেখা” দুটি subitem। সোমবারের li বন্ধ করার আগে ভেতরের list লিখুন এবং বন্ধ করুন। তারপর বাইরের li বন্ধ হবে। Indentation দিয়ে এটি সহজে দেখা যায়। খোলা tag-এর উল্টো ক্রমে বন্ধ করার নিয়ম এখানেও কাজে লাগে।'],
      ['Order বদলে দেখা','বাইরের routine-এর ক্রম গুরুত্বপূর্ণ হলে ol নিন। ভিতরের বিষয়গুলো কেবল পছন্দ হলে ul নিতে পারেন। দুটোকেই একই ধরনের list করতে হবে এমন নিয়ম নেই। নিচের visual explorer-এ ordered/unordered নির্বাচন করে label ও marker-এর পার্থক্য দেখুন। Nested toggle চাপলে একই item-এর অধীনে শিশু item দেখা যাবে।'],
      ['কেন হাতে marker নয়','Paragraph-এর আগে 1. বা • লিখে একই দৃশ্য বানানো যায়, কিন্তু list-এর structure থাকে না। নতুন item ঢোকালে হাতে সংখ্যা ঠিক করতে হবে। Semantic list browser এবং assistive tools-কে item-এর দল চিনতে দেয়। তাই চেহারা অনুকরণ না করে সঠিক element ব্যবহার করাই শেখার মূল বিষয়।'],
      ['নিজের চোখে যাচাই','বাইরের item কয়টি, ভেতরের item কয়টি—আলাদা করে গুনুন। পুরো document-এর সব li গুনলে subitem-ও যোগ হবে। Practice problem যদি সরাসরি তিনটি item চায়, nested item দিয়ে সেই শর্ত পূরণ হবে না। Checklist-এর ভাষা মন দিয়ে পড়ুন। নিচের উদাহরণে দুইটি বাইরের item, প্রথম item-এর ভেতরে দুইটি subitem আছে।'],
      ['Revision activity','Code editor-এ সোমবারকে শনিবার করুন। তারপর বাইরে তৃতীয় দিনের item যোগ করুন। সবশেষে প্রথম দিনের ভেতরে তৃতীয় কাজ যোগ করুন। Preview চালিয়ে দেখুন কোন marker কোন level-এ এসেছে। ভুল nesting হলে বন্ধ tag-এর জায়গা খুঁজে ঠিক করুন। জটিল animation ছাড়াই code ও rendered structure পাশাপাশি দেখে বোঝা সম্ভব।']
    ],
    syntax:'<ol><li>দিন<ul><li>কাজ</li></ul></li></ol> — ভেতরের ul বাইরের li বন্ধ হওয়ার আগেই লেখা হয়েছে।',
    code:'<h1>সাপ্তাহিক শেখা</h1>\n<ol>\n  <li>সোমবার\n    <ul><li>HTML পড়া</li><li>নোট লেখা</li></ul>\n  </li>\n  <li>মঙ্গলবার</li>\n</ol>',
    breakdown:['ol-এর দুটি সরাসরি li আছে: সোমবার এবং মঙ্গলবার।','প্রথম li-এর child ul; তার দুটি নিজস্ব li রয়েছে।','ul বন্ধ হয়েছে, তারপর সোমবারের li বন্ধ হয়েছে।'],
    output:'সংখ্যাযুক্ত দুই দিনের তালিকা দেখবেন। প্রথম দিনের নিচে indented bullet-এ দুটি কাজ আছে।',
    mistakes:[['Nested ul-কে বাইরের ol-এর সরাসরি child করা','Nested list-টিকে সংশ্লিষ্ট li-এর ভেতরে রাখুন।'],['শুধু সব li গুনে বাইরের item count বলা','Parent-এর সরাসরি children আলাদা করে দেখুন।']],
    revision:['Nested list সংশ্লিষ্ট li-এর ভেতরে থাকে।','বাইরের ও ভেতরের list-এর ধরন আলাদা হতে পারে।','Marker হাতে নয়, structure দিয়ে তৈরি করুন।'],
    questions:['উদাহরণে মোট li এবং বাইরের li কতটি?','Nested list কোথায় লিখবেন?','একটি ol-এর ভেতরে ul থাকা কি বৈধ?'],
    task:'তিন দিনের routine বানান। প্রথম দিনের নিচে দুটি কাজের nested list দিন এবং code-এর parent-child সম্পর্ক ব্যাখ্যা করুন।'
  }
];
export const moduleTitle = 'Module 1: HTML Fundamentals — Learn and Explore HTML';
export const lessonPath = id => `${moduleBase}/lessons/${id}`;

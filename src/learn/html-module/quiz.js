// Original review questions: indices are zero based; explanations appear after submission.
export const htmlQuiz=[
 ['concept','HTML-এর প্রধান দায়িত্ব কী?',['Page-এর অর্থ ও কাঠামো প্রকাশ','Database চালানো','সব animation তৈরি','Internet সংযোগ দেওয়া'],0,'HTML headings, paragraphs ও অন্যান্য content-এর কাঠামো চিহ্নিত করে।'],
 ['error','কোন filename সরাসরি HTML file হিসেবে উপযুক্ত?',['index.txt','index.html','index.html.txt','index.docx'],1,'.html extension browser-কে file-এর ধরন চিনতে সাহায্য করে।'],
 ['structure','<p title="Note">Hello</p>-এ attribute কোনটি?',['Hello','p','title="Note"','</p>'],2,'title attribute opening tag-এর মধ্যে অতিরিক্ত তথ্য দিয়েছে।'],
 ['output','<p>আমি <strong>আজ</strong> পড়ি।</p> কী বোঝায়?',['আজ আলাদা page','সব text heading','আজ শব্দের গুরুত্ব','Paragraph লুকানো'],2,'strong শব্দের গুরুত্ব বোঝায়; default-এ সাধারণত bold হয়।'],
 ['concept','em-এর উদ্দেশ্য কী?',['Image load করা','Text-এ stress বা জোর','নতুন paragraph','List numbering'],1,'em stress emphasis বোঝায়, শুধু decoration নয়।'],
 ['structure','h2-এর অধীন উপবিভাগের সঠিক সাধারণ level কোনটি?',['h6','p','h1','h3'],3,'Hierarchy অনুযায়ী এক স্তর নিচে h3 উপযুক্ত।'],
 ['output','<p>A<span>B</span>C</p>-এর default output কী?',['A B C তিন line','ABC একই paragraph','শুধু B','কিছুই নয়'],1,'span default-এ inline; নিজে নতুন line বা space যোগ করে না।'],
 ['error','কোনটি সঠিক unordered list?',['<ul><li>বই</li></ul>','<li><ul>বই</ul></li>','<ul><p>বই</p></ul>','<ol>বই</ol>'],0,'ul-এর সরাসরি list item li।'],
 ['concept','কোন কাজে br ব্যবহার যুক্তিযুক্ত?',['Page-এর পুরো layout','দুই section-এর বড় gap','একই ঠিকানার প্রয়োজনীয় line break','একটি link'],2,'br content-এর প্রয়োজনীয় line break; section spacing-এর কৌশল নয়।'],
 ['error','External নতুন-tab link-এর safe pattern কোনটি?',['href="javascript:..."','target="blank" শুধু','href বাদ দেওয়া','target="_blank" rel="noopener noreferrer"'],3,'Explicit rel opener/referrer সংক্রান্ত নিরাপদ pattern দেয়।'],
 ['concept','alt text কেন দরকার?',['Image-এর file upload করতে','অর্থপূর্ণ বিকল্প বর্ণনা দিতে','সব image বড় করতে','নতুন tab খুলতে'],1,'Alt image দেখতে বা load করতে না পারলে content-এর অর্থ বুঝতে সাহায্য করে।'],
 ['structure','কোন label/input pair সঠিক?',['<label for="n">নাম</label><input id="x">','<label>নাম</label><input id="n">','<label for="n">নাম</label><input id="n">','<input label="নাম">'],2,'for এবং unique id মিললে explicit label association হয়।'],
 ['concept','type="password" কী করে?',['Data encrypt করে','Database তৈরি করে','চোখে অক্ষর ঢেকে রাখে','Login নিশ্চিত করে'],2,'Masking security বা backend authentication-এর বিকল্প নয়।'],
 ['structure','Browser tab-এর নাম কোথায় লিখবেন?',['body-এর p-তে','head-এর title-এ','img-এর alt-এ','button-এর name-এ'],1,'title document metadata; দৃশ্যমান main heading h1 আলাদা।'],
 ['error','Nested list কোথায় থাকবে?',['সম্পর্কিত li-এর ভেতরে','head-এর মধ্যে','ul-এর বাইরে যেকোনো জায়গায়','শুধু paragraph-এর মধ্যে'],0,'Parent item-এর closing li-এর আগে child list লিখতে হয়।']
].map(([kind,prompt,options,answer,explanation],i)=>({id:`q${i+1}`,kind,prompt,options,answer,explanation}));
export function gradeQuiz(answers){return htmlQuiz.map(q=>({id:q.id,ok:answers[q.id]===q.answer,explanation:q.explanation}));}

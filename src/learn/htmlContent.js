// Owner-supplied public YouTube references, in the requested order.
// Titles checked against YouTube on 15 October 2026. Durations not inferred.
export const htmlVideos = [
 ['YEZHgqqsocs','HTML basics & environment setup'],
 ['PtwgTt8RX5M','Paragraphs & text formatting'],
 ['d6MAKl6tM_I','Heading tags: h1 to h6'],
 ['uqtDfCDGUuA','Images, links & line breaks'],
 ['5wfVU8R2yNA','Forms, block/inline elements, div & span'],
 ['m3Nu1TlNg1o','Ordered & unordered lists'],
 ['fJKSDcXKPXo','Boilerplate, Live Server & portfolio project'],
].map(([youtubeId,title],index)=>({id:String(index+1).padStart(2,'0'),youtubeId,title,
  course:'web-development-html',kind:'video',path:`/learn/web-development/html/${String(index+1).padStart(2,'0')}`,
  url:`https://www.youtube.com/watch?v=${youtubeId}`}));
export const htmlExercises = {
 '01':{prompt:'Change the page title and heading, and write a short introduction.',starter:'<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My first page</title>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <p>I am learning HTML.</p>\n</body>\n</html>'},
 '02':{prompt:'Add another paragraph and use <strong> or <em> to highlight one phrase.',starter:'<h1>My favourite subject</h1>\n<p>I enjoy learning new things.</p>\n<p>Today I am practising <strong>HTML</strong>.</p>\n<p>Learning a little every day makes a difference.</p>'},
 '03':{prompt:'Make the main heading your own, and include two section headings using <h2>.',starter:'<h1>My Learning Journal</h1>\n<h2>What I am learning</h2>\n<p>I am practising how headings organise a page.</p>\n<h2>My next step</h2>\n<p>I will keep building one small page at a time.</p>'},
 '04':{prompt:'Add another link or image. For an image, keep useful alt text so it is accessible.',starter:'<h1>Places I want to visit</h1>\n<p>Read about <a href="https://en.wikipedia.org/wiki/Bangladesh">Bangladesh</a>.</p>\n<p>Line one<br>Line two</p>\n<!-- Add an image with descriptive alt text below -->'},
 '05':{prompt:'Add a labelled input or another option to this simple form.',starter:'<h1>Quick check-in</h1>\n<form>\n  <label for="name">Your name</label>\n  <input id="name" name="name" type="text">\n  <button type="button">Say hello</button>\n</form>\n<div><p>This paragraph is inside a block element.</p></div>\n<p>A <span>small inline phrase</span> can sit inside a sentence.</p>'},
 '06':{prompt:'Add one more favourite item and try changing the ordered list into an unordered list.',starter:'<h1>My study goals</h1>\n<ol>\n  <li>Practise HTML</li>\n  <li>Build a small project</li>\n  <li>Share what I learned</li>\n</ol>\n<h2>Things I enjoy</h2>\n<ul>\n  <li>Reading</li>\n  <li>Learning</li>\n</ul>'},
 '07':{prompt:'Make this page your own: change its title, add a section, and include a useful link.',starter:'<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My portfolio</title>\n</head>\n<body>\n  <header><h1>Your name</h1><p>A short introduction about you.</p></header>\n  <main>\n    <section><h2>What I am learning</h2><p>I am building my first portfolio.</p></section>\n    <section><h2>My next project</h2><p>Describe an idea you want to build.</p></section>\n    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">Explore HTML reference</a>\n  </main>\n</body>\n</html>'},
};
export function cleanHtmlProgress(value){return [...new Set((Array.isArray(value)?value:[]).filter(id=>htmlVideos.some(v=>v.id===id)))];}

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
export function cleanHtmlProgress(value){return [...new Set((Array.isArray(value)?value:[]).filter(id=>htmlVideos.some(v=>v.id===id)))];}

// Small task checks, not a grade or a claim that the full lesson is mastered.
export function checkHtmlPractice(id, code, starter, parse) {
  if (code.trim() === starter.trim()) return {ok:false,message:'Make the small change above first, then check your work.'};
  const doc = parse(code), original = parse(starter);
  const text = selector => doc.querySelector(selector)?.textContent.trim() || '';
  const count = selector => doc.querySelectorAll(selector).length;
  const changed = selector => text(selector) && text(selector) !== (original.querySelector(selector)?.textContent.trim() || '');
  const checks = {
    '01': [changed('title') && changed('h1') && !!text('p'), 'Change the page title and heading, and add a short introduction.'],
    '02': [count('p') > original.querySelectorAll('p').length && !!text('strong, em'), 'Add another paragraph and highlight a phrase with <strong> or <em>.'],
    '03': [!!text('h1') && count('h2') >= 2 && changed('h1'), 'Give the page your own title and keep two section headings using <h2>.'],
    '04': [count('a[href]') > original.querySelectorAll('a[href]').length || [...doc.querySelectorAll('img[src]')].some(img => img.getAttribute('src').trim() && img.getAttribute('alt')?.trim()), 'Add a link with an href, or an image with a source and useful alt text.'],
    '05': [[...doc.querySelectorAll('input[id]')].some(input => !original.getElementById(input.id) && [...doc.querySelectorAll('label[for]')].some(label => label.htmlFor === input.id && label.textContent.trim())) || count('option') > original.querySelectorAll('option').length, 'Add a new input with a matching label, or add a select option.'],
    '06': [count('li') > original.querySelectorAll('li').length || (count('ol') === 0 && count('ul') >= 2), 'Add one more list item, or change the ordered list into an unordered list.'],
    '07': [changed('title') && count('section') > original.querySelectorAll('section').length && [...doc.querySelectorAll('a[href]')].some(a => a.textContent.trim() && a.getAttribute('href').trim() && a.getAttribute('href') !== original.querySelector('a')?.getAttribute('href')), 'Change the page title, add a section, and include your own useful link.'],
  };
  const [ok, hint] = checks[id] || [false,'Choose a class to practise.'];
  return {ok:!!ok,message:ok?'Your task checks passed. Take a look at your preview, too!':hint};
}
export const htmlMilestones = [
  {name:'First steps',description:'Set up a page & shape your text',ids:['01','02']},
  {name:'Page builder',description:'Give your pages structure',ids:['03','04','05']},
  {name:'Bring it together',description:'Build towards your portfolio',ids:['06','07']},
];

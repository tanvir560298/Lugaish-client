// Pathway identities only. Curriculum is loaded from the published server catalog.
export const COURSE_DATA = Object.fromEntries(['english','arabic','paid_batch'].map(language=>[language,{title:language==='paid_batch'?'Private Batch':language==='arabic'?'Arabic':'English',isPrivate:language==='paid_batch',modules:[]}]));

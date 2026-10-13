export function normalizeAnswer(value,language,caseSensitive=false){
 const text=String(value??'').normalize('NFC').trim().replace(/\s+/gu,' ');
 // Arabic hamza, ta marbuta, ya/alif maqsura and diacritics remain significant.
 return language==='english'&&!caseSensitive?text.toLocaleLowerCase('en'):text;
}
export function validExercise(q){
 if(!q||typeof q.id!=='string'||typeof q.prompt!=='string'||!q.prompt.trim())return false;
 if(q.type==='choice')return Array.isArray(q.options)&&q.options.length>=2&&q.options.every(x=>typeof x==='string')&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length;
 if(q.type==='blank')return Array.isArray(q.acceptedAnswers)&&q.acceptedAnswers.length>0&&q.acceptedAnswers.every(x=>typeof x==='string'&&x.trim());
 if(q.type==='matching')return Array.isArray(q.pairs)&&q.pairs.length>=2&&q.pairs.every(p=>typeof p.left==='string'&&typeof p.right==='string');
 if(q.type==='ordering')return Array.isArray(q.tokens)&&q.tokens.length>=2&&q.tokens.every(x=>typeof x==='string')&&Array.isArray(q.order)&&q.order.length===q.tokens.length&&new Set(q.order).size===q.tokens.length&&q.order.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length);
 return false;
}
export function hasAnswer(q,value){
 if(q.type==='choice')return Number.isInteger(value)&&value>=0&&value<q.options.length;
 if(q.type==='blank')return typeof value==='string'&&value.trim().length>0;
 const size=q.type==='matching'?q.pairs.length:q.tokens.length;
 return Array.isArray(value)&&value.length===size&&new Set(value).size===size&&value.every(i=>Number.isInteger(i)&&i>=0&&i<size);
}
export function evaluateAnswer(q,value,language){
 if(!validExercise(q)||!hasAnswer(q,value))return false;
 if(q.type==='choice')return value===q.answer;
 if(q.type==='blank')return q.acceptedAnswers.some(a=>normalizeAnswer(a,language,q.caseSensitive)===normalizeAnswer(value,language,q.caseSensitive));
 const expected=q.type==='matching'?q.pairs.map((_,i)=>i):q.order;
 return expected.every((x,i)=>x===value[i]);
}
export function correctAnswer(q){
 if(q.type==='choice')return q.options[q.answer];
 if(q.type==='blank')return q.acceptedAnswers[0];
 if(q.type==='ordering')return q.order.map(i=>q.tokens[i]).join(' ');
 return q.pairs.map(p=>`${p.left} — ${p.right}`).join('; ');
}
export function fromLessonQuiz(quiz){const questions=(Array.isArray(quiz)?quiz:[]).map((q,i)=>({id:`q-${i}`,type:'choice',prompt:q?.question,options:q?.options,answer:q?.answer??q?.correctAnswer,explanation:q?.explanation}));return questions.every(validExercise)?questions:[];}
export function contentVersion(questions){let hash=2166136261;for(const c of JSON.stringify(questions)){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}return(hash>>>0).toString(16);}
export function restoreDraft(raw,questions){
 try{const v=JSON.parse(raw);if(v?.version!==contentVersion(questions)||!Array.isArray(v.responses)||v.responses.length>questions.length)return null;
 if(v.responses.some((a,i)=>a!==null&&!hasAnswer(questions[i],a)))return null;
 const index=Number.isInteger(v.index)&&v.index>=0&&v.index<questions.length?v.index:0;
 return{index,responses:v.responses,checked:v.responses[index]!=null};}catch{return null;}
}
export function confirmedQuizResult(result,total){return !!result&&Number.isInteger(result.correctAnswers)&&result.correctAnswers>=0&&result.correctAnswers<=total&&result.totalQuestions===total&&Number.isFinite(result.score)&&result.score>=0&&result.score<=100;}

// Bundled answer keys are used only for their matching published question set.
export function matchingLessonContent(bundled,remote){
 if(!Array.isArray(remote)||remote.length===0)return true;
 return remote.length===bundled.length&&remote.every((q,i)=>q.question===bundled[i].prompt&&JSON.stringify(q.options)===JSON.stringify(bundled[i].options));
}

export async function saveConfirmedQuiz(submit,record,total){
 const result=await submit();
 if(!confirmedQuizResult(result,total))throw new Error('The server did not confirm a complete result. Your draft has been retained.');
 record(result);return result;
}

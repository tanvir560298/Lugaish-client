import {Link,useSearchParams} from 'react-router-dom';
import {PracticeSession} from '../learning/practice/PracticeSession.jsx';
import {fixtureQuestions,arabicFixture} from '../learning/practice/fixture.js';
import {COURSE_DATA} from '../data/courseData.js';
import {fromLessonQuiz} from '../learning/practice/engine.js';
export function PracticePreviewPage(){
 const[params]=useSearchParams();const course=params.get('course');
 const language=course==='arabic'||params.get('language')==='arabic'?'arabic':'english';
 const day=Number(params.get('day'))||2;
 const lesson=['english','arabic'].includes(course)?COURSE_DATA[course].modules.flatMap(m=>m.lessons).find(l=>l.id.endsWith(`-${day}`)):null;
 const questions=lesson?fromLessonQuiz(lesson.quiz):language==='arabic'?arabicFixture:fixtureQuestions;
 if(!questions.length)return <section className="practice-workspace"><h1>No existing quiz on this day</h1><Link to="/practice-preview">Return to interaction fixtures</Link></section>;
 return <PracticeSession key={`${language}:${lesson?.id??'fixture'}`} title={lesson?.title??'Practice interaction laboratory'} description={lesson?'Development-only preview of existing bundled curriculum. This route grants no enrollment and never submits course completion.':'Development-only UI fixture. These activities are not lessons and never save course completion.'} language={language} questions={questions} storageKey={`lugaish-practice-fixture-v1:${language}:${lesson?.id??'interaction'}`} preview><div className="practice-actions"><Link to="/practice-preview?course=english&day=2">Existing English MCQ</Link><Link to="/practice-preview?course=arabic&day=2">Existing Arabic MCQ</Link><Link to="/practice-preview">Interaction fixtures</Link></div></PracticeSession>;
}

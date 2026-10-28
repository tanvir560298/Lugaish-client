import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Bookmark, Check, Code2, BookOpen, Film, MessageCircle } from 'lucide-react';
import { upcomingCourses } from '../data/upcomingCourses.js';
import './upcoming-courses.css';
const icons = { programming: Code2, languages: BookOpen, creative: Film };
export function UpcomingCourses({ category = 'all' }) {
  const courses = upcomingCourses.filter(course => category === 'all' || course.category === category);
  if (!courses.length) return null;
  return <section className="upcoming-section" id="upcoming-courses" aria-labelledby="upcoming-title">
    <div className="upcoming-heading"><div><p className="lx-eyebrow">THE NEXT CHAPTERS</p><h2 id="upcoming-title">Upcoming courses</h2><p>More ways to grow. Four new courses on the horizon.</p></div><span className="upcoming-badge">COMING SOON</span></div>
    <div className="upcoming-grid">{courses.map(course => { const Icon = course.id === 'english-masterclass' ? MessageCircle : icons[course.category]; return <article className={`upcoming-card upcoming-${course.color}`} key={course.id}>
      <div className="upcoming-art" aria-hidden="true"><Icon size={24}/><span dir={course.id === 'arabic-learning' ? 'rtl' : undefined}>{course.symbol}</span><small>LUGAISH / NEXT CHAPTER</small></div>
      <div className="upcoming-body"><span className="lx-pill">COMING SOON</span><h3>{course.title}</h3><p>{course.description}</p><div className="upcoming-tags">{course.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link to={`/upcoming/${course.id}`}>Preview course <ArrowRight size={17}/></Link></div>
    </article>; })}</div>
    <p className="upcoming-note">Launch dates, course fees and final syllabus will be announced before enrollment opens.</p>
  </section>;
}
export function UpcomingCoursePage() {
  const { courseId } = useParams();
  return <CoursePreview key={courseId} course={upcomingCourses.find(course => course.id === courseId)}/>;
}
function CoursePreview({ course }) {
  const [saved, setSaved] = useState(false), [message, setMessage] = useState('');
  const key = course ? `lugaish_course_interest:${course.id}` : '';
  useEffect(() => { try { setSaved(localStorage.getItem(key) === '1'); } catch { /* Saving can be retried explicitly. */ } }, [key]);
  function toggleSaved() {
    try {
      if (saved) localStorage.removeItem(key); else localStorage.setItem(key, '1');
      setSaved(!saved);
      setMessage(saved ? 'Removed from your saved interests.' : 'Interest saved in this browser. Check back here for launch updates.');
    } catch { setMessage('Your browser could not save this. Please allow browser storage and try again.'); }
  }
  if (!course) return <div className="lx-learn"><h1>Course preview not found</h1><Link className="lx-primary" to="/learn">Explore learning paths →</Link></div>;
  return <div className="lx-learn upcoming-preview"><Link className="lx-back" to="/learn#upcoming-courses">← All courses</Link><div className={`upcoming-preview-hero upcoming-${course.color}`}><div><span className="lx-pill">UPCOMING COURSE · COMING SOON</span><h1>{course.title}</h1><p className="lx-lead">{course.description}</p><div className="upcoming-tags">{course.tags.map(tag => <span key={tag}>{tag}</span>)}</div>          <div className="lx-actions">
            {course.id === 'c-programming' ? (
              <Link className="lx-primary" to="/learn/c-programming">
                Class 01 is Live! Start Course →
              </Link>
            ) : (
              <button className="lx-primary" type="button" aria-pressed={saved} onClick={toggleSaved}>
                {saved ? <Check size={18}/> : <Bookmark size={18}/>} {saved ? 'Interest saved' : 'Save my interest'}
              </button>
            )}
            <Link className="lx-secondary" to={course.id === 'c-programming' ? '/learn/c-programming/01' : '/learn/web-development/html'}>
              {course.id === 'c-programming' ? 'Open Class 01 video →' : 'Try a free lesson →'}
            </Link>
          </div><p className="upcoming-note">Saved on this browser only. Enrollment and email notifications are not open yet.</p><p role="status" aria-live="polite">{message}</p></div><span className="upcoming-preview-symbol" aria-hidden="true">{course.symbol}</span></div><section className="lx-section"><h2>What you’ll explore</h2><p>Planned course outline. The final syllabus and launch details will be confirmed before enrollment opens.</p><ol className="lx-syllabus">{course.topics.map((topic, index) => <li key={topic}><span>0{index + 1}</span><h3>{topic}</h3></li>)}</ol></section><UpcomingCourses/></div>;
}

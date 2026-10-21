import { UpcomingCourses } from '../components/UpcomingCourses.jsx';
import { WebDevelopmentCourse } from '../components/WebDevelopmentCourse.jsx';
import './learn.css';
export function LearnPage() {
  return <div className="lx-learn course-catalog"><header className="course-catalog-heading"><p className="lx-eyebrow">A CLEAR PLACE TO START</p><h1>Build a skill.<br/>Make it yours.</h1><p className="lx-lead">Start with our ongoing Web Development course. Learn the fundamentals, follow along in Bangla, and build your first website.</p></header><section className="catalog-ongoing" aria-labelledby="ongoing-title"><div className="course-section-heading"><h2 id="ongoing-title">Ongoing course</h2><span>01 COURSE · OPEN NOW</span></div><WebDevelopmentCourse/></section><UpcomingCourses/></div>;
}

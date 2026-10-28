import { UpcomingCourses } from '../components/UpcomingCourses.jsx';
import { WebDevelopmentCourse } from '../components/WebDevelopmentCourse.jsx';
import { CProgrammingCourse } from '../components/CProgrammingCourse.jsx';
import './learn.css';

export function LearnPage() {
  return (
    <div className="lx-learn course-catalog">
      <header className="course-catalog-heading">
        <p className="lx-eyebrow">A CLEAR PLACE TO START</p>
        <h1>Build a skill.<br/>Make it yours.</h1>
        <p className="lx-lead">
          Start with our ongoing programming and web development courses. Learn the fundamentals, follow along in Bangla, and build real projects.
        </p>
      </header>
      <section className="catalog-ongoing" aria-labelledby="ongoing-title">
        <div className="course-section-heading">
          <h2 id="ongoing-title">Ongoing courses</h2>
          <span>02 COURSES · OPEN NOW</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CProgrammingCourse />
          <WebDevelopmentCourse />
        </div>
      </section>
      <UpcomingCourses />
    </div>
  );
}

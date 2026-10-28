import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, Sparkles, BookOpen, Check, ArrowDown } from 'lucide-react';
import { UpcomingCourses } from '../components/UpcomingCourses.jsx';
import { WebCourseArtwork, WebDevelopmentCourse } from '../components/WebDevelopmentCourse.jsx';
import { CProgrammingCourse } from '../components/CProgrammingCourse.jsx';
import { CampusPreview } from '../components/CampusPreview.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import '../learn/learn.css';
import './home.css';

export function HomePage() {
  const { state } = useAppContext();

  return <div className="lx-home home-redesign home-focused">
    {/* Event Announcement: C Programming Launch */}
    <section className="c-launch-event-banner" aria-label="C Programming Launch Event">
      <div className="c-launch-event-content">
        <div className="c-launch-badge">
          <span className="c-launch-pulse" /> NEW COURSE LAUNCH EVENT · LUGAISH CODE
        </div>
        <h2>Learn <em>C Programming</em> on Lugaish! 🚀</h2>
        <p className="c-launch-lead">
          Master the fundamentals of computer science and systems programming in English. Step-by-step sequential unlocking and hands-on practice lab are now live with Class 01!
        </p>
        <div className="c-launch-actions">
          <Link to="/learn/c-programming/01" className="lx-primary">
            Start Class 01 Now <ArrowRight size={17} />
          </Link>
          <Link to="/learn/c-programming" className="lx-secondary">
            Explore Course Roadmap →
          </Link>
        </div>
      </div>
      <div className="c-launch-symbol" aria-hidden="true">
        <span>{'{ C }'}</span>
        <small>FIRST CLASS LIVE ON YOUTUBE</small>
      </div>
    </section>

    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy"><p className="home-kicker"><span/> A GOOD PLACE TO BEGIN</p><h1 id="home-title">Your first website.<br/><em>Your next chapter.</em></h1><p className="home-intro">Big possibilities start with a little curiosity.</p><p className="home-description">Learn web development in Bangla, one clear lesson at a time. Go from your first HTML tag to a website you can call your own.</p><div className="lx-actions"><Link className="lx-primary" to="/learn/web-development/html">Start learning for free <ArrowUpRight size={18}/></Link><a className="home-quiet-link" href="#learning-paths">Explore the course <ArrowDown size={15}/></a></div><div className="home-hero-notes"><span><Check size={14}/> Beginner friendly</span><span><Check size={14}/> Learn at your own pace</span></div></div>
      <div className="home-hero-studio"><div className="home-studio-caption"><span><Code2 size={15}/> THE BUILDING STARTS HERE</span><span>01 — WEB DEVELOPMENT</span></div><WebCourseArtwork/><div className="home-studio-note"><span><span className="web-status-dot"/> A little practice. Something you made.</span><span>LEARN → BUILD → GROW</span></div></div>
    </section>
    <div className="home-chapter-strip"><span>LESS SCROLLING. MORE BUILDING.</span><p>One focused course. A clear place to start.</p><a href="#learning-paths" aria-label="Explore the ongoing course"><ArrowDown size={18}/></a></div>
    <section className="home-paths" id="learning-paths" aria-labelledby="paths-title">
      <div className="home-section-heading">
        <div>
          <p className="home-kicker">START SOMETHING REAL</p>
          <h2 id="paths-title">Ongoing courses. Real skills.</h2>
          <p>Our ongoing courses, ready when you are.</p>
        </div>
        <Link className="home-quiet-link" to="/learn">All courses <ArrowUpRight size={17}/></Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
        <CProgrammingCourse />
        <WebDevelopmentCourse />
      </div>
    </section>
    <section className="home-tools" aria-labelledby="tools-title"><div className="home-tools-heading"><p className="home-kicker">YOUR LEARNING, SUPPORTED</p><h2 id="tools-title">A little help along the way.</h2></div><div className="home-tools-grid"><Link to="/tanu"><span className="home-tool-icon"><Sparkles size={22}/></span><h3>Meet Tanu, your study companion.</h3><p>Ask about your lessons, practise a tricky idea, or make a study routine that fits your day.</p><span className="home-tool-link">Open Tanu AI <ArrowUpRight size={16}/></span></Link><Link to="/study-room"><span className="home-tool-icon"><BookOpen size={22}/></span><h3>Make room to focus.</h3><p>Your notes, a focus timer and a quiet library. A space for the work that matters.</p><span className="home-tool-link">Enter the study library <ArrowUpRight size={16}/></span></Link></div></section>
    <section className="lx-campus home-campus"><div className="lx-campus-image"><CampusPreview kind="library"/></div><div><p className="home-kicker">MORE THAN A COURSE</p><h2>A space to learn.<br/>A reason to come back.</h2><p>Settle into the campus, work on your next idea and build a learning routine that feels like yours.</p><Link className="home-quiet-link" to="/learning-spaces">Discover the campus <ArrowUpRight size={18}/></Link></div></section>
    <UpcomingCourses/>
    {state.isLoggedIn && <div className="lx-return"><span>Welcome back. Your next step is waiting.</span><Link to="/learn/web-development/html">Continue web development <ArrowRight size={15}/></Link></div>}
  </div>;
}

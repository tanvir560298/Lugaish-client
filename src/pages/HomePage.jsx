import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, Sparkles, BookOpen, Check, ArrowDown, CalendarDays, Clock3 } from 'lucide-react';
import { UpcomingCourses } from '../components/UpcomingCourses.jsx';
import { WebCourseArtwork, WebDevelopmentCourse } from '../components/WebDevelopmentCourse.jsx';
import { CampusPreview } from '../components/CampusPreview.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import '../learn/learn.css';
import './home.css';

const AI_MASTERCLASS_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd5o_6lkB0IHR3QE-dUBY8ksHKi70cvUU6Fj6OtQl0GJ4vtow/viewform?usp=sharing&ouid=109827890110254782759';
const AI_MASTERCLASS_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd5o_6lkB0IHR3QE-dUBY8ksHKi70cvUU6Fj6OtQl0GJ4vtow/viewform?embedded=true';

export function HomePage() {
  const { state } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const formDialog = useRef(null);

  useEffect(() => {
    if (formOpen && !formDialog.current?.open) formDialog.current?.showModal();
    if (!formOpen && formDialog.current?.open) formDialog.current.close();
  }, [formOpen]);

  return <div className="lx-home home-redesign home-focused">
    <section className="masterclass-hero" aria-labelledby="masterclass-title">
      <div className="masterclass-hero-copy">
        <p className="masterclass-eyebrow"><span className="masterclass-live-dot"/> LUGAISH · FIRST AI MASTERCLASS</p>
        <p className="masterclass-overline"><Sparkles size={15}/> YOUR NEXT SKILL STARTS HERE</p>
        <h2 id="masterclass-title">Want to learn<br/><em>about AI?</em></h2>
        <p className="masterclass-lead">Join Lugaish’s first AI Masterclass and learn practical ways to use AI for everyday work and creative projects.</p>
        <div className="masterclass-schedule">
          <div><CalendarDays size={17}/><span><strong>Every Saturday</strong><small>Live online class</small></span></div>
          <div><Clock3 size={17}/><span><strong>6:30–7:45 PM</strong><small>Saudi Arabia · 9:30–10:45 PM Bangladesh</small></span></div>
        </div>
        <button type="button" className="masterclass-register" onClick={() => setFormOpen(true)}>
          Register for the masterclass <ArrowUpRight size={18}/>
        </button>
        <p className="masterclass-note">Tell us what you want to learn. It takes about a minute.</p>
      </div>
      <div className="masterclass-visual" aria-hidden="true">
        <div className="masterclass-visual-orbit masterclass-orbit-one"/>
        <div className="masterclass-visual-orbit masterclass-orbit-two"/>
        <div className="masterclass-visual-card">
          <span className="masterclass-visual-label">AI MASTERCLASS</span>
          <div className="masterclass-spark-icon"><Sparkles size={25}/></div>
          <strong>Learn it.<br/>Make it yours.</strong>
          <span className="masterclass-visual-footer">IDEAS INTO REAL-WORLD SKILLS</span>
        </div>
        <span className="masterclass-topic topic-office">Office workflows</span>
        <span className="masterclass-topic topic-images">AI image creation</span>
        <span className="masterclass-topic topic-documents">PDFs &amp; books</span>
        <span className="masterclass-visual-index">01 <i/> 03</span>
      </div>
    </section>
    <dialog className="masterclass-dialog" ref={formDialog} aria-labelledby="masterclass-dialog-title" onClose={() => setFormOpen(false)}>
      <div className="masterclass-dialog-heading">
        <div><span className="masterclass-live-dot"/><div><p>AI MASTERCLASS</p><h2 id="masterclass-dialog-title">Registration form</h2></div></div>
        <button type="button" className="masterclass-dialog-close" onClick={() => setFormOpen(false)} aria-label="Close registration form">×</button>
      </div>
      <iframe className="masterclass-form-frame" title="AI Masterclass registration form" src={AI_MASTERCLASS_EMBED_URL}/>
      <a className="masterclass-form-fallback" href={AI_MASTERCLASS_FORM_URL} target="_blank" rel="noreferrer">Having trouble? Open the form in Google Forms <ArrowUpRight size={15}/></a>
    </dialog>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy"><p className="home-kicker"><span/> A GOOD PLACE TO BEGIN</p><h1 id="home-title">Your first website.<br/><em>Your next chapter.</em></h1><p className="home-intro">Big possibilities start with a little curiosity.</p><p className="home-description">Learn web development in Bangla, one clear lesson at a time. Go from your first HTML tag to a website you can call your own.</p><div className="lx-actions"><Link className="lx-primary" to="/learn/web-development/html">Start learning for free <ArrowUpRight size={18}/></Link><a className="home-quiet-link" href="#learning-paths">Explore the course <ArrowDown size={15}/></a></div><div className="home-hero-notes"><span><Check size={14}/> Beginner friendly</span><span><Check size={14}/> Learn at your own pace</span></div></div>
      <div className="home-hero-studio"><div className="home-studio-caption"><span><Code2 size={15}/> THE BUILDING STARTS HERE</span><span>01 — WEB DEVELOPMENT</span></div><WebCourseArtwork/><div className="home-studio-note"><span><span className="web-status-dot"/> A little practice. Something you made.</span><span>LEARN → BUILD → GROW</span></div></div>
    </section>
    <div className="home-chapter-strip"><span>LESS SCROLLING. MORE BUILDING.</span><p>One focused course. A clear place to start.</p><a href="#learning-paths" aria-label="Explore the ongoing course"><ArrowDown size={18}/></a></div>
    <section className="home-paths" id="learning-paths" aria-labelledby="paths-title"><div className="home-section-heading"><div><p className="home-kicker">START SOMETHING REAL</p><h2 id="paths-title">One course. Your first creation.</h2><p>Our ongoing course, ready when you are.</p></div><Link className="home-quiet-link" to="/learn">Course details <ArrowUpRight size={17}/></Link></div><WebDevelopmentCourse/></section>
    <section className="home-tools" aria-labelledby="tools-title"><div className="home-tools-heading"><p className="home-kicker">YOUR LEARNING, SUPPORTED</p><h2 id="tools-title">A little help along the way.</h2></div><div className="home-tools-grid"><Link to="/tanu"><span className="home-tool-icon"><Sparkles size={22}/></span><h3>Meet your future study companion.</h3><p>Tanu AI is still being developed. Stop by for a little hello while we get ready to help you.</p><span className="home-tool-link">Tanu AI · coming soon <ArrowUpRight size={16}/></span></Link><Link to="/study-room"><span className="home-tool-icon"><BookOpen size={22}/></span><h3>Make room to focus.</h3><p>Your notes, a focus timer and a quiet library. A space for the work that matters.</p><span className="home-tool-link">Enter the study library <ArrowUpRight size={16}/></span></Link></div></section>
    <section className="lx-campus home-campus"><div className="lx-campus-image"><CampusPreview kind="library"/></div><div><p className="home-kicker">MORE THAN A COURSE</p><h2>A space to learn.<br/>A reason to come back.</h2><p>Settle into the campus, work on your next idea and build a learning routine that feels like yours.</p><Link className="home-quiet-link" to="/learning-spaces">Discover the campus <ArrowUpRight size={18}/></Link></div></section>
    <UpcomingCourses/>
    {state.isLoggedIn && <div className="lx-return"><span>Welcome back. Your next step is waiting.</span><Link to="/learn/web-development/html">Continue web development <ArrowRight size={15}/></Link></div>}
  </div>;
}

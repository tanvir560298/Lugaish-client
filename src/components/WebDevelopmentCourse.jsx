import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Code2, Play, Globe2, Check } from 'lucide-react';
import { htmlVideos } from '../learn/htmlContent.js';
import './course-showcase.css';

export function WebCourseArtwork({ compact = false }) {
  return <div className={`web-artwork${compact ? ' web-artwork-compact' : ''}`} aria-hidden="true">
    <div className="web-artwork-bar"><span className="web-window-dots"><i/><i/><i/></span><span><Globe2 size={12}/> my-first-website.html</span><span>HTML</span></div>
    <div className="web-artwork-content">
      <div className="web-code"><div className="web-code-tab"><Code2 size={13}/> index.html <span>●</span></div><pre><span className="web-code-muted">01</span> <span className="web-code-purple">&lt;!DOCTYPE html&gt;</span>{'\n'}<span className="web-code-muted">02</span> &lt;<span className="web-code-pink">html</span>&gt;{'\n'}<span className="web-code-muted">03</span>   &lt;<span className="web-code-pink">body</span>&gt;{'\n'}<span className="web-code-muted">04</span>     &lt;<span className="web-code-pink">h1</span>&gt;Hello, world!&lt;/<span className="web-code-pink">h1</span>&gt;{'\n'}<span className="web-code-muted">05</span>     &lt;<span className="web-code-pink">p</span>&gt;I made this.&lt;/<span className="web-code-pink">p</span>&gt;{'\n'}<span className="web-code-muted">06</span>   &lt;/<span className="web-code-pink">body</span>&gt;{'\n'}<span className="web-code-muted">07</span> &lt;/<span className="web-code-pink">html</span>&gt;</pre><div className="web-code-status"><span/> Your ideas start here.</div></div>
      <div className="web-live-preview"><div className="web-mini-nav"><span className="web-mini-mark">m.</span><span>My first website <ArrowUpRight size={12}/></span></div><span className="web-mini-label">A LITTLE CODE. A NEW BEGINNING.</span><h3>Hello,<br/>world<span>!</span></h3><p>I made this.</p><span className="web-mini-button">Built by me <ArrowUpRight size={12}/></span><div className="web-mini-orbit"/></div>
    </div>
    <div className="web-artwork-footer"><span><span className="web-status-dot"/> FROM YOUR FIRST TAG TO YOUR FIRST WEBSITE</span><Code2 size={14}/></div>
  </div>;
}

export function WebDevelopmentCourse() {
  return <article className="web-course-card" data-course="web-development">
    <div className="web-course-visual"><span className="web-course-visual-label">THE FIRST CHAPTER</span><span className="web-course-glyph" aria-hidden="true">&lt;/&gt;</span><div className="web-course-visual-bottom"><span>WEB DEVELOPMENT</span><span>01 / HTML</span></div><span className="web-course-orbit" aria-hidden="true"/></div>
    <div className="web-course-copy"><div className="web-course-topline"><span className="web-open-label"><span/> AVAILABLE NOW</span><span className="web-course-free">Free course</span></div><h3>Web Development</h3><p>Start with HTML. Learn to structure a page, add links and images, work with forms, and bring it all together in your first portfolio website.</p><div className="web-course-meta"><span><Play size={15}/>{htmlVideos.length} video lessons</span><span><Globe2 size={15}/>Taught in Bangla</span><span><Code2 size={15}/>Beginner friendly</span></div><div className="web-course-bottom"><Link className="lx-primary" to="/learn/web-development/html">Explore the course <ArrowRight size={17}/></Link><span><Check size={14}/> Start without an account</span></div></div>
  </article>;
}

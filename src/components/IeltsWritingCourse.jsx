import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, PenTool, Globe2, Check, Sparkles, Award } from 'lucide-react';
import './course-showcase.css';

export function IeltsWritingCourse() {
  return (
    <article className="web-course-card" data-course="ielts-writing" style={{ borderColor: 'rgba(59, 130, 246, 0.35)' }}>
      <div className="web-course-visual" style={{ background: 'linear-gradient(135deg, #091326 0%, #172554 50%, #1e3a8a 100%)' }}>
        <span className="web-course-visual-label" style={{ color: '#93c5fd' }}>NEW COURSE · FIRST 7 DAYS LIVE</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto 0', zIndex: 1 }}>
          <span className="web-course-glyph" aria-hidden="true" style={{ color: '#60a5fa', fontFamily: 'system-ui, sans-serif', fontWeight: 800, margin: '10px 0 0', letterSpacing: '-0.02em' }}>
            IELTS Writing
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#bfdbfe', marginTop: '6px', fontWeight: 600 }}>
            <Sparkles size={14} /> 60-Day Foundation Challenge
          </span>
        </div>
        <div className="web-course-visual-bottom">
          <span style={{ color: '#93c5fd' }}>GRAMMAR & SENTENCE BUILDING</span>
          <span style={{ color: '#dbeafe' }}>TARGET BAND 6.5+</span>
        </div>
        <span className="web-course-orbit" aria-hidden="true" style={{ borderColor: 'rgba(59, 130, 246, 0.25)', boxShadow: '0 0 0 30px rgba(59, 130, 246, 0.06), 0 0 0 65px rgba(59, 130, 246, 0.04)' }} />
      </div>

      <div className="web-course-copy">
        <div className="web-course-topline">
          <span className="web-open-label" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', padding: '4px 10px', borderRadius: '20px' }}>
            <span style={{ background: '#3b82f6' }} /> WEEK 1 AVAILABLE NOW · DAYS 01–07
          </span>
          <span className="web-course-free">Free Foundation</span>
        </div>
        <h3>IELTS Writing Foundation: 60-Day Challenge</h3>
        <p>
          Master sentence architecture from scratch before writing academic essays. Build complete S-V-O sentences, eliminate fragments, master be-verbs, articles, plurals, Present Simple, and Subject-Verb Agreement with in-depth Bangla explanations and our <strong>Interactive Grammar & Writing Lab</strong>.
        </p>
        <div className="web-course-meta">
          <span><BookOpen size={15} />7 Daily Interactive Lessons</span>
          <span><Globe2 size={15} />Taught by Tanvir Ahmad</span>
          <span><PenTool size={15} />Daily Writing Lab & Live Word Counter</span>
          <span><Award size={15} />Week 1 Mastery Exam</span>
        </div>
        <div className="web-course-bottom">
          <Link className="lx-primary" to="/learn/ielts-writing" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderColor: '#3b82f6', color: '#ffffff' }}>
            Start IELTS Writing Week 1 <ArrowRight size={17} />
          </Link>
          <span><Check size={14} /> 15+ Interactive exercises per day</span>
        </div>
      </div>
    </article>
  );
}


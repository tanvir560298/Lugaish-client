import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Play, Globe2, Check, Lock, Coffee } from 'lucide-react';
import { javaVideos } from '../learn/javaContent.js';
import './course-showcase.css';

export function JavaProgrammingCourse() {
  return (
    <article className="web-course-card" data-course="java-programming" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
      <div className="web-course-visual" style={{ background: 'linear-gradient(135deg, #180d04 0%, #451a03 50%, #78350f 100%)' }}>
        <span className="web-course-visual-label" style={{ color: '#fbbf24' }}>NEW RELEASE · CLASSES 01 & 02 LIVE</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto 0', zIndex: 1 }}>
          <span className="web-course-glyph" aria-hidden="true" style={{ color: '#fbbf24', fontFamily: 'monospace', margin: '10px 0 0' }}>
            {'{ Java }'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#fcd34d', marginTop: '6px', fontWeight: 600 }}>
            <Coffee size={14} /> Object-Oriented Language
          </span>
        </div>
        <div className="web-course-visual-bottom">
          <span style={{ color: '#fbbf24' }}>PROGRAMMING FUNDAMENTALS</span>
          <span style={{ color: '#fed7aa' }}>02 / JAVA LANGUAGE</span>
        </div>
        <span className="web-course-orbit" aria-hidden="true" style={{ borderColor: 'rgba(245, 158, 11, 0.25)', boxShadow: '0 0 0 30px rgba(245, 158, 11, 0.06), 0 0 0 65px rgba(245, 158, 11, 0.04)' }} />
      </div>

      <div className="web-course-copy">
        <div className="web-course-topline">
          <span className="web-open-label" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '4px 10px', borderRadius: '20px' }}>
            <span style={{ background: '#fbbf24' }} /> AVAILABLE NOW · CLASSES 01 & 02 READY
          </span>
          <span className="web-course-free">Free course</span>
        </div>
        <h3>Java Programming: Beginner to Master</h3>
        <p>
          Master one of the world's most widely-used enterprise and application languages. Learn Java class structure, the golden double-quote printing rule, operator precedence, and pattern designs with hands-on exercises in our <strong>interactive browser Java Lab</strong>.
        </p>
        <div className="web-course-meta">
          <span><Play size={15} />{javaVideos.length} structured classes</span>
          <span><Globe2 size={15} />Taught by Tanvir Ahmad</span>
          <span><Code2 size={15} />Interactive Java Lab</span>
          <span><Lock size={15} />Sequential Unlocking</span>
        </div>
        <div className="web-course-bottom" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <Link className="lx-primary" to="/learn/java-programming" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', borderColor: '#f59e0b', color: '#ffffff' }}>
            Start Java Programming <ArrowRight size={17} />
          </Link>
          <Link
            to="/learn/java-programming/03"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              borderRadius: '10px',
              padding: '11px 16px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔥 Nested Loops Practice (14 Problems) →
          </Link>
          <span><Check size={14} /> Classes 01 & 02 live · Practice Set 01 Ready</span>
        </div>
      </div>
    </article>
  );
}

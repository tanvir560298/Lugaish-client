import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Play, Globe2, Check, Lock } from 'lucide-react';
import { cVideos } from '../learn/cContent.js';
import './course-showcase.css';

export function CProgrammingCourse() {
  return (
    <article className="web-course-card" data-course="c-programming" style={{ borderColor: 'rgba(132, 228, 214, 0.3)' }}>
      <div className="web-course-visual" style={{ background: 'linear-gradient(135deg, #0b2628 0%, #0d1627 100%)' }}>
        <span className="web-course-visual-label" style={{ color: '#84e4d6' }}>NEW RELEASE · CLASS 01 READY</span>
        <span className="web-course-glyph" aria-hidden="true" style={{ color: '#84e4d6', fontFamily: 'monospace' }}>
          {'{ C }'}
        </span>
        <div className="web-course-visual-bottom">
          <span style={{ color: '#84e4d6' }}>PROGRAMMING FUNDAMENTALS</span>
          <span>01 / C LANGUAGE</span>
        </div>
        <span className="web-course-orbit" aria-hidden="true" />
      </div>

      <div className="web-course-copy">
        <div className="web-course-topline">
          <span className="web-open-label" style={{ background: '#0a3532', color: '#84e4d6' }}>
            <span style={{ background: '#84e4d6' }} /> AVAILABLE NOW · CLASS 01 LIVE
          </span>
          <span className="web-course-free">Free course</span>
        </div>
        <h3>C Programming: Zero to Hero</h3>
        <p>
          Master the language behind operating systems and computer fundamentals. Built with a <strong>Programming Hero style sequential unlocking system</strong>—complete video 1 to unlock video 2, and solve interactive practice problems along the way.
        </p>
        <div className="web-course-meta">
          <span><Play size={15} />{cVideos.length} structured classes</span>
          <span><Globe2 size={15} />Taught in Bangla</span>
          <span><Code2 size={15} />Interactive Practice Lab</span>
          <span><Lock size={15} />Sequential Unlocking</span>
        </div>
        <div className="web-course-bottom">
          <Link className="lx-primary" to="/learn/c-programming">
            Start C Programming <ArrowRight size={17} />
          </Link>
          <span><Check size={14} /> Class 01 live on YouTube</span>
        </div>
      </div>
    </article>
  );
}

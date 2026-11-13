import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Sparkles,
  BookOpen,
  Check,
  ArrowDown,
  ShieldCheck,
  ChevronDown,
  Laptop,
  Layers,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { UpcomingCourses } from '../components/UpcomingCourses.jsx';
import { WebCourseArtwork, WebDevelopmentCourse } from '../components/WebDevelopmentCourse.jsx';
import { CProgrammingCourse } from '../components/CProgrammingCourse.jsx';
import { JavaProgrammingCourse } from '../components/JavaProgrammingCourse.jsx';
import { IeltsWritingCourse } from '../components/IeltsWritingCourse.jsx';
import { CampusPreview } from '../components/CampusPreview.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import '../learn/learn.css';
import './home.css';

const FAQS = [
  {
    q: 'Are Lugaish foundation courses completely free?',
    a: 'Yes, 100% free. All our core foundation courses—including IELTS Writing Foundation, C Programming, Java, and Web Development—are accessible without subscription gates, credit card requirements, or hidden trial expirations.'
  },
  {
    q: 'Do I need prior coding knowledge or advanced English skills?',
    a: 'Not at all. Every learning track starts from absolute zero. Concepts are explained clearly with contextual Bangla translations, relatable analogies, and step-by-step guidance.'
  },
  {
    q: 'How does the IELTS Writing Foundation course work?',
    a: 'It is a structured 7-day progressive curriculum focusing on sentence structure (Subject + Verb + Object/Complement), academic vocabulary precision, error correction, and daily 3-word vocabulary expansions with sentence writing practice.'
  },
  {
    q: 'Can I study on my mobile smartphone?',
    a: 'Yes! Lugaish is designed with a responsive mobile-first architecture. You can read lesson theories, complete quizzes, and submit answers seamlessly on any smartphone, tablet, or computer.'
  },
  {
    q: 'How does Tanu AI assist my learning journey?',
    a: 'Tanu AI is your dedicated study companion. It helps break down complex grammar or coding syntax, answers questions when you are stuck, and guides you to the right lesson without distractions.'
  }
];

export function HomePage() {
  const { state } = useAppContext();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  return (
    <div className="lx-home home-redesign home-focused">
      {/* 1. HERO SECTION (5-Second Clarity: Identity, Subjects, Free Status, Primary CTA) */}
      <section className="home-hero home-hero-refined" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-kicker">
            <span /> OPEN LEARNING PLATFORM
          </p>
          <h1 id="home-title">
            Master practical skills.
            <em>Build your next chapter.</em>
          </h1>
          <p className="home-intro">
            Practical courses. A clearer way to learn.
          </p>
          <p className="home-description">
            Build your English and coding skills with step-by-step lessons, Bangla &amp; English explanations, and hands-on practice.
          </p>

          <div className="lx-actions">
            <Link className="lx-primary" to="/learn">
              Explore courses <ArrowUpRight size={17} />
            </Link>
            <a className="home-quiet-link" href="#learning-paths">
              Browse learning tracks <ArrowDown size={15} />
            </a>
          </div>

          <div className="home-subjects-strip" aria-label="Available course tracks">
            <Link to="/learn/ielts-writing" className="home-subject-badge">IELTS Writing</Link>
            <Link to="/learn/c-programming" className="home-subject-badge">C Programming</Link>
            <Link to="/learn/java-programming" className="home-subject-badge">Java</Link>
            <Link to="/learn/web-development/html" className="home-subject-badge">Web Development</Link>
          </div>

          <div className="home-hero-notes">
            <span><Check size={14} /> 100% Free Foundation Tracks</span>
            <span><Check size={14} /> Interactive Practice Labs</span>
          </div>
        </div>

        <div className="home-hero-studio">
          <div className="home-studio-caption">
            <span><Code2 size={15} /> PRACTICAL LEARNING ENVIRONMENT</span>

          </div>
          <WebCourseArtwork />
          <div className="home-studio-note">
            <span><span className="web-status-dot" /> Clear concept. Guided practice. Real progress.</span>

          </div>
        </div>
      </section>

      {/* 2. CHAPTER STRIP */}
      <div className="home-chapter-strip">
        <span>STRUCTURED LEARNING · NO PAYWALLS · BITE-SIZED PROGRESS</span>
        <p>Four foundational tracks. Clear step-by-step guidance.</p>
        <a href="#learning-paths" aria-label="Explore the ongoing courses"><ArrowDown size={18} /></a>
      </div>

      {/* 3. HOW LEARNING WORKS (3 Clear Steps) */}
      <section className="home-how-works-section" aria-labelledby="how-it-works-title">
        <div className="home-subheading-block">
          <p className="home-kicker"><span /> STRUCTURED &amp; PRACTICAL</p>
          <h2 id="how-it-works-title">How learning works on Lugaish</h2>
          <p>A simple, proven 3-step cycle designed to take you from initial confusion to lasting confidence.</p>
        </div>
        <div className="home-steps-grid">
          <div className="home-step-card">
            <div className="home-step-num-badge">01</div>
            <h3>Understand Core Principles</h3>
            <p>Bite-sized, plain-language lessons stripped of overwhelming jargon. Technical concepts are paired with authentic Bangla explanations and realistic examples.</p>
            <span className="home-step-tag">Conceptual Clarity</span>
          </div>

          <div className="home-step-card">
            <div className="home-step-num-badge">02</div>
            <h3>Interactive Practice Labs</h3>
            <p>Reinforce your understanding immediately. Test knowledge through targeted multiple-choice challenges with a single submit check and detailed explanations for every option.</p>
            <span className="home-step-tag">Active Recall</span>
          </div>

          <div className="home-step-card">
            <div className="home-step-num-badge">03</div>
            <h3>Apply &amp; Build Retention</h3>
            <p>Expand vocabulary with 3 high-impact words daily, write complete grammatical sentences, or compile runnable code. Build a sustainable daily habit that sticks.</p>
            <span className="home-step-tag">Daily Retention</span>
          </div>
        </div>
      </section>

      {/* 4. ONGOING COURSES CATALOG */}
      <section className="home-paths" id="learning-paths" aria-labelledby="paths-title">
        <div className="home-section-heading">
          <div>
            <p className="home-kicker">START SOMETHING REAL</p>
            <h2 id="paths-title">Ongoing courses. Real skills.</h2>
            <p>Our ongoing courses, ready when you are.</p>
          </div>
          <Link className="home-quiet-link" to="/learn">All courses <ArrowUpRight size={17} /></Link>
        </div>
        <div className="home-courses-bot-guide">
          <span className="mini-bot-icon" style={{ fontSize: '20px' }}>🤖</span>
          <div>
            <strong>Tanu: Which course would you like to explore?</strong>
            <p>IELTS Writing, Java, C, or Web Development — click any course button below to jump right in 👇</p>
          </div>
        </div>
        <div data-tour="course-cards" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          <IeltsWritingCourse />
          <JavaProgrammingCourse />
          <CProgrammingCourse />
          <WebDevelopmentCourse />
        </div>
      </section>

      {/* 5. WHY CHOOSE LUGAISH (Honest, Student-First Pillars) */}
      <section className="home-why-section" aria-labelledby="why-us-title">
        <div className="home-subheading-block">
          <p className="home-kicker"><span /> DESIGNED FOR STUDENTS</p>
          <h2 id="why-us-title">Why learn with Lugaish?</h2>
          <p>We removed paywalls, clutter, and friction so you can focus entirely on making daily progress.</p>
        </div>
        <div className="home-why-grid">
          <div className="home-why-card">
            <div className="home-why-icon-box"><ShieldCheck size={22} /></div>
            <div>
              <h3>100% Free Foundation Tracks</h3>
              <p>Zero paywalls, no trial limits, and no credit card required. Core education in English and computing is completely open for every student.</p>
            </div>
          </div>

          <div className="home-why-card">
            <div className="home-why-icon-box"><BookOpen size={22} /></div>
            <div>
              <h3>Distraction-Free Environment</h3>
              <p>No sudden popups, intrusive ads, or spam newsletters. A clean reading experience with high-contrast typography designed for focus.</p>
            </div>
          </div>

          <div className="home-why-card">
            <div className="home-why-icon-box"><Laptop size={22} /></div>
            <div>
              <h3>Bilingual Accessibility</h3>
              <p>Difficult sentence patterns and algorithmic logic explained in clear Bangla, paired with international English academic standards.</p>
            </div>
          </div>

          <div className="home-why-card">
            <div className="home-why-icon-box"><Sparkles size={22} /></div>
            <div>
              <h3>Tanu AI Study Companion</h3>
              <p>Get on-demand assistance whenever you encounter a difficult grammar rule, code error, or navigation question.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STUDY TOOLS */}
      <section className="home-tools" aria-labelledby="tools-title">
        <div className="home-tools-heading">
          <p className="home-kicker">YOUR LEARNING, SUPPORTED</p>
          <h2 id="tools-title">A little help along the way.</h2>
        </div>
        <div className="home-tools-grid">
          <Link to="/tanu">
            <span className="home-tool-icon"><Sparkles size={22} /></span>
            <h3>Meet Tanu, your study companion.</h3>
            <p>Ask about your lessons, practise a tricky idea, or make a study routine that fits your day.</p>
            <span className="home-tool-link">Open Tanu AI <ArrowUpRight size={16} /></span>
          </Link>
          <Link to="/study-room">
            <span className="home-tool-icon"><BookOpen size={22} /></span>
            <h3>Make room to focus.</h3>
            <p>Your notes, a focus timer and a quiet library. A space for the work that matters.</p>
            <span className="home-tool-link">Enter the study library <ArrowUpRight size={16} /></span>
          </Link>
        </div>
      </section>

      {/* 7. CAMPUS PREVIEW */}
      <section className="lx-campus home-campus">
        <div className="lx-campus-image"><CampusPreview kind="library" /></div>
        <div>
          <p className="home-kicker">MORE THAN A COURSE</p>
          <h2>A space to learn.<br />A reason to come back.</h2>
          <p>Settle into the campus, work on your next idea and build a learning routine that feels like yours.</p>
          <Link className="home-quiet-link" to="/learning-spaces">Discover the campus <ArrowUpRight size={18} /></Link>
        </div>
      </section>

      {/* 8. PLATFORM FAQ */}
      <section className="home-faq-section" aria-labelledby="faq-title">
        <div className="home-subheading-block">
          <p className="home-kicker"><span /> CLEAR ANSWERS</p>
          <h2 id="faq-title">Frequently asked questions</h2>
          <p>Everything you need to know about getting started on Lugaish.</p>
        </div>
        <div className="home-faq-stack">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`home-faq-item${isOpen ? ' is-expanded' : ''}`}>
                <button
                  type="button"
                  className="home-faq-trigger"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="home-faq-chevron" />
                </button>
                {isOpen && (
                  <div className="home-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. UPCOMING COURSES */}
      <UpcomingCourses />

      {state.isLoggedIn && (
        <div className="lx-return">
          <span>Welcome back. Your next step is waiting.</span>
          <Link to="/learn/ielts-writing">Continue learning <ArrowRight size={15} /></Link>
        </div>
      )}
    </div>
  );
}

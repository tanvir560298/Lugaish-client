import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, BookOpen, MessageCircle, Sparkles, Headphones, Check, Compass } from 'lucide-react';
import { UpcomingCourses } from '../components/UpcomingCourses.jsx';
import { CampusPreview } from '../components/CampusPreview.jsx';
import { useAppContext } from '../state/AppContext.jsx';
import '../learn/learn.css';
import './home.css';

const paths = [
  { id: 'english', name: 'English', label: 'SPEAK WITH CONFIDENCE', word: 'Hello.', icon: MessageCircle, description: 'Build your vocabulary, understand everyday English and make more room for conversation.', tags: ['Speaking', 'Vocabulary', 'Listening'], href: '/course/english', action: 'Explore English', note: 'View course & enrollment' },
  { id: 'arabic', name: 'Arabic', label: 'DISCOVER A NEW LANGUAGE', word: 'مرحبًا', icon: BookOpen, description: 'Explore Arabic words, reading and conversation. Take your next step into the language.', tags: ['Reading', 'Vocabulary', 'Conversation'], href: '/course/arabic', action: 'Explore Arabic', note: 'View course & enrollment' },
  { id: 'programming', name: 'Programming', label: 'TURN IDEAS INTO CODE', word: '</>', icon: Code2, description: 'Start building with HTML video lessons in Bangla, or learn to read and understand Java code.', tags: ['HTML', 'Java', 'Bangla videos'], href: '/learn?category=programming', action: 'Explore programming', note: 'Free HTML & Java self-study' },
];

export function HomePage() {
  const { state } = useAppContext();
  return <div className="lx-home home-redesign">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-kicker"><span /> YOUR NEXT SKILL STARTS HERE</p>
        <h1 id="home-title">Learn a language.<br />Learn to code.<br /><em>Open new doors.</em></h1>
        <p className="home-intro">English, Arabic and Programming. Three ways to grow, one place to begin.</p>
        <p className="home-description">Find your voice, build something of your own and enjoy the journey—with lessons, practice and a campus made for learning.</p>
        <div className="lx-actions"><a className="lx-primary" href="#learning-paths">Find your learning path <ArrowRight size={18} /></a><Link className="home-quiet-link" to="/learn/web-development/html">Try a free HTML lesson <ArrowUpRight size={16} /></Link></div>
        <div className="home-subjects" aria-label="Subjects you can learn"><span><MessageCircle size={15} /> English</span><span><BookOpen size={15} /> Arabic</span><span><Code2 size={15} /> Programming</span></div>
      </div>
      <div className="home-discovery" aria-label="Explore English, Arabic and programming">
        <div className="home-discovery-top"><span><Compass size={17} /> THE LUGAISH LEARNING STUDIO</span><span className="home-discovery-dots" aria-hidden="true">● ● ●</span></div>
        <div className="home-discovery-heading"><span>A little curiosity.<br /><strong>A whole new possibility.</strong></span><Sparkles size={29} /></div>
        {paths.map(({ id, name, word, href, icon: Icon }, index) => <Link key={id} to={href} className={`home-discovery-row home-${id}`}>
          <span className="home-subject-icon"><Icon size={21} /></span><span className="home-discovery-name"><small>0{index + 1} / EXPLORE</small><strong>{name}</strong></span><span className="home-word" lang={id === 'arabic' ? 'ar' : undefined} dir={id === 'arabic' ? 'rtl' : undefined}>{word}</span><ArrowUpRight size={19} />
        </Link>)}
        <div className="home-studio-footer"><span><Check size={14} /> Your pace. Your next chapter.</span><span>LET’S BEGIN ↗</span></div>
      </div>
    </section>

    <section className="home-paths" id="learning-paths" aria-labelledby="paths-title">
      <div className="home-section-heading"><div><p className="home-kicker">THREE PATHS. MANY POSSIBILITIES.</p><h2 id="paths-title">What do you want to learn?</h2><p>Choose a subject that moves you forward.</p></div><Link className="home-quiet-link" to="/learn">View all learning paths <ArrowUpRight size={17} /></Link></div>
      <div className="home-path-grid">{paths.map(({ id, name, label, word, description, tags, href, action, note, icon: Icon }) => <article key={id} className={`home-path home-${id}`}>
        <div className="home-path-art" aria-hidden="true"><span className="home-art-caption">{label}</span><span className="home-art-word" lang={id === 'arabic' ? 'ar' : undefined} dir={id === 'arabic' ? 'rtl' : undefined}>{word}</span><Icon size={28} /><span className="home-art-orbit" /></div>
        <div className="home-path-body"><h3>{name}</h3><p>{description}</p><div className="home-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link to={href}>{action}<ArrowRight size={18} /></Link><small>{note}</small></div>
      </article>)}</div>
      <p className="home-catalog-note">English and Arabic lesson access depends on course publication and enrollment. Explore each course for current availability.</p>
    </section>

    <section className="home-practice" aria-labelledby="practice-title"><div><p className="home-kicker">MORE THAN A LESSON</p><h2 id="practice-title">Make learning a daily habit.</h2></div><div className="home-practice-items"><Link to="/speaking-practice"><Headphones size={23} /><span><strong>Hear yourself improve</strong><small>Record, replay and practise speaking.</small></span><ArrowUpRight size={17} /></Link><Link to="/tanu"><Sparkles size={23} /><span><strong>Make a little study plan</strong><small>Set aside 10–120 minutes with Tanu AI.</small></span><ArrowUpRight size={17} /></Link></div></section>

    <UpcomingCourses />
    <section className="lx-campus home-campus"><div className="lx-campus-image"><CampusPreview kind="library" /></div><div><p className="home-kicker">A PLACE FOR YOUR NEXT CHAPTER</p><h2>A quiet corner.<br />A fresh start.</h2><p>Bring your English notes, your Arabic practice or your next coding idea. Settle into the Study Library with a personal desk, notes and a focus timer.</p><Link className="lx-primary" to="/study-room">Explore the study library <ArrowRight size={18} /></Link><Link className="lx-text-link" to="/classroom">Step into the Classroom ↗</Link></div></section>
    {state.isLoggedIn && <div className="lx-return"><span>Welcome back. Keep your momentum.</span><Link to="/learn">Continue learning →</Link><Link to="/progress">View your language progress →</Link></div>}
  </div>;
}

import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import './coming-soon.css';

export function TanuComingSoonMessage({ idPrefix = 'tanu-coming', compact = false }) {
  const Heading = compact ? 'h2' : 'h1';
  return <div className="tanu-coming-message">
    <div className="tanu-coming-avatar" aria-hidden="true"><Sparkles size={30}/></div>
    <p className="tanu-coming-eyebrow">TANU AI · COMING SOON</p>
    <Heading id={`${idPrefix}-title`} lang="bn">আমি Tanu AI।</Heading>
    <div id={`${idPrefix}-description`} className="tanu-coming-copy" lang="bn">
      <p>আমাকে আরও ভালোভাবে তৈরি করার কাজ চলছে। কিছুদিন পর আপনাদের পড়াশোনা ও শেখার পথে সাহায্য করতে প্রস্তুত হব।</p>
      <p>এই মুহূর্তে সাহায্য করতে না পারায় আমি দুঃখিত। আমাকে ব্যবহার করার আগ্রহ দেখানোর জন্য আন্তরিক ধন্যবাদ!</p>
    </div>
    <p className="tanu-coming-thanks">Thank you for your interest in using Tanu AI.</p>
  </div>;
}

export function TanuComingSoonPage() {
  return <div className="tanu-coming-page"><section className="tanu-coming-card" aria-labelledby="tanu-coming-title"><TanuComingSoonMessage/><Link className="campus-button campus-button-secondary tanu-coming-return" to="/learn"><ArrowLeft size={16}/> Explore courses</Link></section></div>;
}

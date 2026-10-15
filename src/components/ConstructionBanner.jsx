import { ArrowUpRight, HardHat, MessageCircle, Sparkles } from 'lucide-react';
import './construction-banner.css';

// Set the public page or feedback-post URL; never point visitors to a guessed page.
const configuredUrl = import.meta.env.VITE_FACEBOOK_FEEDBACK_URL || '';
function facebookFeedbackUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && /(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(url.hostname)) return url.href;
  } catch { /* The invitation remains readable until the page URL is configured. */ }
  return null;
}
const feedbackUrl = facebookFeedbackUrl(configuredUrl);

export function ConstructionBanner({ subject = 'এই অংশটি', compact = false }) {
  return <aside className={`construction-banner${compact ? ' construction-banner--compact' : ''}`} aria-label="Work under construction">
    <div className="construction-stripe" aria-hidden="true" />
    <div className="construction-content">
      <div className="construction-icon" aria-hidden="true"><HardHat size={34} /></div>
      <div className="construction-copy">
        <span className="construction-label"><span /> WE’RE BUILDING SOMETHING BETTER</span>
        <h2>WORK UNDER CONSTRUCTION</h2>
        <p lang="bn">{subject} আরও সুন্দর ও ব্যবহারবান্ধব করে তোলার কাজ চলছে। আপনার ভাবনাতেই সাজুক Lugaish!</p>
        <p className="construction-invitation" lang="bn">কোন feature চান? কেমন design পছন্দ? এখনই আমাদের Facebook পেজের পোস্টে comment করে আপনার মতামত জানান।</p>
        <div className="construction-bottom"><span className="construction-feedback-note" lang="bn"><Sparkles size={15} /> আপনার আইডিয়া, আমাদের পরবর্তী পদক্ষেপ।</span>
          {feedbackUrl && <a href={feedbackUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /><span lang="bn">Facebook-এ মতামত দিন</span><ArrowUpRight size={17} /></a>}
        </div>
      </div>
    </div>
  </aside>;
}

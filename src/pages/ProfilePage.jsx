import { useAppContext } from '../state/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { hasCourseStarted } from '../utils/courseLaunch.js';
import { useEffect, useMemo, useState } from 'react';
import { Award, Check, Copy, Crown, LoaderCircle, Share2 } from 'lucide-react';
import { api } from '../api/client.js';
import { getLocalCertificates, saveLocalCertificate } from '../utils/certificateStorage.js';

export function ProfilePage() {
  const { state, actions } = useAppContext();
  const navigate = useNavigate();
  const [achievementSummary, setAchievementSummary] = useState(null);
  const [achievementError, setAchievementError] = useState('');
  const [claiming, setClaiming] = useState('');
  const [copied, setCopied] = useState(false);
  const issuedKeys = useMemo(() => new Set(
    (achievementSummary?.certificates ?? []).map(item => `${item.language}:${item.milestone}`),
  ), [achievementSummary?.certificates]);

  const loadAchievements = async () => {
    try {
      setAchievementError('');
      const remote = await api.getAchievementSummary();
      const localCerts = getLocalCertificates();
      const allCerts = [...(remote?.certificates ?? [])];
      for (const lc of localCerts) {
        if (!allCerts.some(c => c.certificateCode === lc.certificateCode)) {
          allCerts.push(lc);
        }
      }
      setAchievementSummary({
        ...remote,
        certificates: allCerts,
      });
    } catch (error) {
      const localCerts = getLocalCertificates();
      if (localCerts.length > 0) {
        setAchievementSummary({
          certificates: localCerts,
          courseProgress: [],
          referralCode: state.referralCode || '',
          referralCount: 0,
        });
      } else {
        setAchievementError(error.message || 'Achievements are temporarily unavailable.');
      }
    }
  };

  useEffect(() => {
    if (state.isLoggedIn) loadAchievements();
  }, [state.isLoggedIn]);

  if (!state.isLoggedIn) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-300 mb-4">Please log in to view your profile</p>
      </div>
    );
  }

  const level = Math.floor(state.xp / 500) + 1;
  const courseIsLive = hasCourseStarted();

  const localCourseMilestones = useMemo(() => {
    const activeLang = state.activePathway || 'arabic';
    const prefix = activeLang === 'english' ? 'en-les-' : 'ar-les-';
    const completedDays = (state.completedLessons || [])
      .filter(id => typeof id === 'string' && id.startsWith(prefix))
      .map(id => Number.parseInt(id.slice(prefix.length), 10))
      .filter(d => Number.isSafeInteger(d) && d > 0);
    const daySet = new Set(completedDays);
    const eligibleMilestones = [7, 14, 21, 30].filter(m =>
      Array.from({ length: m }, (_, i) => i + 1).every(d => daySet.has(d))
    );
    return { language: activeLang, eligibleMilestones, completedDays };
  }, [state.activePathway, state.completedLessons]);

  const combinedProgress = useMemo(() => {
    const list = [...(achievementSummary?.courseProgress ?? [])];
    const existingIndex = list.findIndex(item => item.language === localCourseMilestones.language);
    if (existingIndex >= 0) {
      const mergedDays = [...new Set([...(list[existingIndex].completedDays || []), ...localCourseMilestones.completedDays])];
      const mergedMilestones = [...new Set([...(list[existingIndex].eligibleMilestones || []), ...localCourseMilestones.eligibleMilestones])];
      list[existingIndex] = {
        ...list[existingIndex],
        completedDays: mergedDays,
        eligibleMilestones: mergedMilestones,
      };
    } else {
      list.push(localCourseMilestones);
    }
    return list;
  }, [achievementSummary?.courseProgress, localCourseMilestones]);

  const claimable = combinedProgress.flatMap(course => (
    (course.eligibleMilestones || [])
      .filter(milestone => !issuedKeys.has(`${course.language}:${milestone}`))
      .map(milestone => ({ language: course.language, milestone }))
  ));
  const referralCode = achievementSummary?.referralCode || state.referralCode;
  const referralLink = referralCode ? `${window.location.origin}/login?ref=${referralCode}` : '';

  const claimCertificate = async ({ language, milestone }) => {
    const key = `${language}:${milestone}`;
    setClaiming(key);
    try {
      await api.claimCertificate(language, milestone);
      await loadAchievements();
    } catch (error) {
      console.warn('Remote certificate claim failed, issuing locally:', error);
      const code = `LUG-${language.slice(0, 2).toUpperCase()}-${milestone}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const localCert = {
        certificateCode: code,
        recipientName: state.userName || 'Learner',
        language,
        milestone,
        issuedAt: new Date().toISOString(),
      };
      saveLocalCertificate(localCert);
      setAchievementSummary(prev => ({
        ...prev,
        certificates: [...(prev?.certificates || []).filter(c => c.certificateCode !== code), localCert],
      }));
    } finally {
      setClaiming('');
    }
  };

  const shareReferral = async () => {
    if (!referralLink) return;
    const shareData = { title: 'Join me on Lugaish', text: 'Start your Arabic or English learning journey with me on Lugaish.', url: referralLink };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="space-y-8 pb-12 sm:space-y-12 sm:pb-20">
      <div className="-mx-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-10 sm:-mx-6 sm:px-6 sm:py-16">
        <h1 className="text-4xl font-black text-white sm:text-5xl">Your Profile</h1>
      </div>

      <div className="app-shell max-w-2xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="section-card p-6 text-center sm:p-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white">
            {state.userName?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{state.userName || 'Learner'}</h2>
          <p className="text-slate-400 mb-6">Level {level} • {state.xp.toLocaleString()} XP</p>

          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-8 sm:gap-4">
            <div>
              <p className="text-sm text-slate-400">Streak</p>
              <p className="text-xl font-bold text-yellow-400 sm:text-2xl">{courseIsLive ? `🔥 ${achievementSummary?.currentStreak ?? state.streak}` : 'Aug 1'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Lessons</p>
              <p className="text-xl font-bold text-emerald-400 sm:text-2xl">{state.completedLessons.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Badges</p>
              <p className="text-xl font-bold text-purple-400 sm:text-2xl">{state.badges.length}</p>
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="section-card p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">📊 Learning Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Language</p>
              <p className="font-bold text-white">
                {state.activePathway === 'english' ? '🇬🇧 English' : '🇸🇦 Arabic'}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Current Day</p>
              <p className="font-bold text-white">Day {state.activeLessonId.split('-')[2] || 1}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Total XP</p>
              <p className="font-bold text-white">{state.xp.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-300">Premium Status</p>
              <p className={`font-bold ${state.isPremium ? 'text-emerald-400' : 'text-amber-300'}`}>
                {state.isPremium ? '🔓 Premium active' : '👑 Free plan · Premium coming soon'}
              </p>
            </div>
          </div>
        </div>

        <div className="section-card p-5 sm:p-8">
          <div className="flex items-center gap-3">
            <Award className="text-amber-300" />
            <div>
              <h3 className="text-2xl font-bold text-white">Milestone Certificates</h3>
              <p className="mt-1 text-sm text-slate-400">Complete Days 1–7, 14, 21 and 30 to unlock verified Lugaish certificates.</p>
            </div>
          </div>

          {achievementError && <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{achievementError}</p>}
          {!achievementSummary && !achievementError && <LoaderCircle className="mx-auto mt-8 animate-spin text-blue-300" />}

          {claimable.length > 0 && (
            <div className="mt-6 grid gap-3">
              {claimable.map(item => {
                const key = `${item.language}:${item.milestone}`;
                return (
                  <button key={key} type="button" onClick={() => claimCertificate(item)} disabled={claiming === key} className="glow-button glow-button-green justify-center py-4 disabled:opacity-60">
                    {claiming === key ? <LoaderCircle size={18} className="animate-spin" /> : <Award size={18} />}
                    Claim {item.milestone}-Day {item.language === 'arabic' ? 'Arabic' : 'English'} Certificate
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 grid gap-4">
            {(achievementSummary?.certificates ?? []).map(certificate => (
              <article key={certificate.certificateCode} className="rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-500/15 to-blue-500/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">Verified achievement</p>
                <h4 className="mt-2 text-xl font-black text-white">{certificate.milestone}-Day {certificate.language === 'arabic' ? 'Arabic' : 'English'} Milestone</h4>
                <p className="mt-2 text-xs text-slate-400">Certificate {certificate.certificateCode}</p>
                <button type="button" onClick={() => navigate(`/certificate/${certificate.certificateCode}`)} className="glow-button glow-button-blue mt-4 w-full justify-center">View, print & share</button>
              </article>
            ))}
            {achievementSummary && !achievementSummary.certificates?.length && !claimable.length && (
              <p className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-slate-400">Your first certificate unlocks after completing Days 1–7.</p>
            )}
          </div>
        </div>

        <div className="section-card p-5 sm:p-8">
          <div className="flex items-center gap-3"><Share2 className="text-blue-300" /><h3 className="text-2xl font-bold text-white">Invite friends</h3></div>
          <p className="mt-3 text-sm leading-6 text-slate-400">Learn together and build your Lugaish community. {achievementSummary?.referralCount ?? 0} friend(s) joined with your link.</p>
          {referralLink && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="break-all text-xs text-slate-300">{referralLink}</p>
              <button type="button" onClick={shareReferral} className="glow-button glow-button-blue mt-4 w-full justify-center">
                {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Link copied' : 'Share invite link'}
              </button>
            </div>
          )}
        </div>

        <div className="section-card border-amber-300/20 p-5 sm:p-8">
          <div className="flex items-center gap-3"><Crown className="text-amber-300" /><h3 className="text-2xl font-bold text-white">Arabic Premium</h3></div>
          <p className="mt-3 text-sm leading-6 text-slate-400">Premium video courses, structured playlists and exclusive practice are being prepared. Your account is already compatible with premium access when the programme launches.</p>
          <span className="mt-5 inline-flex rounded-full border border-amber-300/20 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-200">{state.isPremium ? 'Premium active' : 'Coming soon'}</span>
        </div>

        {/* Quick Actions */}
        <div className="section-card p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/today')}
              className="glow-button glow-button-blue w-full text-left px-6 py-4"
            >
              → Continue Learning
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="glow-button glow-button-muted w-full text-left px-6 py-4"
            >
              → View Progress
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="section-card p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">⚙️ Settings</h3>
          <div className="space-y-4">
            <button
              onClick={actions.toggleTheme}
              className="w-full flex justify-between items-center p-4 rounded-lg hover:bg-white/5 transition"
            >
              <span className="text-slate-300">Theme</span>
              <span className="text-sm font-semibold text-slate-400">
                {state.theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
            <button
              onClick={actions.logout}
              className="w-full text-left px-4 py-4 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 hover:bg-red-500/20 transition font-semibold"
            >
              ← Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

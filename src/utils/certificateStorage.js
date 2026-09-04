const LOCAL_CERTS_KEY = 'lugaish_local_certificates';
const VIEWED_CERTS_KEY = 'lugaish_viewed_certificates';

export function getLocalCertificates() {
  try {
    const raw = localStorage.getItem(LOCAL_CERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCertificate(cert) {
  if (!cert?.certificateCode) return;
  try {
    const existing = getLocalCertificates();
    const updated = existing.filter(item => item.certificateCode !== cert.certificateCode);
    updated.push(cert);
    localStorage.setItem(LOCAL_CERTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save local certificate:', error);
  }
}

export function findLocalCertificate(code) {
  if (!code) return null;
  const list = getLocalCertificates();
  return list.find(item => item.certificateCode?.toUpperCase() === String(code).toUpperCase()) || null;
}

export function getViewedCertificateCodes() {
  try {
    const raw = localStorage.getItem(VIEWED_CERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markCertificateViewed(code) {
  if (!code) return;
  try {
    const normalized = String(code).toUpperCase();
    const existing = new Set(getViewedCertificateCodes());
    if (!existing.has(normalized)) {
      existing.add(normalized);
      localStorage.setItem(VIEWED_CERTS_KEY, JSON.stringify([...existing]));
    }
  } catch (error) {
    console.warn('Failed to mark certificate viewed:', error);
  }
}

export function isCertificateViewed(code) {
  if (!code) return false;
  const viewed = new Set(getViewedCertificateCodes());
  return viewed.has(String(code).toUpperCase());
}

export function purgeInvalidLocalCertificates(validMilestones = [], language = 'arabic') {
  try {
    const validSet = new Set(validMilestones);
    const existing = getLocalCertificates();
    const cleaned = existing.filter(cert => {
      if (cert.language !== language) return true;
      return validSet.has(cert.milestone);
    });
    if (cleaned.length !== existing.length) {
      localStorage.setItem(LOCAL_CERTS_KEY, JSON.stringify(cleaned));
      const removedCodes = new Set(
        existing
          .filter(c => c.language === language && !validSet.has(c.milestone))
          .map(c => String(c.certificateCode).toUpperCase())
      );
      const viewed = getViewedCertificateCodes().filter(code => !removedCodes.has(String(code).toUpperCase()));
      localStorage.setItem(VIEWED_CERTS_KEY, JSON.stringify(viewed));
    }
    return cleaned;
  } catch (error) {
    console.warn('Failed to purge invalid certificates:', error);
    return getLocalCertificates();
  }
}

export function getEligibleLocalMilestones(completedLessons = [], language = 'arabic') {
  const prefix = language === 'english' ? 'en-les-' : 'ar-les-';
  const completedDays = (completedLessons || [])
    .filter(id => typeof id === 'string' && id.startsWith(prefix))
    .map(id => Number.parseInt(id.slice(prefix.length), 10))
    .filter(d => Number.isSafeInteger(d) && d > 0);
  const daySet = new Set(completedDays);

  return [7, 14, 21, 30].filter(m => {
    // 1. Strict sequential check: every single day 1..m is completed
    const allSequential = Array.from({ length: m }, (_, i) => i + 1).every(d => daySet.has(d));
    if (allSequential) return true;

    // 2. Tolerance check: learner has reached day m (m, m+1, or m+2 is completed)
    // AND at least (m - 1) days within the 1..m range are completed.
    // This allows at most 1 skipped PDF/lecture, but NEVER allows a milestone the user has not reached!
    const inRangeCount = Array.from({ length: m }, (_, i) => i + 1).filter(d => daySet.has(d)).length;
    const reached = daySet.has(m) || daySet.has(m + 1) || daySet.has(m + 2);
    return reached && inRangeCount >= m - 1;
  });
}

export function getUnviewedCertificateCount(completedLessons = [], language = 'arabic', serverCertificates = []) {
  const eligible = getEligibleLocalMilestones(completedLessons, language);
  const eligibleSet = new Set(eligible);

  const localCerts = purgeInvalidLocalCertificates(eligible, language);
  const allCerts = [...(serverCertificates || [])];
  for (const cert of localCerts) {
    if (!allCerts.some(c => c.certificateCode === cert.certificateCode)) {
      allCerts.push(cert);
    }
  }

  // Only consider certificates that belong to this language and are valid for the learner's actual progress
  const validLanguageCerts = allCerts.filter(c => c.language === language && eligibleSet.has(c.milestone));

  const viewedCodes = new Set(getViewedCertificateCodes());
  const unviewedIssued = validLanguageCerts.filter(c => !viewedCodes.has(String(c.certificateCode).toUpperCase()));

  const claimedMilestones = new Set(validLanguageCerts.map(c => c.milestone));
  const unclaimedEligible = eligible.filter(m => !claimedMilestones.has(m));

  return unviewedIssued.length + unclaimedEligible.length;
}

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

export function getEligibleLocalMilestones(completedLessons = [], language = 'arabic') {
  const prefix = language === 'english' ? 'en-les-' : 'ar-les-';
  const completedDays = (completedLessons || [])
    .filter(id => typeof id === 'string' && id.startsWith(prefix))
    .map(id => Number.parseInt(id.slice(prefix.length), 10))
    .filter(d => Number.isSafeInteger(d) && d > 0);
  const daySet = new Set(completedDays);
  const maxDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;

  return [7, 14, 21, 30].filter(m => {
    const allSequential = Array.from({ length: m }, (_, i) => i + 1).every(d => daySet.has(d));
    if (allSequential) return true;
    return maxDay >= m && (completedDays.length >= Math.min(m, 5) || daySet.has(m));
  });
}

export function getUnviewedCertificateCount(completedLessons = [], language = 'arabic', serverCertificates = []) {
  const localCerts = getLocalCertificates();
  const allCerts = [...(serverCertificates || [])];
  for (const cert of localCerts) {
    if (!allCerts.some(c => c.certificateCode === cert.certificateCode)) {
      allCerts.push(cert);
    }
  }

  const viewedCodes = new Set(getViewedCertificateCodes());
  const unviewedIssued = allCerts.filter(c => !viewedCodes.has(String(c.certificateCode).toUpperCase()));

  const eligible = getEligibleLocalMilestones(completedLessons, language);
  const claimedMilestones = new Set(allCerts.filter(c => c.language === language).map(c => c.milestone));
  const unclaimedEligible = eligible.filter(m => !claimedMilestones.has(m));

  return unviewedIssued.length + unclaimedEligible.length;
}

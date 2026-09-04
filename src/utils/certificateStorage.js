const LOCAL_CERTS_KEY = 'lugaish_local_certificates';

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

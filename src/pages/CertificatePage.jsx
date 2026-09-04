import { useEffect, useState } from 'react';
import { LoaderCircle, Printer, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { findLocalCertificate } from '../utils/certificateStorage.js';

export function CertificatePage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    api.verifyCertificate(code)
      .then(result => { if (!ignore) setCertificate(result.certificate); })
      .catch(requestError => {
        if (ignore) return;
        const local = findLocalCertificate(code);
        if (local) {
          setCertificate(local);
        } else {
          setError(requestError.message || 'Certificate not found.');
        }
      });
    return () => { ignore = true; };
  }, [code]);

  const shareCertificate = async () => {
    const shareData = {
      title: `${certificate.milestone}-Day Lugaish Certificate`,
      text: `${certificate.recipientName} completed the ${certificate.milestone}-Day ${certificate.language} milestone on Lugaish.`,
      url: window.location.href,
    };
    if (navigator.share) return navigator.share(shareData).catch(() => {});
    await navigator.clipboard?.writeText(window.location.href);
    return undefined;
  };

  if (!certificate && !error) return <div className="grid min-h-[60svh] place-items-center"><LoaderCircle className="animate-spin text-blue-300" size={38} /></div>;
  if (error) return <section className="section-card p-10 text-center"><h1 className="text-3xl font-black text-white">Certificate unavailable</h1><p className="mt-3 text-slate-400">{error}</p><button type="button" onClick={() => navigate('/profile')} className="glow-button glow-button-blue mt-6">Back to profile</button></section>;

  const issuedDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(certificate.issuedAt));
  const languageLabel = certificate.language === 'arabic' ? 'Arabic' : 'English';

  return (
    <section className="space-y-6 pb-16">
      <div className="certificate-print relative mx-auto flex aspect-[1.414/1] w-full max-w-[70rem] items-center overflow-hidden rounded-[2.5rem] border-4 border-amber-300/60 bg-slate-950 p-8 text-center shadow-2xl sm:p-14">
        <div className="absolute inset-3 rounded-[2rem] border border-amber-200/25" />
        <div className="relative w-full">
          <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-amber-300/70 bg-white p-2 shadow-xl shadow-amber-400/15 sm:h-32 sm:w-32">
            <img src="/favicon.png" alt="Lugaish official logo" className="h-full w-full rounded-full object-contain" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.45em] text-amber-300">Lugaish</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">Certificate of Achievement</h1>
          <p className="mt-7 text-slate-400">This certificate is proudly presented to</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-amber-200 sm:text-5xl">{certificate.recipientName}</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-200">for successfully completing the <strong>{certificate.milestone}-Day {languageLabel} Learning Milestone</strong> at Lugaish.</p>
          <div className="mx-auto mt-10 grid max-w-xl gap-4 border-t border-white/10 pt-7 text-sm sm:grid-cols-3">
            <div><p className="text-slate-500">Issued</p><p className="mt-1 font-bold text-white">{issuedDate}</p></div>
            <div><p className="text-slate-500">Milestone</p><p className="mt-1 font-bold text-white">Day {certificate.milestone}</p></div>
            <div><p className="text-slate-500">Verification ID</p><p className="mt-1 break-all font-mono text-xs font-bold text-amber-200">{certificate.certificateCode}</p></div>
          </div>
        </div>
      </div>
      <div className="no-print flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => window.print()} className="glow-button glow-button-green justify-center"><Printer size={18} /> Print / Save PDF</button>
        <button type="button" onClick={shareCertificate} className="glow-button glow-button-blue justify-center"><Share2 size={18} /> Share certificate</button>
        <button type="button" onClick={() => navigate('/profile')} className="glow-button glow-button-muted justify-center">Back to profile</button>
      </div>
    </section>
  );
}

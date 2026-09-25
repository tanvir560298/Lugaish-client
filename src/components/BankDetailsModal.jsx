import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Building,
  CreditCard,
  User,
  GitBranch,
  Hash,
  ZoomIn,
  AlertCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export function BankDetailsModal({ isOpen, onClose, bankDetails }) {
  const [copiedKey, setCopiedKey] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const hasScreenshot = Boolean(bankDetails?.screenshotUrl);
  const hasTextDetails = Boolean(
    bankDetails?.bankName ||
    bankDetails?.accountName ||
    bankDetails?.accountNumber ||
    bankDetails?.iban ||
    bankDetails?.branchName ||
    bankDetails?.routingNumber ||
    bankDetails?.mobileBanking
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Tap-to-Enlarge Fullscreen Lightbox */}
      <AnimatePresence>
        {isZoomed && hasScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-2 sm:p-6 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={bankDetails.screenshotUrl}
                alt="Bank Details (Enlarged)"
                className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="absolute top-3 right-3 rounded-full bg-slate-900/80 p-2.5 text-white hover:bg-white/20 transition shadow-lg"
                title="Close enlarged view"
              >
                <X size={20} />
              </button>
              <p className="text-center text-xs text-slate-300 mt-2">Tap anywhere to close zoom</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Glow Accents */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
              <Building size={24} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-200">
                Official Tuition Account
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">Instructor Bank Details</h3>
              <p className="text-xs text-slate-400">Manual transfer instructions for monthly batch access.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 mt-6 space-y-6">
          {/* Screenshot Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <CreditCard size={14} /> Bank Account Screenshot:
              </h4>
              {hasScreenshot && (
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <ZoomIn size={12} className="text-cyan-400" /> Tap image to enlarge
                </span>
              )}
            </div>

            {hasScreenshot ? (
              <div
                onClick={() => setIsZoomed(true)}
                className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 p-2 transition hover:border-cyan-400/50 shadow-lg"
              >
                <img
                  src={bankDetails.screenshotUrl}
                  alt="Official Bank Details Screenshot"
                  className="w-full max-h-72 rounded-xl object-contain transition duration-200 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                  <span className="rounded-full bg-slate-900/90 border border-cyan-400/40 px-3 py-1.5 text-xs font-bold text-cyan-300 shadow-xl flex items-center gap-1.5">
                    <ZoomIn size={14} /> Click to Fullscreen Zoom
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-950/20 p-6 text-center space-y-2">
                <AlertCircle className="mx-auto text-cyan-400" size={28} />
                <p className="text-sm font-bold text-white">Official Bank Details Picture</p>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Instructor Tanvir Ahmad will upload the official bank details image shortly. Please use the instructions below or check back before making your transfer.
                </p>
              </div>
            )}
          </div>

          {/* Text Version with 1-Click Copy Buttons (if available) */}
          {/* Text Version with 1-Click Copy Buttons */}
          {hasTextDetails && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileText size={14} /> Official Account Details (Click to Copy):
                </h4>
              </div>

              {/* HIGHLIGHTED ACCOUNT NUMBER & IBAN HERO CARDS */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Account Number Card */}
                <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/15 via-slate-900/80 to-slate-900 p-4 shadow-lg shadow-cyan-950/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-200">
                      Account Number
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy((bankDetails.accountNumber || '077040010006081217472').trim(), 'accountNumber')}
                      className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-600/90 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
                    >
                      {copiedKey === 'accountNumber' ? (
                        <>
                          <Check size={14} className="text-emerald-300" />
                          <span className="text-emerald-200 font-black">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-base sm:text-lg font-black text-cyan-300 tracking-wider break-all select-all">
                    {bankDetails.accountNumber || '077040010006081217472'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Direct Bank Account Transfer</p>
                </div>

                {/* IBAN Card */}
                <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-slate-900 p-4 shadow-lg shadow-emerald-950/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200">
                      IBAN (International Transfer)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy((bankDetails.iban || 'SA89 8000 0859 6080 1121 7472').replace(/\s+/g, ''), 'iban')}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-600/90 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
                    >
                      {copiedKey === 'iban' ? (
                        <>
                          <Check size={14} className="text-white" />
                          <span className="text-white font-black">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy IBAN</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-sm sm:text-base font-black text-emerald-300 tracking-wider break-all select-all">
                    {bankDetails.iban || 'SA89 8000 0859 6080 1121 7472'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports local & international transfers</p>
                </div>
              </div>

              {/* Beneficiary Name & Bank Name */}
              <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Beneficiary / Account Name</p>
                    <p className="text-xs font-bold text-white mt-0.5">{bankDetails.accountName || 'TANVIR AHMAD'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.accountName || 'TANVIR AHMAD', 'accountName')}
                    className="rounded-lg p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition"
                    title="Copy Account Name"
                  >
                    {copiedKey === 'accountName' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bank Name</p>
                    <p className="text-xs font-bold text-white mt-0.5">{bankDetails.bankName || 'Al Rajhi Bank'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.bankName || 'Al Rajhi Bank', 'bankName')}
                    className="rounded-lg p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition"
                    title="Copy Bank Name"
                  >
                    {copiedKey === 'bankName' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {(bankDetails.branchName || bankDetails.routingNumber || bankDetails.mobileBanking) && (
                <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
                  {bankDetails.branchName && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Branch Name</p>
                        <p className="text-xs font-bold text-white mt-0.5">{bankDetails.branchName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.branchName, 'branchName')}
                        className="rounded-lg p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition"
                        title="Copy Branch Name"
                      >
                        {copiedKey === 'branchName' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}

                  {bankDetails.routingNumber && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Routing Number</p>
                        <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">{bankDetails.routingNumber}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.routingNumber, 'routingNumber')}
                        className="rounded-lg p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition"
                        title="Copy Routing Number"
                      >
                        {copiedKey === 'routingNumber' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}

                  {bankDetails.mobileBanking && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between sm:col-span-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mobile Banking</p>
                        <p className="text-xs font-bold text-white mt-0.5">{bankDetails.mobileBanking}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.mobileBanking, 'mobileBanking')}
                        className="rounded-lg p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition"
                        title="Copy Mobile Banking"
                      >
                        {copiedKey === 'mobileBanking' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Transfer Instructions */}
          <div className="rounded-2xl border border-purple-400/20 bg-purple-950/30 p-4 space-y-1.5">
            <h5 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Transfer Instructions:
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bankDetails?.transferInstructions ||
                'Please transfer the monthly fee to the bank account above and enter your name or email as the transfer reference. Once transferred, click "I\'ve transferred the payment" and submit your details. Your payment will be verified within 24 hours.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-7 flex items-center justify-end border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="glow-button glow-button-blue text-xs py-2.5 px-6 font-black uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

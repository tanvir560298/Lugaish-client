import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  X,
  Send,
  Upload,
  Calendar,
  User,
  CreditCard,
  FileCheck,
  AlertCircle,
  LoaderCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function TransferSubmissionModal({
  isOpen,
  onClose,
  month,
  fee = 3000,
  studentName = '',
  studentEmail = '',
  onSubmitTransfer,
}) {
  const [senderName, setSenderName] = useState('');
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Receipt image should be smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptUrl(reader.result);
      setErrorMessage('');
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await onSubmitTransfer({
        month,
        senderName: senderName.trim() || studentName,
        transferDate,
        transactionRef: transactionRef.trim(),
        receiptUrl,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit transfer details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-slate-100 max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        {/* Glow Accent */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-400/30">
              <CreditCard size={22} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-200">
                Month {month} Tuition · {fee} SAR (Riyals)
              </span>
              <h3 className="text-xl font-black text-white mt-1">Submit Transfer Details</h3>
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

        {/* Informational Prompt Message Required */}
        <div className="relative z-10 mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 flex items-start gap-3 text-cyan-200">
          <Clock size={20} className="text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            “After transferring the payment, submit your name and transfer details here. We’ll verify the payment and update you within 24 hours.”
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 mt-5 space-y-4">
          {/* Prefilled Student Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-cyan-400" /> Student Name (Prefilled):
            </label>
            <input
              type="text"
              value={studentName}
              disabled
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 cursor-not-allowed"
            />
          </div>

          {/* Sender / Account-Holder Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-purple-400" /> Sender / Account-Holder Name (if different):
            </label>
            <input
              type="text"
              placeholder={studentName || 'e.g. Account owner name'}
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-white placeholder-slate-500 focus:border-cyan-400/60 focus:outline-none transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">Leave blank if transferred from your own account.</p>
          </div>

          {/* Transfer Date */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-400" /> Transfer Date:
            </label>
            <input
              type="date"
              required
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-white focus:border-cyan-400/60 focus:outline-none transition"
            />
          </div>

          {/* Optional Transaction Reference / ID */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileCheck size={13} className="text-amber-400" /> Transaction Reference / TrxID (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Bank Ref No, TrxID, or Last 4 digits of sender account"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-white placeholder-slate-500 focus:border-cyan-400/60 focus:outline-none transition"
            />
          </div>

          {/* Optional Receipt Upload */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Upload size={13} className="text-blue-400" /> Transfer Receipt Screenshot (Optional):
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition flex items-center gap-2">
                <Upload size={14} className="text-cyan-400" />
                <span>{receiptUrl ? 'Replace Receipt Picture' : 'Attach Receipt / Screenshot'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>
              {receiptUrl && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 size={15} />
                  <span>Image Attached</span>
                  <button
                    type="button"
                    onClick={() => setReceiptUrl('')}
                    className="text-[10px] text-red-300 underline hover:text-red-200 ml-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            {receiptUrl && (
              <div className="mt-2.5 max-h-32 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1">
                <img src={receiptUrl} alt="Receipt Preview" className="h-28 w-auto mx-auto object-contain rounded-lg" />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="glow-button glow-button-blue text-xs py-2.5 px-6 font-black uppercase tracking-wider flex items-center gap-2 disabled:cursor-wait disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit for Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  DollarSign,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';
import { BankDetailsModal } from './BankDetailsModal.jsx';
import { TransferSubmissionModal } from './TransferSubmissionModal.jsx';
import {
  getBankSettings,
  getStudentPaymentStatus,
  submitTransferDetails,
  dismissPaymentNotification,
  MONTHLY_TUITION_FEE,
} from '../utils/paymentService.js';

export function StudentPaymentCard({ user, onPaymentUpdated }) {
  const [bankDetails, setBankDetails] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const studentEmail = user?.email || user?.userEmail || '';
  const studentName = user?.name || user?.userName || 'Learner';
  const paidMonths = Math.max(Number(user?.paidBatchMonths) || 1, 1);

  const loadData = async () => {
    try {
      const [bank, status] = await Promise.all([
        getBankSettings(),
        getStudentPaymentStatus(studentEmail, studentName, paidMonths),
      ]);
      setBankDetails(bank);
      setPaymentData(status);
    } catch (err) {
      console.error('Failed to load payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentEmail, paidMonths]);

  const handleTransferSubmitted = async (formData) => {
    const record = await submitTransferDetails(studentEmail, studentName, formData);
    setSuccessToast(`Transfer for Month ${formData.month} submitted! Status is now Pending verification.`);
    setTimeout(() => setSuccessToast(''), 6000);
    await loadData();
    onPaymentUpdated?.();
  };

  const handleDismissNotification = async (id) => {
    await dismissPaymentNotification(id, studentEmail);
    setPaymentData((prev) => ({
      ...prev,
      notifications: prev?.notifications?.filter((n) => n.id !== id),
    }));
  };

  if (loading) {
    return (
      <div className="section-card p-6 animate-pulse bg-slate-900/60 border-purple-500/20">
        <div className="h-6 w-48 bg-white/10 rounded-lg mb-3"></div>
        <div className="h-4 w-72 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  const applicableMonth = paymentData?.applicableMonth || paidMonths;
  const currentMonthRecord = paymentData?.months?.find((m) => m.month === applicableMonth);
  const status = currentMonthRecord?.status || (applicableMonth <= paidMonths ? 'received' : 'due');
  const fee = currentMonthRecord?.fee || MONTHLY_TUITION_FEE;
  const notifications = paymentData?.notifications || [];

  return (
    <div className="space-y-4">
      {/* Persistent Notification Banners */}
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id || notif._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`relative overflow-hidden rounded-2xl border p-4.5 shadow-xl flex items-start justify-between gap-3 ${
              notif.type === 'confirmation'
                ? 'border-emerald-400/40 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/40 text-emerald-200'
                : 'border-amber-400/40 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/40 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  notif.type === 'confirmation'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {notif.type === 'confirmation' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">{notif.title}</h4>
                <p className="mt-0.5 text-xs text-slate-200 leading-relaxed font-sans">{notif.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDismissNotification(notif.id || notif._id)}
              className="text-xs font-bold opacity-60 hover:opacity-100 transition shrink-0 p-1"
              title="Dismiss"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Success Toast */}
      {successToast && (
        <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/15 p-4 text-cyan-200 text-xs font-bold flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ATTRACTIVE STUDENT PAYMENT CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-purple-950/30">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-52 w-52 rounded-full bg-cyan-500/15 blur-2xl" />

        <div className="relative z-10 space-y-6">
          {/* Card Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-600/30 text-purple-200 border border-purple-400/30 shadow-lg shadow-purple-500/20">
                <CreditCard size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/40 bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-200">
                    💎 Paid Batch Monthly Access
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">12 Classes Per Month</span>
                </div>
                <h3 className="mt-1 text-2xl font-black text-white">Month {applicableMonth} Tuition & Billing</h3>
                <p className="text-xs text-slate-300">
                  Classes {(applicableMonth - 1) * 12 + 1}–{applicableMonth * 12} · Manual Bank Transfer Verification
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0 flex items-center gap-2">
              {status === 'received' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 shadow-lg shadow-emerald-950/40">
                  <CheckCircle2 size={15} /> Received (Confirmed)
                </span>
              ) : status === 'pending' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 shadow-lg shadow-cyan-950/40 animate-pulse">
                  <Clock size={15} /> Pending Verification
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shadow-lg shadow-amber-950/40">
                  <AlertCircle size={15} /> Payment Due
                </span>
              )}
            </div>
          </div>

          {/* Fee & Billing Details Pill Grid */}
          <div className="grid gap-3.5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Monthly Tuition Fee</span>
              <p className="text-2xl font-black text-white">{fee} <span className="text-xs text-slate-400 font-normal">SAR (Riyals / ﷼)</span></p>
              <p className="text-[11px] text-slate-400">Covers 12 guided classes + mocks</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Unlocked Curriculum</span>
              <p className="text-2xl font-black text-purple-300">Days 1–{paidMonths * 12}</p>
              <p className="text-[11px] text-emerald-300 font-semibold">✓ Permanently preserved in account</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Verification Timeline</span>
              <p className="text-xl font-black text-cyan-300">Within 24 Hours</p>
              <p className="text-[11px] text-slate-400">Manual review by Tanvir Ahmad</p>
            </div>
          </div>

          {/* DYNAMIC ACTION AREA ACCORDING TO USER SPECIFICATION */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 space-y-4">
            {status === 'received' ? (
              /* REQUIRED CONFIRMATION TEXT WHEN MARKED AS RECEIVED */
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/15 p-4 sm:p-5 text-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                    <CheckCircle2 size={18} />
                    <span>Official Confirmation</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed font-sans">
                    “Payment received — thank you, {studentName}! Your payment for Month {applicableMonth} has been confirmed. Keep up the great work with your learning!”
                  </p>
                  <p className="text-xs text-emerald-300/80">
                    Classes {(applicableMonth - 1) * 12 + 1}–{applicableMonth * 12} are fully unlocked in your Daily Lessons schedule.
                  </p>
                </div>
              </div>
            ) : status === 'pending' ? (
              /* PENDING VERIFICATION STATE */
              <div className="space-y-3">
                <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4 sm:p-5 text-cyan-200 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-black text-sm">
                    <Clock size={18} className="animate-spin" />
                    <span>Payment Verification In Progress</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    “After transferring the payment, submit your name and transfer details here. We’ll verify the payment and update you within 24 hours.”
                  </p>
                  {currentMonthRecord?.senderName && (
                    <div className="mt-2 text-xs text-slate-300 border-t border-white/10 pt-2 flex flex-wrap gap-4">
                      <span><strong>Sender:</strong> {currentMonthRecord.senderName}</span>
                      {currentMonthRecord.transactionRef && <span><strong>Ref/TrxID:</strong> {currentMonthRecord.transactionRef}</span>}
                      <span><strong>Date:</strong> {currentMonthRecord.transferDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(true)}
                    className="rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <Building size={14} /> View Bank Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-300 transition flex items-center gap-1.5"
                  >
                    Edit / Re-submit Transfer Details
                  </button>
                </div>
              </div>
            ) : (
              /* REQUIRED BUTTONS WHEN PAYMENT IS DUE */
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  To continue your studies and unlock Month {applicableMonth} (Classes {(applicableMonth - 1) * 12 + 1}–{applicableMonth * 12}), please transfer the monthly fee to the instructor bank account and submit your transfer confirmation below.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    id="btn-view-bank-details"
                    onClick={() => setIsBankModalOpen(true)}
                    className="glow-button glow-button-blue text-xs py-3 px-6 font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
                  >
                    <Building size={16} />
                    <span>View bank details</span>
                  </button>

                  <button
                    type="button"
                    id="btn-transferred-payment"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="glow-button glow-button-green text-xs py-3 px-6 font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <CheckCircle2 size={16} />
                    <span>I’ve transferred the payment</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment History Accordion */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center justify-between w-full transition"
            >
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-purple-400" />
                <span>Payment History & Past Receipts</span>
              </span>
              {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showHistory && (
              <div className="mt-3 space-y-2">
                {paymentData?.months?.map((m) => (
                  <div
                    key={m.month}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-purple-500/20 text-xs font-black text-purple-300">
                        {m.month}
                      </span>
                      <div>
                        <p className="font-bold text-white">Month {m.month} (Classes {(m.month - 1) * 12 + 1}–{m.month * 12})</p>
                        <p className="text-[11px] text-slate-400">
                          Tuition: {m.fee || MONTHLY_TUITION_FEE} SAR (Riyals)
                          {m.transferDate && ` · Transferred: ${m.transferDate}`}
                          {m.transactionRef && ` · Ref: ${m.transactionRef}`}
                        </p>
                      </div>
                    </div>
                    <div>
                      {m.status === 'received' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                          <Check size={11} /> Received
                        </span>
                      ) : m.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          <Clock size={11} /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                          Due
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BankDetailsModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        bankDetails={bankDetails}
      />

      <TransferSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        month={applicableMonth}
        fee={fee}
        studentName={studentName}
        studentEmail={studentEmail}
        onSubmitTransfer={handleTransferSubmitted}
      />
    </div>
  );
}

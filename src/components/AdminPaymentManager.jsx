import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Search, 
  RefreshCw, 
  Send, 
  Trash2, 
  Check, 
  X, 
  FileText, 
  CreditCard, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Plus,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { 
  getBankSettings, 
  updateBankSettings, 
  listAllPaymentRecords, 
  adminConfirmPayment, 
  adminSendPaymentReminder,
  MONTHLY_TUITION_FEE,
  TOTAL_MONTHS,
  DEFAULT_BANK_SETTINGS
} from '../utils/paymentService.js';

export function AdminPaymentManager({ onStudentRecordUpdated }) {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'bank_settings'
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Bank settings state
  const [bankSettings, setBankSettings] = useState(DEFAULT_BANK_SETTINGS);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Student queue state
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'due' | 'received'
  const [searchQuery, setSearchQuery] = useState('');

  // Selected screenshot for enlarged lightbox modal
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState('');

  // Add / Bill New Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentMonth, setNewStudentMonth] = useState(1);
  const [newStudentStatus, setNewStudentStatus] = useState('due');

  // Confirmation feedback
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Load data on mount
  const loadData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [settings, queueData] = await Promise.all([
        getBankSettings(),
        listAllPaymentRecords(),
      ]);
      setBankSettings(settings || DEFAULT_BANK_SETTINGS);
      setRecords(queueData.records || []);
      setUsers(queueData.users || []);
    } catch (err) {
      console.error('Failed to load admin payment data:', err);
      setErrorMessage('Could not load payment records. Using local state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle bank screenshot upload
  const handleScreenshotFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size is too large. Please select an image under 8MB.');
      return;
    }

    setUploadingImage(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      setBankSettings(prev => ({
        ...prev,
        screenshotUrl: base64Data,
      }));
      setUploadingImage(false);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Save Bank Settings
  const handleSaveBankSettings = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      await updateBankSettings(bankSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save bank settings:', err);
      setErrorMessage('Failed to save bank settings. Please try again.');
    }
  };

  // Confirm Payment (Mark as Received)
  const handleConfirmReceived = async (record) => {
    setErrorMessage('');
    try {
      await adminConfirmPayment(record.userEmail, record.month, 'received');
      setActionSuccessMsg(`Payment for ${record.userName || record.userEmail} (Month ${record.month}) marked as Received! Classes unlocked.`);
      setTimeout(() => setActionSuccessMsg(''), 5000);
      await loadData();
      if (onStudentRecordUpdated) onStudentRecordUpdated();
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      setErrorMessage('Failed to confirm payment status.');
    }
  };

  // Mark as Due
  const handleMarkAsDue = async (record) => {
    setErrorMessage('');
    try {
      await adminConfirmPayment(record.userEmail, record.month, 'due');
      setActionSuccessMsg(`Status for Month ${record.month} reset to Due.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
      await loadData();
      if (onStudentRecordUpdated) onStudentRecordUpdated();
    } catch (err) {
      console.error('Failed to update status to due:', err);
      setErrorMessage('Failed to update status.');
    }
  };

  // Request Payment / Send Reminder
  const handleSendReminder = async (record) => {
    setErrorMessage('');
    try {
      await adminSendPaymentReminder(record.userEmail, record.month, record.userName);
      setActionSuccessMsg(`Payment reminder sent to ${record.userName || record.userEmail} for Month ${record.month}!`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to send reminder:', err);
      setErrorMessage('Failed to send in-app reminder.');
    }
  };

  // Add / Initialize new student payment
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!newStudentEmail) return;

    try {
      await adminConfirmPayment(newStudentEmail.trim().toLowerCase(), Number(newStudentMonth), newStudentStatus);
      setShowAddModal(false);
      setNewStudentEmail('');
      setNewStudentName('');
      setActionSuccessMsg(`Payment record created for ${newStudentEmail} (Month ${newStudentMonth})!`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
      await loadData();
      if (onStudentRecordUpdated) onStudentRecordUpdated();
    } catch (err) {
      console.error('Failed to create payment record:', err);
      setErrorMessage('Failed to create payment record.');
    }
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (record.userName || '').toLowerCase().includes(q) ||
        (record.userEmail || '').toLowerCase().includes(q) ||
        (record.senderName || '').toLowerCase().includes(q) ||
        (record.transactionRef || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, searchQuery]);

  // Counts
  const pendingCount = records.filter(r => r.status === 'pending').length;
  const receivedCount = records.filter(r => r.status === 'received').length;
  const dueCount = records.filter(r => r.status === 'due').length;

  return (
    <div id="tuition-payment-manager" className="section-card relative overflow-hidden p-6 sm:p-8">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300">
              <Building2 size={13} />
              Tuition & Manual Bank Transfers
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/20 px-2.5 py-0.5 text-xs font-black text-amber-300 animate-pulse">
                {pendingCount} Pending Verification
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">Manual Bank Payment Center</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage your bank details screenshot, transfer instructions, and verify student monthly payments.
          </p>
        </div>

        {/* Tab switcher & actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'queue'
                ? 'border border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <UserCheck size={15} />
            Verification Queue ({records.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank_settings')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'bank_settings'
                ? 'border border-emerald-400/30 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <CreditCard size={15} />
            Bank Screenshot & Details
          </button>

          <button
            type="button"
            onClick={loadData}
            title="Refresh records"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionSuccessMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-200 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-200">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="mt-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Submissions</p>
              <p className="mt-1 text-2xl font-black text-white">{records.length}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">Pending Review</p>
              <p className="mt-1 text-2xl font-black text-amber-300">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Confirmed Received</p>
              <p className="mt-1 text-2xl font-black text-emerald-300">{receivedCount}</p>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-300">Awaiting Transfer</p>
              <p className="mt-1 text-2xl font-black text-blue-300">{dueCount}</p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Records' },
                { id: 'pending', label: `Pending (${pendingCount})`, highlight: pendingCount > 0 },
                { id: 'received', label: `Received (${receivedCount})` },
                { id: 'due', label: `Due (${dueCount})` },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    statusFilter === f.id
                      ? f.highlight
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-white/20 text-white font-black'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search student or ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-200 hover:bg-blue-500/20 transition shrink-0"
              >
                <Plus size={14} />
                <span>Add Record</span>
              </button>
            </div>
          </div>

          {/* Records List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RefreshCw size={28} className="animate-spin text-blue-400 mb-3" />
              <p className="text-sm font-semibold">Loading payment records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <UserCheck size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-base font-bold text-white">No payment records found</p>
              <p className="mt-1 text-sm text-slate-400">
                {statusFilter !== 'all' 
                  ? `There are no records with status "${statusFilter}".` 
                  : 'No student payments have been recorded yet.'}
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
              >
                <Plus size={14} />
                Create New Student Record
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.map(record => {
                const isPending = record.status === 'pending';
                const isReceived = record.status === 'received';
                const isDue = record.status === 'due';

                return (
                  <div
                    key={record.id || `${record.userEmail}-${record.month}`}
                    className={`relative rounded-2xl border p-5 transition ${
                      isPending
                        ? 'border-amber-400/40 bg-gradient-to-br from-amber-500/10 to-transparent shadow-lg shadow-amber-500/5'
                        : isReceived
                          ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
                          : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left: Student & Month details */}
                      <div className="flex items-start gap-3.5">
                        <div className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
                          isPending
                            ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                            : isReceived
                              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                              : 'border-slate-500/30 bg-white/5 text-slate-400'
                        }`}>
                          {isPending ? <Clock size={20} className="animate-spin" /> : isReceived ? <CheckCircle2 size={20} /> : <CreditCard size={20} />}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-black text-white">
                              {record.userName || record.userEmail.split('@')[0]}
                            </span>
                            <span className="rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-black text-purple-300">
                              Month {record.month} (Days {(record.month - 1) * 12 + 1}–{record.month * 12})
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              isPending
                                ? 'border-amber-400/40 bg-amber-500/20 text-amber-300 animate-pulse'
                                : isReceived
                                  ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300'
                                  : 'border-blue-400/30 bg-blue-500/10 text-blue-300'
                            }`}>
                              {isPending ? 'Pending Verification' : isReceived ? 'Received & Unlocked' : 'Payment Due'}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-400">{record.userEmail}</p>

                          {/* Submission Details if submitted */}
                          {(record.senderName || record.transferDate || record.transactionRef) && (
                            <div className="mt-3 grid gap-2 sm:grid-cols-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs text-slate-300">
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase font-bold">Sender Name</span>
                                <span className="font-semibold text-white">{record.senderName || '—'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase font-bold">Transfer Date</span>
                                <span className="font-semibold text-white">{record.transferDate || '—'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase font-bold">Reference / TrxID</span>
                                <span className="font-mono text-emerald-300 font-bold">{record.transactionRef || 'None'}</span>
                              </div>
                            </div>
                          )}

                          {record.confirmedAt && (
                            <p className="mt-2 text-[11px] text-emerald-400/90 font-medium">
                              ✓ Verified & confirmed on {new Date(record.confirmedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Receipt preview & Admin actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Receipt thumbnail button */}
                        {record.receiptUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setLightboxImage(record.receiptUrl);
                              setLightboxTitle(`Transfer Receipt — ${record.userName || record.userEmail} (Month ${record.month})`);
                            }}
                            className="group relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:border-emerald-400/40 hover:bg-white/10 transition"
                          >
                            <img
                              src={record.receiptUrl}
                              alt="Receipt"
                              className="h-7 w-7 rounded object-cover border border-white/10"
                            />
                            <span>View Receipt</span>
                            <Maximize2 size={13} className="text-slate-500 group-hover:text-white" />
                          </button>
                        )}

                        <div className="text-right pr-2">
                          <p className="text-[10px] font-bold uppercase text-slate-500">Monthly Tuition</p>
                          <p className="text-lg font-black text-white">৳{(record.fee || MONTHLY_TUITION_FEE).toLocaleString()} <span className="text-xs text-slate-400 font-normal">BDT</span></p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {!isReceived ? (
                            <button
                              type="button"
                              onClick={() => handleConfirmReceived(record)}
                              className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition"
                            >
                              <CheckCircle2 size={15} />
                              Mark as Received
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMarkAsDue(record)}
                              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition"
                              title="Reset back to due"
                            >
                              Mark as Due
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleSendReminder(record)}
                            className="flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/20 transition"
                            title="Send an in-app reminder notification"
                          >
                            <Send size={13} />
                            <span>Remind</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BANK SCREENSHOT & DETAILS CONFIGURATION */}
      {activeTab === 'bank_settings' && (
        <form onSubmit={handleSaveBankSettings} className="mt-6 space-y-6">
          {/* Screenshot Upload / Preview Zone */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white">Bank Details Screenshot</h3>
                <p className="text-xs text-slate-400">
                  Upload an image of your bank account details or card. Students see this when they click "View bank details".
                </p>
              </div>
              {bankSettings.screenshotUrl && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <CheckCircle2 size={13} />
                  Screenshot Configured
                </span>
              )}
            </div>

            {/* Instruction Notice */}
            <div className="mb-5 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 text-xs leading-relaxed text-blue-200">
              <p className="font-semibold text-white mb-1">⚠️ Safety & Privacy Reminder:</p>
              Please upload an image containing only the account details intended for students (account title, account number, branch, routing, QR code). Do not include personal balances or transaction history.
            </div>

            {/* Upload Dropzone / Preview */}
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] p-8 text-center hover:border-emerald-400/50 hover:bg-white/[0.04] transition cursor-pointer">
                  <Upload size={32} className="text-slate-400 mb-3" />
                  <p className="text-sm font-bold text-white">
                    {uploadingImage ? 'Processing image...' : 'Click to select or drag & drop bank screenshot'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Supports PNG, JPG, WEBP (Max 8MB). Instructor will upload the official bank screenshot here.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotFile}
                    className="hidden"
                  />
                </label>

                {bankSettings.screenshotUrl && (
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setLightboxImage(bankSettings.screenshotUrl);
                        setLightboxTitle('Student View: Bank Details Screenshot');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      <Eye size={14} />
                      Preview Tap-to-Enlarge
                    </button>

                    <button
                      type="button"
                      onClick={() => setBankSettings(prev => ({ ...prev, screenshotUrl: '' }))}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={13} />
                      Remove Screenshot
                    </button>
                  </div>
                )}
              </div>

              {/* Current Screenshot Preview Display */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 flex flex-col items-center justify-center min-h-[220px]">
                {bankSettings.screenshotUrl ? (
                  <div className="w-full text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Live Preview</p>
                    <div 
                      onClick={() => {
                        setLightboxImage(bankSettings.screenshotUrl);
                        setLightboxTitle('Student View: Bank Details Screenshot');
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                    >
                      <img
                        src={bankSettings.screenshotUrl}
                        alt="Bank Details Screenshot Preview"
                        className="max-h-56 w-full object-contain mx-auto transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                        <Maximize2 size={16} />
                        Tap to Enlarge
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <Building2 size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-semibold">No screenshot uploaded yet</p>
                    <p className="text-[11px] mt-1 text-slate-600">Students will see text details until you upload a screenshot.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Bank Details (Optional copyable backup) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-base font-black text-white">Bank Account Text Details</h3>
            <p className="mt-1 text-xs text-slate-400">
              Students can view and copy these details directly alongside your screenshot.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g., City Bank PLC / Islami Bank"
                  value={bankSettings.bankName || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Title / Beneficiary Name</label>
                <input
                  type="text"
                  placeholder="e.g., Tanvir Ahmad"
                  value={bankSettings.accountName || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g., 077040010006081217472"
                  value={bankSettings.accountNumber || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-mono text-cyan-300 placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">IBAN (International Bank Account Number)</label>
                <input
                  type="text"
                  placeholder="e.g., SA89 8000 0859 6080 1121 7472"
                  value={bankSettings.iban || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, iban: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-mono text-emerald-300 placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dhanmondi Branch, Dhaka"
                  value={bankSettings.branchName || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, branchName: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Routing Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 225272635"
                  value={bankSettings.routingNumber || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, routingNumber: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Mobile Banking / Bkash / Nagad (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Bkash (Personal): 01XXXXXXXXX"
                  value={bankSettings.mobileBanking || ''}
                  onChange={(e) => setBankSettings(prev => ({ ...prev, mobileBanking: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transfer Instructions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-base font-black text-white">Editable Transfer Instructions</h3>
            <p className="mt-1 text-xs text-slate-400">
              Displayed to students in the "View bank details" modal to guide them on sending payments.
            </p>

            <textarea
              rows={4}
              value={bankSettings.transferInstructions || ''}
              onChange={(e) => setBankSettings(prev => ({ ...prev, transferInstructions: e.target.value }))}
              placeholder="Enter transfer instructions..."
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fadeIn">
                <CheckCircle2 size={15} />
                Bank details updated successfully!
              </span>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition"
            >
              <Check size={16} />
              Save Bank Configuration
            </button>
          </div>
        </form>
      )}

      {/* LIGHTBOX MODAL (Tap to Enlarge) */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] overflow-auto rounded-3xl border border-white/20 bg-slate-900 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <h4 className="text-sm font-bold text-white">{lightboxTitle || 'Screenshot Preview'}</h4>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="rounded-full bg-white/10 p-1.5 text-slate-400 hover:text-white hover:bg-white/20 transition"
              >
                <X size={16} />
              </button>
            </div>
            <img
              src={lightboxImage}
              alt="Enlarged"
              className="max-h-[75vh] w-auto mx-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* CREATE NEW PAYMENT RECORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black text-white">Create Student Payment Record</h3>
                <p className="text-xs text-slate-400">Initialize monthly tuition billing for a student.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full bg-white/10 p-1.5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Student Email *</label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Month to Bill</label>
                <select
                  value={newStudentMonth}
                  onChange={(e) => setNewStudentMonth(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value={1}>Month 1 (Classes 1–12) — ৳3,000</option>
                  <option value={2}>Month 2 (Classes 13–24) — ৳3,000</option>
                  <option value={3}>Month 3 (Classes 25–36) — ৳3,000</option>
                  <option value={4}>Month 4 (Classes 37–48) — ৳3,000</option>
                  <option value={5}>Month 5 (Classes 49–60) — ৳3,000</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Initial Status</label>
                <select
                  value={newStudentStatus}
                  onChange={(e) => setNewStudentStatus(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="due">Payment Due (Needs Transfer)</option>
                  <option value="received">Mark as Received (Unlock Classes Immediately)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl border border-blue-400/30 bg-blue-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

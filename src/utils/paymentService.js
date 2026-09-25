import { api } from '../api/client.js';

const STORAGE_KEY_BANK_SETTINGS = 'lugaish_bank_settings_v1';
const STORAGE_KEY_RECORDS = 'lugaish_payment_records_v1';
const STORAGE_KEY_NOTIFICATIONS = 'lugaish_payment_notifications_v1';

export const DEFAULT_BANK_SETTINGS = {
  screenshotUrl: '/bank-details-qr.png',
  bankName: 'Al Rajhi Bank',
  accountName: 'TANVIR AHMAD',
  accountNumber: '077040010006081217472',
  iban: 'SA89 8000 0859 6080 1121 7472',
  branchName: '',
  routingNumber: '',
  mobileBanking: '',
  transferInstructions: 'Please transfer the monthly tuition to the bank account shown above or scan the QR code. You can use either the Account Number or IBAN. Use your name or email as the transfer reference. Once transferred, click "I\'ve transferred the payment" and submit your details. We will verify and update you within 24 hours.',
};

export const MONTHLY_TUITION_FEE = 3000;
export const TOTAL_MONTHS = 5;

function getLocalItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

// 1. Bank Settings
export async function getBankSettings() {
  try {
    const res = await api.getBankDetails();
    if (res?.bankDetails && (res.bankDetails.accountNumber || res.bankDetails.iban)) {
      setLocalItem(STORAGE_KEY_BANK_SETTINGS, res.bankDetails);
      return res.bankDetails;
    }
  } catch {
    // Fall back to local
  }
  const local = getLocalItem(STORAGE_KEY_BANK_SETTINGS, null);
  if (local && (local.accountNumber || local.iban || local.screenshotUrl)) {
    return {
      ...DEFAULT_BANK_SETTINGS,
      ...local,
      screenshotUrl: local.screenshotUrl || DEFAULT_BANK_SETTINGS.screenshotUrl,
      accountNumber: local.accountNumber || DEFAULT_BANK_SETTINGS.accountNumber,
      iban: local.iban || DEFAULT_BANK_SETTINGS.iban,
      bankName: local.bankName || DEFAULT_BANK_SETTINGS.bankName,
      accountName: local.accountName || DEFAULT_BANK_SETTINGS.accountName,
    };
  }
  return DEFAULT_BANK_SETTINGS;
}

export async function updateBankSettings(settings) {
  setLocalItem(STORAGE_KEY_BANK_SETTINGS, settings);
  try {
    const res = await api.updateBankDetails(settings);
    if (res?.bankDetails) {
      setLocalItem(STORAGE_KEY_BANK_SETTINGS, res.bankDetails);
      return res.bankDetails;
    }
  } catch {
    // Local update succeeded
  }
  return settings;
}

// 2. Student Payment Status
export async function getStudentPaymentStatus(email, studentName, paidBatchMonths = 1) {
  const normEmail = (email || '').toLowerCase().trim();
  const studentPaidMonths = Math.max(Number(paidBatchMonths) || 1, 1);

  try {
    const res = await api.getPaymentStatus();
    if (res?.months) {
      return res;
    }
  } catch {
    // Fallback to local calculation
  }

  const allRecords = getLocalItem(STORAGE_KEY_RECORDS, []);
  const userRecords = allRecords.filter(r => r.userEmail?.toLowerCase() === normEmail);
  const recordMap = new Map(userRecords.map(r => [r.month, r]));

  const months = Array.from({ length: TOTAL_MONTHS }, (_, i) => {
    const monthNum = i + 1;
    const existing = recordMap.get(monthNum);
    if (existing) return existing;

    return {
      month: monthNum,
      fee: MONTHLY_TUITION_FEE,
      currency: 'BDT',
      status: monthNum <= studentPaidMonths ? 'received' : 'due',
      userEmail: normEmail,
      userName: studentName || 'Learner',
    };
  });

  const pendingMonth = months.find(m => m.status === 'pending');
  const dueMonth = months.find(m => m.status === 'due');
  const applicableMonth = pendingMonth?.month || dueMonth?.month || studentPaidMonths;

  const allNotifications = getLocalItem(STORAGE_KEY_NOTIFICATIONS, []);
  const notifications = allNotifications.filter(n => n.userEmail?.toLowerCase() === normEmail && !n.isRead);

  return {
    paidBatchMonths: studentPaidMonths,
    privateBatchAccess: true,
    applicableMonth,
    months,
    notifications,
  };
}

// 3. Student Submits Transfer Details
export async function submitTransferDetails(email, studentName, { month, senderName, transferDate, transactionRef, receiptUrl }) {
  const normEmail = (email || '').toLowerCase().trim();
  const monthNum = Number(month) || 1;

  const payload = {
    month: monthNum,
    senderName: senderName || studentName,
    transferDate: transferDate || new Date().toISOString().split('T')[0],
    transactionRef: transactionRef || '',
    receiptUrl: receiptUrl || '',
  };

  try {
    const res = await api.submitPaymentTransfer(payload);
    if (res?.record) {
      syncLocalRecord(res.record);
      return res.record;
    }
  } catch {
    // Fallback local update
  }

  const allRecords = getLocalItem(STORAGE_KEY_RECORDS, []);
  const existingIdx = allRecords.findIndex(r => r.userEmail?.toLowerCase() === normEmail && r.month === monthNum);

  const newRecord = {
    id: `local-pay-${Date.now()}`,
    userEmail: normEmail,
    userName: studentName || 'Learner',
    month: monthNum,
    fee: MONTHLY_TUITION_FEE,
    currency: 'BDT',
    status: 'pending', // MUST NEVER BE RECEIVED ON SUBMIT
    senderName: payload.senderName,
    transferDate: payload.transferDate,
    transactionRef: payload.transactionRef,
    receiptUrl: payload.receiptUrl,
    submittedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    allRecords[existingIdx] = { ...allRecords[existingIdx], ...newRecord };
  } else {
    allRecords.unshift(newRecord);
  }
  setLocalItem(STORAGE_KEY_RECORDS, allRecords);

  return newRecord;
}

function syncLocalRecord(record) {
  const allRecords = getLocalItem(STORAGE_KEY_RECORDS, []);
  const idx = allRecords.findIndex(r => r.userEmail === record.userEmail && r.month === record.month);
  if (idx >= 0) {
    allRecords[idx] = record;
  } else {
    allRecords.unshift(record);
  }
  setLocalItem(STORAGE_KEY_RECORDS, allRecords);
}

// 4. Admin Management Methods
export async function listAllPaymentRecords() {
  try {
    const res = await api.listAdminPaymentRecords();
    if (res?.records) {
      setLocalItem(STORAGE_KEY_RECORDS, res.records);
      return res;
    }
  } catch {
    // Return local
  }
  return {
    records: getLocalItem(STORAGE_KEY_RECORDS, []),
    users: [],
  };
}

export async function adminConfirmPayment(userEmail, month, status, adminNotes = '') {
  const normEmail = (userEmail || '').toLowerCase().trim();
  const monthNum = Number(month);

  try {
    const res = await api.confirmPayment({ userEmail: normEmail, month: monthNum, status, adminNotes });
    if (res?.record) {
      syncLocalRecord(res.record);
      return res;
    }
  } catch {
    // Fallback local
  }

  const allRecords = getLocalItem(STORAGE_KEY_RECORDS, []);
  const record = allRecords.find(r => r.userEmail?.toLowerCase() === normEmail && r.month === monthNum);

  if (record) {
    record.status = status;
    record.adminNotes = adminNotes;
    record.confirmedAt = status === 'received' ? new Date().toISOString() : null;
  } else {
    allRecords.unshift({
      id: `local-pay-${Date.now()}`,
      userEmail: normEmail,
      userName: normEmail.split('@')[0],
      month: monthNum,
      fee: MONTHLY_TUITION_FEE,
      currency: 'BDT',
      status,
      adminNotes,
      confirmedAt: status === 'received' ? new Date().toISOString() : null,
    });
  }
  setLocalItem(STORAGE_KEY_RECORDS, allRecords);

  if (status === 'received') {
    // PUSH PERSISTENT NOTIFICATION TO STUDENT
    const allNotifications = getLocalItem(STORAGE_KEY_NOTIFICATIONS, []);
    allNotifications.unshift({
      id: `notif-${Date.now()}`,
      userEmail: normEmail,
      title: `Payment Confirmed — Month ${monthNum}`,
      message: `Payment received — thank you! Your payment for Month ${monthNum} has been confirmed. Keep up the great work with your learning!`,
      type: 'confirmation',
      month: monthNum,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setLocalItem(STORAGE_KEY_NOTIFICATIONS, allNotifications);
  }

  return { message: 'Updated locally', status };
}

export async function adminSendPaymentReminder(userEmail, month, studentName = '') {
  const normEmail = (userEmail || '').toLowerCase().trim();
  const monthNum = Number(month) || 1;

  try {
    const res = await api.remindPayment({ userEmail: normEmail, month: monthNum });
    if (res?.notification) return res;
  } catch {
    // Fallback local
  }

  const allNotifications = getLocalItem(STORAGE_KEY_NOTIFICATIONS, []);
  allNotifications.unshift({
    id: `notif-${Date.now()}`,
    userEmail: normEmail,
    title: `Tuition Reminder — Month ${monthNum}`,
    message: `Friendly reminder from instructor Tanvir: Your payment for Month ${monthNum} (Classes ${(monthNum - 1) * 12 + 1}–${monthNum * 12}) is currently due. Please view the bank details to complete your transfer.`,
    type: 'reminder',
    month: monthNum,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
  setLocalItem(STORAGE_KEY_NOTIFICATIONS, allNotifications);

  return { message: 'Reminder sent locally' };
}

export async function dismissPaymentNotification(id, email) {
  try {
    await api.dismissPaymentNotification(id);
  } catch {
    // Local fallback
  }
  const allNotifications = getLocalItem(STORAGE_KEY_NOTIFICATIONS, []);
  const updated = allNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
  setLocalItem(STORAGE_KEY_NOTIFICATIONS, updated);
}

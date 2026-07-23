import React, { useEffect, useMemo, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { mockPayments } from '../../data/mockPayments';

const STORAGE_KEY = 'skillbridge_payments';

const readStoredPayments = () => {
  if (typeof window === 'undefined') return mockPayments;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockPayments;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : mockPayments;
  } catch {
    return mockPayments;
  }
};

export const PaiementsPage = () => {
  const [payments] = useState(readStoredPayments);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments)), [payments]);

  const filteredPayments = useMemo(() => payments.filter((payment) => {
    const matchSearch = [payment.invoice, payment.customer, payment.status].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || payment.status === status;
    return matchSearch && matchStatus;
  }), [payments, search, status]);

  const monthlyRevenue = payments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-white p-5 shadow-sm dark:bg-slate-800"><div className="text-sm text-slate-500">Revenu mensuel</div><div className="mt-2 text-3xl font-semibold text-white">{monthlyRevenue} TND</div></div>
        <div className="rounded-[24px] bg-white p-5 shadow-sm dark:bg-slate-800"><div className="text-sm text-slate-500">Transactions</div><div className="mt-2 text-3xl font-semibold text-white">{payments.length}</div></div>
        <div className="rounded-[24px] bg-white p-5 shadow-sm dark:bg-slate-800"><div className="text-sm text-slate-500">Paiements validés</div><div className="mt-2 text-3xl font-semibold text-white">{payments.filter((item) => item.status === 'Payé').length}</div></div>
      </div>

      <ManagementPageLayout title="Paiements" description="Suivi des revenus, factures et transactions" searchValue={search} onSearchChange={setSearch} filterValue={status} onFilterChange={setStatus} filterLabel="Tous statuts" filterOptions={['all', 'Payé', 'En attente']}>
        <div className="grid gap-4">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{payment.invoice}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{payment.customer} • {payment.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-700">{payment.amount} TND</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-700">{payment.status}</span>
                  <button type="button" onClick={() => setToast({ type: 'success', message: 'Facture ouverte en aperçu.' })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiFileText size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ManagementPageLayout>
    </div>
  );
};

export default PaiementsPage;

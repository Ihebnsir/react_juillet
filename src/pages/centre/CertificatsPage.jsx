import React, { useEffect, useMemo, useState } from 'react';
import { FiAward, FiDownload, FiEye, FiSend, FiArchive } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { ModalShell } from '../../components/UI/ModalShell';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { mockCertificates } from '../../data/mockCertificates';

const STORAGE_KEY = 'skillbridge_certificates';

const readStoredCertificates = () => {
  if (typeof window === 'undefined') return mockCertificates;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockCertificates;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : mockCertificates;
  } catch {
    return mockCertificates;
  }
};

const CertificatePreviewModal = ({ open, item, onClose }) => {
  if (!open || !item) return null;

  return (
    <ModalShell open={open} title="Aperçu certificat" subtitle="Prévisualisation statique." onClose={onClose} footer={<button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm">Fermer</button>}>
      <div className="rounded-[24px] border border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-brand-300">SkillBridge</div>
            <h3 className="mt-1 text-2xl font-semibold">Certificate of Completion</h3>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm">{item.status}</div>
        </div>
        <div className="mt-8 space-y-2 text-sm text-slate-200">
          <div>Apprenant : {item.trainee}</div>
          <div>Formation : {item.formation}</div>
          <div>Date d’émission : {item.issuedAt}</div>
        </div>
      </div>
    </ModalShell>
  );
};

export const CertificatsPage = () => {
  const [certificates, setCertificates] = useState(readStoredCertificates);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates)), [certificates]);

  const filteredCertificates = useMemo(() => certificates.filter((item) => [item.trainee, item.formation, item.status].join(' ').toLowerCase().includes(search.toLowerCase())), [certificates, search]);

  const updateStatus = (id, nextStatus) => {
    setCertificates((prev) => prev.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
    setToast({ type: 'success', message: `Certificat ${nextStatus.toLowerCase()}.` });
  };

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <ManagementPageLayout title="Certificats" description="Génération, historique et suivi des attestations de stage." searchValue={search} onSearchChange={setSearch} emptyState={filteredCertificates.length === 0 ? <EmptyStateCard icon={FiAward} title="Aucun certificat" description="Les certificats générés apparaîtront ici." primaryLabel="Ajouter" onPrimary={() => setToast({ type: 'success', message: 'Aucun certificat à générer.' })} /> : null}>
        <div className="grid gap-4">
          {filteredCertificates.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.trainee}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.formation} • {item.issuedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPreview(item)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye size={16} /></button>
                  <button type="button" onClick={() => setToast({ type: 'success', message: 'Téléchargement simulé.' })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiDownload size={16} /></button>
                  <button type="button" onClick={() => setToast({ type: 'success', message: 'Envoi simulé au destinataire.' })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiSend size={16} /></button>
                  <button type="button" onClick={() => updateStatus(item.id, 'Archivé')} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiArchive size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ManagementPageLayout>
      <CertificatePreviewModal open={Boolean(preview)} item={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

export default CertificatsPage;

import React, { useEffect, useMemo, useState } from 'react';
import { FiFileText, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { mockDocuments } from '../../data/mockDocuments';
import { useAuth } from '../../context/AuthContext';
import { useTrash } from '../../context/TrashContext';
import { useActivityLog } from '../../context/ActivityContext';

const STORAGE_KEY = 'skillbridge_documents';

const readStoredDocuments = () => {
  if (typeof window === 'undefined') return mockDocuments;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockDocuments;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : mockDocuments;
  } catch {
    return mockDocuments;
  }
};

export const DocumentsPage = () => {
  const { user } = useAuth();
  const { softDelete } = useTrash();
  const { recordActivity } = useActivityLog();
  const [documents, setDocuments] = useState(readStoredDocuments);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents)), [documents]);

  const filteredDocuments = useMemo(() => documents.filter((document) => [document.name, document.type].join(' ').toLowerCase().includes(search.toLowerCase())), [documents, search]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const newDoc = { id: `doc-${Date.now()}`, name: file.name, type: 'Upload', updatedAt: new Date().toISOString().slice(0, 10) };
    setDocuments((prev) => [newDoc, ...prev]);
    recordActivity({
      user: user?.name || 'Système',
      action: 'Document ajouté',
      type: 'system',
      details: `${newDoc.name} ajouté à la bibliothèque documentaire.`,
    });
    setToast({ type: 'success', message: 'Document ajouté.' });
  };

  const handleRemove = (documentId) => {
    const docToRemove = documents.find((document) => document.id === documentId);
    if (!docToRemove) return;
    setDocuments((prev) => prev.filter((document) => document.id !== documentId));
    softDelete({
      type: 'document',
      item: docToRemove,
      deletedBy: user?.name || 'Système',
    });
    recordActivity({
      user: user?.name || 'Système',
      action: 'Document supprimé',
      type: 'system',
      details: `${docToRemove.name} déplacé vers la corbeille.`,
    });
    setToast({ type: 'success', message: 'Document déplacé vers la corbeille.' });
  };

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <div className="rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Documents</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">RNE, numéro fiscal, contrats et accréditations centralisés.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            <FiUploadCloud size={16} /> Ajouter un document
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      <ManagementPageLayout title="Bibliothèque" description="Centralisez les documents de votre centre." searchValue={search} onSearchChange={setSearch}>
        <div className="grid gap-4">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-700"><FiFileText size={18} /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{document.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{document.type} • {document.updatedAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setToast({ type: 'success', message: 'Document ouvert.' })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">Ouvrir</button>
                  <button type="button" onClick={() => handleRemove(document.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ManagementPageLayout>
    </div>
  );
};

export default DocumentsPage;

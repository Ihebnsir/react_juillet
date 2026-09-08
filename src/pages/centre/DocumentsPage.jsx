import React, { useCallback, useEffect, useState } from 'react';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { centreDocumentsService } from '../../services/centreDocumentsService';
import { useNotifications } from '../../context/NotificationContext';
import { CENTRE_DOCUMENT_STATUS_CLASSES, CENTRE_DOCUMENT_STATUS_LABELS, CENTRE_DOCUMENT_STATUSES, isSafeExternalUrl } from '../../utils/centreDocumentStatus';

const messageOf = (error) => {
  if (error?.status === 401) return 'Session expiree.';
  if (error?.status === 403) return 'Acces refuse.';
  if (error?.status === 404) return 'Document ou centre introuvable.';
  if (error?.status === 409) return 'Cette action est incompatible avec le statut actuel.';
  if (error?.message === 'NETWORK_ERROR') return 'Service indisponible.';
  return error?.message || 'Une erreur est survenue.';
};

export const DocumentsPage = () => {
  const { refresh } = useNotifications();
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [resubmitId, setResubmitId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await centreDocumentsService.getMine({ page: 1, limit: 10, status });
      setDocuments(result.data || []);
    } catch (requestError) {
      setDocuments([]);
      setError(messageOf(requestError));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    setNotice('');
    if (!type.trim() || !isSafeExternalUrl(fileUrl)) {
      setFormError('Renseignez un type et une URL HTTP/HTTPS valide de 500 caracteres maximum.');
      return;
    }
    try {
      if (resubmitId) await centreDocumentsService.remove(resubmitId);
      await centreDocumentsService.create({ type: type.trim(), fileUrl });
      setType('');
      setFileUrl('');
      setResubmitId('');
      setNotice('Document soumis.');
      await load();
      await refresh();
    } catch (requestError) {
      setFormError(messageOf(requestError));
    }
  };

  const remove = async (id) => {
    setError('');
    try {
      await centreDocumentsService.remove(id);
      setNotice('Document supprime.');
      await load();
    } catch (requestError) {
      setError(messageOf(requestError));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Documents du centre</h1>
        <p className="mt-1 text-sm text-slate-500">Les documents sont references par une URL externe HTTP/HTTPS. Aucun fichier n'est televerse sur SkillBridge.</p>
      </header>
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Soumettre un document</h2>
        {formError ? <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formError}</p> : null}
        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input aria-label="Type" value={type} onChange={(event) => setType(event.target.value)} placeholder="Type de document" className="rounded-lg border p-3" />
          <input aria-label="URL externe" value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} placeholder="https://exemple.tld/document" className="rounded-lg border p-3" />
          <button className="rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white">Soumettre</button>
        </form>
      </section>
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Mes documents</h2>
          <select aria-label="Statut" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border p-2">
            <option value="">Tous les statuts</option>
            {CENTRE_DOCUMENT_STATUSES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>
        {notice ? <p role="status" className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p> : null}
        {loading ? <p className="mt-5 text-sm text-slate-500">Chargement...</p> : null}
        {error ? <p role="alert" className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></p> : null}
        {!loading && !error && documents.length === 0 ? <p className="mt-5 text-sm text-slate-500">Aucun document.</p> : null}
        <div className="mt-4 space-y-3">
          {documents.map((document) => (
            <article key={document.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{document.type}</p>
                  {isSafeExternalUrl(document.fileUrl) ? <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600">URL externe <FiExternalLink size={13} /></a> : <p className="mt-1 text-sm text-slate-500">URL externe indisponible</p>}
                  <p className="mt-1 text-xs text-slate-500">{document.createdAt || document.date || '-'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${CENTRE_DOCUMENT_STATUS_CLASSES[document.status] || ''}`}>{CENTRE_DOCUMENT_STATUS_LABELS[document.status] || document.status}</span>
                  {document.status === 'refuse' ? <button type="button" onClick={() => { setFileUrl(''); setType(document.type || ''); setResubmitId(document.id); }} className="rounded-lg border px-2 py-1 text-xs">Resoumettre</button> : null}
                  <button type="button" onClick={() => remove(document.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600" aria-label="Supprimer"><FiTrash2 size={15} /></button>
                </div>
              </div>
              {document.commentaireAdmin ? <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">Motif admin: {document.commentaireAdmin}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DocumentsPage;

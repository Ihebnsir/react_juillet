import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { litigesService } from '../services/litigesService';
import { LITIGE_NEXT_STATUSES, LITIGE_STATUS_CLASSES, LITIGE_STATUS_LABELS } from '../utils/litigeStatus';

const errorMessage = (error) => {
  if (error?.status === 401) return 'Votre session a expiré.';
  if (error?.status === 403) return 'Vous n’êtes pas autorisé à consulter ce dossier.';
  if (error?.status === 404) return 'Litige introuvable.';
  return error?.message === 'NETWORK_ERROR' ? 'Service indisponible.' : (error?.message || 'Une erreur est survenue.');
};
const listOf = (result) => result?.data || result?.items || [];
const labelOf = (value) => value?.nom || value?.name || value?.titre || value?.title || value?.email || value || '-';

const LitigeDetail = ({ item, admin, onClose, onRefresh }) => {
  const [detail, setDetail] = useState(item);
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState('');
  const [responsableId, setResponsableId] = useState('');
  const [attachment, setAttachment] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const update = async (operation, success) => {
    setError(''); setNotice('');
    try { setDetail(await operation()); setNotice(success); onRefresh(); } catch (requestError) { setError(errorMessage(requestError)); }
  };
  const conversation = detail.conversation || [];
  const pieces = detail.piecesJointes || detail.attachments || [];
  const notes = admin ? (detail.notesInternes || []) : [];
  return <section role="dialog" aria-label="Détail du litige" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4"><div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
    <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-slate-500">{detail.numeroDossier || detail.reference || detail.id}</p><h2 className="mt-1 text-2xl font-semibold">{detail.titre || '-'}</h2></div><button type="button" onClick={onClose} aria-label="Fermer" className="text-2xl">×</button></div>
    {error ? <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}{notice ? <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p> : null}
    <div className="mt-5 grid gap-3 sm:grid-cols-2"><p><b>Statut:</b> <span className={`rounded-full px-2 py-1 text-xs ${LITIGE_STATUS_CLASSES[detail.statut] || ''}`}>{LITIGE_STATUS_LABELS[detail.statut] || detail.statut || '-'}</span></p><p><b>Catégorie:</b> {detail.categorie || '-'}</p><p><b>Priorité:</b> {detail.priorite || '-'}</p><p><b>Centre:</b> {labelOf(detail.centre)}</p><p><b>Formation:</b> {labelOf(detail.formation)}</p><p><b>Ouvert le:</b> {detail.dateOuverture || detail.createdAt || '-'}</p></div>
    <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{detail.description || '-'}</p>
    {admin ? <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm">Prochain statut<select value="" onChange={(event) => update(() => litigesService.updateStatus(detail.id, { statut: event.target.value }), 'Statut mis à jour.')} className="mt-1 w-full rounded-lg border p-2"><option value="">Sélectionner</option>{(LITIGE_NEXT_STATUSES[detail.statut] || []).map((status) => <option key={status}>{status}</option>)}</select></label><label className="text-sm">ID responsable admin<input value={responsableId} onChange={(event) => setResponsableId(event.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label><label className="text-sm">Décision finale<textarea value={decision} onChange={(event) => setDecision(event.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label><button type="button" disabled={!responsableId.trim()} onClick={() => update(() => litigesService.assign(detail.id, { responsableId: responsableId.trim() }), 'Litige assigné.')} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Assigner</button><button type="button" disabled={!decision.trim()} onClick={() => update(() => litigesService.close(detail.id, { decisionFinale: decision }), 'Litige clôturé.')} className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white disabled:opacity-50">Clôturer</button><button type="button" onClick={() => update(() => litigesService.archive(detail.id), 'Litige archivé.')} className="rounded-lg border px-3 py-2 text-sm">Archiver</button></div> : null}
    <div className="mt-6"><h3 className="font-semibold">Conversation</h3><div className="mt-3 space-y-2">{conversation.map((entry, index) => <div key={entry.id || index} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800"><b>{labelOf(entry.auteur || entry.sender || entry.senderRole)}:</b> {entry.contenu || entry.message || entry.text || '-'}</div>)}{conversation.length === 0 ? <p className="text-sm text-slate-500">Aucun message.</p> : null}</div><div className="mt-3 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message" className="min-w-0 flex-1 rounded-lg border p-2" /><button type="button" disabled={!message.trim()} onClick={() => update(() => litigesService.addMessage(detail.id, { message: message.trim() }).then((result) => { setMessage(''); return result; }), 'Message envoyé.')} className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white disabled:opacity-50">Envoyer</button></div></div>
    <div className="mt-6"><h3 className="font-semibold">Pièces jointes</h3>{pieces.map((piece, index) => <p key={piece.id || index} className="mt-2 text-sm">{piece.nom || piece.name || piece.filename || '-'}{piece.type ? ` · ${piece.type}` : ''}</p>)}{pieces.length === 0 ? <p className="mt-2 text-sm text-slate-500">Aucune pièce jointe.</p> : null}<div className="mt-3 flex gap-2"><input value={attachment} onChange={(event) => setAttachment(event.target.value)} placeholder="URL HTTPS du document" className="min-w-0 flex-1 rounded-lg border p-2" /><button type="button" disabled={!attachment.trim()} onClick={() => update(() => litigesService.addAttachmentMetadata(detail.id, { nom: attachment.split('/').pop() || 'document', type: 'application/pdf', url: attachment.trim() }).then((result) => { setAttachment(''); return result; }), 'Pièce jointe ajoutée.')} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Ajouter</button></div></div>
    {admin ? <div className="mt-6"><h3 className="font-semibold">Notes internes</h3>{notes.map((entry, index) => <p key={entry.id || index} className="mt-2 text-sm">{entry.contenu || entry.content || '-'}</p>)}<div className="mt-3 flex gap-2"><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note interne" className="min-w-0 flex-1 rounded-lg border p-2" /><button type="button" disabled={!note.trim()} onClick={() => update(() => litigesService.addNote(detail.id, { contenu: note }).then((result) => { setNote(''); return result; }), 'Note interne ajoutée.')} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Ajouter note</button></div></div> : null}
  </div></section>;
};

export const LitigesPage = () => {
  const { user } = useAuth();
  const admin = user?.role === 'admin';
  const [items, setItems] = useState([]); const [selected, setSelected] = useState(null); const [filters, setFilters] = useState({ statut: '', priorite: '', categorie: '' }); const [page, setPage] = useState(1); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setItems(listOf(await (admin ? litigesService.getAll({ page, limit: 10, ...filters }) : litigesService.getMine({ page, limit: 10 })))); } catch (requestError) { setError(errorMessage(requestError)); } finally { setLoading(false); } }, [admin, filters, page]);
  useEffect(() => { load(); }, [load]);
  const open = async (item) => { try { setSelected(await litigesService.getById(item.id)); } catch (requestError) { setError(errorMessage(requestError)); } };
  return <div className="mx-auto max-w-7xl space-y-6"><header><p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Résolution</p><h1 className="mt-2 text-3xl font-bold">Litiges</h1><p className="mt-2 text-slate-500">Données issues du service Litige backend.</p></header>{admin ? <div className="grid gap-3 md:grid-cols-3">{['statut', 'priorite', 'categorie'].map((key) => <input key={key} aria-label={key} value={filters[key]} onChange={(event) => { setPage(1); setFilters({ ...filters, [key]: event.target.value }); }} placeholder={key} className="rounded-lg border p-2" />)}</div> : null}{loading ? <p>Chargement…</p> : null}{error ? <div role="alert" className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></div> : null}{!loading && !error && items.length === 0 ? <p className="rounded-lg border p-6 text-sm text-slate-500">Aucun litige.</p> : null}<div className="grid gap-4">{items.map((item) => <article key={item.id} className="rounded-xl border p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs text-slate-500">{item.numeroDossier || item.reference || item.id}</p><h2 className="font-semibold">{item.titre || '-'}</h2></div><span className={`rounded-full px-2 py-1 text-xs ${LITIGE_STATUS_CLASSES[item.statut] || ''}`}>{LITIGE_STATUS_LABELS[item.statut] || item.statut || '-'}</span></div><p className="mt-2 text-sm text-slate-600">{item.description || '-'}</p><button type="button" onClick={() => open(item)} className="mt-4 rounded-lg bg-brand-600 px-3 py-2 text-sm text-white">Voir détail</button></article>)}</div><div className="flex justify-between"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Précédent</button><span>Page {page}</span><button type="button" disabled={items.length < 10} onClick={() => setPage((value) => value + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Suivant</button></div>{selected ? <LitigeDetail item={selected} admin={admin} onClose={() => setSelected(null)} onRefresh={load} /> : null}</div>;
};

export default LitigesPage;

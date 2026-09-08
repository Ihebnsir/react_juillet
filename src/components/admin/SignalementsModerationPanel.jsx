import React, { useCallback, useEffect, useState } from 'react';
import { signalementsService } from '../../services/signalementsService';
import { SIGNALEMENT_STATUSES, getSignalementStatusClass } from '../../utils/signalementStatus';

const TYPES = ['', 'Contenu inapproprié', 'Fausse information', 'Spam', 'Harcelement', 'Problème technique'];
const PAGE_SIZE = 10;
const itemsOf = (result) => result?.data || result?.items || [];
const messageOf = (error) => error?.message === 'NETWORK_ERROR' ? 'Service indisponible.' : (error?.message || 'Action impossible.');

export const SignalementsModerationPanel = () => {
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setReports(itemsOf(await signalementsService.getAdminList({ page, limit: PAGE_SIZE, ...filters }))); } catch (requestError) { setError(messageOf(requestError)); } finally { setLoading(false); }
  }, [filters, page]);
  useEffect(() => { load(); }, [load]);

  const act = async (callback, successMessage) => {
    setError(''); setNotice('');
    try { const result = await callback(); setNotice(result?.litige?.numeroDossier ? `${successMessage} Dossier lié: ${result.litige.numeroDossier}.` : successMessage); setSelected(null); await load(); } catch (requestError) { setError(messageOf(requestError)); }
  };

  return <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-brand-600">API Signalements</p><h2 className="mt-1 text-2xl font-semibold">Signalements à traiter</h2></div><button type="button" onClick={load} className="text-sm font-semibold text-brand-600">Actualiser</button></div>
    <div className="mt-5 grid gap-3 md:grid-cols-2"><select aria-label="Filtrer par type" value={filters.type} onChange={(event) => { setPage(1); setFilters({ ...filters, type: event.target.value }); }} className="rounded-xl border border-slate-200 p-3"><option value="">Tous les types</option>{TYPES.slice(1).map((type) => <option key={type}>{type}</option>)}</select><select aria-label="Filtrer par statut" value={filters.status} onChange={(event) => { setPage(1); setFilters({ ...filters, status: event.target.value }); }} className="rounded-xl border border-slate-200 p-3"><option value="">Tous les statuts</option>{SIGNALEMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
    {notice ? <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p> : null}{error ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
    {loading ? <p className="mt-6 text-sm text-slate-500">Chargement…</p> : null}{!loading && !error && reports.length === 0 ? <p className="mt-6 text-sm text-slate-500">Aucun signalement.</p> : null}
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="p-3">Type</th><th className="p-3">Contenu</th><th className="p-3">Statut</th><th className="p-3">Date</th><th className="p-3">Actions</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id} className="border-b border-slate-100"><td className="p-3 font-semibold">{report.type}</td><td className="max-w-xs truncate p-3">{report.contenu}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${getSignalementStatusClass(report.status)}`}>{report.status}</span></td><td className="p-3">{report.createdAt ? new Date(report.createdAt).toLocaleDateString('fr-FR') : '-'}</td><td className="p-3"><button type="button" onClick={async () => { try { setSelected(await signalementsService.getById(report.id)); } catch (requestError) { setError(messageOf(requestError)); } }} className="font-semibold text-brand-600">Voir détail</button></td></tr>)}</tbody></table></div>
    <div className="mt-5 flex items-center justify-between"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Précédent</button><span className="text-sm text-slate-500">Page {page}</span><button type="button" disabled={reports.length < PAGE_SIZE} onClick={() => setPage((value) => value + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Suivant</button></div>
    {selected ? <div role="dialog" aria-label="Détail du signalement" className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold">{selected.type}</h3><p className="mt-2 text-sm">{selected.contenu}</p><p className="mt-2 text-xs text-slate-500">Cible: {selected.cibleType || 'autre'} {selected.cibleId || ''}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Fermer">×</button></div><div className="mt-4 flex flex-wrap gap-2">{selected.status !== 'Résolu' ? SIGNALEMENT_STATUSES.filter((status) => status !== selected.status && (selected.status === 'En attente' || status === 'Résolu')).map((status) => <button key={status} type="button" onClick={() => act(() => signalementsService.updateStatus(selected.id, { status, ...(status === 'Résolu' ? { resolutionNote: window.prompt('Note de résolution (optionnelle)') || undefined } : {}) }), `Statut mis à jour: ${status}`)} className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">{status}</button>) : null}<button type="button" onClick={() => act(() => signalementsService.escalate(selected.id, {}), 'Signalement escaladé vers Litige.')} className="rounded-lg border px-3 py-2 text-sm font-semibold">Escalader</button><button type="button" onClick={() => act(() => signalementsService.remove(selected.id), 'Signalement supprimé.')} className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">Supprimer</button></div></div> : null}
  </section>;
};

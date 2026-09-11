import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAward } from 'react-icons/fi';
import { certificationsService } from '../../services/certificationsService';

const statusLabels = { emise: 'Émise', revoquee: 'Révoquée' };
const messageOf = (error) => error?.status === 401 ? 'Session expirée.' : error?.status === 403 ? 'Accès refusé.' : error?.status === 404 ? 'Certificat introuvable.' : error?.status === 400 ? 'Identifiant invalide.' : error?.message === 'NETWORK_ERROR' ? 'Service indisponible.' : error?.message || 'Impossible de charger les certifications.';

export const MesCertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const result = await certificationsService.getMine({ page, limit: 10, status }); setCertifications(result.data || []); }
    catch (requestError) { setCertifications([]); setError(messageOf(requestError)); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><FiAward className="text-amber-600" /><div><h1 className="text-2xl font-semibold">Mes certifications</h1><p className="mt-1 text-sm text-slate-500">Données issues de votre compte.</p></div></div><select aria-label="Statut" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className="rounded-lg border p-2"><option value="">Tous les statuts</option><option value="emise">Émise</option><option value="revoquee">Révoquée</option></select></div>
      {loading ? <p className="mt-6 text-sm text-slate-500">Chargement...</p> : null}
      {error ? <p role="alert" className="mt-6 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></p> : null}
      {!loading && !error && certifications.length === 0 ? <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">Aucune certification disponible.</p> : null}
      <div className="mt-6 space-y-4">{certifications.map((certificate) => <article key={certificate.id} className="rounded-2xl border p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-brand-500">{certificate.certificateNumber || certificate.id}</p><h2 className="mt-1 text-xl font-semibold">{certificate.formation || 'Formation'}</h2><p className="mt-1 text-sm text-slate-500">Centre: {certificate.centre || '—'}</p><p className="mt-1 text-sm text-slate-500">Émise le: {certificate.date || '—'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{statusLabels[certificate.status] || certificate.status || '—'}</span></div><Link to={`/certifications/${certificate.id}`} className="mt-4 inline-block rounded-lg border px-3 py-2 text-sm">Voir le détail et télécharger le PDF</Link></article>)}</div>
      <div className="mt-6 flex justify-between"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border px-3 py-2 text-sm">Précédent</button><span className="text-sm text-slate-500">Page {page}</span><button type="button" disabled={certifications.length < 10} onClick={() => setPage((current) => current + 1)} className="rounded-lg border px-3 py-2 text-sm">Suivant</button></div>
    </div>
  );
};

export default MesCertificationsPage;
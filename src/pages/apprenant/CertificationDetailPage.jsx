import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { certificationsService } from '../../services/certificationsService';

const messageOf = (error) => error?.status === 401 ? 'Session expirée.' : error?.status === 403 ? 'Vous ne pouvez pas consulter ce certificat.' : error?.status === 404 ? 'Certificat introuvable.' : error?.status === 400 ? 'Identifiant invalide.' : error?.message === 'NETWORK_ERROR' ? 'Service indisponible.' : error?.message || 'Erreur de chargement.';
export const CertificationDetailPage = () => {
  const { id } = useParams(); const [certificate, setCertificate] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setCertificate(await certificationsService.getById(id)); } catch (requestError) { setError(messageOf(requestError)); } finally { setLoading(false); } }, [id]);
  useEffect(() => { load(); }, [load]);
  if (loading) return <p>Chargement...</p>;
  if (error) return <div role="alert" className="rounded-lg bg-rose-50 p-4 text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></div>;
  return <article className="card p-6"><p className="text-xs uppercase text-brand-500">{certificate.certificateNumber || certificate.id}</p><h1 className="mt-2 text-2xl font-semibold">{certificate.formation || 'Formation'}</h1><dl className="mt-5 space-y-2 text-sm"><div><dt className="font-semibold">Statut</dt><dd>{certificate.status || '—'}</dd></div><div><dt className="font-semibold">Centre</dt><dd>{certificate.centre || '—'}</dd></div><div><dt className="font-semibold">Date d’émission</dt><dd>{certificate.date || '—'}</dd></div></dl><p className="mt-6 text-sm text-slate-500">Aucun téléchargement PDF n’est fourni par le backend actuel.</p></article>;
};
export default CertificationDetailPage;

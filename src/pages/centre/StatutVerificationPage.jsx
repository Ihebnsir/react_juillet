import React, { useCallback, useEffect, useState } from 'react';
import { centresService } from '../../services/centresService';

const labels = { non_soumis: 'Non soumis', en_attente: 'En attente', verifie: 'Vérifié', rejete: 'Rejeté', suspendu: 'Suspendu' };

export const StatutVerificationPage = () => {
  const [centre, setCentre] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setCentre(await centresService.getMyCentre()); } catch (requestError) { setError(requestError?.status === 401 ? 'Session expirée.' : requestError?.status === 404 ? 'Centre introuvable.' : requestError?.message || 'Impossible de charger le statut.'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <p>Chargement...</p>;
  if (error) return <div role="alert" className="rounded-lg bg-rose-50 p-4 text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></div>;
  return <section className="card p-6"><h1 className="text-xl font-semibold">Statut de vérification</h1><p className="mt-2 text-sm text-slate-500">{centre?.name || centre?.email || 'Centre'}</p><div className="mt-5 rounded-lg border p-4"><p className="text-sm text-slate-500">Statut du centre</p><p className="mt-1 text-lg font-semibold">{labels[centre?.statutVerification] || centre?.statutVerification || 'Non renseigné'}</p>{centre?.verifie !== undefined ? <p className="mt-2 text-sm">Vérifié: {centre.verifie ? 'Oui' : 'Non'}</p> : null}{centre?.motifRejet ? <p className="mt-2 text-sm text-rose-700">Motif: {centre.motifRejet}</p> : null}</div><p className="mt-5 text-sm text-slate-500">La validation des documents et le statut de vérification du centre sont deux workflows distincts.</p></section>;
};

export default StatutVerificationPage;

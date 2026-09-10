import React, { useCallback, useEffect, useState } from 'react';
import { sessionsService } from '../../services/sessionsService';

export const SessionsPage = () => {
  const [sessions, setSessions] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const result = await sessionsService.list({ page: 1, limit: 100 }); setSessions(result.data || []); } catch (requestError) { setSessions([]); setError(requestError?.status === 401 ? 'Session expirée.' : requestError?.status === 403 ? 'Accès refusé.' : requestError?.message || 'Impossible de charger les sessions.'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <p className="rounded-xl bg-slate-100 p-5 text-sm text-slate-500">Chargement...</p>;
  return <div className="space-y-6"><header><h1 className="text-2xl font-semibold">Mes sessions</h1><p className="mt-1 text-sm text-slate-500">Sessions de vos formations confirmées ou terminées.</p></header>{error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></p> : null}{sessions.length === 0 ? <p className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">Aucune session disponible.</p> : <div className="grid gap-4">{sessions.map((session) => <article key={session.id} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"><h2 className="font-semibold">{session.title}</h2><p className="mt-1 text-sm text-slate-500">{session.formationTitle || 'Formation'}</p><p className="mt-3 text-sm">{session.date ? new Date(session.date).toLocaleDateString('fr-FR') : 'Date indisponible'} {session.startTime || ''}{session.endTime ? ` → ${session.endTime}` : ''}</p><p className="mt-1 text-sm text-slate-500">{session.location || 'Lieu non renseigné'}</p></article>)}</div>}</div>;
};
export default SessionsPage;

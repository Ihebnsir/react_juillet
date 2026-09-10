import React, { useCallback, useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';

const Metric = ({ label, value }) => <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value ?? 'Donnée indisponible'}</p></div>;
const firstValue = (payload, keys) => { for (const key of keys) if (payload && payload[key] !== undefined && payload[key] !== null) return payload[key]; return null; };
const numericValue = (value) => {
  if (typeof value === 'number') return value;
  if (Array.isArray(value)) return value.reduce((total, item) => total + Number(item?.total || 0), 0);
  return null;
};

export const StatisticsPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [overview, reservations, revenue, formations] = await Promise.all([
        analyticsService.centreOverview(), analyticsService.centreReservations(), analyticsService.centreRevenue(), analyticsService.centreFormations(),
      ]);
      setData({ overview, reservations, revenue, formations });
    } catch (requestError) { setData({}); setError(requestError?.status === 401 ? 'Session expirée.' : requestError?.status === 403 ? 'Accès refusé.' : requestError?.message || 'Impossible de charger les analytics.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <p className="rounded-xl bg-slate-100 p-5 text-sm text-slate-500">Chargement...</p>;
  if (error) return <p role="alert" className="rounded-xl bg-rose-50 p-5 text-sm text-rose-700">{error} <button type="button" onClick={load} className="ml-2 underline">Réessayer</button></p>;
  const overview = data.overview || {};
  return <div className="space-y-6"><header><h1 className="text-2xl font-semibold">Statistiques</h1><p className="mt-1 text-sm text-slate-500">Données analytics fournies par le backend du centre.</p></header><div className="grid gap-4 md:grid-cols-4"><Metric label="Formations" value={firstValue(overview, ['formations', 'totalFormations'])} /><Metric label="Réservations" value={firstValue(overview, ['reservations', 'totalReservations'])} /><Metric label="Apprenants" value={firstValue(overview, ['uniqueLearners', 'learners', 'totalLearners', 'students'])} /><Metric label="Revenus" value={numericValue(firstValue(data.revenue, ['revenue', 'totalRevenue', 'amount']))} /></div><section className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"><h2 className="font-semibold">Données détaillées</h2><p className="mt-2 text-sm text-slate-500">Les visualisations sont affichées uniquement lorsqu’une série est retournée par l’API.</p><pre className="mt-4 overflow-auto rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-900">{JSON.stringify({ reservations: data.reservations, formations: data.formations }, null, 2)}</pre></section></div>;
};

export default StatisticsPage;

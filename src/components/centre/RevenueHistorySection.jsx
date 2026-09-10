import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { analyticsService } from '../../services/analyticsService';

const monthLabel = (month, year) => new Date(year, month - 1, 1).toLocaleDateString('fr-TN', { month: 'short', year: 'numeric' });

const normalizeRevenue = (payload) => (Array.isArray(payload?.byMonth) ? payload.byMonth : [])
  .filter((row) => row?._id?.month && row?._id?.year)
  .map((row) => ({ label: monthLabel(row._id.month, row._id.year), revenue: Number(row.total || 0), month: row._id.month, year: row._id.year }));

const RevenueHistorySection = () => {
  const [period, setPeriod] = useState('month');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    analyticsService.centreRevenue()
      .then((payload) => { if (mounted) setRows(normalizeRevenue(payload)); })
      .catch((requestError) => { if (mounted) setError(requestError?.message || 'Données de revenus indisponibles.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const data = useMemo(() => {
    if (period === 'month') return rows;
    const grouped = new Map();
    rows.forEach((row) => {
      const key = period === 'year' ? String(row.year) : `${row.year}-T${Math.ceil(row.month / 3)}`;
      const current = grouped.get(key) || { label: key, revenue: 0 };
      grouped.set(key, { ...current, revenue: current.revenue + row.revenue });
    });
    return Array.from(grouped.values());
  }, [period, rows]);

  const currentRevenue = data.at(-1)?.revenue;
  const previousRevenue = data.at(-2)?.revenue;
  const delta = previousRevenue ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100) : null;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Historique des revenus</h3><p className="text-sm text-slate-500 dark:text-slate-400">Données de revenus payés fournies par le backend.</p></div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-700">{['month', 'quarter', 'year'].map((option) => <button key={option} type="button" onClick={() => setPeriod(option)} className={`rounded-lg px-3 py-1.5 text-sm ${period === option ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-300'}`}>{option === 'month' ? 'Mois' : option === 'quarter' ? 'Trimestre' : 'Année'}</button>)}</div>
      </div>
      {loading ? <p className="mt-5 text-sm text-slate-500">Chargement...</p> : null}
      {error ? <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {!loading && !error && data.length === 0 ? <p className="mt-5 rounded-xl border border-dashed p-6 text-sm text-slate-500">Aucune donnée de revenu disponible.</p> : null}
      {!loading && !error && data.length > 0 ? <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500 dark:text-slate-400">Revenu actuel</p><p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{currentRevenue.toLocaleString('fr-TN')} TND</p></div><div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-300"><FiTrendingUp size={18} /></div></div><div className="mt-4 flex gap-3">{data.map((item) => <div key={item.label} className="flex-1 rounded-xl bg-white p-3 text-center shadow-sm dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div><div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.revenue.toLocaleString('fr-TN')}</div></div>)}</div></div><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60"><div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiCalendar size={16} />Variance vs période précédente</div><div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{delta === null ? 'Donnée indisponible' : `${delta > 0 ? '+' : ''}${delta}%`}</div><div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">Variation calculée uniquement à partir des revenus retournés par l'API.</div></div></div> : null}
    </section>
  );
};

export default RevenueHistorySection;

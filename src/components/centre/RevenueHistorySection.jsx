import React, { useMemo, useState } from 'react';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { mockRevenueHistory } from '../../data/mockRevenueHistory';

const RevenueHistorySection = () => {
  const [period, setPeriod] = useState('month');

  const data = useMemo(() => {
    if (period === 'quarter') {
      return [
        { label: 'T1', revenue: 16200 },
        { label: 'T2', revenue: 21400 },
        { label: 'T3', revenue: 18800 },
      ];
    }
    if (period === 'year') {
      return [
        { label: '2024', revenue: 69200 },
        { label: '2025', revenue: 84100 },
        { label: '2026', revenue: 91200 },
      ];
    }
    return mockRevenueHistory;
  }, [period]);

  const currentRevenue = data[data.length - 1]?.revenue ?? 0;
  const previousRevenue = data[data.length - 2]?.revenue ?? currentRevenue;
  const delta = previousRevenue ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100) : 0;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Historique des revenus</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Suivi mensuel des performances commerciales</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
          {['month', 'quarter', 'year'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={`rounded-lg px-3 py-1.5 text-sm ${period === option ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-300'}`}
            >
              {option === 'month' ? 'Mois' : option === 'quarter' ? 'Trimestre' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Revenu actuel</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{currentRevenue.toLocaleString('fr-TN')} TND</p>
            </div>
            <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-300">
              <FiTrendingUp size={18} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {data.map((item) => (
              <div key={item.label} className="flex-1 rounded-xl bg-white p-3 text-center shadow-sm dark:bg-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.revenue.toLocaleString('fr-TN')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FiCalendar size={16} />
            Variance vs période précédente
          </div>
          <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{delta > 0 ? '+' : ''}{delta}%</div>
          <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Performance supérieure à la cible sur la période sélectionnée.
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueHistorySection;

import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FiBarChart2, FiDownload, FiFilter, FiTrendingUp } from 'react-icons/fi';
import { DataChart } from '../../components/dashboard/DataChart';
import { mockRevenueHistory } from '../../data/mockRevenueHistory';
import { mockSessions } from '../../data/mockSessions';
import { mockPartnerCompanies } from '../../data/mockPartnerCompanies';

const COLORS = ['#0EA5E9', '#34D399', '#F59E0B', '#8B5CF6'];

const coursePopularity = [
  { name: 'React', value: 28 },
  { name: 'Python', value: 22 },
  { name: 'UI/UX', value: 18 },
  { name: 'Agile', value: 16 },
];

const trainerPerformance = [
  { name: 'Sonia', score: 92 },
  { name: 'Yassine', score: 88 },
  { name: 'Mouna', score: 84 },
  { name: 'Khaled', score: 80 },
];

const exportCsv = () => {
  const rows = [
    ['Mois', 'Réservations', 'Étudiants', 'Revenu'],
    ...mockRevenueHistory.map((item, index) => [item.label, 10 + index * 2, 6 + index, item.revenue]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'rapport-statistiques-centre.csv';
  anchor.click();
  window.URL.revokeObjectURL(url);
};

export const StatisticsPage = () => {
  const [period, setPeriod] = useState('month');

  const metrics = useMemo(() => {
    const currentRevenue = mockRevenueHistory[mockRevenueHistory.length - 1]?.revenue ?? 0;
    const revenueGrowth = 12.4;
    const reservationEvolution = 18.3;
    const growth = 9.8;
    const attendance = 87;
    const completion = 76;

    return {
      reservationEvolution,
      growth,
      attendance,
      completion,
      revenueGrowth,
      currentRevenue,
    };
  }, []);

  const monthlySeries = [
    { name: 'Jan', value: 18 },
    { name: 'Fév', value: 24 },
    { name: 'Mar', value: 21 },
    { name: 'Avr', value: 28 },
    { name: 'Mai', value: 33 },
    { name: 'Jui', value: 36 },
  ];

  const yearlySeries = [
    { name: '2024', value: 142 },
    { name: '2025', value: 186 },
    { name: '2026', value: 224 },
  ];

  const activeData = period === 'year' ? yearlySeries : monthlySeries;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Statistiques</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Analytics du centre, performance commerciale et suivi d’activité.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
              {['month', 'year'].map((option) => (
                <button key={option} type="button" onClick={() => setPeriod(option)} className={`rounded-lg px-3 py-1.5 text-sm ${period === option ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-300'}`}>
                  {option === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
            <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              <FiDownload size={16} /> Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiTrendingUp size={16} /> Evolution réservations</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">+{metrics.reservationEvolution}%</div>
        </div>
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiBarChart2 size={16} /> Croissance apprenants</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">+{metrics.growth}%</div>
        </div>
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiFilter size={16} /> Taux de présence</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{metrics.attendance}%</div>
        </div>
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiTrendingUp size={16} /> Revenu actuel</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{metrics.currentRevenue.toLocaleString('fr-TN')} TND</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Réservation evolution</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Course popularity</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={coursePopularity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78} label>
                  {coursePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Revenue history</div>
          <DataChart data={mockRevenueHistory} dataKey="revenue" label="Historique des revenus" />
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Trainer performance</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainerPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="score" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">Completion rate</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{metrics.completion}%</div>
        </div>
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">Partner companies</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{mockPartnerCompanies.length}</div>
        </div>
        <div className="rounded-[24px] bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">Sessions actives</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{mockSessions.length}</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiBookOpen, FiDownload, FiFileText, FiMapPin, FiPrinter, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useAdminDashboardData } from '../../hooks/useAdminDashboardData';

const periodOptions = [
  { value: '30d', label: '30 jours', multiplier: 1 },
  { value: '90d', label: '90 jours', multiplier: 1.9 },
  { value: '1y', label: '12 mois', multiplier: 2.8 },
];

const exportToCsv = (rows, filename) => {
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => row[header]).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const LineChart = ({ data }) => {
  const width = 320;
  const height = 180;
  const padding = 24;
  const values = data.map((item) => item.value);
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return { x, y, value };
  });

  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className="mt-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        {points.map((point) => (
          <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="5" fill="#0f766e" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        {data.map((item) => (
          <span key={item.name}>{item.name}</span>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="mt-6 flex h-44 items-end gap-2">
      {data.map((item) => (
        <div key={item.name} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end rounded-xl bg-slate-100 p-1 dark:bg-slate-700/60">
            <div className="w-full rounded-lg bg-gradient-to-t from-brand-600 to-emerald-400" style={{ height: `${Math.max(10, (item.value / maxValue) * 100)}%` }} />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="mt-6 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
      <svg viewBox="0 0 140 140" className="h-36 w-36">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
        {data.map((item) => {
          const segmentLength = (item.value / total) * circumference;
          const dashOffset = -offset;
          offset += segmentLength;
          return (
            <circle
              key={item.name}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 70 70)"
            />
          );
        })}
      </svg>
      <div className="w-full space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsPage = () => {
  const data = useAdminDashboardData();
  const [activePeriod, setActivePeriod] = useState('30d');

  const periodMeta = useMemo(() => {
    const selected = periodOptions.find((option) => option.value === activePeriod) || periodOptions[0];
    return {
      ...selected,
      users: Math.round(data.totalUsers * selected.multiplier),
      centres: Math.round(data.totalCentres * selected.multiplier * 0.6),
      formations: Math.round(data.totalFormations * selected.multiplier * 0.8),
      reservations: Math.round(data.totalReservations * selected.multiplier * 1.2),
    };
  }, [activePeriod, data]);

  const userBreakdown = [
    { label: 'Apprenants', value: Math.round(data.totalUsers * 0.72), color: 'from-teal-500 to-emerald-500' },
    { label: 'Centres', value: Math.round(data.totalCentres * 0.8), color: 'from-sky-500 to-blue-500' },
  ];

  const popFormations = (data.topFormations || []).slice(0, 4).map((formation) => ({
    ...formation,
    completion: Math.min(100, 70 + formation.progress / 3),
  }));

  const activeCentres = (data.topCentres || []).slice(0, 4).map((centre) => ({
    ...centre,
    learners: Math.round(centre.students * 1.2),
  }));

  const dailyActivity = [
    { label: 'Lun', value: 62 },
    { label: 'Mar', value: 74 },
    { label: 'Mer', value: 81 },
    { label: 'Jeu', value: 69 },
    { label: 'Ven', value: 92 },
    { label: 'Sam', value: 88 },
    { label: 'Dim', value: 75 },
  ];

  const exportPdf = () => window.print();
  const exportExcel = () => {
    const rows = [
      { metric: 'Utilisateurs', value: periodMeta.users },
      { metric: 'Centres actifs', value: periodMeta.centres },
      { metric: 'Formations publiées', value: periodMeta.formations },
      { metric: 'Réservations', value: periodMeta.reservations },
    ];
    exportToCsv(rows, 'skillbridge-analytics.csv');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Analytics</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Décisions business et santé de la plateforme</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Explorez l’évolution des utilisateurs, formations et centres avec des indicateurs actionnables et des exports prêts pour la direction.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
              <FiPrinter /> PDF
            </button>
            <button type="button" onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
              <FiDownload /> Excel
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button key={option.value} type="button" onClick={() => setActivePeriod(option.value)} className={`rounded-full px-3 py-1.5 text-sm ${activePeriod === option.value ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}>
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Utilisateurs</p>
            <FiUsers className="text-brand-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{periodMeta.users}</p>
          <p className="mt-1 text-sm text-emerald-500">+{data.userGrowth}% vs période précédente</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Formations</p>
            <FiBookOpen className="text-violet-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{periodMeta.formations}</p>
          <p className="mt-1 text-sm text-violet-500">Catégories en forte croissance</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Centres actifs</p>
            <FiMapPin className="text-sky-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{periodMeta.centres}</p>
          <p className="mt-1 text-sm text-sky-500">{data.verifiedCentres} centres certifiés</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Engagement</p>
            <FiTrendingUp className="text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{data.activeUsers}</p>
          <p className="mt-1 text-sm text-amber-500">{data.loginToday} connexions aujourd’hui</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Évolution des inscriptions</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tendance mensuelle sur la période sélectionnée</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">+{data.userGrowth}%</div>
          </div>
          <LineChart data={data.registrationChartData} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Réservations</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Volume récurrent par mois</p>
            </div>
            <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">{data.totalReservations} réserv.</div>
          </div>
          <BarChart data={data.reservationChartData} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Satisfaction</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Répartition du sentiment utilisateur</p>
            </div>
            <FiTrendingUp className="text-emerald-500" />
          </div>
          <DonutChart data={data.satisfactionChartData.map((item) => ({ ...item, color: item.name === 'Satisfaction' ? '#10b981' : '#94a3b8' }))} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Catégories les plus dynamiques</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Répartition des formations par catégorie</p>
            </div>
            <FiBookOpen className="text-violet-500" />
          </div>
          <div className="mt-6 space-y-3">
            {(data.topCategories || []).slice(0, 4).map((category, index) => {
              const percentage = Math.round((category.value / Math.max(data.totalFormations, 1)) * 100);
              return (
                <div key={category.name} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{index + 1}. {category.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{category.value} formations</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Utilisateurs</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Évolution des inscriptions et répartition des profils</p>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">{data.newUsersThisMonth} nouveaux</div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {userBreakdown.map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Formations</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Popularité, catégories tendances et taux de complétion</p>
              </div>
              <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">{data.topCategories?.[0]?.name}</div>
            </div>
            <div className="mt-6 space-y-3">
              {popFormations.map((formation) => (
                <div key={formation.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{formation.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{formation.category} • {formation.centre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formation.bookings} réserv.</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(formation.completion)}% compl.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Centres</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Centres les plus actifs et volume d’apprentissage</p>
              </div>
              <FiMapPin className="text-sky-500" />
            </div>
            <div className="mt-6 space-y-3">
              {activeCentres.map((centre) => (
                <div key={centre.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{centre.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{centre.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{centre.formations} formations</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{centre.learners} apprenants</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Engagement</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Activité quotidienne et sessions utilisateurs</p>
              </div>
              <FiActivity className="text-emerald-500" />
            </div>
            <div className="mt-6 flex items-end gap-2">
              {dailyActivity.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-brand-500 to-emerald-400" style={{ height: `${item.value}px` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Rapports</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Comparaison avec la période précédente et exports prêts</p>
              </div>
              <FiFileText className="text-slate-400" />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
              <p className="text-sm text-slate-600 dark:text-slate-300">Période actuelle : <span className="font-semibold text-slate-900 dark:text-slate-100">{periodMeta.label}</span></p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Comparaison : <span className="font-semibold text-emerald-600">+{data.userGrowth}%</span> sur la période précédente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

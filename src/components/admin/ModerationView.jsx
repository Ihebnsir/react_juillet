import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';

import { AdminPageShell } from './AdminPageShell';
import { Badge } from '../UI/Badge';
import { Panel } from '../UI/Panel';
import { PriorityChip } from '../UI/PriorityChip';
import { StatusChip } from '../UI/StatusChip';
import {
  loadModerationAlertsFromStorage,
  saveModerationAlertsToStorage,
  loadModerationTableFromStorage,
  saveModerationTableToStorage,
  mockModerationAlerts,
  mockModerationTable,
  mockModerationHeatmap,
  mockModerationWatchlist,
  mockModerationAISuggestions,
  mockModerationCenters,
  mockRiskUsers,
} from '../../data/mockModeration';

const ALERT_COLORS = {
  Critique: '#F43F5E',
  Important: '#F59E0B',
  Élevé: '#FB923C',
  Moyen: '#38BDF8',
  Faible: '#10B981',
};

const TABLE_COLUMNS = [
  { key: 'type', label: 'Type' },
  { key: 'user', label: 'Utilisateur' },
  { key: 'centre', label: 'Centre' },
  { key: 'risk', label: 'Gravité' },
  { key: 'iaScore', label: 'IA Score' },
  { key: 'analyst', label: 'Analyste' },
  { key: 'status', label: 'Statut' },
  { key: 'date', label: 'Date' },
  { key: 'actions', label: 'Actions' },
];

const sortIndicator = (key, sortConfig) => {
  if (sortConfig.key !== key) return null;
  return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
};

const getRiskTone = (value) => {
  if (value === 'Critique') return 'critical';
  if (value === 'Élevé' || value === 'Important') return 'high';
  if (value === 'Moyen') return 'medium';
  return 'low';
};

const getStatusTone = (value) => {
  if (value === 'Traité') return 'stable';
  if (value === 'En cours' || value === 'Analyse') return 'warning';
  if (value === 'Nouveau') return 'critical';
  return 'pending';
};

const KpiMetricCard = ({ icon: Icon, label, value, trend, color, sparkline }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/20 transition hover:shadow-2xl"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${color} text-white`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-400">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
        <Zap size={12} />
        {trend}
      </div>
      <span className="text-xs text-slate-500">Tendance 7j</span>
    </div>
    <div className="mt-4 h-16">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sparkline}> 
          <defs>
            <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color.replace('/80', '')} stopOpacity={0.65} />
              <stop offset="100%" stopColor={color.replace('/80', '')} stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color.replace('/80', '')} fill={`url(#spark-${label})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const DetailCard = ({ alert, onClose }) => {
  if (!alert) return null;
  return (
    <Panel opaque eyebrow="Détail incident" title="Incident sélectionné" description="Résumé du cas et recommandations IA affichés dans la colonne latérale." className="space-y-6">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Alerte active</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{alert.type}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300 transition hover:bg-slate-900">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Utilisateur ciblé</p>
            <p className="mt-2 text-lg font-semibold text-white">{alert.user}</p>
            <p className="mt-2 text-sm text-slate-400">{alert.role} • {alert.category}</p>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Risque</span>
              <PriorityChip label={alert.riskLevel} tone={getRiskTone(alert.riskLevel)} />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Date</span>
              <span>{alert.date}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Status</span>
              <StatusChip label={alert.status} tone={getStatusTone(alert.status)} />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contexte</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{alert.message}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recommandation IA</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{alert.decision}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const ModerationView = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [alerts, setAlerts] = useState(() => loadModerationAlertsFromStorage());
  const [tableRows, setTableRows] = useState(() => loadModerationTableFromStorage());

  useEffect(() => {
    saveModerationAlertsToStorage(alerts);
  }, [alerts]);

  useEffect(() => {
    saveModerationTableToStorage(tableRows);
  }, [tableRows]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const centres = useMemo(() => mockModerationCenters.map((centre) => centre.nom), []);
  const analysts = useMemo(() => ['Lina Ben', 'Ines Khalil', 'Walid F.', 'Amel H.'], []);

  const enrichedTable = useMemo(
    () =>
      tableRows.map((row, index) => ({
        ...row,
        centre: row.centre || centres[index % centres.length],
        analyst: row.analyst || analysts[index % analysts.length],
        iaScore: row.iaScore || Math.min(98, Math.max(35, 90 - index * 7)),
      })),
    [tableRows, centres, analysts]
  );

  const overview = useMemo(() => {
    const criticalAlerts = alerts.filter((item) => item.riskLevel === 'Critique').length;
    const managedUsers = mockModerationWatchlist.length;
    const reportedContent = tableRows.filter((row) => row.category === 'Qualité contenu').length;
    const riskCenters = mockModerationCenters.filter((centre) => centre.verificationRisk >= 75).length;
    const trustScore = Math.round(mockModerationWatchlist.reduce((acc, item) => acc + item.trustScore, 0) / mockModerationWatchlist.length);
    const todayAlerts = alerts.filter((item) => item.date.startsWith(new Date().toISOString().slice(0, 10))).length;

    return {
      criticalAlerts,
      managedUsers,
      reportedContent,
      riskCenters,
      trustScore,
      todayAlerts,
    };
  }, [alerts, tableRows]);

  const kpis = useMemo(
    () => [
      {
        label: 'Alertes critiques',
        value: overview.criticalAlerts,
        trend: '+18%',
        color: 'bg-rose-500',
        sparkline: [2, 3, 4, 5, 6, 8, overview.criticalAlerts],
        icon: AlertTriangle,
      },
      {
        label: 'Utilisateurs surveillés',
        value: overview.managedUsers,
        trend: '+12%',
        color: 'bg-sky-500',
        sparkline: [4, 5, 5, 6, 7, 8, overview.managedUsers],
        icon: Users,
      },
      {
        label: 'Contenus signalés',
        value: overview.reportedContent,
        trend: '+9%',
        color: 'bg-amber-500',
        sparkline: [8, 10, 9, 12, 14, 15, overview.reportedContent],
        icon: ShieldAlert,
      },
      {
        label: 'Centres à risque',
        value: overview.riskCenters,
        trend: '+7%',
        color: 'bg-violet-500',
        sparkline: [1, 2, 2, 3, 4, 4, overview.riskCenters],
        icon: BarChart3,
      },
      {
        label: 'Score de confiance',
        value: `${overview.trustScore}%`,
        trend: '+4%',
        color: 'bg-emerald-500',
        sparkline: [74, 76, 78, 80, 83, 86, overview.trustScore],
        icon: ShieldCheck,
      },
      {
        label: 'Activité aujourd’hui',
        value: overview.todayAlerts,
        trend: '+22%',
        color: 'bg-fuchsia-500',
        sparkline: [1, 2, 3, 5, 3, 4, overview.todayAlerts],
        icon: Bell,
      },
    ],
    [overview]
  );

  const alertEvolution = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - idx));
      const label = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      const key = date.toISOString().slice(0, 10);
      return { key, label, value: 0 };
    });
    alerts.forEach((alert) => {
      const dateKey = alert.date.slice(0, 10);
      const day = days.find((item) => item.key === dateKey);
      if (day) day.value += 1;
    });
    return days;
  }, [alerts]);

  const categoryDistribution = useMemo(() => {
    const counts = {};
    enrichedTable.forEach((row) => {
      counts[row.category] = (counts[row.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [enrichedTable]);

  const criticalAlerts = useMemo(
    () => alerts.filter((alert) => alert.riskLevel === 'Critique').slice(0, 3),
    [alerts]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enrichedTable.filter((row) => {
      const matchesSearch =
        !query ||
        [row.type, row.user, row.centre, row.category, row.analyst, row.status].join(' ').toLowerCase().includes(query);
      const matchesRole = !roleFilter || row.role === roleFilter;
      const matchesRisk = !riskFilter || row.risk === riskFilter;
      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesSearch && matchesRole && matchesRisk && matchesStatus;
    });
  }, [enrichedTable, search, roleFilter, riskFilter, statusFilter]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? '';
      const bValue = b[sortConfig.key] ?? '';
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue, 'fr') : bValue.localeCompare(aValue, 'fr');
      }
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
    return rows;
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / 6));
  const pagedRows = useMemo(() => sortedRows.slice((currentPage - 1) * 6, currentPage * 6), [sortedRows, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleExport = () => {
    const csv = [['Type', 'Utilisateur', 'Centre', 'Gravité', 'IA Score', 'Analyste', 'Statut', 'Date']]
      .concat(
        sortedRows.map((row) => [row.type, row.user, row.centre, row.risk, row.iaScore, row.analyst, row.status, row.date])
      )
      .map((line) => line.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moderation-export.csv';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export CSV généré avec succès.');
  };

  const handleAnalyze = () => {
    setNotice('Analyse en cours… terminé. 4 nouveaux incidents détectés.');
  };

  const handleCreateRule = () => {
    setNotice('Nouvelle règle créée. Vérifiez la configuration dans la console de modération.');
  };

  const openAlertDetail = (alert) => setSelectedAlert(alert);
  const closeDetail = () => setSelectedAlert(null);

  return (
    <AdminPageShell
      eyebrow="Surveillance"
      title="Centre de modération"
      subtitle="Pilotez les incidents, les alertes critiques et les scores IA depuis une console de supervision premium."
      badge="Trust & Safety"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="rounded-3xl border border-red-500 bg-red-600/95 p-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-950/20">
          TEST MODÉRATION — composant <span className="font-black">ModerationView</span> rendu
        </div>
        {notice ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-lg shadow-emerald-500/10">
            {notice}
          </motion.div>
        ) : null}

        <Panel borderless>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                <ShieldAlert size={14} /> Centre de Modération
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold text-white sm:text-5xl">Supervision des incidents en temps réel</h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-400">Un centre de surveillance premium conçu pour détecter les comportements à risque, arbitrer les incidents et escalader les cas critiques en un seul écran.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button type="button" onClick={handleCreateRule} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <Plus size={16} /> Nouvelle règle
              </button>
              <button type="button" onClick={handleAnalyze} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
                <RefreshCcw size={16} /> Lancer une analyse
              </button>
              <button type="button" onClick={handleExport} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <Download size={16} /> Exporter
              </button>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 xl:grid-cols-3">
          {kpis.map((metric) => (
            <KpiMetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel eyebrow="Flux d’alertes" title="Évolution des incidents" description="Suivi continu des volumes d’alerte et des pics sur les 7 derniers jours." className="min-h-[340px]">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alertEvolution} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip wrapperClassName="rounded-3xl bg-slate-950/95 border border-white/10 text-sm text-white shadow-2xl" />
                    <Area type="monotone" dataKey="value" stroke="#f97316" fill="rgba(249,115,22,0.18)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel eyebrow="Matrice de risque" title="Heatmap des incidents" description="Intensité des alertes par domaine et jour." className="min-h-[340px]">
              <div className="space-y-4">
                {mockModerationHeatmap.map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{row.label}</span>
                      <span className="text-white">{row.values.reduce((sum, value) => sum + value, 0)} incidents</span>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {row.values.map((value, idx) => (
                        <div key={idx} className={`h-10 rounded-2xl ${value >= 5 ? 'bg-rose-500' : value >= 3 ? 'bg-amber-500' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Répartition" title="Catégories d’incident" description="Analyse des types de risque détectés par le moteur IA." className="min-h-[340px]">
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4} stroke="transparent">
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={entry.name} fill={['#38BDF8', '#F59E0B', '#F97316', '#F43F5E', '#10B981'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip wrapperClassName="rounded-3xl bg-slate-950/95 border border-white/10 text-sm text-white shadow-2xl" />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel eyebrow="Flux temps réel" title="Activité récente" description="Les incidents et actions qui changent la surface de risque maintenant." className="min-h-[340px]">
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => openAlertDetail(alert)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-left transition hover:border-brand-500"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{alert.type}</span>
                      <Badge label={alert.riskLevel} tone={getRiskTone(alert.riskLevel) === 'critical' ? 'danger' : getRiskTone(alert.riskLevel) === 'high' ? 'warning' : getRiskTone(alert.riskLevel) === 'medium' ? 'brand' : 'success'} />
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{alert.user} — {alert.category}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{alert.date}</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Eye size={12} /> Détail
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel opaque eyebrow="Tableau principal" title="Cas en cours" description="Filtrer, trier et analyser les incidents à fort impact." className="overflow-hidden">
              <div className="rounded-[32px] border border-white/10 bg-slate-950 p-5">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_280px] xl:grid-cols-[1fr_auto_280px_220px]">
                  <label className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 focus-within:ring-2 focus-within:ring-brand-500">
                    <Search size={18} className="text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Recherche globale"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </label>

                  <label className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                    <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Rôle</span>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-white outline-none">
                      <option value="">Tous</option>
                      <option value="Apprenant">Apprenant</option>
                      <option value="Formateur">Formateur</option>
                      <option value="Entreprise">Entreprise</option>
                      <option value="Centre">Centre</option>
                    </select>
                  </label>

                  <label className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                    <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Statut</span>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-white outline-none">
                      <option value="">Tous</option>
                      <option value="Nouveau">Nouveau</option>
                      <option value="Analyse">Analyse</option>
                      <option value="En cours">En cours</option>
                      <option value="Traité">Traité</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto rounded-[28px] border border-white/10 bg-slate-950">
                <table className="min-w-[1080px] w-full border-separate border-spacing-0 text-left text-sm text-slate-200">
                  <thead className="bg-slate-950/80 text-slate-400">
                    <tr>
                      {TABLE_COLUMNS.map((column) => (
                        <th key={column.key} className="px-4 py-4 font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {column.key !== 'actions' ? (
                            <button type="button" className="inline-flex items-center gap-2" onClick={() => handleSort(column.key)}>
                              {column.label}
                              {sortIndicator(column.key, sortConfig)}
                            </button>
                          ) : (
                            column.label
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => (
                      <tr key={row.id} className="border-t border-white/10 hover:bg-slate-900/70">
                        <td className="px-4 py-4 font-semibold text-white">{row.type}</td>
                        <td className="px-4 py-4">
                          <button type="button" className="font-medium text-slate-100 underline decoration-slate-600 underline-offset-4 hover:text-white" onClick={() => openAlertDetail(row)}>
                            {row.user}
                          </button>
                        </td>
                        <td className="px-4 py-4">{row.centre}</td>
                        <td className="px-4 py-4"><PriorityChip label={row.risk} tone={getRiskTone(row.risk)} /></td>
                        <td className="px-4 py-4">{row.iaScore}%</td>
                        <td className="px-4 py-4">{row.analyst}</td>
                        <td className="px-4 py-4"><StatusChip label={row.status} tone={getStatusTone(row.status)} /></td>
                        <td className="px-4 py-4">{row.date}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => openAlertDetail(row)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 transition hover:border-brand-500">
                              <Eye size={14} /> Détail
                            </button>
                            <button type="button" onClick={() => setNotice(`Escalade lancée pour ${row.user}.`)} className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-500">
                              <ShieldCheck size={14} /> Escalader
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Affichage {Math.min(sortedRows.length, pagedRows.length)} sur {sortedRows.length} cas</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Suivant <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </Panel>

            {selectedAlert ? <DetailCard alert={selectedAlert} onClose={closeDetail} /> : null}

            <Panel opaque eyebrow="Tableau latéral" title="Supervision rapide" description="Capsules de risque, recommandations IA et surveillance continue." className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Alertes critiques</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Focus urgence</h3>
                  </div>
                  <Badge label="Urgent" tone="danger" />
                </div>
                <div className="mt-5 space-y-4">
                  {criticalAlerts.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between gap-2 text-sm text-slate-400">
                        <span>{item.date}</span>
                        <PriorityChip label={item.riskLevel} tone={getRiskTone(item.riskLevel)} />
                      </div>
                      <p className="mt-3 font-semibold text-white">{item.type}</p>
                      <p className="mt-2 text-sm text-slate-400">{item.user} • {item.category}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Activité récente</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Journal d’investigation</h3>
                <div className="mt-5 space-y-3">
                  {alerts.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between gap-2 text-sm text-slate-500">
                        <span>{item.date}</span>
                        <span>{item.role}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">{item.type}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Recommandations IA</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Actions suggérées</h3>
                <div className="mt-5 space-y-3">
                  {mockModerationAISuggestions.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNotice(`${item.action} pour la recommandation: ${item.text}`)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-4 text-left text-sm text-slate-300 transition hover:border-brand-500"
                    >
                      <p className="font-semibold text-white">{item.text}</p>
                      <span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-400">
                        <ArrowRight size={12} /> {item.action}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Utilisateurs à surveiller</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Watchlist prioritaire</h3>
                <div className="mt-5 space-y-3">
                  {mockModerationWatchlist.map((user) => (
                    <div key={user.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.role}</p>
                        </div>
                        <Badge label={`Trust ${user.trustScore}%`} tone="warning" />
                      </div>
                      <p className="mt-3 text-sm text-slate-400">{user.lastActivity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </motion.div>
    </AdminPageShell>
  );
};

export default ModerationView;

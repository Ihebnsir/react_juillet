import React, { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Cpu,
  Download,
  Eye,
  FileText,
  Gavel,
  Lock,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  Zap,
  X,
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
  mockModerationAISuggestions,
  mockModerationCenters,
  mockModerationCompliance,
  mockModerationWatchlist,
  mockRiskUsers,
  mockActionTimeline,
} from '../../data/mockModeration';
import { createLitigeFromModeration, loadLitigesFromStorage, saveLitigesToStorage } from '../../data/mockLitiges';

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
const ROWS_PER_PAGE = 6;

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
  if (value === 'Bloqué') return 'danger';
  return 'pending';
};

const KpiMetricCard = memo(function KpiMetricCard({ icon: Icon, label, value, trend, color, sparkline }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color} text-white`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-400">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
          <Zap size={12} />
          {trend}
        </div>
        <span className="text-xs text-slate-500">Tendance 7j</span>
      </div>
      <div className="mt-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline.map((point, index) => ({ value: point, index }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.replace('bg-', '#').replace('-500', '')} stopOpacity={0.75} />
                <stop offset="100%" stopColor={color.replace('bg-', '#').replace('-500', '')} stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={color.replace('bg-', '#').replace('-500', '')} fill={`url(#spark-${label})`} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

const DetailDrawer = memo(function DetailDrawer({ row, onClose, onAction }) {
  if (!row) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <motion.aside initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }} className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6 shadow-2xl shadow-slate-950/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profil risque</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{row.type}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300 transition hover:bg-slate-900">
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Compte</p>
              <p className="mt-1 font-semibold text-white">{row.user}</p>
            </div>
            <PriorityChip label={row.risk} tone={getRiskTone(row.risk)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Centre</p>
              <p className="mt-2 text-sm font-semibold text-white">{row.centre}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Statut</p>
              <p className="mt-2 text-sm font-semibold text-white">{row.status}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Description</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{row.description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => onAction(row, 'dispute')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
            <Gavel size={16} /> Créer un litige
          </button>
          <button type="button" onClick={() => onAction(row, 'suspend')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
            <Lock size={16} /> Suspendre compte
          </button>
          <button type="button" onClick={() => onAction(row, 'treated')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
            <CheckCircle2 size={16} /> Marquer traité
          </button>
          <button type="button" onClick={() => onAction(row, 'ignore')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
            <AlertCircle size={16} /> Ignorer
          </button>
        </div>
      </motion.aside>
    </div>
  );
});

export const ModerationView = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [alerts, setAlerts] = useState(() => loadModerationAlertsFromStorage());
  const [tableRows, setTableRows] = useState(() => loadModerationTableFromStorage());
  const [auditEntries, setAuditEntries] = useState(() => mockActionTimeline.map((entry) => ({ ...entry })));
  const [litiges, setLitiges] = useState(() => loadLitigesFromStorage());

  useEffect(() => {
    saveModerationAlertsToStorage(alerts);
  }, [alerts]);

  useEffect(() => {
    saveModerationTableToStorage(tableRows);
  }, [tableRows]);

  useEffect(() => {
    saveLitigesToStorage(litiges);
  }, [litiges]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, riskFilter, statusFilter]);

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
      { label: 'Alertes critiques', value: overview.criticalAlerts, trend: '+18%', color: 'bg-rose-500', sparkline: [2, 3, 4, 5, 6, 8, overview.criticalAlerts], icon: AlertTriangle },
      { label: 'Utilisateurs surveillés', value: overview.managedUsers, trend: '+12%', color: 'bg-sky-500', sparkline: [4, 5, 5, 6, 7, 8, overview.managedUsers], icon: Users },
      { label: 'Contenus signalés', value: overview.reportedContent, trend: '+9%', color: 'bg-amber-500', sparkline: [8, 10, 9, 12, 14, 15, overview.reportedContent], icon: ShieldAlert },
      { label: 'Centres à risque', value: overview.riskCenters, trend: '+7%', color: 'bg-violet-500', sparkline: [1, 2, 2, 3, 4, 4, overview.riskCenters], icon: BarChart3 },
      { label: 'Score de confiance', value: `${overview.trustScore}%`, trend: '+4%', color: 'bg-emerald-500', sparkline: [74, 76, 78, 80, 83, 86, overview.trustScore], icon: ShieldCheck },
      { label: 'Activité aujourd’hui', value: overview.todayAlerts, trend: '+22%', color: 'bg-fuchsia-500', sparkline: [1, 2, 3, 5, 3, 4, overview.todayAlerts], icon: Bell },
    ],
    [overview]
  );

  const categoryDistribution = useMemo(() => {
    const counts = {};
    enrichedTable.forEach((row) => {
      counts[row.category] = (counts[row.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [enrichedTable]);

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

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE));
  const pagedRows = useMemo(() => sortedRows.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE), [sortedRows, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const pushAuditEntry = (action, target, detail = '') => {
    const entry = {
      id: `audit-${Date.now()}`,
      action,
      target,
      detail,
      date: new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setAuditEntries((prev) => [entry, ...prev].slice(0, 7));
  };

  const handleAction = (row, action) => {
    if (!row) return;

    if (action === 'suspend') {
      const updatedRow = { ...row, status: 'Bloqué', risk: 'Critique' };
      setTableRows((prev) => prev.map((item) => (item.id === row.id ? updatedRow : item)));
      setAlerts((prev) => prev.map((item) => (item.user === row.user ? { ...item, status: 'Bloqué', riskLevel: 'Critique' } : item)));
      setSelectedRow(updatedRow);
      setNotice(`Compte de ${row.user} suspendu. Une vérification manuel est désormais requise.`);
      pushAuditEntry('Suspension de compte', row.user, 'Compte suspendu depuis la modération');
      return;
    }

    if (action === 'treated') {
      const updatedRow = { ...row, status: 'Traité' };
      setTableRows((prev) => prev.map((item) => (item.id === row.id ? updatedRow : item)));
      setAlerts((prev) => prev.map((item) => (item.user === row.user ? { ...item, status: 'Traité' } : item)));
      setSelectedRow(updatedRow);
      setNotice(`Alerte marquée traitée pour ${row.user}.`);
      pushAuditEntry('Mise à jour de statut', row.user, 'Cas marqué traité');
      return;
    }

    if (action === 'ignore') {
      const updatedRow = { ...row, status: 'Ignoré' };
      setTableRows((prev) => prev.map((item) => (item.id === row.id ? updatedRow : item)));
      setAlerts((prev) => prev.map((item) => (item.user === row.user ? { ...item, status: 'Ignoré' } : item)));
      setSelectedRow(updatedRow);
      setNotice(`Alerte ignorée pour ${row.user}.`);
      pushAuditEntry('Ignorance de signalement', row.user, 'Signalement classé sans suite');
      return;
    }

    if (action === 'dispute') {
      const updatedRow = { ...row, status: 'En cours' };
      const newLitige = createLitigeFromModeration(row, `DISP-${Date.now()}`);
      const nextLitiges = [newLitige, ...litiges];
      setTableRows((prev) => prev.map((item) => (item.id === row.id ? updatedRow : item)));
      setSelectedRow(updatedRow);
      setLitiges(nextLitiges);
      saveLitigesToStorage(nextLitiges);
      setNotice(`Litige créé pour ${row.user}. Le dossier est maintenant visible dans l’espace litiges.`);
      pushAuditEntry('Création de litige', row.user, `Dossier ${newLitige.dossier} créé`);
    }
  };

  const handleExport = () => {
    const csv = [['Type', 'Utilisateur', 'Centre', 'Gravité', 'IA Score', 'Analyste', 'Statut', 'Date']]
      .concat(sortedRows.map((row) => [row.type, row.user, row.centre, row.risk, row.iaScore, row.analyst, row.status, row.date]))
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
    pushAuditEntry('Export CSV', 'Système', 'Export de la vue modération généré');
  };

  const handleExportPdf = () => {
    const content = sortedRows
      .slice(0, 8)
      .map((row) => `${row.type} | ${row.user} | ${row.centre} | ${row.risk} | ${row.status}`)
      .join('\n');
    const pdf = `%PDF-1.4\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n4 0 obj<< /Length 44 >>stream\nBT /F1 12 Tf 72 720 Td (${content.replace(/\n/g, ' ')}) Tj ET\nendstream\nendobj\n5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000119 00000 n \n0000000206 00000 n \n0000000300 00000 n \ntrailer<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`;
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moderation-export.pdf';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export PDF généré avec succès.');
    pushAuditEntry('Export PDF', 'Système', 'Export PDF de la vue modération généré');
  };

  const handleAnalyze = () => {
    const candidate = tableRows[0];
    if (candidate) {
      const updatedRow = { ...candidate, status: 'Analyse' };
      setTableRows((prev) => prev.map((row) => (row.id === candidate.id ? updatedRow : row)));
      setAlerts((prev) => [
        {
          id: `AL-${Date.now()}`,
          userId: candidate.userId || 'system',
          type: 'Analyse automatisée',
          user: candidate.user,
          role: candidate.role || 'Apprenant',
          date: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          riskLevel: 'Élevé',
          severity: 'info',
          message: 'Analyse automatique exécutée avec 4 nouveaux incidents détectés.',
          category: candidate.category || 'Sécurité comptes',
          status: 'Analyse',
          decision: 'Réviser le cas prioritaire dans la timeline.',
        },
        ...prev,
      ]);
      setSelectedRow(updatedRow);
    }
    setNotice('Analyse en cours… terminé. 4 nouveaux incidents détectés.');
    pushAuditEntry('Analyse automatisée', 'Système', '4 nouveaux incidents détectés');
  };

  const handleCreateRule = () => {
    setNotice('Nouvelle règle créée et activée. Vérifiez la configuration dans la console de modération.');
    pushAuditEntry('Règle créée', 'Centre de modération', 'Règle de conformité activée');
  };

  const handleRecommendationAction = (row, actionLabel) => {
    if (!row) return;
    const updatedRow = { ...row, status: 'Analyse' };
    setTableRows((prev) => prev.map((item) => (item.id === row.id ? updatedRow : item)));
    setSelectedRow(updatedRow);
    setNotice(`${actionLabel} déclenchée pour ${row.user}.`);
    pushAuditEntry('Recommandation IA', row.user, actionLabel);
  };

  const openRowDetail = (row) => setSelectedRow(row);
  const closeDetail = () => setSelectedRow(null);

  return (
    <AdminPageShell
      eyebrow="Surveillance"
      title="Centre de modération"
      subtitle="Pilotez les incidents, les alertes critiques et les scores IA depuis une console de supervision premium."
      badge="Trust & Safety"
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {notice ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-lg shadow-emerald-500/10">
            {notice}
          </motion.div>
        ) : null}

        <Panel borderless>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                <ShieldAlert size={14} /> Centre de modération
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">Supervision des incidents en temps réel</h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-400">Un centre de surveillance premium pour détecter les comportements à risque, arbitrer les incidents et escalader les cas critiques sans perte de contexte.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <button type="button" onClick={handleCreateRule} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <Plus size={16} /> Nouvelle règle
              </button>
              <button type="button" onClick={handleAnalyze} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
                <RefreshCcw size={16} /> Lancer une analyse
              </button>
              <button type="button" onClick={handleExport} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <Download size={16} /> Exporter CSV
              </button>
              <button type="button" onClick={handleExportPdf} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <FileText size={16} /> Exporter PDF
              </button>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kpis.map((metric) => (
            <KpiMetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel eyebrow="Vue globale des risques" title="Carte de risque opérationnelle" description="Synthèse des centres à risque, des catégories et des signaux en temps réel." className="min-h-[360px]">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Risk map</p>
                    <p className="text-sm text-slate-400">Distribution des centres à risque par score et volume d’alertes.</p>
                  </div>
                  <Badge label="Live" tone="warning" />
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockModerationCenters.map((centre) => ({ name: centre.nom, risk: centre.verificationRisk, alerts: centre.alertCount }))} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-10} textAnchor="end" />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip wrapperClassName="rounded-2xl border border-white/10 bg-slate-950/95 text-sm text-white shadow-2xl" />
                      <Bar dataKey="risk" radius={[8, 8, 0, 0]} fill="#38BDF8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Répartition des risques</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {categoryDistribution.slice(0, 4).map((item) => (
                      <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>{item.name}</span>
                          <span className="font-semibold text-white">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">État des contrôles KYC</p>
                  <div className="mt-4 space-y-3">
                    {mockModerationCompliance.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>{item.label}</span>
                          <span className="font-semibold text-white">{item.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Activité temps réel" title="Timeline de supervision" description="Les dernières actions réellement prises par l’équipe de modération." className="min-h-[360px]">
            <div className="space-y-4">
              {auditEntries.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Clock3 size={14} />
                      <span>{item.date}</span>
                    </div>
                    <Badge label="Audit" tone="brand" />
                  </div>
                  <p className="mt-3 font-semibold text-white">{item.action}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.target}</p>
                  {item.detail ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{item.detail}</p> : null}
                </div>
              ))}
              <div className="rounded-[20px] border border-dashed border-brand-500/40 bg-brand-500/10 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-brand-400">
                  <Cpu size={16} />
                  <span>Dernière détection IA</span>
                </div>
                <p className="mt-2 text-white">Détection de 3 nouveaux signaux de fraude sur des comptes récemment créés.</p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Panel eyebrow="Watchlist" title="Top 5 comptes à risque" description="Profils prioritaires pour une surveillance renforcée." className="min-h-[320px]">
            <div className="space-y-3">
              {mockRiskUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.role} • {user.email}</p>
                    </div>
                    <Badge label={`${user.trustScore}%`} tone="warning" />
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{user.profileSummary}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Centre de recommandations IA" title="Actions recommandées" description="Les prochaines actions à déclencher pour réduire la surface de risque." className="min-h-[320px]">
            <div className="grid gap-3 md:grid-cols-2">
              {mockModerationAISuggestions.map((item) => (
                <button key={item.id} type="button" onClick={() => handleRecommendationAction(enrichedTable[0], `${item.action} : ${item.text}`)} className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4 text-left transition hover:border-brand-500">
                  <p className="text-sm font-semibold text-white">{item.text}</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-brand-400">
                    <ArrowRight size={14} />
                    <span>{item.action}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => handleAction(enrichedTable[0], 'suspend')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <Lock size={16} /> Suspendre
              </button>
              <button type="button" onClick={() => handleAction(enrichedTable[0], 'dispute')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
                <Gavel size={16} /> Créer litige
              </button>
              <button type="button" onClick={() => handleAction(enrichedTable[0], 'treated')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <UserCheck size={16} /> Vérification identité
              </button>
              <button type="button" onClick={handleExport} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500">
                <Download size={16} /> Exporter
              </button>
            </div>
          </Panel>
        </div>

        <Panel opaque eyebrow="Tableau des investigations" title="Cas à traiter" description="Recherche, filtrage, tri et actions de supervision en une seule vue." className="overflow-hidden">
          <div className="rounded-[24px] border border-white/10 bg-slate-950 p-4 sm:p-5">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 focus-within:ring-2 focus-within:ring-brand-500">
                <Search size={18} className="text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recherche globale" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
              </label>
              <label className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-500">Rôle</span>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-white outline-none">
                  <option value="">Tous</option>
                  <option value="Apprenant">Apprenant</option>
                  <option value="Formateur">Formateur</option>
                  <option value="Entreprise">Entreprise</option>
                  <option value="Centre">Centre</option>
                </select>
              </label>
              <label className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-500">Gravité</span>
                <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-white outline-none">
                  <option value="">Toutes</option>
                  <option value="Faible">Faible</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Élevé">Élevé</option>
                  <option value="Critique">Critique</option>
                </select>
              </label>
              <label className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-500">Statut</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-white outline-none">
                  <option value="">Tous</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="Analyse">Analyse</option>
                  <option value="En cours">En cours</option>
                  <option value="Traité">Traité</option>
                  <option value="Bloqué">Bloqué</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[24px] border border-white/10 bg-slate-950">
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
                      <button type="button" className="font-medium text-slate-100 underline decoration-slate-600 underline-offset-4 hover:text-white" onClick={() => openRowDetail(row)}>
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
                        <button type="button" onClick={() => openRowDetail(row)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 transition hover:border-brand-500">
                          <Eye size={14} /> Voir détail
                        </button>
                        <button type="button" onClick={() => handleAction(row, 'dispute')} className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-500">
                          <Gavel size={14} /> Créer un litige
                        </button>
                        <button type="button" onClick={() => handleAction(row, 'suspend')} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 transition hover:border-brand-500">
                          <Lock size={14} /> Suspendre compte
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
              <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50">
                <ChevronLeft size={16} /> Précédent
              </button>
              <button type="button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50">
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </Panel>

        {selectedRow ? <DetailDrawer row={selectedRow} onClose={closeDetail} onAction={handleAction} /> : null}
      </motion.div>
    </AdminPageShell>
  );
};

export default ModerationView;

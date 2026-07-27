import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiFilter, FiDownload, FiPrinter, FiChevronDown, FiChevronUp,
  FiChevronLeft, FiChevronRight, FiAlertTriangle, FiClock, FiCheckCircle,
  FiXCircle, FiEye, FiEdit3, FiMail, FiPhone, FiFile, FiTrash2,
  FiArchive, FiBarChart2, FiTrendingUp,
  FiStar, FiGrid, FiList, FiMoreVertical, FiShield,
} from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { mockLitiges, CATEGORIES_LITIGES, STATUS_LITIGES, PRIORITES } from '../../data/mockLitiges';
import { StatCard } from '../../components/dashboard/StatCard';
import { DataChart } from '../../components/dashboard/DataChart';
import { PieChartCard } from '../../components/dashboard/PieChartCard';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { LitigesDrawer } from '../../components/admin/LitigesDrawer';

const ITEMS_PER_PAGE = 10;

const STATUS_LABELS = {
  ouvert: 'Ouvert',
  analyse: 'Analyse',
  attente_justificatifs: 'Attente justificatifs',
  en_cours: 'En cours',
  decision: 'Décision',
  resolu: 'Résolu',
  archive: 'Archivé',
};

const statusColors = {
  ouvert: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  analyse: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  attente_justificatifs: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  en_cours: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  decision: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  resolu: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  archive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const priorityColors = {
  basse: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  moyenne: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  haute: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  critique: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const exportToCSV = (data, filename = 'litiges-skillbridge.csv') => {
  if (!Array.isArray(data) || data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) => Object.values(row).join(','));
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const exportToPDF = () => {
  window.print();
};

export const LitigesPage = () => {
  const [litiges, setLitiges] = useState(() => [...mockLitiges]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ statut: '', priorite: '', categorie: '', urgence: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'dateOuverture', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLitige, setSelectedLitige] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState(null);
  const [confirmResolve, setConfirmResolve] = useState(null);
  const [toast, setToast] = useState(null);
  const drawerRef = useRef(null);
  const { addNotification } = useNotifications();

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // === ESCAPE KEY HANDLER ===
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (drawerOpen) {
          setDrawerOpen(false);
          setSelectedLitige(null);
        }
        if (confirmDelete) setConfirmDelete(null);
        if (confirmArchive) setConfirmArchive(null);
        if (confirmResolve) setConfirmResolve(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [drawerOpen, confirmDelete, confirmArchive, confirmResolve]);

  // === DASHBOARD STATS ===
  const dashboardStats = useMemo(() => {
    const total = litiges.length;
    const ouverts = litiges.filter(l => l.statut === 'ouvert').length;
    const analyse = litiges.filter(l => l.statut === 'analyse').length;
    const attente = litiges.filter(l => l.statut === 'attente_justificatifs').length;
    const enCours = litiges.filter(l => l.statut === 'en_cours' || l.statut === 'decision').length;
    const resolus = litiges.filter(l => l.statut === 'resolu' || l.statut === 'archive').length;
    const urgents = litiges.filter(l => l.priorite === 'critique' || l.priorite === 'haute').length;
    const today = new Date().toISOString().split('T')[0];
    const nouveauxAujourdhui = litiges.filter(l => l.dateOuverture === today).length;

    const tempsResolution = litiges
      .filter(l => l.statut === 'resolu' || l.statut === 'archive')
      .reduce((sum, l) => {
        const jours = parseInt(l.tempsEcoule) || 7;
        return sum + jours;
      }, 0);
    const resolubles = litiges.filter(l => l.statut === 'resolu' || l.statut === 'archive').length;
    const tempsMoyen = resolubles > 0 ? Math.round(tempsResolution / resolubles) : 0;

    return { total, ouverts, analyse, attente, enCours, resolus, urgents, nouveauxAujourdhui, tempsMoyen };
  }, [litiges]);

  // === FILTERS & SEARCH ===
  const filteredLitiges = useMemo(() => {
    return litiges.filter(l => {
      const matchesSearch = !search ||
        l.numeroDossier?.toLowerCase().includes(search.toLowerCase()) ||
        l.titre?.toLowerCase().includes(search.toLowerCase()) ||
        l.etudiant?.nom?.toLowerCase().includes(search.toLowerCase()) ||
        l.centre?.nom?.toLowerCase().includes(search.toLowerCase()) ||
        l.formation?.titre?.toLowerCase().includes(search.toLowerCase()) ||
        l.etudiant?.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.etudiant?.tel?.toLowerCase().includes(search.toLowerCase());

      const matchesStatut = !filters.statut || l.statut === filters.statut;
      const matchesPriorite = !filters.priorite || l.priorite === filters.priorite;
      const matchesCategorie = !filters.categorie || l.categorie === filters.categorie;
      const matchesUrgence = !filters.urgence || l.niveauUrgence === filters.urgence;

      return matchesSearch && matchesStatut && matchesPriorite && matchesCategorie && matchesUrgence;
    });
  }, [litiges, search, filters]);

  // === SORT ===
  const sortedLitiges = useMemo(() => {
    const sorted = [...filteredLitiges];
    sorted.sort((a, b) => {
      let aVal, bVal;
      switch (sortConfig.key) {
        case 'numeroDossier':
        case 'titre':
          aVal = (a[sortConfig.key] || '').toLowerCase();
          bVal = (b[sortConfig.key] || '').toLowerCase();
          break;
        case 'priorite':
          const prioOrder = { critique: 4, haute: 3, moyenne: 2, basse: 1 };
          aVal = prioOrder[a.priorite] || 0;
          bVal = prioOrder[b.priorite] || 0;
          break;
        case 'dateOuverture':
          aVal = new Date(a.dateOuverture || 0).getTime();
          bVal = new Date(b.dateOuverture || 0).getTime();
          break;
        case 'etudiant':
          aVal = (a.etudiant?.nom || '').toLowerCase();
          bVal = (b.etudiant?.nom || '').toLowerCase();
          break;
        case 'centre':
          aVal = (a.centre?.nom || '').toLowerCase();
          bVal = (b.centre?.nom || '').toLowerCase();
          break;
        default:
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredLitiges, sortConfig]);

  // === PAGINATION ===
  const totalPages = Math.ceil(sortedLitiges.length / ITEMS_PER_PAGE);
  const paginatedLitiges = sortedLitiges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

// === ACTIONS ===
  const handleUpdateLitige = useCallback((id, updates) => {
    setLitiges(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, ...updates, derniereMAJ: new Date().toISOString().split('T')[0] };
      if (updates.statut) {
        const actionLabels = {
          ouvert: 'Ouverture', analyse: 'Prise en charge', attente_justificatifs: 'Demande de justificatifs',
          en_cours: 'En cours de résolution', decision: 'En attente de décision',
          resolu: 'Résolution', archive: 'Archivage',
        };
        const newHist = {
          date: new Date().toISOString().split('T')[0],
          action: actionLabels[updates.statut] || `Changement vers ${updates.statut}`,
          auteur: 'Admin Principal',
          details: `Statut mis à jour vers ${STATUS_LABELS[updates.statut] || updates.statut}`,
        };
        updated.historique = [...(updated.historique || []), newHist];
      }
      return updated;
    }));
    const actionName = updates.statut ? `Statut changé vers ${STATUS_LABELS[updates.statut] || updates.statut}` :
      updates.priorite ? `Priorité changée à ${updates.priorite}` : 'Mis à jour';
    addNotification({ role: 'admin', title: 'Litige mis à jour', message: `${actionName} pour le dossier ${id}`, category: 'litiges' });
    showToast('success', 'Litige mis à jour');
  }, [addNotification, showToast]);

  const handleDeleteLitige = useCallback((id) => {
    setLitiges(prev => prev.filter(l => l.id !== id));
    addNotification({ role: 'admin', title: 'Litige supprimé', message: `Dossier ${id} supprimé définitivement`, category: 'litiges' });
    setConfirmDelete(null);
    showToast('success', 'Litige supprimé');
  }, [addNotification, showToast]);

  const handleArchiveLitige = useCallback((id) => {
    handleUpdateLitige(id, { statut: 'archive' });
    setConfirmArchive(null);
    setConfirmResolve(null);
  }, [handleUpdateLitige]);

  const handleResolveLitige = useCallback((id) => {
    handleUpdateLitige(id, { statut: 'resolu' });
    setConfirmResolve(null);
  }, [handleUpdateLitige]);

  const handleOpenDrawer = (litige) => {
    setSelectedLitige(litige);
    setDrawerOpen(true);
  };

  const handleContactEtudiant = (etudiant) => {
    if (etudiant?.email) {
      window.location.href = `mailto:${etudiant.email}`;
      addNotification({ role: 'admin', title: 'Contact étudiant', message: `Email envoyé à ${etudiant.nom}`, category: 'litiges' });
    }
  };

  const handleContactCentre = (centre) => {
    if (centre?.email) {
      window.location.href = `mailto:${centre.email}`;
      addNotification({ role: 'admin', title: 'Contact centre', message: `Email envoyé à ${centre.nom}`, category: 'litiges' });
    }
  };

  const handleRequestDocuments = (id) => {
    handleUpdateLitige(id, { statut: 'attente_justificatifs' });
    showToast('success', 'Demande de justificatifs envoyée');
  };

  const handleExportCSV = () => {
    const dataToExport = sortedLitiges.map(l => ({
      numero: l.numeroDossier,
      titre: l.titre,
      etudiant: l.etudiant?.nom,
      centre: l.centre?.nom,
      formation: l.formation?.titre,
      priorite: l.priorite,
      statut: STATUS_LABELS[l.statut] || l.statut,
      date: l.dateOuverture,
      temps: l.tempsEcoule,
    }));
    exportToCSV(dataToExport, 'litiges-skillbridge.csv');
    showToast('success', 'Export CSV réussi');
  };

  // === CHARTS DATA ===
  const litigesParStatut = useMemo(() => {
    const counts = {};
    litiges.forEach(l => {
      const label = STATUS_LABELS[l.statut] || l.statut;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [litiges]);

  const litigesParCategorie = useMemo(() => {
    const counts = {};
    litiges.forEach(l => {
      counts[l.categorie] = (counts[l.categorie] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [litiges]);

  const litigesParPriorite = useMemo(() => {
    const counts = {};
    litiges.forEach(l => {
      counts[l.priorite] = (counts[l.priorite] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [litiges]);

  const evolutionMensuelle = useMemo(() => {
    const months = {};
    litiges.forEach(l => {
      if (!l.dateOuverture) return;
      const m = l.dateOuverture.slice(0, 7);
      months[m] = (months[m] || 0) + 1;
    });
    return Object.entries(months).sort().slice(-6).map(([name, value]) => ({
      name: name.slice(5, 7) + '/' + name.slice(2, 4),
      value
    }));
  }, [litiges]);

  // === SORT HANDLER ===
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <FiChevronDown size={12} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />;
  };

  // === RESET FILTERS ===
  const resetFilters = () => {
    setSearch('');
    setFilters({ statut: '', priorite: '', categorie: '', urgence: '' });
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const hasActiveFilters = search || Object.values(filters).some(v => v);

  if (litiges.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <FiAlertTriangle size={28} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Aucun litige</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Aucun litige n'est présent dans le système pour le moment.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* ============================= */}
      {/* SECTION 1: DASHBOARD KPI      */}
      {/* ============================= */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
        <StatCard icon={FiAlertTriangle} value={dashboardStats.ouverts} label="Ouverts" tone="amber" variation={`${dashboardStats.ouverts} en attente`} />
        <StatCard icon={FiBarChart2} value={dashboardStats.analyse} label="En analyse" tone="blue" />
        <StatCard icon={FiClock} value={dashboardStats.attente} label="En attente" tone="purple" />
        <StatCard icon={FiStar} value={dashboardStats.enCours} label="En cours" tone="orange" />
        <StatCard icon={FiCheckCircle} value={dashboardStats.resolus} label="Résolus" tone="green" />
        <StatCard icon={FiAlertTriangle} value={dashboardStats.urgents} label="Urgents" tone="red" variation={`${dashboardStats.urgents} critiques`} />
        <StatCard icon={FiTrendingUp} value={dashboardStats.tempsMoyen + 'j'} label="Temps moyen" tone="teal" variation={`${dashboardStats.nouveauxAujourdhui} aujourd'hui`} />
      </div>

      {/* ============================= */}
      {/* SECTION 2: TOOLBAR            */}
      {/* ============================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par n°, étudiant, centre, formation..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium ${
              hasActiveFilters
                ? 'border-brand-300 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FiFilter size={14} /> Filtres {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-500" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button onClick={() => setViewMode('table')} className={`p-2.5 ${viewMode === 'table' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <FiList size={14} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <FiGrid size={14} />
            </button>
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FiDownload size={14} /> CSV
          </button>
          <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FiPrinter size={14} /> PDF
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* SECTION 3: FILTERS PANEL      */}
      {/* ============================= */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Statut</label>
                <select value={filters.statut} onChange={(e) => setFilters(prev => ({ ...prev, statut: e.target.value }))}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200">
                  <option value="">Tous</option>
                  {STATUS_LITIGES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Priorité</label>
                <select value={filters.priorite} onChange={(e) => setFilters(prev => ({ ...prev, priorite: e.target.value }))}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200">
                  <option value="">Toutes</option>
                  {PRIORITES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Catégorie</label>
                <select value={filters.categorie} onChange={(e) => setFilters(prev => ({ ...prev, categorie: e.target.value }))}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200">
                  <option value="">Toutes</option>
                  {CATEGORIES_LITIGES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Urgence</label>
                <select value={filters.urgence} onChange={(e) => setFilters(prev => ({ ...prev, urgence: e.target.value }))}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200">
                  <option value="">Tous</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Élevé">Élevé</option>
                  <option value="Normal">Normal</option>
                  <option value="Faible">Faible</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="self-end flex items-center gap-1.5 px-3 py-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
                  <FiXCircle size={14} /> Réinitialiser
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================= */}
      {/* SECTION 4: TABLE VIEW         */}
      {/* ============================= */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                {[
                  { key: 'numeroDossier', label: 'N°' },
                  { key: 'etudiant', label: 'Étudiant' },
                  { key: 'centre', label: 'Centre' },
                  { key: 'formation', label: 'Formation' },
                  { key: 'priorite', label: 'Priorité' },
                  { key: 'statut', label: 'Statut' },
                  { key: 'dateOuverture', label: 'Date' },
                  { key: 'tempsEcoule', label: 'Temps' },
                  { key: 'actions', label: 'Actions' },
                ].map(col => (
                  <th key={col.key} className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${col.key !== 'actions' ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200' : ''}`}
                    onClick={() => col.key !== 'actions' && handleSort(col.key)}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.key !== 'actions' && <SortIcon columnKey={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginatedLitiges.map((litige) => (
                <motion.tr key={litige.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    <span className="text-xs font-mono">{litige.numeroDossier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                        {litige.etudiant?.nom?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{litige.etudiant?.nom || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{litige.centre?.nom || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{litige.formation?.titre || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[litige.priorite] || 'bg-slate-100 text-slate-600'}`}>
                      {litige.priorite}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[litige.statut] || 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABELS[litige.statut] || litige.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-500 dark:text-slate-400">
                    {litige.dateOuverture?.slice(0, 10) || '-'}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-500 dark:text-slate-400">{litige.tempsEcoule || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenDrawer(litige)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20" title="Voir"><FiEye size={14} /></button>
                      <button onClick={() => handleUpdateLitige(litige.id, { statut: litige.statut === 'ouvert' ? 'analyse' : litige.statut })} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Modifier"><FiEdit3 size={14} /></button>
                      <button onClick={() => handleContactEtudiant(litige.etudiant)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" title="Contacter étudiant"><FiMail size={14} /></button>
                      <button onClick={() => handleContactCentre(litige.centre)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Contacter centre"><FiPhone size={14} /></button>
                      <button onClick={() => setConfirmDelete(litige.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20" title="Supprimer"><FiTrash2 size={14} /></button>
                      <div className="relative group/more">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Plus d'actions"><FiMoreVertical size={14} /></button>
                        <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all duration-200">
                          <div className="py-1">
                            <button onClick={() => setConfirmResolve(litige.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"><FiCheckCircle size={12} /> Résoudre</button>
                            <button onClick={() => setConfirmArchive(litige.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"><FiArchive size={12} /> Archiver</button>
                            <button onClick={() => handleRequestDocuments(litige.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"><FiFile size={12} /> Demander justificatifs</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginatedLitiges.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    <FiSearch size={24} className="mx-auto mb-2 opacity-50" />
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {sortedLitiges.length} résultat{sortedLitiges.length !== 1 ? 's' : ''} — Page {currentPage}/{totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronLeft size={14} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === p ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================= */}
      {/* SECTION 5: GRID VIEW          */}
      {/* ============================= */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedLitiges.map((litige) => (
            <motion.div key={litige.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-mono text-slate-400">{litige.numeroDossier}</span>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{litige.titre}</h3>
                </div>
                <div className="flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[litige.priorite]}`}>{litige.priorite}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[litige.statut]}`}>{STATUS_LABELS[litige.statut]}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <p>Étudiant: <span className="text-slate-700 dark:text-slate-300 font-medium">{litige.etudiant?.nom}</span></p>
                <p>Centre: <span className="text-slate-700 dark:text-slate-300">{litige.centre?.nom}</span></p>
                <p>Formation: <span className="text-slate-700 dark:text-slate-300">{litige.formation?.titre}</span></p>
                <p>Date: {litige.dateOuverture?.slice(0, 10)} • {litige.tempsEcoule}</p>
              </div>
              <div className="flex items-center gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => handleOpenDrawer(litige)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20">Voir</button>
                <button onClick={() => handleContactEtudiant(litige.etudiant)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">Contact</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ============================= */}
      {/* SECTION 6: CHARTS             */}
      {/* ============================= */}
      <div className="grid gap-6 xl:grid-cols-2">
        <PieChartCard label="Litiges par statut" data={litigesParStatut} valueKey="value" nameKey="name" />
        <PieChartCard label="Litiges par catégorie" data={litigesParCategorie} valueKey="value" nameKey="name" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <PieChartCard label="Répartition des priorités" data={litigesParPriorite} valueKey="value" nameKey="name" />
        <DataChart data={evolutionMensuelle} dataKey="value" label="Évolution mensuelle des litiges" />
      </div>

      {/* ============================= */}
      {/* SECTION 7: DRAWER             */}
      {/* ============================= */}
      <LitigesDrawer
        litige={selectedLitige}
        onClose={() => { setDrawerOpen(false); setSelectedLitige(null); }}
        onUpdate={handleUpdateLitige}
        litiges={litiges}
        setLitiges={setLitiges}
      />

{/* ============================= */}
      {/* SECTION 8: CONFIRM DIALOGS    */}
      {/* ============================= */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer le litige"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce litige ? Cette action est irréversible."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => handleDeleteLitige(confirmDelete)}
      />
      <ConfirmDialog
        open={!!confirmArchive}
        title="Archiver le litige"
        message="Êtes-vous sûr de vouloir archiver ce litige ? Une fois archivé, il ne pourra plus être modifié."
        onCancel={() => setConfirmArchive(null)}
        onConfirm={() => handleArchiveLitige(confirmArchive)}
      />
      <ConfirmDialog
        open={!!confirmResolve}
        title="Résoudre le litige"
        message="Confirmez-vous la résolution de ce litige ? Le statut passera à 'Résolu'."
        onCancel={() => setConfirmResolve(null)}
        onConfirm={() => handleResolveLitige(confirmResolve)}
      />

      {/* ============================= */}
      {/* SECTION 9: TOAST              */}
      {/* ============================= */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LitigesPage;


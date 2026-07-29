import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Search,
  ShieldCheck,
  UserRoundPlus,
} from 'lucide-react';
import { LitigesDrawer } from './LitigesDrawer';
import { AdminPageShell } from './AdminPageShell';
import { loadLitigesFromStorage, saveLitigesToStorage } from '../../data/mockLitiges';

const STATUS_OPTIONS = [
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'assigne', label: 'Assigné' },
  { value: 'analyse', label: 'En analyse' },
  { value: 'attente_utilisateur', label: 'En attente utilisateur' },
  { value: 'attente_centre', label: 'En attente centre' },
  { value: 'validation', label: 'Validation' },
  { value: 'resolu', label: 'Résolu' },
  { value: 'archive', label: 'Archivé' },
];

const PRIORITY_OPTIONS = ['Critique', 'Haute', 'Moyenne', 'Faible'];

const statusTone = {
  nouveau: 'bg-slate-700 text-slate-100',
  assigne: 'bg-blue-700 text-white',
  analyse: 'bg-violet-700 text-white',
  attente_utilisateur: 'bg-amber-700 text-slate-950',
  attente_centre: 'bg-orange-700 text-slate-950',
  validation: 'bg-sky-700 text-white',
  resolu: 'bg-emerald-700 text-white',
  archive: 'bg-slate-600 text-slate-100',
};

const priorityTone = {
  Critique: 'bg-rose-700 text-white',
  Haute: 'bg-amber-700 text-slate-950',
  Moyenne: 'bg-sky-700 text-white',
  Faible: 'bg-emerald-700 text-white',
};

const normalizeLitige = (item) => {
  const rawStatus = item?.statut || item?.statusKey || item?.status || 'nouveau';
  const statusKey = STATUS_OPTIONS.some((option) => option.value === rawStatus) ? rawStatus : 'nouveau';
  const priority = item?.priority || item?.priorite || 'Moyenne';
  const resolvedPriority = priority === 'Critique' || priority === 'Haute' || priority === 'Moyenne' || priority === 'Faible' ? priority : 'Moyenne';
  const centreLabel = item?.centreLabel || item?.centre?.nom || item?.centre || 'Centre non défini';
  const formationLabel = item?.formationLabel || item?.formation?.titre || item?.formation || 'Formation non définie';
  const responsible = item?.responsable?.nom || item?.responsible || 'Non assigné';
  const statusStepMap = {
    nouveau: 'ouvert',
    assigne: 'en_cours',
    analyse: 'analyse',
    attente_utilisateur: 'attente_justificatifs',
    attente_centre: 'attente_justificatifs',
    validation: 'decision',
    resolu: 'resolu',
    archive: 'archive',
  };
  const drawerStatus = statusStepMap[statusKey] || 'ouvert';
  const drawerPriorityMap = { Critique: 'critique', Haute: 'haute', Moyenne: 'moyenne', Faible: 'basse' };

  return {
    ...item,
    id: item?.id || item?.numeroDossier || item?.reference || `DGS-${Date.now()}`,
    reference: item?.numeroDossier || item?.reference || item?.id || 'DGS-001',
    subject: item?.titre || item?.dossier || item?.subject || 'Dossier sans sujet',
    requester: item?.student || item?.requester || item?.etudiant?.nom || 'Demandeur inconnu',
    centre: centreLabel,
    centreLabel,
    responsible,
    responsibleLabel: responsible,
    priority: resolvedPriority,
    priorite: drawerPriorityMap[resolvedPriority] || 'moyenne',
    statusKey,
    status: STATUS_OPTIONS.find((option) => option.value === statusKey)?.label || 'Nouveau',
    statut: drawerStatus,
    createdAt: item?.dateOuverture || item?.date || item?.createdAt || '—',
    updatedAt: item?.derniereMAJ || item?.updatedAt || item?.createdAt || '—',
    sla: item?.sla || '24h',
    description: item?.description || 'Aucune description fournie.',
    documents: item?.piecesJointes || item?.documents || [],
    comments: item?.notesInternes || item?.comments || [],
    timeline: item?.historique || item?.timeline || [],
    conversation: item?.conversation || [],
    decision: item?.decisionFinale || item?.decision || '',
    decisionFinale: item?.decisionFinale || item?.decision || '',
    formation: formationLabel,
    formationLabel,
    category: item?.categorie || 'Service',
    categorie: item?.categorie || 'Service',
    piecesJointes: item?.piecesJointes || item?.documents || [],
    notesInternes: item?.notesInternes || item?.comments || [],
    historique: item?.historique || item?.timeline || [],
    numeroDossier: item?.numeroDossier || item?.reference || item?.id || 'DGS-001',
    titre: item?.titre || item?.dossier || item?.subject || 'Dossier sans sujet',
    dateOuverture: item?.dateOuverture || item?.date || item?.createdAt || '—',
    derniereMAJ: item?.derniereMAJ || item?.updatedAt || item?.createdAt || '—',
    tempsEcoule: item?.tempsEcoule || '0j',
    niveauUrgence: item?.niveauUrgence || (resolvedPriority === 'Critique' ? 'Urgent' : 'Élevé'),
    responsableData: item?.responsable?.nom ? item.responsable : { nom: responsible },
    etudiant: item?.etudiant || { nom: item?.student || item?.requester || 'Demandeur inconnu' },
    centreData: item?.centreData || { nom: centreLabel },
    formationData: item?.formationData || { titre: formationLabel },
    aiAnalysis: item?.aiAnalysis || { risque: resolvedPriority === 'Critique' ? 'Élevé' : 'Moyen', recommandation: 'Suivi opérationnel en cours.', confiance: 88, alerte: 'Dossier traité par l’équipe support' },
  };
};

export const LitigesView = () => {
  const [items, setItems] = useState(() => loadLitigesFromStorage().map(normalizeLitige));
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [responsableFilter, setResponsableFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [centreFilter, setCentreFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortKey, setSortKey] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [selectedLitige, setSelectedLitige] = useState(null);
  const [drawerTab, setDrawerTab] = useState('infos');
  const [viewMode, setViewMode] = useState('table');
  const pageSize = 6;

  useEffect(() => {
    saveLitigesToStorage(items.map((item) => ({
      ...item,
      statut: item.statusKey,
      status: item.status,
      priority: item.priority,
      responsible: item.responsible,
      centreLabel: item.centre,
      formationLabel: item.formation,
      piecesJointes: item.documents,
      notesInternes: item.comments,
      historique: item.timeline,
      conversation: item.conversation,
      decisionFinale: item.decision,
      titre: item.subject,
      dossier: item.subject,
      student: item.requester,
      dateOuverture: item.createdAt,
      derniereMAJ: item.updatedAt,
      sla: item.sla,
      description: item.description,
      categorie: item.category,
      centre: item.centre,
      formation: { titre: item.formation },
      etudiant: { nom: item.requester },
      responsable: { nom: item.responsible },
    })));
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase();
    return items.filter((item) => {
      const haystack = [item.reference, item.subject, item.requester, item.centre, item.responsible, item.priority, item.status, item.category].join(' ').toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;
      const matchesResponsable = !responsableFilter || item.responsible === responsableFilter;
      const matchesStatus = !statusFilter || item.statusKey === statusFilter;
      const matchesCentre = !centreFilter || item.centre === centreFilter;
      const matchesDate = !dateFilter || item.updatedAt.includes(dateFilter) || item.createdAt.includes(dateFilter);
      return matchesSearch && matchesPriority && matchesResponsable && matchesStatus && matchesCentre && matchesDate;
    });
  }, [centreFilter, dateFilter, items, priorityFilter, responsableFilter, search, statusFilter]);

  const sortedItems = useMemo(() => {
    const copy = [...filteredItems];
    copy.sort((a, b) => {
      const left = a[sortKey] ?? '';
      const right = b[sortKey] ?? '';
      if (typeof left === 'string' && typeof right === 'string') {
        return sortDirection === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
      }
      return sortDirection === 'asc' ? Number(left) - Number(right) : Number(right) - Number(left);
    });
    return copy;
  }, [filteredItems, sortDirection, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [page, pageSize, sortedItems]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));

  const metrics = useMemo(() => {
    const openCount = items.filter((item) => !['resolu', 'archive'].includes(item.statusKey)).length;
    const pendingCount = items.filter((item) => ['attente_utilisateur', 'attente_centre', 'validation'].includes(item.statusKey)).length;
    const inProgressCount = items.filter((item) => ['assigne', 'analyse'].includes(item.statusKey)).length;
    const resolvedToday = items.filter((item) => item.statusKey === 'resolu' && item.updatedAt.includes(new Date().toISOString().slice(0, 10))).length;
    const slaCount = items.filter((item) => ['resolu', 'validation', 'attente_centre', 'attente_utilisateur'].includes(item.statusKey)).length;
    return {
      openCount,
      pendingCount,
      inProgressCount,
      resolvedToday,
      avgResolution: `${Math.max(12, 24 - Math.min(10, openCount))}h`,
      slaCount,
      activeAdmins: 3,
    };
  }, [items]);

  const responsables = useMemo(() => [...new Set(items.map((item) => item.responsible))].filter(Boolean), [items]);
  const centres = useMemo(() => [...new Set(items.map((item) => item.centre))].filter(Boolean), [items]);

  const setSort = (key) => {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const updateItem = (id, updates) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const nextItem = { ...item, ...updates };
      if (updates?.statut && !updates?.statusKey) {
        const statusMap = {
          ouvert: 'nouveau',
          en_cours: 'assigne',
          analyse: 'analyse',
          attente_justificatifs: 'attente_utilisateur',
          decision: 'validation',
          resolu: 'resolu',
          archive: 'archive',
        };
        nextItem.statusKey = statusMap[updates.statut] || 'nouveau';
        nextItem.status = STATUS_OPTIONS.find((option) => option.value === nextItem.statusKey)?.label || 'Nouveau';
        nextItem.statut = updates.statut;
      }
      return nextItem;
    }));
    setNotice('Mise à jour enregistrée.');
  };

  const applyStatus = (id, nextStatus) => {
    const normalized = STATUS_OPTIONS.find((option) => option.value === nextStatus)?.value || nextStatus;
    updateItem(id, {
      statusKey: normalized,
      status: STATUS_OPTIONS.find((option) => option.value === normalized)?.label || normalized,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setNotice(`Statut mis à jour vers ${STATUS_OPTIONS.find((option) => option.value === normalized)?.label || normalized}.`);
  };

  const assignToMe = (id) => {
    updateItem(id, {
      responsible: 'Ahmed Ben Ali',
      statusKey: 'assigne',
      status: 'Assigné',
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setNotice('Dossier assigné à l’équipe support.');
  };

  const exportCsv = () => {
    const header = ['Référence', 'Sujet', 'Demandeur', 'Centre', 'Responsable', 'Priorité', 'Statut', 'SLA'];
    const rows = sortedItems.map((item) => [item.reference, item.subject, item.requester, item.centre, item.responsible, item.priority, item.status, item.sla]);
    const content = [header.join(','), ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case-management-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export CSV généré.');
  };

  const exportPdf = () => {
    const content = sortedItems.slice(0, 6).map((item) => `${item.reference} | ${item.subject} | ${item.status}`).join('\n');
    const pdf = `%PDF-1.4\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n4 0 obj<< /Length 44 >>stream\nBT /F1 12 Tf 72 720 Td (${content.replace(/\n/g, ' ')}) Tj ET\nendstream\nendobj\n5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000119 00000 n \n0000000206 00000 n \n0000000300 00000 n \ntrailer<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`;
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case-management-${new Date().toISOString().slice(0, 10)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export PDF généré.');
  };

  const openDrawer = (item, tab = 'infos') => {
    setSelectedLitige(normalizeLitige(item));
    setDrawerTab(tab);
  };

  const closeDrawer = () => {
    setSelectedLitige(null);
    setDrawerTab('infos');
  };

  const nextStatus = (currentStatus) => {
    const index = STATUS_OPTIONS.findIndex((option) => option.value === currentStatus);
    return STATUS_OPTIONS[Math.min(index + 1, STATUS_OPTIONS.length - 1)]?.value;
  };

  return (
    <AdminPageShell
      eyebrow="Case Management"
      title="Gestion des dossiers"
      subtitle="Traiter, suivre et résoudre chaque litige avec une expérience de travail claire et structurée."
      badge="Support opérationnel"
      className="space-y-6"
    >
      {notice ? <div className="rounded-2xl border border-emerald-800 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-200">{notice}</div> : null}

      <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">Pipeline</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Workflow des dossiers</h2>
            <p className="mt-2 text-sm text-slate-400">Orienté traitement, assignation, suivi client et décision finale.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 shadow-sm shadow-slate-900"><Download size={16} /> Export CSV</button>
            <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-500/20"><FileText size={16} /> Export PDF</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Dossiers ouverts</p>
            <ShieldCheck className="text-emerald-400" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.openCount}</p>
          <p className="mt-2 text-sm text-slate-500">À traiter aujourd’hui</p>
        </div>
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">En attente</p>
            <Clock3 className="text-amber-400" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.pendingCount}</p>
          <p className="mt-2 text-sm text-slate-500">Validation client ou centre</p>
        </div>
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Résolus aujourd’hui</p>
            <CheckCircle2 className="text-emerald-400" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.resolvedToday}</p>
          <p className="mt-2 text-sm text-slate-500">SLA : {metrics.slaCount} respectés</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Temps moyen</p>
            <Clock3 className="text-sky-400" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.avgResolution}</p>
          <p className="mt-2 text-sm text-slate-500">Temps de résolution moyen</p>
        </div>
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">SLA respectés</p>
            <ShieldCheck className="text-emerald-400" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.slaCount}</p>
          <p className="mt-2 text-sm text-slate-500">Sur les dossiers actifs</p>
        </div>
        <div className="rounded-[24px] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Administrateurs actifs</p>
            <UserRoundPlus className="text-violet-400" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.activeAdmins}</p>
          <p className="mt-2 text-sm text-slate-500">Équipe de traitement</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <Search size={16} className="text-slate-400" />
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Recherche globale" className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500" />
            </label>
            <select value={priorityFilter} onChange={(event) => { setPriorityFilter(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <option value="">Priorité</option>
              {PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select value={responsableFilter} onChange={(event) => { setResponsableFilter(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <option value="">Responsable</option>
              {responsables.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <option value="">Statut</option>
              {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={centreFilter} onChange={(event) => { setCentreFilter(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <option value="">Centre</option>
              {centres.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <input value={dateFilter} onChange={(event) => { setDateFilter(event.target.value); setPage(1); }} type="date" className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-2xl border border-slate-700">
              <button type="button" onClick={() => setViewMode('cards')} className={`p-2.5 ${viewMode === 'cards' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'}`}><LayoutGrid size={16} /></button>
              <button type="button" onClick={() => setViewMode('table')} className={`p-2.5 ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'}`}><ListIcon size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-100">
          <Filter size={16} /> Pipeline de traitement
        </div>
        <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-8">
          {STATUS_OPTIONS.map((column) => {
            const columnItems = paginatedItems.filter((item) => item.statusKey === column.value);
            return (
              <div key={column.value} className="rounded-[24px] border border-slate-800 bg-slate-950 p-3 shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">{column.label}</p>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-slate-400">{columnItems.length}</span>
                </div>
                <div className="space-y-2">
                  {columnItems.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 p-3 text-sm text-slate-500">Aucun dossier</div> : null}
                  {columnItems.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.reference}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-100">{item.subject}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${priorityTone[item.priority] || 'bg-slate-700 text-slate-100'}`}>{item.priority}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{item.requester} • {item.centre}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => openDrawer(item, 'infos')} className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-medium text-slate-200">Voir détail</button>
                        <button type="button" onClick={() => assignToMe(item.id)} className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-medium text-slate-200">Assigner</button>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <select value={item.statusKey} onChange={(event) => applyStatus(item.id, event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100">
                          {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                        <button type="button" onClick={() => applyStatus(item.id, nextStatus(item.statusKey))} className="rounded-xl bg-emerald-600 p-1.5 text-white"><ArrowRight size={14} /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-sm shadow-slate-950">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                {[
                  ['reference', 'Référence'],
                  ['subject', 'Sujet'],
                  ['requester', 'Demandeur'],
                  ['centre', 'Centre'],
                  ['responsible', 'Responsable'],
                  ['priority', 'Priorité'],
                  ['status', 'Statut'],
                  ['updatedAt', 'MAJ'],
                  ['sla', 'SLA'],
                  ['actions', 'Actions'],
                ].map(([key, label]) => (
                  <th key={key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label === 'Actions' ? label : <button type="button" onClick={() => setSort(key)} className="flex items-center gap-1 text-slate-300 hover:text-white">{label}</button>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-100">{item.reference}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-100">{item.subject}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.category}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.requester}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.centre}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.responsible}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityTone[item.priority] || 'bg-slate-700 text-slate-100'}`}>{item.priority}</span></td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[item.statusKey] || 'bg-slate-700 text-slate-100'}`}>{item.status}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.updatedAt}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.sla}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openDrawer(item, 'infos')} className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">Voir dossier</button>
                      <button type="button" onClick={() => assignToMe(item.id)} className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">Assigner</button>
                      <button type="button" onClick={() => openDrawer(item, 'documents')} className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">Justificatifs</button>
                      <button type="button" onClick={() => openDrawer(item, 'decision')} className="rounded-xl bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">Arbitrer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {paginatedItems.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-slate-800 bg-slate-950 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.30)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.reference}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">{item.subject}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.requester} • {item.centre}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityTone[item.priority] || 'bg-slate-700 text-slate-100'}`}>{item.priority}</span>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-900/80 p-3 text-sm text-slate-200">
                <div className="flex items-center justify-between"><span>Responsable</span><span>{item.responsible}</span></div>
                <div className="flex items-center justify-between"><span>Statut</span><span>{item.status}</span></div>
                <div className="flex items-center justify-between"><span>SLA</span><span>{item.sla}</span></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => openDrawer(item, 'infos')} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">Voir dossier</button>
                <button type="button" onClick={() => openDrawer(item, 'documents')} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">Justificatifs</button>
                <button type="button" onClick={() => assignToMe(item.id)} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Assigner</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-[24px] border border-slate-800 bg-slate-950 px-4 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.30)]">
        <p className="text-sm text-slate-300">Page {page}/{totalPages} • {sortedItems.length} dossiers</p>
        <div className="flex items-center gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 disabled:opacity-50">Précédent</button>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 disabled:opacity-50">Suivant</button>
        </div>
      </div>

      <LitigesDrawer litige={selectedLitige} onClose={closeDrawer} onUpdate={updateItem} litiges={items} setLitiges={setItems} initialTab={drawerTab} />
    </AdminPageShell>
  );
};

export default LitigesView;

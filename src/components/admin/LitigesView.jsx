import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { TicketManagerLayout } from './TicketManagerLayout';
import { LitigesDrawer } from './LitigesDrawer';
import { AdminPageShell } from './AdminPageShell';
import { Badge } from '../UI/Badge';
import { KpiCard } from '../UI/KpiCard';
import { Panel } from '../UI/Panel';
import { SectionHeader } from '../UI/SectionHeader';
import { PriorityChip } from '../UI/PriorityChip';
import { StatusChip } from '../UI/StatusChip';

const initialLitiges = [
  {
    id: 'LTG-6026',
    student: 'Alicia Martin',
    centre: 'Centre Paris 8',
    formation: 'React Avancé',
    priority: 'Critique',
    status: 'En cours',
    date: '2026-07-28',
    sla: '12h restantes',
    dossier: 'Paiement non reçu',
  },
  {
    id: 'LTG-6027',
    student: 'Omar Diallo',
    centre: 'Centre Lyon',
    formation: 'UX Design',
    priority: 'Moyen',
    status: 'Attente justificatifs',
    date: '2026-07-27',
    sla: '48h restantes',
    dossier: 'Cours non dispensé',
  },
  {
    id: 'LTG-6028',
    student: 'Nadia Fell',
    centre: 'Centre Lille',
    formation: 'Data Analyst',
    priority: 'Faible',
    status: 'Résolu',
    date: '2026-07-26',
    sla: 'Clôturé',
    dossier: 'Demande de remboursement',
  },
];

export const LitigesView = () => {
  const [items, setItems] = useState(initialLitiges);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [notice, setNotice] = useState('');
  const [selectedLitige, setSelectedLitige] = useState(null);
  const [drawerTab, setDrawerTab] = useState('infos');

  const filteredItems = useMemo(() => {
    const searchValue = search.toLowerCase();
    return items.filter((item) => {
      const matchesSearch = !searchValue || [item.id, item.student, item.centre, item.formation, item.dossier].join(' ').toLowerCase().includes(searchValue);
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [items, search, statusFilter, priorityFilter]);

  const metrics = useMemo(() => ({
    urgent: items.filter((item) => item.priority === 'Critique').length,
    pending: items.filter((item) => item.status !== 'Résolu').length,
    response: '24h',
    resolved: items.filter((item) => item.status === 'Résolu').length,
  }), [items]);

  const toggleSelected = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  const selectAllVisible = () => {
    const ids = filteredItems.map((item) => item.id);
    setSelectedIds((prev) => (prev.length === ids.length ? [] : ids));
  };

  const updateItem = (id, updates) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    setNotice('Décision enregistrée.');
  };

  const openLitigeDrawer = (litige, tab = 'infos') => {
    setSelectedLitige(litige);
    setDrawerTab(tab);
  };

  const closeLitigeDrawer = () => {
    setSelectedLitige(null);
    setDrawerTab('infos');
  };

  const exportCsv = () => {
    const header = ['ID', 'Étudiant', 'Centre', 'Formation', 'Priorité', 'Statut', 'SLA'];
    const rows = filteredItems.map((item) => [item.id, item.student, item.centre, item.formation, item.priority, item.status, item.sla]);
    const content = [header.join(','), ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `litiges-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export CSV téléchargé.');
  };

  const exportPdf = () => {
    const content = `%PDF-1.4\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n4 0 obj<< /Length 44 >>stream\nBT /F1 18 Tf 72 720 (Litiges SkillBridge) Tj ET\nendstream\nendobj\n5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000119 00000 n \n0000000206 00000 n \n0000000300 00000 n \ntrailer<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `litiges-${new Date().toISOString().slice(0, 10)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export PDF téléchargé.');
  };

  const bulkResolve = () => {
    setItems((prev) => prev.map((item) => (selectedIds.includes(item.id) ? { ...item, status: 'Résolu' } : item)));
    setSelectedIds([]);
    setNotice('Litiges sélectionnés résolus.');
  };

  return (
    <AdminPageShell
      eyebrow="Procédure"
      title="Gestion des litiges"
      subtitle="Console de suivi procédural et financier pour les dossiers étudiants, centres et formations."
      badge="SLA actif"
      className="space-y-6"
    >
      {notice ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">{notice}</div> : null}
      <SectionHeader
        eyebrow="Litiges"
        title="Pilotage opérationnel des dossiers"
        description="Résolvez rapidement les litiges avec une vue consolidée des priorités, des SLA et des parties prenantes."
        actions={
          <Badge label={`${metrics.urgent} critiques`} tone="danger" />
        }
      />
      <Panel borderless>
        <div className="grid gap-4 lg:grid-cols-3">
          <KpiCard label="Dossiers ouverts" value={metrics.pending} delta="Priorité aujourd’hui" icon={AlertTriangle} tone="amber" />
          <KpiCard label="Urgents" value={metrics.urgent} delta="Critique" icon={ShieldCheck} tone="rose" />
          <KpiCard label="SLA moyenne" value={metrics.response} delta="Réponse en" icon={Clock3} tone="sky" />
        </div>
      </Panel>
      <TicketManagerLayout
        title="Gestion des litiges"
        subtitle="Console de suivi procédural et financier pour les dossiers étudiants, centres et formations."
        breadcrumb="Litiges"
        stats={[
          { label: 'Dossiers ouverts', value: metrics.pending, icon: AlertTriangle, tone: 'text-amber-600', helper: 'À traiter', helperTone: 'text-amber-500' },
          { label: 'Urgents', value: metrics.urgent, icon: ShieldCheck, tone: 'text-rose-600', helper: 'Critiques', helperTone: 'text-rose-500' },
          { label: 'Temps restant SLA', value: metrics.response, icon: Clock3, tone: 'text-sky-600', helper: 'En moyenne', helperTone: 'text-sky-500' },
          { label: 'Résolus', value: metrics.resolved, icon: CheckCircle2, tone: 'text-emerald-600', helper: 'Clôturés', helperTone: 'text-emerald-500' },
        ]}
        searchValue={search}
        onSearchChange={setSearch}
        filterControls={[
          { key: 'status', label: 'Statut', value: statusFilter, onChange: setStatusFilter, options: ['En cours', 'Attente justificatifs', 'Résolu'].map((value) => ({ value, label: value })) },
          { key: 'priority', label: 'Priorité', value: priorityFilter, onChange: setPriorityFilter, options: ['Critique', 'Moyen', 'Faible'].map((value) => ({ value, label: value })) },
        ]}
        onExportCsv={exportCsv}
        onExportPdf={exportPdf}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedIds.length}
        onSelectAllVisible={selectAllVisible}
        bulkActions={[{ label: 'Marquer comme résolu', onClick: bulkResolve, className: 'bg-emerald-600' }]}
        pagination={null}
        emptyState={filteredItems.length === 0 ? 'Aucun litige ne correspond à ces filtres.' : null}
      >
        {viewMode === 'table' ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Sélection</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">ID Ticket</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Étudiant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Centre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Priorité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">SLA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelected(item.id)} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.student}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.centre}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.formation}</td>
                    <td className="px-4 py-3"><PriorityChip label={item.priority} tone={item.priority === 'Critique' ? 'critical' : item.priority === 'Moyen' ? 'medium' : 'low'} /></td>
                    <td className="px-4 py-3"><StatusChip label={item.status} tone={item.status === 'Résolu' ? 'stable' : item.status === 'En cours' ? 'warning' : 'pending'} /></td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.sla}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => { openLitigeDrawer(item, 'infos'); setNotice(`Dossier ${item.id} ouvert.`); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Voir dossier</button>
                        <button type="button" onClick={() => { openLitigeDrawer(item, 'documents'); setNotice('Justificatifs consultés.'); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Justificatifs</button>
                        <button type="button" onClick={() => { openLitigeDrawer(item, 'decision'); setNotice(`Arbitrage ouvert pour ${item.id}.`); }} className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white">Arbitrer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredItems.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.id}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.dossier}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.student} • {item.centre}</p>
                  </div>
                  <PriorityChip label={item.priority} tone={item.priority === 'Critique' ? 'critical' : item.priority === 'Moyen' ? 'medium' : 'low'} />
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
                  <div className="flex items-center justify-between"><span>Formation</span><span>{item.formation}</span></div>
                  <div className="flex items-center justify-between"><span>Statut</span><span>{item.status}</span></div>
                  <div className="flex items-center justify-between"><span>SLA</span><span>{item.sla}</span></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => { openLitigeDrawer(item, 'infos'); setNotice(`Dossier ${item.id} ouvert.`); }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Voir dossier</button>
                  <button type="button" onClick={() => { openLitigeDrawer(item, 'documents'); setNotice('Justificatifs consultés.'); }} className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white">Médiation</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TicketManagerLayout>
      <LitigesDrawer litige={selectedLitige} onClose={closeLitigeDrawer} onUpdate={updateItem} litiges={items} setLitiges={setItems} initialTab={drawerTab} />
    </AdminPageShell>
  );
};

export default LitigesView;

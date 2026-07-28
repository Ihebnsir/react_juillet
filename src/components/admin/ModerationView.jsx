import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ModerationHeader from './moderation/ModerationHeader';
import ModerationKPICards from './moderation/ModerationKPICards';
import RiskAlerts from './moderation/RiskAlerts';
import ModerationFilters from './moderation/ModerationFilters';
import ModerationTable from './moderation/ModerationTable';
import UserRiskDrawer from './moderation/UserRiskDrawer';
import AdminActionTimeline from './moderation/AdminActionTimeline';
import GlobalScoreGauge from './GlobalScoreGauge';
import AIAssistant from './AIAssistant';
import PlatformTrends from './PlatformTrends';
import {
  mockModerationAlerts,
  mockModerationKPIs,
  mockModerationNotes,
  mockRiskUsers,
  SECURITY_OVERVIEW,
  loadModerationAlertsFromStorage,
  saveModerationAlertsToStorage,
  loadModerationTableFromStorage,
  saveModerationTableToStorage,
  mockModerationCenters,
  mockModerationWatchlist,
  mockModerationHeatmap,
  mockModerationCompliance,
  mockModerationAISuggestions,
} from '../../data/mockModeration';
import { loadLitigesFromStorage, saveLitigesToStorage } from '../../data/mockLitiges';

const PAGE_SIZE = 6;

const ComplianceBadge = ({ label, score, tone }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-white">{label}</p>
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone === 'success' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-amber-500/10 text-amber-200'}`}>{score}%</span>
    </div>
    <p className="mt-3 text-xs text-slate-400">Mesure de conformité en temps réel.</p>
  </div>
);

export const ModerationView = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alerts, setAlerts] = useState(() => loadModerationAlertsFromStorage());
  const [tableRows] = useState(() => loadModerationTableFromStorage());
  const [actions, setActions] = useState(mockModerationNotes);
  const [litiges, setLitiges] = useState(() => loadLitigesFromStorage());
  const [notice, setNotice] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const currentDate = useMemo(
    () => new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
    []
  );

  const overview = useMemo(
    () => ({
      ...SECURITY_OVERVIEW,
      currentDate,
    }),
    [currentDate]
  );

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

  const addAction = useCallback((payload) => {
    setActions((prev) => [{ id: `act-${Date.now()}`, ...payload }, ...prev]);
  }, []);

  const openUserDrawer = useCallback((userId) => {
    const user = mockRiskUsers.find((item) => item.id === userId);
    if (user) {
      setSelectedUser(user);
      setDrawerOpen(true);
    }
  }, []);

  const createLitigeFromAlert = useCallback(
    (alert) => {
      const randomIndex = Math.floor(Math.random() * mockRiskUsers.length);
      const matchedUser = mockRiskUsers[randomIndex];
      const newLitige = {
        id: `litige-${String(litiges.length + 1).padStart(4, '0')}`,
        numeroDossier: `LTG-${String(2026000 + litiges.length + 1).slice(-4)}`,
        titre: alert.type,
        description: alert.message,
        categorie: alert.category,
        priorite: alert.riskLevel === 'Critique' ? 'critique' : alert.riskLevel === 'Élevé' ? 'haute' : 'moyenne',
        statut: 'ouvert',
        dateOuverture: new Date().toISOString().split('T')[0],
        derniereMAJ: new Date().toISOString().split('T')[0],
        tempsEcoule: '0j',
        sla: '24h',
        niveauUrgence: alert.riskLevel === 'Critique' ? 'Urgent' : 'Élevé',
        responsable: { nom: 'Admin Principal' },
        etudiant: { nom: matchedUser.name, email: matchedUser.email, tel: matchedUser.tel || '+216 00 000 000' },
        centre: { nom: alert.role === 'Centre' ? alert.user : 'SkillBridge', email: 'contact@skillbridge.tn', tel: '+216 71 000 000' },
        formation: { titre: 'Audit de modération' },
        piecesJointes: [],
        conversation: [],
        historique: [{ date: new Date().toISOString().split('T')[0], action: 'Création automatique depuis la modération', auteur: 'Système', details: alert.message }],
        notesInternes: [{ id: `note-${Date.now()}`, date: new Date().toLocaleDateString('fr-FR'), auteur: 'Système', contenu: 'Litige créé automatiquement depuis une alerte critique de modération.' }],
      };
      setLitiges((prev) => [newLitige, ...prev]);
      addAction({ admin: 'Admin Modération', action: 'Création de litige automatique', target: newLitige.numeroDossier, date: new Date().toLocaleString('fr-FR'), ip: '196.201.45.100' });
      setNotice(`Litige créé : ${newLitige.numeroDossier}`);
    },
    [addAction, litiges.length]
  );

  const updateAlert = useCallback((alertId, changes, actionText) => {
    setAlerts((prev) => prev.map((item) => (item.id === alertId ? { ...item, ...changes } : item)));
    if (actionText) {
      addAction({ admin: 'Admin Modération', action: actionText, target: alertId, date: new Date().toLocaleDateString('fr-FR'), ip: '196.201.45.101' });
    }
  }, [addAction]);

  const examineAlert = useCallback((alert) => {
    updateAlert(alert.id, { status: 'En revue' }, 'A examiné une alerte');
    setNotice(`Alerte ${alert.id} en revue.`);
  }, [updateAlert]);

  const monitorAlert = useCallback((alert) => {
    updateAlert(alert.id, { status: 'Surveillance' }, 'A placé l’alerte en surveillance');
    setNotice(`Alerte ${alert.id} sous surveillance.`);
  }, [updateAlert]);

  const suspendAlert = useCallback((alert) => {
    updateAlert(alert.id, { status: 'Suspendu' }, 'A suspendu le compte lié à l’alerte');
    setNotice(`Compte de ${alert.user} suspendu.`);
  }, [updateAlert]);

  const ignoreAlert = useCallback((alert) => {
    updateAlert(alert.id, { status: 'Ignoré' }, 'A ignoré l’alerte');
    setNotice(`Alerte ${alert.id} ignorée.`);
  }, [updateAlert]);

  const warnAlert = useCallback((alert) => {
    updateAlert(alert.id, { status: 'Avertissement' }, 'A envoyé un avertissement');
    setNotice(`Avertissement envoyé pour ${alert.user}.`);
  }, [updateAlert]);

  const scheduleVerification = useCallback((alert) => {
    updateAlert(alert.id, { status: 'Vérification programmée' }, 'A programmé une vérification');
    setNotice(`Vérification programmée pour ${alert.user}.`);
  }, [updateAlert]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch = !searchValue || [alert.type, alert.user, alert.role, alert.category, alert.message].join(' ').toLowerCase().includes(searchValue);
      const matchesRole = !roleFilter || alert.role === roleFilter;
      const matchesRisk = !riskFilter || alert.riskLevel === riskFilter;
      const matchesStatus = !statusFilter || alert.status === statusFilter;
      return matchesSearch && matchesRole && matchesRisk && matchesStatus;
    });
  }, [alerts, search, roleFilter, riskFilter, statusFilter]);

  const filteredTableRows = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return tableRows.filter((row) => {
      const matchesSearch = !searchValue || [row.id, row.type, row.user, row.role, row.category, row.description].join(' ').toLowerCase().includes(searchValue);
      const matchesRole = !roleFilter || row.role === roleFilter;
      const matchesRisk = !riskFilter || row.risk === riskFilter;
      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesSearch && matchesRole && matchesRisk && matchesStatus;
    });
  }, [tableRows, search, roleFilter, riskFilter, statusFilter]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredTableRows];
    rows.sort((a, b) => {
      const valueA = a[sortConfig.key] ?? '';
      const valueB = b[sortConfig.key] ?? '';
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB, 'fr')
          : valueB.localeCompare(valueA, 'fr');
      }
      return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
    return rows;
  }, [filteredTableRows, sortConfig]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredTableRows.length / PAGE_SIZE)), [filteredTableRows.length]);
  const pagedRows = useMemo(() => sortedRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [sortedRows, currentPage]);

  const trends = useMemo(
    () => ({
      inscriptionGrowth: 12,
      reservationGrowth: 9,
      centreGrowth: 15,
      weeklyActivity: 28,
      previousMonthComparison: 11,
    }),
    []
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {notice && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-lg shadow-emerald-500/10">
          {notice}
        </motion.div>
      )}

      <ModerationHeader overview={overview} onCreateLitige={() => createLitigeFromAlert(alerts[0] ?? mockModerationAlerts[0])} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <ModerationKPICards kpis={mockModerationKPIs} />

          <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Santé de la plateforme</p>
                <h2 className="text-2xl font-semibold text-white">Indice de confiance Trust & Safety</h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-400">Synthèse du risque, de la conformité et de la surveillance active.</p>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <GlobalScoreGauge globalScore={overview.securityScore} performanceScore={88} securityScore={overview.securityScore} availabilityScore={92} satisfactionScore={91} growthScore={13} />
              <AIAssistant suggestions={mockModerationAISuggestions} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Analyse comportementale</p>
                  <h2 className="text-2xl font-semibold text-white">Flux de détection</h2>
                </div>
              </div>
              <div className="mt-6">
                <PlatformTrends trends={trends} />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Indicateurs de conformité</p>
              <h2 className="text-2xl font-semibold text-white">Contrôles actifs</h2>
              <div className="mt-6 space-y-4">
                {mockModerationCompliance.map((item) => (
                  <ComplianceBadge key={item.label} label={item.label} score={item.score} tone={item.tone} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Centres à vérifier</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Contrôles programmés</h2>
            <div className="mt-6 space-y-4">
              {mockModerationCenters.map((centre) => (
                <div key={centre.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{centre.nom}</p>
                      <p className="text-sm text-slate-400">Dernière revue : {centre.lastReview}</p>
                    </div>
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-200">{centre.status}</span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-400">
                    <div className="rounded-2xl bg-slate-950/80 p-3">Alertes : {centre.alertCount}</div>
                    <div className="rounded-2xl bg-slate-950/80 p-3">Risque : {centre.verificationRisk}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Surveillance active</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Watchlist des comptes</h2>
            <div className="mt-6 space-y-4">
              {mockModerationWatchlist.map((user) => (
                <div key={user.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.role} • {user.lastActivity}</p>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-200">Trust {user.trustScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="space-y-6">
          <ModerationFilters
            search={search}
            roleFilter={roleFilter}
            riskFilter={riskFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onRoleChange={setRoleFilter}
            onRiskChange={setRiskFilter}
            onStatusChange={setStatusFilter}
          />

          <ModerationTable
            rows={pagedRows}
            sortConfig={sortConfig}
            onSort={(key) => {
              setSortConfig((prev) => {
                if (prev.key === key) {
                  return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
                }
                return { key, direction: 'asc' };
              });
            }}
            onViewUser={openUserDrawer}
            onAssign={monitorAlert}
            onCreateLitige={createLitigeFromAlert}
            onStatusChange={examineAlert}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          />
        </div>

        <div className="space-y-6">
          <RiskAlerts
            alerts={filteredAlerts}
            onViewDetail={openUserDrawer}
            onCreateLitige={createLitigeFromAlert}
            onSuspend={suspendAlert}
            onIgnore={ignoreAlert}
            onMonitor={monitorAlert}
            onWarn={warnAlert}
            onSchedule={scheduleVerification}
          />

          <AdminActionTimeline items={actions} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Heatmap des incidents</p>
              <h2 className="text-2xl font-semibold text-white">Zones de risques</h2>
            </div>
            <span className="rounded-2xl bg-brand-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-brand-200">Trend actif</span>
          </div>
          <div className="mt-6 space-y-6">
            {mockModerationHeatmap.map((row) => (
              <div key={row.label} className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{row.label}</span>
                  <span className="font-semibold text-white">{row.values.reduce((sum, value) => sum + value, 0)}</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {row.values.map((value, idx) => (
                    <div key={idx} className={`h-10 rounded-2xl transition ${value >= 5 ? 'bg-rose-500' : value >= 3 ? 'bg-amber-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((label) => (
                    <span key={label} className="w-full text-center">{label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Flux des événements</p>
              <h2 className="text-2xl font-semibold text-white">Événements récents</h2>
            </div>
            <span className="rounded-2xl bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">Realtime</span>
          </div>
          <div className="mt-6 space-y-4">
            {filteredAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
                  <span>{alert.date}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{alert.riskLevel}</span>
                </div>
                <p className="mt-3 text-base font-semibold text-white">{alert.type}</p>
                <p className="mt-2 text-sm text-slate-400">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UserRiskDrawer open={drawerOpen} user={selectedUser} onClose={() => setDrawerOpen(false)} />
    </motion.div>
  );
};

export default ModerationView;

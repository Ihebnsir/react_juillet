import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiUserCheck, FiUserX, FiSearch, FiFilter,
  FiEye, FiEdit2, FiLock, FiUnlock, FiMail, FiKey,
  FiCheckCircle, FiXCircle, FiTrash2, FiDownload, FiPrinter,
  FiGrid, FiList, FiChevronDown, FiChevronUp, FiPlus,
  FiUserPlus, FiMapPin, FiPhone, FiMail as FiMailIcon,
  FiFileText, FiActivity, FiInfo,
  FiChevronLeft, FiChevronRight, FiBookOpen, FiAward, FiAlertCircle,
  FiBarChart2, FiClock as FiClockIcon,
} from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { useActivityLog } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { ModalShell } from '../../components/UI/ModalShell';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
import { mockApprenants } from '../../data/mockUsers';

// ================================================================
// CONSTANTS
// ================================================================
const PAGE_SIZE = 8;
const STATUT_COLORS = {
  actif: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  suspendu: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  en_attente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  desactive: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};
const STATUT_LABELS = {
  actif: 'Actif',
  suspendu: 'Suspendu',
  en_attente: 'En attente',
  desactive: 'Désactivé',
};
const NIVEAU_COLORS = {
  'Débutant': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Intermédiaire': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Avancé': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};
const WORKFLOW_STEPS = [
  { key: 'cree', label: 'Créé', icon: FiUserPlus },
  { key: 'email_verifie', label: 'Email vérifié', icon: FiMail },
  { key: 'profil_complete', label: 'Profil complété', icon: FiCheckCircle },
  { key: 'actif', label: 'Actif', icon: FiUserCheck },
  { key: 'suspendu', label: 'Suspendu', icon: FiLock },
  { key: 'archive', label: 'Archivé', icon: FiXCircle },
];

// ================================================================
// HELPERS
// ================================================================
const formatDate = (d) => {
  if (!d) return '—';
  try {
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return '—'; }
};

const formatRelative = (d) => {
  if (!d) return '';
  try {
    const now = new Date();
    const date = new Date(d);
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} sem`;
    return formatDate(d);
  } catch { return formatDate(d); }
};

const getStatutBadge = (statut) => {
  const color = STATUT_COLORS[statut] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  const label = STATUT_LABELS[statut] || statut;
  const dotColor = statut === 'actif' ? 'bg-emerald-500'
    : statut === 'suspendu' ? 'bg-rose-500'
    : statut === 'en_attente' ? 'bg-amber-500'
    : 'bg-slate-400';
  return { color, label, dotColor };
};

const getAvatarUrl = (user) => {
  if (user.avatar) return user.avatar;
  const seed = encodeURIComponent(user.nom || user.email || 'user');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

const generateNotification = (action, userId) => {
  const messages = {
    suspendu: 'Compte apprenant suspendu.',
    reactiver: 'Compte apprenant réactivé.',
    verifier: 'Profil apprenant vérifié.',
    reset_password: 'Mot de passe réinitialisé.',
    desactiver: 'Compte apprenant désactivé.',
    supprimer: 'Compte apprenant supprimé.',
    modifier: 'Profil apprenant modifié.',
    message: 'Message envoyé à l\'apprenant.',
  };
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role: 'admin',
    userId: userId || 'system',
    title: 'Action administrateur',
    message: messages[action] || 'Action effectuée.',
    category: 'admin',
    kind: 'system',
    lu: false,
    createdAt: new Date().toISOString(),
  };
};

// ================================================================
// PROGRESS BAR COMPONENT
// ================================================================
const ProgressBar = ({ value, size = 'sm', showLabel = true }) => {
  const getColor = (v) => {
    if (v >= 80) return 'bg-emerald-500';
    if (v >= 50) return 'bg-brand-500';
    if (v >= 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 rounded-full bg-slate-200 dark:bg-slate-700 ${heights[size] || heights.sm}`}>
        <div
          className={`rounded-full transition-all duration-500 ${heights[size] || heights.sm} ${getColor(value)}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 min-w-[2rem] text-right">
          {value}%
        </span>
      )}
    </div>
  );
};

// ================================================================
// PROFILE DRAWER COMPONENT
// ================================================================
const ProfileDrawer = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl dark:bg-slate-800"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Profil apprenant</h2>
              <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar & Name */}
              <div className="text-center">
                <img
                  src={getAvatarUrl(user)}
                  alt={user.nom}
                  className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-lg"
                />
                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">{user.nom}</h3>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${NIVEAU_COLORS[user.niveau] || 'bg-slate-100 text-slate-700'}`}>
                  {user.niveau || 'Non défini'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-brand-50 p-3 text-center dark:bg-brand-900/20">
                  <p className="text-lg font-bold text-brand-700 dark:text-brand-300">{(user.formations || []).length}</p>
                  <p className="text-xs text-brand-600 dark:text-brand-400">Formations</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{(user.historique || []).length}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Activités</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-900/20">
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{user.progress || 0}%</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Progression</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <FiInfo size={14} /> Informations personnelles
                </h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm dark:border-slate-700 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <FiMailIcon size={14} className="text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone size={14} className="text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{user.telephone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} className="text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{user.ville || '—'}</span>
                  </div>
                  {user.centreAssocie && (
                    <div className="flex items-center gap-2">
                      <FiBookOpen size={14} className="text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{user.centreAssocie}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Formation & Progression */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <FiBarChart2 size={14} /> Formation suivie
                </h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.formationPrincipale || '—'}
                  </p>
                  <div className="mt-2">
                    <ProgressBar value={user.progress || 0} size="md" />
                  </div>
                  {user.formations && user.formations.length > 1 && (
                    <div className="mt-3 space-y-1">
                      {user.formations.slice(1).map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{f}</span>
                          <span className="text-slate-400">
                            {user.formationProgression?.[f] || 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Verifications */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vérifications</h4>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Email vérifié</span>
                  {user.emailVerifie
                    ? <FiCheckCircle className="text-emerald-500" size={18} />
                    : <FiXCircle className="text-rose-500" size={18} />}
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Profil vérifié</span>
                  {user.profilVerifie
                    ? <FiCheckCircle className="text-emerald-500" size={18} />
                    : <FiXCircle className="text-rose-500" size={18} />}
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Profil complété</span>
                  {user.profilComplete
                    ? <FiCheckCircle className="text-emerald-500" size={18} />
                    : <FiXCircle className="text-rose-500" size={18} />}
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dates</h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm dark:border-slate-700 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Inscription</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(user.dateInscription)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dernière connexion</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{formatRelative(user.derniereConnexion)}</span>
                  </div>
                </div>
              </div>

              {/* Formations */}
              {user.formations && user.formations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <FiAward size={14} /> Formations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.formations.map((f, i) => (
                      <span key={i} className="rounded-lg bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {user.activiteRecente && user.activiteRecente.length > 0 && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <FiActivity size={14} /> Activité récente
                  </h4>
                  <div className="space-y-1">
                    {user.activiteRecente.slice(0, 5).map((a, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/50">
                        <span className="text-slate-600 dark:text-slate-400">{a.action}</span>
                        <span className="text-slate-400">{formatRelative(a.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Internes */}
              {user.notesInternes && user.notesInternes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <FiFileText size={14} /> Notes internes
                  </h4>
                  <div className="space-y-1">
                    {user.notesInternes.slice(0, 3).map((note, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{note.auteur}</div>
                        <p className="mt-0.5 text-slate-500">{note.contenu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ================================================================
// WORKFLOW COMPONENT
// ================================================================
const WorkflowVisual = ({ current }) => {
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1 py-2">
      {WORKFLOW_STEPS.map((step, idx) => {
        const isCompleted = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] transition-all duration-300 ${
                  isCompleted
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                } ${isCurrent ? 'ring-2 ring-brand-300 ring-offset-2 dark:ring-offset-slate-800' : ''}`}
                title={step.label}
              >
                {isCompleted ? <FiCheckCircle size={12} /> : <step.icon size={12} />}
              </div>
              <span className={`mt-1 text-[9px] font-medium ${isCompleted ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {idx < WORKFLOW_STEPS.length - 1 && (
              <div
                className={`h-px flex-1 ${
                  idx < currentIndex
                    ? 'bg-brand-400'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ================================================================
// MAIN PAGE COMPONENT
// ================================================================
export const UtilisateursPage = () => {
  const { user: authUser } = useAuth();
  const { addNotification } = useNotifications();
  const { recordActivity } = useActivityLog();
  const tableRef = useRef(null);

  // ----- State -----
  const [apprenants, setApprenants] = useState(() => [...mockApprenants]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    statut: 'all',
    ville: 'all',
    formation: 'all',
    dateInscription: 'all',
    profilVerifie: 'all',
    profilComplete: 'all',
  });
  const [sortField, setSortField] = useState('nom');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [notesModal, setNotesModal] = useState({ open: false, user: null });
  const [historyModal, setHistoryModal] = useState({ open: false, user: null });
  const [workflowModal, setWorkflowModal] = useState({ open: false, user: null });
  const [confirmState, setConfirmState] = useState({ open: false, id: null, action: null });
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // Local state for edit form
  const [editForm, setEditForm] = useState({ nom: '', email: '', telephone: '', ville: '' });
  // Local state for notes
  const [noteText, setNoteText] = useState('');

  // ----- Derived Data -----
  const cities = useMemo(() => ['all', ...new Set(apprenants.map((u) => u.ville).filter(Boolean))], [apprenants]);
  const allFormations = useMemo(() => {
    const set = new Set();
    apprenants.forEach((u) => (u.formations || []).forEach((f) => set.add(f)));
    return ['all', ...Array.from(set).sort()];
  }, [apprenants]);

  const filteredApprenants = useMemo(() => {
    return apprenants.filter((u) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          u.nom, u.email, u.telephone, u.ville,
          ...(u.formations || []),
          u.formationPrincipale,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Status filter
      if (filters.statut !== 'all' && u.statut !== filters.statut) return false;
      // City filter
      if (filters.ville !== 'all' && u.ville !== filters.ville) return false;
      // Formation filter
      if (filters.formation !== 'all' && (!u.formations || !u.formations.includes(filters.formation))) return false;
      // Date d'inscription filter
      if (filters.dateInscription !== 'all') {
        const date = new Date(u.dateInscription);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (filters.dateInscription === '7j' && diffDays > 7) return false;
        if (filters.dateInscription === '30j' && diffDays > 30) return false;
        if (filters.dateInscription === '90j' && diffDays > 90) return false;
        if (filters.dateInscription === 'annee' && diffDays > 365) return false;
      }
      // Profil verifie filter
      if (filters.profilVerifie === 'verifie' && !u.profilVerifie) return false;
      if (filters.profilVerifie === 'non_verifie' && u.profilVerifie) return false;
      // Profil complete filter
      if (filters.profilComplete === 'complete' && !u.profilComplete) return false;
      if (filters.profilComplete === 'incomplet' && u.profilComplete) return false;
      return true;
    });
  }, [apprenants, search, filters]);

  const sortedApprenants = useMemo(() => {
    const list = [...filteredApprenants];
    list.sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'progress') {
        aVal = a.progress || 0;
        bVal = b.progress || 0;
      } else {
        aVal = String(a[sortField] || '').toLowerCase();
        bVal = String(b[sortField] || '').toLowerCase();
      }
      if (sortDir === 'asc') return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });
    return list;
  }, [filteredApprenants, sortField, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sortedApprenants.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleApprenants = sortedApprenants.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Stats
  const stats = useMemo(() => {
    const total = apprenants.length;
    const actifs = apprenants.filter((u) => u.statut === 'actif').length;
    const suspendus = apprenants.filter((u) => u.statut === 'suspendu').length;
    const enAttente = apprenants.filter((u) => u.statut === 'en_attente').length;
    const now = new Date();
    const thisMonth = apprenants.filter((u) => {
      if (!u.dateInscription) return false;
      const d = new Date(u.dateInscription);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const profilsVerifies = apprenants.filter((u) => u.profilVerifie).length;
    const profilsIncomplets = apprenants.filter((u) => !u.profilComplete).length;
    return { total, actifs, suspendus, enAttente, nouveaux: thisMonth, profilsVerifies, profilsIncomplets };
  }, [apprenants]);

  // ----- Effects -----
  useEffect(() => { setPage(1); }, [search, filters]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  // ----- Actions -----
  const updateUserInList = useCallback((userId, updates) => {
    setApprenants((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
  }, []);

  const recordAction = useCallback((userId, action, details) => {
    const target = apprenants.find((u) => u.id === userId);
    if (!target) return;

    // Add to history
    const historyEntry = {
      date: new Date().toISOString().split('T')[0],
      action: action.charAt(0).toUpperCase() + action.slice(1),
      details: details || '',
    };
    updateUserInList(userId, {
      historique: [...(target.historique || []), historyEntry],
    });

    // Add recent activity
    const activityEntry = { date: new Date().toISOString(), action: details || action };
    updateUserInList(userId, {
      activiteRecente: [activityEntry, ...(target.activiteRecente || [])].slice(0, 10),
    });

    // Create notification via context
    addNotification(generateNotification(action, userId));

    // Record activity log
    recordActivity({
      user: authUser?.name || 'Admin',
      action: `${action.charAt(0).toUpperCase() + action.slice(1)}: ${target.nom}`,
      type: 'users',
      details: `${target.nom} — ${details || action}`,
    });
  }, [apprenants, updateUserInList, addNotification, recordActivity, authUser]);

  // ---- Action Handlers ----
  const handleView = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleEdit = (user) => {
    setEditForm({
      nom: user.nom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      ville: user.ville || '',
    });
    setEditModal({ open: true, user });
  };

  const handleEditSave = () => {
    if (!editModal.user) return;
    const userId = editModal.user.id;
    updateUserInList(userId, {
      nom: editForm.nom,
      email: editForm.email,
      telephone: editForm.telephone,
      ville: editForm.ville,
    });
    recordAction(userId, 'modifier', 'Profil modifié');
    setEditModal({ open: false, user: null });
    showToast('success', 'Profil modifié avec succès.');
  };

  const handleSuspend = (userId) => {
    updateUserInList(userId, { statut: 'suspendu', workflow: 'suspendu' });
    recordAction(userId, 'suspendu', 'Compte suspendu');
    showToast('warning', 'Compte suspendu.');
  };

  const handleReactivate = (userId) => {
    updateUserInList(userId, { statut: 'actif', workflow: 'actif' });
    recordAction(userId, 'reactiver', 'Compte réactivé');
    showToast('success', 'Compte réactivé.');
  };

  const handleVerify = (userId) => {
    const target = apprenants.find((u) => u.id === userId);
    if (!target) return;
    const newEmailVerifie = !target.emailVerifie;
    updateUserInList(userId, { emailVerifie: newEmailVerifie, profilVerifie: newEmailVerifie ? target.profilVerifie : target.profilVerifie });
    recordAction(userId, 'verifier', `Email ${newEmailVerifie ? 'vérifié' : 'non vérifié'}`);
    showToast('success', `Email ${newEmailVerifie ? 'vérifié' : 'non vérifié'}.`);
  };

  const handleVerifyProfil = (userId) => {
    const target = apprenants.find((u) => u.id === userId);
    if (!target) return;
    const newProfilVerifie = !target.profilVerifie;
    updateUserInList(userId, {
      profilVerifie: newProfilVerifie,
      profilComplete: newProfilVerifie ? true : target.profilComplete,
    });
    recordAction(userId, 'verifier', `Profil ${newProfilVerifie ? 'vérifié' : 'non vérifié'}`);
    showToast('success', `Profil ${newProfilVerifie ? 'vérifié' : 'non vérifié'}.`);
  };

  const handleResetPassword = (userId) => {
    recordAction(userId, 'reset_password', 'Mot de passe réinitialisé (simulation)');
    showToast('success', 'Email de réinitialisation envoyé (simulation).');
  };

  const handleSendMessage = (userId) => {
    const target = apprenants.find((u) => u.id === userId);
    recordAction(userId, 'message', 'Message envoyé (simulation)');
    showToast('success', `Message envoyé à ${target?.nom || 'l\'apprenant'} (simulation).`);
  };

  const handleDesactiver = (userId) => {
    updateUserInList(userId, { statut: 'desactive', workflow: 'archive' });
    recordAction(userId, 'desactiver', 'Compte désactivé');
    showToast('warning', 'Compte désactivé.');
  };

  const handleDelete = () => {
    if (!confirmState.id) return;
    const target = apprenants.find((u) => u.id === confirmState.id);
    if (target) {
      recordAction(confirmState.id, 'supprimer', 'Compte supprimé');
    }
    setApprenants((prev) => prev.filter((u) => u.id !== confirmState.id));
    setConfirmState({ open: false, id: null, action: null });
    showToast('success', 'Apprenant supprimé.');
  };

  const requestConfirm = (id, action) => {
    setConfirmState({ open: true, id, action });
  };

  // ---- Notes ----
  const handleAddNote = () => {
    if (!notesModal.user || !noteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      auteur: authUser?.name || 'Admin',
      contenu: noteText.trim(),
    };
    const userId = notesModal.user.id;
    const target = apprenants.find((u) => u.id === userId);
    updateUserInList(userId, {
      notesInternes: [...(target?.notesInternes || []), newNote],
    });
    setNoteText('');
    showToast('success', 'Note ajoutée.');
  };

  const handleDeleteNote = (userId, noteId) => {
    const target = apprenants.find((u) => u.id === userId);
    if (!target) return;
    updateUserInList(userId, {
      notesInternes: (target.notesInternes || []).filter((n) => n.id !== noteId),
    });
    showToast('success', 'Note supprimée.');
  };

  // ---- Sort ----
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronDown size={12} className="text-slate-300" />;
    return sortDir === 'asc' ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />;
  };

  // ---- Export ----
  const handleExportCSV = () => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Ville', 'Formation', 'Progression', 'Niveau', 'Statut', 'Inscription', 'Dernière connexion'];
    const rows = filteredApprenants.map((u) => [
      u.nom,
      u.email,
      u.telephone || '',
      u.ville || '',
      u.formationPrincipale || '',
      `${u.progress || 0}%`,
      u.niveau || '',
      STATUT_LABELS[u.statut] || u.statut,
      formatDate(u.dateInscription),
      formatDate(u.derniereConnexion),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `apprenants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('success', 'Fichier CSV exporté.');
  };

  const handleExportPDF = () => {
    showToast('success', 'Export PDF simulé (impression navigateur).');
    window.print();
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed right-4 top-4 z-[60] rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== STATS DASHBOARD ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7"
      >
        <AnimatedStatCard icon={FiUsers} label="Total apprenants" value={stats.total} tone="brand" delay={0} />
        <AnimatedStatCard icon={FiUserCheck} label="Comptes actifs" value={stats.actifs} tone="emerald" delay={0.05} />
        <AnimatedStatCard icon={FiUserX} label="Comptes suspendus" value={stats.suspendus} tone="sunset" delay={0.1} />
        <AnimatedStatCard icon={FiClockIcon} label="En attente" value={stats.enAttente} tone="accent" delay={0.15} />
        <AnimatedStatCard icon={FiUserPlus} label="Nouveaux inscrits" value={stats.nouveaux} tone="brand" delay={0.2} />
        <AnimatedStatCard icon={FiCheckCircle} label="Profils vérifiés" value={stats.profilsVerifies} tone="emerald" delay={0.25} />
        <AnimatedStatCard icon={FiAlertCircle} label="Profils incomplets" value={stats.profilsIncomplets} tone="sunset" delay={0.3} />
      </motion.div>

      {/* ========== SEARCH & FILTERS ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, téléphone, ville, formation..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`rounded-l-lg px-3 py-2 text-xs font-medium transition ${viewMode === 'table' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <FiList size={16} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`rounded-r-lg px-3 py-2 text-xs font-medium transition ${viewMode === 'cards' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <FiGrid size={16} />
              </button>
            </div>
            {/* Toggle filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${showFilters ? 'bg-brand-500 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            >
              <FiFilter size={16} />
              Filtres
            </button>
            {/* Export */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
              <button onClick={handleExportCSV} className="rounded-l-lg px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" title="Exporter CSV">
                <FiDownload size={16} />
              </button>
              <button onClick={handleExportPDF} className="px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" title="Exporter PDF / Imprimer">
                <FiPrinter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Statut</label>
                  <select
                    value={filters.statut}
                    onChange={(e) => setFilters((f) => ({ ...f, statut: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="suspendu">Suspendu</option>
                    <option value="en_attente">En attente</option>
                    <option value="desactive">Désactivé</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Ville</label>
                  <select
                    value={filters.ville}
                    onChange={(e) => setFilters((f) => ({ ...f, ville: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>{city === 'all' ? 'Toutes les villes' : city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Formation</label>
                  <select
                    value={filters.formation}
                    onChange={(e) => setFilters((f) => ({ ...f, formation: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {allFormations.map((f) => (
                      <option key={f} value={f}>{f === 'all' ? 'Toutes les formations' : f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Date d'inscription</label>
                  <select
                    value={filters.dateInscription}
                    onChange={(e) => setFilters((f) => ({ ...f, dateInscription: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="7j">Moins de 7 jours</option>
                    <option value="30j">Moins de 30 jours</option>
                    <option value="90j">Moins de 90 jours</option>
                    <option value="annee">Moins d'un an</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Profil vérifié</label>
                  <select
                    value={filters.profilVerifie}
                    onChange={(e) => setFilters((f) => ({ ...f, profilVerifie: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">Tous</option>
                    <option value="verifie">Vérifié</option>
                    <option value="non_verifie">Non vérifié</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Profil complété</label>
                  <select
                    value={filters.profilComplete}
                    onChange={(e) => setFilters((f) => ({ ...f, profilComplete: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">Tous</option>
                    <option value="complete">Complété</option>
                    <option value="incomplet">Incomplet</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ========== TABLE / CARDS VIEW ========== */}
      {(() => {
        if (filteredApprenants.length === 0) {
          return (
            <EmptyState
              icon={FiUsers}
              title="Aucun apprenant trouvé"
              description="Aucun apprenant ne correspond à vos critères de recherche."
            />
          );
        }

        if (viewMode === 'table') {
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
              ref={tableRef}
            >
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('nom')}>
                      <div className="flex items-center gap-1">
                        Apprenant <SortIcon field="nom" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Formation</th>
                    <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('niveau')}>
                      <div className="flex items-center gap-1">
                        Niveau <SortIcon field="niveau" />
                      </div>
                    </th>
                    <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('progress')}>
                      <div className="flex items-center gap-1">
                        Progression <SortIcon field="progress" />
                      </div>
                    </th>
                    <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('ville')}>
                      <div className="flex items-center gap-1">
                        Ville <SortIcon field="ville" />
                      </div>
                    </th>
                    <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('statut')}>
                      <div className="flex items-center gap-1">
                        Statut <SortIcon field="statut" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Profil</th>
                    <th className="px-4 py-3 text-xs">Dernière connexion</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {visibleApprenants.map((u) => {
                    const badge = getStatutBadge(u.statut);
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group transition hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={getAvatarUrl(u)}
                              alt={u.nom}
                              className="h-9 w-9 rounded-xl object-cover"
                            />
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">{u.nom}</div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                              {u.telephone && u.telephone !== '—' && <div className="text-xs text-slate-400">{u.telephone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-[140px] truncate" title={u.formationPrincipale}>
                            {u.formationPrincipale || '—'}
                          </div>
                          {u.centreAssocie && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{u.centreAssocie}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${NIVEAU_COLORS[u.niveau] || 'bg-slate-100 text-slate-600'}`}>
                            {u.niveau || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="min-w-[100px]">
                            <ProgressBar value={u.progress || 0} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                            <FiMapPin size={12} />
                            <span>{u.ville || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dotColor}`} />
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {u.emailVerifie
                              ? <FiCheckCircle size={14} className="text-emerald-500" title="Email vérifié" />
                              : <FiXCircle size={14} className="text-rose-500" title="Email non vérifié" />}
                            {u.profilComplete
                              ? <FiCheckCircle size={14} className="text-emerald-500 ml-1" title="Profil complété" />
                              : <FiAlertCircle size={14} className="text-amber-500 ml-1" title="Profil incomplet" />}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {u.profilVerifie
                            ? <FiCheckCircle size={16} className="text-emerald-500" />
                            : <FiXCircle size={16} className="text-slate-300 dark:text-slate-600" />}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[10px] text-slate-500">
                            {formatRelative(u.derniereConnexion)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatDate(u.dateInscription)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <ActionBtn icon={FiEye} tooltip="Voir le profil" onClick={() => handleView(u)} />
                            <ActionBtn icon={FiEdit2} tooltip="Modifier" onClick={() => handleEdit(u)} />
                            {u.statut !== 'suspendu' && u.statut !== 'desactive' ? (
                              <ActionBtn icon={FiLock} tooltip="Suspendre" onClick={() => requestConfirm(u.id, 'suspendre')} />
                            ) : null}
                            {u.statut === 'suspendu' ? (
                              <ActionBtn icon={FiUnlock} tooltip="Réactiver" onClick={() => handleReactivate(u.id)} />
                            ) : null}
                            <ActionBtn icon={FiMail} tooltip="Envoyer un message" onClick={() => handleSendMessage(u.id)} />
                            <ActionBtn icon={FiKey} tooltip="Réinitialiser mot de passe" onClick={() => handleResetPassword(u.id)} />
                            {!u.profilVerifie ? (
                              <ActionBtn icon={FiCheckCircle} tooltip="Vérifier le compte" onClick={() => handleVerifyProfil(u.id)} />
                            ) : (
                              <ActionBtn icon={FiCheckCircle} tooltip="Vérifier email" onClick={() => handleVerify(u.id)} />
                            )}
                            <ActionBtn icon={FiTrash2} tooltip="Supprimer" onClick={() => requestConfirm(u.id, 'supprimer')} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20" />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          );
        }

        // Cards view
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visibleApprenants.map((u, idx) => {
              const badge = getStatutBadge(u.statut);
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="card group"
                >
                  <div className="flex items-center gap-3">
                    <img src={getAvatarUrl(u)} alt={u.nom} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{u.nom}</div>
                      <div className="truncate text-xs text-slate-500">{u.email}</div>
                    </div>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${NIVEAU_COLORS[u.niveau] || 'bg-slate-100 text-slate-600'}`}>
                      {u.niveau || '—'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{u.formationPrincipale || '—'}</span>
                  </div>

                  <div className="mt-2">
                    <ProgressBar value={u.progress || 0} />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <FiMapPin size={11} /> {u.ville || '—'}
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dotColor}`} />
                      {badge.label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                    {u.emailVerifie ? <span className="flex items-center gap-1 text-emerald-500"><FiCheckCircle size={10} /> Email</span> : <span className="flex items-center gap-1 text-rose-500"><FiXCircle size={10} /> Email</span>}
                    {u.profilComplete ? <span className="flex items-center gap-1 text-emerald-500"><FiCheckCircle size={10} /> Profil</span> : <span className="flex items-center gap-1 text-amber-500"><FiAlertCircle size={10} /> Incomplet</span>}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400">
                    Inscrit {formatRelative(u.dateInscription)}
                  </div>

                  <div className="mt-3 flex justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-700">
                    <ActionBtn icon={FiEye} tooltip="Voir le profil" onClick={() => handleView(u)} />
                    <ActionBtn icon={FiEdit2} tooltip="Modifier" onClick={() => handleEdit(u)} />
                    {u.statut === 'suspendu' ? (
                      <ActionBtn icon={FiUnlock} tooltip="Réactiver" onClick={() => handleReactivate(u.id)} />
                    ) : u.statut !== 'desactive' ? (
                      <ActionBtn icon={FiLock} tooltip="Suspendre" onClick={() => requestConfirm(u.id, 'suspendre')} />
                    ) : null}
                    <ActionBtn icon={FiMail} tooltip="Envoyer un message" onClick={() => handleSendMessage(u.id)} />
                    <ActionBtn icon={FiTrash2} tooltip="Supprimer" onClick={() => requestConfirm(u.id, 'supprimer')} className="text-rose-500 hover:bg-rose-50" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })()}

      {/* ========== PAGINATION ========== */}
      {filteredApprenants.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row"
        >
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {filteredApprenants.length} apprenant(s) — Page {safePage} / {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FiChevronLeft size={14} /> Précédent
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                const start = Math.max(0, Math.min(safePage - 3, pageCount - 5));
                const pageNum = start + i + 1;
                if (pageNum > pageCount) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                      safePage === pageNum
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Suivant <FiChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========== PROFILE DRAWER ========== */}
      <ProfileDrawer user={selectedUser} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ========== EDIT MODAL ========== */}
      <ModalShell
        open={editModal.open}
        title="Modifier l'apprenant"
        subtitle="Mettez à jour les informations de l'apprenant."
        onClose={() => setEditModal({ open: false, user: null })}
        footer={
          <>
            <button
              onClick={() => setEditModal({ open: false, user: null })}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
            >
              Annuler
            </button>
            <button
              onClick={handleEditSave}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              Enregistrer
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Nom complet</label>
            <input
              value={editForm.nom}
              onChange={(e) => setEditForm((f) => ({ ...f, nom: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
            <input
              value={editForm.email}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Téléphone</label>
            <input
              value={editForm.telephone}
              onChange={(e) => setEditForm((f) => ({ ...f, telephone: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Ville</label>
            <input
              value={editForm.ville}
              onChange={(e) => setEditForm((f) => ({ ...f, ville: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
        </div>
      </ModalShell>

      {/* ========== NOTES MODAL ========== */}
      <ModalShell
        open={notesModal.open}
        title={`Notes internes — ${notesModal.user?.nom || ''}`}
        subtitle="Ajoutez, modifiez ou supprimez des notes privées."
        onClose={() => { setNotesModal({ open: false, user: null }); setNoteText(''); }}
        footer={
          <button
            onClick={() => { setNotesModal({ open: false, user: null }); setNoteText(''); }}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            Fermer
          </button>
        }
      >
        <div className="space-y-4">
          {/* Add note */}
          <div className="flex gap-2">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Écrire une note..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-50"
            >
              <FiPlus size={14} /> Ajouter
            </button>
          </div>
          {/* Notes list */}
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {(notesModal.user?.notesInternes || []).length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">Aucune note pour cet apprenant.</p>
            )}
            {(notesModal.user?.notesInternes || []).map((note) => (
              <div key={note.id} className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-300">{note.auteur}</div>
                    <p className="mt-1 text-sm text-slate-200">{note.contenu}</p>
                    <div className="mt-1 text-[10px] text-slate-500">{note.date}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(notesModal.user.id, note.id)}
                    className="rounded-lg p-1 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400"
                    title="Supprimer la note"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalShell>

      {/* ========== HISTORY MODAL ========== */}
      <ModalShell
        open={historyModal.open}
        title={`Historique — ${historyModal.user?.nom || ''}`}
        subtitle="Toutes les actions enregistrées."
        onClose={() => setHistoryModal({ open: false, user: null })}
        footer={
          <button
            onClick={() => setHistoryModal({ open: false, user: null })}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
          >
            Fermer
          </button>
        }
      >
        <div className="space-y-2">
          {(historyModal.user?.historique || []).length === 0 && (
            <p className="py-4 text-center text-sm text-slate-500">Aucun historique.</p>
          )}
          {(historyModal.user?.historique || []).map((entry, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-700/30 bg-slate-900/20 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                <FiActivity size={14} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">{entry.action}</span>
                  <span className="text-[10px] text-slate-500">{entry.date}</span>
                </div>
                {entry.details && <p className="mt-0.5 text-xs text-slate-400">{entry.details}</p>}
              </div>
            </div>
          ))}
          {(historyModal.user?.activiteRecente || []).length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Activité récente</h4>
              {(historyModal.user?.activiteRecente || []).map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                  <span className="text-slate-300">{a.action}</span>
                  <span className="text-slate-500">{formatRelative(a.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalShell>

      {/* ========== WORKFLOW MODAL ========== */}
      <ModalShell
        open={workflowModal.open}
        title={`Workflow — ${workflowModal.user?.nom || ''}`}
        subtitle="Cycle de vie du compte."
        onClose={() => setWorkflowModal({ open: false, user: null })}
        footer={
          <button
            onClick={() => setWorkflowModal({ open: false, user: null })}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
          >
            Fermer
          </button>
        }
      >
        <div className="py-4">
          <WorkflowVisual current={workflowModal.user?.workflow || 'cree'} />
        </div>
        <p className="text-xs text-slate-500">
          Statut actuel : <strong className="text-slate-300">{STATUT_LABELS[workflowModal.user?.statut] || workflowModal.user?.statut || 'Inconnu'}</strong>
        </p>
      </ModalShell>

      {/* ========== CONFIRM DIALOG ========== */}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.action === 'supprimer' ? "Supprimer l'apprenant" : confirmState.action === 'suspendre' ? "Suspendre l'apprenant" : confirmState.action === 'desactiver' ? "Désactiver l'apprenant" : 'Confirmer l\'action'}
        message={
          confirmState.action === 'supprimer'
            ? 'Êtes-vous sûr de vouloir supprimer définitivement cet apprenant ? Cette action est irréversible.'
            : confirmState.action === 'suspendre'
            ? 'Êtes-vous sûr de vouloir suspendre cet apprenant ? Il ne pourra plus se connecter.'
            : confirmState.action === 'desactiver'
            ? 'Êtes-vous sûr de vouloir désactiver cet apprenant ?'
            : 'Êtes-vous sûr de vouloir effectuer cette action ?'
        }
        onCancel={() => setConfirmState({ open: false, id: null, action: null })}
        onConfirm={confirmState.action === 'suspendre' ? () => {
          handleSuspend(confirmState.id);
          setConfirmState({ open: false, id: null, action: null });
        } : confirmState.action === 'desactiver' ? () => {
          handleDesactiver(confirmState.id);
          setConfirmState({ open: false, id: null, action: null });
        } : handleDelete}
      />
    </div>
  );
};

// ================================================================
// SMALL ACTION BUTTON
// ================================================================
const ActionBtn = ({ icon: Icon, tooltip, onClick, className = '' }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200 ${className}`}
  >
    <Icon size={15} />
  </button>
);

export default UtilisateursPage;


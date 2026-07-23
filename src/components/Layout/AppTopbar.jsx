import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FiBell, FiSearch, FiHome, FiBookOpen, FiCalendar, FiAward, FiMessageCircle, FiMenu, FiX, FiHelpCircle, FiCpu, FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiUsers, FiUserCheck, FiBriefcase, FiFileText } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';

const breadcrumbItems = [
  { path: '/dashboard', label: 'Tableau de bord' },
  { path: '/formations', label: 'Formations' },
  { path: '/reservations', label: 'Réservations' },
  { path: '/favoris', label: 'Favoris' },
  { path: '/messagerie', label: 'Messages' },
  { path: '/notifications', label: 'Notifications' },
  { path: '/certifications', label: 'Certifications' },
  { path: '/profil', label: 'Profil' },
  { path: '/settings', label: 'Paramètres' },
  { path: '/centre', label: 'Tableau de bord' },
  { path: '/admin', label: 'Tableau de bord' },
];

function formatRelativeDate(dateValue) {
  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  return `${diffDays} jours`;
}

export function Breadcrumb() {
  const location = useLocation();
  const { user } = useAuth();
  const currentItem = breadcrumbItems.find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));

  const getEspaceLabel = () => {
    if (!user) return 'SkillBridge';
    switch (user.role) {
      case 'admin': return 'Espace admin';
      case 'centre': return 'Espace centre';
      case 'apprenant':
      case 'learner': return 'Espace apprenant';
      default: return 'SkillBridge';
    }
  };

  const getEspacePath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'centre': return '/centre';
      case 'apprenant':
      case 'learner': return '/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <Link to={getEspacePath()} className="transition hover:text-brand-600 dark:hover:text-brand-300">{getEspaceLabel()}</Link>
      {currentItem ? <><span className="mx-1">/</span><span className="font-medium text-slate-800 dark:text-white">{currentItem.label}</span></> : null}
    </nav>
  );
}

export function NotificationsBell() {
  const { user } = useAuth();
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const visibleNotifications = notifications.filter((notification) => notification.userId === (user?.id || 1));

  const handleRead = (id) => {
    markAsRead(id);
  };

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-label="Notifications"
      >
        <FiBell size={18} />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open && createPortal(
        <div
          className="fixed z-[100] w-80 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
          style={{ top: position.top, right: position.right }}
        >
          <div className="border-b border-slate-700 px-3 py-3 font-semibold text-white">Notifications</div>
          <div className="max-h-80 overflow-y-auto">
            {visibleNotifications.length > 0 ? visibleNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleRead(notification.id)}
                className={`block w-full border-b border-slate-700/50 px-3 py-3 text-left text-sm ${!notification.lu ? 'bg-brand-500/5' : ''}`}
              >
                <p className="text-slate-200">{notification.title || notification.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatRelativeDate(notification.createdAt || notification.date)}</p>
              </button>
            )) : <p className="px-3 py-4 text-sm text-slate-400">Aucune notification pour le moment.</p>}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function GlobalSearchModal({ open, onClose, raccourcis }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Importer les données mock pour la recherche
  const getSearchData = useMemo(() => () => {
    try {
      const { mockFormations } = require('../../data/mockFormations');
      const { mockStudents } = require('../../data/mockStudents');
      const { mockTrainers } = require('../../data/mockTrainers');
      const { mockDocuments } = require('../../data/mockDocuments');
      const { mockUsers } = require('../../data/mockUsers');
      const { mockPartnerCompanies } = require('../../data/mockPartnerCompanies');
      return { mockFormations, mockStudents, mockTrainers, mockDocuments, mockUsers, mockPartnerCompanies };
    } catch {
      return { mockFormations: [], mockStudents: [], mockTrainers: [], mockDocuments: [], mockUsers: [], mockPartnerCompanies: [] };
    }
  }, []);

  // Catégories de recherche
  const searchCategories = useMemo(() => [
    {
      id: 'pages',
      label: 'Pages',
      icon: FiHome,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      items: raccourcis,
      search: (q, items) => items.filter(item => item.label.toLowerCase().includes(q.toLowerCase())),
    },
    {
      id: 'formations',
      label: 'Formations',
      icon: FiBookOpen,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      getItems: () => getSearchData().mockFormations || [],
      search: (q, items) => items.filter(f => 
        f.title?.toLowerCase().includes(q.toLowerCase()) || 
        f.category?.toLowerCase().includes(q.toLowerCase())
      ),
      getLabel: (item) => item.title,
      getSubLabel: (item) => item.category || '',
      getPath: (item) => `/formations/${item.id}`,
    },
    {
      id: 'students',
      label: 'Étudiants',
      icon: FiUsers,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      getItems: () => getSearchData().mockStudents || [],
      search: (q, items) => items.filter(s => 
        s.name?.toLowerCase().includes(q.toLowerCase()) || 
        s.email?.toLowerCase().includes(q.toLowerCase())
      ),
      getLabel: (item) => item.name,
      getSubLabel: (item) => item.email || '',
      getPath: () => '/centre/etudiants',
    },
    {
      id: 'trainers',
      label: 'Formateurs',
      icon: FiUserCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      getItems: () => getSearchData().mockTrainers || [],
      search: (q, items) => items.filter(t => 
        t.name?.toLowerCase().includes(q.toLowerCase()) || 
        t.speciality?.toLowerCase().includes(q.toLowerCase())
      ),
      getLabel: (item) => item.name,
      getSubLabel: (item) => item.speciality || '',
      getPath: () => '/centre/formateurs',
    },
    {
      id: 'companies',
      label: 'Entreprises',
      icon: FiBriefcase,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      getItems: () => getSearchData().mockPartnerCompanies || [],
      search: (q, items) => items.filter(c => 
        c.name?.toLowerCase().includes(q.toLowerCase()) || 
        c.sector?.toLowerCase().includes(q.toLowerCase())
      ),
      getLabel: (item) => item.name,
      getSubLabel: (item) => item.sector || '',
      getPath: () => '/centre/entreprises-partenaires',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FiFileText,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      getItems: () => getSearchData().mockDocuments || [],
      search: (q, items) => items.filter(d => 
        d.name?.toLowerCase().includes(q.toLowerCase()) || 
        d.type?.toLowerCase().includes(q.toLowerCase())
      ),
      getLabel: (item) => item.name,
      getSubLabel: (item) => item.type || '',
      getPath: () => '/centre/documents',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: FiSettings,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      getItems: () => getSearchData().mockUsers || [],
      search: (q, items) => items.filter(u => 
        u.name?.toLowerCase().includes(q.toLowerCase()) || 
        u.email?.toLowerCase().includes(q.toLowerCase()) || 
        u.role?.toLowerCase().includes(q.toLowerCase())
      ),
      getLabel: (item) => item.name,
      getSubLabel: (item) => item.email || item.role || '',
      getPath: () => '/settings',
    },
  ], [raccourcis, getSearchData]);

  // Calculer les résultats groupés
  const groupedResults = useMemo(() => {
    if (!query || query.trim().length < 1) return [];

    const q = query.trim().toLowerCase();
    const groups = [];

    searchCategories.forEach(category => {
      let items = category.items || (category.getItems ? category.getItems() : []);
      const matched = category.search(q, items);
      if (matched.length > 0) {
        groups.push({
          ...category,
          results: matched.slice(0, 5), // max 5 par catégorie
        });
      }
    });

    return groups;
  }, [query, searchCategories]);

  // Liste plate de tous les résultats pour la navigation clavier
  const flatResults = useMemo(() => {
    const flat = [];
    groupedResults.forEach(group => {
      group.results.forEach(item => {
        flat.push({ ...item, _categoryId: group.id, _categoryLabel: group.label, _getPath: group.getPath, _groupColor: group.color });
      });
    });
    return flat;
  }, [groupedResults]);

  // Highlight text function
  const highlightText = (text, searchQuery) => {
    if (!text || !searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-brand-500/30 text-white rounded-sm px-0.5">{part}</mark> : part
    );
  };

  // Navigation clavier
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      e.preventDefault();
      const item = flatResults[selectedIndex];
      const path = item._getPath ? item._getPath(item) : item.path;
      if (path) {
        navigate(path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Reset index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasResults = flatResults.length > 0;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher formations, étudiants, formateurs..."
            className="w-full border-b border-slate-700 bg-transparent px-4 py-4 pl-10 text-sm text-white outline-none placeholder-slate-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!query && (
            <div className="p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Pages rapides</p>
              {raccourcis.map((raccourci) => {
                const Icon = raccourci.icon;
                return (
                  <button
                    key={raccourci.path}
                    type="button"
                    onClick={() => {
                      navigate(raccourci.path);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
                  >
                    <Icon size={16} className="text-slate-400" />
                    <span>{raccourci.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {query && !hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 px-4"
            >
              <FiSearch size={32} className="mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">Aucun résultat trouvé</p>
              <p className="mt-1 text-xs text-slate-500">
                Aucune correspondance pour « {query} »
              </p>
            </motion.div>
          )}

          {query && hasResults && (
            <div className="p-2">
              {groupedResults.map((group) => (
                <div key={group.id} className="mb-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <group.icon size={14} className={group.color} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{group.label}</span>
                    <span className="text-[10px] text-slate-600">({group.results.length})</span>
                  </div>
                  {group.results.map((item) => {
                    const flatIndex = flatResults.indexOf(item);
                    const isSelected = flatIndex === selectedIndex;
                    const label = group.getLabel ? group.getLabel(item) : item.label;
                    const subLabel = group.getSubLabel ? group.getSubLabel(item) : '';
                    const path = group.getPath ? group.getPath(item) : item.path;

                    return (
                      <motion.button
                        key={item.id || `${group.id}-${flatIndex}`}
                        type="button"
                        onClick={() => {
                          if (path) {
                            navigate(path);
                            onClose();
                          }
                        }}
                        onMouseEnter={() => setSelectedIndex(flatIndex)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: flatIndex * 0.03 }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all duration-150 ${
                          isSelected
                            ? 'bg-brand-500/15 text-white'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className={`rounded-lg p-2 ${group.bgColor || 'bg-slate-700/50'} shrink-0`}>
                          <group.icon size={14} className={group.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{highlightText(label, query)}</p>
                          {subLabel && (
                            <p className="truncate text-xs text-slate-500">{highlightText(subLabel, query)}</p>
                          )}
                        </div>
                        {isSelected && (
                          <span className="shrink-0 text-[10px] text-brand-400">Entrée ↵</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {query && hasResults && (
            <div className="sticky bottom-0 border-t border-slate-700/50 bg-slate-800 px-4 py-2">
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span><kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px]">↑↓</kbd> Naviguer</span>
                <span><kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px]">↵</kbd> Ouvrir</span>
                <span><kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px]">Esc</kbd> Fermer</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function GlobalSearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const raccourcis = [
    { label: 'Tableau de bord', path: '/dashboard', icon: FiHome },
    { label: 'Formations', path: '/formations', icon: FiBookOpen },
    { label: 'Mes réservations', path: '/reservations', icon: FiCalendar },
    { label: 'Mes certifications', path: '/certifications', icon: FiAward },
    { label: 'Messagerie', path: '/messagerie', icon: FiMessageCircle },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        <FiSearch size={14} /> Rechercher <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-white">Ctrl K</kbd>
      </button>
      <GlobalSearchModal open={open} onClose={() => setOpen(false)} raccourcis={raccourcis} />
    </>
  );
}

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAssistant = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('skillbridge:open-assistant'));
  };

  const handleSupport = () => {
    setOpen(false);
    navigate('/support');
  };

  return (
    <div className="fixed bottom-6 end-6 z-40">
      {open ? (
        <div className="absolute bottom-16 end-0 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl">
          <button type="button" onClick={handleAssistant} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5">
            <FiCpu size={16} /> Assistant IA
          </button>
          <button type="button" onClick={handleSupport} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5">
            <FiHelpCircle size={16} /> Aide & support
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg"
      >
        {open ? <FiX size={22} /> : <FiHelpCircle size={22} />}
      </button>
    </div>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const navigate = useNavigate();

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const closeAndRun = (callback) => {
    setOpen(false);
    callback?.();
  };

  return (
    <div ref={buttonRef}>
      <button type="button" onClick={handleToggle} className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
        {user?.avatar ? <img src={user.avatar} alt={user?.name ?? 'Avatar'} className="h-8 w-8 rounded-full object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200"><FiUser size={16} /></div>}
        <span className="hidden sm:inline">{user?.nom || user?.name || 'Utilisateur'}</span>
      </button>

      {open && createPortal(
        <div
          className="fixed z-[100] w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
          style={{ top: position.top, right: position.right }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button type="button" onClick={() => closeAndRun(() => navigate('/profil'))} className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5">
            <FiUser size={15} /> Profil
          </button>
          <button type="button" onClick={() => closeAndRun(() => navigate('/settings'))} className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5">
            <FiSettings size={15} /> Paramètres
          </button>
          <div className="border-t border-slate-700" />
          <button type="button" onClick={() => closeAndRun(() => onLogout?.())} className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5">
            <FiLogOut size={15} /> Déconnexion
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

export function AppTopbar({ onMenuToggle, mobileOpen }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700" onClick={onMenuToggle} aria-label="Ouvrir le menu">
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Breadcrumb />
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearchButton />
          <NotificationsBell />
          <select
            value={i18n.language}
            onChange={(event) => changeLanguage(event.target.value)}
            className="rounded-full border border-gray-300/70 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Sélecteur de langue"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
            <option value="ar">🇹🇳 AR</option>
          </select>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">
            {theme === 'dark' ? <FiSun size={18} className="text-current" /> : <FiMoon size={18} className="text-current" />}
          </button>
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FiBell, FiSearch, FiHome, FiBookOpen, FiCalendar, FiAward, FiMessageCircle, FiMenu, FiX, FiHelpCircle, FiCpu, FiSun, FiMoon, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <input autoFocus placeholder="Aller à..." className="w-full border-b border-slate-700 bg-transparent px-4 py-3 text-sm text-white outline-none" />
        <div className="max-h-80 overflow-y-auto">
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
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
              >
                <Icon size={16} /> {raccourci.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
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

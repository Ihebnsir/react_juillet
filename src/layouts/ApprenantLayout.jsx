import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBookOpen, FiCalendar, FiHeart, FiMessageCircle, FiAward, FiUser, FiMenu, FiX, FiHelpCircle } from 'react-icons/fi';
import { messagingService } from '../services/messagingService';

const links = [
  { to: '/dashboard', label: 'Tableau de bord', icon: FiHome },
  { to: '/formations', label: 'Formations', icon: FiBookOpen },
  { to: '/reservations', label: 'Réservations', icon: FiCalendar },
  { to: '/favoris', label: 'Favoris', icon: FiHeart },
  { to: '/messagerie', label: 'Messages', icon: FiMessageCircle },
  { to: '/certifications', label: 'Certifications', icon: FiAward },
  { to: '/profil', label: 'Profil', icon: FiUser },
];

const getInitialCollapsed = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('sidebar_collapsed') === 'true';
};

export const ApprenantLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const isRTL = typeof document !== 'undefined' ? document.documentElement.dir === 'rtl' : false;
  const unreadCount = useMemo(() => {
    if (!user) return 0;
    return messagingService.getConversationsForUser(user).reduce((sum, conversation) => sum + (conversation.unreadCount || 0), 0);
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sidebar_collapsed', String(collapsed));
    }
  }, [collapsed]);

  const handleSupportOpen = () => {
    navigate('/support');
  };

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setCollapsed((prev) => !prev);
      setMobileOpen(false);
      return;
    }

    setMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <div className="flex min-h-screen">
        <aside className={`fixed ${isRTL ? 'right-0' : 'left-0'} z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-4 shadow-xl transition-all duration-300 dark:border-slate-700 dark:bg-slate-800 md:sticky md:top-0 md:h-screen md:shadow-none md:p-6 ${mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'} md:translate-x-0 ${collapsed ? 'md:w-16 md:p-3' : 'md:w-72'}`}>
          <div className={`mb-6 flex items-center justify-between ${collapsed ? 'md:justify-center' : ''}`}>
            <div className={`${collapsed ? 'md:hidden' : ''}`}>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">SkillBridge</p>
              <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Espace apprenant</h2>
            </div>
            {collapsed ? <p className="hidden text-sm font-semibold uppercase tracking-wide text-teal-600 md:block">SB</p> : null}
            <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
              <FiX size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobileMenu}
                title={collapsed ? label : undefined}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${collapsed ? 'md:justify-center md:px-2' : ''} ${isActive ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}
              >
                <Icon size={18} />
                <span className={`${collapsed ? 'md:hidden' : ''}`}>{label}</span>
                {to === '/messagerie' && unreadCount > 0 ? (
                  <span className={`ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white ${collapsed ? 'md:hidden' : ''}`}>{unreadCount}</span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          <div className={`mt-auto rounded-xl bg-teal-50 p-4 text-sm text-teal-700 dark:bg-slate-700 dark:text-teal-200 ${collapsed ? 'md:hidden' : ''}`}>
            <p className="font-semibold">{user?.name || 'Apprenant'}</p>
            <p>Apprenant actif</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-gray-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 lg:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700" onClick={handleMenuClick} aria-label="Ouvrir le menu">
                  {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Bienvenue</p>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{user?.name || 'Apprenant'}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/messagerie')} className="relative rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
                  <FiMessageCircle size={18} />
                  {unreadCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">{unreadCount}</span> : null}
                </button>
                <button onClick={handleSupportOpen} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
                  <FiHelpCircle size={18} />
                </button>
              </div>
            </div>
          </header>
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
          <button onClick={handleSupportOpen} className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-700">
            <FiHelpCircle size={18} />
            Aide & support
          </button>
        </div>
      </div>
    </div>
  );
};

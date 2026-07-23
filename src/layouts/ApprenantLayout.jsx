import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { FiHome, FiBookOpen, FiCalendar, FiHeart, FiMessageCircle, FiAward, FiUser, FiX, FiTrendingUp, FiStar, FiSettings, FiBell } from 'react-icons/fi';
import { messagingService } from '../services/messagingService';
import { AppTopbar, FloatingActionButton } from '../components/Layout/AppTopbar';

const sections = [
  {
    title: 'Dashboard',
    items: [
      { to: '/dashboard', label: 'Tableau de bord', icon: FiHome },
      { to: '/formations', label: 'Formations', icon: FiBookOpen },
      { to: '/reservations', label: 'Réservations', icon: FiCalendar },
    ],
  },
  {
    title: 'Communication',
    items: [
      { to: '/notifications', label: 'Notifications', icon: FiBell },
      { to: '/messagerie', label: 'Messages', icon: FiMessageCircle },
    ],
  },
  {
    title: 'Compte',
    items: [
      { to: '/profil', label: 'Profil', icon: FiUser },
      { to: '/settings', label: 'Paramètres', icon: FiSettings },
    ],
  },
  {
    title: 'Apprentissage',
    items: [
      { to: '/favoris', label: 'Favoris', icon: FiHeart },
      { to: '/certifications', label: 'Certifications', icon: FiAward },
      { to: '/recommandations', label: 'Recommandations', icon: FiTrendingUp },
      { to: '/mes-avis', label: 'Mes avis', icon: FiStar },
    ],
  },
];

const getInitialCollapsed = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('sidebar_collapsed') === 'true';
};

export const ApprenantLayout = () => {
  const { user } = useAuth();
  const { unreadCount: notificationUnreadCount } = useNotifications();
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
    <div className="min-h-screen bg-brand-50/70 dark:bg-slate-900">
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <div className="flex min-h-screen">
        <aside className={`fixed ${isRTL ? 'right-0' : 'left-0'} z-40 flex h-screen w-64 flex-col border-r border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur transition-all duration-300 dark:border-slate-700 dark:bg-slate-800/90 md:sticky md:top-0 md:h-screen md:shadow-none md:p-6 ${mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'} md:translate-x-0 ${collapsed ? 'md:w-16 md:p-3' : 'md:w-72'}`}>
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

          <nav className="space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="space-y-2">
                {!collapsed ? (
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{section.title}</p>
                ) : null}
                {section.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMobileMenu}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${collapsed ? 'md:justify-center md:px-2' : ''} ${isActive ? 'text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-brand-200'}`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        ) : null}
                        <Icon size={18} className="transition group-hover:scale-110" />
                        <span className={`${collapsed ? 'md:hidden' : ''} flex-1`}>{label}</span>
                        {to === '/messagerie' && unreadCount > 0 ? (
                          <span className={`ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white ${collapsed ? 'md:hidden' : ''}`}>{unreadCount}</span>
                        ) : null}
                        {to === '/notifications' && notificationUnreadCount > 0 ? (
                          <span className={`ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white ${collapsed ? 'md:hidden' : ''}`}>{notificationUnreadCount}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <div className={`mt-auto rounded-2xl bg-brand-500/10 p-4 text-sm text-brand-700 dark:bg-brand-900/20 dark:text-brand-200 ${collapsed ? 'md:hidden' : ''}`}>
            <p className="font-semibold">{user?.name || 'Apprenant'}</p>
            <p>Apprenant actif</p>
          </div>
        </aside>

        <div className="flex-1">
          <AppTopbar onMenuToggle={handleMenuClick} mobileOpen={mobileOpen} />
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
          <FloatingActionButton />
        </div>
      </div>
    </div>
  );
};

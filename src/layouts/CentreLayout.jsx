import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiBookOpen, FiPlusCircle, FiCalendar, FiMessageSquare, FiShield, FiUser, FiX } from 'react-icons/fi';
import { AppTopbar } from '../components/Layout/AppTopbar';

const links = [
  { to: '/centre', label: 'Tableau de bord', icon: FiGrid },
  { to: '/centre/offres', label: 'Mes offres', icon: FiBookOpen },
  { to: '/centre/offres/nouvelle', label: 'Publier une offre', icon: FiPlusCircle },
  { to: '/centre/reservations', label: 'Réservations', icon: FiCalendar },
  { to: '/centre/calendar', label: 'Calendrier', icon: FiCalendar },
  { to: '/centre/messagerie', label: 'Messagerie', icon: FiMessageSquare },
  { to: '/centre/verification', label: 'Vérification', icon: FiShield },
  { to: '/profil', label: 'Profil', icon: FiUser },
];

const getInitialCollapsed = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('centre_sidebar_collapsed') === 'true';
};

export const CentreLayout = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const isRTL = typeof document !== 'undefined' ? document.documentElement.dir === 'rtl' : false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('centre_sidebar_collapsed', String(collapsed));
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
              <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Espace centre</h2>
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
                className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${collapsed ? 'md:justify-center md:px-2' : ''} ${isActive ? 'text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 dark:text-slate-300 dark:hover:text-slate-100'}`}
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
                    <Icon size={18} />
                    <span className={`${collapsed ? 'md:hidden' : ''}`}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className={`mt-auto rounded-2xl bg-sunset-500/10 p-4 text-sm text-sunset-700 dark:bg-sunset-900/20 dark:text-sunset-200 ${collapsed ? 'md:hidden' : ''}`}>
            <p className="font-semibold">{user?.name || 'Centre'}</p>
            <p>Centre de formation</p>
          </div>
        </aside>

        <div className="flex-1">
          <AppTopbar onMenuToggle={handleMenuClick} mobileOpen={mobileOpen} />
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

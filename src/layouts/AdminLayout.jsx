import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiShield, FiUsers, FiAlertTriangle, FiHome, FiMenu, FiX } from 'react-icons/fi';

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: FiBarChart2 },
  { to: '/admin/moderation', label: 'Modération', icon: FiShield },
  { to: '/admin/centres-en-attente', label: 'Centres en attente', icon: FiUsers },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: FiUsers },
  { to: '/admin/litiges', label: 'Litiges', icon: FiAlertTriangle },
  { to: '/admin/statistiques', label: 'Statistiques', icon: FiBarChart2 },
  { to: '/admin/contenu-accueil', label: 'Contenu accueil', icon: FiHome },
];

const getInitialCollapsed = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('admin_sidebar_collapsed') === 'true';
};

export const AdminLayout = () => {
  const { user } = useAuth();
  console.log('[AdminLayout] user:', user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const isRTL = typeof document !== 'undefined' ? document.documentElement.dir === 'rtl' : false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('admin_sidebar_collapsed', String(collapsed));
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
              <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Espace admin</h2>
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
          <div className={`mt-auto rounded-2xl bg-brand-500/10 p-4 text-sm text-brand-700 dark:bg-brand-900/20 dark:text-brand-200 ${collapsed ? 'md:hidden' : ''}`}>
            <p className="font-semibold">{user?.name || 'Admin'}</p>
            <p>Administrateur</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 lg:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700" onClick={handleMenuClick} aria-label="Ouvrir le menu">
                  {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Panneau</p>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{user?.name || 'Admin'}</h1>
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

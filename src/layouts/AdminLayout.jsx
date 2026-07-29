import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { FiBarChart2, FiShield, FiUsers, FiAlertTriangle, FiX, FiSettings, FiFileText, FiMail, FiBell, FiMessageSquare } from 'react-icons/fi';
import { AppTopbar } from '../components/Layout/AppTopbar';

const sections = [
  {
    title: 'Dashboard',
    items: [
      { to: '/admin', label: 'Dashboard', icon: FiBarChart2 },
      { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { to: '/admin/moderation', label: 'Modération', icon: FiShield },
      { to: '/admin/centres-en-attente', label: 'Centres', icon: FiUsers },
      { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: FiUsers },
      { to: '/admin/litiges', label: 'Litiges', icon: FiAlertTriangle },
      { to: '/admin/contenu-accueil', label: 'Contenu', icon: FiFileText },
    ],
  },
  {
    title: 'Ops',
    items: [
      { to: '/admin/notifications', label: 'Notifications', icon: FiBell },
      { to: '/admin/activity-log', label: 'Audit log', icon: FiFileText },
      { to: '/admin/trash', label: 'Corbeille', icon: FiAlertTriangle },
      { to: '/admin/contact', label: 'Contact', icon: FiMail },
      { to: '/admin/support', label: 'Support', icon: FiMessageSquare },
    ],
  },
  {
    title: 'Compte',
    items: [
      { to: '/settings', label: 'Paramètres', icon: FiSettings },
    ],
  },
];

const getInitialCollapsed = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('admin_sidebar_collapsed') === 'true';
};

export const AdminLayout = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <div className="flex min-h-screen">
        <aside className={`fixed ${isRTL ? 'right-0' : 'left-0'} z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur transition-all duration-300 md:sticky md:top-0 md:h-screen md:shadow-none md:p-6 ${mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'} md:translate-x-0 ${collapsed ? 'md:w-16 md:p-3' : 'md:w-72'}`}>
          <div className={`shrink-0 mb-6 flex items-center justify-between ${collapsed ? 'md:justify-center' : ''}`}>
            <div className={`${collapsed ? 'md:hidden' : ''}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">SkillBridge</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Espace admin</h2>
            </div>
            {collapsed ? <p className="hidden text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 md:block">SB</p> : null}
            <button className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
              <FiX size={18} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="space-y-2">
                {!collapsed ? (
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{section.title}</p>
                ) : null}
                {section.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMobileMenu}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${collapsed ? 'md:justify-center md:px-2' : ''} ${isActive ? 'text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_10px_24px_rgba(16,185,129,0.24)]"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        ) : null}
                        <Icon size={18} className="transition group-hover:scale-110" />
                        <span className={`${collapsed ? 'md:hidden' : ''} flex-1`}>{label}</span>
                        {to === '/notifications' && unreadCount > 0 ? (
                          <span className={`ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white ${collapsed ? 'md:hidden' : ''}`}>{unreadCount}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          <div className={`shrink-0 mt-auto rounded-3xl border border-slate-700 bg-slate-900/80 p-4 text-sm text-slate-100 ${collapsed ? 'md:hidden' : ''}`}>
            <p className="font-semibold">{user?.name || 'Admin'}</p>
            <p className="text-slate-400">Administrateur</p>
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

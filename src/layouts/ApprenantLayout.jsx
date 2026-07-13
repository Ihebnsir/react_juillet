import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBookOpen, FiCalendar, FiHeart, FiMessageSquare, FiAward, FiUser, FiMenu, FiX } from 'react-icons/fi';

const links = [
  { to: '/', label: 'dashboard', icon: FiHome },
  { to: '/formations', label: 'formations', icon: FiBookOpen },
  { to: '/reservations', label: 'reservations', icon: FiCalendar },
  { to: '/favoris', label: 'favorites', icon: FiHeart },
  { to: '/messages', label: 'messages', icon: FiMessageSquare },
  { to: '/certifications', label: 'certifications', icon: FiAward },
  { to: '/profil', label: 'profile', icon: FiUser },
];

export const ApprenantLayout = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 lg:flex">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">SkillBridge</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Espace apprenant</h2>
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-xl bg-teal-50 p-4 text-sm text-teal-700 dark:bg-slate-700 dark:text-teal-200">
            <p className="font-semibold">{user?.name}</p>
            <p>Apprenant actif</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-gray-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 lg:px-6">
            <div className="flex items-center justify-between">
              <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)}>
                {open ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Bonjour</p>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{user?.name}</h1>
              </div>
            </div>
            {open ? (
              <nav className="mt-4 space-y-2 lg:hidden">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200" onClick={() => setOpen(false)}>
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            ) : null}
          </header>
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

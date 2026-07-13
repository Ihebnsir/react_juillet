import React from 'react';
import { mockUsers } from '../../data/mockUsers';

export const UtilisateursPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Gestion des utilisateurs</h1>
    <div className="mt-4 space-y-3">
      {mockUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-slate-700">
          <div>
            <p className="font-semibold text-gray-900 dark:text-slate-100">{user.nom || user.name}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-slate-700 dark:text-slate-200">{user.role}</span>
        </div>
      ))}
    </div>
  </div>
);

import React from 'react';
import { FiAward } from 'react-icons/fi';

export const MesCertificationsPage = () => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300"><FiAward /></div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes certifications</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Accédez à vos attestations et badges de réussite.</p>
      </div>
    </div>
    <div className="mt-6 space-y-3">
      <div className="rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-slate-700">
        <p className="font-semibold text-gray-900 dark:text-slate-100">Certificat React Avancé</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Téléchargeable</p>
      </div>
      <div className="rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-slate-700">
        <p className="font-semibold text-gray-900 dark:text-slate-100">Attestation de stage UI/UX</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">À télécharger</p>
      </div>
    </div>
  </div>
);

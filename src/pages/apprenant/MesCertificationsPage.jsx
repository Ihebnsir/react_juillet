import React from 'react';

export const MesCertificationsPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Mes certifications</h1>
    <div className="mt-4 space-y-3">
      <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
        <p className="font-semibold text-gray-900 dark:text-slate-100">Certificat React Avancé</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Téléchargeable</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
        <p className="font-semibold text-gray-900 dark:text-slate-100">Attestation de stage UI/UX</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">À télécharger</p>
      </div>
    </div>
  </div>
);

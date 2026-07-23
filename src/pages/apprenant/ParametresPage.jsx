import React, { useState } from 'react';

function ToggleRow({ label, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked || false);

  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-colors duration-200 ${checked ? 'bg-brand-500' : 'bg-slate-600'}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </label>
  );
}

export const ParametresPage = () => (
  <div className="max-w-xl space-y-8">
    <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Paramètres</h1>

    <section className="card p-5">
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
      <ToggleRow label="Notifications par email" defaultChecked />
      <ToggleRow label="Rappels de session à venir" defaultChecked />
      <ToggleRow label="Nouvelles recommandations" />
    </section>

    <section className="card p-5">
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Langue et affichage</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Modifiable aussi depuis le sélecteur de langue de la topbar.</p>
    </section>

    <section className="card p-5">
      <h2 className="mb-4 font-semibold text-red-400">Zone de danger</h2>
      <button type="button" className="text-sm text-red-400 hover:underline">Supprimer mon compte</button>
    </section>
  </div>
);

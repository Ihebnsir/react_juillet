import React from 'react';
import { Search, Filter } from 'lucide-react';

const ModerationFilters = ({ search, roleFilter, riskFilter, statusFilter, onSearchChange, onRoleChange, onRiskChange, onStatusChange }) => {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Recherche & filtres</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Filtrer le flux de modération</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Recherche globale"
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-slate-400">Rôle</span>
            <select
              value={roleFilter}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200 outline-none"
            >
              <option value="">Tous</option>
              <option value="Apprenant">Apprenant</option>
              <option value="Centre">Centre</option>
              <option value="Formateur">Formateur</option>
              <option value="Entreprise">Entreprise</option>
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-slate-400">Niveau risque</span>
            <select
              value={riskFilter}
              onChange={(e) => onRiskChange(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200 outline-none"
            >
              <option value="">Tous</option>
              <option value="Faible">Faible</option>
              <option value="Moyen">Moyen</option>
              <option value="Élevé">Élevé</option>
              <option value="Critique">Critique</option>
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-slate-400">Statut</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200 outline-none"
            >
              <option value="">Tous</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Analyse">Analyse</option>
              <option value="En cours">En cours</option>
              <option value="Traité">Traité</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
};

export default ModerationFilters;

import React from 'react';
import { ArrowDown, ArrowUp, UserCheck, FileText, ShieldCheck } from 'lucide-react';

const sortIndicator = (key, sortConfig) => {
  if (sortConfig.key !== key) return null;
  return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
};

const badgeVariant = {
  Nouveau: 'bg-slate-700/80 text-slate-100',
  Analyse: 'bg-sky-500/10 text-sky-200',
  'En cours': 'bg-amber-500/10 text-amber-200',
  Traité: 'bg-emerald-500/10 text-emerald-200',
};

const riskChip = {
  Critique: 'bg-rose-500/10 text-rose-200',
  Élevé: 'bg-orange-500/10 text-orange-200',
  Moyen: 'bg-slate-700/80 text-slate-100',
  Faible: 'bg-slate-700/80 text-slate-100',
};

const ModerationTable = ({ rows, sortConfig, onSort, onViewUser, onAssign, onCreateLitige, onStatusChange, currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tableau de modération avancé</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Cas en cours et en revue</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
          {rows.length} cas affichés
        </div>
      </div>

      <div className="mt-6 overflow-auto rounded-3xl border border-white/10 bg-slate-900/60">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-200">
          <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
            <tr>
              {[
                { key: 'id', label: 'ID' },
                { key: 'type', label: 'Type' },
                { key: 'user', label: 'Utilisateur' },
                { key: 'role', label: 'Rôle' },
                { key: 'category', label: 'Catégorie' },
                { key: 'risk', label: 'Niveau risque' },
                { key: 'date', label: 'Date' },
                { key: 'status', label: 'Statut' },
                { key: 'actions', label: 'Actions' },
              ].map((column) => (
                <th key={column.key} className="px-4 py-4 font-semibold uppercase tracking-[0.18em]">
                  <button type="button" className="inline-flex items-center gap-2" onClick={() => onSort(column.key)}>
                    {column.label}
                    {sortIndicator(column.key, sortConfig)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/10 last:border-b-0 hover:bg-slate-900/70">
                <td className="px-4 py-4 font-semibold text-white">{row.id}</td>
                <td className="px-4 py-4">{row.type}</td>
                <td className="px-4 py-4">
                  <button type="button" onClick={() => onViewUser(row.userId)} className="font-medium text-slate-100 underline decoration-slate-600 decoration-1 underline-offset-4 hover:text-white">
                    {row.user}
                  </button>
                </td>
                <td className="px-4 py-4">{row.role}</td>
                <td className="px-4 py-4">{row.category}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${riskChip[row.risk]}`}>{row.risk}</span>
                </td>
                <td className="px-4 py-4">{row.date}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${badgeVariant[row.status]}`}>{row.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onAssign(row.id)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 transition hover:border-white/20">
                      <UserCheck size={14} /> Assigner
                    </button>
                    <button type="button" onClick={() => onStatusChange(row.id)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200 transition hover:bg-emerald-500/15">
                      <ShieldCheck size={14} /> Statut
                    </button>
                    <button type="button" onClick={() => onCreateLitige(row)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10">
                      <FileText size={14} /> Litige
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Page {currentPage} sur {totalPages}</p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={onPrevious}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={onNext}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModerationTable;

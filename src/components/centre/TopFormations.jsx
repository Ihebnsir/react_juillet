import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const TopFormations = ({ formations = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top formations</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-x-2 text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400">
              <th className="w-[26%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Formation</th>
              <th className="w-[14%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Catégorie</th>
              <th className="w-[10%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Étudiants</th>
              <th className="w-[12%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Réservations</th>
              <th className="w-[18%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Complétion</th>
              <th className="w-[8%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Note</th>
              <th className="w-[12%] px-2 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
              <th className="w-[6%] px-2 py-3 text-right text-xs font-semibold uppercase tracking-wide"> </th>
            </tr>
          </thead>
          <tbody>
            {formations.map((f) => (
              <tr key={f.id} className="align-top border-t border-slate-100 dark:border-slate-700">
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.image || '/images/formation-placeholder.svg'}
                      alt={f.title}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/images/formation-placeholder.svg';
                      }}
                      className="h-10 w-16 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">{f.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{f.subtitle || 'Formation active'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-slate-600 dark:text-slate-300">{f.category || 'Général'}</td>
                <td className="px-2 py-3 text-slate-600 dark:text-slate-300">{f.students || 24}</td>
                <td className="px-2 py-3 text-slate-600 dark:text-slate-300">{f.reservations || 12}</td>
                <td className="px-2 py-3">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div style={{ width: `${f.completion || 40}%` }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600" />
                  </div>
                </td>
                <td className="px-2 py-3 text-slate-600 dark:text-slate-300">{f.rating || 4.2}</td>
                <td className="px-2 py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Actif</span></td>
                <td className="px-2 py-3 text-right"><button type="button" onClick={() => navigate(`/centre/offres/${f.id}`)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"><FiMoreHorizontal /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopFormations;

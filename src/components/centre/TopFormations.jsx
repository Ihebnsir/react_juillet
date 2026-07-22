import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const TopFormations = ({ formations = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top formations</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Formation</th>
              <th>Catégorie</th>
              <th>Étudiants</th>
              <th>Réservations</th>
              <th>Complétion</th>
              <th>Note</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="mt-2 space-y-2">
            {formations.map((f) => (
              <tr key={f.id} className="align-top border-t border-slate-100 dark:border-slate-700">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 rounded-md bg-slate-100 dark:bg-slate-700" />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">{f.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{f.subtitle}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{f.category || 'Général'}</td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{f.students || 24}</td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{f.reservations || 12}</td>
                <td className="py-3">
                  <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div style={{ width: `${f.completion || 40}%` }} className="h-full bg-gradient-to-r from-brand-500 to-brand-600" />
                  </div>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{f.rating || 4.2}</td>
                <td className="py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 text-xs">Actif</span></td>
                <td className="py-3 text-right"><button onClick={() => navigate(`/centre/offres/${f.id}`)} className="p-2 text-slate-500 hover:text-slate-700"><FiMoreHorizontal /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopFormations;

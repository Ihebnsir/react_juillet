import React from 'react';
import { FiRotateCcw, FiTrash2, FiArchive } from 'react-icons/fi';
import { useTrash } from '../../context/TrashContext';

const formatTimestamp = (value) => new Date(value).toLocaleString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const TrashPage = () => {
  const { trashItems, restoreItem, deletePermanently } = useTrash();

  return (
    <div className="space-y-6 rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-800">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Corbeille</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Restaurer ou supprimer définitivement les éléments retirés du système.</p>
      </div>

      {trashItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">La corbeille est vide.</div>
      ) : (
        <div className="space-y-3">
          {trashItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <FiArchive size={16} />
                    <span>{item.type}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.item?.title || item.item?.name || 'Élément supprimé'}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span>Supprimé le : {formatTimestamp(item.deletedAt)}</span>
                    <span>Responsable : {item.deletedBy}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => restoreItem(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"><FiRotateCcw size={16} /> Restaurer</button>
                  <button type="button" onClick={() => {
                    if (window.confirm('Supprimer définitivement cet élément ?')) {
                      deletePermanently(item.id);
                    }
                  }} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700 dark:border-rose-700 dark:text-rose-300"><FiTrash2 size={16} /> Supprimer définitivement</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;

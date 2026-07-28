import React, { useMemo, useState } from 'react';
import { FiArchive, FiRotateCcw, FiTrash2 } from 'react-icons/fi';

const deletedItems = [
  { id: 1, type: 'Formation', name: 'Formation IA débutant', deletedAt: '2026-07-27' },
  { id: 2, type: 'Centre', name: 'Centre Alpha', deletedAt: '2026-07-26' },
  { id: 3, type: 'Utilisateur', name: 'Sonia K.', deletedAt: '2026-07-25' },
];

export const AdminTrashPage = () => {
  const [items, setItems] = useState(deletedItems);

  const restoreItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const deletePermanently = (id) => setItems((current) => current.filter((item) => item.id !== id));

  const emptyState = useMemo(() => items.length === 0, [items]);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Corbeille intelligente</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Éléments supprimés</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Restaurez rapidement des éléments supprimés ou supprimez-les définitivement.</p>
      </div>

      {emptyState ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          La corbeille est vide.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-200"><FiArchive size={16} /></div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.type} • supprimé le {item.deletedAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => restoreItem(item.id)} className="rounded-lg border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20"><FiRotateCcw size={16} /></button>
                <button type="button" onClick={() => deletePermanently(item.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTrashPage;

import React from 'react';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useFavorites } from '../../context/FavoritesContext';

export const MesFavorisPage = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300"><FiHeart /></div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes favoris</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Favoris locaux enregistrés dans ce navigateur.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {favorites.length > 0 ? favorites.map((formation) => (
          <div key={formation.id} className="rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900 dark:text-slate-100">{formation.title}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{formation.category || formation.domain || '—'}</p>
              </div>
              <button type="button" onClick={() => removeFavorite(formation.id)} aria-label={`Retirer ${formation.title}`} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><FiTrash2 /></button>
            </div>
          </div>
        )) : <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Aucun favori pour le moment.</div>}
      </div>
    </div>
  );
};

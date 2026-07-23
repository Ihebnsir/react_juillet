import React from 'react';
import { FiStar, FiInbox } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getMesAvisForUser } from '../../services/apprenantExperienceService';

export const MesAvisPage = () => {
  const { user } = useAuth();
  const avis = getMesAvisForUser(user?.id || 1);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Mes avis</h1>
      {avis.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
            <FiInbox size={24} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Aucun avis pour l'instant</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Vos avis sur les formations terminées apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {avis.map((item) => (
            <div key={item.id} className="card flex flex-col justify-between gap-4 p-5 md:flex-row md:items-start">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.formationTitre}</p>
                <div className="my-1 flex gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <FiStar key={index} size={14} className={index < item.note ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.commentaire}</p>
              </div>
              <button className="btn-secondary text-sm">Modifier</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

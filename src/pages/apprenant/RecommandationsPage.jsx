import React from 'react';
import { FiZap } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { FormationCard } from '../../components/Cards/FormationCard';
import { getRecommandationsForUser } from '../../services/apprenantExperienceService';

export const RecommandationsPage = () => {
  const { user } = useAuth();
  const recommandations = getRecommandationsForUser(user?.id || 1);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-2 text-slate-900 dark:text-slate-100">Recommandé pour vous</h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">Basé sur vos formations suivies et votre profil</p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {recommandations.map((reco) => (
          <div key={reco.id} className="card p-4">
            <FormationCard formation={reco.formation} />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-500 dark:text-brand-300">
              <FiZap size={12} /> {reco.raison}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

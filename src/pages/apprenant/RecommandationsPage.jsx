import React, { useEffect, useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { FormationCard } from '../../components/Cards/FormationCard';
import { getRecommandationsForUser } from '../../services/apprenantExperienceService';

export const RecommandationsPage = () => {
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getRecommandationsForUser()
      .then((items) => { if (mounted) setRecommandations(items); })
      .catch((requestError) => { if (mounted) setError(requestError?.message || 'Impossible de charger les recommandations.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-2 text-slate-900 dark:text-slate-100">Recommandé pour vous</h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">Basé sur vos formations suivies et votre profil</p>

      {loading ? <p className="text-sm text-slate-500">Chargement...</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {!loading && !error && recommandations.length === 0 ? <p className="rounded-xl border border-dashed p-6 text-sm text-slate-500">Aucune recommandation disponible.</p> : null}
      {!loading && !error && recommandations.length > 0 ? <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {recommandations.map((reco) => (
          <div key={reco.id} className="card p-4">
            <FormationCard formation={reco.formation} />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-500 dark:text-brand-300">
              <FiZap size={12} /> {reco.raison}
            </p>
          </div>
        ))}
      </div> : null}
    </div>
  );
};

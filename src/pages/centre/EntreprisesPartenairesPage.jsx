import React from 'react';
import { FiBriefcase, FiInfo } from 'react-icons/fi';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';

export const EntreprisesPartenairesPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Entreprises partenaires</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Les données partenaires ne sont pas encore disponibles via le backend.</p>
          </div>
        </div>
      </div>

      <EmptyStateCard
        icon={FiBriefcase}
        title="Aucune entreprise partenaire disponible"
        description="Le backend SkillBridge ne fournit pas actuellement de catalogue d’entreprises partenaires. Les données seront restaurées automatiquement dès qu’une API dédiée sera disponible."
        primaryLabel="Indisponible"
        onPrimary={() => undefined}
      />

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <FiInfo className="mt-0.5 shrink-0" />
          <p>
            Cette page reste vide par design tant qu’aucune source backend n’expose les entreprises partenaires.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntreprisesPartenairesPage;

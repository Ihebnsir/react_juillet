import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockCentres } from '../../data/mockCentres';

const StatusBanner = ({ color, text }) => (
  <div
    className={`mt-4 rounded-lg border p-4 text-sm font-medium ${color}`}
    role="status"
  >
    {text}
  </div>
);

const FormulaireSoumission = ({ centre, onSoumettre }) => {
  const [motif, setMotif] = useState('');

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">Soumettre les justificatifs</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
        {centre?.name}
      </p>

      <label className="mt-3 block text-sm font-medium text-gray-700 dark:text-slate-200">
        Note / description (démo)
      </label>
      <input
        value={motif}
        onChange={(e) => setMotif(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        placeholder="Décrivez brièvement vos justificatifs..."
      />

      <button
        type="button"
        onClick={() => onSoumettre({ motif })}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
      >
        Envoyer la demande (démo)
      </button>

      <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
        Pas de backend: l’état est mis à jour uniquement pour tester l’UI.
      </p>
    </div>
  );
};

export const StatutVerificationPage = () => {
  const { user } = useAuth();
  const [localCentres, setLocalCentres] = useState(mockCentres);

  const centre = useMemo(() => {
    if (!user?.id) return undefined;
    return localCentres.find((c) => c.id === user.id);
  }, [localCentres, user?.id]);

  const handleSoumettre = ({ motif }) => {
    setLocalCentres((prev) =>
      prev.map((c) => {
        if (c.id !== centre?.id) return c;
        return {
          ...c,
          statutVerification: 'en_attente',
          dateDemande: new Date().toISOString().slice(0, 10),
          dateValidation: null,
          motifRejet: null,
          verifie: false,
          // conserve motif dans un champ non utilisé si besoin (démo)
          motifJustification: motif || null,
        };
      })
    );
  };

  if (!centre) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-rose-900/50 dark:bg-slate-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Statut de vérification</h1>
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">
          Centre introuvable pour l’utilisateur connecté.
        </div>
      </div>
    );
  }

  // Adaptation des 4 statuts obligatoires au contenu demandé.
  const statut = centre.statutVerification;

  const banner = (() => {
    switch (statut) {
      case 'non_soumis':
        return (
          <StatusBanner
            color="border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-200"
            text="Vous n'avez pas encore soumis de demande de vérification."
          />
        );
      case 'en_attente':
        return (
          <StatusBanner
            color="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
            text={`Votre demande est en cours d'examen par notre équipe.${
              centre.dateDemande ? ` Date de soumission : ${centre.dateDemande}` : ''}`}
          />
        );
      case 'verifie':
        return (
          <StatusBanner
            color="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
            text={`Félicitations, votre centre est vérifié !${
              centre.dateValidation ? ` Date d'obtention : ${centre.dateValidation}` : ''}`}
          />
        );
      case 'rejete':
        return (
          <StatusBanner
            color="border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200"
            text={`Votre demande a été rejetée : ${centre.motifRejet || 'Motif non précisé.'}`}
          />
        );
      default:
        return (
          <StatusBanner
            color="border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200"
            text="Erreur: statut de vérification inconnu."
          />
        );
    }
  })();

  const canSubmit = statut === 'non_soumis' || statut === 'rejete';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Statut de vérification</h1>

      <div className="mt-3 text-sm text-gray-600 dark:text-slate-300">
        <span className="font-semibold text-gray-900 dark:text-slate-100">{centre.name}</span>
      </div>

      {banner}

      {canSubmit && (
        <FormulaireSoumission centre={centre} onSoumettre={handleSoumettre} />
      )}

      {!canSubmit && statut === 'rejete' && (
        <div className="mt-4" />
      )}

      {statut === 'rejete' && (
        <button
          type="button"
          onClick={() => {
            setLocalCentres((prev) =>
              prev.map((c) =>
                c.id === centre.id
                  ? {
                      ...c,
                      statutVerification: 'non_soumis',
                      dateDemande: null,
                      dateValidation: null,
                      motifRejet: null,
                      verifie: false,
                    }
                  : c
              )
            );
          }}
          className="mt-3 inline-flex items-center justify-center rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-900/20"
        >
          Soumettre une nouvelle demande
        </button>
      )}
    </div>
  );
};


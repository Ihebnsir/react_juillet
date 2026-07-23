import React from 'react';

const decouperEnSemaines = (activiteParJour, nbSemaines = 12) => {
  const donnees = Array.isArray(activiteParJour)
    ? activiteParJour
    : Object.entries(activiteParJour).map(([date, niveau]) => ({ date, niveau }));

  const valeurs = donnees.slice(-nbSemaines * 7);
  const semaines = [];

  for (let semaine = 0; semaine < nbSemaines; semaine += 1) {
    const jours = [];
    for (let jour = 0; jour < 7; jour += 1) {
      const index = semaine * 7 + jour;
      const entree = valeurs[index] || { date: '', niveau: 0 };
      jours.push(entree);
    }
    semaines.push(jours);
  }

  return semaines;
};

export const ActivityHeatmap = ({ activiteParJour }) => {
  const semaines = decouperEnSemaines(activiteParJour, 12);
  const joursActifs = activiteParJour.filter ? activiteParJour.filter((jour) => jour.niveau > 0).length : 0;

  const niveauCouleur = (niveau) => {
    if (niveau === 0) return 'bg-slate-700';
    if (niveau <= 2) return 'bg-brand-800';
    if (niveau <= 4) return 'bg-brand-600';
    return 'bg-brand-400';
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">Mon activité récente</h3>
        <p className="text-xs text-slate-400">{joursActifs} jours actifs sur 12 semaines</p>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-0.5 text-[10px] text-slate-500">
          <span>Lun</span>
          <span>Mer</span>
          <span>Ven</span>
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {semaines.map((semaine, semaineIndex) => (
            <div key={semaineIndex} className="flex flex-col gap-1">
              {semaine.map((jour, jourIndex) => (
                <div
                  key={`${semaineIndex}-${jourIndex}`}
                  title={`${jour.date} : ${jour.niveau} action(s)`}
                  className={`h-3.5 w-3.5 rounded-sm transition hover:ring-1 hover:ring-white/40 ${niveauCouleur(jour.niveau)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
        <span>Moins</span>
        <div className="h-3 w-3 rounded-sm bg-slate-700" />
        <div className="h-3 w-3 rounded-sm bg-brand-800" />
        <div className="h-3 w-3 rounded-sm bg-brand-600" />
        <div className="h-3 w-3 rounded-sm bg-brand-400" />
        <span>Plus</span>
      </div>
    </div>
  );
};

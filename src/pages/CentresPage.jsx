import { Link } from 'react-router-dom';
import { FiMapPin, FiAward } from 'react-icons/fi';
import { mockCentres } from '../data/mockCentres';

export const CentresPage = () => {
  return (
    <main className="min-h-screen bg-brand-50/70 px-4 py-16 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/70 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">
            Centres de formation
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Découvrez des centres de formation sélectionnés pour votre réussite.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Explorez des établissements fiables, reconnus et prêts à vous accompagner sur votre parcours professionnel.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mockCentres.map((centre) => (
            <article key={centre.id} className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{centre.name}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <FiMapPin /> {centre.ville}
                  </p>
                </div>
                <span className="rounded-full bg-brand-400/15 px-3 py-1 text-sm font-semibold text-brand-700 dark:text-brand-200">
                  {centre.verifie ? 'Vérifié' : 'À confirmer'}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FiAward /> {centre.formationsPubliees} formations publiées
              </div>
              <Link to={`/centres/${centre.id}`} className="mt-6 inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300">
                Voir le profil
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

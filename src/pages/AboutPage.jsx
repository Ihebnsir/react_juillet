import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export const AboutPage = () => {
  return (
    <main className="min-h-screen bg-brand-50/70 px-4 py-16 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/70 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">
            À propos de SkillBridge
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Un pont simple entre les apprenants et les centres de formation de Tunisie.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            SkillBridge a été pensé pour rendre l’apprentissage plus accessible, plus clair et plus rassurant.
            Notre mission est de rapprocher les personnes qui veulent évoluer de centres fiables, accompagnés et alignés avec leurs objectifs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/formations" className="btn-primary inline-flex items-center gap-2">
              Découvrir les formations <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn-outline inline-flex items-center gap-2">
              Nous contacter
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Une plateforme pensée pour l’accessibilité',
              text: 'Des parcours simples pour découvrir, comparer et réserver une formation sans friction.',
            },
            {
              title: 'Des centres vérifiés',
              text: 'Chaque centre est sélectionné pour offrir une expérience professionnelle et fiable.',
            },
            {
              title: 'Un accompagnement fiable',
              text: 'Des supports, des certificats et une expérience de réservation pensée pour tous les profils.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{item.title}</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

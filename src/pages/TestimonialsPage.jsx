import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Sonia',
    role: 'Développeuse web',
    quote: 'J’ai trouvé la formation idéale en quelques minutes. L’expérience est fluide et parfaitement adaptée à mes objectifs de carrière.',
  },
  {
    name: 'Hedi',
    role: 'Chef de projet',
    quote: 'Le suivi et la qualité des centres proposés m’ont vraiment rassuré. Je recommande SkillBridge sans hésiter.',
  },
  {
    name: 'Amira',
    role: 'Designer UX',
    quote: 'Le moteur de recherche et les informations sur chaque centre m’ont permis de choisir rapidement la bonne formation.',
  },
];

export const TestimonialsPage = () => {
  return (
    <main className="min-h-screen bg-brand-50/70 px-4 py-16 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/70 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">
            Témoignages
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Ce que disent les apprenants qui ont déjà commencé leur parcours.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Des parcours variés, des objectifs concrets et une expérience qui aide à prendre confiance dans chaque étape.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FiStar key={`${item.name}-${index}`} />
                ))}
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">“{item.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export const ContactPage = () => {
  return (
    <main className="min-h-screen bg-brand-50/70 px-4 py-16 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/70 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">
            Contact
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Parlons de votre prochain projet de formation.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Notre équipe répond rapidement pour vous aider à trouver la bonne opportunité, le bon centre ou le bon accompagnement.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <FiMail className="text-brand-600 dark:text-brand-300" size={22} />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Email</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">contact@skillbridge.tn</p>
          </article>
          <article className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <FiPhone className="text-brand-600 dark:text-brand-300" size={22} />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Téléphone</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">+216 71 000 000</p>
          </article>
          <article className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <FiMapPin className="text-brand-600 dark:text-brand-300" size={22} />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Adresse</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Tunis, Tunisie</p>
          </article>
        </section>
      </div>
    </main>
  );
};

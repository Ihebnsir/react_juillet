import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getTextesAPropos } from '../services/contenuAccueilService';

export const AboutPage = () => {
  const [textes, setTextes] = useState(getTextesAPropos());

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'skillbridge_home_about_content') setTextes(getTextesAPropos());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <main className="min-h-screen bg-brand-50/70 px-4 py-16 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {/* Hero */}
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/70 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">À propos</p>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">À propos de SkillBridge</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">SkillBridge est une plateforme numérique qui connecte les apprenants, les centres de formation et les entreprises afin de simplifier la découverte, la réservation et la gestion des formations.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/formations" className="btn-primary inline-flex items-center gap-2">Découvrir les formations <FiArrowRight /></Link>
              <Link to="/contact" className="btn-outline inline-flex items-center gap-2">Nous contacter</Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-gradient-to-br from-brand-200 to-teal-200 dark:from-slate-800 dark:to-slate-900">
            <img src="/images/apercu-dashboard-apprenant.png" alt="Illustration SkillBridge" className="w-full h-full object-cover opacity-95" />
          </div>
        </section>

        {/* Notre histoire (admin-editable) */}
        <section>
          <h2 className="text-2xl font-display font-bold mb-4 text-slate-900 dark:text-white">{textes.titre}</h2>
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60">
            <p className="text-slate-600 dark:text-slate-300">{textes.paragraphe1}</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{textes.paragraphe2}</p>
          </div>
        </section>
        {/* The following sections were removed per request: Notre mission, Pourquoi SkillBridge ?, Nos valeurs,
            Comment fonctionne SkillBridge ?, Technologies, and the final CTA. Spacing reduced above to avoid
            large empty gaps. No other content or files were modified. */}
      </div>
    </main>
  );
};

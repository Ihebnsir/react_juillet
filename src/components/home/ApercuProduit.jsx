import React from 'react';

export const ApercuProduit = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-10 px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-wide text-brand-400 font-semibold mb-2">Aperçu</p>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
          Une plateforme pensée pour chaque utilisateur
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 max-w-6xl mx-auto px-4 sm:px-0">
        <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src="/images/apercu-dashboard-apprenant.png"
            alt="Dashboard apprenant"
            className="w-full h-full object-cover"
          />
          <div className="p-5 bg-white/90 dark:bg-slate-950/90">
            <p className="font-semibold text-slate-900 dark:text-white">Suivez votre progression</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Statistiques, calendrier et recommandations personnalisées.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src="/images/apercu-certificat.png"
            alt="Certificat vérifiable"
            className="w-full h-40 object-cover"
          />
          <div className="p-5 bg-white/90 dark:bg-slate-950/90">
            <p className="font-semibold text-slate-900 dark:text-white">Certificats vérifiables</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              QR code de vérification instantanée.
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src="/images/apercu-messagerie.png"
            alt="Messagerie"
            className="w-full h-28 object-cover"
          />
          <div className="p-4 bg-white/90 dark:bg-slate-950/90">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Messagerie intégrée</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src="/images/apercu-centre.png"
            alt="Espace centre"
            className="w-full h-28 object-cover"
          />
          <div className="p-4 bg-white/90 dark:bg-slate-950/90">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Espace centre dédié</p>
          </div>
        </div>
      </div>
    </section>
  );
};

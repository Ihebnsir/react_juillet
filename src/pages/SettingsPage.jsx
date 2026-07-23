import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiGlobe, FiMoon, FiShield, FiChevronRight, FiMail, FiMessageCircle, FiSmartphone, FiUsers, FiEye, FiLock, FiCalendar } from 'react-icons/fi';

function ToggleRow({ label, description, icon: Icon, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition hover:border-brand-200 hover:bg-brand-50/30 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-brand-500/30 dark:hover:bg-slate-800">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <Icon size={16} />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setChecked((prev) => !prev)}
        className={`relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-all duration-200 ${
          checked
            ? 'bg-brand-500 shadow-[0_0_0_4px_rgba(20,184,166,0.15)]'
            : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-700">
        {Icon && <Icon size={18} className="text-brand-600 dark:text-brand-400" />}
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.section>
  );
}

export const SettingsPage = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    {/* Header */}
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Compte</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gérez vos préférences et la configuration de votre compte.
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
        <FiShield size={12} />
        Configuration générale
      </span>
    </div>

    {/* Notifications */}
    <SectionCard title="Notifications" icon={FiBell}>
      <ToggleRow
        label="Notifications par email"
        description="Recevez les alertes importantes par email"
        icon={FiMail}
        defaultChecked
      />
      <ToggleRow
        label="Rappels de session"
        description="Rappels avant le début d'une session"
        icon={FiCalendar}
        defaultChecked
      />
      <ToggleRow
        label="Recommandations personnalisées"
        description="Suggestions de formations adaptées à votre profil"
        icon={FiUsers}
        defaultChecked
      />
      <ToggleRow
        label="Notifications push"
        description="Alertes en temps réel dans l'application"
        icon={FiSmartphone}
        defaultChecked
      />
    </SectionCard>

    {/* Affichage */}
    <SectionCard title="Langue et affichage" icon={FiGlobe}>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <FiGlobe size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Langue de l'interface</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Modifiable aussi depuis le sélecteur de langue de la topbar.
            </p>
          </div>
        </div>
        <span className="text-sm font-medium text-brand-600 dark:text-brand-300">Français</span>
      </div>
      <ToggleRow
        label="Mode sombre"
        description="Activer le thème sombre pour réduire la fatigue visuelle"
        icon={FiMoon}
        defaultChecked={false}
      />
      <ToggleRow
        label="Mode lecture"
        description="Interface épurée pour une meilleure concentration"
        icon={FiEye}
        defaultChecked={false}
      />
    </SectionCard>

    {/* Confidentialité */}
    <SectionCard title="Confidentialité et sécurité" icon={FiLock}>
      <ToggleRow
        label="Profil visible"
        description="Permettre aux centres de formation de voir votre profil"
        icon={FiUsers}
        defaultChecked
      />
      <ToggleRow
        label="Historique d'activité"
        description="Conserver l'historique de vos actions sur la plateforme"
        icon={FiEye}
        defaultChecked
      />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-left transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <FiLock size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Changer le mot de passe</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Mettez à jour votre mot de passe régulièrement
            </p>
          </div>
        </div>
        <FiChevronRight size={16} className="text-slate-400" />
      </motion.button>
    </SectionCard>

    {/* Zone de danger */}
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-rose-200/80 bg-white p-5 shadow-sm dark:border-rose-900/60 dark:bg-slate-800"
    >
      <div className="mb-4 border-b border-rose-100 pb-3 dark:border-rose-900/40">
        <h2 className="flex items-center gap-2 font-semibold text-rose-500">
          <FiShield size={16} />
          Zone de danger
        </h2>
      </div>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        Ces actions sont irréversibles. Soyez prudent.
      </p>
      <button
        type="button"
        className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 active:scale-[0.98] dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
      >
        Supprimer mon compte
      </button>
    </motion.section>
  </div>
);

export default SettingsPage;


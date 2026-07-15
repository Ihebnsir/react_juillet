import { FiBookOpen, FiMapPin, FiStar, FiShield, FiClock, FiUsers } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const ContextPanel = ({ conversation, userRole, onStatusChange, statusOptions = ['ouvert', 'en_cours', 'résolu'] }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (!conversation) {
    return null;
  }

  return (
    <aside className={`w-full rounded-[28px] border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 ${isRtl ? 'text-right' : 'text-left'}`}>
      {conversation.type === 'direct' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <FiBookOpen className="h-4 w-4 text-teal-600" />
              {conversation.formationTitle}
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{conversation.formationPrice} TND</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <FiMapPin className="h-4 w-4 text-teal-600" />
              {conversation.participantName}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <FiStar className="h-4 w-4 text-amber-500" />
              4.8/5 · Centre vérifié
            </div>
          </div>
          {userRole === 'apprenant' && (
            <button className="w-full rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700">
              Réserver cette formation
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <FiShield className="h-4 w-4 text-teal-600" />
              Statut du ticket
            </div>
            {userRole === 'admin' ? (
              <div className="mt-3 space-y-2">
                <select
                  value={conversation.status || 'ouvert'}
                  onChange={(event) => onStatusChange?.(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'ouvert' ? 'Ouvert' : status === 'en_cours' ? 'En cours' : 'Résolu'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400">Les changements apparaissent immédiatement dans la liste.</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Le statut est géré par l’équipe SkillBridge.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <FiUsers className="h-4 w-4 text-teal-600" />
              Détails du profil
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span>Rôle</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{conversation.participantRole}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Inscription</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">2025</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Tickets</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">3</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-amber-50/70 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
              <FiClock className="h-4 w-4" />
              Notes internes
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Ces notes sont réservées aux administrateurs et ne sont visibles par aucun utilisateur.</p>
          </div>
        </div>
      )}
    </aside>
  );
};

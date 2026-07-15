import { FiSearch, FiPlusCircle, FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { ConversationListItem } from './ConversationListItem';
import { ConversationSkeleton } from './ConversationSkeleton';

export const ConversationList = ({ conversations, activeConversationId, onSelectConversation, onNewSupportConversation, isLoading, userRole, search, onSearchChange, filters, onFilterChange }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const isAdmin = userRole === 'admin';

  return (
    <aside className="flex h-full flex-col rounded-[28px] border border-slate-200/70 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('messaging.conversations', 'Conversations')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('messaging.subtitle', 'Messages récents')}</p>
        </div>
        {isAdmin && (
          <button
            onClick={onNewSupportConversation}
            className="rounded-full border border-teal-200 p-2 text-teal-600 transition hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/20"
            aria-label={t('messaging.newSupport', 'Nouveau support')}
          >
            <FiPlusCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className={`mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <FiSearch className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('messaging.searchPlaceholder', 'Rechercher')}
          className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
        />
      </div>

      {isAdmin && (
        <div className={`mt-3 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <FiFilter className="h-4 w-4 text-slate-400" />
          {['all', 'ouvert', 'en_cours', 'résolu'].map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filters === filter ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              {t(`messaging.filters.${filter}`, filter === 'all' ? 'Tous' : filter === 'ouvert' ? 'Ouverts' : filter === 'en_cours' ? 'En cours' : 'Résolus')}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex-1 space-y-2 overflow-auto pr-1">
        {isLoading ? (
          <ConversationSkeleton />
        ) : conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            {t('messaging.emptyList', 'Aucune conversation disponible pour le moment.')}
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

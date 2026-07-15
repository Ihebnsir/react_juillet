import { FiUser } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.round((now - date) / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  if (diffHours < 48) {
    return 'Hier';
  }

  return date.toLocaleDateString('fr-FR', { weekday: 'short' });
};

export const ConversationListItem = ({ conversation, isActive, onClick }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const initials = conversation.participantName
    ?.split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-start gap-3 rounded-2xl border border-transparent p-3 text-left transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 ${isActive ? 'border-teal-200 bg-teal-50/80 shadow-sm dark:border-teal-900/40 dark:bg-teal-900/20' : 'bg-white/70 dark:bg-slate-900/40'}`}
    >
      <div className={`relative flex-shrink-0 ${isRtl ? 'order-2' : 'order-1'}`}>
        {conversation.participantAvatar ? (
          <img src={conversation.participantAvatar} alt={conversation.participantName} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 text-sm font-semibold text-white">
            {initials || <FiUser className="h-5 w-5" />}
          </div>
        )}
        {conversation.unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-semibold text-white">
            {conversation.unreadCount > 1 ? conversation.unreadCount : ''}
          </span>
        )}
      </div>

      <div className={`min-w-0 flex-1 ${isRtl ? 'order-1' : 'order-2'}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{conversation.participantName}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {conversation.participantRole}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{formatRelativeTime(conversation.lastMessageAt)}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{conversation.lastMessage}</p>
          {conversation.type === 'support' && conversation.status && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${conversation.status === 'ouvert' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : conversation.status === 'en_cours' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
              {conversation.status}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

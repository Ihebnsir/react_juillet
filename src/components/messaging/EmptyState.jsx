import { FiMessageSquare, FiPlusCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const EmptyState = ({ title, description, actionLabel, onAction }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className={`flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/70 bg-white/80 px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/70 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="mb-4 rounded-2xl bg-teal-50 p-4 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300">
        <FiMessageSquare className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          <FiPlusCircle className="h-4 w-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileText, Filter, LayoutGrid, List as ListIcon, Search, X } from 'lucide-react';

const badgeTone = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300',
  rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300',
  blue: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-900/20 dark:text-sky-300',
  violet: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/40 dark:bg-violet-900/20 dark:text-violet-300',
  slate: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export const TicketManagerLayout = ({
  title,
  subtitle,
  breadcrumb,
  stats = [],
  searchValue,
  onSearchChange,
  filterControls = [],
  onExportCsv,
  onExportPdf,
  viewMode,
  onViewModeChange,
  selectedCount = 0,
  onSelectAllVisible,
  bulkActions = [],
  pagination,
  emptyState,
  children,
}) => {
  const hasFilters = filterControls.some((control) => control.value);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">{breadcrumb}</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {onExportCsv ? (
              <button type="button" onClick={onExportCsv} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
                <Download size={16} /> CSV
              </button>
            ) : null}
            {onExportPdf ? (
              <button type="button" onClick={onExportPdf} className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
                <FileText size={16} /> PDF
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <Icon className={stat.tone || 'text-brand-500'} />
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
              {stat.helper ? <p className={`mt-1 text-sm ${stat.helperTone || 'text-slate-500 dark:text-slate-400'}`}>{stat.helper}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-700/50">
              <Search size={16} className="text-slate-400" />
              <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Rechercher par mot-clé, ID ou auteur" className="w-full bg-transparent outline-none" />
            </label>
            {filterControls.map((control) => (
              <select key={control.key} value={control.value} onChange={(event) => control.onChange(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-700">
                <option value="">{control.label}</option>
                {control.options.map((option) => (
                  <option key={option.value || option} value={option.value || option}>{option.label || option}</option>
                ))}
              </select>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => onViewModeChange('cards')} className={`p-2.5 ${viewMode === 'cards' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                <LayoutGrid size={16} />
              </button>
              <button type="button" onClick={() => onViewModeChange('table')} className={`p-2.5 ${viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                <ListIcon size={16} />
              </button>
            </div>
            {onSelectAllVisible ? (
              <button type="button" onClick={onSelectAllVisible} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Tout sélectionner
              </button>
            ) : null}
          </div>
        </div>
        {hasFilters ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Filter size={14} /> Filtres actifs
          </div>
        ) : null}
      </div>

      {selectedCount > 0 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-300">
          <span>{selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}</span>
          <div className="flex flex-wrap gap-2">
            {bulkActions.map((action) => (
              <button key={action.label} type="button" onClick={action.onClick} className={`rounded-2xl px-3 py-2 font-medium text-white ${action.className || 'bg-brand-600'}`}>
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}

      {emptyState && !children ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
          {emptyState}
        </div>
      ) : null}

      {children}

      {pagination ? (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
          <span>{pagination.label}</span>
          <div className="flex items-center gap-2">
            {pagination.previous ? <button type="button" onClick={pagination.previous.onClick} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">Précédent</button> : null}
            {pagination.next ? <button type="button" onClick={pagination.next.onClick} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">Suivant</button> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TicketManagerLayout;

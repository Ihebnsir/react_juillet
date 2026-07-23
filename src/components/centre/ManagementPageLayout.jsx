import React from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

export const ManagementPageLayout = ({
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel,
  children,
  emptyState,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>

          {onPrimaryAction ? (
            <button type="button" onClick={onPrimaryAction} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500">
              <FiPlus size={16} /> {primaryActionLabel}
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Rechercher"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {filterOptions?.length ? (
            <div className="relative">
              <FiFilter className="pointer-events-none absolute left-3 top-3 text-slate-400" />
              <select
                value={filterValue}
                onChange={(event) => onFilterChange?.(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="all">{filterLabel}</option>
                {filterOptions.filter((option) => option !== 'all').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </div>

      {children}
      {emptyState}
    </div>
  );
};

export default ManagementPageLayout;

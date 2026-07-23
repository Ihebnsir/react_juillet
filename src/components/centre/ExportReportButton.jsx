import React, { useMemo, useState } from 'react';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';

const buildCsv = () => {
  const rows = [
    ['Titre', 'Catégorie', 'Réservations', 'Prix'],
    ...mockFormations.slice(0, 6).map((formation) => [
      formation.title,
      formation.category || 'Général',
      mockReservations.filter((reservation) => reservation.formationId === formation.id).length,
      formation.price,
    ]),
  ];

  return rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
};

const exportFile = (type) => {
  const data = type === 'csv' ? buildCsv() : 'Rapport SkillBridge\n\nExport simulé depuis les données mockées.';
  const blob = new Blob([data], { type: type === 'csv' ? 'text/csv;charset=utf-8' : 'application/pdf;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `rapport-centre.${type}`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

export const ExportReportButton = () => {
  const [open, setOpen] = useState(false);
  const itemLabel = useMemo(() => 'Exporter rapport', []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-400"
      >
        <FiDownload size={16} />
        {itemLabel}
        <FiChevronDown size={16} />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              exportFile('csv');
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            CSV
          </button>
          <button
            type="button"
            onClick={() => {
              exportFile('pdf');
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            PDF
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ExportReportButton;

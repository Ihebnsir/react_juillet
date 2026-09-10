import React, { useState } from 'react';
import { FiChevronDown, FiDownload } from 'react-icons/fi';

export const ExportReportButton = () => {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const unavailable = () => {
    setNotice('Export indisponible: le backend ne fournit pas encore d endpoint de rapport.');
    setOpen(false);
  };

  return <div className="relative"><button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-400"><FiDownload size={16} />Exporter rapport<FiChevronDown size={16} /></button>{open ? <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"><button type="button" onClick={unavailable} className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">CSV indisponible</button><button type="button" onClick={unavailable} className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">PDF indisponible</button></div> : null}{notice ? <p role="status" className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 shadow-lg">{notice}</p> : null}</div>;
};

export default ExportReportButton;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiFileText, FiCheck } from 'react-icons/fi';

const AdminExportButtons = () => {
  const [exporting, setExporting] = useState(null);

  const handleExportPDF = () => {
    setExporting('pdf');
    setTimeout(() => {
      window.print();
      setExporting(null);
    }, 300);
  };

  const handleExportExcel = () => {
    setExporting('excel');
    setTimeout(() => {
      const csv = [
        ['Section', 'Valeur', 'Statut', 'Date'],
        ['Utilisateurs', '25', 'Actif', new Date().toISOString().split('T')[0]],
        ['Centres', '12', 'Actif', new Date().toISOString().split('T')[0]],
        ['Formations', '8', 'Publié', new Date().toISOString().split('T')[0]],
        ['Réservations', '45', 'Confirmé', new Date().toISOString().split('T')[0]],
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillbridge-rapport-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(null);
    }, 500);
  };

  const handlePrint = () => {
    setExporting('print');
    setTimeout(() => {
      window.print();
      setExporting(null);
    }, 300);
  };

  const btnClass = (type) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
      exporting === type
        ? 'bg-brand-500 text-white'
        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
    }`;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Export
      </h3>
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleExportPDF}
          className={btnClass('pdf')}
        >
          {exporting === 'pdf' ? <FiCheck size={16} /> : <FiFileText size={16} />}
          Exporter PDF
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleExportExcel}
          className={btnClass('excel')}
        >
          {exporting === 'excel' ? <FiCheck size={16} /> : <FiDownload size={16} />}
          Exporter Excel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className={btnClass('print')}
        >
          {exporting === 'print' ? <FiCheck size={16} /> : <FiPrinter size={16} />}
          Imprimer
        </motion.button>
      </div>
    </div>
  );
};

export default AdminExportButtons;


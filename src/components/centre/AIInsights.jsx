import React from 'react';

export const AIInsights = ({ insights = [] }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Insights IA</h4>
    <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      {insights.length === 0 ? <div>Aucun insight pour le moment.</div> : insights.map((s, i) => (
        <div key={i} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">{s}</div>
      ))}
    </div>
  </div>
);

export default AIInsights;

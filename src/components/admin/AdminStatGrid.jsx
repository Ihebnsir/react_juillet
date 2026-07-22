import React from 'react';

export const AdminStatGrid = ({ stats }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((s, i) => (
      <div key={i} className="rounded-2xl bg-white/5 p-4 shadow-md backdrop-blur-sm border border-white/6">
        <div className="text-sm text-slate-300">{s.label}</div>
        <div className="mt-2 text-2xl font-semibold text-white">{s.value}</div>
        {s.delta && <div className="mt-1 text-xs text-slate-400">{s.delta}</div>}
      </div>
    ))}
  </div>
);

export default AdminStatGrid;

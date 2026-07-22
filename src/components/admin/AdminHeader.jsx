import React from 'react';

export const AdminHeader = ({ title, subtitle }) => (
  <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 text-white shadow-lg">
    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
    <div className="relative z-10">
      <p className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-300">Administration</p>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
    </div>
  </div>
);

export default AdminHeader;

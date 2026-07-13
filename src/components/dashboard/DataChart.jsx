import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const DataChart = ({ data, dataKey, label }) => (
  <div className="h-64 w-full rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#0d9488" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{label}</p>
  </div>
);

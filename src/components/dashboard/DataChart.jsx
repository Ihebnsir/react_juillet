import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const DataChart = ({ data, dataKey, label }) => (
  <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <defs>
          <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#42D1B3" />
            <stop offset="100%" stopColor="#0E9A80" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip />
        <Bar dataKey={dataKey} fill="url(#brandGradient)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{label}</p>
  </div>
);

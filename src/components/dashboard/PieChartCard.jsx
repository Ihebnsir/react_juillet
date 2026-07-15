import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const COLORS = ['#0d9488', '#2563eb', '#9333ea', '#f97316', '#ef4444', '#10b981'];

export const PieChartCard = ({ data, valueKey, nameKey, label }) => {
  return (
    <div className="h-72 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            outerRadius={95}
            innerRadius={45}
            paddingAngle={3}
            stroke="transparent"
          >
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{label}</p>
    </div>
  );
};


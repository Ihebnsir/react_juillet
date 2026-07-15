import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export const LineChartCard = ({
  data,
  xKey = 'name',
  yKeys = [],
  label,
}) => {
  return (
    <div className="h-72 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
          <XAxis dataKey={xKey} stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          {yKeys.map((key, idx) => {
            const colors = ['#0d9488', '#9333ea', '#2563eb', '#f97316'];
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{label}</p>
    </div>
  );
};


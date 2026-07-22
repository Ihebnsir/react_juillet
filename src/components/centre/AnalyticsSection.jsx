import React from 'react';
import { DataChart } from '../../components/dashboard/DataChart';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const ReservationDonut = ({ data }) => (
  <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={46} outerRadius={80} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Répartition des réservations</p>
  </div>
);

export const AnalyticsSection = ({ monthlyData, donutData }) => {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.6fr]">
      <DataChart data={monthlyData} dataKey="value" label="Réservations par mois" />
      <ReservationDonut data={donutData} />
    </div>
  );
};

export default AnalyticsSection;

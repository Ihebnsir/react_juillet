import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart, Line, BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#0E9A80', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#EC4899'];

const ChartCard = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-xl bg-white/5 border border-white/10 p-4"
  >
    <div className="flex items-center gap-2 mb-3">
      <FiBarChart2 className="text-slate-400" size={14} />
      <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{title}</h3>
    </div>
    <div className="h-52">
      {children}
    </div>
  </motion.div>
);

const AnalyticsDashboard = ({ data }) => {
  const satisfactionData = [
    { name: 'Satisfait', value: Math.round((data?.avgRating || 4.5) * 20) },
    { name: 'Neutre', value: Math.round(100 - (data?.avgRating || 4.5) * 20) },
  ];

  const categoryData = data?.topCategories?.length
    ? data.topCategories.slice(0, 5)
    : [{ name: 'Général', value: 1 }];

  const radarData = [
    { subject: 'Qualité', A: 90, B: 85, fullMark: 100 },
    { subject: 'Pédagogie', A: 88, B: 82, fullMark: 100 },
    { subject: 'Support', A: 85, B: 78, fullMark: 100 },
    { subject: 'Contenu', A: 92, B: 88, fullMark: 100 },
    { subject: 'Prix', A: 78, B: 75, fullMark: 100 },
    { subject: 'Disponibilité', A: 82, B: 80, fullMark: 100 },
  ];

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
        Dashboard Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Line Chart - Inscriptions */}
        <ChartCard title="Evolution inscriptions" delay={0}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.registrationChartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#0E9A80" strokeWidth={2} dot={{ fill: '#0E9A80', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Area Chart - Revenus */}
        <ChartCard title="Evolution revenus" delay={0.05}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.revenueChartData || []}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0E9A80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0E9A80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#0E9A80" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart - Utilisateurs */}
        <ChartCard title="Nouveaux utilisateurs" delay={0.1}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.userChartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart - Réservations */}
        <ChartCard title="Réservations" delay={0.15}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.reservationChartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart - Catégories */}
        <ChartCard title="Top catégories" delay={0.2}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3} stroke="transparent">
                {categoryData.map((_, idx) => (
                  <Cell key={`cat-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut - Satisfaction */}
        <ChartCard title="Taux de satisfaction" delay={0.25}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={satisfactionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={48} paddingAngle={3} stroke="transparent">
                {satisfactionData.map((_, idx) => (
                  <Cell key={`sat-${idx}`} fill={idx === 0 ? '#0E9A80' : '#334155'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar Chart */}
        <div className="md:col-span-2">
          <ChartCard title="Analytics qualité" delay={0.3}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Radar name="Plateforme" dataKey="A" stroke="#0E9A80" fill="#0E9A80" fillOpacity={0.2} />
                <Radar name="Moyenne" dataKey="B" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;


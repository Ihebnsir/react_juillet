import React, { useMemo, useState } from 'react';
import { DataChart } from '../../components/dashboard/DataChart';
import { StatCard } from '../../components/dashboard/StatCard';
import { LineChartCard } from '../../components/dashboard/LineChartCard';
import { PieChartCard } from '../../components/dashboard/PieChartCard';
import { mockUsers } from '../../data/mockUsers';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { FiUsers, FiBookOpen, FiCalendar, FiDollarSign } from 'react-icons/fi';


const exportToCSV = (data, filename = 'statistiques-skillbridge.csv') => {
  if (!Array.isArray(data) || data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) => Object.values(row).join(','));
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const formatMonthLabel = (ym) => {
  const [, month] = ym.split('-');
  const m = Number(month);

  const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${labels[m - 1]} `;
};

export const StatistiquesPage = () => {
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const metrics = useMemo(() => {
    const totalUsers = mockUsers.length;
    const centresActifs = mockCentres.filter(
      (c) => c.statutVerification === 'verifie'
    ).length;
    const formationsActives = mockFormations.filter((f) => f.status === 'confirmed' || f.status === 'in-progress').length;

    const revenue = mockReservations.reduce((sum, r) => {
      if (r.status !== 'confirmée') return sum;
      const formation = mockFormations.find((f) => f.id === r.formationId);
      return sum + (formation?.price || 0);
    }, 0);

    // Variation vs mois précédent (démo simple basée sur les réservations confirmées)
    const confirmed = mockReservations.filter((r) => r.status === 'confirmée');
    const keys = confirmed
      .map((r) => monthKey(r.date))
      .filter(Boolean)
      .sort();

    const lastKey = keys[keys.length - 1];
    const prevKey = keys[keys.length - 2];

    const lastVal = lastKey
      ? confirmed.filter((r) => monthKey(r.date) === lastKey).length
      : 0;
    const prevVal = prevKey
      ? confirmed.filter((r) => monthKey(r.date) === prevKey).length
      : 0;

    const pct = prevVal === 0 ? 0 : Math.round(((lastVal - prevVal) / prevVal) * 100);
    const variationLabel = pct === 0 ? '0% vs mois dernier' : `${pct > 0 ? '+' : ''}${pct}% vs mois dernier`;

    return {
      totalUsers,
      centresActifs,
      formationsActives,
      revenue,
      variationLabel,
      pct,
    };
  }, []);

  const reservationsMensuelles = useMemo(() => {
    // On calcule à partir des mockReservations en regroupant par mois.
    const confirmed = mockReservations;
    const map = new Map();
    for (const r of confirmed) {
      const k = monthKey(r.date);
      if (!k) continue;
      map.set(k, (map.get(k) || 0) + 1);
    }

    const sortedKeys = Array.from(map.keys()).sort();
    // garder les 6 derniers
    const lastKeys = sortedKeys.slice(Math.max(0, sortedKeys.length - 6));

    return lastKeys.map((k) => ({ name: formatMonthLabel(k).trim(), value: map.get(k) || 0, monthKey: k }));
  }, []);

  const inscriptionsEvolution = useMemo(() => {
    // Ajoute un champ dateCreation aux users mock si absent (démo) via des règles.
    const usersWithDate = mockUsers.map((u, idx) => {
      if (u.dateCreation) return u;
      // répartit sur les 6 derniers mois
      const base = new Date('2026-07-01');
      base.setMonth(base.getMonth() - (idx % 6));
      const iso = base.toISOString().slice(0, 10);
      return { ...u, dateCreation: iso };
    });

    const map = new Map();
    for (const u of usersWithDate) {
      const k = monthKey(u.dateCreation);
      if (!k) continue;
      if (!map.has(k)) map.set(k, { monthKey: k, apprenants: 0, centres: 0 });
      const bucket = map.get(k);
      const role = u.role;
      if (role === 'centre') bucket.centres += 1;
      else if (role === 'apprenant' || role === 'learner') bucket.apprenants += 1;
      else bucket.apprenants += 1;
    }

    const sortedKeys = Array.from(map.keys()).sort().slice(-6);
    return sortedKeys.map((k) => ({
      monthKey: k,
      name: formatMonthLabel(k).trim(),
      apprenants: map.get(k).apprenants,
      centres: map.get(k).centres,
    }));
  }, []);

  const repartitionParDomaine = useMemo(() => {
    const map = new Map();
    for (const f of mockFormations) {
      if (!(f.status === 'confirmed' || f.status === 'in-progress')) continue;
      const domain = f.category || 'Autres';
      map.set(domain, (map.get(domain) || 0) + 1);
    }
    const data = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return data.length ? data : [{ name: 'Aucun', value: 1 }];
  }, []);

  const handleExportCSV = () => {
    // Par défaut: export de la série "réservations mensuelles" affichée.
    const dataToExport = reservationsMensuelles.map(({ monthKey, name, value }) => ({
      month: monthKey,
      label: name,
      reservations: value,
    }));

    exportToCSV(dataToExport, 'statistiques-reservations-mensuelles.csv');

    setToast({ type: 'success', message: 'Export réussi' });
  };



  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Statistiques détaillées</h1>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Exporter en CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiUsers} value={metrics.totalUsers} label="Utilisateurs totaux" tone="teal" variation={metrics.variationLabel} />
        <StatCard
          icon={FiBookOpen}
          value={metrics.centresActifs}
          label="Centres actifs"
          tone="green"
          variation={metrics.centresActifs >= 0 ? metrics.variationLabel : undefined}
        />
        <StatCard
          icon={FiCalendar}
          value={metrics.formationsActives}
          label="Formations publiées"
          tone="orange"
          variation={metrics.variationLabel}
        />
        <StatCard
          icon={FiDollarSign}
          value={`${metrics.revenue}€`}
          label="Chiffre d'affaires simulé"
          tone="teal"
          variation={metrics.pct >= 0 ? `+${metrics.pct}% vs mois dernier` : `${metrics.pct}% vs mois dernier`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DataChart data={reservationsMensuelles} dataKey="value" label="Réservations mensuelles" />

        <LineChartCard
          label="Évolution des inscriptions (6 derniers mois)"
          xKey="monthKey"
          yKeys={['apprenants', 'centres']}
          data={inscriptionsEvolution.map((d) => ({
            monthKey: d.monthKey,
            apprenants: d.apprenants,
            centres: d.centres,
            name: d.name,
          }))}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-1">
        <PieChartCard
          label="Répartition des formations par domaine"
          data={repartitionParDomaine.map((d) => ({ name: d.name, value: d.value }))}
          valueKey="value"
          nameKey="name"
        />
      </div>

      {toast.message ? (
        <ToastMessage
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: 'success', message: '' })}
        />
      ) : null}
    </div>
  );
};


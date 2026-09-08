import React, { useEffect, useState } from 'react';
import { centresService } from '../../services/centresService';
import { formationsService } from '../../services/formationsService';
import { reservationsService } from '../../services/reservationsService';

export const ReservationsRecuesPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const centre = await centresService.getMyCentre();
      const formations = await formationsService.getByCentre(centre.id);
      const responses = await Promise.all(formations.map((formation) => reservationsService.getReservationsParFormation(formation.id)));
      setReservations(responses.flat());
    } catch (requestError) {
      setReservations([]);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReservations(); }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Réservations reçues</h1>
      {loading ? <p className="mt-4 text-sm text-slate-500">Chargement des réservations...</p> : null}
      {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Impossible de charger les réservations. <button type="button" onClick={loadReservations} className="ml-2 font-semibold underline">Réessayer</button></div> : null}
      {!loading && !error && reservations.length === 0 ? <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucune réservation reçue.</p> : null}
      {!loading && !error && reservations.length > 0 ? <div className="mt-4 space-y-3">{reservations.map((reservation) => <div key={reservation.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700"><p className="font-semibold text-gray-900 dark:text-slate-100">{reservation.learnerName || reservation.learner?.email || 'Apprenant'}</p><p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{reservation.formationTitle || 'Formation'} · {reservation.status || 'Statut indisponible'}</p></div>)}</div> : null}
    </div>
  );
};

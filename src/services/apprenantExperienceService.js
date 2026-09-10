import { formationsService } from './formationsService';
import { reservationsService } from './reservationsService';

export const getRecommandationsForUser = async () => {
  const [formations, reservationsResponse] = await Promise.all([
    formationsService.getAll(),
    reservationsService.getMyReservations(),
  ]);
  const reservations = reservationsResponse?.data || [];
  const followedIds = new Set(reservations.map((reservation) => String(reservation.formationId)));

  return formations
    .filter((formation) => !followedIds.has(String(formation.id)))
    .slice(0, 4)
    .map((formation) => ({
      id: `${formation.id}-recommendation`,
      formation,
      raison: 'Basé sur les formations disponibles et vos réservations.',
    }));
};

export const getMesAvisForUser = async () => [];

export const updateAvis = async () => {
  throw new Error('FORMATION_REVIEWS_UNAVAILABLE');
};

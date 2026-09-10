import { formationsService } from './formationsService';
import { reservationsService } from './reservationsService';
import { getMesAvisForUser, getRecommandationsForUser, updateAvis } from './apprenantExperienceService';

jest.mock('./formationsService', () => ({ formationsService: { getAll: jest.fn() } }));
jest.mock('./reservationsService', () => ({ reservationsService: { getMyReservations: jest.fn() } }));

describe('apprenantExperienceService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('builds recommendations from backend formations and reservations', async () => {
    formationsService.getAll.mockResolvedValue([
      { id: 'formation-1', title: 'Suivie' },
      { id: 'formation-2', title: 'Disponible' },
    ]);
    reservationsService.getMyReservations.mockResolvedValue({ data: [{ formationId: 'formation-1' }] });

    await expect(getRecommandationsForUser('learner-1')).resolves.toEqual([
      expect.objectContaining({ formation: { id: 'formation-2', title: 'Disponible' } }),
    ]);
    expect(formationsService.getAll).toHaveBeenCalled();
    expect(reservationsService.getMyReservations).toHaveBeenCalled();
  });

  it('returns no reviews until the backend exposes a review endpoint', async () => {
    await expect(getMesAvisForUser('learner-1')).resolves.toEqual([]);
    await expect(updateAvis('review-1', { note: 5, commentaire: 'Test' })).rejects.toThrow('FORMATION_REVIEWS_UNAVAILABLE');
  });
});

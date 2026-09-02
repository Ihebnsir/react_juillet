import { formationsService } from './formationsService';
import { apiRequest } from './apiClient';

jest.mock('./apiClient', () => ({
  apiRequest: jest.fn(),
}));

describe('formationsService', () => {
  it('normalizes formations returned by the backend', async () => {
    apiRequest.mockResolvedValue({
      success: true,
      data: [{
        _id: '507f1f77bcf86cd799439011',
        title: 'Formation réelle',
        category: 'Développement Web',
        centre: { _id: '507f1f77bcf86cd799439012', name: 'Centre réel', ville: 'Tunis' },
        offreStage: true,
        entreprisesPartenaires: ['Entreprise'],
      }],
      pagination: { page: 1, limit: 100, total: 1, pages: 1 },
    });
    const formations = await formationsService.getAll();
    const formation = formations[0];

    expect(formation).toBeDefined();
    expect(formation.centre).toBeDefined();
    expect(formation.id).toBe('507f1f77bcf86cd799439011');
    expect(formation.centre.name).toBe('Centre réel');
    expect(formation.city).toBe('Tunis');
    expect(formation.offreStage).toBe(true);
    expect(formation.entreprisesPartenaires).toContain('Entreprise');
  });
});

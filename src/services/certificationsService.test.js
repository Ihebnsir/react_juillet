import { certificationsService } from './certificationsService';
import { apiRequest } from './apiClient';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('certificationsService', () => {
  it('normalizes populated certification data and pagination', async () => {
    apiRequest.mockResolvedValue({
      success: true,
      data: [{ _id: 'cert-1', numeroCertificat: 'CERT-1', formation: { _id: 'formation-1', title: 'React' }, centre: { _id: 'centre-1', name: 'Centre' }, dateObtention: '2026-01-02', status: 'emise' }],
      pagination: { total: 1 },
    });

    const result = await certificationsService.getMine({ page: 1, limit: 100 });

    expect(result.data[0]).toMatchObject({ id: 'cert-1', certificateNumber: 'CERT-1', formation: 'React', centre: 'Centre', status: 'emise' });
    expect(result.pagination.total).toBe(1);
  });
});

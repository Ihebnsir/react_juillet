import { certificationsService } from './certificationsService';
import { apiRequest } from './apiClient';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('certificationsService', () => {
  beforeEach(() => jest.clearAllMocks());
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

  it('calls detail, issuance, verification, and revocation endpoints', async () => {
    apiRequest.mockResolvedValue({ data: { _id: 'cert-1', status: 'emise' } });
    await certificationsService.getById('cert-1');
    await certificationsService.create({ apprenantId: 'learner-1', formationId: 'formation-1', centreId: 'centre-1' });
    await certificationsService.verify('CERT-1');
    await certificationsService.revoke('cert-1');
    expect(apiRequest.mock.calls.map(([path]) => path)).toEqual([
      '/api/certifications/cert-1',
      '/api/certifications',
      '/api/certifications/verify/CERT-1',
      '/api/certifications/cert-1/revoke',
    ]);
    expect(apiRequest.mock.calls[1][1].body).toBe(JSON.stringify({ apprenantId: 'learner-1', formationId: 'formation-1', centreId: 'centre-1' }));
  });

  it('propagates backend errors such as 409 and network failures', async () => {
    const error = new Error('HTTP_409');
    apiRequest.mockRejectedValue(error);
    await expect(certificationsService.revoke('cert-1')).rejects.toBe(error);
  });
});

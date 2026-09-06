import { centresService } from './centresService';
import { apiRequest } from './apiClient';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('centresService', () => {
  it('normalizes the centre ID separately from the authenticated user ID', async () => {
    apiRequest.mockResolvedValue({ data: { _id: 'centre-1', userId: 'user-1', name: 'Centre réel', ville: 'Tunis' } });
    const centre = await centresService.getMyCentre();
    expect(centre).toMatchObject({ id: 'centre-1', userId: 'user-1', name: 'Centre réel' });
    expect(apiRequest).toHaveBeenCalledWith('/api/centres/me');
  });
});

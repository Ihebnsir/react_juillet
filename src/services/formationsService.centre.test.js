import { formationsService } from './formationsService';
import { apiRequest } from './apiClient';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('formationsService centre filtering', () => {
  it('queries formations with the real Centre._id', async () => {
    apiRequest.mockResolvedValue({ data: [{ _id: 'formation-1', centre: 'centre-1', title: 'React' }] });
    await formationsService.getByCentre('centre-1');
    expect(apiRequest).toHaveBeenCalledWith('/api/formations?page=1&limit=100&centre=centre-1');
  });
});

import { loadTrendingFormations } from './HomePage';
import { formationsService } from '../services/formationsService';

jest.mock('../services/formationsService', () => ({
  formationsService: { getTrending: jest.fn() },
}));

describe('HomePage backend failure states', () => {
  it('propagates the real formation request failure without a mock fallback', async () => {
    formationsService.getTrending.mockRejectedValueOnce(new Error('NETWORK_ERROR'));

    await expect(loadTrendingFormations()).rejects.toThrow('NETWORK_ERROR');
  });
});

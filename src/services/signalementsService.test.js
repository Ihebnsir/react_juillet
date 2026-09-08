import { apiRequest } from './apiClient';
import { signalementsService } from './signalementsService';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('signalementsService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates without reporterId and normalizes the id', async () => {
    apiRequest.mockResolvedValue({ data: { _id: 'sig-1', type: 'Spam' } });
    await signalementsService.create({ type: 'Spam', contenu: 'Publicité répétée', cibleType: 'autre' });
    expect(apiRequest).toHaveBeenCalledWith('/api/signalements', expect.objectContaining({ method: 'POST', body: expect.not.stringContaining('reporterId') }));
  });

  it('builds reporter and admin list queries', async () => {
    apiRequest.mockResolvedValue({ data: [] });
    await signalementsService.getMine({ page: 1, limit: 10, status: 'En attente' });
    await signalementsService.getAdminList({ page: 2, type: 'Spam' });
    expect(apiRequest.mock.calls[0][0]).toContain('/api/signalements/mine?page=1&limit=10&status=En+attente');
    expect(apiRequest.mock.calls[1][0]).toContain('/api/signalements?page=2&type=Spam');
  });

  it('uses verified mutation endpoints and propagates errors', async () => {
    apiRequest.mockResolvedValue({ data: { id: 'sig-1', status: 'En cours' } });
    await signalementsService.updateStatus('sig-1', { status: 'En cours' });
    await signalementsService.escalate('sig-1', {});
    await signalementsService.remove('sig-1');
    expect(apiRequest.mock.calls.map(([path]) => path)).toEqual([
      '/api/signalements/sig-1/status',
      '/api/signalements/sig-1/escalate',
      '/api/signalements/sig-1',
    ]);
    const error = new Error('HTTP_403');
    apiRequest.mockRejectedValue(error);
    await expect(signalementsService.getAdminStats()).rejects.toBe(error);
  });
});

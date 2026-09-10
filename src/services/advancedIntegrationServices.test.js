import { sessionsService } from './sessionsService';
import { attendanceService } from './attendanceService';
import { progressService } from './progressService';
import { trainersService } from './trainersService';
import { studentsService } from './studentsService';
import { analyticsService } from './analyticsService';
import { apiRequest } from './apiClient';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('advanced backend integration services', () => {
  beforeEach(() => jest.clearAllMocks());

  it('normalizes populated sessions and sends the exact session contract', async () => {
    apiRequest.mockResolvedValueOnce({ data: [{ _id: 's1', formation: { _id: 'f1', title: 'React' }, date: '2026-09-10', status: 'scheduled' }] });
    const result = await sessionsService.list({ page: 1, limit: 20 });
    expect(result.data[0]).toMatchObject({ id: 's1', formationId: 'f1', formationTitle: 'React' });
    expect(apiRequest).toHaveBeenCalledWith('/api/sessions?page=1&limit=20');
    apiRequest.mockResolvedValueOnce({ data: { _id: 's1' } });
    await sessionsService.update('s1', { formation: 'f1', title: 'React', date: '2026-09-10' });
    expect(apiRequest).toHaveBeenLastCalledWith('/api/sessions/s1', expect.objectContaining({ method: 'PUT', body: JSON.stringify({ formation: 'f1', title: 'React', date: '2026-09-10' }) }));
  });

  it('normalizes attendance, learner progress, trainers, and students', async () => {
    apiRequest.mockResolvedValueOnce({ data: [{ _id: 'a1', session: { _id: 's1', title: 'Jour 1', date: '2026-09-10' }, learner: { _id: 'l1', prenom: 'Ada', nom: 'Lovelace', email: 'ada@test' }, status: 'present' }] });
    expect((await attendanceService.list()).data[0]).toMatchObject({ id: 'a1', sessionId: 's1', learnerId: 'l1', learnerName: 'Ada Lovelace' });
    apiRequest.mockResolvedValueOnce({ data: [{ _id: 'p1', formation: { _id: 'f1', title: 'React' }, percentage: 50 }] });
    expect((await progressService.mine()).data[0]).toMatchObject({ id: 'p1', formationId: 'f1', formationTitle: 'React', percentage: 50 });
    apiRequest.mockResolvedValueOnce({ data: [{ _id: 't1', nom: 'Lovelace', prenom: 'Ada', status: 'active' }] });
    expect((await trainersService.list()).data[0]).toMatchObject({ id: 't1', name: 'Ada Lovelace', status: 'Actif' });
    apiRequest.mockResolvedValueOnce({ data: [{ learner: { _id: 'l1', prenom: 'Ada', nom: 'Lovelace', email: 'ada@test' }, formation: { _id: 'f1', title: 'React' }, progress: null, attendance: { total: 0 } }] });
    expect((await studentsService.list()).data[0]).toMatchObject({ id: 'l1', name: 'Ada Lovelace', formationTitle: 'React' });
  });

  it('uses role-scoped analytics endpoints and propagates API errors', async () => {
    apiRequest.mockResolvedValue({ data: { formations: 2 } });
    await analyticsService.centreOverview();
    await analyticsService.adminOverview();
    expect(apiRequest.mock.calls.map(([path]) => path)).toEqual(['/api/centres/me/analytics/overview', '/api/admin/analytics/overview']);
    const error = new Error('HTTP_403'); apiRequest.mockRejectedValue(error);
    await expect(analyticsService.centreRevenue()).rejects.toBe(error);
  });
});

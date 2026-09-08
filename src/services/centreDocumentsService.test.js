import { apiRequest } from './apiClient';
import { centreDocumentsService } from './centreDocumentsService';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('centreDocumentsService', () => {
  beforeEach(() => { jest.clearAllMocks(); apiRequest.mockResolvedValue({ data: { _id: 'doc-1', status: 'en_attente' } }); });
  it('uses centre and admin endpoints with filters', async () => {
    await centreDocumentsService.getMine({ page: 1, limit: 10, status: 'refuse' });
    await centreDocumentsService.getAdminList({ page: 2, status: 'en_attente', type: 'RNE', centre: 'centre-1' });
    expect(apiRequest.mock.calls.map(([path]) => path)).toEqual(['/api/centre-documents?page=1&limit=10&status=refuse', '/api/centre-documents/admin?page=2&status=en_attente&type=RNE&centre=centre-1']);
  });
  it('sends create, delete, validate and reject payloads', async () => {
    await centreDocumentsService.create({ type: 'RNE', fileUrl: 'https://example.test/rne.pdf' });
    await centreDocumentsService.remove('doc-1');
    await centreDocumentsService.validate('doc-1');
    await centreDocumentsService.reject('doc-1', 'URL illisible');
    expect(apiRequest.mock.calls.map(([, options]) => options?.body)).toEqual([JSON.stringify({ type: 'RNE', fileUrl: 'https://example.test/rne.pdf' }), undefined, undefined, JSON.stringify({ commentaireAdmin: 'URL illisible' })]);
  });
  it('propagates backend errors', async () => { const error = new Error('HTTP_409'); apiRequest.mockRejectedValue(error); await expect(centreDocumentsService.validate('doc-1')).rejects.toBe(error); });
});

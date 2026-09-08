import { apiRequest } from './apiClient';
import { litigesService } from './litigesService';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn() }));

describe('litigesService', () => {
  beforeEach(() => { jest.clearAllMocks(); apiRequest.mockResolvedValue({ data: { id: 'litige-1' } }); });
  it('uses real list and detail endpoints', async () => {
    await litigesService.getMine({ page: 1, limit: 10 });
    await litigesService.getAll({ page: 2, statut: 'analyse', priorite: 'haute', categorie: 'Paiement' });
    await litigesService.getById('litige-1');
    expect(apiRequest.mock.calls.map(([path]) => path)).toEqual(['/api/litiges/me?page=1&limit=10', '/api/litiges?page=2&statut=analyse&priorite=haute&categorie=Paiement', '/api/litiges/litige-1']);
  });
  it('preserves request payloads for mutations', async () => {
    await litigesService.updateStatus('litige-1', { statut: 'analyse' });
    await litigesService.assign('litige-1', { responsableId: 'admin-1' });
    await litigesService.addMessage('litige-1', { contenu: 'Bonjour' });
    await litigesService.addAttachmentMetadata('litige-1', { nom: 'preuve.pdf', type: 'metadata' });
    await litigesService.addNote('litige-1', { contenu: 'Vérifier le dossier' });
    await litigesService.close('litige-1', { decisionFinale: 'Décision' });
    await litigesService.archive('litige-1');
    expect(apiRequest.mock.calls.map(([, options]) => options?.body)).toEqual([JSON.stringify({ statut: 'analyse' }), JSON.stringify({ responsableId: 'admin-1' }), JSON.stringify({ contenu: 'Bonjour' }), JSON.stringify({ nom: 'preuve.pdf', type: 'metadata' }), JSON.stringify({ contenu: 'Vérifier le dossier' }), JSON.stringify({ decisionFinale: 'Décision' }), undefined]);
  });
  it('propagates backend errors', async () => {
    const error = new Error('HTTP_409'); apiRequest.mockRejectedValue(error);
    await expect(litigesService.getAll()).rejects.toBe(error);
  });
});

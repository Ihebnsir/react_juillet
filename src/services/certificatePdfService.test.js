import { certificationsService } from './certificationsService';
import { apiRequest, apiRequestBlob } from './apiClient';

jest.mock('./apiClient', () => ({ apiRequest: jest.fn(), apiRequestBlob: jest.fn() }));

describe('certificate PDF integration', () => {
  it('requests the authenticated backend PDF endpoint', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });
    apiRequestBlob.mockResolvedValue({ blob, filename: 'inline; filename="certificat-CERT-1.pdf"' });
    const result = await certificationsService.downloadPdf('cert-1');
    expect(apiRequestBlob).toHaveBeenCalledWith('/api/certifications/cert-1/pdf', { accept: 'application/pdf' });
    expect(result.blob.type).toBe('application/pdf');
  });

  it('propagates revoked or unauthorized PDF errors', async () => {
    const error = new Error('HTTP_409');
    apiRequestBlob.mockRejectedValue(error);
    await expect(certificationsService.downloadPdf('revoked')).rejects.toBe(error);
    expect(apiRequest).not.toHaveBeenCalled();
  });
});

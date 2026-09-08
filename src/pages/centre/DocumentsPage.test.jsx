import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DocumentsPage } from './DocumentsPage';
import { centreDocumentsService } from '../../services/centreDocumentsService';

jest.mock('../../services/centreDocumentsService', () => ({ centreDocumentsService: { getMine: jest.fn(), create: jest.fn(), remove: jest.fn() } }));
jest.mock('../../context/NotificationContext', () => ({ useNotifications: () => ({ refresh: jest.fn() }) }));

describe('DocumentsPage', () => {
  beforeEach(() => { jest.clearAllMocks(); centreDocumentsService.getMine.mockResolvedValue({ data: [{ id: 'doc-1', type: 'RNE', fileUrl: 'https://example.test/rne', status: 'refuse', commentaireAdmin: 'URL invalide' }] }); });
  it('loads real documents, rejects unsafe URLs, deletes, and resubmits refused documents', async () => {
    render(<DocumentsPage />);
    expect(await screen.findByText('RNE')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'RNE' } });
    fireEvent.change(screen.getByLabelText('URL externe'), { target: { value: 'javascript:bad' } });
    fireEvent.click(screen.getByRole('button', { name: 'Soumettre' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/HTTP\/HTTPS/i);
    fireEvent.click(screen.getByRole('button', { name: 'Resoumettre' }));
    fireEvent.change(screen.getByLabelText('URL externe'), { target: { value: 'https://example.test/new' } });
    centreDocumentsService.create.mockResolvedValue({ id: 'doc-2' });
    fireEvent.click(screen.getByRole('button', { name: 'Soumettre' }));
    await waitFor(() => expect(centreDocumentsService.remove).toHaveBeenCalledWith('doc-1'));
    expect(centreDocumentsService.create).toHaveBeenCalledWith({ type: 'RNE', fileUrl: 'https://example.test/new' });
  });
});

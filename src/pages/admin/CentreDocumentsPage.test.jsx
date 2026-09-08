import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CentreDocumentsPage } from './CentreDocumentsPage';
import { centreDocumentsService } from '../../services/centreDocumentsService';

jest.mock('../../services/centreDocumentsService', () => ({ centreDocumentsService: { getAdminList: jest.fn(), validate: jest.fn(), reject: jest.fn() } }));
jest.mock('../../context/NotificationContext', () => ({ useNotifications: () => ({ refresh: jest.fn() }) }));

describe('CentreDocumentsPage', () => {
  beforeEach(() => { jest.clearAllMocks(); centreDocumentsService.getAdminList.mockResolvedValue({ data: [{ id: 'doc-1', type: 'RNE', centreName: 'Centre réel', centreEmail: 'centre@example.test', fileUrl: 'https://example.test/doc', status: 'en_attente' }] }); });
  it('filters through the admin API and requires a rejection reason', async () => {
    render(<CentreDocumentsPage />);
    expect(await screen.findByText('Centre réel')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Statut'), { target: { value: 'en_attente' } });
    await waitFor(() => expect(centreDocumentsService.getAdminList).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'en_attente' })));
    fireEvent.click(screen.getByRole('button', { name: 'Refuser' }));
    expect(screen.getByRole('button', { name: 'Confirmer' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Motif du refus'), { target: { value: 'Document illisible' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));
    await waitFor(() => expect(centreDocumentsService.reject).toHaveBeenCalledWith('doc-1', 'Document illisible'));
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LitigesPage } from './LitigesPage';
import { litigesService } from '../../services/litigesService';

jest.mock('../../services/litigesService', () => ({ litigesService: {
  getAll: jest.fn(), getById: jest.fn(), updateStatus: jest.fn(), assign: jest.fn(), addMessage: jest.fn(), addNote: jest.fn(), close: jest.fn(), archive: jest.fn(),
} }));
jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { role: 'admin' } }) }));

const report = { id: 'litige-1', numeroDossier: 'LTG-1', titre: 'Dossier réel', description: 'Description backend', statut: 'ouvert', categorie: 'Paiement', priorite: 'haute', conversation: [], notesInternes: [] };

describe('Admin LitigesPage', () => {
  beforeEach(() => { jest.clearAllMocks(); litigesService.getAll.mockResolvedValue({ data: [report] }); litigesService.getById.mockResolvedValue(report); });
  it('renders backend data, filters through API, opens detail, and updates valid status', async () => {
    render(<LitigesPage />);
    expect(await screen.findByText('Dossier réel')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('statut'), { target: { value: 'analyse' } });
    await waitFor(() => expect(litigesService.getAll).toHaveBeenLastCalledWith(expect.objectContaining({ statut: 'analyse' })));
    fireEvent.click(screen.getByRole('button', { name: 'Voir détail' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Prochain statut'), { target: { value: 'analyse' } });
    await waitFor(() => expect(litigesService.updateStatus).toHaveBeenCalledWith('litige-1', { statut: 'analyse' }));
  });
});

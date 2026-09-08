import { render, screen } from '@testing-library/react';
import { LitigesPage } from './LitigesPage';
import { litigesService } from '../services/litigesService';

jest.mock('../services/litigesService', () => ({ litigesService: { getMine: jest.fn(), getById: jest.fn() } }));
jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { role: 'apprenant' } }) }));

describe('Learner LitigesPage', () => {
  it('uses /me and keeps the empty state backend-driven', async () => {
    litigesService.getMine.mockResolvedValue({ data: [] });
    render(<LitigesPage />);
    expect(await screen.findByText('Aucun litige.')).toBeInTheDocument();
    expect(litigesService.getMine).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});

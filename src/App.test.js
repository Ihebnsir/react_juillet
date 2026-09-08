import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/formationsService', () => ({
  formationsService: {
    getTrending: jest.fn(() => new Promise(() => {})),
  },
}));

test('renders the home route during the initial app preload', () => {
  render(<App />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Développez vos compétences/i })).toBeInTheDocument();
});

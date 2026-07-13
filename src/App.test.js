import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page hero content', () => {
  render(<App />);
  const heading = screen.getByText(/Bienvenue sur SkillBridge/i);
  expect(heading).toBeInTheDocument();
});

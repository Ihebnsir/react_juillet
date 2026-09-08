import { normalizeUserStatus } from './usersService';
import { normalizeReservationStatus } from './reservationsService';

describe('backend status normalization', () => {
  it('maps authoritative user statuses to the existing UI vocabulary', () => {
    expect(normalizeUserStatus('active')).toBe('actif');
    expect(normalizeUserStatus('suspended')).toBe('suspendu');
    expect(normalizeUserStatus('banned')).toBe('suspendu');
  });

  it('maps authoritative reservation statuses without changing their meaning', () => {
    expect(normalizeReservationStatus('PENDING')).toBe('en_attente');
    expect(normalizeReservationStatus('CONFIRMED')).toBe('confirmee');
    expect(normalizeReservationStatus('COMPLETED')).toBe('terminee');
    expect(normalizeReservationStatus('CANCELLED')).toBe('annulee');
  });
});
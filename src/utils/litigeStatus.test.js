import { LITIGE_NEXT_STATUSES, LITIGE_STATUS_LABELS } from './litigeStatus';

test('keeps Litige statuses separate and transition-aware', () => {
  expect(LITIGE_STATUS_LABELS.ouvert).toBe('Ouvert');
  expect(LITIGE_STATUS_LABELS.resolu).toBe('Résolu');
  expect(LITIGE_NEXT_STATUSES.ouvert).toEqual(['analyse']);
  expect(LITIGE_NEXT_STATUSES.archive).toEqual([]);
  expect(LITIGE_STATUS_LABELS['En attente']).toBeUndefined();
});
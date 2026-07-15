import { messagingService } from './messagingService';

describe('messagingService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps admin support conversations isolated from private direct threads', () => {
    const conversations = messagingService.getConversationsForUser({ id: 'admin-1', role: 'admin' });

    expect(conversations.length).toBeGreaterThan(0);
    expect(conversations.every((conversation) => conversation.type === 'support')).toBe(true);
  });

  it('persists a newly created support conversation in storage', () => {
    const created = messagingService.createSupportConversation({
      user: { id: 'learner-1', role: 'apprenant', name: 'Amine Ben Salah' },
      subject: 'Paiement',
      initialMessage: 'Je n’ai pas reçu la confirmation de paiement.',
    });

    expect(created.id).toBeDefined();
    expect(created.type).toBe('support');
    expect(created.status).toBe('ouvert');

    const stored = messagingService.getConversationsForUser({ id: 'admin-1', role: 'admin' });
    expect(stored.some((conversation) => conversation.id === created.id)).toBe(true);
  });
});

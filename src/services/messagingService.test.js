import { apiRequest } from './apiClient';
import { getCurrentUser, getToken } from './authService';
import { io } from 'socket.io-client';
import {
  connectMessagingSocket,
  disconnectMessagingSocket,
  messagingService,
  subscribeToMessaging,
} from './messagingService';

jest.mock('./apiClient', () => ({
  apiRequest: jest.fn(),
  API_URL: 'http://localhost:5000',
}));

jest.mock('./authService', () => ({ getCurrentUser: jest.fn(), getToken: jest.fn() }));

const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

describe('messagingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCurrentUser.mockReturnValue({ role: 'apprenant' });
    getToken.mockReturnValue('jwt-token');
    io.mockReturnValue(mockSocket);
  });

  afterEach(() => {
    disconnectMessagingSocket();
  });

  it('loads conversations from the backend and normalizes messages', async () => {
    apiRequest.mockResolvedValue({ data: { data: [{ _id: 'conv-1', messages: [{ _id: 'msg-1', text: 'Bonjour' }] }] } });

    const conversations = await messagingService.getConversations();

    expect(apiRequest).toHaveBeenCalledWith('/api/conversations');
    expect(conversations[0]).toMatchObject({ id: 'conv-1' });
    expect(conversations[0].messages[0]).toMatchObject({ id: 'msg-1', content: 'Bonjour' });
  });

  it('shows the real learner name for a centre conversation', async () => {
    getCurrentUser.mockReturnValue({ role: 'centre' });
    apiRequest.mockResolvedValue({ data: { data: [{
      _id: 'conv-1',
      learnerUserId: { _id: 'learner-1', prenom: 'Amine', nom: 'Test', role: 'apprenant' },
      centreUserId: { _id: 'centre-1', prenom: 'Centre', nom: 'Test', role: 'centre' },
      lastMessage: { contentPreview: 'Bonjour', createdAt: '2026-09-06T10:00:00.000Z' },
    }] } });

    const [conversation] = await messagingService.getConversations();

    expect(conversation).toMatchObject({ participantName: 'Amine Test', lastMessage: 'Bonjour' });
  });

  it('sends only backend-owned message fields', async () => {
    apiRequest.mockResolvedValue({ conversation: { id: 'conv-1', messages: [] } });

    await messagingService.sendMessage('conv-1', 'Bonjour', 'client-1');

    expect(apiRequest).toHaveBeenCalledWith('/api/conversations/conv-1/messages', {
      method: 'POST',
      body: JSON.stringify({ content: 'Bonjour', clientMessageId: 'client-1' }),
    });
  });

  it('uploads an attachment and sends only its backend metadata ID', async () => {
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    apiRequest
      .mockResolvedValueOnce({ data: { attachment: { _id: 'attachment-1', originalName: 'notes.txt', mimeType: 'text/plain', size: 5, url: '/api/conversations/conv-1/attachments/attachment-1' } } })
      .mockResolvedValueOnce({ conversation: { id: 'conv-1', messages: [] } });

    const attachment = await messagingService.uploadAttachment('conv-1', file);
    await messagingService.sendMessage('conv-1', '', 'client-1', [attachment]);

    expect(apiRequest.mock.calls[0][0]).toBe('/api/conversations/conv-1/attachments');
    expect(apiRequest.mock.calls[0][1].body).toBeInstanceOf(FormData);
    expect(JSON.parse(apiRequest.mock.calls[1][1].body)).toMatchObject({
      content: '',
      clientMessageId: 'client-1',
      attachments: [{ id: 'attachment-1' }],
    });
  });

  it('supports direct/support/read/status endpoints', async () => {
    apiRequest.mockResolvedValue({ data: { conversation: { _id: 'conv-1' } } });

    const conversation = await messagingService.createDirectConversation({ centreId: 'centre-1', formationId: 'form-1' });
    await messagingService.createSupportConversation({ subject: 'Paiement', initialMessage: 'Besoin d’aide' });
    await messagingService.updateSupportStatus('conv-1', 'résolu');
    await messagingService.markConversationRead('conv-1');

    expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/conversations/direct', expect.objectContaining({ method: 'POST' }));
    expect(conversation).toMatchObject({ id: 'conv-1' });
    expect(apiRequest).toHaveBeenNthCalledWith(2, '/api/conversations/support', expect.objectContaining({ method: 'POST' }));
    expect(apiRequest).toHaveBeenNthCalledWith(3, '/api/conversations/conv-1/status', expect.objectContaining({ method: 'PATCH' }));
    expect(apiRequest).toHaveBeenNthCalledWith(4, '/api/conversations/conv-1/read', { method: 'PATCH' });
  });

  it('connects once with JWT auth and forwards message:new without creating messages', () => {
    const subscriber = jest.fn();
    subscribeToMessaging(subscriber);

    connectMessagingSocket();
    connectMessagingSocket();

    expect(mockSocket.on).toHaveBeenCalledWith('message:new', expect.any(Function));
    const listener = mockSocket.on.mock.calls[0][1];
    listener({ conversationId: 'conv-1', message: { id: 'msg-1' } });
    expect(subscriber).toHaveBeenCalledWith({ conversationId: 'conv-1', message: { id: 'msg-1' } });
  });
});

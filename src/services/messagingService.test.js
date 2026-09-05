import { apiRequest } from './apiClient';
import { getToken } from './authService';
import { io } from 'socket.io-client';
import {
  connectMessagingSocket,
  disconnectMessagingSocket,
  joinMessagingConversation,
  leaveMessagingConversation,
  messagingService,
  subscribeToMessaging,
} from './messagingService';

jest.mock('./apiClient', () => ({
  apiRequest: jest.fn(),
  API_URL: 'http://localhost:5000',
}));

jest.mock('./authService', () => ({ getToken: jest.fn() }));

const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

describe('messagingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getToken.mockReturnValue('jwt-token');
    io.mockReturnValue(mockSocket);
  });

  afterEach(() => {
    disconnectMessagingSocket();
  });

  it('loads conversations from the backend and normalizes messages', async () => {
    apiRequest.mockResolvedValue({ data: { conversations: [{ _id: 'conv-1', messages: [{ _id: 'msg-1', text: 'Bonjour' }] }] } });

    const conversations = await messagingService.getConversations();

    expect(apiRequest).toHaveBeenCalledWith('/api/conversations');
    expect(conversations[0]).toMatchObject({ id: 'conv-1' });
    expect(conversations[0].messages[0]).toMatchObject({ id: 'msg-1', content: 'Bonjour' });
  });

  it('sends only backend-owned message fields', async () => {
    apiRequest.mockResolvedValue({ conversation: { id: 'conv-1', messages: [] } });

    await messagingService.sendMessage('conv-1', 'Bonjour', 'client-1');

    expect(apiRequest).toHaveBeenCalledWith('/api/conversations/conv-1/messages', {
      method: 'POST',
      body: JSON.stringify({ content: 'Bonjour', clientMessageId: 'client-1' }),
    });
  });

  it('supports direct/support/read/status endpoints', async () => {
    apiRequest.mockResolvedValue({ conversation: { id: 'conv-1' } });

    await messagingService.createDirectConversation({ centreId: 'centre-1', formationId: 'form-1' });
    await messagingService.createSupportConversation({ subject: 'Paiement', initialMessage: 'Besoin d’aide' });
    await messagingService.updateSupportStatus('conv-1', 'résolu');
    await messagingService.markConversationRead('conv-1');

    expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/conversations/direct', expect.objectContaining({ method: 'POST' }));
    expect(apiRequest).toHaveBeenNthCalledWith(2, '/api/conversations/support', expect.objectContaining({ method: 'POST' }));
    expect(apiRequest).toHaveBeenNthCalledWith(3, '/api/conversations/conv-1/status', expect.objectContaining({ method: 'PATCH' }));
    expect(apiRequest).toHaveBeenNthCalledWith(4, '/api/conversations/conv-1/read', { method: 'PATCH' });
  });

  it('connects once with JWT auth and forwards message:new without creating messages', () => {
    const subscriber = jest.fn();
    const unsubscribe = subscribeToMessaging(subscriber);

    connectMessagingSocket();
    connectMessagingSocket();

    expect(io).toHaveBeenCalledTimes(1);
    expect(io).toHaveBeenCalledWith('http://localhost:5000', { auth: { token: 'jwt-token' } });
    expect(mockSocket.on).toHaveBeenCalledWith('message:new', expect.any(Function));
    joinMessagingConversation('conv-1');
    leaveMessagingConversation('conv-1');
    expect(mockSocket.emit).toHaveBeenNthCalledWith(1, 'conversation:join', 'conv-1', expect.any(Function));
    expect(mockSocket.emit).toHaveBeenNthCalledWith(2, 'conversation:leave', 'conv-1');
    const listener = mockSocket.on.mock.calls[0][1];
    listener({ conversationId: 'conv-1', message: { id: 'msg-1' } });
    expect(subscriber).toHaveBeenCalledWith({ conversationId: 'conv-1', message: { id: 'msg-1' } });
    unsubscribe();
  });

  it('propagates backend errors without falling back to mock data', async () => {
    const error = new Error('Forbidden');
    error.status = 403;
    apiRequest.mockRejectedValue(error);

    await expect(messagingService.getConversations()).rejects.toMatchObject({ status: 403 });
  });
});
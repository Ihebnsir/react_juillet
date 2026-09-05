import { io } from 'socket.io-client';
import { apiRequest, API_URL } from './apiClient';
import { getToken } from './authService';

let socket = null;
const subscribers = new Set();

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);

const normalizeMessage = (message = {}) => ({
  ...message,
  id: firstDefined(message.id, message._id, message.clientMessageId),
  clientMessageId: message.clientMessageId,
  senderId: firstDefined(message.senderId, message.sender?.id, message.authorId),
  senderName: firstDefined(message.senderName, message.sender?.name, message.author?.name, 'Utilisateur'),
  content: firstDefined(message.content, message.text, message.message, ''),
  createdAt: firstDefined(message.createdAt, message.created_at, message.timestamp, new Date().toISOString()),
  read: Boolean(firstDefined(message.read, message.isRead, false)),
});

const normalizeConversation = (conversation = {}) => {
  const messages = (conversation.messages || conversation.messageList || []).map(normalizeMessage);
  const lastMessageValue = firstDefined(conversation.lastMessage, conversation.latestMessage);

  return {
    ...conversation,
    id: firstDefined(conversation.id, conversation._id),
    type: firstDefined(conversation.type, conversation.kind, 'direct'),
    participantName: firstDefined(
      conversation.participantName,
      conversation.otherParticipant?.name,
      conversation.participant?.name,
      conversation.partner?.name,
      'Conversation'
    ),
    participantAvatar: firstDefined(
      conversation.participantAvatar,
      conversation.otherParticipant?.avatar,
      conversation.participant?.avatar,
      null
    ),
    participantRole: firstDefined(
      conversation.participantRole,
      conversation.otherParticipant?.role,
      conversation.participant?.role,
      'Utilisateur'
    ),
    lastMessage: typeof lastMessageValue === 'object'
      ? firstDefined(lastMessageValue.content, lastMessageValue.text, '')
      : firstDefined(lastMessageValue, messages.at(-1)?.content, ''),
    lastMessageAt: firstDefined(
      conversation.lastMessageAt,
      conversation.latestMessageAt,
      messages.at(-1)?.createdAt
    ),
    unreadCount: Number(firstDefined(conversation.unreadCount, conversation.unread, 0)),
    messages,
  };
};

const unwrapList = (payload) => {
  const list = payload?.conversations || payload?.data?.conversations || payload?.data || payload;
  return Array.isArray(list) ? list.map(normalizeConversation) : [];
};

const unwrapConversation = (payload) => normalizeConversation(payload?.conversation || payload?.data || payload);

const notifySubscribers = (message) => {
  subscribers.forEach((subscriber) => subscriber(message));
};

export const connectMessagingSocket = () => {
  const token = getToken();
  if (!token || socket) return socket;

  socket = io(API_URL, { auth: { token } });
  socket.on('message:new', notifySubscribers);
  return socket;
};

export const disconnectMessagingSocket = () => {
  if (!socket) return;
  socket.off('message:new', notifySubscribers);
  socket.disconnect();
  socket = null;
};

export const subscribeToMessaging = (subscriber) => {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
};

export const joinMessagingConversation = (conversationId) => {
  if (!socket || !conversationId) return false;
  socket.emit('conversation:join', conversationId, () => {});
  return true;
};

export const leaveMessagingConversation = (conversationId) => {
  if (!socket || !conversationId) return false;
  socket.emit('conversation:leave', conversationId);
  return true;
};

export const messagingService = {
  async getConversations() {
    return unwrapList(await apiRequest('/api/conversations'));
  },

  async getConversation(id) {
    return unwrapConversation(await apiRequest(`/api/conversations/${id}`));
  },

  async createDirectConversation({ centreId, formationId }) {
    return unwrapConversation(await apiRequest('/api/conversations/direct', {
      method: 'POST',
      body: JSON.stringify({ centreId, ...(formationId ? { formationId } : {}) }),
    }));
  },

  async createSupportConversation({ subject, initialMessage }) {
    return unwrapConversation(await apiRequest('/api/conversations/support', {
      method: 'POST',
      body: JSON.stringify({ subject, initialMessage }),
    }));
  },

  async sendMessage(conversationId, content, clientMessageId) {
    const payload = { content, ...(clientMessageId ? { clientMessageId } : {}) };
    return unwrapConversation(await apiRequest(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }));
  },

  async updateSupportStatus(conversationId, status) {
    return unwrapConversation(await apiRequest(`/api/conversations/${conversationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }));
  },

  async markConversationRead(conversationId) {
    return unwrapConversation(await apiRequest(`/api/conversations/${conversationId}/read`, {
      method: 'PATCH',
    }));
  },
};

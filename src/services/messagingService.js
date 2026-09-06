import { io } from 'socket.io-client';
import { apiRequest, API_URL } from './apiClient';
import { getCurrentUser, getToken } from './authService';

let socket = null;
const subscribers = new Set();

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);

const formatUserName = (user) => firstDefined(
  user?.name,
  [user?.prenom, user?.nom].filter(Boolean).join(' '),
  user?.email
);

const normalizeMessage = (message = {}) => ({
  ...message,
  id: firstDefined(message.id, message._id, message.clientMessageId),
  clientMessageId: message.clientMessageId,
  senderId: firstDefined(message.senderId?._id, message.senderId?.id, message.senderId, message.sender?.id, message.authorId),
  senderName: firstDefined(message.senderName, formatUserName(message.senderId), formatUserName(message.sender), formatUserName(message.author), 'Utilisateur'),
  content: firstDefined(message.content, message.text, message.message, ''),
  attachments: (Array.isArray(message.attachments) ? message.attachments : []).map(normalizeAttachment),
  createdAt: firstDefined(message.createdAt, message.created_at, message.timestamp, new Date().toISOString()),
  read: Boolean(firstDefined(message.read, message.isRead, false)),
});

const normalizeAttachment = (attachment = {}) => ({
  ...attachment,
  id: firstDefined(attachment.id, attachment._id),
  originalName: firstDefined(attachment.originalName, attachment.name, 'Document joint'),
  mimeType: firstDefined(attachment.mimeType, attachment.type, 'application/octet-stream'),
  size: Number(attachment.size || 0),
  url: attachment.url || null,
});

const normalizeConversation = (conversation = {}, role = getCurrentUser()?.role) => {
  const messages = (conversation.messages || conversation.messageList || []).map(normalizeMessage);
  const lastMessageValue = firstDefined(conversation.lastMessage, conversation.latestMessage);
  const participant = role === 'centre'
    ? conversation.learnerUserId
    : conversation.centreUserId || conversation.centreId;

  return {
    ...conversation,
    id: firstDefined(conversation.id, conversation._id),
    type: firstDefined(conversation.type, conversation.kind, 'direct'),
    participantName: firstDefined(
      conversation.participantName,
      conversation.otherParticipant?.name,
      conversation.participant?.name,
      conversation.partner?.name,
      formatUserName(participant),
      'Conversation'
    ),
    participantAvatar: firstDefined(
      conversation.participantAvatar,
      conversation.otherParticipant?.avatar,
      conversation.participant?.avatar,
      participant?.avatar,
      null
    ),
    participantRole: firstDefined(
      conversation.participantRole,
      conversation.otherParticipant?.role,
      conversation.participant?.role,
      participant?.role,
      'Utilisateur'
    ),
    learnerName: formatUserName(conversation.learnerUserId),
    centreName: formatUserName(conversation.centreUserId),
    formationTitle: conversation.formationId?.title || conversation.formation?.title || null,
    lastMessage: typeof lastMessageValue === 'object'
      ? firstDefined(lastMessageValue.content, lastMessageValue.text, lastMessageValue.attachments?.length ? `📎 ${lastMessageValue.contentPreview || 'Document joint'}` : undefined, lastMessageValue.contentPreview, '')
      : firstDefined(lastMessageValue, messages.at(-1)?.content, ''),
    lastMessageAt: firstDefined(
      conversation.lastMessageAt,
      conversation.latestMessageAt,
      typeof lastMessageValue === 'object' ? lastMessageValue.createdAt : undefined,
      messages.at(-1)?.createdAt
    ),
    unreadCount: Number(firstDefined(conversation.unreadCount, conversation.unread, 0)),
    messages,
  };
};

const unwrapList = (payload, role) => {
  const list = payload?.conversations || payload?.data?.conversations || payload?.data?.data || payload?.data || payload;
  return Array.isArray(list) ? list.map((item) => normalizeConversation(item, role)) : [];
};

const unwrapConversation = (payload, role) => {
  const data = payload?.data || payload;
  const conversation = data?.conversation || payload?.conversation || data;
  const messages = conversation?.messages || data?.messages || payload?.messages;
  return normalizeConversation(messages ? { ...conversation, messages } : conversation, role);
};

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
    return unwrapList(await apiRequest('/api/conversations'), getCurrentUser()?.role);
  },

  async getConversation(id) {
    return unwrapConversation(await apiRequest(`/api/conversations/${id}`), getCurrentUser()?.role);
  },

  async createDirectConversation({ centreId, formationId }) {
    return unwrapConversation(await apiRequest('/api/conversations/direct', {
      method: 'POST',
      body: JSON.stringify({ centreId, ...(formationId ? { formationId } : {}) }),
    }), getCurrentUser()?.role);
  },

  async createSupportConversation({ subject, initialMessage }) {
    return unwrapConversation(await apiRequest('/api/conversations/support', {
      method: 'POST',
      body: JSON.stringify({ subject, initialMessage }),
    }), getCurrentUser()?.role);
  },

  async sendMessage(conversationId, content, clientMessageId, attachments = []) {
    const messagePayload = { content, ...(clientMessageId ? { clientMessageId } : {}), ...(attachments.length ? { attachments } : {}) };
    return unwrapConversation(await apiRequest(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messagePayload),
    }), getCurrentUser()?.role);
  },

  async uploadAttachment(conversationId, file) {
    const body = new FormData();
    body.append('file', file);
    const result = await apiRequest(`/api/conversations/${conversationId}/attachments`, { method: 'POST', body });
    return normalizeAttachment(result?.data?.attachment || result?.attachment);
  },

  async downloadAttachment(conversationId, attachment) {
    const endpoint = attachment.url || `/api/conversations/${conversationId}/attachments/${attachment.id}`;
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${getToken()}`, Accept: attachment.mimeType || '*/*' },
    });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    return response.blob();
  },

  async updateSupportStatus(conversationId, status) {
    return unwrapConversation(await apiRequest(`/api/conversations/${conversationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }), getCurrentUser()?.role);
  },

  async markConversationRead(conversationId) {
    return unwrapConversation(await apiRequest(`/api/conversations/${conversationId}/read`, {
      method: 'PATCH',
    }), getCurrentUser()?.role);
  },
};

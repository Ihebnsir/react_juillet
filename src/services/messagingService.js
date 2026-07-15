import { mockConversations } from '../data/mockConversations';

const STORAGE_KEY = 'skillbridge_conversations';

const getStoredConversations = () => {
  if (typeof window === 'undefined') {
    return mockConversations;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return mockConversations;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return mockConversations;
  }
};

const saveConversations = (conversations) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }
};

export const messagingService = {
  getConversationsForUser(user) {
    const allConversations = getStoredConversations();

    if (!user) {
      return [];
    }

    if (user.role === 'admin') {
      return allConversations.filter((conversation) => conversation.type === 'support');
    }

    return allConversations.filter((conversation) => {
      if (conversation.type === 'support') {
        return conversation.participantId === user.id || conversation.participantId === `${user.role}-${user.id}`;
      }

      return conversation.participantId === user.id || conversation.participantId === `${user.role}-${user.id}`;
    });
  },

  getConversationById(conversationId) {
    return getStoredConversations().find((conversation) => conversation.id === conversationId) || null;
  },

  sendMessage(conversationId, message) {
    const conversations = getStoredConversations();
    const conversation = conversations.find((item) => item.id === conversationId);

    if (!conversation) {
      return null;
    }

    const nextMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      content: message.content,
      createdAt: new Date().toISOString(),
      read: true,
      delivered: true,
    };

    conversation.messages.push(nextMessage);
    conversation.lastMessage = message.content;
    conversation.lastMessageAt = nextMessage.createdAt;
    conversation.unreadCount = 0;
    saveConversations(conversations);
    return conversation;
  },

  createDirectConversation({ learnerId, centreId, formationId, initialMessage = 'Bonjour, j’ai une question sur cette formation.' }) {
    const conversations = getStoredConversations();
    const existing = conversations.find((conversation) => conversation.type === 'direct' && conversation.participantId === centreId && conversation.formationId === formationId);

    if (existing) {
      return existing;
    }

    const conversation = {
      id: `conv-direct-${Date.now()}`,
      type: 'direct',
      participantId: centreId,
      participantName: 'Centre SkillBridge',
      participantRole: 'Centre',
      participantAvatar: null,
      participantStatus: 'en ligne',
      formationId,
      formationTitle: 'Formation',
      formationPrice: 0,
      unreadCount: 1,
      lastMessageAt: new Date().toISOString(),
      lastMessage: initialMessage,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          senderId: learnerId,
          senderName: 'Moi',
          content: initialMessage,
          createdAt: new Date().toISOString(),
          read: false,
          delivered: true,
        },
      ],
    };

    conversations.unshift(conversation);
    saveConversations(conversations);
    return conversation;
  },

  createSupportConversation({ user, subject, initialMessage }) {
    const conversations = getStoredConversations();
    const conversation = {
      id: `conv-support-${Date.now()}`,
      type: 'support',
      participantId: 'admin-1',
      participantName: 'Support SkillBridge',
      participantRole: 'Support',
      participantAvatar: null,
      participantStatus: 'en ligne',
      unreadCount: 1,
      status: 'ouvert',
      subject,
      lastMessageAt: new Date().toISOString(),
      lastMessage: initialMessage,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          senderId: user.id,
          senderName: user.name,
          content: initialMessage,
          createdAt: new Date().toISOString(),
          read: false,
          delivered: true,
        },
      ],
    };

    conversations.unshift(conversation);
    saveConversations(conversations);
    return conversation;
  },

  updateSupportStatus(conversationId, status) {
    const conversations = getStoredConversations();
    const conversation = conversations.find((item) => item.id === conversationId);

    if (!conversation) {
      return null;
    }

    conversation.status = status;
    saveConversations(conversations);
    return conversation;
  },
};

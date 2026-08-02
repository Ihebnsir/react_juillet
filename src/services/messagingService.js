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
      const normalizedLearnerId = user.role === 'apprenant' || user.role === 'learner' ? `learner-${user.id}` : user.id;
      const normalizedLearnerIdAlt = user.role === 'apprenant' || user.role === 'learner' ? user.id : `${user.role}-${user.id}`;

      if (conversation.type === 'support') {
        return (
          conversation.participantId === user.id ||
          conversation.participantId === `${user.role}-${user.id}` ||
          conversation.learnerId === user.id ||
          conversation.learnerId === normalizedLearnerId ||
          conversation.learnerId === normalizedLearnerIdAlt ||
          conversation.userId === user.id
        );
      }

      return (
        conversation.learnerId === user.id ||
        conversation.learnerId === normalizedLearnerId ||
        conversation.learnerId === normalizedLearnerIdAlt ||
        conversation.participantId === user.id ||
        conversation.participantId === `${user.role}-${user.id}` ||
        conversation.userId === user.id
      );
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

  createDirectConversation({
    learnerId,
    centreId,
    formationId,
    participantName = 'Centre SkillBridge',
    participantAvatar = null,
    formationTitle = 'Formation',
    formationPrice = 0,
    subject = '',
    initialMessage = 'Bonjour, j’ai une question sur cette formation.',
  }) {
    const conversations = getStoredConversations();
    const existing = conversations.find((conversation) => conversation.type === 'direct' && conversation.participantId === centreId && conversation.formationId === formationId && conversation.learnerId === learnerId);

    if (existing) {
      existing.participantName = participantName || existing.participantName;
      existing.participantAvatar = participantAvatar ?? existing.participantAvatar;
      existing.formationTitle = formationTitle || existing.formationTitle;
      existing.formationPrice = formationPrice ?? existing.formationPrice;
      existing.subject = subject || existing.subject || formationTitle;
      existing.lastMessage = initialMessage;
      existing.lastMessageAt = new Date().toISOString();
      saveConversations(conversations);
      return existing;
    }

    const conversation = {
      id: `conv-direct-${Date.now()}`,
      type: 'direct',
      learnerId,
      participantId: centreId,
      participantName,
      participantRole: 'Centre',
      participantAvatar,
      participantStatus: 'en ligne',
      formationId,
      formationTitle,
      formationPrice,
      subject: subject || formationTitle,
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
      learnerId: user.id,
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

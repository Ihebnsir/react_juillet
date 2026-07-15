import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { messagingService } from '../../services/messagingService';
import { ConversationList } from '../../components/messaging/ConversationList';
import { MessageBubble } from '../../components/messaging/MessageBubble';
import { MessageInput } from '../../components/messaging/MessageInput';
import { ContextPanel } from '../../components/messaging/ContextPanel';
import { EmptyState } from '../../components/messaging/EmptyState';
import { DateSeparator } from '../../components/messaging/DateSeparator';
import { TypingIndicator } from '../../components/messaging/TypingIndicator';
import { NewSupportConversationModal } from '../../components/messaging/NewSupportConversationModal';
import { ToastMessage } from '../../components/UI/ToastMessage';

export const SupportPage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        setIsLoading(true);
        const data = messagingService.getConversationsForUser(user);
        setConversations(data);
        if (data[0]) {
          setActiveConversationId(data[0].id);
        }
      } catch (err) {
        setError(t('messaging.error', 'Impossible de charger les conversations.'));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, t]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch = `${conversation.participantName} ${conversation.lastMessage}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === 'all' || conversation.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [conversations, search, filter]);

  const activeConversation = useMemo(() => {
    return filteredConversations.find((conversation) => conversation.id === activeConversationId) || conversations.find((conversation) => conversation.id === activeConversationId) || null;
  }, [activeConversationId, conversations, filteredConversations]);

  const handleSend = (content) => {
    if (!activeConversation) {
      return;
    }

    const updated = messagingService.sendMessage(activeConversation.id, { content });
    setConversations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setIsTyping(true);
    window.setTimeout(() => setIsTyping(false), 1200);
    setToast(t('messaging.sent', 'Message envoyé'));
  };

  const handleAttachment = () => {
    setToast(t('messaging.attachmentSoon', 'Pièce jointe bientôt disponible'));
  };

  const handleStatusChange = (status) => {
    const updated = messagingService.updateSupportStatus(activeConversation.id, status);
    if (updated) {
      setConversations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setToast(t('messaging.statusUpdated', 'Statut mis à jour'));
    }
  };

  const handleCreateConversation = ({ subject, message }) => {
    const created = messagingService.createSupportConversation({ user, subject, initialMessage: message });
    setConversations((prev) => [created, ...prev]);
    setActiveConversationId(created.id);
    setIsModalOpen(false);
    setToast(t('messaging.ticketOpened', 'Ticket ouvert avec succès'));
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-3 py-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${isRtl ? 'text-right' : 'text-left'}`}>
      <ToastMessage message={toast} type="success" onClose={() => setToast('')} />
      <NewSupportConversationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateConversation} />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row">
        <div className="w-full xl:w-[360px]">
          <ConversationList
            conversations={filteredConversations}
            activeConversationId={activeConversation?.id || null}
            onSelectConversation={setActiveConversationId}
            onNewSupportConversation={() => setIsModalOpen(true)}
            isLoading={isLoading}
            userRole={user.role}
            search={search}
            onSearchChange={setSearch}
            filters={filter}
            onFilterChange={setFilter}
          />
        </div>

        <div className="flex-1 rounded-[32px] border border-slate-200/70 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
          {!activeConversation ? (
            <div className="flex h-[70vh] items-center justify-center">
              <EmptyState
                title={t('messaging.selectConversation', 'Sélectionnez une conversation')}
                description={t('messaging.selectConversationDescription', 'Choisissez un ticket pour consulter le fil de discussion.')}
              />
            </div>
          ) : (
            <div className="flex h-[70vh] flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 text-sm font-semibold text-white">
                    {activeConversation.participantName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activeConversation.participantName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{activeConversation.participantStatus || 'en ligne'}</div>
                  </div>
                </div>
                <div className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                  {activeConversation.status || 'ouvert'}
                </div>
              </div>

              <div className="flex-1 space-y-1 overflow-auto px-3 py-4">
                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
                    {error}
                  </div>
                ) : (
                  <>
                    {activeConversation.messages?.map((message, index) => {
                      const previous = activeConversation.messages[index - 1];
                      const showAvatar = !previous || previous.senderId !== message.senderId;
                      return (
                        <div key={message.id}>
                          {index === 0 || new Date(message.createdAt).toDateString() !== new Date(activeConversation.messages[index - 1].createdAt).toDateString() ? (
                            <DateSeparator label={new Date(message.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
                          ) : null}
                          <MessageBubble message={message} isMine={message.senderId === 'me'} showAvatar={showAvatar} avatar={activeConversation.participantAvatar} name={activeConversation.participantName} />
                        </div>
                      );
                    })}
                    {isTyping && <TypingIndicator />}
                  </>
                )}
              </div>

              <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-700">
                <MessageInput onSend={handleSend} onAttachmentClick={handleAttachment} />
              </div>
            </div>
          )}
        </div>

        <div className="hidden w-[320px] xl:block">
          <ContextPanel conversation={activeConversation} userRole={user.role} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

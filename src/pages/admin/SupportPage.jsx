import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { connectMessagingSocket, joinMessagingConversation, leaveMessagingConversation, messagingService, subscribeToMessaging } from '../../services/messagingService';
import { ConversationList } from '../../components/messaging/ConversationList';
import { MessageBubble } from '../../components/messaging/MessageBubble';
import { MessageInput } from '../../components/messaging/MessageInput';
import { ContextPanel } from '../../components/messaging/ContextPanel';
import { EmptyState } from '../../components/messaging/EmptyState';
import { DateSeparator } from '../../components/messaging/DateSeparator';
import { NewSupportConversationModal } from '../../components/messaging/NewSupportConversationModal';
import { ToastMessage } from '../../components/UI/ToastMessage';

export const SupportPage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await messagingService.getConversations();
        if (cancelled) return;
        const requestedId = location.state?.conversationId ? String(location.state.conversationId) : null;
        let loadedConversations = data;
        if (requestedId && !data.some((item) => String(item.id) === requestedId)) {
          try {
            const requestedConversation = await messagingService.getConversation(requestedId);
            loadedConversations = [requestedConversation, ...data];
          } catch {
            loadedConversations = data;
          }
        }
        setConversations(loadedConversations);
        if (requestedId && loadedConversations.some((item) => String(item.id) === requestedId)) {
          setActiveConversationId(requestedId);
        } else if (loadedConversations[0]) {
          setActiveConversationId(loadedConversations[0].id);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || t('messaging.error', 'Impossible de charger les conversations.'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    connectMessagingSocket();
    const unsubscribe = subscribeToMessaging((event) => {
      const conversationId = event?.conversationId || event?.conversation?.id || event?.message?.conversationId;
      if (conversationId && conversationId === activeConversationId) {
        messagingService.getConversation(conversationId).then((detail) => {
          if (!cancelled) setConversations((items) => items.map((item) => item.id === detail.id ? { ...item, ...detail } : item));
        }).catch(() => {});
        return;
      }
      messagingService.getConversations().then((items) => {
        if (!cancelled) setConversations(items);
      }).catch(() => {});
    });
    return () => { cancelled = true; unsubscribe(); };
  }, [activeConversationId, location.state, user, t]);

  useEffect(() => {
    if (!activeConversationId) return undefined;
    let cancelled = false;
    joinMessagingConversation(activeConversationId);
    const open = async () => {
      try {
        const detail = await messagingService.getConversation(activeConversationId);
        const read = await messagingService.markConversationRead(activeConversationId);
        if (cancelled) return;
        const updated = read.id ? read : { ...detail, unreadCount: 0 };
        setConversations((items) => items.map((item) => item.id === updated.id ? { ...item, ...updated } : item));
      } catch (err) {
        if (!cancelled) setError(err?.message || t('messaging.error', 'Impossible de charger la conversation.'));
      }
    };
    open();
    return () => {
      cancelled = true;
      leaveMessagingConversation(activeConversationId);
    };
  }, [activeConversationId, t]);

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

  const handleSend = async (content, files = []) => {
    if (!activeConversation) {
      return false;
    }

    try {
      setIsSending(true);
      const attachments = await Promise.all(files.map((file) => messagingService.uploadAttachment(activeConversation.id, file)));
      const updated = await messagingService.sendMessage(activeConversation.id, content, window.crypto?.randomUUID?.(), attachments);
      setConversations((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      setToast(t('messaging.sent', 'Message envoyé'));
      return true;
    } catch (err) {
      setError(err?.message || t('messaging.error', 'Impossible d’envoyer le message.'));
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachmentOpen = async (attachment) => {
    if (!activeConversation) return;
    try {
      const blob = await messagingService.downloadAttachment(activeConversation.id, attachment);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setError(t('messaging.attachmentDownloadError', 'Impossible d’ouvrir la pièce jointe.'));
    }
  };

  const handleAttachmentPreview = async (attachment) => {
    if (!activeConversation) return '';
    const blob = await messagingService.downloadAttachment(activeConversation.id, attachment);
    return URL.createObjectURL(blob);
  };

  const handleStatusChange = async (status) => {
    try {
      const updated = await messagingService.updateSupportStatus(activeConversation.id, status);
      setConversations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setToast(t('messaging.statusUpdated', 'Statut mis à jour'));
    } catch (err) {
      setError(err?.message || t('messaging.error', 'Impossible de mettre à jour le statut.'));
    }
  };

  const handleCreateConversation = async ({ subject, message }) => {
    try {
      const created = await messagingService.createSupportConversation({ subject, initialMessage: message });
      setConversations((prev) => [created, ...prev]);
      setActiveConversationId(created.id);
      setIsModalOpen(false);
      setToast(t('messaging.ticketOpened', 'Ticket ouvert avec succès'));
    } catch (err) {
      setError(err?.message || t('messaging.error', 'Impossible de créer le ticket.'));
    }
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
                          <MessageBubble message={message} isMine={String(message.senderId) === String(user.id)} showAvatar={showAvatar} avatar={activeConversation.participantAvatar} name={activeConversation.participantName} onAttachmentOpen={handleAttachmentOpen} onAttachmentPreview={handleAttachmentPreview} />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-700">
                <MessageInput isSending={isSending} onSend={handleSend} onError={setError} />
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

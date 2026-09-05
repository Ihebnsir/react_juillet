import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { connectMessagingSocket, joinMessagingConversation, leaveMessagingConversation, messagingService, subscribeToMessaging } from '../../services/messagingService';
import { ConversationList } from '../../components/messaging/ConversationList';
import { MessageBubble } from '../../components/messaging/MessageBubble';
import { MessageInput } from '../../components/messaging/MessageInput';
import { ContextPanel } from '../../components/messaging/ContextPanel';
import { EmptyState } from '../../components/messaging/EmptyState';
import { DateSeparator } from '../../components/messaging/DateSeparator';
import { ToastMessage } from '../../components/UI/ToastMessage';

const mergeConversation = (items, updated) => items.map((item) => item.id === updated.id ? { ...item, ...updated } : item);

export const MessageriePage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await messagingService.getConversations();
        if (cancelled) return;
        setConversations(data);
        const requested = searchParams.get('conversation');
        setActiveConversationId(requested && data.some((item) => item.id === requested) ? requested : data[0]?.id || null);
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
          if (!cancelled) setConversations((items) => mergeConversation(items, detail));
        }).catch(() => {});
        return;
      }
      messagingService.getConversations().then((items) => {
        if (!cancelled) setConversations(items);
      }).catch(() => {});
    });
    return () => { cancelled = true; unsubscribe(); };
  }, [activeConversationId, searchParams, t]);

  useEffect(() => {
    if (!activeConversationId) return undefined;
    let cancelled = false;
    joinMessagingConversation(activeConversationId);
    const open = async () => {
      try {
        const detail = await messagingService.getConversation(activeConversationId);
        const read = await messagingService.markConversationRead(activeConversationId);
        if (cancelled) return;
        setConversations((items) => mergeConversation(items, read.id ? read : { ...detail, unreadCount: 0 }));
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

  const filteredConversations = useMemo(() => conversations.filter((conversation) => (
    `${conversation.participantName} ${conversation.lastMessage}`.toLowerCase().includes(search.toLowerCase())
  )), [conversations, search]);

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || null;

  const selectConversation = (id) => {
    setActiveConversationId(id);
    setIsMobileChatOpen(true);
  };

  const handleSend = async (content) => {
    if (!activeConversation) return;
    try {
      setError('');
      const updated = await messagingService.sendMessage(activeConversation.id, content, window.crypto?.randomUUID?.());
      setConversations((items) => mergeConversation(items, updated));
      setToast(t('messaging.sent', 'Message envoyé'));
    } catch (err) {
      setError(err?.message || t('messaging.error', 'Impossible d’envoyer le message.'));
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const updated = await messagingService.updateSupportStatus(activeConversation.id, status);
      setConversations((items) => mergeConversation(items, updated));
      setToast(t('messaging.statusUpdated', 'Statut mis à jour'));
    } catch (err) {
      setError(err?.message || t('messaging.error', 'Impossible de mettre à jour le statut.'));
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-3 py-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
      <ToastMessage message={toast} type="success" onClose={() => setToast('')} />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className={`w-full lg:w-[360px] ${isMobileChatOpen ? 'hidden lg:block' : 'block'}`}>
          <ConversationList conversations={filteredConversations} activeConversationId={activeConversationId} onSelectConversation={selectConversation} onNewSupportConversation={() => navigate('/support')} isLoading={isLoading} userRole={user.role} search={search} onSearchChange={setSearch} filters="all" onFilterChange={() => {}} />
        </div>
        <div className={`flex-1 rounded-[32px] border border-slate-200/70 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 ${!isMobileChatOpen ? 'hidden lg:block' : 'block'}`}>
          {!activeConversation ? <div className="flex h-[70vh] items-center justify-center"><EmptyState title={t('messaging.selectConversation', 'Sélectionnez une conversation')} description={t('messaging.selectConversationDescription', 'Choisissez une conversation pour démarrer le fil de discussion.')} /></div> : (
            <div className="flex h-[70vh] flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {window.innerWidth < 1024 && <button onClick={() => setIsMobileChatOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><FiArrowLeft className="h-4 w-4" /></button>}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 text-sm font-semibold text-white">{activeConversation.participantName?.slice(0, 2).toUpperCase()}</div>
                  <div><div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activeConversation.participantName}</div><div className="text-xs text-slate-500 dark:text-slate-400">{activeConversation.participantStatus || 'en ligne'}</div></div>
                </div>
                <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/20 dark:text-teal-300">{activeConversation.type === 'support' ? 'Support' : 'Direct'}</div>
              </div>
              <div className="flex-1 space-y-1 overflow-auto px-3 py-4">
                {error ? <div className="flex h-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700"><div><FiAlertTriangle className="mx-auto mb-3 text-2xl" />{error}</div></div> : activeConversation.messages?.map((message, index) => {
                  const previous = activeConversation.messages[index - 1];
                  const showAvatar = !previous || previous.senderId !== message.senderId;
                  return <div key={message.id}>{(index === 0 || new Date(message.createdAt).toDateString() !== new Date(previous.createdAt).toDateString()) && <DateSeparator label={new Date(message.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />}<MessageBubble message={message} isMine={String(message.senderId) === String(user.id)} showAvatar={showAvatar} avatar={activeConversation.participantAvatar} name={activeConversation.participantName} /></div>;
                })}
              </div>
              <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-700"><MessageInput onSend={handleSend} onAttachmentClick={() => setToast(t('messaging.attachmentSoon', 'Pièce jointe bientôt disponible'))} /></div>
            </div>
          )}
        </div>
        <div className="hidden w-[300px] xl:block"><ContextPanel conversation={activeConversation} userRole={user.role} onStatusChange={handleStatusChange} /></div>
      </div>
    </div>
  );
};
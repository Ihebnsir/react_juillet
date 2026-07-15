import { useEffect, useRef, useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const MessageInput = ({ onSend, onAttachmentClick }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-end gap-2 rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <button
        type="button"
        onClick={onAttachmentClick}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-700"
      >
        <FiPaperclip className="h-4 w-4" />
      </button>
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('messaging.inputPlaceholder', 'Écrire un message...')}
        className={`max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none dark:text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${message.trim() ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}
      >
        <FiSend className="h-4 w-4" />
      </button>
    </form>
  );
};

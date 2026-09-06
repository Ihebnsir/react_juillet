import { useEffect, useRef, useState } from 'react';
import { FiFile, FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  'application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'text/plain',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

const formatSize = (size) => size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} Ko` : `${(size / (1024 * 1024)).toFixed(1)} Mo`;

export const MessageInput = ({ onSend, onAttachmentClick, isSending = false, onError }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
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
    if ((!trimmed && files.length === 0) || isSending) {
      return;
    }

    Promise.resolve(onSend(trimmed, files)).then((sent) => {
      if (sent !== false) {
        setMessage('');
        setFiles([]);
      }
    });
  };

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    const invalid = selected.find((file) => !ACCEPTED_TYPES.has(file.type) || file.size < 1 || file.size > MAX_FILE_SIZE);
    if (invalid) {
      onError?.(t('messaging.invalidAttachment', 'Fichier non pris en charge ou trop volumineux (10 Mo maximum).'));
      event.target.value = '';
      return;
    }
    if (files.length + selected.length > MAX_FILES) {
      onError?.(t('messaging.maxAttachments', 'Vous pouvez joindre 5 fichiers maximum.'));
      event.target.value = '';
      return;
    }
    setFiles((current) => [...current, ...selected]);
    event.target.value = '';
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-end gap-2 rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <button
        type="button"
        onClick={() => (fileInputRef.current ? fileInputRef.current.click() : onAttachmentClick?.())}
        disabled={isSending}
        aria-label={t('messaging.attach', 'Joindre un fichier')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-700"
      >
        <FiPaperclip className="h-4 w-4" />
      </button>
      <input ref={fileInputRef} type="file" multiple accept={Array.from(ACCEPTED_TYPES).join(',')} onChange={handleFiles} className="hidden" />
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('messaging.inputPlaceholder', 'Écrire un message...')}
        className={`max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none dark:text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}
      />
      {files.length > 0 ? (
        <div className="absolute bottom-full left-0 right-0 mb-2 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.lastModified}-${index}`} className="flex max-w-full items-center gap-2 rounded-xl bg-slate-100 px-2 py-1.5 text-xs dark:bg-slate-700">
              <FiFile className="shrink-0 text-teal-600" />
              <span className="max-w-[180px] truncate">{file.name}</span>
              <span className="text-slate-400">{formatSize(file.size)}</span>
              <button type="button" aria-label={`${t('messaging.removeAttachment', 'Retirer')} ${file.name}`} onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-slate-400 hover:text-rose-500"><FiX /></button>
            </div>
          ))}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={(!message.trim() && files.length === 0) || isSending}
        aria-label={isSending ? t('messaging.sending', 'Envoi en cours') : t('messaging.send', 'Envoyer')}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${(message.trim() || files.length > 0) && !isSending ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}
      >
        <FiSend className="h-4 w-4" />
      </button>
    </form>
  );
};

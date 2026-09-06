import { useEffect, useState } from 'react';
import { FiCheckCircle, FiDownload, FiFile, FiImage } from 'react-icons/fi';

const formatSize = (size) => size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} Ko` : `${(size / (1024 * 1024)).toFixed(1)} Mo`;

const AttachmentCard = ({ attachment, onOpen, onPreview }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const isImage = attachment.mimeType?.startsWith('image/');

  useEffect(() => {
    let active = true;
    let generatedUrl = '';
    if (isImage && onPreview) {
      onPreview(attachment).then((url) => {
        generatedUrl = url;
        if (active) setPreviewUrl(url);
        else if (url) URL.revokeObjectURL(url);
      }).catch(() => {});
    }
    return () => {
      active = false;
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [attachment, isImage, onPreview]);

  return (
    <button type="button" onClick={() => onOpen?.(attachment)} className="flex w-full min-w-[220px] items-center gap-2 rounded-xl bg-black/10 p-2 text-left transition hover:bg-black/20">
      {previewUrl ? <img src={previewUrl} alt={attachment.originalName} className="h-10 w-10 rounded-lg object-cover" /> : isImage ? <FiImage className="shrink-0 text-teal-500" /> : <FiFile className="shrink-0 text-teal-500" />}
      <span className="min-w-0 flex-1 truncate">{attachment.originalName}</span>
      <span className="shrink-0 text-xs opacity-70">{formatSize(attachment.size)}</span>
      <FiDownload className="shrink-0" />
    </button>
  );
};

export const MessageBubble = ({ message, isMine, showAvatar, avatar, name, onAttachmentOpen, onAttachmentPreview }) => {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}>
      <div className={`max-w-[85%] ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && showAvatar && (
          <div className="mb-2 flex items-center gap-2">
            {avatar ? (
              <img src={avatar} alt={name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{name}</span>
          </div>
        )}

        <div className={`rounded-[1.2rem] px-4 py-3 text-sm shadow-sm ${isMine ? 'rounded-br-md bg-teal-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100'}`}>
          {message.content ? <p className="leading-6">{message.content}</p> : null}
          {message.attachments?.length ? (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => <AttachmentCard key={attachment.id} attachment={attachment} onOpen={onAttachmentOpen} onPreview={onAttachmentPreview} />)}
            </div>
          ) : null}
        </div>
        <div className={`mt-1 flex items-center gap-1 text-[11px] ${isMine ? 'justify-end text-teal-600 dark:text-teal-400' : 'justify-start text-slate-400'}`}>
          <span>{new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          {isMine && <FiCheckCircle className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
};

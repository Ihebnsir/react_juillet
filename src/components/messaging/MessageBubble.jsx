import { FiCheckCircle } from 'react-icons/fi';

export const MessageBubble = ({ message, isMine, showAvatar, avatar, name }) => {
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
          <p className="leading-6">{message.content}</p>
        </div>
        <div className={`mt-1 flex items-center gap-1 text-[11px] ${isMine ? 'justify-end text-teal-600 dark:text-teal-400' : 'justify-start text-slate-400'}`}>
          <span>{new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          {isMine && <FiCheckCircle className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
};

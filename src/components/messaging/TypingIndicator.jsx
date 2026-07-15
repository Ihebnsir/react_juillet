export const TypingIndicator = () => (
  <div className="mt-3 flex items-center gap-2">
    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-700">
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
    </div>
  </div>
);

export const ConversationSkeleton = () => (
  <div className="animate-pulse space-y-3 p-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-800/70">
        <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-32 rounded bg-slate-200/80 dark:bg-slate-700/80" />
        </div>
      </div>
    ))}
  </div>
);

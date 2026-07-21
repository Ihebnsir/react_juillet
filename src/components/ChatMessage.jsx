import React from "react";

export function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
          isUser
            ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white"
            : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`mt-2 text-[11px] ${isUser ? "text-brand-100" : "text-slate-400 dark:text-slate-500"}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

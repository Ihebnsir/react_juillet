import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { getMockChatResponse } from "../data/mockChatResponses";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Bonjour ! Je suis votre assistant SkillBridge. Comment puis-je vous aider aujourd’hui ?",
    timestamp: "À l’instant",
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  useEffect(() => {
    const node = messagesEndRef.current;
    if (node && typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: getMockChatResponse(trimmed),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1400);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mb-3 flex items-center gap-2 rounded-full border border-white/70 bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(2,132,199,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_56px_rgba(2,132,199,0.35)]"
        aria-label={isOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M7 8h10M7 12h6" strokeLinecap="round" />
            <path d="M8 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{isOpen ? "Fermer" : "Assistant IA"}</span>
      </button>

      <div
        className={`w-[92vw] max-w-[380px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-300 ease-out dark:border-slate-700/70 dark:bg-slate-900/95 ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-4 text-white dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 9a3 3 0 0 1 6 0v1a3 3 0 0 1-6 0V9Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 13a4 4 0 0 0 10 0" strokeLinecap="round" />
                <path d="M8 16a6 6 0 0 0 8 0" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">SkillBridge AI Assistant</p>
              <p className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> En ligne
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Fermer le chatbot"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex h-[360px] flex-col bg-slate-50/80 p-3 dark:bg-slate-950/60">
          <div className="flex-1 space-y-2 overflow-y-auto rounded-2xl bg-white/70 p-3 shadow-inner dark:bg-slate-900/70">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Écriture</span>
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500" />
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              className="w-full border-0 bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">Réponse simulée en front-end</p>
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>Envoyer</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h14" strokeLinecap="round" />
                  <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

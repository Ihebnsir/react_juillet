import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSend } from 'react-icons/fi';
import { sendChatbotMessage } from '../../services/chatbotService';

function AssistantIAModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      texte:
        "Bonjour ! Je suis l'assistant SkillBridge. Comment puis-je vous aider ? (recherche de formation, réservation, certification...)",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(`skillbridge-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const envoyerMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const messageUser = { role: 'user', texte: trimmed };
    setMessages((prev) => [...prev, messageUser]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendChatbotMessage({
        chatInput: trimmed,
        sessionId: sessionIdRef.current,
      });
      setMessages((prev) => [...prev, { role: 'assistant', texte: responseText }]);
    } catch (error) {
      console.error("Erreur lors de l'appel au chatbot n8n", error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          texte: 'Désolé, je rencontre actuellement un problème de connexion. Veuillez réessayer dans quelques instants.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-end bg-black/60 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-[500px] w-full max-w-sm flex-col rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          <span className="font-semibold text-white">Assistant SkillBridge</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-brand-500 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {m.texte}
            </div>
          ))}
          {isLoading && (
            <div className="max-w-[85%] rounded-2xl bg-slate-700 p-3 text-sm leading-relaxed text-slate-200">
              Chargement...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-slate-700 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder-slate-500 focus:border-brand-500"
          />
          <button
            type="button"
            onClick={envoyerMessage}
            disabled={!input.trim() || isLoading}
            className="btn-primary rounded-lg px-3 py-2 disabled:opacity-50"
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AssistantIAModal;


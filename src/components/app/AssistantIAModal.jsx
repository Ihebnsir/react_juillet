import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSend } from 'react-icons/fi';

const REPONSES_AUTOMATIQUES = {
  formation:
    "Vous pouvez rechercher une formation depuis la page 'Formations', avec des filtres par domaine, ville et budget.",
  reservation:
    "Pour réserver, ouvrez la page détail d'une formation et cliquez sur 'Réserver'.",
  certificat:
    "Vos certificats sont disponibles dans la section 'Certifications', téléchargeables avec QR code de vérification.",
  centre:
    "Tous nos centres sont vérifiés avant publication. Vous pouvez consulter leurs profils, notes et avis depuis la page 'Centres'.",
  paiement:
    "Le paiement s'effectue en ligne via notre plateforme sécurisée. Vous recevez une confirmation immédiate après réservation.",
  contact:
    "Pour toute question, utilisez le formulaire de contact ou écrivez-nous directement depuis la messagerie.",
  default:
    "Je n'ai pas encore de réponse précise pour cette question — contactez le support via 'Aide & support' pour une assistance humaine.",
};

function AssistantIAModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      texte:
        "Bonjour ! Je suis l'assistant SkillBridge. Comment puis-je vous aider ? (recherche de formation, réservation, certification...)",
    },
  ]);
  const [input, setInput] = useState('');

  const envoyerMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const messageUser = { role: 'user', texte: trimmed };

    const motCle = Object.keys(REPONSES_AUTOMATIQUES).find((k) =>
      trimmed.toLowerCase().includes(k)
    );
    const reponse = {
      role: 'assistant',
      texte:
        REPONSES_AUTOMATIQUES[motCle] || REPONSES_AUTOMATIQUES.default,
    };

    setMessages((prev) => [...prev, messageUser, reponse]);
    setInput('');
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
            disabled={!input.trim()}
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


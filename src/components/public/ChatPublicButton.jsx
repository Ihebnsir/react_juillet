import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';

/**
 * ChatPublicButton — widget flottant pour les pages publiques.
 * Affiche "Discuter avec nous" et propose un lien vers la page contact.
 * À utiliser UNIQUEMENT sur les pages publiques (HomePage, FormationsPage, AboutPage, etc.).
 * Ne PAS utiliser dans les espaces connectés (ApprenantLayout, CentreLayout, AdminLayout).
 */
function ChatPublicButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 end-6 z-40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-primary rounded-full px-5 py-3 shadow-lg flex items-center gap-2"
        aria-label={open ? "Fermer le chat" : "Discuter avec nous"}
      >
        <FiMessageCircle size={18} />
        <span>Discuter avec nous</span>
      </button>
      {open && (
        <div className="absolute bottom-16 end-0 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-xl p-4">
          <p className="text-sm text-slate-300 mb-3">
            Une question sur SkillBridge ? Notre équipe vous répond rapidement.
          </p>
          <Link
            to="/contact"
            className="btn-primary w-full text-center text-sm inline-block"
            onClick={() => setOpen(false)}
          >
            Nous contacter
          </Link>
        </div>
      )}
    </div>
  );
}

export default ChatPublicButton;


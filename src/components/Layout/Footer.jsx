import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";
import { getContactInfo } from "../../services/contactService";

export const Footer = () => {
  const [contact, setContact] = useState(() => getContactInfo());

  useEffect(() => {
    const handleStorage = () => setContact(getContactInfo());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const socialLinks = [
    { href: contact.social?.facebook || "#", icon: FiFacebook, label: "Facebook" },
    { href: contact.social?.twitter || "#", icon: FiTwitter, label: "Twitter" },
    { href: contact.social?.linkedin || "#", icon: FiLinkedin, label: "LinkedIn" },
    { href: contact.social?.instagram || "#", icon: FiInstagram, label: "Instagram" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-teal-600 text-white p-2 rounded-lg font-bold">
                SB
              </div>
              <span className="font-bold text-lg text-white">SkillBridge</span>
            </div>
            <p className="text-sm">
              Plateforme reliant les apprenants avec les meilleurs centres de
              formation.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              {contact.email} &middot; {contact.phone}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/formations"
                  className="hover:text-teal-400 transition"
                >
                  Formations
                </Link>
              </li>
              <li>
                <Link to="/favoris" className="hover:text-teal-400 transition">
                  Favoris
                </Link>
              </li>
              <li>
                <Link
                  to="/reservations"
                  className="hover:text-teal-400 transition"
                >
                  Réservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/a-propos" className="hover:text-teal-400 transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#privacy" className="hover:text-teal-400 transition">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hover:text-teal-400 transition"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; 2024 SkillBridge. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm mt-4 sm:mt-0">
            <a href="#privacy" className="hover:text-teal-400 transition">
              Politique de confidentialité
            </a>
            <a href="#terms" className="hover:text-teal-400 transition">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

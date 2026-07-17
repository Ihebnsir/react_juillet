import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiLogOut, FiBook, FiHeart, FiUser, FiMoon, FiSun } from "react-icons/fi";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count: favoriteCount } = useFavorites();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isLearner = user?.role === 'apprenant' || user?.role === 'learner';
  const isCentreUser = user?.role === 'centre';
  const isAdminUser = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'fr' : i18n.language === 'fr' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsOpen(false)}
            aria-label="SkillBridge"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-brand-500/40 to-accent-500/30 blur" />
              <div className="relative bg-gradient-to-r from-brand-600 to-accent-500 text-white p-2.5 rounded-xl font-extrabold text-lg shadow-[0_10px_30px_rgba(26,184,153,0.25)]">
                SB
              </div>
            </div>
            <span className="hidden sm:inline font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-300 transition">
              SkillBridge
            </span>
          </Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/formations"
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 transition font-medium"
            >
              <FiBook size={20} className="text-current" /> {t('nav.formations')}
            </Link>

            {isAuthenticated && isLearner && (
              <>
                <Link
                  to="/favoris"
                  className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-teal-600 transition relative"
                >
                  <FiHeart size={20} className="text-current" /> {t('nav.favorites')}
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-[0_8px_22px_rgba(244,63,94,0.35)] animate-[pulse_1.6s_ease-in-out_infinite]">
                      {favoriteCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/reservations"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  {t('nav.reservations')}
                </Link>
                <Link
                  to="/messagerie"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  Messagerie
                </Link>
              </>
            )}

            {isAuthenticated && isCentreUser && (
              <>
                <Link
                  to="/centre/offres"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  Mes offres
                </Link>
                <Link
                  to="/centre/messagerie"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  Messagerie
                </Link>
              </>
            )}

            {isAuthenticated && isAdminUser && (
              <>
                <Link
                  to="/admin"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  {t('nav.admin')}
                </Link>
                <Link
                  to="/admin/support"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  Support
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name ?? 'Avatar'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-slate-200">
                      <FiUser size={16} className="text-current" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    {user?.name}
                  </span>
                </div>
                <Link
                  to="/profil"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  <FiUser size={20} className="text-current" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                >
                  <FiLogOut size={20} className="text-current" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="btn-outline inline-flex items-center justify-center px-5 py-2 rounded-xl hover:-translate-y-0.5 border-brand-200"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center justify-center px-5 py-2 rounded-xl hover:-translate-y-0.5"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <button onClick={() => toggleLanguage()} className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:text-slate-200">
              {i18n.language.toUpperCase()}
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-gray-300 p-2 text-gray-700 dark:text-slate-200">
              {theme === 'dark' ? <FiSun size={18} className="text-current" /> : <FiMoon size={18} className="text-current" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} className="text-current" /> : <FiMenu size={24} className="text-current" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t pt-4 space-y-3">
            <Link
              to="/formations"
              className="block text-gray-700 hover:text-teal-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Formations
            </Link>
            {isAuthenticated && isLearner && (
              <>
                <Link
                  to="/favoris"
                  className="block text-gray-700 hover:text-teal-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Favoris ({favoriteCount})
                </Link>
                <Link
                  to="/reservations"
                  className="block text-gray-700 hover:text-teal-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Mes réservations
                </Link>
              </>
            )}
            {isAuthenticated && isCentreUser && (
              <Link
                to="/centre/offres"
                className="block text-gray-700 hover:text-teal-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Mes offres
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'fr' : i18n.language === 'fr' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-teal-600 text-white p-2 rounded-lg font-bold text-xl">
              SB
            </div>
            <span className="hidden sm:inline font-bold text-lg text-gray-800 dark:text-slate-100">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/formations"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
            >
              <FiBook size={20} /> {t('nav.formations')}
            </Link>

            {isAuthenticated && user?.role === "learner" && (
              <>
                <Link
                  to="/favoris"
                  className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-teal-600 transition relative"
                >
                  <FiHeart size={20} /> {t('nav.favorites')}
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
              </>
            )}

            {isAuthenticated && user?.role === "center" && (
              <Link
                to="/centre/offres"
                className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
              >
                Mes offres
              </Link>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    {user?.name}
                  </span>
                </div>
                <Link
                  to="/profil"
                  className="text-gray-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  <FiUser size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                >
                  <FiLogOut size={20} />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-teal-600 hover:text-teal-700 transition"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <button onClick={() => toggleLanguage()} className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:text-slate-200">
              {i18n.language.toUpperCase()}
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-gray-300 p-2 text-gray-700 dark:text-slate-200">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
            {isAuthenticated && user?.role === "learner" && (
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
            {isAuthenticated && user?.role === "center" && (
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import AvatarUpload from "../components/UI/AvatarUpload";

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user?.profile || {});
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile({ ...formData, avatar });
    setIsEditing(false);
    alert("Profil mis à jour avec succès!");
  };

  const isCenter = user?.role === "centre";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 h-32 flex items-end p-6">
              <div className="flex items-end gap-4">
              <img
                src={avatar || user?.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <div className="text-white mb-2">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-teal-100">
                  {user?.role === "learner"
                    ? "Apprenant"
                    : user?.role === "centre"
                    ? "Centre de formation"
                    : "Administrateur"}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Account Info */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Informations du compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Nom</label>
                  <input
                    type="text"
                    value={user?.name}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t('profile.title')}</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 transition font-medium"
                >
                  {isEditing ? <FiX size={20} /> : <FiEdit size={20} />}
                  {isEditing ? t('common.cancel') : t('profile.edit')}
                </button>
              </div>

              <div className="space-y-4">
                {isCenter ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                        {t('profile.description')}
                      </label>
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                        {t('profile.city')}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                        {t('profile.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                        {t('profile.website')}
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Statut de vérification:{" "}
                        {formData.verified ? (
                          <span className="text-green-600">✓ Vérifié</span>
                        ) : (
                          <span className="text-yellow-600">
                            ⏳ En attente de vérification
                          </span>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                        {t('profile.cv')}
                      </label>
                      <textarea
                        name="cv"
                        value={formData.cv || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                        {t('profile.portfolio')}
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Photo de profil</label>
                  {isEditing ? (
                    <AvatarUpload value={avatar} onChange={setAvatar} />
                  ) : null}
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-6 w-full px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                >
                  <FiCheck size={20} /> {t('profile.save')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

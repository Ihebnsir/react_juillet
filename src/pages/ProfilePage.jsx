import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import AvatarUpload from "../components/UI/AvatarUpload";

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState(user?.nom || user?.name || "");
  const [formData, setFormData] = useState(user?.profile || {});
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setNom(user?.nom || user?.name || "");
    setFormData(user?.profile || {});
    setAvatar(user?.avatar || "");
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNom(user?.nom || user?.name || "");
    setFormData(user?.profile || {});
    setAvatar(user?.avatar || "");
  };

  const handleSave = () => {
    setSaving(true);
    try {
      updateUser({
        ...user,
        nom,
        name: nom,
        profile: { ...(user?.profile || {}), ...formData },
        avatar,
      });
      setIsEditing(false);
      setMessage({ type: "success", text: "Profil mis à jour avec succès." });
    } catch (error) {
      setMessage({ type: "error", text: "La mise à jour a échoué." });
    } finally {
      setSaving(false);
    }
  };

  const isCenter = user?.role === "centre";
  const roleLabels = {
    apprenant: t("roles.apprenant"),
    centre: t("roles.centre"),
    admin: t("roles.admin"),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 h-32 flex items-end p-6">
              <div className="flex items-end gap-4">
              <img
                src={avatar || user?.avatar}
                alt={nom || user?.name || "Profil"}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <div className="text-white mb-2">
                <h1 className="text-2xl font-bold">{nom || user?.name || "Utilisateur"}</h1>
                <p className="text-teal-100">{roleLabels[user?.role] || user?.role}</p>
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
                  <label className="block text-sm text-gray-600">{t('profile.email')}</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                  <p className="mt-2 text-xs text-gray-500">{t('profile.emailNote')}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">{t('profile.name')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                      {nom || "Aucun nom renseigné"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="border-t pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t('profile.title')}</h2>
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setMessage(null);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-teal-600 px-4 py-2 font-medium text-teal-600 transition hover:bg-teal-50"
                  >
                    <FiEdit size={20} />
                    {t('profile.edit')}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
                    >
                      <FiCheck size={20} />
                      {saving ? t('common.loading') : t('profile.save')}
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setIsEditing(false);
                        setMessage(null);
                      }}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <FiX size={20} />
                      {t('common.cancel')}
                    </button>
                  </div>
                )}
              </div>

              {message ? (
                <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                  {message.text}
                </div>
              ) : null}

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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

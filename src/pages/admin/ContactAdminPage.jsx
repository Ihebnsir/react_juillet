import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContactInfo, updateContactInfo } from '../../services/contactService';
import { FiSave, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\+\-\(\)]+$/;

const initialErrors = {
  phone: '',
  email: '',
  address: '',
  description: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
};

export const ContactAdminPage = () => {
  const [contact, setContact] = useState(() => getContactInfo());
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message }
  const [errors, setErrors] = useState({ ...initialErrors });

  useEffect(() => {
    setContact(getContactInfo());
  }, []);

  const validate = () => {
    const newErrors = { ...initialErrors };
    let valid = true;

    if (!contact.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis.';
      valid = false;
    } else if (!PHONE_REGEX.test(contact.phone)) {
      newErrors.phone = 'Format de téléphone invalide.';
      valid = false;
    }

    if (!contact.email.trim()) {
      newErrors.email = 'L\'adresse email est requise.';
      valid = false;
    } else if (!EMAIL_REGEX.test(contact.email)) {
      newErrors.email = 'Format d\'email invalide.';
      valid = false;
    }

    if (!contact.address.trim()) {
      newErrors.address = 'L\'adresse est requise.';
      valid = false;
    }

    if (!contact.description.trim()) {
      newErrors.description = 'La description est requise.';
      valid = false;
    }

    // Social links – optional but must be a valid URL if provided
    ['facebook', 'instagram', 'linkedin', 'twitter'].forEach((key) => {
      const val = (contact.social?.[key] || '').trim();
      if (val && !val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('#')) {
        newErrors[key] = 'Doit commencer par http://, https:// ou #.';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleFieldChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSocialChange = (key, value) => {
    setContact((prev) => ({
      ...prev,
      social: { ...prev.social, [key]: value },
    }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setFeedback(null);

    try {
      // Simulate saving delay for UX feedback
      setTimeout(() => {
        updateContactInfo(contact);
        setSaving(false);
        setFeedback({ type: 'success', message: 'Informations de contact mises à jour avec succès.' });
        setTimeout(() => setFeedback(null), 4000);
      }, 400);
    } catch {
      setSaving(false);
      setFeedback({ type: 'error', message: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    }
  };

  const handleReset = () => {
    setContact(getContactInfo());
    setErrors({ ...initialErrors });
    setFeedback(null);
  };

  const fieldClasses = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
  const labelClasses = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300';
  const errorClasses = 'mt-1 text-xs text-rose-500';
  const cardClasses = 'rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-brand-100">Administration</p>
          <h1 className="text-2xl font-display font-bold md:text-3xl">Paramètres de contact</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-100">
            Gérez les informations de contact affichées sur la page Contact et dans le pied de page.
          </p>
        </div>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-medium shadow-sm ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
          <span>{feedback.message}</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cardClasses}>
          <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">Coordonnées</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {/* Phone */}
            <div>
              <label className={labelClasses}>Numéro de téléphone</label>
              <input
                type="text"
                value={contact.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={fieldClasses}
                placeholder="+216 71 000 000"
              />
              {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={labelClasses}>Adresse email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={fieldClasses}
                placeholder="contact@skillbridge.tn"
              />
              {errors.email && <p className={errorClasses}>{errors.email}</p>}
            </div>

            {/* Address - full width */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Adresse physique</label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className={fieldClasses}
                placeholder="Tunis, Tunisie"
              />
              {errors.address && <p className={errorClasses}>{errors.address}</p>}
            </div>

            {/* Description - full width */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Description / Message de contact</label>
              <textarea
                value={contact.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                rows={4}
                className={`${fieldClasses} resize-y`}
                placeholder="Décrivez votre message de contact..."
              />
              {errors.description && <p className={errorClasses}>{errors.description}</p>}
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={cardClasses}
        >
          <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">Réseaux sociaux</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/skillbridge' },
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/skillbridge' },
              { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/skillbridge' },
              { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/skillbridge' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={labelClasses}>{label}</label>
                <input
                  type="text"
                  value={contact.social?.[key] || ''}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                  className={fieldClasses}
                  placeholder={placeholder}
                />
                {errors[key] && <p className={errorClasses}>{errors[key]}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <FiRefreshCw className="animate-spin" size={16} />
                Sauvegarde...
              </>
            ) : (
              <>
                <FiSave size={16} />
                Enregistrer les modifications
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline"
          >
            Réinitialiser le formulaire
          </button>
        </motion.div>
      </form>
    </div>
  );
};


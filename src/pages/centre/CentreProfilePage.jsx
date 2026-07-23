import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiPhone, FiMail, FiMapPin, FiGlobe, FiAward, FiCamera, FiEdit2, FiSave, FiX, FiLinkedin, FiFacebook, FiTwitter, FiImage, FiUpload, FiTrash2 } from 'react-icons/fi';

const initialProfile = {
  name: 'Tech Academy Tunis',
  type: 'Centre de formation professionnelle',
  description: 'Nous accompagnons les apprenants et les entreprises dans la montée en compétence sur les technologies, le design et les compétences managériales. Fort de 8 ans d\'expérience, nous proposons des formations certifiantes adaptées aux besoins du marché.',
  phone: '+216 71 000 000',
  email: 'contact@techacademy.tn',
  address: '12 Avenue de la République, Tunis',
  website: 'https://techacademy.tn',
  linkedin: 'linkedin.com/company/tech-academy',
  facebook: 'facebook.com/techacademy',
  twitter: '@techacademy',
  verified: true,
  certifications: ['Certification ISO 9001', 'Qualiopi', 'Label Excellence'],
  yearsExperience: 8,
  gallery: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600',
  ],
};

const checklistItems = [
  { id: 'logo', label: 'Logo', done: true },
  { id: 'address', label: 'Adresse', done: true },
  { id: 'phone', label: 'Téléphone', done: true },
  { id: 'socials', label: 'Réseaux sociaux', done: false },
  { id: 'certifications', label: 'Certifications', done: true },
];

export const CentreProfilePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialProfile });
  const [logoPreview, setLogoPreview] = useState('https://api.dicebear.com/7.x/icons/svg?seed=TechAcademy');
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleStartEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setMessage(null);
  };

  const handleSaveEdit = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
    setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target.result);
      setMessage({ type: 'success', text: 'Logo mis à jour.' });
      setTimeout(() => setMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview('https://api.dicebear.com/7.x/icons/svg?seed=TechAcademy');
    setMessage({ type: 'info', text: 'Logo réinitialisé.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditForm((prev) => ({
        ...prev,
        gallery: [...prev.gallery, event.target.result],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveGalleryImage = (index) => {
    setEditForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const completeness = Math.round(
    (checklistItems.filter((item) => item.done).length / checklistItems.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Message toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                : message.type === 'info'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero / Cover Section */}
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-700">
        {/* Cover Image */}
        <div className="relative h-52 md:h-64 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-400">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Edit button on cover */}
          <div className="absolute right-4 top-4">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur transition hover:bg-white dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <FiEdit2 size={16} />
                Modifier le profil
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
                >
                  <FiSave size={16} />
                  Enregistrer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-white dark:bg-slate-800/90 dark:text-slate-200"
                >
                  <FiX size={16} />
                  Annuler
                </motion.button>
              </div>
            )}
          </div>

          {/* Logo + Name Overlay */}
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="group relative">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                src={logoPreview}
                alt="Logo du centre"
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-xl dark:border-slate-800"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-white p-2 text-slate-700 shadow-lg transition hover:bg-slate-100"
                  >
                    <FiCamera size={18} />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
            <div className="mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="rounded-lg border border-white/30 bg-white/80 px-3 py-1.5 text-xl font-bold text-white backdrop-blur outline-none focus:ring-2 focus:ring-brand-400 dark:bg-slate-900/80 dark:text-slate-100"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">{profile.name}</h1>
              )}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-medium text-white/90 drop-shadow-md">
                  {profile.type}
                </span>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                    <FiCheck size={12} /> Vérifié
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for logo overlap */}
        <div className="h-14" />

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60">
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">À propos</h3>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {profile.description}
                  </p>
                )}
              </div>

              {/* Certifications */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60">
                <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <FiAward size={16} className="text-amber-500" />
                  Certifications & expérience
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {profile.certifications.map((cert, index) => (
                    <motion.div
                      key={cert}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
                    >
                      <FiAward size={14} className="text-amber-500 shrink-0" />
                      {cert}
                    </motion.div>
                  ))}
                  <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                    <FiCheck size={14} className="text-emerald-500 shrink-0" />
                    {profile.yearsExperience} ans d'expérience
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                    <FiImage size={16} /> Galerie photos
                  </h3>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900/20"
                    >
                      <FiUpload size={14} /> Ajouter
                    </button>
                  )}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(isEditing ? editForm.gallery : profile.gallery).map((img, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl">
                      <img
                        src={img}
                        alt={`Galerie ${index + 1}`}
                        className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="rounded-full bg-rose-500 p-2 text-white shadow-lg transition hover:bg-rose-600"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-600 dark:text-slate-400"
                    >
                      <FiImage size={24} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Completeness */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Complétude du profil</h3>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{completeness}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          item.done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.done ? <FiCheck size={12} /> : <span className="text-[10px]">□</span>}
                      </span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60"
              >
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <FiPhone size={16} /> Contact
                </h3>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {[
                    { icon: FiPhone, value: profile.phone, field: 'phone' },
                    { icon: FiMail, value: profile.email, field: 'email' },
                    { icon: FiMapPin, value: profile.address, field: 'address' },
                    { icon: FiGlobe, value: profile.website, field: 'website' },
                    { icon: FiLinkedin, value: profile.linkedin, field: 'linkedin' },
                    { icon: FiFacebook, value: profile.facebook, field: 'facebook' },
                    { icon: FiTwitter, value: profile.twitter, field: 'twitter' },
                  ].map(({ icon: Icon, value, field }) => (
                    <div key={field} className="flex items-center gap-2">
                      <Icon size={14} className="shrink-0 text-slate-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm[field] || ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      ) : (
                        <span className="truncate">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreProfilePage;


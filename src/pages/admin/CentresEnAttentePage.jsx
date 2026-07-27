import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiX, FiFilter, FiEye, FiCheckCircle, FiXCircle,
  FiPause, FiFileText, FiMail, FiClock, FiChevronDown,
  FiChevronUp, FiChevronLeft, FiChevronRight, FiRefreshCw,
  FiDownload, FiStar, FiMapPin, FiPhone, FiGlobe,
  FiBookOpen, FiUsers, FiCalendar, FiShield,
  FiUser, FiEdit2, FiTrash2, FiPlus,
  FiInfo, FiList, FiGrid, FiArrowUp, FiArrowDown,
} from 'react-icons/fi';
import { mockCentres as rawCentres } from '../../data/mockCentres';
import { useNotifications } from '../../context/NotificationContext';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LABELS_STATUT = {
  verifie: 'Vérifié',
  en_attente: 'En attente',
  rejete: 'Refusé',
  suspendu: 'Suspendu',
  non_soumis: 'Non soumis',
  documents_recus: 'Documents reçus',
};

const BADGE_COLORS = {
  verifie: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  en_attente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  rejete: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  suspendu: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  non_soumis: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  documents_recus: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const STATUS_ICON = {
  verifie: FiCheckCircle,
  en_attente: FiClock,
  rejete: FiXCircle,
  suspendu: FiPause,
  non_soumis: FiInfo,
  documents_recus: FiFileText,
};

const ITEMS_PER_PAGE = 6;

const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calculerProgression = (checklist) => {
  if (!checklist) return 0;
  const items = Object.values(checklist);
  return Math.round((items.filter(Boolean).length / items.length) * 100);
};

const genererId = () => `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/* ------------------------------------------------------------------ */
/*  Sous-composants                                                    */
/* ------------------------------------------------------------------ */

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">{label}</p>
        <p className="mt-1.5 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">{sub}</p>}
      </div>
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-start gap-4">
      <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ search, onReset }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <FiSearch size={48} className="mb-4 text-gray-300 dark:text-slate-600" />
    <h3 className="text-lg font-semibold text-gray-600 dark:text-slate-400">
      {search ? 'Aucun centre trouvé' : 'Aucun centre à afficher'}
    </h3>
    <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
      {search
        ? 'Essayez de modifier vos critères de recherche ou filtres.'
        : 'La liste se mettra à jour lorsque des centres seront ajoutés.'}
    </p>
    {search && (
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl bg-brand-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
      >
        Réinitialiser les filtres
      </button>
    )}
  </div>
);

const ContactModal = ({ open, centre, onClose }) => {
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => {
    if (open) {
      setSujet('');
      setMessage('');
      setEnvoye(false);
    }
  }, [open]);

  if (!open) return null;

  const handleEnvoyer = () => {
    if (!sujet.trim() || !message.trim()) return;
    setEnvoye(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
      >
        {envoye ? (
          <div className="flex flex-col items-center py-8">
            <FiCheckCircle size={48} className="mb-3 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Message envoyé</h3>
            <p className="mt-1 text-sm text-slate-400">Un email a été envoyé à {centre?.email}</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Contacter {centre?.name}</h3>
              <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white">
                <FiX size={18} />
              </button>
            </div>
            <p className="mb-4 text-xs text-slate-400">Email : {centre?.email}</p>
            <div className="space-y-3">
              <input
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                placeholder="Sujet du message"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500">
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleEnvoyer}
                  disabled={!sujet.trim() || !message.trim()}
                  className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const DocumentPreview = ({ doc, onClose }) => {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{doc.name}</h3>
            <p className="text-sm text-slate-400">Type : {doc.type} · Ajouté le {formatDate(doc.date)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white">
            <FiX size={18} />
          </button>
        </div>
        <div className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 p-12">
          <div className="text-center">
            <FiFileText size={64} className="mx-auto mb-3 text-slate-500" />
            <p className="text-sm text-slate-400">Prévisualisation simulée</p>
            <p className="text-xs text-slate-500">{doc.name}</p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
              onClick={() => alert(`Téléchargement simulé de : ${doc.name}`)}
            >
              Télécharger
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/** Badge de statut avec icône */
export const BadgeStatut = ({ statut }) => {
  const Icon = STATUS_ICON[statut] || FiInfo;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_COLORS[statut] || 'bg-gray-100 text-gray-600'}`}>
      <Icon size={12} />
      {LABELS_STATUT[statut] || statut}
    </span>
  );
};

/** Barre de progression animée */
export const ProgressBar = ({ value }) => (
  <div className="flex items-center gap-2">
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
      />
    </div>
    <span className="w-8 text-right text-xs font-medium text-gray-500 dark:text-slate-400">{value}%</span>
  </div>
);

const ActionBtn = ({ icon: Icon, label, onClick, color }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition dark:text-slate-400 ${color}`}
  >
    <Icon size={14} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const CentreCard = ({ centre, onView, onApprove, onReject, onSuspend, onDocuments, onContact, onHistory }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-brand-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-700"
  >
    {/* En-tête */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <img
          src={centre.logo}
          alt=""
          className="h-12 w-12 rounded-xl bg-gray-100 object-contain p-1 dark:bg-slate-700"
        />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">{centre.name}</h3>
          <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
            <FiMapPin size={12} /> {centre.ville}
          </p>
        </div>
      </div>
      <BadgeStatut statut={centre.statutVerification} />
    </div>

    {/* Infos */}
    <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-slate-400">
      <p className="flex items-center gap-1.5"><FiUser size={13} /> {centre.responsable || '—'}</p>
      <p className="flex items-center gap-1.5 truncate"><FiMail size={13} /> {centre.email}</p>
      <p className="flex items-center gap-1.5"><FiPhone size={13} /> {centre.telephone || '—'}</p>
      <p className="flex items-center gap-1.5"><FiCalendar size={13} /> Inscription : {formatDate(centre.dateDemande)}</p>
    </div>

    {/* Stats */}
    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
      <span className="flex items-center gap-1"><FiBookOpen size={13} /> {centre.formationsPubliees}</span>
      <span className="flex items-center gap-1"><FiUsers size={13} /> {centre.nombreEtudiants}</span>
    </div>

    {/* Progression */}
    <div className="mt-3">
      <ProgressBar value={centre.progressionProfil} />
    </div>

    {/* Actions */}
    <div className="mt-4 flex flex-wrap gap-1.5">
      <ActionBtn icon={FiEye} label="Voir" onClick={onView} color="hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20" />
      {centre.statutVerification !== 'verifie' && centre.statutVerification !== 'rejete' && (
        <ActionBtn icon={FiCheckCircle} label="Approuver" onClick={onApprove} color="hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20" />
      )}
      {centre.statutVerification !== 'rejete' && centre.statutVerification !== 'suspendu' && (
        <ActionBtn icon={FiXCircle} label="Refuser" onClick={onReject} color="hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20" />
      )}
      {centre.statutVerification !== 'suspendu' && (
        <ActionBtn icon={FiPause} label="Suspendre" onClick={onSuspend} color="hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-700" />
      )}
      <ActionBtn icon={FiFileText} label="Docs" onClick={onDocuments} color="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20" />
      <ActionBtn icon={FiMail} label="Contact" onClick={onContact} color="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20" />
      <ActionBtn icon={FiClock} label="Hist." onClick={onHistory} color="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20" />
    </div>
  </motion.div>
);

const ActionsPopover = ({ onView, onApprove, onReject, onSuspend, onDocuments, onContact, onHistory }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const run = (fn) => { fn(); setOpen(false); };

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-slate-700">
        <FiChevronDown size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl">
          {[
            { label: '👁 Voir', onClick: onView },
            { label: '✅ Approuver', onClick: onApprove },
            { label: '❌ Refuser', onClick: onReject },
            { label: '⏸ Suspendre', onClick: onSuspend },
            { label: '📄 Documents', onClick: onDocuments },
            { label: '✉ Contacter', onClick: onContact },
            { label: '📜 Historique', onClick: onHistory },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => run(item.onClick)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon size={15} className="mt-0.5 shrink-0 text-gray-400" />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value || '—'}</p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Drawer de détails                                                  */
/* ------------------------------------------------------------------ */

const CentreDrawer = ({
  centre, tab, onTabChange, onClose,
  noteText, onNoteTextChange, editingNote, onEditNote, onCancelEdit,
  onAjouterNote, onModifierNote, onSupprimerNote, noteError,
  onApprove, onReject, onSuspend, onContact,
}) => {
  if (!centre) return null;

  const tabs = [
    { id: 'info', label: 'Infos', icon: FiInfo },
    { id: 'documents', label: 'Documents', icon: FiFileText },
    { id: 'history', label: 'Historique', icon: FiClock },
    { id: 'notes', label: 'Notes', icon: FiEdit2 },
    { id: 'actions', label: 'Actions', icon: FiShield },
  ];

  const checklistItems = [
    { key: 'logo', label: 'Logo' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'description', label: 'Description' },
    { key: 'documents', label: 'Documents' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'reseauxSociaux', label: 'Réseaux sociaux' },
  ];

  const progress = centre.progressionProfil || calculerProgression(centre.checklist);

  const handleNoteSubmit = () => {
    if (editingNote) {
      onModifierNote(centre.id, editingNote.id);
    } else {
      onAjouterNote(centre.id);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src={centre.logo} alt="" className="h-12 w-12 rounded-xl bg-gray-100 object-contain dark:bg-slate-700" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">{centre.ville} · {centre.domaine}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-slate-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 px-4 dark:border-slate-700">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => onTabChange(tabItem.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition ${
                tab === tabItem.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <tabItem.icon size={14} />
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'info' && (
            <div className="space-y-6">
              {centre.cover && (
                <img src={centre.cover} alt="" className="h-40 w-full rounded-xl object-cover" />
              )}
              <div>
                <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-slate-200">Présentation</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400">{centre.description || 'Aucune description fournie.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={FiUser} label="Responsable" value={centre.responsable} />
                <InfoItem icon={FiMapPin} label="Adresse" value={centre.adresse} />
                <InfoItem icon={FiPhone} label="Téléphone" value={centre.telephone} />
                <InfoItem icon={FiMail} label="Email" value={centre.email} />
                <InfoItem icon={FiGlobe} label="Site web" value={centre.siteWeb || 'Non renseigné'} />
                <InfoItem icon={FiCalendar} label="Inscription" value={formatDate(centre.dateDemande)} />
              </div>
              {centre.coordonneesGPS && (
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-slate-200">Coordonnées GPS</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Lat : {centre.coordonneesGPS.lat} · Lng : {centre.coordonneesGPS.lng}
                  </p>
                </div>
              )}
              {centre.reseauxSociaux && Object.keys(centre.reseauxSociaux).length > 0 && (
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-slate-200">Réseaux sociaux</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(centre.reseauxSociaux).map(([key, url]) => (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-700 dark:text-slate-300">
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-brand-50 p-3 text-center dark:bg-brand-900/20">
                  <p className="text-2xl font-bold text-brand-600">{centre.formationsPubliees}</p>
                  <p className="text-xs text-gray-500">Formations</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                  <p className="text-2xl font-bold text-emerald-600">{centre.nombreEtudiants}</p>
                  <p className="text-xs text-gray-500">Étudiants</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-900/20">
                  <p className="text-2xl font-bold text-amber-600">{centre.noteMoyenne}</p>
                  <p className="text-xs text-gray-500">Note</p>
                </div>
              </div>
              {centre.gallery && centre.gallery.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-200">Galerie</h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {centre.gallery.map((url, i) => (
                      <img key={i} src={url} alt="" className="h-24 w-36 shrink-0 rounded-lg object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-200">Checklist de validation</h4>
                <ProgressBar value={progress} />
                <p className="mt-1 text-xs text-gray-400">Profil complété</p>
                <div className="mt-3 grid grid-cols-2 gap-1">
                  {checklistItems.map((item) => {
                    const done = centre.checklist?.[item.key];
                    return (
                      <div key={item.key} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                        <span className={done ? 'text-emerald-500' : 'text-gray-300'}>{done ? '☑' : '☐'}</span>
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'documents' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Documents administratifs</h4>
              {(!centre.documents || centre.documents.length === 0) ? (
                <p className="text-sm text-gray-400">Aucun document fourni.</p>
              ) : (
                centre.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <FiFileText size={20} className="text-brand-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.type} · {formatDate(doc.date)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Téléchargement simulé : ${doc.name}`)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:text-brand-400"
                    >
                      Télécharger
                    </button>
                  </div>
                ))
              )}
              {centre.certifications && centre.certifications.length > 0 && (
                <>
                  <h4 className="mt-6 text-sm font-semibold text-gray-700 dark:text-slate-200">Certifications</h4>
                  {centre.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-slate-700">
                      <FiStar size={18} className="text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.nom}</p>
                        <p className="text-xs text-gray-400">{cert.organisme} · {formatDate(cert.dateObtention)}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Historique du centre</h4>
              {(!centre.historique || centre.historique.length === 0) ? (
                <p className="text-sm text-gray-400">Aucun historique disponible.</p>
              ) : (
                <div className="relative pl-6 before:absolute before:left-2 before:top-1 before:h-[calc(100%-8px)] before:w-0.5 before:bg-gray-200 dark:before:bg-slate-700">
                  {centre.historique.map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative mb-4"
                    >
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-brand-500 bg-white dark:bg-slate-900" />
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{entry.action}</p>
                      <p className="text-xs text-gray-400">{entry.details}</p>
                      <p className="text-[10px] text-gray-300 dark:text-slate-600">{formatDate(entry.date)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Notes internes</h4>
              <p className="text-xs text-gray-400">Ces notes sont visibles uniquement par les administrateurs.</p>
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => { onNoteTextChange(e.target.value); }}
                  placeholder="Ajouter une note interne..."
                  rows={2}
                  className={`w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-brand-500 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 ${noteError ? 'border-rose-400' : 'border-gray-200 dark:border-slate-700'}`}
                />
                {noteError && <p className="text-xs text-rose-400">{noteError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={handleNoteSubmit} className="flex items-center gap-1 rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600">
                    <FiPlus size={13} /> {editingNote ? 'Modifier' : 'Ajouter'}
                  </button>
                  {editingNote && (
                    <button type="button" onClick={onCancelEdit} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 dark:border-slate-700 dark:text-slate-300">
                      Annuler
                    </button>
                  )}
                </div>
              </div>
              {(!centre.notesInternes || centre.notesInternes.length === 0) ? (
                <p className="py-4 text-center text-sm text-gray-400">Aucune note interne pour ce centre.</p>
              ) : (
                <div className="space-y-3">
                  {centre.notesInternes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{note.contenu}</p>
                          <p className="mt-1 text-[10px] text-gray-400">{note.auteur} · {formatDate(note.date)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => onEditNote(note)} className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-slate-700">
                            <FiEdit2 size={13} />
                          </button>
                          <button type="button" onClick={() => onSupprimerNote(centre.id, note.id)} className="rounded-lg p-1 text-gray-400 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/20">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'actions' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Actions rapides</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '✅ Approuver', onClick: () => onApprove(centre), color: 'bg-emerald-500 hover:bg-emerald-600' },
                  { label: '❌ Refuser', onClick: () => onReject(centre), color: 'bg-rose-500 hover:bg-rose-600' },
                  { label: '⏸ Suspendre', onClick: () => onSuspend(centre), color: 'bg-slate-500 hover:bg-slate-600' },
                  { label: '✉ Contacter', onClick: () => onContact(centre), color: 'bg-blue-500 hover:bg-blue-600' },
                ].map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={`rounded-xl px-4 py-3 text-sm font-medium text-white transition ${action.color}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-slate-200">Workflow</h4>
                <div className="relative">
                  {[
                    { label: 'Inscrit', done: !!centre.dateDemande },
                    { label: 'Documents reçus', done: centre.documents && centre.documents.length > 0 },
                    { label: 'En vérification', done: centre.statutVerification !== 'non_soumis' && centre.statutVerification !== 'documents_recus' },
                    {
                      label: centre.statutVerification === 'verifie' ? 'Approuvé ✓' : centre.statutVerification === 'rejete' ? 'Refusé ✗' : centre.statutVerification === 'suspendu' ? 'Suspendu ⏸' : 'En attente...',
                      done: centre.statutVerification === 'verifie' || centre.statutVerification === 'rejete' || centre.statutVerification === 'suspendu',
                    },
                  ].map((step, i) => (
                    <div key={step.label} className="mb-4 flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${step.done ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>{step.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export const CentresEnAttentePage = () => {
  const { addNotification } = useNotifications();

  const [centres, setCentres] = useState(() =>
    rawCentres.map((c) => ({
      ...c,
      progressionProfil: c.progressionProfil || calculerProgression(c.checklist),
    }))
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    statut: '', ville: '', domaine: '', dateDebut: '', dateFin: '',
    verifiesSeulement: false, enAttenteSeulement: false,
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [drawerTab, setDrawerTab] = useState('info');
  const [confirmAction, setConfirmAction] = useState(null);
  const [contactCentre, setContactCentre] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteError, setNoteError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const villes = useMemo(() => [...new Set(centres.map((c) => c.ville))].sort(), [centres]);
  const domaines = useMemo(() => [...new Set(centres.map((c) => c.domaine).filter(Boolean))].sort(), [centres]);

  const filtered = useMemo(() => {
    let result = [...centres];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ville.toLowerCase().includes(q) ||
          (c.responsable || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.telephone || '').toLowerCase().includes(q)
      );
    }
    if (filters.statut) result = result.filter((c) => c.statutVerification === filters.statut);
    if (filters.ville) result = result.filter((c) => c.ville === filters.ville);
    if (filters.domaine) result = result.filter((c) => c.domaine === filters.domaine);
    if (filters.dateDebut) result = result.filter((c) => c.dateDemande && c.dateDemande >= filters.dateDebut);
    if (filters.dateFin) result = result.filter((c) => c.dateDemande && c.dateDemande <= filters.dateFin);
    if (filters.verifiesSeulement) result = result.filter((c) => c.statutVerification === 'verifie');
    if (filters.enAttenteSeulement) result = result.filter((c) => c.statutVerification === 'en_attente');

    result.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'name': va = a.name; vb = b.name; break;
        case 'ville': va = a.ville; vb = b.ville; break;
        case 'date': va = a.dateDemande || ''; vb = b.dateDemande || ''; break;
        case 'progress': va = a.progressionProfil; vb = b.progressionProfil; break;
        default: va = a.name; vb = b.name;
      }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return result;
  }, [centres, search, filters, sortBy, sortDir]);

  const stats = useMemo(() => {
    const total = centres.length;
    const enAttente = centres.filter((c) => c.statutVerification === 'en_attente').length;
    const verifies = centres.filter((c) => c.statutVerification === 'verifie').length;
    const refuses = centres.filter((c) => c.statutVerification === 'rejete').length;
    const suspendus = centres.filter((c) => c.statutVerification === 'suspendu').length;
    const valides = centres.filter((c) => c.dateDemande && c.dateValidation);
    const tempsMoyen = valides.length > 0
      ? Math.round(valides.reduce((acc, c) => {
          const d1 = new Date(c.dateDemande);
          const d2 = new Date(c.dateValidation);
          return acc + Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        }, 0) / valides.length)
      : 0;
    return { total, enAttente, verifies, refuses, suspendus, tempsMoyen };
  }, [centres]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const changerStatut = useCallback((centreId, nouveauStatut, motif) => {
    setCentres((prev) =>
      prev.map((c) => {
        if (c.id !== centreId) return c;
        const actionLabel = nouveauStatut === 'verifie' ? 'Approbation' : nouveauStatut === 'rejete' ? 'Refus' : nouveauStatut === 'suspendu' ? 'Suspension' : 'Mise à jour';
        const entry = {
          date: new Date().toISOString().split('T')[0],
          action: actionLabel,
          details: motif || `Statut changé vers "${LABELS_STATUT[nouveauStatut]}"`,
        };
        return {
          ...c,
          statutVerification: nouveauStatut,
          dateValidation: nouveauStatut === 'verifie' ? new Date().toISOString().split('T')[0] : c.dateValidation,
          motifRejet: nouveauStatut === 'rejete' ? (motif || c.motifRejet) : nouveauStatut === 'verifie' ? null : c.motifRejet,
          historique: [entry, ...(c.historique || [])],
        };
      })
    );
    const centre = centres.find((c) => c.id === centreId);
    addNotification({
      role: 'admin',
      userId: null,
      title: `Centre ${nouveauStatut === 'verifie' ? 'approuvé' : nouveauStatut === 'rejete' ? 'refusé' : nouveauStatut === 'suspendu' ? 'suspendu' : 'mis à jour'}`,
      message: `Le centre "${centre?.name}" a été ${nouveauStatut === 'verifie' ? 'approuvé' : nouveauStatut === 'rejete' ? 'refusé' : nouveauStatut === 'suspendu' ? 'suspendu' : 'mis à jour'}.`,
      category: 'centres',
      kind: 'action',
    });
  }, [centres, addNotification]);

  const ajouterNote = (centreId) => {
    if (!noteText.trim()) { setNoteError('La note ne peut pas être vide'); return; }
    setCentres((prev) => prev.map((c) =>
      c.id === centreId
        ? { ...c, notesInternes: [{ id: genererId(), date: new Date().toISOString().split('T')[0], auteur: 'Admin', contenu: noteText.trim() }, ...(c.notesInternes || [])] }
        : c
    ));
    setNoteText(''); setNoteError('');
  };

  const modifierNote = (centreId, noteId) => {
    if (!noteText.trim()) return;
    setCentres((prev) => prev.map((c) =>
      c.id === centreId
        ? { ...c, notesInternes: (c.notesInternes || []).map((n) => n.id === noteId ? { ...n, contenu: noteText.trim(), date: new Date().toISOString().split('T')[0] } : n) }
        : c
    ));
    setEditingNote(null); setNoteText('');
  };

  const supprimerNote = (centreId, noteId) => {
    setCentres((prev) => prev.map((c) =>
      c.id === centreId ? { ...c, notesInternes: (c.notesInternes || []).filter((n) => n.id !== noteId) } : c
    ));
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ statut: '', ville: '', domaine: '', dateDebut: '', dateFin: '', verifiesSeulement: false, enAttenteSeulement: false });
    setPage(1);
  };

  const exporterCSV = () => {
    const headers = ['Nom', 'Ville', 'Responsable', 'Email', 'Téléphone', 'Statut', 'Date inscription'];
    const rows = centres.map((c) => [c.name, c.ville, c.responsable || '', c.email || '', c.telephone || '', LABELS_STATUT[c.statutVerification], c.dateDemande || '']);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `centres-skillbridge-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    addNotification({ role: 'admin', userId: null, title: 'Export CSV', message: 'Le fichier CSV des centres a été généré.', category: 'system', kind: 'export' });
  };

  const openDrawer = (centre) => { setSelectedCentre(centre); setDrawerTab('info'); };
  const closeDrawer = () => { setSelectedCentre(null); setEditingNote(null); setNoteText(''); setNoteError(''); };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Titre + Boutons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des centres</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            {filtered.length} centre{filtered.length !== 1 ? 's' : ''} sur {centres.length} au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCentres([...rawCentres.map((c) => ({ ...c, progressionProfil: c.progressionProfil || calculerProgression(c.checklist) }))])} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            <FiRefreshCw size={15} /> Actualiser
          </button>
          <button type="button" onClick={exporterCSV} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            <FiDownload size={15} /> Exporter
          </button>
          <div className="flex rounded-xl border border-gray-200 dark:border-slate-700">
            <button type="button" onClick={() => setViewMode('grid')} className={`rounded-l-xl p-2 ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}><FiGrid size={16} /></button>
            <button type="button" onClick={() => setViewMode('list')} className={`rounded-r-xl p-2 ${viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}><FiList size={16} /></button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total" value={stats.total} icon={FiShield} color="bg-brand-500" />
        <StatCard label="Vérifiés" value={stats.verifies} icon={FiCheckCircle} color="bg-emerald-500" />
        <StatCard label="En attente" value={stats.enAttente} icon={FiClock} color="bg-amber-500" />
        <StatCard label="Refusés" value={stats.refuses} icon={FiXCircle} color="bg-rose-500" />
        <StatCard label="Suspendus" value={stats.suspendus} icon={FiPause} color="bg-slate-500" />
        <StatCard label="Délai moyen" value={`${stats.tempsMoyen}j`} icon={FiCalendar} color="bg-violet-500" sub="Validation" />
      </div>

      {/* Recherche + Filtres */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher par nom, ville, responsable, email, téléphone..." className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900" />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"><FiX size={14} /></button>
            )}
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition ${showFilters ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20' : 'border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
            <FiFilter size={15} /> Filtres {showFilters ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 grid grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3 lg:grid-cols-6">
              <select value={filters.statut} onChange={(e) => { setFilters((f) => ({ ...f, statut: e.target.value })); setPage(1); }} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                <option value="">Tous les statuts</option>
                {Object.entries(LABELS_STATUT).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
              </select>
              <select value={filters.ville} onChange={(e) => { setFilters((f) => ({ ...f, ville: e.target.value })); setPage(1); }} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                <option value="">Toutes les villes</option>
                {villes.map((v) => (<option key={v} value={v}>{v}</option>))}
              </select>
              <select value={filters.domaine} onChange={(e) => { setFilters((f) => ({ ...f, domaine: e.target.value })); setPage(1); }} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                <option value="">Tous les domaines</option>
                {domaines.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              <input type="date" value={filters.dateDebut} onChange={(e) => { setFilters((f) => ({ ...f, dateDebut: e.target.value })); setPage(1); }} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200" />
              <input type="date" value={filters.dateFin} onChange={(e) => { setFilters((f) => ({ ...f, dateFin: e.target.value })); setPage(1); }} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200" />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                  <input type="checkbox" checked={filters.verifiesSeulement} onChange={(e) => { setFilters((f) => ({ ...f, verifiesSeulement: e.target.checked, enAttenteSeulement: false })); setPage(1); }} className="rounded border-gray-300 text-brand-500" /> Vérifiés
                </label>
                <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                  <input type="checkbox" checked={filters.enAttenteSeulement} onChange={(e) => { setFilters((f) => ({ ...f, enAttenteSeulement: e.target.checked, verifiesSeulement: false })); setPage(1); }} className="rounded border-gray-300 text-brand-500" /> En attente
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tri */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
        <span>Trier par :</span>
        {[{ key: 'name', label: 'Nom' }, { key: 'ville', label: 'Ville' }, { key: 'date', label: 'Date' }, { key: 'progress', label: 'Progression' }].map((opt) => (
          <button key={opt.key} type="button" onClick={() => { if (sortBy === opt.key) { setSortDir((d) => (d === 'asc' ? 'desc' : 'asc')); } else { setSortBy(opt.key); setSortDir('asc'); } }} className={`flex items-center gap-0.5 rounded-lg px-2.5 py-1 transition ${sortBy === opt.key ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
            {opt.label} {sortBy === opt.key && (sortDir === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />)}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {paginated.length === 0 ? (
        <EmptyState search={search || filters.statut || filters.ville} onReset={resetFilters} />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((centre) => (
              <CentreCard
                key={centre.id} centre={centre}
                onView={() => openDrawer(centre)}
                onApprove={() => setConfirmAction({ type: 'approve', centre })}
                onReject={() => setConfirmAction({ type: 'reject', centre })}
                onSuspend={() => setConfirmAction({ type: 'suspend', centre })}
                onDocuments={() => setPreviewDoc(centre.documents?.[0] || null)}
                onContact={() => setContactCentre(centre)}
                onHistory={() => { setSelectedCentre(centre); setDrawerTab('history'); }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400">Centre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400">Responsable</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400">Ville</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400">Progression</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((centre) => (
                <tr key={centre.id} className="border-b border-gray-50 transition hover:bg-gray-50 dark:border-slate-700/50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={centre.logo} alt="" className="h-9 w-9 rounded-lg bg-gray-100 object-contain" />
                      <div><p className="font-medium text-gray-900 dark:text-white">{centre.name}</p><p className="text-xs text-gray-400">{centre.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{centre.responsable || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{centre.ville}</td>
                  <td className="px-4 py-3"><BadgeStatut statut={centre.statutVerification} /></td>
                  <td className="px-4 py-3"><ProgressBar value={centre.progressionProfil} /></td>
                  <td className="px-4 py-3 text-right">
                    <ActionsPopover
                      onView={() => openDrawer(centre)} onApprove={() => setConfirmAction({ type: 'approve', centre })}
                      onReject={() => setConfirmAction({ type: 'reject', centre })} onSuspend={() => setConfirmAction({ type: 'suspend', centre })}
                      onDocuments={() => setPreviewDoc(centre.documents?.[0] || null)} onContact={() => setContactCentre(centre)}
                      onHistory={() => { setSelectedCentre(centre); setDrawerTab('history'); }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"><FiChevronLeft size={18} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} className={`min-w-[36px] rounded-xl px-3 py-1.5 text-sm font-medium transition ${p === page ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>{p}</button>
          ))}
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"><FiChevronRight size={18} /></button>
        </div>
      )}

      {/* Drawer */}
      <CentreDrawer
        centre={selectedCentre} tab={drawerTab} onTabChange={setDrawerTab} onClose={closeDrawer}
        noteText={noteText} onNoteTextChange={setNoteText} editingNote={editingNote}
        onEditNote={(n) => { setEditingNote(n); setNoteText(n.contenu); }} onCancelEdit={() => { setEditingNote(null); setNoteText(''); setNoteError(''); }}
        onAjouterNote={ajouterNote} onModifierNote={modifierNote} onSupprimerNote={supprimerNote} noteError={noteError}
        onApprove={(c) => { closeDrawer(); setTimeout(() => setConfirmAction({ type: 'approve', centre: c }), 50); }}
        onReject={(c) => { closeDrawer(); setTimeout(() => setConfirmAction({ type: 'reject', centre: c }), 50); }}
        onSuspend={(c) => { closeDrawer(); setTimeout(() => setConfirmAction({ type: 'suspend', centre: c }), 50); }}
        onContact={(c) => { closeDrawer(); setTimeout(() => setContactCentre(c), 50); }}
      />

      {/* Confirmations */}
      <ConfirmDialog open={confirmAction?.type === 'reject'} title="Refuser ce centre ?" message={`Êtes-vous sûr de vouloir refuser le centre "${confirmAction?.centre?.name}" ?`} onCancel={() => setConfirmAction(null)} onConfirm={() => { if (confirmAction) { const motif = prompt('Motif du refus (optionnel) :'); changerStatut(confirmAction.centre.id, 'rejete', motif || undefined); } setConfirmAction(null); }} />
      <ConfirmDialog open={confirmAction?.type === 'suspend'} title="Suspendre ce centre ?" message={`Suspendre "${confirmAction?.centre?.name}" masquera ses formations et réservations.`} onCancel={() => setConfirmAction(null)} onConfirm={() => { if (confirmAction) { changerStatut(confirmAction.centre.id, 'suspendu', 'Suspendu par l\'administrateur'); } setConfirmAction(null); }} />
      <ConfirmDialog open={confirmAction?.type === 'approve'} title="Approuver ce centre ?" message={`Valider et activer le centre "${confirmAction?.centre?.name}" sur la plateforme.`} onCancel={() => setConfirmAction(null)} onConfirm={() => { if (confirmAction) changerStatut(confirmAction.centre.id, 'verifie'); setConfirmAction(null); }} />

      <ContactModal open={!!contactCentre} centre={contactCentre} onClose={() => setContactCentre(null)} />
      <DocumentPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
};


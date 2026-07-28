import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiTag, FiAlertTriangle,
  FiMessageSquare, FiFile, FiEdit3, FiCheckCircle, FiSend, FiBarChart2,
  FiChevronRight, FiInfo, FiServer, FiDownload, FiPaperclip, FiThumbsUp, FiStar,
  FiUsers, FiShield, FiCheckSquare, FiSquare, FiTarget,
} from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

const TABS = [
  { key: 'infos', label: 'Informations', icon: FiInfo },
  { key: 'conversation', label: 'Conversation', icon: FiMessageSquare },
  { key: 'documents', label: 'Documents', icon: FiFile },
  { key: 'historique', label: 'Historique', icon: FiClock },
  { key: 'notes', label: 'Notes internes', icon: FiEdit3 },
  { key: 'decision', label: 'Décision', icon: FiCheckCircle },
];

const STATUS_LABELS = {
  ouvert: 'Ouvert',
  analyse: 'Analytics',
  attente_justificatifs: 'Attente justificatifs',
  en_cours: 'En cours',
  decision: 'Décision',
  resolu: 'Résolu',
  archive: 'Archivé',
};

const statusColors = {
  ouvert: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  analyse: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  attente_justificatifs: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  en_cours: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  decision: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  resolu: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  archive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const priorityColors = {
  basse: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  moyenne: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  haute: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  critique: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const WORKFLOW_STEPS = [
  { key: 'ouvert', label: 'Ouvert' },
  { key: 'analyse', label: 'Analytics' },
  { key: 'attente_justificatifs', label: 'Attente' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'decision', label: 'Décision' },
  { key: 'resolu', label: 'Résolu' },
  { key: 'archive', label: 'Archivé' },
];

const InfoCard = ({ label, value, icon: Icon, badge, status, priority }) => {
  const badgeClass = status ? statusColors[status] : priority ? priorityColors[priority] : '';
  return (
    <div className="rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3 flex items-start gap-3">
      <div className="shrink-0 mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        {badge ? (
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${badgeClass || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>{value}</span>
        ) : (
          <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{value}</p>
        )}
      </div>
    </div>
  );
};

export const LitigesDrawer = ({ litige, onClose, onUpdate, litiges, setLitiges }) => {
  const [activeTab, setActiveTab] = useState('infos');
const [newNote, setNewNote] = useState('');
  const [toast, setToast] = useState(null);
  const { addNotification } = useNotifications();

  if (!litige) return null;

  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.key === litige.statut);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const newNoteObj = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      auteur: 'Admin Principal',
      contenu: newNote,
    };
    const updatedLitiges = litiges.map(l =>
      l.id === litige.id ? { ...l, notesInternes: [...(l.notesInternes || []), newNoteObj] } : l
    );
    setLitiges(updatedLitiges);
    setNewNote('');
    addNotification({ role: 'admin', title: 'Note ajoutée', message: `Note ajoutée au dossier ${litige.numeroDossier}: ${newNote.slice(0, 50)}...`, category: 'litiges' });
    showToast('success', 'Note ajoutée');
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      nom: `Document_${(Math.random() * 1000).toFixed(0)}.pdf`,
      type: 'Justificatif',
      date: new Date().toISOString().split('T')[0],
      taille: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
    };
    const updatedLitiges = litiges.map(l =>
      l.id === litige.id ? { ...l, piecesJointes: [...(l.piecesJointes || []), newDoc] } : l
    );
    setLitiges(updatedLitiges);
    addNotification({ role: 'admin', title: 'Document ajouté', message: `Document ajouté au dossier ${litige.numeroDossier}`, category: 'litiges' });
    showToast('success', 'Document ajouté');
  };

  const sendMessage = (role, message) => {
    const newMsg = {
      auteur: role === 'admin' ? 'Admin Principal' : role === 'centre' ? litige.centre?.nom : litige.etudiant?.nom,
      role: role,
      message: message,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedLitiges = litiges.map(l =>
      l.id === litige.id ? { ...l, conversation: [...(l.conversation || []), newMsg] } : l
    );
    setLitiges(updatedLitiges);
    const actionLabel = role === 'etudiant' ? 'Étudiant' : role === 'centre' ? 'Centre' : 'Admin';
    addNotification({ role: 'admin', title: `Message envoyé à ${actionLabel}`, message: `Message envoyé concernant ${litige.numeroDossier}`, category: 'litiges' });
    showToast('success', `Message envoyé à ${actionLabel}`);
  };

  const handleDecision = (decision) => {
    const updatedLitiges = litiges.map(l =>
      l.id === litige.id ? { ...l, decisionFinale: decision, statut: 'resolu' } : l
    );
    setLitiges(updatedLitiges);
    addNotification({ role: 'admin', title: 'Litige résolu', message: `Décision prise pour ${litige.numeroDossier}: ${decision.slice(0, 60)}...`, category: 'litiges' });
    showToast('success', 'Décision enregistrée');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderInformations = () => (
    <div className="space-y-4">
      <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Workflow</h4>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-[18px] right-[18px] h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full z-0" />
          <div
            className="absolute top-4 left-[18px] h-[3px] bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full z-0 transition-all duration-700 ease-out"
            style={{ width: `${(currentStepIndex / (WORKFLOW_STEPS.length - 1)) * 85}%` }}
          />
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 cursor-pointer" onClick={() => onUpdate(litige.id, { statut: step.key })}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isCompleted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' :
                    isActive ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30 ring-2 ring-brand-200 scale-110' :
                    'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                  {isCompleted ? <FiCheckCircle size={14} /> : isActive ? <FiChevronRight size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight max-w-[70px]
                  ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                    isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InfoCard label="Numéro de dossier" value={litige.numeroDossier} icon={FiTag} />
        <InfoCard label="Catégorie" value={litige.categorie} icon={FiBarChart2} />
        <InfoCard label="Priorité" value={litige.priorite} icon={FiAlertTriangle} badge priority={litige.priorite} />
        <InfoCard label="Statut" value={STATUS_LABELS[litige.statut] || litige.statut} icon={FiCheckCircle} badge status={litige.statut} />
        <InfoCard label="Date d'ouverture" value={formatDate(litige.dateOuverture)} icon={FiCalendar} />
        <InfoCard label="Dernière mise à jour" value={formatDate(litige.derniereMAJ)} icon={FiCalendar} />
        <InfoCard label="Temps écoulé" value={litige.tempsEcoule} icon={FiClock} />
        <InfoCard label="SLA" value={litige.sla} icon={FiServer} />
        <InfoCard label="Niveau d'urgence" value={litige.niveauUrgence} icon={FiAlertTriangle} />
        <InfoCard label="Responsable" value={litige.responsable?.nom || '-'} icon={FiUser} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Étudiant</h4>
          <div className="space-y-1.5 text-sm">
            <p className="font-medium text-slate-800 dark:text-slate-200">{litige.etudiant?.nom}</p>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiMail size={12} /><span className="text-xs">{litige.etudiant?.email}</span></div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiPhone size={12} /><span className="text-xs">{litige.etudiant?.tel}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Centre</h4>
          <div className="space-y-1.5 text-sm">
            <p className="font-medium text-slate-800 dark:text-slate-200">{litige.centre?.nom}</p>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiMail size={12} /><span className="text-xs">{litige.centre?.email}</span></div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiPhone size={12} /><span className="text-xs">{litige.centre?.tel}</span></div>
          </div>
        </div>
      </div>

      {/* Historique utilisateur - Centre */}
      {litige.centre?.litigesTotal !== undefined && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
            <FiShield size={12} /> Historique du centre
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{litige.centre.litigesTotal || 0}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Litiges totaux</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{litige.centre.litigesResolus || 0}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Résolus</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{litige.centre.tempsMoyen || '-'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Temps moyen</p>
            </div>
          </div>
        </div>
      )}

      {/* Historique utilisateur - Étudiant */}
      {litige.etudiant?.litigesAnterieurs !== undefined && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
            <FiUsers size={12} /> Historique de l'étudiant
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{litige.etudiant.litigesAnterieurs || 0}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Litiges antérieurs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{litige.etudiant.dossiersResolus || 0}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Dossiers ouverts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{litige.etudiant.dossiersResolus || 0}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Résolus</p>
            </div>
          </div>
        </div>
      )}

      {/* Checklist de traitement */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <FiTarget size={12} /> Checklist de traitement
        </h4>
        <div className="space-y-2">
          {[
            { label: 'Paiement vérifié', checked: litige.categorie === 'Paiement' || litige.statut !== 'ouvert' },
            { label: 'Centre contacté', checked: litige.statut !== 'ouvert' },
            { label: 'Étudiant contacté', checked: litige.statut !== 'ouvert' },
            { label: 'Documents reçus', checked: ['en_cours', 'decision', 'resolu', 'archive'].includes(litige.statut) },
            { label: 'Décision validée', checked: ['resolu', 'archive'].includes(litige.statut) },
            { label: 'Notification envoyée', checked: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {item.checked ? (
                <FiCheckSquare size={14} className="text-emerald-500 shrink-0" />
              ) : (
                <FiSquare size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <span className={`text-xs ${item.checked ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                {item.label}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Progression</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {Math.round(([litige.categorie === 'Paiement' || litige.statut !== 'ouvert', litige.statut !== 'ouvert', litige.statut !== 'ouvert', ['en_cours', 'decision', 'resolu', 'archive'].includes(litige.statut), ['resolu', 'archive'].includes(litige.statut), true].filter(Boolean).length / 6) * 100)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${([litige.categorie === 'Paiement' || litige.statut !== 'ouvert', litige.statut !== 'ouvert', litige.statut !== 'ouvert', ['en_cours', 'decision', 'resolu', 'archive'].includes(litige.statut), ['resolu', 'archive'].includes(litige.statut), true].filter(Boolean).length / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Formation concernée</h4>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{litige.formation?.titre || '-'}</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{litige.description}</p>
      </div>

      {litige.aiAnalysis && (
        <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/30 dark:to-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-2">
              <FiBarChart2 size={14} /> Analytics IA
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                Confiance {litige.aiAnalysis.confiance}%
              </span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="text-xs font-medium uppercase text-slate-500 w-20">Risque</span><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${litige.aiAnalysis.risque === 'Élevé' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>{litige.aiAnalysis.risque}</span></div>
<div className="flex items-start gap-2"><span className="text-xs font-medium uppercase text-slate-500 w-20 shrink-0">Recommandation</span><span className="text-xs text-slate-700 dark:text-slate-300">{litige.aiAnalysis.recommandation}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium uppercase text-slate-500 w-20">Alerte</span><span className="text-xs text-rose-600 dark:text-rose-400">{litige.aiAnalysis.alerte}</span></div>
          </div>
        </div>
      )}

<div className="grid grid-cols-2 gap-2">
        <button onClick={() => onUpdate(litige.id, { priorite: 'haute' })} className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 px-3 py-2 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
          <FiAlertTriangle size={12} /> Priorité haute
        </button>
        <button onClick={() => onUpdate(litige.id, { priorite: 'critique' })} className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300 px-3 py-2 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
          <FiAlertTriangle size={12} /> Priorité critique
        </button>
      </div>
    </div>
  );

  const renderConversation = () => (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {(litige.conversation || []).map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl p-3 ${
              msg.role === 'admin' ? 'bg-brand-500 text-white' :
              msg.role === 'centre' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' :
              msg.role === 'system' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-center text-xs italic' :
              'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase opacity-80">{msg.auteur}</span>
                <span className="text-[10px] opacity-70">{msg.date} {msg.time}</span>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
        {(litige.conversation || []).length === 0 && (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">Aucun message dans la conversation</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Écrire un message..."
          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200"
          onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { sendMessage('admin', e.target.value); e.target.value = ''; } }}
        />
        <button onClick={() => { const input = document.activeElement; if (input?.value?.trim()) { sendMessage('admin', input.value); input.value = ''; } }} className="rounded-lg bg-brand-500 text-white px-3 py-2 text-sm hover:bg-brand-600 transition-colors">
          <FiSend size={14} />
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => sendMessage('etudiant', 'Bonjour, nous avons bien reçu votre dossier. Nous reviendrons vers vous rapidement.')} className="flex-1 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-3 py-2 text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
          Répondre à l'étudiant
        </button>
        <button onClick={() => sendMessage('centre', 'Merci de nous fournir les informations demandées pour le dossier en cours.')} className="flex-1 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          Répondre au centre
        </button>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-3">
      {(litige.piecesJointes || []).map((doc, idx) => (
        <div key={doc.id || idx} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              <FiFile size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{doc.nom}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{doc.type} • {doc.taille} • {doc.date}</p>
            </div>
          </div>
          <button className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
            <FiDownload size={14} />
          </button>
        </div>
      ))}
      {(litige.piecesJointes || []).length === 0 && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">Aucun document joint</p>
      )}
      <button onClick={handleAddDocument} className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 px-4 py-3 text-sm font-medium hover:border-brand-400 hover:text-brand-500 transition-colors">
        <FiPaperclip size={14} /> Ajouter une pièce jointe
      </button>
    </div>
  );

  const renderHistorique = () => (
    <div className="space-y-0 relative">
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
      {(litige.historique || []).map((event, idx) => (
        <div key={idx} className="relative flex gap-4 pb-4">
          <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
            event.action.includes('Résolu') || event.action.includes('Archiv') ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
            event.action.includes('Ouvert') ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' :
            'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}>
            <div className="w-2 h-2 rounded-full bg-current" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{event.action}</p>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{event.date}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.auteur}</p>
            {event.details && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{event.details}</p>}
          </div>
        </div>
      ))}
      {(litige.historique || []).length === 0 && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">Aucun historique</p>
      )}
    </div>
  );

  const renderNotesInternes = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {(litige.notesInternes || []).map((note, idx) => (
          <div key={note.id || idx} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{note.auteur}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{note.date}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{note.contenu}</p>
          </div>
        ))}
        {(litige.notesInternes || []).length === 0 && (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">Aucune note interne</p>
        )}
      </div>
      <div className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Ajouter une note interne..."
          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:text-slate-200 resize-none"
          rows={3}
        />
      </div>
      <button onClick={handleAddNote} disabled={!newNote.trim()} className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-500 text-white px-4 py-2 text-sm font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <FiEdit3 size={14} /> Ajouter la note
      </button>
    </div>
  );

  const renderDecision = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Décision finale</h4>
        {litige.decisionFinale ? (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">Décision déjà prise</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{litige.decisionFinale}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Aucune décision prise pour le moment. Sélectionnez une option ci-dessous.</p>
        )}
      </div>
      {!litige.decisionFinale && (
        <div className="space-y-2">
          <button onClick={() => handleDecision("Remboursement intégral accepté. L'étudiant sera remboursé sous 48h.")} className="w-full flex items-center gap-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-3 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-left">
            <FiThumbsUp size={16} className="shrink-0" /> Remboursement intégral
          </button>
          <button onClick={() => handleDecision("Remboursement partiel (50%) proposé et accepté par les deux parties.")} className="w-full flex items-center gap-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-4 py-3 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-left">
            <FiStar size={16} className="shrink-0" /> Remboursement partiel
          </button>
          <button onClick={() => handleDecision("Le centre doit fournir le service dans un délai de 7 jours. Suivi programmé.")} className="w-full flex items-center gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-3 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-left">
            <FiCheckCircle size={16} className="shrink-0" /> Mise en demeure du centre
          </button>
          <button onClick={() => handleDecision("Aucun accord trouvé. Dossier transmis au service juridique.")} className="w-full flex items-center gap-3 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 px-4 py-3 text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors text-left">
            <FiAlertTriangle size={16} className="shrink-0" /> Transmission juridique
          </button>
        </div>
      )}
      {litige.decisionFinale && (
        <button onClick={() => onUpdate(litige.id, { statut: 'archive' })} className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors">
          <FiCheckCircle size={14} /> Archiver le dossier
        </button>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'infos': return renderInformations();
      case 'conversation': return renderConversation();
      case 'documents': return renderDocuments();
      case 'historique': return renderHistorique();
      case 'notes': return renderNotesInternes();
      case 'decision': return renderDecision();
      default: return renderInformations();
    }
  };

  return (
    <AnimatePresence>
      {litige && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-700"
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{litige.numeroDossier}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{litige.titre}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <div className="flex gap-1 px-4 pb-2 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon size={12} /> {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4">
              {renderTabContent()}
            </div>
            {toast && (
              <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
                toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {toast.message}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

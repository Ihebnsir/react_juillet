import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getStats, updateStats, getTemoignages, addTemoignage, updateTemoignage, deleteTemoignage, getCategoriesVisibles, toggleCategorieVisible } from '../../services/contenuAccueilService';

const initialForm = { nom: '', role: '', citation: '' };

const NumericField = ({ label, value, suffix, onChange }) => (
  <label className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <span className="text-sm text-slate-500">{suffix}</span>
    </div>
  </label>
);

export const ContenuAccueilPage = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(getStats());
  const [temoignages, setTemoignages] = useState(getTemoignages());
  const [categories, setCategories] = useState(getCategoriesVisibles());
  const [draft, setDraft] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setTemoignages(getTemoignages());
    setCategories(getCategoriesVisibles());
  }, []);

  const handleSaveStats = () => {
    updateStats(stats);
  };

  const handleSubmitTemoignage = (e) => {
    e.preventDefault();
    if (!draft.nom || !draft.role || !draft.citation) return;
    if (editingId) {
      setTemoignages(updateTemoignage(editingId, draft));
    } else {
      setTemoignages(addTemoignage(draft));
    }
    setDraft(initialForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setDraft({ nom: item.nom, role: item.role, citation: item.citation });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    setTemoignages(deleteTemoignage(id));
    if (editingId === id) {
      setDraft(initialForm);
      setEditingId(null);
    }
  };

  const handleToggleCategory = (id) => {
    setCategories(toggleCategorieVisible(id));
  };

  const tabs = useMemo(() => [
    { id: 'stats', label: 'Statistiques' },
    { id: 'temoignages', label: 'Témoignages' },
    { id: 'categories', label: 'Catégories' },
  ], []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <h1 className="text-2xl font-display font-bold">Contenu de l'accueil</h1>
        <p className="mt-2 text-sm text-brand-100">Gérez les statistiques, témoignages et catégories visibles sur la page d’accueil.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <NumericField label="Centres vérifiés" value={stats.centres} suffix="+" onChange={(value) => setStats((prev) => ({ ...prev, centres: value }))} />
          <NumericField label="Formations" value={stats.formations} suffix="+" onChange={(value) => setStats((prev) => ({ ...prev, formations: value }))} />
          <NumericField label="Apprenants" value={stats.apprenants} suffix="k+" onChange={(value) => setStats((prev) => ({ ...prev, apprenants: value }))} />
          <NumericField label="Satisfaction" value={stats.satisfaction} suffix="/5" onChange={(value) => setStats((prev) => ({ ...prev, satisfaction: value }))} />
          <button onClick={handleSaveStats} className="btn-primary">Enregistrer les statistiques</button>
        </motion.div>
      )}

      {activeTab === 'temoignages' && (
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmitTemoignage} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold">Ajouter ou modifier un témoignage</h2>
            <input value={draft.nom} onChange={(e) => setDraft((prev) => ({ ...prev, nom: e.target.value }))} placeholder="Nom" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
            <input value={draft.role} onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))} placeholder="Rôle" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
            <textarea value={draft.citation} onChange={(e) => setDraft((prev) => ({ ...prev, citation: e.target.value }))} placeholder="Citation" rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
              {editingId ? <button type="button" onClick={() => { setDraft(initialForm); setEditingId(null); }} className="btn-outline">Annuler</button> : null}
            </div>
          </motion.form>

          <div className="space-y-3">
            {temoignages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">Aucun témoignage enregistré.</div>
            ) : (
              temoignages.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.nom}</p>
                      <p className="text-sm text-slate-500">{item.role}</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">“{item.citation}”</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="rounded-full border border-slate-200 px-3 py-1 text-sm">Modifier</button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-full border border-rose-200 px-3 py-1 text-sm text-rose-600">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                <input type="checkbox" checked={cat.visible} onChange={() => handleToggleCategory(cat.id)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              </label>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../UI/Carousel';
import { FormationCard } from '../Cards/FormationCard';
import { getCategoriesVisibles } from '../../services/contenuAccueilService';
import { FiCode, FiBarChart2, FiCpu, FiTerminal, FiShield, FiGlobe } from 'react-icons/fi';

const defaultCategories = [
  { id: 'dev-web', label: 'Développement Web', icon: FiCode, visible: true },
  { id: 'data-bi', label: 'Data & BI', icon: FiBarChart2, visible: true },
  { id: 'iot', label: 'IoT', icon: FiCpu, visible: true },
  { id: 'python', label: 'Python', icon: FiTerminal, visible: true },
  { id: 'cybersecurite', label: 'Cybersécurité', icon: FiShield, visible: true },
  { id: 'langues', label: 'Langues', icon: FiGlobe, visible: true },
];

function CompetencesParDomaine({ formations = [] }) {
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState(defaultCategories[0].id);

  useEffect(() => {
    const saved = getCategoriesVisibles();
    const merged = defaultCategories.map((cat) => ({ ...cat, ...(saved.find((item) => item.id === cat.id) || {}) }));
    setCategories(merged);
    const firstVisible = merged.find((item) => item.visible);
    if (firstVisible) {
      setActiveCategory(firstVisible.id);
    }
  }, []);

  const visibleCategories = useMemo(() => categories.filter((cat) => cat.visible), [categories]);

  const formationsFiltered = useMemo(
    () => formations.filter((f) => f.categorie === activeCategory),
    [formations, activeCategory]
  );

  const categorieActive = visibleCategories.find((c) => c.id === activeCategory);

  return (
    <section className="py-12 px-6 md:px-10 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 sb-h2">
        Des compétences pour révolutionner votre carrière
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 sb-p">
        Des compétences essentielles aux sujets techniques, SkillBridge contribue à votre développement professionnel.
      </p>

      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
        {visibleCategories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative pb-3 px-1 whitespace-nowrap font-medium transition-colors focus:outline-none flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {IconComponent && <IconComponent size={16} />}
              {cat.label}
              {activeCategory === cat.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {formationsFiltered.length > 0 ? (
        <>
          <Carousel itemsPerPage={4}>
            {formationsFiltered.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </Carousel>

          <Link
            to={`/formations?categorie=${activeCategory}`}
            className="inline-flex items-center gap-1.5 mt-6 font-semibold text-accent-600 dark:text-accent-400 hover:underline"
          >
            Afficher toutes les formations en {categorieActive?.label} →
          </Link>
        </>
      ) : (
        <p className="text-slate-500 dark:text-slate-400 py-8">
          Aucune formation disponible dans cette catégorie pour le moment.
        </p>
      )}
    </section>
  );
}

export default CompetencesParDomaine;


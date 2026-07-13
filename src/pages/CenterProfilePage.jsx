import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiStar, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { getCenterById } from '../data/mockData';
import { formationsService } from '../services/formationsService';

export const CenterProfilePage = () => {
  const { id } = useParams();
  const [centre, setCentre] = useState(null);
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const loadCenter = async () => {
      const centreData = getCenterById(id);
      setCentre(centreData);
      const centerFormations = await formationsService.getCenterFormations(id);
      setFormations(centerFormations);
    };

    loadCenter();
  }, [id]);

  if (!centre) {
    return <div className="min-h-screen p-8 text-center">Centre introuvable</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link to="/formations" className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
          <FiArrowLeft /> Retour au catalogue
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-6">
            <img src={centre.logo} alt={centre.name} className="w-24 h-24 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{centre.name}</h1>
                {centre.verified && <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-200"><FiCheckCircle /> Centre vérifié</span>}
              </div>
              <p className="mt-3 text-gray-600 dark:text-slate-300">{centre.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-300">
                <span className="flex items-center gap-2"><FiMapPin /> {centre.city}</span>
                <span className="flex items-center gap-2"><FiStar className="text-yellow-400" /> {centre.averageRating}/5</span>
                <a href={centre.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-teal-600 hover:text-teal-700"><FiExternalLink /> Site web</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100">Formations actives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formations.map((formation) => (
              <Link key={formation.id} to={`/formations/${formation.id}`} className="rounded-lg border border-gray-200 dark:border-slate-700 p-4 hover:border-teal-500 transition">
                <h3 className="font-semibold text-gray-900 dark:text-slate-100">{formation.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">{formation.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

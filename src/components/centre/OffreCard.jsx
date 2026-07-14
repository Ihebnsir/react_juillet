import { Link } from "react-router-dom";
import { FiEye, FiEdit2, FiTrash2, FiBriefcase } from "react-icons/fi";
import { formatPriceTND } from "../../utils/formatPrice";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-800",
  draft: "bg-slate-100 text-slate-700",
  completed: "bg-rose-100 text-rose-800",
  full: "bg-amber-100 text-amber-800",
};

export const OffreCard = ({ formation, reservationCount, onDelete, onDeleteDisabled }) => {
  const status = formation.status || "active";
  const badgeClass = statusStyles[status] || statusStyles.active;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {formation.image ? (
          <img src={formation.image} alt={formation.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">Aucune image</div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {status}
        </span>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formation.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formation.domain}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <span>{formation.city}</span>
            <span>{formation.duration}</span>
            <span>{formatPriceTND(formation.price)}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Places</span>
            <span className="mt-1 block font-semibold">{formation.availablePlaces} / {formation.maxPlaces}</span>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Réservations</span>
            <span className="mt-1 block font-semibold">{reservationCount}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={`/centre/offres/${formation.id}`}
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <FiEye className="h-4 w-4" /> Voir
          </Link>
          <Link
            to={`/centre/offres/${formation.id}/modifier`}
            className="inline-flex items-center gap-2 rounded-3xl border border-teal-600 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
          >
            <FiEdit2 className="h-4 w-4" /> Modifier
          </Link>
          <button
            onClick={() => onDelete(formation.id)}
            disabled={onDeleteDisabled}
            className="inline-flex items-center gap-2 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 className="h-4 w-4" /> Supprimer
          </button>
        </div>

        {formation.offreStage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <FiBriefcase className="h-4 w-4" /> Avec stage
          </div>
        )}
      </div>
    </div>
  );
};

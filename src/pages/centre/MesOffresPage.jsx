import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formationsService } from "../../services/formationsService";
import { reservationsService } from "../../services/reservationsService";
import { useReservations } from "../../context/ReservationContext";
import { OffreCard } from "../../components/centre/OffreCard";
import { ToastMessage } from "../../components/UI/ToastMessage";

export const MesOffresPage = () => {
  const { user } = useAuth();
  const { getReservationsParFormation } = useReservations();
  const location = useLocation();
  const navigate = useNavigate();

  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [deletingId, setDeletingId] = useState(null);

  const loadFormations = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setFormations([]);
        return;
      }
      const data = await formationsService.getMesFormations(user.id);
      setFormations(data);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFormations();
  }, [loadFormations]);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleDelete = async (formationId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette offre ?"
    );
    if (!confirmed) return;

    setDeletingId(formationId);
    try {
      const hasActive = await reservationsService.hasActiveReservationsForFormation(formationId);
      if (hasActive) {
        setToast({ type: "error", message: "Impossible de supprimer une offre avec des réservations actives." });
        return;
      }
      await formationsService.delete(formationId);
      await loadFormations();
      setToast({ type: "success", message: "Offre supprimée avec succès." });
    } catch (error) {
      setToast({ type: "error", message: "Erreur lors de la suppression de l'offre." });
    } finally {
      setDeletingId(null);
    }
  };

  const empty = !loading && formations.length === 0;

  const ordered = useMemo(() => {
    return [...formations].sort((a, b) => {
      const da = a.startDate ? new Date(a.startDate).getTime() : 0;
      const db = b.startDate ? new Date(b.startDate).getTime() : 0;
      return db - da;
    });
  }, [formations]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: "", message: "" })} />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Mes offres de formation
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {loading ? "Chargement…" : `${formations.length} offre(s)`}
          </p>
        </div>
        <Link
          to="/centre/offres/nouvelle"
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
        >
          Publier une nouvelle offre
        </Link>
      </div>

      {loading ? (
        <div className="mt-6">Chargement…</div>
      ) : empty ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100">
            Vous n'avez publié aucune formation pour le moment
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Commencez par publier votre première offre.
          </p>
          <Link
            to="/centre/offres/nouvelle"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
          >
            Créer une offre
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ordered.map((formation) => {
            const reservations = getReservationsParFormation(formation.id) || [];
            const hasActiveReservations = reservations.some((reservation) =>
              ["en_attente", "confirmee"].includes(reservation.status)
            );
            return (
              <OffreCard
                key={formation.id}
                formation={formation}
                reservationCount={reservations.length}
                onDelete={handleDelete}
                onDeleteDisabled={deletingId === formation.id || hasActiveReservations}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};


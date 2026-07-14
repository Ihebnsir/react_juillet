import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formationsService } from "../../services/formationsService";
import { reservationsService } from "../../services/reservationsService";
import { mockUsers } from "../../data/mockUsers";
import { ListeInscritsTable } from "../../components/centre/ListeInscritsTable";
import { ToastMessage } from "../../components/UI/ToastMessage";
import { FiBriefcase } from "react-icons/fi";
import { formatPriceTND } from "../../utils/formatPrice";

export const DetailOffrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formation, setFormation] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const formationData = await formationsService.getById(id);
        if (!formationData) {
          navigate("/centre/offres");
          return;
        }
        if (mounted) setFormation(formationData);
        const reservations = await reservationsService.getReservationsParFormation(id);
        const detailed = reservations.map((reservation) => ({
          ...reservation,
          learnerName: mockUsers.find((user) => user.id === reservation.learnerId)?.nom || reservation.learnerId,
        }));
        if (mounted) setInscriptions(detailed);
      } catch (error) {
        if (mounted) {
          setToast({ type: "error", message: t("centre.offres.detailLoadError") });
          navigate("/centre/offres", { replace: true });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, navigate, t]);

  const handleDelete = async () => {
    if (!formation) return;
    const hasActive = await reservationsService.hasActiveReservationsForFormation(id);
    if (hasActive) {
      setToast({ type: "error", message: t("centre.offres.deleteBlockedActiveReservations") });
      return;
    }
    if (!window.confirm(t("centre.offres.deleteConfirmation"))) {
      return;
    }
    setDeleting(true);
    try {
      await formationsService.delete(id);
      navigate("/centre/offres", {
        state: { toast: { type: "success", message: t("centre.offres.deletedSuccess") } },
      });
    } catch (error) {
      setToast({ type: "error", message: t("centre.offres.deleteError") });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-center text-slate-600 dark:text-slate-300">{t("centre.offres.notFound")}</p>
        <div className="mt-6 flex justify-center">
          <Link to="/centre/offres" className="rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700">{t("common.back")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: "", message: "" })} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{formation.title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{formation.domain} • {formation.city}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/centre/offres" className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{t("common.back")}</Link>
          <Link to={`/centre/offres/${formation.id}/modifier`} className="rounded-3xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">{t("centre.offres.editOffer")}</Link>
          <button onClick={handleDelete} disabled={deleting} className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60">{t("centre.offres.deleteOffer")}</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900">
              {formation.image ? (
                <img src={formation.image} alt={formation.title} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center text-slate-500 dark:text-slate-400">Aucune image</div>
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300">{formation.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("centre.form.price")}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{formatPriceTND(formation.price)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("centre.form.duration")}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{formation.duration}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("centre.form.startDate")}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{formation.startDate}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("centre.form.places")}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{formation.availablePlaces} / {formation.maxPlaces}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("centre.form.programSection")}</h2>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              {formation.program?.map((item, index) => (
                <li key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">{item}</li>
              ))}
            </ul>
          </div>

          {formation.offreStage && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <FiBriefcase className="h-5 w-5 text-teal-600" />
                <span>{t("centre.form.internshipLabel")}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formation.entreprisesPartenaires?.map((company) => (
                  <span key={company} className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">{company}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("centre.offres.detailReservationsTitle")}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("centre.offres.detailReservationsDescription")}</p>
          </div>
          <ListeInscritsTable inscriptions={inscriptions} />
        </div>
      </div>
    </div>
  );
};

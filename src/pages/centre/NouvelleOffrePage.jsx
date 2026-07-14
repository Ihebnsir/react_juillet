import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formationsService } from "../../services/formationsService";
import { OffreForm } from "../../components/centre/OffreForm";
import { ToastMessage } from "../../components/UI/ToastMessage";

export const NouvelleOffrePage = () => {
  const { user, isLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const loadFormation = async () => {
      setLoading(true);
      try {
        const data = await formationsService.getById(id);
        if (!data || data.centreId !== user?.id) {
          navigate("/centre/offres", { replace: true });
          return;
        }
        if (mounted) setFormation(data);
      } catch (error) {
        navigate("/centre/offres", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFormation();
    return () => {
      mounted = false;
    };
  }, [id, navigate, user?.id]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (id) {
        await formationsService.update(id, values);
        setToast({ type: "success", message: "Offre mise à jour avec succès." });
        navigate(`/centre/offres/${id}`);
      } else {
        const created = await formationsService.create({
          ...values,
          centreId: user.id,
          status: values.status || "active",
        });
        setToast({ type: "success", message: "Offre créée avec succès." });
        navigate(`/centre/offres/${created.id}`);
      }
    } catch (error) {
      setToast({ type: "error", message: "Erreur lors de l'enregistrement de l'offre." });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-gray-500 dark:text-slate-400">Chargement de l'offre…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: "", message: "" })} />
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
        {id ? "Modifier l'offre" : "Publier une nouvelle offre"}
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
        {id
          ? "Mettez à jour les informations de votre formation."
          : "Créez une offre qui sera visible dans votre espace centre."}
      </p>

      <div className="mt-6">
        <OffreForm
          loading={saving}
          defaultValues={formation || {}}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

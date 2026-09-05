import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Loader,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationContext";
import { useNotifications } from "../../context/NotificationContext";
import { ToastMessage } from "../../components/UI/ToastMessage";
import { formatPriceTND } from "../../utils/formatPrice";

// Supported payment methods based on backend contract
const PAYMENT_METHODS = [
  { id: "Carte bancaire", label: "Carte bancaire", description: "Paiement par carte", icon: "💳" },
  { id: "Virement bancaire", label: "Virement bancaire", description: "Virement direct", icon: "🏦" },
];

const Detail = ({ label, value, highlight = false }) => (
  <div className={`rounded-2xl border p-3 ${highlight ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800 bg-slate-900/60"}`}>
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`mt-1 font-medium ${highlight ? "text-emerald-300" : "text-slate-100"}`}>{value}</p>
  </div>
);

const ReservationSummary = ({ reservation }) => (
  <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5 shadow-2xl shadow-slate-950/30">
    <div className="flex items-center gap-3">
      <img src={reservation.image || "/images/formation-placeholder.svg"} alt={reservation.formationTitle} className="h-20 w-20 rounded-2xl object-cover" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Résumé de la réservation</p>
        <h2 className="mt-1 text-xl font-semibold text-white">{reservation.formationTitle}</h2>
        <p className="text-sm text-slate-400">{reservation.centreName}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
      <Detail label="Durée" value={reservation.duree} />
      <Detail label="Prix" value={formatPriceTND(reservation.price || reservation.prix)} />
      <Detail label="Date de réservation" value={new Date(reservation.date || Date.now()).toLocaleDateString("fr-FR")} />
      <Detail label="Numéro de réservation" value={reservation.id} />
      <Detail label="Total" value={formatPriceTND(reservation.price || reservation.prix)} highlight />
    </div>
  </div>
);

export const PaymentCheckoutPage = () => {
  const { reservationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { payerReservation, getReservationById, isHydrated } = useReservations();
  const { refresh: refreshNotifications } = useNotifications();

  const reservation = useMemo(() => state?.reservation || getReservationById(reservationId), [state, getReservationById, reservationId]);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!reservation && isHydrated) {
      navigate("/reservations");
    }
  }, [reservation, reservationId, isHydrated, navigate]);

  if (!reservation && !isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
            <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-slate-400" />
            <p className="text-slate-400">Chargement de la réservation...</p>
          </div>
        </div>
      </div>
    );
  }

  const submitPayment = async () => {
    setIsSubmitting(true);
    try {
      const updatedReservation = await payerReservation(reservation.id, selectedMethod);
      
      // Refresh notifications if payment was successful
      try {
        await refreshNotifications();
      } catch (notifError) {
        console.warn("Could not refresh notifications:", notifError);
      }

      setSuccessData(updatedReservation);
      setIsSuccess(true);
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = 
        error?.status === 401 ? "Votre session a expiré. Veuillez vous reconnecter." :
        error?.status === 403 ? "Vous n'êtes pas autorisé à effectuer ce paiement." :
        error?.status === 404 ? "Cette réservation n'existe pas." :
        error?.status === 409 ? "Cette réservation est déjà payée." :
        error?.status === 400 ? "Données de paiement invalides." :
        error?.status === 500 ? "Erreur serveur. Veuillez réessayer." :
        "Le paiement n'a pas pu être finalisé. Veuillez réessayer.";
      
      setToast({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && successData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-5 rounded-full bg-emerald-500/15 p-4 text-emerald-400"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <h1 className="text-3xl font-semibold">Paiement réussi !</h1>
              <p className="mt-2 text-slate-400">Votre réservation a été confirmée avec succès.</p>
            </div>

            <div className="mt-8 space-y-4">
              <Detail label="Numéro de réservation" value={successData.id} highlight />
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Formation" value={successData.formationTitle || successData.titre} />
                <Detail label="Centre" value={successData.centreName} />
                <Detail label="Montant payé" value={formatPriceTND(successData.price || successData.prix)} />
                <Detail label="Méthode de paiement" value={successData.paymentMethod || selectedMethod} />
                <Detail label="Date de paiement" value={new Date().toLocaleDateString("fr-FR")} />
                <Detail label="État" value="Payée ✓" />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate("/reservations")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                <ChevronRight className="h-4 w-4" /> Voir mes réservations
              </button>
              <button onClick={() => navigate("/")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800">
                Retour à l'accueil
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <ToastMessage
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <Lock className="h-4 w-4" /> Paiement sécurisé
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ReservationSummary reservation={reservation} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Paiement sécurisé</h3>
                  <p className="text-sm text-slate-400">Aucune donnée sensible n'est stockée</p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-emerald-300">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Aucun numéro de carte stocké</p>
                    <p className="text-xs text-slate-400 mt-1">Vos données bancaires ne transiteront pas par nos serveurs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-emerald-300">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Connexion chiffrée HTTPS</p>
                    <p className="text-xs text-slate-400 mt-1">Toutes les données sont chiffrées en transit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-emerald-300">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Authentification sécurisée</p>
                    <p className="text-xs text-slate-400 mt-1">Vérification de votre identité requise</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 sticky top-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-6">Confirmer le paiement</p>

              <div className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  {formatPriceTND(reservation.price || reservation.prix)}
                </h2>
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Montant:</span>
                    <span className="text-white font-medium">{formatPriceTND(reservation.price || reservation.prix)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Frais:</span>
                    <span className="text-white font-medium">Gratuit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-sm font-semibold text-slate-200">Moyen de paiement</p>
                {PAYMENT_METHODS.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex items-center gap-3 ${
                      selectedMethod === method.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-2xl">{method.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{method.label}</p>
                      <p className="text-xs text-slate-400">{method.description}</p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition ${
                        selectedMethod === method.id
                          ? "border-emerald-400 bg-emerald-500"
                          : "border-slate-600"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={submitPayment}
                disabled={isSubmitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed py-3 rounded-2xl font-semibold text-white transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Confirmer le paiement
                  </>
                )}
              </motion.button>

              <button
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="w-full mt-3 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 py-3 rounded-2xl font-medium text-slate-200 transition"
              >
                Annuler
              </button>

              <div className="mt-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
                <p className="text-xs text-slate-400 text-center">
                  Cette action effectuera un paiement de <span className="font-semibold text-white">{formatPriceTND(reservation.price || reservation.prix)}</span> sur le compte confirmé.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSubmitting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
        )}
      </AnimatePresence>
    </div>
  );
};

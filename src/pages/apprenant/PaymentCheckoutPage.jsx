import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Download,
  Lock,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationContext";
import { ToastMessage } from "../../components/UI/ToastMessage";
import { formatPriceTND } from "../../utils/formatPrice";

const CARD_TYPES = [
  { id: "visa", label: "Visa", description: "Cartes internationales", badge: "VISA", tone: "from-blue-500 to-sky-500" },
  { id: "mastercard", label: "Mastercard", description: "Paiements globaux", badge: "MC", tone: "from-orange-500 to-rose-500" },
  { id: "amex", label: "American Express", description: "Premium & business", badge: "AMEX", tone: "from-sky-500 to-cyan-500" },
  { id: "edinar", label: "e-DINAR", description: "Cartes tunisiennes", badge: "ED", tone: "from-emerald-500 to-teal-500" },
  { id: "cib", label: "Carte CIB", description: "Réseau national", badge: "CIB", tone: "from-slate-600 to-slate-800" },
  { id: "tunisian", label: "Carte bancaire tunisienne", description: "Paiement local sécurisé", badge: "TN", tone: "from-indigo-500 to-violet-500" },
];

const initialForm = {
  cardNumber: "",
  cardHolder: "",
  expiry: "",
  cvv: "",
  country: "Tunisie",
  billingAddress: "",
  postalCode: "",
  phone: "",
  email: "",
  saveCard: false,
  acceptTerms: false,
};

const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};
const detectCardType = (value) => {
  const digits = value.replace(/\s/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]|7[0-1]|72)/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "visa";
};

const validate = (form) => {
  const errors = {};
  if (form.cardNumber.replace(/\s/g, "").length < 13) errors.cardNumber = "Numéro de carte invalide";
  if (form.cardHolder.trim().length < 3) errors.cardHolder = "Nom du titulaire requis";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) errors.expiry = "Format MM/AA requis";
  if (!/^[0-9]{3,4}$/.test(form.cvv)) errors.cvv = "CVV invalide";
  if (!form.country) errors.country = "Pays requis";
  if (form.billingAddress.trim().length < 5) errors.billingAddress = "Adresse de facturation requise";
  if (!/^[0-9]{3,6}$/.test(form.postalCode)) errors.postalCode = "Code postal invalide";
  if (!/^\+?[0-9]{8,15}$/.test(form.phone.replace(/\s/g, ""))) errors.phone = "Téléphone invalide";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Email invalide";
  if (!form.acceptTerms) errors.acceptTerms = "Veuillez accepter les conditions";
  return errors;
};

const inputStyles = (hasError) =>
  `w-full rounded-2xl border px-4 py-3 text-slate-100 outline-none transition ${
    hasError
      ? "border-rose-500 bg-rose-500/10 focus:border-rose-400 focus:ring-rose-500/10"
      : "border-slate-800 bg-slate-950/60 focus:border-emerald-500 focus:ring-emerald-500/10"
  }`;

const Field = ({ label, error, children }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-200">{label}</span>
    {children}
    {error ? <span className="text-xs text-rose-400">{error}</span> : null}
  </label>
);

const SummaryBox = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-medium text-white">{value}</p>
  </div>
);

const Detail = ({ label, value, highlight = false }) => (
  <div className={`rounded-2xl border p-3 ${highlight ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800 bg-slate-900/60"}`}>
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`mt-1 font-medium ${highlight ? "text-emerald-300" : "text-slate-100"}`}>{value}</p>
  </div>
);

const brandStyles = {
  visa: "from-sky-600 via-blue-700 to-slate-950 text-white",
  mastercard: "from-orange-500 via-rose-600 to-slate-950 text-slate-100",
  amex: "from-slate-900 via-cyan-700 to-sky-500 text-white",
  edinar: "from-emerald-600 via-teal-600 to-slate-950 text-white",
  cib: "from-slate-800 via-slate-900 to-slate-950 text-slate-100",
  tunisian: "from-indigo-600 via-violet-700 to-slate-950 text-white",
};

const CardPreview = ({ type, number, holder, expiry }) => {
  const brandLabel = CARD_TYPES.find((card) => card.id === type)?.label || "Visa";
  const formattedNumber = number.padEnd(19, "•");
  return (
    <motion.div layout className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br ${brandStyles[type] || brandStyles.visa} p-6 shadow-2xl shadow-slate-950/40`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_35%)]" />
      <div className="relative flex items-center justify-between text-sm uppercase tracking-[0.3em] text-slate-200/80">
        <span className="font-semibold">{brandLabel}</span>
        <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-semibold">{type.toUpperCase()}</span>
      </div>
      <div className="relative mt-8 flex h-10 w-16 items-center justify-center rounded-3xl bg-white/15 text-xs uppercase tracking-[0.3em] text-slate-100">
        <span>Chip</span>
      </div>
      <div className="relative mt-8 text-2xl tracking-[0.35em] text-slate-100">{formattedNumber}</div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-200/70">Titulaire</p>
          <p className="mt-2 text-sm font-semibold uppercase text-white">{holder || "NOM DU TITULAIRE"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-200/70">Validité</p>
          <p className="mt-2 text-sm font-semibold text-white">{expiry || "MM/AA"}</p>
        </div>
      </div>
    </motion.div>
  );
};

const validateField = (key, value) => {
  switch (key) {
    case "cardNumber":
      return value.replace(/\s/g, "").length < 13 ? "Numéro de carte invalide" : undefined;
    case "cardHolder":
      return value.trim().length < 3 ? "Nom du titulaire requis" : undefined;
    case "expiry":
      return !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? "Format MM/AA requis" : undefined;
    case "cvv":
      return !/^[0-9]{3,4}$/.test(value) ? "CVV invalide" : undefined;
    case "country":
      return !value ? "Pays requis" : undefined;
    case "billingAddress":
      return value.trim().length < 5 ? "Adresse de facturation requise" : undefined;
    case "postalCode":
      return !/^[0-9]{3,6}$/.test(value) ? "Code postal invalide" : undefined;
    case "phone":
      return !/^\+?[0-9]{8,15}$/.test(value.replace(/\s/g, "")) ? "Téléphone invalide" : undefined;
    case "email":
      return !/^\S+@\S+\.\S+$/.test(value) ? "Email invalide" : undefined;
    case "acceptTerms":
      return value ? undefined : "Veuillez accepter les conditions";
    default:
      return undefined;
  }
};

const ReservationSummary = ({ reservation }) => (
  <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5 shadow-2xl shadow-slate-950/30">
    <div className="flex items-center gap-3">
      <img src={reservation.image || "/images/formation-placeholder.svg"} alt={reservation.titre} className="h-20 w-20 rounded-2xl object-cover" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Résumé de la réservation</p>
        <h2 className="mt-1 text-xl font-semibold text-white">{reservation.titre}</h2>
        <p className="text-sm text-slate-400">{reservation.centreNom} · {reservation.ville}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
      <Detail label="Durée" value={reservation.duree} />
      <Detail label="Prix" value={formatPriceTND(reservation.prix)} />
      <Detail label="Date de réservation" value={new Date(reservation.dateReservation || Date.now()).toLocaleDateString("fr-FR")} />
      <Detail label="Numéro de réservation" value={reservation.id} />
      <Detail label="Mode de paiement" value={reservation.modePaiement || "Carte"} />
      {reservation.reduction ? (
        <Detail
          label="Réduction"
          value={typeof reservation.reduction === "number" ? formatPriceTND(reservation.reduction) : reservation.reduction}
        />
      ) : null}
      <Detail label="Total" value={formatPriceTND(reservation.prix)} highlight />
    </div>
  </div>
);

export const PaymentCheckoutPage = () => {
  const { reservationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { payerReservation, getReservationById, isHydrated } = useReservations();

  const reservation = useMemo(() => state?.reservation || getReservationById(reservationId), [state, getReservationById, reservationId]);
  const [selectedCardType, setSelectedCardType] = useState("visa");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (reservation?.paymentMethodKey) {
      setSelectedCardType(detectCardType(reservation.paymentMethodKey));
    }
  }, [reservation]);

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
            <p className="text-slate-400">Chargement du paiement...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const handleCardNumberChange = (value) => {
    setSelectedCardType(detectCardType(value));
    handleChange("cardNumber", formatCardNumber(value));
  };

  const handleExpiryChange = (value) => handleChange("expiry", formatExpiry(value));

  const submitPayment = async () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setToast("Veuillez corriger les champs signalés.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await payerReservation(reservation.id, selectedCardType);
      setConfirmation({ ...reservation, ...updated, amountPaid: updated.price });
      setIsSuccess(true);
    } catch (error) {
      setToast(error?.status === 409 ? "Cette réservation est déjà payée." : "Le paiement n’a pas pu être finalisé.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && confirmation) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 rounded-full bg-emerald-500/15 p-4 text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-semibold">Paiement réussi</h1>
              <p className="mt-2 text-slate-400">Votre réservation a été confirmée.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SummaryBox label="Numéro de transaction" value={confirmation.transactionId} />
              <SummaryBox label="Numéro de réservation" value={confirmation.id} />
              <SummaryBox label="Formation réservée" value={confirmation.titre} />
              <SummaryBox label="Centre" value={confirmation.centreNom} />
              <SummaryBox label="Date" value={new Date(confirmation.dateReservation || Date.now()).toLocaleDateString("fr-FR")} />
              <SummaryBox label="Montant payé" value={formatPriceTND(confirmation.amountPaid || confirmation.prix)} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800">
                <Download className="h-4 w-4" /> Télécharger la facture
              </button>
              <button onClick={() => navigate("/reservations")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                Voir mes réservations
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
      <ToastMessage message={toast} onClose={() => setToast("")} type="error" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <Lock className="h-4 w-4" /> Paiement sécurisé SSL
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <ReservationSummary reservation={reservation} />

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-lg font-semibold">Paiement sécurisé</h3>
                  <p className="text-sm text-slate-400">Vos données sont chiffrées et protégées.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Moyen de paiement</p>
                  <h1 className="mt-2 text-2xl font-semibold text-white">Choisissez votre moyen de paiement</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Sélectionnez une carte pour finaliser votre commande avec un design premium et sécurisé.</p>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-500">Étape 1 sur 2</span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {CARD_TYPES.map((card) => (
                  <motion.button
                    key={card.id}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCardType(card.id)}
                    className={`group rounded-3xl border p-4 text-left transition ${
                      selectedCardType === card.id
                        ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                        : "border-slate-800 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-xs font-bold text-white`}>{card.badge}</div>
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-white">{card.label}</p>
                      <p className="mt-1 text-xs text-slate-400">{card.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <span className={`h-2.5 w-2.5 rounded-full ${selectedCardType === card.id ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span>{selectedCardType === card.id ? "Sélectionné" : "Cliquez pour sélectionner"}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400 sm:flex-row sm:items-center">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span className="flex-1">Paiement SSL sécurisé · Données chiffrées · Protection des informations bancaires</span>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
                <CardPreview type={selectedCardType} number={form.cardNumber || "•••• •••• •••• ••••"} holder={form.cardHolder} expiry={form.expiry} />
              </div>

              <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Numéro de carte" error={errors.cardNumber}>
                      <input
                        value={form.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        className={inputStyles(!!errors.cardNumber)}
                      />
                    </Field>
                    <Field label="Nom du titulaire" error={errors.cardHolder}>
                      <input
                        value={form.cardHolder}
                        onChange={(e) => handleChange("cardHolder", e.target.value.toUpperCase())}
                        placeholder="AMINE BEN SALAH"
                        className={inputStyles(!!errors.cardHolder)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Date d'expiration (MM/AA)" error={errors.expiry}>
                      <input
                        value={form.expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="08/26"
                        inputMode="numeric"
                        className={inputStyles(!!errors.expiry)}
                      />
                    </Field>
                    <Field label="CVV" error={errors.cvv}>
                      <input
                        value={form.cvv}
                        onChange={(e) => handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        inputMode="numeric"
                        className={inputStyles(!!errors.cvv)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Pays" error={errors.country}>
                      <select
                        value={form.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        className={inputStyles(!!errors.country)}
                      >
                        <option>Tunisie</option>
                        <option>France</option>
                        <option>Maroc</option>
                        <option>Algérie</option>
                        <option>Autre</option>
                      </select>
                    </Field>
                    <Field label="Code postal" error={errors.postalCode}>
                      <input
                        value={form.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="1000"
                        inputMode="numeric"
                        className={inputStyles(!!errors.postalCode)}
                      />
                    </Field>
                  </div>

                  <Field label="Adresse de facturation" error={errors.billingAddress}>
                    <input
                      value={form.billingAddress}
                      onChange={(e) => handleChange("billingAddress", e.target.value)}
                      placeholder="12 Rue de Paris, Tunis"
                      className={inputStyles(!!errors.billingAddress)}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Téléphone" error={errors.phone}>
                      <input
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+216 98 000 000"
                        inputMode="tel"
                        className={inputStyles(!!errors.phone)}
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="email@exemple.com"
                        type="email"
                        className={inputStyles(!!errors.email)}
                      />
                    </Field>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/40 p-4">
                    <label className="flex items-center gap-3 text-sm text-slate-300">
                      <input type="checkbox" checked={form.saveCard} onChange={(e) => handleChange("saveCard", e.target.checked)} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                      Sauvegarder cette carte
                    </label>
                    <label className="flex items-center gap-3 text-sm text-slate-300">
                      <input type="checkbox" checked={form.acceptTerms} onChange={(e) => handleChange("acceptTerms", e.target.checked)} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                      Accepter les conditions
                    </label>
                    {errors.acceptTerms ? <p className="text-xs text-rose-400">{errors.acceptTerms}</p> : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2 text-slate-200">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" /> Données chiffrées
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Vos informations bancaires restent privées.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Wifi className="h-4 w-4 text-slate-300" /> SSL & HTTPS
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Connexion sécurisée et chiffrée.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Sparkles className="h-4 w-4 text-emerald-400" /> Protection renforcée
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Votre paiement est protégé et fiable.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => navigate(-1)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-800 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800">
                    <ChevronLeft className="h-4 w-4" /> Retour
                  </button>
                  <button onClick={() => navigate("/reservations")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-800 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800">
                    Annuler
                  </button>
                  <button onClick={submitPayment} className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                    <ChevronRight className="h-4 w-4" /> Payer maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSubmitting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-[28px] border border-slate-800 bg-slate-900 px-8 py-10 text-center shadow-2xl">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              <p className="text-lg font-medium">Traitement sécurisé en cours...</p>
              <p className="mt-2 text-sm text-slate-400">Veuillez patienter pendant la validation de votre paiement.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import { messagingService } from "../services/messagingService";
import { useTranslation } from "react-i18next";
import { formationsService } from "../services/formationsService";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationContext";
import { ToastMessage } from "../components/UI/ToastMessage";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  ArrowLeft,
  Check,
  Briefcase,
  Play,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  CheckCircle,
  BookOpen,
  Users,
  Shield,
  Info,
} from "lucide-react";
import { formatPriceTND } from "../utils/formatPrice";

const PAYMENT_OPTIONS = [
  { key: "online_card", label: "En ligne par carte" },
  { key: "bank_transfer", label: "Virement" },
  { key: "on_site", label: "Sur place au centre" },
];

const BOOKING_STEPS = ["Session", "Paiement", "Confirmation"];

const ModalShell = ({ open, title, onClose, children, size = "xl" }) => {
  if (!open) return null;

  const widthClass = size === "2xl" ? "max-w-6xl" : size === "lg" ? "max-w-4xl" : "max-w-2xl";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-3 py-6 backdrop-blur-sm">
      <div className={`relative w-full ${widthClass} overflow-hidden rounded-[28px] border border-slate-700 bg-slate-900 shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

const StarRow = ({ rating = 0 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-500"} size={14} />
    ))}
  </div>
);

export const FormationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formation, setFormation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [similar, setSimilar] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online_card");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const { user, isAuthenticated } = useAuth();
  const { addReservation } = useReservations();

  const bookingSessions = useMemo(() => formation?.bookingSessions || [], [formation?.bookingSessions]);
  const selectedSession = useMemo(
    () => bookingSessions.find((session) => session.id === selectedSessionId) || bookingSessions[0] || null,
    [bookingSessions, selectedSessionId]
  );

  useEffect(() => {
    if (formation?.bookingSessions?.[0] && !selectedSessionId) {
      setSelectedSessionId(formation.bookingSessions[0].id);
    }
  }, [formation, selectedSessionId]);

  useEffect(() => {
    const loadFormation = async () => {
      try {
        const [formationData, reviewsData, allFormations] = await Promise.all([
          formationsService.getById(id),
          formationsService.getReviews(id),
          formationsService.getAll(),
        ]);
        setFormation(formationData);
        setReviews(reviewsData);
        setSimilar(allFormations.filter((item) => item.id !== id && item.domain === formationData.domain).slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFormation();
  }, [id]);

  const handleContactCentre = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    onContactCenter();
  };

  const openBookingModal = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!["learner", "apprenant"].includes(user?.role)) {
      setToastType("error");
      setToast("Seuls les apprenants peuvent faire des réservations.");
      return;
    }

    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingStep(1);
  };

  const onReserveSuccess = (courseId) => {
    setToastType("success");
    setToast(`Réservation validée pour la formation ${courseId}.`);
  };

  const onContactCenter = (centerId) => {
    const centreName = formation?.centre?.name || "Tech Academy Tunis";
    const conversation = messagingService.createDirectConversation({
      learnerId: user.id,
      centreId: centerId,
      participantName: centreName,
      participantAvatar: formation?.centre?.logo || null,
      formationId: formation?.id,
      formationTitle: formation?.title,
      formationPrice: formation?.price || 0,
      subject: `Question sur ${formation?.title}`,
      initialMessage: `Bonjour, j’ai une question sur la formation ${formation?.title}.`,
    });

    navigate(`/messagerie?conversation=${conversation.id}&formationId=${formation?.id}&subject=${encodeURIComponent(`Question sur ${formation?.title}`)}&centerId=${centerId}`);
  };

  const handleReserve = async () => {
    console.log("1 - clic: handleReserve");
    try {
      const created = await addReservation({ formationId: formation.id });
      onReserveSuccess(created?.id || formation.id);
      closeBookingModal();
      window.setTimeout(() => navigate("/reservations"), 900);
    } catch (error) {
      setToastType("error");
      setToast(
        error?.status === 409
          ? "Cette formation est déjà réservée."
          : error?.status === 404
          ? "Cette formation n'est plus disponible."
          : "Impossible de créer la réservation. Réessayez dans quelques instants."
      );
    }
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (newReview.comment.trim().length < 10) {
      alert("Le commentaire doit faire au moins 10 caractères");
      return;
    }

    try {
      const review = await formationsService.addReview(id, {
        rating: newReview.rating,
        comment: newReview.comment,
        userId: user.id,
        userName: user.name,
      });
      setReviews([...reviews, review]);
      setNewReview({ rating: 5, comment: "" });
      alert("Avis ajouté avec succès!");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Formation non trouvée</p>
        <Link to="/formations" className="text-teal-600 hover:text-teal-700">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <ToastMessage message={toast} type={toastType} onClose={() => setToast("")} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/formations")}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 mb-6 transition"
        >
          <ArrowLeft /> {t('common.back')}
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mb-6">
          <img
            src={formation.image}
            alt={formation.title}
            className="w-full h-64 sm:h-96 object-cover"
          />

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              {formation.title}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="text-teal-600" /> {formation.city}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="text-teal-600" /> {formation.duration}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="text-teal-600" /> {formatPriceTND(formation.price)}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="text-yellow-400 fill-yellow-400" />
                {formation.averageRating}
              </div>
            </div>

            {formation.centre && (
              <div className="mb-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                    <img src={formation.centre.logo} alt={formation.centre.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{t('detail.offeredBy')}</p>
                    <Link to={`/centres/${formation.centre.id}`} className="font-semibold text-teal-600 hover:text-teal-700">{formation.centre.name}</Link>
                  </div>
                </div>
              </div>
            )}

            {formation.offreStage && (
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  <Briefcase size={14} /> {t('common.stageBadge')}
                </span>
                {formation.entreprisesPartenaires?.map((enterprise) => (
                  <span key={enterprise} className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:text-slate-200">{enterprise}</span>
                ))}
              </div>
            )}

            <p className="text-gray-600 dark:text-slate-300 mb-6">{formation.description}</p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={openBookingModal}
                disabled={formation.availablePlaces === 0}
                className="px-8 py-3 rounded-lg bg-emerald-500 text-white font-medium transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                Réserver maintenant
              </button>
              <button
                onClick={handleContactCentre}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500 px-8 py-3 font-medium text-emerald-400 transition hover:bg-emerald-500/10 dark:hover:bg-slate-700"
              >
                <MessageCircle size={16} />
                Poser une question au centre
              </button>
              <button
                onClick={() => setIsDetailModalOpen(true)}
                className="px-8 py-3 rounded-lg border border-slate-600 text-slate-200 font-medium transition hover:bg-slate-800"
              >
                Plus d'infos
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            {[
              { id: "overview", label: t('detail.about') },
              { id: "program", label: t('detail.program') },
              { id: "reviews", label: t('detail.reviews') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-slate-100">{t('detail.about')}</h3>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                    {formation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-slate-700/70 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-slate-300">Durée</p>
                    <p className="font-bold text-gray-900 dark:text-slate-100">{formation.duration}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-slate-700/70 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-slate-300">Places disponibles</p>
                    <p className="font-bold text-gray-900 dark:text-slate-100">
                      {formation.availablePlaces}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-slate-700/70 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-slate-300">Domaine</p>
                    <p className="font-bold text-gray-900 dark:text-slate-100">{formation.domain}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Program Tab */}
            {activeTab === "program" && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">{t('detail.program')}</h3>
                <ul className="space-y-3">
                  {formation.program.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <Check className="text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Add Review */}
                {isAuthenticated && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <h4 className="font-bold mb-4 text-gray-900 dark:text-slate-100">{t('detail.addReview')}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                          {t('detail.rating')}
                        </label>
                        <select
                          value={newReview.rating}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              rating: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} étoile{n > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-200">
                          {t('detail.comment')}
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                          placeholder="Partagez votre expérience..."
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <button
                        onClick={handleAddReview}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                      >
                        {t('detail.publish')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div>
                  <h4 className="font-bold mb-4 text-gray-900 dark:text-slate-100">
                    {t('detail.reviews')} ({reviews.length})
                  </h4>
                  {reviews.length === 0 ? (
                    <p className="text-gray-600 dark:text-slate-300">{t('detail.noReviews')}</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-l-4 border-teal-600 pl-4 py-2"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-gray-900 dark:text-slate-100">
                              {review.userName}
                            </h5>
                            <div className="flex gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="fill-yellow-400 text-yellow-400"
                                  size={16}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-slate-300 text-sm mb-2">
                            {review.date}
                          </p>
                          <p className="text-gray-700 dark:text-slate-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">{t('detail.partnerships')}</h3>
            {formation.offreStage ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {formation.entreprisesPartenaires?.map((enterprise) => (
                    <span key={enterprise} className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">{enterprise}</span>
                  ))}
                </div>
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:text-slate-300">
                  Un parcours orienté emploi avec attestation cosignée par le centre et l’entreprise partenaire.
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-slate-300">Aucune offre de stage à afficher pour cette formation.</p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Progression</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
                <span>Modules complétés</span>
                <span>68%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-700">
                <div className="h-2 w-[68%] rounded-full bg-teal-600" />
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 text-teal-600"><Play /> Aperçu vidéo</div>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">Mini présentation du parcours disponible dès maintenant.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">{t('detail.similar')}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {similar.map((item) => (
              <Link key={item.id} to={`/formations/${item.id}`} className="rounded-lg border border-gray-200 dark:border-slate-700 p-4 hover:border-teal-500 transition">
                <h4 className="font-semibold text-gray-900 dark:text-slate-100">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ModalShell open={isBookingModalOpen} onClose={closeBookingModal} title="Réservation guidée" size="lg">
        <div className="space-y-6 text-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {BOOKING_STEPS.map((stepLabel, index) => (
              <div key={stepLabel} className={`flex items-center gap-2 ${index === 0 ? '' : 'ml-1'}`}>
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${bookingStep === index + 1 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{index + 1}</span>
                <span>{stepLabel}</span>
                {index < BOOKING_STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-600" />}
              </div>
            ))}
          </div>

          {bookingStep === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><Calendar className="h-4 w-4 text-emerald-400" /> Choisissez votre session</div>
                <div className="space-y-3">
                  {bookingSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      disabled={session.full}
                      className={`w-full rounded-2xl border p-4 text-left transition ${selectedSession?.id === session.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'} ${session.full ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-100">{session.label}</div>
                          <div className="mt-1 text-sm text-slate-400">{session.time} · {session.location}</div>
                        </div>
                        <div className="text-right text-sm text-slate-300">
                          <div>{session.placesLeft} place{session.placesLeft > 1 ? 's' : ''} restante{session.placesLeft > 1 ? 's' : ''}</div>
                          {session.full && <div className="text-rose-400">Complet</div>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                  <button onClick={() => setBookingStep(2)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                  Continuer <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><CreditCard className="h-4 w-4 text-emerald-400" /> Récapitulatif et paiement</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-900 p-4">
                    <div className="text-sm text-slate-400">Session choisie</div>
                    <div className="mt-1 font-semibold text-slate-100">{selectedSession?.label}</div>
                    <div className="mt-2 text-sm text-slate-400">{selectedSession?.date}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-900 p-4">
                    <div className="text-sm text-slate-400">Prix</div>
                    <div className="mt-1 text-2xl font-bold text-white">{formatPriceTND(formation.price)}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {PAYMENT_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedPaymentMethod(option.key)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${selectedPaymentMethod === option.key ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'}`}
                    >
                      <span className="font-medium text-slate-100">{option.label}</span>
                      {selectedPaymentMethod === option.key && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => setBookingStep(1)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
                  <ChevronLeft /> Retour
                </button>
                <button onClick={() => setBookingStep(3)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                  Valider le paiement <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200"><CheckCircle className="h-4 w-4 text-emerald-400" /> Confirmation</div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p><span className="text-slate-500">Formation:</span> {formation.title}</p>
                  <p><span className="text-slate-500">Session:</span> {selectedSession?.label}</p>
                  <p><span className="text-slate-500">Paiement:</span> {PAYMENT_OPTIONS.find((option) => option.key === selectedPaymentMethod)?.label}</p>
                </div>
                <div className="mt-4 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  En validant, la réservation sera enregistrée dans <strong>Mes Réservations</strong> et une notification de succès sera affichée.
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => setBookingStep(2)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
                  <ChevronLeft /> Retour
                </button>
                <button onClick={handleReserve} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                  Confirmer la réservation <CheckCircle />
                </button>
              </div>
            </div>
          )}
        </div>
      </ModalShell>

      <ModalShell open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Détails complets de la formation" size="2xl">
        <div className="space-y-6 text-slate-100">
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><BookOpen className="h-4 w-4 text-emerald-400" /> Programme module par module</div>
              <div className="space-y-3">
                {formation.program?.map((module, index) => (
                  <div key={module} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    <span className="mr-2 font-semibold text-emerald-400">{index + 1}.</span>{module}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><Info className="h-4 w-4 text-emerald-400" /> Prérequis techniques</div>
              <div className="space-y-2 text-sm text-slate-300">
                {(formation.prerequisites || ["Notions de base en JavaScript", "Ordinateur portable recommandé"]).map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-900 px-4 py-3">{item}</div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><Users className="h-4 w-4 text-emerald-400" /> Formateurs certifiés - Tech Academy Tunis</div>
              <div className="space-y-3">
                {(formation.trainers || []).map((trainer) => (
                  <div key={trainer.name} className="rounded-2xl bg-slate-900 p-4">
                    <div className="font-semibold text-white">{trainer.name}</div>
                    <div className="text-sm text-slate-400">{trainer.role}</div>
                    <div className="mt-1 text-xs text-emerald-300">{trainer.certification}</div>
                    <p className="mt-2 text-sm text-slate-300">{trainer.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><Star className="h-4 w-4 text-amber-400" /> Avis détaillés des apprenants</div>
              <div className="space-y-3">
                {(formation.detailedReviews || []).map((review) => (
                  <div key={review.author} className="rounded-2xl bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{review.author}</div>
                        <div className="text-xs text-slate-400">{review.role}</div>
                      </div>
                      <StarRow rating={review.rating} />
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700 bg-slate-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><Shield className="h-4 w-4 text-emerald-400" /> Politique d'annulation / remboursement</div>
            <div className="space-y-2 text-sm text-slate-300">
              {(formation.cancellationPolicy || ["Annulation gratuite jusqu'à 72 h avant la session."]).map((item) => (
                <div key={item} className="rounded-2xl bg-slate-900 px-4 py-3">{item}</div>
              ))}
            </div>
          </section>
        </div>
      </ModalShell>

      <ModalShell open={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Poser une question au centre" size="lg">
        <div className="space-y-4 text-slate-100">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-300">
            Vous allez ouvrir le canal de messagerie direct avec <strong className="text-white">Tech Academy Tunis</strong> et pré-remplir l’objet lié à cette formation.
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsQuestionModalOpen(false)} className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
              Annuler
            </button>
            <button onClick={() => setIsQuestionModalOpen(false)} className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
              Ouvrir Messages
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
};

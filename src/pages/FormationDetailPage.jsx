import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { messagingService } from "../services/messagingService";
import { useTranslation } from "react-i18next";
import { formationsService } from "../services/formationsService";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationContext";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiStar,
  FiArrowLeft,
  FiCheck,
  FiBriefcase,
  FiPlay,
  FiMessageCircle,
} from "react-icons/fi";
import { formatPriceTND } from "../utils/formatPrice";

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
  const { user, isAuthenticated } = useAuth();
  const { addReservation } = useReservations();

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

    const centreId = formation?.centre?.id || 'centre-1';
    const conversation = messagingService.createDirectConversation({
      learnerId: user.id,
      centreId,
      formationId: formation?.id,
      initialMessage: `Bonjour, j’ai une question sur la formation ${formation?.title}.`,
    });

    navigate(`/messagerie?conversation=${conversation.id}`);
  };

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user.role !== "learner") {
      alert("Seuls les apprenants peuvent faire des réservations");
      return;
    }

    addReservation(formation, user.id);
    alert("Formation réservée avec succès!");
    navigate("/reservations");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/formations")}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 mb-6 transition"
        >
          <FiArrowLeft /> {t('common.back')}
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
                <FiMapPin className="text-teal-600" /> {formation.city}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiClock className="text-teal-600" /> {formation.duration}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiDollarSign className="text-teal-600" /> {formatPriceTND(formation.price)}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiStar className="text-yellow-400 fill-yellow-400" />
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
                  <FiBriefcase size={14} /> {t('common.stageBadge')}
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
                onClick={handleReserve}
                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
              >
                {t('detail.reserve')}
              </button>
              <button
                onClick={handleContactCentre}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-600 px-8 py-3 font-medium text-teal-600 transition hover:bg-teal-50 dark:hover:bg-slate-700"
              >
                <FiMessageCircle size={16} />
                Poser une question au centre
              </button>
              <a
                href="#payment"
                className="px-8 py-3 border border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition"
              >
                {t('detail.moreInfo')}
              </a>
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
                      <FiCheck className="text-green-600 flex-shrink-0 mt-1" />
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
                                <FiStar
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
                <div className="flex items-center gap-2 text-teal-600"><FiPlay /> Aperçu vidéo</div>
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
    </div>
  );
};

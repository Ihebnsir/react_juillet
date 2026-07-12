import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
} from "react-icons/fi";

export const FormationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const { user, isAuthenticated } = useAuth();
  const { addReservation } = useReservations();

  useEffect(() => {
    const loadFormation = async () => {
      try {
        const [formationData, reviewsData] = await Promise.all([
          formationsService.getById(id),
          formationsService.getReviews(id),
        ]);
        setFormation(formationData);
        setReviews(reviewsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFormation();
  }, [id]);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/formations")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft /> Retour
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <img
            src={formation.image}
            alt={formation.title}
            className="w-full h-64 sm:h-96 object-cover"
          />

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
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
                <FiDollarSign className="text-teal-600" /> {formation.price} DT
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                {formation.averageRating}
              </div>
            </div>

            <p className="text-gray-600 mb-6">{formation.description}</p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReserve}
                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
              >
                Réserver maintenant
              </button>
              <a
                href="#payment"
                className="px-8 py-3 border border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition"
              >
                Plus d'infos
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            {[
              { id: "overview", label: "Aperçu" },
              { id: "program", label: "Programme" },
              { id: "reviews", label: "Avis" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-600 hover:text-gray-900"
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
                  <h3 className="text-xl font-bold mb-3">À propos</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {formation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Durée</p>
                    <p className="font-bold text-gray-900">{formation.duration}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Places disponibles</p>
                    <p className="font-bold text-gray-900">
                      {formation.availablePlaces}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Domaine</p>
                    <p className="font-bold text-gray-900">{formation.domain}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Program Tab */}
            {activeTab === "program" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Programme</h3>
                <ul className="space-y-3">
                  {formation.program.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <FiCheck className="text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
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
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold mb-4">Ajouter un avis</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Note
                        </label>
                        <select
                          value={newReview.rating}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              rating: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} étoile{n > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Commentaire
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <button
                        onClick={handleAddReview}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                      >
                        Publier l'avis
                      </button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div>
                  <h4 className="font-bold mb-4">
                    Avis ({reviews.length})
                  </h4>
                  {reviews.length === 0 ? (
                    <p className="text-gray-600">Aucun avis pour le moment</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-l-4 border-teal-600 pl-4 py-2"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-gray-900">
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
                          <p className="text-gray-600 text-sm mb-2">
                            {review.date}
                          </p>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

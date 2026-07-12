import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationContext";
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { useState } from "react";

export const ReservationsPage = () => {
  const { user } = useAuth();
  const { cancelReservation, getUserReservations } = useReservations();
  const [cancelingId, setCancelingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");

  const userReservations = getUserReservations(user?.id || "");

  const handleCancelClick = (reservationId) => {
    setCancelingId(reservationId);
    setCancellationReason("");
  };

  const handleConfirmCancel = (reservationId) => {
    if (!cancellationReason.trim()) {
      alert("Veuillez entrer un motif d'annulation");
      return;
    }
    cancelReservation(reservationId, cancellationReason);
    setCancelingId(null);
  };

  if (userReservations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiCalendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              Vous n'avez pas encore réservé de formations
            </p>
            <Link
              to="/formations"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Explorer les formations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>

        <div className="space-y-4">
          {userReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {reservation.formationTitle}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {reservation.centerName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(reservation.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div
                    className={`px-4 py-2 rounded-lg text-center font-medium ${
                      reservation.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reservation.status === "confirmed"
                      ? "Confirmée"
                      : "Annulée"}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg text-center text-sm ${
                      reservation.paid
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {reservation.paid ? "Payée" : "En attente de paiement"}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {reservation.status === "confirmed" && (
                    <>
                      <button
                        onClick={() => handleCancelClick(reservation.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Annuler
                      </button>
                      {!reservation.paid && (
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                          Payer
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {cancelingId === reservation.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium mb-3">Motif d'annulation</p>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Pourquoi annulez-vous cette réservation?"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmCancel(reservation.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Confirmer l'annulation
                    </button>
                    <button
                      onClick={() => setCancelingId(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {reservation.cancellationReason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <p className="font-medium text-red-800 mb-1">Motif d'annulation :</p>
                  <p className="text-red-700">{reservation.cancellationReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

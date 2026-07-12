import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import { FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export const AdminVerificationsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await adminService.getVerificationRequests();
        setRequests(data);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleApprove = async (centerId) => {
    await adminService.approveCenterVerification(centerId);
    setRequests(requests.filter((r) => r.id !== centerId));
    alert("Centre approuvé!");
  };

  const handleReject = async (centerId) => {
    const reason = window.prompt(
      "Entrez le motif du rejet:"
    );
    if (reason) {
      await adminService.rejectCenterVerification(centerId, reason);
      setRequests(requests.filter((r) => r.id !== centerId));
      alert("Demande rejetée");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft /> Retour
        </Link>

        <h1 className="text-3xl font-bold mb-8">Validation des centres</h1>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              Aucune demande en attente de vérification
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {request.centerName}
                    </h3>
                    <p className="text-gray-600 text-sm">{request.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ville</p>
                    <p className="font-medium">{request.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Site web</p>
                    <a
                      href={request.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      Visiter
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </p>
                  <p className="text-gray-600">{request.description}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FiCheck size={20} /> Approuver
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <FiX size={20} /> Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

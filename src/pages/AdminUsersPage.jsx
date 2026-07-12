import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import { FiTrash2, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSuspend = async (userId) => {
    const reason = window.prompt("Motif de la suspension:");
    if (reason) {
      await adminService.suspendUser(userId, reason);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, suspended: true } : u
        )
      );
      alert("Utilisateur suspendu");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      await adminService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      alert("Utilisateur supprimé");
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

        <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left font-bold">Nom</th>
                <th className="px-6 py-4 text-left font-bold">Email</th>
                <th className="px-6 py-4 text-left font-bold">Rôle</th>
                <th className="px-6 py-4 text-left font-bold">Statut</th>
                <th className="px-6 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "learner"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "center"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.role === "learner"
                        ? "Apprenant"
                        : user.role === "center"
                        ? "Centre"
                        : "Admin"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.suspended ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <FiAlertCircle size={16} /> Suspendu
                      </div>
                    ) : (
                      <span className="text-green-600">Actif</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!user.suspended && user.role !== "admin" && (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="px-3 py-1 text-yellow-600 hover:bg-yellow-50 rounded transition text-sm"
                        >
                          Suspendre
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm"
                      >
                        <FiTrash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

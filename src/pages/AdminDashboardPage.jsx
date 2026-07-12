import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import {
  FiUsers,
  FiBook,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getStatistics();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const chartData = [
    {
      name: "Utilisateurs",
      value: stats?.totalUsers || 0,
    },
    {
      name: "Formations",
      value: stats?.totalFormations || 0,
    },
    {
      name: "Centres",
      value: stats?.totalCenters || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Utilisateurs",
              value: stats?.totalUsers,
              icon: FiUsers,
              color: "blue",
            },
            {
              title: "Apprenants",
              value: stats?.totalLearners,
              icon: FiUsers,
              color: "green",
            },
            {
              title: "Formations",
              value: stats?.totalFormations,
              icon: FiBook,
              color: "purple",
            },
            {
              title: "Centres Vérifiés",
              value: stats?.verifiedCenters,
              icon: FiCheckCircle,
              color: "teal",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const bgColor = {
              blue: "bg-blue-100",
              green: "bg-green-100",
              purple: "bg-purple-100",
              teal: "bg-teal-100",
            }[stat.color];

            const textColor = {
              blue: "text-blue-600",
              green: "text-green-600",
              purple: "text-purple-600",
              teal: "text-teal-600",
            }[stat.color];

            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${bgColor} p-4 rounded-full`}>
                    <Icon className={`${textColor} text-2xl`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Vue d'ensemble</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Modération",
              description: "Gérer les signalements et le contenu",
              href: "/admin/moderation",
              icon: "🚨",
            },
            {
              title: "Validation des centres",
              description: "Valider les centres de formation",
              href: "/admin/centres-verifies",
              icon: "✓",
            },
            {
              title: "Gestion des utilisateurs",
              description: "Gérer les comptes utilisateur",
              href: "/admin/utilisateurs",
              icon: "👥",
            },
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-3xl mb-3">{link.icon}</div>
              <h3 className="text-lg font-bold mb-2">{link.title}</h3>
              <p className="text-gray-600 text-sm">{link.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

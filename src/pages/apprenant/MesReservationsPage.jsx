import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationContext";
import { useNotifications } from "../../context/NotificationContext";
import { formationsService } from "../../services/formationsService";
import { formatPriceTND } from "../../utils/formatPrice";
import { ToastMessage } from "../../components/UI/ToastMessage";
import { jsPDF } from "jspdf";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiDownload,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiTrash2,
  FiFilter,
  FiEye,
  FiCreditCard,
  FiMessageSquare,
  FiSearch,
  FiClock,
  FiBookOpen,
  FiTarget,
  FiBarChart2,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiAward,
} from "react-icons/fi";

const STATUS_MAP = {
  confirmee: { label: "Confirmée", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border-emerald-200" },
  en_attente: { label: "En attente", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-amber-200" },
  terminee: { label: "Terminée", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200" },
  annulee: { label: "Annulée", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200" },
};

const FILTER_OPTIONS = [
  { value: "all", label: "Toutes" },
  { value: "confirmee", label: "Confirmées" },
  { value: "en_attente", label: "En attente" },
  { value: "terminee", label: "Terminées" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Plus récentes" },
  { value: "oldest", label: "Plus anciennes" },
];

const LEVEL_BADGES = {
  Débutant: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200",
  Intermédiaire: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
  Avancé: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatShortDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Generate professional PDF certificate
const generatePDFCertificate = (data) => {
  const doc = new jsPDF("landscape", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background - elegant border
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative border
  doc.setDrawColor(0, 150, 136);
  doc.setLineWidth(3);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30, "S");

  // Inner border
  doc.setDrawColor(200, 230, 225);
  doc.setLineWidth(0.5);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40, "S");

  // Top decorative line
  doc.setFillColor(0, 150, 136);
  doc.rect(15, 35, pageWidth - 30, 2, "F");

  // Bottom decorative line
  doc.rect(15, pageHeight - 45, pageWidth - 30, 2, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(0, 150, 136);
  doc.text("CERTIFICAT DE RÉUSSITE", pageWidth / 2, 65, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("SkillBridge - Plateforme de Formation", pageWidth / 2, 78, { align: "center" });

  // Decorative line below title
  doc.setDrawColor(0, 150, 136);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 40, 84, pageWidth / 2 + 40, 84);

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("Ce certificat est décerné à", pageWidth / 2, 105, { align: "center" });

  // Learner name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(40, 40, 40);
  doc.text(data.trainee || "Apprenant", pageWidth / 2, 125, { align: "center" });

  // For completing
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("Pour avoir complété avec succès la formation", pageWidth / 2, 145, { align: "center" });

  // Formation name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 150, 136);
  doc.text(data.formation || "", pageWidth / 2, 165, { align: "center" });

  // Centre name
  if (data.centreName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(100, 100, 100);
    doc.text(`Proposé par ${data.centreName}`, pageWidth / 2, 182, { align: "center" });
  }

  // Category
  if (data.formationCategory) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text(`Catégorie : ${data.formationCategory}`, pageWidth / 2, 195, { align: "center" });
  }

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Délivré le ${formatDate(data.issuedAt)}`, pageWidth / 2, 215, { align: "center" });

  // Certificate ID
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(160, 160, 160);
  doc.text(`ID : ${data.id}`, pageWidth / 2, 228, { align: "center" });

  // Signature line
  doc.setDrawColor(0, 150, 136);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 250, pageWidth / 2 + 40, 250);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("Signature SkillBridge", pageWidth / 2, 258, { align: "center" });

  // Bottom seal/decorative element
  doc.setFillColor(0, 150, 136);
  doc.circle(pageWidth / 2, pageHeight - 35, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("SB", pageWidth / 2, pageHeight - 32, { align: "center" });

  return doc;
};

export const MesReservationsPage = () => {
  const { user } = useAuth();
  const { getUserReservations, annulerReservation, payerReservation, getCertificateForReservation } = useReservations();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [enrichedReservations, setEnrichedReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawReservations = getUserReservations(user?.id || "");
        const allFormations = await formationsService.getAll();

        const enriched = rawReservations.map((reservation) => {
          const formation = allFormations.find((f) => f.id === reservation.formationId);
          const centre = formation?.centre || null;

          return {
            ...reservation,
            formationTitle: formation?.title || "Formation inconnue",
            formationImage: formation?.image || "/images/formation-placeholder.svg",
            centerName: centre?.name || "Centre inconnu",
            centerLogo: centre?.logo || "",
            formationPrice: formation?.price || reservation.price || 0,
            formationDuration: formation?.duration || "",
            formationModules: formation?.program?.length || 0,
            formationLevel: formation?.level || "Intermédiaire",
            formationProgress: formation?.progress || 0,
            formationCategory: formation?.categorie || formation?.category || "",
            history: reservation.history || [],
          };
        });

        setEnrichedReservations(enriched);
      } catch (err) {
        console.error("Erreur chargement réservations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, getUserReservations]);

  // Filter, search and sort
  const filteredAndSorted = useMemo(() => {
    let result = [...enrichedReservations];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.formationTitle.toLowerCase().includes(q) ||
          r.centerName.toLowerCase().includes(q) ||
          (r.formationCategory || "").toLowerCase().includes(q)
      );
    }

    // Status filter
    if (activeFilter !== "all") {
      result = result.filter((r) => r.status === activeFilter);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [enrichedReservations, activeFilter, sortBy, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const all = enrichedReservations;
    return {
      total: all.length,
      confirmee: all.filter((r) => r.status === "confirmee").length,
      en_attente: all.filter((r) => r.status === "en_attente").length,
      terminee: all.filter((r) => r.status === "terminee").length,
    };
  }, [enrichedReservations]);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (formationId) => {
    navigate(`/formations/${formationId}`);
  };

  const handleSeeFormation = (e, formationId) => {
    e.stopPropagation();
    navigate(`/formations/${formationId}`);
  };

  const handleCancelClick = (e, reservation) => {
    e.stopPropagation();
    setShowCancelModal(reservation);
    setCancelReason("");
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setToast({ type: "error", message: "Veuillez entrer un motif d'annulation" });
      return;
    }
    try {
      await annulerReservation(showCancelModal.id, cancelReason);
      setShowCancelModal(null);
      setCancelReason("");
      addNotification({
        userId: user?.id,
        role: "apprenant",
        title: "Réservation annulée",
        message: `Votre réservation pour "${showCancelModal.formationTitle}" a été annulée.`,
        category: "reservation",
      });
      setToast({ type: "success", message: "Réservation annulée avec succès" });
    } catch {
      setToast({ type: "error", message: "Erreur lors de l'annulation" });
    }
  };

  const handlePayClick = (e, reservation) => {
    e.stopPropagation();
    setShowPaymentModal(reservation);
  };

  const handleConfirmPayment = async () => {
    setPaymentProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      await payerReservation(showPaymentModal.id);
      setShowPaymentModal(null);
      setPaymentProcessing(false);
      addNotification({
        userId: user?.id,
        role: "apprenant",
        title: "Paiement confirmé",
        message: `Votre réservation pour "${showPaymentModal.formationTitle}" est maintenant confirmée.`,
        category: "payment",
      });
      setToast({ type: "success", message: "Paiement effectué avec succès !" });
    } catch {
      setPaymentProcessing(false);
      setToast({ type: "error", message: "Erreur lors du paiement" });
    }
  };

  const handleDownloadCertificate = async (e, reservation) => {
    e.stopPropagation();
    try {
      const certificate = await getCertificateForReservation(reservation.id, user?.name || "Apprenant");
      if (certificate) {
        const doc = generatePDFCertificate({
          id: certificate.id,
          trainee: certificate.trainee,
          formation: certificate.formation,
          centreName: certificate.centreName,
          formationCategory: certificate.formationCategory,
          issuedAt: certificate.issuedAt,
        });
        doc.save(`certificat-${reservation.formationId}.pdf`);

        addNotification({
          userId: user?.id,
          role: "apprenant",
          title: "Certificat prêt",
          message: `Votre certificat pour "${reservation.formationTitle}" est prêt.`,
          category: "certificate",
        });
        setToast({ type: "success", message: "Certificat téléchargé avec succès" });
      } else {
        setToast({ type: "error", message: "Certificat non disponible pour cette formation" });
      }
    } catch (err) {
      console.error("Erreur certificat:", err);
      setToast({ type: "error", message: "Erreur lors du téléchargement du certificat" });
    }
  };

  const handleReview = (e, reservation) => {
    e.stopPropagation();
    addNotification({
      userId: user?.id,
      role: "apprenant",
      title: "Ouverture avis",
      message: `Ouverture du formulaire d'avis pour "${reservation.formationTitle}".`,
      category: "review",
    });
    navigate(`/mes-avis?formationId=${reservation.formationId}`);
  };

  // Empty state variants
  const getEmptyState = () => {
    // No reservations at all
    if (enrichedReservations.length === 0 && !loading) {
      return {
        icon: FiCalendar,
        title: "Vous n'avez aucune réservation pour le moment",
        subtitle: "Explorez notre catalogue de formations et réservez celle qui correspond à vos objectifs.",
        action: "Découvrir les formations",
        onClick: () => navigate("/formations"),
      };
    }
    // Filter active but no results
    if (activeFilter !== "all" && filteredAndSorted.length === 0) {
      return {
        icon: FiFilter,
        title: "Aucune réservation avec ce filtre",
        subtitle: `Essayez de modifier votre filtre "${FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label}" pour voir plus de résultats.`,
        action: "Voir toutes les réservations",
        onClick: () => setActiveFilter("all"),
      };
    }
    // Search with no results
    if (searchQuery && filteredAndSorted.length === 0) {
      return {
        icon: FiSearch,
        title: "Aucun résultat trouvé",
        subtitle: `Aucune réservation ne correspond à "${searchQuery}". Essayez un autre terme de recherche.`,
        action: "Effacer la recherche",
        onClick: () => setSearchQuery(""),
      };
    }
    return null;
  };

  const emptyState = getEmptyState();

  // Empty state - no reservations at all
  if (!loading && enrichedReservations.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes réservations</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Suivez l'état de vos inscriptions en temps réel.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
            <FiCalendar size={36} className="text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-slate-100">
            Vous n'avez aucune réservation pour le moment
          </h3>
          <p className="mb-6 max-w-md text-sm text-gray-500 dark:text-slate-400">
            Explorez notre catalogue de formations et réservez celle qui correspond à vos objectifs.
          </p>
          <button
            onClick={() => navigate("/formations")}
            className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white shadow-lg shadow-teal-200/50 transition hover:bg-teal-700 dark:shadow-teal-900/30"
          >
            Découvrir les formations
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {toast.message && (
        <ToastMessage
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes réservations</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Suivez l'état de vos inscriptions en temps réel.</p>
        </div>
      </div>

      {/* KPI Stats with horizontal scroll on mobile */}
      {!loading && (
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 min-w-max sm:grid sm:grid-cols-4 sm:min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 min-w-[130px] sm:min-w-0"
            >
              <div className="flex items-center gap-2">
                <FiBarChart2 className="text-teal-600" size={18} />
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.total}</p>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Total réservations</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/10 min-w-[130px] sm:min-w-0"
            >
              <div className="flex items-center gap-2">
                <FiCheck className="text-emerald-600" size={18} />
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.confirmee}</p>
              </div>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Confirmées</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-amber-100 bg-amber-50 p-4 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10 min-w-[130px] sm:min-w-0"
            >
              <div className="flex items-center gap-2">
                <FiClock className="text-amber-600" size={18} />
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.en_attente}</p>
              </div>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">En attente</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10 min-w-[130px] sm:min-w-0"
            >
              <div className="flex items-center gap-2">
                <FiAward className="text-blue-600" size={18} />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.terminee}</p>
              </div>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Terminées</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Search + Filters + Sort */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par formation, centre ou catégorie..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filters - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === option.value
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <FiFilter size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Reservations list */}
          <AnimatePresence mode="popLayout">
            {filteredAndSorted.length === 0 && emptyState ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-slate-600"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                  <emptyState.icon size={28} className="text-gray-400 dark:text-slate-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-slate-100">{emptyState.title}</h3>
                <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-slate-400">{emptyState.subtitle}</p>
                <button
                  onClick={emptyState.onClick}
                  className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  {emptyState.action}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredAndSorted.map((reservation, index) => {
                  const statusInfo = STATUS_MAP[reservation.status] || STATUS_MAP.en_attente;
                  const isCancelled = reservation.status === "annulee";
                  const isExpanded = expandedCards[reservation.id];
                  const progress = reservation.formationProgress || 0;

                  return (
                    <motion.div
                      key={reservation.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => !isCancelled && handleCardClick(reservation.formationId)}
                      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 ${
                        isCancelled
                          ? "border-red-100 opacity-70 dark:border-red-900/30"
                          : "cursor-pointer hover:shadow-md hover:border-teal-200 dark:hover:border-teal-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48">
                          <img
                            src={reservation.formationImage}
                            alt={reservation.formationTitle}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/formation-placeholder.svg";
                            }}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isCancelled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white">
                                Annulée
                              </span>
                            </div>
                          )}
                          {/* Progress overlay for terminee/confirmee */}
                          {!isCancelled && progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                              <div className="flex items-center justify-between text-xs text-white">
                                <span>Progression</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    progress >= 100
                                      ? "bg-emerald-400"
                                      : "bg-teal-400"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between p-5">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 line-clamp-1">
                                {reservation.formationTitle}
                              </h3>
                              <span
                                className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>

                            {/* Main info badges */}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                                <FiMapPin size={12} />
                                {reservation.centerName}
                              </span>
                              {reservation.formationDuration && (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                                  <FiClock size={12} />
                                  {reservation.formationDuration}
                                </span>
                              )}
                              {reservation.formationModules > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                                  <FiBookOpen size={12} />
                                  {reservation.formationModules} modules
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                                <FiDollarSign size={12} />
                                {formatPriceTND(reservation.price || reservation.formationPrice)}
                              </span>
                            </div>

                            {/* Level badge */}
                            {reservation.formationLevel && !isCancelled && (
                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    LEVEL_BADGES[reservation.formationLevel] || "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  <FiTarget size={12} />
                                  {reservation.formationLevel}
                                </span>
                              </div>
                            )}

                            {/* Payment info for confirmed */}
                            {reservation.status === "confirmee" && reservation.paid && (
                              <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                  <FiCheck size={15} />
                                  Paiement confirmé
                                </div>
                                <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                                  <span>Montant : {formatPriceTND(reservation.price || reservation.formationPrice)}</span>
                                  {reservation.paymentDate && <span>Date : {formatShortDate(reservation.paymentDate)}</span>}
                                  {reservation.paymentMethod && <span>Méthode : {reservation.paymentMethod}</span>}
                                  {reservation.transactionId && <span>Transaction : {reservation.transactionId}</span>}
                                </div>
                              </div>
                            )}

                            {/* Cancellation reason */}
                            {isCancelled && reservation.cancellationReason && (
                              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                                <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
                                <p>{reservation.cancellationReason}</p>
                              </div>
                            )}

                            {/* Progress for terminee */}
                            {reservation.status === "terminee" && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Formation terminée</span>
                                  <span className="flex items-center gap-1">
                                    <FiCheck size={12} />
                                    Certificat disponible
                                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                                  <div className="h-full w-full rounded-full bg-emerald-400" />
                                </div>
                              </div>
                            )}

                            {/* Progress for confirmee */}
                            {reservation.status === "confirmee" && progress > 0 && progress < 100 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                                  <span>Formation en cours</span>
                                  <span>{progress}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                                  <div
                                    className="h-full rounded-full bg-teal-400 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Date */}
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                              <FiCalendar size={12} />
                              Réservé le {formatDate(reservation.date)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {!isCancelled && (
                              <button
                                onClick={(e) => handleSeeFormation(e, reservation.formationId)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-300 dark:hover:bg-teal-900/40"
                              >
                                <FiEye size={15} />
                                Voir la formation
                              </button>
                            )}

                            {/* En attente -> Payer */}
                            {reservation.status === "en_attente" && (
                              <>
                                <button
                                  onClick={(e) => handlePayClick(e, reservation)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40"
                                >
                                  <FiCreditCard size={15} />
                                  Payer maintenant
                                </button>
                                <button
                                  onClick={(e) => handleCancelClick(e, reservation)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                                >
                                  <FiTrash2 size={15} />
                                  Annuler
                                </button>
                              </>
                            )}

                            {/* Confirmée */}
                            {reservation.status === "confirmee" && (
                              <button
                                onClick={(e) => handleCancelClick(e, reservation)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                              >
                                <FiTrash2 size={15} />
                                Annuler la réservation
                              </button>
                            )}

                            {/* Terminée */}
                            {reservation.status === "terminee" && (
                              <>
                                <button
                                  onClick={(e) => handleDownloadCertificate(e, reservation)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                >
                                  <FiDownload size={15} />
                                  Télécharger le certificat
                                </button>
                                <button
                                  onClick={(e) => handleReview(e, reservation)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40"
                                >
                                  <FiMessageSquare size={15} />
                                  Laisser un avis
                                </button>
                              </>
                            )}

                            {/* Toggle history */}
                            {reservation.history && reservation.history.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(reservation.id);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                              >
                                {isExpanded ? (
                                  <>
                                    <FiChevronUp size={14} />
                                    Masquer l'historique
                                  </>
                                ) : (
                                  <>
                                    <FiTrendingUp size={14} />
                                    Voir l'historique
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* History timeline */}
                          <AnimatePresence>
                            {isExpanded && reservation.history && reservation.history.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 overflow-hidden"
                              >
                                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-slate-700 dark:bg-slate-700/30">
                                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                                    Historique de la réservation
                                  </p>
                                  <div className="relative pl-6">
                                    {/* Timeline line */}
                                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-slate-600" />

                                    {[...reservation.history]
                                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                                      .map((entry, idx) => {
                                        const iconMap = {
                                          payment: "💳",
                                          confirm: "✅",
                                          create: "📋",
                                          cancel: "❌",
                                          completed: "🎓",
                                        };
                                        return (
                                          <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="relative mb-4 last:mb-0"
                                          >
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[19px] top-1 h-3 w-3 rounded-full border-2 border-teal-500 bg-white dark:bg-slate-800" />
                                            <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                                              {entry.action}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">
                                              {formatDate(entry.date)}
                                            </p>
                                          </motion.div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowCancelModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Annuler la réservation</h3>
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              <p className="mb-4 text-sm text-gray-600 dark:text-slate-300">
                Êtes-vous sûr de vouloir annuler cette réservation pour{" "}
                <strong className="text-gray-900 dark:text-slate-100">{showCancelModal.formationTitle}</strong> ?
              </p>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Motif d'annulation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Veuillez indiquer la raison de votre annulation..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Retour
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Confirmer l'annulation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Paiement sécurisé</h3>
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src={showPaymentModal.formationImage}
                    alt={showPaymentModal.formationTitle}
                    className="h-14 w-14 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/formation-placeholder.svg";
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{showPaymentModal.formationTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{showPaymentModal.centerName}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-slate-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">Sous-total</span>
                    <span className="text-gray-700 dark:text-slate-300">
                      {formatPriceTND(showPaymentModal.price || showPaymentModal.formationPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">Taxe (0%)</span>
                    <span className="text-gray-700 dark:text-slate-300">0,00 TND</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-slate-600">
                    <span className="font-semibold text-gray-900 dark:text-slate-100">Total</span>
                    <span className="text-xl font-bold text-teal-600">
                      {formatPriceTND(showPaymentModal.price || showPaymentModal.formationPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {paymentProcessing ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
                  <p className="text-sm text-gray-600 dark:text-slate-300">Traitement du paiement en cours...</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(null)}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                  >
                    Payer {formatPriceTND(showPaymentModal.price || showPaymentModal.formationPrice)}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


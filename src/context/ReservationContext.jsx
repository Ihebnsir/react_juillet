import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { reservationsService } from "../services/reservationsService";
import { useAuth } from "./AuthContext";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const hydrate = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "apprenant") {
      setReservations([]);
      setIsHydrated(true);
      return;
    }

    setError(null);
    try {
      const result = await reservationsService.getMyReservations();
      setReservations(result.data);
    } catch (requestError) {
      setReservations([]);
      setError(requestError);
    } finally {
      setIsHydrated(true);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!authLoading) hydrate();
  }, [authLoading, hydrate]);

  const addReservation = useCallback(async (reservationData) => {
    const created = await reservationsService.addReservation(reservationData);
    await hydrate();
    return created;
  }, [hydrate]);

  const getReservationsParFormation = useCallback(
    (formationId) => reservations.filter((reservation) => reservation.formationId === formationId),
    [reservations]
  );

  const getReservationsParCentre = useCallback(
    (centreId) => reservationsService.getReservationsParCentre(centreId),
    []
  );

  const confirmerReservation = useCallback(async (reservationId) => {
    const updated = await reservationsService.confirmerReservation(reservationId);
    await hydrate();
    return updated;
  }, [hydrate]);

  const annulerReservation = useCallback(async (reservationId) => {
    const updated = await reservationsService.annulerReservation(reservationId);
    await hydrate();
    return updated;
  }, [hydrate]);

  const payerReservation = useCallback(async (reservationId, paymentMethod) => {
    const updated = await reservationsService.payerReservation(reservationId, paymentMethod);
    await hydrate();
    return updated;
  }, [hydrate]);

  const getReservationById = useCallback(
    (reservationId) => reservations.find((reservation) => String(reservation.id) === String(reservationId)) || null,
    [reservations]
  );

  const getUserReservations = useCallback(
    (userId) => reservations.filter((reservation) => String(reservation.learnerId) === String(userId)),
    [reservations]
  );

  const getCertificateForReservation = useCallback(
    (reservationId, userName) => reservationsService.getCertificateForReservation(reservationId, userName),
    []
  );

  const value = useMemo(() => ({
    reservations,
    isHydrated,
    loading: !isHydrated || authLoading,
    error,
    getReservationsParFormation,
    getReservationsParCentre,
    addReservation,
    confirmerReservation,
    annulerReservation,
    payerReservation,
    getReservationById,
    getUserReservations,
    getCertificateForReservation,
  }), [
    reservations,
    isHydrated,
    authLoading,
    error,
    getReservationsParFormation,
    getReservationsParCentre,
    addReservation,
    confirmerReservation,
    annulerReservation,
    payerReservation,
    getReservationById,
    getUserReservations,
    getCertificateForReservation,
  ]);

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservations doit être utilisé avec ReservationProvider");
  return context;
};

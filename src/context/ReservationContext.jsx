import React, { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import { reservationsService } from "../services/reservationsService";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);

  const hydrate = async () => {
    const all = await reservationsService.getAll();
    setReservations(all);
  };

  useEffect(() => {
    hydrate();
  }, []);

  const getReservationsParFormation = useCallback(
    (formationId) => reservations.filter((r) => r.formationId === formationId),
    [reservations]
  );

  const getReservationsParCentre = useCallback(
    async (centreId) => {
      // nécessite un join formation -> centreId : on délègue au service
      return reservationsService.getReservationsParCentre(centreId);
    },
    []
  );

  const confirmerReservation = useCallback(
    async (reservationId) => {
      const updated = await reservationsService.confirmerReservation(reservationId);
      await hydrate();
      return updated;
    },
    []
  );

  const annulerReservation = useCallback(
    async (reservationId, motif) => {
      const updated = await reservationsService.annulerReservation(
        reservationId,
        motif
      );
      await hydrate();
      return updated;
    },
    []
  );

  const payerReservation = useCallback(
    async (reservationId) => {
      const updated = await reservationsService.payerReservation(reservationId);
      await hydrate();
      return updated;
    },
    []
  );

  const getUserReservations = useCallback(
    (userId) => {
      return reservations.filter((r) => String(r.learnerId) === String(userId));
    },
    [reservations]
  );

  const getCertificateForReservation = useCallback(
    async (reservationId, userName) => {
      return reservationsService.getCertificateForReservation(reservationId, userName);
    },
    []
  );

  const value = useMemo(
    () => ({
      reservations,
      getReservationsParFormation,
      getReservationsParCentre,
      confirmerReservation,
      annulerReservation,
      payerReservation,
      getUserReservations,
      getCertificateForReservation,
    }),
    [
      reservations,
      getReservationsParFormation,
      getReservationsParCentre,
      confirmerReservation,
      annulerReservation,
      payerReservation,
      getUserReservations,
      getCertificateForReservation,
    ]
  );

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      "useReservations doit être utilisé avec ReservationProvider"
    );
  }
  return context;
};


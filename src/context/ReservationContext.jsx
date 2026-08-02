import React, { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import { reservationsService } from "../services/reservationsService";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrate = async () => {
    const all = await reservationsService.getAll();
    setReservations(all);
    setIsHydrated(true);
  };

  useEffect(() => {
    hydrate();
  }, []);

  const addReservation = useCallback(
    async (reservationData) => {
      console.log("[ReservationContext] addReservation start", reservationData);
      const created = await reservationsService.addReservation(reservationData);
      console.log("[ReservationContext] addReservation created", created);
      await hydrate();
      return created;
    },
    []
  );

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
      isHydrated,
      getReservationsParFormation,
      getReservationsParCentre,
      addReservation,
      confirmerReservation,
      annulerReservation,
      payerReservation,
      getUserReservations,
      getCertificateForReservation,
    }),
    [
      reservations,
      isHydrated,
      getReservationsParFormation,
      getReservationsParCentre,
      addReservation,
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


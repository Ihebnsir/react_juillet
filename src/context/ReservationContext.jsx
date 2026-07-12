import React, { createContext, useState, useContext } from "react";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const stored = localStorage.getItem("skillBridgeReservations");
    return stored ? JSON.parse(stored) : [];
  });

  const addReservation = (formation, userId) => {
    const newReservation = {
      id: `res${Date.now()}`,
      formationId: formation.id,
      userId,
      formationTitle: formation.title,
      centerName: formation.centerName,
      date: new Date().toISOString(),
      status: "confirmed",
      paid: false,
    };
    const updated = [...reservations, newReservation];
    setReservations(updated);
    localStorage.setItem("skillBridgeReservations", JSON.stringify(updated));
    return newReservation;
  };

  const cancelReservation = (reservationId, reason) => {
    const updated = reservations.map((r) =>
      r.id === reservationId
        ? { ...r, status: "cancelled", cancellationReason: reason }
        : r
    );
    setReservations(updated);
    localStorage.setItem("skillBridgeReservations", JSON.stringify(updated));
  };

  const markAsPaid = (reservationId) => {
    const updated = reservations.map((r) =>
      r.id === reservationId ? { ...r, paid: true } : r
    );
    setReservations(updated);
    localStorage.setItem("skillBridgeReservations", JSON.stringify(updated));
  };

  const getUserReservations = (userId) => {
    return reservations.filter((r) => r.userId === userId);
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        cancelReservation,
        markAsPaid,
        getUserReservations,
      }}
    >
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

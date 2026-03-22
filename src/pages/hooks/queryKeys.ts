export const queryKeys = {
  rooms: () => ['rooms'] as const,
  reservationsRoot: () => ['reservations'] as const,
  reservations: (date: string) => ['reservations', date] as const,
  myReservations: () => ['myReservations'] as const,
};

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { getReservations } from 'pages/remotes';

export function useReservations(date: string) {
  return useQuery(queryKeys.reservations(date), () => getReservations(date), {
    enabled: !!date,
  });
}

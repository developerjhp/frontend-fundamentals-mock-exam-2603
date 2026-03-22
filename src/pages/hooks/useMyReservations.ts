import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { getMyReservations } from 'pages/remotes';

export function useMyReservations() {
  return useQuery(queryKeys.myReservations(), getMyReservations);
}

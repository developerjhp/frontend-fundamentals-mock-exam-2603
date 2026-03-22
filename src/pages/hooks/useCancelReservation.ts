import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { cancelReservation } from 'pages/remotes';

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation(cancelReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.reservationsRoot());
      queryClient.invalidateQueries(queryKeys.myReservations());
    },
  });
}

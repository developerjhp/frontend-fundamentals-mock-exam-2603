import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { createReservation } from 'pages/remotes';
import type { CreateReservationRequest } from 'pages/types';

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation(createReservation, {
    onSuccess: (_data, variables: CreateReservationRequest) => {
      queryClient.invalidateQueries(queryKeys.reservations(variables.date));
      queryClient.invalidateQueries(queryKeys.myReservations());
    },
  });
}

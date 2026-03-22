import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { getRooms } from 'pages/remotes';

export function useRooms() {
  return useQuery(queryKeys.rooms(), getRooms);
}

import type { Equipment, Room, Reservation } from '../types';

export interface RoomFilterCriteria {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

export function getAvailableRooms(
  rooms: Room[],
  reservations: Reservation[],
  criteria: RoomFilterCriteria
): Room[] {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = criteria;

  return rooms
    .filter((room) => {
      if (room.capacity < attendees) return false;
      if (!equipment.every(eq => room.equipment.includes(eq))) return false;
      if (preferredFloor !== null && room.floor !== preferredFloor) return false;
      const hasConflict = reservations.some(
        (r) => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
      );
      if (hasConflict) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}

export function getUniqueFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
}

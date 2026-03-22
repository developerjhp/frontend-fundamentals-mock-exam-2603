import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Equipment } from 'pages/types';
import type { RoomFilterCriteria } from 'pages/utils/filterRooms';

export interface BookingFilterActions {
  setDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setAttendees: (n: number) => void;
  toggleEquipment: (eq: Equipment) => void;
  setPreferredFloor: (floor: number | null) => void;
}

export function useBookingFilters(onFilterChange?: () => void) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<RoomFilterCriteria>(() => {
    const eqParam = searchParams.get('equipment');
    const floorParam = searchParams.get('floor');
    const attendeesParam = searchParams.get('attendees');

    return {
      date: searchParams.get('date') ?? '',
      startTime: searchParams.get('startTime') ?? '',
      endTime: searchParams.get('endTime') ?? '',
      attendees: attendeesParam ? Math.max(1, Number(attendeesParam)) : 1,
      equipment: eqParam
        ? (eqParam.split(',').filter(Boolean) as Equipment[])
        : [],
      preferredFloor: floorParam ? Number(floorParam) : null,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.date) params.set('date', filters.date);
    if (filters.startTime) params.set('startTime', filters.startTime);
    if (filters.endTime) params.set('endTime', filters.endTime);
    if (filters.attendees > 1)
      params.set('attendees', String(filters.attendees));
    if (filters.equipment.length > 0)
      params.set('equipment', filters.equipment.join(','));
    if (filters.preferredFloor !== null)
      params.set('floor', String(filters.preferredFloor));
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const isFilterComplete = filters.startTime !== '' && filters.endTime !== '';

  let validationError: string | null = null;
  if (isFilterComplete) {
    if (filters.endTime <= filters.startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (filters.attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }

  const actions: BookingFilterActions = {
    setDate: (date: string) => {
      setFilters((prev) => ({ ...prev, date }));
      onFilterChange?.();
    },
    setStartTime: (time: string) => {
      setFilters((prev) => ({ ...prev, startTime: time }));
      onFilterChange?.();
    },
    setEndTime: (time: string) => {
      setFilters((prev) => ({ ...prev, endTime: time }));
      onFilterChange?.();
    },
    setAttendees: (n: number) => {
      setFilters((prev) => ({ ...prev, attendees: Math.max(1, n) }));
      onFilterChange?.();
    },
    toggleEquipment: (eq: Equipment) => {
      setFilters((prev) => ({
        ...prev,
        equipment: prev.equipment.includes(eq)
          ? prev.equipment.filter((e) => e !== eq)
          : [...prev.equipment, eq],
      }));
      onFilterChange?.();
    },
    setPreferredFloor: (floor: number | null) => {
      setFilters((prev) => ({ ...prev, preferredFloor: floor }));
      onFilterChange?.();
    },
  };

  return { filters, actions, isFilterComplete, validationError };
}

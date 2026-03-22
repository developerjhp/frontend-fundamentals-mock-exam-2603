import { TIMELINE_START, TIME_SLOTS } from '../constants';

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

export function generateTimeSlots(): string[] {
  return TIME_SLOTS;
}

export function getStartTimeOptions(): string[] {
  return TIME_SLOTS.slice(0, -1);
}

export function getEndTimeOptions(): string[] {
  return TIME_SLOTS.slice(1);
}

export function getHourLabels(): string[] {
  return TIME_SLOTS.filter(t => t.endsWith(':00'));
}

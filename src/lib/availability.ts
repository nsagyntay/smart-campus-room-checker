import { Booking, CheckResult, Room } from './types';

export function intervalsOverlap(a: Booking, start: number, end: number): boolean {
  return start < a.end && end > a.start;
}

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number
): CheckResult {
  if (isNaN(start) || isNaN(end) || isNaN(currentTime)) {
    return {
      available: false,
      reason: 'invalid-input',
      message: 'Please enter valid numeric values for all time fields.',
    };
  }

  if (start < 0 || end > 1440) {
    return {
      available: false,
      reason: 'out-of-range',
      message: 'Times must be between 0 and 1440 minutes (12:00 AM–11:59 PM).',
    };
  }

  if (start >= end) {
    return {
      available: false,
      reason: 'invalid-order',
      message: 'Start time must be earlier than end time.',
    };
  }

  if (start <= currentTime) {
    return {
      available: false,
      reason: 'past-time',
      message: `Bookings must start after the current time (${formatTime(currentTime)}). Please choose a later start time.`,
    };
  }

  if (end - start > 120) {
    return {
      available: false,
      reason: 'too-long',
      message: 'Bookings cannot exceed 120 minutes. Please choose a shorter interval.',
    };
  }

  if (room.blocked) {
    return {
      available: false,
      reason: 'room-blocked',
      message: room.blockedReason
        ? `This room is blocked: ${room.blockedReason}`
        : 'This room is currently blocked and cannot be booked.',
    };
  }

  const conflict = room.bookings.find((b) => intervalsOverlap(b, start, end));
  if (conflict) {
    return {
      available: false,
      reason: 'overlap',
      message: `Overlaps with "${conflict.title}" (${formatTime(conflict.start)}–${formatTime(conflict.end)}). Touching endpoints are allowed.`,
    };
  }

  return {
    available: true,
    message: `${room.name} is available from ${formatTime(start)} to ${formatTime(end)}.`,
  };
}

export function formatTime(minutes: number): string {
  const m = Math.max(0, Math.min(1440, Math.round(minutes)));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${mm.toString().padStart(2, '0')} ${period}`;
}

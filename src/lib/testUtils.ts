import { Room } from './types';

export function cloneRoom(room: Room): Room {
  return {
    ...room,
    bookings: room.bookings.map((b) => ({ ...b })),
  };
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export interface RoomFilter {
  minCapacity: number;
  requiredEquipment: string[];
}

export interface Booking {
  id: string;
  title: string;
  start: number;
  end: number;
}

export type CheckResult =
  | { available: true; message: string }
  | { available: false; reason: string; message: string };

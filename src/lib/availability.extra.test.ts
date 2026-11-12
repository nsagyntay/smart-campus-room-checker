import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import { sampleRooms } from './sampleData';
import { Room } from './types';

function cloneRoom(room: Room): Room {
  return {
    ...room,
    bookings: room.bookings.map((b) => ({ ...b })),
  };
}

const roomA101 = sampleRooms.find((r) => r.id === 'A101')!;
const roomB220 = sampleRooms.find((r) => r.id === 'B220')!;
const roomC305 = sampleRooms.find((r) => r.id === 'C305')!;

describe('checkAvailability — Extra boundary and blocked-room tests (F3, B-series)', () => {
  // ── F3: Blocked rooms must never be reported as available ──

  it('F3-BLOCKED-NO-OVERLAP: blocked room with non-overlapping valid time is still rejected', () => {
    const room = cloneRoom(roomB220);
    // B220 has booking b4 at 600–660; candidate 700–750 has no overlap
    const result = checkAvailability(room, 700, 750, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('room-blocked');
    }
  });

  it('F3-BLOCKED-OVERLAP: blocked room with overlapping time reports room-blocked (not overlap)', () => {
    const room = cloneRoom(roomB220);
    // B220 has booking b4 at 600–660; candidate 610–630 overlaps
    const result = checkAvailability(room, 610, 630, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('room-blocked');
    }
  });

  it('F3-BLOCKED-CUSTOM: a custom blocked room with no bookings is rejected', () => {
    const room: Room = {
      id: 'X999',
      name: 'Room X999',
      building: 'Test Block',
      capacity: 10,
      equipment: [],
      blocked: true,
      blockedReason: 'Flooded',
      bookings: [],
    };
    const result = checkAvailability(room, 700, 760, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('room-blocked');
    }
  });

  // ── Boundary: 120 minutes allowed, 121 rejected ──

  it('B120-EXACT: duration exactly 120 minutes with no conflicts is available', () => {
    const room = cloneRoom(roomA101);
    // A101: b1 540–600, b2 780–840, b3 1020–1080
    // 660–780 is 120 minutes, touches b2 at start (780)
    const result = checkAvailability(room, 660, 780, 500);
    expect(result.available).toBe(true);
  });

  it('B121-REJECTED: duration 121 minutes is rejected as too-long', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 660, 781, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('too-long');
    }
  });

  // ── Boundary: Touching intervals allowed, overlapping rejected ──

  it('BTOUCH-END-AT-START: candidate ending exactly at booking start is available', () => {
    const room = cloneRoom(roomA101);
    // b1 starts at 540; candidate 480–540 ends at b1.start
    const result = checkAvailability(room, 480, 540, 400);
    expect(result.available).toBe(true);
  });

  it('BTOUCH-START-AT-END: candidate starting exactly at booking end is available', () => {
    const room = cloneRoom(roomC305);
    // C305: b5 690–750; candidate 750–810 starts at b5.end
    const result = checkAvailability(room, 750, 810, 500);
    expect(result.available).toBe(true);
  });

  it('BOVERLAP-PARTIAL: candidate partially overlapping a booking is rejected', () => {
    const room = cloneRoom(roomC305);
    // C305: b5 690–750; candidate 720–780 overlaps 720–750
    const result = checkAvailability(room, 720, 780, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('overlap');
    }
  });

  it('BOVERLAP-FULL: candidate fully overlapping a booking is rejected', () => {
    const room = cloneRoom(roomC305);
    // C305: b5 690–750; candidate 700–740 fully inside
    const result = checkAvailability(room, 700, 740, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('overlap');
    }
  });
});

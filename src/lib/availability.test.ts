import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import { sampleRooms } from './sampleData';
import { Room } from './types';

// Helper: clone a room so test mutations never affect shared sample data
function cloneRoom(room: Room): Room {
  return {
    ...room,
    bookings: room.bookings.map((b) => ({ ...b })),
  };
}

const roomA101 = sampleRooms.find((r) => r.id === 'A101')!;
const roomB220 = sampleRooms.find((r) => r.id === 'B220')!;
describe('checkAvailability — Boundary Test Plan T01–T19', () => {
  // ── T01: Valid interval, no conflicts (happy path) ──
  it('T01: valid interval with no conflicts returns available with room name and times', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 700, 760, 500);
    expect(result.available).toBe(true);
    if (result.available) {
      expect(result.message).toContain('Room A101');
      expect(result.message).toContain('11:40 AM'); // 700 min
      expect(result.message).toContain('12:40 PM'); // 760 min
    }
  });

  // ── T02: Start = 0 with currentTime = 0 (past-time boundary) ──
  it('T02: start=0 with currentTime=0 is rejected as past-time', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 0, 30, 0);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('past-time');
    }
  });

  // ── T03: End = 1440 (upper bound inclusive) ──
  it('T03: end=1440 with start=1380 and currentTime=1300 is available', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 1380, 1440, 1300);
    expect(result.available).toBe(true);
  });

  // ── T04: Start = -1 (below lower bound) ──
  it('T04: start=-1 is rejected as out-of-range', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, -1, 30, -5);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('out-of-range');
    }
  });

  // ── T05: End = 1441 (above upper bound) ──
  it('T05: end=1441 is rejected as out-of-range', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 1430, 1441, 1400);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('out-of-range');
    }
  });

  // ── T06: Start = End (zero-length interval) ──
  it('T06: start===end is rejected as invalid-order', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 700, 700, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('invalid-order');
    }
  });

  // ── T07: Start > End (reversed interval) ──
  it('T07: start>end is rejected as invalid-order', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 800, 700, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('invalid-order');
    }
  });

  // ── T08: Start = CurrentTime (not strictly after) ──
  it('T08: start===currentTime is rejected as past-time', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 540, 570, 540);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('past-time');
    }
  });

  // ── T09: Start < CurrentTime (before current time) ──
  it('T09: start<currentTime is rejected as past-time', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 500, 570, 540);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('past-time');
    }
  });

  // ── T10: Duration = 120 (maximum allowed boundary) ──
  it('T10: duration=120 with touching endpoint is available', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 600, 720, 500);
    expect(result.available).toBe(true);
  });

  // ── T11: Duration = 121 (one minute over maximum) ──
  it('T11: duration=121 is rejected as too-long', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 600, 721, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('too-long');
    }
  });

  // ── T12: Blocked room with otherwise-valid interval ──
  it('T12: blocked room is rejected as room-blocked', () => {
    const room = cloneRoom(roomB220);
    const result = checkAvailability(room, 700, 750, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('room-blocked');
    }
  });

  // ── T13: Partial overlap with existing booking ──
  it('T13: partial overlap is rejected as overlap', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 550, 610, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('overlap');
    }
  });

  // ── T14: Touching endpoints (allowed) ──
  it('T14: touching endpoints (start=booking.end) is available', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 600, 700, 500);
    expect(result.available).toBe(true);
  });

  // ── T15: Input immutability (return value + no mutation) ──
  it('T15: returns correct result and does not mutate the input room or bookings', () => {
    const room = cloneRoom(roomA101);
    const snapshot = {
      blocked: room.blocked,
      blockedReason: room.blockedReason,
      bookingsLength: room.bookings.length,
      bookings: room.bookings.map((b) => ({ id: b.id, title: b.title, start: b.start, end: b.end })),
    };
    const result = checkAvailability(room, 700, 760, 500);
    expect(result.available).toBe(true);
    expect(room.blocked).toBe(snapshot.blocked);
    expect(room.blockedReason).toBe(snapshot.blockedReason);
    expect(room.bookings.length).toBe(snapshot.bookingsLength);
    room.bookings.forEach((b, i) => {
      expect(b.id).toBe(snapshot.bookings[i].id);
      expect(b.title).toBe(snapshot.bookings[i].title);
      expect(b.start).toBe(snapshot.bookings[i].start);
      expect(b.end).toBe(snapshot.bookings[i].end);
    });
  });

  // ── T16: Start = CurrentTime + 1 (strictly-after boundary acceptance) ──
  it('T16: start=currentTime+1 touching booking start is available', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 501, 540, 500);
    expect(result.available).toBe(true);
  });

  // ── T17: Fully contained overlap (candidate entirely inside existing booking) ──
  it('T17: fully-contained overlap is rejected as overlap', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, 550, 590, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('overlap');
    }
  });

  // ── T18: NaN input is rejected as invalid-input ──
  it('T18: NaN start is rejected as invalid-input', () => {
    const room = cloneRoom(roomA101);
    const result = checkAvailability(room, NaN, 760, 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('invalid-input');
    }
  });

  // ── T19: Opposite touching endpoint (end = booking.start) is allowed ──
  it('T19: end=booking.start (opposite touching endpoint) is available', () => {
    const room = cloneRoom(roomA101);
    // b1 starts at 540; candidate 510–540 ends exactly at b1's start (touching)
    const result = checkAvailability(room, 510, 540, 500);
    expect(result.available).toBe(true);
  });
});

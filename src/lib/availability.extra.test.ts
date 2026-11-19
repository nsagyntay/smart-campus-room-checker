import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import { sampleRooms } from './sampleData';
import { cloneRoom } from './testUtils';
import { Room, Booking } from './types';

const roomA101 = sampleRooms.find((r) => r.id === 'A101')!;
const roomB220 = sampleRooms.find((r) => r.id === 'B220')!;
const roomC305 = sampleRooms.find((r) => r.id === 'C305')!;

const initialSampleRooms: Room[] = sampleRooms.map((r) => ({
  ...r,
  equipment: [...r.equipment],
  bookings: r.bookings.map((b) => ({ ...b })),
}));

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

  // ── C3 regression: empty input fields produce Number("") = 0, not NaN ──
  // handleCheck in App.tsx calls Number(startStr) directly. When a field is
  // empty, Number("") returns 0, which checkAvailability treats as a valid
  // midnight value rather than detecting the missing input. This test documents
  // the current behavior so any future fix can be verified against it.

  it('C3-EMPTY-START-END: Number("") = 0 for start and end yields invalid-order, not invalid-input', () => {
    const room = cloneRoom(roomA101);
    // Simulates handleCheck with empty start and end fields: Number("") = 0
    const result = checkAvailability(room, Number(''), Number(''), 500);
    expect(result.available).toBe(false);
    if (!result.available) {
      // start=0, end=0 → start >= end → 'invalid-order', NOT 'invalid-input'
      // because 0 is not NaN. This documents the C3 gap.
      expect(result.reason).toBe('invalid-order');
    }
  });

  it('C3-EMPTY-CURRENT: Number("") = 0 for current time can produce a false available result', () => {
    const room = cloneRoom(roomA101);
    // Simulates handleCheck with empty current field but valid start/end.
    // Number("") = 0 for current, so start=700 > current=0 passes the
    // past-time check. A101 has a gap 600–780, so 700–760 has no overlap.
    // The room is reported available — but the user left current time empty.
    const result = checkAvailability(room, 700, 760, Number(''));
    expect(result.available).toBe(true);
    // This test documents the false-available scenario: the user did not
    // enter a current time, yet the result says "available" because
    // Number("") = 0 was treated as a valid midnight current time.
  });

  it('C3-NAN-CURRENT: passing NaN for current time correctly yields invalid-input', () => {
    const room = cloneRoom(roomA101);
    // If empty fields were converted to NaN instead of Number(""), the
    // guard at availability.ts line 13 would catch it. This test confirms
    // the existing NaN guard works — the gap is that handleCheck sends 0, not NaN.
    const result = checkAvailability(room, 700, 760, NaN);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe('invalid-input');
    }
  });

  // ── Fixture integrity: shared sampleRooms must remain unchanged after tests run ──

  it('FIXTURE-UNCHANGED: sampleRooms fixtures are not mutated by checkAvailability', () => {
    // Exercise every room including a blocked room and overlap cases.
    sampleRooms.forEach((room) => {
      checkAvailability(cloneRoom(room), 700, 760, 500);
    });
    expect(sampleRooms.length).toBe(initialSampleRooms.length);
    sampleRooms.forEach((room, i) => {
      const snap = initialSampleRooms[i];
      expect(room.id).toBe(snap.id);
      expect(room.name).toBe(snap.name);
      expect(room.building).toBe(snap.building);
      expect(room.capacity).toBe(snap.capacity);
      expect(room.blocked).toBe(snap.blocked);
      expect(room.blockedReason).toBe(snap.blockedReason);
      expect(room.equipment).toEqual(snap.equipment);
      expect(room.bookings.length).toBe(snap.bookings.length);
      room.bookings.forEach((b: Booking, j: number) => {
        expect(b.id).toBe(snap.bookings[j].id);
        expect(b.title).toBe(snap.bookings[j].title);
        expect(b.start).toBe(snap.bookings[j].start);
        expect(b.end).toBe(snap.bookings[j].end);
      });
    });
  });
});

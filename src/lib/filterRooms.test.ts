import { describe, it, expect } from 'vitest';
import { filterRooms } from './filterRooms';
import { sampleRooms } from './sampleData';

describe('filterRooms — Capacity and Equipment (F1, F2)', () => {
  // ── F1: Capacity filtering ──

  it('F1-EXACT: room with capacity exactly equal to minCapacity is included', () => {
    const result = filterRooms(sampleRooms, { minCapacity: 15, requiredEquipment: [] });
    const c305 = result.find((r) => r.id === 'C305');
    expect(c305).toBeDefined();
    expect(c305!.capacity).toBe(15);
  });

  it('F1-INSUFFICIENT: room with capacity below minCapacity is excluded', () => {
    const result = filterRooms(sampleRooms, { minCapacity: 16, requiredEquipment: [] });
    const c305 = result.find((r) => r.id === 'C305');
    expect(c305).toBeUndefined();
  });

  it('F1-ABOVE: room with capacity above minCapacity is included', () => {
    const result = filterRooms(sampleRooms, { minCapacity: 30, requiredEquipment: [] });
    const a101 = result.find((r) => r.id === 'A101');
    expect(a101).toBeDefined();
    expect(a101!.capacity).toBe(40);
  });

  it('F1-ZERO: minCapacity=0 includes all rooms', () => {
    const result = filterRooms(sampleRooms, { minCapacity: 0, requiredEquipment: [] });
    expect(result).toHaveLength(sampleRooms.length);
  });

  // ── F2: Equipment filtering ──

  it('F2-SINGLE: filter by one equipment item includes only rooms with that item', () => {
    const result = filterRooms(sampleRooms, { minCapacity: 0, requiredEquipment: ['whiteboard'] });
    const ids = result.map((r) => r.id);
    expect(ids).toContain('A101');
    expect(ids).toContain('C305');
    expect(ids).toContain('D410');
    expect(ids).not.toContain('B220');
    expect(ids).not.toContain('E112');
  });

  it('F2-ALL: filter by multiple items requires ALL to be present', () => {
    const result = filterRooms(sampleRooms, {
      minCapacity: 0,
      requiredEquipment: ['projector', 'video-conference'],
    });
    const ids = result.map((r) => r.id);
    expect(ids).toContain('D410');
    expect(ids).toContain('E112');
    expect(ids).not.toContain('A101');
    expect(ids).not.toContain('B220');
    expect(ids).not.toContain('C305');
  });

  it('F2-MISSING: room missing one required item is excluded even if it has others', () => {
    const result = filterRooms(sampleRooms, {
      minCapacity: 0,
      requiredEquipment: ['projector', 'whiteboard', 'video-conference'],
    });
    const ids = result.map((r) => r.id);
    expect(ids).toEqual(['D410']);
  });

  it('F2-NONE: no required equipment returns all rooms', () => {
    const result = filterRooms(sampleRooms, { minCapacity: 0, requiredEquipment: [] });
    expect(result).toHaveLength(sampleRooms.length);
  });

  // ── Combined capacity + equipment ──

  it('F1F2-COMBINED: capacity and equipment filters applied together', () => {
    const result = filterRooms(sampleRooms, {
      minCapacity: 40,
      requiredEquipment: ['projector'],
    });
    const ids = result.map((r) => r.id);
    expect(ids).toContain('A101');
    expect(ids).toContain('D410');
    expect(ids).not.toContain('B220');
    expect(ids).not.toContain('C305');
    expect(ids).not.toContain('E112');
  });
});

import { Room, RoomFilter } from './types';

export function filterRooms(rooms: Room[], filter: RoomFilter): Room[] {
  return rooms.filter((room) => {
    if (room.capacity < filter.minCapacity) return false;
    if (filter.requiredEquipment.length > 0) {
      const hasAll = filter.requiredEquipment.every((item) =>
        room.equipment.includes(item)
      );
      if (!hasAll) return false;
    }
    return true;
  });
}

import { Room } from '@/lib/types';

interface RoomSelectorProps {
  rooms: Room[];
  selectedId: string;
  noRoomsMatch: boolean;
  onSelect: (id: string) => void;
}

export function RoomSelector({
  rooms,
  selectedId,
  noRoomsMatch,
  onSelect,
}: RoomSelectorProps) {
  return (
    <div>
      <label
        htmlFor="room"
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        Select Room
      </label>
      {noRoomsMatch ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700">
          No rooms match the current filters. Try lowering the minimum capacity or removing
          equipment requirements.
        </p>
      ) : (
        <select
          id="room"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.building}
              {r.blocked ? ' (Blocked)' : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

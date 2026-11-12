import { Monitor, SlidersHorizontal, Video } from 'lucide-react';
import { allEquipment } from '@/lib/sampleData';
import { equipmentLabels } from '@/lib/constants';

interface RoomFiltersProps {
  minCapacity: number;
  requiredEquipment: string[];
  matchCount: number;
  onCapacityChange: (value: number) => void;
  onEquipmentToggle: (item: string) => void;
}

export function RoomFilters({
  minCapacity,
  requiredEquipment,
  matchCount,
  onCapacityChange,
  onEquipmentToggle,
}: RoomFiltersProps) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-1.5 text-sm font-bold text-slate-700">
        <SlidersHorizontal className="h-4 w-4" />
        Filter Rooms
      </h2>

      <div className="mb-4">
        <label
          htmlFor="capacity"
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          Minimum Capacity (seats)
        </label>
        <input
          id="capacity"
          type="number"
          min={0}
          value={minCapacity}
          onChange={(e) => onCapacityChange(Math.max(0, Number(e.target.value)))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
          Required Equipment
        </span>
        <div className="flex flex-wrap gap-2">
          {allEquipment.map((item) => {
            const active = requiredEquipment.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => onEquipmentToggle(item)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {item === 'projector' && <Monitor className="h-3.5 w-3.5" />}
                {item === 'video-conference' && <Video className="h-3.5 w-3.5" />}
                {equipmentLabels[item] ?? item}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Rooms must have ALL selected equipment.
        </p>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {matchCount} room{matchCount !== 1 ? 's' : ''} match
        {matchCount !== 1 ? '' : 'es'} the current filters.
      </p>
    </div>
  );
}

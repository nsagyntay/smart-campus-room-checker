import { Search } from 'lucide-react';
import { formatTime } from '@/lib/availability';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/lib/types';

interface AvailabilityFormProps {
  rooms: Room[];
  selectedRoomId: string;
  noRoomsMatch: boolean;
  startStr: string;
  endStr: string;
  currentStr: string;
  onRoomSelect: (id: string) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onCurrentChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

function TimeField({
  id,
  label,
  placeholder,
  value,
  onChange,
  preview,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  preview: string | null;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        max={1440}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      />
      {preview && <p className="mt-1 text-xs text-slate-400">{preview}</p>}
    </div>
  );
}

function timePreview(value: string): string | null {
  const num = value.trim() === '' ? null : Number(value);
  if (num !== null && !isNaN(num) && num >= 0 && num <= 1440) {
    return formatTime(num);
  }
  return null;
}

export function AvailabilityForm({
  rooms,
  selectedRoomId,
  noRoomsMatch,
  startStr,
  endStr,
  currentStr,
  onRoomSelect,
  onStartChange,
  onEndChange,
  onCurrentChange,
  onSubmit,
  onReset,
}: AvailabilityFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <RoomSelector
        rooms={rooms}
        selectedId={selectedRoomId}
        noRoomsMatch={noRoomsMatch}
        onSelect={onRoomSelect}
      />

      <TimeField
        id="current"
        label="Current Time (min)"
        placeholder="e.g. 600"
        value={currentStr}
        onChange={onCurrentChange}
        preview={timePreview(currentStr)}
      />

      <TimeField
        id="start"
        label="Start Time (min)"
        placeholder="e.g. 660"
        value={startStr}
        onChange={onStartChange}
        preview={timePreview(startStr)}
      />

      <TimeField
        id="end"
        label="End Time (min)"
        placeholder="e.g. 720"
        value={endStr}
        onChange={onEndChange}
        preview={timePreview(endStr)}
      />

      <div className="flex gap-2.5 pt-1">
        <button
          type="submit"
          disabled={noRoomsMatch}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Search className="h-4 w-4" />
          Check Availability
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

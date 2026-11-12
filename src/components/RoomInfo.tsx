import {
  Building2,
  CheckCircle2,
  Clock,
  Monitor,
  Users,
  Video,
  XCircle,
} from 'lucide-react';
import { Room } from '@/lib/types';
import { formatTime } from '@/lib/availability';
import { equipmentLabels } from '@/lib/constants';

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">{room.name}</h2>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {room.building}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {room.capacity} seats
            </span>
          </div>
        </div>
        {room.blocked ? (
          <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            Blocked
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Active
          </span>
        )}
      </div>

      {room.equipment.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.equipment.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
            >
              {item === 'projector' && <Monitor className="h-3 w-3" />}
              {item === 'video-conference' && <Video className="h-3 w-3" />}
              {equipmentLabels[item] ?? item}
            </span>
          ))}
        </div>
      )}

      {room.blocked && room.blockedReason && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {room.blockedReason}
        </p>
      )}

      <div className="mt-4">
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          Existing Bookings
        </h3>
        {room.bookings.length === 0 ? (
          <p className="text-sm text-slate-400">No existing bookings.</p>
        ) : (
          <ul className="space-y-1.5">
            {room.bookings.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-slate-700">{b.title}</span>
                <span className="font-mono text-xs text-slate-500">
                  {formatTime(b.start)}–{formatTime(b.end)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { Booking } from '@/lib/types';
import { formatTime } from '@/lib/availability';

interface TimelineProps {
  bookings: Booking[];
  blocked: boolean;
  candidateStart: number | null;
  candidateEnd: number | null;
  currentTime: number;
}

const BLOCKED_COLOR = 'bg-rose-200 border-rose-400';
const BOOKED_COLOR = 'bg-sky-200 border-sky-400';
const CANDIDATE_COLOR = 'bg-emerald-400 border-emerald-600';

export function Timeline({
  bookings,
  blocked,
  candidateStart,
  candidateEnd,
  currentTime,
}: TimelineProps) {
  const pct = (min: number) => `${(min / 1440) * 100}%`;

  const hours: number[] = [];
  for (let h = 0; h <= 24; h += 3) hours.push(h * 60);

  return (
    <div className="w-full">
      <div className="relative h-16 w-full rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
        {/* Blocked overlay */}
        {blocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-rose-100/80">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
              Blocked
            </span>
          </div>
        )}

        {/* Hour gridlines */}
        {hours.map((m) => (
          <div
            key={`grid-${m}`}
            className="absolute top-0 bottom-0 border-l border-slate-200 z-0"
            style={{ left: pct(m) }}
          />
        ))}

        {/* Current time marker */}
        {currentTime >= 0 && currentTime <= 1440 && (
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-amber-500"
            style={{ left: pct(currentTime) }}
            title={`Now: ${formatTime(currentTime)}`}
          >
            <span className="absolute -top-0 left-1 -translate-y-full text-[9px] font-bold text-amber-600 whitespace-nowrap">
              NOW
            </span>
          </div>
        )}

        {/* Existing bookings */}
        {bookings.map((b) => (
          <div
            key={b.id}
            className={`absolute top-1.5 bottom-1.5 z-10 rounded border ${BOOKED_COLOR} flex items-center justify-center px-1 overflow-hidden`}
            style={{ left: pct(b.start), width: `calc(${pct(b.end)} - ${pct(b.start)})` }}
            title={`${b.title}: ${formatTime(b.start)}–${formatTime(b.end)}`}
          >
            <span className="truncate text-[10px] font-medium text-sky-800">{b.title}</span>
          </div>
        ))}

        {/* Candidate interval */}
        {candidateStart !== null &&
          candidateEnd !== null &&
          candidateStart < candidateEnd &&
          candidateStart >= 0 &&
          candidateEnd <= 1440 && (
            <div
              className={`absolute top-1.5 bottom-1.5 z-15 rounded border-2 border-dashed ${CANDIDATE_COLOR} opacity-70 flex items-center justify-center`}
              style={{
                left: pct(candidateStart),
                width: `calc(${pct(candidateEnd)} - ${pct(candidateStart)})`,
              }}
              title={`Candidate: ${formatTime(candidateStart)}–${formatTime(candidateEnd)}`}
            />
          )}
      </div>

      {/* Hour labels */}
      <div className="relative mt-1 h-4 w-full">
        {hours.map((m) => (
          <span
            key={`label-${m}`}
            className="absolute -translate-x-1/2 text-[9px] text-slate-400 font-mono"
            style={{ left: pct(m) }}
          >
            {formatTime(m)}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded border ${BOOKED_COLOR}`} />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border-2 border-dashed border-emerald-600 bg-emerald-400 opacity-70" />
          Your interval
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-0.5 bg-amber-500" />
          Current time
        </span>
        {blocked && (
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded border ${BLOCKED_COLOR}`} />
            Blocked
          </span>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { DoorClosed, Info } from 'lucide-react';
import { sampleRooms } from '@/lib/sampleData';
import { checkAvailability, formatTime } from '@/lib/availability';
import { filterRooms } from '@/lib/filterRooms';
import { CheckResult } from '@/lib/types';
import { RoomFilters } from '@/components/RoomFilters';
import { RoomInfo } from '@/components/RoomInfo';
import { AvailabilityForm } from '@/components/AvailabilityForm';
import { AvailabilityResult } from '@/components/AvailabilityResult';
import { Timeline } from '@/components/Timeline';

function App() {
  const [roomId, setRoomId] = useState(sampleRooms[0].id);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [currentStr, setCurrentStr] = useState('600');
  const [result, setResult] = useState<CheckResult | null>(null);

  const [minCapacity, setMinCapacity] = useState(0);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);

  const filteredRooms = useMemo(
    () => filterRooms(sampleRooms, { minCapacity, requiredEquipment }),
    [minCapacity, requiredEquipment]
  );

  const room = useMemo(
    () => filteredRooms.find((r) => r.id === roomId) ?? filteredRooms[0],
    [filteredRooms, roomId]
  );

  const noRoomsMatch = filteredRooms.length === 0;

  const startNum = startStr.trim() === '' ? null : Number(startStr);
  const endNum = endStr.trim() === '' ? null : Number(endStr);
  const currentNum = currentStr.trim() === '' ? null : Number(currentStr);

  function handleRoomSelect(id: string) {
    setRoomId(id);
    setResult(null);
  }

  function toggleEquipment(item: string) {
    setRequiredEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    setResult(null);
  }

  function handleCheck() {
    if (!room) return;
    setResult(checkAvailability(room, Number(startStr), Number(endStr), Number(currentStr)));
  }

  function handleReset() {
    setStartStr('');
    setEndStr('');
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <DoorClosed className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              Smart Campus Room Checker
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Check room availability — no booking is saved or confirmed.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            Enter times as <strong>minutes after midnight</strong> (0–1440). Example: 540 = 9:00 AM,
            1020 = 5:00 PM.
          </p>
        </div>

        <RoomFilters
          minCapacity={minCapacity}
          requiredEquipment={requiredEquipment}
          matchCount={filteredRooms.length}
          onCapacityChange={(v) => {
            setMinCapacity(v);
            setResult(null);
          }}
          onEquipmentToggle={toggleEquipment}
        />

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <AvailabilityForm
              rooms={filteredRooms}
              selectedRoomId={room?.id ?? ''}
              noRoomsMatch={noRoomsMatch}
              startStr={startStr}
              endStr={endStr}
              currentStr={currentStr}
              onRoomSelect={handleRoomSelect}
              onStartChange={setStartStr}
              onEndChange={setEndStr}
              onCurrentChange={setCurrentStr}
              onSubmit={handleCheck}
              onReset={handleReset}
            />
          </div>

          <div className="md:col-span-3 space-y-4">
            {room ? (
              <>
                <RoomInfo room={room} />

                {result && <AvailabilityResult result={result} />}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Daily Timeline
                  </h3>
                  <Timeline
                    bookings={room.bookings}
                    blocked={room.blocked}
                    candidateStart={
                      startNum !== null && !isNaN(startNum) ? startNum : null
                    }
                    candidateEnd={
                      endNum !== null && !isNaN(endNum) ? endNum : null
                    }
                    currentTime={
                      currentNum !== null && !isNaN(currentNum) ? currentNum : 0
                    }
                  />
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
                <p className="text-sm font-semibold text-amber-800">
                  No rooms match your filters
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  Try lowering the minimum capacity or removing equipment requirements.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 text-center text-xs text-slate-400 sm:px-6">
          Fictional sample data for demonstration. This tool only checks availability — it does not
          save or confirm bookings.
        </div>
      </footer>
    </div>
  );
}

export default App;

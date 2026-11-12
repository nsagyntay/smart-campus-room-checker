import { CheckCircle2, XCircle } from 'lucide-react';
import { CheckResult } from '@/lib/types';

interface AvailabilityResultProps {
  result: CheckResult;
}

export function AvailabilityResult({ result }: AvailabilityResultProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border p-4 transition-all ${
        result.available
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-rose-200 bg-rose-50'
      }`}
    >
      {result.available ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
      )}
      <div>
        <p
          className={`text-sm font-bold ${
            result.available ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {result.available ? 'Available' : 'Unavailable'}
        </p>
        <p
          className={`mt-0.5 text-sm ${
            result.available ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {result.message}
        </p>
      </div>
    </div>
  );
}

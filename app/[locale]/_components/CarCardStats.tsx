'use client';

import { Activity } from 'lucide-react';
import type { RealListing } from '@/lib/listing';

interface CarCardStatsProps {
  car: RealListing;
  onSelect: () => void;
}

export default function CarCardStats({ car, onSelect }: CarCardStatsProps) {
  const stats = [
    car.specs.fuelEfficiency
      ? { label: 'efficiency', value: `${car.specs.fuelEfficiency} ${car.specs.isElectric ? 'kWh' : 'L'}/100km` }
      : null,
    car.specs.power ? { label: 'power', value: car.specs.power } : null,
    car.specs.acceleration ? { label: '0-100', value: car.specs.acceleration.split(' ')[0] } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <>
      {stats.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
              <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">{label}</p>
              <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={onSelect}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-900 py-2.5 text-xs font-bold text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200 dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950 cursor-pointer shadow-xs"
        >
          <Activity className="h-3.5 w-3.5" />
          Analyze Financial Reality
        </button>
      </div>
    </>
  );
}

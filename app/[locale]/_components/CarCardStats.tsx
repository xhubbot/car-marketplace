'use client';

import { Activity } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface CarCardStatsProps {
  car: CarListing;
  isOwnershipMode: boolean;
  totalMonthlyTCO: number;
  classAverageTCO: number;
  isBelowAverage: boolean;
  percentDiff: number;
  onSelect: () => void;
}

export default function CarCardStats({
  car,
  isOwnershipMode,
  totalMonthlyTCO,
  classAverageTCO,
  isBelowAverage,
  percentDiff,
  onSelect,
}: CarCardStatsProps) {
  return (
    <>
      {/* Key Performance Benchmarks */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
          <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">efficiency</p>
          <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {car.specs.fuelEfficiency} {car.specs.fuelType === 'electric' ? 'kWh' : 'L'}/100km
          </p>
        </div>
        <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
          <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">power</p>
          <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{car.specs.power}</p>
        </div>
        <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
          <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">0-100</p>
          <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{car.specs.acceleration.split(' ')[0]}</p>
        </div>
      </div>

      {/* Ownership benchmarking vs class average */}
      {isOwnershipMode && (
        <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-950/20">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">vs. Class Avg (${classAverageTCO}/mo)</span>
            <span className={`font-mono font-bold ${isBelowAverage ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isBelowAverage ? '-' : '+'}{percentDiff}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative">
            <div
              className={`h-full rounded-full ${isBelowAverage ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min((totalMonthlyTCO / (classAverageTCO * 1.5)) * 100, 100)}%` }}
            />
            <div className="absolute left-[66%] top-0 h-full w-0.5 bg-neutral-400" title="Class Average" />
          </div>
        </div>
      )}

      {/* Quick Highlights (standard mode only) */}
      {!isOwnershipMode && (
        <div className="mt-4 space-y-1.5">
          {car.highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              <span className="truncate">{h}</span>
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

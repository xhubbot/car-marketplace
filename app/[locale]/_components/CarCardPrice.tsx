'use client';

import { Sparkles } from 'lucide-react';
import type { RealListing } from '@/lib/listing';

interface CarCardPriceProps {
  car: RealListing;
  isOwnershipMode: boolean;
}

export default function CarCardPrice({ car, isOwnershipMode }: CarCardPriceProps) {
  const { loan, insurance, repair, fuel, total } = car.monthlyCost;
  const runningCostOnly = insurance + repair + fuel;

  if (!isOwnershipMode) {
    return (
      <div className="mt-5 border-y border-neutral-100 py-4 dark:border-neutral-800/80">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
              stick price / cash
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {car.price.toLocaleString()} {car.currency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
              est. finance
            </p>
            <p className="font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              From {Math.round(loan)} {car.currency}/mo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 border-y border-neutral-100 py-4 dark:border-neutral-800/80 space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 uppercase">
              true monthly cost
            </p>
            <Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" />
          </div>
          <p className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {Math.round(total).toLocaleString()}
            <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500"> {car.currency}/mo</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
            pure running
          </p>
          <p className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-200">
            {Math.round(runningCostOnly).toLocaleString()} {car.currency}/mo
          </p>
        </div>
      </div>

      {/* Expense Proportion Bar */}
      <div className="h-2 w-full flex overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div className="bg-neutral-900 dark:bg-white" style={{ width: `${(loan / total) * 100}%` }} title={`Finance: ${Math.round(loan)}/mo`} />
        <div className="bg-emerald-500" style={{ width: `${(fuel / total) * 100}%` }} title={`Energy: ${Math.round(fuel)}/mo`} />
        <div className="bg-amber-500" style={{ width: `${(repair / total) * 100}%` }} title={`Repairs: ${Math.round(repair)}/mo`} />
        <div className="bg-sky-500" style={{ width: `${(insurance / total) * 100}%` }} title={`Insurance: ${Math.round(insurance)}/mo`} />
      </div>
      <div className="grid grid-cols-4 gap-1 text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-tight">
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />Fin</span>
        <span className="flex items-center gap-0.5 text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Enrg</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Mnt</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Insur</span>
      </div>
    </div>
  );
}

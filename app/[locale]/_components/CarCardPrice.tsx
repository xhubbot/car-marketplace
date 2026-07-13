'use client';

import { Sparkles } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface CarCardPriceProps {
  car: CarListing;
  isOwnershipMode: boolean;
  totalMonthlyTCO: number;
  totalRunningCostOnly: number;
  monthlyEnergyCost: number;
}

export default function CarCardPrice({
  car,
  isOwnershipMode,
  totalMonthlyTCO,
  totalRunningCostOnly,
  monthlyEnergyCost,
}: CarCardPriceProps) {
  if (!isOwnershipMode) {
    return (
      <div className="mt-5 border-y border-neutral-100 py-4 dark:border-neutral-800/80">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
              stick price / cash
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              ${car.price.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
              est. finance
            </p>
            <p className="font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              From ${car.expenses.loanPayment}/mo
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
            ${totalMonthlyTCO.toLocaleString()}
            <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500"> / mo</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
            pure running
          </p>
          <p className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-200">
            ${totalRunningCostOnly.toLocaleString()}/mo
          </p>
        </div>
      </div>

      {/* Expense Proportion Bar */}
      <div className="h-2 w-full flex overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div className="bg-neutral-900 dark:bg-white" style={{ width: `${(car.expenses.loanPayment / totalMonthlyTCO) * 100}%` }} title={`Finance: $${car.expenses.loanPayment}/mo`} />
        <div className="bg-emerald-500" style={{ width: `${(monthlyEnergyCost / totalMonthlyTCO) * 100}%` }} title={`Energy: $${Math.round(monthlyEnergyCost)}/mo`} />
        <div className="bg-amber-500" style={{ width: `${(car.expenses.repairs / totalMonthlyTCO) * 100}%` }} title={`Repairs: $${car.expenses.repairs}/mo`} />
        <div className="bg-sky-500" style={{ width: `${(car.expenses.insurance / totalMonthlyTCO) * 100}%` }} title={`Insurance: $${car.expenses.insurance}/mo`} />
        <div className="bg-rose-500" style={{ width: `${(car.expenses.depreciation / totalMonthlyTCO) * 100}%` }} title={`Depreciation: $${car.expenses.depreciation}/mo`} />
      </div>
      <div className="grid grid-cols-5 gap-1 text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-tight">
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />Fin</span>
        <span className="flex items-center gap-0.5 text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Enrg</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Mnt</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Insur</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Depr</span>
      </div>
    </div>
  );
}

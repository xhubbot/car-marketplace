'use client';

import { X, ArrowRight } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface ComparisonDeckCardProps {
  car: CarListing;
  energyCost: number;
  monthlyTCO: number;
  year3TCO: number;
  year3Depreciation: number;
  onRemove: (carId: string) => void;
  onSelectCar: (car: CarListing) => void;
}

export default function ComparisonDeckCard({
  car,
  energyCost,
  monthlyTCO,
  year3TCO,
  year3Depreciation,
  onRemove,
  onSelectCar,
}: ComparisonDeckCardProps) {
  const costRows = [
    { label: 'Loan Financing', value: `$${car.expenses.loanPayment}/mo`, className: '' },
    { label: 'Energy & Fuel', value: `$${energyCost}/mo`, className: 'text-emerald-500' },
    { label: 'Repairs & Maintain', value: `$${car.expenses.repairs}/mo`, className: '' },
    { label: 'Insurance index', value: `$${car.expenses.insurance}/mo`, className: '' },
    { label: 'Depreciation loss', value: `$${car.expenses.depreciation}/mo`, className: 'text-rose-500' },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40 flex flex-col justify-between shadow-xs relative overflow-hidden">
      <button
        onClick={() => onRemove(car.id)}
        aria-label={`Remove ${car.make} ${car.model} from compare`}
        className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-rose-500 hover:text-white dark:bg-neutral-800 dark:hover:bg-rose-600 transition-colors cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div>
        <div className="flex gap-3 items-center">
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            referrerPolicy="no-referrer"
            className="h-10 w-14 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-sans text-sm font-bold text-neutral-900 dark:text-white leading-tight">
              {car.make} <span className="font-light">{car.model}</span>
            </h4>
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">{car.year}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-950/20">
            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">upfront cash sticker</span>
            <span className="font-mono text-base font-bold text-neutral-900 dark:text-white">${car.price.toLocaleString()}</span>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5">
            <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">true monthly cost</span>
            <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">${monthlyTCO.toLocaleString()}/mo</span>
          </div>
          <div className="space-y-2 text-xs">
            {costRows.map(({ label, value, className }) => (
              <div key={label} className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">{label}</span>
                <span className={`font-mono font-bold text-neutral-800 dark:text-neutral-200 ${className}`}>{value}</span>
              </div>
            ))}
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">cumulative 3-yr spend</span>
            <span className="font-mono text-sm font-bold text-neutral-800 dark:text-neutral-200">${year3TCO.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">lost to depreciation</span>
            <span className="font-mono text-sm font-bold text-rose-500">${year3Depreciation.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3">
        <button
          onClick={() => onSelectCar(car)}
          className="flex w-full items-center justify-center gap-1 text-xs font-bold text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 cursor-pointer"
        >
          Analyze Alone
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

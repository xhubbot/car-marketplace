'use client';

import { ShieldCheck, Plus, Check } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface CarCardBadgesProps {
  car: CarListing;
  isSelectedForCompare: boolean;
  toggleCompare: () => void;
}

const lifestyleColors: Record<string, string> = {
  speed: 'bg-rose-500',
  adventure: 'bg-amber-500',
  commute: 'bg-sky-500',
  pragmatic: 'bg-emerald-500',
};

export default function CarCardBadges({ car, isSelectedForCompare, toggleCompare }: CarCardBadgesProps) {
  return (
    <>
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${lifestyleColors[car.lifestyle] ?? 'bg-neutral-500'}`}>
          {car.lifestyleLabel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-neutral-800 border border-neutral-100 shadow-sm dark:bg-neutral-950/80 dark:text-neutral-200 dark:border-neutral-800">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          {car.truthScore} autod.pro Score
        </span>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); toggleCompare(); }}
        aria-label={isSelectedForCompare ? 'Remove from Compare Deck' : 'Add to Compare Deck'}
        className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 shadow-sm cursor-pointer ${
          isSelectedForCompare
            ? 'bg-emerald-500 text-white'
            : 'bg-white/95 text-neutral-500 hover:text-rose-500 dark:bg-neutral-900/95'
        }`}
      >
        {isSelectedForCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    </>
  );
}

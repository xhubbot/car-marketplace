'use client';

import { ArrowLeft, DollarSign, Sparkles } from 'lucide-react';
import type { ViewMode } from '@/lib/viewMode';

interface CarDetailsControlsProps {
  detailViewMode: ViewMode;
  setDetailViewMode: (mode: ViewMode) => void;
  onBack: () => void;
}

export default function CarDetailsControls({
  detailViewMode,
  setDetailViewMode,
  onBack,
}: CarDetailsControlsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <button
        onClick={onBack}
        className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-800 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Inventory
      </button>

      <div className="flex rounded-full border border-neutral-200 p-1 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <button
          onClick={() => setDetailViewMode('standard')}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
            detailViewMode === 'standard'
              ? 'bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Standard Listing Spec
        </button>

        <button
          onClick={() => setDetailViewMode('ownership')}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
            detailViewMode === 'ownership'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-neutral-500 hover:text-emerald-500'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Ownership Reality TCO
        </button>
      </div>
    </div>
  );
}

'use client';

import { Layers } from 'lucide-react';

export default function ComparisonDeckEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 mb-4 text-neutral-400">
        <Layers className="h-8 w-8" />
      </div>
      <h3 className="font-sans text-base font-bold text-neutral-800 dark:text-neutral-200">
        Your Comparison Deck is empty
      </h3>
      <p className="max-w-xs text-xs text-neutral-500 mt-1">
        Add cars from the catalogue using the (+) icon to run side-by-side dynamic Cost of Ownership comparisons.
      </p>
    </div>
  );
}

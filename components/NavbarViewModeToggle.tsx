'use client';

import { motion } from 'motion/react';
import { DollarSign, Sparkles } from 'lucide-react';
import type { ViewMode } from '@/lib/types';

interface NavbarViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function NavbarViewModeToggle({ viewMode, setViewMode }: NavbarViewModeToggleProps) {
  return (
    <div className="hidden md:flex items-center gap-1.5 rounded-full border border-neutral-200 p-1 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <button
        onClick={() => setViewMode('standard')}
        className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
          viewMode === 'standard'
            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
        }`}
      >
        {viewMode === 'standard' && (
          <motion.div
            layoutId="navViewMode"
            className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800 shadow-sm -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <DollarSign className="h-3.5 w-3.5" />
        Sticker Price
      </button>

      <button
        onClick={() => setViewMode('ownership')}
        className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
          viewMode === 'ownership'
            ? 'bg-emerald-500 text-white shadow-sm dark:bg-emerald-600'
            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
        }`}
      >
        {viewMode === 'ownership' && (
          <motion.div
            layoutId="navViewMode"
            className="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-600 shadow-sm -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <Sparkles className="h-3.5 w-3.5" />
        Monthly Ownership TCO
      </button>
    </div>
  );
}

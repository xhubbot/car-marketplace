'use client';

import { Layers, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/[locale]/_context/ThemeContext';
import { useCompare } from '@/app/[locale]/_context/CompareContext';
import LanguageSelector from './LanguageSelector';
import NavbarUserMenu from './NavbarUserMenu';

export default function NavbarActions() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { compareDeckIds, openCompareDeck } = useCompare();

  return (
    <div className="flex items-center gap-2">
      {/* Compare Deck trigger */}
      <button
        onClick={openCompareDeck}
        className="relative flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
      >
        <Layers className="h-4 w-4" />
        <span className="hidden lg:inline">Compare Deck</span>
        {compareDeckIds.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white leading-none">
            {compareDeckIds.length}
          </span>
        )}
      </button>

      {/* Merged auth + language pill */}
      <div className="hidden sm:flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xs divide-x divide-neutral-200 dark:divide-neutral-700">
        <NavbarUserMenu variant="merged" />
        <LanguageSelector variant="merged" />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}

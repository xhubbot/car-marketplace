'use client';

import { DollarSign, Sparkles } from 'lucide-react';
import type { ViewMode } from '@/lib/types';
import NavbarLogo from './NavbarLogo';
import NavbarViewModeToggle from './NavbarViewModeToggle';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';

interface NavbarProps {
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Navbar({
  viewMode,
  setViewMode,
  searchQuery = '',
  setSearchQuery = () => {},
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavbarLogo />

        {viewMode && setViewMode && (
          <NavbarViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}

        <div className="flex items-center gap-3">
          <NavbarSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <NavbarActions />
        </div>
      </div>

      {/* Mobile view-mode bar */}
      {viewMode && setViewMode && (
        <div className="flex md:hidden border-t border-neutral-200 px-4 py-2 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 justify-center">
          <div className="flex w-full max-w-sm items-center gap-1 rounded-full border border-neutral-200 p-1 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <button
              onClick={() => setViewMode('standard')}
              className={`flex-1 flex items-center justify-center gap-1 rounded-full py-1 text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950'
                  : 'text-neutral-500'
              }`}
            >
              <DollarSign className="h-3 w-3" />
              Sticker
            </button>
            <button
              onClick={() => setViewMode('ownership')}
              className={`flex-1 flex items-center justify-center gap-1 rounded-full py-1 text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === 'ownership'
                  ? 'bg-emerald-500 text-white'
                  : 'text-neutral-500'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              TCO
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

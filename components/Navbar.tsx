'use client';

import { motion } from 'motion/react';
import { Car, DollarSign, Sparkles, Search, Layers, Moon, Sun } from 'lucide-react';
import { ViewMode } from '@/lib/types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedCount: number;
  openCompare: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  savedCount,
  openCompare,
  darkMode,
  toggleDarkMode,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-md dark:bg-neutral-100 dark:text-neutral-950">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <span className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              autod<span className="text-emerald-500">.pro</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-medium leading-none">
              ownership-first classifieds
            </span>
          </div>
        </div>

        {/* Dynamic Cost-of-Ownership Global Toggle */}
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

        {/* Search, saved, and theme controls */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-1.5 pr-4 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-neutral-100"
            />
          </div>

          {/* Compare Deck Trigger */}
          <button
            onClick={openCompare}
            className="relative flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden lg:inline">Compare Deck</span>
            {savedCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white leading-none">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile view-mode notification/bar */}
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
            TCO Monthly
          </button>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Moon, Plus, Sun } from 'lucide-react';
import { useTheme } from '@/app/[locale]/_context/ThemeContext';
import LanguageSelector from './LanguageSelector';
import NavbarUserMenu from './NavbarUserMenu';

export default function NavbarActions() {
  const { darkMode, toggleDarkMode } = useTheme();
  const params = useParams();
  const locale = params.locale as string;
  
  return (
    <div className="flex items-center gap-2">
      {/* Sell Car trigger */}
      <Link
        href={`/${locale}/create`}
        className="flex h-9 items-center gap-1 rounded-full bg-emerald-500 px-3.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Sell Car</span>
      </Link>

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

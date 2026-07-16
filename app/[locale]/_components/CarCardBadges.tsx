'use client';

import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, MoreVertical, Share2, Flag } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface CarCardBadgesProps {
  car: CarListing;
}

const lifestyleColors: Record<string, string> = {
  speed: 'bg-rose-500',
  adventure: 'bg-amber-500',
  commute: 'bg-sky-500',
  pragmatic: 'bg-emerald-500',
};

export default function CarCardBadges({ car }: CarCardBadgesProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen((v) => !v); }}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 shadow-sm cursor-pointer ${
            isMenuOpen
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'bg-white/95 text-neutral-500 hover:text-neutral-900 dark:bg-neutral-900/95 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
          >
            <button
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Flag className="h-3.5 w-3.5" />
              Report listing
            </button>
          </div>
        )}
      </div>
    </>
  );
}

'use client';

import { motion } from 'motion/react';
import { Compass, Sparkles, Zap, Map, Flame } from 'lucide-react';

interface LifestyleFilterProps {
  selectedLifestyle: string;
  setSelectedLifestyle: (lifestyle: string) => void;
}

export default function LifestyleFilter({
  selectedLifestyle,
  setSelectedLifestyle,
}: LifestyleFilterProps) {
  const categories = [
    { id: 'all', label: 'All Inventory', icon: Compass, color: 'text-neutral-500' },
    { id: 'commute', label: 'Silent Commute', icon: Zap, color: 'text-sky-500' },
    { id: 'adventure', label: 'Wanderlust Rig', icon: Map, color: 'text-amber-500' },
    { id: 'speed', label: 'Speed Therapy', icon: Flame, color: 'text-rose-500' },
    { id: 'pragmatic', label: 'Daily Workhorse', icon: Sparkles, color: 'text-emerald-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Filter by your <span className="text-emerald-500">Missions & Vibe</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Forget boring body categories. Choose what you actually intend to do with your machine.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = selectedLifestyle === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedLifestyle(cat.id)}
              className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'border-neutral-900 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'border-neutral-200/80 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <IconComponent className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${cat.color}`} />
              <span>{cat.label}</span>
              
              {isActive && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-emerald-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

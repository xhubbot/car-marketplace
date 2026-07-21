'use client';

import { motion } from 'motion/react';
import type { ViewMode } from '@/lib/viewMode';
import type { RealListing } from '@/lib/listing';
import CarCardBadges from './CarCardBadges';
import CarCardImage from './CarCardImage';
import CarCardPrice from './CarCardPrice';
import CarCardStats from './CarCardStats';

interface CarCardProps {
  car: RealListing;
  globalViewMode: ViewMode;
  onSelect: () => void;
}

export default function CarCard({ car, globalViewMode, onSelect }: CarCardProps) {
  const isOwnershipMode = globalViewMode === 'ownership';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-300 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
    >
      <CarCardBadges make={car.make} model={car.model} />
      <CarCardImage car={car} onSelect={onSelect} />

      <div className="flex flex-1 flex-col p-5">
        {/* Make, Model & Year */}
        <div className="flex items-start justify-between">
          <div onClick={onSelect} className="cursor-pointer">
            <h3 className="font-sans text-lg font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {car.make} <span className="font-light">{car.model}</span>
            </h3>
            <p className="mt-1 font-mono text-xs font-semibold text-neutral-400 dark:text-neutral-500">
              {car.year}{car.color ? ` • ${car.color}` : ''}
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md dark:bg-neutral-800 dark:text-neutral-300">
            {car.specs.fuelTypeTechnicalName.toUpperCase()}
          </span>
        </div>

        <CarCardPrice car={car} isOwnershipMode={isOwnershipMode} />
        <CarCardStats car={car} onSelect={onSelect} />
      </div>
    </motion.div>
  );
}

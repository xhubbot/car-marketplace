'use client';

import { motion } from 'motion/react';
import type { CarListing, ViewMode } from '@/lib/types';
import { calculateEnergyCost, calculateTotalMonthlyTCO, getClassAverageTCO, DEFAULT_FUEL_PRICE, DEFAULT_ELECTRICITY_PRICE } from '@/lib/tco';
import CarCardBadges from './CarCardBadges';
import CarCardImage from './CarCardImage';
import CarCardPrice from './CarCardPrice';
import CarCardStats from './CarCardStats';

interface CarCardProps {
  car: CarListing;
  globalViewMode: ViewMode;
  isSelectedForCompare: boolean;
  toggleCompare: () => void;
  onSelect: () => void;
  monthlyMileage: number;
}

export default function CarCard({
  car,
  globalViewMode,
  isSelectedForCompare,
  toggleCompare,
  onSelect,
  monthlyMileage,
}: CarCardProps) {
  const isOwnershipMode = globalViewMode === 'ownership';
  const fuelCost = car.specs.fuelType === 'electric' ? DEFAULT_ELECTRICITY_PRICE : DEFAULT_FUEL_PRICE;
  const monthlyEnergyCost = calculateEnergyCost(monthlyMileage, car.specs.fuelEfficiency, car.specs.fuelType, fuelCost);
  const totalMonthlyTCO = calculateTotalMonthlyTCO(
    car.expenses.loanPayment,
    car.expenses.repairs,
    car.expenses.insurance,
    car.expenses.depreciation,
    monthlyEnergyCost,
  );
  const totalRunningCostOnly = Math.round(car.expenses.repairs + car.expenses.insurance + monthlyEnergyCost);
  const classAverageTCO = getClassAverageTCO(car.lifestyle);
  const isBelowAverage = totalMonthlyTCO < classAverageTCO;
  const percentDiff = Math.abs(Math.round(((totalMonthlyTCO - classAverageTCO) / classAverageTCO) * 100));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-300 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
    >
      <CarCardBadges car={car} isSelectedForCompare={isSelectedForCompare} toggleCompare={toggleCompare} />
      <CarCardImage car={car} onSelect={onSelect} />

      <div className="flex flex-1 flex-col p-5">
        {/* Make, Model & Year */}
        <div className="flex items-start justify-between">
          <div onClick={onSelect} className="cursor-pointer">
            <h3 className="font-sans text-lg font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {car.make} <span className="font-light">{car.model}</span>
            </h3>
            <p className="mt-1 font-mono text-xs font-semibold text-neutral-400 dark:text-neutral-500">
              {car.year} &bull; {car.color}
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md dark:bg-neutral-800 dark:text-neutral-300">
            {car.specs.fuelType.toUpperCase()}
          </span>
        </div>

        <CarCardPrice
          car={car}
          isOwnershipMode={isOwnershipMode}
          totalMonthlyTCO={totalMonthlyTCO}
          totalRunningCostOnly={totalRunningCostOnly}
          monthlyEnergyCost={monthlyEnergyCost}
        />

        <CarCardStats
          car={car}
          isOwnershipMode={isOwnershipMode}
          totalMonthlyTCO={totalMonthlyTCO}
          classAverageTCO={classAverageTCO}
          isBelowAverage={isBelowAverage}
          percentDiff={percentDiff}
          onSelect={onSelect}
        />
      </div>
    </motion.div>
  );
}

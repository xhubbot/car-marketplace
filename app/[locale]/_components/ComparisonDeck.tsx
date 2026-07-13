'use client';

import { motion } from 'motion/react';
import { X, Layers } from 'lucide-react';
import type { CarListing } from '@/lib/types';
import { calculateEnergyCost, calculateTotalMonthlyTCO, DEFAULT_FUEL_PRICE, DEFAULT_ELECTRICITY_PRICE } from '@/lib/tco';
import ComparisonDeckEmpty from './ComparisonDeckEmpty';
import ComparisonDeckCard from './ComparisonDeckCard';
import ComparisonDeckVerdict from './ComparisonDeckVerdict';

interface ComparisonDeckProps {
  selectedCars: CarListing[];
  onRemove: (carId: string) => void;
  onSelectCar: (car: CarListing) => void;
  onClose: () => void;
  monthlyMileage: number;
}

export default function ComparisonDeck({
  selectedCars,
  onRemove,
  onSelectCar,
  onClose,
  monthlyMileage,
}: ComparisonDeckProps) {
  const comparedData = selectedCars.map((car) => {
    const fuelCost = car.specs.fuelType === 'electric' ? DEFAULT_ELECTRICITY_PRICE : DEFAULT_FUEL_PRICE;
    const energyCost = calculateEnergyCost(monthlyMileage, car.specs.fuelEfficiency, car.specs.fuelType, fuelCost);
    const monthlyTCO = calculateTotalMonthlyTCO(
      car.expenses.loanPayment,
      car.expenses.repairs,
      car.expenses.insurance,
      car.expenses.depreciation,
      energyCost,
    );
    return { car, energyCost, monthlyTCO, year3TCO: monthlyTCO * 36, year3Depreciation: car.expenses.depreciation * 36 };
  });

  const getVerdict = () => {
    if (selectedCars.length < 2) return null;
    const sortedByTCO = [...comparedData].sort((a, b) => a.monthlyTCO - b.monthlyTCO);
    const sortedBySticker = [...comparedData].sort((a, b) => a.car.price - b.car.price);
    const cheapestTCO = sortedByTCO[0];
    const cheapestSticker = sortedBySticker[0];
    if (cheapestTCO.car.id !== cheapestSticker.car.id) {
      return {
        text: `Financial Paradox Detected! While the ${cheapestSticker.car.make} ${cheapestSticker.car.model} is cheapest upfront ($${cheapestSticker.car.price.toLocaleString()}), the ${cheapestTCO.car.make} ${cheapestTCO.car.model} is cheaper to run at only $${cheapestTCO.monthlyTCO}/month.`,
      };
    }
    return {
      text: `The ${cheapestTCO.car.make} ${cheapestTCO.car.model} is the absolute champion: lowest sticker at $${cheapestTCO.car.price.toLocaleString()} and lowest monthly running cost of $${cheapestTCO.monthlyTCO}/mo. Score: ${cheapestTCO.car.truthScore}/100.`,
    };
  };

  const gridClass =
    selectedCars.length >= 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : selectedCars.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="w-full max-w-6xl rounded-t-3xl bg-neutral-50 p-6 dark:bg-neutral-950 shadow-2xl border border-neutral-200/50 dark:border-neutral-800"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            <h2 className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Financial Comparative Deck
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
              {selectedCars.length} selected
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close compare deck"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {selectedCars.length === 0 ? (
          <ComparisonDeckEmpty />
        ) : (
          <div className="mt-6 space-y-6">
            <div className={`grid gap-4 ${gridClass}`}>
              {comparedData.map(({ car, energyCost, monthlyTCO, year3TCO, year3Depreciation }) => (
                <ComparisonDeckCard
                  key={car.id}
                  car={car}
                  energyCost={energyCost}
                  monthlyTCO={monthlyTCO}
                  year3TCO={year3TCO}
                  year3Depreciation={year3Depreciation}
                  onRemove={onRemove}
                  onSelectCar={onSelectCar}
                />
              ))}
            </div>
            <ComparisonDeckVerdict verdict={getVerdict()} carCount={selectedCars.length} />
          </div>
        )}
      </motion.div>
    </div>
  );
}

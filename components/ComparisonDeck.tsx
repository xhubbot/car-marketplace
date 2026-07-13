'use client';

import { motion } from 'motion/react';
import { CarListing } from '@/lib/types';
import { X, Layers, Landmark, Fuel, ShieldCheck, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

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
  const fuelPrice = 1.65;
  const electricityPrice = 0.18;

  const comparedData = selectedCars.map((car) => {
    let energyCost = 0;
    if (car.specs.fuelType === 'electric') {
      energyCost = (monthlyMileage * car.specs.fuelEfficiency * electricityPrice) / 100;
    } else {
      energyCost = (monthlyMileage * car.specs.fuelEfficiency * fuelPrice) / 100;
    }
    const monthlyTCO = Math.round(
      car.expenses.loanPayment + car.expenses.repairs + car.expenses.insurance + car.expenses.depreciation + energyCost
    );
    return { car, energyCost: Math.round(energyCost), monthlyTCO, year3TCO: monthlyTCO * 36, year3Depreciation: car.expenses.depreciation * 36 };
  });

  const getVerdict = () => {
    if (selectedCars.length < 2) return null;
    const sortedByTCO = [...comparedData].sort((a, b) => a.monthlyTCO - b.monthlyTCO);
    const sortedBySticker = [...comparedData].sort((a, b) => a.car.price - b.car.price);
    const cheapestTCO = sortedByTCO[0];
    const cheapestSticker = sortedBySticker[0];
    const hasMismatch = cheapestTCO.car.id !== cheapestSticker.car.id;
    if (hasMismatch) {
      return {
        text: `Financial Paradox Detected! While the ${cheapestSticker.car.make} ${cheapestSticker.car.model} is cheapest upfront ($${cheapestSticker.car.price.toLocaleString()}), the ${cheapestTCO.car.make} ${cheapestTCO.car.model} is cheaper to run at only $${cheapestTCO.monthlyTCO}/month.`,
      };
    }
    return {
      text: `The ${cheapestTCO.car.make} ${cheapestTCO.car.model} is the absolute champion: lowest sticker at $${cheapestTCO.car.price.toLocaleString()} and lowest monthly running cost of $${cheapestTCO.monthlyTCO}/mo. Score: ${cheapestTCO.car.truthScore}/100.`,
    };
  };

  const verdict = getVerdict();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="w-full max-w-6xl rounded-t-3xl bg-neutral-50 p-6 dark:bg-neutral-950 shadow-2xl border border-neutral-200/50 dark:border-neutral-800"
      >
        {/* Header */}
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {selectedCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 mb-4 text-neutral-400">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="font-sans text-base font-bold text-neutral-800 dark:text-neutral-200">Your Comparison Deck is empty</h3>
            <p className="max-w-xs text-xs text-neutral-500 mt-1">
              Add cars from the catalogue using the (+) icon to run side-by-side dynamic Cost of Ownership comparisons.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className={`grid grid-cols-1 gap-4 ${selectedCars.length >= 2 ? 'md:grid-cols-2' : ''} ${selectedCars.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
              {comparedData.map(({ car, energyCost, monthlyTCO, year3TCO, year3Depreciation }) => (
                <div
                  key={car.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40 flex flex-col justify-between shadow-xs relative overflow-hidden"
                >
                  <button
                    onClick={() => onRemove(car.id)}
                    className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-rose-500 hover:text-white dark:bg-neutral-800 dark:hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div>
                    <div className="flex gap-3 items-center">
                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        referrerPolicy="no-referrer"
                        className="h-10 w-14 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-sans text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                          {car.make} <span className="font-light">{car.model}</span>
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">{car.year}</span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-950/20">
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">upfront cash sticker</span>
                        <span className="font-mono text-base font-bold text-neutral-900 dark:text-white">${car.price.toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl bg-emerald-500/10 p-2.5">
                        <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">true monthly cost</span>
                        <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">${monthlyTCO.toLocaleString()}/mo</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {[
                          { label: 'Loan Financing', value: `$${car.expenses.loanPayment}/mo`, className: '' },
                          { label: 'Energy & Fuel', value: `$${energyCost}/mo`, className: 'text-emerald-500' },
                          { label: 'Repairs & Maintain', value: `$${car.expenses.repairs}/mo`, className: '' },
                          { label: 'Insurance index', value: `$${car.expenses.insurance}/mo`, className: '' },
                          { label: 'Depreciation loss', value: `$${car.expenses.depreciation}/mo`, className: 'text-rose-500' },
                        ].map(({ label, value, className }) => (
                          <div key={label} className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                            <span className="text-neutral-500">{label}</span>
                            <span className={`font-mono font-bold text-neutral-800 dark:text-neutral-200 ${className}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2">
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">cumulative 3-yr spend</span>
                        <span className="font-mono text-sm font-bold text-neutral-800 dark:text-neutral-200">${year3TCO.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">lost to depreciation</span>
                        <span className="font-mono text-sm font-bold text-rose-500">${year3Depreciation.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3">
                    <button
                      onClick={() => { onSelectCar(car); onClose(); }}
                      className="flex w-full items-center justify-center gap-1 text-xs font-bold text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 cursor-pointer"
                    >
                      Analyze Alone
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {verdict && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/10">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="font-sans text-sm font-bold text-neutral-900 dark:text-white">autod.pro Advisory verdict</h4>
                    <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{verdict.text}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedCars.length < 2 && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Select at least 2 cars to activate the Automated Financial Advisor recommendation.</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

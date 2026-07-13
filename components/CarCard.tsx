'use client';

import { motion } from 'motion/react';
import { Heart, Activity, DollarSign, Calendar, Fuel, ShieldCheck, Gauge, TrendingDown, Landmark, Sparkles, Plus, Check } from 'lucide-react';
import { CarListing, ViewMode } from '@/lib/types';

interface CarCardProps {
  key?: string;
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

  const fuelPrice = 1.65;
  const electricityPrice = 0.18;
  
  let monthlyEnergyCost = 0;
  if (car.specs.fuelType === 'electric') {
    monthlyEnergyCost = (monthlyMileage * car.specs.fuelEfficiency * electricityPrice) / 100;
  } else {
    monthlyEnergyCost = (monthlyMileage * car.specs.fuelEfficiency * fuelPrice) / 100;
  }

  const totalMonthlyTCO = Math.round(
    car.expenses.loanPayment + 
    car.expenses.repairs + 
    car.expenses.insurance + 
    car.expenses.depreciation + 
    monthlyEnergyCost
  );

  const totalRunningCostOnly = Math.round(
    car.expenses.repairs + 
    car.expenses.insurance + 
    monthlyEnergyCost
  );

  const classAverageTCO = car.lifestyle === 'speed' ? 1900 : car.lifestyle === 'adventure' ? 950 : car.lifestyle === 'commute' ? 1100 : 750;
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
      
      {/* Listing Top Badge Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
          car.lifestyle === 'speed' 
            ? 'bg-rose-500' 
            : car.lifestyle === 'adventure' 
            ? 'bg-amber-500' 
            : car.lifestyle === 'commute' 
            ? 'bg-sky-500' 
            : 'bg-emerald-500'
        }`}>
          {car.lifestyleLabel}
        </span>
        
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-neutral-800 border border-neutral-100 shadow-sm dark:bg-neutral-950/80 dark:text-neutral-200 dark:border-neutral-800">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          {car.truthScore} autod.pro Score
        </span>
      </div>

      {/* Save to Compare Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleCompare();
        }}
        className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 shadow-sm cursor-pointer ${
          isSelectedForCompare
            ? 'bg-emerald-500 text-white'
            : 'bg-white/95 text-neutral-500 hover:text-rose-500 dark:bg-neutral-900/95'
        }`}
        title={isSelectedForCompare ? "Remove from Compare Deck" : "Add to Compare Deck"}
      >
        {isSelectedForCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>

      {/* Car Image Preview Container */}
      <div 
        onClick={onSelect}
        className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
      >
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-60" />
      </div>

      {/* Listing Card Details Area */}
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

        {/* Dynamic Price Display */}
        <div className="mt-5 border-y border-neutral-100 py-4 dark:border-neutral-800/80">
          {!isOwnershipMode ? (
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                  stick price / cash
                </p>
                <p className="font-mono text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  ${car.price.toLocaleString()}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                  est. finance
                </p>
                <p className="font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  From ${car.expenses.loanPayment}/mo
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 uppercase">
                      true monthly cost
                    </p>
                    <Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" />
                  </div>
                  <p className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    ${totalMonthlyTCO.toLocaleString()}<span className="text-sm font-normal text-neutral-400 dark:text-neutral-500"> / mo</span>
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                    pure running
                  </p>
                  <p className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-200">
                    ${totalRunningCostOnly.toLocaleString()}/mo
                  </p>
                </div>
              </div>

              {/* Expense Proportion Visual Bar */}
              <div className="h-2 w-full flex overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 mt-2">
                <div 
                  className="bg-neutral-900 dark:bg-white" 
                  style={{ width: `${(car.expenses.loanPayment / totalMonthlyTCO) * 100}%` }}
                  title={`Finance: $${car.expenses.loanPayment}/mo`}
                />
                <div 
                  className="bg-emerald-500" 
                  style={{ width: `${(monthlyEnergyCost / totalMonthlyTCO) * 100}%` }}
                  title={`Energy: $${Math.round(monthlyEnergyCost)}/mo`}
                />
                <div 
                  className="bg-amber-500" 
                  style={{ width: `${(car.expenses.repairs / totalMonthlyTCO) * 100}%` }}
                  title={`Repairs: $${car.expenses.repairs}/mo`}
                />
                <div 
                  className="bg-sky-500" 
                  style={{ width: `${(car.expenses.insurance / totalMonthlyTCO) * 100}%` }}
                  title={`Insurance: $${car.expenses.insurance}/mo`}
                />
                <div 
                  className="bg-rose-500" 
                  style={{ width: `${(car.expenses.depreciation / totalMonthlyTCO) * 100}%` }}
                  title={`Depreciation: $${car.expenses.depreciation}/mo`}
                />
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-5 gap-1 pt-1 text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-tight">
                <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />Fin</span>
                <span className="flex items-center gap-0.5 text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Enrg</span>
                <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Mnt</span>
                <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Insur</span>
                <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Depr</span>
              </div>
            </div>
          )}
        </div>

        {/* Key Performance Benchmarks */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
            <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">efficiency</p>
            <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {car.specs.fuelEfficiency} {car.specs.fuelType === 'electric' ? 'kWh' : 'L'}/100km
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
            <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">power</p>
            <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{car.specs.power}</p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900">
            <p className="text-[9px] font-mono text-neutral-400 uppercase dark:text-neutral-500">acceleration</p>
            <p className="mt-0.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{car.specs.acceleration.split(' ')[0]}</p>
          </div>
        </div>

        {/* Ownership Benchmarking */}
        {isOwnershipMode && (
          <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-950/20">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 font-sans">vs. Class Average (${classAverageTCO}/mo)</span>
              <span className={`font-mono font-bold ${isBelowAverage ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isBelowAverage ? '-' : '+'}{percentDiff}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative">
              <div 
                className={`h-full rounded-full ${isBelowAverage ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min((totalMonthlyTCO / (classAverageTCO * 1.5)) * 100, 100)}%` }}
              />
              <div className="absolute left-[66%] top-0 h-full w-0.5 bg-neutral-400" title="Class Average" />
            </div>
          </div>
        )}

        {/* Quick Highlights */}
        {!isOwnershipMode && (
          <div className="mt-4 space-y-1.5">
            {car.highlights.slice(0, 2).map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-2">
          <button
            onClick={onSelect}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-900 py-2.5 text-xs font-bold text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200 dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950 cursor-pointer shadow-xs"
          >
            <Activity className="h-3.5 w-3.5" />
            Analyze Financial Reality
          </button>
        </div>

      </div>
    </motion.div>
  );
}

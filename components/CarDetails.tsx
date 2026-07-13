'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CarListing, ViewMode } from '@/lib/types';
import { 
  ArrowLeft, 
  DollarSign, 
  Sparkles, 
  MapPin, 
  Phone, 
  Star, 
  Fuel, 
  TrendingDown, 
  Cpu, 
  Activity, 
  User, 
  Sliders, 
  Award,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

interface CarDetailsProps {
  car: CarListing;
  onBack: () => void;
  onToggleCompare: () => void;
  isSaved: boolean;
}

export default function CarDetails({
  car,
  onBack,
  onToggleCompare,
  isSaved,
}: CarDetailsProps) {
  const [detailViewMode, setDetailViewMode] = useState<ViewMode>('standard');
  const [downpayment, setDownpayment] = useState<number>(Math.round(car.price * 0.20));
  const [interestRate, setInterestRate] = useState<number>(5.9);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [monthlyMileage, setMonthlyMileage] = useState<number>(1500);
  const [fuelCostInput, setFuelCostInput] = useState<number>(
    car.specs.fuelType === 'electric' ? 0.18 : 1.65
  );
  const [driverProfile, setDriverProfile] = useState<'youth' | 'standard' | 'veteran'>('standard');
  const [usageIntensity, setUsageIntensity] = useState<'gentle' | 'standard' | 'sport'>('standard');

  const loanPaymentCalculated = useMemo(() => {
    const principal = car.price - downpayment;
    if (principal <= 0) return 0;
    const monthlyRate = (interestRate / 100) / 12;
    const totalPayments = loanTerm * 12;
    if (monthlyRate === 0) return principal / totalPayments;
    const pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                (Math.pow(1 + monthlyRate, totalPayments) - 1);
    return Math.round(pmt);
  }, [car.price, downpayment, interestRate, loanTerm]);

  const energyCostCalculated = useMemo(() => {
    return Math.round((monthlyMileage * car.specs.fuelEfficiency * fuelCostInput) / 100);
  }, [monthlyMileage, car.specs.fuelEfficiency, fuelCostInput]);

  const insuranceCalculated = useMemo(() => {
    const base = car.expenses.insurance;
    if (driverProfile === 'youth') return Math.round(base * 1.75);
    if (driverProfile === 'veteran') return Math.round(base * 0.82);
    return base;
  }, [car.expenses.insurance, driverProfile]);

  const repairsCalculated = useMemo(() => {
    const base = car.expenses.repairs;
    if (usageIntensity === 'gentle') return Math.round(base * 0.70);
    if (usageIntensity === 'sport') return Math.round(base * 1.45);
    return base;
  }, [car.expenses.repairs, usageIntensity]);

  const depreciationCalculated = car.expenses.depreciation;

  const totalMonthlyTCO = useMemo(() => {
    return loanPaymentCalculated + energyCostCalculated + insuranceCalculated + repairsCalculated + depreciationCalculated;
  }, [loanPaymentCalculated, energyCostCalculated, insuranceCalculated, repairsCalculated, depreciationCalculated]);

  const cumulativeCosts = useMemo(() => {
    return {
      year1: totalMonthlyTCO * 12,
      year3: totalMonthlyTCO * 36,
      year5: totalMonthlyTCO * 60,
    };
  }, [totalMonthlyTCO]);

  const valueCurvePoints = useMemo(() => {
    const points = [];
    const initialValue = car.price;
    const deprecationRates = [1, 0.82, 0.70, 0.61, 0.54, 0.48];
    for (let i = 0; i <= 5; i++) {
      points.push({ year: i, value: Math.round(initialValue * deprecationRates[i]) });
    }
    return points;
  }, [car.price]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Detail Page Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-800 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Inventory
        </button>

        <div className="flex rounded-full border border-neutral-200 p-1 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setDetailViewMode('standard')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              detailViewMode === 'standard'
                ? 'bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Standard Listing Spec
          </button>
          
          <button
            onClick={() => setDetailViewMode('ownership')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              detailViewMode === 'ownership'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-neutral-500 hover:text-emerald-500'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Ownership Reality TCO
          </button>
        </div>

        <button
          onClick={onToggleCompare}
          className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-emerald-500 text-white'
              : 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
          }`}
        >
          {isSaved ? 'Saved in Compare' : 'Add to Compare Deck'}
        </button>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Card */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-xs">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                {car.year} Model Year
              </div>
              <div className="absolute top-4 right-4 rounded-full bg-emerald-500/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                Score: {car.truthScore}/100
              </div>
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="font-sans text-base font-bold tracking-tight text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-neutral-500" />
              Mechanical and Efficiency Parameters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Powerplant', value: car.specs.engine },
                { label: 'Total Output', value: car.specs.power },
                { label: '0 - 100 km/h', value: car.specs.acceleration },
                { label: 'Efficiency', value: `${car.specs.fuelEfficiency} ${car.specs.fuelType === 'electric' ? 'kWh' : 'L'}/100km` },
                { label: 'Transmission', value: car.specs.transmission },
                { label: 'Drivetrain', value: car.specs.driveType },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-950/40">
                  <p className="text-[10px] font-mono font-semibold uppercase text-neutral-400">{label}</p>
                  <p className="mt-1 font-sans text-sm font-bold text-neutral-800 dark:text-neutral-200">{value}</p>
                </div>
              ))}
              <div className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-950/40 col-span-2">
                <p className="text-[10px] font-mono font-semibold uppercase text-neutral-400">Estimated Range</p>
                <p className="mt-1 font-sans text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  {car.specs.range || 'Approximately 750+ km dynamic range'}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Vibe Check */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-900 text-white p-6 dark:bg-neutral-950/40">
            <h3 className="font-sans text-base font-bold tracking-tight text-white mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              The Driver Vibe Check
            </h3>
            <blockquote className="italic font-light text-neutral-300 text-sm leading-relaxed">
              &ldquo;{car.ownerReview}&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Verified long-term owner perspective</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="font-sans text-base font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
              Premium Configuration highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {car.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {detailViewMode === 'standard' ? (
              <motion.div
                key="sideA"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Standard Price Card */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                        verified selling price
                      </p>
                      <h2 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
                        ${car.price.toLocaleString()}
                      </h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold dark:bg-emerald-950/30 dark:text-emerald-400">
                      Standard Title
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    This represents the upfront sticker price. Title transfer and registration totals approximately <strong>$1,200</strong> depending on location.
                  </p>
                  <div className="mt-6 space-y-3">
                    {[
                      { label: 'Base Listing Price', value: `$${car.price.toLocaleString()}` },
                      { label: 'Title & Reg. Est', value: '$450' },
                      { label: 'Dealer Prep / Doc Fees', value: '$295' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-xs py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-500">{label}</span>
                        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs py-2">
                      <span className="font-bold text-neutral-900 dark:text-white">Estimated Driveaway Cash</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${(car.price + 745).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Bio Card */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <h3 className="font-sans text-base font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                    Listing Owner & Location
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={car.seller.avatar}
                      alt={car.seller.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-full object-cover border border-neutral-100 shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{car.seller.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-neutral-500 dark:bg-neutral-800">
                          {car.seller.type}
                        </span>
                        <div className="flex items-center text-amber-500 text-xs">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="ml-1 font-bold">{car.seller.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3 text-xs">
                    <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      <span>{car.seller.location} &bull; Remote purchase available</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span>{car.seller.phone} &bull; Call or encrypted text</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                      <Clock className="h-4 w-4 text-neutral-400" />
                      <span>Listed 2 days ago &bull; 1,440 views</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-2">
                    <button 
                      onClick={() => alert(`Connecting with ${car.seller.name}. Phone: ${car.seller.phone}`)}
                      className="w-full rounded-xl bg-neutral-950 py-3 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 cursor-pointer text-center"
                    >
                      Contact Owner Securely
                    </button>
                  </div>
                </div>

                {/* autod.pro Truth Score */}
                <div className="rounded-2xl border border-neutral-200 bg-emerald-500/10 p-6 dark:border-emerald-500/20 dark:bg-emerald-950/10">
                  <div className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-sans text-sm font-bold text-neutral-900 dark:text-white">Why the autod.pro score is {car.truthScore}</h4>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        This listing scores based on value retention, reliability, and running costs.
                      </p>
                      <div className="mt-4 space-y-2.5">
                        {[
                          { label: 'Value Retention Rate', value: car.truthBreakdown.valueRetention },
                          { label: 'Predicted Reliability Index', value: car.truthBreakdown.reliability },
                          { label: 'Running Cost Optimization', value: car.truthBreakdown.runningCosts },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div className="flex justify-between text-[11px] font-mono text-neutral-500 mb-1">
                              <span>{label}</span>
                              <span className="font-bold text-neutral-800 dark:text-neutral-200">{value}%</span>
                            </div>
                            <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sideB"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* TCO Total Card */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 dark:border-emerald-500/30 dark:bg-emerald-950/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                          simulated dynamic tco
                        </p>
                        <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                      </div>
                      <h2 className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        ${totalMonthlyTCO.toLocaleString()}<span className="text-sm font-normal text-neutral-400"> / mo</span>
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">yearly impact</p>
                      <p className="font-mono text-lg font-bold text-neutral-700 dark:text-neutral-300">
                        ${(totalMonthlyTCO * 12).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 w-full flex overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 mt-5">
                    <div className="bg-neutral-900 dark:bg-white" style={{ width: `${(loanPaymentCalculated / totalMonthlyTCO) * 100}%` }} />
                    <div className="bg-emerald-500" style={{ width: `${(energyCostCalculated / totalMonthlyTCO) * 100}%` }} />
                    <div className="bg-amber-500" style={{ width: `${(repairsCalculated / totalMonthlyTCO) * 100}%` }} />
                    <div className="bg-sky-500" style={{ width: `${(insuranceCalculated / totalMonthlyTCO) * 100}%` }} />
                    <div className="bg-rose-500" style={{ width: `${(depreciationCalculated / totalMonthlyTCO) * 100}%` }} />
                  </div>
                  
                  <div className="grid grid-cols-5 gap-1.5 pt-3 text-[9px] font-mono font-bold text-neutral-400 uppercase">
                    {[
                      { label: 'Loan', color: 'bg-neutral-900 dark:bg-white', textColor: 'text-neutral-700 dark:text-neutral-300', value: loanPaymentCalculated },
                      { label: 'Energy', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', value: energyCostCalculated },
                      { label: 'Mnt', color: 'bg-amber-500', textColor: 'text-neutral-800 dark:text-neutral-100', value: repairsCalculated },
                      { label: 'Insur', color: 'bg-sky-500', textColor: 'text-neutral-800 dark:text-neutral-100', value: insuranceCalculated },
                      { label: 'Depr', color: 'bg-rose-500', textColor: 'text-neutral-800 dark:text-neutral-100', value: depreciationCalculated },
                    ].map(({ label, color, textColor, value }) => (
                      <div key={label} className="flex flex-col">
                        <span className={`flex items-center gap-1 ${textColor}`}>
                          <span className={`h-2 w-2 rounded-full ${color} inline-block`} />
                          {label}
                        </span>
                        <span className={`text-[11px] font-semibold mt-0.5 ${textColor}`}>${value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Sliders */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60 space-y-6">
                  
                  {/* Financing */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <Sliders className="h-4 w-4 text-neutral-500" />
                      <h4 className="text-xs font-bold text-neutral-900 uppercase dark:text-white">Financing parameters</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Downpayment Cash</span>
                        <span className="font-mono font-bold">${downpayment.toLocaleString()} ({Math.round((downpayment / car.price) * 100)}%)</span>
                      </div>
                      <input type="range" min="0" max={Math.round(car.price * 0.80)} step="500" value={downpayment}
                        onChange={(e) => setDownpayment(Number(e.target.value))}
                        className="w-full accent-neutral-950 dark:accent-white h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Interest Rate</span>
                          <span className="font-mono font-bold">{interestRate}%</span>
                        </div>
                        <input type="range" min="1" max="15" step="0.1" value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full accent-neutral-950 dark:accent-white h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Loan Duration</span>
                          <span className="font-mono font-bold">{loanTerm} Years</span>
                        </div>
                        <input type="range" min="1" max="7" step="1" value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full accent-neutral-950 dark:accent-white h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none" />
                      </div>
                    </div>
                  </div>

                  {/* Energy & Mileage */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <Fuel className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-xs font-bold text-neutral-900 uppercase dark:text-white">energy & mileage dynamics</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Monthly Mileage Goal</span>
                        <span className="font-mono font-bold text-emerald-500">{monthlyMileage.toLocaleString()} km / month</span>
                      </div>
                      <input type="range" min="500" max="4000" step="100" value={monthlyMileage}
                        onChange={(e) => setMonthlyMileage(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">
                          Local {car.specs.fuelType === 'electric' ? 'Electricity Cost ($/kWh)' : 'Fuel Cost ($/L)'}
                        </span>
                        <span className="font-mono font-bold">${fuelCostInput}</span>
                      </div>
                      <input type="range"
                        min={car.specs.fuelType === 'electric' ? '0.05' : '1.00'}
                        max={car.specs.fuelType === 'electric' ? '0.50' : '2.50'}
                        step="0.01" value={fuelCostInput}
                        onChange={(e) => setFuelCostInput(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none" />
                    </div>
                  </div>

                  {/* Risk & Usage */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <User className="h-4 w-4 text-sky-500" />
                      <h4 className="text-xs font-bold text-neutral-900 uppercase dark:text-white">risk & usage categories</h4>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-neutral-500">Insurance Driver Class</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(['youth', 'standard', 'veteran'] as const).map((profile) => (
                          <button key={profile} onClick={() => setDriverProfile(profile)}
                            className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                              driverProfile === profile
                                ? 'bg-sky-500 text-white shadow-xs'
                                : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800'
                            }`}>
                            {profile === 'youth' ? 'Under 25' : profile === 'standard' ? '25-50 yrs' : '50+ Veteran'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-neutral-500">Driving Style (Maintenance Multiplier)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(['gentle', 'standard', 'sport'] as const).map((style) => (
                          <button key={style} onClick={() => setUsageIntensity(style)}
                            className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                              usageIntensity === style
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800'
                            }`}>
                            {style === 'gentle' ? 'Gentle Eco' : style === 'standard' ? 'Standard' : 'Aggressive'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Year Depreciation Chart */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase dark:text-white mb-1 flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4 text-rose-500" />
                    5-Year Future Valuation Curve
                  </h4>
                  <p className="text-[11px] text-neutral-400 mb-4">Predicted residual asset worth over 60 months</p>
                  <div className="h-40 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <path d="M 10 20 L 100 45 L 200 65 L 300 85 L 400 95 L 490 105 L 490 140 L 10 140 Z" fill="url(#chartGlow)" />
                      <path d="M 10 20 Q 100 45, 200 65 T 300 85 T 400 95 T 490 105" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                      {[
                        { cx: 10, cy: 20, r: 5 },
                        { cx: 100, cy: 45, r: 4 },
                        { cx: 200, cy: 65, r: 4 },
                        { cx: 300, cy: 85, r: 4 },
                        { cx: 400, cy: 95, r: 4 },
                        { cx: 490, cy: 105, r: 5 },
                      ].map(({ cx, cy, r }, i) => (
                        <circle key={i} cx={cx} cy={cy} r={r} fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                      ))}
                    </svg>
                    <div className="flex justify-between px-2 pt-1.5 text-[9px] font-mono text-neutral-400 font-bold uppercase">
                      <span>Now (${car.price.toLocaleString()})</span>
                      <span>Yr 1 (${valueCurvePoints[1].value.toLocaleString()})</span>
                      <span>Yr 3 (${valueCurvePoints[3].value.toLocaleString()})</span>
                      <span>Yr 5 (${valueCurvePoints[5].value.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Asset Depreciation warning:</strong> This vehicle will shed approximately <strong>${depreciationCalculated} per month</strong> of trade-in value.
                    </span>
                  </div>
                </div>

                {/* Cumulative Milestones */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase dark:text-white mb-4">
                    Cumulative Investment Milestones
                  </h4>
                  <div className="space-y-3.5">
                    {[
                      { label: '1 Year Total Investment', value: cumulativeCosts.year1, width: '20%' },
                      { label: '3 Year Total Investment', value: cumulativeCosts.year3, width: '60%' },
                      { label: '5 Year Total Investment', value: cumulativeCosts.year5, width: '100%' },
                    ].map(({ label, value, width }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1 dark:text-neutral-300">
                          <span>{label}</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white">${value.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full dark:bg-neutral-800 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

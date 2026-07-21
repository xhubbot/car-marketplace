'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sliders, Fuel, User, TrendingDown, Info, Sparkles } from 'lucide-react';
import type { RealListing } from '@/lib/listing';
import { useLoanProviders } from '@/hooks/useLoanProviders';
import { useInsuranceProviders } from '@/hooks/useInsuranceProviders';
import {
  computeMonthlyLoan,
  computeMonthlyInsurance,
  computeMonthlyFuelCost,
  computeTotalMonthlyOwning,
  getValueCurvePoints,
  clampLoanTermMonths,
} from '@/lib/ownershipFormulas';

interface CarDetailsOwnershipSidebarProps {
  car: RealListing;
}

const DEFAULT_FUEL_PRICE = 1.65;
const DEFAULT_ELECTRICITY_PRICE = 0.18;

export default function CarDetailsOwnershipSidebar({ car }: CarDetailsOwnershipSidebarProps) {
  const { loanProviders } = useLoanProviders();
  const { insuranceProviders } = useInsuranceProviders();

  const [loanProviderId, setLoanProviderId] = useState<number | null>(null);
  const [insuranceProviderId, setInsuranceProviderId] = useState<number | null>(null);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyMileage, setMonthlyMileage] = useState(1500);
  const [fuelCostInput, setFuelCostInput] = useState(car.specs.isElectric ? DEFAULT_ELECTRICITY_PRICE : DEFAULT_FUEL_PRICE);
  const [driverProfile, setDriverProfile] = useState<'youth' | 'standard' | 'veteran'>('standard');
  const [usageIntensity, setUsageIntensity] = useState<'gentle' | 'standard' | 'sport'>('standard');

  // Seed selections/defaults once the provider lists load.
  useEffect(() => {
    if (loanProviderId === null && loanProviders.length > 0) {
      const defaultProvider = loanProviders.find((p) => p.isDefault) ?? loanProviders[0];
      setLoanProviderId(defaultProvider.id);
      setDownPaymentPercent(defaultProvider.minDownpaymentPercent);
      setLoanTerm(clampLoanTermMonths(60, defaultProvider));
    }
  }, [loanProviders, loanProviderId]);

  useEffect(() => {
    if (insuranceProviderId === null && insuranceProviders.length > 0) {
      const defaultProvider = insuranceProviders.find((p) => p.isDefault) ?? insuranceProviders[0];
      setInsuranceProviderId(defaultProvider.id);
    }
  }, [insuranceProviders, insuranceProviderId]);

  const selectedLoanProvider = loanProviders.find((p) => p.id === loanProviderId) ?? null;
  const selectedInsuranceProvider = insuranceProviders.find((p) => p.id === insuranceProviderId) ?? null;

  const loanPaymentCalculated = useMemo(() => {
    if (!selectedLoanProvider) return car.monthlyCost.loan;
    return computeMonthlyLoan(car.price, downPaymentPercent, loanTerm, selectedLoanProvider);
  }, [car.price, car.monthlyCost.loan, downPaymentPercent, loanTerm, selectedLoanProvider]);

  const energyCostCalculated = useMemo(
    () => computeMonthlyFuelCost(car.specs.fuelEfficiency, fuelCostInput, monthlyMileage),
    [car.specs.fuelEfficiency, fuelCostInput, monthlyMileage]
  );

  const insuranceCalculated = useMemo(() => {
    const base = selectedInsuranceProvider
      ? computeMonthlyInsurance(selectedInsuranceProvider, car.specs.fuelTypeTechnicalName)
      : car.monthlyCost.insurance;
    if (driverProfile === 'youth') return Math.round(base * 1.75);
    if (driverProfile === 'veteran') return Math.round(base * 0.82);
    return Math.round(base);
  }, [selectedInsuranceProvider, car.specs.fuelTypeTechnicalName, car.monthlyCost.insurance, driverProfile]);

  const repairsCalculated = useMemo(() => {
    const base = car.monthlyCost.repair;
    if (usageIntensity === 'gentle') return Math.round(base * 0.7);
    if (usageIntensity === 'sport') return Math.round(base * 1.45);
    return Math.round(base);
  }, [car.monthlyCost.repair, usageIntensity]);

  const totalMonthlyTCO = useMemo(
    () =>
      Math.round(
        computeTotalMonthlyOwning(loanPaymentCalculated, insuranceCalculated, repairsCalculated) +
          energyCostCalculated
      ),
    [loanPaymentCalculated, insuranceCalculated, repairsCalculated, energyCostCalculated]
  );

  const cumulativeCosts = useMemo(
    () => ({ year1: totalMonthlyTCO * 12, year3: totalMonthlyTCO * 36, year5: totalMonthlyTCO * 60 }),
    [totalMonthlyTCO]
  );

  const valueCurvePoints = useMemo(() => getValueCurvePoints(car.price), [car.price]);
  const yearOneDrop = Math.round(car.price - valueCurvePoints[1].value);

  const costBands = [
    { label: 'Loan', color: 'bg-neutral-900 dark:bg-white', textColor: 'text-neutral-700 dark:text-neutral-300', value: loanPaymentCalculated },
    { label: 'Energy', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', value: energyCostCalculated },
    { label: 'Mnt', color: 'bg-amber-500', textColor: 'text-neutral-800 dark:text-neutral-100', value: repairsCalculated },
    { label: 'Insur', color: 'bg-sky-500', textColor: 'text-neutral-800 dark:text-neutral-100', value: insuranceCalculated },
  ];

  return (
    <div className="space-y-6">
      {/* TCO Total */}
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
              {totalMonthlyTCO.toLocaleString()} {car.currency}<span className="text-sm font-normal text-neutral-400"> / mo</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">yearly impact</p>
            <p className="font-mono text-lg font-bold text-neutral-700 dark:text-neutral-300">
              {(totalMonthlyTCO * 12).toLocaleString()} {car.currency}
            </p>
          </div>
        </div>

        <div className="h-2.5 w-full flex overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 mt-5">
          {costBands.map(({ label, color, value }) => (
            <div key={label} className={color} style={{ width: `${(value / totalMonthlyTCO) * 100}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1.5 pt-3 text-[9px] font-mono font-bold text-neutral-400 uppercase">
          {costBands.map(({ label, color, textColor, value }) => (
            <div key={label} className="flex flex-col">
              <span className={`flex items-center gap-1 ${textColor}`}>
                <span className={`h-2 w-2 rounded-full ${color} inline-block`} />
                {label}
              </span>
              <span className={`text-[11px] font-semibold mt-0.5 ${textColor}`}>{Math.round(value)}</span>
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

          {loanProviders.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-neutral-500">Loan provider</p>
              <select
                value={loanProviderId ?? ''}
                onChange={(e) => setLoanProviderId(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-900"
              >
                {loanProviders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.interestRateAnnual}%)
                  </option>
                ))}
              </select>
            </div>
          )}
          {insuranceProviders.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-neutral-500">Insurance provider</p>
              <select
                value={insuranceProviderId ?? ''}
                onChange={(e) => setInsuranceProviderId(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-900"
              >
                {insuranceProviders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Downpayment</span>
              <span className="font-mono font-bold">{downPaymentPercent}%</span>
            </div>
            <input
              type="range"
              min={selectedLoanProvider ? selectedLoanProvider.minDownpaymentPercent : 0}
              max="80"
              step="1"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-neutral-950 dark:accent-white h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Loan Duration</span>
              <span className="font-mono font-bold">{loanTerm} months</span>
            </div>
            <input
              type="range"
              min={selectedLoanProvider?.minTermMonths ?? 12}
              max={selectedLoanProvider?.maxTermMonths ?? 84}
              step="1"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full accent-neutral-950 dark:accent-white h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none"
            />
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
                {car.specs.isElectric ? 'Electricity Cost (/kWh)' : 'Fuel Cost (/L)'}
              </span>
              <span className="font-mono font-bold">{fuelCostInput}</span>
            </div>
            <input type="range"
              min={car.specs.isElectric ? '0.05' : '1.00'}
              max={car.specs.isElectric ? '0.50' : '2.50'}
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
                  className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    driverProfile === profile ? 'bg-sky-500 text-white shadow-xs' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800'
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
                  className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    usageIntensity === style ? 'bg-amber-500 text-white shadow-xs' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800'
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
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
            <path d="M 10 20 L 100 45 L 200 65 L 300 85 L 400 95 L 490 105 L 490 140 L 10 140 Z" fill="url(#chartGlow)" />
            <path d="M 10 20 Q 100 45, 200 65 T 300 85 T 400 95 T 490 105" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            {[{ cx: 10, cy: 20 }, { cx: 100, cy: 45 }, { cx: 200, cy: 65 }, { cx: 300, cy: 85 }, { cx: 400, cy: 95 }, { cx: 490, cy: 105 }].map(({ cx, cy }, i) => (
              <circle key={i} cx={cx} cy={cy} r={i === 0 || i === 5 ? 5 : 4} fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            ))}
          </svg>
          <div className="flex justify-between px-2 pt-1.5 text-[9px] font-mono text-neutral-400 font-bold uppercase">
            <span>Now ({car.price.toLocaleString()})</span>
            <span>Yr 1 ({valueCurvePoints[1].value.toLocaleString()})</span>
            <span>Yr 3 ({valueCurvePoints[3].value.toLocaleString()})</span>
            <span>Yr 5 ({valueCurvePoints[5].value.toLocaleString()})</span>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Asset Depreciation warning:</strong> This vehicle is projected to lose approximately <strong>{yearOneDrop.toLocaleString()} {car.currency}</strong> of resale value in year one.
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
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{value.toLocaleString()} {car.currency}</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

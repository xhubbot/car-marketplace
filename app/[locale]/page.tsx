'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter, useParams } from 'next/navigation';
import { CAR_LISTINGS } from '@/lib/data';
import type { ViewMode } from '@/lib/types';
import Navbar from '@/components/Navbar';
import CarCard from './_components/CarCard';
import LifestyleFilter from './_components/LifestyleFilter';
import { Sparkles, Sliders, Info, ShieldCheck, BarChart2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [monthlyMileage, setMonthlyMileage] = useState<number>(1500);

  const filteredCars = useMemo(() => {
    return CAR_LISTINGS.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.specs.engine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLifestyle = selectedLifestyle === 'all' || car.lifestyle === selectedLifestyle;
      return matchesSearch && matchesLifestyle;
    });
  }, [searchQuery, selectedLifestyle]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100 font-sans">
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pb-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
          {/* Hero Area */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 md:p-10 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-xs">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                New Paradigm Classifieds
              </span>
              <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                The true financial reality of <span className="text-emerald-500">car ownership</span>.
              </h1>
              <p className="font-sans text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Traditional directories list upfront sticker prices. We analyze real-world fuel/electricity consumption, historic maintenance wear, insurance risk brackets, and projected monthly depreciation curves to show what you will actually spend.
              </p>
            </div>
          </div>

          {/* Discovery Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-neutral-200/60 dark:border-neutral-800/80 pt-8">

            {/* Left Sidebar */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              <LifestyleFilter
                selectedLifestyle={selectedLifestyle}
                setSelectedLifestyle={setSelectedLifestyle}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* Mileage Tuner */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-sans text-sm font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
                    Dynamic Mileage Tuner
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Slide to adjust your expected monthly driving distance. All running cost estimations will recalculate in real-time!
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs font-bold">
                    <span className="text-neutral-400 uppercase">Mileage</span>
                    <span className="text-emerald-500">{monthlyMileage.toLocaleString()} km / mo</span>
                  </div>
                  <input
                    type="range" min="500" max="4000" step="100" value={monthlyMileage}
                    onChange={(e) => setMonthlyMileage(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none cursor-ew-resize"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-neutral-400 font-semibold uppercase">
                    <span>500 km</span><span>2,250 km</span><span>4,000 km</span>
                  </div>
                </div>
                <div className="flex gap-2 rounded-lg bg-emerald-50/50 p-2.5 text-[11px] text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Assumes gasoline at <strong>$1.65/L</strong> and electricity at <strong>$0.18/kWh</strong>.</span>
                </div>
              </div>

              {/* Authenticity Seal */}
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-100 p-5 dark:border-neutral-800/80 dark:bg-neutral-900/30 text-xs">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-bold text-neutral-900 dark:text-white">autod.pro Authenticity</h4>
                    <p className="mt-1 text-neutral-500 leading-relaxed">
                      We gather historic insurance ratings, manufacturer parts wear data, and depreciation estimates directly from global salvage registers and leasing desks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Listings Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Discovered {filteredCars.length} matches &bull; autod.pro verified
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                  <BarChart2 className="h-3.5 w-3.5" />
                  Cost display:{' '}
                  <span className={viewMode === 'ownership' ? 'text-emerald-500' : 'text-neutral-800 dark:text-neutral-200'}>
                    {viewMode.toUpperCase()}
                  </span>
                </div>
              </div>

              {filteredCars.length === 0 && (
                <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                  <p className="text-sm text-neutral-500">No cars match your search or selected vibe scenario.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedLifestyle('all'); }}
                    className="mt-3 text-xs font-bold text-emerald-500 underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}

              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      globalViewMode={viewMode}
                      onSelect={() => router.push(`/${locale}/details/${car.id}`)}
                      monthlyMileage={monthlyMileage}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

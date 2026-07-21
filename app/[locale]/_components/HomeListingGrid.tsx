'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import type { ViewMode } from '@/lib/viewMode';
import type { RealListing } from '@/lib/listing';
import Navbar from '@/components/Navbar';
import NavbarViewModeToggle from '@/components/NavbarViewModeToggle';
import CarCard from './CarCard';
import { Sparkles, ShieldCheck, BarChart2 } from 'lucide-react';

interface HomeListingGridProps {
  locale: string;
  listings: RealListing[];
}

export default function HomeListingGrid({ locale, listings }: HomeListingGridProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('standard');

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100 font-sans">
      <Navbar viewMode={viewMode} setViewMode={setViewMode} />

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
                Traditional directories list upfront sticker prices. We compute real loan, insurance,
                repair, and fuel costs from live provider data to show what you will actually spend.
              </p>
            </div>
          </div>

          {/* Discovery Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-neutral-200/60 dark:border-neutral-800/80 pt-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Cost display <span className="text-emerald-500">mode</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Toggle between sticker price and the real monthly cost of ownership.
                  </p>
                </div>
                <NavbarViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>

              {/* Authenticity Seal */}
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-100 p-5 dark:border-neutral-800/80 dark:bg-neutral-900/30 text-xs">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-bold text-neutral-900 dark:text-white">autod.pro Authenticity</h4>
                    <p className="mt-1 text-neutral-500 leading-relaxed">
                      Monthly cost figures are computed from real loan and insurance provider terms
                      and per-make/model repair-cost estimates, not marketing averages.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Listings Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {listings.length} listings &bull; autod.pro verified
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                  <BarChart2 className="h-3.5 w-3.5" />
                  Cost display:{' '}
                  <span className={viewMode === 'ownership' ? 'text-emerald-500' : 'text-neutral-800 dark:text-neutral-200'}>
                    {viewMode.toUpperCase()}
                  </span>
                </div>
              </div>

              {listings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                  <p className="text-sm text-neutral-500">No active listings right now.</p>
                </div>
              )}

              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {listings.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      globalViewMode={viewMode}
                      onSelect={() => router.push(`/${locale}/details/${car.id}`)}
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

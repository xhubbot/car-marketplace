'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import type { CarListing, ViewMode } from '@/lib/types';
import Navbar from '@/components/Navbar';
import CarDetailsControls from './CarDetailsControls';
import CarDetailsPhotoSpecs from './CarDetailsPhotoSpecs';
import CarDetailsStandardSidebar from './CarDetailsStandardSidebar';
import CarDetailsOwnershipSidebar from './CarDetailsOwnershipSidebar';

interface CarDetailsViewProps {
  car: CarListing;
}

export default function CarDetailsView({ car }: CarDetailsViewProps) {
  const router = useRouter();
  const [detailViewMode, setDetailViewMode] = useState<ViewMode>('standard');

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100 font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
        <CarDetailsControls
          detailViewMode={detailViewMode}
          setDetailViewMode={setDetailViewMode}
          onBack={() => router.back()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <CarDetailsPhotoSpecs car={car} />

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {detailViewMode === 'standard' ? (
                <motion.div
                  key="standard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <CarDetailsStandardSidebar car={car} />
                </motion.div>
              ) : (
                <motion.div
                  key="ownership"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <CarDetailsOwnershipSidebar car={car} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

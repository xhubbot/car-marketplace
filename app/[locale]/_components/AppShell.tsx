'use client';

import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../_context/ThemeContext';
import { CompareProvider, useCompare } from '../_context/CompareContext';
import ComparisonDeck from './ComparisonDeck';

interface AppShellInnerProps {
  children: ReactNode;
  locale: string;
}

function AppShellInner({ children, locale }: AppShellInnerProps) {
  const router = useRouter();
  const {
    showCompareDeck,
    closeCompareDeck,
    openCompareDeck,
    selectedCarsForCompare,
    toggleCompare,
    compareDeckIds,
    monthlyMileage,
  } = useCompare();

  return (
    <>
      {children}
      <AnimatePresence>
        {showCompareDeck && (
          <ComparisonDeck
            selectedCars={selectedCarsForCompare}
            onRemove={toggleCompare}
            onSelectCar={(car) => {
              closeCompareDeck();
              router.push(`/${locale}/details/${car.id}`);
            }}
            onClose={closeCompareDeck}
            monthlyMileage={monthlyMileage}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!showCompareDeck && compareDeckIds.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={openCompareDeck}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-emerald-500 text-white px-5 py-3 font-bold shadow-lg hover:bg-emerald-600 cursor-pointer"
          >
            <Heart className="h-4 w-4 fill-current animate-pulse text-white" />
            Compare ({compareDeckIds.length})
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

interface AppShellProps {
  children: ReactNode;
  locale: string;
}

export default function AppShell({ children, locale }: AppShellProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CompareProvider>
          <AppShellInner locale={locale}>{children}</AppShellInner>
        </CompareProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

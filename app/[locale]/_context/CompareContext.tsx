'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CAR_LISTINGS } from '@/lib/data';
import type { CarListing } from '@/lib/types';

interface CompareContextValue {
  compareDeckIds: string[];
  toggleCompare: (carId: string) => void;
  selectedCarsForCompare: CarListing[];
  showCompareDeck: boolean;
  openCompareDeck: () => void;
  closeCompareDeck: () => void;
  monthlyMileage: number;
  setMonthlyMileage: (value: number) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareDeckIds, setCompareDeckIds] = useState<string[]>([]);
  const [showCompareDeck, setShowCompareDeck] = useState(false);
  const [monthlyMileage, setMonthlyMileage] = useState(1500);

  const toggleCompare = useCallback((carId: string) => {
    setCompareDeckIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId);
      if (prev.length >= 3) return prev;
      return [...prev, carId];
    });
  }, []);

  const selectedCarsForCompare = CAR_LISTINGS.filter((c) => compareDeckIds.includes(c.id));

  return (
    <CompareContext.Provider
      value={{
        compareDeckIds,
        toggleCompare,
        selectedCarsForCompare,
        showCompareDeck,
        openCompareDeck: () => setShowCompareDeck(true),
        closeCompareDeck: () => setShowCompareDeck(false),
        monthlyMileage,
        setMonthlyMileage,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}

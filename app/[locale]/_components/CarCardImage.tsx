'use client';

import type { RealListing } from '@/lib/listing';

interface CarCardImageProps {
  car: RealListing;
  onSelect: () => void;
}

export default function CarCardImage({ car, onSelect }: CarCardImageProps) {
  return (
    <div
      onClick={onSelect}
      className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
    >
      {car.image ? (
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-neutral-400">
          No photo
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
    </div>
  );
}

import type { RealListing } from '@/lib/listing';

interface CarDetailsStandardSidebarProps {
  car: RealListing;
}

export default function CarDetailsStandardSidebar({ car }: CarDetailsStandardSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Price Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              listing price
            </p>
            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
              {car.price.toLocaleString()} {car.currency}
            </h2>
          </div>
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Est. finance from the listing&apos;s default provider: <strong>{Math.round(car.monthlyCost.loan).toLocaleString()} {car.currency}/mo</strong>
        </p>
      </div>
    </div>
  );
}

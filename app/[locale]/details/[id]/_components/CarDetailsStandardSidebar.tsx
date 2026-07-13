import { MapPin, Phone, Star, CheckCircle, Clock } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface CarDetailsStandardSidebarProps {
  car: CarListing;
}

export default function CarDetailsStandardSidebar({ car }: CarDetailsStandardSidebarProps) {
  const driveawayTotal = car.price + 745;

  const priceRows = [
    { label: 'Base Listing Price', value: `$${car.price.toLocaleString()}` },
    { label: 'Title & Reg. Est', value: '$450' },
    { label: 'Dealer Prep / Doc Fees', value: '$295' },
  ];

  const scoreBreakdown = [
    { label: 'Value Retention Rate', value: car.truthBreakdown.valueRetention },
    { label: 'Predicted Reliability Index', value: car.truthBreakdown.reliability },
    { label: 'Running Cost Optimization', value: car.truthBreakdown.runningCosts },
  ];

  return (
    <div className="space-y-6">
      {/* Price Card */}
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
          {priceRows.map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">{label}</span>
              <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs py-2">
            <span className="font-bold text-neutral-900 dark:text-white">Estimated Driveaway Cash</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${driveawayTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Seller Card */}
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

      {/* Truth Score */}
      <div className="rounded-2xl border border-neutral-200 bg-emerald-500/10 p-6 dark:border-emerald-500/20 dark:bg-emerald-950/10">
        <div className="flex gap-3">
          <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="font-sans text-sm font-bold text-neutral-900 dark:text-white">
              Why the autod.pro score is {car.truthScore}
            </h4>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This listing scores based on value retention, reliability, and running costs.
            </p>
            <div className="mt-4 space-y-2.5">
              {scoreBreakdown.map(({ label, value }) => (
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
    </div>
  );
}

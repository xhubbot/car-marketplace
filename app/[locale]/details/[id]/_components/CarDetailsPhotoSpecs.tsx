import { Cpu, Award, CheckCircle } from 'lucide-react';
import type { CarListing } from '@/lib/types';

interface CarDetailsPhotoSpecsProps {
  car: CarListing;
}

export default function CarDetailsPhotoSpecs({ car }: CarDetailsPhotoSpecsProps) {
  const specs = [
    { label: 'Powerplant', value: car.specs.engine },
    { label: 'Total Output', value: car.specs.power },
    { label: '0 - 100 km/h', value: car.specs.acceleration },
    { label: 'Efficiency', value: `${car.specs.fuelEfficiency} ${car.specs.fuelType === 'electric' ? 'kWh' : 'L'}/100km` },
    { label: 'Transmission', value: car.specs.transmission },
    { label: 'Drivetrain', value: car.specs.driveType },
  ];

  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Main Photo */}
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
          {specs.map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-950/40">
              <p className="text-[10px] font-mono font-semibold uppercase text-neutral-400">{label}</p>
              <p className="mt-1 font-sans text-sm font-bold text-neutral-800 dark:text-neutral-200">{value}</p>
            </div>
          ))}
          <div className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-950/40 col-span-2">
            <p className="text-[10px] font-mono font-semibold uppercase text-neutral-400">Estimated Range</p>
            <p className="mt-1 font-sans text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {car.specs.range ?? 'Approximately 750+ km dynamic range'}
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
  );
}

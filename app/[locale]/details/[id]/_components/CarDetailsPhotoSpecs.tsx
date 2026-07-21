import { Cpu } from 'lucide-react';
import type { RealListing } from '@/lib/listing';

interface CarDetailsPhotoSpecsProps {
  car: RealListing;
}

export default function CarDetailsPhotoSpecs({ car }: CarDetailsPhotoSpecsProps) {
  const specs = [
    { label: 'Powerplant', value: car.specs.engine },
    { label: 'Total Output', value: car.specs.power },
    { label: '0 - 100 km/h', value: car.specs.acceleration },
    {
      label: 'Efficiency',
      value: car.specs.fuelEfficiency
        ? `${car.specs.fuelEfficiency} ${car.specs.isElectric ? 'kWh' : 'L'}/100km`
        : null,
    },
    { label: 'Transmission', value: car.specs.transmission },
    { label: 'Drivetrain', value: car.specs.driveType },
  ].filter((spec) => spec.value !== null);

  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Main Photo */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-xs">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          {car.image ? (
            <img
              src={car.image}
              alt={`${car.make} ${car.model}`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-neutral-400">
              No photo available
            </div>
          )}
          <div className="absolute top-4 left-4 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
            {car.year} Model Year
          </div>
        </div>
      </div>

      {/* Core Specs Grid */}
      {specs.length > 0 && (
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
          </div>
        </div>
      )}
    </div>
  );
}

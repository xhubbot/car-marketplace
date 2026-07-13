import { Car } from 'lucide-react';

export default function NavbarLogo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-md dark:bg-neutral-100 dark:text-neutral-950">
        <Car className="h-5 w-5" />
      </div>
      <div>
        <span className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          autod<span className="text-emerald-500">.pro</span>
        </span>
        <span className="hidden sm:block text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-medium leading-none">
          ownership-first classifieds
        </span>
      </div>
    </div>
  );
}

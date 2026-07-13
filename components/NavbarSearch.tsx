'use client';

import { Search } from 'lucide-react';

interface NavbarSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function NavbarSearch({ searchQuery, setSearchQuery }: NavbarSearchProps) {
  return (
    <div className="relative hidden sm:block w-48 lg:w-64">
      <Search className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
      <input
        type="text"
        placeholder="Search make or model..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-1.5 pr-4 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-neutral-100"
      />
    </div>
  );
}

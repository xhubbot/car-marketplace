'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavbarUserMenuProps {
  variant?: 'default' | 'merged';
}

export default function NavbarUserMenu({ variant = 'default' }: NavbarUserMenuProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('nav');
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return <div className="h-8 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />;
  }

  // Not logged in
  if (!session) {
    const btnClass =
      variant === 'merged'
        ? 'flex items-center gap-2 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white rounded-l-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
        : 'flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-neutral-950 rounded-full hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors';

    return (
      <button
        onClick={() => {
          console.log("Button clicked - trying to open modal");
          openAuthModal('login');
        }}
        className={btnClass}
        aria-label={t('login')}
      >
        <User className="w-4 h-4" />
        <span className="whitespace-nowrap">{t('login')}</span>
      </button>
    );
  }

  // Logged in
  const btnClass =
    variant === 'merged'
      ? `flex items-center gap-2 pl-3 pr-2 py-2 rounded-l-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${isOpen ? 'bg-neutral-50 dark:bg-neutral-800' : ''}`
      : `flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
          isOpen
            ? 'bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700'
            : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }`;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen((v) => !v)} className={btnClass}>
        <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        <span className="font-semibold text-sm hidden sm:block text-neutral-900 dark:text-white max-w-25 truncate">
          {session.user?.name ?? session.user?.email}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {session.user?.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {session.user?.email}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={() => { signOut(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

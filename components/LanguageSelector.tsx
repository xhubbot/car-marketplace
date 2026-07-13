"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import {
  type Locale,
  locales,
  localeLabels,
  defaultLocale,
} from "@/i18n.config";

interface LanguageSelectorProps {
  isMobile?: boolean;
  variant?: "default" | "merged";
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isMobile = false,
  variant = "default",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get current locale from pathname (e.g., /en/... -> 'en')
  const currentLocale = (pathname?.split("/")[1] as Locale) || defaultLocale;

  // Handle language change by navigating to new locale while preserving URL parameters
  const handleLanguageChange = (newLocale: Locale) => {
    // Extract pathname without locale (e.g., /en/search -> /search)
    const pathWithoutLocale = pathname?.replace(/^\/[^\/]+/, "") || "";

    // Build the new URL with preserved query parameters
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${newPath}?${queryString}` : newPath;

    router.push(fullUrl);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside (only for desktop)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
          Language
        </div>
        <div className="grid grid-cols-3 gap-2">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                currentLocale === locale
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                  : "bg-white border-gray-100 text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="font-medium">{locale.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Determine button styles based on variant
  const buttonClasses =
    variant === "merged"
      ? `flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-r-full hover:bg-gray-50 transition-colors ${
          isOpen ? "bg-gray-50 text-blue-600" : "text-gray-700"
        }`
      : `flex items-center gap-2 p-2 rounded-full transition-all border ${
          isOpen
            ? "bg-gray-100 border-gray-200"
            : "bg-transparent border-transparent hover:bg-gray-50"
        }`;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={buttonClasses}>
        <span className="text-sm font-medium">
          {currentLocale.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black/5 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="px-4 py-2 border-b border-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase">
              Select Language
            </span>
          </div>
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                currentLocale === locale
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <span className="font-medium">{locale.toUpperCase()}</span>
              {currentLocale === locale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

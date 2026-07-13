import { Formats } from "next-intl";

/**
 * Locale-specific formatting configuration for next-intl
 * Automatically handles dates, times, numbers, and currency based on locale
 */

export const formats: Record<string, Partial<Formats>> = {
  // Estonian locale (et-EE)
  et: {
    dateTime: {
      short: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
      medium: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      long: {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      full: {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      },
    },
    number: {
      precise: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
      currency: {
        style: "currency",
        currency: "EUR",
        currencyDisplay: "code", // Shows 'EUR' instead of '€'
      },
    },
  },

  // English locale (en-US)
  en: {
    dateTime: {
      short: {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      },
      medium: {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      },
      long: {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      },
    },
    number: {
      precise: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
  },

  // Russian locale (ru-RU)
  ru: {
    dateTime: {
      short: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
      medium: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      long: {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    number: {
      precise: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
      currency: {
        style: "currency",
        currency: "EUR",
      },
    },
  },
};

/**
 * Locale-specific settings
 */
export const localeConfig = {
  et: {
    locale: "et-EE",
    currency: "EUR",
    dateFormat: "dd.MM.yyyy",
    timeFormat: "HH:mm",
    dateTimeFormat: "dd.MM.yyyy HH:mm",
    thousandSeparator: " ",
    decimalSeparator: ",",
    currencyPosition: "after", // 100,00 EUR (not EUR 100,00)
  },
  en: {
    locale: "en-US",
    currency: "USD",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "h:mm a",
    dateTimeFormat: "MM/dd/yyyy h:mm a",
    thousandSeparator: ",",
    decimalSeparator: ".",
    currencyPosition: "before", // $100.00
  },
  ru: {
    locale: "ru-RU",
    currency: "EUR",
    dateFormat: "dd.MM.yyyy",
    timeFormat: "HH:mm",
    dateTimeFormat: "dd.MM.yyyy HH:mm",
    thousandSeparator: " ",
    decimalSeparator: ",",
    currencyPosition: "after", // 100,00 EUR
  },
} as const;

/**
 * Helper function to format currency with locale-specific rules
 */
export function formatCurrency(
  amount: number,
  locale: keyof typeof localeConfig,
  currency: string = localeConfig[locale].currency
): string {
  const config = localeConfig[locale];
  const formatter = new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let formatted = formatter.format(amount);

  // For Estonian and Russian, move currency symbol to the end
  if (config.currencyPosition === "after") {
    // Remove currency symbol from beginning and add to end
    formatted = formatted.replace(/^[\s€$₽]+/, "").trim() + " " + currency;
  }

  return formatted;
}

/**
 * Helper function to format date with locale-specific rules
 */
export function formatDate(
  date: Date | string,
  locale: keyof typeof localeConfig,
  includeTime: boolean = false
): string {
  const config = localeConfig[locale];
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat(config.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: locale === "en",
    }),
  });

  return formatter.format(dateObj);
}

/**
 * Helper function to format numbers with locale-specific thousand separators
 */
export function formatNumber(
  num: number,
  locale: keyof typeof localeConfig,
  decimals: number = 2
): string {
  const config = localeConfig[locale];
  const formatter = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(num);
}

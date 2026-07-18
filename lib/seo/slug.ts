/**
 * Cyrillic → Latin transliteration table (covers all Russian letters + common variants)
 */
const CYRILLIC_MAP: Record<string, string> = {
  а: "a",  б: "b",  в: "v",  г: "g",  д: "d",
  е: "e",  ё: "yo", ж: "zh", з: "z",  и: "i",
  й: "y",  к: "k",  л: "l",  м: "m",  н: "n",
  о: "o",  п: "p",  р: "r",  с: "s",  т: "t",
  у: "u",  ф: "f",  х: "kh", ц: "ts", ч: "ch",
  ш: "sh", щ: "shch", ъ: "", ы: "y",  ь: "",
  э: "e",  ю: "yu", я: "ya",
};

/**
 * Estonian / Nordic special characters → ASCII equivalents
 */
const ESTONIAN_MAP: Record<string, string> = {
  ä: "a", ö: "o", ü: "u", õ: "o",
  å: "a", æ: "ae", ø: "o",
};

function transliterate(text: string): string {
  return text
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(CYRILLIC_MAP, lower)) return CYRILLIC_MAP[lower];
      if (Object.prototype.hasOwnProperty.call(ESTONIAN_MAP, lower)) return ESTONIAN_MAP[lower];
      return char;
    })
    .join("");
}

/**
 * Generate a URL-friendly slug from any text including Cyrillic and Estonian.
 */
export function generateSlug(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove remaining non-ASCII / special chars
    .replace(/\s+/g, "-")     // Spaces → hyphens
    .replace(/-+/g, "-")      // Collapse repeated hyphens
    .replace(/^-+|-+$/g, "")  // Strip leading/trailing hyphens
    .slice(0, 80);
}

/**
 * Build a classified detail URL with optional slug appended for SEO.
 * Works as `/{locale}/classified/{id}-{slug}` or `/{locale}/classified/{id}` fallback.
 * parseInt("123-my-slug") === 123, so the detail page always extracts the correct ID.
 */
export function buildClassifiedUrl(
  locale: string,
  id: number | string,
  slug?: string | null
): string {
  return `/${locale}/classified/${slug ? `${id}-${slug}` : id}`;
}

/**
 * Generate product URL slug with category and id
 */
export function generateProductSlug(
  title: string,
  categoryName: string,
  id: string | number
): string {
  const titleSlug = generateSlug(title);
  const categorySlug = generateSlug(categoryName);
  return `${categorySlug}/${titleSlug}-${id}`;
}

/**
 * Format price for display
 */
export function formatPriceForSEO(
  price: number,
  currency: string = "EUR"
): string {
  return `${price.toFixed(2)} ${currency}`;
}

/**
 * Convert category ID to SEO-friendly name
 */
export function getCategoryDisplayName(categoryName: string): string {
  return categoryName
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase();
}

/**
 * Truncate text while preserving words
 */
export function truncateText(
  text: string,
  maxLength: number = 160,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + suffix
    : truncated + suffix;
}

/**
 * Extract first paragraph from HTML or text
 */
export function getFirstParagraph(text: string): string {
  const paragraphs = text.split(/\n\n+|<p>|<\/p>/);
  return truncateText(paragraphs[0] || "", 160);
}

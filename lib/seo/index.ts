// Re-export all SEO utilities for easier importing
export {
  generateSEOMetadata,
  generateCanonicalUrl,
  generateAlternateUrls,
  generateMetaDescription,
  generatePageTitle,
  generateKeywords,
  type SEOMetadata,
} from "./metadata";

export {
  generateSlug,
  generateProductSlug,
  formatPriceForSEO,
  getCategoryDisplayName,
  truncateText,
  getFirstParagraph,
} from "./slug";

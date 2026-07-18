import { useEffect } from "react";
import { useLocale } from "next-intl";

interface ClassifiedMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  price?: string;
  currency?: string;
  seller?: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Hook to fetch and apply classified metadata for SEO
 * Updates document head with meta tags dynamically
 */
export function useSEOMetadata(classifiedId: string | undefined) {
  const locale = useLocale();

  useEffect(() => {
    if (!classifiedId) return;

    const fetchMetadata = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        let response;
        try {
          response = await fetch(`/api/classified-metadata/${classifiedId}`, {
            signal: controller.signal,
          });
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === "AbortError") {
            console.debug("[useSEOMetadata] Fetch timeout");
          } else {
            console.warn(
              "[useSEOMetadata] Fetch failed:",
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            );
          }
          return;
        }
        clearTimeout(timeoutId);

        if (!response || !response.ok) {
          console.warn(
            `[useSEOMetadata] API returned status ${response?.status || "unknown"}`
          );
          return;
        }

        let allMetadata;
        try {
          allMetadata = await response.json();
        } catch (parseError) {
          console.warn(
            "[useSEOMetadata] Failed to parse JSON:",
            parseError instanceof Error
              ? parseError.message
              : String(parseError)
          );
          return;
        }

        // Validate response structure
        if (!allMetadata || typeof allMetadata !== "object") {
          console.warn("[useSEOMetadata] Invalid response structure");
          return;
        }

        const metadata: ClassifiedMetadata = allMetadata[locale];

        if (!metadata) {
          console.debug(
            `[useSEOMetadata] No metadata found for locale: ${locale}`
          );
          return;
        }

        // Update title and meta tags - wrap in try-catch to prevent any DOM errors
        try {
          document.title = metadata.title;

          // Update or create meta tags
          updateMetaTag("description", metadata.description);
          updateMetaTag("keywords", metadata.keywords || "");

          // Open Graph
          updateMetaTag("og:title", metadata.title, "property");
          updateMetaTag("og:description", metadata.description, "property");
          if (metadata.ogImage) {
            updateMetaTag("og:image", metadata.ogImage, "property");
            updateMetaTag("og:image:width", "1200", "property");
            updateMetaTag("og:image:height", "630", "property");
          }

          // Twitter
          updateMetaTag("twitter:card", "summary_large_image");
          updateMetaTag("twitter:title", metadata.title);
          updateMetaTag("twitter:description", metadata.description);
          if (metadata.ogImage) {
            updateMetaTag("twitter:image", metadata.ogImage);
          }

          // Structured data
          if (typeof window !== "undefined") {
            const schema = {
              "@context": "https://schema.org",
              "@type": "Product",
              name: metadata.title,
              description: metadata.description,
              image: metadata.ogImage,
              price: metadata.price,
              priceCurrency: metadata.currency || "EUR",
              seller: {
                "@type": "Organization",
                name: metadata.seller,
              },
              ...(metadata.rating &&
                metadata.reviewCount && {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: metadata.rating,
                    reviewCount: metadata.reviewCount,
                  },
                }),
            };

            // Remove old schema script if exists
            const oldScript = document.querySelector(
              'script[type="application/ld+json"]'
            );
            if (oldScript) {
              oldScript.remove();
            }

            // Add new schema script
            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
          }
        } catch (domError) {
          console.warn(
            "[useSEOMetadata] Error updating DOM:",
            domError instanceof Error ? domError.message : String(domError)
          );
          // Continue execution even if DOM update fails
        }
      } catch (error) {
        // Handle abort errors separately
        if (error instanceof Error && error.name === "AbortError") {
          console.debug("[useSEOMetadata] Request timeout or aborted");
          return;
        }
        // Log other errors but don't throw
        if (error instanceof Error) {
          console.warn(
            "[useSEOMetadata] Error fetching metadata:",
            error.message
          );
        } else {
          console.warn("[useSEOMetadata] Unknown error:", error);
        }
        // Silently fail - SEO metadata is optional and doesn't affect functionality
      }
    };

    // Execute and catch any unhandled promise rejections
    Promise.resolve()
      .then(() => fetchMetadata())
      .catch((error) => {
        console.debug("[useSEOMetadata] Promise caught:", error);
        // Silently handle - SEO metadata is optional
      });
  }, [classifiedId, locale]);
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(
  name: string,
  content: string,
  attribute: "name" | "property" = "name"
): void {
  if (!content) return;

  let tag = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${name}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

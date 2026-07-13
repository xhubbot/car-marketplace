import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/test-email",
          "/*/login",
          "/*/register",
          "/*/settings",
          "/*/profile",
          "/*/messages",
          "/*/payments",
          "/*/create-classified",
          "/*/classified/*/edit",
          "/*/classified/*/paid-services",
          "/*/classified/*/statistics",
          "/*/classifieds/my",
          "/*/price-agents",
          "/*/forgot-password",
          "/*/reset-password",
          "/*/verify-email",
          "/*/terminate-account",
          "/*/discount-payment-return",
          "/*/payment-return",
          "/*?*sort=*", // Avoid duplicate content from sorting
          "/*?*page=*", // Avoid pagination duplicates
        ],
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: "https://kaubaplats.ee/sitemap.xml",
  };
}

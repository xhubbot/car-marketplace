import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, DetailsBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface PriceDropProps {
  itemTitle: string;
  oldPrice: string;
  newPrice: string;
  itemId: number;
  language?: "en" | "et" | "ru";
}

export const PriceDropTemplate: React.FC<PriceDropProps> = ({
  itemTitle,
  oldPrice,
  newPrice,
  itemId,
  language = "en",
}) => {
  const t = getEmailTranslations("priceDrop", language as "en" | "et" | "ru");
  const savingsPercent = Math.round(
    ((parseFloat(oldPrice) - parseFloat(newPrice)) / parseFloat(oldPrice)) * 100
  );

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="local_offer"
      accentColor="primary"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} color="#2563eb" />

      {/* Message */}
      <p
        style={{
          fontSize: "16px",
          color: "#4b5563",
          lineHeight: "1.8",
          margin: "0 0 24px 0",
          fontWeight: "600",
        }}
      >
        {t.message}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: "15px",
          color: "#6b7280",
          lineHeight: "1.8",
          margin: "0 0 32px 0",
        }}
      >
        {t.description}
      </p>

      {/* Item Title */}
      <h3
        style={{
          fontSize: "18px",
          color: "#2563eb",
          margin: "0 0 16px 0",
          fontWeight: "600",
        }}
      >
        {itemTitle}
      </h3>

      {/* Price Comparison */}
      <div
        style={{
          backgroundColor: "#f0f9ff",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "space-around",
          }}
        >
          {/* Old Price */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0 0 8px 0",
                fontWeight: "500",
              }}
            >
              {t.oldPrice}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#9ca3af",
                margin: "0",
                textDecoration: "line-through",
                fontWeight: "600",
              }}
            >
              {oldPrice}
            </p>
          </div>

          {/* Arrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
              color: "#2563eb",
            }}
          >
            →
          </div>

          {/* New Price */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p
              style={{
                fontSize: "12px",
                color: "#10b981",
                margin: "0 0 8px 0",
                fontWeight: "600",
              }}
            >
              {t.newPrice}
            </p>
            <p
              style={{
                fontSize: "24px",
                color: "#10b981",
                margin: "0",
                fontWeight: "bold",
              }}
            >
              {newPrice}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#10b981",
                margin: "8px 0 0 0",
                fontWeight: "600",
              }}
            >
              Save {savingsPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Don't Miss Alert */}
      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "2px solid #f59e0b",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#78350f",
            margin: "0",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          💡 {t.dontMiss}
        </p>
      </div>

      {/* CTA Button */}
      <div style={{ margin: "32px 0", textAlign: "center" }}>
        <a
          href={`${baseUrl}/classified/${itemId}`}
          style={{
            display: "inline-block",
            padding: "14px 36px",
            backgroundColor: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {t.openButton}
        </a>
      </div>

      {/* Contact Help */}
      <div
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
          fontSize: "13px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        {t.questions}{" "}
        <Link
          href={`${baseUrl}/${language}/knowledge-base`}
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          {t.contact}
        </Link>
      </div>
    </ModernEmailLayout>
  );
};

export const priceDropSubject = (language: string = "en") => {
  const t = getEmailTranslations("priceDrop", language as "en" | "et" | "ru");
  return t.subject || "Price dropped for an item you liked!";
};

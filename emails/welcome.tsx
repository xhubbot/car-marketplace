import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, DetailsBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface WelcomeProps {
  username: string;
  email: string;
  language?: "en" | "et" | "ru";
}

export const WelcomeTemplate: React.FC<WelcomeProps> = ({
  username,
  email,
  language = "en",
}) => {
  const t = getEmailTranslations("welcome", language as "en" | "et" | "ru");

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="🎉"
      accentColor="success"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} color="#10b981" />

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

      {/* Account Details */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#10b981",
            margin: "0 0 16px 0",
          }}
        >
          {t.credentials}
        </h3>
        <DetailsBox
          items={[
            { label: t.username, value: username },
            { label: t.email, value: email },
          ]}
          backgroundColor="#ffffff"
        />
      </div>

      {/* Key Features */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#10b981",
            margin: "0 0 16px 0",
          }}
        >
          {t.features}
        </h3>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          {[t.feature1, t.feature2, t.feature3, t.feature4].map(
            (feature, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  marginBottom: idx < 3 ? "12px" : "0",
                  gap: "24px",
                }}
              >
                <span
                  style={{
                    color: "#10b981",
                    fontWeight: "bold",
                    minWidth: "16px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#047857",
                  }}
                >
                  {feature}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Call to Action Button */}
      <div style={{ margin: "32px 0", textAlign: "center" }}>
        <a
          href="https://www.kaubaplats.ee"
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
          Open KaubaPlats.ee
        </a>
      </div>

      {/* Divider */}
      <div
        style={{
          margin: "32px 0",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      {/* Contact Help */}
      <div style={{ fontSize: "13px", color: "#6b7280" }}>
        {t.questions}{" "}
        <Link
          href={`${baseUrl}/${language}/knowledge-base`}
          style={{
            color: "#10b981",
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

export const welcomeSubject = (language: string = "en") => {
  const t = getEmailTranslations("welcome", language as "en" | "et" | "ru");
  return t.subject || "Welcome to Kaubaplats!";
};

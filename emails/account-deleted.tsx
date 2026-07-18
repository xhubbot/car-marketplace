import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, AlertBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface AccountDeletedProps {
  username: string;
  language?: "en" | "et" | "ru";
}

export const AccountDeletedTemplate: React.FC<AccountDeletedProps> = ({
  username,
  language = "en",
}) => {
  const t = getEmailTranslations(
    "accountDeleted",
    language as "en" | "et" | "ru"
  );

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="close"
      accentColor="danger"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} icon="info" color="#ef4444" />

      {/* Message */}
      <p
        style={{
          fontSize: "16px",
          color: "#4b5563",
          lineHeight: "1.8",
          margin: "0 0 24px 0",
          fontStyle: "italic",
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
          margin: "0 0 24px 0",
        }}
      >
        {t.description}
      </p>

      {/* Warning Alert */}
      <AlertBox type="error" message={t.consequence} icon="warning_amber" />

      {/* Feedback Section */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 16px 0",
          }}
        >
          {t.feedback}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          We'd appreciate your feedback on why you're leaving.
        </p>
        <div style={{ textAlign: "center" }}>
          <a
            href={`${baseUrl}/feedback`}
            style={{
              display: "inline-block",
              padding: "10px 24px",
              backgroundColor: "#f3f4f6",
              color: "#1f2937",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              border: "1px solid #d1d5db",
              transition: "all 0.3s",
            }}
          >
            {t.feedbackButton}
          </a>
        </div>
      </div>

      {/* Thank You Message */}
      <div
        style={{
          margin: "24px 0",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
          fontSize: "14px",
          color: "#6b7280",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {t.thanks}
      </div>

      {/* Contact Help */}
      <div
        style={{
          marginTop: "24px",
          fontSize: "13px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        {t.questions}{" "}
        <Link
          href={`${baseUrl}/${language}/knowledge-base`}
          style={{
            color: "#ef4444",
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

export const accountDeletedSubject = (language: string = "en") => {
  const t = getEmailTranslations(
    "accountDeleted",
    language as "en" | "et" | "ru"
  );
  return t.subject || "Account Successfully Deleted";
};

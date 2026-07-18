import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, CTAButton } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface EmailVerifyProps {
  username: string;
  token: string;
  language?: "en" | "et" | "ru";
}

export const EmailVerifyTemplate: React.FC<EmailVerifyProps> = ({
  username,
  token,
  language = "en",
}) => {
  const t = getEmailTranslations("emailVerify", language as "en" | "et" | "ru");
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="email"
      accentColor="primary"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} color="#1f2937" />

      {/* Description */}
      <p
        style={{
          fontSize: "16px",
          color: "#4b5563",
          lineHeight: "1.8",
          margin: "0 0 24px 0",
        }}
      >
        {t.description}
      </p>

      {/* CTA Button */}
      <div style={{ margin: "32px 0" }}>
        <a
          href={verifyUrl}
          style={{
            display: "inline-block",
            padding: "14px 36px",
            backgroundColor: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {t.verifyButton}
        </a>
      </div>

      {/* Alt Link */}
      <div
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>{t.copyLink}</p>
        <p
          style={{
            margin: "0",
            wordBreak: "break-all",
            fontFamily: "monospace",
            color: "#2563eb",
            fontSize: "12px",
          }}
        >
          {verifyUrl}
        </p>
      </div>

      {/* Warning */}
      <div
        style={{
          marginTop: "24px",
          padding: "12px",
          backgroundColor: "#fef3c7",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#78350f",
          fontStyle: "italic",
        }}
      >
        {t.warning}
      </div>

      {/* Contact Help */}
      <div
        style={{
          marginTop: "24px",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        {t.questions}{" "}
        <Link
          href={`${baseUrl}/${language}/knowledge-base`}
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          {t.contact}
        </Link>
      </div>
    </ModernEmailLayout>
  );
};

export const emailVerifySubject = (language: string = "en") => {
  const t = getEmailTranslations("emailVerify", language as "en" | "et" | "ru");
  return t.subject || "Verify Your Email Address";
};

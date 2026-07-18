import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, DetailsBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface NewFeedbackProps {
  username: string;
  buyerName: string;
  rating: number;
  feedbackMessage: string;
  itemTitle: string;
  language?: "en" | "et" | "ru";
}

export const NewFeedbackTemplate: React.FC<NewFeedbackProps> = ({
  username,
  buyerName,
  rating,
  feedbackMessage,
  itemTitle,
  language = "en",
}) => {
  const t = getEmailTranslations("newFeedback", language as "en" | "et" | "ru");
  const profileUrl = `${baseUrl}/profile/${username}`;

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="star_rate"
      accentColor="success"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} icon="thumb_up" color="#10b981" />

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

      {/* Feedback Details */}
      <div style={{ marginBottom: "32px" }}>
        <DetailsBox
          items={[
            { label: t.from, value: buyerName },
            {
              label: t.rating,
              value: `${"⭐".repeat(rating)} (${rating}/${5})`,
            },
            ...(itemTitle ? [{ label: t.item, value: itemTitle }] : []),
          ]}
          backgroundColor="#f0fdf4"
        />
      </div>

      {/* Feedback Message */}
      <div
        style={{
          backgroundColor: "#ecfdf5",
          borderLeft: "4px solid #10b981",
          borderRadius: "6px",
          padding: "16px",
          marginBottom: "32px",
        }}
      >
        <p
          style={{
            color: "#065f46",
            margin: "0",
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          "{feedbackMessage}"
        </p>
      </div>

      {/* Thank You Message */}
      <p
        style={{
          fontSize: "15px",
          color: "#6b7280",
          lineHeight: "1.6",
          margin: "0 0 24px 0",
        }}
      >
        {t.thankyou}
      </p>

      {/* CTA Button */}
      <div style={{ margin: "32px 0" }}>
        <a
          href={profileUrl}
          style={{
            display: "inline-block",
            padding: "12px 32px",
            backgroundColor: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            transition: "all 0.3s",
          }}
        >
          {t.viewProfile}
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

export const newFeedbackSubject = (language: string = "en") => {
  const t = getEmailTranslations("newFeedback", language as "en" | "et" | "ru");
  return t.subject || "You received feedback!";
};

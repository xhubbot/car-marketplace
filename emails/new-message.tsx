import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, DetailsBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface NewMessageProps {
  username: string;
  senderName: string;
  itemTitle: string;
  itemPrice: string;
  itemImage: string;
  messagePreview: string;
  messageId: number;
  language?: "en" | "et" | "ru";
}

export const NewMessageTemplate: React.FC<NewMessageProps> = ({
  username,
  senderName,
  itemTitle,
  itemPrice,
  itemImage,
  messagePreview,
  messageId,
  language = "en",
}) => {
  const t = getEmailTranslations("newMessage", language as "en" | "et" | "ru");
  const replyUrl = `${baseUrl}/messages/${messageId}`;

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="mail_outline"
      accentColor="primary"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} color="#2563eb" />

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

      {/* Item Details */}
      <div style={{ marginBottom: "32px" }}>
        <DetailsBox
          items={[
            { label: t.from, value: senderName },
            { label: t.item, value: itemTitle },
            { label: "Price", value: itemPrice },
          ]}
          backgroundColor="#f0f9ff"
        />
      </div>

      {/* Message Preview */}
      <div
        style={{
          backgroundColor: "#eff6ff",
          borderLeft: "4px solid #2563eb",
          borderRadius: "6px",
          padding: "16px",
          marginBottom: "32px",
        }}
      >
        <p style={{ color: "#0c2d6b", margin: "0", fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t.message}:</span>
        </p>
        <p
          style={{
            color: "#1e40af",
            margin: "8px 0 0 0",
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          "{messagePreview}"
        </p>
      </div>

      {/* CTA Button */}
      <div style={{ margin: "32px 0" }}>
        <a
          href={replyUrl}
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
          {t.replyButton}
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

export const newMessageSubject = (language: string = "en") => {
  const t = getEmailTranslations("newMessage", language as "en" | "et" | "ru");
  return t.subject || "You have a new message!";
};

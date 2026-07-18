import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, DetailsBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface NewReplyProps {
  username: string;
  replyFrom: string;
  replyMessage: string;
  itemTitle: string;
  language?: "en" | "et" | "ru";
}

export const NewReplyTemplate: React.FC<NewReplyProps> = ({
  username,
  replyFrom,
  replyMessage,
  itemTitle,
  language = "en",
}) => {
  const t = getEmailTranslations("newReply", language as "en" | "et" | "ru");
  const profileUrl = `${baseUrl}/profile/${username}`;

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="chat_bubble_outline"
      accentColor="primary"
    >
      {/* Title */}
      <SectionTitle
        title={t.greeting}
        icon="chat_bubble_outline"
        color="#2563eb"
      />

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

      {/* Reply Details */}
      <div style={{ marginBottom: "32px" }}>
        <DetailsBox
          items={[
            { label: t.from, value: replyFrom },
            ...(itemTitle ? [{ label: t.item, value: itemTitle }] : []),
          ]}
          backgroundColor="#f0f9ff"
        />
      </div>

      {/* Reply Message */}
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
          "{replyMessage}"
        </p>
      </div>

      {/* CTA Button */}
      <div style={{ margin: "32px 0" }}>
        <a
          href={profileUrl}
          style={{
            display: "inline-block",
            padding: "12px 32px",
            backgroundColor: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            transition: "all 0.3s",
          }}
        >
          View Conversation
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

export const newReplySubject = (language: string = "en") => {
  const t = getEmailTranslations("newReply", language as "en" | "et" | "ru");
  return t.subject || "You received a reply!";
};

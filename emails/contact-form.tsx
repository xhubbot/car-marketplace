import * as React from "react";
import { Section, Row, Column, Text, Link } from "@react-email/components";
import { EmailLayout } from "@/emails/layout";
import { EMAIL_COLORS } from "@/emails/emailColors";
import { getEmailTranslations } from "@/emails/emailTranslations";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface ContactFormProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  language?: "en" | "et" | "ru";
}

export const ContactFormTemplate: React.FC<ContactFormProps> = ({
  senderName,
  senderEmail,
  subject,
  message,
  language = "en",
}) => {
  const t = getEmailTranslations("contactForm", language as "en" | "et" | "ru");

  return (
    <EmailLayout previewText={t.preview}>
      {/* Header */}
      <Section style={{ background: EMAIL_COLORS.primary, padding: "0" }}>
        <Row>
          <Column style={{ textAlign: "center", padding: "40px 20px" }}>
            <Text
              style={{
                fontSize: "28px",
                margin: "0",
                fontWeight: "bold",
                color: EMAIL_COLORS.white,
              }}
            >
              {t.heading}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Content */}
      <Section style={{ background: EMAIL_COLORS.white, padding: "40px 20px" }}>
        {/* Sender Information */}
        <Row style={{ marginBottom: "32px" }}>
          <Column>
            <div
              style={{
                background: EMAIL_COLORS.lightGray,
                padding: "16px",
                borderRadius: "4px",
              }}
            >
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0 0 12px 0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.from}:</span>{" "}
                {senderName}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.sender_email}:</span>{" "}
                <Link
                  href={`mailto:${senderEmail}`}
                  style={{
                    color: EMAIL_COLORS.primary,
                    textDecoration: "none",
                  }}
                >
                  {senderEmail}
                </Link>
              </Text>
            </div>
          </Column>
        </Row>

        {/* Subject */}
        <Row style={{ marginBottom: "24px" }}>
          <Column>
            <Text
              style={{
                fontSize: "13px",
                color: EMAIL_COLORS.gray,
                margin: "0 0 8px 0",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{t.submitted_subject}:</span>
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.primary,
                margin: "0 0 24px 0",
                fontWeight: "bold",
              }}
            >
              {subject}
            </Text>
          </Column>
        </Row>

        {/* Message */}
        <Row style={{ marginBottom: "32px" }}>
          <Column>
            <Text
              style={{
                fontSize: "13px",
                color: EMAIL_COLORS.gray,
                margin: "0 0 8px 0",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{t.message}:</span>
            </Text>
            <div
              style={{
                background: EMAIL_COLORS.lightGray,
                padding: "16px",
                borderRadius: "4px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: EMAIL_COLORS.darkGray,
                  lineHeight: "1.8",
                  margin: "0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {message}
              </Text>
            </div>
          </Column>
        </Row>

        {/* Action Button */}
        <Row style={{ marginBottom: "32px" }}>
          <Column align="center">
            <Link
              href={`${baseUrl}/admin/contact-messages`}
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: EMAIL_COLORS.primary,
                color: EMAIL_COLORS.white,
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {t.view_in_admin}
            </Link>
          </Column>
        </Row>

        {/* Auto Note */}
        <Row>
          <Column style={{ textAlign: "center" }}>
            <Text
              style={{
                fontSize: "12px",
                color: "#999999",
                margin: "0",
                fontStyle: "italic",
              }}
            >
              {t.auto_note}
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};

export const contactFormSubject = (language: string = "en") => {
  const t = getEmailTranslations("contactForm", language as "en" | "et" | "ru");
  return t.subject || "New Contact Form Submission";
};

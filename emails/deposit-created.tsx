import * as React from "react";
import { Section, Row, Column, Text, Link } from "@react-email/components";
import { EmailLayout } from "@/emails/layout";
import { EMAIL_COLORS } from "@/emails/emailColors";
import { getEmailTranslations } from "@/emails/emailTranslations";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface DepositCreatedProps {
  username: string;
  depositNumber: string;
  createdDate: string;
  itemTitle: string;
  itemPrice: string;
  language?: "en" | "et" | "ru";
}

export const DepositCreatedTemplate: React.FC<DepositCreatedProps> = ({
  username,
  depositNumber,
  createdDate,
  itemTitle,
  itemPrice,
  language = "en",
}) => {
  const t = getEmailTranslations(
    "depositCreated",
    language as "en" | "et" | "ru"
  );

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
              {t.greeting}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Content */}
      <Section style={{ background: EMAIL_COLORS.white, padding: "40px 20px" }}>
        <Row>
          <Column>
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.darkGray,
                lineHeight: "1.8",
                margin: "0 0 24px 0",
              }}
            >
              Dear {username},
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.darkGray,
                lineHeight: "1.8",
                margin: "0 0 32px 0",
              }}
            >
              {t.message}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.gray,
                lineHeight: "1.8",
                margin: "0 0 32px 0",
              }}
            >
              {t.congratulations}
            </Text>
          </Column>
        </Row>

        {/* Deposit Information */}
        <Row style={{ marginBottom: "32px" }}>
          <Column>
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: EMAIL_COLORS.primary,
                margin: "0 0 16px 0",
              }}
            >
              {t.depositInfo}
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
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0 0 12px 0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.depositNumber}:</span>{" "}
                {depositNumber}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.created}:</span>{" "}
                {createdDate}
              </Text>
            </div>
          </Column>
        </Row>

        {/* Item Information */}
        <Row style={{ marginBottom: "32px" }}>
          <Column>
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: EMAIL_COLORS.primary,
                margin: "0 0 16px 0",
              }}
            >
              {t.classifiedInfo}
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
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0 0 12px 0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.title}:</span>{" "}
                {itemTitle}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.price}:</span>{" "}
                {itemPrice}
              </Text>
            </div>
          </Column>
        </Row>

        {/* Two Buttons */}
        <Row style={{ marginBottom: "32px" }}>
          <Column align="center">
            <Row>
              <Column style={{ paddingRight: "12px" }} align="center">
                <Link
                  href={`${baseUrl}/deposits`}
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    backgroundColor: EMAIL_COLORS.primary,
                    color: EMAIL_COLORS.white,
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t.openDeposit}
                </Link>
              </Column>
              <Column style={{ paddingLeft: "12px" }} align="center">
                <Link
                  href={`${baseUrl}/classifieds`}
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    backgroundColor: "#6c757d",
                    color: EMAIL_COLORS.white,
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t.openClassified}
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>

        {/* Divider */}
        <Row>
          <Column
            style={{ borderTop: "1px solid #cccccc", margin: "32px 0" }}
          />
        </Row>

        {/* Contact Info */}
        <Row>
          <Column style={{ textAlign: "center" }}>
            <Text
              style={{
                fontSize: "13px",
                color: EMAIL_COLORS.gray,
                margin: "0 0 16px 0",
              }}
            >
              {t.questions}{" "}
              <Link
                href={`${baseUrl}/${language}/knowledge-base`}
                style={{
                  color: EMAIL_COLORS.primary,
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                {t.contact}
              </Link>
            </Text>
          </Column>
        </Row>

        {/* Social Media Icons */}
        <Row style={{ marginTop: "24px" }}>
          <Column align="center">
            <Link
              href="https://www.facebook.com/kaubaplats"
              style={{ marginRight: "16px", textDecoration: "none" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#1877f2",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "32px",
                  color: EMAIL_COLORS.white,
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                f
              </span>
            </Link>
            <Link
              href="https://twitter.com/kaubaplats"
              style={{ marginRight: "16px", textDecoration: "none" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#1da1f2",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "32px",
                  color: EMAIL_COLORS.white,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                𝕏
              </span>
            </Link>
            <Link
              href="https://t.me/kaubaplats"
              style={{ textDecoration: "none" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#0088cc",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "32px",
                  color: EMAIL_COLORS.white,
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                →
              </span>
            </Link>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};

export const depositCreatedSubject = (language: string = "en") => {
  const t = getEmailTranslations(
    "depositCreated",
    language as "en" | "et" | "ru"
  );
  return t.subject || "New Purchase Request Received";
};

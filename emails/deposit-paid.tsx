import * as React from "react";
import { Section, Row, Column, Text, Link } from "@react-email/components";
import { EmailLayout } from "@/emails/layout";
import { EMAIL_COLORS } from "@/emails/emailColors";
import { getEmailTranslations } from "@/emails/emailTranslations";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface DepositPaidProps {
  username: string;
  depositNumber: string;
  amount: string;
  deliveryCompany: string;
  address: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  itemTitle: string;
  itemPrice: string;
  language?: "en" | "et" | "ru";
}

export const DepositPaidTemplate: React.FC<DepositPaidProps> = ({
  username,
  depositNumber,
  amount,
  deliveryCompany,
  address,
  buyerName,
  buyerPhone,
  buyerEmail,
  itemTitle,
  itemPrice,
  language = "en",
}) => {
  const t = getEmailTranslations("depositPaid", language as "en" | "et" | "ru");

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
          </Column>
        </Row>

        {/* Deposit Details */}
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
              {t.details}
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
                  margin: "0 0 12px 0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.amount}:</span> {amount}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0 0 12px 0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.delivery}:</span>{" "}
                {deliveryCompany}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.address}:</span>{" "}
                {address}
              </Text>
            </div>
          </Column>
        </Row>

        {/* Buyer Information */}
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
              {t.buyer}
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
                <span style={{ fontWeight: "bold" }}>{t.name}:</span>{" "}
                {buyerName}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0 0 12px 0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.phone}:</span>{" "}
                {buyerPhone}
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: EMAIL_COLORS.gray,
                  margin: "0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{t.email}:</span>{" "}
                <Link
                  href={`mailto:${buyerEmail}`}
                  style={{
                    color: EMAIL_COLORS.primary,
                    textDecoration: "none",
                  }}
                >
                  {buyerEmail}
                </Link>
              </Text>
            </div>
          </Column>
        </Row>

        {/* Item Details */}
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
              {t.item}
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

        {/* Button */}
        <Row style={{ marginBottom: "32px" }}>
          <Column align="center">
            <Link
              href={`${baseUrl}/deposits`}
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
              {t.confirmButton}
            </Link>
          </Column>
        </Row>

        {/* Warning */}
        <Row style={{ marginBottom: "24px" }}>
          <Column>
            <Text
              style={{
                fontSize: "13px",
                color: "#d9534f",
                margin: "0",
                fontStyle: "italic",
                padding: "12px",
                backgroundColor: "#fef5f5",
                borderRadius: "4px",
              }}
            >
              ⚠ {t.warning}
            </Text>
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

export const depositPaidSubject = (language: string = "en") => {
  const t = getEmailTranslations("depositPaid", language as "en" | "et" | "ru");
  return t.subject || "Payment Received - Confirm Shipment";
};

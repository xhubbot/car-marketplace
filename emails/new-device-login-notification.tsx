import * as React from "react";
import { Link } from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, DetailsBox, AlertBox } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface NewDeviceLoginProps {
  username: string;
  location: string;
  loginTime: string;
  device: string;
  browser: string;
  ipAddress: string;
  language?: "en" | "et" | "ru";
}

export const NewDeviceLoginTemplate: React.FC<NewDeviceLoginProps> = ({
  username,
  location,
  loginTime,
  device,
  browser,
  ipAddress,
  language = "en",
}) => {
  const t = getEmailTranslations(
    "newDeviceLogin",
    language as "en" | "et" | "ru"
  );

  return (
    <ModernEmailLayout
      previewText={t.preview}
      headerIcon="security"
      accentColor="danger"
    >
      {/* Title */}
      <SectionTitle title={t.greeting} color="#dc3545" />

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

      {/* Login Details Box */}
      <DetailsBox
        items={[
          { label: t.location, value: location },
          { label: t.time, value: loginTime },
          { label: t.device, value: device },
          { label: t.browser, value: browser },
          { label: t.ipAddress, value: ipAddress },
        ]}
      />

      {/* Was This You Section */}
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "32px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 16px 0",
          }}
        >
          {t.wasYou}
        </h3>
      </div>

      {/* Warning Alert */}
      <AlertBox type="error" message={t.warning} icon="security" />

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

export const newDeviceLoginSubject = (language: string = "en") => {
  const t = getEmailTranslations(
    "newDeviceLogin",
    language as "en" | "et" | "ru"
  );
  return t.subject || "New Login from Unrecognized Device";
};

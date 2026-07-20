import * as React from "react";
// import { Link } from "@react-email/components";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
  Preview
} from "@react-email/components";
import { ModernEmailLayout } from "@/emails/layout";
import { getEmailTranslations } from "@/emails/emailTranslations";
import { SectionTitle, CTAButton } from "@/emails/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface EmailVerifyProps {
  username: string;
  token: string;
  language?: "en" | "et" | "ru";
}

// export const EmailVerifyTemplate: React.FC<EmailVerifyProps> = ({
//   username,
//   token,
//   language = "en",
// }) => {
//   const t = getEmailTranslations("emailVerify", language as "en" | "et" | "ru");
//   const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

//   return (
//     <ModernEmailLayout
//       previewText={t.preview}
//       headerIcon="email"
//       accentColor="primary"
//     >
//       {/* Title */}
//       <SectionTitle title={t.greeting} color="#1f2937" />

//       {/* Description */}
//       <p
//         style={{
//           fontSize: "16px",
//           color: "#4b5563",
//           lineHeight: "1.8",
//           margin: "0 0 24px 0",
//         }}
//       >
//         {t.description}
//       </p>

//       {/* CTA Button */}
//       <div style={{ margin: "32px 0" }}>
//         <a
//           href={verifyUrl}
//           style={{
//             display: "inline-block",
//             padding: "14px 36px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             textDecoration: "none",
//             borderRadius: "8px",
//             fontSize: "16px",
//             fontWeight: "bold",
//             transition: "all 0.3s",
//           }}
//         >
//           {t.verifyButton}
//         </a>
//       </div>

//       {/* Alt Link */}
//       <div
//         style={{
//           marginTop: "32px",
//           paddingTop: "24px",
//           borderTop: "1px solid #e5e7eb",
//           fontSize: "13px",
//           color: "#6b7280",
//         }}
//       >
//         <p style={{ margin: "0 0 8px 0" }}>{t.copyLink}</p>
//         <p
//           style={{
//             margin: "0",
//             wordBreak: "break-all",
//             fontFamily: "monospace",
//             color: "#2563eb",
//             fontSize: "12px",
//           }}
//         >
//           {token}
//         </p>
//       </div>

//       {/* Warning */}
//       <div
//         style={{
//           marginTop: "24px",
//           padding: "12px",
//           backgroundColor: "#fef3c7",
//           borderRadius: "6px",
//           fontSize: "12px",
//           color: "#78350f",
//           fontStyle: "italic",
//         }}
//       >
//         {t.warning}
//       </div>

//       {/* Contact Help */}
//       <div
//         style={{
//           marginTop: "24px",
//           fontSize: "13px",
//           color: "#6b7280",
//         }}
//       >
//         {t.questions}{" "}
//         <Link
//           href={`${baseUrl}/${language}/knowledge-base`}
//           style={{
//             color: "#2563eb",
//             textDecoration: "none",
//             fontWeight: "bold",
//           }}
//         >
//           {t.contact}
//         </Link>
//       </div>
//     </ModernEmailLayout>
//   );
// };

export const EmailVerifyTemplate: React.FC<EmailVerifyProps> = ({
  username,
  token,
  language = "en",
}) => {
  const t = getEmailTranslations("emailVerify", language as "en" | "et" | "ru");

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      
      <Body style={{ 
        backgroundColor: "#f8fafc", 
        margin: 0, 
        padding: 0, 
        fontFamily: "system-ui, sans-serif" 
      }}>
        <Container style={{ 
          maxWidth: "480px", 
          margin: "40px auto", 
          padding: "20px" 
        }}>
          
          <Section style={{
            backgroundColor: "#ffffff",
            padding: "40px 32px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          }}>
            
            <Text style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#1f2937",
              textAlign: "center",
              margin: "0 0 24px 0",
            }}>
              {t.greeting}
            </Text>

            <Text style={{
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#374151",
              textAlign: "center",
              margin: "0 0 32px 0",
            }}>
              {t.description}
            </Text>

            {/* Verification Code - The only focus */}
            <Section style={{
              backgroundColor: "#f8fafc",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              padding: "32px 24px",
              textAlign: "center",
              marginBottom: "24px",
            }}>
              <Text style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                {t.copyLink}
              </Text>
              
              <Text style={{
                fontFamily: "monospace",
                fontSize: "32px",
                fontWeight: 700,
                color: "#1e40af",
                letterSpacing: "6px",
                margin: 0,
              }}>
                {token}
              </Text>
            </Section>

            {/* Minimal Security Note */}
            <Text style={{
              fontSize: "14px",
              color: "#713f12",
              backgroundColor: "#fefce8",
              padding: "16px 20px",
              borderRadius: "8px",
              lineHeight: "1.6",
              margin: 0,
            }}>
              {t.warning}
            </Text>

          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const emailVerifySubject = (language: string = "en") => {
  const t = getEmailTranslations("emailVerify", language as "en" | "et" | "ru");
  return t.subject || "Verify Your Email Address";
};

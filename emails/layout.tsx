import * as React from "react";
import {
  Html,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
} from "@react-email/components";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
}

interface ModernEmailLayoutProps extends EmailLayoutProps {
  headerIcon?: string;
  accentColor?: "primary" | "success" | "danger"; // primary=blue, success=green, danger=red
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  children,
  previewText,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          }
        `}</style>
      </head>
      <Body style={{ backgroundColor: "#f9fafb", margin: "0", padding: "0" }}>
        <div style={{ display: "none" }}>{previewText}</div>
        <Container
          style={{
            maxWidth: "600px",
            margin: "20px auto",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </Container>
      </Body>
    </html>
  );
};

/**
 * Modern email layout with centered design, icons, and progress indicators
 * Supports color schemes: primary (blue), success (green), danger (red)
 */
export const ModernEmailLayout: React.FC<ModernEmailLayoutProps> = ({
  children,
  previewText,
  headerIcon = "rocket_launch",
  accentColor = "primary",
}) => {
  const getColorScheme = (color: "primary" | "success" | "danger") => {
    switch (color) {
      case "success":
        return {
          primary: "#10b981", // emerald-500
          light: "#d1fae5", // emerald-100
          pale: "#f0fdf4", // emerald-50
          dark: "#047857", // emerald-700
          accentBorder: "#34d399", // emerald-400
        };
      case "danger":
        return {
          primary: "#ef4444", // red-500
          light: "#fee2e2", // red-100
          pale: "#fef2f2", // red-50
          dark: "#991b1b", // red-800
          accentBorder: "#f87171", // red-400
        };
      default: // primary
        return {
          primary: "#2563eb", // blue-600
          light: "#dbeafe", // blue-100
          pale: "#f0f9ff", // blue-50
          dark: "#1e40af", // blue-800
          accentBorder: "#60a5fa", // blue-400
        };
    }
  };

  const colors = getColorScheme(accentColor);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Lato', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .footer-link { text-decoration: none; }
          .footer-link:hover { text-decoration: underline; }
        `}</style>
      </head>
      <Body style={{ backgroundColor: "#f3f4f6", margin: "0", padding: "0" }}>
        <div style={{ display: "none" }}>{previewText}</div>

        <div
          style={{
            maxWidth: "600px",
            margin: "32px auto",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {/* Header Icon */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`https://kaubaplats.ee/icons/${headerIcon}.svg`}
                alt=""
                width="80"
                height="80"
                style={{
                  width: "100%",
                  height: "100%",
                  filter: accentColor === "danger"
                    ? "invert(38%) sepia(74%) saturate(1100%) hue-rotate(330deg) brightness(95%) contrast(95%)"
                    : accentColor === "success"
                      ? "invert(56%) sepia(72%) saturate(430%) hue-rotate(110deg) brightness(92%) contrast(90%)"
                      : "invert(30%) sepia(90%) saturate(1200%) hue-rotate(210deg) brightness(95%) contrast(90%)",
                }}
              />
            </div>
          </div>

          {/* Main Container */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            {children}
          </div>

          {/* Footer */}
          <footer
            style={{
              textAlign: "center",
              marginTop: "40px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            <p style={{ margin: "0 0 16px 0" }}>
              © {new Date().getFullYear()} KaubaPlats.ee All rights reserved.
            </p>
            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  gap: "16px",
                }}
              >
                <a
                  href="https://www.facebook.com/kaubaplats"
                  target="_blank"
                  style={{
                    textAlign: "center",
                    padding: "8px 3px 3px 4px",
                    display: "inline-block",
                    border: "2px solid #d1d5db",
                    borderRadius: "50%",
                    height: "44px",
                    width: "44px",
                    textDecoration: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src="https://kaubaplats.ee/images/email/icon-facebook-gray.png"
                    alt="Facebook"
                    title="Facebook"
                    width="26"
                    style={{ maxWidth: "26px" }}
                  />
                </a>
                <a
                  href="https://x.com/kaubaplats"
                  target="_blank"
                  style={{
                    textAlign: "center",
                    padding: "9px 3px 3px 5px",
                    display: "inline-block",
                    border: "2px solid #d1d5db",
                    borderRadius: "50%",
                    height: "44px",
                    width: "44px",
                    textDecoration: "none",
                    boxSizing: "border-box",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="#9ca3af"
                    width="22"
                    height="22"
                    style={{ display: "block" }}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.057zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/kaubaplats"
                  target="_blank"
                  style={{
                    textAlign: "center",
                    padding: "9px 3px 3px 4px",
                    display: "inline-block",
                    border: "2px solid #d1d5db",
                    borderRadius: "50%",
                    height: "44px",
                    width: "44px",
                    textDecoration: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src="https://kaubaplats.ee/images/email/icon-telegram-gray.png"
                    alt="Telegram"
                    title="Telegram"
                    width="26"
                    style={{ maxWidth: "26px" }}
                  />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </Body>
    </html>
  );
};

import * as React from "react";

interface ProgressStepProps {
  steps: Array<{
    label: string;
    icon: string;
    status: "completed" | "active" | "pending";
  }>;
  accentColor?: "primary" | "success" | "danger";
}

export const ProgressSteps: React.FC<ProgressStepProps> = ({
  steps,
  accentColor = "primary",
}) => {
  const getColorScheme = (color: string) => {
    switch (color) {
      case "success":
        return { active: "#10b981", completed: "#10b981", pending: "#9ca3af" };
      case "danger":
        return { active: "#ef4444", completed: "#10b981", pending: "#9ca3af" };
      default:
        return { active: "#2563eb", completed: "#10b981", pending: "#9ca3af" };
    }
  };

  const colors = getColorScheme(accentColor);

  return (
    <div style={{ maxWidth: "100%", marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            {/* Step */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: `2px solid ${
                    step.status === "completed" || step.status === "active"
                      ? colors.active
                      : "#d1d5db"
                  }`,
                  backgroundColor:
                    step.status === "completed" || step.status === "active"
                      ? "#f0fdf4"
                      : "#f3f4f6",
                  marginBottom: "8px",
                }}
              >
                <img
                  src={`https://kaubaplats.ee/icons/${step.status === "completed" ? "check" : step.icon}.svg`}
                  alt=""
                  width="24"
                  height="24"
                  style={{
                    width: "24px",
                    height: "24px",
                    filter:
                      step.status === "completed"
                        ? "invert(56%) sepia(72%) saturate(430%) hue-rotate(110deg) brightness(92%) contrast(90%)"
                        : step.status === "active"
                          ? "invert(30%) sepia(90%) saturate(1200%) hue-rotate(210deg) brightness(95%) contrast(90%)"
                          : "invert(60%) sepia(0%) saturate(0%) brightness(85%)",
                  }}
                />

                {/* Status Badge */}
                {step.status === "active" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#fbbf24",
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    !
                  </div>
                )}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: step.status === "active" ? "700" : "400",
                  color: step.status === "pending" ? "#9ca3af" : "#1f2937",
                  margin: "0",
                }}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 0.5,
                  height: "2px",
                  backgroundColor:
                    step.status === "completed" ? colors.completed : "#d1d5db",
                  margin: "0 4px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface CTAButtonProps {
  href: string;
  text: string;
  accentColor?: "primary" | "success" | "danger";
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  href,
  text,
  accentColor = "primary",
}) => {
  const getButtonColor = (color: string) => {
    switch (color) {
      case "success":
        return "#10b981";
      case "danger":
        return "#ef4444";
      default:
        return "#2563eb";
    }
  };

  const buttonColor = getButtonColor(accentColor);

  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        padding: "12px 32px",
        backgroundColor: buttonColor,
        color: "white",
        textDecoration: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "all 0.3s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {text}
    </a>
  );
};

interface AlertBoxProps {
  type: "info" | "success" | "warning" | "error";
  message: string;
  icon?: string;
}

export const AlertBox: React.FC<AlertBoxProps> = ({ type, message, icon }) => {
  const getAlertColors = (t: string) => {
    switch (t) {
      case "success":
        return {
          bg: "#f0fdf4",
          border: "#10b981",
          text: "#065f46",
          icon: "check_circle",
        };
      case "error":
        return {
          bg: "#fef2f2",
          border: "#ef4444",
          text: "#7f1d1d",
          icon: "error",
        };
      case "warning":
        return {
          bg: "#fef3c7",
          border: "#f59e0b",
          text: "#78350f",
          icon: "warning",
        };
      default:
        return {
          bg: "#f0f9ff",
          border: "#2563eb",
          text: "#0c2d6b",
          icon: "info",
        };
    }
  };

  const colors = getAlertColors(type);

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <img
        src={`https://kaubaplats.ee/icons/${icon || colors.icon}.svg`}
        alt=""
        width="20"
        height="20"
        style={{
          width: "20px",
          height: "20px",
          flexShrink: 0,
          marginTop: "2px",
        }}
      />
      <p
        style={{
          color: colors.text,
          margin: "0",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {message}
      </p>
    </div>
  );
};

interface SectionTitleProps {
  title: string;
  icon?: string;
  color?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  icon,
  color = "#1f2937",
}) => {
  return (
    <div style={{ marginBottom: "24px", textAlign: "center" }}>
      {icon && (
        <img
          src={`https://kaubaplats.ee/icons/${icon}.svg`}
          alt=""
          width="32"
          height="32"
          style={{
            width: "32px",
            height: "32px",
            display: "block",
            margin: "0 auto 8px auto",
          }}
        />
      )}
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: color,
          margin: "0",
        }}
      >
        {title}
      </h2>
    </div>
  );
};

interface DetailsBoxProps {
  items: Array<{ label: string; value: string }>;
  backgroundColor?: string;
}

export const DetailsBox: React.FC<DetailsBoxProps> = ({
  items,
  backgroundColor = "#f9fafb",
}) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "24px",
      }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "8px",
            borderBottom: "none",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}
          >
            {item.label}:
          </span>
          <span
            style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

interface ProgressStepGmailProps {
  steps: Array<{
    label: string;
    badgeContent: string;
  }>;
}

export const ProgressStepsGmail: React.FC<ProgressStepGmailProps> = ({
  steps,
}) => {
  return (
    <div
      style={{
        margin: "0 auto 32px",
        maxWidth: "420px",
        fontSize: "14px",
      }}
    >
      <table
        cellPadding="0"
        cellSpacing="0"
        width="100%"
        style={{ borderCollapse: "collapse" }}
      >
        <tbody>
          <tr>
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                {/* Step Circle */}
                <td
                  width={`${100 / steps.length}%`}
                  align="center"
                  style={{ paddingBottom: "16px" }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "48px",
                      height: "48px",
                      marginBottom: "8px",
                    }}
                  >
                    {/* Circle Background */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: "2px solid #fbbf24",
                        backgroundColor: "#fef3c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                      }}
                    >
                      {idx === 0 && "👤"}
                      {idx === 1 && "✉️"}
                      {idx === 2 && "🎉"}
                    </div>

                    {/* Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor:
                          idx < 2
                            ? idx === 1
                              ? "#fbbf24"
                              : "#10b981"
                            : "#9ca3af",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      {idx === 0 && "✓"}
                      {idx === 1 && "!"}
                      {idx === 2 && ""}
                    </div>
                  </div>
                  {/* Label */}
                  <p
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      color: "#374151",
                      fontWeight: idx === 1 ? "600" : "400",
                    }}
                  >
                    {step.label}
                  </p>
                </td>

                {/* Divider Line (except for last step) */}
                {idx < steps.length - 1 && (
                  <td
                    width={`${100 / (steps.length * 2)}%`}
                    align="center"
                    style={{
                      paddingBottom: "48px",
                      fontSize: "0",
                      lineHeight: "0",
                    }}
                  >
                    <div
                      style={{
                        height: "2px",
                        backgroundColor: "#d1d5db",
                        margin: "0 4px",
                      }}
                    />
                  </td>
                )}
              </React.Fragment>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

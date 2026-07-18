import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { WelcomeTemplate, welcomeSubject } from "@/emails/welcome";
import {
  PasswordResetTemplate,
  passwordResetSubject,
} from "@/emails/password-reset";
import { EmailVerifyTemplate, emailVerifySubject } from "@/emails/email-verify";
import { NewMessageTemplate, newMessageSubject } from "@/emails/new-message";
import {
  DepositCreatedTemplate,
  depositCreatedSubject,
} from "@/emails/deposit-created";
import { DepositPaidTemplate, depositPaidSubject } from "@/emails/deposit-paid";
import { PriceDropTemplate, priceDropSubject } from "@/emails/price-drop";
import { ContactFormTemplate, contactFormSubject } from "@/emails/contact-form";
import {
  NewDeviceLoginTemplate,
  newDeviceLoginSubject,
} from "@/emails/new-device-login-notification";
import {
  AccountDeletedTemplate,
  accountDeletedSubject,
} from "@/emails/account-deleted";
import { NewFeedbackTemplate } from "@/emails/new-feedback";
import { NewReplyTemplate } from "@/emails/new-reply";

// Create SMTP transporter using zone.ee configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zone.eu",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "info@kaubaplats.ee",
    pass: process.env.SMTP_PASS || "",
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

const FROM_EMAIL =
  process.env.EMAIL_FROM || "KaubaPlats.ee <noreply@kaubaplats.ee>";

export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      WelcomeTemplate({ username: name, email, language }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: welcomeSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      PasswordResetTemplate({ username, token: resetToken, language }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: passwordResetSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationToken: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      EmailVerifyTemplate({
        username,
        token: verificationToken,
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: emailVerifySubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

export async function sendNewMessageEmail(
  email: string,
  recipientName: string,
  senderName: string,
  classifiedTitle: string,
  classifiedId: number,
  messagePreview: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      NewMessageTemplate({
        username: recipientName,
        senderName,
        itemTitle: classifiedTitle,
        itemPrice: "", // TODO: Get from database
        itemImage: "", // TODO: Get from database
        messageId: classifiedId,
        messagePreview,
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: newMessageSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending new message email:", error);
    throw error;
  }
}

export async function sendDepositCreatedEmail(
  email: string,
  username: string,
  depositNumber: string,
  createdDate: string,
  itemTitle: string,
  itemPrice: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      DepositCreatedTemplate({
        username,
        depositNumber,
        createdDate,
        itemTitle,
        itemPrice,
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: depositCreatedSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending deposit created email:", error);
    throw error;
  }
}

export async function sendDepositPaidEmail(
  email: string,
  username: string,
  depositNumber: string,
  amount: string,
  deliveryCompany: string,
  address: string,
  buyerName: string,
  buyerPhone: string,
  buyerEmail: string,
  itemTitle: string,
  itemPrice: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      DepositPaidTemplate({
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
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: depositPaidSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending deposit paid email:", error);
    throw error;
  }
}

export async function sendPriceDropEmail(
  email: string,
  itemTitle: string,
  itemId: number,
  oldPrice: string,
  newPrice: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      PriceDropTemplate({
        itemTitle,
        itemId,
        oldPrice,
        newPrice,
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: priceDropSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending price drop email:", error);
    throw error;
  }
}

export async function sendContactFormEmail(
  adminEmail: string,
  senderName: string,
  senderEmail: string,
  subject: string,
  message: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      ContactFormTemplate({
        senderName,
        senderEmail,
        subject,
        message,
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: contactFormSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
}

export async function sendNewLoginLocationEmail(
  email: string,
  username: string,
  ipAddress: string,
  city?: string,
  country?: string,
  userAgent?: string,
  loginTime?: string,
  securityUrl?: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      NewDeviceLoginTemplate({
        username,
        ipAddress,
        location:
          city && country
            ? `${city}, ${country}`
            : country || city || "Unknown",
        device: userAgent ? userAgent.split(";")[0] : "Unknown",
        browser: userAgent || "Unknown",
        loginTime:
          loginTime ||
          new Date().toLocaleString(
            language === "et" ? "et-EE" : language === "ru" ? "ru-RU" : "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        language,
      }) as any
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: newDeviceLoginSubject(language),
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error("Error sending new login location email:", error);
    throw error;
  }
}

export async function sendAccountDeletedEmail(
  email: string,
  username: string,
  language: "en" | "et" | "ru" = "en"
) {
  try {
    console.log(
      `[AccountDeleted Email] Starting email send to: ${email}, language: ${language}, username: ${username}`
    );
    const htmlContent = await render(
      AccountDeletedTemplate({ username, language }) as any
    );
    console.log(
      `[AccountDeleted Email] HTML rendered, length: ${htmlContent.length}`
    );
    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: accountDeletedSubject(language),
      html: htmlContent,
    });
    console.log(
      `[AccountDeleted Email] Email sent successfully: ${response.messageId}`
    );
    return response;
  } catch (error) {
    console.error("Error sending account deleted email:", error);
    throw error;
  }
}

// Generic email sender for dynamic templates
export async function sendEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string;
  subject: string;
  template: string;
  data: any;
}) {
  try {
    let htmlContent;

    // Import and render the appropriate template
    switch (template) {
      case "new-login-location": {
        // Map the incoming data to the template props
        htmlContent = await render(
          NewDeviceLoginTemplate({
            username: data.username,
            location: data.location || "Unknown",
            loginTime: data.loginTime || new Date().toLocaleString(),
            device:
              data.device ||
              (data.userAgent ? data.userAgent.split(";")[0] : "Unknown"),
            browser: data.browser || data.userAgent || "Unknown",
            ipAddress: data.ipAddress || "Unknown",
            language: data.language || "en",
          }) as any
        );
        break;
      }
      default:
        throw new Error(`Unknown email template: ${template}`);
    }

    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
    });

    return response;
  } catch (error) {
    console.error(`Error sending ${template} email:`, error);
    throw error;
  }
}

/**
 * Send new feedback email to seller
 */
export async function sendNewFeedbackEmail(
  email: string,
  sellerUsername: string,
  buyerName: string,
  rating: number,
  feedbackMessage: string,
  itemTitle: string = "",
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      NewFeedbackTemplate({
        username: sellerUsername,
        buyerName,
        rating,
        feedbackMessage,
        itemTitle,
        language,
      }) as any
    );

    const subjectMap = {
      en: "New Feedback Received",
      et: "Uus hinnang saadud",
      ru: "Получена новая оценка",
    };

    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject:
        subjectMap[language as keyof typeof subjectMap] ||
        "New Feedback Received",
      html: htmlContent,
    });

    console.log(`[EMAIL] New feedback email sent to ${email}`);
    return response;
  } catch (error) {
    console.error(`[EMAIL] Error sending new feedback email:`, error);
    throw error;
  }
}

/**
 * Send new reply email to feedback author
 */
export async function sendNewReplyEmail(
  email: string,
  sellerUsername: string,
  replyFromName: string,
  replyMessage: string,
  itemTitle: string = "",
  language: "en" | "et" | "ru" = "en"
) {
  try {
    const htmlContent = await render(
      NewReplyTemplate({
        username: sellerUsername,
        replyFrom: replyFromName,
        replyMessage,
        itemTitle,
        language,
      }) as any
    );

    const subjectMap = {
      en: "New Reply to Your Feedback",
      et: "Uus vastus teie hinnangule",
      ru: "Новый ответ на вашу оценку",
    };

    const response = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject:
        subjectMap[language as keyof typeof subjectMap] ||
        "New Reply to Your Feedback",
      html: htmlContent,
    });

    console.log(`[EMAIL] New reply email sent to ${email}`);
    return response;
  } catch (error) {
    console.error(`[EMAIL] Error sending new reply email:`, error);
    throw error;
  }
}

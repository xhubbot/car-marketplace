import axios from "axios";
import crypto from "crypto";

// Demo credentials from BankPaymentController.php
const EVERYPAY_USERNAME = process.env.EVERYPAY_USERNAME || "4b63ce51223d716e";
const EVERYPAY_SECRET =
  process.env.EVERYPAY_SECRET || "9f072e0d2dec4dc44f0b9945eb3dba68";
const EVERYPAY_ACCOUNT_NAME = process.env.EVERYPAY_ACCOUNT_NAME || "EUR3D1";
const EVERYPAY_TEST_MODE = process.env.EVERYPAY_TEST_MODE !== "false"; // default true
const EVERYPAY_API_URL = EVERYPAY_TEST_MODE
  ? "https://igw-demo.every-pay.com"
  : "https://pay.every-pay.eu";

export interface EverypaySession {
  reference: string;
  url: string;
}

export interface EverypayPaymentData {
  payment_reference: string;
  payment_state: string;
  initial_amount: string;
  standing_amount: string;
  order_reference: string;
  [key: string]: any;
}

export async function initiateEverypayPayment(
  amount: number,
  merchantOrderId: string,
  email: string,
  name: string,
  orderReference: string,
  returnPath: string = "/payment-return"
): Promise<EverypaySession> {
  try {
    // Build return URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    let returnUrl = `${cleanBaseUrl}/en${returnPath}`;

    // IMPORTANT: Everypay demo environment may reject localhost URLs
    // If you get "customer_url is invalid" error:
    // 1. Contact Everypay support to whitelist localhost for your demo account
    // 2. Or use ngrok: `ngrok http 3000` and set NEXT_PUBLIC_APP_URL in .env
    // 3. Or temporarily use a public test domain

    // For now, if localhost, try with IP address format which some APIs accept
    if (returnUrl.includes("localhost")) {
      returnUrl = returnUrl.replace("localhost", "127.0.0.1");
      console.warn(
        "Converted localhost to 127.0.0.1 for Everypay compatibility"
      );
    }

    console.log("Everypay return URL:", returnUrl);

    // customer_url is REQUIRED in every request
    // order_reference must be unique and alphanumeric (no special chars like underscores)
    // PHP uses uniqid() which generates hex strings like "639c706654f93"
    const cleanOrderRef = orderReference.replace(/[^a-zA-Z0-9]/g, ""); // Remove special chars

    console.log("Original order reference:", orderReference);
    console.log("Cleaned order reference:", cleanOrderRef);

    const params = {
      api_username: EVERYPAY_USERNAME,
      account_name: EVERYPAY_ACCOUNT_NAME,
      amount: amount.toFixed(2),
      order_reference: cleanOrderRef,
      nonce: `${Date.now()}${Math.random()}`.replace(".", ""), // Remove decimal point
      timestamp: new Date().toISOString(),
      customer_url: returnUrl, // Required - must be absolute URL
      email: email,
      customer_ip: "127.0.0.1",
      locale: "et", // Use Estonian locale (et, en, ru, lv, lt, fi)
      // Pre-fill customer information to skip the form
      request_name: name,
      mobile_phone: "", // Optional - if you have user's phone
    };

    console.log("Everypay request params:", params);

    const response = await axios.post(
      `${EVERYPAY_API_URL}/api/v4/payments/oneoff`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: EVERYPAY_USERNAME,
          password: EVERYPAY_SECRET,
        },
      }
    );

    console.log("Everypay response:", response.data);

    // Response should include payment_reference and payment_link
    return {
      reference: response.data.payment_reference,
      url: response.data.payment_link || response.data.url,
    };
  } catch (error: any) {
    console.error(
      "Error initiating Everypay payment:",
      error.response?.data || error.message
    );
    throw new Error(
      `Everypay payment initiation failed: ${error.response?.data?.message || error.message}`
    );
  }
}

export async function verifyEverypayPayment(
  reference: string
): Promise<EverypayPaymentData | null> {
  try {
    console.log("=== EVERYPAY VERIFICATION ===");
    console.log(
      "Query URL:",
      `${EVERYPAY_API_URL}/api/v4/payments/${reference}`
    );
    console.log("Using credentials - Username:", EVERYPAY_USERNAME);
    console.log("Test mode:", EVERYPAY_TEST_MODE);

    // Everypay API expects api_username and api_secret as query parameters or in request body
    // Using query parameters for GET request
    const params = {
      api_username: EVERYPAY_USERNAME,
      api_secret: EVERYPAY_SECRET,
    };

    const response = await axios.get(
      `${EVERYPAY_API_URL}/api/v4/payments/${reference}`,
      {
        params: params,
        auth: {
          username: EVERYPAY_USERNAME,
          password: EVERYPAY_SECRET,
        },
      }
    );

    console.log("Everypay API Response status:", response.status);
    console.log(
      "Everypay API Response data:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data as EverypayPaymentData;
  } catch (error: any) {
    console.error(
      "Error verifying Everypay payment:",
      error.response?.data || error.message
    );
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    return null;
  }
}

export async function completeEverypayPurchase(
  orderReference: string,
  paymentReference: string
): Promise<EverypayPaymentData> {
  try {
    // Verify payment status
    const paymentData = await verifyEverypayPayment(paymentReference);

    if (!paymentData) {
      throw new Error("Payment not found");
    }

    return paymentData;
  } catch (error: any) {
    console.error("Error completing Everypay purchase:", error);
    throw error;
  }
}

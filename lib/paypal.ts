/**
 * Lightweight PayPal REST API implementation for Edge Runtime.
 */

const PAYPAL_API = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

interface PayPalOrderResponse {
  id: string;
  status: string;
}

async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("PayPal credentials missing");
  }

  const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to get PayPal access token: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function createPayPalOrder(amount: number, currency: string = "USD"): Promise<PayPalOrderResponse> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create PayPal order: ${response.status} ${errorBody}`);
  }

  return await response.json();
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to capture PayPal order: ${response.status} ${errorBody}`);
  }

  return await response.json();
}

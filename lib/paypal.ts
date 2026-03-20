export async function getPaypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_ENVIRONMENT === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${environment}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with PayPal");
  }

  const data = await response.json();
  return { token: data.access_token as string, environment };
}

export async function createPaypalOrder(amount: string, description: string) {
  const { token, environment } = await getPaypalAccessToken();
  const response = await fetch(`${environment}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description,
          amount: {
            currency_code: "USD",
            value: amount
          }
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Unable to create PayPal order");
  }

  return response.json();
}

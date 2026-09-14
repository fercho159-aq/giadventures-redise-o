import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

interface OrderPayload {
  packageName: string;
  packageSlug: string;
  pricePerPerson: number;
  currency: string;
  participants: number;
  selectedDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json();

    const {
      packageName,
      pricePerPerson,
      currency,
      participants,
      selectedDate,
      contactName,
    } = body;

    if (!packageName || !pricePerPerson || !participants || !contactName) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const totalAmount = (pricePerPerson * participants).toFixed(2);
    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `${packageName} — ${selectedDate} — ${participants} persona(s)`,
            amount: {
              currency_code: currency.toUpperCase(),
              value: totalAmount,
            },
          },
        ],
      }),
    });

    const order = await res.json();
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "Error al crear la orden de PayPal" },
      { status: 500 }
    );
  }
}

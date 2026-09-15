import { NextRequest, NextResponse } from "next/server";
import { BookingError, createBooking, type BookingRequest } from "@/lib/bookings";
import { isPayPalConfigured } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

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

export async function POST(request: NextRequest) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal no esta configurado" }, { status: 503 });
  }

  try {
    const body: BookingRequest = await request.json();

    // Booking is stored as pending; capture-order marks it paid.
    const booking = await createBooking(body, { paymentMethod: "paypal", status: "pending" });

    const totalAmount = booking.totalPrice.toFixed(2);
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
            custom_id: booking.id,
            description: `${booking.expeditionName} — ${body.selectedDate} — ${booking.people} persona(s)`,
            amount: {
              currency_code: booking.currency.toUpperCase(),
              value: totalAmount,
            },
          },
        ],
      }),
    });

    const order = await res.json();
    if (!order.id) {
      await prisma.booking.update({ where: { id: booking.id }, data: { status: "cancelled" } });
      return NextResponse.json({ error: "Error al crear la orden de PayPal" }, { status: 502 });
    }

    await prisma.booking.update({ where: { id: booking.id }, data: { paymentId: order.id } });
    return NextResponse.json({ id: order.id, bookingId: booking.id });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "Error al crear la orden de PayPal" },
      { status: 500 }
    );
  }
}

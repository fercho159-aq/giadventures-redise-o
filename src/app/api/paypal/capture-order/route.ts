import { NextRequest, NextResponse } from "next/server";
import { markBookingPaid } from "@/lib/bookings";
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
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Falta orderID" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const res = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.status === "COMPLETED") {
      // Look the booking up by the PayPal order id stored at creation (not trusting the client)
      const booking = await prisma.booking.findFirst({
        where: { paymentId: orderID, paymentMethod: "paypal" },
      });
      if (booking) await markBookingPaid(booking.id);
      return NextResponse.json({ success: true, bookingId: booking?.id, data });
    }

    return NextResponse.json(
      { error: "El pago no se completó", status: data.status },
      { status: 400 }
    );
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Error al capturar el pago" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/constants";

interface BookingPayload {
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
    const body: BookingPayload = await request.json();

    const {
      packageName,
      packageSlug,
      pricePerPerson,
      currency,
      participants,
      selectedDate,
      contactName,
      contactEmail,
      contactPhone,
    } = body;

    if (
      !packageName ||
      !packageSlug ||
      !pricePerPerson ||
      !participants ||
      !selectedDate ||
      !contactName ||
      !contactEmail
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const unitAmount = Math.round(pricePerPerson * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: contactEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: packageName,
              description: `Expedición ${packageName} — ${selectedDate} — ${participants} persona(s)`,
            },
            unit_amount: unitAmount,
          },
          quantity: participants,
        },
      ],
      mode: "payment",
      success_url: `${SITE_URL}/reservar/confirmacion?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${SITE_URL}/reservar/${packageSlug}?cancelled=true`,
      metadata: {
        packageSlug,
        packageName,
        selectedDate,
        participants: String(participants),
        contactName,
        contactPhone,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 }
    );
  }
}

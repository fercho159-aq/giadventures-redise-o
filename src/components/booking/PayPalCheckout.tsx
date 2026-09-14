"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface PayPalCheckoutProps {
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

export default function PayPalCheckout({
  packageName,
  packageSlug,
  pricePerPerson,
  currency,
  participants,
  selectedDate,
  contactName,
  contactEmail,
  contactPhone,
}: PayPalCheckoutProps) {
  const router = useRouter();
  const t = useTranslations("booking");
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        {t("paypalNotConfigured")}
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      <PayPalScriptProvider
        options={{
          clientId,
          currency: currency.toUpperCase(),
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
            height: 50,
          }}
          createOrder={async () => {
            setError(null);
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                packageName,
                packageSlug,
                pricePerPerson,
                currency,
                participants,
                selectedDate,
                contactName,
                contactEmail,
                contactPhone,
              }),
            });
            const data = await res.json();
            if (data.id) return data.id;
            throw new Error(data.error || "Error creating PayPal order");
          }}
          onApprove={async (data) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await res.json();
            if (result.success) {
              router.push(
                `/reservar/confirmacion?provider=paypal&status=success`
              );
            } else {
              setError(result.error || t("paymentError"));
            }
          }}
          onError={() => {
            setError(t("paymentError"));
          }}
          onCancel={() => {
            setError(t("paymentCancelled"));
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

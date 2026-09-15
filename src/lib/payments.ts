export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function isPayPalConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

/**
 * Test payments register a booking as paid without charging anything.
 * PAYMENT_TEST_MODE=true|false forces it; otherwise it's on only while no
 * real payment provider is configured.
 */
export function isTestPaymentMode(): boolean {
  const flag = process.env.PAYMENT_TEST_MODE;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return !isStripeConfigured() && !isPayPalConfigured();
}

// One-off script: registers the production webhook endpoint in Stripe and
// prints the signing secret to store as STRIPE_WEBHOOK_SECRET.
//
// Usage: node --env-file=.env.local scripts/create-stripe-webhook.mjs
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY. Run with --env-file=.env.local");
}

const stripe = new Stripe(secretKey, { apiVersion: "2026-07-29.dahlia" });

const URL_TO_REGISTER = "https://getflightassist.com/api/stripe-webhook";

async function main() {
  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const already = existing.data.find((e) => e.url === URL_TO_REGISTER);
  if (already) {
    console.log(`Webhook endpoint already exists: ${already.id} (secret not re-printable, reuse existing)`);
    return;
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: URL_TO_REGISTER,
    enabled_events: ["checkout.session.completed"],
  });

  console.log(`Created webhook endpoint ${endpoint.id}`);
  console.log(`\nSTRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
}

main();

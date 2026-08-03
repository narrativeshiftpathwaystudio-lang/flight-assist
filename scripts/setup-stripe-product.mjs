// One-off setup script: creates the Flight Assist Premium product + its
// one-time $9 price in Stripe (idempotent — safe to re-run). Prints the
// price id to set as STRIPE_PREMIUM_PRICE_ID.
//
// Usage: node --env-file=.env.local scripts/setup-stripe-product.mjs
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY. Run with --env-file=.env.local");
}

const stripe = new Stripe(secretKey, { apiVersion: "2026-07-29.dahlia" });

const PRODUCT_NAME = "Flight Assist Premium";
const UNIT_AMOUNT = 900; // $9.00 USD

async function main() {
  const existingProducts = await stripe.products.search({
    query: `name:"${PRODUCT_NAME}" AND active:"true"`,
  });

  let product = existingProducts.data[0];
  if (!product) {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description: "Unlimited trips and PDF checklist export.",
    });
    console.log(`Created product ${product.id}`);
  } else {
    console.log(`Reusing existing product ${product.id}`);
  }

  const existingPrices = await stripe.prices.list({ product: product.id, active: true });
  let price = existingPrices.data.find(
    (p) => p.unit_amount === UNIT_AMOUNT && p.currency === "usd" && !p.recurring,
  );

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: UNIT_AMOUNT,
      currency: "usd",
    });
    console.log(`Created price ${price.id}`);
  } else {
    console.log(`Reusing existing price ${price.id}`);
  }

  console.log(`\nSTRIPE_PREMIUM_PRICE_ID=${price.id}`);
}

main();

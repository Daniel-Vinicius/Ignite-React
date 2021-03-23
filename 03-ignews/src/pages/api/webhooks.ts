import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "customer.subscription.deleted",
  "customer.subscription.updated",
  "checkout.session.completed",
]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const buf = await buffer(request);
    const secret = request.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return response.status(400).send(`Webhook error: ${error.message}`);
    }

    const type = event.type;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.deleted":
          case "customer.subscription.updated":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString()
            );

            break;

          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );

            break;
          default:
            throw new Error("Unhandled event.");
        }
      } catch (error) {
        return response.json({ error: "Webhook handle failed" });
      }
    }

    response.json({ received: true });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
};

import express from "express";
import { prisma } from "../../utils/prisma";
import Stripe from "stripe";
import { Donations } from "@prisma/client";
import type { Subscriptions } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.WEBHOOK_SECRET;

export const initStripes = (app: express.Express) => {
  app.post(
    "/stripe-webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      console.log("Received webhook");
      console.log("Headers:", req.headers);
      console.log("Body:", req.body.toString());
      const sig = req.headers["stripe-signature"];

      let event: Stripe.Event;

      try {
        if (!endpointSecret) {
          throw new Error("Missing STRIPE_WEBHOOK_SECRET");
        }
        event = stripe.webhooks.constructEvent(
          req.body,
          sig as string,
          endpointSecret
        );
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        console.log("Stripe-Signature:", sig);
        console.log("Endpoint Secret:", endpointSecret);

        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      console.log(`Received event: ${event.type}`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
          }
          case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentSucceeded(invoice);
            break;
          }
          case "customer.created":
          case "charge.succeeded":
          case "payment_intent.succeeded":
          case "payment_intent.created":
          case "charge.updated":
            // Log these events but don't process them further
            console.log(`Received ${event.type} event:`, event.data.object);
            break;
          case "customer.subscription.created": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionCreated(subscription);
            break;
          }
          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (e: any) {
        console.error("Error processing webhook:", e);
        res.status(400).send(`Webhook Error: ${e.message}`);
      }
    }
  );
};

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (session.mode === "subscription" && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        membership_type_id: session.metadata?.membership_type_id ?? null,
        member_id: session.metadata?.member_id ?? null,
        organization_id: session.metadata?.organization_id ?? null,
      },
    });
    console.log("Subscription updated with metadata:", subscription.id);
  }

  const stripOrganizationId = session.metadata?.organization_id;

  if (!stripOrganizationId) {
    throw new Error("Missing organization_id in session metadata");
  }

  const donationData: Omit<Donations, "id" | "createdAt" | "updatedAt"> = {
    amount: session.amount_total ? session.amount_total / 100 : 0,
    date: new Date(session.created * 1000),
    donorEmail: session.customer_details?.email || "",
    donorName: session.customer_details?.name || "",
    organizationId: parseInt(stripOrganizationId),
    stripePaymentId: session.payment_intent as string,
    recurring: session.mode === "subscription",
  };

  await prisma.donations.create({ data: donationData });
  console.log("Donation created:", donationData);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // This function might not be necessary anymore since we're updating the subscription in handleCheckoutSessionCompleted
  console.log("New subscription created:", subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    console.error("Missing subscription ID in invoice");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log("Subscription:", subscription);

  let memberId = parseInt(subscription.metadata.member_id || "0");
  let membershipTypeId = parseInt(
    subscription.metadata.membership_type_id || "0"
  );

  if (!memberId || !membershipTypeId) {
    console.error(
      "Missing member_id or membership_type_id in subscription metadata"
    );
    // Try to retrieve these from the associated product
    const product = await stripe.products.retrieve(
      subscription.items.data[0].price.product as string
    );
    memberId = parseInt(product.metadata.member_id || "0");
    membershipTypeId = parseInt(product.metadata.membership_type_id || "0");

    if (!memberId || !membershipTypeId) {
      console.error("Unable to retrieve necessary metadata");
      return;
    }
  }

  const subscriptionData: Omit<
    Subscriptions,
    "id" | "createdAt" | "updatedAt"
  > = {
    memberId,
    membershipTypeId,
    startDate: new Date(subscription.current_period_start * 1000) as Date,
    endDate: new Date(subscription.current_period_end * 1000),
    paymentStatus: "PAID",
    stripeSubscriptionId: subscriptionId,
  };

  await prisma.subscriptions.upsert({
    where: {
      memberId_membershipTypeId: {
        memberId,
        membershipTypeId,
      },
    },
    update: subscriptionData,
    create: subscriptionData,
  });

  console.log("Subscription updated:", subscriptionData);

  await prisma.members.update({
    where: { id: memberId },
    data: { status: "SUBSCRIBER" },
  });

  console.log("Member status updated to SUBSCRIBER");

  const donationData: Omit<Donations, "id" | "createdAt" | "updatedAt"> = {
    amount: invoice.amount_paid / 100,
    date: new Date(invoice.created * 1000),
    donorEmail: invoice.customer_email || "",
    donorName: invoice.customer_name || "",
    organizationId: parseInt(subscription.metadata.organization_id || "0"),
    stripePaymentId: invoice.payment_intent as string,
    recurring: true,
  };

  await prisma.donations.create({ data: donationData });
  console.log("Recurring donation created:", donationData);
}

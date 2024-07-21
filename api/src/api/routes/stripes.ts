import express from "express";
import { prisma } from "../../utils/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initStripes = (app: express.Express) => {
  app.post("/stripe-webhook", async (req, res) => {
    const stripeRequest = req.body;
    try {
      if (stripeRequest.type === "payment_intent.succeeded") {
        const paymentIntent = stripeRequest.data.object;
        const donationData = {
          amount: paymentIntent.amount,
          date: new Date(paymentIntent.created * 1000),
          donorEmail: paymentIntent.receipt_email,
          donorName: paymentIntent.name,
          organizationId: parseInt(paymentIntent.metadata.organization_id),
          stripePaymentId: paymentIntent.id,
          recurring: false,
        };

        await prisma.donations.create({ data: donationData });
      } else if (stripeRequest.type === "invoice.payment_succeeded") {
        const invoice = stripeRequest.data.object;
        const subscriptionId = invoice.subscription;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const donationData = {
          amount: invoice.amount_paid,
          date: new Date(invoice.created * 1000),
          donorName: invoice.user.name,
          donorEmail: invoice.customer_email,
          organizationId: parseInt(subscription.metadata.organization_id),
          stripePaymentId: subscriptionId,
          recurring: true,
        };

        await prisma.donations.create({ data: donationData });
      } else if (stripeRequest.type === "invoice.payment_succeeded") {
        const invoice = stripeRequest.data.object;
        const subscriptionId = invoice.subscription;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await prisma.subscriptions.update({
          where: { id: parseInt(subscription.metadata.subscription_id) },
          data: {
            paymentStatus: "PAID",
          },
        });

        await prisma.members.update({
          where: { id: parseInt(subscription.metadata.member_id) },
          data: {
            status: "SUBSCRIBER",
          },
        });
      }

      res.sendStatus(200);
    } catch (e) {
      console.error("Error processing webhook:", e);
      res.sendStatus(400);
    }
  });
};

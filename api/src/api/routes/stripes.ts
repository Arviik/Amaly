import express from "express";
import { prisma } from "../../utils/prisma";
import Stripe from "stripe";
import { Donations, Subscriptions } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initStripes = (app: express.Express) => {
  app.post("/stripe-webhook", async (req, res) => {
    const stripeRequest = req.body as Stripe.Event;

    try {
      switch (stripeRequest.type) {
        case "checkout.session.completed": {
          const session = stripeRequest.data.object as Stripe.Checkout.Session;
          const stripOrganizationId = session.metadata?.organization_id;

          if (!stripOrganizationId) {
            console.error("Missing organization_id in session metadata");
            res.sendStatus(400);
            return;
          }

          const donationData: Omit<
            Donations,
            "id" | "createdAt" | "updatedAt"
          > = {
            amount: session.amount_total ? session.amount_total / 100 : 0, // Convert cents to dollars
            date: new Date(session.created * 1000),
            donorEmail: session.customer_details?.email || "",
            donorName: session.customer_details?.name || "",
            organizationId: parseInt(stripOrganizationId),
            stripePaymentId: session.payment_intent as string,
            recurring: session.mode === "subscription",
          };

          await prisma.donations.create({ data: donationData });
          console.log("Donation created:", donationData);
          break;
        }
        case "invoice.payment_succeeded": {
          const invoice = stripeRequest.data.object as Stripe.Invoice;
          const subscriptionId = invoice.subscription as string;

          if (!subscriptionId) {
            console.error("Missing subscription ID in invoice");
            res.sendStatus(400);
            return;
          }

          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );
          const memberId = parseInt(subscription.metadata.member_id || "0");
          const membershipTypeId = parseInt(
            subscription.metadata.membership_type_id || "0"
          );

          if (!memberId || !membershipTypeId) {
            console.error(
              "Missing member_id or membership_type_id in subscription metadata"
            );
            res.sendStatus(400);
            return;
          }

          const subscriptionData: Omit<
            Subscriptions,
            "id" | "createdAt" | "updatedAt"
          > = {
            memberId,
            membershipTypeId,
            startDate: new Date(subscription.current_period_start * 1000),
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

          // Create a donation record for the subscription payment
          const donationData: Omit<
            Donations,
            "id" | "createdAt" | "updatedAt"
          > = {
            amount: invoice.amount_paid / 100, // Convert cents to dollars
            date: new Date(invoice.created * 1000),
            donorEmail: invoice.customer_email || "",
            donorName: invoice.customer_name || "",
            organizationId: parseInt(
              subscription.metadata.organization_id || "0"
            ),
            stripePaymentId: invoice.payment_intent as string,
            recurring: true,
          };

          await prisma.donations.create({ data: donationData });
          console.log("Recurring donation created:", donationData);

          break;
        }
        default:
          console.log(`Unhandled event type: ${stripeRequest.type}`);
      }

      res.sendStatus(200);
    } catch (e) {
      console.error("Error processing webhook:", e);
      res.sendStatus(400);
    }
  });
};

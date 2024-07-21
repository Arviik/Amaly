import express from "express";
import { prisma } from "../../utils/prisma";
import {
  PaymentStatus,
  subscriptionCreateValidator,
  subscriptionRequest,
  subscriptionUpdateValidator,
} from "../validators/subscription-validator";
import Stripe from "stripe";
import { createStripeCustomer } from "../services/stripe-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initSubscriptions = (app: express.Express) => {
  app.get("/subscriptions", async (req, res) => {
    try {
      const allSubscriptions = await prisma.subscriptions.findMany();
      res.json(allSubscriptions);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/subscriptions/:id", async (req, res) => {
    try {
      const subscription = await prisma.subscriptions.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(subscription);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/subscriptions", async (req, res) => {
    const validation = subscriptionCreateValidator.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const subscriptionReq = validation.value;
    try {
      const membershipType =
        (await prisma.membershipTypes.findUnique({
          where: { id: subscriptionReq.membershipTypeId },
        })) || null;

      if (!membershipType) {
        res.status(404).send({ error: "Membership type not found" });
        return;
      }

      const member =
        (await prisma.members.findUnique({
          where: { id: subscriptionReq.memberId },
          include: { user: true },
        })) || null;

      if (!member) {
        res.status(404).send({ error: "Member not found" });
        return;
      }

      const customer = await createStripeCustomer(
        member.user.email,
        member.user.firstName + " " + member.user.lastName
      );

      const product = await stripe.products.create({
        name: membershipType.name,
      });

      const price = await stripe.prices.create({
        currency: "eur",
        recurring: {
          interval: "month",
        },
        unit_amount: Number(membershipType.amount),
        product: product.id,
      });

      const subscriptionData: subscriptionRequest = {
        memberId: subscriptionReq.memberId,
        membershipTypeId: subscriptionReq.membershipTypeId,
        startDate: new Date(),
        endDate: new Date(),
        PaymentStatus: PaymentStatus.PENDING,
        stripeSubscriptionId: "",
      };

      const createdSubscription = await prisma.subscriptions.create({
        data: subscriptionData as any,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: price.id,
          },
        ],
        metadata: {
          membership_type_id: membershipType.id.toString(),
          member_id: member.id.toString(),
          subscription_id: createdSubscription.id.toString(),
        },
      });

      const updatedSubscription = await prisma.subscriptions.update({
        where: { id: createdSubscription.id },
        data: {
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
          stripeSubscriptionId: subscription.id,
        },
      } as any);

      res.status(201).json(updatedSubscription);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/subscriptions/:id", async (req, res) => {
    const validation = subscriptionUpdateValidator.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const subscriptionRequest = validation.value;
    try {
      const subscription = await prisma.subscriptions.update({
        where: {
          id: Number(req.params.id),
        },
        data: subscriptionRequest,
      });
      res.json(subscription);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/subscriptions/:id", async (req, res) => {
    try {
      const deletedSubscription = await prisma.subscriptions.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedSubscription);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};

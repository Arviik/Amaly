import express from "express";
import { prisma } from "../../utils/prisma";
import {
  donationsValidation,
  donationsPatchValidation,
} from "../validators/donation-validator";
import { createStripeCustomer } from "../services/stripe-service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initDonations = (app: express.Express) => {
  app.get("/donations", async (req, res) => {
    try {
      const allDonations = await prisma.donations.findMany();
      res.json(allDonations);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/donations/:id", async (req, res) => {
    try {
      const donation = await prisma.donations.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(donation);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/donations", async (req, res) => {
    const validation = donationsValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const donationsRequest = validation.value;
    try {
      // Créer un client Stripe pour le donateur
      const customer = await createStripeCustomer(
        donationsRequest.donorEmail,
        donationsRequest.donorName
      );

      if (donationsRequest.recurring) {
        const product = await stripe.products.create({
          name: "Donation",
          metadata: {
            organization_id: donationsRequest.organizationId.toString(),
          },
        });
        const price = await stripe.prices.create({
          unit_amount: donationsRequest.amount,
          currency: "eur",
          recurring: {
            interval: "month",
          },
          product: product.id,
        });

        // Créer un abonnement Stripe pour les dons récurrents
        await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              price: price.id,
            },
          ],
          metadata: {
            organization_id: donationsRequest.organizationId.toString(),
          },
        });
      } else {
        // Créer un paiement unique avec Stripe pour les dons uniques
        await stripe.paymentIntents.create({
          amount: donationsRequest.amount,
          currency: "eur",
          description: "One-time Donation",
          customer: customer.id,
          receipt_email: donationsRequest.donorEmail,
          metadata: {
            organization_id: donationsRequest.organizationId.toString(),
          },
        });
      }

      res.sendStatus(200);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });

  app.patch("/donations/:id", async (req, res) => {
    const validation = donationsPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const donationsRequest = validation.value;
    try {
      const donation = await prisma.donations.update({
        where: {
          id: Number(req.params.id),
        },
        data: donationsRequest,
      });
      res.json(donation);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/donations/:id", async (req, res) => {
    try {
      const deletedDonation = await prisma.donations.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedDonation);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};

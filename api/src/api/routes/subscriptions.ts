import express from "express";
import { prisma } from "../../utils/prisma";
import {
  subscriptionPatchValidation,
  subscriptionValidation,
} from "../validators/subscription-validator";

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
    const validation = subscriptionValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error.details });
      return;
    }

    const subscriptionRequest = validation.value;
    try {
      const subscription = await prisma.subscriptions.create({
        data: {
          amount: subscriptionRequest.amount,
          paymentDate: subscriptionRequest.paymentDate,
          startDate: subscriptionRequest.startDate,
          endDate: subscriptionRequest.endDate,
          isPaid: subscriptionRequest.isPaid,
          membershipId: subscriptionRequest.membershipId,
        },
      });
      res.json(subscription);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/subscriptions/:id", async (req, res) => {
    const validation = subscriptionPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error.details });
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

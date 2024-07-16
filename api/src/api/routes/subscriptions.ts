import express from "express";
import { prisma } from "../../utils/prisma";
import {
  subscriptionPatchValidation,
  subscriptionValidation,
} from "../validators/subscription-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

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
  //Ajoutez une logique pour mettre à jour le statut de l'adhésion correspondante lorsqu'une souscription est marquée comme payée.
  app.post("/subscriptions", authMiddleware, async (req, res) => {
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
      const membership = await prisma.memberships.findUnique({
        where: { id: subscriptionRequest.membershipId },
      });

      if (!membership) {
        res.status(404).send({ error: "Membership not found" });
        return;
      }

      const membershipType = await prisma.membershipTypes.findUnique({
        where: { id: membership.membershipTypeId },
      });

      if (!membershipType) {
        res.status(404).send({ error: "Membership type not found" });
        return;
      }

      await prisma.memberships.update({
        where: { id: subscriptionRequest.membershipId },
        data: {
          status: membershipType.name,
        },
      });
      res.status(201).json(subscription);
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

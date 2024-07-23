import express from "express";
import { prisma } from "../../utils/prisma";
import {
  donationsValidation,
  donationsPatchValidation,
} from "../validators/donation-validator";

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
      const donation = await prisma.donations.create({
        data: {
          amount: donationsRequest.amount,
          date: donationsRequest.date,
          donorName: donationsRequest.donorName,
          donorEmail: donationsRequest.donorEmail,
          organizationId: donationsRequest.organizationId,
        },
      });
      res.json(donation);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
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

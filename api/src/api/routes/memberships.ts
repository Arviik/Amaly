import express from "express";
import { prisma } from "../../utils/prisma";
import {
  membershipPatchValidation,
  membershipValidation,
} from "../validators/membership-validator";

export const initMemberships = (app: express.Express) => {
  app.get("/memberships", async (req, res) => {
    try {
      const allMemberships = await prisma.memberships.findMany();
      res.json(allMemberships);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/memberships/:id", async (req, res) => {
    try {
      const membership = await prisma.memberships.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(membership);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/memberships", async (req, res) => {
    const validation = membershipValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error.details });
      return;
    }

    const membershipRequest = validation.value;
    try {
      const membership = await prisma.memberships.create({
        data: {
          startDate: membershipRequest.startDate,
          endDate: membershipRequest.endDate,
          memberId: membershipRequest.memberId,
          membershipTypeId: membershipRequest.membershipTypeId,
        },
      });
      res.json(membership);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/memberships/:id", async (req, res) => {
    const validation = membershipPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error.details });
      return;
    }

    const membershipRequest = validation.value;
    try {
      const membership = await prisma.memberships.update({
        where: {
          id: Number(req.params.id),
        },
        data: membershipRequest,
      });
      res.json(membership);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/memberships/:id", async (req, res) => {
    try {
      const deletedMembership = await prisma.memberships.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedMembership);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};

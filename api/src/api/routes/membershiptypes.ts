import express from "express";
import { prisma } from "../../utils/prisma";
import {
  membershipTypePatchValidation,
  membershipTypeValidation,
} from "../validators/membershipType-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

export const initmembershipTypes = (app: express.Express) => {
  app.get("/membershiptypes", async (req, res) => {
    try {
      const allMembershipTypes = await prisma.membershipTypes.findMany();
      res.json(allMembershipTypes);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/membershiptypes/:id", async (req, res) => {
    try {
      const membershipType = await prisma.membershipTypes.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(membershipType);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get(
    "/membershiptypes/organization/:organizationId",
    authMiddleware,
    async (req, res) => {
      try {
        const membershipTypes = await prisma.membershipTypes.findMany({
          where: { organizationId: Number(req.params.organizationId) },
        });
        res.json(membershipTypes);
      } catch (e) {
        res.status(500).send({ error: e });
        return;
      }
    }
  );

  app.post("/membershiptypes", async (req, res) => {
    const validation = membershipTypeValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error.details });
      return;
    }

    const membershipTypeRequest = validation.value;
    try {
      const membershipType = await prisma.membershipTypes.create({
        data: {
          name: membershipTypeRequest.name,
          description: membershipTypeRequest.description,
          duration: membershipTypeRequest.duration,
          fee: membershipTypeRequest.fee,
          organizationId: membershipTypeRequest.organizationId,
        },
      });
      res.status(201).json(membershipType);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/membershiptypes/:id", async (req, res) => {
    const validation = membershipTypePatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error.details });
      return;
    }

    const membershipTypeRequest = validation.value;
    try {
      const membershipType = await prisma.membershipTypes.update({
        where: {
          id: Number(req.params.id),
        },
        data: membershipTypeRequest,
      });
      res.status(200).json(membershipType);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/membershiptypes/:id", async (req, res) => {
    try {
      const deletedMembershipType = await prisma.membershipTypes.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(204).json(deletedMembershipType);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};

import express from "express";
import { prisma } from "../../utils/prisma";
import {
  membershipTypesCreateValidator,
  membershipTypesUpdateValidator,
} from "../validators/membershiptypes-validator";

export const initMembershipTypes = (app: express.Express) => {
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

  app.post("/membershiptypes", async (req, res) => {
    const validation = membershipTypesCreateValidator.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const membershipTypesRequest = validation.value;
    try {
      const membershipType = await prisma.membershipTypes.create({
        data: {
          name: membershipTypesRequest.name,
          description: membershipTypesRequest.description,
          amount: membershipTypesRequest.amount,
          duration: membershipTypesRequest.duration,
          organizationId: membershipTypesRequest.organizationId,
        },
      });
      res.json(membershipType);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.put("/membershiptypes/:id", async (req, res) => {
    const validation = membershipTypesUpdateValidator.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const membershipTypesRequest = validation.value;
    try {
      const membershipType = await prisma.membershipTypes.update({
        where: {
          id: Number(req.params.id),
        },
        data: membershipTypesRequest,
      });
      res.json(membershipType);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.delete("/membershiptypes/:id", async (req, res) => {
    try {
      const deletedMembershipType = await prisma.membershipTypes.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedMembershipType);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};

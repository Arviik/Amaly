import express from "express";
import { prisma } from "../../utils/prisma";
import {
  memberPatchValidation,
  memberValidation,
} from "../validators/member-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

export const initMembers = (app: express.Express) => {
  app.get("/members", authMiddleware, async (req, res) => {
    try {
      const allMembers = await prisma.members.findMany();
      res.json(allMembers);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/members/:id", authMiddleware, async (req, res) => {
    try {
      const member = await prisma.members.findUnique({
        where: { id: Number(req.params.id) },
      });
      if (member) {
        res.json(member);
      } else {
        res.status(404).send({ error: "Member not found" });
      }
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get(
    "/organizations/:organizationId/members",
    authMiddleware,
    async (req, res) => {
      try {
        const members = await prisma.members.findMany({
          where: { organizationId: Number(req.params.organizationId) },
        });
        res.json(members);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  app.post("/members", authMiddleware, async (req, res) => {
    const validation = memberValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error.details });
      return;
    }

    const memberRequest = validation.value;
    try {
      const member = await prisma.members.create({
        data: {
          employmentType: memberRequest.employmentType,
          organizationId: memberRequest.organizationId,
          userId: memberRequest.userId,
        },
      });
      res.status(201).json(member);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/members/:id", authMiddleware, async (req, res) => {
    const validation = memberPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error.details });
      return;
    }

    const memberRequest = validation.value;
    try {
      const member = await prisma.members.update({
        where: {
          id: Number(req.params.id),
        },
        data: memberRequest,
      });
      res.json(member);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/members/:id", authMiddleware, async (req, res) => {
    try {
      const deletedMember = await prisma.members.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedMember);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};

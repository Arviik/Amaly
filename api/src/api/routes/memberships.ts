import express from "express";
import { prisma } from "../../utils/prisma";
import {
  membershipPatchValidation,
  membershipValidation,
} from "../validators/membership-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

export const initMemberships = (app: express.Express) => {
  app.get("/memberships", authMiddleware, async (req, res) => {
    try {
      const allMemberships = await prisma.memberships.findMany();
      res.json(allMemberships);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  app.get("/memberships/:id", authMiddleware, async (req, res) => {
    try {
      const membership = await prisma.memberships.findUnique({
        where: { id: Number(req.params.id) },
        include: { membershipType: true },
      });
      if (!membership) {
        return res.status(404).json({ error: "Membership not found" });
      }
      res.json(membership);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  app.get(
    "/members/:memberId/current-membership",
    authMiddleware,
    async (req, res) => {
      try {
        const currentDate = new Date();
        const currentMembership = await prisma.memberships.findFirst({
          where: {
            memberId: Number(req.params.memberId),
            startDate: { lte: currentDate },
            endDate: { gte: currentDate },
          },
          include: { membershipType: true },
        });
        if (!currentMembership) {
          return res.status(404).json({ error: "No current membership found" });
        }
        res.json(currentMembership);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  app.post("/memberships", authMiddleware, async (req, res) => {
    const validation = membershipValidation.validate(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error.details });
    }

    const membershipRequest = validation.value;
    try {
      // Check if there's an overlapping membership
      const overlappingMembership = await prisma.memberships.findFirst({
        where: {
          memberId: membershipRequest.memberId,
          OR: [
            {
              startDate: { lte: membershipRequest.endDate },
              endDate: { gte: membershipRequest.startDate },
            },
            {
              startDate: { gte: membershipRequest.startDate },
              endDate: { lte: membershipRequest.endDate },
            },
          ],
        },
      });

      if (overlappingMembership) {
        return res
          .status(400)
          .json({
            error: "Membership period overlaps with an existing membership",
          });
      }

      const membershipType = await prisma.membershipTypes.findUnique({
        where: { id: membershipRequest.membershipTypeId },
      });

      if (!membershipType) {
        return res.status(400).json({ error: "Invalid membership type" });
      }

      const membership = await prisma.memberships.create({
        data: {
          status: membershipType.name,
          startDate: membershipRequest.startDate,
          endDate: membershipRequest.endDate,
          memberId: membershipRequest.memberId,
          membershipTypeId: membershipRequest.membershipTypeId,
        },
      });
      res.status(201).json(membership);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  app.patch("/memberships/:id", authMiddleware, async (req, res) => {
    const validation = membershipPatchValidation.validate(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error.details });
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
    }
  });

  app.delete("/memberships/:id", authMiddleware, async (req, res) => {
    try {
      const deletedMembership = await prisma.memberships.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });
};

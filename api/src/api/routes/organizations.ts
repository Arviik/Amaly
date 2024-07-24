import express from "express";
import { prisma } from "../../utils/prisma";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";
import {
  organizationPatchValidation,
  organizationValidation,
} from "../validators/organization-validator";

export const initOrganizations = (app: express.Express) => {
  app.get("/organizations", async (req, res) => {
    try {
      const allOrganizations = await prisma.organizations.findMany();
      res.json(allOrganizations);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/organizations/:id", async (req, res) => {
    try {
      const organization = await prisma.organizations.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(organization);
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
        res.status(500).send({ error: e });
      }
    }
  );

  app.post("/organizations", authMiddleware, async (req: any, res) => {
    const validation = organizationValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const curentUser = await prisma.members.findUnique({
      where: {
        id: Number(req.payload.userId),
      },
    });

    if (!curentUser) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const organizationRequest = validation.value;
    try {
      const organization = await prisma.organizations.create({
        data: {
          name: organizationRequest.name,
          type: organizationRequest.type,
          address: organizationRequest.address,
          email: organizationRequest.email,
          phone: organizationRequest.phone,
          ownerId: curentUser.id,
        },
      });
      res.json(organization);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch(
    "/organizations/:id",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      const validation = organizationPatchValidation.validate(req.body);

      if (validation.error) {
        res.status(400).json({ error: validation.error });
        return;
      }

      const organizationRequest = validation.value;
      try {
        const organization = await prisma.organizations.update({
          where: {
            id: Number(req.params.id),
          },
          data: organizationRequest,
        });
        res.json(organization);
      } catch (e) {
        res.status(500).json({ error: e });
        return;
      }
    }
  );

  app.delete(
    "/organizations/:id",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      try {
        const deletedOrganization = await prisma.organizations.delete({
          where: { id: Number(req.params.id) },
        });
        res.status(200).json(deletedOrganization);
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }
  );
};

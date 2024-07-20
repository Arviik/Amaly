import express from "express";
import { prisma } from "../../utils/prisma";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";
import {
  organizationPatchValidation,
  organizationValidation,
} from "../validators/organization-validator";

export const initOrganizations = (app: express.Express) => {
  app.get(
    "/organizations",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      try {
        const allOrganizations = await prisma.organizations.findMany();
        res.json(allOrganizations);
      } catch (e) {
        res.status(500).send({ error: e });
        return;
      }
    }
  );

  app.get("/organizations/:id", async (req, res) => {
    try {
      const organization = await prisma.organizations.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          documents: {
            select: {
              id: true,
              title: true,
              description: true,
              path: true,
              createdAt: true,
            },
          },
          ags: {
            select: {
              title: true,
              type: true,
              date: true,
            },
          },
          members: {
            select: {
              role: true,
              isAdmin: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          membershipTypes: {
            select: {
              id: true,
              name: true,
              description: true,
              amount: true,
              duration: true,
            },
          },
        },
      });
      res.json(organization);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  //get all members of an organization
  app.get(
    "/organizations/:organizationId/members",
    authMiddleware,
    async (req, res) => {
      try {
        const members = await prisma.members.findMany({
          where: { organizationId: Number(req.params.organizationId) },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
        res.json(members);
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }
  );

  app.post(
    "/organizations",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      const validation = organizationValidation.validate(req.body);

      if (validation.error) {
        res.status(400).send({ error: validation.error });
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
            ownerId: organizationRequest.ownerId,
          },
        });
        res.json(organization);
      } catch (e) {
        res.status(500).send({ error: e });
        return;
      }
    }
  );

  app.patch(
    "/organizations/:id",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      const validation = organizationPatchValidation.validate(req.body);

      if (validation.error) {
        console.log("error validation", validation.error);

        res.status(400).send({ error: validation.error });

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
        console.log("error e", e);
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

  app.post(
    "/organization/:organizationId/join",
    authMiddleware,
    async (req, res) => {}
  );
};

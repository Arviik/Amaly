import express from "express";
import { prisma } from "../../utils/prisma";
import {
    agsValidation,
    agsPatchValidation,
} from "../validators/ag-validator";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";

export const initAGS = (app: express.Express) => {
    app.get("/ags", async (req, res) => {
        try {
            const allAGS = await prisma.ags.findMany();
            res.json(allAGS);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/ags/:id", async (req, res) => {
        try {
            const ags = await prisma.ags.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.json(ags);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/ags", async (req, res) => {
        const validation = agsValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const agsRequest = validation.value;
        try {
            const ags = await prisma.ags.create({
                data: {
                    title: agsRequest.title,
                    description: agsRequest.description,
                    date: new Date(agsRequest.date),
                    type: agsRequest.type,
                    quorum: agsRequest.quorum,
                    organizationId: agsRequest.organizationId,
                },
            });
            res.json(ags);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/ags/:id", async (req, res) => {
        const validation = agsPatchValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const agsRequest = validation.value;
        try {
            const ags = await prisma.ags.update({
                where: {
                    id: Number(req.params.id),
                },
                data: agsRequest,
            });
            res.json(ags);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/ags/:id", async (req, res) => {
        try {
            const deletedAGS = await prisma.ags.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json(deletedAGS);
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};

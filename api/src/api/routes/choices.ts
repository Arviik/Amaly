import express from "express";
import { prisma } from "../../utils/prisma";
import { choicesValidation, choicesPatchValidation } from "../validators/choice-validator";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";
import {number} from "joi";

export const initChoices = (app: express.Express) => {
    app.get("/choices", async (req, res) => {
        try {
            let request: {poll_id: number|undefined} = {
                poll_id: undefined
            };
            if (req.query.poll_id){
                request.poll_id = Number(req.query.poll_id)
            }
            const allChoices = await prisma.choices.findMany({
                where: {
                    pollId: request.poll_id
                },
                include: {
                    Votes: true
                }
            });

            res.json(allChoices);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/choices/:id", async (req, res) => {
        try {
            const choice = await prisma.choices.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.json(choice);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/choices", async (req, res) => {
        const validation = choicesValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const choicesRequest = validation.value;
        try {
            const choice = await prisma.choices.create({
                data: {
                    choice: choicesRequest.choice,
                    pollId: choicesRequest.pollId,
                },
            });
            res.json(choice);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/choices/:id", async (req, res) => {
        const validation = choicesPatchValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const choicesRequest = validation.value;
        try {
            const choice = await prisma.choices.update({
                where: {
                    id: Number(req.params.id),
                },
                data: choicesRequest,
            });
            res.json(choice);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/choices/:id", async (req, res) => {
        try {
            const deletedChoice = await prisma.choices.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json(deletedChoice);
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};

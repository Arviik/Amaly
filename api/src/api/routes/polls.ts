import express from "express";
import { prisma } from "../../utils/prisma";
import {pollsPatchValidation, fullPollsValidation} from "../validators/poll-validator";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";

export const initPolls = (app: express.Express) => {
    app.get("/polls", async (req, res) => {
        try {
            const allPolls: any[] = await prisma.polls.findMany({});
            for (const poll of allPolls) {
                poll.choices = await prisma.choices.findMany({
                    where: {
                        pollId: poll.id
                    },
                    select:{
                        id: true,
                        choice: true
                    }
                })
            }
            res.json(allPolls);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/polls/:id", async (req, res) => {
        try {
            const poll = await prisma.polls.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.json(poll);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/polls", async (req, res) => {
        const validation = fullPollsValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const pollsRequest = validation.value;
        try {
            const poll = await prisma.polls.create({
                data: {
                    text: pollsRequest.text,
                    agId: pollsRequest.agId,
                    usersId: pollsRequest.usersId
                },
            });
            const choices: any[] = [];
            for (const choice of pollsRequest.choices) {
                const createdChoice = await prisma.choices.create({
                    data: {
                        pollId: poll.id,
                        choice: choice,
                    }
                });
                choices.push(createdChoice);
            }
            res.json({poll: poll, choices: choices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/polls/:id", async (req, res) => {
        const validation = pollsPatchValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const pollsRequest = validation.value;
        try {
            const poll = await prisma.polls.update({
                where: {
                    id: Number(req.params.id),
                },
                data: pollsRequest,
            });
            res.json(poll);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/polls/:id", async (req, res) => {
        try {
            const deletedPoll = await prisma.polls.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json(deletedPoll);
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};

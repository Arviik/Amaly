import express from "express";
import OpenAI from "openai";
import {
    continueConversationValidator,
    newConversationValidator
} from "../validators/openai-validator";
import {prisma} from "../../utils/prisma";

const openai = new OpenAI()

const assistant_id = String(process.env.ASST_ID)

export const initAI = (app: express.Express) => {

    app.post('/chatbot/open', async (req, res) => {
        try {
            const validation = newConversationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).send({error: validation.error})
                return;
            }

            console.log(validation)
            const conversation = validation.value.messages
            const organization = await prisma.organizations.findUnique({
                where: {
                    id: validation.value.organizationId
                }
            })
            if (!organization){
                res.json(400).send({error: validation.error})
                return;
            }
            const thread = await openai.beta.threads.create({
                messages: conversation
            })
            console.log(`${organization}`)
            const run = await openai.beta.threads.runs.createAndPoll(thread.id,
                {
                    assistant_id: assistant_id,
                    instructions: "essaye de repondre à la requete de l'utilisateur avec les données suivantes : " +
                        `${JSON.stringify(organization)}`,
                }
            )
            let messages;
            if (run.status === 'completed') {
                messages = await openai.beta.threads.messages.list(
                    run.thread_id
                );
            } else {
                console.log(run.status);
            }
            res.status(200).json({response: organization, conversation: conversation, thread: thread, messages: messages});
        } catch (err) {
            res.status(500).send({error: err});
        }
    })

    app.post('/chatbot/continue', async (req, res) => {
        try {
            const validation = continueConversationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).send({error: validation.error})
                return;
            }

            console.log(validation)
            const conversation = validation.value.messages
            const message = await openai.beta.threads.messages.create(validation.value.threadId,conversation)
            const run = await openai.beta.threads.runs.createAndPoll(validation.value.threadId,
                {
                    assistant_id: assistant_id,
                    instructions: "repondre à la requete de l'utilisateur"
                }
            )
            let messages;
            if (run.status === 'completed') {
                messages = await openai.beta.threads.messages.list(
                    run.thread_id
                );
            } else {
                console.log(run.status);
            }
            res.status(200).json({conversation: conversation, messages: messages});
        } catch (err) {
            res.status(500).send({error: err});
        }
    })
}
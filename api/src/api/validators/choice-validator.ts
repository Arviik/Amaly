import Joi from "joi";

export interface choicesRequest {
    choice: string;
    pollId: number;
}

export const choicesValidation = Joi.object<choicesRequest>({
    choice: Joi.string().required(),
    pollId: Joi.number().required(),
}).options({ abortEarly: true });

export const choicesPatchValidation = Joi.object<choicesRequest>({
    choice: Joi.string().required(),
    pollId: Joi.number().required(),
}).options({ abortEarly: true });

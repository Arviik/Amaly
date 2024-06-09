import Joi from "joi";

export interface pollsRequest {
    text: string;
    agId: number;
    usersId?: number;
}

export interface fullPollsRequest {
    text: string;
    agId: number;
    usersId?: number;
    choices: string[];
    modality: "ONE"|"TWO";
}


export const fullPollsValidation = Joi.object<fullPollsRequest>({
    text: Joi.string().required(),
    agId: Joi.number().required(),
    usersId: Joi.number().optional(),
    choices: Joi.array().items(Joi.string()),
    modality: Joi.string().required().valid("ONE","TWO")
}).options({ abortEarly: true });

export const pollsPatchValidation = Joi.object<pollsRequest>({
    text: Joi.string().required(),
    agId: Joi.number().required(),
    usersId: Joi.number().optional(),
}).options({ abortEarly: true });

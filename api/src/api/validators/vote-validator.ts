import Joi from "joi";

export interface votesRequest {
    userId: number;
    choiceId: number;
}

export const votesValidation = Joi.object<votesRequest>({
    userId: Joi.number().required(),
    choiceId: Joi.number().required(),
}).options({ abortEarly: true });

export const votesPatchValidation = Joi.object<votesRequest>({
    userId: Joi.number().required(),
    choiceId: Joi.number().required(),
}).options({ abortEarly: true });

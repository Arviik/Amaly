import Joi from "joi";

export interface documentsRequest {
    title: string;
    description: string;
    fileData: Buffer;
    organizationId: number;
}

export const documentsValidation = Joi.object<documentsRequest>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    fileData: Joi.binary().required(),
    organizationId: Joi.number().required(),
}).options({ abortEarly: true });

export const documentsPatchValidation = Joi.object<documentsRequest>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    fileData: Joi.binary().required(),
    organizationId: Joi.number().required(),
}).options({ abortEarly: true });

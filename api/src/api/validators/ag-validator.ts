import Joi from "joi";
import {AGType} from "@prisma/client";

export interface agsRequest {
    title: string;
    description: string;
    date: Date;
    type: AGType;
    quorum: number;
    organizationId: number;
}

export const agsValidation = Joi.object<agsRequest>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    type: Joi.string().required().valid('ORDINARY','EXTRAORDINARY'),
    quorum: Joi.number().integer().required(),
    organizationId: Joi.number().integer().required(),
}).options({abortEarly: true});

export const agsPatchValidation = Joi.object<agsRequest>({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    date: Joi.date().optional(),
    type: Joi.string().optional().valid('ORDINARY','EXTRAORDINARY'),
    quorum: Joi.number().integer().optional(),
    organizationId: Joi.number().integer().optional(),
}).options({abortEarly: true});


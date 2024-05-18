import Joi from "joi";
import {Role} from "@prisma/client";

export interface organizationRequest {
    name: string;
    type: string;
    address: string;
    phone: string;
    email: string;
}

export const organizationValidation = Joi.object<organizationRequest>({
    name: Joi.string().required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required()
}).options({abortEarly: true})

export const organizationPatchValidation = Joi.object<organizationRequest>({
    name: Joi.string().required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required()
}).options({abortEarly: true})
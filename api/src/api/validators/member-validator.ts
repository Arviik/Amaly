import Joi from "joi";
export interface memberRequest {
    name: string;
    type: string;
    address: string;
    phone: string;
    email: string;
    membership_date: Date;
    organizationId: number;
    userId: number;
}

export const memberValidation = Joi.object<memberRequest>({
    name: Joi.string().required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    membership_date: Joi.date().default(new Date()),
    organizationId: Joi.number().required(),
    userId: Joi.number().required()
}).options({abortEarly: true});

export const memberPatchValidation = Joi.object<memberRequest>({
    name: Joi.string().required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
}).options({abortEarly: true});
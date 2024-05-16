import Joi from "joi";
import {Role} from "@prisma/client";

export interface userRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    balance: number;
}

export const userValidation = Joi.object<userRequest>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('USER','ADMIN','SUPER_ADMIN'),
    balance: Joi.number()
}).options({abortEarly: true})

export const userPatchValidation = Joi.object<userRequest>({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    balance: Joi.number(),
    role: Joi.string().valid('USER','ADMIN','SUPER_ADMIN')
}).options({abortEarly: true})
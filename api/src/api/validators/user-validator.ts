import Joi from "joi";
import { Role } from "@prisma/client";

export interface userRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: Role;
}

export const userValidation = Joi.object<userRequest>({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("USER", "ADMIN", "SUPER_ADMIN").required(),
}).options({ abortEarly: true });

export const userPatchValidation = Joi.object<Partial<userRequest>>({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  role: Joi.string().valid("USER", "ADMIN", "SUPER_ADMIN"),
}).options({ abortEarly: true });

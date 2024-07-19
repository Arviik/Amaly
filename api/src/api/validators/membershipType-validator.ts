import Joi from "joi";

export interface MembershipTypeRequest {
  name: string;
  description?: string;
  duration: number;
  fee: number;
  organizationId: number;
}

export const membershipTypeValidation = Joi.object<MembershipTypeRequest>({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  duration: Joi.number().integer().min(1).required(),
  fee: Joi.number().min(0).required(),
  organizationId: Joi.number().integer().required(),
}).options({ abortEarly: true });

export const membershipTypePatchValidation = Joi.object<
  Partial<MembershipTypeRequest>
>({
  name: Joi.string(),
  description: Joi.string(),
  duration: Joi.number().integer().min(1),
  fee: Joi.number().min(0),
}).options({ abortEarly: true });

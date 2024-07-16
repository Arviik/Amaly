import Joi from "joi";

export interface MemberRequest {
  role: string;
  isAdmin: boolean;
  startDate: Date;
  endDate?: Date;
  userId: number;
  organizationId: number;
  employmentType?: string;
}

export const memberValidation = Joi.object<MemberRequest>({
  role: Joi.string().default("member"),
  isAdmin: Joi.boolean().default(false),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().greater(Joi.ref("startDate")),
  userId: Joi.number().integer().required(),
  organizationId: Joi.number().integer().required(),
  employmentType: Joi.string().optional(),
}).options({ abortEarly: true });

export const memberPatchValidation = Joi.object<Partial<MemberRequest>>({
  role: Joi.string(),
  isAdmin: Joi.boolean(),
  endDate: Joi.date().greater(Joi.ref("startDate")),
  employmentType: Joi.string(),
}).options({ abortEarly: true });

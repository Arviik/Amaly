import Joi from "joi";

export interface memberRequest {
  membershipType: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  employmentType?: string;
  organizationId: number;
  userId: number;
}

export const memberValidation = Joi.object<memberRequest>({
  membershipType: Joi.string().required(),
  status: Joi.string().required(),
  startDate: Joi.date().default(new Date()),
  endDate: Joi.date(),
  employmentType: Joi.string().default("NULL"),
  organizationId: Joi.number().required(),
  userId: Joi.number().required(),
}).options({ abortEarly: true });

export const memberPatchValidation = Joi.object<Partial<memberRequest>>({
  membershipType: Joi.string(),
  status: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  employmentType: Joi.string(),
}).options({ abortEarly: true });

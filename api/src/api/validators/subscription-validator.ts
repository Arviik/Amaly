import Joi from "joi";

export interface subscriptionRequest {
  memberId: number;
  membershipTypeId: number;
  startDate: string;
  endDate: string;
  PaymentStatus: PaymentStatus;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export const subscriptionCreateValidator = Joi.object({
  memberId: Joi.number().required(),
  membershipTypeId: Joi.number().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  PaymentStatus: Joi.string()
    .required()
    .valid(...Object.values(PaymentStatus)),
});

export const subscriptionUpdateValidator = Joi.object({
  memberId: Joi.number().required(),
  membershipTypeId: Joi.number().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  PaymentStatus: Joi.string()
    .required()
    .valid(...Object.values(PaymentStatus)),
});

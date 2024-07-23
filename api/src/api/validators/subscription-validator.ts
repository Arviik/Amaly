import Joi from "joi";

export interface SubscriptionRequest {
  amount: number;
  paymentDate?: Date;
  startDate: Date;
  endDate: Date;
  isPaid: boolean;
  membershipId: number;
}

export const subscriptionValidation = Joi.object<SubscriptionRequest>({
  amount: Joi.number().min(0).required(),
  paymentDate: Joi.date(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  isPaid: Joi.boolean().default(false),
  membershipId: Joi.number().integer().required(),
}).options({ abortEarly: true });

export const subscriptionPatchValidation = Joi.object<
  Partial<SubscriptionRequest>
>({
  amount: Joi.number().min(0),
  paymentDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref("startDate")),
  isPaid: Joi.boolean(),
}).options({ abortEarly: true });

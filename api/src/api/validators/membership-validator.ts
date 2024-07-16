import Joi from "joi";

export interface MembershipRequest {
  status: string;
  startDate: Date;
  endDate?: Date;
  memberId: number;
  membershipTypeId: number;
}

export const membershipValidation = Joi.object<MembershipRequest>({
  status: Joi.string().valid("volunteer", "adherent").required(),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().greater(Joi.ref("startDate")),
  memberId: Joi.number().integer().required(),
  membershipTypeId: Joi.number().integer().required(),
}).options({ abortEarly: true });

export const membershipPatchValidation = Joi.object<Partial<MembershipRequest>>(
  {
    status: Joi.string().valid("volunteer", "adherent"),
    endDate: Joi.date().greater(Joi.ref("startDate")),
    membershipTypeId: Joi.number().integer(),
  }
).options({ abortEarly: true });

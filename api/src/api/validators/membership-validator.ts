import Joi from "joi";

export interface MembershipRequest {
  status: string;
  startDate: Date;
  endDate: Date;
  memberId: number;
  membershipTypeId: number;
}

export const membershipValidation = Joi.object<MembershipRequest>({
  status: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  memberId: Joi.number().integer().required(),
  membershipTypeId: Joi.number().integer().required(),
}).options({ abortEarly: true });

export const membershipPatchValidation = Joi.object<Partial<MembershipRequest>>(
  {
    status: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref("startDate")),
  }
);

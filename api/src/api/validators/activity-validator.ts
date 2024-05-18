import Joi from 'joi';

export interface ActivityRequest {
    title: string;
    description: string;
    date: Date;
    organizationId?: number;
}

export const activityValidation = Joi.object<ActivityRequest>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    organizationId: Joi.number().optional()
}).options({abortEarly: true});

export const activityPatchValidation = Joi.object<ActivityRequest>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    organizationId: Joi.number().optional()
}).options({abortEarly: true});

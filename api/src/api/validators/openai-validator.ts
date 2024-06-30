import Joi from "joi";

interface newConversationRequest{
    messages: message[],
    organizationId: number
}

interface message{
    role: role;
    content: string;
}

enum role{
    user="user",assistant="assistant"
}
const messageJoi = Joi.object().keys({
    role: Joi.string().valid('user','system').required(),
    content: Joi.string().required()
})

export const newConversationValidator = Joi.object<newConversationRequest>({
    messages: Joi.array().items(messageJoi).required(),
    organizationId: Joi.number().required(),
}).options({abortEarly: true})

interface continueConversationRequest{
    messages: message,
    threadId: string,
    assistantId: string
}

export const continueConversationValidator = Joi.object<continueConversationRequest>({
    messages: Joi.object().required(),
    threadId: Joi.string().required()
}).options({abortEarly: true})
import {api} from "@/api/config";

export interface startThreadResponse{
    response: string,
    threadId: string
}

export const startThread = async (message: string, organizationId: number): Promise<startThreadResponse> => {
    return await api.post('chatbot/open', {
        json: {
            message: message,
            organizationId: organizationId,
        }
    }).json();
}

export interface continueThreadResponse{
    response: string,
    threadId: string
}

export const continueThread = async (message: string, threadId: string): Promise<startThreadResponse>  => {
    return await api.post('chatbot/continue', {
        json: {
            message: message,
            threadId: threadId,
        }
    }).json();
}
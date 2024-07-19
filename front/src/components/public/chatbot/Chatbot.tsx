"use client";
import {useCallback, useEffect, useRef, useState} from "react";
import { startThread, continueThread } from "@/api/services/chatbot";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import Message from "@/components/public/chatbot/Message";

export interface ChatMessage{
    sender: ChatSender,
    message: string;
}

export enum ChatSender {
    member = "member",
    chatgpt = "chatgpt",
    system = "system",
    loading = "loading"
}

const Chatbot = () => {
    const [threadId, setThreadId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([{sender: ChatSender.system, message: "La conversation à été ouverte"}]);
    const inputRef = useRef<HTMLInputElement>(null);
    const member = useSelector(selectCurrentMember);

    const handleSend = async () => {
        if (!member || !inputRef.current?.value) return;
        const message = inputRef.current?.value;
        setLoading(true);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: ChatSender.member, message: message }
        ]);
        let response;
        if (threadId){
             response = await continueThread(message, threadId);
        }else{
            const organizationId = member.organizationId
            response = await startThread(message, organizationId);
            setThreadId(response.threadId)
        }
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: ChatSender.chatgpt, message: response.response }
        ]);
        setLoading(false);
    }

    useEffect(() => {
        console.log(messages)
    }, [messages]);

    const [canSend, setCanSend] = useState(false);

    const checkCanSend = () => {
        if (inputRef.current?.value.trim()) {
            return setCanSend(true);
        }
        return setCanSend(false);
    }

    return (
        <div className="fixed bottom-0 right-36 z-20 bg-white ">
            <div className="bg-primary text-white font-bold text-2xl px-2 py-1 rounded-t-xl">
                ASSISTANT AMALY
            </div>
            <div className="h-56">
                {messages.map((message: ChatMessage, index: number) => (<Message key={index} sender={message.sender} message={message.message} />))}
                {loading ? <Message sender={ChatSender.loading} message={""}></Message> : null}
            </div>
            <div className="border">
                <input ref={inputRef} onChange={checkCanSend} disabled={loading} className="border rounded-xl mx-2 my-1"/>
                <button onClick={handleSend} disabled={!canSend || loading}>SEND</button>
            </div>
        </div>
    )
}

export default Chatbot
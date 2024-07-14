import {ChatSender} from "@/components/public/chatbot/Chatbot";

interface MessageProps {
    sender: ChatSender,
    message: string,
}

const Message = ({sender, message}: MessageProps) => {


    return (
        <div>
            {(() => {
                switch (sender) {
                    case ChatSender.chatgpt:
                        return <div className="rounded bg-green-400 text-white left-0 p-2 relative ">{message}</div>;
                    case ChatSender.member:
                        return <div className="rounded bg-gray-400 text-black right-0 p-2 relative">{message}</div>;
                    case ChatSender.system:
                        return <div className="text-center text-sm ">{message}</div>;
                    case ChatSender.loading:
                        return <div className="rounded bg-green-400 text-white left-0 p-2 relative ">...</div>
                }
            })()}
        </div>
    )
}

export default Message
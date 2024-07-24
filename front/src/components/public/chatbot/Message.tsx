import { ChatSender } from "@/components/public/chatbot/Chatbot";

interface MessageProps {
  sender: ChatSender;
  message: string;
}

const Message = ({
  sender,
  message,
}: {
  sender: ChatSender;
  message: string;
}) => {
  const getMessageStyle = () => {
    switch (sender) {
      case ChatSender.chatgpt:
        return "bg-green-100 text-green-800 rounded-br-none";
      case ChatSender.member:
        return "bg-blue-100 text-blue-800 rounded-bl-none ml-auto";
      case ChatSender.system:
        return "bg-gray-100 text-gray-800 text-center";
      case ChatSender.loading:
        return "bg-green-100 text-green-800 rounded-br-none animate-pulse";
    }
  };

  return (
    <div className={`max-w-[75%] p-2 rounded-lg mb-2 ${getMessageStyle()}`}>
      {sender === ChatSender.loading ? (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
        </div>
      ) : (
        message
      )}
    </div>
  );
};

export default Message;

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { startThread, continueThread } from "@/api/services/chatbot";
import { useSelector } from "react-redux";
import { selectCurrentMember } from "@/app/store/slices/authSlice";
import { IoMdSend, IoMdClose } from "react-icons/io";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import Message from "./Message";

export interface ChatMessage {
  sender: ChatSender;
  message: string;
}

export enum ChatSender {
  member = "member",
  chatgpt = "chatgpt",
  system = "system",
  loading = "loading",
}

const Chatbot = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: ChatSender.system, message: "La conversation a été ouverte" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const member = useSelector(selectCurrentMember);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!member || !inputMessage.trim()) return;
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: ChatSender.member, message: inputMessage },
    ]);
    let response;
    if (threadId) {
      response = await continueThread(inputMessage, threadId);
    } else {
      const organizationId = member.organizationId;
      response = await startThread(inputMessage, organizationId);
      setThreadId(response.threadId);
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: ChatSender.chatgpt, message: response.response },
    ]);
    setLoading(false);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`fixed bottom-4 right-4 z-20 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? "w-96 h-[32rem]" : "w-72 h-96"
      }`}
    >
      <div className="bg-primary text-white font-bold text-xl px-4 py-2 rounded-t-lg flex justify-between items-center">
        <span>ASSISTANT AMALY</span>
        <button onClick={toggleExpand} className="focus:outline-none">
          {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>
      <div
        className={`h-[calc(100%-6rem)] overflow-y-auto p-4 ${
          isExpanded ? "text-base" : "text-sm"
        }`}
      >
        {messages.map((message: ChatMessage, index: number) => (
          <Message
            key={index}
            sender={message.sender}
            message={message.message}
          />
        ))}
        {loading && <Message sender={ChatSender.loading} message="" />}
        <div ref={messagesEndRef} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-100 rounded-b-lg">
        <div className="flex items-center">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            placeholder="Tapez votre message..."
            className="flex-grow px-3 py-2 rounded-l-full border-2 border-primary focus:outline-none focus:border-primary-dark"
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || loading}
            className="bg-primary text-white rounded-r-full px-4 py-2 ml-1 focus:outline-none hover:bg-primary-dark transition duration-300 ease-in-out"
          >
            <IoMdSend />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chatbot;

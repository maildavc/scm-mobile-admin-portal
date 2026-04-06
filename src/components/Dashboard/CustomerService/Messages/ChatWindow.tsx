import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiArrowUp } from "react-icons/fi";
import { useConversationMessages, useSendMessage } from "@/hooks/useCustomerSupport";
import { formatDateToMMMdyyyy, formatTimeTohmma } from "@/utils/dateFormatter";

interface ChatWindowProps {
  selectedChatId: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChatId }) => {
  const [message, setMessage] = useState("");
  const { data, isLoading } = useConversationMessages(selectedChatId);
  const sendMessageMutation = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  if (!selectedChatId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-100 p-6 text-center">
        <p className="text-gray-500">Select a conversation to view messages</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-gray-500 animate-pulse">Loading messages...</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!message.trim() || !selectedChatId) return;
    sendMessageMutation.mutate(
      { conversationId: selectedChatId, message: message.trim() },
      {
        onSuccess: () => {
          setMessage("");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const conversation = data?.conversation;
  const messages = data?.messages || [];

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white">
            <FiUser className="text-gray-400" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2F3140]">
              {conversation?.customerName || "Customer"}
            </h3>
            <p className="text-xs text-gray-500">{conversation?.status || conversation?.priority || "Tier User"}</p>
          </div>
        </div>
        <button className="bg-[#B2171E] text-white text-xs font-semibold px-3 md:px-4 py-2 rounded-full hover:bg-[#901318] transition-colors">
          <span className="hidden sm:inline">View Profile</span>
          <span className="sm:hidden">View</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-white flex flex-col gap-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            No messages in this conversation yet.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderType === "Admin" || msg.senderType === "Support";
            const showDate = index === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
            
            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center mb-2">
                    <div className="px-4 bg-white text-xs font-semibold text-gray-400">
                      {formatDateToMMMdyyyy(msg.createdAt)}
                    </div>
                  </div>
                )}
                
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%]">
                    <div className={`${isMe ? "bg-[#F2F4F7]" : "bg-white border border-gray-100"} p-4 rounded-xl text-sm text-[#2F3140] mb-1 leading-relaxed`}>
                      {msg.message}
                    </div>
                    <div className={`text-[10px] text-gray-400 ${isMe ? "text-right" : "text-left"}`}>
                      {formatTimeTohmma(msg.createdAt)}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-gray-50">
        <div className="flex items-center gap-2 md:gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessageMutation.isPending}
            placeholder="Enter message..."
            className="flex-1 px-4 md:px-5 py-3 md:py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#B2171E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="p-1 h-full aspect-square bg-[#B2171E] rounded-lg text-white flex items-center justify-center transition-colors hover:bg-[#901318] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiArrowUp size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

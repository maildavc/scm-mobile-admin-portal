import React from "react";
import { FiUser } from "react-icons/fi";
import { SupportConversation } from "@/services/customerSupportService";
import { formatDateToMMMdyyyy } from "@/utils/dateFormatter";

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  chats: SupportConversation[];
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onSelectChat, chats, isLoading }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#EDEFF2] rounded-xl overflow-hidden">
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar pt-4">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading conversations...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No conversations found.</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 cursor-pointer transition-all ${
                selectedChatId === chat.id
                  ? "bg-white rounded-xl mb-2"
                  : "mb-1 border-b border-[#96989A] last:border-0 hover:bg-white/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                    selectedChatId === chat.id ? "bg-white border-[#D6D6D6]" : "bg-white border-[#D6D6D6]"
                  }`}
                >
                  <FiUser className="text-gray-400" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`font-semibold text-base truncate ${
                        selectedChatId === chat.id ? "text-[#17181A]" : "text-[#17181A]"
                      }`}
                    >
                      {chat.customerName || "Unknown"}
                    </h3>
                    <span className="text-[10px] text-[#666666] shrink-0 ml-2">
                      {chat.lastMessageAt ? formatDateToMMMdyyyy(chat.lastMessageAt) : ""}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate leading-relaxed ${
                      selectedChatId === chat.id ? "text-[#17181A]" : "text-[#666666]"
                    }`}
                  >
                    {chat.subject}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;

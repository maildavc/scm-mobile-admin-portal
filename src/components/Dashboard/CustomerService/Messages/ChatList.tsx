import React from "react";
import { FiUser } from "react-icons/fi";

const MOCK_CHATS = [
  {
    id: 1,
    name: "Chidebere",
    message: "We have been able to locate the user who took over 250K and did not want to return the ...",
    date: "Tue, Mar 10, 2025",
    userType: "Tier 2 User",
  },
  {
    id: 2,
    name: "Adebayo Johnson",
    message: "Hello, I need help with my account verification process. Can you assist?",
    date: "Wed, Mar 11, 2025",
    userType: "Tier 1 User",
  },
  {
    id: 3,
    name: "Ngozi Okafor",
    message: "My transaction has been pending for 3 days now. What's going on?",
    date: "Wed, Mar 11, 2025",
    userType: "Tier 3 User",
  },
  {
    id: 4,
    name: "Emmanuel Adekunle",
    message: "Thank you for resolving my issue quickly. Appreciate the support!",
    date: "Thu, Mar 12, 2025",
    userType: "Tier 2 User",
  },
  {
    id: 5,
    name: "Fatima Bello",
    message: "I can't login to my account. Getting an error message every time.",
    date: "Thu, Mar 12, 2025",
    userType: "Tier 1 User",
  },
  {
    id: 6,
    name: "Oluwaseun Davies",
    message: "Is there a way to increase my transaction limit?",
    date: "Fri, Mar 13, 2025",
    userType: "Tier 2 User",
  },
  {
    id: 7,
    name: "Chiamaka Eze",
    message: "I received a notification about suspicious activity on my account...",
    date: "Fri, Mar 13, 2025",
    userType: "Tier 3 User",
  },
  {
    id: 8,
    name: "Ibrahim Musa",
    message: "How long does KYC verification usually take?",
    date: "Sat, Mar 14, 2025",
    userType: "Tier 1 User",
  },
  {
    id: 9,
    name: "Blessing Okonkwo",
    message: "The app keeps crashing when I try to make a payment. Please help.",
    date: "Sat, Mar 14, 2025",
    userType: "Tier 2 User",
  },
  {
    id: 10,
    name: "Yusuf Abdullahi",
    message: "I want to update my phone number but can't find the option.",
    date: "Sun, Mar 15, 2025",
    userType: "Tier 1 User",
  },
];

interface ChatListProps {
  selectedChatId: number;
  onSelectChat: (id: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onSelectChat }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#EDEFF2] rounded-xl overflow-hidden">
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar pt-4">
        {MOCK_CHATS.map((chat, index) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 cursor-pointer transition-all ${
              selectedChatId === chat.id
                ? "bg-white rounded-xl mb-2"
                : "mb-1 border-b border-[#96989A] last:border-0"
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
                    className={`font-semibold text-base ${
                      selectedChatId === chat.id ? "text-[#17181A]" : "text-[#17181A]"
                    }`}
                  >
                    {chat.name}
                  </h3>
                  <span className="text-[10px] text-[#666666]">
                    {chat.date}
                  </span>
                </div>
                <p
                  className={`text-sm line-clamp-2 leading-relaxed ${
                    selectedChatId === chat.id ? "text-[#17181A]" : "text-[#666666]"
                  }`}
                >
                  {chat.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

import React from "react";
import { FiUser, FiArrowUp } from "react-icons/fi";

const MOCK_CHATS = [
  {
    id: 1,
    name: "Chidebere",
    userType: "Tier 2 User",
  },
  {
    id: 2,
    name: "Adebayo Johnson",
    userType: "Tier 1 User",
  },
  {
    id: 3,
    name: "Ngozi Okafor",
    userType: "Tier 3 User",
  },
  {
    id: 4,
    name: "Emmanuel Adekunle",
    userType: "Tier 2 User",
  },
  {
    id: 5,
    name: "Fatima Bello",
    userType: "Tier 1 User",
  },
  {
    id: 6,
    name: "Oluwaseun Davies",
    userType: "Tier 2 User",
  },
  {
    id: 7,
    name: "Chiamaka Eze",
    userType: "Tier 3 User",
  },
  {
    id: 8,
    name: "Ibrahim Musa",
    userType: "Tier 1 User",
  },
  {
    id: 9,
    name: "Blessing Okonkwo",
    userType: "Tier 2 User",
  },
  {
    id: 10,
    name: "Yusuf Abdullahi",
    userType: "Tier 1 User",
  },
];

interface ChatWindowProps {
  selectedChatId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChatId }) => {
  const selectedChat =
    MOCK_CHATS.find((chat) => chat.id === selectedChatId) || MOCK_CHATS[0];
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white">
            <FiUser className="text-gray-400" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2F3140]">
              {selectedChat.name}
            </h3>
            <p className="text-xs text-gray-500">{selectedChat.userType}</p>
          </div>
        </div>
        <button className="bg-[#B2171E] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#901318] transition-colors">
          View Profile
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        {/* Date Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="px-4 bg-white text-xs font-semibold text-gray-800">
            Mar 12, 2025
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-6">
          {/* Incoming Message (Right/User?) - Wait layout: 
               Screenshot: "How far the 250K guy" is Right aligned, Grey Bubble.
               "We have been able to..." is Left aligned, White Bubble.
          */}

          <div className="flex justify-end mb-4">
            <div className="max-w-[70%]">
              <div className="bg-[#F2F4F7] p-4 rounded-xl text-sm text-[#2F3140] mb-1">
                How far the 250K guy
              </div>
              <div className="text-[10px] text-gray-400 text-right">
                12:32PM
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[70%]">
              <div className="bg-white border border-gray-100 p-4 rounded-xl text-sm text-[#2F3140] mb-1">
                We have been able to locate the user who took over 250K and did
                not want to return the money has finally brought it back. Just
                wanted to tell you
              </div>
              <div className="text-[10px] text-gray-400">12:32PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter message"
            className="flex-1 px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
          />
          <div className="bg-[#B2171E] rounded-lg p-1 text-white flex items-center justify-center hover:bg-[#901318] transition-colors cursor-pointer shrink-0">
            <FiArrowUp size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

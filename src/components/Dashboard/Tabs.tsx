import React from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div
      className={`flex gap-4 overflow-x-auto pb-2 scrollbar-hide ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-colors cursor-pointer border whitespace-nowrap ${
            activeTab === tab
              ? "bg-[#FDE4E5] text-[#B2171E] border-[#FFC6C5]"
              : "bg-white text-[#2F3140] border-[#7077813D]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;

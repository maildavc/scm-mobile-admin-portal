"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import ProfileModal from "@/components/Dashboard/ProfileModal";
import { PiChatCircleBold } from "react-icons/pi";
import { DASHBOARD_CARDS } from "@/constants/dashboard";
import { useAuthStore } from "@/stores/authStore";

export default function Dashboard() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const displayName = user ? `${user.firstName}` : "Back";

  return (
    <>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <main className="flex-1 p-8 max-w-400 mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#2F3140]">Dashboard</h1>
          <p className="text-[#707781] mt-1">Welcome {displayName} !</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {DASHBOARD_CARDS.map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              path={card.path}
            />
          ))}
        </div>

        {/* Footer Info Area */}
        <div className="pt-8 pb-4 flex flex-col gap-2">
          <h3 className="font-bold text-[#2F3140]">Dashboard</h3>
          <div className="flex items-center gap-2 text-sm text-[#707781]">
            <span suppressHydrationWarning>Last Login: {currentDate}</span>
            <span>•</span>
            <button
              className="text-[#B2171E] font-medium cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
            >
              Manage Profile
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="relative w-14 h-14 bg-[#B2171E] rounded-full flex items-center justify-center text-white shadow-lg">
          <PiChatCircleBold size={28} />
          <span className="absolute -top-1 -right-1 bg-[#FDE4E5] text-[#B2171E] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#FFC6C5]">
            1
          </span>
        </button>
      </div>
    </>
  );
}

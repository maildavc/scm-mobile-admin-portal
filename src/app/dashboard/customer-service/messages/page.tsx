"use client";

import React, { useState } from "react";
import PageHeader from "@/components/Dashboard/PageHeader";
import { SidebarProvider } from "@/components/Dashboard/Sidebar";
import ChatList from "@/components/Dashboard/CustomerService/Messages/ChatList";
import ChatWindow from "@/components/Dashboard/CustomerService/Messages/ChatWindow";
import { FiSearch } from "react-icons/fi";

export default function Messages() {
  const [selectedChatId, setSelectedChatId] = useState(1);

  return (
    <SidebarProvider>
      <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader
          title="Customer Support"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Customer Support", href: "/dashboard/customer-service" },
            { label: "Aremu Babalola", active: true },
          ]}
        />

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-0">
          <div className="py-4 max-w-2xl shrink-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for customers"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Sidebar List */}
            <div className="w-120 shrink-0 h-full overflow-hidden">
              <ChatList selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
            </div>

            {/* Chat Window */}
            <div className="flex-1 min-w-0 h-full overflow-hidden">
              <ChatWindow selectedChatId={selectedChatId} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

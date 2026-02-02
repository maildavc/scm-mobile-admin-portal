"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdGridView } from "react-icons/md";
import { RiChat3Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import CustomerServicePageHeader from "@/components/Dashboard/CustomerService/CustomerServicePageHeader";

export default function CustomerService() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerServicePageHeader
        title="Customer Support"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Customer Support", href: "/dashboard/customer-service" },
          { label: "Aremu Babalola", active: true },
        ]}
      >
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Hello Ehizojie 👋</h2>
          <h2 className="text-2xl font-bold">How can we help you?</h2>
        </div>
      </CustomerServicePageHeader>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full -mt-16 pb-10">
        <div className="bg-white rounded-2xl border border-[#F4F4F5] overflow-hidden mb-8">
          {/* Options List */}
          <Link
            href="/dashboard/customer-service/new-request"
            className="flex items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <span className="font-medium text-[#2F3140]">
              New Support Request
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
              <RiChat3Line size={18} />
            </div>
          </Link>

          <Link
            href="/dashboard/customer-service/messages"
            className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <span className="font-medium text-[#2F3140]">Messages</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
              <Image src="/grid.svg" width={18} height={18} alt="grid" />
            </div>
          </Link>
        </div>

        {/* Skeleton Loaders (simulating content as per screenshot) */}
        <div className="space-y-4">
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse opacity-50"></div>
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse opacity-50"></div>
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse opacity-30 mt-8"></div>
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse opacity-30"></div>
          <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse opacity-30"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse opacity-20 mt-8"></div>
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse opacity-20"></div>
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse opacity-20"></div>
        </div>
      </div>
    </div>
  );
}

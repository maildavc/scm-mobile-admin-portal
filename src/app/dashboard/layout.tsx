"use client";

import React from "react";
import Navbar from "@/components/Dashboard/Navbar";
import { RoleProvider } from "@/context/RoleContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="flex-1 pt-18 md:pt-22">{children}</div>
      </div>
    </RoleProvider>
  );
}

"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";

type Role = "initiator" | "approver";

interface RoleContextType {
  role: Role;
  isApprover: boolean;
  isInitiator: boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

/**
 * Hook to read the current user's role.
 * The role is derived from the authenticated user in the auth store
 * (Admin === Approver, Initiator === Manager/Initiator).
 */
export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

/**
 * Provides role context derived from the backend user role stored in authStore.
 * Admin users are mapped to "approver", all others default to "initiator".
 */
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const isApprover = useAuthStore((s) => s.isApprover);
  const isInitiator = useAuthStore((s) => s.isInitiator);

  // Derive the role label from the auth store
  const role: Role = isApprover ? "approver" : "initiator";

  return (
    <RoleContext.Provider
      value={{
        role,
        isApprover,
        isInitiator,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;

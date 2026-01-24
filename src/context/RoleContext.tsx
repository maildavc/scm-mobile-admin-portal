"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "initiator" | "approver";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isApprover: boolean;
  isInitiator: boolean;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

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

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<Role>("initiator");

  const isApprover = role === "approver";
  const isInitiator = role === "initiator";

  const toggleRole = () => {
    setRole(role === "initiator" ? "approver" : "initiator");
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isApprover,
        isInitiator,
        toggleRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;

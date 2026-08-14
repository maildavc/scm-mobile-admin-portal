import { create } from "zustand";
import type { User, Organization } from "@/types/auth";

/**
 * Determine if a user role maps to the "approver" persona.
 * Backend returns "Admin" or "SystemAdmin" for approvers.
 */
const isApproverRole = (role?: string): boolean =>
  ["admin", "systemadmin", "approver"].includes(role?.toLowerCase() ?? "");

/**
 * Determine if a user role maps to the "initiator" persona.
 * Backend returns "Initiator" for initiators/managers.
 */
const isInitiatorRole = (role?: string): boolean =>
  ["initiator", "manager"].includes(role?.toLowerCase() ?? "");

export interface AuthState {
  // State
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  requiresPasswordChange: boolean;

  // Computed
  isApprover: boolean;
  isInitiator: boolean;

  // Actions
  setAuth: (params: {
    user: User;
    organization: Organization;
    requiresPasswordChange: boolean;
  }) => void;
  setPasswordChanged: () => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  isAuthenticated: false,
  requiresPasswordChange: false,
  isApprover: false,
  isInitiator: false,

  setAuth: ({ user, organization, requiresPasswordChange }) => {
    // Tokens are stored only in secure, httpOnly cookies by the API proxy.
    // Persist non-sensitive display/session context for client hydration.
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      // Safely stringify organization, using null if undefined
      localStorage.setItem("organization", JSON.stringify(organization || null));
      localStorage.setItem("requiresPasswordChange", JSON.stringify(requiresPasswordChange));
    }

    set({
      user,
      organization,
      isAuthenticated: true,
      requiresPasswordChange,
      isApprover: isApproverRole(user.role),
      isInitiator: isInitiatorRole(user.role),
    });
  },

  setPasswordChanged: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("requiresPasswordChange", "false");
    }
    set({ requiresPasswordChange: false });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("organization");
      localStorage.removeItem("requiresPasswordChange");
    }
    set({
      user: null,
      organization: null,
      isAuthenticated: false,
      requiresPasswordChange: false,
      isApprover: false,
      isInitiator: false,
    });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;

    const userStr = localStorage.getItem("user");
    const orgStr = localStorage.getItem("organization");
    const rpc = localStorage.getItem("requiresPasswordChange");

    if (userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr) as User;
        const org = orgStr && orgStr !== "undefined" ? JSON.parse(orgStr) : null;

        set({
          user,
          organization: org,
          isAuthenticated: true,
          requiresPasswordChange: rpc === "true",
          isApprover: isApproverRole(user.role),
          isInitiator: isInitiatorRole(user.role),
        });
      } catch (err) {
        console.error("Auth hydration error:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("organization");
        localStorage.removeItem("requiresPasswordChange");
      }
    }
  },
}));

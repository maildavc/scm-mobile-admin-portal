import { create } from "zustand";
import Cookies from "js-cookie";
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

interface AuthState {
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
    accessToken: string;
    refreshToken: string;
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

  setAuth: ({
    user,
    organization,
    accessToken,
    refreshToken,
    requiresPasswordChange,
  }) => {
    // Persist tokens in cookies (httpOnly in prod should be set server-side)
    Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "strict" });
    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      sameSite: "strict",
    });

    // Persist user & org in localStorage for hydration
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      // Safely stringify organization, using null if undefined
      localStorage.setItem(
        "organization",
        JSON.stringify(organization || null),
      );
      localStorage.setItem(
        "requiresPasswordChange",
        JSON.stringify(requiresPasswordChange),
      );
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
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
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

    const accessToken = Cookies.get("accessToken");
    const userStr = localStorage.getItem("user");
    const orgStr = localStorage.getItem("organization");
    const rpc = localStorage.getItem("requiresPasswordChange");

    if (accessToken && userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr) as User;
        const org =
          orgStr && orgStr !== "undefined" ? JSON.parse(orgStr) : null;

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
        // Corrupted data — reset
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("organization");
        localStorage.removeItem("requiresPasswordChange");
      }
    }
  },
}));

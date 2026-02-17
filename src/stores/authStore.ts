import { create } from "zustand";
import Cookies from "js-cookie";
import type { User, Organization } from "@/types/auth";

interface AuthState {
  // State
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  requiresPasswordChange: boolean;

  // Computed
  isApprover: boolean;

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
      localStorage.setItem("organization", JSON.stringify(organization));
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
      isApprover: user.role?.toLowerCase() === "approver",
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
    });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;

    const accessToken = Cookies.get("accessToken");
    const userStr = localStorage.getItem("user");
    const orgStr = localStorage.getItem("organization");
    const rpc = localStorage.getItem("requiresPasswordChange");

    if (accessToken && userStr && orgStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({
          user,
          organization: JSON.parse(orgStr),
          isAuthenticated: true,
          requiresPasswordChange: rpc === "true",
          isApprover: user.role?.toLowerCase() === "approver",
        });
      } catch {
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

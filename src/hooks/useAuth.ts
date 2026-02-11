import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import type { LoginRequest, ChangePasswordRequest, ApiError } from "@/types/auth";
import { AxiosError } from "axios";

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user, requiresPasswordChange, organization } = response.data;

      setAuth({
        user,
        organization,
        accessToken,
        refreshToken,
        requiresPasswordChange,
      });

      addToast("Login Successful", "success");

      // If password change is NOT required, go to dashboard
      if (!requiresPasswordChange) {
        router.push("/dashboard");
      }
      // Otherwise the component will show step 2 (change password)
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      addToast(message, "error");
    },
  });
};

export const useChangePassword = () => {
  const router = useRouter();
  const setPasswordChanged = useAuthStore((s) => s.setPasswordChanged);
  const logout = useAuthStore((s) => s.logout);
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => authService.changePassword(payload),
    onSuccess: () => {
      setPasswordChanged();
      addToast("Password changed successfully. Please login again.", "success");
      // After changing password, log the user out so they re-login with new password
      logout();
      router.push("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Password change failed. Please try again.";
      addToast(message, "error");
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import type { LoginRequest, ChangePasswordRequest, ApiError } from "@/types/auth";
import { AxiosError } from "axios";

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

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

      // If password change is NOT required, go to dashboard
      if (!requiresPasswordChange) {
        router.push("/dashboard");
      }
      // Otherwise the component will show step 2 (change password)
    },
    onError: (error: AxiosError<ApiError>) => {
      // Error is available via mutation.error
      console.error("Login failed:", error.response?.data?.message || error.message);
    },
  });
};

export const useChangePassword = () => {
  const router = useRouter();
  const setPasswordChanged = useAuthStore((s) => s.setPasswordChanged);
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => authService.changePassword(payload),
    onSuccess: () => {
      setPasswordChanged();
      // After changing password, log the user out so they re-login with new password
      logout();
      router.push("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Change password failed:", error.response?.data?.message || error.message);
    },
  });
};

import { useState } from "react";
import { useLogin, useChangePassword } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import type { ApiError } from "@/types/auth";
import { AxiosError } from "axios";

export const useOnboardingForm = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [tokenTouched, setTokenTouched] = useState(false);

  // Step 2 State
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmNewPasswordTouched, setConfirmNewPasswordTouched] =
    useState(false);

  // API mutations
  const loginMutation = useLogin();
  const changePasswordMutation = useChangePassword();
  const user = useAuthStore((s) => s.user);
  const requiresPasswordChange = useAuthStore((s) => s.requiresPasswordChange);

  // Step 1 Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && email !== "" && !isEmailValid;

  const isPasswordValid =
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*()?]/.test(password) &&
    password.length >= 6;
  const passwordError = passwordTouched && password !== "" && !isPasswordValid;

  const isTokenValid = /^\d{4}$/.test(token);
  const tokenError = tokenTouched && token !== "" && !isTokenValid;

  const isStep1Valid = isEmailValid && isPasswordValid && isTokenValid;

  // Step 2 Validation
  const hasSmallLetter = /[a-z]/.test(newPassword);
  const hasCapitalLetter = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()?]/.test(newPassword);
  const hasMinLength = newPassword.length >= 6;

  const isNewPasswordComplexityValid =
    hasSmallLetter &&
    hasCapitalLetter &&
    hasNumber &&
    hasSpecialChar &&
    hasMinLength;

  const isConfirmPasswordValid =
    confirmNewPassword === newPassword && confirmNewPassword !== "";
  const confirmPasswordError =
    confirmNewPasswordTouched && !isConfirmPasswordValid;

  const isStep2Valid = isNewPasswordComplexityValid && isConfirmPasswordValid;

  // Derive API error messages
  const getLoginError = (): string | null => {
    if (!loginMutation.error) return null;
    const err = loginMutation.error as AxiosError<ApiError>;
    return err.response?.data?.message || "Login failed. Please try again.";
  };

  const getChangePasswordError = (): string | null => {
    if (!changePasswordMutation.error) return null;
    const err = changePasswordMutation.error as AxiosError<ApiError>;
    return (
      err.response?.data?.message ||
      "Password change failed. Please try again."
    );
  };

  const handleLogin = () => {
    if (!isStep1Valid) return;

    loginMutation.mutate(
      { email, password, token },
      {
        onSuccess: (response) => {
          if (response.data.requiresPasswordChange) {
            // Move to step 2 — change password
            setStep(2);
          }
          // If no password change needed, useLogin hook handles redirect
        },
      }
    );
  };

  const handleChangePassword = () => {
    if (!isStep2Valid || !user) return;

    changePasswordMutation.mutate({
      userId: user.id,
      currentPassword: password, // password they just logged in with
      newPassword,
    });
    // useChangePassword hook handles logout + redirect on success
  };

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    token,
    setToken,
    emailTouched,
    setEmailTouched,
    passwordTouched,
    setPasswordTouched,
    tokenTouched,
    setTokenTouched,
    emailError,
    passwordError,
    tokenError,
    isStep1Valid,
    handleLogin,
    handleChangePassword,
    // Step 2 exports
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    setNewPasswordTouched,
    setConfirmNewPasswordTouched,
    confirmPasswordError,
    isStep2Valid,
    passwordCriteria: {
      hasSmallLetter,
      hasCapitalLetter,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
    },
    // API state
    isLoginLoading: loginMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    loginError: getLoginError(),
    changePasswordError: getChangePasswordError(),
  };
};

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useOnboardingForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [hasChangedPassword, setHasChangedPassword] = useState(false);

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
  const [confirmNewPasswordTouched, setConfirmNewPasswordTouched] = useState(false);

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

  const handleLogin = () => {
    if (isStep1Valid) {
      if (hasChangedPassword) {
        router.push("/dashboard");
      } else {
        setStep(2);
      }
    }
  };

  const handleChangePassword = () => {
    if (isStep2Valid) {
      // Reset form to initial state and go back to step 1
      setEmail("");
      setPassword("");
      setToken("");
      setNewPassword("");
      setConfirmNewPassword("");
      setEmailTouched(false);
      setPasswordTouched(false);
      setTokenTouched(false);
      setNewPasswordTouched(false);
      setConfirmNewPasswordTouched(false);
      
      setHasChangedPassword(true);
      setStep(1);
    }
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
  };
};

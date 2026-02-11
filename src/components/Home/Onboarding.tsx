"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { PasswordCriteriaList } from "./PasswordCriteriaList";

export default function Onboarding() {
  const {
    step,
    email,
    setEmail,
    password,
    setPassword,
    token,
    setToken,
    setEmailTouched,
    setPasswordTouched,
    setTokenTouched,
    emailError,
    passwordError,
    tokenError,
    isStep1Valid,
    handleLogin,
    handleChangePassword,
    // Step 2
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    setNewPasswordTouched,
    setConfirmNewPasswordTouched,
    confirmPasswordError,
    isStep2Valid,
    passwordCriteria,
    // API state
    isLoginLoading,
    isChangePasswordLoading,
  } = useOnboardingForm();

  const isLoading = step === 1 ? isLoginLoading : isChangePasswordLoading;

  return (
    <div className="min-h-screen w-full flex bg-[#0F0F0F] text-white overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[80%] flex flex-col justify-between p-8 md:p-12 z-10">
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/scmLogo.svg"
              alt="SCM Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome to SCM Admin</h1>
            <p className="text-[#6E6D7A] font-bold text-2xl">
              {step === 1 ? "Enter your credentials" : "Change your password"}
            </p>
          </div>

          <form
            className="w-full flex flex-col gap-6 border-t border-[#2A2C2F] pt-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) {
                handleLogin();
              } else {
                handleChangePassword();
              }
            }}
          >
            {step === 1 ? (
              <>
                <Input
                  label="Email Address"
                  placeholder="Enter Email Address"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  error={emailError}
                  disabled={isLoading}
                />

                <Input
                  label="Password"
                  placeholder="Enter Password"
                  required
                  isPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  error={passwordError}
                  disabled={isLoading}
                />

                <Input
                  label="Token"
                  placeholder="0000"
                  isPassword
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onBlur={() => setTokenTouched(true)}
                  error={tokenError}
                  disabled={isLoading}
                />
              </>
            ) : (
              <>
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  required
                  isPassword
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => setNewPasswordTouched(true)}
                  disabled={isLoading}
                />

                <Input
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  required
                  isPassword
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onBlur={() => setConfirmNewPasswordTouched(true)}
                  error={confirmPasswordError}
                  disabled={isLoading}
                />

                <PasswordCriteriaList criteria={passwordCriteria} />
              </>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                text={
                  isLoading
                    ? step === 1
                      ? "Logging in..."
                      : "Changing Password..."
                    : step === 1
                    ? "Login"
                    : "Change Password"
                }
                disabled={
                  isLoading || (step === 1 ? !isStep1Valid : !isStep2Valid)
                }
              />
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-[#6E6D7A]">
          © SCM Capital 2026
        </div>
      </div>

      {/* Right Side - Image/Background */}
      <div className="hidden lg:block w-[30%] relative">
        <Image
          src="/onboardRedbg.svg"
          alt="Background Pattern"
          fill
          className="object-cover z-0"
          priority
        />
        <Image
          src="/onboardImg.svg"
          alt="Onboarding Image"
          fill
          className="object-cover z-10 mix-blend-overlay"
          priority
        />
      </div>
    </div>
  );
}

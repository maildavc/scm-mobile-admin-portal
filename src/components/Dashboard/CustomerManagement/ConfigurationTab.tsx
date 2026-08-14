"use client";

import React, { useState } from "react";
import { CONFIG_OPTIONS } from "@/constants/customerManagement/customerManagement";

interface ConfigurationTabProps {
  onDeactivate?: () => void | Promise<void>;
  onResetPassword?: () => void | Promise<void>;
}

type ActionKey = "password" | "deactivate";

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({
  onDeactivate,
  onResetPassword,
}) => {
  const [pendingAction, setPendingAction] = useState<ActionKey | null>(null);

  const runAction = async (key: ActionKey, handler?: () => void | Promise<void>) => {
    if (!handler || pendingAction) return;
    setPendingAction(key);
    try {
      await handler();
    } catch {
      // Parent handlers own toast success/error messaging.
    } finally {
      setPendingAction(null);
    }
  };

  const configOptions = CONFIG_OPTIONS.map((option) => {
    const handlers: Record<ActionKey, (() => void | Promise<void>) | undefined> = {
      password: onResetPassword,
      deactivate: onDeactivate,
    };
    return {
      ...option,
      onClick: () => runAction(option.key, handlers[option.key]),
      isLoading: pendingAction === option.key,
      disabled: pendingAction !== null,
    };
  });

  return (
    <div className="border border-gray-200 rounded-xl p-6 max-w-3xl min-h-120 flex flex-col">
      <h3 className="text-base font-semibold text-[#2F3140] mb-6">Reset</h3>

      <div className="mt-4">
        <div className="space-y-6">
          {configOptions.map((option, index) => (
            <ConfigRow
              key={option.key}
              title={option.title}
              description={option.description}
              buttonText={option.isLoading ? "Please wait..." : option.buttonText}
              onClick={option.onClick}
              disabled={option.disabled}
              isLast={index === configOptions.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ConfigRow = ({
  title,
  description,
  buttonText,
  onClick,
  disabled,
  isLast,
}: {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
  isLast: boolean;
}) => (
  <div
    className={`flex items-start justify-between gap-4 pb-6 ${!isLast ? "border-b border-gray-200" : "border-b border-gray-200"}`}
  >
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-[#2F3140] mb-1">{title}</h4>
      <p className="text-sm text-[#707781]">{description}</p>
    </div>
    <button
      type="button"
      className="px-6 py-2.5 bg-[#F4F4F5] text-[#2F3140] text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  </div>
);

export default ConfigurationTab;

"use client";

import React from "react";
import { FiFile } from "react-icons/fi";
import Button from "@/components/Button";

interface ActionButtonProps {
  onClick?: () => void;
  label: string;
  actionText: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  actionText,
}) => {
  return (
    <div className="flex items-center gap-4 px-3 py-4 bg-white border border-gray-100 rounded-2xl">
      <div className="flex items-center justify-center w-12 h-12 bg-[#F4F4F5] rounded-full">
        <FiFile size={20} color="#2F3140" />
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm text-[#707781] font-medium">{label}</span>
        <Button
          onClick={onClick}
          text={actionText}
          variant="outline"
          className="py-1.5! px-2! w-auto! rounded-lg! text-[#B2171E]! font-bold text-sm"
        />
      </div>
    </div>
  );
};

export default ActionButton;

"use client";

import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: boolean;
  required?: boolean;
  theme?: "dark" | "light"; // dark for login (default), light for dashboard
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  required,
  error,
  className,
  theme = "dark",
  ...props
}) => {
  const isLight = theme === "light";

  const borderColor = error
    ? "border-red-500"
    : isLight
      ? "border-gray-200"
      : "border-white/10";

  const bgColor = isLight ? "bg-white" : "bg-transparent";
  const textColor = isLight ? "text-[#2F3140]" : "text-white";
  const placeholderColor = "placeholder:text-[#707781]";

  return (
    <div
      className={`relative w-full border rounded-xl px-4 py-3 transition-colors ${bgColor} ${borderColor} ${className}`}
    >
      <div className="flex flex-col gap-0.5">
        <label className="text-xs font-semibold text-[#707781]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          {...props}
          className={`w-full bg-transparent text-sm ${textColor} focus:outline-none ${placeholderColor} font-medium resize-none min-h-24`}
        />
      </div>
    </div>
  );
};

export default TextArea;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiEye, FiEyeOff, FiChevronDown, FiCalendar, FiClock } from "react-icons/fi";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import {
  DEFAULT_MAX_LENGTH,
  InputKind,
  inferInputKind,
  sanitizeByKind,
  todayIsoDate,
} from "@/utils/formValidation";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  isPassword?: boolean;
  error?: boolean;
  errorMessage?: string;
  theme?: "dark" | "light";
  type?: React.HTMLInputTypeAttribute | "select" | "file";
  options?: { value: string; label: string | React.ReactNode }[];
  rightIcon?: React.ReactNode;
  onFileChange?: (file: File | null) => void;
  minDate?: string;
  maxDate?: string;
  /** When true, past dates are allowed (e.g. Date of Birth). */
  allowPastDates?: boolean;
  /** Controls character filtering / format rules. Inferred from label/type when omitted. */
  inputKind?: InputKind;
}

const Input: React.FC<InputProps> = ({
  label,
  isPassword,
  required,
  error,
  errorMessage,
  className,
  theme = "dark",
  type = "text",
  options,
  rightIcon,
  onFileChange,
  minDate,
  maxDate,
  allowPastDates = false,
  inputKind,
  maxLength,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(props.defaultValue || "");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedKind =
    inputKind ||
    (isPassword ? "password" : inferInputKind(label, typeof type === "string" ? type : undefined));
  const resolvedMaxLength = maxLength ?? DEFAULT_MAX_LENGTH[resolvedKind];
  const effectiveMinDate = minDate ?? (allowPastDates ? undefined : todayIsoDate());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCalendarOpen(false);
        setIsTimePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const isLight = theme === "light";
  const borderColor = error ? "border-red-500" : isLight ? "border-gray-200" : "border-white/10";
  const bgColor = isLight ? "bg-white" : "bg-transparent";
  const textColor = isLight ? "text-[#2F3140]" : "text-white";
  const placeholderColor = "placeholder:text-[#707781]";

  const currentValue = props.value !== undefined ? props.value : internalValue;
  const selectedOption = options?.find((opt) => opt.value === props.value);

  const emitChange = (value: string, name?: string) => {
    const event = {
      target: { value, name: name || props.name },
      currentTarget: { value, name: name || props.name },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };

  const handleSelect = (value: string) => {
    setInternalValue(value);
    setIsOpen(false);
    emitChange(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeByKind(resolvedKind, e.target.value, resolvedMaxLength);
    setInternalValue(sanitized);
    emitChange(sanitized, e.target.name);
  };

  const handleDateSelect = (dateString: string) => {
    emitChange(dateString);
  };

  const handleTimeSelect = (timeString: string) => {
    emitChange(timeString);
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFileName(file.name);
      onFileChange?.(file);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`relative w-full border rounded-xl px-4 py-3 transition-colors ${bgColor} ${borderColor} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        ref={dropdownRef}
      >
        <div className="flex flex-col gap-0.5 pr-8">
          <label className="text-xs font-semibold text-[#707781] mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          {type === "select" ? (
            <>
              <div
                className={`w-full bg-transparent text-sm ${selectedOption ? textColor : "text-[#707781]"} focus:outline-none font-medium cursor-pointer`}
                onClick={() => !props.disabled && setIsOpen(!isOpen)}
              >
                {selectedOption ? selectedOption.label : props.placeholder || "Select Option"}
              </div>

              {isOpen && !props.disabled && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-auto">
                  {options?.map((opt) => (
                    <div
                      key={opt.value}
                      className={`px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer text-[#2F3140] transition-colors ${currentValue === opt.value ? "bg-gray-50 font-medium" : ""}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : type === "file" ? (
            <>
              <div
                className={`w-full bg-transparent text-sm ${selectedFileName ? textColor : "text-[#707781]"} focus:outline-none font-medium cursor-pointer`}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFileName || props.placeholder || "Upload Image"}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label={label}
              />
            </>
          ) : type === "date" ? (
            <>
              <div
                className={`w-full bg-transparent text-sm ${props.value ? textColor : "text-[#707781]"} focus:outline-none font-medium cursor-pointer`}
                onClick={() => !props.disabled && setIsCalendarOpen(!isCalendarOpen)}
              >
                {props.value
                  ? formatDisplayDate(String(props.value))
                  : props.placeholder || "DD/MM/YYYY"}
              </div>
              {isCalendarOpen && !props.disabled && (
                <Calendar
                  selectedDate={String(props.value || "")}
                  onDateSelect={handleDateSelect}
                  onClose={() => setIsCalendarOpen(false)}
                  minDate={effectiveMinDate}
                  maxDate={maxDate}
                />
              )}
            </>
          ) : type === "time" ? (
            <>
              <div
                className={`w-full bg-transparent text-sm ${props.value ? textColor : "text-[#707781]"} focus:outline-none font-medium cursor-pointer`}
                onClick={() => !props.disabled && setIsTimePickerOpen(!isTimePickerOpen)}
              >
                {props.value ? String(props.value) : props.placeholder || "00:00 AM"}
              </div>
              {isTimePickerOpen && !props.disabled && (
                <TimePicker
                  selectedTime={String(props.value || "")}
                  onTimeSelect={handleTimeSelect}
                  onClose={() => setIsTimePickerOpen(false)}
                />
              )}
            </>
          ) : (
            <input
              {...props}
              type={inputType === "email" || inputType === "url" ? "text" : inputType}
              inputMode={
                resolvedKind === "number" || resolvedKind === "percentage"
                  ? "decimal"
                  : resolvedKind === "phone"
                    ? "tel"
                    : resolvedKind === "email"
                      ? "email"
                      : "text"
              }
              maxLength={resolvedMaxLength}
              className={`w-full bg-transparent text-sm ${textColor} focus:outline-none ${placeholderColor} font-medium`}
              onChange={handleTextChange}
            />
          )}
        </div>

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        ) : type === "file" ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none cursor-pointer transition-colors"
          >
            {rightIcon}
          </button>
        ) : type === "select" ? (
          <button
            type="button"
            onClick={() => !props.disabled && setIsOpen(!isOpen)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none cursor-pointer transition-all duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-label="Toggle dropdown"
          >
            <FiChevronDown size={18} />
          </button>
        ) : type === "date" ? (
          <button
            type="button"
            aria-label="Open date picker"
            onClick={() => !props.disabled && setIsCalendarOpen(!isCalendarOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none cursor-pointer"
          >
            <FiCalendar size={18} />
          </button>
        ) : type === "time" ? (
          <button
            type="button"
            aria-label="Open time picker"
            onClick={() => !props.disabled && setIsTimePickerOpen(!isTimePickerOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none cursor-pointer"
          >
            <FiClock size={18} />
          </button>
        ) : rightIcon ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781]">
            {rightIcon}
          </div>
        ) : null}
      </div>
      {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default Input;

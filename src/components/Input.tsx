"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  isPassword?: boolean;
  error?: boolean;
  theme?: "dark" | "light"; // dark for login (default), light for dashboard
  type?: React.HTMLInputTypeAttribute | "select" | "file";
  options?: { value: string; label: string | React.ReactNode }[];
  rightIcon?: React.ReactNode;
  onFileChange?: (file: File | null) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  isPassword,
  required,
  error,
  className,
  theme = "dark",
  type = "text",
  options,
  rightIcon,
  onFileChange,
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
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsCalendarOpen(false);
      setIsTimePickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const isLight = theme === "light";

  const borderColor = error
    ? "border-red-500"
    : isLight
      ? "border-gray-200"
      : "border-white/10";

  const bgColor = isLight ? "bg-white" : "bg-transparent";
  const textColor = isLight ? "text-[#2F3140]" : "text-white";
  const placeholderColor = "placeholder:text-[#707781]";

  // Handle select value
  const currentValue = props.value !== undefined ? props.value : internalValue;
  const selectedOption = options?.find((opt) => opt.value === props.value);

  const handleSelect = (value: string) => {
    setInternalValue(value);
    setIsOpen(false);
    if (props.onChange) {
      // Create synthetic event for compatibility
      const event = {
        target: { value, name: props.name },
        currentTarget: { value, name: props.name },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDateClick = () => {
    if (!props.disabled) {
      setIsCalendarOpen(!isCalendarOpen);
    }
  };

  const handleDateSelect = (dateString: string) => {
    if (props.onChange) {
      const event = {
        target: { value: dateString, name: props.name },
        currentTarget: { value: dateString, name: props.name },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleTimeClick = () => {
    if (!props.disabled) {
      setIsTimePickerOpen(!isTimePickerOpen);
    }
  };

  const handleTimeSelect = (timeString: string) => {
    if (props.onChange) {
      const event = {
        target: { value: timeString, name: props.name },
        currentTarget: { value: timeString, name: props.name },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFileName(file.name);
      onFileChange?.(file);
    }
  };

  return (
    <div
      className={`relative w-full border rounded-xl px-4 py-3 transition-colors ${bgColor} ${borderColor} ${className}`}
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
              {selectedOption
                ? selectedOption.label
                : props.placeholder || "Select Option"}
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
              onClick={handleFileClick}
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
              onClick={handleDateClick}
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
              />
            )}
          </>
        ) : type === "time" ? (
          <>
            <div
              className={`w-full bg-transparent text-sm ${props.value ? textColor : "text-[#707781]"} focus:outline-none font-medium cursor-pointer`}
              onClick={handleTimeClick}
            >
              {props.value
                ? String(props.value)
                : props.placeholder || "00:00 AM"}
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
            type={inputType}
            className={`w-full bg-transparent text-sm ${textColor} focus:outline-none ${placeholderColor} font-medium`}
          />
        )}
      </div>

      {isPassword ? (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      ) : type === "file" ? (
        <button
          type="button"
          onClick={handleFileClick}
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
          onClick={handleDateClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707781] focus:outline-none cursor-pointer"
        >
          <FiCalendar size={18} />
        </button>
      ) : type === "time" ? (
        <button
          type="button"
          aria-label="Open time picker"
          onClick={handleTimeClick}
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
  );
};

export default Input;

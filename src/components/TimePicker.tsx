"use client";

import React, { useState, useRef, useEffect } from "react";

interface TimePickerProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onTimeSelect,
  onClose,
}) => {
  const parseTime = (timeString?: string): { hour: number; minute: number; period: "AM" | "PM" } => {
    if (!timeString) {
      const now = new Date();
      const hour = now.getHours();
      return {
        hour: hour === 0 ? 12 : hour > 12 ? hour - 12 : hour,
        minute: now.getMinutes(),
        period: hour >= 12 ? "PM" : "AM",
      };
    }
    
    const [time, period] = timeString.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    return {
      hour: parseInt(hourStr),
      minute: parseInt(minuteStr),
      period: (period as "AM" | "PM") || "AM",
    };
  };

  const parsed = parseTime(selectedTime);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(parsed.period);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, 15, ... 55

  useEffect(() => {
    // Scroll to selected hour
    if (hourRef.current) {
      const selectedElement = hourRef.current.querySelector(`[data-hour="${selectedHour}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center" });
      }
    }
  }, []);

  useEffect(() => {
    // Scroll to selected minute
    if (minuteRef.current) {
      const selectedElement = minuteRef.current.querySelector(`[data-minute="${selectedMinute}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center" });
      }
    }
  }, []);

  const formatTime = (hour: number, minute: number, period: "AM" | "PM"): string => {
    const hourStr = String(hour).padStart(2, "0");
    const minuteStr = String(minute).padStart(2, "0");
    return `${hourStr}:${minuteStr} ${period}`;
  };

  const handleDone = () => {
    const timeString = formatTime(selectedHour, selectedMinute, selectedPeriod);
    onTimeSelect(timeString);
    onClose();
  };

  return (
    <div className="absolute left-0 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] p-3 w-56">
      {/* Time Selection */}
      <div className="flex gap-2 mb-3">
        {/* Hours */}
        <div className="flex-1">
          <div
            ref={hourRef}
            className="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
          >
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                data-hour={hour}
                onClick={() => setSelectedHour(hour)}
                className={`w-full py-2 text-sm font-medium transition-colors rounded ${
                  selectedHour === hour
                    ? "bg-[#B2171E] text-white"
                    : "text-[#2F3140] hover:bg-gray-100"
                }`}
              >
                {String(hour).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes */}
        <div className="flex-1">
          <div
            ref={minuteRef}
            className="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
          >
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                data-minute={minute}
                onClick={() => setSelectedMinute(minute)}
                className={`w-full py-2 text-sm font-medium transition-colors rounded ${
                  selectedMinute === minute
                    ? "bg-[#B2171E] text-white"
                    : "text-[#2F3140] hover:bg-gray-100"
                }`}
              >
                {String(minute).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* AM/PM */}
        <div className="w-14 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSelectedPeriod("AM")}
            className={`py-2 text-xs font-medium rounded transition-colors ${
              selectedPeriod === "AM"
                ? "bg-[#B2171E] text-white"
                : "text-[#2F3140] hover:bg-gray-100"
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => setSelectedPeriod("PM")}
            className={`py-2 text-xs font-medium rounded transition-colors ${
              selectedPeriod === "PM"
                ? "bg-[#B2171E] text-white"
                : "text-[#2F3140] hover:bg-gray-100"
            }`}
          >
            PM
          </button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 text-sm font-medium text-[#2F3140] hover:text-[#B2171E] transition-colors"
        >
          CANCEL
        </button>
        <button
          type="button"
          onClick={handleDone}
          className="flex-1 py-2 text-sm font-medium text-[#B2171E] hover:text-[#9a1419] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default TimePicker;

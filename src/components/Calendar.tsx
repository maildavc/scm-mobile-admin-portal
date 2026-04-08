"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
}) => {
  const parseDate = (dateString?: string): Date => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? parseDate(selectedDate) : new Date()
  );
  const [showYearPicker, setShowYearPicker] = useState(false);

  const currentYear = currentMonth.getFullYear();
  const startYear = 1900;
  const endYear = new Date().getFullYear() + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const yearGridRef = useRef<HTMLDivElement>(null);

  // Scroll the selected year into view when the picker opens
  useEffect(() => {
    if (showYearPicker && yearGridRef.current) {
      const selectedBtn = yearGridRef.current.querySelector(
        "[data-selected-year='true']"
      ) as HTMLElement | null;
      selectedBtn?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [showYearPicker]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number): string => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const handleDateClick = (day: number) => {
    const dateString = formatDate(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onDateSelect(dateString);
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: React.ReactElement[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Actual days
    const selectedDateObj = selectedDate ? parseDate(selectedDate) : null;
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDateObj &&
        selectedDateObj.getDate() === day &&
        selectedDateObj.getMonth() === currentMonth.getMonth() &&
        selectedDateObj.getFullYear() === currentMonth.getFullYear();

      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
            isSelected
              ? "bg-[#B2171E] text-white hover:bg-[#9a1419]"
              : isToday
                ? "bg-gray-100 text-[#2F3140] hover:bg-gray-200"
                : "text-[#2F3140] hover:bg-gray-50"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="absolute left-0 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Previous month"
        >
          <FiChevronLeft size={20} className="text-[#2F3140]" />
        </button>

        {/* Month + clickable Year */}
        <div className="flex items-center gap-1 text-sm font-semibold text-[#2F3140]">
          <span>{monthNames[currentMonth.getMonth()]}</span>
          <button
            type="button"
            onClick={() => setShowYearPicker((v) => !v)}
            className="px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B2171E] focus:ring-offset-1"
            aria-label="Select year"
            title="Click to choose a year"
          >
            {currentYear}
            <span className="ml-0.5 text-[10px] text-[#707781]">▾</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Next month"
        >
          <FiChevronRight size={20} className="text-[#2F3140]" />
        </button>
      </div>

      {/* Year Picker */}
      {showYearPicker && (
        <div
          ref={yearGridRef}
          className="mb-4 max-h-24 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="grid grid-cols-4 gap-1">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                data-selected-year={year === currentYear ? "true" : undefined}
                onClick={() => handleYearSelect(year)}
                className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
                  year === currentYear
                    ? "bg-[#B2171E] text-white"
                    : "text-[#2F3140] hover:bg-gray-200"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-9 w-9 flex items-center justify-center text-xs font-semibold text-[#707781]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
};

export default Calendar;

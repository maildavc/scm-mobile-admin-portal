"use client";

import React, { useEffect, useState } from "react";
import { useToastStore } from "@/stores/toastStore";

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 left-[35%] -translate-x-1/2 z-9999 flex flex-col items-center gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onDismiss: (id: string) => void;
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit animation before store removes toast
    const exitDelay = type === "error" ? 14600 : 8600;
    const timer = setTimeout(() => setExiting(true), exitDelay);
    return () => clearTimeout(timer);
  }, [type]);

  const textColor =
    type === "success"
      ? "text-[#29C680]"
      : type === "error"
        ? "text-[#FFC6C5]"
        : "";

  return (
    <div
      onClick={() => onDismiss(id)}
      className={`pointer-events-auto cursor-pointer px-8 py-4 rounded-2xl bg-[#202023] text-sm font-medium text-center transition-all duration-300 ease-out ${textColor} ${
        exiting ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      {message}
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-[#2F3140]">Something went wrong</h1>
        <p className="mt-3 text-sm text-[#707781]">
          The error has been recorded. Retry the request, or contact support with reference{" "}
          {error.digest || "unavailable"} if it continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-[#B2171E] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

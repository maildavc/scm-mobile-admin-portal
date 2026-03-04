"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

/**
 * AuthProvider – restores authentication state from cookies/localStorage
 * on app mount (page refresh). Must wrap the app in the root layout.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

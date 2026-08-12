import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const createToastStore = () =>
  create<ToastState>((set) => ({
    toasts: [],

    addToast: (message, type) => {
      const id = crypto.randomUUID();
      set((state) => ({
        toasts: [...state.toasts, { id, message, type }],
      }));

      // Auto-dismiss: error toasts last 2 seconds, others 9 seconds
      const duration = type === "error" ? 2000 : 9000;
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    },

    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },
  }));

// Guard against duplicate Zustand instances across Next.js client chunks
// (otherwise addToast updates one store while <Toast /> reads another).
const globalForToast = globalThis as typeof globalThis & {
  __scmToastStore?: ReturnType<typeof createToastStore>;
};

export const useToastStore = globalForToast.__scmToastStore ?? createToastStore();
globalForToast.__scmToastStore = useToastStore;

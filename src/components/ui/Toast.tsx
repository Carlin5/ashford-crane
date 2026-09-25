"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastItem = {
  id: number;
  message: string;
  tone: "info" | "success" | "danger";
};

const ToastContext = createContext<(message: string, tone?: ToastItem["tone"]) => void>(
  () => {},
);

export function useToast() {
  return useContext(ToastContext);
}

const toneClass: Record<ToastItem["tone"], string> = {
  info: "border-info-600/40",
  success: "border-success-600/40",
  danger: "border-danger-600/40",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: ToastItem["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 end-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg border bg-white px-4 py-3 text-sm shadow-popover dark:bg-charcoal-900 ${toneClass[t.tone]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onClose();
    el.addEventListener("close", handler);
    return () => el.removeEventListener("close", handler);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="rounded-[var(--radius-card)] border border-platinum-200 bg-white p-6 shadow-modal backdrop:bg-navy-900/50 dark:border-navy-700 dark:bg-charcoal-900"
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <h2 className="font-display text-xl font-medium">{title}</h2>
      <div className="mt-3">{children}</div>
    </dialog>
  );
}

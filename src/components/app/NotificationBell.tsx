"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

type N = { id: string; kind: string; text: string; read: boolean; createdAt: number };

/** Header bell listing in-store notifications (spec Section 25). */
export function NotificationBell() {
  const [items, setItems] = useState<N[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/v1/notifications")
      .then((r) => (r.ok ? r.json() : { notifications: [] }))
      .then((d) => {
        if (live) setItems(d.notifications ?? []);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const unread = items.filter((n) => !n.read).length;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-charcoal-500 hover:bg-platinum-100 dark:text-platinum-200 dark:hover:bg-navy-700"
      >
        <Bell size={18} aria-hidden />
        {unread > 0 ? (
          <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne-500 px-1 text-[10px] font-semibold text-navy-900">
            {unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-30 mt-2 w-80 rounded-xl border border-platinum-200 bg-white shadow-lg dark:border-navy-700 dark:bg-navy-900">
          <p className="border-b border-platinum-200 px-4 py-3 text-sm font-semibold dark:border-navy-700">
            Notifications
          </p>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-charcoal-500 dark:text-platinum-200">
                No notifications yet.
              </p>
            ) : (
              items.slice(0, 15).map((n) => (
                <div
                  key={n.id}
                  className="border-b border-platinum-200/60 px-4 py-3 last:border-0 dark:border-navy-700/60"
                >
                  <p className="text-sm">{n.text}</p>
                  <p className="mt-0.5 text-xs text-charcoal-500 dark:text-platinum-200">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

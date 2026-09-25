"use client";

import { useState, type ReactNode } from "react";

type Tab = { id: string; label: string; content: ReactNode };

export function Tabs({ tabs, initialId }: { tabs: Tab[]; initialId?: string }) {
  const [active, setActive] = useState(initialId ?? tabs[0]?.id);
  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-platinum-200 dark:border-navy-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            onClick={() => setActive(tab.id)}
            className={`relative px-4 py-2.5 text-sm transition-colors ${
              tab.id === active
                ? "font-medium text-charcoal-900 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-champagne-500 dark:text-platinum-100"
                : "text-charcoal-500 hover:text-charcoal-900 dark:text-platinum-200 dark:hover:text-platinum-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={tab.id !== active}
          className="pt-6"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

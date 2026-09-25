"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, MessageSquare, ClipboardList, LogOut } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/rm", label: "Clients", icon: Users },
  { href: "/rm/messages", label: "Messages", icon: MessageSquare },
  { href: "/rm/requests", label: "Service requests", icon: ClipboardList },
];

/** RM portal shell: assigned clients only, no fund-moving actions. */
export function RmShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/rm" ? pathname === "/rm" : pathname.startsWith(href);
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-e border-navy-700 bg-navy-900 text-platinum-200 lg:flex">
        <div className="border-b border-navy-700 px-5 py-5">
          <Link href="/" className="font-display text-lg font-medium text-white">
            Ashford &amp; Crane
          </Link>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-champagne-500">
            Relationship manager
          </p>
        </div>
        <nav aria-label="RM" className="flex-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active(item.href) ? "page" : undefined}
                className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active(item.href)
                    ? "bg-navy-700 text-white"
                    : "text-platinum-200 hover:bg-navy-700/60 hover:text-white"
                }`}
              >
                <Icon size={16} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-navy-700 p-4 pb-12">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="truncate text-xs">{email}</p>
          <Link
            href="/logout"
            className="mt-3 flex items-center gap-2 text-xs hover:text-white"
          >
            <LogOut size={14} aria-hidden /> Sign out
          </Link>
        </div>
      </aside>
      <div className="flex-1 border-[3px] border-dashed border-champagne-500/60 bg-white dark:bg-charcoal-950">
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

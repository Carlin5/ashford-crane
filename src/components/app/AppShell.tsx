"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  Landmark,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  ShieldCheck,
  Users,
  Wallet,
  HelpCircle,
  Receipt,
  Banknote,
  LogOut,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { NotificationBell } from "./NotificationBell";

const NAV = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/accounts", label: "Accounts", icon: Wallet },
  { href: "/app/cards", label: "Cards", icon: CreditCard },
  { href: "/app/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/app/beneficiaries", label: "Beneficiaries", icon: Users },
  { href: "/app/transactions", label: "Transactions", icon: Receipt },
  { href: "/app/fx", label: "FX", icon: Banknote },
  { href: "/app/statements", label: "Statements", icon: FileText },
  { href: "/app/payments", label: "Payments", icon: Landmark },
  { href: "/app/documents", label: "Documents", icon: FileText },
  { href: "/app/wealth", label: "Wealth", icon: PieChart },
  { href: "/app/messages", label: "Messages", icon: MessageSquare },
  { href: "/app/security", label: "Security", icon: ShieldCheck },
  { href: "/app/profile", label: "Profile", icon: UserRound },
  { href: "/app/support", label: "Support", icon: HelpCircle },
];

/**
 * Authenticated shell. The dashed champagne border marks this as the demo
 * sandbox so it can never be mistaken for a production dashboard.
 */
export function AppShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-e border-navy-700 bg-navy-900 text-platinum-200 lg:flex">
        <Link
          href="/"
          className="border-b border-navy-700 px-5 py-5 font-display text-lg font-medium text-white"
        >
          Ashford &amp; Crane
        </Link>
        <nav aria-label="App" className="flex-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
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
        <MobileNav pathname={pathname} />
        <div className="flex justify-end px-6 pt-4">
          <NotificationBell />
        </div>
        <main className="mx-auto max-w-5xl px-6 pb-8 pt-2">{children}</main>
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <div className="border-b border-platinum-200 bg-navy-900 p-3 lg:hidden dark:border-navy-700">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display font-medium text-white">
          A&amp;C
        </Link>
        <Link href="/logout" className="text-xs text-platinum-200">
          Sign out
        </Link>
      </div>
      <nav aria-label="App" className="mt-2 flex gap-1 overflow-x-auto pb-1">
        {NAV.map((item) => {
          const active =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${
                active
                  ? "bg-navy-700 text-white"
                  : "text-platinum-200 hover:bg-navy-700/60"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

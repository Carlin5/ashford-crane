"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Building2,
  Wallet,
  Receipt,
  CreditCard,
  ArrowLeftRight,
  AlertTriangle,
  FolderOpen,
  HelpCircle,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/kyc", label: "KYC", icon: ShieldCheck },
  { href: "/admin/kyb", label: "KYB", icon: Building2 },
  { href: "/admin/accounts", label: "Accounts", icon: Wallet },
  { href: "/admin/transactions", label: "Transactions", icon: Receipt },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/admin/compliance/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/admin/compliance/cases", label: "Cases", icon: FolderOpen },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/support", label: "Support", icon: HelpCircle },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

/** Staff portal shell. Each page additionally enforces its own RBAC check. */
export function AdminShell({
  name,
  email,
  role,
  children,
}: {
  name: string;
  email: string;
  role: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-e border-navy-700 bg-navy-900 text-platinum-200 lg:flex">
        <div className="border-b border-navy-700 px-5 py-5">
          <Link href="/" className="font-display text-lg font-medium text-white">
            Ashford &amp; Crane
          </Link>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-champagne-500">
            Admin
          </p>
        </div>
        <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
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
          <p className="mt-1 truncate text-xs text-champagne-500">{role.replaceAll("_", " ")}</p>
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
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <div className="border-b border-platinum-200 bg-navy-900 p-3 lg:hidden dark:border-navy-700">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="font-display font-medium text-white">
          A&amp;C Admin
        </Link>
        <Link href="/logout" className="text-xs text-platinum-200">
          Sign out
        </Link>
      </div>
      <nav aria-label="Admin" className="mt-2 flex gap-1 overflow-x-auto pb-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${
              active(item.href)
                ? "bg-navy-700 text-white"
                : "text-platinum-200 hover:bg-navy-700/60"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

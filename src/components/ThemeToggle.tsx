"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const COOKIE = "ac_theme";

function currentTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

/**
 * Manual dark-mode override stored in a cookie; absent the cookie the site
 * follows prefers-color-scheme (handled by an inline script in the layout).
 */
export function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={mounted ? theme === "dark" : undefined}
      className="rounded-lg p-2 text-platinum-200 transition-colors hover:bg-navy-700"
    >
      {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

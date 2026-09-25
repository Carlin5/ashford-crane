import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { DemoBanner } from "@/components/DemoBanner";
import { getDirection } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { isDemoEnvironment } from "@/lib/compliance";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ashfordcrane.example"),
  title: {
    default: "Ashford & Crane Private Bank",
    template: "%s — Ashford & Crane",
  },
  description:
    "International private-banking and wealth-management technology platform for clients operating across borders.",
};

// Applies the stored theme override before paint; falls back to the OS.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )ac_theme=(light|dark)/);var t=m?m[1]:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {isDemoEnvironment() ? <DemoBanner /> : null}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

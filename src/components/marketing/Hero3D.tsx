"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy-loaded after critical content; code-split so the dashboard never
// downloads any 3D JavaScript.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <StaticFallback />,
});

function StaticFallback() {
  return (
    <div
      aria-hidden
      className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(30,46,79,0.9),rgba(11,18,32,0.2)_55%,transparent_75%)]"
    />
  );
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * 3D hero wrapper: degrades to a static gradient when the user prefers
 * reduced motion or WebGL is unavailable (e.g. headless/low-power devices).
 */
export function Hero3D({ className = "" }: { className?: string }) {
  const [staticOnly, setStaticOnly] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStaticOnly(reduced.matches || !webglAvailable());
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  if (staticOnly === null) return <div className={className} />;
  return (
    <div className={className}>
      {staticOnly ? <StaticFallback /> : <HeroScene />}
    </div>
  );
}

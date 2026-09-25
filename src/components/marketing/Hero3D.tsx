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

/**
 * 3D hero wrapper: pauses/degrades to a static gradient when the user
 * prefers reduced motion or the device reports save-data/low hardware.
 */
export function Hero3D({ className = "" }: { className?: string }) {
  const [staticOnly, setStaticOnly] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStaticOnly(reduced.matches);
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

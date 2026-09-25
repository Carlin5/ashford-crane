"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_GLIDE } from "./easing";

/**
 * Page transition: 200–280ms crossfade with an 8–12px vertical settle.
 * Disabled entirely under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE_GLIDE as unknown as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reduced-motion aware provider: framer respects the user's
 * prefers-reduced-motion setting, and CountUp snaps instead of tweening.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
